# 使用重構後的組件

## 快速開始

### 1. 使用新的 Hook

```typescript
import { useExperimentRunData } from "./utils/useExperimentRunData";

function MyComponent() {
  // 獲取所有運行
  const experimentData = useExperimentRunData();
  
  // 或者只獲取已完成的運行
  const completedData = useExperimentRunData("COMPLETED");
  
  return (
    // 使用 experimentData...
  );
}
```

### 2. 使用共用組件

```typescript
import { StageHeader, RunSelector, StatsDisplay } from "./components/shared";

function MyStage() {
  const experimentData = useExperimentRunData();
  
  return (
    <>
      <StageHeader
        stageNumber={1}
        title="My Stage"
        icon={MyIcon}
        selectedRunId={experimentData.selectedRunId}
        onRunChange={experimentData.setSelectedRunId}
        experimentRuns={experimentData.experimentRuns}
        isLoadingRuns={experimentData.isLoadingRuns}
        showCreateButton={true}
        onCreateNew={() => experimentData.createNewRun()}
      />
      
      <StatsDisplay
        candidateCount={experimentData.candidateCount}
        labeledPositive={experimentData.labeledPositive}
        labeledNormal={experimentData.labeledNormal}
      />
    </>
  );
}
```

### 3. 替換現有組件

要使用重構後的組件，只需要更新導入：

```typescript
// 原來
import { Stage1Automation } from "./components/Stage1Automation";

// 改為
import { Stage1AutomationRefactored as Stage1Automation } from "./components";
```

## 主要改善

1. **統一的數據管理**：所有 stage 使用相同的數據管理邏輯
2. **可重用的組件**：共用的 UI 組件減少重複代碼
3. **更好的類型安全**：完整的 TypeScript 支援
4. **一致的用戶體驗**：統一的 UI 和交互模式

## 遷移清單

- [x] 修正編譯錯誤
- [x] 創建 `useExperimentRunData` hook
- [x] 創建共用 UI 組件
- [x] 重構 Stage 1 和 Stage 2
- [ ] 重構 Stage 3 和 Stage 4
- [ ] 更新主頁面使用新組件
- [ ] 添加測試
- [ ] 更新文檔
