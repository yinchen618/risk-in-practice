import asyncio
import asyncpg

async def check_schema():
    conn = await asyncpg.connect(
        'postgresql://postgres:ZMZ.YGK0yz0-f8b@supa.clkvfvz5fxb3.ap-northeast-3.rds.amazonaws.com:5432/supa'
    )

    # 檢查列結構
    print("=== 表結構 ===")
    result = await conn.fetch("""
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'analysis_ready_data'
        ORDER BY ordinal_position
    """)
    for row in result:
        print(f"{row['column_name']}: {row['data_type']} (nullable: {row['is_nullable']})")

    # 檢查約束
    print("\n=== 約束檢查 ===")
    constraints = await conn.fetch("""
        SELECT constraint_name, constraint_type
        FROM information_schema.table_constraints
        WHERE table_name = 'analysis_ready_data'
    """)
    for row in constraints:
        print(f"{row['constraint_name']}: {row['constraint_type']}")

    # 檢查現有數據中重複的 source_anomaly_event_id
    print("\n=== 重複檢查 ===")
    duplicates = await conn.fetch("""
        SELECT source_anomaly_event_id, COUNT(*)
        FROM analysis_ready_data
        WHERE source_anomaly_event_id IS NOT NULL
        GROUP BY source_anomaly_event_id
        HAVING COUNT(*) > 1
        LIMIT 5
    """)
    if duplicates:
        print("發現重複的 source_anomaly_event_id:")
        for row in duplicates:
            print(f"  {row['source_anomaly_event_id']}: {row['count']} 次")
    else:
        print("沒有發現重複的 source_anomaly_event_id")

    await conn.close()

if __name__ == "__main__":
    asyncio.run(check_schema())
