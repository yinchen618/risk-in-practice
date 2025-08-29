# Stage3TrainingWorkbench API 端點選擇指南

## 🎯 **問題回答：您應該使用哪個端點？**

### ✅ **建議使用：`/api/v2/start-training`**

如果您想要使用我們實現的 **F1-Score 監控功能**，應該切換到 `/api/v2/start-training` 端點。

## 📊 **兩個端點的詳細對比**

### **1. `/api/v2/trained-models` (目前前端使用的)**

#### **特點**：
- ✅ **完整的數據庫管理**: 創建 trained_models 記錄
- ✅ **實際 PU Learning**: 使用真實數據進行訓練
- ✅ **WebSocket 支持**: 實時日誌傳輸
- ✅ **P/U 數據源分離**: 支持指定正負樣本數據源
- ❌ **不使用 F1 監控**: 不會調用我們的 ModelTrainer
- ❌ **傳統日誌格式**: 沒有 "Train Loss, Val Loss, Val F1" 格式

#### **參數格式**：
```json
{
  "name": "模型名稱",
  "scenario_type": "ERM_BASELINE",
  "experimentRunId": "實驗運行ID",
  "modelConfig": "JSON字符串",
  "dataSourceConfig": "JSON字符串"
}
```

#### **訓練實現**：
```
前端 → /api/v2/trained-models → run_training_job() 
     → 路由文件內的 PU Learning 實現
     → 傳統訓練日誌格式
```

---

### **2. `/api/v2/start-training` (建議使用的)**

#### **特點**：
- ✅ **F1-Score 監控**: 使用我們實現的監控功能
- ✅ **Enhanced 日誌格式**: "Epoch X - Train Loss: X, Val Loss: X, Val F1: X"
- ✅ **F1-based Early Stopping**: 基於 F1 分數的提前停止
- ✅ **最佳模型追蹤**: "(New best model!)" 標記
- ✅ **WebSocket 支持**: 實時日誌傳輸
- ❌ **簡化數據管理**: 不創建完整的數據庫記錄
- ❌ **參數格式不同**: 需要修改前端代碼

#### **參數格式**：
```json
{
  "experiment_id": "實驗ID",
  "training_config": {
    "classPrior": 0.3,
    "epochs": 100,
    "hiddenSize": 64,
    // ... 其他參數
  },
  "data_source_config": {
    "trainRatio": 70.0,
    "validationRatio": 20.0,
    "testRatio": 10.0,
    "timeRange": {"startDate": "...", "endDate": "..."}
  }
}
```

#### **訓練實現**：
```
前端 → /api/v2/start-training → model_trainer.train_model()
     → services/case_study_v2/model_trainer.py
     → 我們的 F1-Score 監控功能
```

## 🔧 **如何切換到 F1 監控端點**

### **Step 1: 修改 API 調用**

在 `Stage3TrainingWorkbench.tsx` 中修改 `startTraining` 函數：

```tsx
// 舊的實現
const response = await fetch(
  "http://localhost:8000/api/v2/trained-models",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: `${scenarioType}_${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}`,
      scenario_type: scenarioType,
      experimentRunId: experimentRun.id,
      modelConfig: JSON.stringify(modelConfig),
      dataSourceConfig: JSON.stringify(enhancedDataSourceConfig),
    }),
  },
);

// 新的實現 (使用 F1 監控)
const response = await fetch(
  "http://localhost:8000/api/v2/start-training",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      experiment_id: experimentRun.id,
      training_config: {
        classPrior: modelConfig.classPrior,
        windowSize: modelConfig.windowSize,
        modelType: modelConfig.modelType,
        hiddenSize: modelConfig.hiddenSize,
        numLayers: modelConfig.numLayers,
        activationFunction: modelConfig.activationFunction,
        dropout: modelConfig.dropout,
        epochs: modelConfig.epochs,
        batchSize: modelConfig.batchSize,
        optimizer: modelConfig.optimizer,
        learningRate: modelConfig.learningRate,
        l2Regularization: modelConfig.l2Regularization,
        earlyStopping: modelConfig.earlyStopping,
        patience: modelConfig.patience,
        learningRateScheduler: modelConfig.learningRateScheduler,
      },
      data_source_config: {
        trainRatio: enhancedDataSourceConfig.trainRatio,
        validationRatio: enhancedDataSourceConfig.validationRatio,
        testRatio: enhancedDataSourceConfig.testRatio,
        timeRange: enhancedDataSourceConfig.timeRange,
      },
    }),
  },
);
```

### **Step 2: 調整返回處理**

```tsx
if (response.ok) {
  const result = await response.json();
  console.log("✅ F1 Training job started:", result);
  
  // 注意：start-training 返回的格式可能不同
  // 需要根據實際返回值調整
  toast.success("F1 monitoring training started!");
  
  // WebSocket 監控
  if (result.task_id) {
    startTrainingMonitor(result.task_id);
  }
}
```

## 🎯 **期望的日誌效果**

切換後，您將在前端看到這樣的訓練日誌：

```
📊 Monitoring metrics: Train Loss, Val Loss, Val F1 Score
🎯 Early stopping target: Validation F1 Score (patience: 10)

Epoch 1/100 - Train Loss: 0.823, Val Loss: 1.8, Val F1: 0.15 (New best model!)
Epoch 2/100 - Train Loss: 0.791, Val Loss: 1.7, Val F1: 0.18 (New best model!)
Epoch 3/100 - Train Loss: 0.765, Val Loss: 1.6, Val F1: 0.17
...
📈 Training Status: F1 trend improving, no improvement for 2 epochs
...
🛑 Early stopping triggered after 45 epochs (patience: 10) - No F1 improvement
🎯 Best validation F1 score: 0.847
```

## 📋 **總結建議**

### ✅ **如果您想要 F1-Score 監控功能**：
- 使用 `/api/v2/start-training`
- 修改前端參數格式
- 享受增強的訓練監控體驗

### ✅ **如果您想保持現有功能**：
- 繼續使用 `/api/v2/trained-models`
- 但是無法使用我們的 F1 監控功能
- 保持現有的數據庫管理完整性

### 🚀 **最佳方案**：
修改 `/api/v2/trained-models` 端點，讓它在 `run_training_job()` 函數中調用我們的 `model_trainer.train_model()`，這樣就能同時享受：
- 完整的數據庫管理
- F1-Score 監控功能
- 不需要修改前端代碼
