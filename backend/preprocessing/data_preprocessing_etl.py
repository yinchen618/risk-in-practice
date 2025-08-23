"""
PU Learning 數據預處理 ETL 腳本

這個腳本執行完整的 Extract, Transform, Load (ETL) 流程，
從原始電錶數據中生成可直接用於模型訓練的乾淨數據集。

主要功能：
1. 尋找最佳的連續 7 天數據窗口 (Golden Window)
2. 抽取原始數據並進行時間戳對齊
3. 轉換數據格式並計算功率特徵
4. 載入到分析數據庫表中

作者: Auto-Generated
日期: 2025-08-23
"""

import pandas as pd        return df_transformed

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

        # 檢查時間戳漂移模式
        if len(l1_seconds) > 1 or len(l2_seconds) > 1:
            logger.info(f"L1 秒級分佈: {dict(list(l1_seconds.items())[:5])}..." if len(l1_seconds) > 5 else f"L1 秒級分佈: {l1_seconds.to_dict()}")
            logger.info(f"L2 秒級分佈: {dict(list(l2_seconds.items())[:5])}..." if len(l2_seconds) > 5 else f"L2 秒級分佈: {l2_seconds.to_dict()}")

        return diagnostics

    def transform_data(
        self,
        df_l1: pd.DataFrame,
        df_l2: pd.DataFrame,
        room_info: RoomInfo
    ) -> pd.DataFrame:numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
import logging
from dataclasses import dataclass
import asyncio
import asyncpg
import os
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

    def __init__(self, database_url: str, config: Dict = None):
        """
        初始化 ETL 處理器

        Args:
            database_url: PostgreSQL 連接字串
            config: ETL 配置參數字典 (可選)
        """
        self.database_url = database_url
        self.conn = None

        # 默認配置
        self.config = {
            "resample_frequency": "1T",
            "ffill_limit": 3,
            "anomaly_time_tolerance_minutes": 5,
            "min_completeness_ratio": 0.8,
        }

        # 如果提供了自定義配置，則更新默認配置
        if config:
            self.config.update(config)

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
        logger.info(f"開始為房間 {room_info.room} 尋找最佳 {window_days} 天數據窗口")

        best_window = None
        best_quality_score = 0.0

        # 以天為單位滑動窗口
        current_date = search_start
        while current_date + timedelta(days=window_days) <= search_end:
            window_start = current_date
            window_end = current_date + timedelta(days=window_days)

            # 評估此窗口的數據品質
            quality_metrics = await self._evaluate_data_quality(
                room_info, window_start, window_end
            )

            # 計算品質分數 (可根據需求調整權重)
            quality_score = (
                quality_metrics.completeness_ratio * 0.7 +  # 完整性權重 70%
                (1.0 - quality_metrics.missing_periods / 100.0) * 0.3  # 缺失時段權重 30%
            )

            if quality_score > best_quality_score:
                best_quality_score = quality_score
                best_window = (window_start, window_end)

            current_date += timedelta(days=1)

        if best_window is None:
            raise ValueError(f"在指定範圍內找不到符合條件的 {window_days} 天窗口")

        logger.info(f"找到最佳窗口: {best_window[0]} 到 {best_window[1]}, 品質分數: {best_quality_score:.3f}")
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
        query_l1 = """
        SELECT COUNT(*) as count,
               MIN(last_updated) as min_time,
               MAX(last_updated) as max_time
        FROM ammeter
        WHERE device_number = $1
        AND last_updated BETWEEN $2 AND $3
        """

        query_l2 = """
        SELECT COUNT(*) as count,
               MIN(last_updated) as min_time,
               MAX(last_updated) as max_time
        FROM ammeter
        WHERE device_number = $1
        AND last_updated BETWEEN $2 AND $3
        """

        result_l1 = await self.conn.fetchrow(query_l1, room_info.meter_id_l1, start_date, end_date)
        result_l2 = await self.conn.fetchrow(query_l2, room_info.meter_id_l2, start_date, end_date)

        # 計算期望的數據筆數 (假設每分鐘一筆)
        expected_records = int((end_date - start_date).total_seconds() / 60)

        # 計算完整性比例
        actual_records = min(result_l1['count'], result_l2['count'])
        completeness_ratio = actual_records / expected_records if expected_records > 0 else 0.0

        # 簡化的缺失時段計算 (實際可以更精細)
        missing_periods = max(0, expected_records - actual_records)

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
        SELECT last_updated as timestamp, power as wattage
        FROM ammeter
        WHERE device_number = $1
        AND last_updated BETWEEN $2 AND $3
        ORDER BY last_updated
        """

        # 查詢 L2 電錶數據
        query_l2 = """
        SELECT last_updated as timestamp, power as wattage
        FROM ammeter
        WHERE device_number = $1
        AND last_updated BETWEEN $2 AND $3
        ORDER BY last_updated
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
        logger.info(f"合併前 L1 缺失值: {df_l1_resampled.isna().sum()}")
        logger.info(f"合併前 L2 缺失值: {df_l2_resampled.isna().sum()}")
        logger.info(f"合併後 L1 缺失值: {df_merged['wattage_l1'].isna().sum()}")
        logger.info(f"合併後 L2 缺失值: {df_merged['wattage_l2'].isna().sum()}")

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

        # 執行對齊效果診斷
        self._diagnose_timestamp_alignment(df_l1, df_l2, df_merged)

        logger.info(f"對齊後數據筆數: {final_count}")

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
        SELECT id, event_timestamp, meter_id
        FROM anomaly_event
        WHERE status = 'CONFIRMED_POSITIVE'
        """

        positive_events = await self.conn.fetch(query_positive_events)

        # 初始化標籤欄位
        df['isPositiveLabel'] = False
        df['sourceAnomalyEventId'] = None

        # 對每個異常事件進行時間關聯
        tolerance_minutes = self.config["anomaly_time_tolerance_minutes"]
        logger.info(f"使用異常事件時間關聯容差: ±{tolerance_minutes} 分鐘")

        for event in positive_events:
            event_time = pd.to_datetime(event['event_timestamp'])
            event_id = event['id']

            # 找出在此事件時間附近的數據點 (±N分鐘容差)
            time_mask = (
                (df['timestamp'] >= event_time - pd.Timedelta(minutes=tolerance_minutes)) &
                (df['timestamp'] <= event_time + pd.Timedelta(minutes=tolerance_minutes))
            )

            # 更新標籤
            df.loc[time_mask, 'isPositiveLabel'] = True
            df.loc[time_mask, 'sourceAnomalyEventId'] = event_id

        positive_count = df['isPositiveLabel'].sum()
        logger.info(f"標記了 {positive_count} 筆正樣本數據")

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

        將處理好的數據載入到分析數據庫表中

        Args:
            df: 最終處理完成的數據
            room_info: 房間資訊
            start_date: 數據起始日期
            end_date: 數據結束日期

        Returns:
            str: 創建的數據集 ID
        """
        logger.info("開始載入數據到數據庫...")

        # 4.1 創建 AnalysisDataset 紀錄
        dataset_name = f"{room_info.building}-{room_info.floor}-{room_info.room}-Golden-Week-{start_date.strftime('%Y-%m')}"

        insert_dataset_query = """
        INSERT INTO analysis_datasets (
            name, building, floor, room, start_date, end_date,
            occupant_type, meter_id_l1, meter_id_l2,
            total_records, positive_labels
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING id
        """

        positive_count = df['isPositiveLabel'].sum()
        total_count = len(df)

        dataset_id = await self.conn.fetchval(
            insert_dataset_query,
            dataset_name, room_info.building, room_info.floor, room_info.room,
            start_date, end_date, room_info.occupant_type.value,
            room_info.meter_id_l1, room_info.meter_id_l2,
            total_count, int(positive_count)
        )

        logger.info(f"創建數據集: {dataset_name} (ID: {dataset_id})")

        # 4.2 批量插入 AnalysisReadyData
        insert_data_query = """
        INSERT INTO analysis_ready_data (
            dataset_id, timestamp, room, raw_wattage_l1, raw_wattage_l2,
            wattage_110v, wattage_220v, wattage_total,
            is_positive_label, source_anomaly_event_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        """

        # 準備批量插入的數據
        data_rows = []
        for _, row in df.iterrows():
            data_rows.append((
                dataset_id,
                row['timestamp'],
                row['room'],
                row['rawWattageL1'],
                row['rawWattageL2'],
                row['wattage110v'],
                row['wattage220v'],
                row['wattageTotal'],
                row['isPositiveLabel'],
                row['sourceAnomalyEventId']
            ))

        # 執行批量插入
        await self.conn.executemany(insert_data_query, data_rows)

        logger.info(f"成功載入 {total_count} 筆分析數據")
        logger.info(f"其中包含 {positive_count} 筆正樣本標籤")

        return dataset_id

    async def process_room_data(
        self,
        room_info: RoomInfo,
        search_start: datetime,
        search_end: datetime,
        window_days: int = 7
    ) -> str:
        """
        執行完整的 ETL 流程處理單個房間的數據

        Args:
            room_info: 房間資訊
            search_start: 搜索開始日期
            search_end: 搜索結束日期
            window_days: 數據窗口天數

        Returns:
            str: 創建的數據集 ID
        """
        logger.info(f"開始處理房間 {room_info.room} 的數據")

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

            # 步驟四：載入數據
            dataset_id = await self.load_data(df_enriched, room_info, start_date, end_date)

            logger.info(f"房間 {room_info.room} 數據處理完成，數據集 ID: {dataset_id}")
            return dataset_id

        except Exception as e:
            logger.error(f"處理房間 {room_info.room} 時發生錯誤: {e}")
            raise

