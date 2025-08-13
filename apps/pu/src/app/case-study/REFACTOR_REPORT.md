# Stage 組件重構總結

## 重構目標
1. 修正編譯錯誤
2. 創建共用的邏輯和 UI 組件
3. 減少代碼重複
4. 提升可維護性

## 創建的共用組件和 Hook

### 1. `useExperimentRunData` Hook
統一管理所有 stage 的實驗運行數據，包括：
- 運行清單載入和管理
- 運行詳細數據載入
- 統計數據管理（candidateCount, labeledPositive, labeledNormal）
- CRUD 操作（創建、更新、刪除運行）

**主要功能：**
```typescript
const {
  // Run Sync 功能
  selectedRunId,
  setSelectedRunId,
  experimentRuns,
  isLoadingRuns,
  
  // 運行詳細數據
  runDetail,
  isLoadingDetail,
  loadRunDetail,
  
  // 統計數據
  candidateCount,
  labeledPositive,
  labeledNormal,
  
  // 運行管理
  createNewRun,
  updateRunStatus,
  deleteRun,
} = useExperimentRunData(statusFilter?);
```

### 2. `RunSelector` 組件
統一的實驗運行選擇器，特點：
- 支援載入狀態顯示
- 支援創建新運行按鈕
- 統一的 UI 風格
- 支援狀態顯示（如 COMPLETED）

### 3. `StatsDisplay` 組件
統一的統計數據顯示組件，包括：
- 候選數量顯示
- 標記進度顯示
- 進度條視覺化
- 完成狀態指示

### 4. `StageHeader` 組件
統一的 Stage 標題組件，包括：
- Stage 編號和標題
- 圖標顯示
- 內建運行選擇器
- 自定義操作按鈕區域

## 重構後的組件

### Stage1AutomationRefactored
- 使用 `useExperimentRunData` 管理數據
- 使用 `StageHeader` 統一標題
- 使用 `StatsDisplay` 顯示統計
- 簡化的參數配置界面

### Stage2LabelingRefactored
- 使用 `useExperimentRunData` 管理數據
- 統一的完成標記邏輯
- 改善的狀態管理
- 更清晰的條件渲染

## 架構改善

### 1. 分離關注點
- **數據管理**：集中在 `useExperimentRunData`
- **UI 組件**：分離成可重用的組件
- **業務邏輯**：保留在各自的 stage 組件中

### 2. 減少重複代碼
- URL 同步邏輯統一在 `useRunSync`
- 運行管理邏輯統一在 `useExperimentRunData`
- UI 組件可在多個 stage 間重用

### 3. 類型安全
- 完整的 TypeScript 類型定義
- 統一的介面和 props

### 4. 一致性
- 統一的 UI 風格和交互模式
- 一致的錯誤處理
- 統一的載入狀態管理

## 使用指南

### 替換現有組件
要使用重構後的組件，只需要：
1. 替換組件導入
2. 更新 props（如果有變化）
3. 測試功能

### 擴展新功能
要添加新的 stage 或功能：
1. 使用 `useExperimentRunData` hook
2. 使用共用的 UI 組件
3. 添加特定的業務邏輯

## 性能改善

1. **減少重複渲染**：統一的狀態管理減少不必要的重新渲染
2. **更好的記憶化**：使用 `useCallback` 和 `useMemo` 優化
3. **條件載入**：只在需要時載入數據

## 向後兼容性

重構後的組件保持與原始組件相同的外部介面，確保：
- 相同的 props 介面
- 相同的行為
- 相同的功能

## 未來改善方向

1. **更多共用組件**：可以創建更多的共用 UI 組件
2. **狀態管理**：考慮使用 Context 或狀態管理庫
3. **測試覆蓋**：增加單元測試和整合測試
4. **性能監控**：添加性能監控和優化

## 遷移步驟

1. **測試新組件**：確保新組件功能正確
2. **逐步替換**：一次替換一個 stage
3. **測試整合**：確保所有 stage 間的交互正常
4. **清理舊代碼**：移除不再使用的舊組件和 hook
