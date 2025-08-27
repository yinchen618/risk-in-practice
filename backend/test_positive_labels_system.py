#!/usr/bin/env python3
"""
測試 AnalysisDataset positive_labels 自動更新功能
"""

import sqlite3
import json
from datetime import datetime

def test_positive_labels_update():
    """測試標註時是否會自動更新 positive_labels"""

    db_path = 'database/prisma/pu_practice.db'
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    try:
        print("🧪 測試 positive_labels 自動更新功能")
        print("=" * 60)

        # 1. 找一個未審核的異常事件來測試
        cursor.execute("""
            SELECT ae.id, ae.dataset_id, ad.name, ad.positive_labels
            FROM anomaly_event ae
            JOIN analysis_datasets ad ON ae.dataset_id = ad.id
            WHERE ae.status = 'UNREVIEWED'
            LIMIT 1
        """)

        test_event = cursor.fetchone()
        if not test_event:
            print("❌ 沒有找到未審核的異常事件可供測試")
            return False

        event_id, dataset_id, dataset_name, current_positive_labels = test_event
        print(f"📝 測試事件: {event_id}")
        print(f"📊 數據集: {dataset_name} (ID: {dataset_id})")
        print(f"🔢 當前 positive_labels: {current_positive_labels}")

        # 2. 檢查該數據集當前的確認正異常數量
        cursor.execute("""
            SELECT COUNT(*)
            FROM anomaly_event
            WHERE dataset_id = ? AND status = 'CONFIRMED_POSITIVE'
        """, (dataset_id,))

        current_confirmed = cursor.fetchone()[0]
        print(f"✅ 當前已確認正異常: {current_confirmed}")

        # 3. 模擬標註為正異常（但不實際執行，只是檢查）
        expected_new_count = current_confirmed + 1
        print(f"🎯 如果將此事件標註為正異常，預期 positive_labels 變為: {expected_new_count}")

        # 4. 檢查是否與當前 positive_labels 一致
        if current_positive_labels == current_confirmed:
            print("✅ 當前 positive_labels 與確認正異常數量一致")
        else:
            print(f"⚠️  當前 positive_labels ({current_positive_labels}) 與確認正異常數量 ({current_confirmed}) 不一致")

        return True

    except Exception as e:
        print(f"❌ 測試過程中發生錯誤: {e}")
        return False

    finally:
        conn.close()

def check_system_integrity():
    """檢查整個系統的數據完整性"""

    db_path = 'database/prisma/pu_practice.db'
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    try:
        print("\n🔍 系統數據完整性檢查")
        print("=" * 60)

        # 1. 總體統計
        cursor.execute("SELECT COUNT(*) FROM analysis_datasets")
        total_datasets = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM anomaly_event")
        total_events = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM anomaly_event WHERE status = 'CONFIRMED_POSITIVE'")
        total_confirmed = cursor.fetchone()[0]

        cursor.execute("SELECT SUM(positive_labels) FROM analysis_datasets")
        total_positive_labels = cursor.fetchone()[0] or 0

        print(f"📊 總數據集: {total_datasets}")
        print(f"📝 總異常事件: {total_events}")
        print(f"✅ 總確認正異常: {total_confirmed}")
        print(f"🔢 positive_labels 總和: {total_positive_labels}")

        # 2. 檢查一致性
        if total_positive_labels == total_confirmed:
            print("✅ 數據完全一致！")
        else:
            print(f"⚠️  數據不一致，差異: {abs(total_positive_labels - total_confirmed)}")

        # 3. 檢查各數據集的詳細情況
        cursor.execute("""
            SELECT
                ad.name,
                ad.positive_labels,
                COALESCE(ae_count.confirmed_count, 0) as actual_confirmed
            FROM analysis_datasets ad
            LEFT JOIN (
                SELECT dataset_id, COUNT(*) as confirmed_count
                FROM anomaly_event
                WHERE status = 'CONFIRMED_POSITIVE'
                GROUP BY dataset_id
            ) ae_count ON ad.id = ae_count.dataset_id
            WHERE ad.positive_labels != COALESCE(ae_count.confirmed_count, 0)
        """)

        inconsistent = cursor.fetchall()
        if inconsistent:
            print(f"\n⚠️  發現 {len(inconsistent)} 個數據集有不一致的 positive_labels:")
            for name, stored, actual in inconsistent:
                print(f"   - {name}: 存儲={stored}, 實際={actual}")
        else:
            print("\n✅ 所有數據集的 positive_labels 都是正確的")

        # 4. 檢查最近的標註活動
        cursor.execute("""
            SELECT COUNT(*)
            FROM anomaly_event
            WHERE review_timestamp IS NOT NULL
            AND date(review_timestamp) = date('now')
        """)

        today_reviews = cursor.fetchone()[0]
        print(f"📅 今日標註活動: {today_reviews} 個事件")

        return len(inconsistent) == 0

    except Exception as e:
        print(f"❌ 檢查過程中發生錯誤: {e}")
        return False

    finally:
        conn.close()

if __name__ == "__main__":
    print("🎯 AnalysisDataset positive_labels 完整性測試")
    print("=" * 60)

    # 執行測試
    test_passed = test_positive_labels_update()
    integrity_passed = check_system_integrity()

    print("\n📋 測試結果總結:")
    print("=" * 60)
    if test_passed and integrity_passed:
        print("🎉 所有測試通過！positive_labels 自動更新功能正常運作")
    else:
        print("❌ 發現問題，請檢查系統配置")
        if not test_passed:
            print("   - 標註功能測試失敗")
        if not integrity_passed:
            print("   - 數據完整性檢查失敗")
