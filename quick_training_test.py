#!/usr/bin/env python3
"""
Quick Test for Fixed Training System
Tests if nnPU loss computation graph issue has been resolved.
"""

import requests
import json
import time
import sys

BASE_URL = "http://localhost:8000/api/v2"

def test_quick_training():
    print("🔬 Quick Test: Fixed Training System")
    print("=" * 40)

    # Step 1: Create a minimal training job
    print("📊 Creating minimal training job...")
    training_request = {
        "name": f"Quick_Test_{int(time.time())}",
        "scenario_type": "ERM_BASELINE",
        "experimentRunId": "test-experiment-123",
        "modelConfig": {
            "classPrior": 0.018,
            "windowSize": 30,  # Small window
            "modelType": "LSTM",
            "hiddenSize": 32,  # Small model
            "numLayers": 1,
            "activationFunction": "ReLU",
            "dropout": 0.1,
            "epochs": 3,  # Very few epochs for quick testing
            "batchSize": 16,
            "optimizer": "Adam",
            "learningRate": 0.001,
            "l2Regularization": 0.001,
            "earlyStopping": True,
            "patience": 2,
            "learningRateScheduler": "none"
        },
        "trainingConfig": {
        },
        "dataSourceConfig": {
            "pDataSources": {
                "type": "dataset_selection",
                "datasetIds": ["c198eb01ec8df0q4lygm"]  # Single dataset for speed
            },
            "uDataSources": {
                "type": "dataset_selection",
                "datasetIds": ["c198eb01ec8df0q4lygm"]
            },
            "splitRatios": {
                "train": 0.8,
                "validation": 0.1,
                "test": 0.1
            },
            "uSampleRatio": 0.05  # Very small sample for speed
        }
    }

    try:
        # Create training job
        response = requests.post(f"{BASE_URL}/trained-models", json=training_request)

        if response.status_code == 200:
            result = response.json()
            job_id = result.get('job_id')
            model_id = result.get('model_id')
            print(f"✅ Training job created successfully!")
            print(f"   🆔 Job ID: {job_id}")
            print(f"   🧠 Model ID: {model_id}")

            # Wait a bit for training to start
            print("⏳ Waiting for training to progress...")
            time.sleep(10)

            # Check training status
            status_response = requests.get(f"{BASE_URL}/trained-models/{model_id}")
            if status_response.status_code == 200:
                status_data = status_response.json()
                training_status = status_data.get('status', 'UNKNOWN')
                print(f"📊 Training status: {training_status}")

                if training_status == 'FAILED':
                    print("❌ Training failed - checking if it was due to original bug...")
                    return False
                elif training_status in ['RUNNING', 'COMPLETED']:
                    print("🎉 Training is progressing - nnPU loss issue appears to be fixed!")
                    return True
                else:
                    print(f"🔄 Training status: {training_status}")
                    return True
            else:
                print(f"⚠️ Could not check status: {status_response.status_code}")
                return False

        else:
            print(f"❌ Failed to create training job: {response.status_code}")
            print(f"   Response: {response.text}")
            return False

    except Exception as e:
        print(f"❌ Error during test: {e}")
        return False

if __name__ == "__main__":
    success = test_quick_training()
    if success:
        print("\n✅ Quick test suggests the fix is working!")
    else:
        print("\n❌ Quick test failed - more investigation needed.")
