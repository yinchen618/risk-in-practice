#!/usr/bin/env python3
"""
測試 generate candidates API 的腳本
"""

import requests
import json

# 測試數據
test_payload = {
    "filtering_parameters": {
        "start_date": "2025-08-11",
        "end_date": "2025-08-13", 
        "start_time": "00:00",
        "end_time": "00:00",
        "z_score_threshold": 1.7,
        "spike_percentage": 60.0,
        "min_event_duration_minutes": 30,
        "detect_holiday_pattern": False,
        "max_time_gap_minutes": 15,
        "peer_agg_window_minutes": 60,
        "peer_exceed_percentage": 150.0,
        "selected_floors_by_building": {"15學舍": ["1", "2"]}
    }
}

run_id = "bc37eb3c-aff3-4c05-a2ad-6e272887f5b4"
url = f"http://localhost:8000/api/v1/experiment-runs/{run_id}/candidates/generate?allow_overwrite=true"

print("=== 測試 Generate Candidates API ===")
print(f"URL: {url}")
print(f"Payload: {json.dumps(test_payload, indent=2, ensure_ascii=False)}")

try:
    response = requests.post(
        url,
        json=test_payload,
        headers={"Content-Type": "application/json"}
    )
    
    print(f"\n=== 回應狀態 ===")
    print(f"Status Code: {response.status_code}")
    print(f"Headers: {dict(response.headers)}")
    
    print(f"\n=== 回應內容 ===")
    try:
        result = response.json()
        print(json.dumps(result, indent=2, ensure_ascii=False))
    except:
        print("無法解析 JSON，原始回應:")
        print(response.text)
        
except Exception as e:
    print(f"請求失敗: {e}")
