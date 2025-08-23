#!/usr/bin/env python3
"""
查詢 AmmeterLog 資料表中 success: false 的資料筆數
"""

import sys
import os
import asyncio
sys.path.append('/home/infowin/Git-projects/pu-in-practice/backend')

from core.database import db_manager, AmmeterLog
from sqlalchemy import select, func

async def query_failed_ammeter_logs():
    """查詢失敗的電表日誌記錄"""

    print("🔍 查詢 AmmeterLog 資料表中 success: false 的資料")
    print("=" * 60)

    try:
        async with db_manager.session_factory() as session:
            # 查詢 success = false 的總筆數
            failed_count_stmt = select(func.count(AmmeterLog.id)).where(
                AmmeterLog.success == False
            )
            failed_result = await session.execute(failed_count_stmt)
            failed_count = failed_result.scalar()

            # 查詢總筆數
            total_count_stmt = select(func.count(AmmeterLog.id))
            total_result = await session.execute(total_count_stmt)
            total_count = total_result.scalar()

            # 查詢成功的筆數
            success_count = total_count - failed_count

            print(f"📊 統計結果:")
            print(f"   總記錄筆數: {total_count:,}")
            print(f"   成功記錄 (success: true): {success_count:,}")
            print(f"   失敗記錄 (success: false): {failed_count:,}")

            if total_count > 0:
                success_rate = (success_count / total_count) * 100
                failure_rate = (failed_count / total_count) * 100
                print(f"   成功率: {success_rate:.2f}%")
                print(f"   失敗率: {failure_rate:.2f}%")

            # 如果有失敗記錄，查詢一些詳細信息
            if failed_count > 0:
                print(f"\n🔍 失敗記錄詳細信息 (顯示前 10 筆):")
                print("-" * 60)

                failed_logs_stmt = select(
                    AmmeterLog.id,
                    AmmeterLog.deviceNumber,
                    AmmeterLog.action,
                    AmmeterLog.errorMessage,
                    AmmeterLog.statusCode,
                    AmmeterLog.createdAt
                ).where(
                    AmmeterLog.success == False
                ).order_by(AmmeterLog.createdAt.desc()).limit(10)

                failed_logs_result = await session.execute(failed_logs_stmt)
                failed_logs = failed_logs_result.fetchall()

                for i, log in enumerate(failed_logs, 1):
                    print(f"{i:2d}. ID: {log.id}")
                    print(f"    設備號: {log.deviceNumber}")
                    print(f"    動作: {log.action}")
                    print(f"    狀態碼: {log.statusCode}")
                    print(f"    錯誤訊息: {log.errorMessage[:100] if log.errorMessage else 'N/A'}{'...' if log.errorMessage and len(log.errorMessage) > 100 else ''}")
                    print(f"    創建時間: {log.createdAt}")
                    print()

                # 按動作類型分組統計失敗記錄
                print("📈 按動作類型統計失敗記錄:")
                print("-" * 30)

                action_stats_stmt = select(
                    AmmeterLog.action,
                    func.count(AmmeterLog.id).label('count')
                ).where(
                    AmmeterLog.success == False
                ).group_by(AmmeterLog.action).order_by(func.count(AmmeterLog.id).desc())

                action_stats_result = await session.execute(action_stats_stmt)
                action_stats = action_stats_result.fetchall()

                for action, count in action_stats:
                    print(f"   {action}: {count:,} 筆")

                # 按設備號統計失敗記錄 (顯示前 5 個)
                print(f"\n🔧 失敗最多的設備 (前 5 個):")
                print("-" * 30)

                device_stats_stmt = select(
                    AmmeterLog.deviceNumber,
                    func.count(AmmeterLog.id).label('count')
                ).where(
                    AmmeterLog.success == False
                ).group_by(AmmeterLog.deviceNumber).order_by(func.count(AmmeterLog.id).desc()).limit(5)

                device_stats_result = await session.execute(device_stats_stmt)
                device_stats = device_stats_result.fetchall()

                for device, count in device_stats:
                    print(f"   設備 {device}: {count:,} 筆失敗記錄")

    except Exception as e:
        print(f"❌ 查詢失敗:")
        print(f"   錯誤: {e}")
        print(f"   類型: {type(e).__name__}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(query_failed_ammeter_logs())
