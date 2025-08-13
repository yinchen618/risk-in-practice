#!/usr/bin/env python3
"""
測試候選事件計算API的簡單腳本
"""

import requests
import json
from datetime import datetime, timedelta

# API 基礎URL
BASE_URL = "http://localhost:8000"

def test_calculate_candidates():
    """測試候選事件計算API"""
    print("=== 測試候選事件計算API ===")
    
    # 首先創建一個測試實驗運行
    print("1. 創建測試實驗運行...")
    create_response = requests.post(f"{BASE_URL}/api/v1/experiment-runs", json={
        "name": "API測試實驗",
        "description": "測試候選事件計算功能"
    })
    
    if not create_response.ok:
        print(f"創建實驗失敗: {create_response.text}")
        return
    
    run_data = create_response.json()
    run_id = run_data["data"]["id"]
    print(f"✓ 創建實驗成功，ID: {run_id}")
    
    # 測試計算候選事件
    print("2. 測試計算候選事件...")
    
    # 構建測試參數
    test_params = {
        "start_datetime": "2025-08-12T14:56:00",
        "end_datetime": "2025-08-13T16:00:00", 
        "z_score_threshold": 3.0,
        "spike_percentage": 200.0,
        "min_event_duration_minutes": 30,
        "detect_holiday_pattern": True,
        "max_time_gap_minutes": 60,
        "peer_agg_window_minutes": 5,
        "peer_exceed_percentage": 150.0,
        "selected_floors_by_building": {
            "15學舍": ["1", "2"]
            }
        }
    }
    
    print("發送請求參數:")
    print(json.dumps(test_params, indent=2, ensure_ascii=False))
    
    calc_response = requests.post(
        f"{BASE_URL}/api/v1/experiment-runs/{run_id}/candidates/calculate",
        json=test_params,
        headers={"Content-Type": "application/json"}
    )
    
    print(f"回應狀態碼: {calc_response.status_code}")
    
    if calc_response.ok:
        result = calc_response.json()
        print("✓ 計算成功!")
        print("回應結構:")
        print(json.dumps(result, indent=2, ensure_ascii=False))
        
        # 檢查關鍵欄位
        if result.get("success"):
            data = result.get("data", {})
            print(f"\n=== 關鍵統計 ===")
            print(f"總候選事件數: {data.get('totalCandidates', 'N/A')}")
            print(f"總記錄數: {data.get('totalRecords', 'N/A')}")
            print(f"唯一設備數: {data.get('uniqueDevices', 'N/A')}")
            print(f"重疊調整總數: {data.get('overlapAdjustedTotal', 'N/A')}")
            print(f"重疊減少因子: {data.get('overlapReductionFactor', 'N/A')}")
            
            per_rule = data.get('perRule', {})
            if per_rule:
                print(f"\n=== 按規則統計 ===")
                for rule, count in per_rule.items():
                    print(f"{rule}: {count}")
        else:
            print(f"❌ API返回失敗: {result.get('message', '未知錯誤')}")
    else:
        print(f"❌ 計算失敗: {calc_response.text}")
    
    # 清理測試實驗
    print(f"\n3. 清理測試實驗...")
    delete_response = requests.delete(f"{BASE_URL}/api/v1/experiment-runs/{run_id}")
    if delete_response.ok:
        print("✓ 測試實驗已清理")
    else:
        print(f"⚠️ 清理失敗，請手動刪除實驗 {run_id}")

if __name__ == "__main__":
    try:
        test_calculate_candidates()
    except Exception as e:
        print(f"測試過程中出現錯誤: {e}")
        import traceback
        traceback.print_exc()
