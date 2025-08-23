"""
PU Learning 數據預處理 ETL 腳本

這個腳本執行完整的 Extract, Transform, Load (ETL) 流程，
從原始電錶數據中生成可直接用於模型訓練的乾淨數據集。

主要功能：
1. 尋找最佳的連續 7 天數據窗口 (Golden Window)
2. 抽取原始數據並進行時間戳對齊
3. 轉換數據格式並計算功率特徵
4. 多尺度特徵工程 (15分鐘 + 60分鐘窗口)
5. 載入到分析數據庫表中

作者: Auto-Generated
日期: 2025-08-23
"""

import os
import sys
import asyncio
import asyncpg
import pandas as pd
import numpy as np
import csv
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
from pathlib import Path
from enum import Enum

# 導入配置文件
try:
    from etl_config import (
        DATABASE_CONFIG, ETL_CONFIG, PREDEFINED_ROOMS, TIME_RANGES,
        get_database_url, get_etl_config, get_room_by_id, get_time_range,
        list_available_rooms
    )
except ImportError:
    # 如果找不到配置文件，使用預設配置
    print("警告: 找不到 etl_config.py，使用預設配置")
    DATABASE_CONFIG = {"default_url": "postgresql://postgres:Info4467@supa.clkvfvz5fxb3.ap-northeast-3.rds.amazonaws.com:5432/supa"}
    ETL_CONFIG = {
        "resample_frequency": "1T",
        "ffill_limit": 3,
        "anomaly_time_tolerance_minutes": 5,
        "min_completeness_ratio": 0.1,  # 降低到 10% 以適應 IoT 感測器數據的實際情況
        "max_missing_periods": 15000,   # 增加到 15000 個時段以應對數據稀疏性
        "long_window_size": 60,
        "short_window_size": 15,
        "feature_step_size": 1,
    }
    PREDEFINED_ROOMS = []
    TIME_RANGES = {}

    def get_database_url():
        import os
        return os.getenv("DATABASE_URL", DATABASE_CONFIG["default_url"])

    def get_etl_config():
        return ETL_CONFIG.copy()

