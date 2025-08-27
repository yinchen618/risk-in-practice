#!/usr/bin/env python3
"""
Test script for P and U data source functionality
Tests the enhanced frontend-backend communication for training jobs
"""

import requests
import json
import time

def test_training_with_pu_datasources():
    """Test training job creation with P and U data sources"""

    base_url = "http://localhost:8000"

    # Test data for training job creation
    test_payload = {
        "name": "test_pu_datasources_2025-08-27_17-10-00",
        "scenarioType": "ERM_BASELINE",
        "experimentRunId": "2b4ad48d-b6a8-4d50-925a-f1c9597ebcd0",  # Using completed experiment
        "modelConfig": json.dumps({
            "model_type": "nnPU",
            "learning_rate": 0.001,
            "batch_size": 32,
            "epochs": 10,
            "prior": 0.1,
            "beta": 0.0,
            "gamma": 1.0,
            "feature_engineering": {
                "main_window_size_minutes": 60
            }
        }),
        "dataSourceConfig": json.dumps({
            "selectedDatasets": [],
            "positiveDataSourceIds": ["dataset1", "dataset2"],  # Mock P data source IDs
            "unlabeledDataSourceIds": ["dataset1", "dataset2", "dataset3"],  # Mock U data source IDs
            "trainRatio": 70,
            "validationRatio": 20,
            "testRatio": 10,
            "timeRange": {
                "startDate": "2024-01-01",
                "endDate": "2024-12-31"
            }
        })
    }

    print("🧪 Testing P and U data source functionality...")
    print(f"📊 P data sources: {json.loads(test_payload['dataSourceConfig'])['positiveDataSourceIds']}")
    print(f"📊 U data sources: {json.loads(test_payload['dataSourceConfig'])['unlabeledDataSourceIds']}")
    print(f"📊 Data split: Train={json.loads(test_payload['dataSourceConfig'])['trainRatio']}%, Val={json.loads(test_payload['dataSourceConfig'])['validationRatio']}%, Test={json.loads(test_payload['dataSourceConfig'])['testRatio']}%")

    try:
        # Send training request
        print("\n📤 Sending training request...")
        response = requests.post(
            f"{base_url}/api/v2/trained-models",
            headers={"Content-Type": "application/json"},
            json=test_payload,
            timeout=30
        )

        print(f"📥 Response status: {response.status_code}")

        if response.status_code == 200:
            result = response.json()
            print("✅ Training job created successfully!")
            print(f"🆔 Model ID: {result.get('id')}")
            print(f"🏷️ Job ID: {result.get('jobId')}")
            print(f"📋 Name: {result.get('name')}")
            print(f"🎯 Scenario: {result.get('scenarioType')}")

            # Print the data source configuration that was sent
            data_source_config = json.loads(result.get('dataSourceConfig', '{}'))
            print(f"\n📊 Confirmed P data sources: {data_source_config.get('positiveDataSourceIds', [])}")
            print(f"📊 Confirmed U data sources: {data_source_config.get('unlabeledDataSourceIds', [])}")
            print(f"📊 Confirmed data split: Train={data_source_config.get('trainRatio', 70)}%, Val={data_source_config.get('validationRatio', 20)}%, Test={data_source_config.get('testRatio', 10)}%")

            return True
        else:
            error_detail = response.json() if response.headers.get('content-type') == 'application/json' else response.text
            print(f"❌ Training request failed: {error_detail}")
            return False

    except requests.exceptions.RequestException as e:
        print(f"❌ Request error: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

def check_backend_health():
    """Check if the backend is running"""
    try:
        response = requests.get("http://localhost:8000/api/v2/experiment-runs", timeout=5)
        return response.status_code == 200
    except:
        return False

if __name__ == "__main__":
    print("🔍 Checking backend health...")
    if not check_backend_health():
        print("❌ Backend is not running! Please start the backend first.")
        exit(1)

    print("✅ Backend is running!")

    # Run the test
    success = test_training_with_pu_datasources()

    if success:
        print("\n🎉 Test completed successfully!")
        print("📝 The P and U data source functionality is working correctly.")
        print("📊 Frontend can now send P and U data source IDs along with train/validation/test ratios.")
    else:
        print("\n❌ Test failed!")
        print("🔧 Please check the backend logs for more details.")
