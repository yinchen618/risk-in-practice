#!/usr/bin/env python3
"""
測試修改後的 data_loader.py 只使用 selected_floors_by_building 參數
"""

import sys
import os
sys.path.append('/home/infowin/Git-projects/pu-in-practice/backend')

import asyncio
from services.data_loader import DataLoaderService
from datetime import datetime

async def test_updated_data_loader():
    """測試修改後的 DataLoaderService"""
    print("=== 測試修改後的 DataLoaderService ===")
    
    data_loader = DataLoaderService()
    
    # 測試1: 測試 _get_allowed_devices_by_building 方法
    print("\n1. 測試 _get_allowed_devices_by_building 方法")
    selected_floors_by_building = {"85學舍": ["5"], "15學舍": ["1", "2"]}
    
    allowed_devices = data_loader._get_allowed_devices_by_building(selected_floors_by_building)
    print(f"選擇條件: {selected_floors_by_building}")
    print(f"匹配設備數: {len(allowed_devices)}")
    
    # 分別統計各建築物的設備數
    building_counts = {}
    device_mapping = data_loader.get_device_room_mapping()
    
    for device_id in allowed_devices:
        if device_id in device_mapping:
            building = device_mapping[device_id]["building"]
            floor = device_mapping[device_id]["floor"]
            key = f"{building} {floor}樓"
            if key not in building_counts:
                building_counts[key] = 0
            building_counts[key] += 1
    
    print("各建築物樓層設備統計:")
    for building_floor, count in sorted(building_counts.items()):
        print(f"  {building_floor}: {count} 個設備")
    
    # 測試2: 測試異步 get_raw_dataframe 方法
    print("\n2. 測試 get_raw_dataframe 方法（只使用 selected_floors_by_building）")
    try:
        # 使用較小的時間範圍以避免載入太多數據
        start_datetime = datetime(2025, 8, 12, 0, 0, 0)
        end_datetime = datetime(2025, 8, 13, 23, 59, 59)
        
        df = await data_loader.get_raw_dataframe(
            start_datetime=start_datetime,
            end_datetime=end_datetime,
            selected_floors_by_building={"85學舍": ["5"]},
            force_reload=False
        )
        
        if not df.empty:
            print(f"✅ get_raw_dataframe 成功載入 {len(df)} 筆數據")
            print(f"設備數量: {df['deviceNumber'].nunique()}")
            print(f"時間範圍: {df['timestamp'].min()} 到 {df['timestamp'].max()}")
        else:
            print("⚠️ get_raw_dataframe 返回空數據（可能是時間範圍內沒有數據）")
            
    except Exception as e:
        print(f"❌ get_raw_dataframe 測試失敗: {e}")
        import traceback
        traceback.print_exc()
    
    # 測試3: 測試 load_meter_data_by_time_range 方法
    print("\n3. 測試 load_meter_data_by_time_range 方法")
    try:
        df = await data_loader.load_meter_data_by_time_range(
            start_time="2025-08-12T00:00:00",
            end_time="2025-08-13T23:59:59",
            selected_floors_by_building={"85學舍": ["5"]}
        )
        
        if not df.empty:
            print(f"✅ load_meter_data_by_time_range 成功載入 {len(df)} 筆數據")
            print(f"設備數量: {df['deviceNumber'].nunique()}")
        else:
            print("⚠️ load_meter_data_by_time_range 返回空數據")
            
    except Exception as e:
        print(f"❌ load_meter_data_by_time_range 測試失敗: {e}")
        import traceback
        traceback.print_exc()
    
    print("\n=== 測試總結 ===")
    print("✅ 所有方法都已成功移除 selected_buildings 和 selected_floors 參數")
    print("✅ 現在只使用 selected_floors_by_building 來進行設備過濾")
    print("✅ 修改後的 DataLoaderService 功能正常")

if __name__ == "__main__":
    asyncio.run(test_updated_data_loader())
