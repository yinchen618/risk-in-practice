#!/usr/bin/env python3
"""
Stage 3 API Testing Script
測試 Stage 3 Training 和 Evaluation API 功能
"""

import requests
import json
import time
import uuid

BASE_URL = "http://localhost:8000/api/v2"

def test_trained_models_api():
    """測試 Trained Models API"""
    print("🧪 Testing Trained Models API...")

    # 1. List all trained models (should be empty initially)
    response = requests.get(f"{BASE_URL}/trained-models")
    print(f"📋 GET /trained-models: {response.status_code}")
    models = response.json()
    print(f"   Current models count: {len(models)}")

    # 2. Create a new training job
    training_data = {
        "name": f"Test_Model_{int(time.time())}",
        "scenarioType": "ERM_BASELINE",
        "experimentRunId": str(uuid.uuid4()),  # Mock experiment ID
        "modelConfig": {
            "modelType": "LSTM",
            "windowSize": 60,
            "hiddenSize": 128,
            "numLayers": 2,
            "dropout": 0.2,
            "learningRate": 0.001,
            "batchSize": 32,
            "epochs": 100
        },
        "dataSourceConfig": {
            "selectedDatasets": ["dataset1", "dataset2"],
            "trainRatio": 0.8,
            "timeRange": {
                "startDate": "2024-01-01",
                "endDate": "2024-12-31"
            }
        }
    }

    response = requests.post(f"{BASE_URL}/trained-models", json=training_data)
    print(f"🚀 POST /trained-models: {response.status_code}")
    if response.status_code == 200:
        new_model = response.json()
        print(f"   Created model ID: {new_model['id']}")
        print(f"   Status: {new_model['status']}")
        return new_model
    else:
        print(f"   Error: {response.text}")
        return None

def test_evaluation_runs_api(trained_model_id=None):
    """測試 Evaluation Runs API"""
    print("\n🧪 Testing Evaluation Runs API...")

    # 1. List all evaluation runs (should be empty initially)
    response = requests.get(f"{BASE_URL}/evaluation-runs")
    print(f"📋 GET /evaluation-runs: {response.status_code}")
    runs = response.json()
    print(f"   Current evaluation runs count: {len(runs)}")

    if trained_model_id:
        # 2. Create a new evaluation job
        evaluation_data = {
            "name": f"Test_Evaluation_{int(time.time())}",
            "scenarioType": "ERM_BASELINE",
            "trainedModelId": trained_model_id,
            "testSetSource": {
                "selectedDatasets": ["test_dataset1"],
                "timeRange": {
                    "startDate": "2024-01-01",
                    "endDate": "2024-03-31"
                }
            }
        }

        response = requests.post(f"{BASE_URL}/evaluation-runs", json=evaluation_data)
        print(f"🚀 POST /evaluation-runs: {response.status_code}")
        if response.status_code == 200:
            new_run = response.json()
            print(f"   Created evaluation ID: {new_run['id']}")
            print(f"   Status: {new_run['status']}")
            return new_run
        else:
            print(f"   Error: {response.text}")
    else:
        print("   ⚠️ Skipping evaluation creation (no trained model ID provided)")

    return None

def test_job_monitoring(model_id=None, evaluation_id=None):
    """測試工作監控功能"""
    print("\n🧪 Testing Job Monitoring...")

    if model_id:
        print("   🔍 Monitoring training job...")
        for i in range(10):
            response = requests.get(f"{BASE_URL}/trained-models")
            if response.status_code == 200:
                models = response.json()
                target_model = next((m for m in models if m['id'] == model_id), None)
                if target_model:
                    print(f"   Training Status: {target_model['status']}")
                    if target_model['status'] in ['COMPLETED', 'FAILED']:
                        break
            time.sleep(2)

    if evaluation_id:
        print("   🔍 Monitoring evaluation job...")
        for i in range(10):
            response = requests.get(f"{BASE_URL}/evaluation-runs")
            if response.status_code == 200:
                runs = response.json()
                target_run = next((r for r in runs if r['id'] == evaluation_id), None)
                if target_run:
                    print(f"   Evaluation Status: {target_run['status']}")
                    if target_run['status'] in ['COMPLETED', 'FAILED']:
                        break
            time.sleep(2)

def main():
    """主測試流程"""
    print("🎯 Stage 3 API Testing Started")
    print("=" * 50)

    try:
        # Test trained models API
        new_model = test_trained_models_api()

        # Test evaluation runs API
        new_evaluation = None
        if new_model:
            # Wait a bit for training to start
            time.sleep(3)
            new_evaluation = test_evaluation_runs_api(new_model['id'])

        # Monitor job progress
        if new_model or new_evaluation:
            test_job_monitoring(
                model_id=new_model['id'] if new_model else None,
                evaluation_id=new_evaluation['id'] if new_evaluation else None
            )

        print("\n✅ Stage 3 API Testing Completed")
        print("=" * 50)

    except requests.exceptions.ConnectionError:
        print("❌ Error: Cannot connect to backend server")
        print("   Please make sure the backend is running on http://localhost:8000")
    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    main()