# 使用範例和工具函數
async def main():
    """
    主函數 - 使用範例，展示配置的使用方式
    """
    # 從環境變數讀取數據庫連接字串
    database_url = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/database")

    # 自定義 ETL 配置（可選）
    custom_config = {
        "resample_frequency": "1T",  # 1分鐘重採樣
        "ffill_limit": 3,           # 最多向前填充3個時間點
        "anomaly_time_tolerance_minutes": 5,  # 異常關聯容差±5分鐘
        "min_completeness_ratio": 0.8,  # 最小數據完整性80%
    }

    # 創建 ETL 處理器
    etl = DataPreprocessingETL(database_url, config=custom_config)

    try:
        # 連接數據庫
        await etl.connect_database()

        # 定義房間資訊 (範例)
        room_info = RoomInfo(
            building="Building-A",
            floor="3F",
            room="Room-301",
            meter_id_l1="METER_A_L1_001",
            meter_id_l2="METER_A_L2_001",
            occupant_type=OccupantType.OFFICE_WORKER
        )

        # 定義搜索時間範圍 (範例：2025年8月整個月)
        search_start = datetime(2025, 8, 1)
        search_end = datetime(2025, 8, 31)

        logger.info("=== ETL 配置摘要 ===")
        for key, value in etl.config.items():
            logger.info(f"{key}: {value}")

        # 執行 ETL 流程
        dataset_id = await etl.process_room_data(
            room_info=room_info,
            search_start=search_start,
            search_end=search_end,
            window_days=7
        )

        print(f"處理完成！創建的數據集 ID: {dataset_id}")

    finally:
        # 關閉數據庫連接
        await etl.close_database()

if __name__ == "__main__":
    # 運行主函數
    asyncio.run(main())
