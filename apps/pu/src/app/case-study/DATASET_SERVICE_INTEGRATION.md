# Dataset Service 整合報告

## 概述

成功將 case-study 資料夾中分散在各個組件的相關函式整合到統一的 `datasetService.ts` 中，提高程式碼的可維護性和重用性。

## 整合的函式

### 1. 實驗運行管理 (Experiment Run Management)
- `loadExperimentRuns()` - 載入所有實驗運行清單
- `createNewExperimentRun(customName?)` - 建立新的實驗運行
- `deleteExperimentRun(runId)` - 刪除實驗運行
- `renameExperimentRun(runId, newName)` - 重命名實驗運行
- `loadRunDetailData(runId)` - 載入實驗運行詳細資料
- `loadParametersFromRun(selectedRunId)` - 載入實驗運行的參數
- `markRunAsComplete(runId)` - 標記實驗運行為完成狀態

### 2. 候選事件管理 (Candidate Events Management)
- `calculateCandidates(filterParams)` - 計算候選事件
- `saveCandidateCalculationResults(selectedRunId, filterParams)` - 儲存候選計算結果
- `saveParametersToRun(selectedRunId, filterParams)` - 儲存參數到實驗運行

### 3. 模型訓練相關 (Model Training - Stage3)
- `startTrainAndPredict(payload)` - 開始模型訓練和預測任務
- `pollJobStatus(jid)` - 輪詢訓練任務狀態
- `fetchModelResults(mid)` - 獲取模型結果

### 4. 輔助工具函式 (Utility Functions)
- `loadAmmeterMap()` - 載入電表對應表
- `formatFilterParamsForAPI(filterParams)` - 格式化過濾參數為 API 格式
- `formatTaipeiISO(dateObj, hhmm)` - 格式化台北時區的 ISO 時間

## 更新的組件

### 已更新使用 datasetService 的組件：

1. **DataResultsPhase.tsx**
   - 移除重複的 API 函式定義
   - 使用 `datasetService.saveParametersToRun()`
   - 使用 `datasetService.markRunAsComplete()`

2. **DatasetPanel.tsx**
   - 使用 `datasetService.createNewExperimentRun()`
   - 移除本地的 API 函式定義

3. **RunSelector.tsx**
   - 使用 `datasetService.loadExperimentRuns()`
   - 移除重複的載入函式

4. **Stage1ResultsSummary.tsx**
   - 使用 `datasetService.saveCandidateCalculationResults()`
   - 移除重複的函式定義

5. **DatasetManager.tsx**
   - 更新介面以配合新的函式簽名

## 架構改善

### 優點：
1. **統一管理**：所有 dataset 相關的 API 呼叫集中在一個地方
2. **消除重複**：移除了各組件中重複的函式定義
3. **易於維護**：API 變更只需修改 datasetService.ts
4. **型別安全**：統一的型別定義和錯誤處理
5. **清晰的職責分離**：組件專注於 UI 邏輯，API 邏輯統一管理

### 配置：
- **API_BASE**: 統一的 API 基礎 URL (`http://localhost:8000`)
- **一致的錯誤處理**：統一的錯誤訊息和例外處理模式
- **型別安全**：所有函式都有明確的 TypeScript 型別定義

## 使用範例

```typescript
import * as datasetService from "../services/datasetService";

// 載入實驗運行
const runs = await datasetService.loadExperimentRuns();

// 建立新實驗運行
const newRun = await datasetService.createNewExperimentRun("My Dataset");

// 計算候選事件
const result = await datasetService.calculateCandidates(filterParams);

// 儲存參數
await datasetService.saveParametersToRun(runId, filterParams);
```

## 未來擴展

datasetService.ts 現在是擴展新功能的理想位置：
- 新增更多實驗運行管理功能
- 擴展候選事件的操作
- 新增模型評估相關的 API
- 整合更多的統計和分析功能

這個整合大大提升了程式碼的組織性和可維護性，為未來的開發奠定了良好的基礎。
