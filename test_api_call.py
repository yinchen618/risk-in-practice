#!/usr/bin/env python3
"""
測試 generate-candidates API 修改
"""
import requests
import json

def test_generate_candidates():
    """測試 generate-candidates API"""
    url = "http://localhost:8000/api/v2/generate-candidates"
    
    # 測試數據
    data = {
        "filter_params": {
            "selectedDatasetIds": ["dataset_1"],
            "zScoreThreshold": 2.8,
            "spikeThreshold": 250,
            "minEventDuration": 60
        },
        "save_labels": True,
        "experiment_run_id": "test-experiment-12345"  # 提供現有的實驗ID
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    print("🧪 測試 generate-candidates API...")
    print(f"📡 URL: {url}")
    print(f"📄 請求數據:")
    print(json.dumps(data, indent=2, ensure_ascii=False))
    print()
    
    try:
        response = requests.post(url, json=data, headers=headers)
        
        print(f"📊 響應狀態碼: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ API 響應成功!")
            print(f"📄 響應數據:")
            print(json.dumps(result, indent=2, ensure_ascii=False))
            
            # 檢查是否返回了相同的 experiment_run_id
            returned_id = result.get('experiment_run_id')
            expected_id = data['experiment_run_id']
            
            if returned_id == expected_id:
                print(f"✅ 成功! 返回了相同的 experiment_run_id: {returned_id}")
            else:
                print(f"❌ 錯誤! 期望的 ID: {expected_id}, 但得到: {returned_id}")
                
        else:
            print(f"❌ API 響應失敗: {response.status_code}")
            print(f"錯誤內容: {response.text}")
            
    except Exception as e:
        print(f"❌ 請求錯誤: {e}")

if __name__ == "__main__":
    test_generate_candidates()
