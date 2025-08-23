"""
多尺度特徵工程配置文件

這個文件包含了多尺度特徵工程的詳細配置參數和使用範例。
用於配置 15分鐘和 60分鐘雙時間窗口的特徵提取。
"""

from datetime import datetime
from typing import List, Dict
from data_preprocessing_etl_multiscale import RoomInfo, OccupantType

# ========== 多尺度特徵工程配置 ==========
MULTISCALE_CONFIG = {
    # 核心窗口設定
    "long_window_size": 60,      # 長期窗口：60分鐘（宏觀視角）
    "short_window_size": 15,     # 短期窗口：15分鐘（微觀視角）
    "feature_step_size": 1,      # 特徵提取步長：1分鐘

    # 統計特徵類型
    "statistical_features": [
        "mean",    # 平均值
        "std",     # 標準差
        "max",     # 最大值
        "min",     # 最小值
        "range",   # 範圍 (max - min)
        "var",     # 變異數
    ],

    # 功率類型
    "power_types": [
        "wattage110v",    # 110V功率
        "wattage220v",    # 220V功率
        "wattageTotal",   # 總功率
    ],

    # 時間特徵
    "time_features": [
        "hour_of_day",       # 小時 (0-23)
        "day_of_week",       # 星期 (0-6, 0=週一)
        "is_weekend",        # 是否週末 (0/1)
        "is_business_hours", # 是否營業時間 (0/1)
    ],

    # 特徵選擇設定
    "enable_long_window_features": True,   # 啟用60分鐘特徵
    "enable_short_window_features": True,  # 啟用15分鐘特徵
    "enable_time_features": True,          # 啟用時間特徵
    "enable_current_features": True,       # 啟用當前時間點特徵
}

# ========== 特徵組合預設 ==========
FEATURE_PRESETS = {
    # 完整特徵集（用於實驗）
    "full": {
        "long_window_size": 60,
        "short_window_size": 15,
        "feature_step_size": 1,
        "enable_long_window_features": True,
        "enable_short_window_features": True,
        "enable_time_features": True,
        "enable_current_features": True,
    },

    # 僅長期特徵（適用於趨勢分析）
    "long_only": {
        "long_window_size": 60,
        "short_window_size": 15,  # 保留但不使用
        "feature_step_size": 1,
        "enable_long_window_features": True,
        "enable_short_window_features": False,
        "enable_time_features": True,
        "enable_current_features": True,
    },

    # 僅短期特徵（適用於即時異常檢測）
    "short_only": {
        "long_window_size": 60,  # 保留但不使用
        "short_window_size": 15,
        "feature_step_size": 1,
        "enable_long_window_features": False,
        "enable_short_window_features": True,
        "enable_time_features": True,
        "enable_current_features": True,
    },

    # 平衡模式（較少特徵，處理速度快）
    "balanced": {
        "long_window_size": 30,   # 縮短長期窗口
        "short_window_size": 10,  # 縮短短期窗口
        "feature_step_size": 2,   # 增加步長以減少樣本數
        "enable_long_window_features": True,
        "enable_short_window_features": True,
        "enable_time_features": True,
        "enable_current_features": True,
    },

    # 高精度模式（更多時間窗口）
    "high_precision": {
        "long_window_size": 120,  # 2小時長期窗口
        "short_window_size": 5,   # 5分鐘短期窗口
        "feature_step_size": 1,
        "enable_long_window_features": True,
        "enable_short_window_features": True,
        "enable_time_features": True,
        "enable_current_features": True,
    },
}

# ========== 預期特徵數量計算 ==========
def calculate_feature_count(config: Dict) -> Dict[str, int]:
    """
    計算給定配置下的預期特徵數量

    Args:
        config: 特徵配置字典

    Returns:
        Dict: 各類特徵的數量統計
    """
    counts = {
        "long_window_features": 0,
        "short_window_features": 0,
        "time_features": 0,
        "current_features": 0,
        "total_features": 0
    }

    # 計算統計特徵數量
    stat_count = len(MULTISCALE_CONFIG["statistical_features"])
    power_count = len(MULTISCALE_CONFIG["power_types"])

    # 長期窗口特徵
    if config.get("enable_long_window_features", True):
        counts["long_window_features"] = stat_count * power_count

    # 短期窗口特徵
    if config.get("enable_short_window_features", True):
        counts["short_window_features"] = stat_count * power_count

    # 時間特徵
    if config.get("enable_time_features", True):
        counts["time_features"] = len(MULTISCALE_CONFIG["time_features"])

    # 當前時間點特徵
    if config.get("enable_current_features", True):
        counts["current_features"] = power_count + 2  # 3個功率 + rawWattageL1 + rawWattageL2

    # 總特徵數（加上基礎欄位：timestamp, room, 標籤等）
    base_fields = 4  # timestamp, room, isPositiveLabel, sourceAnomalyEventId
    counts["total_features"] = (
        counts["long_window_features"] +
        counts["short_window_features"] +
        counts["time_features"] +
        counts["current_features"] +
        base_fields
    )

    return counts

