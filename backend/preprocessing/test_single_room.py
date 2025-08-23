#!/usr/bin/env python3
"""
測試單個房間的 ETL 處理
"""

import asyncio
import logging
from data_preprocessing_etl_multiscale import DataPreprocessingETL, get_database_url

# 設置日誌
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

async def test_single_room():
    """測試單個房間的處理"""
    # 從配置文件讀取資料庫連接字串
    database_url = get_database_url()

    # 使用預設配置
    config = {
        "quality_thresholds": {
            "min_completeness_ratio": 0.1,
            "max_missing_periods": 15000
        },
        "anomaly_time_tolerance_minutes": 30,
        "long_term_window_minutes": 60,
        "short_term_window_minutes": 15
    }

    # 初始化 ETL 處理器
    etl = DataPreprocessingETL(database_url, config)

    try:
        await etl.connect_database()
        logger.info("🔗 資料庫連接成功")

        # 從 etl_config 獲取單個高品質房間進行測試
        from etl_config import get_high_quality_rooms
        high_quality_rooms = get_high_quality_rooms()

        if not high_quality_rooms:
            logger.error("沒有找到高品質房間配置")
            return

        # 使用第一個房間進行測試
        test_room = high_quality_rooms[0]
        logger.info(f"🏠 測試房間: {test_room.building}-{test_room.floor}-{test_room.room}")

        # 使用固定的測試時間範圍（已驗證的高品質週期）
        from datetime import datetime
        start_time = datetime(2025, 8, 7)  # 根據分析結果的高品質週期
        end_time = datetime(2025, 8, 14)

        logger.info(f"📅 處理週期: 測試週")
        logger.info(f"   時間範圍: {start_time} 至 {end_time}")

        # 處理單個房間的數據
        result = await etl.process_room_data(
            room_info=test_room,
            search_start=start_time,
            search_end=end_time,
            window_days=7,
            enable_multiscale_features=True  # 啟用多尺度特徵
        )

        if result:
            logger.info(f"✅ 房間 {test_room.building}-{test_room.floor}-{test_room.room} 處理成功")
            logger.info(f"   數據集ID: {result}")
        else:
            logger.warning(f"⚠️  房間 {test_room.building}-{test_room.floor}-{test_room.room} 處理失敗或無符合條件的數據")

        logger.info(f"\n🎉 測試完成！")

    except Exception as e:
        logger.error(f"❌ 處理過程中發生錯誤: {e}")
        raise
    finally:
        await etl.close_database()
        logger.info("🔌 資料庫連接已關閉")

if __name__ == "__main__":
    # 運行測試
    asyncio.run(test_single_room())
