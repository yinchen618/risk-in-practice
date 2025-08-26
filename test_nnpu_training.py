#!/usr/bin/env python3
"""
Test nnPU Training API - 測試完整的 nnPU 訓練流程
"""

import requests
import json
import time
from datetime import datetime

# 配置
BACKEND_URL = "http://localhost:8000"

def test_nnpu_training():
    """測試完整的 nnPU 訓練工作流程"""

    print("🚀 開始測試 nnPU 訓練功能...")
    print(f"⏰ 測試時間: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)

    # Step 1: 測試 backend 健康狀態
    print("📡 Step 1: 檢查後端服務狀態")
    try:
        response = requests.get(f"{BACKEND_URL}/")
        if response.status_code == 200:
            print("✅ 後端服務正常運行")
            result = response.json()
            print(f"   訊息: {result.get('message', 'N/A')}")
        else:
            print(f"❌ 後端服務狀態異常: {response.status_code}")
            return
    except Exception as e:
        print(f"❌ 無法連接到後端服務: {e}")
        return

    # Step 2: 準備 nnPU 訓練配置
    print("\n🔧 Step 2: 準備 nnPU 訓練配置")
    training_config = {
        "experiment_id": 12345,
        "training_config": {
            # PU Learning 策略
            "classPrior": 0.1,
            "windowSize": 60,

            # 模型架構
            "modelType": "LSTM",
            "hiddenSize": 128,
            "numLayers": 2,
            "activationFunction": "ReLU",
            "dropout": 0.2,

            # 訓練過程
            "epochs": 50,  # 減少訓練周期以便測試
            "batchSize": 32,
            "optimizer": "Adam",
            "learningRate": 0.001,
            "l2Regularization": 0.0001,

            # 訓練穩定性
            "earlyStopping": True,
            "patience": 10,
            "learningRateScheduler": "StepLR"
        },
        "data_source_config": {
            "trainRatio": 70,
            "validationRatio": 15,
            "testRatio": 15,
            "timeRange": "last_month"
        }
    }

    print("📋 nnPU 訓練配置:")
    print(f"   • 模型類型: {training_config['training_config']['modelType']}")
    print(f"   • Class Prior: {training_config['training_config']['classPrior']}")
    print(f"   • 隱藏層大小: {training_config['training_config']['hiddenSize']}")
    print(f"   • 訓練周期: {training_config['training_config']['epochs']}")
    print(f"   • 批次大小: {training_config['training_config']['batchSize']}")
    print(f"   • 學習率: {training_config['training_config']['learningRate']}")
    print(f"   • 早期停止: {training_config['training_config']['earlyStopping']}")

    # Step 3: 啟動訓練工作
    print("\n🎯 Step 3: 啟動 nnPU 訓練工作")
    try:
        response = requests.post(
            f"{BACKEND_URL}/api/v2/start-training",
            json=training_config,
            headers={"Content-Type": "application/json"},
            timeout=30
        )

        print(f"響應狀態碼: {response.status_code}")
        print(f"響應內容: {response.text}")

        if response.status_code == 200:
            result = response.json()
            task_id = result.get("task_id")
            print(f"✅ 訓練工作已啟動!")
            print(f"   • Task ID: {task_id}")
            print(f"   • 狀態: {result.get('status', 'unknown')}")
            print(f"   • 訊息: {result.get('message', 'N/A')}")

            # Step 4: 等待一段時間讓訓練完成
            print(f"\n📊 Step 4: 等待訓練完成...")
            time.sleep(10)  # 等待 10 秒

            # Step 5: 查詢訓練結果
            check_training_results(task_id)

        else:
            print(f"❌ 啟動訓練失敗: {response.status_code}")
            print(f"   錯誤訊息: {response.text}")

    except Exception as e:
        print(f"❌ 啟動訓練時發生錯誤: {e}")

def check_training_results(task_id):
    """查詢訓練結果"""
    print(f"\n🔍 Step 5: 查詢訓練結果 (Task ID: {task_id})")

    try:
        # 查詢訓練工作狀態
        print("📊 查詢訓練工作...")
        response = requests.get(f"{BACKEND_URL}/api/v2/training-jobs")

        if response.status_code == 200:
            jobs = response.json()
            task_jobs = [job for job in jobs if job.get('taskId') == task_id]

            if task_jobs:
                job = task_jobs[0]
                print(f"✅ 找到訓練工作:")
                print(f"   • Job ID: {job.get('id')}")
                print(f"   • 狀態: {job.get('status')}")
                print(f"   • 模型類型: {job.get('modelType')}")
                print(f"   • 開始時間: {job.get('startedAt')}")
                print(f"   • 完成時間: {job.get('completedAt')}")

                if job.get('metrics'):
                    metrics = job.get('metrics')
                    print(f"   • 訓練指標: {json.dumps(metrics, indent=4, ensure_ascii=False)}")
            else:
                print(f"❌ 找不到 Task ID {task_id} 的訓練工作")
        else:
            print(f"❌ 查詢訓練工作失敗: {response.status_code}")

        # 查詢訓練模型
        print("\n🤖 查詢訓練模型...")
        response = requests.get(f"{BACKEND_URL}/api/v2/trained-models")

        if response.status_code == 200:
            models = response.json()
            task_models = [model for model in models if model.get('taskId') == task_id]

            if task_models:
                model = task_models[0]
                print(f"✅ 找到訓練模型:")
                print(f"   • Model ID: {model.get('id')}")
                print(f"   • 模型名稱: {model.get('modelName')}")
                print(f"   • 模型類型: {model.get('modelType')}")
                print(f"   • 狀態: {model.get('status')}")
                print(f"   • 模型路徑: {model.get('modelPath')}")

                if model.get('trainingMetrics'):
                    metrics = model.get('trainingMetrics')
                    print(f"   • 訓練指標: {json.dumps(metrics, indent=4, ensure_ascii=False)}")

                if model.get('trainingLog'):
                    logs = model.get('trainingLog')
                    print(f"   • 訓練日誌: {len(logs)} 條記錄")
            else:
                print(f"❌ 找不到 Task ID {task_id} 的訓練模型")
        else:
            print(f"❌ 查詢訓練模型失敗: {response.status_code}")

    except Exception as e:
        print(f"❌ 查詢結果時發生錯誤: {e}")

if __name__ == "__main__":
    test_nnpu_training()
    print("\n" + "=" * 60)
    print("🎉 nnPU 訓練測試完成!")
