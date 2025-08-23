#!/usr/bin/env python3
"""
ETL 使用範例 - 使用配置文件

展示如何使用 etl_config.py 中的配置來簡化 ETL 操作
"""

import sys
import os
import asyncio
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from data_preprocessing_etl_multiscale import DataPreprocessingETL
from etl_config import (
    get_predefined_rooms, get_time_range, get_rooms_by_building,
    get_rooms_by_occupant_type, OccupantType
)

async def example_single_room_processing():
    """範例1：單房間處理（使用配置文件中的預定義房間）"""
    print("=== 範例1：單房間處理 ===")

    # 獲取預定義房間
    rooms = get_predefined_rooms()
    if not rooms:
        print("❌ 沒有預定義房間")
        return

    # 選擇第一個房間
    room = rooms[0]
    print(f"選擇房間: {room.building}-{room.floor}-{room.room}")
    print(f"電表 L1: {room.meter_id_l1}")
    print(f"電表 L2: {room.meter_id_l2}")

    # 獲取時間範圍
    time_range = get_time_range("2025_08")
    print(f"處理時間: {time_range['start']} ~ {time_range['end']}")

    # 創建 ETL 實例（使用配置文件中的資料庫設定）
    etl = DataPreprocessingETL()

    try:
        # 這裡應該連接資料庫並處理，但為了演示我們跳過
        print("✅ ETL 配置載入成功")
        print(f"多尺度設定: {etl.config['short_window_size']}分鐘 + {etl.config['long_window_size']}分鐘")

        # await etl.connect_database()
        # dataset_id = await etl.process_room_data(
        #     room_info=room,
        #     search_start=time_range["start"],
        #     search_end=time_range["end"],
        #     window_days=7,
        #     enable_multiscale_features=True
        # )
        # print(f"✅ 處理完成，數據集 ID: {dataset_id}")

    except Exception as e:
        print(f"❌ 處理失敗: {e}")

async def example_building_batch_processing():
    """範例2：按建築物批次處理"""
    print("\n=== 範例2：按建築物批次處理 ===")

    # 獲取 Building-A 的所有房間
    building_a_rooms = get_rooms_by_building("Building-A")
    print(f"Building-A 房間數: {len(building_a_rooms)}")

    for room in building_a_rooms:
        print(f"  - {room.building}-{room.floor}-{room.room} ({room.occupant_type.value})")

    # 獲取測試時間範圍
    time_range = get_time_range("test_week")
    print(f"測試時間範圍: {time_range['start']} ~ {time_range['end']}")

    print("✅ 批次處理配置準備完成")

async def example_occupant_type_filtering():
    """範例3：按佔用類型篩選房間"""
    print("\n=== 範例3：按佔用類型篩選 ===")

    # 獲取辦公室房間
    office_rooms = get_rooms_by_occupant_type(OccupantType.OFFICE_WORKER)
    print(f"辦公室房間 ({len(office_rooms)} 個):")
    for room in office_rooms:
        print(f"  - {room.building}-{room.floor}-{room.room}")

    # 獲取學生房間
    student_rooms = get_rooms_by_occupant_type(OccupantType.STUDENT)
    print(f"\n學生房間 ({len(student_rooms)} 個):")
    for room in student_rooms:
        print(f"  - {room.building}-{room.floor}-{room.room}")

    # 獲取倉庫房間
    depot_rooms = get_rooms_by_occupant_type(OccupantType.DEPOSITORY)
    print(f"\n倉庫房間 ({len(depot_rooms)} 個):")
    for room in depot_rooms:
        print(f"  - {room.building}-{room.floor}-{room.room}")

def example_csv_batch_processing():
    """範例4：CSV 批次處理配置"""
    print("\n=== 範例4：CSV 批次處理配置 ===")

    # 顯示如何配置批次處理
    print("CSV 批次處理設定:")
    print("  - CSV 檔案: meter.csv")
    print("  - 時間範圍: 從 etl_config.py 載入")
    print("  - 資料庫: 從 etl_config.py 載入")
    print("  - 多尺度特徵: 15分鐘 + 60分鐘")

    # 範例程式碼
    code_example = """
    # 實際使用範例：
    etl = DataPreprocessingETL()  # 自動載入配置
    await etl.connect_database()

    time_range = get_time_range("2025_08")
    dataset_ids = await etl.process_multiple_rooms_from_csv(
        csv_path="meter.csv",
        search_start=time_range["start"],
        search_end=time_range["end"],
        window_days=7,
        enable_multiscale_features=True,
        max_concurrent=3
    )
    """

    print("\n程式碼範例:")
    print(code_example)

async def main():
    """執行所有範例"""
    print("ETL 配置系統使用範例")
    print("=" * 50)

    await example_single_room_processing()
    await example_building_batch_processing()
    await example_occupant_type_filtering()
    example_csv_batch_processing()

    print("\n" + "=" * 50)
    print("🎉 所有範例展示完成！")
    print("\n主要優點:")
    print("  ✅ 統一配置管理")
    print("  ✅ 真實電表 ID")
    print("  ✅ 本專案資料庫連接")
    print("  ✅ 靈活的房間篩選")
    print("  ✅ 預定義時間範圍")

if __name__ == "__main__":
    asyncio.run(main())
