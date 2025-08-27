#!/usr/bin/env python3
"""
檢查 PostgreSQL 數據庫結構
"""

import asyncio
import asyncpg
import os

async def check_database_structure():
    """檢查數據庫結構"""

    # 獲取數據庫 URL
    db_url = os.getenv("DATABASE_URL", "postgresql://postgres:Info4467@supa.clkvfvz5fxb3.ap-northeast-3.rds.amazonaws.com:5432/supa")
    if db_url.startswith("postgresql+asyncpg://"):
        db_url = db_url.replace("postgresql+asyncpg://", "postgresql://")

    try:
        conn = await asyncpg.connect(db_url)
        print("✅ 成功連接數據庫")

        # 查詢所有表
        tables_query = """
        SELECT table_name, table_schema
        FROM information_schema.tables
        WHERE table_schema = 'public'
        ORDER BY table_name
        """

        tables = await conn.fetch(tables_query)
        print(f"\n📋 找到 {len(tables)} 個表:")
        print("-" * 50)

        for table in tables:
            print(f"• {table['table_name']}")

        # 尋找包含 analysis 或 dataset 的表
        analysis_tables = [t for t in tables if 'analysis' in t['table_name'].lower() or 'dataset' in t['table_name'].lower()]

        if analysis_tables:
            print(f"\n🎯 找到相關表:")
            for table in analysis_tables:
                table_name = table['table_name']
                print(f"\n📊 表: {table_name}")

                # 查詢表結構
                columns_query = f"""
                SELECT column_name, data_type, is_nullable
                FROM information_schema.columns
                WHERE table_name = '{table_name}' AND table_schema = 'public'
                ORDER BY ordinal_position
                """
                columns = await conn.fetch(columns_query)

                for col in columns:
                    nullable = "NULL" if col['is_nullable'] == 'YES' else "NOT NULL"
                    print(f"  - {col['column_name']}: {col['data_type']} {nullable}")

        # 查詢包含 anomaly 或 event 的表
        anomaly_tables = [t for t in tables if 'anomaly' in t['table_name'].lower() or 'event' in t['table_name'].lower()]

        if anomaly_tables:
            print(f"\n🚨 異常事件相關表:")
            for table in anomaly_tables:
                table_name = table['table_name']
                print(f"• {table_name}")

                # 查詢前幾行樣本數據
                try:
                    sample_query = f'SELECT * FROM "{table_name}" LIMIT 3'
                    samples = await conn.fetch(sample_query)
                    if samples:
                        print(f"  樣本數據: {len(samples)} 行")
                except Exception as e:
                    print(f"  ⚠️ 無法查詢樣本: {e}")

        await conn.close()

    except Exception as e:
        print(f"❌ 數據庫連接失敗: {e}")

if __name__ == "__main__":
    asyncio.run(check_database_structure())
