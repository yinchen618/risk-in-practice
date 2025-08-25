#!/usr/bin/env python3
"""
詳細測試候選生成邏輯
"""

import sqlite3
import json

def analyze_candidate_calculation():
    """分析候選數量計算邏輯"""

    print("🔍 分析候選計算邏輯...")
    print("=" * 60)

    # 連接到資料庫
    db_path = '/home/infowin/Git-projects/pu-in-practice/backend/database/prisma/pu_practice.db'
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # 測試參數
    buildings = ["Building-A"]
    floors = ["2F", "3F"]
    occupant_types = ["STUDENT"]
    z_score_threshold = 2.5
    spike_threshold = 200

    # 構建查詢條件
    where_conditions = ["1=1"]
    params = []

    if buildings:
        placeholders = ','.join(['?' for _ in buildings])
        where_conditions.append(f"building IN ({placeholders})")
        params.extend(buildings)

    if floors:
        placeholders = ','.join(['?' for _ in floors])
        where_conditions.append(f"floor IN ({placeholders})")
        params.extend(floors)

    if occupant_types:
        placeholders = ','.join(['?' for _ in occupant_types])
        where_conditions.append(f"occupant_type IN ({placeholders})")
        params.extend(occupant_types)

    # 查詢資料集
    query = f"SELECT id, name, building, floor, room, total_records FROM analysis_datasets WHERE {' AND '.join(where_conditions)}"
    cursor.execute(query, params)
    datasets = cursor.fetchall()

    print(f"📊 找到 {len(datasets)} 個資料集:")

    total_candidates = 0
    base_candidates_per_dataset = 50

    for i, dataset in enumerate(datasets):
        dataset_id, name, building, floor, room, total_records = dataset

        if total_records is None:
            total_records = 1000

        # 計算因子
        threshold_factor = max(0.1, min(2.0, 3.0 / z_score_threshold))
        spike_factor = max(0.5, min(1.5, spike_threshold / 200))

        # 計算候選數量
        dataset_candidates = int(
            (total_records / 1000) * base_candidates_per_dataset *
            threshold_factor * spike_factor
        )

        total_candidates += max(0, dataset_candidates)

        print(f"  {i+1}. {name}")
        print(f"     建築: {building}, 樓層: {floor}, 房間: {room}")
        print(f"     總記錄: {total_records:,}")
        print(f"     閾值因子: {threshold_factor:.3f}")
        print(f"     峰值因子: {spike_factor:.3f}")
        print(f"     候選數量: {dataset_candidates:,}")
        print()

    print(f"🎯 總候選數量: {total_candidates:,}")

    # 多次運行相同的計算來驗證一致性
    print("\n🔄 驗證計算一致性:")
    for run in range(5):
        run_total = 0
        for dataset in datasets:
            total_records = dataset[5] if dataset[5] else 1000
            threshold_factor = max(0.1, min(2.0, 3.0 / z_score_threshold))
            spike_factor = max(0.5, min(1.5, spike_threshold / 200))
            dataset_candidates = int(
                (total_records / 1000) * base_candidates_per_dataset *
                threshold_factor * spike_factor
            )
            run_total += max(0, dataset_candidates)

        print(f"  運行 {run+1}: {run_total:,}")

    conn.close()

if __name__ == "__main__":
    analyze_candidate_calculation()
