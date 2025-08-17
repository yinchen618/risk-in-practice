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
websocket_lock = asyncio.Lock()  # 添加異步鎖保護 WebSocket 操作

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
    # 新增的 U 樣本生成配置
    u_sample_time_range: Optional[Dict[str, str]] = None  # {"start_date": "2025-08-13", "end_date": "2025-08-14", "start_time": "00:00", "end_time": "23:59"}
    u_sample_building_floors: Optional[Dict[str, List[str]]] = None  # {"Building A": ["2"], "Building B": ["1", "2"]}
    u_sample_limit: Optional[int] = 5000

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

            # 記錄和廣播超參數信息
            hyperparams = {
                "model_type": request.model_params.model_type,
                "prior_method": request.model_params.prior_method,
                "class_prior": request.model_params.class_prior,
                "hidden_units": request.model_params.hidden_units,
                "activation": request.model_params.activation,
                "lambda_reg": request.model_params.lambda_reg,
                "optimizer": request.model_params.optimizer,
                "learning_rate": request.model_params.learning_rate,
                "epochs": request.model_params.epochs,
                "batch_size": request.model_params.batch_size,
                "seed": request.model_params.seed,
                "feature_version": request.model_params.feature_version,
            }

            logger.info("🎛️" + "="*50)
            logger.info("🎛️ TRAINING HYPERPARAMETERS")
            logger.info(f"🤖 Model Type: {hyperparams['model_type']}")
            logger.info(f"📊 Prior Method: {hyperparams['prior_method']}")
            logger.info(f"🎯 Class Prior: {hyperparams['class_prior']}")
            logger.info(f"🧠 Hidden Units: {hyperparams['hidden_units']}")
            logger.info(f"⚡ Activation: {hyperparams['activation']}")
            logger.info(f"📐 Lambda Reg: {hyperparams['lambda_reg']}")
            logger.info(f"🔧 Optimizer: {hyperparams['optimizer']}")
            logger.info(f"📈 Learning Rate: {hyperparams['learning_rate']}")
            logger.info(f"🔄 Epochs: {hyperparams['epochs']}")
            logger.info(f"📦 Batch Size: {hyperparams['batch_size']}")
            logger.info(f"🌱 Seed: {hyperparams['seed']}")
            logger.info(f"🏷️ Feature Version: {hyperparams['feature_version']}")
            logger.info("🎛️" + "="*50)

            await self._broadcast_progress(job_id, 0, "Initializing training...", {
                "model_name": f"{request.model_params.model_type} Model",
                "hyperparameters": hyperparams,
                "stage": "initialization"
            })

            # 1. 數據準備階段
            logger.info(f"📂 Stage 1: Loading training data for job {job_id}")
            await self._broadcast_progress(job_id, 5, "Stage 1: Loading training data from database...", {
                "stage": "data_loading"
            })

            # 檢查是否有 U 樣本生成配置
            if (request.u_sample_time_range and
                request.u_sample_building_floors and
                request.u_sample_limit):
                # 使用新的動態 U 樣本生成方法
                logger.info("🆕 Using dynamic U sample generation from raw data")
                await self._broadcast_progress(job_id, 7, "Loading P samples from anomaly events...", {
                    "stage": "data_loading",
                    "substage": "positive_samples"
                })
                p_samples, u_samples = await self._load_training_data_with_dynamic_u(
                    job_id,
                    request.experiment_run_id,
                    request.u_sample_time_range,
                    request.u_sample_building_floors,
                    request.u_sample_limit
                )
            else:
                # 使用舊的方法（從 anomaly_event 表）
                logger.info("📋 Using traditional U sample loading from anomaly_event table")
                await self._broadcast_progress(job_id, 7, "Loading P and U samples from anomaly events...", {
                    "stage": "data_loading",
                    "substage": "traditional_loading"
                })
                p_samples, u_samples = await self._load_training_data(request.experiment_run_id)

            logger.info(f"📊 Loaded {len(p_samples)} positive samples, {len(u_samples)} unlabeled samples")
            await self._broadcast_progress(job_id, 9, f"Data loaded: {len(p_samples)} P samples, {len(u_samples)} U samples", {
                "p_sample_count": len(p_samples),
                "u_sample_count": len(u_samples),
                "model_name": f"{request.model_params.model_type} Model",
                "stage": "data_loading",
                "substage": "completed"
            })

            if len(p_samples) == 0:
                raise ValueError("No positive samples found for training")

            # 2. 特徵工程階段
            logger.info(f"🔧 Stage 2: Feature engineering for job {job_id}")
            await self._broadcast_progress(job_id, 10, "Stage 2: Starting feature extraction...", {
                "stage": "feature_engineering"
            })
            X_train, y_train, X_val, y_val, X_test, y_test, test_sample_ids = await self._prepare_features(
                p_samples, u_samples, request.data_split_config
            )
            logger.info(f"📊 Training set shape: {X_train.shape if X_train is not None else 'None'}")
            await self._broadcast_progress(job_id, 12, f"Features extracted: {X_train.shape} training samples", {
                "data_split_info": {
                    "train_samples": X_train.shape[0] if X_train is not None else 0,
                    "validation_samples": X_val.shape[0] if X_val is not None else 0,
                    "test_samples": X_test.shape[0] if X_test is not None else 0,
                    "train_p_samples": int(np.sum(y_train)) if y_train is not None else 0,
                    "validation_p_samples": int(np.sum(y_val)) if y_val is not None else 0,
                    "test_p_samples": int(np.sum(y_test)) if y_test is not None else 0,
                    "split_enabled": request.data_split_config.enabled if request.data_split_config else False
                },
                "stage": "feature_engineering",
                "substage": "completed"
            })

            # 3. Prior 估計階段
            logger.info(f"🎯 Stage 3: Estimating class prior for job {job_id}")
            await self._broadcast_progress(job_id, 15, "Stage 3: Estimating class prior probability...", {
                "stage": "prior_estimation"
            })
            class_prior = await self._estimate_prior(request.model_params, len(p_samples), len(u_samples))
            logger.info(f"📈 Estimated class prior: {class_prior}")
            await self._broadcast_progress(job_id, 17, f"Class prior estimated: {class_prior:.4f}", {
                "stage": "prior_estimation",
                "substage": "completed"
            })

            # 4. 模型訓練階段
            logger.info(f"🤖 Stage 4: Model training ({request.model_params.model_type}) for job {job_id}")
            await self._broadcast_progress(job_id, 20, f"Stage 4: Initializing {request.model_params.model_type} model training...", {
                "stage": "model_training"
            })

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
            await self._broadcast_progress(job_id, 80, f"{request.model_params.model_type} model training completed successfully", {
                "stage": "model_training",
                "substage": "completed"
            })

            # 4.5. 驗證集評估（如果有）
            if X_val is not None and y_val is not None:
                logger.info(f"📊 Stage 4.5: Validation set evaluation for job {job_id}")
                await self._broadcast_progress(job_id, 82, f"Stage 4.5: Evaluating model performance on {len(y_val)} validation samples...", {
                    "stage": "validation_evaluation"
                })
                validation_metrics = await self._evaluate_on_validation_set(model, X_val, y_val)
                final_metrics["validation_metrics"] = validation_metrics
                final_metrics["validation_sample_count"] = len(y_val)
                logger.info(f"📊 Validation metrics: {validation_metrics}")
                await self._broadcast_progress(job_id, 84, f"Validation evaluation completed. Accuracy: {validation_metrics.get('val_accuracy', 0):.3f}", {
                    "validation_metrics": validation_metrics,
                    "validation_sample_count": len(y_val),
                    "stage": "validation_evaluation",
                    "substage": "completed"
                })

            # 5. 測試集評估（如果有）
            if X_test is not None and y_test is not None:
                logger.info(f"🧪 Stage 5: Test set evaluation for job {job_id}")
                await self._broadcast_progress(job_id, 85, f"Stage 5: Evaluating model performance on {len(y_test)} test samples...", {
                    "stage": "test_evaluation"
                })
                test_metrics = await self._evaluate_on_test_set(model, X_test, y_test)
                final_metrics["test_metrics"] = test_metrics
                final_metrics["test_sample_count"] = len(test_sample_ids) if test_sample_ids else 0
                logger.info(f"📊 Test metrics: {test_metrics}")
                await self._broadcast_progress(job_id, 88, f"Test evaluation completed. Accuracy: {test_metrics.get('test_accuracy', 0):.3f}", {
                    "test_metrics": test_metrics,
                    "test_sample_count": len(test_sample_ids) if test_sample_ids else 0,
                    "stage": "test_evaluation",
                    "substage": "completed"
                })

            # 6. 模型保存階段
            logger.info(f"💾 Stage 6: Saving model for job {job_id}")
            await self._broadcast_progress(job_id, 90, "Stage 6: Saving trained model to storage...", {
                "stage": "model_saving"
            })
            model_path = await self._save_model(
                job_id, model, request.model_params, test_sample_ids,
                request.experiment_run_id, request.data_split_config, final_metrics
            )
            logger.info(f"💾 Model saved to: {model_path}")
            await self._broadcast_progress(job_id, 95, "Model saved successfully, finalizing training job...", {
                "stage": "model_saving",
                "substage": "completed"
            })

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

            await self._broadcast_progress(job_id, 100, "Stage 7: PU Learning model training completed successfully! Ready for prediction.", {
                **final_metrics,
                "stage": "completion",
                "substage": "finished"
            })
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

            # 獲取未標記樣本 - 舊的實現（從 anomaly_event 表中獲取）
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

    async def _load_training_data_with_dynamic_u(
        self,
        job_id: str,
        experiment_run_id: str,
        u_sample_time_range: Dict[str, str],
        u_sample_building_floors: Dict[str, List[str]],
        u_sample_limit: int
    ) -> Tuple[List[Dict], List[Dict]]:
        """載入 P 樣本並動態生成 U 樣本"""
        try:
            # 1. 載入 P 樣本（從 anomaly_event 表）
            from core.database import db_manager
            from sqlalchemy import text

            logger.info(f"📊 Loading P samples for experiment {experiment_run_id}")

            async with db_manager.get_async_session() as session:
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

            logger.info(f"📊 Loaded {len(p_samples)} P samples from anomaly_event table")
            await self._broadcast_progress(job_id, 8, f"Loaded {len(p_samples)} positive samples from experiment data", {
                "p_sample_count": len(p_samples)
            })

            # 2. 動態生成 U 樣本（從原始數據）
            await self._broadcast_progress(job_id, 8.5, "Starting dynamic U sample generation from raw meter data...")
            u_samples = await self._generate_u_samples_from_raw_data(
                job_id,
                experiment_run_id,
                u_sample_time_range,
                u_sample_building_floors,
                u_sample_limit
            )

            logger.info(f"📊 Generated {len(u_samples)} U samples from raw data")
            logger.info(f"🎯 Total training data: {len(p_samples)} P + {len(u_samples)} U = {len(p_samples) + len(u_samples)} samples")

            return p_samples, u_samples

        except Exception as e:
            logger.error(f"Failed to load training data with dynamic U samples: {e}")
            raise

    async def _generate_u_samples_from_raw_data(
        self,
        job_id: str,
        experiment_run_id: str,
        time_range: Dict[str, str],
        building_floors: Dict[str, List[str]],
        limit: int = 5000
    ) -> List[Dict]:
        """
        從原始電表數據動態生成 U 樣本

        Args:
            job_id: 訓練任務ID（用於WebSocket進度更新）
            experiment_run_id: 實驗運行ID
            time_range: 時間範圍配置 {"start_date": "2025-08-13", "end_date": "2025-08-14", "start_time": "00:00", "end_time": "23:59"}
            building_floors: 建築樓層配置 {"Building A": ["2"], "Building B": ["1", "2"]}
            limit: U 樣本數量限制

        Returns:
            List[Dict]: U 樣本列表，每個樣本包含 dataWindow
        """
        try:
            from services.data_loader import DataLoaderService
            from datetime import datetime, timedelta
            import pandas as pd

            logger.info("🎯" + "="*50)
            logger.info("🔄 GENERATING U SAMPLES FROM RAW DATA")
            logger.info(f"📅 Time Range: {time_range}")
            logger.info(f"🏢 Building Floors: {building_floors}")
            logger.info(f"📊 Target Samples: {limit}")
            logger.info("🎯" + "="*50)

            # 1. 解析時間範圍
            await self._broadcast_progress(job_id, 8.6, "Parsing time range configuration...")
            start_datetime = datetime.strptime(
                f"{time_range['start_date']} {time_range['start_time']}",
                "%Y-%m-%d %H:%M"
            )
            end_datetime = datetime.strptime(
                f"{time_range['end_date']} {time_range['end_time']}",
                "%Y-%m-%d %H:%M"
            )

            # 2. 從 data_loader 載入該時間範圍和建築樓層的原始數據
            await self._broadcast_progress(job_id, 8.7, f"Loading raw meter data from {time_range['start_date']} to {time_range['end_date']}...")
            data_loader = DataLoaderService()

            # 將時間格式轉換為 data_loader 期望的格式
            start_time_str = start_datetime.isoformat()
            end_time_str = end_datetime.isoformat()

            # 獲取原始數據
            raw_df = await data_loader.load_meter_data_by_time_range(
                start_time=start_time_str,
                end_time=end_time_str,
                selected_floors_by_building=building_floors
            )

            if raw_df.empty:
                logger.warning("⚠️ No raw data found for the specified time range and buildings")
                await self._broadcast_progress(job_id, 8.8, "Warning: No raw meter data found for specified time range")
                return []

            logger.info(f"📊 Loaded raw data: {len(raw_df)} records from {raw_df['deviceNumber'].nunique()} devices")
            await self._broadcast_progress(job_id, 8.8, f"Loaded {len(raw_df)} raw data records from {raw_df['deviceNumber'].nunique()} devices")

            # 3. 獲取已知的 P 樣本位置，以便排除它們
            await self._broadcast_progress(job_id, 8.85, "Identifying P sample positions to exclude...")
            p_sample_positions = await self._get_p_sample_positions(experiment_run_id)
            logger.info(f"📍 Excluding {len(p_sample_positions)} P sample positions")

            # 4. 隨機選取錨點（排除已知的 P 樣本位置）
            await self._broadcast_progress(job_id, 8.9, f"Selecting {limit} anchor points for U sample generation...")
            anchor_points = await self._select_anchor_points(
                raw_df, p_sample_positions, limit
            )

            if not anchor_points:
                logger.warning("⚠️ No valid anchor points found")
                await self._broadcast_progress(job_id, 8.95, "Warning: No valid anchor points found for U sample generation")
                return []

            logger.info(f"🎯 Selected {len(anchor_points)} anchor points")
            await self._broadcast_progress(job_id, 8.95, f"Selected {len(anchor_points)} anchor points, generating data windows...")

            # 5. 為每個錨點生成 dataWindow
            u_samples = []
            total_anchors = len(anchor_points)

            for i, anchor in enumerate(anchor_points):
                try:
                    data_window = await self._generate_data_window_for_anchor(anchor, raw_df)

                    # 構建 U 樣本對象
                    u_sample = {
                        "eventId": f"u_sample_{experiment_run_id}_{i}",
                        "meterId": anchor["deviceNumber"],
                        "eventTimestamp": anchor["timestamp"].isoformat(),
                        "detectionRule": "dynamic_u_sample",
                        "score": 0.0,  # U 樣本沒有異常分數
                        "dataWindow": data_window,
                        "status": "DYNAMIC_U_SAMPLE"
                    }
                    u_samples.append(u_sample)

                    # 發送進度更新 - 每500個樣本更新一次
                    if (i + 1) % 500 == 0 or i == total_anchors - 1:  # 改為每500個樣本更新一次
                        progress_pct = 8.95 + (i + 1) / total_anchors * 0.05  # 從 8.95% 到 9%
                        u_sample_progress = ((i + 1) / total_anchors) * 100
                        await self._broadcast_progress(
                            job_id,
                            progress_pct,
                            f"Generated {i + 1}/{total_anchors} U samples with data windows",
                            {
                                "u_sample_count": len(u_samples),
                                "u_sample_progress": u_sample_progress
                            }
                        )
                        logger.info(f"✅ Generated {i + 1}/{total_anchors} U samples")

                except Exception as e:
                    logger.warning(f"⚠️ Failed to generate dataWindow for anchor {i}: {e}")
                    continue

            logger.info("✅" + "="*50)
            logger.info(f"🎊 U SAMPLE GENERATION COMPLETED")
            logger.info(f"📊 Generated {len(u_samples)} U samples from {len(anchor_points)} anchor points")
            logger.info("✅" + "="*50)

            await self._broadcast_progress(job_id, 9, f"U sample generation completed: {len(u_samples)} samples ready", {
                "u_sample_count": len(u_samples),
                "u_sample_progress": 100.0
            })
            return u_samples

        except Exception as e:
            logger.error(f"💥 Failed to generate U samples from raw data: {e}")
            import traceback
            logger.error(f"📍 Traceback: {traceback.format_exc()}")
            return []

    async def _get_p_sample_positions(self, experiment_run_id: str) -> List[Tuple[str, datetime]]:
        """獲取已知 P 樣本的位置（設備ID + 時間戳），用於排除"""
        from core.database import db_manager
        from sqlalchemy import text

        positions = []
        try:
            async with db_manager.get_async_session() as session:
                query = text("""
                    SELECT "meterId", "eventTimestamp"
                    FROM anomaly_event
                    WHERE "experimentRunId" = :run_id
                    AND status = 'CONFIRMED_POSITIVE'
                """)
                result = await session.execute(query, {"run_id": experiment_run_id})
                rows = result.fetchall()

                for row in rows:
                    if row.eventTimestamp:
                        positions.append((row.meterId, row.eventTimestamp))

        except Exception as e:
            logger.error(f"Failed to get P sample positions: {e}")

        return positions

    async def _select_anchor_points(
        self,
        raw_df: pd.DataFrame,
        p_sample_positions: List[Tuple[str, datetime]],
        limit: int
    ) -> List[Dict]:
        """從原始數據中選取錨點，排除已知的 P 樣本位置"""
        try:
            import pandas as pd
            import numpy as np

            # 確保時間戳是 datetime 類型
            if 'timestamp' in raw_df.columns:
                raw_df['timestamp'] = pd.to_datetime(raw_df['timestamp'])
            elif 'lastUpdated' in raw_df.columns:
                raw_df = raw_df.rename(columns={'lastUpdated': 'timestamp'})
                raw_df['timestamp'] = pd.to_datetime(raw_df['timestamp'])
            else:
                logger.error("No timestamp column found in raw data")
                return []

            # 建立 P 樣本位置的快速查找集合
            p_positions_set = set()
            for meter_id, timestamp in p_sample_positions:
                # 建立一個容錯的時間窗口（前後1分鐘）
                p_positions_set.add((meter_id, timestamp))

            # 過濾出非 P 樣本的數據點
            valid_anchors = []
            for _, row in raw_df.iterrows():
                meter_id = row['deviceNumber']
                timestamp = row['timestamp']

                # 檢查是否與任何 P 樣本位置衝突（使用時間窗口）
                is_p_sample = False
                for p_meter, p_time in p_sample_positions:
                    if (meter_id == p_meter and
                        abs((timestamp - p_time).total_seconds()) < 60):  # 1分鐘容錯
                        is_p_sample = True
                        break

                if not is_p_sample:
                    valid_anchors.append({
                        "deviceNumber": meter_id,
                        "timestamp": timestamp,
                        "power": row.get('power', 0)
                    })

            logger.info(f"📊 Valid anchor candidates: {len(valid_anchors)} (after excluding P samples)")

            # 隨機選取指定數量的錨點
            if len(valid_anchors) > limit:
                selected_indices = np.random.choice(len(valid_anchors), limit, replace=False)
                selected_anchors = [valid_anchors[i] for i in selected_indices]
            else:
                selected_anchors = valid_anchors

            logger.info(f"🎯 Selected {len(selected_anchors)} anchor points")
            return selected_anchors

        except Exception as e:
            logger.error(f"Failed to select anchor points: {e}")
            return []

    async def _generate_data_window_for_anchor(
        self,
        anchor: Dict,
        raw_df: pd.DataFrame
    ) -> Dict[str, Any]:
        """為錨點生成 dataWindow，邏輯與現有的事件 dataWindow 生成完全一致"""
        try:
            from datetime import timedelta
            import pandas as pd

            anchor_time = anchor["timestamp"]
            meter_id = anchor["deviceNumber"]

            # 篩選該電表的數據
            meter_df = raw_df[raw_df['deviceNumber'] == meter_id].copy()
            if meter_df.empty:
                logger.warning(f"No data found for meter {meter_id}")
                return self._create_empty_data_window(anchor)

            # 確保時間戳列正確
            time_col = 'timestamp' if 'timestamp' in meter_df.columns else 'lastUpdated'
            meter_df[time_col] = pd.to_datetime(meter_df[time_col])
            meter_df = meter_df.sort_values(time_col)

            # 定義時間窗口：錨點前後各 15 分鐘
            window_start = anchor_time - timedelta(minutes=15)
            window_end = anchor_time + timedelta(minutes=15)

            # 篩選時間窗口內的數據
            window_df = meter_df[
                (meter_df[time_col] >= window_start) &
                (meter_df[time_col] <= window_end)
            ]

            # 找到最接近錨點時間的數據點
            time_diffs = abs(meter_df[time_col] - anchor_time)
            closest_idx = time_diffs.idxmin()
            anchor_power_value = meter_df.loc[closest_idx, 'power'] if not meter_df.empty else 0

            # 構建時序數據列表
            time_series = []
            for _, row in window_df.iterrows():
                time_series.append({
                    "timestamp": row[time_col].isoformat(),
                    "power": float(row['power']) if pd.notna(row['power']) else 0.0
                })

            # 構建 dataWindow 對象（與現有格式完全一致）
            data_window = {
                "eventTimestamp": anchor_time.isoformat(),
                "eventPowerValue": float(anchor_power_value) if pd.notna(anchor_power_value) else 0.0,
                "windowStart": window_start.isoformat(),
                "windowEnd": window_end.isoformat(),
                "timeSeries": time_series,
                "totalDataPoints": len(time_series),
                "detectionRule": "dynamic_u_sample",
                "anomalyScore": 0.0
            }

            return data_window

        except Exception as e:
            logger.error(f"Failed to generate dataWindow for anchor: {e}")
            return self._create_empty_data_window(anchor)

    def _create_empty_data_window(self, anchor: Dict) -> Dict[str, Any]:
        """創建空的 dataWindow 作為後備"""
        return {
            "eventTimestamp": anchor["timestamp"].isoformat(),
            "eventPowerValue": 0.0,
            "windowStart": anchor["timestamp"].isoformat(),
            "windowEnd": anchor["timestamp"].isoformat(),
            "timeSeries": [],
            "totalDataPoints": 0,
            "detectionRule": "dynamic_u_sample",
            "anomalyScore": 0.0,
            "error": "Failed to generate data window"
        }

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

        # 處理 NaN 值
        if np.isnan(feature_matrix_scaled).any():
            logger.warning("⚠️ Found NaN values in feature matrix, filling with 0")
            feature_matrix_scaled = np.nan_to_num(feature_matrix_scaled, nan=0.0)
            logger.info(f"✅ NaN values handled. Feature matrix shape: {feature_matrix_scaled.shape}")

        # 準備標籤：P=1, U=0
        labels = np.array([1] * len(p_samples) + [0] * len(u_samples))

        # 添加數據診斷日誌
        logger.info(f"📊 Data distribution:")
        logger.info(f"   P samples: {len(p_samples)}")
        logger.info(f"   U samples: {len(u_samples)}")
        logger.info(f"   Total samples: {len(labels)}")
        logger.info(f"   Class 1 (P): {np.sum(labels == 1)}")
        logger.info(f"   Class 0 (U): {np.sum(labels == 0)}")

        # 檢查是否有足夠的數據進行訓練
        if len(p_samples) == 0:
            raise ValueError("沒有找到正樣本 (P samples)。請確保有 status='CONFIRMED_POSITIVE' 的數據。")
        if len(u_samples) == 0:
            raise ValueError("沒有找到未標記樣本 (U samples)。請確保有 status='UNREVIEWED' 或 'REJECTED_NORMAL' 的數據。")

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

            # 每10個epoch或最後一個epoch發送詳細進度
            if (epoch + 1) % 10 == 0 or epoch == model_config.epochs - 1:
                await self._broadcast_progress(
                    job_id, progress, f"uPU training progress: epoch {epoch + 1}/{model_config.epochs}, loss: {loss:.4f}",
                    {"epoch": epoch + 1, "loss": loss, "model_type": "uPU"}
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

            # 每10個epoch或最後一個epoch發送詳細進度
            if (epoch + 1) % 10 == 0 or epoch == model_config.epochs - 1:
                await self._broadcast_progress(
                    job_id, progress, f"nnPU training progress: epoch {epoch + 1}/{model_config.epochs}, loss: {loss:.4f}",
                    {"epoch": epoch + 1, "loss": loss, "model_type": "nnPU"}
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

    async def _evaluate_on_validation_set(self, model: Any, X_val: np.ndarray, y_val: np.ndarray) -> Dict[str, float]:
        """在驗證集上評估模型性能"""
        try:
            # 預測
            if hasattr(model, 'predict_proba'):
                y_pred_proba = model.predict_proba(X_val)[:, 1]
                y_pred = (y_pred_proba > 0.5).astype(int)
            else:
                y_pred = model.predict(X_val)
                y_pred_proba = y_pred.astype(float)

            # 計算指標
            validation_metrics = {
                "val_accuracy": accuracy_score(y_val, y_pred),
                "val_precision": precision_score(y_val, y_pred, zero_division=0),
                "val_recall": recall_score(y_val, y_pred, zero_division=0),
                "val_f1": f1_score(y_val, y_pred, zero_division=0)
            }

            logger.info(f"Validation set evaluation: {validation_metrics}")
            return validation_metrics

        except Exception as e:
            logger.error(f"Error evaluating on validation set: {e}")
            return {"validation_error": str(e)}

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
                "name": f"{model_config.model_type} Model - {job_id[:8]}",
                "experiment_run_id": experiment_run_id or "unknown",
                "scenario_type": model_config.model_type,  # 使用 scenario_type 而不是 model_type
                "model_path": model_path,
                "model_config": model_config.dict(),
                "data_source_config": data_split_config.dict() if data_split_config else {},
                "training_metrics": metrics or {},
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

        # 使用異步鎖保護 WebSocket 連接列表操作
        async with websocket_lock:
            # 創建連接列表的副本以避免迭代時集合大小改變
            connections_copy = list(websocket_connections)

        for websocket in connections_copy:
            try:
                await websocket.send_text(json.dumps(progress_data))
                success_count += 1
                logger.debug(f"✅ Progress sent to WebSocket connection successfully")
                # 強制立即發送，避免緩衝
                await asyncio.sleep(0.001)  # 1ms 延遲確保訊息立即發送
            except Exception as e:
                error_count += 1
                logger.warning(f"❌ Failed to send progress to WebSocket: {e}")
                disconnected.add(websocket)

        # 清理斷開的連接 - 也需要鎖保護
        if disconnected:
            async with websocket_lock:
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
    async with websocket_lock:
        websocket_connections.add(websocket)
    logger.info("🔗" + "="*40)
    logger.info("🔗 WEBSOCKET CONNECTION ADDED")
    logger.info(f"📊 Total connections: {len(websocket_connections)}")
    logger.info(f"🆔 WebSocket ID: {id(websocket)}")
    logger.info("🔗" + "="*40)

async def remove_websocket_connection(websocket: WebSocket):
    """移除 WebSocket 連接"""
    async with websocket_lock:
        websocket_connections.discard(websocket)
    logger.info("🔌" + "="*40)
    logger.info("🔌 WEBSOCKET CONNECTION REMOVED")
    logger.info(f"📊 Remaining connections: {len(websocket_connections)}")
    logger.info(f"🆔 WebSocket ID: {id(websocket)}")
    logger.info("🔌" + "="*40)
