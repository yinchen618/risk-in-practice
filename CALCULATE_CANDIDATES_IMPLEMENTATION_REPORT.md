# Calculate Candidates 後端實作完成報告

## 實作概述

我們已成功實現了完整的 `Calculate Candidates` 後端功能，包括多維度異常檢測算法和前後端整合。這個實作遵循了您提供的詳細規劃書，並包含以下核心組件：

## 1. 實作的核心服務

### 1.1 候選事件計算服務 (`candidate_calculation.py`)
- **位置**: `/backend/services/candidate_calculation.py`
- **功能**: 實現完整的多維度異常檢測算法
- **主要方法**:
  - `calculate_anomaly_candidates()`: 主要計算函數
  - `_apply_multidimensional_rules()`: 應用各種異常檢測規則
  - `_process_overlap_and_finalize()`: 處理重疊並生成最終結果

### 1.2 數據載入服務擴展 (`data_loader.py`)
- **新增方法**: `load_meter_data_by_time_range()`
- **功能**: 根據時間範圍和樓層篩選載入電表數據
- **優化**: 支援快取機制，提高性能

### 1.3 實驗管理路由擴展 (`experiment_runs.py`)
- **新增API端點**:
  - `POST /{run_id}/candidates/calculate`: 計算候選事件
  - `POST /{run_id}/candidates/generate`: 生成並保存候選事件
  - `GET /{run_id}/candidates/status/{task_id}`: 查詢生成任務狀態

## 2. API 規格與資料結構

### 2.1 輸入格式
```json
{
  "filtering_parameters": {
    "start_date": "2025-08-12",
    "end_date": "2025-08-13",
    "start_time": "14:56",
    "end_time": "16:00",
    "z_score_threshold": 3.0,
    "spike_percentage": 200.0,
    "min_event_duration_minutes": 30,
    "detect_holiday_pattern": true,
    "max_time_gap_minutes": 60,
    "peer_agg_window_minutes": 5,
    "peer_exceed_percentage": 150.0,
    "selected_floors_by_building": {
      "15學舍": ["1", "2"]
    }
  }
}
```

### 2.2 輸出格式
```json
{
  "success": true,
  "data": {
    "totalCandidates": 166,
    "totalRecords": 3452,
    "uniqueDevices": 79,
    "insufficientDataDevices": 18,
    "deviceRecordsSummary": {
      "avgRecordsPerDevice": 43.7,
      "medianRecordsPerDevice": 49,
      "minRecordsPerDevice": 2,
      "maxRecordsPerDevice": 51
    },
    "perRule": {
      "zscoreEstimate": 0,
      "spikeEstimate": 84,
      "timeEstimate": 0,
      "gapEstimate": 0,
      "peerEstimate": 175
    },
    "totalEstimatedBeforeOverlap": 259,
    "overlapReductionFactor": 0.35,
    "overlapAdjustedTotal": 168,
    "topDevicesByEstimatedAnomalies": [
      {"deviceNumber": "31BC", "estimatedAnomalies": 40}
    ],
    "timeRange": {
      "start": "2025-08-12T14:56:28Z",
      "end": "2025-08-12T15:59:58Z"
    }
  }
}
```

## 3. 核心算法實現

### 3.1 多維度篩選規則
我們實現了以下五個核心規則：

1. **Z-Score 規則**: 檢測統計異常值
2. **Spike 規則**: 檢測突然的功率峰值
3. **時間規則**: 檢測非正常時段(深夜、週末)的用電
4. **Gap 規則**: 檢測數據時間間隔異常
5. **Peer 規則**: 檢測相對於同群組的異常用電

### 3.2 重疊處理
- 將各規則檢測的異常點合併為唯一集合
- 應用最小持續時間規則篩選有效事件
- 計算重疊減少因子

### 3.3 事件生成
- 將相鄰異常點合併為單一事件
- 應用持續時間閾值
- 生成符合資料庫結構的事件記錄

## 4. 前端整合

### 4.1 服務層更新 (`datasetService.ts`)
- **新增方法**: `calculateCandidatesForRun()`
- **功能**: 調用新的實驗運行API
- **格式轉換**: 前端參數轉換為後端API格式

### 4.2 組件更新 (`Stage1ResultsSummary.tsx`)
- **更新**: 使用新的API調用方法
- **改進**: 更好的錯誤處理和狀態管理

## 5. 數據回存策略

### 5.1 候選事件存儲
- 將計算出的候選事件保存到 `anomaly_event` 表
- 包含完整的事件上下文和檢測規則信息
- 支援覆蓋和增量更新模式

### 5.2 實驗統計更新
- 自動更新實驗批次的統計信息
- 保存篩選參數供後續分析
- 維護事件數量和狀態統計

## 6. 錯誤修正

### 6.1 修正的語法錯誤
- **位置**: `experiment_runs.py` 第54-60行
- **問題**: `FilteringParameters` 模型中的縮排錯誤
- **解決**: 修正 `end_date` 欄位的縮排

### 6.2 變數名稱一致性
- 確保前後端使用一致的變數命名
- 實現正確的時間格式轉換
- 維護API契約的兼容性

## 7. 測試與驗證

### 7.1 API測試腳本
- **位置**: `/backend/test_candidate_calculation.py`
- **功能**: 自動化API測試
- **覆蓋**: 創建實驗、計算候選事件、清理測試數據

### 7.2 日誌與監控
- 詳細的日誌記錄所有關鍵步驟
- 性能監控和錯誤追蹤
- 便於問題診斷和系統優化

## 8. 部署狀態

✅ **後端服務**: 已啟動並運行在 localhost:8000  
✅ **前端應用**: 已啟動並運行在 localhost:3000  
✅ **API端點**: 所有新端點已實現並測試  
✅ **數據載入**: 正常運行，支援快取機制  
✅ **錯誤處理**: 完整的錯誤處理和日誌記錄  

## 9. 使用方式

### 9.1 通過前端界面
1. 訪問 http://localhost:3000
2. 導航到案例研究頁面
3. 選擇實驗運行
4. 配置篩選參數
5. 點擊 "Calculate" 按鈕執行計算

### 9.2 通過API直接調用
```bash
# 計算候選事件
curl -X POST http://localhost:8000/api/v1/experiment-runs/{run_id}/candidates/calculate \
  -H "Content-Type: application/json" \
  -d @filter_params.json

# 生成並保存候選事件
curl -X POST http://localhost:8000/api/v1/experiment-runs/{run_id}/candidates/generate \
  -H "Content-Type: application/json" \
  -d @filter_params.json
```

## 10. 後續建議

1. **性能優化**: 考慮添加更多快取層級和並行處理
2. **算法調優**: 根據實際數據調整各規則的參數
3. **監控完善**: 添加更詳細的性能指標和健康檢查
4. **文檔擴展**: 為API端點添加OpenAPI文檔

整個實現已經完成並可以投入使用。前後端都已正確整合，API功能完善，符合您的需求規格。
