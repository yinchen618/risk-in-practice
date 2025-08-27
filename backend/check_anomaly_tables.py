#!/usr/bin/env python3
"""
檢查異常事件表結構
"""

import asyncio
import asyncpg
import os

async def check_anomaly_tables():
    """檢查異常事件相關表的結構"""

    db_url = os.getenv("DATABASE_URL", "postgresql://postgres:Info4467@supa.clkvfvz5fxb3.ap-northeast-3.rds.amazonaws.com:5432/supa")
    if db_url.startswith("postgresql+asyncpg://"):
        db_url = db_url.replace("postgresql+asyncpg://", "postgresql://")

    try:
        conn = await asyncpg.connect(db_url)
        print("✅ 成功連接數據庫")

        # 檢查 anomaly_event 表
        print("\n📊 anomaly_event 表結構:")
        columns_query = """
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'anomaly_event' AND table_schema = 'public'
        ORDER BY ordinal_position
        """
        columns = await conn.fetch(columns_query)

        for col in columns:
            nullable = "NULL" if col['is_nullable'] == 'YES' else "NOT NULL"
            print(f"  - {col['column_name']}: {col['data_type']} {nullable}")

        # 查詢樣本數據
        print("\n📋 anomaly_event 樣本數據:")
        sample_query = "SELECT * FROM anomaly_event LIMIT 3"
        samples = await conn.fetch(sample_query)

        if samples:
            # 顯示欄位名
            if samples:
                columns = samples[0].keys()
                print("欄位:", list(columns))

            for i, row in enumerate(samples):
                print(f"第 {i+1} 行:", dict(row))

        # 檢查 analysis_ready_data 表
        print("\n📊 analysis_ready_data 表結構:")
        columns_query2 = """
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'analysis_ready_data' AND table_schema = 'public'
        ORDER BY ordinal_position
        """
        columns2 = await conn.fetch(columns_query2)

        for col in columns2:
            nullable = "NULL" if col['is_nullable'] == 'YES' else "NOT NULL"
            print(f"  - {col['column_name']}: {col['data_type']} {nullable}")

        await conn.close()

    except Exception as e:
        print(f"❌ 檢查失敗: {e}")

if __name__ == "__main__":
    asyncio.run(check_anomaly_tables())
