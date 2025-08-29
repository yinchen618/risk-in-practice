# API 端點與訓練流程分析報告

## 🔍 **API 端點分析**

### **1. `/api/v2/trained-models` (POST)**
- **用途**: 創建訓練模型記錄並啟動訓練
- **實現位置**: `backend/routes/case_study_v2.py` 第 2906 行
- **訓練方式**: 直接在路由中實現 PU Learning 訓練
- **是否使用 ModelTrainer**: ❌ **NO** - 不會調用我們的 F1 監控代碼

### **2. `/api/v2/start-training` (POST)**  
- **用途**: 啟動 nnPU 模型訓練工作
- **實現位置**: `backend/routes/case_study_v2.py` 第 4879 行
- **訓練方式**: 調用 `model_trainer.train_model()`
- **是否使用 ModelTrainer**: ✅ **YES** - 會調用我們的 F1 監控代碼

## 🎯 **重要發現**

### ✅ **有使用我們 F1 監控的端點**

**`/api/v2/start-training`** 端點會**真正調用**我們的 F1-Score 監控訓練代碼：

```python
@case_study_v2_router.post("/start-training")
async def start_nnpu_training(request: dict):
    # ... 參數驗證和配置處理 ...
    
    # 👇 這裡會調用我們的 ModelTrainer
    asyncio.create_task(
        model_trainer.train_model(
            job_id=str(task_id),
            trained_model_id=str(uuid.uuid4()),
            config=training_request
        )
    )
```

### ❌ **不使用我們 F1 監控的端點**

**`/api/v2/trained-models`** 端點使用自己的訓練實現：

```python
@case_study_v2_router.post("/trained-models")
async def create_trained_model(request: dict):
    # ... 創建模型記錄 ...
    
    # 👇 這裡調用路由文件內的訓練函數
    asyncio.create_task(run_training_job(model_id, job_id))
```

## 📊 **流程對比**

### **端點 1: `/api/v2/trained-models`**
```
前端請求 → routes/case_study_v2.py → run_training_job() 
         → 直接在路由中實現的 PU Learning 訓練
         → ❌ 不使用我們的 F1 監控代碼
```

### **端點 2: `/api/v2/start-training`**
```
前端請求 → routes/case_study_v2.py → model_trainer.train_model()
         → services/case_study_v2/model_trainer.py
         → ✅ 使用我們的 F1 監控代碼
```

## 🔧 **參數格式差異**

### **`/api/v2/trained-models`** 需要：
```json
{
  "name": "模型名稱",
  "scenario_type": "ERM_BASELINE", 
  "experimentRunId": "實驗運行ID",
  "modelConfig": { ... },
  "dataSourceConfig": { ... }
}
```

### **`/api/v2/start-training`** 需要：
```json
{
  "experiment_id": "實驗ID",
  "training_config": { ... },
  "data_source_config": { ... }
}
```

## 🎯 **結論**

### ✅ **回答您的問題**：

1. **`/api/v2/trained-models` 端點**：
   - ❌ **不會**進入 `backend/services/case_study_v2/model_trainer.py`
   - ❌ **不會**使用我們的 F1-Score 監控功能
   - 使用自己在路由文件中實現的訓練邏輯

2. **`/api/v2/start-training` 端點**：
   - ✅ **會**進入 `backend/services/case_study_v2/model_trainer.py`
   - ✅ **會**使用我們的 F1-Score 監控功能
   - 調用我們實現的 `model_trainer.train_model()` 方法

## 🚀 **建議**

如果您想使用我們實現的 F1-Score 監控功能，應該：

1. **使用 `/api/v2/start-training` 端點**
2. **或者修改 `/api/v2/trained-models` 端點**，讓它也調用我們的 `model_trainer.train_model()`

這樣就能確保前端能看到我們增強的訓練日誌格式：
```
Epoch 1/100 - Train Loss: 0.123, Val Loss: 90.5, Val F1: 0.15
Epoch 2/100 - Train Loss: 0.101, Val Loss: 85.2, Val F1: 0.25 (New best model!)
```
