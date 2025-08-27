#!/usr/bin/env python3
"""
檢查數據庫中的具體數據
"""

import asyncio
import asyncpg
import os

async def check_data():
    """檢查數據庫中的實際數據"""

    db_url = os.getenv("DATABASE_URL", "postgresql://postgres:Info4467@supa.clkvfvz5fxb3.ap-northeast-3.rds.amazonaws.com:5432/supa")
    if db_url.startswith("postgresql+asyncpg://"):
        db_url = db_url.replace("postgresql+asyncpg://", "postgresql://")

    try:
        conn = await asyncpg.connect(db_url)
        print("✅ 成功連接數據庫")

        # 檢查 analysis_datasets 表中的數據
        print("\n📊 analysis_datasets 表數據:")
        count_query = "SELECT COUNT(*) FROM analysis_datasets"
        count = await conn.fetchval(count_query)
        print(f"總記錄數: {count}")

        if count > 0:
            sample_query = "SELECT id, name, positive_labels FROM analysis_datasets LIMIT 5"
            samples = await conn.fetch(sample_query)
            print("前 5 條記錄:")
            for sample in samples:
                print(f"  • {sample['name']}: {sample['positive_labels']} positive labels")

        # 檢查 analysis_ready_data 表
        print("\n📊 analysis_ready_data 表數據:")
        count_query2 = "SELECT COUNT(*) FROM analysis_ready_data"
        count2 = await conn.fetchval(count_query2)
        print(f"總記錄數: {count2}")

        if count2 > 0:
            positive_query = "SELECT COUNT(*) FROM analysis_ready_data WHERE is_positive_label = true"
            positive_count = await conn.fetchval(positive_query)
            print(f"正標籤記錄數: {positive_count}")

        # 檢查 anomaly_event 表
        print("\n📊 anomaly_event 表數據:")
        count_query3 = "SELECT COUNT(*) FROM anomaly_event"
        count3 = await conn.fetchval(count_query3)
        print(f"總記錄數: {count3}")

        if count3 > 0:
            status_query = """
            SELECT status, COUNT(*) as count
            FROM anomaly_event
            GROUP BY status
            """
            status_counts = await conn.fetch(status_query)
            print("狀態分布:")
            for status in status_counts:
                print(f"  • {status['status']}: {status['count']}")

        await conn.close()

    except Exception as e:
        print(f"❌ 檢查失敗: {e}")

if __name__ == "__main__":
    asyncio.run(check_data())