# ========== 多尺度特徵配置範例 ==========
def get_multiscale_config(preset_name: str = "full") -> Dict:
    """
    獲取多尺度特徵工程的完整配置

    Args:
        preset_name: 預設配置名稱

    Returns:
        Dict: 完整的ETL配置
    """
    if preset_name not in FEATURE_PRESETS:
        raise ValueError(f"未知的預設配置: {preset_name}. 可用選項: {list(FEATURE_PRESETS.keys())}")

    # 基礎ETL配置
    base_config = {
        "resample_frequency": "1T",
        "ffill_limit": 3,
        "anomaly_time_tolerance_minutes": 5,
        "min_completeness_ratio": 0.8,
    }

    # 多尺度特徵配置
    multiscale_config = FEATURE_PRESETS[preset_name]

    # 合併配置
    full_config = {**base_config, **multiscale_config}

    return full_config

# ========== 使用範例 ==========
def show_feature_summary():
    """
    顯示各種預設配置的特徵數量摘要
    """
    print("=== 多尺度特徵配置摘要 ===")
    print()

    for preset_name, preset_config in FEATURE_PRESETS.items():
        counts = calculate_feature_count(preset_config)

        print(f"【{preset_name.upper()}】配置:")
        print(f"  長期窗口: {preset_config['long_window_size']}分鐘")
        print(f"  短期窗口: {preset_config['short_window_size']}分鐘")
        print(f"  特徵步長: {preset_config['feature_step_size']}分鐘")
        print(f"  長期特徵: {counts['long_window_features']} 個")
        print(f"  短期特徵: {counts['short_window_features']} 個")
        print(f"  時間特徵: {counts['time_features']} 個")
        print(f"  當前特徵: {counts['current_features']} 個")
        print(f"  總特徵數: {counts['total_features']} 個")
        print()

def get_feature_list(preset_name: str = "full") -> List[str]:
    """
    生成特定配置下的完整特徵名稱列表

    Args:
        preset_name: 預設配置名稱

    Returns:
        List[str]: 特徵名稱列表
    """
    config = FEATURE_PRESETS[preset_name]
    features = []

    # 基礎欄位
    features.extend([
        "timestamp",
        "room",
        "isPositiveLabel",
        "sourceAnomalyEventId"
    ])

    # 當前時間點特徵
    if config.get("enable_current_features", True):
        features.extend([
            "rawWattageL1",
            "rawWattageL2",
            "wattage110v_current",
            "wattage220v_current",
            "wattageTotal_current"
        ])

    # 長期窗口特徵
    if config.get("enable_long_window_features", True):
        for power_type in MULTISCALE_CONFIG["power_types"]:
            for stat in MULTISCALE_CONFIG["statistical_features"]:
                features.append(f"{power_type}_{stat}_60m")

    # 短期窗口特徵
    if config.get("enable_short_window_features", True):
        for power_type in MULTISCALE_CONFIG["power_types"]:
            for stat in MULTISCALE_CONFIG["statistical_features"]:
                features.append(f"{power_type}_{stat}_15m")

    # 時間特徵
    if config.get("enable_time_features", True):
        features.extend(MULTISCALE_CONFIG["time_features"])

    return features

# ========== 配置驗證 ==========
def validate_multiscale_config(config: Dict) -> bool:
    """
    驗證多尺度特徵配置的合理性

    Args:
        config: 配置字典

    Returns:
        bool: 配置是否有效
    """
    errors = []

    # 檢查窗口大小
    if config.get("long_window_size", 60) <= config.get("short_window_size", 15):
        errors.append("長期窗口大小必須大於短期窗口大小")

    if config.get("short_window_size", 15) < 1:
        errors.append("短期窗口大小必須至少為1分鐘")

    if config.get("feature_step_size", 1) < 1:
        errors.append("特徵步長必須至少為1分鐘")

    # 檢查是否至少啟用一種特徵
    feature_types = [
        "enable_long_window_features",
        "enable_short_window_features",
        "enable_time_features",
        "enable_current_features"
    ]

    if not any(config.get(ft, True) for ft in feature_types):
        errors.append("必須至少啟用一種特徵類型")

    if errors:
        print("配置驗證失敗:")
        for error in errors:
            print(f"  - {error}")
        return False

    print("配置驗證通過")
    return True

if __name__ == "__main__":
    # 顯示特徵摘要
    show_feature_summary()

    # 顯示完整特徵列表示例
    print("=== FULL 配置特徵列表 ===")
    features = get_feature_list("full")
    for i, feature in enumerate(features, 1):
        print(f"{i:2d}. {feature}")

    print(f"\n總計: {len(features)} 個特徵")

    # 驗證配置
    print("\n=== 配置驗證 ===")
    for preset_name in FEATURE_PRESETS.keys():
        config = get_multiscale_config(preset_name)
        print(f"{preset_name}: ", end="")
        validate_multiscale_config(config)
