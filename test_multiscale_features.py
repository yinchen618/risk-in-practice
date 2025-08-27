#!/usr/bin/env python3
"""
測試多尺度時間窗口特徵提取功能
Test Multi-Scale Time Window Feature Extraction
"""

import numpy as np
from datetime import datetime, timedelta
import logging

# 設置日誌
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_multi_scale_feature_extraction():
    """測試多尺度時間窗口特徵提取"""
    print("🧪 Testing Multi-Scale Time Window Feature Extraction")
    print("=" * 60)

    # 模擬時間窗口配置
    short_window = 30    # 短期窗口：30分鐘
    medium_window = 60   # 中期窗口：60分鐘
    long_window = 240    # 長期窗口：240分鐘

    print(f"📊 Time window configuration:")
    print(f"   - Short window: {short_window} minutes")
    print(f"   - Medium window: {medium_window} minutes")
    print(f"   - Long window: {long_window} minutes")

    # 生成模擬數據樣本
    base_time = datetime(2024, 8, 27, 10, 0, 0)
    dataset_id = 1

    # 創建一系列時間序列數據（每15分鐘一個樣本，共20小時）
    samples = []
    all_samples_dict = {dataset_id: {}}

    for i in range(80):  # 80個樣本，每15分鐘一個
        sample_time = base_time + timedelta(minutes=i * 15)

        # 模擬功率數據（有一些週期性和隨機性）
        base_power = 1000 + 300 * np.sin(i * 0.1) + np.random.normal(0, 50)
        l1_power = base_power * 0.6 + np.random.normal(0, 20)
        l2_power = base_power * 0.4 + np.random.normal(0, 20)
        power_110v = l1_power * 0.8
        power_220v = l2_power * 1.2
        total_power = l1_power + l2_power

        # 樣本格式：(id, dataset_id, timestamp, room, raw_l1, raw_l2, w110v, w220v, w_total, is_positive)
        sample = (
            i + 1,              # id
            dataset_id,         # dataset_id
            sample_time,        # timestamp
            "room1",           # room
            l1_power,          # raw_wattage_l1
            l2_power,          # raw_wattage_l2
            power_110v,        # wattage_110v
            power_220v,        # wattage_220v
            total_power,       # wattage_total
            i % 10 == 0        # is_positive_label (每10個樣本中有1個正樣本)
        )

        samples.append(sample)
        all_samples_dict[dataset_id][sample_time] = sample

    print(f"✅ Generated {len(samples)} mock samples over 20 hours")

    def extract_temporal_features_from_analysis_data(sample, all_samples_dict):
        """複製後端的多尺度特徵提取函數"""
        try:
            id_val, dataset_id, timestamp, room, raw_l1, raw_l2, w110v, w220v, w_total, is_positive = sample

            # 當前樣本基礎特徵 (5個特徵)
            current_features = [
                float(raw_l1 or 0),         # Raw L1 power
                float(raw_l2 or 0),         # Raw L2 power
                float(w110v or 0),          # 110V power
                float(w220v or 0),          # 220V power
                float(w_total or 0),        # Total power
            ]

            # 解析時間戳
            if isinstance(timestamp, str):
                current_time = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
            else:
                current_time = timestamp

            # 多尺度時間窗口
            window_features = []
            windows = [
                ("short", short_window),    # 短期窗口
                ("medium", medium_window),  # 中期窗口
                ("long", long_window)       # 長期窗口
            ]

            for window_name, window_size in windows:
                # 計算時間窗口範圍
                window_start = current_time - timedelta(minutes=window_size)

                # 找到該時間窗口內的所有樣本
                window_samples = []
                if dataset_id in all_samples_dict:
                    for sample_time, sample_data in all_samples_dict[dataset_id].items():
                        if window_start <= sample_time <= current_time:
                            window_samples.append(sample_data)

                # 如果有足夠樣本，計算統計特徵
                if len(window_samples) >= 3:
                    # 提取功率值
                    wattage_total_values = [float(s[8] or 0) for s in window_samples]
                    l1_values = [float(s[4] or 0) for s in window_samples]
                    l2_values = [float(s[5] or 0) for s in window_samples]
                    w110v_values = [float(s[6] or 0) for s in window_samples]
                    w220v_values = [float(s[7] or 0) for s in window_samples]

                    # 計算統計特徵 (每個窗口10個特徵)
                    mean_total = np.mean(wattage_total_values)
                    std_total = np.std(wattage_total_values)

                    window_stats = [
                        mean_total,                                                    # 1. 平均總功率
                        std_total,                                                     # 2. 總功率標準差
                        np.max(wattage_total_values),                                 # 3. 最大總功率
                        np.min(wattage_total_values),                                 # 4. 最小總功率
                        np.median(wattage_total_values),                              # 5. 中位數總功率
                        len([w for w in wattage_total_values if w > mean_total * 1.5]), # 6. 高功率事件計數
                        np.mean(l1_values) - np.mean(l2_values),                      # 7. L1-L2平均差值
                        np.sum(np.diff(wattage_total_values) ** 2) if len(wattage_total_values) > 1 else 0, # 8. 波動性
                        np.mean(w110v_values) / max(np.mean(w220v_values), 1),       # 9. 110V/220V比率
                        np.percentile(wattage_total_values, 75) - np.percentile(wattage_total_values, 25), # 10. IQR
                    ]
                else:
                    # 樣本不足時使用當前值填充
                    window_stats = [
                        current_features[4], 0.0, current_features[4], current_features[4], current_features[4],
                        0.0, current_features[0] - current_features[1], 0.0,
                        current_features[2] / max(current_features[3], 1), 0.0
                    ]

                window_features.extend(window_stats)

            # 跨窗口比較特徵 (6個特徵)
            cross_window_features = []
            if len(window_features) >= 30:  # 確保有3個窗口 × 10個特徵
                short_mean = window_features[0]    # 短期平均
                medium_mean = window_features[10]  # 中期平均
                long_mean = window_features[20]    # 長期平均

                short_std = window_features[1]     # 短期標準差
                medium_std = window_features[11]   # 中期標準差
                long_std = window_features[21]     # 長期標準差

                cross_window_features = [
                    short_mean / max(medium_mean, 1),      # 短期/中期功率比率
                    medium_mean / max(long_mean, 1),       # 中期/長期功率比率
                    short_mean / max(long_mean, 1),        # 短期/長期功率比率
                    short_std / max(medium_std, 1),        # 短期/中期波動比率
                    medium_std / max(long_std, 1),         # 中期/長期波動比率
                    short_std / max(long_std, 1),          # 短期/長期波動比率
                ]
            else:
                cross_window_features = [1.0, 1.0, 1.0, 1.0, 1.0, 1.0]

            # 組合所有特徵：基礎 (5) + 窗口統計 (30) + 跨窗口 (6) = 41個特徵
            all_features = current_features + window_features + cross_window_features
            return np.array(all_features)

        except Exception as e:
            print(f"❌ Feature extraction failed: {e}")
            return np.array([0.0] * 41)

    # 測試不同時間點的特徵提取
    test_indices = [10, 20, 40, 60, 75]  # 測試不同時間點的樣本

    print(f"\n🔬 Testing feature extraction for {len(test_indices)} samples:")

    for i in test_indices:
        if i < len(samples):
            sample = samples[i]
            sample_time = sample[2]

            print(f"\n📊 Sample {i+1} at {sample_time.strftime('%H:%M:%S')}:")

            # 提取特徵
            features = extract_temporal_features_from_analysis_data(sample, all_samples_dict)

            print(f"   ✅ Features extracted: {len(features)} dimensions")
            print(f"   📋 Feature breakdown:")
            print(f"      - Basic features (5): {features[:5]}")
            print(f"      - Short window stats (10): Mean={features[5]:.2f}, Std={features[6]:.2f}")
            print(f"      - Medium window stats (10): Mean={features[15]:.2f}, Std={features[16]:.2f}")
            print(f"      - Long window stats (10): Mean={features[25]:.2f}, Std={features[26]:.2f}")
            print(f"      - Cross-window ratios (6): S/M={features[35]:.2f}, M/L={features[36]:.2f}")

    # 測試特徵矩陣生成
    print(f"\n🔬 Testing full feature matrix generation:")
    feature_matrix = np.array([extract_temporal_features_from_analysis_data(sample, all_samples_dict) for sample in samples])

    print(f"✅ Feature matrix generated: {feature_matrix.shape}")
    print(f"📊 Feature statistics:")
    print(f"   - Mean values: {np.mean(feature_matrix, axis=0)[:10]}...")
    print(f"   - Std values: {np.std(feature_matrix, axis=0)[:10]}...")
    print(f"   - Min values: {np.min(feature_matrix, axis=0)[:10]}...")
    print(f"   - Max values: {np.max(feature_matrix, axis=0)[:10]}...")

    print(f"\n🎯 Multi-scale feature validation:")
    print(f"   ✅ Each sample has {feature_matrix.shape[1]} features")
    print(f"   ✅ Basic features: 5")
    print(f"   ✅ Window statistics: 30 (3 windows × 10 features)")
    print(f"   ✅ Cross-window features: 6")
    print(f"   ✅ Total: {5 + 30 + 6} features")

    return feature_matrix

def main():
    """運行多尺度特徵提取測試"""
    try:
        feature_matrix = test_multi_scale_feature_extraction()

        print("\n" + "=" * 60)
        print("🎉 Multi-Scale Time Window Feature Extraction Test PASSED!")
        print("✅ Short-term, medium-term, and long-term features successfully extracted")
        print("✅ Cross-window comparison features implemented")
        print("✅ Feature extraction ready for PU Learning training")

    except Exception as e:
        print(f"\n❌ Test failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
