# Room Samples Data Import

這個腳本會將 `backend/preprocessing/room_samples_for_pu/` 目錄下的房間分析資料匯入到 SQLite 資料庫中。

## 資料結構

- **`*.json` 檔案** → `AnalysisDataset` 表 (37 個資料集)
- **`*.csv` 檔案** → `AnalysisReadyData` 表 (584,017 筆記錄)
- **`rooms_metadata.csv`** → 提供建築物、樓層、房間、使用者類型等資訊

## 使用方式

### 僅匯入資料（保留現有資料）
```bash
cd backend/database
pnpm db:import
```

### 完全重置並匯入（清空所有資料）
```bash
cd backend/database
pnpm db:reset
pnpm db:import
```

### 一鍵重置匯入
```bash
cd backend/database
./scripts/reset-and-import.sh
```

## 匯入後的資料

- **37 個 AnalysisDataset** 記錄，每個對應一個房間的資料集
- **584,017 筆 AnalysisReadyData** 記錄，包含時間戳記、電表數據、特徵工程結果
- 資料時間範圍：2025-07-21 到 2025-08-17
- 涵蓋建築物：Building-A 的多個樓層和房間

## 查看資料

```bash
# 開啟 Prisma Studio
pnpm db:studio

# 或直接查詢資料庫
sqlite3 prisma/pu_practice.db "SELECT COUNT(*) FROM analysis_datasets;"
sqlite3 prisma/pu_practice.db "SELECT COUNT(*) FROM analysis_ready_data;"
```

## 注意事項

- 匯入過程約需 2-3 分鐘
- 資料庫檔案大小約 200MB
- 確保有足夠的磁碟空間
- 執行前確保沒有其他程序在使用資料庫
