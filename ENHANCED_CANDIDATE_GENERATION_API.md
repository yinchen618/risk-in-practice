# Enhanced Candidate Generation API

## 新功能概述

增強了 `/api/v2/generate-candidates` API，新增 `save_labels` 參數，使其既可以預覽候選數，也可以直接產生真正的候選標籤。

## API 變更

### 請求參數

```json
{
  "filter_params": {
    // 原有的過濾參數...
    "zScoreThreshold": 2.8,
    "spikeThreshold": 250,
    "minEventDuration": 45,
    // ... 其他參數
  },
  "save_labels": false  // 新增參數：是否保存為實際標籤
}
```

### 參數說明

- `save_labels`: `boolean` (預設: `false`)
  - `false`: **預覽模式** - 只計算候選數量，不創建實際的異常事件記錄
  - `true`: **標籤模式** - 計算候選數量並創建實際的異常事件記錄，準備進入標註階段

### 回應格式

**預覽模式** (`save_labels: false`):
```json
{
  "success": true,
  "experiment_run_id": "uuid",
  "candidate_count": 78,
  "filtered_datasets_count": 1,
  "filter_summary": {...},
  "message": "Successfully generated 78 anomaly candidates"
}
```

**標籤模式** (`save_labels: true`):
```json
{
  "success": true,
  "experiment_run_id": "uuid",
  "candidate_count": 78,
  "anomaly_events_created": 78,
  "status": "LABELING",
  "filtered_datasets_count": 1,
  "filter_summary": {...},
  "message": "Successfully generated 78 anomaly candidates and created 78 anomaly events for labeling"
}
```

## 工作流程

### 1. 預覽候選數量
```bash
curl -X POST http://localhost:8000/api/v2/generate-candidates \
  -H "Content-Type: application/json" \
  -d '{
    "filter_params": {
      "buildings": ["Building-A"],
      "floors": ["5F"],
      "rooms": ["Room-01"],
      "zScoreThreshold": 2.8,
      "spikeThreshold": 250,
      "minEventDuration": 45
    },
    "save_labels": false
  }'
```

### 2. 創建實際標籤
```bash
curl -X POST http://localhost:8000/api/v2/generate-candidates \
  -H "Content-Type: application/json" \
  -d '{
    "filter_params": {
      "buildings": ["Building-A"],
      "floors": ["5F"],
      "rooms": ["Room-01"],
      "zScoreThreshold": 2.8,
      "spikeThreshold": 250,
      "minEventDuration": 45
    },
    "save_labels": true
  }'
```

## 數據庫變更

### experiment_run 表
- **預覽模式**: `status = "COMPLETED"`
- **標籤模式**: `status = "LABELING"`

### anomaly_event 表
- **預覽模式**: 不創建記錄
- **標籤模式**: 創建相應數量的異常事件記錄，狀態為 `"UNREVIEWED"`

## 前端整合

修改了 `Stage1CandidateGeneration.tsx` 組件：

1. **Generate Candidates 按鈕**: 使用 `save_labels: false` 進行預覽
2. **Continue to Labeling 按鈕**: 使用 `save_labels: true` 直接創建標籤

### 前端代碼變更

```typescript
// 預覽候選數量
const handleGenerateCandidates = async () => {
  const response = await fetch('/api/v2/generate-candidates', {
    method: 'POST',
    body: JSON.stringify({
      filter_params: filterParams,
      save_labels: false  // 預覽模式
    })
  });
};

// 創建實際標籤
const handleContinueLabeling = async () => {
  const response = await fetch('/api/v2/generate-candidates', {
    method: 'POST',
    body: JSON.stringify({
      filter_params: filterParams,
      save_labels: true   // 標籤模式
    })
  });
};
```

## 優化的閾值設定

基於真實數據分析，調整了預設閾值：

- **Z-Score閾值**: 2.5 → **2.8**
- **功率峰值閾值**: 200% → **250%**
- **最小持續時間**: 30分鐘 → **45分鐘**

### 智能推薦系統

- **單房間**: 平衡檢測模式 (預期 50-100 候選)
- **2-5房間**: 更嚴格模式 (Z-score: 3.2, Spike: 350%)
- **5+房間**: 最嚴格模式 (Z-score: 3.8, Spike: 450%)

## 測試結果

- **單房間 (5F Room-01)**: 78 候選事件
- **預覽模式**: 不創建異常事件記錄
- **標籤模式**: 創建 78 個異常事件記錄
- **實驗狀態**: 正確設置為 "LABELING"

## 向後兼容性

- 原有的 API 調用（不包含 `save_labels` 參數）會使用預設值 `false`，維持原有行為
- 不需要修改現有的調用代碼
