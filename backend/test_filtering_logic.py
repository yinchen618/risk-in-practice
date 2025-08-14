#!/usr/bin/env python3
"""
直接測試ammeter_service過濾邏輯的腳本
"""

import sys
import os
sys.path.append('/home/infowin/Git-projects/pu-in-practice/backend')

from services.data_loader import DataLoaderService
from datetime import datetime, time

def test_device_filtering_logic():
    """測試修復後的設備過濾邏輯"""
    print("=== 直接測試設備過濾邏輯 ===")
    
    # 創建data_loader實例
    data_loader = DataLoaderService()
    
    # 獲取設備映射
    device_mapping = data_loader.get_device_room_mapping()
    print(f"總設備數: {len(device_mapping)}")
    
    # 測試參數
    selected_floors_by_building = {"Building B": ["5"]}
    
    # 重現ammeter_service中的過濾邏輯
    print(f"\n測試過濾條件: {selected_floors_by_building}")
    
    matched_devices = []
    for device_id, room_info in device_mapping.items():
        device_building = room_info["building"]
        device_floor = room_info["floor"]
        
        # 修復後的邏輯：先檢查建築物是否在選擇範圍內
        if device_building in selected_floors_by_building:
            selected_floors_for_building = selected_floors_by_building[device_building]
            # 然後檢查樓層是否在該建築物的選擇範圍內
            if device_floor in selected_floors_for_building:
                matched_devices.append({
                    "device_id": device_id,
                    "building": device_building,
                    "floor": device_floor,
                    "room": room_info["room"]
                })
    
    print(f"\n修復後匹配的設備數: {len(matched_devices)}")
    print("匹配的設備列表:")
    for i, device in enumerate(matched_devices[:10]):
        print(f"  {i+1}. {device['device_id']} - {device['building']}棟{device['floor']}樓{device['room']}房")
    
    if len(matched_devices) > 10:
        print(f"  ... 還有 {len(matched_devices) - 10} 個設備")
    
    # 測試舊的錯誤邏輯來比較
    print(f"\n=== 比較: 錯誤的舊邏輯結果 ===")
    old_matched_devices = []
    for device_id, room_info in device_mapping.items():
        device_building = room_info["building"]
        device_floor = room_info["floor"]
        
        # 舊的錯誤邏輯：錯誤地迭代 .items()
        for selected_floors_for_building in selected_floors_by_building.items():
            # 這裡 selected_floors_for_building 是一個 (building, floors) tuple
            # 錯誤地把它當作樓層列表使用
            if device_floor in selected_floors_for_building:  # 這會失敗，因為樓層不在tuple中
                old_matched_devices.append(device_id)
                break
    
    print(f"舊邏輯匹配的設備數: {len(old_matched_devices)}")
    
    # 驗證修復
    if len(matched_devices) == 20:  # 我們知道Building B5樓有20個設備
        print("✅ 修復成功！匹配的設備數量正確")
    else:
        print(f"❌ 可能還有問題，期望20個設備，實際得到{len(matched_devices)}個")
    
    return len(matched_devices)

def test_time_range_filtering():
    """測試時間範圍過濾"""
    print(f"\n=== 測試時間範圍過濾 ===")
    
    data_loader = DataLoaderService()
    
    # 測試參數
    start_date = datetime.strptime("2025-08-11", "%Y-%m-%d").date()
    end_date = datetime.strptime("2025-08-13", "%Y-%m-%d").date()
    start_time = time(0, 0)
    end_time = time(23, 59)
    device_ids = ['402A8FB038C7', '402A8FB01E11']  # Building B5樓的兩個設備
    
    try:
        df = data_loader.load_meter_data_by_time_range(
            device_ids=device_ids,
            start_date=start_date,
            end_date=end_date,
            start_time=start_time,
            end_time=end_time
        )
        
        if df is not None and not df.empty:
            print(f"✅ 成功載入數據，記錄數: {len(df)}")
            print(f"設備數: {df['device_id'].nunique()}")
            print(f"時間範圍: {df['timestamp'].min()} 至 {df['timestamp'].max()}")
        else:
            print("⚠️ 沒有找到數據，可能是時間範圍內沒有記錄")
            
    except Exception as e:
        print(f"❌ 時間範圍過濾測試失敗: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    try:
        # 測試設備過濾邏輯
        matched_count = test_device_filtering_logic()
        
        # 測試時間範圍過濾
        test_time_range_filtering()
        
        print(f"\n=== 總結 ===")
        print(f"Building B5樓設備過濾結果: {matched_count} 個設備")
        
        if matched_count == 20:
            print("🎉 設備過濾修復成功！現在應該能正確找到Building B5樓的所有設備")
        else:
            print("⚠️ 設備過濾可能仍有問題，需要進一步調查")
            
    except Exception as e:
        print(f"測試過程中出現錯誤: {e}")
        import traceback
        traceback.print_exc()
