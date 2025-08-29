"""
統一的數據處理管道 (Unified Data Processing Pipeline)
確保訓練和評估時使用完全相同的特徵工程和標準化流程

=== 核心設計原則 ===
1. 所有特徵工程邏輯集中在此模組
2. StandardScaler 的 fit/transform 嚴格分離
3. 可序列化，與模型一同打包儲存
4. 包含完整的健全性檢查
"""

import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
import logging
from typing import Dict, List, Any, Optional, Tuple
import pickle
import json
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

class DataPreprocessingPipeline:
    """
    統一的數據處理管道類別

    此類別負責：
    1. 特徵工程 (Feature Engineering)
    2. 特徵標準化 (Feature Scaling)
    3. 健全性檢查 (Sanity Checks)
    4. 可序列化儲存/載入
    """

    def __init__(self,
                 window_config: Dict[str, int] = None,
                 feature_config: Dict[str, Any] = None):
        """
        初始化數據處理管道

        Args:
            window_config: 時間窗口配置
            feature_config: 特徵工程配置
        """
        # 預設窗口配置
        self.window_config = window_config or {
            "main_window_minutes": 60,
            "short_window_minutes": 30,
            "medium_window_minutes": 60,
            "long_window_minutes": 240
        }

        # 預設特徵配置
        self.feature_config = feature_config or {
            "include_statistical_features": True,
            "include_temporal_features": True,
            "include_multiscale_features": True
        }

        # StandardScaler 物件
        self.scaler = StandardScaler()
        self.is_fitted = False

        # 訓練時的特徵名稱 (用於驗證)
        self.expected_feature_names: Optional[List[str]] = None
        self.expected_feature_count: Optional[int] = None

        # 處理統計
        self.processing_stats = {
            "last_fit_time": None,
            "fit_sample_count": 0,
            "transform_sample_count": 0,
            "feature_count": 0
        }

        logger.info(f"✅ DataPreprocessingPipeline initialized with config:")
        logger.info(f"   Window config: {self.window_config}")
        logger.info(f"   Feature config: {self.feature_config}")

    def extract_temporal_features_from_analysis_data(self,
                                                   sample: Tuple,
                                                   all_samples_dict: Dict[str, Tuple]) -> np.ndarray:
        """
        從 analysis_ready_data 樣本中提取時間特徵

        這是核心的特徵工程函數，必須與訓練時完全一致

        Args:
            sample: (id, meter_id, timestamp, raw_l1, raw_l2, wattage_110v, wattage_220v, wattage_total, ...)
            all_samples_dict: 所有樣本的字典，用於時間窗口查找

        Returns:
            np.ndarray: 提取的特徵向量 (應該是 8 維)
        """
        try:
            # 解析樣本數據
            sample_id, meter_id, timestamp_str, raw_l1, raw_l2, wattage_110v, wattage_220v, wattage_total = sample[:8]

            # 轉換時間戳
            sample_time = pd.to_datetime(timestamp_str)

            # 獲取窗口配置
            main_window = self.window_config["main_window_minutes"]
            short_window = self.window_config["short_window_minutes"]
            medium_window = self.window_config["medium_window_minutes"]
            long_window = self.window_config["long_window_minutes"]

            # 計算時間窗口
            window_start = sample_time - timedelta(minutes=main_window)

            # 獲取窗口內的所有樣本
            window_samples = []
            for other_sample in all_samples_dict.values():
                other_time = pd.to_datetime(other_sample[2])
                if window_start <= other_time <= sample_time and other_sample[1] == meter_id:
                    window_samples.append(other_sample)

            # 如果窗口內樣本不足，使用當前樣本的值
            if len(window_samples) < 5:
                logger.debug(f"⚠️ Insufficient window samples ({len(window_samples)} < 5), using current sample values")
                features = np.array([
                    float(wattage_total),  # wattage_total_mean
                    0.0,                   # wattage_total_std
                    float(wattage_total),  # wattage_total_max
                    float(wattage_total),  # wattage_total_min
                    float(wattage_110v) if wattage_110v is not None else 0.0,  # wattage_110v_mean
                    float(wattage_220v) if wattage_220v is not None else 0.0,  # wattage_220v_mean
                    float(raw_l1) if raw_l1 is not None else 0.0,             # raw_l1_mean
                    float(raw_l2) if raw_l2 is not None else 0.0              # raw_l2_mean
                ])
                return features

            # 從窗口樣本中提取數值
            wattage_total_values = [float(s[7]) for s in window_samples if s[7] is not None]
            wattage_110v_values = [float(s[5]) for s in window_samples if s[5] is not None]
            wattage_220v_values = [float(s[6]) for s in window_samples if s[6] is not None]
            raw_l1_values = [float(s[3]) for s in window_samples if s[3] is not None]
            raw_l2_values = [float(s[4]) for s in window_samples if s[4] is not None]

            # 計算統計特徵 (8維)
            features = np.array([
                np.mean(wattage_total_values) if wattage_total_values else 0.0,   # wattage_total_mean
                np.std(wattage_total_values) if len(wattage_total_values) > 1 else 0.0,  # wattage_total_std
                np.max(wattage_total_values) if wattage_total_values else 0.0,    # wattage_total_max
                np.min(wattage_total_values) if wattage_total_values else 0.0,    # wattage_total_min
                np.mean(wattage_110v_values) if wattage_110v_values else 0.0,     # wattage_110v_mean
                np.mean(wattage_220v_values) if wattage_220v_values else 0.0,     # wattage_220v_mean
                np.mean(raw_l1_values) if raw_l1_values else 0.0,                 # raw_l1_mean
                np.mean(raw_l2_values) if raw_l2_values else 0.0                  # raw_l2_mean
            ])

            # 健全性檢查
            if np.any(np.isnan(features)) or np.any(np.isinf(features)):
                logger.warning(f"⚠️ NaN/Inf detected in features, replacing with zeros")
                features = np.nan_to_num(features, 0.0)

            return features

        except Exception as e:
            logger.error(f"❌ Error extracting features from sample {sample[0]}: {e}")
            # 返回零向量作為後備
            return np.zeros(8)

    def get_expected_feature_names(self) -> List[str]:
        """返回期望的特徵名稱列表"""
        return [
            'wattage_total_mean',
            'wattage_total_std',
            'wattage_total_max',
            'wattage_total_min',
            'wattage_110v_mean',
            'wattage_220v_mean',
            'raw_l1_mean',
            'raw_l2_mean'
        ]

    def fit_transform(self,
                     raw_samples: List[Tuple],
                     all_samples_dict: Dict[str, Tuple] = None) -> Tuple[np.ndarray, np.ndarray]:
        """
        擬合數據處理管道並轉換訓練數據

        這個方法只能在訓練階段呼叫一次！

        Args:
            raw_samples: 原始樣本列表
            all_samples_dict: 所有樣本的字典，用於時間窗口計算

        Returns:
            Tuple[features, labels]: 處理後的特徵矩陣和標籤向量
        """
        if self.is_fitted:
            raise ValueError("❌ Pipeline already fitted! Use transform() for new data.")

        logger.info(f"🔧 開始擬合數據處理管道 | Starting to fit data preprocessing pipeline")
        logger.info(f"   輸入樣本數: {len(raw_samples)}")

        # 如果沒有提供 all_samples_dict，創建一個
        if all_samples_dict is None:
            all_samples_dict = {sample[0]: sample for sample in raw_samples}

        # Step 1: 特徵工程
        logger.info(f"🔬 執行特徵工程 | Performing feature engineering")
        features_list = []
        labels_list = []

        for sample in raw_samples:
            try:
                # 提取特徵
                features = self.extract_temporal_features_from_analysis_data(sample, all_samples_dict)

                # 提取標籤 (is_positive_label)
                label = sample[9] if len(sample) > 9 else 0

                features_list.append(features)
                labels_list.append(label)

            except Exception as e:
                logger.error(f"❌ Error processing sample {sample[0]}: {e}")
                # 跳過有問題的樣本
                continue

        if not features_list:
            raise ValueError("❌ No valid features extracted from training data")

        # 轉換為 numpy 陣列
        X_features = np.array(features_list)
        y_labels = np.array(labels_list)

        logger.info(f"✅ 特徵工程完成 | Feature engineering completed:")
        logger.info(f"   特徵矩陣形狀: {X_features.shape}")
        logger.info(f"   標籤分布: {np.sum(y_labels == 1)} positive, {np.sum(y_labels == 0)} negative")

        # Step 2: 擬合並轉換 StandardScaler
        logger.info(f"🔧 擬合 StandardScaler | Fitting StandardScaler")
        X_scaled = self.scaler.fit_transform(X_features)

        # 記錄擬合資訊
        self.is_fitted = True
        self.expected_feature_names = self.get_expected_feature_names()
        self.expected_feature_count = X_features.shape[1]
        self.processing_stats.update({
            "last_fit_time": datetime.now().isoformat(),
            "fit_sample_count": len(raw_samples),
            "feature_count": X_features.shape[1]
        })

        logger.info(f"✅ 數據處理管道擬合完成 | Data preprocessing pipeline fitted successfully")
        logger.info(f"   期望特徵數: {self.expected_feature_count}")
        logger.info(f"   期望特徵名稱: {self.expected_feature_names}")
        logger.info(f"   Scaler統計: mean={self.scaler.mean_[:3]}..., scale={self.scaler.scale_[:3]}...")

        return X_scaled, y_labels

    def transform(self,
                 raw_samples: List[Tuple],
                 all_samples_dict: Dict[str, Tuple] = None) -> np.ndarray:
        """
        使用已擬合的管道轉換新數據

        這個方法用於驗證集、測試集和未來的評估數據

        Args:
            raw_samples: 原始樣本列表
            all_samples_dict: 所有樣本的字典，用於時間窗口計算

        Returns:
            np.ndarray: 處理後的特徵矩陣
        """
        if not self.is_fitted:
            raise ValueError("❌ Pipeline not fitted! Call fit_transform() first.")

        logger.info(f"🔄 轉換新數據 | Transforming new data")
        logger.info(f"   輸入樣本數: {len(raw_samples)}")

        # 如果沒有提供 all_samples_dict，創建一個
        if all_samples_dict is None:
            all_samples_dict = {sample[0]: sample for sample in raw_samples}

        # Step 1: 特徵工程 (使用相同的函數)
        features_list = []
        for sample in raw_samples:
            try:
                features = self.extract_temporal_features_from_analysis_data(sample, all_samples_dict)
                features_list.append(features)
            except Exception as e:
                logger.error(f"❌ Error processing sample {sample[0]}: {e}")
                # 使用零向量作為後備
                features_list.append(np.zeros(self.expected_feature_count))

        if not features_list:
            raise ValueError("❌ No valid features extracted from data")

        X_features = np.array(features_list)

        # Step 2: 健全性檢查
        self._validate_features(X_features)

        # Step 3: 應用已擬合的 StandardScaler
        X_scaled = self.scaler.transform(X_features)

        # 更新統計
        self.processing_stats["transform_sample_count"] += len(raw_samples)

        logger.info(f"✅ 數據轉換完成 | Data transformation completed")
        logger.info(f"   輸出特徵矩陣形狀: {X_scaled.shape}")

        return X_scaled

    def _validate_features(self, X_features: np.ndarray):
        """執行特徵健全性檢查"""

        # 檢查特徵數量
        if X_features.shape[1] != self.expected_feature_count:
            raise ValueError(
                f"❌ Feature count mismatch! Expected {self.expected_feature_count}, got {X_features.shape[1]}"
            )

        # 檢查是否有異常值
        if np.any(np.isnan(X_features)):
            logger.warning(f"⚠️ NaN values detected in features")

        if np.any(np.isinf(X_features)):
            logger.warning(f"⚠️ Infinity values detected in features")

        logger.debug(f"✅ 特徵健全性檢查通過 | Feature validation passed")

    def get_feature_info(self) -> Dict[str, Any]:
        """獲取特徵處理資訊"""
        return {
            "is_fitted": self.is_fitted,
            "expected_feature_names": self.expected_feature_names,
            "expected_feature_count": self.expected_feature_count,
            "window_config": self.window_config,
            "feature_config": self.feature_config,
            "processing_stats": self.processing_stats,
            "scaler_mean": self.scaler.mean_.tolist() if self.is_fitted else None,
            "scaler_scale": self.scaler.scale_.tolist() if self.is_fitted else None
        }

    def save_to_dict(self) -> Dict[str, Any]:
        """將管道序列化為字典 (用於模型打包)"""
        if not self.is_fitted:
            raise ValueError("❌ Cannot save unfitted pipeline")

        return {
            "window_config": self.window_config,
            "feature_config": self.feature_config,
            "scaler_params": {
                "mean_": self.scaler.mean_.tolist(),
                "scale_": self.scaler.scale_.tolist(),
                "var_": self.scaler.var_.tolist(),
                "n_features_in_": self.scaler.n_features_in_,
                "n_samples_seen_": self.scaler.n_samples_seen_
            },
            "expected_feature_names": self.expected_feature_names,
            "expected_feature_count": self.expected_feature_count,
            "processing_stats": self.processing_stats,
            "pipeline_version": "1.0"
        }

    @classmethod
    def load_from_dict(cls, pipeline_dict: Dict[str, Any]) -> 'DataPreprocessingPipeline':
        """從字典載入管道 (用於模型載入)"""

        # 創建新的管道實例
        pipeline = cls(
            window_config=pipeline_dict["window_config"],
            feature_config=pipeline_dict["feature_config"]
        )

        # 重建 StandardScaler
        scaler_params = pipeline_dict["scaler_params"]
        pipeline.scaler.mean_ = np.array(scaler_params["mean_"])
        pipeline.scaler.scale_ = np.array(scaler_params["scale_"])
        pipeline.scaler.var_ = np.array(scaler_params["var_"])
        pipeline.scaler.n_features_in_ = scaler_params["n_features_in_"]
        pipeline.scaler.n_samples_seen_ = scaler_params["n_samples_seen_"]

        # 設定其他屬性
        pipeline.is_fitted = True
        pipeline.expected_feature_names = pipeline_dict["expected_feature_names"]
        pipeline.expected_feature_count = pipeline_dict["expected_feature_count"]
        pipeline.processing_stats = pipeline_dict["processing_stats"]

        logger.info(f"✅ DataPreprocessingPipeline loaded from dict")
        logger.info(f"   特徵數: {pipeline.expected_feature_count}")
        logger.info(f"   特徵名稱: {pipeline.expected_feature_names}")

        return pipeline
