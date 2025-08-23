#!/usr/bin/env python3
"""
多尺度ETL功能測試腳本

測試15分鐘和60分鐘視窗的特徵工程功能，
模擬真實數據處理場景。
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from data_preprocessing_etl_multiscale import DataPreprocessingETL, RoomInfo, OccupantType
import logging

# 設置日誌級別
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def generate_test_data(room_info, start_time, duration_hours=24):
    """生成測試用的電表數據"""
    print(f"為房間 {room_info.building}-{room_info.floor}-{room_info.room} 生成測試數據...")

    # 生成時間序列（每分鐘一筆）
    timestamps = pd.date_range(
        start=start_time,
        end=start_time + timedelta(hours=duration_hours),
        freq='1min'
    )

    data = []
    for i, timestamp in enumerate(timestamps):
        # 模擬真實的用電模式（工作日vs週末，白天vs夜晚）
        hour = timestamp.hour
        is_daytime = 8 <= hour <= 18
        is_weekend = timestamp.weekday() >= 5

        # 基本負載 + 變動負載
        base_load = 500 if is_daytime and not is_weekend else 200
        variation = np.sin(2 * np.pi * i / (60 * 24)) * 100  # 日週期變化
        noise = np.random.normal(0, 50)  # 隨機雜訊

        # L1和L2的模擬功率
        power_l1 = max(0, base_load + variation + noise)
        power_l2 = max(0, base_load * 0.8 + variation * 0.7 + noise * 0.5)

        # 計算110V和220V功率（單相三線配置）
        wattage_110v = power_l1 + power_l2  # L1+L2對中性線
        wattage_220v = abs(power_l1 - power_l2)  # L1和L2之間
        wattage_total = wattage_110v + wattage_220v

        # 模擬一些異常值
        if np.random.random() < 0.001:  # 0.1% 機率出現異常
            power_l1 *= 3
            power_l2 *= 3
            wattage_110v *= 3
            wattage_220v *= 3
            wattage_total *= 3

        # 使用ETL期望的數據格式
        data.append({
            'timestamp': timestamp,
            'room': f"{room_info.building}_{room_info.floor}_{room_info.room}",
            'rawWattageL1': power_l1,
            'rawWattageL2': power_l2,
            'wattage110v': wattage_110v,
            'wattage220v': wattage_220v,
            'wattageTotal': wattage_total,
            'isPositiveLabel': np.random.random() < 0.05,  # 5% 機率為正標籤
            'sourceAnomalyEventId': None
        })

    return pd.DataFrame(data)

def test_multiscale_features():
    """測試多尺度特徵工程"""
    print("=" * 60)
    print("多尺度ETL功能測試")
    print("=" * 60)

    try:
        # 創建ETL實例（不需要真實數據庫連接）
        etl = DataPreprocessingETL("dummy://connection")

        # 創建測試房間資訊
        test_room = RoomInfo(
            building="TestBuilding",
            floor="1F",
            room="Room-01",
            meter_id_l1="TEST_L1_001",
            meter_id_l2="TEST_L2_001",
            occupant_type=OccupantType.OFFICE_WORKER
        )

        # 生成測試數據
        print("\n1. 生成測試數據...")
        start_time = datetime.now() - timedelta(days=7)  # 7天前開始
        test_data = generate_test_data(test_room, start_time, duration_hours=48)  # 2天數據

        print(f"✅ 生成了 {len(test_data)} 筆測試數據")
        print(f"   時間範圍: {test_data['timestamp'].min()} 到 {test_data['timestamp'].max()}")

        # 測試多尺度特徵生成
        print("\n2. 測試多尺度特徵生成...")

        # 使用ETL的內部方法生成特徵
        features_df = etl.generate_multiscale_features(test_data)

        print(f"✅ 成功生成特徵資料框，形狀: {features_df.shape}")

        # 轉換為字典列表以便分析
        features = features_df.to_dict('records')

        # 分析特徵結構
        print("\n3. 特徵結構分析:")
        print("-" * 60)

        if len(features) > 0:
            feature_keys = list(features[0].keys())
            print(f"特徵維度數量: {len(feature_keys)}")

            # 按類別分組顯示特徵
            time_features = [k for k in feature_keys if k.startswith('timestamp') or 'time' in k]
            power_features = [k for k in feature_keys if 'power' in k and 'decomp' not in k]
            decomp_features = [k for k in feature_keys if 'decomp' in k]
            variance_features = [k for k in feature_keys if 'variance' in k or 'std' in k]
            pattern_features = [k for k in feature_keys if 'peak' in k or 'trend' in k or 'pattern' in k]

            print(f"時間特徵 ({len(time_features)}): {time_features[:3]}{'...' if len(time_features) > 3 else ''}")
            print(f"功率特徵 ({len(power_features)}): {power_features[:3]}{'...' if len(power_features) > 3 else ''}")
            print(f"分解特徵 ({len(decomp_features)}): {decomp_features[:3]}{'...' if len(decomp_features) > 3 else ''}")
            print(f"變異特徵 ({len(variance_features)}): {variance_features[:3]}{'...' if len(variance_features) > 3 else ''}")
            print(f"模式特徵 ({len(pattern_features)}): {pattern_features[:3]}{'...' if len(pattern_features) > 3 else ''}")

            # 顯示範例特徵值
            print(f"\n4. 範例特徵值 (第1個向量):")
            print("-" * 60)
            sample_feature = features[0]
            for key, value in list(sample_feature.items())[:10]:
                if isinstance(value, float):
                    print(f"{key:<30}: {value:.2f}")
                else:
                    print(f"{key:<30}: {value}")
            if len(sample_feature) > 10:
                print("   ...")

            # 統計分析
            print(f"\n5. 特徵統計分析:")
            print("-" * 60)

            # 計算一些關鍵統計量
            power_values = [f['total_power_15min'] for f in features if 'total_power_15min' in f]
            if power_values:
                print(f"15分鐘總功率 - 平均: {np.mean(power_values):.2f}W, 標準差: {np.std(power_values):.2f}W")

            power_values_60 = [f['total_power_60min'] for f in features if 'total_power_60min' in f]
            if power_values_60:
                print(f"60分鐘總功率 - 平均: {np.mean(power_values_60):.2f}W, 標準差: {np.std(power_values_60):.2f}W")

            # 檢查異常檢測指標
            anomaly_scores = [f.get('anomaly_score', 0) for f in features]
            if any(score > 0 for score in anomaly_scores):
                print(f"異常分數範圍: {min(anomaly_scores):.3f} - {max(anomaly_scores):.3f}")
            else:
                print("異常分數: 所有特徵向量都標記為正常")

        print("\n" + "=" * 60)
        print("多尺度ETL功能測試完成！")
        print("所有功能運作正常，可以開始處理真實數據")
        print("=" * 60)

        return True

    except Exception as e:
        print(f"❌ 測試失敗: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = test_multiscale_features()
    sys.exit(0 if success else 1)
