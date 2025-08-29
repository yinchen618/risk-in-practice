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

# 異常檢測條件
DETECTION_CONFIG = {
    'z_score_threshold': 3.5,      # Z-Score 閾值
    'spike_threshold': 4.0,        # 400% = 4.0 倍
    'min_duration_minutes': 90,    # 最小持續時間
    'max_time_gap_minutes': 120    # 最大時間間隔
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

def calculate_z_score_anomalies(df, threshold=3.5):
    """
    計算 Z-Score 異常

    Args:
        df: DataFrame with wattage_total column
        threshold: Z-Score 閾值

    Returns:
        Boolean Series indicating anomalies
    """
    if len(df) < 3:
        return pd.Series([False] * len(df), index=df.index)

    # 計算 Z-Score
    mean_power = df['wattage_total'].mean()
    std_power = df['wattage_total'].std()

    if std_power == 0:
        return pd.Series([False] * len(df), index=df.index)

    z_scores = np.abs((df['wattage_total'] - mean_power) / std_power)
    return z_scores > threshold

def calculate_spike_anomalies(df, threshold=4.0):
    """
    計算突增異常（相對於前一個值的倍數）

    Args:
        df: DataFrame with wattage_total column
        threshold: 倍數閾值 (4.0 = 400%)

    Returns:
        Boolean Series indicating spike anomalies
    """
    if len(df) < 2:
        return pd.Series([False] * len(df), index=df.index)

    # 計算相對於前一個值的比率
    prev_values = df['wattage_total'].shift(1)

    # 避免除以零
    valid_prev = prev_values > 0

    # 計算比率
    ratios = pd.Series([False] * len(df), index=df.index, dtype=bool)
    ratios[valid_prev] = (df['wattage_total'][valid_prev] / prev_values[valid_prev]) >= threshold

    return ratios

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
    為單個數據集檢測異常

    Args:
        df: DataFrame with analysis ready data
        config: Detection configuration

    Returns:
        Boolean Series indicating final anomalies
    """
    logger.info(f"開始檢測異常，共 {len(df)} 條記錄")

    # 按時間排序
    df = df.sort_values('timestamp').copy()

    # 1. Z-Score 異常檢測
    z_score_anomalies = calculate_z_score_anomalies(df, config['z_score_threshold'])
    logger.info(f"Z-Score 異常檢測: {z_score_anomalies.sum()} 個異常點")

    # 2. 突增異常檢測
    spike_anomalies = calculate_spike_anomalies(df, config['spike_threshold'])
    logger.info(f"突增異常檢測: {spike_anomalies.sum()} 個異常點")

    # 3. 合併異常（OR 邏輯）
    combined_anomalies = z_score_anomalies | spike_anomalies
    logger.info(f"合併異常: {combined_anomalies.sum()} 個異常點")

    # 4. 應用持續時間和間隔條件
    final_anomalies = group_consecutive_anomalies(
        combined_anomalies,
        df['timestamp'],
        config['min_duration_minutes'],
        config['max_time_gap_minutes']
    )
    logger.info(f"最終異常: {final_anomalies.sum()} 個異常點")

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
