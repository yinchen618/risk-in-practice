"""
特徵工程服務 - 為 PU Learning 模型提供特徵提取和處理功能
實現從原始時序數據到標準化特徵向量的完整流程
"""

import json
import logging
import numpy as np
import pandas as pd
from datetime import datetime
from typing import Dict, List, Any, Tuple, Optional
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE
import warnings

# 忽略一些常見的警告
warnings.filterwarnings('ignore', category=FutureWarning)

logger = logging.getLogger(__name__)

class FeatureEngineering:
    """特徵工程服務類"""
    
    def __init__(self):
        self.scaler = StandardScaler()
        self.label_encoder = LabelEncoder()
        self.feature_names = []
        self.is_fitted = False
        
    def generate_feature_vector(self, event: Dict[str, Any]) -> np.ndarray:
        """
        從單個 AnomalyEvent 生成特徵向量
        
        Args:
            event: 包含 dataWindow JSON 的異常事件記錄
            
        Returns:
            np.ndarray: 標準化的特徵向量
        """
        try:
            features = {}
            
            # 1. 解析 dataWindow
            data_window = event.get('dataWindow', {})
            if isinstance(data_window, str):
                data_window = json.loads(data_window)
            
            time_series = data_window.get('timeSeries', [])
            if not time_series:
                logger.warning(f"Event {event.get('eventId', 'unknown')} has no time series data")
                return np.zeros(20)  # 返回零向量作為後備
            
            # 提取功率數值序列
            power_values = [point.get('power', 0) for point in time_series]
            power_array = np.array(power_values)
            
            # 2. 計算統計特徵
            if len(power_array) > 0:
                features['mean'] = np.mean(power_array)
                features['std'] = np.std(power_array)
                features['median'] = np.median(power_array)
                features['max'] = np.max(power_array)
                features['min'] = np.min(power_array)
                features['range'] = features['max'] - features['min']
                
                # 分佈形狀特徵
                from scipy import stats
                features['skewness'] = stats.skew(power_array) if len(power_array) > 2 else 0
                features['kurtosis'] = stats.kurtosis(power_array) if len(power_array) > 3 else 0
                
                # 相對強度特徵
                features['max_to_mean_ratio'] = features['max'] / features['mean'] if features['mean'] != 0 else 0
                
                # 事件功率值相對於平均值的偏差
                event_power = data_window.get('eventPowerValue', 0)
                features['event_power_deviation'] = event_power - features['mean']
                features['event_power_value'] = event_power
                
            else:
                # 如果沒有功率數據，設置默認值
                for key in ['mean', 'std', 'median', 'max', 'min', 'range', 
                           'skewness', 'kurtosis', 'max_to_mean_ratio', 
                           'event_power_deviation', 'event_power_value']:
                    features[key] = 0
            
            # 3. 提取時間特徵
            event_timestamp = event.get('eventTimestamp', '')
            if event_timestamp:
                try:
                    dt = pd.to_datetime(event_timestamp)
                    features['hour_of_day'] = dt.hour
                    features['day_of_week'] = dt.dayofweek
                    features['is_weekend'] = 1 if dt.dayofweek >= 5 else 0
                except:
                    features['hour_of_day'] = 0
                    features['day_of_week'] = 0
                    features['is_weekend'] = 0
            else:
                features['hour_of_day'] = 0
                features['day_of_week'] = 0
                features['is_weekend'] = 0
            
            # 4. 異常評分特徵
            features['anomaly_score'] = event.get('score', 0)
            
            # 5. 檢測規則特徵 (簡化版本 - 用數值編碼)
            detection_rule = event.get('detectionRule', 'unknown')
            # 簡單的規則映射
            rule_mapping = {
                'spike': 1, 'threshold': 2, 'pattern': 3, 'peer': 4, 'unknown': 0
            }
            features['detection_rule_encoded'] = rule_mapping.get(detection_rule.lower(), 0)
            
            # 6. 數據窗口統計特徵
            features['window_data_points'] = len(time_series)
            
            # 7. 構建特徵向量
            feature_vector = np.array([
                features['mean'], features['std'], features['median'], 
                features['max'], features['min'], features['range'],
                features['skewness'], features['kurtosis'], features['max_to_mean_ratio'],
                features['event_power_deviation'], features['event_power_value'],
                features['hour_of_day'], features['day_of_week'], features['is_weekend'],
                features['anomaly_score'], features['detection_rule_encoded'],
                features['window_data_points']
            ])
            
            return feature_vector
            
        except Exception as e:
            logger.error(f"Failed to generate feature vector for event {event.get('eventId', 'unknown')}: {e}")
            return np.zeros(17)  # 返回零向量作為後備
    
    def generate_feature_matrix(self, events: List[Dict[str, Any]]) -> Tuple[np.ndarray, List[str]]:
        """
        從事件列表生成特徵矩陣
        
        Args:
            events: 異常事件列表
            
        Returns:
            Tuple[np.ndarray, List[str]]: (特徵矩陣, 事件ID列表)
        """
        try:
            feature_vectors = []
            event_ids = []
            
            for event in events:
                feature_vector = self.generate_feature_vector(event)
                feature_vectors.append(feature_vector)
                event_ids.append(event.get('eventId', f"event_{len(event_ids)}"))
            
            if not feature_vectors:
                return np.array([]), []
            
            feature_matrix = np.vstack(feature_vectors)
            logger.info(f"Generated feature matrix: {feature_matrix.shape}")
            
            return feature_matrix, event_ids
            
        except Exception as e:
            logger.error(f"Failed to generate feature matrix: {e}")
            return np.array([]), []
    
    def fit_scaler(self, feature_matrix: np.ndarray) -> None:
        """
        擬合標準化器
        
        Args:
            feature_matrix: 特徵矩陣
        """
        try:
            if feature_matrix.size > 0:
                self.scaler.fit(feature_matrix)
                self.is_fitted = True
                logger.info("Feature scaler fitted successfully")
            else:
                logger.warning("Empty feature matrix provided for fitting")
        except Exception as e:
            logger.error(f"Failed to fit scaler: {e}")
    
    def transform_features(self, feature_matrix: np.ndarray) -> np.ndarray:
        """
        標準化特徵矩陣
        
        Args:
            feature_matrix: 原始特徵矩陣
            
        Returns:
            np.ndarray: 標準化後的特徵矩陣
        """
        try:
            if not self.is_fitted:
                logger.warning("Scaler not fitted. Fitting with provided data.")
                self.fit_scaler(feature_matrix)
            
            if feature_matrix.size > 0:
                return self.scaler.transform(feature_matrix)
            else:
                return feature_matrix
                
        except Exception as e:
            logger.error(f"Failed to transform features: {e}")
            return feature_matrix
    
    def reduce_dimensions_tsne(self, feature_matrix: np.ndarray, n_components: int = 2, 
                              random_state: int = 42) -> np.ndarray:
        """
        使用 t-SNE 進行降維
        
        Args:
            feature_matrix: 標準化的特徵矩陣
            n_components: 降維後的維度數
            random_state: 隨機種子
            
        Returns:
            np.ndarray: 降維後的數據
        """
        try:
            if feature_matrix.size == 0 or feature_matrix.shape[0] < 2:
                logger.warning("Insufficient data for t-SNE")
                return np.array([])
            
            # 對於小數據集，使用較小的 perplexity
            n_samples = feature_matrix.shape[0]
            perplexity = min(30, max(5, n_samples // 4))
            
            tsne = TSNE(
                n_components=n_components,
                random_state=random_state,
                perplexity=perplexity,
                n_iter=1000,
                init='pca'
            )
            
            reduced_data = tsne.fit_transform(feature_matrix)
            logger.info(f"t-SNE completed: {feature_matrix.shape} -> {reduced_data.shape}")
            
            return reduced_data
            
        except Exception as e:
            logger.error(f"t-SNE dimensionality reduction failed: {e}")
            # 如果 t-SNE 失敗，嘗試使用 PCA 作為後備
            return self.reduce_dimensions_pca(feature_matrix, n_components, random_state)
    
    def reduce_dimensions_pca(self, feature_matrix: np.ndarray, n_components: int = 2,
                             random_state: int = 42) -> np.ndarray:
        """
        使用 PCA 進行降維（作為 t-SNE 的後備方案）
        
        Args:
            feature_matrix: 標準化的特徵矩陣
            n_components: 降維後的維度數
            random_state: 隨機種子
            
        Returns:
            np.ndarray: 降維後的數據
        """
        try:
            if feature_matrix.size == 0:
                logger.warning("Empty feature matrix for PCA")
                return np.array([])
            
            pca = PCA(n_components=n_components, random_state=random_state)
            reduced_data = pca.fit_transform(feature_matrix)
            
            logger.info(f"PCA completed: {feature_matrix.shape} -> {reduced_data.shape}")
            logger.info(f"PCA explained variance ratio: {pca.explained_variance_ratio_}")
            
            return reduced_data
            
        except Exception as e:
            logger.error(f"PCA dimensionality reduction failed: {e}")
            return np.array([])

# 全域實例
feature_engineering = FeatureEngineering()
