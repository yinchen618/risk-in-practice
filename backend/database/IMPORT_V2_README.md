# Room Samples Import Script V2

## 概述

這是資料匯入腳本的第二版本，專門解決了時間格式和字符編碼問題，確保匯入的資料與 Prisma 完全相容。

## V2 版本改進

### 🔧 主要修復

1. **日期時間格式標準化**
   - 所有 DateTime 欄位現在使用完整的 ISO 8601 格式
   - 格式：`YYYY-MM-DDTHH:mm:ss.sssZ`（包含毫秒和 UTC 時區）
   - 解決了 Prisma 的 "Conversion failed: input contains invalid characters" 錯誤

2. **字符編碼清理**
   - 移除 NULL 字節 (`\0`)
   - 清理控制字符（保留必要的 `\t`, `\n`, `\r`）
   - 確保所有字符串都是有效的 UTF-8 編碼

3. **資料驗證**
   - 添加了輸入資料驗證
   - 安全的數值轉換（防止無效數值導致錯誤）
   - 更好的錯誤處理和日誌記錄

4. **匯入後驗證**
   - 自動檢查資料完整性
   - 驗證日期格式正確性
   - 檢測並報告任何剩餘的資料問題

### 🆚 V1 vs V2 對比

| 功能 | V1 | V2 |
|------|----|----|
| 日期格式 | 基本 ISO 格式 | 完整 ISO 8601 + 毫秒 + UTC |
| 字符清理 | 無 | 完整的字符驗證和清理 |
| 錯誤處理 | 基本 | 詳細的錯誤處理和恢復 |
| 資料驗證 | 無 | 匯入後自動驗證 |
| Prisma 相容性 | 部分 | 完全相容 |

## 使用方法

### 基本使用

```bash
# 使用 V2 版本匯入（推薦）
npm run db:import:v2

# 使用原版本匯入
npm run db:import
```

### 完整工作流程

```bash
# 1. 重置資料庫（可選）
npm run db:reset

# 2. 使用 V2 版本匯入資料
npm run db:import:v2

# 3. 驗證資料完整性
npm run db:validate

# 4. 啟動 Prisma Studio 檢查資料
npm run db:studio
```

## 新增的資料處理功能

### 1. 字符串清理函數

```python
def clean_string(text):
    """清理字符串，移除無效字符"""
    # 移除 NULL 字節和控制字符
    # 確保有效的 UTF-8 編碼
```

### 2. 日期時間標準化

```python
def format_datetime_iso(dt_input):
    """將任何日期格式轉換為標準 ISO 8601"""
    # 輸出：YYYY-MM-DDTHH:mm:ss.sssZ
```

### 3. 安全數值轉換

```python
def safe_float(value, default=0.0):
    """安全地轉換數值，防止異常"""
```

## 匯入後的驗證

V2 版本會自動執行以下檢查：

1. **日期格式驗證**：確保所有日期都包含毫秒和時區資訊
2. **字符完整性**：檢查是否有無效字符殘留
3. **資料統計**：報告匯入的記錄數量

## 故障排除

### 常見問題

1. **"Invalid characters" 錯誤**
   - 解決方案：使用 V2 版本，它會自動清理字符

2. **日期格式錯誤**
   - 解決方案：V2 版本會自動標準化所有日期格式

3. **匯入後 Prisma Studio 無法正常顯示**
   - 執行：`npm run db:validate`
   - 檢查驗證報告並按建議修復

### 手動修復（如果需要）

```bash
# 如果發現資料問題，可以手動執行修復
sqlite3 prisma/pu_practice.db "
UPDATE analysis_datasets 
SET created_at = datetime('now') || '.000Z'
WHERE created_at NOT LIKE '%.%Z';
"
```

## 效能資訊

- **批次大小**：1000 筆記錄/批次
- **預期匯入時間**：~2-3 分鐘（58萬筆記錄）
- **記憶體使用**：低（批次處理）

## 建議的最佳實踐

1. **總是使用 V2 版本**進行新的匯入
2. **匯入後執行驗證**：`npm run db:validate`
3. **定期備份資料庫**
4. **在生產環境前先在測試環境驗證**

## 未來改進計劃

- [ ] 支援增量匯入
- [ ] 資料重複檢測
- [ ] 效能進一步最佳化
- [ ] 支援其他資料格式
