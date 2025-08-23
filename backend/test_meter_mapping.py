#!/usr/bin/env python3
"""
電表映射測試腳本

這個腳本用於測試 meter.csv 的讀取和解析功能，
不需要連接數據庫就可以驗證電表映射是否正確。
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from data_preprocessing_etl_multiscale import DataPreprocessingETL, OccupantType
import logging

# 設置日誌級別
logging.basicConfig(level=logging.INFO)

def test_meter_mapping():
    """測試電表映射功能"""
    print("=" * 60)
    print("電表映射測試腳本")
    print("=" * 60)

    try:
        # 創建 ETL 實例（不需要真實數據庫連接）
        etl = DataPreprocessingETL("dummy://connection")

        # 測試1: 載入電表映射
        print("\n1. 測試載入電表映射...")
        meter_mapping = etl.load_meter_mapping("meter.csv")

        print(f"✅ 成功載入 {len(meter_mapping)} 個房間的電表映射")

        # 測試2: 創建房間資訊
        print("\n2. 測試創建房間資訊...")
        room_infos = etl.create_room_info_from_mapping(meter_mapping)

        print(f"✅ 成功創建 {len(room_infos)} 個房間資訊")

        # 測試3: 顯示詳細映射資訊
        print("\n3. 詳細電表映射資訊:")
        print("-" * 60)
        print(f"{'房間名稱':<20} {'L1 電表ID':<15} {'L2 電表ID':<15}")
        print("-" * 60)

        for i, (room_name, (l1_id, l2_id)) in enumerate(list(meter_mapping.items())[:10]):
            print(f"{room_name:<20} {l1_id:<15} {l2_id:<15}")

        if len(meter_mapping) > 10:
            print(f"... 還有 {len(meter_mapping) - 10} 個房間")

        # 測試4: 顯示房間資訊範例
        print(f"\n4. 房間資訊範例 (前5個):")
        print("-" * 80)
        print(f"{'建築':<15} {'樓層':<8} {'房間':<12} {'L1 電表':<15} {'L2 電表':<15}")
        print("-" * 80)

        for i, room_info in enumerate(room_infos[:5]):
            print(f"{room_info.building:<15} {room_info.floor:<8} {room_info.room:<12} "
                  f"{room_info.meter_id_l1:<15} {room_info.meter_id_l2:<15}")

        # 測試5: 驗證配對完整性
        print(f"\n5. 配對完整性檢查:")
        total_meters_in_csv = 0

        with open("meter.csv", 'r', encoding='utf-8') as f:
            total_meters_in_csv = sum(1 for line in f) - 1  # 減去標題行

        expected_rooms = total_meters_in_csv // 2  # 每個房間2個電表
        actual_rooms = len(meter_mapping)

        print(f"CSV 總電表數: {total_meters_in_csv}")
        print(f"預期房間數: {expected_rooms}")
        print(f"實際房間數: {actual_rooms}")
        print(f"配對成功率: {actual_rooms/expected_rooms:.1%}")

        if actual_rooms < expected_rooms:
            print("⚠️  可能存在未配對的電表")
        else:
            print("✅ 所有電表都已成功配對")

        print("\n" + "=" * 60)
        print("測試完成！電表映射功能正常")
        print("=" * 60)

        return True

    except FileNotFoundError as e:
        print(f"❌ 文件未找到: {e}")
        print("請確保 meter.csv 文件存在於當前目錄")
        return False

    except Exception as e:
        print(f"❌ 測試失敗: {e}")
        return False

if __name__ == "__main__":
    success = test_meter_mapping()
    sys.exit(0 if success else 1)
