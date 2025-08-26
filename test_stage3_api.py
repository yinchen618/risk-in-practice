#!/usr/bin/env python3
"""
測試 Stage 3 轉換 API 端點
"""

import requests
import json

# API 基地址
BASE_URL = "http://localhost:8000"

def test_experiment_list():
    """測試獲取實驗列表"""
    try:
        response = requests.get(f"{BASE_URL}/api/v2/experiment-runs")
        if response.status_code == 200:
            experiments = response.json()
            print(f"找到 {len(experiments)} 個實驗:")
            for exp in experiments[:3]:  # 只顯示前3個
                print(f"  ID: {exp['id']}, Name: {exp['name']}, Status: {exp['status']}")
            return experiments[0]['id'] if experiments else None
        else:
            print(f"獲取實驗列表失敗: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"請求失敗: {e}")
        return None

def test_update_experiment_status(experiment_id, new_status):
    """測試更新實驗狀態"""
    try:
        url = f"{BASE_URL}/api/v2/experiment-runs/{experiment_id}/status"
        data = {"status": new_status}

        response = requests.patch(url, json=data)

        if response.status_code == 200:
            result = response.json()
            print(f"狀態更新成功!")
            print(f"  實驗 ID: {result['experiment_id']}")
            print(f"  舊狀態: {result['old_status']}")
            print(f"  新狀態: {result['new_status']}")
            print(f"  更新時間: {result['updated_at']}")
            return True
        else:
            error_data = response.json() if response.content else {}
            print(f"狀態更新失敗: {response.status_code}")
            print(f"錯誤信息: {error_data.get('detail', response.text)}")
            return False
    except Exception as e:
        print(f"請求失敗: {e}")
        return False

if __name__ == "__main__":
    print("=== 測試 Stage 3 轉換 API ===")

    # 首先獲取實驗列表
    experiment_id = test_experiment_list()

    if experiment_id:
        print(f"\n使用實驗 ID: {experiment_id}")

        # 測試狀態更新
        print("\n測試更新狀態到 COMPLETED...")
        success = test_update_experiment_status(experiment_id, "COMPLETED")

        if success:
            print("\n測試更新狀態回 LABELING...")
            test_update_experiment_status(experiment_id, "LABELING")
    else:
        print("沒有找到可用的實驗進行測試")
