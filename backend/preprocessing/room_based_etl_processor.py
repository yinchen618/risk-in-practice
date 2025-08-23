"""
房間級 PU Learning 數據預處理 ETL 腳本

基於 data_preprocessing_etl_multiscale.py 的邏輯，但使用本地 CSV 數據而非遠端資料庫。
這個腳本執行完整的 Extract, Transform, Load (ETL) 流程，
從已處理的設備 CSV 數據中生成以房間為視角的 PU 學習樣本。

主要功能：
1. 從 backend/meter.csv 讀取房間配置
2. 讀取本地設備 CSV 數據（L1 + L2 電表配對）
3. 執行房間級數據合併和時間戳對齊
4. 計算單相三線功率特徵 (110V/220V/Total)
5. 多尺度特徵工程 (15分鐘 + 60分鐘窗口)
6. 生成可直接用於 PU 學習的房間樣本

作者: Auto-Generated
日期: 2025-08-24
"""

import os
import sys
import pandas as pd
import numpy as np
import csv
import logging
import json
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple, Any
from dataclasses import dataclass
from pathlib import Path
from enum import Enum
from tqdm import tqdm

# 配置日誌
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class OccupantType(Enum):
    OFFICE_WORKER = "OFFICE_WORKER"
    STUDENT = "STUDENT"
    DEPOSITORY = "DEPOSITORY"
    UNKNOWN = "UNKNOWN"

@dataclass
class RoomInfo:
    """房間基本資訊"""
    building: str
    floor: str
    room: str
    meter_id_l1: str  # L1 電錶 ID
    meter_id_l2: str  # L2 電錶 ID
    occupant_type: OccupantType
    is_high_quality: bool = False

@dataclass
class ProcessingStats:
    """處理統計資訊"""
    total_rooms: int = 0
    successful_rooms: int = 0
    failed_rooms: int = 0
    total_samples: int = 0
    positive_samples: int = 0
    processing_time: float = 0.0

