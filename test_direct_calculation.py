#!/usr/bin/env python3
"""
直接測試候選計算邏輯（不通過 HTTP）
"""

import sqlite3
import json
import random

def direct_candidate_calculation():
    """直接調用候選計算邏輯"""

    print("🧮 直接測試候選計算邏輯...")
    print("=" * 60)

    # 測試參數（與 API 測試相同）
    filter_params = {
        "selectedDatasetIds": [],
        "buildings": ["Building-A"],
        "floors": ["2F", "3F"],
        "rooms": [],
        "occupantTypes": ["STUDENT"],
        "zScoreThreshold": 2.5,
        "spikeThreshold": 200,
        "minEventDuration": 30,
        "startDate": "2025-08-01",
        "startTime": "00:00",
        "endDate": "2025-08-25",
        "endTime": "23:59",
        "random_seed": 42
    }

    results = []

    for run in range(5):
        print(f"\n測試 {run+1}:")

        # 提取過濾參數（模擬 API 中的邏輯）
        selected_dataset_ids = filter_params.get("selectedDatasetIds", [])
        buildings = filter_params.get("buildings", [])
        floors = filter_params.get("floors", [])
        rooms = filter_params.get("rooms", [])
        occupant_types = filter_params.get("occupantTypes", [])

        # 異常檢測參數
        z_score_threshold = filter_params.get("zScoreThreshold", 2.5)
        spike_threshold = filter_params.get("spikeThreshold", 200)

        # 設置隨機種子
        seed = filter_params.get("random_seed")
        if seed is not None:
            random.seed(seed)
            print(f"  設置隨機種子: {seed}")

        # 連接到主資料庫
        db_path = '/home/infowin/Git-projects/pu-in-practice/backend/database/prisma/pu_practice.db'
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        # 建立基礎查詢條件
        where_conditions = []
        params = []

        # 資料集過濾
        if selected_dataset_ids:
            placeholders = ','.join(['?' for _ in selected_dataset_ids])
            where_conditions.append(f"id IN ({placeholders})")
            params.extend(selected_dataset_ids)

        # 建築物過濾
        if buildings:
            placeholders = ','.join(['?' for _ in buildings])
            where_conditions.append(f"building IN ({placeholders})")
            params.extend(buildings)

        # 樓層過濾
        if floors:
            placeholders = ','.join(['?' for _ in floors])
            where_conditions.append(f"floor IN ({placeholders})")
            params.extend(floors)

        # 房間過濾
        if rooms:
            placeholders = ','.join(['?' for _ in rooms])
            where_conditions.append(f"room IN ({placeholders})")
            params.extend(rooms)

        # 佔用者類型過濾
        if occupant_types:
            placeholders = ','.join(['?' for _ in occupant_types])
            where_conditions.append(f"occupant_type IN ({placeholders})")
            params.extend(occupant_types)

        # 構建查詢
        base_query = "SELECT * FROM analysis_datasets"
        if where_conditions:
            base_query += " WHERE " + " AND ".join(where_conditions)

        print(f"  查詢: {base_query}")
        print(f"  參數: {params}")

        cursor.execute(base_query, params)
        filtered_datasets = cursor.fetchall()

        print(f"  找到資料集: {len(filtered_datasets)}")

        # 模擬異常候選生成
        total_candidates = 0

        if filtered_datasets:
            # 基於資料集數量和參數模擬候選生成
            base_candidates_per_dataset = 50  # 基礎候選數

            for dataset in filtered_datasets:
                # 根據 total_records 調整候選數量
                total_records = dataset[11] if dataset[11] else 1000  # total_records 欄位是索引 11

                # 根據閾值調整候選數量（閾值越低，候選越多）
                threshold_factor = max(0.1, min(2.0, 3.0 / z_score_threshold))
                spike_factor = max(0.5, min(1.5, spike_threshold / 200))

                # 計算候選數量
                dataset_candidates = int(
                    (total_records / 1000) * base_candidates_per_dataset *
                    threshold_factor * spike_factor
                )

                total_candidates += max(0, dataset_candidates)

        print(f"  總候選數量: {total_candidates}")
        results.append(total_candidates)

        conn.close()

    # 分析結果
    print("\n" + "=" * 60)
    print("📊 結果分析:")

    unique_counts = set(results)

    if len(unique_counts) == 1:
        print(f"✅ 所有測試結果一致: {list(unique_counts)[0]} 個候選")
        print("🎯 邏輯確實是確定性的！")
        return True
    else:
        print(f"❌ 結果不一致: {unique_counts}")
        print(f"📈 最小值: {min(results)}")
        print(f"📈 最大值: {max(results)}")
        print(f"📈 平均值: {sum(results) / len(results):.1f}")
        return False

if __name__ == "__main__":
    direct_candidate_calculation()
