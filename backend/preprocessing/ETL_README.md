# PU Learning 數據預處理 ETL 系統

這是一個完整的數據預處理 ETL (Extract, Transform, Load) 系統，專為 PU Learning 專案設計，用於從原始電錶數據中生成可直接用於模型訓練的乾淨數據集。

## 🚀 功能特色

- **自動化數據窗口選擇**: 智能尋找數據品質最佳的連續 7 天窗口
- **時間戳對齊**: 解決不同電錶間的時間戳不對齊問題  
- **功率拆解計算**: 根據單相三線配置計算 110V/220V 功率特徵
- **標籤豐富化**: 自動關聯已標註的異常事件
- **批量處理**: 支援多房間並行處理
- **數據品質評估**: 提供詳細的數據品質指標

## 📋 前置需求

### 1. 資料庫 Schema 更新

首先需要執行 Prisma 遷移來創建新的資料表：

```bash
cd packages/database
npx prisma migrate dev --name add_analysis_tables
```

這將創建以下新表：
- `analysis_datasets`: 數據集元數據管理
- `analysis_ready_data`: 預處理完成的分析數據

### 2. Python 環境

確保安裝了所需的 Python 依賴：

```bash
cd backend
pip install -r requirements.txt
```

主要依賴包括：
- `pandas`: 數據處理
- `asyncpg`: 異步 PostgreSQL 連接
- `numpy`: 數值計算

### 3. 環境設置

設置數據庫連接環境變數：

```bash
export DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
```

## 🔧 配置設定

### 房間資訊配置

編輯 `etl_config.py` 中的 `PREDEFINED_ROOMS` 來添加您的房間資訊：

```python
RoomInfo(
    building="Building-A",
    floor="3F",
    room="Room-301",
    meter_id_l1="實際的L1電錶ID",  # 替換為真實ID
    meter_id_l2="實際的L2電錶ID",  # 替換為真實ID
    occupant_type=OccupantType.OFFICE_WORKER
)
```

### ETL 參數調整

在 `etl_config.py` 中的 `ETL_CONFIG` 調整處理參數：

```python
ETL_CONFIG = {
    "default_window_days": 7,        # 數據窗口天數
    "min_completeness_ratio": 0.8,   # 最小數據完整性
    "resample_frequency": "1T",      # 重採樣頻率
    "ffill_limit": 3,               # 向前填充限制
}
```

## 📚 使用方法

### 1. 數據品質檢查（建議首次執行）

```bash
python etl_examples.py --check
```

這會檢查數據品質而不執行完整的 ETL，幫助您了解數據狀況。

### 2. 單個房間處理

```bash
python etl_examples.py --single
```

處理單個房間的數據，適合測試和小規模處理。

### 3. 批量處理

```bash
python etl_examples.py --batch
```

批量處理多個房間，適合大規模數據生成。

### 4. 自定義處理

也可以直接使用 ETL 類進行自定義處理：

```python
from data_preprocessing_etl import DataPreprocessingETL, RoomInfo, OccupantType

# 創建 ETL 實例
etl = DataPreprocessingETL(database_url)

# 定義房間資訊
room_info = RoomInfo(...)

# 執行處理
dataset_id = await etl.process_room_data(
    room_info=room_info,
    search_start=datetime(2025, 8, 1),
    search_end=datetime(2025, 8, 31)
)
```

## 🔄 ETL 流程詳解

### 步驟一：尋找最佳數據窗口
- 在指定月份中滑動 7 天窗口
- 評估每個窗口的數據品質
- 選擇品質分數最高的窗口

### 步驟二：抽取原始數據
- 從 `ammeter` 表抽取 L1/L2 電錶數據
- 按時間戳排序並轉換為 DataFrame

### 步驟三：轉換數據
1. **時間戳對齊**:
   - 重採樣到 1 分鐘格線
   - 外部合併 L1/L2 數據
   - 向前填充處理缺失值

2. **功率拆解計算**:
   - `wattageTotal = L1 + L2`
   - `wattage220v = 2 * min(L1, L2)`  
   - `wattage110v = abs(L1 - L2)`

3. **標籤豐富化**:
   - 關聯已標註的異常事件
   - 設置正樣本標記

### 步驟四：載入數據
- 創建 `AnalysisDataset` 記錄
- 批量插入 `AnalysisReadyData`
- 更新統計資訊

## 📊 輸出數據格式

處理完成後，您將在數據庫中獲得：

### `analysis_datasets` 表
- 數據集元數據（建築、樓層、房間資訊）
- 電錶 ID 和使用者類型
- 時間範圍和統計資訊

### `analysis_ready_data` 表  
- 每分鐘的時間序列數據
- 原始功率讀數（用於溯源）
- 計算後的 110V/220V 功率特徵
- 異常標籤資訊

## 🐛 故障排除

### 常見問題

1. **找不到合適的數據窗口**
   - 檢查原始數據是否存在
   - 降低 `min_completeness_ratio` 閾值
   - 縮短 `window_days` 長度

2. **數據庫連接失敗**
   - 確認 `DATABASE_URL` 環境變數
   - 檢查數據庫服務是否運行
   - 驗證連接權限

3. **電錶 ID 不存在**
   - 確認 `meter_id_l1/l2` 是正確的設備編號
   - 檢查 `ammeter` 表中的數據

### 日誌監控

ETL 過程會產生詳細的日誌輸出，包括：
- 數據窗口搜索進度
- 數據品質評估結果  
- 轉換和載入統計
- 錯誤和警告訊息

## 🔍 下一步

完成數據預處理後，您可以：

1. 查詢 `analysis_datasets` 查看可用的數據集
2. 使用 `analysis_ready_data` 進行模型訓練
3. 建立 Stage 3 實驗工作台
4. 開始 PU Learning 模型開發

## 📝 注意事項

- **首次執行建議**：先進行數據品質檢查
- **測試建議**：先處理單個房間確認無誤
- **性能考量**：批量處理時注意數據庫負載
- **數據備份**：重要數據處理前建議備份

---

如有問題或需要協助，請查看日誌輸出或聯繫開發團隊。
