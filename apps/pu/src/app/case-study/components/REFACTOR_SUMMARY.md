# DataExplorationPhase 重構總結

## 重構內容

### 1. 創建公用工具檔案
- **`utils/shared-utils.ts`**: 包含所有共用的工具函式
  - `pad2()`, `formatTaipeiISO()`, `extractHHMMFromISO()` - 日期時間格式化
  - `formatParamValue()` - 參數值格式化顯示
  - `paramLabels` - 參數標籤映射
  - `loadAmmeterMap()` - 載入電表映射
  - `loadExperimentRuns()`, `createNewExperimentRun()` - 實驗執行管理
  - `calculateCandidates()` - 候選計算

### 2. 創建自定義 Hooks
- **`utils/useStage1Logic.ts`**: Stage 1 的所有狀態管理和邏輯
  - 管理所有 Stage 1 相關的狀態
  - 處理實驗執行的 CRUD 操作
  - 處理參數計算和候選生成
  - 提供 URL 同步功能

- **`utils/useStage2Logic.ts`**: Stage 2 的邏輯
  - 處理完成標記功能
  - 管理完成狀態

### 3. 重構主組件
- **`DataExplorationPhase.tsx`**: 大幅簡化
  - 移除了大量的狀態管理代碼
  - 移除了所有的 API 調用邏輯
  - 移除了工具函式
  - 現在只負責 UI 渲染和組件協調
  - 使用自定義 hooks 管理狀態和邏輯

### 4. 更新子組件
- **`Stage1Automation.tsx`**: 移除了重複的工具函式，改用共用工具
- **`Stage2Labeling.tsx`**: 清理了未使用的 imports

## 重構後的優勢

### 1. **關注點分離**
- UI 邏輯與業務邏輯分離
- 每個檔案有明確的職責

### 2. **可重用性**
- 工具函式可以在多個組件間共用
- 自定義 hooks 可以在其他地方重用

### 3. **可維護性**
- 代碼結構更清晰
- 修改邏輯時只需要改對應的 hook 或工具檔案
- 減少重複代碼

### 4. **可測試性**
- 工具函式和 hooks 可以獨立測試
- 業務邏輯與 UI 分離，更容易進行單元測試

### 5. **性能優化**
- 使用 useCallback 和適當的依賴陣列
- 狀態更新更加精確

## 檔案結構

```
components/
├── DataExplorationPhase.tsx          # 主組件 (簡化後)
├── Stage1Automation.tsx              # Stage 1 UI 組件
├── Stage2Labeling.tsx                # Stage 2 UI 組件
└── utils/
    ├── shared-utils.ts               # 共用工具函式
    ├── useStage1Logic.ts             # Stage 1 業務邏輯 hook
    └── useStage2Logic.ts             # Stage 2 業務邏輯 hook
```

## 重構前後對比

### 重構前
- `DataExplorationPhase.tsx`: ~1654 行
- 大量的狀態管理、API 調用、工具函式混雜在一起
- 難以維護和測試

### 重構後
- `DataExplorationPhase.tsx`: ~176 行
- 清晰的組件職責劃分
- 易於維護和擴展

## 注意事項

1. **向後相容**: 所有現有功能都保持不變
2. **類型安全**: 所有 TypeScript 類型都得到維護
3. **性能**: 沒有性能損失，某些情況下甚至有改善
4. **測試**: 建議為新的 hooks 和工具函式添加單元測試
