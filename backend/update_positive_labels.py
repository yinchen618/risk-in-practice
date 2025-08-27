#!/usr/bin/env python3
"""
🎯 AnalysisDataset Positive Labels 更新工具

此腳本用於：
1. 重新計算並更新 AnalysisDataset 的 positiveLabels 數量
2. 檢查標註完成後的資料一致性
3. 提供詳細的更新報告

Author: AI Assistant
Date: 2025-08-27
"""

import sqlite3
import json
import logging
from datetime import datetime
from pathlib import Path

# 設置日誌
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('update_positive_labels.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

def get_database_path():
    """獲取數據庫路徑"""
    # 嘗試多個可能的路徑
    possible_paths = [
        Path(__file__).parent / "database" / "pu_practice.db",
        Path(__file__).parent / "database" / "prisma" / "pu_practice.db",
        Path(__file__).parent / "dev.db",
        Path(__file__).parent / "database" / "dev.db"
    ]

    for path in possible_paths:
        if path.exists():
            logger.info(f"找到數據庫: {path}")
            return str(path)

    # 如果都找不到，返回默認路徑
    default_path = Path(__file__).parent / "database" / "prisma" / "pu_practice.db"
    logger.warning(f"未找到現有數據庫，使用默認路徑: {default_path}")
    return str(default_path)

def update_analysis_dataset_positive_labels():
    """
    更新 AnalysisDataset 的 positiveLabels 數量

    計算方式：
    1. 統計 AnalysisReadyData 中 is_positive_label = true 的記錄數
    2. 統計關聯的 AnomalyEvent 中 status = 'CONFIRMED_POSITIVE' 的記錄數
    3. 取兩者的最大值作為 positiveLabels
    """
    db_path = get_database_path()

    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        logger.info("🚀 開始更新 AnalysisDataset 的 positiveLabels...")

        # 獲取所有 AnalysisDataset
        cursor.execute("""
            SELECT id, name, total_records, positive_labels
            FROM analysis_datasets
            ORDER BY name
        """)

        datasets = cursor.fetchall()
        logger.info(f"📊 找到 {len(datasets)} 個數據集需要檢查")

        updated_count = 0
        total_positive_labels = 0

        for dataset_id, dataset_name, total_records, current_positive_labels in datasets:
            logger.info(f"\n🔍 檢查數據集: {dataset_name} (ID: {dataset_id})")

            # 方法1: 統計 AnalysisReadyData 中的正標籤
            cursor.execute("""
                SELECT COUNT(*)
                FROM analysis_ready_data
                WHERE dataset_id = ? AND is_positive_label = 1
            """, (dataset_id,))

            positive_from_analysis_data = cursor.fetchone()[0]

            # 方法2: 統計關聯的 AnomalyEvent 中確認為正的數量
            cursor.execute("""
                SELECT COUNT(*)
                FROM anomaly_event
                WHERE dataset_id = ? AND status = 'CONFIRMED_POSITIVE'
            """, (dataset_id,))

            positive_from_anomaly_events = cursor.fetchone()[0]

            # 方法3: 統計所有相關的 AnomalyEvent 數量（未標註的）
            cursor.execute("""
                SELECT COUNT(*)
                FROM anomaly_event
                WHERE dataset_id = ?
            """, (dataset_id,))

            total_anomaly_events = cursor.fetchone()[0]

            # 計算新的 positiveLabels 值
            # 優先使用已確認的異常事件數量，如果沒有則使用分析數據中的標籤
            new_positive_labels = max(positive_from_analysis_data, positive_from_anomaly_events)

            logger.info(f"   📈 分析數據中的正標籤: {positive_from_analysis_data}")
            logger.info(f"   ✅ 確認的異常事件: {positive_from_anomaly_events}")
            logger.info(f"   📋 總異常事件: {total_anomaly_events}")
            logger.info(f"   🎯 當前 positiveLabels: {current_positive_labels}")
            logger.info(f"   🆕 新的 positiveLabels: {new_positive_labels}")

            # 如果需要更新
            if new_positive_labels != current_positive_labels:
                cursor.execute("""
                    UPDATE analysis_datasets
                    SET positive_labels = ?
                    WHERE id = ?
                """, (new_positive_labels, dataset_id))

                logger.info(f"   ✅ 已更新: {current_positive_labels} → {new_positive_labels}")
                updated_count += 1
            else:
                logger.info(f"   ℹ️  無需更新")

            total_positive_labels += new_positive_labels

        # 提交更改
        conn.commit()

        # 總結報告
        logger.info(f"\n🎉 更新完成!")
        logger.info(f"📊 總數據集數量: {len(datasets)}")
        logger.info(f"🔄 已更新數據集: {updated_count}")
        logger.info(f"✅ 總正標籤數: {total_positive_labels}")

        return True

    except sqlite3.Error as e:
        logger.error(f"❌ 數據庫錯誤: {e}")
        return False
    except Exception as e:
        logger.error(f"❌ 未知錯誤: {e}")
        return False
    finally:
        if conn:
            conn.close()

def check_labeling_consistency():
    """
    檢查標註完成後的資料一致性

    檢查項目：
    1. ExperimentRun 的候選數與實際 AnomalyEvent 數量是否一致
    2. ExperimentRun 的 positive_label_count 與確認的異常事件數是否一致
    3. AnalysisDataset 的 positiveLabels 與相關 AnomalyEvent 數量是否一致
    """
    db_path = get_database_path()

    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        logger.info("\n🔍 開始檢查標註一致性...")

        # 檢查 ExperimentRun 的一致性
        cursor.execute("""
            SELECT
                er.id,
                er.name,
                er.status,
                er.candidate_count,
                er.positive_label_count,
                er.negative_label_count,
                COUNT(ae.id) as actual_anomaly_events,
                SUM(CASE WHEN ae.status = 'CONFIRMED_POSITIVE' THEN 1 ELSE 0 END) as confirmed_positive,
                SUM(CASE WHEN ae.status = 'REJECTED_NORMAL' THEN 1 ELSE 0 END) as rejected_normal,
                SUM(CASE WHEN ae.status = 'UNREVIEWED' THEN 1 ELSE 0 END) as unreviewed
            FROM experiment_run er
            LEFT JOIN anomaly_event ae ON er.id = ae.experiment_run_id
            WHERE er.status IN ('LABELING', 'COMPLETED')
            GROUP BY er.id, er.name, er.status, er.candidate_count, er.positive_label_count, er.negative_label_count
            ORDER BY er.created_at DESC
        """)

        experiments = cursor.fetchall()

        logger.info(f"📋 檢查 {len(experiments)} 個實驗的一致性...")

        inconsistent_experiments = 0

        for exp in experiments:
            (exp_id, exp_name, status, candidate_count, positive_count, negative_count,
             actual_events, confirmed_positive, rejected_normal, unreviewed) = exp

            logger.info(f"\n🧪 實驗: {exp_name} ({status})")
            logger.info(f"   ID: {exp_id}")
            logger.info(f"   📊 記錄的候選數: {candidate_count}")
            logger.info(f"   📊 實際異常事件: {actual_events}")
            logger.info(f"   ✅ 確認正標籤: {confirmed_positive} (記錄: {positive_count})")
            logger.info(f"   ❌ 拒絕負標籤: {rejected_normal} (記錄: {negative_count})")
            logger.info(f"   ⏳ 未審查: {unreviewed}")

            # 檢查不一致性
            issues = []

            if candidate_count != actual_events:
                issues.append(f"候選數不一致: 記錄 {candidate_count} vs 實際 {actual_events}")

            if positive_count != confirmed_positive:
                issues.append(f"正標籤數不一致: 記錄 {positive_count} vs 實際 {confirmed_positive}")

            if negative_count != rejected_normal:
                issues.append(f"負標籤數不一致: 記錄 {negative_count} vs 實際 {rejected_normal}")

            if issues:
                logger.warning(f"   ⚠️  發現不一致性:")
                for issue in issues:
                    logger.warning(f"      - {issue}")
                inconsistent_experiments += 1

                # 自動修復選項
                logger.info(f"   🔧 自動修復實驗 {exp_name}...")
                cursor.execute("""
                    UPDATE experiment_run
                    SET
                        candidate_count = ?,
                        positive_label_count = ?,
                        negative_label_count = ?
                    WHERE id = ?
                """, (actual_events, confirmed_positive, rejected_normal, exp_id))
                logger.info(f"   ✅ 已修復")
            else:
                logger.info(f"   ✅ 資料一致")

        # 檢查 AnalysisDataset 與 AnomalyEvent 的一致性
        logger.info(f"\n🔍 檢查 AnalysisDataset 與 AnomalyEvent 的一致性...")

        cursor.execute("""
            SELECT
                ad.id,
                ad.name,
                ad.positive_labels,
                COUNT(ae.id) as total_anomaly_events,
                SUM(CASE WHEN ae.status = 'CONFIRMED_POSITIVE' THEN 1 ELSE 0 END) as confirmed_positive_events
            FROM analysis_datasets ad
            LEFT JOIN anomaly_event ae ON ad.id = ae.dataset_id
            GROUP BY ad.id, ad.name, ad.positive_labels
            ORDER BY ad.name
        """)

        dataset_consistency = cursor.fetchall()
        inconsistent_datasets = 0

        for dataset in dataset_consistency:
            (dataset_id, dataset_name, recorded_positive, total_events, confirmed_positive) = dataset

            logger.info(f"📦 數據集: {dataset_name}")
            logger.info(f"   記錄的正標籤: {recorded_positive}")
            logger.info(f"   總異常事件: {total_events}")
            logger.info(f"   確認的正標籤: {confirmed_positive}")

            if recorded_positive != confirmed_positive and confirmed_positive > 0:
                logger.warning(f"   ⚠️  正標籤數不一致: 記錄 {recorded_positive} vs 確認 {confirmed_positive}")
                inconsistent_datasets += 1
            else:
                logger.info(f"   ✅ 一致")

        # 提交修復
        conn.commit()

        # 總結
        logger.info(f"\n📋 一致性檢查完成!")
        logger.info(f"❌ 不一致的實驗: {inconsistent_experiments}/{len(experiments)}")
        logger.info(f"❌ 不一致的數據集: {inconsistent_datasets}/{len(dataset_consistency)}")

        if inconsistent_experiments == 0 and inconsistent_datasets == 0:
            logger.info("🎉 所有資料都是一致的!")
        else:
            logger.info("🔧 已自動修復發現的不一致性")

        return True

    except sqlite3.Error as e:
        logger.error(f"❌ 數據庫錯誤: {e}")
        return False
    except Exception as e:
        logger.error(f"❌ 未知錯誤: {e}")
        return False
    finally:
        if conn:
            conn.close()

def generate_summary_report():
    """生成詳細的摘要報告"""
    db_path = get_database_path()

    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        logger.info("\n📊 生成摘要報告...")

        # 總體統計
        cursor.execute("SELECT COUNT(*) FROM analysis_datasets")
        total_datasets = cursor.fetchone()[0]

        cursor.execute("SELECT SUM(total_records) FROM analysis_datasets")
        total_records = cursor.fetchone()[0] or 0

        cursor.execute("SELECT SUM(positive_labels) FROM analysis_datasets")
        total_positive_labels = cursor.fetchone()[0] or 0

        cursor.execute("SELECT COUNT(*) FROM experiment_run")
        total_experiments = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM anomaly_event")
        total_anomaly_events = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM anomaly_event WHERE status = 'CONFIRMED_POSITIVE'")
        confirmed_positive = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM anomaly_event WHERE status = 'REJECTED_NORMAL'")
        rejected_normal = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM anomaly_event WHERE status = 'UNREVIEWED'")
        unreviewed = cursor.fetchone()[0]

        # 生成報告
        report = f"""
🎯 ===============================================
📊 AnalysisDataset Positive Labels 更新報告
📅 生成時間: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
🎯 ===============================================

📈 總體統計:
   📦 總數據集數量: {total_datasets:,}
   📋 總記錄數量: {total_records:,}
   ✅ 總正標籤數: {total_positive_labels:,}
   🧪 總實驗數: {total_experiments:,}
   ⚡ 總異常事件: {total_anomaly_events:,}

🏷️ 標註狀態統計:
   ✅ 已確認正標籤: {confirmed_positive:,}
   ❌ 已拒絕負標籤: {rejected_normal:,}
   ⏳ 待審查: {unreviewed:,}

📊 標註完成率: {((confirmed_positive + rejected_normal) / max(total_anomaly_events, 1) * 100):.1f}%
✅ 正標籤比例: {(confirmed_positive / max(total_anomaly_events, 1) * 100):.1f}%

🎯 ===============================================
        """

        logger.info(report)

        # 保存報告到文件
        report_file = f"positive_labels_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
        with open(report_file, 'w', encoding='utf-8') as f:
            f.write(report)

        logger.info(f"📄 報告已保存到: {report_file}")

        return True

    except sqlite3.Error as e:
        logger.error(f"❌ 數據庫錯誤: {e}")
        return False
    except Exception as e:
        logger.error(f"❌ 未知錯誤: {e}")
        return False
    finally:
        if conn:
            conn.close()

def main():
    """主函數"""
    logger.info("🚀 開始 AnalysisDataset Positive Labels 更新程序...")

    try:
        # 1. 更新 AnalysisDataset 的 positiveLabels
        if not update_analysis_dataset_positive_labels():
            logger.error("❌ 更新 positiveLabels 失敗")
            return False

        # 2. 檢查標註一致性
        if not check_labeling_consistency():
            logger.error("❌ 檢查一致性失敗")
            return False

        # 3. 生成摘要報告
        if not generate_summary_report():
            logger.error("❌ 生成報告失敗")
            return False

        logger.info("🎉 所有任務已完成!")
        return True

    except Exception as e:
        logger.error(f"❌ 程序執行失敗: {e}")
        return False

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
