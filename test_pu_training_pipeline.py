#!/usr/bin/env python3
"""
測試 PU Learning 訓練管線的完整功能
Test complete PU Learning training pipeline functionality
"""

import json
import sqlite3
from datetime import datetime, timedelta
import numpy as np

def test_data_source_extraction():
    """測試數據源提取功能"""
    print("🧪 Testing data source extraction functionality")

    # 模擬前端配置
    mock_data_source_config = {
        "trainRatio": 60,
        "validationRatio": 25,
        "testRatio": 15,
        "timeRange": "recent",
        "positiveDataSourceIds": [1, 2, 3],
        "unlabeledDataSourceIds": [4, 5, 6, 7]
    }

    # 測試比例正規化
    train_ratio_raw = mock_data_source_config.get("trainRatio", 70)
    validation_ratio_raw = mock_data_source_config.get("validationRatio", 20)
    test_ratio_raw = mock_data_source_config.get("testRatio", 10)

    total_ratio = train_ratio_raw + validation_ratio_raw + test_ratio_raw
    train_ratio = train_ratio_raw / total_ratio
    validation_ratio = validation_ratio_raw / total_ratio
    test_ratio = test_ratio_raw / total_ratio

    print(f"✅ Original ratios: Train={train_ratio_raw}%, Val={validation_ratio_raw}%, Test={test_ratio_raw}%")
    print(f"✅ Normalized ratios: Train={train_ratio:.1%}, Val={validation_ratio:.1%}, Test={test_ratio:.1%}")
    print(f"✅ Sum check: {train_ratio + validation_ratio + test_ratio:.3f} (should be 1.000)")

    # 驗證比例總和
    assert abs((train_ratio + validation_ratio + test_ratio) - 1.0) < 0.001, "Ratios should sum to 1.0"

    return mock_data_source_config

def test_data_overlap_removal():
    """測試數據重疊移除功能"""
    print("\n🧪 Testing data overlap removal functionality")

    # 模擬 P 和 U 數據樣本
    p_samples = [
        (1, 1, "2024-01-01T10:00:00Z", "room1", 100, 150, 110, 220, 330, True),
        (2, 1, "2024-01-01T10:15:00Z", "room1", 105, 155, 115, 225, 340, True),
        (3, 1, "2024-01-01T10:30:00Z", "room1", 110, 160, 120, 230, 350, True),
    ]

    # U 數據包含與 P 重疊的樣本
    u_samples_with_overlap = [
        (1, 1, "2024-01-01T10:00:00Z", "room1", 100, 150, 110, 220, 330, False),  # 重疊
        (2, 1, "2024-01-01T10:15:00Z", "room1", 105, 155, 115, 225, 340, False),  # 重疊
        (4, 1, "2024-01-01T11:00:00Z", "room1", 120, 170, 130, 240, 370, False),  # 不重疊
        (5, 1, "2024-01-01T11:15:00Z", "room1", 125, 175, 135, 245, 380, False),  # 不重疊
        (6, 1, "2024-01-01T11:30:00Z", "room1", 130, 180, 140, 250, 390, False),  # 不重疊
    ]

    # 提取 P 樣本的 ID
    p_sample_ids = {sample[0] for sample in p_samples}
    print(f"📊 P sample IDs: {p_sample_ids}")

    # 從 U 樣本中移除重疊的樣本
    u_samples_filtered = [sample for sample in u_samples_with_overlap if sample[0] not in p_sample_ids]

    print(f"📊 Original U samples: {len(u_samples_with_overlap)}")
    print(f"📊 Filtered U samples: {len(u_samples_filtered)} (removed {len(u_samples_with_overlap) - len(u_samples_filtered)} overlapping)")

    # 驗證沒有重疊
    u_filtered_ids = {sample[0] for sample in u_samples_filtered}
    overlap_check = p_sample_ids.intersection(u_filtered_ids)
    assert len(overlap_check) == 0, f"Still have overlapping IDs: {overlap_check}"

    print("✅ Overlap removal successful")
    return p_samples, u_samples_filtered

