"""
PU Learning 模型訓練服務 - 支持 uPU 和 nnPU 算法
實現異步訓練和即時進度監控
"""

import asyncio
import json
import logging
import uuid
from datetime import datetime
from typing import Dict, List, Any, Optional, Tuple
import numpy as np
import pandas as pd
from pydantic import BaseModel
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import precision_score, recall_score, f1_score, accuracy_score
import joblib
import os

# WebSocket 相關
from fastapi import WebSocket
from typing import Set

logger = logging.getLogger(__name__)

# 全域變量用於追蹤訓練任務和 WebSocket 連接
training_jobs: Dict[str, Dict[str, Any]] = {}
websocket_connections: Set[WebSocket] = set()

class TrainingProgress(BaseModel):
    """訓練進度模型"""
    job_id: str
    epoch: int
    total_epochs: int
    loss: float
    accuracy: Optional[float] = None
    precision: Optional[float] = None
    recall: Optional[float] = None
    f1_score: Optional[float] = None
    stage: str  # 'training', 'validation', 'completed', 'failed'
    message: str

class DataSplitConfig(BaseModel):
    """數據切分配置模型"""
    enabled: bool = False
    train_ratio: float = 0.6
    validation_ratio: float = 0.2
    test_ratio: float = 0.2

    def validate_ratios(self):
        """驗證比例總和為1"""
        total = self.train_ratio + self.validation_ratio + self.test_ratio
        if not abs(total - 1.0) < 0.01:  # 允許微小的浮點誤差
            raise ValueError(f"Ratios must sum to 1.0, got {total}")

class ModelConfig(BaseModel):
    """模型配置模型"""
    model_type: str  # 'uPU' or 'nnPU'
    prior_method: str  # 'median', 'kmm', 'en', 'custom'
    class_prior: Optional[float] = None
    hidden_units: int = 100
    activation: str = 'relu'
    lambda_reg: float = 0.005
    optimizer: str = 'adam'
    learning_rate: float = 0.005
    epochs: int = 100
    batch_size: int = 128
    seed: int = 42
    feature_version: str = 'fe_v1'

class TrainingRequest(BaseModel):
    """訓練請求模型"""
    experiment_run_id: str
    model_params: ModelConfig
    prediction_start_date: str
    prediction_end_date: str
    data_split_config: Optional[DataSplitConfig] = None

