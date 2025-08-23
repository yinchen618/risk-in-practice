# 多尺度特徵工程 (Multi-scale Feature Engineering) 系統

## 📋 系統概述

這是一個專為 PU Learning 電力異常檢測設計的多尺度時序特徵工程系統。它能夠從原始電錶數據中提取多個時間窗口的統計特徵，用於訓練更精確的異常檢測模型。

### 🎯 核心特色

- **多時間窗口分析**: 同時提取 15分鐘（短期）和 60分鐘（長期）特徵
- **強大的時序對齊**: 處理 IoT 設備的時間戳偏移問題（最多 10秒延遲）
- **豐富的統計特徵**: 包含平均值、標準差、最大值、最小值、範圍、變異數
- **時間上下文特徵**: 小時、星期、營業時間等時間語義特徵
- **靈活的配置系統**: 5種預設配置適應不同使用場景
- **完善的診斷工具**: 詳細的品質檢查和性能監控

## 🏗️ 系統架構

```
多尺度 ETL 系統
├── 資料庫層 (PostgreSQL + Prisma)
│   ├── analysis_datasets      # 處理後的數據集元數據
│   └── analysis_ready_data    # 特徵化的機器學習數據
├── 配置層
│   ├── multiscale_config.py   # 多尺度特徵配置
│   └── etl_config.py         # 基礎 ETL 配置
├── ETL 引擎層
│   ├── data_preprocessing_etl_multiscale.py  # 多尺度 ETL 引擎
│   └── data_preprocessing_etl.py             # 基礎 ETL 引擎
├── 使用範例層
│   ├── etl_examples.py       # 使用範例和教學
│   └── test_multiscale_etl.py # 測試和驗證工具
└── 文檔層
    ├── MULTISCALE_README.md  # 本文檔
    └── ETL_README.md         # 基礎 ETL 說明
```

## 🚀 快速開始

### 1. 環境準備

```bash
# 安裝 Python 依賴
pip install asyncpg pandas numpy

# 確保 Prisma 資料庫已設置
npx prisma migrate dev
```

### 2. 配置設置

```python
# 在 multiscale_config.py 中選擇適合的配置
from multiscale_config import get_multiscale_config

# 選擇配置（full, balanced, short_only, long_only, high_precision）
config = get_multiscale_config("balanced")
```

### 3. 執行處理

```python
from data_preprocessing_etl_multiscale import MultiscaleETL, RoomInfo, OccupantType

# 創建 ETL 實例
etl = MultiscaleETL(
    connection_string="postgresql://username:password@localhost:5432/database",
    config=config
)

# 定義房間資訊
room_info = RoomInfo(
    room_name="A1",
    occupant_type=OccupantType.OFFICE,
    organization_id=1
)

# 執行處理
result = await etl.process_room_data(
    room_info=room_info,
    start_time=datetime(2024, 1, 15, 9, 0),
    end_time=datetime(2024, 1, 15, 18, 0),
    source_anomaly_event_id=1001
)
```

### 4. 使用範例

```bash
# 查看使用說明
python etl_examples.py --help

# 多尺度特徵工程範例
python etl_examples.py --multiscale

# 配置比較
python etl_examples.py --compare

# 真實場景範例
python etl_examples.py --scenarios
```

## 📊 特徵配置對比

| 配置 | 長期窗口 | 短期窗口 | 步長 | 長期特徵 | 短期特徵 | 時間特徵 | 當前特徵 | 總特徵 |
|------|----------|----------|------|----------|----------|----------|----------|--------|
| FULL | 60分 | 15分 | 1分 | 18 | 18 | 4 | 5 | 49 |
| BALANCED | 30分 | 10分 | 2分 | 18 | 18 | 4 | 5 | 49 |
| SHORT_ONLY | 60分 | 15分 | 1分 | 0 | 18 | 4 | 5 | 31 |
| LONG_ONLY | 60分 | 15分 | 1分 | 18 | 0 | 4 | 5 | 31 |
| HIGH_PRECISION | 120分 | 5分 | 1分 | 18 | 18 | 4 | 5 | 49 |

## 🔧 配置選擇指南

### 🎯 FULL 配置
- **適用場景**: 模型訓練和完整實驗
- **特色**: 最完整的特徵集
- **推薦用途**: 研究和開發階段

### ⚡ BALANCED 配置
- **適用場景**: 生產環境
- **特色**: 平衡效能與精度
- **推薦用途**: 線上異常檢測系統

### 🔍 SHORT_ONLY 配置
- **適用場景**: 即時異常檢測
- **特色**: 專注短期變化模式
- **推薦用途**: 設備故障預警

### 📈 LONG_ONLY 配置
- **適用場景**: 趨勢分析
- **特色**: 專注長期模式
- **推薦用途**: 能耗模式分析

### 🎯 HIGH_PRECISION 配置
- **適用場景**: 高精度研究
- **特色**: 最細粒度的時間窗口
- **推薦用途**: 詳細的異常行為研究

