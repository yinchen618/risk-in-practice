# Stage 3 Training Components - 重構後結構

## 📁 檔案結構

```
components/
├── Stage3ModelTraining.tsx              # 主要組件 (重構後)
├── Stage3ModelTraining_backup.tsx       # 原始組件備份
├── Stage3ModelTraining_refactored.tsx   # 重構版本 (與主要組件相同)
└── training/                            # 訓練相關子組件目錄
    ├── index.ts                        # 統一導出文件
    ├── types.ts                        # 類型定義
    ├── hooks.ts                        # 自定義 hooks
    ├── TrainingDataStatsPanel.tsx      # 數據統計面板
    ├── SampleDistributionPanel.tsx     # 樣本分佈視覺化面板
    ├── TrainingMonitorPanel.tsx        # 訓練監控面板
    ├── ModelConfigurationPanel.tsx     # 模型配置面板
    └── TrainingCompletionCard.tsx      # 訓練完成狀態卡片
```

## 🔧 組件職責分離

### 1. **主要組件** - `Stage3ModelTraining.tsx`
- **職責**: 整體狀態管理和布局協調
- **特點**: 精簡的邏輯，主要負責數據流和子組件整合
- **大小**: ~200 行 (原來 800+ 行)

### 2. **數據統計面板** - `TrainingDataStatsPanel.tsx`
- **職責**: 顯示正樣本和未標記樣本的統計信息
- **特點**: 純展示組件，支持加載狀態
- **Props**: `trainingDataStats`, `isLoading`

### 3. **樣本分佈面板** - `SampleDistributionPanel.tsx`
- **職責**: 2D 散點圖視覺化 P/U 樣本分佈
- **特點**: SVG 繪圖，交互式散點圖，支持重試加載
- **Props**: `sampleDistribution`, `isLoading`, `onRetryLoad`

### 4. **訓練監控面板** - `TrainingMonitorPanel.tsx`
- **職責**: 即時訓練進度、損失曲線、準確率監控
- **特點**: 動態圖表，即時更新，訓練狀態指示
- **Props**: `trainingStage`, `trainingProgress`, `currentEpoch`, `totalEpochs`, `trainingLogs`

### 5. **模型配置面板** - `ModelConfigurationPanel.tsx`
- **職責**: 模型參數配置和訓練控制
- **特點**: 表單驗證，參數設置，訓練操作按鈕
- **Props**: 所有模型參數和對應的 setter 函數

### 6. **訓練完成卡片** - `TrainingCompletionCard.tsx`
- **職責**: 訓練完成後的結果展示和操作
- **特點**: 結果摘要，導航按鈕，模型信息
- **Props**: `modelId`, `resultsMeta`, `onViewResults`, `onResetTraining`

## 🎣 自定義 Hooks

### 1. **useTrainingData**
- **職責**: 管理訓練數據載入和視覺化數據
- **返回**: `trainingDataStats`, `sampleDistribution`, `loadingStates`, `loadFunctions`

### 2. **useTrainingJob**
- **職責**: 管理訓練任務狀態、輪詢、和結果處理
- **返回**: 完整的訓練狀態和控制函數

## 📋 類型定義 - `types.ts`

```typescript
- TrainingStage: "ready" | "training" | "completed"
- ModelType: "uPU" | "nnPU"
- TrainingDataStats: { positiveSamples, unlabeledSamples }
- SampleDistribution: { pSamples, uSamples }
- TrainingLog: { epoch, loss, accuracy }
- ModelParameters: 完整的模型配置類型
```

## 🚀 優點

### 1. **可維護性**
- 每個組件職責單一，易於理解和修改
- 代碼分離讓 bug 定位更容易
- 測試更容易針對單一功能進行

### 2. **可重用性**
- 子組件可以在其他地方獨立使用
- 自定義 hooks 可以在類似場景中重用
- 類型定義可以跨組件共享

### 3. **性能優化**
- 組件更小，重新渲染範圍更精確
- 可以針對特定組件進行 memo 優化
- 狀態變更影響範圍更小

### 4. **開發體驗**
- 檔案更小，編輯器性能更好
- 團隊協作時衝突更少
- 功能定位更快速

## 📦 使用方式

```typescript
// 從統一入口導入
import { 
  Stage3ModelTraining,
  TrainingDataStatsPanel,
  useTrainingData,
  type TrainingStage 
} from './components/training';

// 或者直接導入
import { Stage3ModelTraining } from './components/Stage3ModelTraining';
```

## 🔄 遷移說明

1. **原始組件**: 已備份為 `Stage3ModelTraining_backup.tsx`
2. **新組件**: 功能完全相同，但結構更清晰
3. **向後兼容**: API 接口保持不變
4. **漸進式採用**: 可以逐步使用子組件來構建其他功能

這次重構大幅提升了代碼的組織性和可維護性，讓每個組件都有明確的職責，便於後續的功能擴展和維護。