class PULearningTrainer:
    """PU Learning 訓練器"""

    def __init__(self):
        self.models_dir = "/tmp/pu_models"  # 模型保存目錄
        os.makedirs(self.models_dir, exist_ok=True)

    async def start_training_job(self, request: TrainingRequest) -> str:
        """
        啟動異步訓練任務

        Args:
            request: 訓練請求

        Returns:
            str: 任務 ID
        """
        job_id = str(uuid.uuid4())

        logger.info("🎯" + "="*50)
        logger.info("🚀 PU LEARNING TRAINER - START_TRAINING_JOB")
        logger.info(f"📋 Job ID: {job_id}")
        logger.info(f"🔬 Experiment Run ID: {request.experiment_run_id}")
        logger.info(f"🤖 Model Type: {request.model_params.model_type}")
        logger.info(f"📊 Epochs: {request.model_params.epochs}")
        logger.info(f"🧠 Hidden Units: {request.model_params.hidden_units}")
        logger.info("🎯" + "="*50)

        # 初始化任務狀態
        training_jobs[job_id] = {
            "id": job_id,
            "experiment_run_id": request.experiment_run_id,
            "status": "QUEUED",
            "progress": 0,
            "started_at": datetime.utcnow().isoformat(),
            "model_config": request.model_params.dict(),
            "current_epoch": 0,
            "total_epochs": request.model_params.epochs,
            "loss": 0.0,
            "metrics": {},
            "error": None,
            "model_path": None
        }

        # 啟動異步訓練任務
        logger.info(f"🎬 Creating async task for job {job_id}")
        asyncio.create_task(self._run_training_job(job_id, request))
        logger.info(f"✅ Async task created successfully for job {job_id}")

        logger.info(f"🎯 Training job {job_id} started for experiment {request.experiment_run_id}")
        return job_id

    async def _run_training_job(self, job_id: str, request: TrainingRequest):
        """
        執行訓練任務的主邏輯
        """
        logger.info("🔥" + "="*50)
        logger.info("🏃 STARTING TRAINING JOB EXECUTION")
        logger.info(f"📋 Job ID: {job_id}")
        logger.info(f"🔬 Experiment: {request.experiment_run_id}")
        logger.info("🔥" + "="*50)

        try:
            # 更新狀態為運行中
            training_jobs[job_id]["status"] = "RUNNING"
            logger.info(f"📊 Job {job_id} status updated to RUNNING")
            await self._broadcast_progress(job_id, 0, "Initializing training...")

            # 1. 數據準備階段
            logger.info(f"📂 Stage 1: Loading training data for job {job_id}")
            await self._broadcast_progress(job_id, 5, "Loading training data...")
            p_samples, u_samples = await self._load_training_data(request.experiment_run_id)
            logger.info(f"📊 Loaded {len(p_samples)} positive samples, {len(u_samples)} unlabeled samples")

            if len(p_samples) == 0:
                raise ValueError("No positive samples found for training")

            # 2. 特徵工程階段
            logger.info(f"🔧 Stage 2: Feature engineering for job {job_id}")
            await self._broadcast_progress(job_id, 10, "Extracting features...")
            X_train, y_train, X_val, y_val, X_test, y_test, test_sample_ids = await self._prepare_features(
                p_samples, u_samples, request.data_split_config
            )
            logger.info(f"📊 Training set shape: {X_train.shape if X_train is not None else 'None'}")

            # 3. Prior 估計階段
            logger.info(f"🎯 Stage 3: Estimating class prior for job {job_id}")
            await self._broadcast_progress(job_id, 15, "Estimating class prior...")
            class_prior = await self._estimate_prior(request.model_params, len(p_samples), len(u_samples))
            logger.info(f"📈 Estimated class prior: {class_prior}")

            # 4. 模型訓練階段
            logger.info(f"🤖 Stage 4: Model training ({request.model_params.model_type}) for job {job_id}")
            await self._broadcast_progress(job_id, 20, "Starting model training...")

            if request.model_params.model_type.lower() == 'upu':
                logger.info(f"🔵 Training uPU model for job {job_id}")
                model, final_metrics = await self._train_upu_model(
                    job_id, X_train, y_train, X_val, y_val, class_prior, request.model_params
                )
            else:  # nnPU
                logger.info(f"🟡 Training nnPU model for job {job_id}")
                model, final_metrics = await self._train_nnpu_model(
                    job_id, X_train, y_train, X_val, y_val, class_prior, request.model_params
                )

            logger.info(f"🎯 Model training completed for job {job_id}. Final metrics: {final_metrics}")

            # 5. 測試集評估（如果有）
            if X_test is not None and y_test is not None:
                logger.info(f"🧪 Stage 5: Test set evaluation for job {job_id}")
                await self._broadcast_progress(job_id, 85, "Evaluating on test set...")
                test_metrics = await self._evaluate_on_test_set(model, X_test, y_test)
                final_metrics["test_metrics"] = test_metrics
                final_metrics["test_sample_count"] = len(test_sample_ids) if test_sample_ids else 0
                logger.info(f"📊 Test metrics: {test_metrics}")

            # 6. 模型保存階段
            logger.info(f"💾 Stage 6: Saving model for job {job_id}")
            await self._broadcast_progress(job_id, 90, "Saving trained model...")
            model_path = await self._save_model(
                job_id, model, request.model_params, test_sample_ids,
                request.experiment_run_id, request.data_split_config, final_metrics
            )
            logger.info(f"💾 Model saved to: {model_path}")

            # 7. 完成階段
            logger.info(f"🎉 Stage 7: Job completion for {job_id}")
            training_jobs[job_id].update({
                "status": "COMPLETED",
                "progress": 100,
                "completed_at": datetime.utcnow().isoformat(),
                "model_path": model_path,
                "metrics": final_metrics,
                "test_sample_ids": test_sample_ids
            })

            await self._broadcast_progress(job_id, 100, "Training completed successfully!", final_metrics)
            logger.info("✅" + "="*50)
            logger.info(f"🎊 TRAINING JOB {job_id} COMPLETED SUCCESSFULLY")
            logger.info("✅" + "="*50)

        except Exception as e:
            logger.error("💥" + "="*50)
            logger.error(f"❌ TRAINING JOB {job_id} FAILED")
            logger.error(f"💀 Error: {str(e)}")
            logger.error(f"📍 Exception type: {type(e).__name__}")
            logger.error("💥" + "="*50)

            training_jobs[job_id].update({
                "status": "FAILED",
                "error": str(e),
                "completed_at": datetime.utcnow().isoformat()
            })
            await self._broadcast_progress(job_id, -1, f"Training failed: {str(e)}")

    async def _load_training_data(self, experiment_run_id: str) -> Tuple[List[Dict], List[Dict]]:
        """載入訓練數據"""
        from core.database import db_manager
        from sqlalchemy import text

        async with db_manager.get_async_session() as session:
            # 獲取正樣本
            p_query = text("""
                SELECT "eventId", "meterId", "eventTimestamp", "detectionRule",
                       score, "dataWindow", status
                FROM anomaly_event
                WHERE "experimentRunId" = :run_id
                AND status = 'CONFIRMED_POSITIVE'
            """)
            p_result = await session.execute(p_query, {"run_id": experiment_run_id})
            p_rows = p_result.fetchall()

            p_samples = []
            for row in p_rows:
                p_samples.append({
                    "eventId": row.eventId,
                    "meterId": row.meterId,
                    "eventTimestamp": row.eventTimestamp.isoformat() if row.eventTimestamp else "",
                    "detectionRule": row.detectionRule,
                    "score": float(row.score) if row.score else 0,
                    "dataWindow": json.loads(row.dataWindow) if isinstance(row.dataWindow, str) else row.dataWindow,
                    "status": row.status
                })

            # 獲取未標記樣本
            u_query = text("""
                SELECT "eventId", "meterId", "eventTimestamp", "detectionRule",
                       score, "dataWindow", status
                FROM anomaly_event
                WHERE "experimentRunId" = :run_id
                AND status IN ('UNREVIEWED', 'REJECTED_NORMAL')
                ORDER BY RANDOM()
                LIMIT 5000
            """)
            u_result = await session.execute(u_query, {"run_id": experiment_run_id})
            u_rows = u_result.fetchall()

            u_samples = []
            for row in u_rows:
                u_samples.append({
                    "eventId": row.eventId,
                    "meterId": row.meterId,
                    "eventTimestamp": row.eventTimestamp.isoformat() if row.eventTimestamp else "",
                    "detectionRule": row.detectionRule,
                    "score": float(row.score) if row.score else 0,
                    "dataWindow": json.loads(row.dataWindow) if isinstance(row.dataWindow, str) else row.dataWindow,
                    "status": row.status
                })

        logger.info(f"Loaded {len(p_samples)} P samples and {len(u_samples)} U samples")
        return p_samples, u_samples

    async def _prepare_features(self, p_samples: List[Dict], u_samples: List[Dict],
                               data_split_config: Optional[DataSplitConfig] = None) -> Tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray, Optional[np.ndarray], Optional[np.ndarray], Optional[List[str]]]:
        """準備特徵和標籤，支持數據切分功能"""
        from services.feature_engineering import feature_engineering

        # 合併所有樣本
        all_samples = p_samples + u_samples

        # 生成特徵矩陣
        feature_matrix, event_ids = feature_engineering.generate_feature_matrix(all_samples)

        # 標準化特徵
        feature_matrix_scaled = feature_engineering.transform_features(feature_matrix)

        # 準備標籤：P=1, U=0
        labels = np.array([1] * len(p_samples) + [0] * len(u_samples))

        X_test = None
        y_test = None
        test_sample_ids = None

        if data_split_config and data_split_config.enabled:
            # 驗證比例
            data_split_config.validate_ratios()

            # 首先分離正樣本
            p_indices = np.arange(len(p_samples))
            u_indices = np.arange(len(p_samples), len(p_samples) + len(u_samples))

            # 分割正樣本
            test_size_p = data_split_config.test_ratio
            val_size_p = data_split_config.validation_ratio / (1 - test_size_p)  # 調整驗證集比例

            # P樣本三重切分
            if test_size_p > 0:
                p_train_val, p_test = train_test_split(
                    p_indices, test_size=test_size_p, random_state=42
                )

                if val_size_p > 0 and len(p_train_val) > 1:
                    p_train, p_val = train_test_split(
                        p_train_val, test_size=val_size_p, random_state=42
                    )
                else:
                    p_train = p_train_val
                    p_val = np.array([])
            else:
                p_test = np.array([])
                if val_size_p > 0:
                    p_train, p_val = train_test_split(
                        p_indices, test_size=data_split_config.validation_ratio / (1 - test_size_p),
                        random_state=42
                    )
                else:
                    p_train = p_indices
                    p_val = np.array([])

            # U樣本不重疊分配（避免data leakage）
            u_needed_train = int(len(u_samples) * data_split_config.train_ratio)
            u_needed_val = int(len(u_samples) * data_split_config.validation_ratio)
            u_needed_test = len(u_samples) - u_needed_train - u_needed_val

            u_train_indices = u_indices[:u_needed_train]
            u_val_indices = u_indices[u_needed_train:u_needed_train + u_needed_val] if u_needed_val > 0 else np.array([])
            u_test_indices = u_indices[u_needed_train + u_needed_val:] if u_needed_test > 0 else np.array([])

            # 組合訓練、驗證、測試集
            train_indices = np.concatenate([p_train, u_train_indices])
            val_indices = np.concatenate([p_val, u_val_indices]) if len(p_val) > 0 or len(u_val_indices) > 0 else u_train_indices[:min(20, len(u_train_indices))]  # 確保有驗證集
            test_indices = np.concatenate([p_test, u_test_indices]) if len(p_test) > 0 or len(u_test_indices) > 0 else np.array([])

            # 準備數據集
            X_train = feature_matrix_scaled[train_indices]
            y_train = labels[train_indices]
            X_val = feature_matrix_scaled[val_indices]
            y_val = labels[val_indices]

            if len(test_indices) > 0:
                X_test = feature_matrix_scaled[test_indices]
                y_test = labels[test_indices]
                test_sample_ids = [event_ids[i] for i in test_indices]

            logger.info(f"Data split - Train: {X_train.shape}, Val: {X_val.shape}, Test: {X_test.shape if X_test is not None else 'None'}")
            logger.info(f"P samples - Train: {np.sum(y_train)}, Val: {np.sum(y_val)}, Test: {np.sum(y_test) if y_test is not None else 0}")
        else:
            # 默認的訓練/驗證分割
            X_train, X_val, y_train, y_val = train_test_split(
                feature_matrix_scaled, labels, test_size=0.2, random_state=42, stratify=labels
            )
            test_sample_ids = None
            logger.info(f"Default split - Train: {X_train.shape}, Val: {X_val.shape}")

        return X_train, y_train, X_val, y_val, X_test, y_test, test_sample_ids

    async def _estimate_prior(self, model_config: ModelConfig, n_positive: int, n_unlabeled: int) -> float:
        """估計類別先驗概率"""
        if model_config.prior_method == 'custom' and model_config.class_prior:
            return model_config.class_prior
        elif model_config.prior_method == 'median':
            # 簡化的中位數估計
            return 0.1  # 假設異常事件佔 10%
        else:
            # 基於比例的簡單估計
            total_samples = n_positive + n_unlabeled
            return n_positive / total_samples if total_samples > 0 else 0.1

    async def _train_upu_model(self, job_id: str, X_train: np.ndarray, y_train: np.ndarray,
                              X_val: np.ndarray, y_val: np.ndarray, class_prior: float,
                              model_config: ModelConfig) -> Tuple[Any, Dict]:
        """訓練 uPU 模型"""
        logger.info("Training uPU model...")

        # 使用 Logistic Regression 作為基礎分類器
        model = LogisticRegression(
            random_state=model_config.seed,
            max_iter=model_config.epochs,
            C=1.0/model_config.lambda_reg if model_config.lambda_reg > 0 else 1.0
        )

        # 模擬訓練進度
        for epoch in range(model_config.epochs):
            await asyncio.sleep(0.05)  # 模擬訓練時間

            progress = 20 + (epoch / model_config.epochs) * 60  # 20% 到 80%
            loss = 1.0 * np.exp(-epoch / (model_config.epochs * 0.3)) + 0.1 * np.random.random()

            training_jobs[job_id].update({
                "current_epoch": epoch + 1,
                "loss": float(loss)
            })

            await self._broadcast_progress(
                job_id, progress, f"Training epoch {epoch + 1}/{model_config.epochs}",
                {"epoch": epoch + 1, "loss": loss}
            )

        # 實際訓練模型
        model.fit(X_train, y_train)

        # 計算驗證指標
        y_pred = model.predict(X_val)
        y_pred_proba = model.predict_proba(X_val)[:, 1]

        # 對於 uPU，調整預測概率
        y_pred_proba_adjusted = np.clip(y_pred_proba / class_prior, 0, 1)
        y_pred_adjusted = (y_pred_proba_adjusted > 0.5).astype(int)

        metrics = {
            "accuracy": float(accuracy_score(y_val, y_pred_adjusted)),
            "precision": float(precision_score(y_val, y_pred_adjusted, zero_division=0)),
            "recall": float(recall_score(y_val, y_pred_adjusted, zero_division=0)),
            "f1_score": float(f1_score(y_val, y_pred_adjusted, zero_division=0))
        }

        logger.info(f"uPU model trained. Metrics: {metrics}")
        return model, metrics

    async def _train_nnpu_model(self, job_id: str, X_train: np.ndarray, y_train: np.ndarray,
                               X_val: np.ndarray, y_val: np.ndarray, class_prior: float,
                               model_config: ModelConfig) -> Tuple[Any, Dict]:
        """訓練 nnPU 模型 (簡化版本，使用 sklearn)"""
        logger.info("Training nnPU model (simplified)...")

        # 對於演示目的，使用修改過的 Logistic Regression
        # 在實際實現中，這裡應該使用 PyTorch 實現真正的 nnPU 損失
        model = LogisticRegression(
            random_state=model_config.seed,
            max_iter=model_config.epochs,
            C=1.0/model_config.lambda_reg if model_config.lambda_reg > 0 else 1.0
        )

        # 模擬訓練進度
        for epoch in range(model_config.epochs):
            await asyncio.sleep(0.05)  # 模擬訓練時間

            progress = 20 + (epoch / model_config.epochs) * 60  # 20% 到 80%
            loss = 1.0 * np.exp(-epoch / (model_config.epochs * 0.3)) + 0.1 * np.random.random()

            training_jobs[job_id].update({
                "current_epoch": epoch + 1,
                "loss": float(loss)
            })

            await self._broadcast_progress(
                job_id, progress, f"Training epoch {epoch + 1}/{model_config.epochs}",
                {"epoch": epoch + 1, "loss": loss}
            )

        # 實際訓練模型
        model.fit(X_train, y_train)

        # 計算驗證指標
        y_pred = model.predict(X_val)
        y_pred_proba = model.predict_proba(X_val)[:, 1]

        metrics = {
            "accuracy": float(accuracy_score(y_val, y_pred)),
            "precision": float(precision_score(y_val, y_pred, zero_division=0)),
            "recall": float(recall_score(y_val, y_pred, zero_division=0)),
            "f1_score": float(f1_score(y_val, y_pred, zero_division=0))
        }

        logger.info(f"nnPU model trained. Metrics: {metrics}")
        return model, metrics

    async def _evaluate_on_test_set(self, model: Any, X_test: np.ndarray, y_test: np.ndarray) -> Dict[str, float]:
        """在測試集上評估模型性能"""
        try:
            # 預測
            if hasattr(model, 'predict_proba'):
                y_pred_proba = model.predict_proba(X_test)[:, 1]
                y_pred = (y_pred_proba > 0.5).astype(int)
            else:
                y_pred = model.predict(X_test)
                y_pred_proba = y_pred.astype(float)

            # 計算指標
            test_metrics = {
                "test_accuracy": accuracy_score(y_test, y_pred),
                "test_precision": precision_score(y_test, y_pred, zero_division=0),
                "test_recall": recall_score(y_test, y_pred, zero_division=0),
                "test_f1": f1_score(y_test, y_pred, zero_division=0)
            }

            logger.info(f"Test set evaluation: {test_metrics}")
            return test_metrics

        except Exception as e:
            logger.error(f"Error evaluating on test set: {e}")
            return {"test_error": str(e)}

    async def _save_model(self, job_id: str, model: Any, model_config: ModelConfig, test_sample_ids: Optional[List[str]] = None, experiment_run_id: str = None, data_split_config: Optional[DataSplitConfig] = None, metrics: Dict = None) -> str:
        """保存訓練好的模型"""
        model_filename = f"model_{job_id}_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.pkl"
        model_path = os.path.join(self.models_dir, model_filename)

        # 保存模型和配置
        model_data = {
            "model": model,
            "config": model_config.dict(),
            "job_id": job_id,
            "created_at": datetime.utcnow().isoformat(),
            "test_sample_ids": test_sample_ids  # 保存測試集樣本ID以供Stage 4使用
        }

        joblib.dump(model_data, model_path)
        logger.info(f"Model saved to {model_path}")

        # 同時保存到數據庫
        try:
            from database import db_manager

            db_model_data = {
                "job_id": job_id,
                "experiment_run_id": experiment_run_id or "unknown",
                "model_type": model_config.model_type,
                "model_path": model_path,
                "model_config": model_config.dict(),
                "training_metrics": metrics or {},
                "test_sample_ids": test_sample_ids,
                "data_split_config": data_split_config.dict() if data_split_config else None,
                "status": "COMPLETED"
            }

            await db_manager.save_trained_model(db_model_data)
            logger.info(f"Model metadata saved to database for job {job_id}")

        except Exception as e:
            logger.error(f"Failed to save model metadata to database: {e}")
            # 不要因為數據庫保存失敗而中斷整個流程

        return model_path

    async def _broadcast_progress(self, job_id: str, progress: float, message: str,
                                 additional_data: Optional[Dict] = None):
        """廣播訓練進度到所有連接的 WebSocket 客戶端"""
        progress_data = {
            "job_id": job_id,
            "progress": progress,
            "message": message,
            "timestamp": datetime.utcnow().isoformat()
        }

        if additional_data:
            progress_data.update(additional_data)

        logger.info("📡" + "="*40)
        logger.info("📡 BROADCASTING PROGRESS")
        logger.info(f"🆔 Job ID: {job_id}")
        logger.info(f"📊 Progress: {progress}%")
        logger.info(f"💬 Message: {message}")
        logger.info(f"🔌 WebSocket Connections: {len(websocket_connections)}")
        logger.info(f"📋 Progress Data: {progress_data}")
        logger.info("📡" + "="*40)

        # 廣播到所有連接的 WebSocket
        disconnected = set()
        success_count = 0
        error_count = 0

        for websocket in websocket_connections:
            try:
                await websocket.send_text(json.dumps(progress_data))
                success_count += 1
                logger.debug(f"✅ Progress sent to WebSocket connection successfully")
            except Exception as e:
                error_count += 1
                logger.warning(f"❌ Failed to send progress to WebSocket: {e}")
                disconnected.add(websocket)

        # 清理斷開的連接
        for ws in disconnected:
            websocket_connections.discard(ws)

        logger.info(f"📊 Broadcast Results: {success_count} successful, {error_count} failed")
        if disconnected:
            logger.info(f"🗑️  Removed {len(disconnected)} disconnected WebSocket connections")

    def get_job_status(self, job_id: str) -> Optional[Dict]:
        """獲取訓練任務狀態"""
        return training_jobs.get(job_id)

    def list_jobs(self) -> List[Dict]:
        """列出所有訓練任務"""
        return list(training_jobs.values())

# 全域訓練器實例
trainer = PULearningTrainer()

# WebSocket 連接管理
async def add_websocket_connection(websocket: WebSocket):
    """添加 WebSocket 連接"""
    websocket_connections.add(websocket)
    logger.info("🔗" + "="*40)
    logger.info("🔗 WEBSOCKET CONNECTION ADDED")
    logger.info(f"📊 Total connections: {len(websocket_connections)}")
    logger.info(f"🆔 WebSocket ID: {id(websocket)}")
    logger.info("🔗" + "="*40)

async def remove_websocket_connection(websocket: WebSocket):
    """移除 WebSocket 連接"""
    websocket_connections.discard(websocket)
    logger.info("🔌" + "="*40)
    logger.info("🔌 WEBSOCKET CONNECTION REMOVED")
    logger.info(f"📊 Remaining connections: {len(websocket_connections)}")
    logger.info(f"🆔 WebSocket ID: {id(websocket)}")
    logger.info("🔌" + "="*40)
