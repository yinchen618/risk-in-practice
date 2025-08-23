"""
數據預處理 ETL 配置文件
包含了 ETL 腳本的各種配置參數和常用房間設定。
使用者可以根據需要修改這些參數來適應不同的數據環境。
"""

import os
from datetime import datetime, timedelta
from typing import List, Dict
from enum import Enum

# 避免循環導入，直接在這裡定義需要的類別
class OccupantType(Enum):
    STUDENT = "STUDENT"
    OFFICE_WORKER = "OFFICE_WORKER"
    UNKNOWN = "UNKNOWN"

class RoomInfo:
    def __init__(self, building: str, floor: str, room: str,
                 meter_id_l1: str, meter_id_l2: str,
                 occupant_type: OccupantType, is_high_quality: bool = False):
        self.building = building
        self.floor = floor
        self.room = room
        self.meter_id_l1 = meter_id_l1
        self.meter_id_l2 = meter_id_l2
        self.occupant_type = occupant_type
        self.is_high_quality = is_high_quality

# ========== 數據庫配置 ==========
DATABASE_CONFIG = {
    # 本專案實際使用的資料庫連接
    "default_url": os.getenv("DATABASE_URL",
                            "postgresql://postgres:ZMZ.YGK0yz0-f8b@supa.clkvfvz5fxb3.ap-northeast-3.rds.amazonaws.com:5432/supa?sslmode=require"),

    # 連接池設定
    "max_connections": 10,
    "connection_timeout": 30
}

# ========== ETL 處理參數 ==========
ETL_CONFIG = {
    # 數據窗口設定
    "default_window_days": 3,   # 改為3天的黃金窗口（更實際）
    "min_window_days": 1,       # 最小窗口1天
    "max_window_days": 7,       # 最大窗口7天

    # 數據品質閾值（調整為適合真實IoT電表數據的參數）
    "min_completeness_ratio": 0.1,  # 降低到10%（電表不會每分鐘記錄）
    "max_missing_periods": 15000,   # 大幅增加允許缺失時段數

    # 時間對齊設定
    "resample_frequency": "1T",  # 重採樣頻率 (1分鐘)
    "ffill_limit": 5,           # 增加向前填充限制到5分鐘

    # 異常事件關聯容差
    "anomaly_time_tolerance_minutes": 10,  # 增加異常事件時間關聯容差

    # 多尺度特徵工程配置
    "long_window_size": 60,     # 長期窗口60分鐘
    "short_window_size": 15,    # 短期窗口15分鐘
    "feature_step_size": 1,     # 特徵提取步長1分鐘
}

# ========== 預定義房間設定 ==========
# 根據高品質週期分析結果，重點關注 15學舍(Building A) 的 2樓、3樓、5樓房間

PREDEFINED_ROOMS: List[RoomInfo] = [
    # Building A 2樓房間（15學舍2樓 = A2樓，高品質週期排名第4、5、6）
    RoomInfo(
        building="Building-A",
        floor="2F",
        room="Room-201",
        meter_id_l1="E8FDF8B47BF1",  # Building A201
        meter_id_l2="402A8FB024B2",  # Building A201a
        occupant_type=OccupantType.STUDENT,
        is_high_quality=True  # 高品質房間
    ),

    RoomInfo(
        building="Building-A",
        floor="2F",
        room="Room-202",
        meter_id_l1="E8FDF8B4A414",  # Building A202
        meter_id_l2="402A8FB02F21",  # Building A202a
        occupant_type=OccupantType.STUDENT,
        is_high_quality=True  # 高品質房間
    ),

    # Building A 3樓房間（15學舍3樓 = A3樓，高品質週期排名第1、2、3）
    RoomInfo(
        building="Building-A",
        floor="3F",
        room="Room-301",
        meter_id_l1="E8FDF8B447BB",  # Building A301
        meter_id_l2="402A8FB01202",  # Building A301a
        occupant_type=OccupantType.STUDENT,
        is_high_quality=True  # 最高品質房間
    ),

    RoomInfo(
        building="Building-A",
        floor="3F",
        room="Room-302",
        meter_id_l1="E8FDF8B49D2C",  # Building A302
        meter_id_l2="402A8FB02037",  # Building A302a
        occupant_type=OccupantType.STUDENT,
        is_high_quality=True  # 最高品質房間
    ),

    RoomInfo(
        building="Building-A",
        floor="3F",
        room="Room-303",
        meter_id_l1="E8FDF8B44756",  # Building A303
        meter_id_l2="402A8FB02865",  # Building A303a
        occupant_type=OccupantType.STUDENT,
        is_high_quality=True  # 最高品質房間
    ),

    RoomInfo(
        building="Building-A",
        floor="3F",
        room="Room-305",
        meter_id_l1="E8FDF8B442FB",  # Building A305
        meter_id_l2="402A8FB051EF",  # Building A305a
        occupant_type=OccupantType.STUDENT,
        is_high_quality=True  # 最高品質房間
    ),

    # Building A 5樓房間（15學舍5樓 = A5樓，高品質週期排名第7）
    RoomInfo(
        building="Building-A",
        floor="5F",
        room="Room-501",
        meter_id_l1="E8FDF8B47C62",  # Building A501
        meter_id_l2="402A8FB023D1",  # Building A501a
        occupant_type=OccupantType.STUDENT,
        is_high_quality=True  # 高品質房間
    ),

    RoomInfo(
        building="Building-A",
        floor="5F",
        room="Room-502",
        meter_id_l1="E8FDF8B48153",  # Building A502
        meter_id_l2="402A8FB023BB",  # Building A502a
        occupant_type=OccupantType.STUDENT,
        is_high_quality=True  # 高品質房間
    ),

    RoomInfo(
        building="Building-A",
        floor="5F",
        room="Room-503",
        meter_id_l1="E8FDF8B4818F",  # Building A503
        meter_id_l2="402A8FB01404",  # Building A503a
        occupant_type=OccupantType.STUDENT,
        is_high_quality=True  # 高品質房間
    ),

    # 保留一些1樓房間作為對照組
    RoomInfo(
        building="Building-A",
        floor="1F",
        room="Room-101",
        meter_id_l1="402A8FB04CDC",  # Building A101
        meter_id_l2="402A8FB028E7",  # Building A101a
        occupant_type=OccupantType.OFFICE_WORKER,
        is_high_quality=False  # 對照組房間
    ),
]

