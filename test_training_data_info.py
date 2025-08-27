#!/usr/bin/env python3
"""
Test script to verify training_data_info functionality
"""

import requests
import json

def test_trained_models_api():
    """Test the trained models API to check for training_data_info field"""
    try:
        # Test GET /api/v2/trained-models
        response = requests.get("http://localhost:8000/api/v2/trained-models")

        if response.status_code == 200:
            models = response.json()
            print(f"✅ Found {len(models)} trained models")

            for model in models:
                print(f"\n📊 Model: {model['name']}")
                print(f"   Status: {model['status']}")
                print(f"   Scenario: {model['scenarioType']}")

                if 'training_data_info' in model and model['training_data_info']:
                    print("   ✅ training_data_info field exists!")
                    training_info = model['training_data_info']

                    # P data sources
                    if 'p_data_sources' in training_info:
                        p_data = training_info['p_data_sources']
                        print(f"   📥 P data sources: {len(p_data.get('dataset_ids', []))} datasets")
                        print(f"      Total P samples: {p_data.get('total_samples', 0)}")

                        for dataset_id in p_data.get('dataset_ids', []):
                            dataset_name = p_data.get('dataset_names', {}).get(dataset_id, f"Dataset_{dataset_id}")
                            dataset_info = p_data.get('dataset_info', {}).get(dataset_id, {})
                            print(f"      - {dataset_name}: {dataset_info.get('total_samples', 0)} samples")

                    # U data sources
                    if 'u_data_sources' in training_info:
                        u_data = training_info['u_data_sources']
                        print(f"   📤 U data sources: {len(u_data.get('dataset_ids', []))} datasets")
                        print(f"      Total U samples: {u_data.get('total_samples', 0)}")

                        for dataset_id in u_data.get('dataset_ids', []):
                            dataset_name = u_data.get('dataset_names', {}).get(dataset_id, f"Dataset_{dataset_id}")
                            dataset_info = u_data.get('dataset_info', {}).get(dataset_id, {})
                            print(f"      - {dataset_name}: {dataset_info.get('total_samples', 0)} samples")

                    # Data split ratios
                    if 'data_split_ratios' in training_info:
                        ratios = training_info['data_split_ratios']
                        print(f"   📊 Data split: Train {ratios.get('train_ratio', 0)*100:.0f}% | "
                              f"Val {ratios.get('validation_ratio', 0)*100:.0f}% | "
                              f"Test {ratios.get('test_ratio', 0)*100:.0f}%")

                    # Overlap and sampling info
                    if training_info.get('overlap_removal'):
                        print("   ⚠️ Overlap removal applied")
                    if training_info.get('u_sampling_applied'):
                        print("   🎲 U sampling applied (10x limit)")

                else:
                    print("   ❌ training_data_info field missing or empty")

                print("   " + "-" * 50)
        else:
            print(f"❌ API request failed: {response.status_code}")
            print(f"   Response: {response.text}")

    except Exception as e:
        print(f"❌ Error testing API: {str(e)}")

def test_experiment_history_api():
    """Test experiment history API for training_data_info"""
    try:
        # Get available experiments first
        response = requests.get("http://localhost:8000/api/v2/experiment-runs")
        if response.status_code == 200:
            experiments = response.json()
            if experiments:
                # Test with the first experiment
                experiment_id = experiments[0]['id']
                print(f"\n🧪 Testing experiment history for: {experiments[0]['name']}")

                response = requests.get(f"http://localhost:8000/api/v2/experiment-runs/{experiment_id}/history")
                if response.status_code == 200:
                    history = response.json()
                    trained_models = history.get('trained_models', [])

                    print(f"✅ Found {len(trained_models)} trained models in experiment history")

                    for model in trained_models:
                        print(f"\n📊 Model: {model['name']}")
                        if 'training_data_info' in model and model['training_data_info']:
                            print("   ✅ training_data_info included in experiment history!")
                        else:
                            print("   ❌ training_data_info missing in experiment history")
                else:
                    print(f"❌ Experiment history request failed: {response.status_code}")
            else:
                print("⚠️ No experiments found to test")
        else:
            print(f"❌ Failed to get experiments: {response.status_code}")

    except Exception as e:
        print(f"❌ Error testing experiment history API: {str(e)}")

if __name__ == "__main__":
    print("🧪 Testing training_data_info functionality...")
    print("=" * 60)

    print("\n1. Testing /api/v2/trained-models endpoint:")
    test_trained_models_api()

    print("\n2. Testing experiment history endpoint:")
    test_experiment_history_api()

    print("\n✅ Testing completed!")
