"""
增強版時間序列特徵工程 (可選)
包含更多時間維度和域特定特徵
"""

# 如果您想要使用更多時間特徵，可以將以下代碼替換 ModelTrainer 中的特徵工程部分：

"""
# 在排序後的數據上創建滑動窗口 - 增強版
for i in range(window_size, len(df)):
    window_data = df.iloc[i-window_size:i]
    current_timestamp = df.iloc[i]['timestamp']

    # 基礎統計特徵 (8個)
    base_features = [
        window_data['wattage_total'].mean(),
        window_data['wattage_total'].std(),
        window_data['wattage_total'].max(),
        window_data['wattage_total'].min(),
        window_data['wattage_110v'].mean(),
        window_data['wattage_220v'].mean(),
        window_data['raw_l1'].mean(),
        window_data['raw_l2'].mean(),
    ]

    # 時間序列特徵 (額外6個，總共14個特徵)
    temporal_features = []

    # 1. 趨勢特徵
    if len(window_data) > 1:
        wattage_trend = np.polyfit(range(len(window_data)), window_data['wattage_total'].values, 1)[0]
    else:
        wattage_trend = 0.0
    temporal_features.append(wattage_trend)

    # 2. 時間週期特徵
    hour_of_day = current_timestamp.hour / 24.0  # 0-1 normalization
    day_of_week = current_timestamp.weekday() / 7.0  # 0-1 normalization
    temporal_features.extend([hour_of_day, day_of_week])

    # 3. 波動性特徵
    wattage_cv = window_data['wattage_total'].std() / (window_data['wattage_total'].mean() + 1e-8)
    temporal_features.append(wattage_cv)

    # 4. 負載平衡特徵
    load_balance_110_220 = window_data['wattage_110v'].mean() / (window_data['wattage_220v'].mean() + 1e-8)
    temporal_features.append(load_balance_110_220)

    # 5. 能耗變化率
    if i > window_size:
        prev_window = df.iloc[i-window_size-1:i-1]
        energy_change_rate = (window_data['wattage_total'].mean() - prev_window['wattage_total'].mean()) / (prev_window['wattage_total'].mean() + 1e-8)
    else:
        energy_change_rate = 0.0
    temporal_features.append(energy_change_rate)

    # 合併所有特徵
    features = base_features + temporal_features

    X_features.append(features)
    y_labels.append(df.iloc[i]['label'])
    timestamps.append(current_timestamp)

# 如果使用增強特徵，需要更新模型架構：
# input_size = 14  # 8個基礎 + 6個時間特徵
"""

# 特徵說明：
feature_descriptions = {
    "base_features": [
        "wattage_total_mean",      # 總功率均值
        "wattage_total_std",       # 總功率標準差
        "wattage_total_max",       # 總功率最大值
        "wattage_total_min",       # 總功率最小值
        "wattage_110v_mean",       # 110V功率均值
        "wattage_220v_mean",       # 220V功率均值
        "raw_l1_mean",            # L1原始功率均值
        "raw_l2_mean",            # L2原始功率均值
    ],
    "temporal_features": [
        "wattage_trend",          # 功率趨勢（斜率）
        "hour_of_day",            # 一天中的時段 (0-1)
        "day_of_week",            # 一週中的天數 (0-1)
        "wattage_cv",             # 功率變異係數
        "load_balance_110_220",   # 110V/220V負載平衡比
        "energy_change_rate",     # 能耗變化率
    ]
}

print("🚀 Enhanced temporal features available!")
print("📊 Base features (8):", feature_descriptions["base_features"])
print("⏰ Temporal features (6):", feature_descriptions["temporal_features"])
print("📏 Total features: 14 (vs current 8)")
print("\n🔧 To enable: uncomment the enhanced feature code in ModelTrainer")
print("⚙️ Remember to update model input_size from 8 to 14")
