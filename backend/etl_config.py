"""
數據預處理 ETL 配置文件

這個文件包含了 ETL 腳本的各種配置參數和常用房間設定。
使用者可以根據需要修改這些參數來適應不同的數據環境。
"""

from datetime import datetime
from typing import List, Dict
from data_preprocessing_etl import RoomInfo, OccupantType

# ========== 數據庫配置 ==========
DATABASE_CONFIG = {
    # 如果環境變數中沒有 DATABASE_URL，使用此預設值
    "default_url": "postgresql://postgres:24681357@supa.clkvfvz5fxb3.ap-northeast-3.rds.amazonaws.com:5432/supa",

    # 連接池設定
    "max_connections": 10,
    "connection_timeout": 30
}

# ========== ETL 處理參數 ==========
ETL_CONFIG = {
    # 數據窗口設定
    "default_window_days": 7,  # 預設尋找 7 天的黃金窗口
    "min_window_days": 3,      # 最小窗口天數
    "max_window_days": 14,     # 最大窗口天數

    # 數據品質閾值
    "min_completeness_ratio": 0.8,  # 最小數據完整性比例 (80%)
    "max_missing_periods": 100,     # 最大允許缺失時段數

    # 時間對齊設定
    "resample_frequency": "1T",  # 重採樣頻率 (1分鐘)
    "ffill_limit": 3,           # 向前填充限制 (3分鐘)

    # 異常事件關聯容差
    "anomaly_time_tolerance_minutes": 5,  # 異常事件時間關聯容差 (±5分鐘)
}

# ========== 預定義房間設定 ==========
# 這裡可以預先定義一些常用的房間配置，方便批量處理

PREDEFINED_ROOMS: List[RoomInfo] = [
    # Building A 範例房間
    RoomInfo(
        building="Building-A",
        floor="3F",
        room="Room-301",
        meter_id_l1="METER_A_L1_301",
        meter_id_l2="METER_A_L2_301",
        occupant_type=OccupantType.OFFICE_WORKER
    ),

    RoomInfo(
        building="Building-A",
        floor="3F",
        room="Room-302",
        meter_id_l1="METER_A_L1_302",
        meter_id_l2="METER_A_L2_302",
        occupant_type=OccupantType.OFFICE_WORKER
    ),

    # Building B 範例房間
    RoomInfo(
        building="Building-B",
        floor="2F",
        room="Room-201",
        meter_id_l1="METER_B_L1_201",
        meter_id_l2="METER_B_L2_201",
        occupant_type=OccupantType.STUDENT
    ),

    # 倉庫範例
    RoomInfo(
        building="Warehouse",
        floor="1F",
        room="Storage-A",
        meter_id_l1="METER_W_L1_A01",
        meter_id_l2="METER_W_L2_A01",
        occupant_type=OccupantType.DEPOSITORY
    ),
]

# ========== 常用時間範圍預設 ==========
TIME_RANGES = {
    # 目標訓練期間 - 2025年7月21日至8月23日
    "training_period": {
        "start": datetime(2025, 7, 21),
        "end": datetime(2025, 8, 23),
        "description": "完整的預訓練數據期間"
    },

    # 2025年各月份
    "2025_08": {
        "start": datetime(2025, 8, 1),
        "end": datetime(2025, 8, 23)  # 更新到23日
    },
    "2025_07": {
        "start": datetime(2025, 7, 1),
        "end": datetime(2025, 7, 31)
    },
    "2025_06": {
        "start": datetime(2025, 6, 1),
        "end": datetime(2025, 6, 30)
    },

    # 自定義範圍範例
    "last_30_days": {
        "start": datetime.now().replace(day=1) - datetime.timedelta(days=30),
        "end": datetime.now().replace(day=1)
    }
}

# ========== 日誌配置 ==========
LOGGING_CONFIG = {
    "level": "INFO",
    "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    "log_file": "etl_processing.log",
    "max_file_size": "10MB",
    "backup_count": 5
}

# ========== 批量處理配置 ==========
BATCH_CONFIG = {
    "max_concurrent_rooms": 3,  # 同時處理的最大房間數
    "retry_attempts": 3,        # 失敗重試次數
    "retry_delay_seconds": 60,  # 重試間隔 (秒)
}

def get_room_by_id(room_id: str) -> RoomInfo:
    """
    根據房間 ID 獲取預定義的房間資訊

    Args:
        room_id: 房間標識符，格式如 "Building-A-3F-Room-301"

    Returns:
        RoomInfo: 房間資訊對象

    Raises:
        ValueError: 如果找不到對應的房間
    """
    for room in PREDEFINED_ROOMS:
        if f"{room.building}-{room.floor}-{room.room}" == room_id:
            return room

    raise ValueError(f"找不到房間 ID: {room_id}")

def get_time_range(range_name: str) -> Dict[str, datetime]:
    """
    根據範圍名稱獲取預定義的時間範圍

    Args:
        range_name: 時間範圍名稱

    Returns:
        Dict: 包含 'start' 和 'end' 鍵的字典

    Raises:
        ValueError: 如果找不到對應的時間範圍
    """
    if range_name not in TIME_RANGES:
        raise ValueError(f"找不到時間範圍: {range_name}")

    return TIME_RANGES[range_name]

# ========== 驗證函數 ==========
def validate_config():
    """
    驗證配置的合理性
    """
    # 檢查數據窗口設定
    if ETL_CONFIG["min_window_days"] > ETL_CONFIG["max_window_days"]:
        raise ValueError("最小窗口天數不能大於最大窗口天數")

    if ETL_CONFIG["min_completeness_ratio"] < 0 or ETL_CONFIG["min_completeness_ratio"] > 1:
        raise ValueError("數據完整性比例必須在 0-1 之間")

    # 檢查預定義房間的完整性
    for i, room in enumerate(PREDEFINED_ROOMS):
        if not all([room.building, room.floor, room.room,
                   room.meter_id_l1, room.meter_id_l2]):
            raise ValueError(f"預定義房間 {i} 的資訊不完整")

    print("配置驗證通過")

if __name__ == "__main__":
    # 驗證配置
    validate_config()

    # 顯示當前配置摘要
    print("=== ETL 配置摘要 ===")
    print(f"預設數據窗口: {ETL_CONFIG['default_window_days']} 天")
    print(f"最小完整性比例: {ETL_CONFIG['min_completeness_ratio']}")
    print(f"預定義房間數量: {len(PREDEFINED_ROOMS)}")
    print(f"可用時間範圍: {list(TIME_RANGES.keys())}")
