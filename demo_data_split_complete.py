#!/usr/bin/env python3
"""
P樣本集三重切分功能完整演示
展示從前端 UI 到後端訓練的完整工作流程
"""

import json
from datetime import datetime

def generate_frontend_payload_example():
    """生成前端送到後端的完整請求範例"""

    # 模擬前端 DataSplitConfigPanel 的配置
    data_split_config = {
        "enabled": True,
        "train_ratio": 0.7,
        "validation_ratio": 0.15,
        "test_ratio": 0.15
    }

    # 模擬完整的訓練請求 payload
    training_payload = {
        "experiment_run_id": "exp_20241225_pu_split_demo",
        "model_params": {
            "model_type": "nnPU",
            "prior_method": "median",
            "class_prior": None,
            "hidden_units": 100,
            "activation": "relu",
            "lambda_reg": 0.005,
            "optimizer": "adam",
            "learning_rate": 0.005,
            "epochs": 50,
            "batch_size": 64,
            "seed": 42,
            "feature_version": "fe_v1"
        },
        "prediction_start_date": "2024-01-01",
        "prediction_end_date": "2024-01-31",
        "data_split_config": data_split_config
    }

    return training_payload

def demonstrate_data_splitting_workflow():
    """演示數據切分工作流程"""

    print("🎯 P樣本集三重切分功能完整演示")
    print("=" * 60)

    # 1. 前端配置展示
    print("\n📱 1. 前端 UI 配置")
    print("-" * 30)
    payload = generate_frontend_payload_example()
    split_config = payload["data_split_config"]

    print(f"✅ 啟用數據切分: {split_config['enabled']}")
    print(f"📊 訓練集比例: {split_config['train_ratio'] * 100}%")
    print(f"📊 驗證集比例: {split_config['validation_ratio'] * 100}%")
    print(f"📊 測試集比例: {split_config['test_ratio'] * 100}%")

    # 2. 模擬樣本統計
    print(f"\n🧮 2. 樣本統計模擬")
    print("-" * 30)
    total_positive = 120  # 模擬總正樣本數
    total_unlabeled = 800  # 模擬總未標記樣本數

    train_p = int(total_positive * split_config['train_ratio'])
    val_p = int(total_positive * split_config['validation_ratio'])
    test_p = total_positive - train_p - val_p

    train_u = int(total_unlabeled * split_config['train_ratio'])
    val_u = int(total_unlabeled * split_config['validation_ratio'])
    test_u = total_unlabeled - train_u - val_u

    print(f"📈 P樣本分配 - 訓練: {train_p}, 驗證: {val_p}, 測試: {test_p}")
    print(f"📈 U樣本分配 - 訓練: {train_u}, 驗證: {val_u}, 測試: {test_u}")
    print(f"📈 總計 - 訓練: {train_p + train_u}, 驗證: {val_p + val_u}, 測試: {test_p + test_u}")

    # 3. API 請求展示
    print(f"\n🌐 3. API 請求 JSON")
    print("-" * 30)
    print("POST /api/v1/models/train-and-predict")
    print("Content-Type: application/json")
    print()
    print(json.dumps(payload, indent=2, ensure_ascii=False))

    # 4. 後端處理流程
    print(f"\n⚙️  4. 後端處理流程")
    print("-" * 30)
    steps = [
        "接收訓練請求並驗證數據切分配置",
        "載入 P 樣本和 U 樣本數據",
        "執行特徵工程和數據預處理",
        "根據配置比例進行三重切分:",
        "  • P樣本按比例分割為 Train/Val/Test",
        "  • U樣本非重疊分配避免 data leakage",
        "估計類別先驗並開始模型訓練",
        "在驗證集上監控訓練進度",
        "在測試集上進行獨立評估",
        "保存模型和測試集樣本ID到數據庫",
        "為 Stage 4 提供獨立測試集"
    ]

    for i, step in enumerate(steps, 1):
        print(f"{i:2d}. {step}")

    # 5. 數據庫存儲展示
    print(f"\n🗄️  5. 數據庫存儲結構")
    print("-" * 30)

    db_record = {
        "job_id": "uuid-generated-job-id",
        "experiment_run_id": payload["experiment_run_id"],
        "model_type": payload["model_params"]["model_type"],
        "model_path": "/tmp/pu_models/model_uuid_20241225_143022.pkl",
        "model_config": payload["model_params"],
        "training_metrics": {
            "train_accuracy": 0.85,
            "val_accuracy": 0.82,
            "test_accuracy": 0.80,
            "test_precision": 0.78,
            "test_recall": 0.83,
            "test_f1": 0.80
        },
        "test_sample_ids": [
            "event_001", "event_034", "event_087", "event_156",
            "unlabeled_445", "unlabeled_623", "unlabeled_789"
        ],
        "data_split_config": split_config,
        "status": "COMPLETED",
        "created_at": datetime.now().isoformat()
    }

    print("trained_models 表記錄:")
    print(json.dumps(db_record, indent=2, ensure_ascii=False))

    # 6. Stage 4 集成展示
    print(f"\n🎯 6. Stage 4 模型評估集成")
    print("-" * 30)
    stage4_features = [
        "✅ 從數據庫讀取 test_sample_ids",
        "✅ 載入對應的測試集樣本數據",
        "✅ 使用保存的模型進行獨立預測",
        "✅ 計算無偏的性能指標",
        "✅ 生成可信的評估報告",
        "✅ 防止 data leakage 的獨立驗證"
    ]

    for feature in stage4_features:
        print(f"  {feature}")

    print(f"\n🎉 功能實現完成!")
    print("=" * 60)
    print("✨ P樣本集三重切分功能提供:")
    print("   🔸 透明的數據分割過程")
    print("   🔸 用戶可控的分割比例")
    print("   🔸 防止 data leakage 的設計")
    print("   🔸 獨立的測試集評估")
    print("   🔸 完整的 Stage 4 集成支持")
    print("   🔸 實驗可重現性保證")

if __name__ == "__main__":
    demonstrate_data_splitting_workflow()
