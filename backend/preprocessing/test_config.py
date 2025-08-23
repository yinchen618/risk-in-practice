#!/usr/bin/env python3
"""
ETL 配置測試腳本

測試 etl_config.py 和 data_preprocessing_etl_multiscale.py 的整合
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def test_config_import():
    """測試配置文件導入"""
    print("=== 測試配置文件導入 ===")

    try:
        from etl_config import (
            DATABASE_CONFIG, ETL_CONFIG, PREDEFINED_ROOMS, TIME_RANGES,
            get_database_url, get_etl_config, get_room_by_id, get_time_range,
            list_available_rooms, get_predefined_rooms, get_rooms_by_building
        )
        print("✅ 配置文件導入成功")

        # 測試資料庫配置
        db_url = get_database_url()
        print(f"✅ 資料庫連接: {db_url.split('@')[-1] if '@' in db_url else 'localhost'}")

        # 測試 ETL 配置
        etl_config = get_etl_config()
        print(f"✅ ETL 配置載入: {len(etl_config)} 個參數")

        # 測試房間配置
        rooms = get_predefined_rooms()
        print(f"✅ 預定義房間: {len(rooms)} 個")

        return True

    except Exception as e:
        print(f"❌ 配置文件導入失敗: {e}")
        return False

def test_room_functions():
    """測試房間相關函數"""
    print("\n=== 測試房間相關函數 ===")

    try:
        from etl_config import (
            list_available_rooms, get_room_by_id, get_rooms_by_building,
            get_predefined_rooms, OccupantType, get_rooms_by_occupant_type
        )

        # 測試房間列表
        available_rooms = list_available_rooms()
        print(f"✅ 可用房間列表: {len(available_rooms)} 個")
        for i, room_id in enumerate(available_rooms[:3]):
            print(f"  {i+1}. {room_id}")
        if len(available_rooms) > 3:
            print(f"  ... 還有 {len(available_rooms) - 3} 個房間")

        # 測試根據 ID 獲取房間
        if available_rooms:
            first_room = get_room_by_id(available_rooms[0])
            print(f"✅ 房間詳細資訊: {first_room.building}-{first_room.floor}-{first_room.room}")
            print(f"   電表 L1: {first_room.meter_id_l1}")
            print(f"   電表 L2: {first_room.meter_id_l2}")
            print(f"   佔用類型: {first_room.occupant_type.value}")

        # 測試根據建築物獲取房間
        building_a_rooms = get_rooms_by_building("Building-A")
        print(f"✅ Building-A 房間數: {len(building_a_rooms)} 個")

        # 測試根據佔用類型獲取房間
        office_rooms = get_rooms_by_occupant_type(OccupantType.OFFICE_WORKER)
        print(f"✅ 辦公室房間數: {len(office_rooms)} 個")

        return True

    except Exception as e:
        print(f"❌ 房間函數測試失敗: {e}")
        return False

def test_time_ranges():
    """測試時間範圍配置"""
    print("\n=== 測試時間範圍配置 ===")

    try:
        from etl_config import TIME_RANGES, get_time_range

        print(f"✅ 可用時間範圍: {list(TIME_RANGES.keys())}")

        # 測試 2025_08 時間範圍
        aug_2025 = get_time_range("2025_08")
        print(f"✅ 2025年8月: {aug_2025['start']} ~ {aug_2025['end']}")

        return True

    except Exception as e:
        print(f"❌ 時間範圍測試失敗: {e}")
        return False

def test_etl_integration():
    """測試 ETL 類別整合"""
    print("\n=== 測試 ETL 類別整合 ===")

    try:
        from data_preprocessing_etl_multiscale import DataPreprocessingETL

        # 創建 ETL 實例（不進行實際資料庫連接）
        etl = DataPreprocessingETL()
        print("✅ ETL 實例創建成功")

        # 檢查配置載入
        config = etl.config
        print(f"✅ ETL 配置載入: {len(config)} 個參數")

        required_params = ['long_window_size', 'short_window_size', 'feature_step_size']
        for param in required_params:
            if param in config:
                print(f"  {param}: {config[param]}")
            else:
                print(f"  ❌ 缺少參數: {param}")

        return True

    except Exception as e:
        print(f"❌ ETL 整合測試失敗: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    """執行所有測試"""
    print("開始 ETL 配置測試")
    print("=" * 50)

    tests = [
        test_config_import,
        test_room_functions,
        test_time_ranges,
        test_etl_integration
    ]

    passed = 0
    total = len(tests)

    for test_func in tests:
        try:
            if test_func():
                passed += 1
        except Exception as e:
            print(f"❌ 測試 {test_func.__name__} 發生未預期錯誤: {e}")

    print("\n" + "=" * 50)
    print(f"測試結果: {passed}/{total} 通過")

    if passed == total:
        print("🎉 所有測試通過！配置文件運作正常")
        return True
    else:
        print("⚠️  部分測試失敗，請檢查配置")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
