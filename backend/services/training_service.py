"""
模型訓練服務 - PU Learning 模型訓練的核心邏輯
負責將標註數據轉換為 PU Learning 格式並進行模型訓練
"""

import pandas as pd
import numpy as np
import joblib
import asyncio
import time
import json
from typing import Dict, List, Tuple, Optional, Any, Union
from datetime import datetime
import logging
import os
from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import precision_score, recall_score, f1_score, classification_report
import sys

# 添加 PU Learning 模組路徑
current_dir = os.path.dirname(os.path.abspath(__file__))
pu_learning_dir = os.path.join(os.path.dirname(current_dir), 'pu-learning')
sys.path.append(pu_learning_dir)

try:
    from pulearning_engine import run_pu_simulation
    PULEARNING_AVAILABLE = True
    logger = logging.getLogger(__name__)
    logger.info("✅ PU Learning 引擎載入成功")
except ImportError as e:
    PULEARNING_AVAILABLE = False
    logger = logging.getLogger(__name__)
    logger.warning(f"⚠️ PU Learning 引擎未找到: {e}")

# Mock classes for when PU Learning is not available
if not PULEARNING_AVAILABLE:
    class DataParams:
        def __init__(self, dims, n_p, n_u, prior):
            self.dims = dims
            self.n_p = n_p
            self.n_u = n_u
            self.prior = prior

    class ModelParams:
        def __init__(self, activation, n_epochs):
            self.activation = activation
            self.n_epochs = n_epochs

from core.database import db_manager

logger = logging.getLogger(__name__)