## 📈 特徵說明

### 統計特徵 (每個功率類型 × 每個時間窗口)

| 特徵名稱 | 說明 | 異常檢測價值 |
|----------|------|--------------|
| `mean` | 平均功率 | 檢測基線偏移 |
| `std` | 標準差 | 檢測波動異常 |
| `max` | 最大值 | 檢測功率峰值 |
| `min` | 最小值 | 檢測低功率異常 |
| `range` | 範圍 (max-min) | 檢測變化幅度 |
| `var` | 變異數 | 檢測穩定性 |

### 功率類型

- `wattage110v`: 110V 線路功率
- `wattage220v`: 220V 線路功率  
- `wattageTotal`: 總功率 (110V + 220V)

### 時間特徵

- `hour_of_day`: 小時 (0-23)
- `day_of_week`: 星期 (0-6, 週一=0)
- `is_weekend`: 是否週末 (0/1)
- `is_business_hours`: 是否營業時間 (0/1)

### 當前特徵

- `rawWattageL1`: L1 線路原始功率
- `rawWattageL2`: L2 線路原始功率
- `*_current`: 當前時間點的計算功率

## 🔍 時序對齊機制

### 問題描述
IoT 電錶設備存在時間戳偏移問題：
- 不同電錶的寫入時間可能相差 5-10 秒
- 網路延遲造成數據到達時間不一致
- 設備時鐘同步問題

### 解決方案
1. **重採樣對齊**: 將所有數據重採樣到 1分鐘 bins
2. **前向填充**: 使用 `ffill` 方法填補缺失值（最多 3 個時間點）
3. **外連接合併**: 確保所有時間點都被考慮
4. **品質檢查**: 監控對齊效率和數據完整性

## 📊 效能特性

### 處理速度
- **1小時數據**: ~0.5-1 秒
- **24小時數據**: ~10-15 秒
- **一週數據**: ~1-2 分鐘

### 記憶體使用
- **基礎配置**: ~50-100 MB
- **完整配置**: ~100-200 MB
- **高精度配置**: ~200-300 MB

### 特徵輸出率
- **BALANCED 配置**: 約 85% 樣本轉換率
- **FULL 配置**: 約 80% 樣本轉換率
- **SHORT_ONLY 配置**: 約 90% 樣本轉換率

## 🧪 測試和驗證

### 執行測試
```bash
# 執行完整測試套件
python test_multiscale_etl.py

# 測試結果會保存為 JSON 文件
# multiscale_test_results_YYYYMMDD_HHMMSS.json
```

### 測試內容
1. **配置驗證測試**: 驗證所有預設配置的合理性
2. **窗口對齊測試**: 驗證時間窗口提取邏輯
3. **特徵提取測試**: 驗證特徵生成的正確性
4. **效能測試**: 測試不同數據量的處理效能

## 🚨 注意事項

### 數據品質要求
- 原始數據完整性 ≥ 80%
- 時間戳連續性檢查
- 功率值合理性驗證（非負，在合理範圍內）

### 系統限制
- 單次處理建議不超過 7 天數據
- 記憶體使用會隨特徵數量線性增長
- 資料庫連接需要異步支援

### 最佳實踐
1. **從小規模開始**: 先處理 1-2 小時數據測試
2. **監控日誌**: 關注對齊效率和處理速度
3. **定期品質檢查**: 使用內建診斷工具
4. **適當配置選擇**: 根據使用場景選擇合適配置

## 🛠️ 故障排除

### 常見問題

**Q: 處理速度太慢**
- A: 嘗試 BALANCED 配置，增加 `feature_step_size`

**Q: 記憶體使用過高**
- A: 使用 SHORT_ONLY 或 LONG_ONLY 配置

**Q: 特徵對齊失敗**
- A: 檢查原始數據品質，調整 `ffill_limit` 參數

**Q: 輸出樣本數太少**
- A: 檢查 `min_completeness_ratio` 設定，可能需要降低要求

### 除錯工具
```python
# 啟用詳細日誌
import logging
logging.basicConfig(level=logging.DEBUG)

# 使用診斷功能
etl._diagnose_timestamp_alignment(aligned_data)

# 檢查配置
from multiscale_config import validate_multiscale_config
validate_multiscale_config(config)
```

## 📚 相關文檔

- [基礎 ETL 系統說明](ETL_README.md)
- [資料庫 Schema 文檔](../schema.prisma)
- [PU Learning 實作說明](../TRAINED_MODELS_IMPLEMENTATION_SUMMARY.md)

## 🤝 貢獻指南

1. 新增特徵類型時，更新 `MULTISCALE_CONFIG`
2. 新增配置預設時，同步更新測試案例
3. 修改核心邏輯時，確保通過所有測試
4. 文檔更新與代碼變更同步進行

---

**版本**: 1.0.0  
**最後更新**: 2024年1月  
**維護者**: PU Learning Team
