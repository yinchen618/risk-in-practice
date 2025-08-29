"""
Model Trainer Service
Handles Stage 3: Model Training with real-time logging
Uses shared model definitions for consistency with evaluator
"""

import asyncio
import logging
from datetime import datetime, timedelta, timezone
from typing import Dict, Any
import random
import pickle
import os
import numpy as np

from .models import StartTrainingJobRequest
from .database import DatabaseManager
from .data_preprocessing_pipeline import DataPreprocessingPipeline
from .shared_models import LSTMPULearningModel, extract_temporal_features, get_feature_names

logger = logging.getLogger(__name__)

# 台灣時區設定 (UTC+8)
TAIWAN_TZ = timezone(timedelta(hours=8))

def get_taiwan_time() -> datetime:
    """取得台灣時間"""
    return datetime.now(TAIWAN_TZ)

class ModelTrainer:
    def __init__(self, db_manager: DatabaseManager):
        self.db_manager = db_manager
        self._last_best_f1_score = 0.0  # Track the best F1 score from training
        self._training_metrics = {}  # Store actual training metrics
        self._preprocessing_pipeline = None  # Store the preprocessing pipeline

    async def train_model(self, job_id: str, trained_model_id: str, config: StartTrainingJobRequest, training_data_info: dict = None):
        """
        Train a PU learning model
        """
        logger.info("="*80)
        logger.info(f"🚀 STARTING TRAINING JOB: {job_id}")
        logger.info(f"   🆔 Model ID: {trained_model_id}")
        logger.info(f"   📋 Model Name: {config.model_name}")
        logger.info(f"   🎯 Model Type: {config.training_config.modelType}")
        logger.info("="*80)

        try:
            # Update model status to running
            await self.db_manager.update_trained_model(trained_model_id, 'RUNNING')
            logger.info(f"✅ Model status updated to RUNNING")

            # Real training process
            await self._real_training_process(job_id, trained_model_id, config, training_data_info)

            # Generate comprehensive metrics
            training_metrics = await self._generate_training_metrics(config)
            validation_metrics = await self._generate_validation_metrics(config)
            model_path = await self._save_model_artifact(trained_model_id, config)

            await self.db_manager.update_trained_model(
                trained_model_id,
                'COMPLETED',
                model_path=model_path,
                training_metrics=training_metrics,
                validation_metrics=validation_metrics,  # 新增驗證指標
                training_data_info=training_data_info,  # 保存訓練資料統計
                completed_at=get_taiwan_time()
            )

            logger.info("="*80)
            logger.info(f"✅ TRAINING JOB COMPLETED SUCCESSFULLY: {job_id}")
            logger.info(f"   🎯 Final F1 Score: {self._last_best_f1_score:.4f}")
            logger.info(f"   📁 Model saved to: {model_path}")
            logger.info("="*80)

        except Exception as e:
            logger.error("="*80)
            logger.error(f"❌ TRAINING JOB FAILED: {job_id}")
            logger.error(f"   🚨 Error: {str(e)}")
            logger.error("="*80)
            await self.db_manager.update_trained_model(trained_model_id, 'FAILED')

    async def _real_training_process(self, job_id: str, model_id: str, config: StartTrainingJobRequest, training_data_info: dict = None):
        """Real PU Learning training process with proper time-series handling and LSTM architecture"""
        logger.info("🔬 STARTING REAL TRAINING PROCESS (TIME-SERIES CORRECTED)")
        logger.info(f"   🆔 Job ID: {job_id}")
        logger.info(f"   🧠 Model ID: {model_id}")
        logger.info("   🚨 FIXES: Time-based split + LSTM architecture")
        logger.info("-"*60)

        import sqlite3
        import json
        import numpy as np
        import torch
        import torch.nn as nn
        import torch.optim as optim
        from sklearn.preprocessing import StandardScaler
        from sklearn.metrics import f1_score, precision_score, recall_score
        import pandas as pd
        from datetime import datetime, timedelta

        # 1. 資料載入 - 從資料庫獲取實際訓練資料
        logger.info("📂 Loading training data from database...")
        db_path = '/home/infowin/Git-projects/pu-in-practice/backend/database/prisma/pu_practice.db'
        conn = sqlite3.connect(db_path)
        logger.info(f"   🔗 Connected to database: {db_path}")

        try:
            # 取得實驗資料
            cursor = conn.cursor()

            # 從 training_data_info 獲取資料來源配置
            if training_data_info:
                positive_dataset_ids = training_data_info.get('p_data_sources', {}).get('dataset_ids', [])
                unlabeled_dataset_ids = training_data_info.get('u_data_sources', {}).get('dataset_ids', [])
                split_ratios = training_data_info.get('split_ratios', {'train': 0.7, 'validation': 0.2, 'test': 0.1})
                u_sample_ratio = training_data_info.get('u_sample_ratio', 0.1)
            else:
                positive_dataset_ids = []
                unlabeled_dataset_ids = []
                split_ratios = {'train': 0.7, 'validation': 0.2, 'test': 0.1}
                u_sample_ratio = 0.1

            # 載入正樣本資料 - 保留時間戳
            positive_data = []
            if positive_dataset_ids:
                logger.info(f"📊 Loading positive samples from datasets: {positive_dataset_ids}")
                for dataset_id in positive_dataset_ids:
                    cursor.execute('''
                        SELECT timestamp, wattage_total, wattage_110v, wattage_220v, raw_wattage_l1, raw_wattage_l2
                        FROM analysis_ready_data
                        WHERE dataset_id = ? AND is_positive_label = 1
                        ORDER BY timestamp
                    ''', (dataset_id,))
                    rows = cursor.fetchall()
                    dataset_positive_count = len(rows)
                    logger.info(f"  📈 Dataset {dataset_id}: {dataset_positive_count} positive samples")
                    for row in rows:
                        # 保留時間戳：[timestamp, features..., label]
                        positive_data.append([row[0], row[1], row[2], row[3], row[4], row[5], 1])  # 包含 timestamp

            # 載入未標記資料 (作為負樣本) - 保留時間戳
            unlabeled_data = []
            if unlabeled_dataset_ids:
                logger.info(f"📊 Loading unlabeled samples from datasets: {unlabeled_dataset_ids}")
                logger.info(f"  🎯 U-sample ratio: {u_sample_ratio}")
                for dataset_id in unlabeled_dataset_ids:
                    sample_limit = int(10000 * u_sample_ratio)
                    logger.info(f"  📉 Dataset {dataset_id}: sampling up to {sample_limit} unlabeled samples")
                    cursor.execute('''
                        SELECT timestamp, wattage_total, wattage_110v, wattage_220v, raw_wattage_l1, raw_wattage_l2
                        FROM analysis_ready_data
                        WHERE dataset_id = ? AND (is_positive_label = 0 OR is_positive_label IS NULL)
                        ORDER BY timestamp
                        LIMIT ?
                    ''', (dataset_id, sample_limit))
                    rows = cursor.fetchall()
                    dataset_unlabeled_count = len(rows)
                    logger.info(f"  📉 Dataset {dataset_id}: {dataset_unlabeled_count} unlabeled samples loaded")
                    for row in rows:
                        # 保留時間戳：[timestamp, features..., label]
                        unlabeled_data.append([row[0], row[1], row[2], row[3], row[4], row[5], 0])  # 包含 timestamp


            if len(positive_data) == 0 or len(unlabeled_data) == 0:
                raise Exception("Insufficient training data: need both positive and unlabeled samples")

            logger.info(f"📊 Data Summary:")
            logger.info(f"  ✅ Positive samples: {len(positive_data)}")
            logger.info(f"  ❓ Unlabeled samples: {len(unlabeled_data)}")
            logger.info(f"  📏 Total samples: {len(positive_data) + len(unlabeled_data)}")
            logger.info(f"  🎯 Class balance: P={len(positive_data)/(len(positive_data)+len(unlabeled_data)):.3f}, U={len(unlabeled_data)/(len(positive_data)+len(unlabeled_data)):.3f}")

            # 2. 資料預處理 - 使用統一的資料處理管道並保持時間順序
            logger.info("🔧 Starting data preprocessing with unified pipeline (time-aware)...")

            # 🚨 關鍵修正：合併資料時保留時間戳，然後按時間排序
            logger.info("  📅 Combining data and preserving temporal order...")
            all_data = positive_data + unlabeled_data

            # 創建包含時間戳的 DataFrame
            df = pd.DataFrame(all_data, columns=[
                'timestamp', 'wattage_total', 'wattage_110v', 'wattage_220v', 'raw_l1', 'raw_l2', 'label'
            ])
            logger.info(f"  📋 Combined dataframe shape: {df.shape}")

            # 將時間戳轉換為 datetime 格式
            df['timestamp'] = pd.to_datetime(df['timestamp'])

            # 🚨 最關鍵步驟：嚴格按時間戳排序，恢復正確的時間序列順序
            logger.info("  ⏰ CRITICAL: Sorting data by timestamp to preserve sequence for LSTM...")
            df_before_sort = df.copy()
            df = df.sort_values(by='timestamp').reset_index(drop=True)

            # 驗證排序效果
            time_span = df['timestamp'].max() - df['timestamp'].min()
            logger.info(f"  ✅ Data sorted successfully:")
            logger.info(f"    📅 Time range: {df['timestamp'].min()} to {df['timestamp'].max()}")
            logger.info(f"    ⏱️ Total time span: {time_span}")
            logger.info(f"    🔢 Sample count: {len(df)}")

            # 檢查排序前後的差異
            position_changes = (df_before_sort.index != df.index).sum()
            logger.info(f"    🔄 Rows reordered: {position_changes} out of {len(df)}")

            if position_changes > 0:
                logger.info(f"    ⚠️ Data was NOT in chronological order - fixed by sorting")
            else:
                logger.info(f"    ✅ Data was already in chronological order")

            # 處理缺失值
            missing_before = df.isnull().sum().sum()
            df = df.fillna(0)
            missing_after = df.isnull().sum().sum()
            logger.info(f"  🧹 Missing values handled: {missing_before} → {missing_after}")

            # 🚨 修正：改進的時間分割策略 - 確保 P 和 U 樣本在所有分割中都有合理分佈
            logger.info("🔥 CRITICAL FIX: Improved time-based split with balanced P/U distribution")
            logger.info("  📅 Performing separate time-based split for P and U samples...")

            # 獲取分割比例
            train_ratio = split_ratios['train']
            val_ratio = split_ratios['validation']
            test_ratio = split_ratios['test']

            # 1. 分別處理 P 和 U 樣本
            p_df = df[df['label'] == 1].copy()  # 正樣本
            u_df = df[df['label'] == 0].copy()  # 未標記樣本

            logger.info(f"  📊 Sample distribution before split:")
            logger.info(f"    ✅ Positive samples: {len(p_df)}")
            logger.info(f"    ❓ Unlabeled samples: {len(u_df)}")

            # 2. 對 P 樣本進行時間分割
            p_total = len(p_df)
            p_train_end = int(p_total * train_ratio)
            p_val_end = int(p_total * (train_ratio + val_ratio))

            p_train_df = p_df.iloc[:p_train_end].copy()
            p_val_df = p_df.iloc[p_train_end:p_val_end].copy()
            p_test_df = p_df.iloc[p_val_end:].copy()

            # 3. 對 U 樣本進行時間分割
            u_total = len(u_df)
            u_train_end = int(u_total * train_ratio)
            u_val_end = int(u_total * (train_ratio + val_ratio))

            u_train_df = u_df.iloc[:u_train_end].copy()
            u_val_df = u_df.iloc[u_train_end:u_val_end].copy()
            u_test_df = u_df.iloc[u_val_end:].copy()

            # 4. 合併成最終的數據集，保持時間順序
            train_df = pd.concat([p_train_df, u_train_df]).sort_values(by='timestamp').reset_index(drop=True)
            val_df = pd.concat([p_val_df, u_val_df]).sort_values(by='timestamp').reset_index(drop=True)
            test_df = pd.concat([p_test_df, u_test_df]).sort_values(by='timestamp').reset_index(drop=True)

            logger.info(f"  📊 Improved time-based split completed:")
            logger.info(f"    🏋️ Training data: {len(train_df)} samples ({len(p_train_df)} pos, {len(u_train_df)} unlab)")
            logger.info(f"      📅 Time range: {train_df['timestamp'].min()} to {train_df['timestamp'].max()}")
            logger.info(f"    🎯 Validation data: {len(val_df)} samples ({len(p_val_df)} pos, {len(u_val_df)} unlab)")
            logger.info(f"      📅 Time range: {val_df['timestamp'].min()} to {val_df['timestamp'].max()}")
            logger.info(f"    🧪 Test data: {len(test_df)} samples ({len(p_test_df)} pos, {len(u_test_df)} unlab)")
            logger.info(f"      📅 Time range: {test_df['timestamp'].min()} to {test_df['timestamp'].max()}")

            # 5. 驗證分割品質
            logger.info(f"  🔍 Split quality verification:")
            logger.info(f"    📊 Training set: P={len(p_train_df)/(len(p_train_df)+len(u_train_df)):.3f}, U={len(u_train_df)/(len(p_train_df)+len(u_train_df)):.3f}")
            logger.info(f"    📊 Validation set: P={len(p_val_df)/(len(p_val_df)+len(u_val_df)):.3f}, U={len(u_val_df)/(len(p_val_df)+len(u_val_df)):.3f}")
            logger.info(f"    📊 Test set: P={len(p_test_df)/(len(p_test_df)+len(u_test_df)):.3f}, U={len(u_test_df)/(len(p_test_df)+len(u_test_df)):.3f}")
            logger.info(f"    ✅ All splits now contain both P and U samples for meaningful nnPU evaluation!")

            # 2. 對每個分割分別進行特徵工程（避免洩漏）- 使用共享函數確保一致性
            window_size = config.training_config.windowSize
            logger.info(f"  🔧 Applying temporal feature engineering separately to each split...")

            X_train, y_train, train_timestamps = extract_temporal_features(train_df, window_size, "training")
            X_val, y_val, val_timestamps = extract_temporal_features(val_df, window_size, "validation")
            X_test, y_test, test_timestamps = extract_temporal_features(test_df, window_size, "test")

            # 檢查是否有足夠的特徵數據
            if len(X_train) == 0 or len(X_val) == 0 or len(X_test) == 0:
                raise Exception("Insufficient data after feature engineering. Consider reducing window_size or increasing dataset size.")

            # 3. 標準化：在訓練集上 fit，在所有集合上 transform
            logger.info("  🔧 Applying StandardScaler (fit on train, transform on all)...")

            # 創建並配置預處理管道
            preprocessing_pipeline = DataPreprocessingPipeline(
                window_config={
                    "main_window_minutes": config.training_config.windowSize * 5,
                    "short_window_minutes": config.training_config.windowSize * 2,
                    "medium_window_minutes": config.training_config.windowSize * 5,
                    "long_window_minutes": config.training_config.windowSize * 10
                }
            )
            self._preprocessing_pipeline = preprocessing_pipeline

            # 初始化並擬合 StandardScaler（只在訓練集上）
            scaler = StandardScaler()
            X_train_scaled = scaler.fit_transform(X_train)
            X_val_scaled = scaler.transform(X_val)
            X_test_scaled = scaler.transform(X_test)

            # 保存 scaler 到預處理管道
            preprocessing_pipeline.scaler = scaler
            preprocessing_pipeline.is_fitted = True

            logger.info(f"  📊 Feature scaling completed:")
            logger.info(f"    🏋️ Training: {X_train_scaled.shape} (scaled means: {np.mean(X_train_scaled, axis=0)[:4]}...)")
            logger.info(f"    🎯 Validation: {X_val_scaled.shape}")
            logger.info(f"    🧪 Test: {X_test_scaled.shape}")
            logger.info(f"    ⚠️ NO DATA LEAKAGE: Scaler fitted only on training data")

            logger.info(f"  📊 Data split summary:")
            logger.info(f"    🏋️ Training set: {X_train_scaled.shape[0]} samples ({np.sum(y_train==1)} pos, {np.sum(y_train==0)} unlab)")
            logger.info(f"    🎯 Validation set: {X_val_scaled.shape[0]} samples ({np.sum(y_val==1)} pos, {np.sum(y_val==0)} unlab)")
            logger.info(f"    🧪 Test set: {X_test_scaled.shape[0]} samples ({np.sum(y_test==1)} pos, {np.sum(y_test==0)} unlab)")

            # 4. 建立 LSTM 模型（修正：從 MLP 改為真正的 LSTM）
            logger.info("🧠 Building LSTM model for time-series PU Learning...")
            logger.info(f"  � ARCHITECTURE FIX: Using LSTM instead of MLP")
            logger.info(f"  �🔧 Model configuration:")
            logger.info(f"    📏 Input size: {X_train_scaled.shape[1]}")
            logger.info(f"    🧩 Hidden size: {config.training_config.hiddenSize}")
            logger.info(f"    🏗️ LSTM layers: {config.training_config.numLayers}")
            logger.info(f"    💧 Dropout rate: {config.training_config.dropout}")
            logger.info(f"    🎯 Optimizer: {config.training_config.optimizer}")
            logger.info(f"    📈 Learning rate: {config.training_config.learningRate}")
            logger.info(f"    🔒 L2 regularization: {config.training_config.l2Regularization}")
            logger.info(f"    🎲 Batch size: {config.training_config.batchSize}")
            logger.info(f"    🔄 Max epochs: {config.training_config.epochs}")
            logger.info(f"    ⏰ Early stopping: {config.training_config.earlyStopping} (patience: {config.training_config.patience})")

            # 創建 LSTM 模型 (使用共享定義確保與評估器一致)
            model = LSTMPULearningModel(
                input_size=X_train_scaled.shape[1],
                hidden_size=config.training_config.hiddenSize,
                num_layers=config.training_config.numLayers,
                dropout=config.training_config.dropout
            )

            logger.info(f"  ✅ Enhanced LSTM Model created successfully")
            logger.info(f"    🧠 Architecture: {X_train_scaled.shape[1]} features → Batch Norm → LSTM({config.training_config.hiddenSize}×{config.training_config.numLayers}) → FC({config.training_config.hiddenSize//2}) → FC(1)")
            logger.info(f"    📊 Total parameters: {sum(p.numel() for p in model.parameters()):,}")
            logger.info(f"    🔧 Enhancements: Batch normalization, two-layer classifier, Xavier initialization")

            # 移動模型到適當的設備
            device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
            model = model.to(device)
            logger.info(f"    🖥️ Model running on: {device}")

            # 設定優化器
            if config.training_config.optimizer == 'adam':
                optimizer = optim.Adam(model.parameters(), lr=config.training_config.learningRate,
                                     weight_decay=config.training_config.l2Regularization)
            elif config.training_config.optimizer == 'sgd':
                optimizer = optim.SGD(model.parameters(), lr=config.training_config.learningRate,
                                    weight_decay=config.training_config.l2Regularization, momentum=0.9)
            else:
                optimizer = optim.Adam(model.parameters(), lr=config.training_config.learningRate)

            # nnPU Learning 損失函數實現
            logger.info("🧬 Setting up nnPU (non-negative PU Learning) loss function...")
            class_prior = config.training_config.classPrior  # π (class prior)
            logger.info(f"  🎯 Class prior (π): {class_prior}")
            logger.info(f"  📊 This means we estimate {class_prior*100:.1f}% of unlabeled data are positive")

            def nnpu_loss(outputs, labels, positive_mask, unlabeled_mask, beta=0.0):
                """
                nnPU Loss Implementation
                Based on: "Positive-Unlabeled Learning with Non-Negative Risk Estimator" (Kiryo et al., 2017)

                Args:
                    outputs: Model predictions (sigmoid output)
                    labels: True labels (1 for positive, 0 for unlabeled)
                    positive_mask: Boolean mask for positive samples
                    unlabeled_mask: Boolean mask for unlabeled samples
                    beta: Non-negative coefficient (0 for nnPU, >0 for regularization)
                """
                sigmoid_loss = nn.BCELoss(reduction='none')

                # Positive risk: E_p[l(f(x), +1)]
                if positive_mask.sum() > 0:
                    positive_loss = sigmoid_loss(outputs[positive_mask], torch.ones_like(outputs[positive_mask]))
                    positive_risk = positive_loss.mean()
                else:
                    # ✅ 修正：使用 zeros_like 確保計算圖連接和設備一致性
                    positive_risk = torch.zeros_like(outputs.mean())

                # Unlabeled risk components
                if unlabeled_mask.sum() > 0:
                    unlabeled_outputs = outputs[unlabeled_mask]

                    # E_u[l(f(x), -1)]
                    negative_loss_on_unlabeled = sigmoid_loss(unlabeled_outputs, torch.zeros_like(unlabeled_outputs))
                    negative_risk_unlabeled = negative_loss_on_unlabeled.mean()

                    # E_u[l(f(x), +1)]
                    positive_loss_on_unlabeled = sigmoid_loss(unlabeled_outputs, torch.ones_like(unlabeled_outputs))
                    positive_risk_unlabeled = positive_loss_on_unlabeled.mean()
                else:
                    # ✅ 修正：使用 zeros_like 確保計算圖連接和設備一致性
                    negative_risk_unlabeled = torch.zeros_like(outputs.mean())
                    positive_risk_unlabeled = torch.zeros_like(outputs.mean())

                # nnPU risk estimate
                pu_risk = class_prior * positive_risk + negative_risk_unlabeled - class_prior * positive_risk_unlabeled

                # Non-negative constraint
                # ✅ 最終修正：確保 beta 檢查也是張量操作
                beta_tensor = torch.zeros_like(outputs.mean()) + beta
                negative_risk_condition = pu_risk < -beta_tensor

                # 使用 torch.where 進行條件選擇，保持計算圖完整性
                final_risk = torch.where(
                    negative_risk_condition,
                    class_prior * positive_risk + beta_tensor,  # 當風險過負時
                    pu_risk  # 正常情況
                )

                return final_risk


            # 5. 實際訓練過程（使用時間分割的數據）

            # 轉換為 PyTorch tensors 並移動到設備（使用正確分割的數據）
            X_train_tensor = torch.FloatTensor(X_train_scaled).to(device)
            y_train_tensor = torch.FloatTensor(y_train).unsqueeze(1).to(device)
            X_val_tensor = torch.FloatTensor(X_val_scaled).to(device)
            y_val_tensor = torch.FloatTensor(y_val).unsqueeze(1).to(device)

            best_val_f1 = 0.0
            patience_counter = 0
            training_start_time = get_taiwan_time()

            logger.info("🚀 Starting nnPU Learning training with Enhanced LSTM...")
            logger.info(f"  ⏰ Training started at: {training_start_time.strftime('%Y-%m-%d %H:%M:%S')}")
            logger.info(f"  🖥️ Training device: {device}")
            logger.info("  🧬 Using nnPU (non-negative PU Learning) loss function")
            logger.info("  🏗️ Architecture: LSTM-based time-series model")
            logger.info("  🚨 DATA INTEGRITY: Time-based split prevents data leakage")
            logger.info("  🎯 Monitoring metric: Validation F1 Score (for early stopping and model checkpointing)")
            logger.info("  📊 Format: Epoch X/Y - nnPU Loss: X.XXX, Val Loss: X.X, Val F1: X.XX")
            logger.info("-" * 80)

            # 記錄訓練指標
            training_history = {
                'train_losses': [],
                'val_losses': [],
                'val_f1_scores': [],
                'val_precisions': [],
                'val_recalls': [],
                'epochs_trained': 0,
                'early_stopped': False,
                'best_epoch': 0,
                'nnpu_risks': [],  # 記錄 nnPU risk
                'negative_risks': []  # 記錄負風險事件
            }

            for epoch in range(1, config.training_config.epochs + 1):
                # 訓練模式
                model.train()
                epoch_train_loss = 0.0
                epoch_negative_risks = 0  # 計算負風險發生次數
                batch_size = config.training_config.batchSize

                # Mini-batch 訓練
                for i in range(0, len(X_train_tensor), batch_size):
                    batch_X = X_train_tensor[i:i+batch_size]
                    batch_y = y_train_tensor[i:i+batch_size]

                    optimizer.zero_grad()
                    outputs = model(batch_X)

                    # nnPU Learning 損失計算
                    positive_mask = (batch_y == 1).squeeze()
                    unlabeled_mask = (batch_y == 0).squeeze()

                    # 計算 nnPU loss
                    nnpu_risk = nnpu_loss(outputs, batch_y, positive_mask, unlabeled_mask, beta=0.0)

                    # 檢查是否發生負風險
                    if nnpu_risk < 0:
                        epoch_negative_risks += 1

                    nnpu_risk.backward()
                    optimizer.step()
                    epoch_train_loss += nnpu_risk.item()

                avg_train_loss = epoch_train_loss / (len(X_train_tensor) // batch_size + 1)

                # 驗證
                model.eval()
                with torch.no_grad():
                    val_outputs = model(X_val_tensor)

                    # 計算驗證損失 - 使用 nnPU loss
                    positive_mask_val = (y_val_tensor == 1).squeeze()
                    unlabeled_mask_val = (y_val_tensor == 0).squeeze()
                    val_nnpu_risk = nnpu_loss(val_outputs, y_val_tensor, positive_mask_val, unlabeled_mask_val, beta=0.0)

                    # 計算 F1 分數和其他指標
                    # 注意：在 PU Learning 中，我們只能在「標記為正」的樣本上計算真實的性能指標
                    # 對於未標記樣本，我們不知道真實標籤，所以 F1 分數是一個近似值
                    val_pred = (val_outputs > 0.5).float()
                    val_pred_np = val_pred.cpu().numpy().flatten()
                    y_val_np = y_val_tensor.cpu().numpy().flatten()

                    # 只在已知標籤的樣本上計算指標（正樣本）
                    known_positive_mask = y_val_np == 1
                    if known_positive_mask.sum() > 0:
                        # 正樣本的召回率（多少正樣本被正確識別）
                        true_positive_recall = np.mean(val_pred_np[known_positive_mask])

                        # 整體 F1（包含未標記樣本的近似計算）
                        val_f1 = f1_score(y_val_np, val_pred_np, zero_division=0)
                        val_precision = precision_score(y_val_np, val_pred_np, zero_division=0)
                        val_recall = recall_score(y_val_np, val_pred_np, zero_division=0)
                    else:
                        true_positive_recall = 0.0
                        val_f1 = 0.0
                        val_precision = 0.0
                        val_recall = 0.0

                # 檢查是否為最佳模型（基於 F1 分數）
                is_best = val_f1 > best_val_f1
                if is_best:
                    best_val_f1 = val_f1
                    patience_counter = 0
                    training_history['best_epoch'] = epoch
                    # 保存最佳模型
                    best_model_state = model.state_dict().copy()
                else:
                    patience_counter += 1

                # 記錄訓練歷史
                training_history['train_losses'].append(avg_train_loss)
                training_history['val_losses'].append(val_nnpu_risk.item())
                training_history['val_f1_scores'].append(val_f1)
                training_history['val_precisions'].append(val_precision)
                training_history['val_recalls'].append(val_recall)
                training_history['epochs_trained'] = epoch
                training_history['nnpu_risks'].append(avg_train_loss)
                training_history['negative_risks'].append(epoch_negative_risks)

                # 記錄訓練進度 - nnPU Learning 專用格式
                best_indicator = " 🌟 (New best!)" if is_best else ""
                negative_risk_indicator = f" ⚠️ ({epoch_negative_risks} neg.risks)" if epoch_negative_risks > 0 else ""

                # 統一的日誌格式：Epoch X/Y - nnPU Loss: X.XXX, Val Loss: X.X, Val F1: X.XX
                logger.info(f"Epoch {epoch:3d}/{config.training_config.epochs} - "
                           f"nnPU Loss: {avg_train_loss:.3f}, "
                           f"Val Loss: {val_nnpu_risk.item():.3f}, "
                           f"Val F1: {val_f1:.3f}{best_indicator}{negative_risk_indicator}")

                # 每 10 個 epoch 或最佳結果時顯示額外詳細信息
                if epoch % 10 == 0 or is_best or epoch <= 5:
                    logger.info(f"  📊 Additional metrics - Precision: {val_precision:.4f}, "
                               f"Recall: {val_recall:.4f}, True Pos Recall: {true_positive_recall:.4f}")
                    logger.info(f"  🧬 nnPU status - Patience: {patience_counter}/{config.training_config.patience}, "
                               f"Class prior: {class_prior}")

                # 早停檢查
                if config.training_config.earlyStopping and patience_counter >= config.training_config.patience:
                    training_history['early_stopped'] = True
                    logger.info(f"⏰ Early stopping triggered at epoch {epoch}")
                    logger.info(f"  🎯 Best validation F1: {best_val_f1:.4f} at epoch {training_history['best_epoch']}")
                    break

            # 載入最佳模型
            if 'best_model_state' in locals():
                model.load_state_dict(best_model_state)
                logger.info(f"✅ Loaded best nnPU model from epoch {training_history['best_epoch']}")

            # 計算訓練完成時間
            training_end_time = get_taiwan_time()
            training_duration = (training_end_time - training_start_time).total_seconds()

            # 分析 nnPU 訓練特性
            total_negative_risks = sum(training_history['negative_risks'])
            avg_negative_risks_per_epoch = total_negative_risks / training_history['epochs_trained'] if training_history['epochs_trained'] > 0 else 0

            logger.info("-" * 80)
            logger.info("🏁 nnPU Learning training completed!")
            logger.info(f"  ⏰ Training duration: {training_duration:.2f} seconds ({training_duration/60:.2f} minutes)")
            logger.info(f"  🔄 Total epochs trained: {training_history['epochs_trained']}")
            logger.info(f"  ⏰ Early stopped: {'Yes' if training_history.get('early_stopped', False) else 'No'}")
            logger.info(f"  🎯 Best validation F1 achieved: {best_val_f1:.4f} at epoch {training_history['best_epoch']}")
            logger.info(f"  🧬 nnPU training analysis:")
            logger.info(f"    ⚠️ Total negative risk events: {total_negative_risks}")
            logger.info(f"    📊 Avg negative risks per epoch: {avg_negative_risks_per_epoch:.1f}")
            logger.info(f"    🎯 Class prior used: {class_prior}")

            # 最終評估 - 在測試集上進行 PU Learning 評估
            logger.info("🧪 Evaluating LSTM nnPU model on test set...")
            model.eval()
            with torch.no_grad():
                X_test_tensor = torch.FloatTensor(X_test_scaled).to(device)
                y_test_tensor = torch.FloatTensor(y_test).unsqueeze(1).to(device)

                test_outputs = model(X_test_tensor)
                test_pred = (test_outputs > 0.5).float()
                test_pred_np = test_pred.cpu().numpy().flatten()
                y_test_np = y_test_tensor.cpu().numpy().flatten()

                # 測試集上的 nnPU loss
                positive_mask_test = (y_test_tensor == 1).squeeze()
                unlabeled_mask_test = (y_test_tensor == 0).squeeze()
                test_nnpu_risk = nnpu_loss(test_outputs, y_test_tensor, positive_mask_test, unlabeled_mask_test, beta=0.0)

                # 標準分類指標（注意：這些指標在 PU Learning 中的解釋需要謹慎）
                final_test_f1 = f1_score(y_test_np, test_pred_np, zero_division=0)
                final_test_precision = precision_score(y_test_np, test_pred_np, zero_division=0)
                final_test_recall = recall_score(y_test_np, test_pred_np, zero_division=0)

                # PU Learning 特定指標
                known_positive_mask_test = y_test_np == 1
                if known_positive_mask_test.sum() > 0:
                    true_positive_recall_test = np.mean(test_pred_np[known_positive_mask_test])
                    # 估計的陽性率（在未標記樣本中）
                    unlabeled_mask_np = y_test_np == 0
                    if unlabeled_mask_np.sum() > 0:
                        estimated_positive_rate_in_unlabeled = np.mean(test_pred_np[unlabeled_mask_np])
                    else:
                        estimated_positive_rate_in_unlabeled = 0.0
                else:
                    true_positive_recall_test = 0.0
                    estimated_positive_rate_in_unlabeled = 0.0

            logger.info("📊 Final nnPU Model Performance:")
            logger.info(f"  🎯 Best Validation F1: {best_val_f1:.4f} (epoch {training_history['best_epoch']})")
            logger.info(f"  🧪 Test nnPU Risk: {test_nnpu_risk.item():.4f}")
            logger.info(f"  📈 Standard metrics (interpret with caution in PU setting):")
            logger.info(f"    🎯 Test F1 Score: {final_test_f1:.4f}")
            logger.info(f"    🎯 Test Precision: {final_test_precision:.4f}")
            logger.info(f"    📊 Test Recall: {final_test_recall:.4f}")
            logger.info(f"  🧬 PU Learning specific metrics:")
            logger.info(f"    ✅ True Positive Recall: {true_positive_recall_test:.4f}")
            logger.info(f"    🔍 Estimated positive rate in unlabeled: {estimated_positive_rate_in_unlabeled:.4f}")
            logger.info(f"    📊 Expected vs Actual: {class_prior:.3f} vs {estimated_positive_rate_in_unlabeled:.3f}")

            # 計算模型大小
            total_params = sum(p.numel() for p in model.parameters())
            trainable_params = sum(p.numel() for p in model.parameters() if p.requires_grad)
            logger.info(f"  🧠 Model parameters: {total_params:,} total, {trainable_params:,} trainable")


            # 保存最佳 F1 分數和完整訓練指標供後續使用
            self._last_best_f1_score = best_val_f1
            self._training_metrics = {
                'training_history': training_history,
                'training_duration': training_duration,
                'final_test_metrics': {
                    'test_f1': final_test_f1,
                    'test_precision': final_test_precision,
                    'test_recall': final_test_recall,
                    'test_nnpu_risk': test_nnpu_risk.item(),
                    'true_positive_recall_test': true_positive_recall_test,
                    'estimated_positive_rate_in_unlabeled': estimated_positive_rate_in_unlabeled,
                    # 🔥 CRITICAL FIX: 保存時間戳信息用於結果分析
                    'test_timestamps': [ts.isoformat() if hasattr(ts, 'isoformat') else str(ts) for ts in test_timestamps],
                    'test_predictions': test_pred_np.tolist(),  # 保存預測結果
                    'test_true_labels': y_test_np.tolist()  # 保存真實標籤
                },
                'data_stats': {
                    'positive_samples': len(positive_data),
                    'unlabeled_samples': len(unlabeled_data),
                    'total_features': X_train_scaled.shape[1],
                    'train_samples': len(X_train_scaled),
                    'val_samples': len(X_val_scaled),
                    'test_samples': len(X_test_scaled),
                    'time_based_split': True,  # 標記使用時間分割
                    'data_leakage_prevented': True,  # 確認無數據洩漏
                    # 添加時間範圍信息
                    'time_ranges': {
                        'train_start': train_df['timestamp'].min().isoformat(),
                        'train_end': train_df['timestamp'].max().isoformat(),
                        'val_start': val_df['timestamp'].min().isoformat(),
                        'val_end': val_df['timestamp'].max().isoformat(),
                        'test_start': test_df['timestamp'].min().isoformat(),
                        'test_end': test_df['timestamp'].max().isoformat(),
                        'total_time_span': (df['timestamp'].max() - df['timestamp'].min()).total_seconds() / 3600  # 小時
                    }
                },
                'model_params': {
                    'total_parameters': sum(p.numel() for p in model.parameters()),
                    'trainable_parameters': sum(p.numel() for p in model.parameters() if p.requires_grad)
                },
                'nnpu_stats': {
                    'class_prior_used': class_prior,
                    'total_negative_risks': total_negative_risks,
                    'avg_negative_risks_per_epoch': avg_negative_risks_per_epoch,
                    'nnpu_method': 'non-negative PU Learning (Kiryo et al., 2017)'
                }
            }

            # 保存模型和預處理器
            logger.info("💾 Saving nnPU model artifacts...")
            model_artifact = {
                'model_state_dict': model.state_dict(),
                'scaler': scaler,
                'model_config': config.training_config.dict(),
                'best_f1_score': best_val_f1,
                'nnpu_class_prior': class_prior,
                'nnpu_method': 'non-negative PU Learning',
                'feature_names': get_feature_names(),  # 使用共享的特徵名稱函數
                'training_stats': {
                    'negative_risk_events': total_negative_risks,
                    'epochs_trained': training_history['epochs_trained'],
                    'early_stopped': training_history['early_stopped']
                }
            }

            # 保存到檔案
            import pickle

            # 使用台灣時間生成檔案名稱
            taiwan_time = get_taiwan_time()
            taiwan_time_str = taiwan_time.strftime("%Y%m%d_%H%M%S")

            model_path = f"/home/infowin/Git-projects/pu-in-practice/backend/trained_models/real_model_{model_id}_{taiwan_time_str}.pkl"
            os.makedirs(os.path.dirname(model_path), exist_ok=True)
            logger.info(f"  📁 Saving to: {model_path}")
            logger.info(f"  🕐 Taiwan time: {taiwan_time.strftime('%Y-%m-%d %H:%M:%S %Z')}")

            with open(model_path, 'wb') as f:
                pickle.dump(model_artifact, f)

            # 檢查檔案大小
            file_size = os.path.getsize(model_path)
            logger.info(f"  📦 Model file size: {file_size:,} bytes ({file_size/1024/1024:.2f} MB)")
            logger.info("✅ Model artifacts saved successfully!")

        except Exception as e:
            logger.error(f"❌ Error during training: {str(e)}")
            logger.error(f"   Error type: {type(e).__name__}")
            import traceback
            logger.error(f"   Traceback: {traceback.format_exc()}")
            raise e

        finally:
            conn.close()
            logger.info("🔌 Database connection closed")

    async def _generate_training_metrics(self, config: StartTrainingJobRequest) -> Dict[str, Any]:
        """Generate training metrics from actual nnPU training results"""
        model_config = config.training_config

        # 使用實際 nnPU 訓練結果
        if hasattr(self, '_training_metrics') and self._training_metrics:
            training_history = self._training_metrics['training_history']
            training_duration = self._training_metrics['training_duration']
            final_test_metrics = self._training_metrics['final_test_metrics']
            data_stats = self._training_metrics['data_stats']
            model_params = self._training_metrics['model_params']
            nnpu_stats = self._training_metrics['nnpu_stats']
        else:
            # 備用方案：如果沒有訓練記錄，使用基本的 F1 分數
            return {
                'best_val_f1_score': self._last_best_f1_score,
                'error': 'nnPU training metrics not available - training may have failed'
            }

        # 計算 nnPU 特定的穩定性指標
        f1_scores = training_history['val_f1_scores']
        nnpu_risks = training_history.get('nnpu_risks', [])
        negative_risks = training_history.get('negative_risks', [])

        if len(f1_scores) > 5:
            recent_f1_std = np.std(f1_scores[-10:])  # 最後10個epoch的標準差
            training_stability = max(0.3, 1.0 - (recent_f1_std * 2))  # nnPU Learning 通常較不穩定
        else:
            training_stability = 0.6

        # nnPU 特定的風險分析
        total_negative_risks = nnpu_stats['total_negative_risks']
        risk_frequency = total_negative_risks / training_history['epochs_trained'] if training_history['epochs_trained'] > 0 else 0

        # 計算過擬合風險（基於 nnPU risk 變化）
        if len(nnpu_risks) > 5:
            final_nnpu_risk = nnpu_risks[-1] if nnpu_risks else 0.5
            initial_nnpu_risk = nnpu_risks[2] if len(nnpu_risks) > 2 else 0.6
            risk_trend = (final_nnpu_risk - initial_nnpu_risk) / initial_nnpu_risk if initial_nnpu_risk != 0 else 0
            overfitting_risk = min(0.9, max(0.1, 0.5 + risk_trend))
        else:
            overfitting_risk = 0.5

        # 獲取最佳驗證指標
        best_epoch = training_history['best_epoch']
        if best_epoch > 0 and best_epoch <= len(f1_scores):
            best_val_f1 = f1_scores[best_epoch - 1]
            best_val_precision = training_history['val_precisions'][best_epoch - 1]
            best_val_recall = training_history['val_recalls'][best_epoch - 1]
            best_val_loss = training_history['val_losses'][best_epoch - 1]
        else:
            best_val_f1 = max(f1_scores) if f1_scores else self._last_best_f1_score
            best_val_precision = max(training_history['val_precisions']) if training_history['val_precisions'] else 0.5
            best_val_recall = max(training_history['val_recalls']) if training_history['val_recalls'] else 0.5
            best_val_loss = min(training_history['val_losses']) if training_history['val_losses'] else 0.5

        # 確保所有數值都是 JSON 可序列化的（轉換 numpy 類型為 Python 原生類型）
        def ensure_json_serializable(value):
            """確保值可以 JSON 序列化"""
            if isinstance(value, (np.integer, np.floating)):
                return float(value)
            elif isinstance(value, np.ndarray):
                return value.tolist()
            elif isinstance(value, list):
                return [ensure_json_serializable(item) for item in value]
            elif isinstance(value, dict):
                return {key: ensure_json_serializable(val) for key, val in value.items()}
            else:
                return value

        return {
            # 最終訓練結果 - 來自實際 nnPU 訓練（確保 JSON 可序列化）
            'final_train_loss': ensure_json_serializable(nnpu_risks[-1] if nnpu_risks else 0.5),
            'final_val_loss': ensure_json_serializable(training_history['val_losses'][-1] if training_history['val_losses'] else 0.5),
            'final_val_f1_score': ensure_json_serializable(f1_scores[-1] if f1_scores else self._last_best_f1_score),
            'final_precision': ensure_json_serializable(training_history['val_precisions'][-1] if training_history['val_precisions'] else 0.5),
            'final_recall': ensure_json_serializable(training_history['val_recalls'][-1] if training_history['val_recalls'] else 0.5),

            # 測試集最終結果 - nnPU 特定指標（確保 JSON 可序列化）
            'final_test_f1_score': ensure_json_serializable(final_test_metrics['test_f1']),
            'final_test_precision': ensure_json_serializable(final_test_metrics['test_precision']),
            'final_test_recall': ensure_json_serializable(final_test_metrics['test_recall']),
            'final_test_nnpu_risk': ensure_json_serializable(final_test_metrics['test_nnpu_risk']),
            'true_positive_recall_test': ensure_json_serializable(final_test_metrics['true_positive_recall_test']),
            'estimated_positive_rate_in_unlabeled': ensure_json_serializable(final_test_metrics['estimated_positive_rate_in_unlabeled']),

            # 最佳驗證指標（確保 JSON 可序列化）
            'best_val_f1_score': ensure_json_serializable(best_val_f1),
            'best_val_loss': ensure_json_serializable(best_val_loss),
            'best_val_precision': ensure_json_serializable(best_val_precision),
            'best_val_recall': ensure_json_serializable(best_val_recall),
            'best_epoch': int(best_epoch),

            # 訓練過程信息 - nnPU 特定
            'training_time_seconds': int(training_duration),
            'total_epochs_trained': int(training_history['epochs_trained']),
            'convergence_epoch': int(best_epoch),
            'early_stopped': bool(training_history['early_stopped']),
            'early_stopping_metric': 'val_f1_score_nnpu',

            # nnPU Learning 特定指標（確保 JSON 可序列化）
            'nnpu_method': str(nnpu_stats['nnpu_method']),
            'class_prior_used': ensure_json_serializable(nnpu_stats['class_prior_used']),
            'total_negative_risk_events': int(nnpu_stats['total_negative_risks']),
            'negative_risk_frequency': ensure_json_serializable(risk_frequency),
            'avg_negative_risks_per_epoch': ensure_json_serializable(nnpu_stats['avg_negative_risks_per_epoch']),

            # 資料統計 - 實際數量
            'positive_samples_estimated': int(data_stats['positive_samples']),
            'unlabeled_samples_used': int(data_stats['unlabeled_samples']),
            'total_training_samples': int(data_stats['train_samples']),
            'total_validation_samples': int(data_stats['val_samples']),
            'total_test_samples': int(data_stats['test_samples']),
            'feature_count': int(data_stats['total_features']),

            # 模型參數統計
            'model_parameters': {
                'total_parameters': int(model_params['total_parameters']),
                'trainable_parameters': int(model_params['trainable_parameters'])
            },

            # 模型超參數
            'hyperparameters': {
                'model_type': str(model_config.modelType) + '_nnPU',  # 標示這是 nnPU 版本
                'hidden_size': int(model_config.hiddenSize),
                'num_layers': int(model_config.numLayers),
                'activation_function': str(model_config.activationFunction),
                'dropout': ensure_json_serializable(model_config.dropout),
                'window_size': int(model_config.windowSize),
                'learning_rate': ensure_json_serializable(model_config.learningRate),
                'batch_size': int(model_config.batchSize),
                'optimizer': str(model_config.optimizer),
                'l2_regularization': ensure_json_serializable(model_config.l2Regularization),
                'early_stopping': bool(model_config.earlyStopping),
                'patience': int(model_config.patience) if model_config.earlyStopping else None,
                'lr_scheduler': str(model_config.learningRateScheduler)
            },

            # 資料配置
            'data_config': {
                'train_ratio': ensure_json_serializable(config.data_source_config.trainRatio),
                'validation_ratio': ensure_json_serializable(config.data_source_config.validationRatio),
                'test_ratio': ensure_json_serializable(config.data_source_config.testRatio),
                'time_range': str(config.data_source_config.timeRange)
            },

            # 性能指標 - 基於 nnPU 訓練計算（確保 JSON 可序列化）
            'training_stability': ensure_json_serializable(training_stability),
            'overfitting_risk': ensure_json_serializable(overfitting_risk),
            'model_complexity_score': ensure_json_serializable(model_params['total_parameters'] / 10000),
            'nnpu_training_quality': ensure_json_serializable(max(0.1, 1.0 - risk_frequency)),  # nnPU 特定的訓練品質指標

            # nnPU 訓練歷史（確保 JSON 可序列化）
            'training_curves': {
                'train_losses': ensure_json_serializable(training_history['train_losses']),
                'val_losses': ensure_json_serializable(training_history['val_losses']),
                'val_f1_scores': ensure_json_serializable(training_history['val_f1_scores']),
                'val_precisions': ensure_json_serializable(training_history['val_precisions']),
                'val_recalls': ensure_json_serializable(training_history['val_recalls']),
                'nnpu_risks': ensure_json_serializable(nnpu_risks),
                'negative_risk_events': ensure_json_serializable(negative_risks)
            },

            # PU Learning 品質評估（確保 JSON 可序列化）
            'pu_learning_assessment': {
                'class_prior_vs_estimated': {
                    'expected': ensure_json_serializable(nnpu_stats['class_prior_used']),
                    'estimated': ensure_json_serializable(final_test_metrics['estimated_positive_rate_in_unlabeled']),
                    'difference': ensure_json_serializable(abs(nnpu_stats['class_prior_used'] - final_test_metrics['estimated_positive_rate_in_unlabeled']))
                },
                'pu_vs_supervised_difference': 'Metrics should be interpreted differently than standard supervised learning',
                'reliability_note': 'F1/Precision/Recall are approximations in PU Learning setting'
            },

            # 時間戳 (使用台灣時間)
            'training_started_at': (get_taiwan_time() - timedelta(seconds=training_duration)).strftime('%Y-%m-%d %H:%M:%S %Z'),
            'training_completed_at': get_taiwan_time().strftime('%Y-%m-%d %H:%M:%S %Z'),
            'training_method': 'nnPU_Learning'
        }

    async def _save_model_artifact(self, model_id: str, config: StartTrainingJobRequest) -> str:
        """Save model artifact with complete preprocessing pipeline to disk"""
        # Create models directory if it doesn't exist
        models_dir = "/home/infowin/Git-projects/pu-in-practice/backend/trained_models"
        os.makedirs(models_dir, exist_ok=True)

        # 使用台灣時間生成檔案名稱
        taiwan_time = get_taiwan_time()
        taiwan_time_str = taiwan_time.strftime("%Y%m%d_%H%M%S")

        # Generate model file path with Taiwan timestamp
        model_filename = f"{config.training_config.modelType}_{model_id}_{taiwan_time_str}.pkl"
        model_path = os.path.join(models_dir, model_filename)

        # 準備完整的模型包裝，包含預處理管道
        model_package = {
            'model_type': config.training_config.modelType,
            'model_id': model_id,
            'config': config.training_config.dict(),
            'created_at': taiwan_time.isoformat(),  # 使用台灣時間

            # 包含完整的預處理管道
            'preprocessing_pipeline': None,
            'pipeline_fitted': False,

            # 模型結構資訊
            'model_architecture': {
                'input_size': 12,  # 更新為新的特徵數量
                'hidden_size': config.training_config.hiddenSize,
                'num_layers': config.training_config.numLayers,
                'dropout': config.training_config.dropout,
                'activation': config.training_config.activationFunction
            },

            # 訓練結果指標
            'training_metrics': self._training_metrics if hasattr(self, '_training_metrics') else {},

            # 版本資訊
            'pipeline_version': '2.0',
            'format_description': 'Complete model package with preprocessing pipeline'
        }

        # 如果有預處理管道，將其序列化並包含
        if self._preprocessing_pipeline is not None:
            logger.info("💾 Saving preprocessing pipeline with model...")
            try:
                model_package['preprocessing_pipeline'] = self._preprocessing_pipeline.save_to_dict()
                model_package['pipeline_fitted'] = True
                logger.info("✅ Preprocessing pipeline saved successfully")
            except Exception as e:
                logger.error(f"❌ Failed to save preprocessing pipeline: {e}")
                model_package['pipeline_error'] = str(e)
        else:
            logger.warning("⚠️ No preprocessing pipeline found to save")

        # 保存完整的模型包裝
        with open(model_path, 'wb') as f:
            pickle.dump(model_package, f)

        logger.info(f"💾 Complete model package saved to: {model_path}")
        logger.info(f"📦 Package includes: model config, preprocessing pipeline, training metrics")

        return model_path

    async def _generate_validation_metrics(self, config: StartTrainingJobRequest) -> Dict[str, Any]:
        """Generate validation and test metrics from actual nnPU training results"""

        # 使用實際 nnPU 訓練結果
        if hasattr(self, '_training_metrics') and self._training_metrics:
            training_history = self._training_metrics['training_history']
            final_test_metrics = self._training_metrics['final_test_metrics']
            data_stats = self._training_metrics['data_stats']
            nnpu_stats = self._training_metrics['nnpu_stats']
        else:
            # 備用方案：如果沒有訓練記錄，返回空指標
            return {
                'error': 'nnPU validation metrics not available - training may have failed'
            }

        # 確保所有數值都是 JSON 可序列化的（轉換 numpy 類型為 Python 原生類型）
        def ensure_json_serializable(value):
            """確保值可以 JSON 序列化"""
            if isinstance(value, (np.integer, np.floating)):
                return float(value)
            elif isinstance(value, np.ndarray):
                return value.tolist()
            elif isinstance(value, list):
                return [ensure_json_serializable(item) for item in value]
            elif isinstance(value, dict):
                return {key: ensure_json_serializable(val) for key, val in value.items()}
            else:
                return value

        # 獲取最佳驗證指標
        f1_scores = training_history['val_f1_scores']
        best_epoch = training_history['best_epoch']

        if best_epoch > 0 and best_epoch <= len(f1_scores):
            best_val_f1 = f1_scores[best_epoch - 1]
            best_val_precision = training_history['val_precisions'][best_epoch - 1]
            best_val_recall = training_history['val_recalls'][best_epoch - 1]
            best_val_loss = training_history['val_losses'][best_epoch - 1]
        else:
            best_val_f1 = max(f1_scores) if f1_scores else self._last_best_f1_score
            best_val_precision = max(training_history['val_precisions']) if training_history['val_precisions'] else 0.5
            best_val_recall = max(training_history['val_recalls']) if training_history['val_recalls'] else 0.5
            best_val_loss = min(training_history['val_losses']) if training_history['val_losses'] else 0.5

        return {
            # 驗證集最佳指標
            'validation_metrics': {
                'best_epoch': int(best_epoch),
                'best_f1_score': ensure_json_serializable(best_val_f1),
                'best_precision': ensure_json_serializable(best_val_precision),
                'best_recall': ensure_json_serializable(best_val_recall),
                'best_loss': ensure_json_serializable(best_val_loss),
                'final_f1_score': ensure_json_serializable(f1_scores[-1] if f1_scores else 0.5),
                'final_precision': ensure_json_serializable(training_history['val_precisions'][-1] if training_history['val_precisions'] else 0.5),
                'final_recall': ensure_json_serializable(training_history['val_recalls'][-1] if training_history['val_recalls'] else 0.5),
                'final_loss': ensure_json_serializable(training_history['val_losses'][-1] if training_history['val_losses'] else 0.5),

                # 驗證集訓練曲線
                'training_curves': {
                    'f1_scores': ensure_json_serializable(training_history['val_f1_scores']),
                    'precisions': ensure_json_serializable(training_history['val_precisions']),
                    'recalls': ensure_json_serializable(training_history['val_recalls']),
                    'losses': ensure_json_serializable(training_history['val_losses'])
                }
            },

            # 測試集最終結果
            'test_metrics': {
                'final_f1_score': ensure_json_serializable(final_test_metrics['test_f1']),
                'final_precision': ensure_json_serializable(final_test_metrics['test_precision']),
                'final_recall': ensure_json_serializable(final_test_metrics['test_recall']),
                'nnpu_risk': ensure_json_serializable(final_test_metrics['test_nnpu_risk']),
                'true_positive_recall': ensure_json_serializable(final_test_metrics['true_positive_recall_test']),
                'estimated_positive_rate_in_unlabeled': ensure_json_serializable(final_test_metrics['estimated_positive_rate_in_unlabeled']),

                # PU Learning 特定評估
                'pu_learning_assessment': {
                    'class_prior_expected': ensure_json_serializable(nnpu_stats['class_prior_used']),
                    'class_prior_estimated': ensure_json_serializable(final_test_metrics['estimated_positive_rate_in_unlabeled']),
                    'prior_estimation_error': ensure_json_serializable(abs(nnpu_stats['class_prior_used'] - final_test_metrics['estimated_positive_rate_in_unlabeled'])),
                    'pu_vs_supervised_note': 'Metrics should be interpreted differently than standard supervised learning',
                    'reliability_note': 'F1/Precision/Recall are approximations in PU Learning setting'
                }
            },

            # 樣本統計
            'sample_statistics': {
                'validation_samples': int(data_stats['val_samples']),
                'test_samples': int(data_stats['test_samples']),
                'positive_samples_in_validation': 'estimated_from_pu_ratio',
                'positive_samples_in_test': 'estimated_from_pu_ratio'
            },

            # nnPU 訓練品質指標
            'nnpu_quality_metrics': {
                'method': str(nnpu_stats['nnpu_method']),
                'class_prior_used': ensure_json_serializable(nnpu_stats['class_prior_used']),
                'negative_risk_events': int(nnpu_stats['total_negative_risks']),
                'training_stability': ensure_json_serializable(max(0.1, 1.0 - (nnpu_stats['avg_negative_risks_per_epoch'] * 2))),
                'convergence_quality': 'early_stopped' if training_history['early_stopped'] else 'completed_all_epochs'
            },

            # 時間戳
            'evaluation_timestamp': get_taiwan_time().strftime('%Y-%m-%d %H:%M:%S %Z'),
            'evaluation_method': 'nnPU_Learning_Validation'
        }