class RoomBasedETLProcessor:
    """房間級 ETL 處理器"""

    def __init__(self, device_data_dir: str = None, meter_csv_path: str = None, output_dir: str = None):
        """
        初始化房間級 ETL 處理器

        Args:
            device_data_dir: 設備 CSV 數據目錄（預設為 processed_for_db）
            meter_csv_path: 電表配置 CSV 文件路徑（預設為 backend/meter.csv）
            output_dir: 輸出目錄（預設為 room_samples_for_pu）
        """
        # 設置路徑
        self.base_dir = Path(__file__).parent
        self.device_data_dir = Path(device_data_dir) if device_data_dir else self.base_dir / "backup_2025-07-21_2025-08-23"
        self.meter_csv_path = Path(meter_csv_path) if meter_csv_path else self.base_dir.parent / "meter.csv"
        self.output_dir = Path(output_dir) if output_dir else self.base_dir / "room_samples_for_pu"

        # 創建輸出目錄
        self.output_dir.mkdir(exist_ok=True)

        # 配置參數（與 data_preprocessing_etl_multiscale.py 一致）
        self.config = {
            "resample_frequency": "1T",  # 1分鐘重採樣
            "ffill_limit": 3,           # 向前填充限制
            "min_completeness_ratio": 0.1,  # 最小完整性比例
            "max_missing_periods": 15000,   # 最大缺失時段
            "long_window_size": 60,     # 長期窗口60分鐘
            "short_window_size": 15,    # 短期窗口15分鐘
            "feature_step_size": 1,     # 特徵提取步長1分鐘
            "anomaly_time_tolerance_minutes": 10,  # 異常事件關聯容差
        }

        # 統計資訊
        self.stats = ProcessingStats()

        logger.info(f"房間級 ETL 處理器初始化完成")
        logger.info(f"設備數據目錄: {self.device_data_dir}")
        logger.info(f"電表配置文件: {self.meter_csv_path}")
        logger.info(f"輸出目錄: {self.output_dir}")

    def load_meter_mapping(self) -> Dict[str, Tuple[str, str]]:
        """
        從 CSV 文件載入電表映射關係

        Returns:
            Dict: {room_base_name: (meter_id_l1, meter_id_l2)}
        """
        logger.info(f"開始載入電表映射文件: {self.meter_csv_path}")

        if not self.meter_csv_path.exists():
            raise FileNotFoundError(f"找不到電表映射文件: {self.meter_csv_path}")

        meter_mapping = {}
        temp_meters = {}

        try:
            with open(self.meter_csv_path, 'r', encoding='utf-8') as file:
                csv_reader = csv.DictReader(file)

                for row in csv_reader:
                    meter_number = row['电表号'].strip()
                    meter_name = row['电表名称'].strip()
                    device_id = row['设备编号'].strip()

                    # 判斷是否為 'a' 結尾（L2 電表）
                    if meter_name.endswith('a'):
                        base_room_name = meter_name[:-1]
                        if base_room_name not in temp_meters:
                            temp_meters[base_room_name] = {}
                        temp_meters[base_room_name]['l2'] = device_id
                    else:
                        base_room_name = meter_name
                        if base_room_name not in temp_meters:
                            temp_meters[base_room_name] = {}
                        temp_meters[base_room_name]['l1'] = device_id

                # 配對 L1 和 L2
                for room_name, meters in temp_meters.items():
                    if 'l1' in meters and 'l2' in meters:
                        meter_mapping[room_name] = (meters['l1'], meters['l2'])
                        logger.debug(f"配對成功: {room_name} -> L1: {meters['l1']}, L2: {meters['l2']}")
                    else:
                        logger.warning(f"房間 {room_name} 缺少配對電表")

        except Exception as e:
            logger.error(f"讀取電表映射文件時發生錯誤: {e}")
            raise

        logger.info(f"成功載入 {len(meter_mapping)} 個房間的電表映射")
        return meter_mapping

    def create_room_info_from_mapping(
        self,
        meter_mapping: Dict[str, Tuple[str, str]],
        default_occupant_type: OccupantType = OccupantType.STUDENT
    ) -> List[RoomInfo]:
        """
        根據電表映射創建 RoomInfo 列表

        Args:
            meter_mapping: 電表映射字典
            default_occupant_type: 默認的佔用類型

        Returns:
            List[RoomInfo]: 房間資訊列表
        """
        logger.info("開始創建房間資訊列表...")
        room_infos = []

        for room_name, (meter_l1, meter_l2) in meter_mapping.items():
            try:
                # 解析房間名稱（例如：Building A101 -> Building: A, Floor: 1, Room: 01）
                parts = room_name.split()
                if len(parts) >= 2 and parts[0].lower() == "building":
                    building_code = parts[1]

                    if len(building_code) >= 4:  # 如 A101
                        building = building_code[0]  # A
                        floor_num = building_code[1]  # 1
                        room_num = building_code[2:]  # 01

                        # 判斷是否為高品質房間（A2、A3、A5樓層）
                        is_high_quality = building == 'A' and floor_num in ['2', '3', '5']

                        room_info = RoomInfo(
                            building=f"Building-{building}",
                            floor=f"{floor_num}F",
                            room=f"Room-{room_num}",
                            meter_id_l1=meter_l1,
                            meter_id_l2=meter_l2,
                            occupant_type=default_occupant_type,
                            is_high_quality=is_high_quality
                        )

                        room_infos.append(room_info)
                        logger.debug(f"創建房間: {room_info.building}-{room_info.floor}-{room_info.room} (高品質: {is_high_quality})")

                    else:
                        logger.warning(f"無法解析房間代碼: {building_code}")
                else:
                    logger.warning(f"無法解析房間名稱格式: {room_name}")

            except Exception as e:
                logger.error(f"解析房間名稱 '{room_name}' 時發生錯誤: {e}")

        logger.info(f"成功創建 {len(room_infos)} 個房間資訊")

        # 統計高品質房間
        high_quality_count = sum(1 for room in room_infos if room.is_high_quality)
        logger.info(f"其中高品質房間: {high_quality_count} 個")

        return room_infos

    def load_device_data(self, device_id: str) -> Optional[pd.DataFrame]:
        """
        載入原始設備數據並進行功率計算

        Args:
            device_id: 設備 ID

        Returns:
            pd.DataFrame: 設備數據，如果文件不存在則返回 None
        """
        device_file = self.device_data_dir / f"device_{device_id}.csv"

        if not device_file.exists():
            logger.warning(f"設備數據文件不存在: {device_file}")
            return None

        try:
            df = pd.read_csv(device_file)

            # 檢查必要欄位
            required_columns = ['lastUpdated', 'voltage', 'currents', 'power']
            missing_columns = [col for col in required_columns if col not in df.columns]
            if missing_columns:
                logger.warning(f"設備 {device_id} 缺少必要欄位: {missing_columns}")
                return None

            # 處理時間戳
            df['timestamp'] = pd.to_datetime(df['lastUpdated'], format='mixed', errors='coerce')
            df = df.dropna(subset=['timestamp'])
            df = df.sort_values('timestamp')

            # 計算功率（電壓 × 電流），因為原始 power 欄位通常是 0
            df['calculated_power'] = round(df['voltage'] * df['currents'], 3)

            # 如果原始功率無效，使用計算的功率
            if df['power'].sum() == 0 and df['calculated_power'].sum() > 0:
                df['power'] = df['calculated_power']
                logger.info(f"設備 {device_id}: 使用計算功率 (V×I) 替代原始功率")

            # 設置時間戳為索引
            df.set_index('timestamp', inplace=True)

            logger.debug(f"成功載入設備 {device_id} 數據: {len(df)} 筆記錄，功率範圍 {df['power'].min():.2f} ~ {df['power'].max():.2f}")
            return df

        except Exception as e:
            logger.error(f"載入設備 {device_id} 數據時發生錯誤: {e}")
            return None

    def merge_room_data(self, room_info: RoomInfo) -> Optional[pd.DataFrame]:
        """
        合併房間的 L1 和 L2 電表數據

        Args:
            room_info: 房間資訊

        Returns:
            pd.DataFrame: 合併後的房間數據
        """
        logger.info(f"開始合併房間 {room_info.building}-{room_info.floor}-{room_info.room} 的數據")

        # 載入 L1 和 L2 數據
        df_l1 = self.load_device_data(room_info.meter_id_l1)
        df_l2 = self.load_device_data(room_info.meter_id_l2)

        if df_l1 is None or df_l2 is None:
            logger.warning(f"房間 {room_info.room} 缺少必要的電表數據")
            return None

        # 提取功率數據（使用 power 欄位）
        try:
            df_l1_power = df_l1[['power']].rename(columns={'power': 'wattage_l1'})
            df_l2_power = df_l2[['power']].rename(columns={'power': 'wattage_l2'})
        except KeyError as e:
            logger.error(f"房間 {room_info.room} 數據缺少 power 欄位: {e}")
            return None

        logger.info(f"L1 數據: {len(df_l1_power)} 筆，時間範圍: {df_l1_power.index.min()} ~ {df_l1_power.index.max()}")
        logger.info(f"L2 數據: {len(df_l2_power)} 筆，時間範圍: {df_l2_power.index.min()} ~ {df_l2_power.index.max()}")

        # 重採樣對齊
        resample_freq = self.config["resample_frequency"]
        df_l1_resampled = df_l1_power.resample(resample_freq).mean()
        df_l2_resampled = df_l2_power.resample(resample_freq).mean()

        logger.info(f"重採樣後 L1: {len(df_l1_resampled.dropna())} 筆，L2: {len(df_l2_resampled.dropna())} 筆")

        # 合併數據
        df_merged = pd.concat([df_l1_resampled, df_l2_resampled], axis=1, join='outer')

        # 處理缺失值
        ffill_limit = self.config["ffill_limit"]
        df_merged = df_merged.ffill(limit=ffill_limit)

        initial_count = len(df_merged)
        df_merged = df_merged.dropna()
        final_count = len(df_merged)

        logger.info(f"合併後數據: {final_count} 筆記錄")
        if initial_count > final_count:
            logger.info(f"因連續缺失超過 {ffill_limit} 個時間點，刪除了 {initial_count - final_count} 筆數據")

        return df_merged

    def transform_room_data(self, df_merged: pd.DataFrame, room_id: str) -> pd.DataFrame:
        """
        轉換房間數據，計算功率特徵

        Args:
            df_merged: 合併後的原始數據
            room_id: 房間 ID

        Returns:
            pd.DataFrame: 轉換後的數據
        """
        logger.info(f"開始轉換房間 {room_id} 的數據")

        df_transformed = df_merged.copy()

        # 保留原始功率數據（四捨五入到第三位）
        df_transformed['rawWattageL1'] = round(df_merged['wattage_l1'], 3)
        df_transformed['rawWattageL2'] = round(df_merged['wattage_l2'], 3)

        # 根據單相三線配置計算新特徵（四捨五入到第三位）
        df_transformed['wattageTotal'] = round(df_merged['wattage_l1'] + df_merged['wattage_l2'], 3)
        df_transformed['wattage220v'] = round(2 * np.minimum(df_merged['wattage_l1'], df_merged['wattage_l2']), 3)
        df_transformed['wattage110v'] = round(np.abs(df_merged['wattage_l1'] - df_merged['wattage_l2']), 3)

        # 計算統計資訊
        logger.info(f"功率特徵計算完成:")
        logger.info(f"  wattageTotal 範圍: {df_transformed['wattageTotal'].min():.2f} ~ {df_transformed['wattageTotal'].max():.2f}")
        logger.info(f"  wattage220v 範圍: {df_transformed['wattage220v'].min():.2f} ~ {df_transformed['wattage220v'].max():.2f}")
        logger.info(f"  wattage110v 範圍: {df_transformed['wattage110v'].min():.2f} ~ {df_transformed['wattage110v'].max():.2f}")

        # 添加房間 ID
        df_transformed['room_id'] = room_id

        # 重置索引
        df_transformed.reset_index(inplace=True)

        # 清理中間欄位
        df_transformed = df_transformed.drop(columns=['wattage_l1', 'wattage_l2'])

        logger.info(f"數據轉換完成，最終 {len(df_transformed)} 筆記錄")
        return df_transformed

    def _extract_time_window_features(
        self,
        df: pd.DataFrame,
        timestamp: pd.Timestamp,
        window_size: int,
        suffix: str
    ) -> Dict[str, float]:
        """提取時間窗口統計特徵"""
        window_start = timestamp - pd.Timedelta(minutes=window_size-1)
        mask = (df['timestamp'] >= window_start) & (df['timestamp'] <= timestamp)
        window_data = df[mask]

        features = {}

        if len(window_data) == 0:
            power_types = ['wattage110v', 'wattage220v', 'wattageTotal']
            stats = ['mean', 'std', 'max', 'min']
            for power_type in power_types:
                for stat in stats:
                    features[f"{power_type}_{stat}_{suffix}"] = np.nan
            return features

        power_types = ['wattage110v', 'wattage220v', 'wattageTotal']

        for power_type in power_types:
            if power_type in window_data.columns:
                values = window_data[power_type].dropna()
                if len(values) > 0:
                    try:
                        features[f"{power_type}_mean_{suffix}"] = round(float(values.mean()), 3)
                        features[f"{power_type}_std_{suffix}"] = round(float(values.std()), 3)
                        features[f"{power_type}_max_{suffix}"] = round(float(values.max()), 3)
                        features[f"{power_type}_min_{suffix}"] = round(float(values.min()), 3)
                        features[f"{power_type}_range_{suffix}"] = round(float(values.max() - values.min()), 3)
                        features[f"{power_type}_var_{suffix}"] = round(float(values.var()), 3)
                    except Exception as e:
                        # 如果計算失敗，設置為 NaN
                        for stat in ['mean', 'std', 'max', 'min', 'range', 'var']:
                            features[f"{power_type}_{stat}_{suffix}"] = np.nan
                else:
                    for stat in ['mean', 'std', 'max', 'min', 'range', 'var']:
                        features[f"{power_type}_{stat}_{suffix}"] = np.nan

        return features

    def _extract_time_features(self, timestamp: pd.Timestamp) -> Dict[str, float]:
        """提取時間相關特徵"""
        return {
            'hour_of_day': timestamp.hour,
            'day_of_week': timestamp.dayofweek,
            'is_weekend': 1.0 if timestamp.dayofweek >= 5 else 0.0,
            'is_business_hours': 1.0 if 8 <= timestamp.hour <= 18 else 0.0,
        }

    def generate_multiscale_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        生成多尺度特徵工程

        Args:
            df: 轉換後的基礎數據

        Returns:
            pd.DataFrame: 包含多尺度特徵的樣本數據
        """
        logger.info("開始多尺度特徵工程...")

        long_window = self.config["long_window_size"]   # 60分鐘
        short_window = self.config["short_window_size"]  # 15分鐘
        step_size = self.config["feature_step_size"]     # 1分鐘

        logger.info(f"長期窗口: {long_window}分鐘, 短期窗口: {short_window}分鐘, 步長: {step_size}分鐘")

        # 確保數據按時間排序
        df_sorted = df.sort_values('timestamp').reset_index(drop=True)

        min_start_idx = long_window - 1

        if len(df_sorted) <= min_start_idx:
            logger.warning(f"數據量不足以生成多尺度特徵，需要至少 {min_start_idx + 1} 筆數據，實際只有 {len(df_sorted)} 筆")
            return pd.DataFrame()

        samples = []

        for i in range(min_start_idx, len(df_sorted), step_size):
            current_timestamp = df_sorted.iloc[i]['timestamp']
            current_row = df_sorted.iloc[i]

            sample = {
                'timestamp': current_timestamp,
                'room_id': current_row['room_id'],
                'rawWattageL1': round(current_row['rawWattageL1'], 3),
                'rawWattageL2': round(current_row['rawWattageL2'], 3),
                'wattage110v_current': round(current_row['wattage110v'], 3),
                'wattage220v_current': round(current_row['wattage220v'], 3),
                'wattageTotal_current': round(current_row['wattageTotal'], 3),
                # PU 學習標籤（預設為 False，之後可以根據需要設置）
                'isPositiveLabel': False,
                'sourceAnomalyEventId': None,
            }

            # 提取長期窗口特徵 (60分鐘)
            long_features = self._extract_time_window_features(
                df_sorted.iloc[:i+1], current_timestamp, long_window, "60m"
            )
            sample.update(long_features)

            # 提取短期窗口特徵 (15分鐘)
            short_features = self._extract_time_window_features(
                df_sorted.iloc[:i+1], current_timestamp, short_window, "15m"
            )
            sample.update(short_features)

            # 提取時間特徵
            time_features = self._extract_time_features(current_timestamp)
            sample.update(time_features)

            samples.append(sample)

        result_df = pd.DataFrame(samples)

        logger.info(f"成功生成 {len(result_df)} 個多尺度特徵樣本")
        logger.info(f"特徵總數: {len(result_df.columns)} 個")

        return result_df

    def process_room(self, room_info: RoomInfo, room_id: str) -> Optional[pd.DataFrame]:
        """
        處理單個房間的完整 ETL 流程

        Args:
            room_info: 房間資訊
            room_id: 房間 ID

        Returns:
            pd.DataFrame: 處理完成的房間樣本數據
        """
        logger.info(f"開始處理房間: {room_id} ({room_info.building}-{room_info.floor}-{room_info.room})")

        try:
            # 步驟一：合併房間數據
            df_merged = self.merge_room_data(room_info)
            if df_merged is None:
                logger.warning(f"房間 {room_info.room} 數據合併失敗")
                return None

            # 步驟二：轉換數據
            df_transformed = self.transform_room_data(df_merged, room_id)

            # 步驟三：多尺度特徵工程
            df_final = self.generate_multiscale_features(df_transformed)

            if len(df_final) == 0:
                logger.warning(f"房間 {room_info.room} 多尺度特徵生成失敗")
                return None

            logger.info(f"房間 {room_info.room} 處理完成，生成 {len(df_final)} 個樣本")
            return df_final

        except Exception as e:
            logger.error(f"處理房間 {room_info.room} 時發生錯誤: {e}")
            return None

    def save_room_samples(self, df: pd.DataFrame, room_id: str) -> str:
        """
        保存房間樣本數據

        Args:
            df: 房間樣本數據
            room_id: 房間 ID

        Returns:
            str: 保存的文件路徑
        """
        # 生成文件名
        csv_file = self.output_dir / f"room_samples_{room_id}.csv"
        json_file = self.output_dir / f"room_summary_{room_id}.json"

        # 保存 CSV 數據
        df.to_csv(csv_file, index=False)

        # 生成摘要信息
        summary = {
            "room_id": room_id,
            "data_summary": {
                "total_samples": len(df),
                "positive_samples": int(df['isPositiveLabel'].sum()),
                "time_range": {
                    "start": df['timestamp'].min().isoformat(),
                    "end": df['timestamp'].max().isoformat()
                },
                "features_count": len(df.columns),
                "wattage_stats": {
                    "total_mean": round(float(df['wattageTotal_current'].mean()), 3),
                    "total_std": round(float(df['wattageTotal_current'].std()), 3),
                    "220v_mean": round(float(df['wattage220v_current'].mean()), 3),
                    "110v_mean": round(float(df['wattage110v_current'].mean()), 3)
                }
            },
            "processing_timestamp": datetime.now().isoformat()
        }

        # 保存摘要
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(summary, f, indent=2, ensure_ascii=False)

        logger.info(f"房間樣本已保存: {csv_file}")
        logger.info(f"房間摘要已保存: {json_file}")

        return str(csv_file)

    def generate_room_metadata(self, room_infos: List[RoomInfo]) -> None:
        """
        生成房間元資料一覽表

        Args:
            room_infos: 房間資訊列表
        """
        logger.info("生成房間元資料一覽表...")

        metadata_file = self.output_dir / "rooms_metadata.csv"

        with open(metadata_file, 'w', encoding='utf-8', newline='') as f:
            fieldnames = ['room_id', 'building', 'floor', 'room', 'occupant_type', 'l1_device', 'l2_device', 'is_high_quality']
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()

            for i, room_info in enumerate(room_infos, 1):
                writer.writerow({
                    'room_id': f"R{i:03d}",  # R001, R002, R003...
                    'building': room_info.building,
                    'floor': room_info.floor,
                    'room': room_info.room,
                    'occupant_type': room_info.occupant_type.value,
                    'l1_device': room_info.meter_id_l1,
                    'l2_device': room_info.meter_id_l2,
                    'is_high_quality': room_info.is_high_quality
                })

        logger.info(f"房間元資料已保存至: {metadata_file}")

    def process_all_rooms(self, filter_high_quality: bool = False) -> List[str]:
        """
        處理所有房間數據

        Args:
            filter_high_quality: 是否只處理高品質房間

        Returns:
            List[str]: 成功處理的文件路徑列表
        """
        start_time = datetime.now()
        logger.info("開始處理所有房間數據...")

        # 載入房間配置
        meter_mapping = self.load_meter_mapping()
        room_infos = self.create_room_info_from_mapping(meter_mapping)

        # 建立輸出目錄
        os.makedirs(self.output_dir, exist_ok=True)

        # 生成房間元資料一覽表
        self.generate_room_metadata(room_infos)

        if filter_high_quality:
            room_infos = [room for room in room_infos if room.is_high_quality]
            logger.info(f"篩選後處理 {len(room_infos)} 個高品質房間")
        else:
            logger.info(f"處理全部 {len(room_infos)} 個房間")

        self.stats.total_rooms = len(room_infos)
        successful_files = []
        failed_rooms = []

        # 處理每個房間
        for i, room_info in enumerate(tqdm(room_infos, desc="處理房間"), 1):
            try:
                room_id = f"R{i:03d}"  # R001, R002, R003...
                df_samples = self.process_room(room_info, room_id)

                if df_samples is not None and len(df_samples) > 0:
                    # 保存樣本
                    file_path = self.save_room_samples(df_samples, room_id)
                    successful_files.append(file_path)

                    self.stats.successful_rooms += 1
                    self.stats.total_samples += len(df_samples)
                    self.stats.positive_samples += int(df_samples['isPositiveLabel'].sum())

                    logger.info(f"✅ 房間 {room_id} 處理成功，生成 {len(df_samples)} 個樣本")
                else:
                    failed_rooms.append(room_id)
                    self.stats.failed_rooms += 1
                    logger.warning(f"❌ 房間 {room_id} 處理失敗")

            except Exception as e:
                room_id = f"R{i:03d}"
                failed_rooms.append(room_id)
                self.stats.failed_rooms += 1
                logger.error(f"❌ 房間 {room_id} 處理異常: {e}")

        # 計算處理時間
        end_time = datetime.now()
        self.stats.processing_time = (end_time - start_time).total_seconds()

        # 生成合併樣本文件
        if successful_files:
            self.create_merged_samples()

        # 保存處理報告
        self.save_processing_report()

        # 輸出處理摘要
        self.print_processing_summary()

        return successful_files

    def create_merged_samples(self):
        """創建合併的樣本文件"""
        logger.info("開始創建合併樣本文件...")

        all_samples = []
        room_files = list(self.output_dir.glob("room_samples_*.csv"))

        for file_path in tqdm(room_files, desc="合併房間樣本"):
            try:
                df = pd.read_csv(file_path)
                all_samples.append(df)
            except Exception as e:
                logger.error(f"讀取文件 {file_path} 時發生錯誤: {e}")

        if all_samples:
            merged_df = pd.concat(all_samples, ignore_index=True)
            merged_file = self.output_dir / "all_room_samples_for_pu.csv"
            merged_df.to_csv(merged_file, index=False)

            logger.info(f"合併樣本已保存: {merged_file}")
            logger.info(f"總樣本數: {len(merged_df)}")
            logger.info(f"正樣本數: {merged_df['isPositiveLabel'].sum()}")

    def save_processing_report(self):
        """保存處理報告"""
        report = {
            "processing_summary": {
                "total_rooms": self.stats.total_rooms,
                "successful_rooms": self.stats.successful_rooms,
                "failed_rooms": self.stats.failed_rooms,
                "success_rate": self.stats.successful_rooms / self.stats.total_rooms if self.stats.total_rooms > 0 else 0,
                "total_samples": self.stats.total_samples,
                "positive_samples": self.stats.positive_samples,
                "processing_time_seconds": self.stats.processing_time
            },
            "configuration": self.config,
            "output_directory": str(self.output_dir),
            "processing_timestamp": datetime.now().isoformat()
        }

        report_file = self.output_dir / "processing_report.json"
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)

        logger.info(f"處理報告已保存: {report_file}")

    def print_processing_summary(self):
        """打印處理摘要"""
        logger.info("=" * 60)
        logger.info("🎉 房間級 PU 學習樣本生成完成！")
        logger.info("=" * 60)
        logger.info(f"總房間數: {self.stats.total_rooms}")
        logger.info(f"成功處理: {self.stats.successful_rooms}")
        logger.info(f"處理失敗: {self.stats.failed_rooms}")
        logger.info(f"成功率: {self.stats.successful_rooms/self.stats.total_rooms:.1%}")
        logger.info(f"總樣本數: {self.stats.total_samples:,}")
        logger.info(f"正樣本數: {self.stats.positive_samples}")
        logger.info(f"處理時間: {self.stats.processing_time:.1f} 秒")
        logger.info(f"輸出目錄: {self.output_dir}")
        logger.info("=" * 60)

def main():
    """主函數"""
    logger.info("🏠 開始房間級 PU 學習樣本生成...")

    # 初始化處理器
    processor = RoomBasedETLProcessor()

    # 處理所有房間（可選擇只處理高品質房間）
    # filter_high_quality=True  # 只處理高品質房間
    # filter_high_quality=False # 處理所有房間

    successful_files = processor.process_all_rooms(filter_high_quality=False)

    logger.info(f"🎯 處理完成！成功生成 {len(successful_files)} 個房間樣本文件")

if __name__ == "__main__":
    main()
