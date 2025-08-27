#!/usr/bin/env python3
"""
🎯 簡化版本的 Positive Labels 檢查工具

快速檢查和更新 AnalysisDataset 的 positiveLabels
"""

import sqlite3
import sys
from pathlib import Path

def find_database():
    """尋找數據庫文件"""
    possible_paths = [
        "backend/database/prisma/pu_practice.db",
        "database/prisma/pu_practice.db",
        "backend/database/dev.db",
        "database/dev.db",
        "backend/dev.db",
        "dev.db"
    ]

    for path in possible_paths:
        if Path(path).exists():
            return path
    return None

def quick_update():
    """快速更新和檢查"""
    db_path = find_database()
    if not db_path:
        print("❌ 找不到數據庫文件")
        return False

    print(f"📁 使用數據庫: {db_path}")

    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        # 獲取並更新每個數據集的 positiveLabels
        cursor.execute("""
            SELECT
                ad.id,
                ad.name,
                ad.positive_labels as current_positive,
                COUNT(CASE WHEN ard.is_positive_label = 1 THEN 1 END) as analysis_positive,
                COUNT(CASE WHEN ae.status = 'CONFIRMED_POSITIVE' THEN 1 END) as confirmed_positive
            FROM analysis_datasets ad
            LEFT JOIN analysis_ready_data ard ON ad.id = ard.dataset_id
            LEFT JOIN anomaly_event ae ON ad.id = ae.dataset_id
            GROUP BY ad.id, ad.name, ad.positive_labels
            ORDER BY ad.name
        """)

        datasets = cursor.fetchall()
        updates_made = 0

        print(f"\n🔍 檢查 {len(datasets)} 個數據集...")
        print("-" * 80)

        for dataset_id, name, current, analysis_pos, confirmed_pos in datasets:
            # 取兩種計算方式的最大值
            new_positive = max(analysis_pos, confirmed_pos)

            status = "✅" if current == new_positive else "🔄"
            print(f"{status} {name:<30} | 當前: {current:>3} | 分析: {analysis_pos:>3} | 確認: {confirmed_pos:>3} | 新值: {new_positive:>3}")

            if current != new_positive:
                cursor.execute("""
                    UPDATE analysis_datasets
                    SET positive_labels = ?
                    WHERE id = ?
                """, (new_positive, dataset_id))
                updates_made += 1

        conn.commit()

        print("-" * 80)
        print(f"🎯 已更新 {updates_made} 個數據集")

        # 快速統計
        cursor.execute("SELECT SUM(positive_labels) FROM analysis_datasets")
        total_positive = cursor.fetchone()[0] or 0

        cursor.execute("SELECT COUNT(*) FROM anomaly_event WHERE status = 'CONFIRMED_POSITIVE'")
        total_confirmed = cursor.fetchone()[0] or 0

        print(f"📊 總正標籤: {total_positive}")
        print(f"✅ 總確認異常: {total_confirmed}")

        conn.close()
        return True

    except Exception as e:
        print(f"❌ 錯誤: {e}")
        return False

if __name__ == "__main__":
    quick_update()
