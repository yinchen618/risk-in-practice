"""
候選事件計算服務 - 實現完整的多維度異常檢測算法
"""

import pandas as pd
import numpy as np
from typing import Dict, List, Optional, Any, Tuple
from datetime import datetime, timedelta
import logging
from scipy import stats
import json
import uuid

logger = logging.getLogger(__name__)

class CandidateCalculationService:
    """候選事件計算服務 - 實現完整的 Calculate Candidates 功能"""
    
    def __init__(self):
        self.default_params = {
            'z_score_threshold': 3.0,
            'spike_percentage': 200.0,
            'min_event_duration_minutes': 30,
            'detect_holiday_pattern': True,
            'max_time_gap_minutes': 60,
            'peer_agg_window_minutes': 5,
            'peer_exceed_percentage': 150.0,
        }
    
    async def calculate_anomaly_candidates(
        self, 
        df: pd.DataFrame, 
        filtering_params: Dict[str, Any],
        selected_floors_by_building: Optional[Dict[str, List[str]]] = None
    ) -> Dict[str, Any]:
        """
        主要的候選事件計算函數
        實現完整的多維度異常檢測流程
        
        Args:
            df: 原始電表數據
            filtering_params: 篩選參數
            selected_floors_by_building: 按建築分組的樓層選擇
            
        Returns:
            符合前端需求的統計結果字典
        """
        logger.info(f"[CANDIDATE_CALC] 開始計算候選事件")
        logger.info(f"[CANDIDATE_CALC] 輸入資料: {len(df)} 行")
        logger.info(f"[CANDIDATE_CALC] 參數: {filtering_params}")
        
        if df.empty:
            return self._empty_result()
        
        # 步驟 1: 資料載入與基礎篩選
        stats_basic = await self._calculate_basic_stats(df)
        logger.info(f"[CANDIDATE_CALC] 基礎統計: {stats_basic}")
        
        # 步驟 2: 應用多維度篩選規則
        rule_results = await self._apply_multidimensional_rules(df, filtering_params)
        logger.info(f"[CANDIDATE_CALC] 規則結果數量: {len(rule_results)}")

        # 步驟 3: 處理重疊並計算最終結果
        final_results = await self._process_overlap_and_finalize(
            df, rule_results, filtering_params
        )
        logger.info(f"[CANDIDATE_CALC] 最終結果數量: {len(final_results)}")

        
        # 步驟 4: 計算設備排名
        top_devices = await self._calculate_top_devices(df, final_results['final_events'])
        
        # 步驟 5: 組合最終回應
        response = {
            "totalCandidates": final_results['total_candidates'],
            "totalRecords": stats_basic['total_records'],
            "uniqueDevices": stats_basic['unique_devices'],
            "insufficientDataDevices": stats_basic['insufficient_data_devices'],
            "deviceRecordsSummary": stats_basic['device_records_summary'],
            "perRule": rule_results['per_rule'],
            "totalEstimatedBeforeOverlap": rule_results['total_before_overlap'],
            "overlapReductionFactor": final_results['overlap_reduction_factor'],
            "overlapAdjustedTotal": final_results['total_candidates'],
            "topDevicesByEstimatedAnomalies": top_devices,
            "timeRange": stats_basic['time_range'],
            "final_events": final_results['final_events']  # 添加事件列表
        }
        
        logger.info(f"[CANDIDATE_CALC] 完成計算，返回結果")
        return response
    
    async def _calculate_basic_stats(self, df: pd.DataFrame) -> Dict[str, Any]:
        """步驟 1: 計算基礎統計資訊"""
        logger.info(f"[CANDIDATE_CALC] 計算基礎統計")
        
        # 確保有必要的欄位
        if 'deviceNumber' not in df.columns:
            logger.warning("DataFrame 缺少 'deviceNumber' 欄位，嘗試使用其他欄位")
            if 'meterId' in df.columns:
                df['deviceNumber'] = df['meterId']
            else:
                raise ValueError("DataFrame 必須包含 'deviceNumber' 或 'meterId' 欄位")
        
        if 'timestamp' not in df.columns:
            logger.warning("DataFrame 缺少 'timestamp' 欄位，嘗試使用其他欄位")
            if 'time' in df.columns:
                df['timestamp'] = df['time']
            else:
                raise ValueError("DataFrame 必須包含 'timestamp' 或 'time' 欄位")
        
        total_records = len(df)
        unique_devices = df['deviceNumber'].nunique()
        
        # 計算每台設備的數據量
        device_counts = df['deviceNumber'].value_counts()
        insufficient_threshold = 10  # 少於10筆數據視為不足
        insufficient_data_devices = (device_counts < insufficient_threshold).sum()
        
        device_records_summary = {
            "avgRecordsPerDevice": float(device_counts.mean()),
            "medianRecordsPerDevice": float(device_counts.median()),
            "minRecordsPerDevice": int(device_counts.min()),
            "maxRecordsPerDevice": int(device_counts.max())
        }
        
        # 計算實際時間範圍
        try:
            time_range = {
                "start": df['timestamp'].min().isoformat(),
                "end": df['timestamp'].max().isoformat()
            }
        except Exception as e:
            logger.warning(f"無法計算時間範圍: {e}")
            time_range = {"start": None, "end": None}
        
        return {
            "total_records": total_records,
            "unique_devices": unique_devices,
            "insufficient_data_devices": insufficient_data_devices,
            "device_records_summary": device_records_summary,
            "time_range": time_range
        }
    
    async def _apply_multidimensional_rules(
        self, 
        df: pd.DataFrame, 
        params: Dict[str, Any]
    ) -> Dict[str, Any]:
        """步驟 2: 應用多維度篩選規則"""
        logger.info(f"[CANDIDATE_CALC] 應用多維度篩選規則")
        
        # 合併參數
        detection_params = {**self.default_params, **params}
        
        # 為每個規則建立獨立的異常標記
        rule_results = {
            "zscoreEstimate": 0,
            "spikeEstimate": 0,
            "timeEstimate": 0,
            "gapEstimate": 0,
            "peerEstimate": 0
        }
        
        # 儲存每個規則檢測到的異常點
        rule_anomalies = {
            "zscore": set(),
            "spike": set(),
            "time": set(),
            "gap": set(),
            "peer": set()
        }
        
        # 處理每台設備
        devices = df['deviceNumber'].unique()
        logger.info(f"[CANDIDATE_CALC] 處理 {len(devices)} 台設備")
        
        for device in devices:
            device_df = df[df['deviceNumber'] == device].copy()
            device_df = device_df.sort_values('timestamp').reset_index(drop=True)
            
            if len(device_df) < 5:  # 數據太少，跳過
                continue
            
            # 確保有 kWh 欄位
            value_column = self._get_value_column(device_df)
            if value_column is None:
                logger.warning(f"設備 {device} 缺少數值欄位，跳過")
                continue
            
            # Z-Score 規則
            zscore_points = self._apply_zscore_rule(
                device_df, device, value_column, detection_params
            )
            rule_anomalies["zscore"].update(zscore_points)
            rule_results["zscoreEstimate"] += len(zscore_points)
            
            # Spike 規則
            spike_points = self._apply_spike_rule(
                device_df, device, value_column, detection_params
            )
            rule_anomalies["spike"].update(spike_points)
            rule_results["spikeEstimate"] += len(spike_points)
            
            # Time 規則 (假日/非正常時段)
            time_points = self._apply_time_rule(
                device_df, device, detection_params
            )
            rule_anomalies["time"].update(time_points)
            rule_results["timeEstimate"] += len(time_points)
            
            # Gap 規則
            gap_points = self._apply_gap_rule(
                device_df, device, detection_params
            )
            rule_anomalies["gap"].update(gap_points)
            rule_results["gapEstimate"] += len(gap_points)
            
            # Peer 規則 (簡化版本)
            peer_points = self._apply_peer_rule(
                device_df, device, value_column, detection_params
            )
            rule_anomalies["peer"].update(peer_points)
            rule_results["peerEstimate"] += len(peer_points)
        
        total_before_overlap = sum(rule_results.values())
        
        return {
            "per_rule": rule_results,
            "total_before_overlap": total_before_overlap,
            "rule_anomalies": rule_anomalies
        }
    
    def _get_value_column(self, df: pd.DataFrame) -> Optional[str]:
        """獲取數值欄位名稱"""
        possible_columns = ['kWh', 'value', 'power', 'energy', 'consumption']
        for col in possible_columns:
            if col in df.columns:
                return col
        return None
    
    def _apply_zscore_rule(
        self, 
        device_df: pd.DataFrame, 
        device: str, 
        value_column: str, 
        params: Dict[str, Any]
    ) -> List[str]:
        """應用 Z-Score 規則"""
        try:
            values = device_df[value_column].astype(float)
            if len(values) < 3:
                return []
            
            z_scores = np.abs(stats.zscore(values, nan_policy='omit'))
            threshold = params.get('z_score_threshold', 3.0)
            
            anomaly_indices = device_df.index[z_scores > threshold].tolist()
            anomaly_points = [f"{device}_{idx}" for idx in anomaly_indices]
            
            return anomaly_points
        except Exception as e:
            logger.warning(f"Z-Score 規則失敗 (設備 {device}): {e}")
            return []
    
    def _apply_spike_rule(
        self, 
        device_df: pd.DataFrame, 
        device: str, 
        value_column: str, 
        params: Dict[str, Any]
    ) -> List[str]:
        """應用 Spike 規則"""
        try:
            values = device_df[value_column].astype(float)
            if len(values) < 5:
                return []
            
            # 計算滾動中位數作為基線
            window_size = min(5, len(values) // 2)
            baseline = values.rolling(window=window_size, center=True).median()
            
            spike_threshold = params.get('spike_percentage', 200.0) / 100.0
            threshold_values = baseline * (1 + spike_threshold)
            
            anomaly_mask = values > threshold_values
            anomaly_indices = device_df.index[anomaly_mask].tolist()
            anomaly_points = [f"{device}_{idx}" for idx in anomaly_indices]
            
            return anomaly_points
        except Exception as e:
            logger.warning(f"Spike 規則失敗 (設備 {device}): {e}")
            return []
    
    def _apply_time_rule(
        self, 
        device_df: pd.DataFrame, 
        device: str, 
        params: Dict[str, Any]
    ) -> List[str]:
        """應用時間規則 (假日/非正常時段)"""
        try:
            if not params.get('detect_holiday_pattern', True):
                return []
            
            # 簡化版本：檢測深夜時段 (23:00-06:00) 和週末
            timestamps = pd.to_datetime(device_df['timestamp'])
            
            # 深夜時段
            night_mask = (timestamps.dt.hour >= 23) | (timestamps.dt.hour <= 6)
            
            # 週末
            weekend_mask = timestamps.dt.weekday >= 5
            
            # 假日模式：深夜或週末
            holiday_mask = night_mask | weekend_mask
            
            anomaly_indices = device_df.index[holiday_mask].tolist()
            anomaly_points = [f"{device}_{idx}" for idx in anomaly_indices]
            
            return anomaly_points
        except Exception as e:
            logger.warning(f"時間規則失敗 (設備 {device}): {e}")
            return []
    
    def _apply_gap_rule(
        self, 
        device_df: pd.DataFrame, 
        device: str, 
        params: Dict[str, Any]
    ) -> List[str]:
        """應用 Gap 規則"""
        try:
            if len(device_df) < 2:
                return []
            
            timestamps = pd.to_datetime(device_df['timestamp'])
            time_diffs = timestamps.diff().dt.total_seconds() / 60  # 轉換為分鐘
            
            max_gap = params.get('max_time_gap_minutes', 60)
            gap_mask = time_diffs > max_gap
            
            anomaly_indices = device_df.index[gap_mask].tolist()
            anomaly_points = [f"{device}_{idx}" for idx in anomaly_indices]
            
            return anomaly_points
        except Exception as e:
            logger.warning(f"Gap 規則失敗 (設備 {device}): {e}")
            return []
    
    def _apply_peer_rule(
        self, 
        device_df: pd.DataFrame, 
        device: str, 
        value_column: str, 
        params: Dict[str, Any]
    ) -> List[str]:
        """應用 Peer 規則 (簡化版本)"""
        try:
            values = device_df[value_column].astype(float)
            if len(values) < 3:
                return []
            
            # 簡化版本：使用設備自己的平均值作為同群組基準
            peer_mean = values.mean()
            peer_threshold = params.get('peer_exceed_percentage', 150.0) / 100.0
            threshold_value = peer_mean * peer_threshold
            
            anomaly_mask = values > threshold_value
            anomaly_indices = device_df.index[anomaly_mask].tolist()
            anomaly_points = [f"{device}_{idx}" for idx in anomaly_indices]
            
            return anomaly_points
        except Exception as e:
            logger.warning(f"Peer 規則失敗 (設備 {device}): {e}")
            return []
    
    async def _process_overlap_and_finalize(
        self, 
        df: pd.DataFrame, 
        rule_results: Dict[str, Any], 
        params: Dict[str, Any]
    ) -> Dict[str, Any]:
        """步驟 3: 處理重疊並計算最終結果"""
        logger.info(f"[CANDIDATE_CALC] 處理重疊並計算最終結果")
        
        # 合併所有規則檢測到的異常點
        all_anomalies = set()
        for rule_name, anomalies in rule_results['rule_anomalies'].items():
            all_anomalies.update(anomalies)
        
        # 轉換為事件格式並應用持續時間規則
        events = self._convert_points_to_events(
            df, all_anomalies, params
        )
        
        total_candidates = len(events)
        total_before_overlap = rule_results['total_before_overlap']
        
        # 計算重疊減少因子
        if total_before_overlap > 0:
            overlap_reduction_factor = (total_before_overlap - total_candidates) / total_before_overlap
        else:
            overlap_reduction_factor = 0.0
        
        return {
            "total_candidates": total_candidates,
            "overlap_reduction_factor": overlap_reduction_factor,
            "final_events": events
        }
    
    def _convert_points_to_events(
        self, 
        df: pd.DataFrame, 
        anomaly_points: set, 
        params: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """將異常點轉換為事件，並應用持續時間規則"""
        logger.info(f"[CANDIDATE_CALC] 轉換 {len(anomaly_points)} 個異常點為事件")
        logger.info(f"[CANDIDATE_CALC] 異常點樣本 (前10個): {list(anomaly_points)[:10]}")
        
        if not anomaly_points:
            return []
        
        # 解析異常點 (格式: "device_index")
        parsed_points = []
        for point in anomaly_points:
            try:
                device, idx = point.rsplit('_', 1)
                parsed_points.append((device, int(idx)))
            except Exception as e:
                logger.warning(f"無法解析異常點 {point}: {e}")
                continue
        
        logger.info(f"[CANDIDATE_CALC] 成功解析 {len(parsed_points)} 個異常點")
        
        # 按設備分組
        device_groups = {}
        for device, idx in parsed_points:
            if device not in device_groups:
                device_groups[device] = []
            device_groups[device].append(idx)
        
        logger.info(f"[CANDIDATE_CALC] 設備分組: {[(device, len(indices)) for device, indices in device_groups.items()]}")
        
        events = []
        min_duration = params.get('min_event_duration_minutes', 30)
        
        logger.info(f"[CANDIDATE_CALC] 使用最小持續時間: {min_duration} 分鐘")
        
        for device, indices in device_groups.items():
            logger.info(f"[CANDIDATE_CALC] 處理設備 {device}，異常點數量: {len(indices)}")
            
            device_df = df[df['deviceNumber'] == device].copy()
            device_df = device_df.sort_values('timestamp').reset_index(drop=True)
            
            logger.info(f"[CANDIDATE_CALC] 設備 {device} 總數據點: {len(device_df)}")
            
            # 將相鄰的異常點合併為事件
            indices.sort()
            current_event_start = None
            current_event_indices = []
            
            for idx in indices:
                if idx >= len(device_df):
                    logger.warning(f"[CANDIDATE_CALC] 設備 {device} 索引 {idx} 超出範圍 (總長度: {len(device_df)})")
                    continue
                    
                if current_event_start is None:
                    current_event_start = idx
                    current_event_indices = [idx]
                elif idx - current_event_indices[-1] <= 3:  # 相鄰或近似相鄰
                    current_event_indices.append(idx)
                else:
                    # 結束當前事件，開始新事件
                    logger.info(f"[CANDIDATE_CALC] 設備 {device} 完成一個事件組，索引: {current_event_indices}")
                    event = self._create_event_from_indices(
                        device_df, device, current_event_indices, min_duration
                    )
                    if event:
                        events.append(event)
                        logger.info(f"[CANDIDATE_CALC] 設備 {device} 事件已添加")
                    else:
                        logger.info(f"[CANDIDATE_CALC] 設備 {device} 事件被過濾")
                    
                    current_event_start = idx
                    current_event_indices = [idx]
            
            # 處理最後一個事件
            if current_event_indices:
                logger.info(f"[CANDIDATE_CALC] 設備 {device} 處理最後一個事件組，索引: {current_event_indices}")
                event = self._create_event_from_indices(
                    device_df, device, current_event_indices, min_duration
                )
                if event:
                    events.append(event)
                    logger.info(f"[CANDIDATE_CALC] 設備 {device} 最後事件已添加")
                else:
                    logger.info(f"[CANDIDATE_CALC] 設備 {device} 最後事件被過濾")
        
        logger.info(f"[CANDIDATE_CALC] 生成 {len(events)} 個事件")
        return events
    
    def _create_event_from_indices(
        self, 
        device_df: pd.DataFrame, 
        device: str, 
        indices: List[int], 
        min_duration: int
    ) -> Optional[Dict[str, Any]]:
        """從異常點索引創建事件"""
        try:
            logger.info(f"[CANDIDATE_CALC] 為設備 {device} 創建事件，索引: {indices}")
            
            if not indices:
                logger.warning(f"[CANDIDATE_CALC] 設備 {device} 索引為空")
                return None
            
            start_idx = min(indices)
            end_idx = max(indices)
            
            logger.info(f"[CANDIDATE_CALC] 設備 {device} 事件範圍: {start_idx} 到 {end_idx}")
            
            start_time = pd.to_datetime(device_df.iloc[start_idx]['timestamp'])
            end_time = pd.to_datetime(device_df.iloc[end_idx]['timestamp'])
            
            duration_minutes = (end_time - start_time).total_seconds() / 60
            
            logger.info(f"[CANDIDATE_CALC] 設備 {device} 事件持續時間: {duration_minutes:.1f} 分鐘，最小要求: {min_duration} 分鐘")
            
            # 檢查持續時間
            if duration_minutes < min_duration:
                logger.warning(f"[CANDIDATE_CALC] 設備 {device} 事件被過濾掉：持續時間 {duration_minutes:.1f} 分鐘 < 最小要求 {min_duration} 分鐘")
                return None
            
            # 創建事件
            event = {
                "id": str(uuid.uuid4()),
                "eventId": f"evt_{device}_{start_idx}_{end_idx}",
                "meterId": device,
                "eventTimestamp": start_time.isoformat(),
                "detectionRule": "MULTI_DIMENSIONAL",
                "score": len(indices),  # 使用異常點數量作為分數
                "dataWindow": {
                    "startTime": start_time.isoformat(),
                    "endTime": end_time.isoformat(),
                    "duration_minutes": duration_minutes,
                    "anomaly_count": len(indices)
                },
                "status": "UNREVIEWED"
            }
            
            logger.info(f"[CANDIDATE_CALC] 成功創建設備 {device} 的事件：{event['eventId']}")
            return event
        except Exception as e:
            logger.error(f"[CANDIDATE_CALC] 創建事件失敗 (設備 {device}): {e}")
            return None
    
    async def _calculate_top_devices(
        self, 
        df: pd.DataFrame, 
        events: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """計算異常事件最多的設備排名"""
        logger.info(f"[CANDIDATE_CALC] 計算設備排名")
        
        if not events:
            return []
        
        # 統計每台設備的事件數
        device_counts = {}
        for event in events:
            device = event['meterId']
            device_counts[device] = device_counts.get(device, 0) + 1
        
        # 排序並取前5名
        sorted_devices = sorted(
            device_counts.items(), 
            key=lambda x: x[1], 
            reverse=True
        )[:5]
        
        top_devices = [
            {
                "deviceNumber": device,
                "estimatedAnomalies": count
            }
            for device, count in sorted_devices
        ]
        
        return top_devices
    
    def _empty_result(self) -> Dict[str, Any]:
        """返回空結果"""
        return {
            "totalCandidates": 0,
            "totalRecords": 0,
            "uniqueDevices": 0,
            "insufficientDataDevices": 0,
            "deviceRecordsSummary": {
                "avgRecordsPerDevice": 0,
                "medianRecordsPerDevice": 0,
                "minRecordsPerDevice": 0,
                "maxRecordsPerDevice": 0
            },
            "perRule": {
                "zscoreEstimate": 0,
                "spikeEstimate": 0,
                "timeEstimate": 0,
                "gapEstimate": 0,
                "peerEstimate": 0
            },
            "totalEstimatedBeforeOverlap": 0,
            "overlapReductionFactor": 0.0,
            "overlapAdjustedTotal": 0,
            "topDevicesByEstimatedAnomalies": [],
            "timeRange": {"start": None, "end": None},
            "final_events": []  # 添加空的事件列表
        }

# 全域實例
candidate_calculation_service = CandidateCalculationService()
