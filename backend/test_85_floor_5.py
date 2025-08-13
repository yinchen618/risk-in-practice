#!/usr/bin/env python3
"""
測試85學舍5樓設備過濾的腳本
"""

import requests
import json

def test_85_floor_5():
    """測試85學舍5樓的設備過濾"""
    print("=== 測試85學舍5樓設備過濾 ===")
    
    # 構建測試參數
    test_data = {
        "start_date": "2025-08-11",
        "end_date": "2025-08-13",
        "start_time": "00:00",
        "end_time": "23:59",
        "selected_floors_by_building": {
            "85學舍": ["5"]
        }
    }
    
    print("發送請求參數:")
    print(json.dumps(test_data, indent=2, ensure_ascii=False))
    
    # 調用API
    response = requests.post(
        "http://localhost:8000/api/ammeters/data-count",
        json=test_data,
        headers={"Content-Type": "application/json"}
    )
    
    print(f"\n回應狀態碼: {response.status_code}")
    
    if response.ok:
        result = response.json()
        print("✓ API調用成功!")
        print("回應結果:")
        print(json.dumps(result, indent=2, ensure_ascii=False))
        
        # 檢查是否找到設備
        data = result.get("data", {})
        matched_devices = data.get("filter_info", {}).get("matched_devices", 0)
        total_records = data.get("total_records", 0)
        
        print(f"\n=== 結果摘要 ===")
        print(f"匹配設備數: {matched_devices}")
        print(f"總記錄數: {total_records}")
        
        if matched_devices > 0:
            print("✓ 成功找到85學舍5樓的設備！")
        else:
            print("❌ 未找到85學舍5樓的設備，可能仍有問題")
    else:
        print(f"❌ API調用失敗: {response.text}")

def test_device_mapping():
    """測試設備映射是否正確"""
    print("\n=== 測試設備映射 ===")
    
    # 檢查data_loader的設備映射
    from services.data_loader import DataLoaderService
    
    data_loader = DataLoaderService()
    device_mapping = data_loader.get_device_room_mapping()
    
    # 找出85學舍5樓的設備
    floor_5_devices = []
    for device_id, room_info in device_mapping.items():
        if room_info["building"] == "85學舍" and room_info["floor"] == "5":
            floor_5_devices.append({
                "device_id": device_id,
                "room": room_info["room"]
            })
    
    print(f"85學舍5樓設備總數: {len(floor_5_devices)}")
    print("設備列表:")
    for i, device in enumerate(floor_5_devices[:10]):  # 只顯示前10個
        print(f"  {i+1}. {device['device_id']} - {device['room']}")
    
    if len(floor_5_devices) > 10:
        print(f"  ... 還有 {len(floor_5_devices) - 10} 個設備")
    
    return len(floor_5_devices)

if __name__ == "__main__":
    try:
        # 首先測試設備映射
        device_count = test_device_mapping()
        
        # 然後測試API
        test_85_floor_5()
        
        print(f"\n=== 總結 ===")
        print(f"設備映射中85學舍5樓設備數: {device_count}")
        print("如果API返回的匹配設備數與設備映射中的數量一致，則修復成功！")
        
    except Exception as e:
        print(f"測試過程中出現錯誤: {e}")
        import traceback
        traceback.print_exc()
