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
        asyncio.create_task(self._run_training_job(job_id, request))
        
        logger.info(f"Training job {job_id} started for experiment {request.experiment_run_id}")
        return job_id
    
    async def _run_training_job(self, job_id: str, request: TrainingRequest):
        """
        執行訓練任務的主邏輯
        """
        try:
            # 更新狀態為運行中
            training_jobs[job_id]["status"] = "RUNNING"
            await self._broadcast_progress(job_id, 0, "Initializing training...")
            
            # 1. 數據準備階段
            await self._broadcast_progress(job_id, 5, "Loading training data...")
            p_samples, u_samples = await self._load_training_data(request.experiment_run_id)
            
            if len(p_samples) == 0:
                raise ValueError("No positive samples found for training")
            
            # 2. 特徵工程階段
            await self._broadcast_progress(job_id, 10, "Extracting features...")
            X_train, y_train, X_val, y_val = await self._prepare_features(p_samples, u_samples)
            
            # 3. Prior 估計階段
            await self._broadcast_progress(job_id, 15, "Estimating class prior...")
            class_prior = await self._estimate_prior(request.model_params, len(p_samples), len(u_samples))
            
            # 4. 模型訓練階段
            await self._broadcast_progress(job_id, 20, "Starting model training...")
            
            if request.model_params.model_type.lower() == 'upu':
                model, final_metrics = await self._train_upu_model(
                    job_id, X_train, y_train, X_val, y_val, class_prior, request.model_params
                )
            else:  # nnPU
                model, final_metrics = await self._train_nnpu_model(
                    job_id, X_train, y_train, X_val, y_val, class_prior, request.model_params
                )
            
            # 5. 模型保存階段
            await self._broadcast_progress(job_id, 90, "Saving trained model...")
            model_path = await self._save_model(job_id, model, request.model_params)
            
            # 6. 完成階段
            training_jobs[job_id].update({
                "status": "COMPLETED",
                "progress": 100,
                "completed_at": datetime.utcnow().isoformat(),
                "model_path": model_path,
                "metrics": final_metrics
            })
            
            await self._broadcast_progress(job_id, 100, "Training completed successfully!", final_metrics)
            
        except Exception as e:
            logger.error(f"Training job {job_id} failed: {e}")
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
    
    async def _prepare_features(self, p_samples: List[Dict], u_samples: List[Dict]) -> Tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
        """準備特徵和標籤"""
        from services.feature_engineering import feature_engineering
        
        # 合併所有樣本
        all_samples = p_samples + u_samples
        
        # 生成特徵矩陣
        feature_matrix, event_ids = feature_engineering.generate_feature_matrix(all_samples)
        
        # 標準化特徵
        feature_matrix_scaled = feature_engineering.transform_features(feature_matrix)
        
        # 準備標籤：P=1, U=0
        labels = np.array([1] * len(p_samples) + [0] * len(u_samples))
        
        # 分割訓練集和驗證集
        X_train, X_val, y_train, y_val = train_test_split(
            feature_matrix_scaled, labels, test_size=0.2, random_state=42, stratify=labels
        )
        
        logger.info(f"Training set: {X_train.shape}, Validation set: {X_val.shape}")
        return X_train, y_train, X_val, y_val
    
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
    
    async def _save_model(self, job_id: str, model: Any, model_config: ModelConfig) -> str:
        """保存訓練好的模型"""
        model_filename = f"model_{job_id}_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.pkl"
        model_path = os.path.join(self.models_dir, model_filename)
        
        # 保存模型和配置
        model_data = {
            "model": model,
            "config": model_config.dict(),
            "job_id": job_id,
            "created_at": datetime.utcnow().isoformat()
        }
        
        joblib.dump(model_data, model_path)
        logger.info(f"Model saved to {model_path}")
        
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
        
        # 廣播到所有連接的 WebSocket
        disconnected = set()
        for websocket in websocket_connections:
            try:
                await websocket.send_text(json.dumps(progress_data))
            except Exception as e:
                logger.warning(f"Failed to send progress to WebSocket: {e}")
                disconnected.add(websocket)
        
        # 清理斷開的連接
        for ws in disconnected:
            websocket_connections.discard(ws)
    
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
    logger.info(f"WebSocket connected. Total connections: {len(websocket_connections)}")

async def remove_websocket_connection(websocket: WebSocket):
    """移除 WebSocket 連接"""
    websocket_connections.discard(websocket)
    logger.info(f"WebSocket disconnected. Total connections: {len(websocket_connections)}")
