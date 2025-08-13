# 資料集選擇與 URL 同步實作總結

## 實作目標
實現 Stage 1-4 組件的資料集下拉式選單與網址 run 參數的同步功能。

## 主要改變

### 1. 創建統一的 URL 同步 Hook (`useRunSync.ts`)
- 創建了新的 `useRunSync` hook 來統一管理所有 stage 的 run 參數同步
- 功能包括：
  - 從 URL 讀取初始 run 參數
  - 當選擇變更時自動更新 URL
  - 載入實驗運行清單（支援狀態篩選）
  - 提供 CRUD 操作：新增、更新狀態、刪除實驗運行

### 2. 重構 Stage 1 (`useStage1Logic.ts`)
- 移除原有的 URL 同步邏輯
- 整合 `useRunSync` hook
- 保持原有的業務邏輯功能

### 3. 重構 Stage 2 (`Stage2Labeling.tsx`, `useStage2Logic.ts`)
- 移除組件內的 URL 同步邏輯
- 使用統一的 `useRunSync` hook
- 簡化 `useStage2Logic` 的介面

### 4. 重構 Stage 3 (`Stage3ModelTraining.tsx`)
- 移除內建的實驗運行載入邏輯
- 使用 `useRunSync` hook 並篩選 COMPLETED 狀態的運行
- 修正類型不匹配問題

### 5. 重構 Stage 4 (`Stage4ModelEvaluation.tsx`)
- 移除內建的 URL 同步邏輯
- 使用 `useRunSync` hook 並篩選 COMPLETED 狀態的運行
- 修正類型不匹配問題

## 功能特點

### URL 同步
- 當用戶在任何 stage 選擇資料集時，URL 會自動更新 `?run=<runId>` 參數
- 當用戶通過 URL 直接訪問時，會自動選擇對應的資料集
- 支援清空選擇（移除 URL 參數）

### 狀態篩選
- Stage 1: 顯示所有狀態的實驗運行
- Stage 2: 顯示所有狀態的實驗運行（用於標記完成）
- Stage 3: 只顯示 COMPLETED 狀態的實驗運行
- Stage 4: 只顯示 COMPLETED 狀態的實驗運行

### 一致性
- 所有 stage 使用相同的 UI 模式和行為
- 統一的錯誤處理和載入狀態
- 一致的類型安全性

## 技術亮點

1. **單一責任原則**: `useRunSync` 專門負責 run 參數的管理
2. **可重用性**: 所有 stage 都能複用相同的邏輯
3. **類型安全**: 完整的 TypeScript 類型定義
4. **反應式更新**: 使用 React hooks 確保狀態同步
5. **深層連結支援**: URL 可以直接指定預選的資料集

## 使用範例

```typescript
// 在任何 stage 組件中
const {
  selectedRunId,
  setSelectedRunId,
  experimentRuns,
  isLoadingRuns,
  loadExperimentRuns,
} = useRunSync();

// 載入特定狀態的運行
useEffect(() => {
  loadExperimentRuns("COMPLETED");
}, [loadExperimentRuns]);
```

## 測試驗證

所有修改的檔案都通過 TypeScript 編譯檢查，無編譯錯誤。用戶現在可以：

1. 在任何 stage 選擇資料集，URL 會自動同步
2. 通過 URL 直接訪問特定資料集
3. 在不同 stage 間切換時保持資料集選擇
4. 享受一致的用戶體驗
