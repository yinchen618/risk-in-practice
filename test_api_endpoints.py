#!/usr/bin/env python3

import requests
import json

BASE_URL = "http://localhost:8000/api/v2"

def test_api_endpoints():
    print("=== 測試 API 端點 ===")

    # 1. 測試實驗運行列表
    print("\n1. 測試實驗運行列表:")
    try:
        response = requests.get(f"{BASE_URL}/experiment-runs")
        if response.status_code == 200:
            data = response.json()
            print(f"✓ 成功獲取 {len(data)} 個實驗運行")
            if data:
                exp_id = data[0]['id']
                print(f"  第一個實驗 ID: {exp_id}")

                # 2. 測試異常事件列表 (使用不同的參數)
                print(f"\n2. 測試異常事件列表 (實驗 {exp_id}):")
                try:
                    # 不指定狀態過濾器，看看能否獲取所有事件
                    events_response = requests.get(f"{BASE_URL}/anomaly-events?experiment_run_id={exp_id}")
                    if events_response.status_code == 200:
                        events = events_response.json()
                        print(f"✓ 成功獲取 {len(events)} 個異常事件")

                        if events:
                            event = events[0]
                            print(f"  第一個事件:")
                            print(f"    ID: {event.get('id')}")
                            print(f"    數據集 ID: {event.get('dataset_id')}")
                            print(f"    線路: {event.get('line')}")
                            print(f"    數據集名稱: {event.get('dataset', {}).get('name')}")

                            # 3. 測試事件數據 API
                            print(f"\n3. 測試事件數據 API:")
                            event_id = event['id']
                            data_response = requests.get(f"{BASE_URL}/anomaly-events/{event_id}/data")
                            if data_response.status_code == 200:
                                data_points = data_response.json()
                                print(f"✓ 成功獲取 {len(data_points)} 個數據點")
                                if data_points:
                                    print(f"  第一個數據點: {data_points[0]}")
                            else:
                                print(f"✗ 事件數據 API 失敗: {data_response.status_code} - {data_response.text}")

                    else:
                        print(f"✗ 異常事件列表失敗: {events_response.status_code} - {events_response.text}")
                except Exception as e:
                    print(f"✗ 異常事件測試出錯: {e}")
        else:
            print(f"✗ 實驗運行列表失敗: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"✗ 實驗運行測試出錯: {e}")

if __name__ == "__main__":
    test_api_endpoints()
