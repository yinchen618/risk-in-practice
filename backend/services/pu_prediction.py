"""
PU Learning 預測階段數據準備函數
實現與訓練階段完全一致的數據處理流程
"""

import pandas as pd
import numpy as np
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
import logging
from services.data_loader import DataLoaderService
from services.feature_engineering import feature_engineering

logger = logging.getLogger(__name__)

class PULearningPredictor:
    """PU Learning 預測器 - 處理預測階段的數據準備"""

    def __init__(self):
        self.data_loader = DataLoaderService()

    async def prepare_prediction_data(
        self,
        time_range: Dict[str, str],
        building_floors: Dict[str, List[str]],
        sliding_window_minutes: int = 5
    ) -> List[Dict[str, Any]]:
        """
        為預測準備數據 - 使用與訓練時完全相同的流程

        Args:
            time_range: 預測時間範圍 {"start_date": "2025-08-14", "end_date": "2025-08-15", "start_time": "00:00", "end_time": "23:59"}
            building_floors: 建築樓層選擇 {"Building A": ["2"], "Building B": ["1", "2"]}
            sliding_window_minutes: 滑動窗口間隔（分鐘）

        Returns:
            List[Dict]: 預測樣本列表，每個包含 dataWindow
        """
        try:
            logger.info("🔮" + "="*50)
            logger.info("🔮 PREPARING PREDICTION DATA")
            logger.info(f"📅 Time Range: {time_range}")
            logger.info(f"🏢 Building Floors: {building_floors}")
            logger.info(f"⏱️ Sliding Window: {sliding_window_minutes} minutes")
            logger.info("🔮" + "="*50)

            # 1. 解析時間範圍
            start_datetime = datetime.strptime(
                f"{time_range['start_date']} {time_range['start_time']}",
                "%Y-%m-%d %H:%M"
            )
            end_datetime = datetime.strptime(
                f"{time_range['end_date']} {time_range['end_time']}",
                "%Y-%m-%d %H:%M"
            )

            # 2. 載入原始數據
            start_time_str = start_datetime.isoformat()
            end_time_str = end_datetime.isoformat()

            raw_df = await self.data_loader.load_meter_data_by_time_range(
                start_time=start_time_str,
                end_time=end_time_str,
                selected_floors_by_building=building_floors
            )

            if raw_df.empty:
                logger.warning("⚠️ No raw data found for prediction")
                return []

            logger.info(f"📊 Loaded {len(raw_df)} raw data records from {raw_df['deviceNumber'].nunique()} devices")

            # 3. 生成滑動窗口預測點
            prediction_samples = await self._generate_sliding_window_samples(
                raw_df, start_datetime, end_datetime, sliding_window_minutes
            )

            logger.info("✅" + "="*50)
            logger.info(f"🎊 PREDICTION DATA PREPARATION COMPLETED")
            logger.info(f"📊 Generated {len(prediction_samples)} prediction samples")
            logger.info("✅" + "="*50)

            return prediction_samples

        except Exception as e:
            logger.error(f"💥 Failed to prepare prediction data: {e}")
            import traceback
            logger.error(f"📍 Traceback: {traceback.format_exc()}")
            return []

    async def _generate_sliding_window_samples(
        self,
        raw_df: pd.DataFrame,
        start_datetime: datetime,
        end_datetime: datetime,
        window_minutes: int
    ) -> List[Dict[str, Any]]:
        """使用滑動窗口生成預測樣本"""
        try:
            # 確保時間戳格式正確
            if 'timestamp' not in raw_df.columns and 'lastUpdated' in raw_df.columns:
                raw_df = raw_df.rename(columns={'lastUpdated': 'timestamp'})

            raw_df['timestamp'] = pd.to_datetime(raw_df['timestamp'])
            raw_df = raw_df.sort_values(['deviceNumber', 'timestamp'])

            prediction_samples = []
            devices = raw_df['deviceNumber'].unique()

            # 為每個設備生成滑動窗口預測點
            for device_id in devices:
                device_df = raw_df[raw_df['deviceNumber'] == device_id].copy()

                # 生成時間點（每 window_minutes 分鐘一個）
                current_time = start_datetime
                sample_id = 0

                while current_time <= end_datetime:
                    # 檢查該時間點附近是否有數據
                    nearby_data = device_df[
                        (device_df['timestamp'] >= current_time - timedelta(minutes=30)) &
                        (device_df['timestamp'] <= current_time + timedelta(minutes=30))
                    ]

                    if not nearby_data.empty:
                        # 生成該時間點的 dataWindow
                        data_window = await self._generate_prediction_data_window(
                            device_id, current_time, raw_df
                        )

                        if data_window and data_window.get('timeSeries'):
                            prediction_sample = {
                                "eventId": f"pred_{device_id}_{sample_id}",
                                "meterId": device_id,
                                "eventTimestamp": current_time.isoformat(),
                                "detectionRule": "prediction_sample",
                                "score": 0.0,
                                "dataWindow": data_window,
                                "status": "PREDICTION_SAMPLE"
                            }
                            prediction_samples.append(prediction_sample)
                            sample_id += 1

                    # 移動到下一個時間點
                    current_time += timedelta(minutes=window_minutes)

                logger.info(f"📊 Generated {sample_id} prediction samples for device {device_id}")

            return prediction_samples

        except Exception as e:
            logger.error(f"Failed to generate sliding window samples: {e}")
            return []

    async def _generate_prediction_data_window(
        self,
        device_id: str,
        center_time: datetime,
        raw_df: pd.DataFrame
    ) -> Optional[Dict[str, Any]]:
        """為預測點生成 dataWindow - 與訓練時的邏輯完全一致"""
        try:
            # 篩選該設備的數據
            device_df = raw_df[raw_df['deviceNumber'] == device_id].copy()
            if device_df.empty:
                return None

            # 確保時間戳格式
            time_col = 'timestamp'
            device_df[time_col] = pd.to_datetime(device_df[time_col])
            device_df = device_df.sort_values(time_col)

            # 定義時間窗口：中心時間前後各 15 分鐘
            window_start = center_time - timedelta(minutes=15)
            window_end = center_time + timedelta(minutes=15)

            # 篩選時間窗口內的數據
            window_df = device_df[
                (device_df[time_col] >= window_start) &
                (device_df[time_col] <= window_end)
            ]

            if window_df.empty:
                return None

            # 找到最接近中心時間的數據點
            time_diffs = abs(device_df[time_col] - center_time)
            if len(time_diffs) == 0:
                center_power_value = 0
            else:
                closest_idx = time_diffs.idxmin()
                center_power_value = device_df.loc[closest_idx, 'power'] if not device_df.empty else 0

            # 構建時序數據列表
            time_series = []
            for _, row in window_df.iterrows():
                time_series.append({
                    "timestamp": row[time_col].isoformat(),
                    "power": float(row['power']) if pd.notna(row['power']) else 0.0
                })

            # 構建 dataWindow 對象（與訓練時格式完全一致）
            data_window = {
                "eventTimestamp": center_time.isoformat(),
                "eventPowerValue": float(center_power_value) if pd.notna(center_power_value) else 0.0,
                "windowStart": window_start.isoformat(),
                "windowEnd": window_end.isoformat(),
                "timeSeries": time_series,
                "totalDataPoints": len(time_series),
                "detectionRule": "prediction_sample",
                "anomalyScore": 0.0  # 預測時不知道分數
            }

            return data_window

        except Exception as e:
            logger.error(f"Failed to generate prediction dataWindow: {e}")
            return None

    async def predict_with_model(
        self,
        model,
        prediction_samples: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """使用訓練好的模型進行預測"""
        try:
            logger.info(f"🔮 Starting prediction on {len(prediction_samples)} samples")

            # 1. 特徵工程 - 使用與訓練時完全相同的流程
            feature_matrix, sample_ids = feature_engineering.generate_feature_matrix(prediction_samples)

            if feature_matrix.size == 0:
                logger.warning("⚠️ No features generated from prediction samples")
                return []

            # 2. 標準化特徵 - 使用訓練時的 scaler
            feature_matrix_scaled = feature_engineering.transform_features(feature_matrix)

            # 處理 NaN 值
            if np.isnan(feature_matrix_scaled).any():
                logger.warning("⚠️ Found NaN values in prediction features, filling with 0")
                feature_matrix_scaled = np.nan_to_num(feature_matrix_scaled, nan=0.0)

            # 3. 模型預測
            if hasattr(model, 'predict_proba'):
                prediction_probs = model.predict_proba(feature_matrix_scaled)[:, 1]  # 獲取異常概率
                predictions = (prediction_probs > 0.5).astype(int)
            else:
                predictions = model.predict(feature_matrix_scaled)
                prediction_probs = predictions.astype(float)

            # 4. 組合預測結果
            prediction_results = []
            for i, (sample, prob, pred) in enumerate(zip(prediction_samples, prediction_probs, predictions)):
                result = {
                    "sampleId": sample["eventId"],
                    "meterId": sample["meterId"],
                    "timestamp": sample["eventTimestamp"],
                    "anomalyProbability": float(prob),
                    "isAnomalous": bool(pred),
                    "prediction": int(pred),
                    "deviceInfo": {
                        "deviceNumber": sample["meterId"]
                    }
                }
                prediction_results.append(result)

            logger.info(f"✅ Prediction completed: {len(prediction_results)} results")
            logger.info(f"📊 Anomalous samples: {sum(r['isAnomalous'] for r in prediction_results)}")

            return prediction_results

        except Exception as e:
            logger.error(f"💥 Prediction failed: {e}")
            import traceback
            logger.error(f"📍 Traceback: {traceback.format_exc()}")
            return []

# 創建全域實例
pu_predictor = PULearningPredictor()
