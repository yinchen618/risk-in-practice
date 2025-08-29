# PU Learning 訓練流程關鍵修正總結

## 概述

基於日誌分析和代碼檢查，我們識別並修正了 PU Learning 訓練流程中的四個關鍵問題，這些修正將大幅提升實驗結果的可靠性和用戶體驗。

## 🔧 修正內容

### 1. 【最關鍵】數據切分順序修正

**問題**:
- 原流程：先從 U 樣本中抽樣 → 再對抽樣後的數據進行時間切分
- 後果：測試集只代表被抽樣過的數據分佈，不具真實世界代表性

**修正** (`backend/routes/case_study_v2.py`):
```python
# ✅ 正確流程：先完整時間切分 → 再對訓練池抽樣
# 1. 載入完整數據（不抽樣）
all_samples = p_samples + u_samples  # 完整的 16,065 樣本

# 2. 對完整數據進行時間切分
train_pool = all_samples[:train_end]           # 70%
validation_pool = all_samples[train_end:val_end]  # 10%  
test_pool = all_samples[val_end:]              # 20%

# 3. 只對訓練池中的 U 樣本抽樣
train_u_subset = random.sample(train_u_full, u_sample_count)

# 4. 驗證集和測試集保持完整，代表真實分佈
```

**效果**:
- 測試集現在代表完整的數據分佈
- 評估結果更加客觀和可信
- 符合學術研究的最佳實踐

### 2. 【重要】classPrior 參數修正

**問題**:
- 前端傳入固定的 `classPrior: 0.05` (5%)
- 實際訓練集中 P 樣本比例為 49.2%
- nnPU 算法的風險估計嚴重偏差

**修正** (`backend/routes/case_study_v2.py`):
```python
# ✅ 計算訓練池中的真實 class_prior
true_class_prior_in_train_pool = len(train_p_samples) / len(train_pool)

# ✅ 覆蓋前端配置，使用真實比例
model_config['classPrior'] = true_class_prior_in_train_pool

logger.info(f"🔧 覆蓋 classPrior: {original:.4f} -> {true_class_prior:.4f}")
```

**效果**:
- nnPU 算法現在使用正確的類別先驗概率
- 損失函數計算更加準確
- 模型可以學到更好的決策邊界

### 3. 異步任務啟動時機優化

**問題**:
- WebSocket 連接在訓練完成後才建立
- 用戶在整個訓練過程中看不到進度

**修正** (`backend/routes/case_study_v2.py`):
```python
# ✅ API 端點立即返回響應
asyncio.create_task(run_training_job(model_id, job_id))

# ✅ 立即發送初始 WebSocket 狀態
if websocket_manager:
    await websocket_manager.send_training_log(job_id, {
        "type": "status", 
        "message": "🚀 Training job created and queued..."
    })

# ✅ 訓練函數一開始就發送日誌
async def run_training_job(model_id: str, job_id: str):
    # 立即發送第一條日誌
    await websocket_manager.send_training_log(job_id, {
        "type": "status",
        "message": "🚀 Training job started! Initializing..."
    })
```

**效果**:
- 用戶點擊按鈕後立即看到進度反饋
- WebSocket 連接可以立即建立
- 更好的用戶體驗

### 4. 前端 WebSocket 連接邏輯優化

**問題**:
- WebSocket 連接失敗時沒有重試機制
- 連接錯誤處理不完善

**修正** (`apps/pu/src/app/case-study-v2/components/Stage3TrainingWorkbench.tsx`):
```typescript
// ✅ 添加重試機制
ws.onerror = (error) => {
    setTrainingLogs(prev => [...prev, "❌ WebSocket error - will retry in 2s"]);
    setTimeout(() => {
        startTrainingMonitor(jobId);  // 自動重試
    }, 2000);
};

// ✅ 添加延遲確保後端準備就緒
setTimeout(() => {
    const ws = new WebSocket(`ws://localhost:8000/api/v2/training-jobs/${jobId}/logs`);
    // ... WebSocket 邏輯
}, 500);
```

**效果**:
- WebSocket 連接更加穩定
- 自動重試機制提高可靠性
- 更好的錯誤處理和用戶反饋

## 🔍 修正前後對比

### 修正前的流程問題:
```
1. 載入 755 P + 15,310 U 樣本
2. ❌ 先抽樣 U → 7,550 樣本 (錯誤順序)
3. 對 755 P + 7,550 U = 8,305 樣本切分
4. 測試集: 1,662 樣本 (不具代表性)
5. ❌ 使用固定 classPrior=0.05 (錯誤比例)
6. ❌ WebSocket 在訓練完成後才連接
```

### 修正後的正確流程:
```
1. 載入 755 P + 15,310 U = 16,065 完整樣本
2. ✅ 先時間切分 → 訓練池/驗證池/測試池
3. ✅ 再對訓練池的 U 樣本抽樣
4. 測試集: 3,213 樣本 (完整代表性)
5. ✅ 使用真實 classPrior≈0.085 (正確比例)
6. ✅ WebSocket 立即連接，即時反饋
```

## 📊 預期效果

1. **實驗結果更可靠**: 測試集代表完整數據分佈
2. **模型訓練更準確**: 正確的 classPrior 參數
3. **用戶體驗更好**: 即時的訓練進度反饋
4. **系統更穩定**: 改進的錯誤處理和重試機制

## 🚀 測試建議

1. 創建新的訓練任務，觀察日誌輸出
2. 檢查 classPrior 是否使用計算出的真實值
3. 驗證 WebSocket 連接立即建立
4. 比較修正前後的測試集評估結果

這些修正將使您的 PU Learning 實驗更加符合學術標準並具備更強的說服力。