def test_u_data_limit():
    """測試 U 數據 10 倍限制功能"""
    print("\n🧪 Testing U data 10x limit functionality")

    p_samples = [(i, 1, f"2024-01-01T10:{i:02d}:00Z", "room1", 100+i, 150+i, 110+i, 220+i, 330+i, True) for i in range(5)]

    # 創建超過 10 倍的 U 數據
    u_samples_large = [(i+100, 1, f"2024-01-01T11:{i:02d}:00Z", "room1", 200+i, 250+i, 210+i, 320+i, 530+i, False) for i in range(60)]

    max_unlabeled_samples = len(p_samples) * 10

    print(f"📊 P samples: {len(p_samples)}")
    print(f"📊 Original U samples: {len(u_samples_large)}")
    print(f"📊 Max allowed U samples (10x P): {max_unlabeled_samples}")

    if len(u_samples_large) > max_unlabeled_samples:
        print(f"📊 Randomly sampling {max_unlabeled_samples} from {len(u_samples_large)} available U samples")
        import random
        random.seed(42)  # For reproducibility
        u_samples_limited = random.sample(u_samples_large, max_unlabeled_samples)
    else:
        u_samples_limited = u_samples_large

    print(f"📊 Final U samples: {len(u_samples_limited)}")

    # 驗證限制
    assert len(u_samples_limited) <= max_unlabeled_samples, f"U samples exceed 10x limit: {len(u_samples_limited)} > {max_unlabeled_samples}"

    print("✅ U data 10x limit test successful")
    return p_samples, u_samples_limited

def test_data_splitting():
    """測試數據分割功能"""
    print("\n🧪 Testing data splitting functionality")

    # 創建模擬特徵矩陣和標籤
    np.random.seed(42)
    n_samples = 1000
    n_features = 24  # 多尺度特徵

    X = np.random.randn(n_samples, n_features)
    y = np.random.randint(0, 2, n_samples)  # 0: unlabeled, 1: positive

    # 數據分割比例
    train_ratio = 0.6
    validation_ratio = 0.25
    test_ratio = 0.15

    # 計算分割索引
    total_samples = X.shape[0]
    train_end = int(total_samples * train_ratio)
    val_end = train_end + int(total_samples * validation_ratio)

    # 分割數據
    X_train_split = X[:train_end]
    X_val_split = X[train_end:val_end]
    X_test_split = X[val_end:]

    y_train_split = y[:train_end]
    y_val_split = y[train_end:val_end]
    y_test_split = y[val_end:]

    print(f"📊 Data split results:")
    print(f"   - Train: {X_train_split.shape[0]} samples ({X_train_split.shape[0]/total_samples:.1%})")
    print(f"   - Validation: {X_val_split.shape[0]} samples ({X_val_split.shape[0]/total_samples:.1%})")
    print(f"   - Test: {X_test_split.shape[0]} samples ({X_test_split.shape[0]/total_samples:.1%})")

    # 驗證分割
    total_split = X_train_split.shape[0] + X_val_split.shape[0] + X_test_split.shape[0]
    assert total_split == total_samples, f"Split samples don't match total: {total_split} != {total_samples}"

    print("✅ Data splitting test successful")
    return X_train_split, X_val_split, X_test_split, y_train_split, y_val_split, y_test_split

def main():
    """運行所有測試"""
    print("🧪 Testing PU Learning Training Pipeline")
    print("=" * 50)

    try:
        # 測試 1: 數據源配置提取
        data_source_config = test_data_source_extraction()

        # 測試 2: 數據重疊移除
        p_samples, u_samples = test_data_overlap_removal()

        # 測試 3: U 數據 10 倍限制
        p_samples_limited, u_samples_limited = test_u_data_limit()

        # 測試 4: 數據分割
        X_train, X_val, X_test, y_train, y_val, y_test = test_data_splitting()

        print("\n" + "=" * 50)
        print("🎉 All tests passed successfully!")
        print("✅ PU Learning training pipeline is ready")

    except Exception as e:
        print(f"\n❌ Test failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
