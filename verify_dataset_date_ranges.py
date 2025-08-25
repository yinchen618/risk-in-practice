#!/usr/bin/env python3
"""
驗證和修正 AnalysisDataset 的 startDate 和 endDate
確保它們正確涵蓋相關 AnalysisReadyData 的時間範圍
"""

import sqlite3
import sys
import os
from datetime import datetime
from typing import List, Tuple, Dict, Any

# 添加後端路徑以便導入模組
sys.path.append('/home/infowin/Git-projects/pu-in-practice/backend')

def connect_to_database():
    """連接到 SQLite 資料庫"""
    db_path = '/home/infowin/Git-projects/pu-in-practice/backend/database/prisma/pu_practice.db'
    if not os.path.exists(db_path):
        print(f"❌ 資料庫檔案不存在: {db_path}")
        return None

    try:
        conn = sqlite3.connect(db_path)
        conn.row_factory = sqlite3.Row  # 使結果可以像字典一樣存取
        return conn
    except Exception as e:
        print(f"❌ 連接資料庫失敗: {e}")
        return None

def get_analysis_datasets(conn) -> List[Dict[str, Any]]:
    """取得所有 AnalysisDataset"""
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, name, start_date, end_date, building, floor, room, occupant_type
        FROM analysis_datasets
        ORDER BY created_at
    """)

    datasets = []
    for row in cursor.fetchall():
        datasets.append({
            'id': row['id'],
            'name': row['name'],
            'start_date': row['start_date'],
            'end_date': row['end_date'],
            'building': row['building'],
            'floor': row['floor'],
            'room': row['room'],
            'occupant_type': row['occupant_type']
        })

    return datasets

def get_data_range_for_dataset(conn, dataset_id: str) -> Tuple[str, str, int, int]:
    """取得特定 dataset 對應的 AnalysisReadyData 的時間範圍和統計資訊"""
    cursor = conn.cursor()
    cursor.execute("""
        SELECT
            MIN(timestamp) as min_timestamp,
            MAX(timestamp) as max_timestamp,
            COUNT(*) as record_count,
            SUM(CASE WHEN is_positive_label = 1 THEN 1 ELSE 0 END) as positive_count
        FROM analysis_ready_data
        WHERE dataset_id = ?
    """, (dataset_id,))

    result = cursor.fetchone()
    if result and result['min_timestamp'] and result['max_timestamp']:
        return result['min_timestamp'], result['max_timestamp'], result['record_count'], result['positive_count']
    else:
        return None, None, 0, 0

def verify_dataset_date_ranges(conn):
    """驗證所有 AnalysisDataset 的日期範圍"""
    print("🔍 驗證 AnalysisDataset 的日期範圍...")
    print("=" * 80)

    datasets = get_analysis_datasets(conn)
    issues_found = []

    for dataset in datasets:
        dataset_id = dataset['id']
        dataset_name = dataset['name']
        dataset_start = dataset['start_date']
        dataset_end = dataset['end_date']

        print(f"\n📊 檢查資料集: {dataset_name}")
        print(f"   資料集 ID: {dataset_id}")
        def format_timestamp(ts):
            if isinstance(ts, int):
                return datetime.fromtimestamp(ts / 1000).strftime('%Y-%m-%d %H:%M:%S')
            elif isinstance(ts, str):
                return datetime.fromisoformat(ts.replace('Z', '+00:00')).strftime('%Y-%m-%d %H:%M:%S')
            else:
                return str(ts)

        print(f"   資料集記錄的時間範圍: {format_timestamp(dataset_start)} ~ {format_timestamp(dataset_end)}")

        # 取得實際的資料時間範圍
        actual_start, actual_end, record_count = get_data_range_for_dataset(conn, dataset_id)

        if actual_start is None or actual_end is None:
            print(f"   ⚠️  沒有找到對應的 AnalysisReadyData (記錄數: {record_count})")
            continue

        print(f"   實際資料的時間範圍: {format_timestamp(actual_start)} ~ {format_timestamp(actual_end)}")
        print(f"   實際資料記錄數: {record_count}")

        # 比較日期範圍 (處理 Unix 時間戳格式)
        def parse_timestamp(ts):
            if isinstance(ts, int):
                # Unix 時間戳 (毫秒)
                return datetime.fromtimestamp(ts / 1000)
            elif isinstance(ts, str):
                # ISO 格式
                return datetime.fromisoformat(ts.replace('Z', '+00:00'))
            else:
                return ts

        dataset_start_dt = parse_timestamp(dataset_start)
        dataset_end_dt = parse_timestamp(dataset_end)
        actual_start_dt = parse_timestamp(actual_start)
        actual_end_dt = parse_timestamp(actual_end)

        # 檢查是否有問題
        start_mismatch = abs((dataset_start_dt - actual_start_dt).total_seconds()) > 60  # 允許1分鐘誤差
        end_mismatch = abs((dataset_end_dt - actual_end_dt).total_seconds()) > 60

        if start_mismatch or end_mismatch:
            print(f"   ❌ 發現日期範圍不匹配!")
            if start_mismatch:
                diff_hours = (dataset_start_dt - actual_start_dt).total_seconds() / 3600
                print(f"      開始時間差異: {diff_hours:.2f} 小時")
            if end_mismatch:
                diff_hours = (dataset_end_dt - actual_end_dt).total_seconds() / 3600
                print(f"      結束時間差異: {diff_hours:.2f} 小時")

            issues_found.append({
                'dataset_id': dataset_id,
                'dataset_name': dataset_name,
                'current_start': dataset_start,
                'current_end': dataset_end,
                'correct_start': actual_start,
                'correct_end': actual_end,
                'record_count': record_count
            })
        else:
            print(f"   ✅ 日期範圍正確")

    return issues_found

def fix_dataset_date_ranges(conn, issues: List[Dict[str, Any]]):
    """修正 AnalysisDataset 的日期範圍"""
    if not issues:
        print("\n✅ 沒有發現需要修正的日期範圍問題")
        return

    print(f"\n🔧 發現 {len(issues)} 個需要修正的資料集")
    print("=" * 80)

    cursor = conn.cursor()

    for issue in issues:
        dataset_id = issue['dataset_id']
        dataset_name = issue['dataset_name']
        correct_start = issue['correct_start']
        correct_end = issue['correct_end']

        print(f"\n修正資料集: {dataset_name}")
        print(f"  舊的時間範圍: {issue['current_start']} ~ {issue['current_end']}")
        print(f"  新的時間範圍: {correct_start} ~ {correct_end}")

        try:
            # 將實際時間範圍轉換為毫秒時間戳 (SQLite 中的格式)
            def timestamp_to_ms(ts):
                if isinstance(ts, int):
                    return ts  # 已經是毫秒時間戳
                elif isinstance(ts, str):
                    dt = datetime.fromisoformat(ts.replace('Z', '+00:00'))
                    return int(dt.timestamp() * 1000)
                else:
                    return ts

            correct_start_ms = timestamp_to_ms(correct_start)
            correct_end_ms = timestamp_to_ms(correct_end)

            cursor.execute("""
                UPDATE analysis_datasets
                SET start_date = ?, end_date = ?
                WHERE id = ?
            """, (correct_start_ms, correct_end_ms, dataset_id))

            print(f"  ✅ 修正成功")
        except Exception as e:
            print(f"  ❌ 修正失敗: {e}")

    # 提交變更
    try:
        conn.commit()
        print(f"\n💾 所有變更已保存到資料庫")
    except Exception as e:
        print(f"\n❌ 保存變更失敗: {e}")
        conn.rollback()

def main():
    """主函數"""
    print("🔍 AnalysisDataset 日期範圍驗證工具")
    print("=" * 80)

    # 連接資料庫
    conn = connect_to_database()
    if not conn:
        return

    try:
        # 驗證日期範圍
        issues = verify_dataset_date_ranges(conn)

        # 修正問題
        if issues:
            print(f"\n⚠️  發現 {len(issues)} 個日期範圍問題:")
            for i, issue in enumerate(issues, 1):
                print(f"  {i}. {issue['dataset_name']} (記錄數: {issue['record_count']})")

            response = input("\n🤔 是否要修正這些問題? (y/n): ").lower().strip()
            if response == 'y' or response == 'yes':
                fix_dataset_date_ranges(conn, issues)
            else:
                print("📝 跳過修正，僅進行驗證")
        else:
            print("\n🎉 所有 AnalysisDataset 的日期範圍都是正確的!")

    except Exception as e:
        print(f"❌ 執行過程中發生錯誤: {e}")
        import traceback
        traceback.print_exc()

    finally:
        conn.close()
        print("\n🔚 驗證完成")

if __name__ == "__main__":
    main()
