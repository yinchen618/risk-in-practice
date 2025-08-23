import asyncio
import asyncpg

async def cleanup_duplicate_data():
    """清理重複的數據"""
    conn = await asyncpg.connect(
        'postgresql://postgres:ZMZ.YGK0yz0-f8b@supa.clkvfvz5fxb3.ap-northeast-3.rds.amazonaws.com:5432/supa'
    )

    try:
        # 方案1: 刪除所有現有的測試數據集
        print("清理現有測試數據...")
        result = await conn.execute("""
            DELETE FROM analysis_ready_data
            WHERE dataset_id IN (
                SELECT id FROM analysis_dataset
                WHERE name LIKE '%Building-A-2F-Room-201%'
            )
        """)
        print(f"已刪除 {result} 筆分析數據")

        result = await conn.execute("""
            DELETE FROM analysis_dataset
            WHERE name LIKE '%Building-A-2F-Room-201%'
        """)
        print(f"已刪除 {result} 個數據集")

        print("清理完成！")

    except Exception as e:
        print(f"清理時發生錯誤: {e}")
    finally:
        await conn.close()

if __name__ == "__main__":
    asyncio.run(cleanup_duplicate_data())