class TrainingService:
    """模型訓練服務 - 封裝 PU Learning 模型訓練邏輯"""

    def __init__(self):
        self.models_dir = Path(__file__).parent.parent / "trained_models"
        self.models_dir.mkdir(exist_ok=True)

    async def train_pu_model_in_background(
        self,
        model_name: str,
        model_type: str,
        model_params: Optional[Dict[str, Any]] = None
    ) -> str:
        """
        背景訓練 PU Learning 模型
        Args:
            model_name: 模型名稱
            model_type: 模型類型 ('uPU' 或 'nnPU')
            model_params: 模型參數
        Returns:
            model_id: 訓練完成的模型ID
        """
        try:
            logger.info("=" * 50)
            logger.info("🚀 開始 PU Learning 模型訓練")
            logger.info("=" * 50)
            logger.info(f"🏷️ 模型名稱: {model_name}")
            logger.info(f"⚙️ 模型參數: {model_params}")

            # 階段1: 準備訓練數據
            logger.info("📦 階段1: 開始準備訓練數據...")
            X, y, data_summary = await self.prepare_training_data()

            # 階段2: 保存模型
            logger.info(f"💾 階段2: 保存模型 {model_name}...")

            # 創建唯一的模型ID
            timestamp = datetime.utcnow().strftime('%Y%m%d_%H%M%S')
            model_id = f"{model_name}_{timestamp}"

            logger.info(f"✅ PU Learning 模型訓練完成 - 模型ID: {model_id}")
            return model_id

        except Exception as e:
            logger.error(f"❌ PU模型訓練失敗: {str(e)}")
            raise e

    async def prepare_training_data(self) -> Tuple[np.ndarray, np.ndarray, Dict[str, Any]]:
        """
        準備 PU Learning 訓練數據
        Returns:
            X: 特徵矩陣
            y: 標籤向量 (1: 正樣本, -1: 可靠負樣本, 0: 未標註樣本)
            summary: 數據摘要
        """
        logger.info("準備訓練數據...")

        try:
            # 從資料庫獲取已標註的異常事件
            async with db_manager.get_session() as session:
                from sqlalchemy import text

                # 查詢異常事件及其標籤
                query = """
                SELECT
                    ae.id, ae.meterId, ae.eventTimestamp, ae.score, ae.dataWindow,
                    ae.status, al.name as label_name
                FROM anomaly_event ae
                LEFT JOIN event_label_link ell ON ae.id = ell.eventId
                LEFT JOIN anomaly_label al ON ell.labelId = al.id
                ORDER BY ae.eventTimestamp
                """

                result = await session.execute(text(query))
                events = result.fetchall()

            if not events:
                raise ValueError("未找到已標註的異常事件數據")

            # 轉換為 DataFrame
            events_data = []
            for event in events:
                events_data.append({
                    'id': event.id,
                    'meterId': event.meterId,
                    'eventTimestamp': event.eventTimestamp,
                    'score': event.score,
                    'dataWindow': event.dataWindow,
                    'status': event.status,
                    'label_name': event.label_name
                })

            df = pd.DataFrame(events_data)

            # 提取特徵
            X, feature_names = self._extract_features(df)

            # 轉換標籤為 PU Learning 格式
            y = self._convert_labels_to_pu_format(df)

            # 生成數據摘要
            summary = {
                'total_samples': len(df),
                'positive_samples': int(np.sum(y == 1)),
                'negative_samples': int(np.sum(y == -1)),
                'unlabeled_samples': int(np.sum(y == 0)),
                'feature_count': X.shape[1],
                'feature_names': feature_names
            }

            logger.info(f"數據準備完成: {summary}")
            return X, y, summary

        except Exception as e:
            logger.error(f"準備訓練數據失敗: {e}")
            raise

    def _extract_features(self, df: pd.DataFrame) -> Tuple[np.ndarray, List[str]]:
        """從事件數據中提取特徵"""
        logger.info("開始特徵提取...")

        features = []
        feature_names = []

        for _, row in df.iterrows():
            feature_vector = []

            # 基本特徵
            feature_vector.append(float(row['score']) if row['score'] is not None else 0.0)
            feature_names_batch = ['score']

            # 時間特徵
            if row['eventTimestamp']:
                try:
                    if isinstance(row['eventTimestamp'], str):
                        timestamp = pd.to_datetime(row['eventTimestamp'])
                    else:
                        timestamp = row['eventTimestamp']

                    feature_vector.extend([
                        float(timestamp.hour),
                        float(timestamp.weekday()),
                        float(timestamp.day)
                    ])
                    feature_names_batch.extend(['hour', 'weekday', 'day'])
                except:
                    feature_vector.extend([0.0, 0.0, 0.0])
                    feature_names_batch.extend(['hour', 'weekday', 'day'])
            else:
                feature_vector.extend([0.0, 0.0, 0.0])
                feature_names_batch.extend(['hour', 'weekday', 'day'])

            # dataWindow 特徵
            if row['dataWindow'] and isinstance(row['dataWindow'], dict):
                data_window = row['dataWindow']

                # 電力統計特徵
                if 'power_stats' in data_window:
                    stats = data_window['power_stats']
                    feature_vector.extend([
                        float(stats.get('mean', 0)),
                        float(stats.get('std', 0)),
                        float(stats.get('max', 0)),
                        float(stats.get('min', 0))
                    ])
                    feature_names_batch.extend(['power_mean', 'power_std', 'power_max', 'power_min'])
                else:
                    feature_vector.extend([0.0, 0.0, 0.0, 0.0])
                    feature_names_batch.extend(['power_mean', 'power_std', 'power_max', 'power_min'])

                # 時序長度特徵
                if 'window_length' in data_window:
                    feature_vector.append(float(data_window['window_length']))
                    feature_names_batch.append('window_length')
                else:
                    feature_vector.append(0.0)
                    feature_names_batch.append('window_length')
            else:
                # 如果沒有 dataWindow，填充零值
                feature_vector.extend([0.0, 0.0, 0.0, 0.0, 0.0])
                feature_names_batch.extend(['power_mean', 'power_std', 'power_max', 'power_min', 'window_length'])

            features.append(feature_vector)
            if not feature_names:  # 只在第一次設定特徵名稱
                feature_names = feature_names_batch

        X = np.array(features)
        logger.info(f"特徵提取完成，形狀: {X.shape}")

        return X, feature_names

    def _convert_labels_to_pu_format(self, df: pd.DataFrame) -> np.ndarray:
        """將標籤轉換為 PU Learning 格式"""
        logger.info("轉換標籤為 PU Learning 格式...")

        y = np.zeros(len(df))

        for i, row in df.iterrows():
            # 基於 status 和 label_name 的邏輯
            if row['status'] == 'CONFIRMED_POSITIVE':
                y[i] = 1  # 確認的異常
            elif row['status'] == 'REJECTED_NORMAL':
                y[i] = -1  # 確認的正常
            elif row['label_name'] == 'Verified Normal':
                y[i] = -1  # 明確標記為正常
            elif row['label_name'] and row['label_name'] != 'Verified Normal':
                y[i] = 1   # 有其他標籤的被視為異常
            else:
                y[i] = 0   # 未標註

        return y

    async def get_latest_model_results(self) -> Optional[Dict[str, Any]]:
        """獲取最新的模型訓練結果"""
        try:
            async with db_manager.get_session() as session:
                from sqlalchemy import text

                query = """
                SELECT id, "modelName", "modelType", precision, recall, "f1Score",
                       "createdAt"
                FROM trained_model
                ORDER BY "createdAt" DESC
                LIMIT 1
                """

                result = await session.execute(text(query))
                row = result.fetchone()

                if row:
                    return {
                        'id': row[0],
                        'model_name': row[1],
                        'model_type': row[2],
                        'precision': float(row[3]) if row[3] else 0.0,
                        'recall': float(row[4]) if row[4] else 0.0,
                        'f1_score': float(row[5]) if row[5] else 0.0,
                        'created_at': row[6].isoformat() if row[6] else None
                    }
                return None

        except Exception as e:
            logger.error(f"獲取最新模型結果失敗: {e}")
            return None


# 創建全域實例
training_service = TrainingService()
