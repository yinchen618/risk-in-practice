#!/usr/bin/env python3
"""
測試 generate-candidates API 的 experiment_run_id 修正
"""
import requests
import json
import time

API_BASE = "http://localhost:8000/api/v2"

def test_generate_candidates_with_existing_experiment():
    print("🧪 測試 generate-candidates API 使用現有 experiment_run_id")

    # 步驟 1: 創建一個新的實驗
    print("\n📝 步驟 1: 創建新實驗")
    create_response = requests.post(f"{API_BASE}/create-experiment-run", json={
        "name": "Test Experiment for generate-candidates",
        "filtering_parameters": {
            "power_threshold_min": 0,
            "power_threshold_max": 10000,
            "spike_detection_threshold": 2,
            "start_date": "2025-07-26T15:07:51.252Z",
            "end_date": "2025-08-25T15:07:51.252Z",
            "exclude_weekends": False,
            "time_window_hours": 24,
            "max_missing_ratio": 0.1,
            "min_data_points": 100,
            "enable_peer_comparison": True,
            "peer_deviation_threshold": 1.5,
            "buildings": [],
            "floors": [],
            "rooms": []
        }
    })

    if create_response.status_code != 200:
        print(f"❌ 創建實驗失敗: {create_response.status_code}")
        print(create_response.text)
        return

    experiment_data = create_response.json()
    original_experiment_id = experiment_data["experiment_run_id"]
    print(f"✅ 創建實驗成功，ID: {original_experiment_id}")

    # 步驟 2: 使用現有實驗ID調用 generate-candidates
    print(f"\n🔄 步驟 2: 使用現有實驗ID調用 generate-candidates")
    filter_params = {
        "selectedDatasetIds": [],
        "buildings": ["Building-A"],
        "floors": ["5F"],
        "rooms": ["Room-10"],
        "occupantTypes": ["STUDENT"],
        "zScoreThreshold": 2.8,
        "spikeThreshold": 250,
        "minEventDuration": 30,
        "startDate": "2025-08-01",
        "startTime": "00:00",
        "endDate": "2025-08-25",
        "endTime": "23:59"
    }

    generate_response = requests.post(f"{API_BASE}/generate-candidates", json={
        "experiment_run_id": original_experiment_id,  # 傳遞現有的實驗ID
        "filter_params": filter_params,
        "save_labels": True
    })

    if generate_response.status_code != 200:
        print(f"❌ 生成候選失敗: {generate_response.status_code}")
        print(generate_response.text)
        return

    result = generate_response.json()
    returned_experiment_id = result.get("experiment_run_id")

    print(f"\n📊 結果:")
    print(f"   原始實驗ID: {original_experiment_id}")
    print(f"   返回實驗ID: {returned_experiment_id}")
    print(f"   候選數量:   {result.get('candidate_count')}")
    print(f"   狀態:       {result.get('status')}")

    # 驗證ID是否一致
    if original_experiment_id == returned_experiment_id:
        print("✅ 測試通過: 返回的實驗ID與原始ID一致")
        return True
    else:
        print("❌ 測試失敗: 返回的實驗ID與原始ID不一致")
        return False

def test_generate_candidates_without_experiment():
    print("\n🧪 測試 generate-candidates API 不提供 experiment_run_id")

    filter_params = {
        "selectedDatasetIds": [],
        "buildings": ["Building-A"],
        "floors": ["5F"],
        "rooms": ["Room-10"],
        "occupantTypes": ["STUDENT"],
        "zScoreThreshold": 2.8,
        "spikeThreshold": 250,
        "minEventDuration": 30,
        "startDate": "2025-08-01",
        "startTime": "00:00",
        "endDate": "2025-08-25",
        "endTime": "23:59"
    }

    generate_response = requests.post(f"{API_BASE}/generate-candidates", json={
        # 不提供 experiment_run_id
        "filter_params": filter_params,
        "save_labels": True
    })

    if generate_response.status_code != 200:
        print(f"❌ 生成候選失敗: {generate_response.status_code}")
        print(generate_response.text)
        return False

    result = generate_response.json()
    new_experiment_id = result.get("experiment_run_id")

    print(f"\n📊 結果:")
    print(f"   新實驗ID: {new_experiment_id}")
    print(f"   候選數量: {result.get('candidate_count')}")
    print(f"   狀態:     {result.get('status')}")

    if new_experiment_id:
        print("✅ 測試通過: 成功創建新實驗ID")
        return True
    else:
        print("❌ 測試失敗: 未返回實驗ID")
        return False

if __name__ == "__main__":
    print("🚀 開始測試 generate-candidates API 修正")

    # 等待後端啟動
    print("⏳ 等待後端啟動...")
    time.sleep(3)

    try:
        # 測試健康檢查
        health_response = requests.get(f"{API_BASE}/health", timeout=5)
        if health_response.status_code != 200:
            print(f"❌ 後端未準備好: {health_response.status_code}")
            exit(1)
    except requests.exceptions.RequestException as e:
        print(f"❌ 無法連接到後端: {e}")
        exit(1)

    print("✅ 後端已準備好")

    # 執行測試
    test1_passed = test_generate_candidates_with_existing_experiment()
    time.sleep(1)
    test2_passed = test_generate_candidates_without_experiment()

    print(f"\n🏁 測試總結:")
    print(f"   測試1 (使用現有ID): {'✅ 通過' if test1_passed else '❌ 失敗'}")
    print(f"   測試2 (創建新ID):   {'✅ 通過' if test2_passed else '❌ 失敗'}")

    if test1_passed and test2_passed:
        print("🎉 所有測試通過！")
    else:
        print("⚠️ 有測試失敗，請檢查代碼")
