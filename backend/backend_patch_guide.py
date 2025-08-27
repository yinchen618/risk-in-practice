"""
🎯 為後端添加 AnalysisDataset positiveLabels 自動更新功能

此修補腳本在標註功能中添加自動更新 AnalysisDataset.positiveLabels 的邏輯
"""

# 這個函數應該添加到 case_study_v2.py 中
def update_analysis_dataset_positive_labels(cursor, dataset_id):
    """
    更新指定 AnalysisDataset 的 positiveLabels 計數

    Args:
        cursor: 數據庫游標
        dataset_id: 數據集ID
    """
    try:
        # 統計該數據集中確認的正標籤數量
        cursor.execute("""
            SELECT COUNT(*)
            FROM anomaly_event
            WHERE dataset_id = ? AND status = 'CONFIRMED_POSITIVE'
        """, (dataset_id,))

        confirmed_positive_count = cursor.fetchone()[0]

        # 統計 AnalysisReadyData 中的正標籤數量
        cursor.execute("""
            SELECT COUNT(*)
            FROM analysis_ready_data
            WHERE dataset_id = ? AND is_positive_label = 1
        """, (dataset_id,))

        analysis_positive_count = cursor.fetchone()[0]

        # 取兩者的最大值
        new_positive_labels = max(confirmed_positive_count, analysis_positive_count)

        # 更新 AnalysisDataset
        cursor.execute("""
            UPDATE analysis_datasets
            SET positive_labels = ?
            WHERE id = ?
        """, (new_positive_labels, dataset_id))

        return new_positive_labels

    except Exception as e:
        logger.error(f"Failed to update AnalysisDataset positiveLabels for dataset {dataset_id}: {e}")
        return None


# 需要修改的地方：

# 1. 在 review_anomaly_event 函數中添加（約第1290行）
# 在更新 AnalysisReadyData 之後添加：
"""
                # 3.5. 更新 AnalysisDataset 的 positiveLabels
                new_positive_count = update_analysis_dataset_positive_labels(cursor, event_dataset_id)
                if new_positive_count is not None:
                    logger.info(f"Updated AnalysisDataset {event_dataset_id} positiveLabels to {new_positive_count}")
"""

# 2. 在 bulk_review_anomaly_events 函數中添加（約第1340行）
# 在更新實驗統計之後添加：
"""
            # 4.5. 更新所有相關 AnalysisDataset 的 positiveLabels
            affected_datasets = set()
            for event_id in updated_events:
                cursor.execute("SELECT dataset_id FROM anomaly_event WHERE id = ?", (event_id,))
                dataset_result = cursor.fetchone()
                if dataset_result:
                    affected_datasets.add(dataset_result[0])

            for dataset_id in affected_datasets:
                new_positive_count = update_analysis_dataset_positive_labels(cursor, dataset_id)
                if new_positive_count is not None:
                    logger.info(f"Updated AnalysisDataset {dataset_id} positiveLabels to {new_positive_count}")
"""

# 3. 在 batch_review_events 函數中添加類似的邏輯

print("""
🎯 後端修改指南

請在 backend/routes/case_study_v2.py 中添加以下修改：

1. 添加 update_analysis_dataset_positive_labels 函數到文件開頭
2. 在所有標註函數中調用此函數更新 AnalysisDataset.positiveLabels
3. 確保在事務提交前進行更新

具體位置：
- review_anomaly_event: ~第1290行
- bulk_review_anomaly_events: ~第1340行
- batch_review_events: ~第1890行

這樣標註完成後，AnalysisDataset.positiveLabels 會自動保持最新狀態。
""")
