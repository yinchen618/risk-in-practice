#!/usr/bin/env python3
"""
更新 AnalysisDataset 的 positive_labels 欄位
基於 anomaly_event 表中 status = 'CONFIRMED_POSITIVE' 的記錄數量
"""

import sqlite3
import sys
from datetime import datetime

def update_positive_labels():
    """更新所有 AnalysisDataset 的 positive_labels 欄位"""

    # 連接 SQLite 資料庫
    db_path = 'database/prisma/pu_practice.db'
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    try:
        print(f"🔍 開始更新 positive_labels - {datetime.now()}")
        print(f"📁 資料庫路徑: {db_path}")

        # 1. 先檢查當前狀態
        cursor.execute("""
            SELECT COUNT(*) as total_datasets
            FROM analysis_datasets
        """)
        total_datasets = cursor.fetchone()[0]
        print(f"📊 總數據集數量: {total_datasets}")

        cursor.execute("""
            SELECT COUNT(*) as total_positive_events
            FROM anomaly_event
            WHERE status = 'CONFIRMED_POSITIVE'
        """)
        total_positive_events = cursor.fetchone()[0]
        print(f"✅ 總確認正異常事件: {total_positive_events}")

        # 2. 計算每個數據集的正異常數量並更新
        cursor.execute("""
            SELECT
                ad.id,
                ad.name,
                ad.positive_labels as current_positive_labels,
                COALESCE(ae_count.positive_count, 0) as actual_positive_count
            FROM analysis_datasets ad
            LEFT JOIN (
                SELECT
                    dataset_id,
                    COUNT(*) as positive_count
                FROM anomaly_event
                WHERE status = 'CONFIRMED_POSITIVE'
                GROUP BY dataset_id
            ) ae_count ON ad.id = ae_count.dataset_id
            ORDER BY ad.name
        """)

        results = cursor.fetchall()
        updated_count = 0

        print(f"\n📋 數據集正異常標籤更新報告:")
        print("-" * 80)
        print(f"{'數據集名稱':<30} {'當前值':<8} {'實際值':<8} {'狀態':<10}")
        print("-" * 80)

        for row in results:
            dataset_id, dataset_name, current_positive, actual_positive = row

            status = "✅ 正確" if current_positive == actual_positive else "🔄 需更新"
            print(f"{dataset_name[:29]:<30} {current_positive:<8} {actual_positive:<8} {status:<10}")

            # 如果值不同，則更新
            if current_positive != actual_positive:
                cursor.execute("""
                    UPDATE analysis_datasets
                    SET positive_labels = ?
                    WHERE id = ?
                """, (actual_positive, dataset_id))
                updated_count += 1

        print("-" * 80)
        print(f"📈 更新統計:")
        print(f"   - 檢查的數據集: {len(results)}")
        print(f"   - 需要更新的: {updated_count}")
        print(f"   - 已是正確的: {len(results) - updated_count}")

        # 3. 提交更改
        if updated_count > 0:
            conn.commit()
            print(f"✅ 已成功更新 {updated_count} 個數據集的 positive_labels")
        else:
            print("✅ 所有數據集的 positive_labels 都已是正確值")

        # 4. 驗證更新結果
        print(f"\n🔍 驗證更新結果:")
        cursor.execute("""
            SELECT
                SUM(positive_labels) as total_positive_labels_sum
            FROM analysis_datasets
        """)
        total_sum = cursor.fetchone()[0] or 0
        print(f"   - 所有數據集 positive_labels 總和: {total_sum}")
        print(f"   - anomaly_event 確認正異常總數: {total_positive_events}")

        if total_sum == total_positive_events:
            print("✅ 驗證通過：數量完全匹配！")
        else:
            print(f"⚠️  警告：數量不匹配，差異: {abs(total_sum - total_positive_events)}")

    except Exception as e:
        print(f"❌ 更新過程中發生錯誤: {e}")
        conn.rollback()
        return False

    finally:
        conn.close()

    return True

def check_positive_labels_status():
    """檢查 positive_labels 的當前狀態（不更新）"""

    db_path = 'database/prisma/pu_practice.db'
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    try:
        print(f"🔍 檢查 positive_labels 狀態 - {datetime.now()}")

        # 檢查不一致的數據集
        cursor.execute("""
            SELECT
                ad.name,
                ad.positive_labels as stored_count,
                COALESCE(ae_count.positive_count, 0) as actual_count,
                (COALESCE(ae_count.positive_count, 0) - ad.positive_labels) as difference
            FROM analysis_datasets ad
            LEFT JOIN (
                SELECT
                    dataset_id,
                    COUNT(*) as positive_count
                FROM anomaly_event
                WHERE status = 'CONFIRMED_POSITIVE'
                GROUP BY dataset_id
            ) ae_count ON ad.id = ae_count.dataset_id
            WHERE ad.positive_labels != COALESCE(ae_count.positive_count, 0)
            ORDER BY ABS(COALESCE(ae_count.positive_count, 0) - ad.positive_labels) DESC
        """)

        inconsistent = cursor.fetchall()

        if inconsistent:
            print(f"⚠️  發現 {len(inconsistent)} 個數據集的 positive_labels 不一致:")
            print("-" * 70)
            print(f"{'數據集名稱':<30} {'存儲值':<8} {'實際值':<8} {'差異':<8}")
            print("-" * 70)
            for row in inconsistent:
                name, stored, actual, diff = row
                print(f"{name[:29]:<30} {stored:<8} {actual:<8} {diff:+<8}")
            print("-" * 70)
        else:
            print("✅ 所有數據集的 positive_labels 都是正確的！")

        return len(inconsistent) == 0

    except Exception as e:
        print(f"❌ 檢查過程中發生錯誤: {e}")
        return False

    finally:
        conn.close()

if __name__ == "__main__":
    print("🎯 AnalysisDataset positive_labels 更新工具")
    print("=" * 50)

    if len(sys.argv) > 1 and sys.argv[1] == "--check-only":
        # 只檢查，不更新
        check_positive_labels_status()
    else:
        # 執行更新
        success = update_positive_labels()
        if success:
            print("\n🎉 positive_labels 更新完成！")
        else:
            print("\n❌ positive_labels 更新失敗！")
            sys.exit(1)