# 配置日誌
logging.basicConfig(
    level=logging.DEBUG,  # 改為 DEBUG 等級以顯示詳細資訊
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
import logging
from dataclasses import dataclass
import asyncio
import asyncpg
import os
import csv
from pathlib import Path
from enum import Enum

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

@dataclass
class RoomInfo:
    """房間基本資訊"""
    building: str
    floor: str
    room: str
    meter_id_l1: str  # L1 電錶 ID
    meter_id_l2: str  # L2 電錶 ID
    occupant_type: OccupantType
    is_high_quality: bool = False  # 是否為高品質房間，預設為 False

@dataclass
class DataQualityMetrics:
    """數據品質指標"""
    completeness_ratio: float  # 數據完整性比例
    missing_periods: int       # 缺失時段數量
    consecutive_days: int      # 連續天數
    start_date: datetime
    end_date: datetime

class DataPreprocessingETL:
    """數據預處理 ETL 主類"""

    def __init__(self, database_url: str = None, config: Dict = None):
        """
        初始化 ETL 處理器

        Args:
            database_url: PostgreSQL 連接字串 (如果為 None，則使用配置文件中的設定)
            config: ETL 配置參數字典 (可選，會與配置文件合併)
        """
        # 使用配置文件中的資料庫 URL，如果沒有傳入的話
        self.database_url = database_url or get_database_url()
        self.conn = None

        # 從配置文件載入默認配置
        self.config = get_etl_config()

        # 如果提供了自定義配置，則更新默認配置
        if config:
            self.config.update(config)

        logger.info(f"ETL 初始化完成，使用資料庫: {self.database_url.split('@')[-1] if '@' in self.database_url else 'localhost'}")
        logger.info(f"配置載入完成，長期窗口: {self.config['long_window_size']}分鐘，短期窗口: {self.config['short_window_size']}分鐘")

    def load_meter_mapping(self, csv_path: str = "meter.csv") -> Dict[str, Tuple[str, str]]:
        """
        從 CSV 文件載入電表映射關係

        Args:
            csv_path: CSV 文件路徑

        Returns:
            Dict: {room_base_name: (meter_id_l1, meter_id_l2)}

        例如:
            {"Building A101": ("402A8FB04CDC", "402A8FB028E7")}
        """
        logger.info(f"開始載入電表映射文件: {csv_path}")

        # 確保文件存在
        csv_file_path = Path(csv_path)
        if not csv_file_path.exists():
            # 嘗試在當前腳本目錄下查找
            script_dir = Path(__file__).parent
            csv_file_path = script_dir / csv_path

        if not csv_file_path.exists():
            raise FileNotFoundError(f"找不到電表映射文件: {csv_path}")

        meter_mapping = {}

        try:
            with open(csv_file_path, 'r', encoding='utf-8') as file:
                csv_reader = csv.DictReader(file)

                # 臨時存儲，用於配對 L1 和 L2
                temp_meters = {}

                for row in csv_reader:
                    meter_number = row['电表号'].strip()
                    meter_name = row['电表名称'].strip()
                    device_id = row['设备编号'].strip()

                    # 判斷是否為 'a' 結尾（L2 電表）
                    if meter_name.endswith('a'):
                        # 這是 L2 電表，取得基礎房間名稱
                        base_room_name = meter_name[:-1]  # 移除末尾的 'a'

                        if base_room_name not in temp_meters:
                            temp_meters[base_room_name] = {}
                        temp_meters[base_room_name]['l2'] = device_id

                    else:
                        # 這是 L1 電表
                        base_room_name = meter_name

                        if base_room_name not in temp_meters:
                            temp_meters[base_room_name] = {}
                        temp_meters[base_room_name]['l1'] = device_id

                # 配對 L1 和 L2，生成最終映射
                for room_name, meters in temp_meters.items():
                    if 'l1' in meters and 'l2' in meters:
                        meter_mapping[room_name] = (meters['l1'], meters['l2'])
                        logger.debug(f"配對成功: {room_name} -> L1: {meters['l1']}, L2: {meters['l2']}")
                    else:
                        logger.warning(f"房間 {room_name} 缺少配對電表 - L1: {'✓' if 'l1' in meters else '✗'}, L2: {'✓' if 'l2' in meters else '✗'}")

        except Exception as e:
            logger.error(f"讀取電表映射文件時發生錯誤: {e}")
            raise

        logger.info(f"成功載入 {len(meter_mapping)} 個房間的電表映射")

        # 顯示前5個映射作為範例
        example_count = min(5, len(meter_mapping))
        logger.info("電表映射範例:")
        for i, (room, (l1, l2)) in enumerate(list(meter_mapping.items())[:example_count]):
            logger.info(f"  {i+1}. {room}: L1={l1}, L2={l2}")

        if len(meter_mapping) > example_count:
            logger.info(f"  ... 還有 {len(meter_mapping) - example_count} 個房間")

        return meter_mapping

    def create_room_info_from_mapping(
        self,
        meter_mapping: Dict[str, Tuple[str, str]],
        default_occupant_type: OccupantType = OccupantType.OFFICE_WORKER
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
            # 解析房間名稱（例如：Building A101 -> Building: A, Floor: 1, Room: 01）
            try:
                # 基本解析邏輯，可以根據實際需求調整
                parts = room_name.split()
                if len(parts) >= 2 and parts[0].lower() == "building":
                    building_code = parts[1]

                    # 提取樓層和房間號
                    if len(building_code) >= 4:  # 如 A101
                        building = building_code[0]  # A
                        floor_num = building_code[1]  # 1
                        room_num = building_code[2:]  # 01

                        room_info = RoomInfo(
                            building=f"Building-{building}",
                            floor=f"{floor_num}F",
                            room=f"Room-{room_num}",
                            meter_id_l1=meter_l1,
                            meter_id_l2=meter_l2,
                            occupant_type=default_occupant_type
                        )

                        room_infos.append(room_info)
                        logger.debug(f"創建房間: {room_info.building}-{room_info.floor}-{room_info.room}")

                    else:
                        logger.warning(f"無法解析房間代碼: {building_code}")
                else:
                    logger.warning(f"無法解析房間名稱格式: {room_name}")

            except Exception as e:
                logger.error(f"解析房間名稱 '{room_name}' 時發生錯誤: {e}")

        logger.info(f"成功創建 {len(room_infos)} 個房間資訊")

        return room_infos

    async def connect_database(self):
        """建立數據庫連接"""
        try:
            self.conn = await asyncpg.connect(self.database_url)
            logger.info("成功連接到數據庫")
        except Exception as e:
            logger.error(f"數據庫連接失敗: {e}")
            raise

    async def close_database(self):
        """關閉數據庫連接"""
        if self.conn:
            await self.conn.close()
            logger.info("數據庫連接已關閉")

    async def find_golden_window(
        self,
        room_info: RoomInfo,
        search_start: datetime,
        search_end: datetime,
        window_days: int = 7
    ) -> Tuple[datetime, datetime]:
        """
        步驟一：尋找最佳數據窗口 (Find Golden Window)

        在指定的時間範圍內，找出數據品質最佳的連續 N 天。

        Args:
            room_info: 房間資訊
            search_start: 搜索開始日期
            search_end: 搜索結束日期
            window_days: 窗口天數 (預設 7 天)

        Returns:
            (start_date, end_date): 最佳窗口的起訖日期
        """
        logger.info(f"🔍 開始為房間 {room_info.room} 尋找最佳 {window_days} 天數據窗口")
        logger.info(f"   搜索範圍: {search_start} 至 {search_end}")
        logger.info(f"   電表 L1: {room_info.meter_id_l1}, L2: {room_info.meter_id_l2}")

        best_window = None
        best_quality_score = (0.0, -float('inf'))  # 多級優先制初始值
        total_windows = 0
        valid_windows = 0

        # 以天為單位滑動窗口
        current_date = search_start
        while current_date + timedelta(days=window_days) <= search_end:
            window_start = current_date
            window_end = current_date + timedelta(days=window_days)
            total_windows += 1

            logger.info(f"   🕐 檢查窗口 {total_windows}: {window_start.strftime('%Y-%m-%d')} 至 {window_end.strftime('%Y-%m-%d')}")

            # 評估此窗口的數據品質
            quality_metrics = await self._evaluate_data_quality(
                room_info, window_start, window_end
            )

            # 記錄詳細的品質指標
            logger.info(f"      📊 數據品質: 完整性={quality_metrics.completeness_ratio:.3f}, 缺失時段={quality_metrics.missing_periods}")

            # 檢查是否符合最低要求
            min_completeness = self.config.get("min_completeness_ratio", 0.1)
            max_missing = self.config.get("max_missing_periods", 15000)

            if (quality_metrics.completeness_ratio >= min_completeness and
                quality_metrics.missing_periods <= max_missing):
                valid_windows += 1

                # 評分標準：採用元組 (tuple) 進行多級排序
                # Python 會自動先比較元組的第一個元素，如果相同，再比較第二個，以此類推
                quality_tuple = (
                    quality_metrics.completeness_ratio,  # 第一優先：完整度越高越好
                    -quality_metrics.missing_periods,    # 第二優先：缺失時段越少越好 (取負值使其變為越大越好)
                    # 未來還可以加入第三優先級，例如 -max_continuous_gap (最長中斷時間越短越好)
                )

                logger.info(f"      ✅ 符合品質要求，品質元組: {quality_tuple}")

                if quality_tuple > best_quality_score:
                    best_quality_score = quality_tuple
                    best_window = (window_start, window_end)
                    logger.info(f"      🏆 新的最佳窗口！")
            else:
                logger.info(f"      ❌ 不符合品質要求 (完整性需>={min_completeness}, 缺失<={max_missing})")

            current_date += timedelta(days=1)

        logger.info(f"📋 搜索結果: 檢查了 {total_windows} 個窗口，{valid_windows} 個符合要求")
        logger.info(f"   最低品質要求: 完整性 >= {self.config.get('min_completeness_ratio', 0.1)}, 缺失時段 <= {self.config.get('max_missing_periods', 15000)}")

        if best_window is None:
            logger.error(f"❌ 在指定範圍內找不到符合條件的 {window_days} 天窗口")
            logger.error(f"   建議: 降低品質要求或擴大搜索時間範圍")
            raise ValueError(f"在指定範圍內找不到符合條件的 {window_days} 天窗口")

        logger.info(f"🎯 找到最佳窗口: {best_window[0].strftime('%Y-%m-%d')} 到 {best_window[1].strftime('%Y-%m-%d')}")
        logger.info(f"   最佳品質元組: 完整性={best_quality_score[0]:.3f}, 缺失時段={-best_quality_score[1]}")
        return best_window

    async def _evaluate_data_quality(
        self,
        room_info: RoomInfo,
        start_date: datetime,
        end_date: datetime
    ) -> DataQualityMetrics:
        """
        評估指定時間窗口內的數據品質

        Args:
            room_info: 房間資訊
            start_date: 開始日期
            end_date: 結束日期

        Returns:
            DataQualityMetrics: 數據品質指標
        """
        # 查詢該時間段內的數據筆數
        # 查詢 L1 電表的時間範圍
        query_l1 = """
        SELECT COUNT(*) as total_records,
               MIN("lastUpdated") as min_time,
               MAX("lastUpdated") as max_time
        FROM ammeter_log
        WHERE "deviceNumber" = $1
        AND "lastUpdated" BETWEEN $2 AND $3
        """

        query_l2 = """
        SELECT COUNT(*) as total_records,
               MIN("lastUpdated") as min_time,
               MAX("lastUpdated") as max_time
        FROM ammeter_log
        WHERE "deviceNumber" = $1
        AND "lastUpdated" BETWEEN $2 AND $3
        """

        result_l1 = await self.conn.fetchrow(query_l1, room_info.meter_id_l1, start_date, end_date)
        result_l2 = await self.conn.fetchrow(query_l2, room_info.meter_id_l2, start_date, end_date)

        # 記錄詳細的查詢結果
        logger.info(f"        🔌 L1電表 {room_info.meter_id_l1}: {result_l1['total_records']} 筆記錄")
        if result_l1['total_records'] > 0:
            logger.info(f"           時間範圍: {result_l1['min_time']} 至 {result_l1['max_time']}")

        logger.info(f"        🔌 L2電表 {room_info.meter_id_l2}: {result_l2['total_records']} 筆記錄")
        if result_l2['total_records'] > 0:
            logger.info(f"           時間範圍: {result_l2['min_time']} 至 {result_l2['max_time']}")

        # 計算期望的數據筆數 (假設每分鐘一筆)
        expected_records = int((end_date - start_date).total_seconds() / 60)
        logger.info(f"        📅 期望記錄數: {expected_records} 筆 (每分鐘1筆)")

        # 計算完整性比例
        actual_records = min(result_l1['total_records'], result_l2['total_records'])
        completeness_ratio = actual_records / expected_records if expected_records > 0 else 0.0

        # 簡化的缺失時段計算 (實際可以更精細)
        missing_periods = max(0, expected_records - actual_records)

        logger.info(f"        📊 實際記錄數: {actual_records} 筆")
        logger.info(f"        📈 完整性比例: {completeness_ratio:.3f} ({actual_records}/{expected_records})")
        logger.info(f"        ⚠️  缺失時段: {missing_periods} 個")

        return DataQualityMetrics(
            completeness_ratio=completeness_ratio,
            missing_periods=missing_periods,
            consecutive_days=(end_date - start_date).days,
            start_date=start_date,
            end_date=end_date
        )

    async def extract_raw_data(
        self,
        room_info: RoomInfo,
        start_date: datetime,
        end_date: datetime
    ) -> Tuple[pd.DataFrame, pd.DataFrame]:
        """
        步驟二：抽取原始數據 (Extract)

        從數據庫中抽取指定時間範圍內的原始電錶數據

        Args:
            room_info: 房間資訊
            start_date: 開始日期
            end_date: 結束日期

        Returns:
            (df_l1, df_l2): L1 和 L2 的原始數據 DataFrame
        """
        logger.info(f"開始抽取原始數據: {start_date} 到 {end_date}")

        # 查詢 L1 電錶數據
        query_l1 = """
        SELECT "lastUpdated" as timestamp, power as wattage
        FROM ammeter_log
        WHERE "deviceNumber" = $1
        AND "lastUpdated" BETWEEN $2 AND $3
        ORDER BY "lastUpdated"
        """

        # 查詢 L2 電錶數據
        query_l2 = """
        SELECT "lastUpdated" as timestamp, power as wattage
        FROM ammeter_log
        WHERE "deviceNumber" = $1
        AND "lastUpdated" BETWEEN $2 AND $3
        ORDER BY "lastUpdated"
        """

        # 執行查詢
        rows_l1 = await self.conn.fetch(query_l1, room_info.meter_id_l1, start_date, end_date)
        rows_l2 = await self.conn.fetch(query_l2, room_info.meter_id_l2, start_date, end_date)

        # 轉換為 DataFrame
        df_l1 = pd.DataFrame(rows_l1, columns=['timestamp', 'wattage'])
        df_l2 = pd.DataFrame(rows_l2, columns=['timestamp', 'wattage'])

        # 設置時間戳為索引
        df_l1['timestamp'] = pd.to_datetime(df_l1['timestamp'])
        df_l2['timestamp'] = pd.to_datetime(df_l2['timestamp'])
        df_l1.set_index('timestamp', inplace=True)
        df_l2.set_index('timestamp', inplace=True)

        logger.info(f"L1 數據筆數: {len(df_l1)}, L2 數據筆數: {len(df_l2)}")
        return df_l1, df_l2

    def transform_data(
        self,
        df_l1: pd.DataFrame,
        df_l2: pd.DataFrame,
        room_info: RoomInfo
    ) -> pd.DataFrame:
        """
        步驟三：轉換數據 (Transform)

        這是流程的核心，執行時間戳對齊、功率拆解計算等處理

        Args:
            df_l1: L1 電錶數據
            df_l2: L2 電錶數據
            room_info: 房間資訊

        Returns:
            pd.DataFrame: 轉換後的乾淨數據
        """
        logger.info("開始數據轉換處理")

        # 3.1 時間戳對齊 (Timestamp Alignment)
        logger.info("執行時間戳對齊...")
        logger.info(f"L1 原始數據範圍: {df_l1.index.min()} 到 {df_l1.index.max()}")
        logger.info(f"L2 原始數據範圍: {df_l2.index.min()} 到 {df_l2.index.max()}")

        # 步驟 4.1: 分別重採樣 (Resample Separately)
        # 將帶有「毛刺」時間戳的數據對齊到統一的分鐘時間格線
        resample_freq = self.config["resample_frequency"]
        df_l1_resampled = df_l1.resample(resample_freq).mean()
        df_l2_resampled = df_l2.resample(resample_freq).mean()

        logger.info(f"使用重採樣頻率: {resample_freq}")
        logger.info(f"重採樣後 L1 數據筆數: {len(df_l1_resampled.dropna())}")
        logger.info(f"重採樣後 L2 數據筆數: {len(df_l2_resampled.dropna())}")

        # 步驟 4.2: 合併對齊後的數據 (Merge the Aligned Data)
        # 使用 concat 進行外部合併，確保所有時間點都被保留
        df_merged = pd.concat([df_l1_resampled, df_l2_resampled], axis=1, join='outer')
        df_merged.columns = ['wattage_l1', 'wattage_l2']

        logger.info(f"合併後數據筆數: {len(df_merged)}")

        # 步驟 4.3: 處理合併後的缺失值 (Handle Missing Values Post-Merge)
        # 使用向前填充，最多填充連續 N 個缺失值
        ffill_limit = self.config["ffill_limit"]
        df_merged = df_merged.fillna(method='ffill', limit=ffill_limit)

        logger.info(f"使用向前填充限制: {ffill_limit} 個時間點")

        # 刪除仍然存在 NaN 的行（表示超過限制的連續數據缺失）
        initial_count = len(df_merged)
        df_merged = df_merged.dropna()
        final_count = len(df_merged)

        logger.info(f"向前填充後最終數據筆數: {final_count}")
        if initial_count > final_count:
            logger.warning(f"因連續缺失超過{ffill_limit}個時間點，刪除了 {initial_count - final_count} 筆數據")

        # 3.2 功率拆解計算 (Power Decomposition)
        logger.info("執行功率拆解計算...")

        df_transformed = df_merged.copy()
        df_transformed['rawWattageL1'] = df_merged['wattage_l1']
        df_transformed['rawWattageL2'] = df_merged['wattage_l2']

        # 根據單相三線配置計算新特徵
        df_transformed['wattageTotal'] = df_merged['wattage_l1'] + df_merged['wattage_l2']
        df_transformed['wattage220v'] = 2 * np.minimum(df_merged['wattage_l1'], df_merged['wattage_l2'])
        df_transformed['wattage110v'] = np.abs(df_merged['wattage_l1'] - df_merged['wattage_l2'])

        # 計算統計資訊用於診斷
        logger.info(f"功率特徵計算完成:")
        logger.info(f"  wattageTotal 範圍: {df_transformed['wattageTotal'].min():.2f} ~ {df_transformed['wattageTotal'].max():.2f}")
        logger.info(f"  wattage220v 範圍: {df_transformed['wattage220v'].min():.2f} ~ {df_transformed['wattage220v'].max():.2f}")
        logger.info(f"  wattage110v 範圍: {df_transformed['wattage110v'].min():.2f} ~ {df_transformed['wattage110v'].max():.2f}")

        # 添加房間資訊
        df_transformed['room'] = room_info.room

        # 重置索引，讓時間戳成為普通欄位
        df_transformed.reset_index(inplace=True)
        df_transformed.rename(columns={'timestamp': 'timestamp'}, inplace=True)

        # 刪除中間計算欄位
        df_transformed = df_transformed.drop(columns=['wattage_l1', 'wattage_l2'])

        logger.info("功率拆解計算完成")
        return df_transformed

    def _extract_time_window_features(
        self,
        df: pd.DataFrame,
        timestamp: pd.Timestamp,
        window_size: int,
        suffix: str
    ) -> Dict[str, float]:
        """
        從指定時間窗口中提取統計特徵

        Args:
            df: 包含功率數據的 DataFrame
            timestamp: 窗口結束時間點
            window_size: 窗口大小（分鐘）
            suffix: 特徵名稱後綴（如 "60m", "15m"）

        Returns:
            Dict: 提取的特徵字典
        """
        # 計算窗口開始時間
        window_start = timestamp - pd.Timedelta(minutes=window_size-1)

        # 從 DataFrame 中切片出指定窗口的數據
        mask = (df['timestamp'] >= window_start) & (df['timestamp'] <= timestamp)
        window_data = df[mask]

        features = {}

        if len(window_data) == 0:
            # 如果窗口內沒有數據，返回空值
            power_types = ['wattage110v', 'wattage220v', 'wattageTotal']
            stats = ['mean', 'std', 'max', 'min']
            for power_type in power_types:
                for stat in stats:
                    features[f"{power_type}_{stat}_{suffix}"] = np.nan
            return features

        # 對每種功率類型計算統計特徵
        power_types = ['wattage110v', 'wattage220v', 'wattageTotal']

        for power_type in power_types:
            if power_type in window_data.columns:
                values = window_data[power_type].dropna()
                if len(values) > 0:
                    features[f"{power_type}_mean_{suffix}"] = values.mean()
                    features[f"{power_type}_std_{suffix}"] = values.std()
                    features[f"{power_type}_max_{suffix}"] = values.max()
                    features[f"{power_type}_min_{suffix}"] = values.min()
                    features[f"{power_type}_range_{suffix}"] = values.max() - values.min()
                    features[f"{power_type}_var_{suffix}"] = values.var()
                else:
                    features[f"{power_type}_mean_{suffix}"] = np.nan
                    features[f"{power_type}_std_{suffix}"] = np.nan
                    features[f"{power_type}_max_{suffix}"] = np.nan
                    features[f"{power_type}_min_{suffix}"] = np.nan
                    features[f"{power_type}_range_{suffix}"] = np.nan
                    features[f"{power_type}_var_{suffix}"] = np.nan

        return features

    def _extract_time_features(self, timestamp: pd.Timestamp) -> Dict[str, float]:
        """
        提取時間相關特徵

        Args:
            timestamp: 時間戳

        Returns:
            Dict: 時間特徵字典
        """
        return {
            'hour_of_day': timestamp.hour,
            'day_of_week': timestamp.dayofweek,
            'is_weekend': 1.0 if timestamp.dayofweek >= 5 else 0.0,
            'is_business_hours': 1.0 if 8 <= timestamp.hour <= 18 else 0.0,
        }

    def generate_multiscale_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        生成多尺度特徵 (Multi-scale Feature Engineering)

        對每個時間點，同時提取長期（60分鐘）和短期（15分鐘）窗口的特徵

        Args:
            df: 轉換後的基礎數據

        Returns:
            pd.DataFrame: 包含多尺度特徵的樣本數據
        """
        logger.info("開始多尺度特徵工程...")

        # 獲取配置參數
        long_window = self.config["long_window_size"]   # 60分鐘
        short_window = self.config["short_window_size"]  # 15分鐘
        step_size = self.config["feature_step_size"]     # 1分鐘

        logger.info(f"長期窗口: {long_window}分鐘, 短期窗口: {short_window}分鐘, 步長: {step_size}分鐘")

        # 確保數據按時間排序
        df_sorted = df.sort_values('timestamp').reset_index(drop=True)

        # 計算可以生成特徵的最小開始位置（需要足夠的歷史數據）
        min_start_idx = long_window - 1  # 長期窗口需要的最小歷史數據

        if len(df_sorted) <= min_start_idx:
            logger.warning(f"數據量不足以生成多尺度特徵，需要至少 {min_start_idx + 1} 筆數據，實際只有 {len(df_sorted)} 筆")
            return pd.DataFrame()

        # 存儲所有樣本的列表
        samples = []

        # 從能夠生成完整長期窗口特徵的位置開始滑動
        for i in range(min_start_idx, len(df_sorted), step_size):
            current_timestamp = df_sorted.iloc[i]['timestamp']

            # 提取當前時間點的基礎資訊
            current_row = df_sorted.iloc[i]

            sample = {
                'timestamp': current_timestamp,
                'room': current_row['room'],
                'rawWattageL1': current_row['rawWattageL1'],
                'rawWattageL2': current_row['rawWattageL2'],
                'wattage110v_current': current_row['wattage110v'],
                'wattage220v_current': current_row['wattage220v'],
                'wattageTotal_current': current_row['wattageTotal'],
                'isPositiveLabel': current_row.get('isPositiveLabel', False),
                'sourceAnomalyEventId': current_row.get('sourceAnomalyEventId', None),
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

        # 轉換為 DataFrame
        result_df = pd.DataFrame(samples)

        logger.info(f"成功生成 {len(result_df)} 個多尺度特徵樣本")
        logger.info(f"特徵總數: {len(result_df.columns)} 個")

        # 顯示特徵分類統計
        long_features_count = len([col for col in result_df.columns if '60m' in col])
        short_features_count = len([col for col in result_df.columns if '15m' in col])
        time_features_count = len([col for col in result_df.columns if col in ['hour_of_day', 'day_of_week', 'is_weekend', 'is_business_hours']])

        logger.info(f"  長期特徵 (60分鐘): {long_features_count} 個")
        logger.info(f"  短期特徵 (15分鐘): {short_features_count} 個")
        logger.info(f"  時間特徵: {time_features_count} 個")
        logger.info(f"  其他基礎特徵: {len(result_df.columns) - long_features_count - short_features_count - time_features_count} 個")

        return result_df

    def _diagnose_timestamp_alignment(
        self,
        df_l1: pd.DataFrame,
        df_l2: pd.DataFrame,
        df_merged: pd.DataFrame
    ) -> Dict[str, any]:
        """
        診斷時間戳對齊的效果，提供詳細的統計資訊

        Args:
            df_l1: L1 原始數據
            df_l2: L2 原始數據
            df_merged: 合併後數據

        Returns:
            Dict: 診斷統計資訊
        """
        diagnostics = {}

        # 計算時間範圍
        l1_time_range = df_l1.index.max() - df_l1.index.min()
        l2_time_range = df_l2.index.max() - df_l2.index.min()
        merged_time_range = df_merged.index.max() - df_merged.index.min()

        # 計算時間戳分佈
        l1_timestamps = df_l1.index.to_series()
        l2_timestamps = df_l2.index.to_series()

        # 計算秒級時間戳的分佈（檢查漂移）
        l1_seconds = l1_timestamps.dt.second.value_counts().sort_index()
        l2_seconds = l2_timestamps.dt.second.value_counts().sort_index()

        diagnostics.update({
            'l1_record_count': len(df_l1),
            'l2_record_count': len(df_l2),
            'merged_record_count': len(df_merged),
            'l1_time_range_hours': l1_time_range.total_seconds() / 3600,
            'l2_time_range_hours': l2_time_range.total_seconds() / 3600,
            'merged_time_range_hours': merged_time_range.total_seconds() / 3600,
            'l1_seconds_distribution': l1_seconds.to_dict(),
            'l2_seconds_distribution': l2_seconds.to_dict(),
            'alignment_efficiency': len(df_merged) / max(len(df_l1), len(df_l2))
        })

        # 記錄診斷資訊到日誌
        logger.info("=== 時間戳對齊診斷 ===")
        logger.info(f"L1 記錄數: {diagnostics['l1_record_count']}, 時間跨度: {diagnostics['l1_time_range_hours']:.2f} 小時")
        logger.info(f"L2 記錄數: {diagnostics['l2_record_count']}, 時間跨度: {diagnostics['l2_time_range_hours']:.2f} 小時")
        logger.info(f"合併後記錄數: {diagnostics['merged_record_count']}, 對齊效率: {diagnostics['alignment_efficiency']:.1%}")

        return diagnostics

    async def enrich_ground_truth(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        步驟三：豐富真實標籤 (Ground Truth Enrichment)

        將數據與已標註的異常事件進行關聯

        Args:
            df: 轉換後的數據

        Returns:
            pd.DataFrame: 豐富標籤後的數據
        """
        logger.info("開始豐富真實標籤...")

        # 查詢所有已標註為 POSITIVE 的異常事件
        query_positive_events = """
        SELECT id, "eventTimestamp", "meterId"
        FROM anomaly_event
        WHERE status = 'CONFIRMED_POSITIVE'
        """

        positive_events = await self.conn.fetch(query_positive_events)

        # 如果沒有異常事件，初始化標籤欄位並返回
        if not positive_events:
            df['isPositiveLabel'] = False
            df['sourceAnomalyEventId'] = None
            logger.info("沒有找到已標註的異常事件")
            return df

        # 轉換為 DataFrame 並處理時間格式
        events_df = pd.DataFrame(positive_events, columns=['id', 'eventTimestamp', 'meterId'])
        events_df['eventTimestamp'] = pd.to_datetime(events_df['eventTimestamp'])

        # 確保兩個 DataFrame 都按時間排序
        df = df.sort_values('timestamp').reset_index(drop=True)
        events_df = events_df.sort_values('eventTimestamp').reset_index(drop=True)

        tolerance_minutes = self.config["anomaly_time_tolerance_minutes"]
        logger.info(f"使用異常事件時間關聯容差: ±{tolerance_minutes} 分鐘")

        # 使用 merge_asof 進行高效範圍查找
        merged_df = pd.merge_asof(
            left=df,
            right=events_df,
            left_on='timestamp',
            right_on='eventTimestamp',
            direction='nearest',  # 找到最近的事件
            tolerance=pd.Timedelta(minutes=tolerance_minutes)
        )

        # 根據合併結果設置標籤
        df['isPositiveLabel'] = ~merged_df['id'].isnull()
        df['sourceAnomalyEventId'] = merged_df['id']

        positive_count = df['isPositiveLabel'].sum()
        logger.info(f"高效標記了 {positive_count} 筆正樣本數據")

        return df

    async def load_data(
        self,
        df: pd.DataFrame,
        room_info: RoomInfo,
        start_date: datetime,
        end_date: datetime
    ) -> str:
        """
        步驟四：載入數據 (Load)

        將處理好的數據載入到分析數據庫表中，使用交易安全和高效批次操作

        Args:
            df: 最終處理完成的數據
            room_info: 房間資訊
            start_date: 數據起始日期
            end_date: 數據結束日期

        Returns:
            str: 創建的數據集 ID
        """
        logger.info("開始載入數據到數據庫...")

        positive_count = df['isPositiveLabel'].sum()
        total_count = len(df)
        dataset_name = f"{room_info.building}-{room_info.floor}-{room_info.room}-Golden-Week-{start_date.strftime('%Y-%m')}"

        # 使用數據庫交易確保數據一致性
        async with self.conn.transaction():
            # 4.1 創建 AnalysisDataset 紀錄
            insert_dataset_query = """
            INSERT INTO analysis_datasets (
                name, building, floor, room, start_date, end_date,
                occupant_type, meter_id_l1, meter_id_l2,
                total_records, positive_labels
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING id
            """

            dataset_id = await self.conn.fetchval(
                insert_dataset_query,
                dataset_name, room_info.building, room_info.floor, room_info.room,
                start_date, end_date, room_info.occupant_type.value,
                room_info.meter_id_l1, room_info.meter_id_l2,
                total_count, int(positive_count)
            )

            logger.info(f"創建數據集: {dataset_name} (ID: {dataset_id})")

            # 4.2 使用高效批次複製插入數據記錄
            await self.copy_analysis_data_to_table(df, dataset_id)

        logger.info(f"成功載入 {total_count} 筆分析數據")
        logger.info(f"其中包含 {positive_count} 筆正樣本標籤")

        return dataset_id

    async def copy_analysis_data_to_table(self, df: pd.DataFrame, dataset_id: str):
        """
        使用高效批次插入分析數據

        Args:
            df: 要插入的數據 DataFrame
            dataset_id: 數據集 ID
        """
        if df.empty:
            logger.warning("沒有數據需要插入")
            return

        # 準備批次插入查詢
        insert_query = """
        INSERT INTO analysis_ready_data (
            dataset_id, timestamp, room, raw_wattage_l1, raw_wattage_l2,
            wattage_110v, wattage_220v, wattage_total,
            is_positive_label, source_anomaly_event_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        """

        # 處理 NaN 值和數據清理
        df_clean = df.copy()

        # 對於有重複 source_anomaly_event_id 的行，除了第一個以外都設為 None
        # 這樣可以避免唯一性約束衝突
        df_clean['sourceAnomalyEventId'] = df_clean['sourceAnomalyEventId'].where(
            df_clean['sourceAnomalyEventId'].notna(), None
        )

        # 處理重複的 sourceAnomalyEventId - 只保留第一個
        if 'sourceAnomalyEventId' in df_clean.columns:
            # 標記重複項（除了第一個）
            duplicated_mask = df_clean.duplicated(subset=['sourceAnomalyEventId'], keep='first')
            # 將重複的設為 None
            df_clean.loc[duplicated_mask & df_clean['sourceAnomalyEventId'].notna(), 'sourceAnomalyEventId'] = None

        df_clean['isPositiveLabel'] = df_clean['isPositiveLabel'].fillna(False)

        # 準備批次數據 - 使用列表推導式提高效率
        batch_data = []
        for _, row in df_clean.iterrows():
            batch_data.append((
                dataset_id,
                row['timestamp'],
                row['room'],
                row['rawWattageL1'],
                row['rawWattageL2'],
                row['wattage110v_current'],  # 使用當前時間點的功率值
                row['wattage220v_current'],
                row['wattageTotal_current'],
                bool(row['isPositiveLabel']),  # 確保是布林值
                row['sourceAnomalyEventId']    # 可能是 None
            ))

        # 計算正樣本數量
        positive_count = sum(1 for item in batch_data if item[8])

        # 執行批次插入
        await self.conn.executemany(insert_query, batch_data)

        logger.info(f"成功批次插入 {len(batch_data)} 筆分析數據")
        logger.info(f"其中包含 {positive_count} 筆正樣本標籤")

        return dataset_id

    async def process_room_data(
        self,
        room_info: RoomInfo,
        search_start: datetime,
        search_end: datetime,
        window_days: int = 7,
        enable_multiscale_features: bool = True
    ) -> str:
        """
        執行完整的 ETL 流程處理單個房間的數據

        Args:
            room_info: 房間資訊
            search_start: 搜索開始日期
            search_end: 搜索結束日期
            window_days: 數據窗口天數
            enable_multiscale_features: 是否啟用多尺度特徵工程

        Returns:
            str: 創建的數據集 ID
        """
        logger.info(f"開始處理房間 {room_info.room} 的數據")
        logger.info(f"多尺度特徵工程: {'啟用' if enable_multiscale_features else '停用'}")

        try:
            # 步驟一：尋找最佳數據窗口
            start_date, end_date = await self.find_golden_window(
                room_info, search_start, search_end, window_days
            )

            # 步驟二：抽取原始數據
            df_l1, df_l2 = await self.extract_raw_data(room_info, start_date, end_date)

            # 步驟三：轉換數據
            df_transformed = self.transform_data(df_l1, df_l2, room_info)

            # 步驟三：豐富真實標籤
            df_enriched = await self.enrich_ground_truth(df_transformed)

            # 新步驟：多尺度特徵工程
            if enable_multiscale_features:
                df_final = self.generate_multiscale_features(df_enriched)
                if len(df_final) == 0:
                    logger.warning("多尺度特徵生成失敗，回退到基礎數據")
                    df_final = df_enriched
            else:
                df_final = df_enriched

            # 步驟四：載入數據
            dataset_id = await self.load_data(df_final, room_info, start_date, end_date)

            logger.info(f"房間 {room_info.room} 數據處理完成，數據集 ID: {dataset_id}")
            return dataset_id

        except Exception as e:
            logger.error(f"處理房間 {room_info.room} 時發生錯誤: {e}")
            raise

    async def process_multiple_rooms_from_csv(
        self,
        csv_path: str = "meter.csv",
        search_start: datetime = None,
        search_end: datetime = None,
        window_days: int = 7,
        enable_multiscale_features: bool = True,
        max_concurrent: int = 3
    ) -> List[str]:
        """
        從 CSV 文件批量處理多個房間的數據

        Args:
            csv_path: 電表映射 CSV 文件路徑
            search_start: 搜索開始日期（默認為當月第一天）
            search_end: 搜索結束日期（默認為當月最後一天）
            window_days: 數據窗口天數
            enable_multiscale_features: 是否啟用多尺度特徵工程
            max_concurrent: 最大並發處理數量

        Returns:
            List[str]: 成功創建的數據集 ID 列表
        """
        logger.info("開始批量處理多個房間...")

        # 設置默認時間範圍（使用配置文件中的設定）
        if search_start is None:
            try:
                current_month = get_time_range("2025_08")
                search_start = current_month["start"]
            except:
                search_start = datetime(2025, 8, 1)

        if search_end is None:
            try:
                current_month = get_time_range("2025_08")
                search_end = current_month["end"]
            except:
                search_end = datetime(2025, 8, 31)

        logger.info(f"處理時間範圍: {search_start} 到 {search_end}")

        # 載入電表映射
        meter_mapping = self.load_meter_mapping(csv_path)

        # 創建房間資訊列表
        room_infos = self.create_room_info_from_mapping(meter_mapping)

        if not room_infos:
            logger.warning("沒有找到任何房間資訊")
            return []

        logger.info(f"準備處理 {len(room_infos)} 個房間")

        # 批量處理結果
        successful_datasets = []
        failed_rooms = []

        # 分批處理以避免過載
        for i in range(0, len(room_infos), max_concurrent):
            batch = room_infos[i:i + max_concurrent]
            batch_size = len(batch)

            logger.info(f"處理第 {i//max_concurrent + 1} 批次 ({batch_size} 個房間)...")

            # 併發處理當前批次
            tasks = []
            for room_info in batch:
                task = self.process_room_data(
                    room_info=room_info,
                    search_start=search_start,
                    search_end=search_end,
                    window_days=window_days,
                    enable_multiscale_features=enable_multiscale_features
                )
                tasks.append((room_info, task))

            # 等待當前批次完成
            for room_info, task in tasks:
                try:
                    dataset_id = await task
                    successful_datasets.append(dataset_id)
                    logger.info(f"✅ 房間 {room_info.building}-{room_info.floor}-{room_info.room} 處理成功: {dataset_id}")

                except Exception as e:
                    failed_rooms.append(f"{room_info.building}-{room_info.floor}-{room_info.room}")
                    logger.error(f"❌ 房間 {room_info.building}-{room_info.floor}-{room_info.room} 處理失敗: {e}")

        # 處理結果摘要
        total_rooms = len(room_infos)
        successful_count = len(successful_datasets)
        failed_count = len(failed_rooms)

        logger.info("=" * 50)
        logger.info("批量處理完成摘要:")
        logger.info(f"總房間數: {total_rooms}")
        logger.info(f"成功處理: {successful_count}")
        logger.info(f"處理失敗: {failed_count}")
        logger.info(f"成功率: {successful_count/total_rooms:.1%}")

        if failed_rooms:
            logger.warning("處理失敗的房間:")
            for room in failed_rooms:
                logger.warning(f"  - {room}")

        logger.info("成功創建的數據集:")
        for i, dataset_id in enumerate(successful_datasets, 1):
            logger.info(f"  {i}. {dataset_id}")

        return successful_datasets

# 使用範例和工具函數
async def main():
    """
    主函數 - 處理高品質週期數據（基於數據品質分析結果）
    專門處理表現最佳的週期：2025-07-21, 2025-08-04, 2025-08-11, 2025-08-18
    使用 asyncio 併發處理提升性能
    """
    # 從配置文件讀取資料庫連接字串
    database_url = get_database_url()

    # 使用高品質房間配置
    from etl_config import get_etl_config, get_high_quality_rooms
    config = get_etl_config()

    # 初始化 ETL 處理器
    etl = DataPreprocessingETL(database_url, config)

    try:
        await etl.connect_database()
        logger.info("🔗 資料庫連接成功")

        # 獲取高品質房間列表（A2、A3、A5樓層）
        high_quality_rooms = get_high_quality_rooms()
        logger.info(f"🏠 載入高品質房間數量: {len(high_quality_rooms)}")

        # 處理高品質週期時間範圍（整體處理）
        time_range = get_time_range("high_quality_weeks")
        start_time = time_range["start"]
        end_time = time_range["end"]

        logger.info(f"\n📅 開始處理週期: {time_range['name']}")
        logger.info(f"   時間範圍: {start_time} 至 {end_time}")

        # 使用 asyncio.gather 併發處理多個房間
        max_concurrent = min(3, len(high_quality_rooms))  # 限制併發數避免資料庫壓力
        logger.info(f"🚀 使用併發處理，最大併發數: {max_concurrent}")

        async def process_single_room(room: RoomInfo) -> tuple[RoomInfo, str | None]:
            """處理單個房間的包裝函數"""
            try:
                logger.info(f"\n🏢 開始處理房間: {room.building}-{room.floor}-{room.room}")

                # 處理單個房間的數據
                result = await etl.process_room_data(
                    room_info=room,
                    search_start=start_time,
                    search_end=end_time,
                    window_days=7,
                    enable_multiscale_features=True  # 啟用多尺度特徵
                )

                if result:
                    logger.info(f"✅ 房間 {room.building}-{room.floor}-{room.room} 處理成功")
                    logger.info(f"   數據集ID: {result}")
                    return room, result
                else:
                    logger.warning(f"⚠️  房間 {room.building}-{room.floor}-{room.room} 處理失敗或無符合條件的數據")
                    return room, None

            except Exception as e:
                logger.error(f"❌ 房間 {room.building}-{room.floor}-{room.room} 處理失敗: {e}")
                return room, None

        # 將房間分批併發處理
        success_count = 0
        total_count = len(high_quality_rooms)
        results = []

        # 分批處理房間以控制併發數
        for i in range(0, len(high_quality_rooms), max_concurrent):
            batch_rooms = high_quality_rooms[i:i + max_concurrent]
            batch_number = i // max_concurrent + 1
            total_batches = (len(high_quality_rooms) + max_concurrent - 1) // max_concurrent

            logger.info(f"\n📦 處理批次 {batch_number}/{total_batches} ({len(batch_rooms)} 個房間)")

            # 併發處理當前批次的房間
            batch_tasks = [process_single_room(room) for room in batch_rooms]
            batch_results = await asyncio.gather(*batch_tasks, return_exceptions=True)

            # 統計批次結果
            for result in batch_results:
                if isinstance(result, Exception):
                    logger.error(f"批次處理中發生異常: {result}")
                    continue

                room, dataset_id = result
                results.append((room, dataset_id))
                if dataset_id:
                    success_count += 1

        logger.info(f"\n📊 高品質週期處理完成:")
        logger.info(f"   成功: {success_count}/{total_count} 個房間")
        logger.info(f"   成功率: {(success_count/total_count)*100:.1f}%")

        # 顯示處理結果摘要
        successful_rooms = [room for room, dataset_id in results if dataset_id]
        failed_rooms = [room for room, dataset_id in results if not dataset_id]

        if successful_rooms:
            logger.info(f"\n✅ 成功處理的房間:")
            for room in successful_rooms:
                logger.info(f"   - {room.building}-{room.floor}-{room.room}")

        if failed_rooms:
            logger.info(f"\n❌ 處理失敗的房間:")
            for room in failed_rooms:
                logger.info(f"   - {room.building}-{room.floor}-{room.room}")

        logger.info(f"\n🎉 所有高品質房間處理完成！")

    except Exception as e:
        logger.error(f"❌ 處理過程中發生錯誤: {e}")
        raise
    finally:
        await etl.close_database()
        logger.info("🔌 資料庫連接已關閉")

if __name__ == "__main__":
    # 運行預訓練數據處理
    asyncio.run(main())

