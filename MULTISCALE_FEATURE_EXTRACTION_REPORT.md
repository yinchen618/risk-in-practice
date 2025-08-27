# 多尺度時間窗口特徵提取實現報告
# Multi-Scale Time Window Feature Extraction Implementation Report

## 概要 | Overview

成功實現了完整的多尺度時間窗口特徵提取系統，為 PU Learning 異常檢測提供豐富的時間序列特徵。系統使用短期、中期、長期三個時間窗口，提取了41維的綜合特徵向量。

Successfully implemented a comprehensive multi-scale time window feature extraction system, providing rich time series features for PU Learning anomaly detection. The system uses short-term, medium-term, and long-term time windows to extract 41-dimensional comprehensive feature vectors.

## 特徵架構 | Feature Architecture

### 🕒 時間窗口配置 | Time Window Configuration
```python
short_window = max(main_window_minutes // 2, 15)    # 短期窗口，最小15分鐘
medium_window = main_window_minutes                 # 中期窗口（主窗口）
long_window = main_window_minutes * 4               # 長期窗口
```

**默認配置 (main_window_minutes=60)**:
- 短期窗口: 30分鐘
- 中期窗口: 60分鐘  
- 長期窗口: 240分鐘

### 📊 特徵分解 | Feature Breakdown

#### 1. 基礎特徵 (5維) | Basic Features (5D)
```python
current_features = [
    float(raw_l1 or 0),         # Raw L1 power
    float(raw_l2 or 0),         # Raw L2 power
    float(w110v or 0),          # 110V power
    float(w220v or 0),          # 220V power
    float(w_total or 0),        # Total power
]
```

#### 2. 窗口統計特徵 (30維) | Window Statistical Features (30D)
**每個時間窗口提取10個統計特徵 × 3個窗口 = 30個特徵**

```python
window_stats = [
    mean_total,                     # 1. 平均總功率
    std_total,                      # 2. 總功率標準差
    np.max(wattage_total_values),   # 3. 最大總功率
    np.min(wattage_total_values),   # 4. 最小總功率
    np.median(wattage_total_values), # 5. 中位數總功率
    high_power_events_count,        # 6. 高功率事件計數 (>1.5×平均值)
    l1_l2_avg_diff,                # 7. L1-L2平均差值
    volatility,                     # 8. 功率變化劇烈程度
    v110_v220_ratio,               # 9. 110V/220V功率比率
    iqr,                           # 10. 四分位數範圍 (IQR)
]
```

#### 3. 跨窗口比較特徵 (6維) | Cross-Window Comparison Features (6D)
```python
cross_window_features = [
    short_mean / medium_mean,       # 短期/中期功率比率
    medium_mean / long_mean,        # 中期/長期功率比率
    short_mean / long_mean,         # 短期/長期功率比率
    short_std / medium_std,         # 短期/中期波動比率
    medium_std / long_std,          # 中期/長期波動比率
    short_std / long_std,           # 短期/長期波動比率
]
```

## 實現細節 | Implementation Details

### 🔍 時間索引建立 | Time Index Construction
```python
# 為高效查詢建立時間索引字典
all_samples_dict = {}
for sample in p_samples + u_samples:
    dataset_id = sample[1]
    timestamp = sample[2]
    parsed_time = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
    all_samples_dict[dataset_id][parsed_time] = sample
```

### 📈 窗口樣本提取 | Window Sample Extraction
```python
# 計算時間窗口範圍
window_start = current_time - timedelta(minutes=window_size)

# 找到該時間窗口內的所有樣本
window_samples = []
for sample_time, sample_data in all_samples_dict[dataset_id].items():
    if window_start <= sample_time <= current_time:
        window_samples.append(sample_data)
```

### 🛡️ 異常處理 | Exception Handling
- **樣本不足**: 當窗口內樣本少於3個時，使用當前樣本值作為默認值
- **缺失數據**: 使用0填充缺失的功率值
- **除零保護**: 在比率計算中使用 `max(denominator, 1)` 避免除零

## 測試驗證 | Testing Validation

### 🧪 測試場景 | Test Scenarios
- **數據生成**: 20小時內80個樣本，每15分鐘一個
- **功率模擬**: 週期性變化 + 隨機噪聲
- **時間跨度**: 涵蓋所有三個時間窗口的完整週期

### ✅ 測試結果 | Test Results
```
✅ Feature matrix generated: (80, 41)
✅ Each sample has 41 features
✅ Basic features: 5
✅ Window statistics: 30 (3 windows × 10 features)
✅ Cross-window features: 6
✅ Total: 41 features
```

### 📊 特徵統計示例 | Feature Statistics Example
```
Sample at 12:30:00:
- Basic features: [746.07, 469.85, 596.86, 563.82, 1215.92]
- Short window (30min): Mean=1228.88, Std=21.46
- Medium window (60min): Mean=1216.05, Std=25.07  
- Long window (240min): Mean=1109.14, Std=110.30
- Cross-window ratios: S/M=1.01, M/L=1.10
```

## 性能優化 | Performance Optimizations

### 🚀 效率提升策略 | Efficiency Enhancement Strategies
1. **時間索引**: 使用字典索引提升窗口查詢效率
2. **向量化計算**: 使用 NumPy 進行批量統計計算
3. **記憶體管理**: 及時釋放不需要的數據結構
4. **日誌優化**: 使用 debug 級別避免過量日誌輸出

### 📈 計算複雜度 | Computational Complexity
- **時間複雜度**: O(n × m × w) 其中 n=樣本數, m=窗口數, w=平均窗口樣本數
- **空間複雜度**: O(n × d) 其中 d=特徵維度(41)

## 異常檢測應用 | Anomaly Detection Applications

### 🎯 特徵意義 | Feature Significance
1. **基礎功率特徵**: 捕捉即時功率狀態
2. **短期統計**: 檢測瞬時異常和突發事件
3. **中期統計**: 識別設備運行模式變化
4. **長期統計**: 發現週期性異常和趨勢變化
5. **跨窗口比較**: 量化不同時間尺度的變化關係

### 🔬 PU Learning 適用性 | PU Learning Applicability
- **正樣本 (P)**: 已確認的異常事件，特徵顯示明顯的多尺度功率異常
- **未標記樣本 (U)**: 包含潛在異常的混合數據，通過多尺度特徵區分正常和異常模式
- **特徵豐富度**: 41維特徵提供充足的區分能力，支持複雜的 nnPU 模型訓練

## 未來改進 | Future Improvements

1. **自適應窗口**: 根據數據密度動態調整窗口大小
2. **頻域特徵**: 添加傅立葉變換和小波分析特徵
3. **季節性建模**: 加入日週期和週週期特徵
4. **異常程度量化**: 計算異常嚴重程度分數
5. **實時處理**: 支持流式數據的增量特徵更新

## 總結 | Summary

多尺度時間窗口特徵提取系統成功實現了：

The multi-scale time window feature extraction system successfully achieved:

- ✅ **完整的多尺度架構**: 短、中、長期三個時間尺度
- ✅ **豐富的特徵向量**: 41維綜合特徵，涵蓋基礎、統計、比較三類
- ✅ **高效的實現**: 時間索引優化，支持大規模數據處理
- ✅ **穩健的異常處理**: 處理缺失數據和邊界情況
- ✅ **完整的測試驗證**: 通過模擬數據驗證功能正確性

系統已準備就緒，可以為 PU Learning 異常檢測提供高質量的時間序列特徵。

The system is ready to provide high-quality time series features for PU Learning anomaly detection.
