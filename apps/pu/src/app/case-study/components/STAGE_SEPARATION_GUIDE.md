## Stage 3 和 Stage 4 分離使用說明

### 設計理念

**Stage 3: Model Training & Prediction Workbench**
- 專注於模型訓練和預測執行
- 包含實驗配置、訓練監控、預測執行
- 訓練完成後提示用戶進入 Stage 4 分析結果

**Stage 4: Results Analysis & Model Performance Evaluation**
- 專注於結果分析和模型性能評估
- 包含歷史結果載入、性能比較、深度分析
- 提供統計洞察和性能概覽

### 在主頁面中的使用方式

```tsx
import { Stage3ExperimentWorkbench, Stage4ResultsAnalysis } from "./components/experiment";

// 在你的主要組件中：
function CaseStudyPage() {
  const [currentStage, setCurrentStage] = useState<3 | 4>(3);
  const [selectedRunId, setSelectedRunId] = useState<string>("");

  return (
    <div>
      {/* Stage Navigation */}
      <div className="flex gap-4 mb-6">
        <Button 
          variant={currentStage === 3 ? "default" : "outline"}
          onClick={() => setCurrentStage(3)}
        >
          Stage 3: Model Training & Prediction
        </Button>
        <Button 
          variant={currentStage === 4 ? "default" : "outline"}
          onClick={() => setCurrentStage(4)}
        >
          Stage 4: Results Analysis
        </Button>
      </div>

      {/* Stage Content */}
      {currentStage === 3 && (
        <Stage3ExperimentWorkbench 
          selectedRunId={selectedRunId} 
        />
      )}
      
      {currentStage === 4 && (
        <Stage4ResultsAnalysis 
          selectedRunId={selectedRunId} 
        />
      )}
    </div>
  );
}
```

### 功能分配

#### Stage 3 專屬功能：
- ✅ 實驗配置（情境選擇、數據源設定、模型參數）
- ✅ 模型訓練監控（進度、日誌、超參數）
- ✅ 預測執行監控（Generalization Challenge 評估）
- ✅ WebSocket 實時通信
- ✅ 訓練數據概覽

#### Stage 4 專屬功能：
- ✅ 歷史實驗結果載入和展示
- ✅ 模型性能比較分析
- ✅ 統計洞察（泛化差距、平均性能）
- ✅ 詳細結果分析界面
- ✅ 實驗結果導出工具

### 數據流設計

1. **Stage 3** 完成訓練/預測後，將結果保存到後端
2. **Stage 4** 從後端載入所有歷史結果進行分析
3. 兩個 Stage 之間通過 `selectedRunId` 共享實驗運行上下文
4. 狀態管理透過各自的 custom hooks 進行隔離

### 優勢

- **關注點分離**：每個 Stage 專注於特定功能領域
- **性能優化**：Stage 4 不需要載入訓練相關的重型組件
- **用戶體驗**：清晰的工作流程，避免界面過於複雜
- **維護性**：模組化設計，easier to test and maintain
