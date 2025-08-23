#!/usr/bin/env python3
"""
檢查資料庫表結構
"""

import asyncio
import asyncpg
from etl_config import get_database_url

async def check_table_structure():
    """檢查 analysis_datasets 表結構"""

    database_url = get_database_url()
    conn = await asyncpg.connect(database_url)

    try:
        # 檢查 analysis_datasets 表結構
        table_info = await conn.fetch("""
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns
            WHERE table_name = 'analysis_datasets'
            ORDER BY ordinal_position
        """)

        print("analysis_datasets 表結構:")
        for col in table_info:
            print(f"  {col['column_name']}: {col['data_type']}, nullable={col['is_nullable']}, default={col['column_default']}")

        # 檢查約束
        constraints = await conn.fetch("""
            SELECT constraint_name, constraint_type
            FROM information_schema.table_constraints
            WHERE table_name = 'analysis_datasets'
        """)

        print("\n約束:")
        for const in constraints:
            print(f"  {const['constraint_name']}: {const['constraint_type']}")

    finally:
        await conn.close()

if __name__ == "__main__":
    asyncio.run(check_table_structure())
