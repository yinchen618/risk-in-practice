#!/usr/bin/env python3

import requests
import json
import time

def test_erm_baseline_training():
    """測試 ERM_BASELINE 模型訓練請求"""

    # API endpoint
    url = "http://localhost:8000/api/v2/trained-models"

    # 複製用戶的實際請求數據
    payload = {
        "name": "ERM_BASELINE_2025-08-26T21-20-04",
        "scenarioType": "ERM_BASELINE",
        "experimentRunId": "00aea3fa-691e-4dd0-be9e-48e112314224",
        "modelConfig": "{\"classPrior\":0.05,\"windowSize\":60,\"modelType\":\"LSTM\",\"hiddenSize\":128,\"numLayers\":2,\"activationFunction\":\"ReLU\",\"dropout\":0.2,\"epochs\":100,\"batchSize\":128,\"optimizer\":\"Adam\",\"learningRate\":0.001,\"l2Regularization\":0.0001,\"earlyStopping\":true,\"patience\":10,\"learningRateScheduler\":\"none\"}",
        "dataSourceConfig": "{\"selectedDatasets\":[],\"trainRatio\":70,\"validationRatio\":20,\"testRatio\":10,\"timeRange\":{\"startDate\":\"\",\"endDate\":\"\"}}"
    }

    headers = {
        "Content-Type": "application/json"
    }

    try:
        print("🚀 發送 ERM_BASELINE 訓練請求...")
        print(f"📋 請求內容:")
        print(f"   - 模型名稱: {payload['name']}")
        print(f"   - 場景類型: {payload['scenarioType']}")
        print(f"   - 實驗 ID: {payload['experimentRunId']}")
        print(f"   - 模型配置: {payload['modelConfig']}")

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

            return job_id, model_id
        else:
            print(f"❌ 請求失敗: {response.text}")
            return None, None

    except requests.exceptions.ConnectionError:
        print("❌ 無法連接到後端服務，請確保後端在 localhost:8000 上運行")
        return None, None
    except Exception as e:
        print(f"❌ 發生錯誤: {e}")
        return None, None

if __name__ == "__main__":
    job_id, model_id = test_erm_baseline_training()

    if job_id:
        print(f"\n⏳ 等待訓練完成...")
        print(f"💡 您可以監控後端日誌來查看訓練進度")
        print(f"💡 或者使用 WebSocket 連接到: ws://localhost:8000/api/v2/training-jobs/{job_id}/logs")