# ========== 常用時間範圍預設 ==========
TIME_RANGES = {
    # 高品質週期數據 - 根據分析結果選擇的最佳週期
    # "high_quality_weeks": {
    #     "name": "高品質週期數據",
    #     "start": datetime(2025, 7, 21),
    #     "end": datetime(2025, 8, 25),  # 包含到 2025-08-18 週的結束
    #     "description": "基於數據品質分析選擇的最佳週期"
    # },
    # 2025年各月份
    # "2025_08": {
    #     "name": "2025年8月",
    #     "start": datetime(2025, 8, 1),
    #     "end": datetime(2025, 8, 23),  # 更新到23日
    #     "description": "2025年8月至23日"
    # },
    # "2025_07": {
    #     "name": "2025年7月",
    #     "start": datetime(2025, 7, 1),
    #     "end": datetime(2025, 7, 31),
    #     "description": "2025年7月完整月份"
    # },


    # 測試用短期資料
    "test_week": {
        "name": "測試週",
        "start": datetime(2025, 8, 7),
        "end": datetime(2025, 8, 14),
        "description": "一週測試數據"
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
        room_id: 房間標識符，格式如 "Building-A-1F-Room-101"

    Returns:
        RoomInfo: 房間資訊對象

    Raises:
        ValueError: 如果找不到對應的房間
    """
    for room in PREDEFINED_ROOMS:
        if f"{room.building}-{room.floor}-{room.room}" == room_id:
            return room

    raise ValueError(f"找不到房間 ID: {room_id}")

def get_database_url() -> str:
    """
    獲取資料庫連接 URL

    Returns:
        str: 資料庫連接字串
    """
    return DATABASE_CONFIG["default_url"]

def get_etl_config() -> Dict:
    """
    獲取完整的 ETL 配置

    Returns:
        Dict: ETL 配置字典
    """
    return ETL_CONFIG.copy()

def get_room_by_meter_ids(meter_l1: str, meter_l2: str) -> RoomInfo:
    """
    根據電表 ID 找到對應的房間

    Args:
        meter_l1: L1 電表 ID
        meter_l2: L2 電表 ID

    Returns:
        RoomInfo: 匹配的房間資訊

    Raises:
        ValueError: 如果找不到匹配的房間
    """
    for room in PREDEFINED_ROOMS:
        if room.meter_id_l1 == meter_l1 and room.meter_id_l2 == meter_l2:
            return room

    raise ValueError(f"找不到電表 L1={meter_l1}, L2={meter_l2} 對應的房間")

def list_available_rooms() -> List[str]:
    """
    列出所有可用的房間 ID

    Returns:
        List[str]: 房間 ID 列表
    """
    return [f"{room.building}-{room.floor}-{room.room}" for room in PREDEFINED_ROOMS]

def get_predefined_rooms() -> List[RoomInfo]:
    """
    獲取所有預定義的房間資訊

    Returns:
        List[RoomInfo]: 房間資訊列表
    """
    return PREDEFINED_ROOMS.copy()

def get_rooms_by_building(building: str) -> List[RoomInfo]:
    """
    根據建築物獲取房間列表

    Args:
        building: 建築物名稱

    Returns:
        List[RoomInfo]: 該建築物的房間列表
    """
    return [room for room in PREDEFINED_ROOMS if room.building == building]

def get_rooms_by_occupant_type(occupant_type: OccupantType) -> List[RoomInfo]:
    """
    根據佔用類型獲取房間列表

    Args:
        occupant_type: 佔用類型

    Returns:
        List[RoomInfo]: 該類型的房間列表
    """
    return [room for room in PREDEFINED_ROOMS if room.occupant_type == occupant_type]

def get_high_quality_rooms() -> List[RoomInfo]:
    """
    獲取被標記為高品質的房間配置
    基於數據分析結果和配置中的 is_high_quality 標籤

    Returns:
        List[RoomInfo]: 高品質房間列表
    """
    return [room for room in PREDEFINED_ROOMS if room.is_high_quality]

def get_time_range(range_name: str) -> Dict[str, datetime]:
    """
    根據範圍名稱獲取預定義的時間範圍
    支援動態時間範圍計算

    Args:
        range_name: 時間範圍名稱

    Returns:
        Dict: 包含 'start' 和 'end' 鍵的字典

    Raises:
        ValueError: 如果找不到對應的時間範圍
    """
    # 優先處理動態範圍
    if range_name == "last_7_days":
        end_time = datetime.now()
        start_time = end_time - timedelta(days=7)
        return {
            "name": "最近7天",
            "start": start_time,
            "end": end_time,
            "description": "動態的最近7天範圍"
        }

    # 處理靜態範圍
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
