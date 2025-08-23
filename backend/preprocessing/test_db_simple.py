#!/usr/bin/env python3
"""
簡化的 ETL 測試腳本 - 用於診斷問題
"""

import asyncio
import logging
import asyncpg
from datetime import datetime
from data_preprocessing_etl_multiscale import get_database_url
from etl_config import get_high_quality_rooms

# 設置日誌
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

async def test_database_connection():
    """測試資料庫連接和基本查詢"""

    database_url = get_database_url()
    logger.info(f"🔗 嘗試連接資料庫...")

    try:
        # 建立連接
        conn = await asyncpg.connect(database_url)
        logger.info("✅ 資料庫連接成功")

        # 測試基本查詢 - 使用更快的查詢
        result = await conn.fetchval("SELECT 1")  # 簡單的存活測試
        logger.info(f"✅ 資料庫查詢測試成功")

        # 獲取 ammeter_log 表的基本信息（不使用 COUNT 以避免全表掃描）
        table_info = await conn.fetchrow("""
            SELECT schemaname, tablename
            FROM pg_tables
            WHERE tablename = 'ammeter_log'
        """)

        if table_info:
            logger.info(f"📊 ammeter_log 表存在: {table_info['schemaname']}.{table_info['tablename']}")
        else:
            logger.warning("⚠️  ammeter_log 表不存在")

        # 測試房間配置
        rooms = get_high_quality_rooms()
        if rooms:
            test_room = rooms[0]
            logger.info(f"🏠 測試房間: {test_room.building}-{test_room.floor}-{test_room.room}")
            logger.info(f"   電表 L1: {test_room.meter_id_l1}")
            logger.info(f"   電表 L2: {test_room.meter_id_l2}")

            # 檢查該房間的數據範圍
            date_query = """
            SELECT
                MIN("lastUpdated") as min_date,
                MAX("lastUpdated") as max_date,
                COUNT(*) as total_records
            FROM ammeter_log
            WHERE "deviceNumber" IN ($1, $2)
            """

            date_info = await conn.fetchrow(
                date_query,
                test_room.meter_id_l1,
                test_room.meter_id_l2
            )

            if date_info and date_info['total_records'] > 0:
                logger.info(f"📅 該房間數據範圍:")
                logger.info(f"   最早: {date_info['min_date']}")
                logger.info(f"   最晚: {date_info['max_date']}")
                logger.info(f"   總數: {date_info['total_records']}")

                # 檢查特定時間窗口的數據
                window_query = """
                SELECT
                    COUNT(*) as window_records,
                    MIN("lastUpdated") as window_min,
                    MAX("lastUpdated") as window_max
                FROM ammeter_log
                WHERE "deviceNumber" IN ($1, $2)
                AND "lastUpdated" >= $3
                AND "lastUpdated" < $4
                """

                start_time = datetime(2025, 8, 7)
                end_time = datetime(2025, 8, 14)

                window_info = await conn.fetchrow(
                    window_query,
                    test_room.meter_id_l1,
                    test_room.meter_id_l2,
                    start_time,
                    end_time
                )

                logger.info(f"🕐 測試窗口 (2025-08-07 至 2025-08-14) 數據:")
                logger.info(f"   記錄數: {window_info['window_records']}")
                if window_info['window_records'] > 0:
                    logger.info(f"   範圍: {window_info['window_min']} 至 {window_info['window_max']}")
                else:
                    logger.warning("   ⚠️  該時間窗口沒有數據")

                    # 試試另一個時間窗口
                    recent_start = datetime(2025, 8, 1)
                    recent_end = datetime(2025, 8, 23)

                    recent_info = await conn.fetchrow(
                        window_query,
                        test_room.meter_id_l1,
                        test_room.meter_id_l2,
                        recent_start,
                        recent_end
                    )

                    logger.info(f"🔍 最近時間窗口 (2025-08-01 至 2025-08-23) 數據:")
                    logger.info(f"   記錄數: {recent_info['window_records']}")
                    if recent_info['window_records'] > 0:
                        logger.info(f"   範圍: {recent_info['window_min']} 至 {recent_info['window_max']}")
            else:
                logger.warning("⚠️  找不到該房間的數據")
        else:
            logger.error("❌ 沒有高品質房間配置")

        await conn.close()
        logger.info("🔌 資料庫連接已關閉")

    except Exception as e:
        logger.error(f"❌ 資料庫操作失敗: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_database_connection())
