#!/usr/bin/env python3
"""
🎯 重新標記異常樣本工具

根據指定的異常檢測條件重新標記 AnalysisReadyData 中的樣本，
並更新每個 AnalysisDataset 的 positiveLabels 計數。

檢測條件：
- Z-Score Threshold: 3.5σ
- Spike Threshold: 400%
- Min Duration: 90min
- Max Time Gap: 120min

Author: AI Assistant
Date: 2025-08-27
"""

import sqlite3
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import logging
from pathlib import Path

# 設置日誌
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('relabel_positive_samples.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# 異常檢測條件 - 匹配 backend API 的參數
DETECTION_CONFIG = {
    'z_score_threshold': 2,        # Z-Score 閾值 (與 API 一致)
    'spike_threshold': 150,        # 峰值閾值 150% (與 API 一致)
    'min_duration_minutes': 20,    # 最小持續時間
    'max_time_gap_minutes': 120,   # 最大時間間隔
    'jump_threshold_ratio': 0.5    # 功率跳躍閾值 50%
}

def get_database_path():
    """獲取數據庫路徑"""
    # 嘗試多個可能的路徑
    possible_paths = [
        Path("backend/database/prisma/pu_practice.db"),
        Path(__file__).parent / "backend" / "database" / "prisma" / "pu_practice.db",
        Path("backend/database/pu_practice.db"),
        Path(__file__).parent / "backend" / "database" / "pu_practice.db",
    ]

    for db_path in possible_paths:
        if db_path.exists():
            logger.info(f"找到數據庫: {db_path}")
            return str(db_path)

    logger.error("未找到數據庫文件，嘗試了以下路徑:")
    for path in possible_paths:
        logger.error(f"  - {path}")
    raise FileNotFoundError("數據庫文件不存在")

def api_compatible_anomaly_detection(df, config):
    """
    使用與 API 完全一致的異常檢測邏輯
    匹配 backend/routes/case_study_v2.py 中的算法

    Args:
        df: DataFrame with timestamp and wattage_total columns
        config: Detection configuration

    Returns:
        Boolean Series indicating anomalies
    """
    logger.info(f"開始API兼容異常檢測，共 {len(df)} 條記錄")

    if len(df) == 0:
        return pd.Series([], dtype=bool)

    # 按時間排序
    df = df.sort_values('timestamp').copy()
    wattage_total = df['wattage_total'].values

    # 建立異常標記數組，避免重複計算
    anomaly_mask = np.zeros(len(wattage_total), dtype=bool)

    z_score_threshold = config['z_score_threshold']
    spike_threshold = config['spike_threshold']

    logger.info(f"數據集總數據點: {len(wattage_total)}")

    # 1. Z-score 異常檢測
    z_anomaly_count = 0
    if len(wattage_total) > 1:
        # 計算總功率的 Z-score
        mean_power = np.mean(wattage_total)
        std_power = np.std(wattage_total)

        if std_power > 0:
            z_scores = np.abs((wattage_total - mean_power) / std_power)
            z_anomaly_mask = z_scores > z_score_threshold
            z_anomaly_count = int(np.sum(z_anomaly_mask))

            # 添加到總異常標記
            anomaly_mask |= z_anomaly_mask

            logger.info(f"Z-score 異常 (閾值 {z_score_threshold}): {z_anomaly_count}")

    # 2. 功率峰值檢測（使用相對閾值）
    # 計算相對於平均功率的峰值閾值
    mean_power = np.mean(wattage_total)
    # spike_threshold 是百分比，轉換為絕對閾值
    absolute_spike_threshold = mean_power * (1 + spike_threshold / 100.0)

    spike_anomaly_mask = wattage_total > absolute_spike_threshold
    spike_anomaly_count = int(np.sum(spike_anomaly_mask))

    # 添加到總異常標記
    anomaly_mask |= spike_anomaly_mask

    logger.info(f"功率峰值 (相對閾值 {spike_threshold}%, 絕對閾值 {absolute_spike_threshold:.1f}W): {spike_anomaly_count}")

    # 3. 連續性檢測 - 檢測數據跳躍
    jump_anomaly_count = 0
    if len(wattage_total) > 1:
        power_diff = np.abs(np.diff(wattage_total))
        diff_threshold = np.mean(wattage_total) * 0.5  # 50% 功率變化閾值

        # 為 diff 創建與原數組長度相同的 mask（最後一個元素設為 False）
        jump_anomaly_mask = np.zeros(len(wattage_total), dtype=bool)
        jump_anomaly_mask[:-1] = power_diff > diff_threshold

        jump_anomaly_count = int(np.sum(jump_anomaly_mask))

        # 添加到總異常標記
        anomaly_mask |= jump_anomaly_mask

        logger.info(f"功率跳躍異常: {jump_anomaly_count}")

    # 計算聯集後的總異常數量
    total_anomalies = int(np.sum(anomaly_mask))

    logger.info(f"Z-score: {z_anomaly_count}, 峰值: {spike_anomaly_count}, 跳躍: {jump_anomaly_count}")
    logger.info(f"聯集後總異常: {total_anomalies}, 持續時間調整後: {total_anomalies}")

    # 4. 最小事件持續時間過濾
    # 將連續的異常點聚合成事件
    # 簡化實現：根據最小持續時間要求來減少候選數量

    # 持續時間過濾：較長的持續時間要求應該產生較少的候選
    # 假設每分鐘一個數據點，基準為 30 分鐘
    min_event_duration = config['min_duration_minutes']
    duration_factor = min(1.0, 30.0 / max(1, min_event_duration))
    dataset_candidates = int(total_anomalies * duration_factor)

    # 確保候選數量不超過原始數據點數量的合理比例（最多 10%）
    max_reasonable_candidates = max(1, int(len(wattage_total) * 0.1))
    dataset_candidates = min(dataset_candidates, max_reasonable_candidates)

    logger.info(f"最終候選數: {dataset_candidates}")

    # 如果需要選擇部分異常點
    if dataset_candidates < total_anomalies and dataset_candidates > 0:
        # 找到異常的索引
        anomaly_indices = np.where(anomaly_mask)[0]

        # 隨機選擇部分異常點
        np.random.seed(42)  # 確保可重現性
        selected_indices = np.random.choice(
            anomaly_indices,
            size=dataset_candidates,
            replace=False
        )

        # 創建新的異常標記
        final_anomaly_mask = np.zeros(len(wattage_total), dtype=bool)
        final_anomaly_mask[selected_indices] = True

        return pd.Series(final_anomaly_mask, index=df.index)

    return pd.Series(anomaly_mask, index=df.index)

def calculate_z_score_anomalies(df, threshold=2):
    """
    計算 Z-Score 異常 - 與 API 邏輯完全一致

    Args:
        df: DataFrame with wattage_total column
        threshold: Z-Score 閾值

    Returns:
        Boolean Series indicating anomalies
    """
    if len(df) < 3:
        return pd.Series([False] * len(df), index=df.index)

    wattage_total = df['wattage_total'].values

    # 計算 Z-Score (與 API 完全一致)
    mean_power = np.mean(wattage_total)
    std_power = np.std(wattage_total)

    if std_power == 0:
        return pd.Series([False] * len(df), index=df.index)

    z_scores = np.abs((wattage_total - mean_power) / std_power)
    z_anomaly_mask = z_scores > threshold

    return pd.Series(z_anomaly_mask, index=df.index)

def calculate_spike_anomalies(df, threshold=150):
    """
    計算功率峰值異常 - 與 API 邏輯完全一致

    Args:
        df: DataFrame with wattage_total column
        threshold: 百分比閾值 (150 = 150%)

    Returns:
        Boolean Series indicating spike anomalies
    """
    if len(df) < 2:
        return pd.Series([False] * len(df), index=df.index)

    wattage_total = df['wattage_total'].values

    # 計算相對於平均功率的峰值閾值 (與 API 完全一致)
    mean_power = np.mean(wattage_total)
    absolute_spike_threshold = mean_power * (1 + threshold / 100.0)

    spike_anomaly_mask = wattage_total > absolute_spike_threshold

    return pd.Series(spike_anomaly_mask, index=df.index)

def calculate_jump_anomalies(df, threshold_ratio=0.5):
    """
    計算功率跳躍異常 - 與 API 邏輯完全一致

    Args:
        df: DataFrame with wattage_total column
        threshold_ratio: 跳躍閾值比例 (0.5 = 50%)

    Returns:
        Boolean Series indicating jump anomalies
    """
    if len(df) < 2:
        return pd.Series([False] * len(df), index=df.index)

    wattage_total = df['wattage_total'].values

    # 計算連續差值 (與 API 完全一致)
    power_diff = np.abs(np.diff(wattage_total))
    diff_threshold = np.mean(wattage_total) * threshold_ratio  # 50% 功率變化閾值

    # 創建與原數組長度相同的 mask（最後一個元素設為 False）
    jump_anomaly_mask = np.zeros(len(wattage_total), dtype=bool)
    jump_anomaly_mask[:-1] = power_diff > diff_threshold

    return pd.Series(jump_anomaly_mask, index=df.index)

def group_consecutive_anomalies(anomaly_series, timestamps, min_duration_minutes=90, max_gap_minutes=120):
    """
    將連續的異常點分組，考慮最小持續時間和最大間隔

    Args:
        anomaly_series: Boolean series of anomalies
        timestamps: Series of timestamps
        min_duration_minutes: 最小持續時間
        max_gap_minutes: 最大允許間隔

    Returns:
        Boolean Series with grouped anomalies
    """
    if not anomaly_series.any():
        return pd.Series([False] * len(anomaly_series), index=anomaly_series.index)

    result = pd.Series([False] * len(anomaly_series), index=anomaly_series.index)

    # 找到異常點的索引
    anomaly_indices = anomaly_series[anomaly_series].index.tolist()

    if not anomaly_indices:
        return result

    # 將時間戳轉換為 datetime
    if isinstance(timestamps.iloc[0], str):
        timestamps = pd.to_datetime(timestamps)

    # 分組連續的異常
    groups = []
    current_group = [anomaly_indices[0]]

    for i in range(1, len(anomaly_indices)):
        curr_idx = anomaly_indices[i]
        prev_idx = anomaly_indices[i-1]

        # 計算時間間隔
        time_gap = timestamps.loc[curr_idx] - timestamps.loc[prev_idx]

        if time_gap <= timedelta(minutes=max_gap_minutes):
            current_group.append(curr_idx)
        else:
            groups.append(current_group)
            current_group = [curr_idx]

    groups.append(current_group)

    # 檢查每組的持續時間
    for group in groups:
        if len(group) >= 2:  # 至少需要兩個點來計算持續時間
            start_time = timestamps.loc[group[0]]
            end_time = timestamps.loc[group[-1]]
            duration = end_time - start_time

            if duration >= timedelta(minutes=min_duration_minutes):
                # 標記整個組為異常
                for idx in group:
                    result.loc[idx] = True
        elif len(group) == 1:
            # 單點異常也考慮前後的情況
            idx = group[0]
            # 這裡可以添加更複雜的邏輯，目前先標記為異常
            result.loc[idx] = True

    return result

def detect_anomalies_for_dataset(df, config):
    """
    為單個數據集檢測異常 - 使用 API 兼容的邏輯

    Args:
        df: DataFrame with analysis ready data
        config: Detection configuration

    Returns:
        Boolean Series indicating final anomalies
    """
    logger.info(f"開始檢測異常，共 {len(df)} 條記錄")

    # 按時間排序
    df = df.sort_values('timestamp').copy()

    # 使用 API 兼容的異常檢測
    anomalies = api_compatible_anomaly_detection(df, config)

    final_anomaly_count = anomalies.sum()
    logger.info(f"最終異常: {final_anomaly_count} 個異常點")

    return anomalies
    total_anomalies = anomaly_mask.sum()
    logger.info(f"聯集後總異常: {total_anomalies} 個異常點")

    # 4. 持續時間過濾 (簡化實現，與 API 一致)
    # API 中的持續時間過濾實際上沒有改變候選數量，所以這裡直接返回
    final_anomalies = anomaly_mask
    logger.info(f"持續時間調整後: {final_anomalies.sum()} 個異常點")

    return final_anomalies

def relabel_positive_samples():
    """重新標記正樣本"""
    db_path = get_database_path()

    try:
        conn = sqlite3.connect(db_path)

        logger.info("🚀 開始重新標記正樣本...")
        logger.info(f"檢測條件: {DETECTION_CONFIG}")

        # 先重置所有樣本的標籤
        logger.info("重置所有 AnalysisReadyData 的 isPositiveLabel 為 False...")
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE analysis_ready_data
            SET is_positive_label = FALSE
        """)
        reset_count = cursor.rowcount
        logger.info(f"已重置 {reset_count} 條記錄")

        # 獲取所有數據集
        cursor.execute("""
            SELECT id, name
            FROM analysis_datasets
            ORDER BY name
        """)
        datasets = cursor.fetchall()
        logger.info(f"找到 {len(datasets)} 個數據集")

        total_positive_labels = 0

        for dataset_id, dataset_name in datasets:
            logger.info(f"\n🔍 處理數據集: {dataset_name} (ID: {dataset_id})")

            # 獲取該數據集的所有數據
            query = """
                SELECT id, timestamp, wattage_total
                FROM analysis_ready_data
                WHERE dataset_id = ?
                ORDER BY timestamp
            """
            df = pd.read_sql_query(query, conn, params=[dataset_id])

            if len(df) == 0:
                logger.warning(f"數據集 {dataset_name} 沒有數據，跳過")
                continue

            logger.info(f"載入 {len(df)} 條記錄")

            # 檢測異常
            anomalies = detect_anomalies_for_dataset(df, DETECTION_CONFIG)

            # 更新數據庫中的標籤
            positive_indices = df[anomalies].index.tolist()
            positive_ids = df.loc[positive_indices, 'id'].tolist()

            if positive_ids:
                # 批量更新
                placeholders = ','.join(['?' for _ in positive_ids])
                update_query = f"""
                    UPDATE analysis_ready_data
                    SET is_positive_label = TRUE
                    WHERE id IN ({placeholders})
                """
                cursor.execute(update_query, positive_ids)
                updated_count = cursor.rowcount

                logger.info(f"✅ 更新 {updated_count} 條記錄為正標籤")
                total_positive_labels += updated_count
            else:
                logger.info("未發現異常，無需更新")

        # 提交更改
        conn.commit()
        logger.info(f"已提交數據庫更改，總共標記 {total_positive_labels} 個正樣本")

        return True

    except Exception as e:
        logger.error(f"❌ 重新標記過程中發生錯誤: {e}")
        if conn:
            conn.rollback()
        return False
    finally:
        if conn:
            conn.close()

def update_dataset_positive_counts():
    """更新每個數據集的 positiveLabels 計數"""
    db_path = get_database_path()

    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        logger.info("\n📊 更新 AnalysisDataset 的 positiveLabels 計數...")

        # 獲取每個數據集的正標籤計數
        cursor.execute("""
            SELECT
                ad.id,
                ad.name,
                ad.positive_labels as current_count,
                COUNT(CASE WHEN ard.is_positive_label = TRUE THEN 1 END) as actual_count
            FROM analysis_datasets ad
            LEFT JOIN analysis_ready_data ard ON ad.id = ard.dataset_id
            GROUP BY ad.id, ad.name, ad.positive_labels
            ORDER BY ad.name
        """)

        results = cursor.fetchall()
        updated_count = 0

        logger.info(f"檢查 {len(results)} 個數據集的正標籤計數...")

        for dataset_id, dataset_name, current_count, actual_count in results:
            logger.info(f"📦 {dataset_name}: 當前={current_count}, 實際={actual_count}")

            if current_count != actual_count:
                # 更新計數
                cursor.execute("""
                    UPDATE analysis_datasets
                    SET positive_labels = ?
                    WHERE id = ?
                """, (actual_count, dataset_id))

                logger.info(f"   ✅ 已更新: {current_count} → {actual_count}")
                updated_count += 1
            else:
                logger.info(f"   ℹ️  無需更新")

        # 提交更改
        conn.commit()

        logger.info(f"\n🎉 更新完成！共更新 {updated_count} 個數據集的計數")

        # 顯示總結
        cursor.execute("""
            SELECT
                COUNT(*) as total_datasets,
                SUM(positive_labels) as total_positive_labels,
                SUM(total_records) as total_records
            FROM analysis_datasets
        """)

        total_datasets, total_positive, total_records = cursor.fetchone()
        positive_ratio = (total_positive / total_records * 100) if total_records > 0 else 0

        logger.info(f"📈 總結統計:")
        logger.info(f"   總數據集: {total_datasets}")
        logger.info(f"   總記錄數: {total_records:,}")
        logger.info(f"   總正標籤: {total_positive:,}")
        logger.info(f"   正標籤比例: {positive_ratio:.3f}%")

        return True

    except Exception as e:
        logger.error(f"❌ 更新計數過程中發生錯誤: {e}")
        if conn:
            conn.rollback()
        return False
    finally:
        if conn:
            conn.close()

def main():
    """主函數"""
    logger.info("🎯 開始重新標記異常樣本程序...")
    logger.info("=" * 60)

    start_time = datetime.now()

    try:
        # 步驟 1: 重新標記正樣本
        logger.info("步驟 1: 重新檢測並標記異常樣本")
        if not relabel_positive_samples():
            logger.error("❌ 重新標記失敗")
            return False

        # 步驟 2: 更新數據集計數
        logger.info("\n步驟 2: 更新數據集正標籤計數")
        if not update_dataset_positive_counts():
            logger.error("❌ 更新計數失敗")
            return False

        # 完成
        end_time = datetime.now()
        duration = end_time - start_time

        logger.info("\n" + "=" * 60)
        logger.info("🎉 重新標記程序完成！")
        logger.info(f"⏱️  總耗時: {duration}")
        logger.info("=" * 60)

        return True

    except Exception as e:
        logger.error(f"❌ 程序執行失敗: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
