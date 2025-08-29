#!/usr/bin/env python3
"""
測試 F1-Score 監控的腳本
測試我們新增的驗證集 F1-Score 監控和 Early Stopping 功能
"""

import asyncio
import json
import sys
import os

# 添加 backend 路徑到 Python 路徑
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from backend.services.case_study_v2.model_trainer import ModelTrainer
from backend.services.case_study_v2.database import DatabaseManager
from backend.services.case_study_v2.models import StartTrainingJobRequest, TrainingConfig, DataSourceConfig

async def test_f1_monitoring():
    """測試 F1-Score 監控功能"""
    print("🧪 測試 F1-Score 監控功能")
    print("=" * 50)

    # 初始化數據庫管理器
    db_manager = DatabaseManager()

    # 初始化模型訓練器
    trainer = ModelTrainer(db_manager)

    # 創建測試配置 - 啟用 Early Stopping 以便觀察 F1-based early stopping
    training_config = TrainingConfig(
        modelType="nnPU",
        epochs=100,  # 較多 epochs 來觀察 early stopping
        hiddenSize=128,
        numLayers=3,
        activationFunction="relu",
        dropout=0.3,
        windowSize=10,
        learningRate=0.001,
        batchSize=32,
        optimizer="adam",
        l2Regularization=0.01,
        earlyStopping=True,  # 啟用 early stopping
        patience=15,  # 15 epochs 的 patience
        learningRateScheduler="StepLR",
        classPrior=0.3
    )

    data_source_config = DataSourceConfig(
        trainRatio=0.7,
        validationRatio=0.2,
        testRatio=0.1,
        timeRange="2024_Q1"
    )

    request = StartTrainingJobRequest(
        training_config=training_config,
        data_source_config=data_source_config
    )

    # 模擬訓練任務
    job_id = "test_f1_monitoring_001"
    model_id = "model_test_f1_001"

    print(f"🚀 啟動測試訓練任務")
    print(f"   Job ID: {job_id}")
    print(f"   Model ID: {model_id}")
    print(f"   Early Stopping: 啟用 (patience: {training_config.patience})")
    print(f"   監控指標: Validation F1 Score")
    print("-" * 50)

    try:
        # 執行訓練
        await trainer.train_model(job_id, model_id, request)
        print("\n" + "=" * 50)
        print("✅ 測試完成！")
        print("📊 觀察上方的訓練日誌，您應該看到：")
        print("   1. 每個 epoch 顯示：Train Loss, Val Loss, Val F1")
        print("   2. 最佳模型標記：(New best model!)")
        print("   3. 階段性訓練診斷（每 25 epochs）")
        print("   4. F1-based Early Stopping（如果觸發）")
        print("   5. 最終最佳 F1 分數報告")

    except Exception as e:
        print(f"❌ 測試失敗: {e}")
        import traceback
        traceback.print_exc()

def main():
    """主函數"""
    print("🎯 F1-Score 監控測試腳本")
    print("這個腳本將演示新的訓練監控功能：")
    print("• 每個 epoch 顯示 Train Loss, Val Loss, Val F1")
    print("• Early Stopping 基於 F1 Score 而非 Loss")
    print("• 模型檢查點保存最佳 F1 Score 模型")
    print("• 階段性訓練狀態診斷")
    print()

    # 運行測試
    asyncio.run(test_f1_monitoring())

if __name__ == "__main__":
    main()
