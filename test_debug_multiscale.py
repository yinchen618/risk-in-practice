#!/usr/bin/env python3

import requests
import json
import time

def test_multiscale_training():
    """測試多尺度特徵提取的調試日誌"""

    # API endpoint
    url = "http://localhost:8000/api/v2/trained-models"

    # 測試數據
    payload = {
        "name": "Debug Test nnPU Model",
        "scenarioType": "nnpu_baseline",
        "experimentRunId": "00aea3fa-691e-4dd0-be9e-48e112314224",
        "modelConfig": {
            "learning_rate": 0.01,
            "epochs": 20,
            "hidden_dim": 64,
            "feature_engineering": {
                "main_window_size_minutes": 90
            }
        },
        "dataSourceConfig": {
            "dataset_ids": ["c198e6254b83y1sqk3wz"]
        }
    }

    headers = {
        "Content-Type": "application/json"
    }

    try:
        print("🚀 發送訓練請求...")
        response = requests.post(url, headers=headers, data=json.dumps(payload))

        print(f"📊 回應狀態碼: {response.status_code}")
        print(f"📋 回應內容: {response.text}")

        if response.status_code == 200:
            result = response.json()
            job_id = result.get('jobId')
            model_id = result.get('id')
            print(f"✅ 訓練作業已啟動！")
            print(f"   - 模型 ID: {model_id}")
            print(f"   - 作業 ID: {job_id}")
            print(f"   - 請檢查後端日誌以查看詳細的調試信息")
        else:
            print(f"❌ 請求失敗: {response.text}")

    except requests.exceptions.ConnectionError:
        print("❌ 無法連接到後端服務，請確保後端在 localhost:8000 上運行")
    except Exception as e:
        print(f"❌ 發生錯誤: {e}")

if __name__ == "__main__":
    test_multiscale_training()
