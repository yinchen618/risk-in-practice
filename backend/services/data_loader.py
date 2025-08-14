"""
數據載入服務 - 管理原始數據的讀取
從實際資料庫載入真實電表數據
"""

import pandas as pd
import numpy as np
from typing import Optional, Dict, Any, List
from datetime import datetime, timedelta, date
import asyncio
import logging
from sqlalchemy.future import select
from core.database import db_manager

logger = logging.getLogger(__name__)

class DataLoaderService:
    """數據載入服務 - 專門負責載入真實數據"""

    def __init__(self):

        # 設備編號到房間信息的映射（基於 meter.csv）
        self._device_room_mapping = {
            # Building A
            "402A8FB04CDC": {"building": "Building A", "room": "101", "floor": "1"},
            "402A8FB028E7": {"building": "Building A", "room": "101a", "floor": "1"},
            "402A8FB05065": {"building": "Building A", "room": "102", "floor": "1"},
            "402A8FB01BFF": {"building": "Building A", "room": "102a", "floor": "1"},
            "E8FDF8B44118": {"building": "Building A", "room": "103", "floor": "1"},
            "402A8FB00A1D": {"building": "Building A", "room": "103a", "floor": "1"},
            "E8FDF8B47729": {"building": "Building A", "room": "105", "floor": "1"},
            "402A8FB0054A": {"building": "Building A", "room": "105a", "floor": "1"},
            "E8FDF8B46E2B": {"building": "Building A", "room": "106", "floor": "1"},
            "402A8FB02535": {"building": "Building A", "room": "106a", "floor": "1"},
            "E8FDF8B43C16": {"building": "Building A", "room": "107", "floor": "1"},
            "402A8FB0395A": {"building": "Building A", "room": "107a", "floor": "1"},
            "402A8FB039A8": {"building": "Building A", "room": "108", "floor": "1"},
            "402A8FB0124A": {"building": "Building A", "room": "108a", "floor": "1"},
            "E8FDF8B44093": {"building": "Building A", "room": "110", "floor": "1"},
            "402A8FB02444": {"building": "Building A", "room": "110a", "floor": "1"},

            # Building A 2樓
            "E8FDF8B47BF1": {"building": "Building A", "room": "201", "floor": "2"},
            "402A8FB024B2": {"building": "Building A", "room": "201a", "floor": "2"},
            "E8FDF8B4A414": {"building": "Building A", "room": "202", "floor": "2"},
            "402A8FB02F21": {"building": "Building A", "room": "202a", "floor": "2"},
            "E8FDF8B48159": {"building": "Building A", "room": "203", "floor": "2"},
            "402A8FB04228": {"building": "Building A", "room": "203a", "floor": "2"},
            "E8FDF8B4DD72": {"building": "Building A", "room": "205", "floor": "2"},
            "402A8FB04D18": {"building": "Building A", "room": "205a", "floor": "2"},
            "E8FDF8B458ED": {"building": "Building A", "room": "206", "floor": "2"},
            "402A8FB05156": {"building": "Building A", "room": "206a", "floor": "2"},
            "E8FDF8B484B9": {"building": "Building A", "room": "207", "floor": "2"},
            "402A8FB03312": {"building": "Building A", "room": "207a", "floor": "2"},
            "E8FDF8B46C9D": {"building": "Building A", "room": "208", "floor": "2"},
            "402A8FB02FD7": {"building": "Building A", "room": "208a", "floor": "2"},
            "E8FDF8B47815": {"building": "Building A", "room": "209", "floor": "2"},
            "402A8FB044EE": {"building": "Building A", "room": "209a", "floor": "2"},
            "E8FDF8B442F8": {"building": "Building A", "room": "210", "floor": "2"},
            "402A8FB03FBF": {"building": "Building A", "room": "210a", "floor": "2"},
            "E8FDF8B43B3F": {"building": "Building A", "room": "211", "floor": "2"},
            "402A8FB04D63": {"building": "Building A", "room": "211a", "floor": "2"},
            "E8FDF8B49ADB": {"building": "Building A", "room": "212", "floor": "2"},
            "402A8FB04B14": {"building": "Building A", "room": "212a", "floor": "2"},
            "E8FDF8B47C65": {"building": "Building A", "room": "216", "floor": "2"},
            "402A8FB039F9": {"building": "Building A", "room": "216a", "floor": "2"},

            # Building A 3樓
            "E8FDF8B447BB": {"building": "Building A", "room": "301", "floor": "3"},
            "402A8FB01202": {"building": "Building A", "room": "301a", "floor": "3"},
            "E8FDF8B49D2C": {"building": "Building A", "room": "302", "floor": "3"},
            "402A8FB02037": {"building": "Building A", "room": "302a", "floor": "3"},
            "E8FDF8B44756": {"building": "Building A", "room": "303", "floor": "3"},
            "402A8FB02865": {"building": "Building A", "room": "303a", "floor": "3"},
            "E8FDF8B442FB": {"building": "Building A", "room": "305", "floor": "3"},
            "402A8FB051EF": {"building": "Building A", "room": "305a", "floor": "3"},
            "E8FDF8B455D9": {"building": "Building A", "room": "306", "floor": "3"},
            "402A8FB0254B": {"building": "Building A", "room": "306a", "floor": "3"},
            "E8FDF8B43F7D": {"building": "Building A", "room": "307", "floor": "3"},
            "402A8FB00F0E": {"building": "Building A", "room": "307a", "floor": "3"},
            "E8FDF8B46E39": {"building": "Building A", "room": "308", "floor": "3"},
            "402A8FB011F9": {"building": "Building A", "room": "308a", "floor": "3"},
            "E8FDF8B44877": {"building": "Building A", "room": "309", "floor": "3"},
            "402A8FB02FBA": {"building": "Building A", "room": "309a", "floor": "3"},
            "E8FDF8B442F7": {"building": "Building A", "room": "310", "floor": "3"},
            "402A8FB01AFD": {"building": "Building A", "room": "310a", "floor": "3"},
            "E8FDF8B47C9A": {"building": "Building A", "room": "311", "floor": "3"},
            "402A8FB02F26": {"building": "Building A", "room": "311a", "floor": "3"},
            "E8FDF8B4DBAF": {"building": "Building A", "room": "312", "floor": "3"},
            "402A8FB01B4E": {"building": "Building A", "room": "312a", "floor": "3"},
            "E8FDF8B451BD": {"building": "Building A", "room": "316", "floor": "3"},
            "402A8FB016F5": {"building": "Building A", "room": "316a", "floor": "3"},

            # 15學舍 5樓
            "E8FDF8B47C62": {"building": "Building A", "room": "501", "floor": "5"},
            "402A8FB023D1": {"building": "Building A", "room": "501a", "floor": "5"},
            "E8FDF8B48153": {"building": "Building A", "room": "502", "floor": "5"},
            "402A8FB023BB": {"building": "Building A", "room": "502a", "floor": "5"},
            "E8FDF8B4818F": {"building": "Building A", "room": "503", "floor": "5"},
            "402A8FB01404": {"building": "Building A", "room": "503a", "floor": "5"},
            "E8FDF8B442AB": {"building": "Building A", "room": "505", "floor": "5"},
            "402A8FB00D13": {"building": "Building A", "room": "505a", "floor": "5"},
            "E8FDF8B43CA5": {"building": "Building A", "room": "506", "floor": "5"},
            "402A8FB0188F": {"building": "Building A", "room": "506a", "floor": "5"},
            "E8FDF8B487D8": {"building": "Building A", "room": "507", "floor": "5"},
            "402A8FB020F4": {"building": "Building A", "room": "507a", "floor": "5"},
            "E8FDF8B49F48": {"building": "Building A", "room": "508", "floor": "5"},
            "402A8FB01CD7": {"building": "Building A", "room": "508a", "floor": "5"},
            "E8FDF8B4AEE2": {"building": "Building A", "room": "509", "floor": "5"},
            "402A8FB00975": {"building": "Building A", "room": "509a", "floor": "5"},
            "E8FDF8B45ED5": {"building": "Building A", "room": "510", "floor": "5"},
            "402A8FB02055": {"building": "Building A", "room": "510a", "floor": "5"},
            "E8FDF8B47D44": {"building": "Building A", "room": "511", "floor": "5"},
            "402A8FB0028B": {"building": "Building A", "room": "511a", "floor": "5"},
            "E8FDF8B449CA": {"building": "Building A", "room": "512", "floor": "5"},
            "402A8FB011AB": {"building": "Building A", "room": "512a", "floor": "5"},
            "E8FDF8B46F02": {"building": "Building A", "room": "516", "floor": "5"},
            "402A8FB02104": {"building": "Building A", "room": "516a", "floor": "5"},

            # 85學舍 1樓
            "402A8FB020AD": {"building": "Building B", "room": "101", "floor": "1"},
            "402A8FB00D46": {"building": "Building B", "room": "102", "floor": "1"},
            "402A8FB007F2": {"building": "Building B", "room": "103", "floor": "1"},
            "402A8FB020CE": {"building": "Building B", "room": "107", "floor": "1"},
            "402A8FB00C51": {"building": "Building B", "room": "109", "floor": "1"},

            # 85學舍 2樓
            "402A8FB03500": {"building": "Building B", "room": "201", "floor": "2"},
            "402A8FB03290": {"building": "Building B", "room": "201a", "floor": "2"},
            "402A8FB044D2": {"building": "Building B", "room": "202", "floor": "2"},
            "402A8FB048A2": {"building": "Building B", "room": "202a", "floor": "2"},
            "402A8FB042E3": {"building": "Building B", "room": "203", "floor": "2"},
            "402A8FB032B4": {"building": "Building B", "room": "203a", "floor": "2"},
            "402A8FB034FE": {"building": "Building B", "room": "205", "floor": "2"},
            "402A8FB03045": {"building": "Building B", "room": "205a", "floor": "2"},
            "402A8FB03278": {"building": "Building B", "room": "206", "floor": "2"},
            "402A8FB03F68": {"building": "Building B", "room": "206a", "floor": "2"},
            "402A8FB02DDF": {"building": "Building B", "room": "207", "floor": "2"},
            "402A8FB04F58": {"building": "Building B", "room": "207a", "floor": "2"},
            "402A8FB03150": {"building": "Building B", "room": "208", "floor": "2"},
            "402A8FB050D6": {"building": "Building B", "room": "208a", "floor": "2"},
            "402A8FB0271E": {"building": "Building B", "room": "209", "floor": "2"},
            "402A8FB0328D": {"building": "Building B", "room": "209a", "floor": "2"},
            "402A8FB04F4B": {"building": "Building B", "room": "210", "floor": "2"},
            "402A8FB030E4": {"building": "Building B", "room": "210a", "floor": "2"},
            "402A8FB031FA": {"building": "Building B", "room": "211", "floor": "2"},
            "402A8FB031BC": {"building": "Building B", "room": "211a", "floor": "2"},
            "402A8FB04F86": {"building": "Building B", "room": "212", "floor": "2"},
            "402A8FB04FE3": {"building": "Building B", "room": "212a", "floor": "2"},

            # 85學舍 3樓
            "402A8FB050FD": {"building": "Building B", "room": "301", "floor": "3"},
            "402A8FB03097": {"building": "Building B", "room": "301a", "floor": "3"},
            "402A8FB03BC5": {"building": "Building B", "room": "302", "floor": "3"},
            "402A8FB04F89": {"building": "Building B", "room": "302a", "floor": "3"},
            "402A8FB03330": {"building": "Building B", "room": "303", "floor": "3"},
            "402A8FB03C35": {"building": "Building B", "room": "305", "floor": "3"},
            "402A8FB042AF": {"building": "Building B", "room": "305a", "floor": "3"},
            "402A8FB031C2": {"building": "Building B", "room": "306", "floor": "3"},
            "402A8FB04624": {"building": "Building B", "room": "306a", "floor": "3"},
            "402A8FB004BC": {"building": "Building B", "room": "307", "floor": "3"},
            "402A8FB0437B": {"building": "Building B", "room": "307a", "floor": "3"},
            "402A8FB01D85": {"building": "Building B", "room": "308", "floor": "3"},
            "402A8FB00E04": {"building": "Building B", "room": "308a", "floor": "3"},
            "402A8FB04705": {"building": "Building B", "room": "309", "floor": "3"},
            "402A8FB03BC2": {"building": "Building B", "room": "309a", "floor": "3"},
            "402A8FB0381A": {"building": "Building B", "room": "310", "floor": "3"},
            "402A8FB0473B": {"building": "Building B", "room": "310a", "floor": "3"},
            "402A8FB0464B": {"building": "Building B", "room": "311", "floor": "3"},
            "402A8FB01676": {"building": "Building B", "room": "311a", "floor": "3"},
            "402A8FB0150F": {"building": "Building B", "room": "312", "floor": "3"},
            "402A8FB03D2F": {"building": "Building B", "room": "312a", "floor": "3"},

            # 85學舍 5樓
            "402A8FB038C7": {"building": "Building B", "room": "501", "floor": "5"},
            "402A8FB01E11": {"building": "Building B", "room": "502", "floor": "5"},
            "402A8FB02E5F": {"building": "Building B", "room": "502a", "floor": "5"},
            "402A8FB048DF": {"building": "Building B", "room": "503", "floor": "5"},
            "402A8FB04D86": {"building": "Building B", "room": "503a", "floor": "5"},
            "402A8FB040C7": {"building": "Building B", "room": "505", "floor": "5"},
            "402A8FB01891": {"building": "Building B", "room": "505a", "floor": "5"},
            "402A8FB01D3A": {"building": "Building B", "room": "506", "floor": "5"},
            "402A8FB03A4C": {"building": "Building B", "room": "506a", "floor": "5"},
            "402A8FB01AFA": {"building": "Building B", "room": "507", "floor": "5"},
            "402A8FB04712": {"building": "Building B", "room": "507a", "floor": "5"},
            "402A8FB04525": {"building": "Building B", "room": "508", "floor": "5"},
            "402A8FB0172D": {"building": "Building B", "room": "508a", "floor": "5"},
            "402A8FB02EC3": {"building": "Building B", "room": "509", "floor": "5"},
            "402A8FB00666": {"building": "Building B", "room": "510", "floor": "5"},
            "402A8FB00BB8": {"building": "Building B", "room": "510a", "floor": "5"},
            "402A8FB02590": {"building": "Building B", "room": "511", "floor": "5"},
            "402A8FB01A1F": {"building": "Building B", "room": "511a", "floor": "5"},
            "402A8FB0235E": {"building": "Building B", "room": "512", "floor": "5"},
            "402A8FB006BD": {"building": "Building B", "room": "512a", "floor": "5"},

            # 85學舍 6樓
            "402A8FB034FB": {"building": "Building B", "room": "601", "floor": "6"},
            "402A8FB044AE": {"building": "Building B", "room": "601a", "floor": "6"},
            "402A8FB04869": {"building": "Building B", "room": "602", "floor": "6"},
            "402A8FB02806": {"building": "Building B", "room": "602a", "floor": "6"},
            "402A8FB004C5": {"building": "Building B", "room": "603", "floor": "6"},
            "402A8FB047F8": {"building": "Building B", "room": "603a", "floor": "6"},
            "402A8FB048AA": {"building": "Building B", "room": "605", "floor": "6"},
            "402A8FB0481B": {"building": "Building B", "room": "605a", "floor": "6"},
            "402A8FB03BB4": {"building": "Building B", "room": "606", "floor": "6"},
            "402A8FB00493": {"building": "Building B", "room": "606a", "floor": "6"},
            "402A8FB00EB9": {"building": "Building B", "room": "607", "floor": "6"},
            "402A8FB03252": {"building": "Building B", "room": "607a", "floor": "6"},
            "402A8FB030E1": {"building": "Building B", "room": "608", "floor": "6"},
            "402A8FB0121F": {"building": "Building B", "room": "608a", "floor": "6"},
            "402A8FB012B1": {"building": "Building B", "room": "609", "floor": "6"},
            "402A8FB006E8": {"building": "Building B", "room": "609a", "floor": "6"},
        }

    def _get_allowed_devices_by_building(self, selected_floors_by_building: Dict[str, List[str]]) -> List[str]:
        """
        根據按建築物分組的樓層選擇，獲取允許的設備編號列表

        Args:
            selected_floors_by_building: 按建築物分組的樓層選擇（如 {"Building A": ["1", "2"], "Building B": ["2"]}）

        Returns:
            List[str]: 符合條件的設備編號列表
        """
        allowed_devices = []

        logging.info(f"[DEBUG] 開始篩選設備，條件: {selected_floors_by_building}")
        logging.info(f"[DEBUG] 設備映射總數: {len(self._device_room_mapping)}")

        building_device_count = {}

        for device_id, room_info in self._device_room_mapping.items():
            building = room_info["building"]
            floor = room_info["floor"]

            # 統計各建築物設備數
            if building not in building_device_count:
                building_device_count[building] = {}
            if floor not in building_device_count[building]:
                building_device_count[building][floor] = 0
            building_device_count[building][floor] += 1

            # 檢查該建築物是否有被選擇，以及該樓層是否在選擇的樓層中
            if building in selected_floors_by_building:
                selected_floors_for_building = selected_floors_by_building[building]
                logging.debug(f"[DEBUG] 檢查設備 {device_id}: 建築={building}, 樓層={floor}, 選擇樓層={selected_floors_for_building}")

                if floor in selected_floors_for_building:
                    allowed_devices.append(device_id)
                    logging.debug(f"[DEBUG] 設備 {device_id} 符合條件")

        logging.info(f"[DEBUG] 各建築物設備統計: {building_device_count}")
        logging.info(f"按建築物樓層過濾匹配設備: {len(allowed_devices)} 個設備")
        logging.info(f"過濾條件: {selected_floors_by_building}")

        if len(allowed_devices) > 0:
            logging.info(f"[DEBUG] 符合條件的前5個設備: {allowed_devices[:5]}")

        return allowed_devices

    def get_device_room_mapping(self) -> Dict[str, Dict[str, str]]:
        """
        取得設備編號到房間資訊的映射表

        Returns:
            Dict[str, Dict[str, str]]: 設備編號對應房間資訊的字典
        """
        return self._device_room_mapping.copy()

    async def load_meter_data_by_time_range(
        self,
        start_time: str,
        end_time: str,
        selected_floors_by_building: Optional[Dict[str, List[str]]] = None,
        meter_id: Optional[str] = None
    ) -> pd.DataFrame:
        """
        根據時間範圍載入電表數據 - 為候選事件計算特化的方法

        Args:
            start_time: 開始時間 (ISO格式字符串，如 "2025-08-12T14:56:00")
            end_time: 結束時間 (ISO格式字符串)
            selected_floors_by_building: 按建築物分組的樓層選擇
            meter_id: 可選的電表號碼（16進位編碼），如果提供則只載入該電表資料，忽略樓層篩選

        Returns:
            DataFrame 包含符合條件的電表數據
        """
        logger.info(f"[DATA_LOADER] load_meter_data_by_time_range 被調用")
        logger.info(f"  - start_time: {start_time}")
        logger.info(f"  - end_time: {end_time}")
        logger.info(f"  - meter_id: {meter_id}")
        logger.info(f"  - selected_floors_by_building: {selected_floors_by_building}")

        try:
            from sqlalchemy import func, and_
            from core.database import AmmeterLog
            import pandas as pd

            # 解析時間
            start_datetime = datetime.fromisoformat(start_time.replace('Z', '+00:00'))
            end_datetime = datetime.fromisoformat(end_time.replace('Z', '+00:00'))

            logger.info(f"[DATA_LOADER] 解析後的時間範圍: {start_datetime} 到 {end_datetime}")

            # 初始化設備過濾條件
            device_filter_condition = None
            allowed_devices = []

            # 如果指定了電表號碼，直接使用該電表，忽略樓層篩選
            if meter_id:
                logger.info(f"[DATA_LOADER] 使用指定電表號碼: {meter_id}")
                device_filter_condition = AmmeterLog.deviceNumber == meter_id
                allowed_devices = [meter_id]
            # 如果有樓層/建築過濾條件，獲取符合條件的設備列表
            elif selected_floors_by_building:
                logger.info(f"[DATA_LOADER] 使用按建築分組的樓層過濾: {selected_floors_by_building}")

                for device_id, room_info in self._device_room_mapping.items():
                    device_building = room_info["building"]
                    device_floor = room_info["floor"]

                    # 檢查該設備的建築物是否在選擇列表中
                    if device_building in selected_floors_by_building:
                        selected_floors_for_building = selected_floors_by_building[device_building]
                        # 檢查該設備的樓層是否在該建築物的選擇樓層中
                        if device_floor in selected_floors_for_building:
                            allowed_devices.append(device_id)
                            logger.debug(f"[DATA_LOADER] 匹配設備: {device_id} - {room_info['building']} {room_info['floor']}F {room_info['room']}")

                logger.info(f"[DATA_LOADER] 過濾後匹配的設備數量: {len(allowed_devices)}")

                # 建立設備過濾條件
                if allowed_devices:
                    device_filter_condition = AmmeterLog.deviceNumber.in_(allowed_devices)
                else:
                    # 如果沒有符合條件的設備，返回空DataFrame
                    logger.info("[DATA_LOADER] 沒有設備符合過濾條件，返回空DataFrame")
                    return pd.DataFrame()
            else:
                logger.info("[DATA_LOADER] 沒有指定電表號碼或樓層篩選條件，載入所有設備資料")

            # 從 AmmeterLog 表中查詢數據
            async with db_manager.get_async_session() as session:
                # 建立基本查詢條件
                base_conditions = [
                    AmmeterLog.createdAt >= start_datetime,
                    AmmeterLog.createdAt <= end_datetime,
                    AmmeterLog.action == "ammeterDetail",
                    AmmeterLog.success == True,
                    AmmeterLog.power.is_not(None),
                    AmmeterLog.power > 0
                ]

                # 如果有設備過濾條件，加入查詢
                if device_filter_condition is not None:
                    base_conditions.append(device_filter_condition)

                combined_condition = and_(*base_conditions)

                # 查詢數據
                query = select(AmmeterLog).where(combined_condition).order_by(AmmeterLog.deviceNumber, AmmeterLog.createdAt)
                result = await session.execute(query)
                logs = result.scalars().all()

                logger.info(f"[DATA_LOADER] 從資料庫查詢到 {len(logs)} 筆記錄")

                if not logs:
                    logger.warning("[DATA_LOADER] 沒有找到符合條件的電表數據")
                    return pd.DataFrame()

                # 轉換為 DataFrame
                data_rows = []
                for log in logs:
                    data_rows.append({
                        'deviceNumber': log.deviceNumber,
                        'timestamp': log.createdAt,
                        'power': float(log.power),
                        'kWh': float(log.power),  # 為了相容性，同時設定 power 和 kWh
                        'voltage': float(log.voltage) if log.voltage else 220.0,
                        'current': float(log.currents) if log.currents else 0.0,
                        'currents': float(log.currents) if log.currents else 0.0,
                        'battery': float(log.battery) if log.battery else 85.0,
                        'switchState': int(log.switchState) if log.switchState else 1,
                        'networkState': int(log.networkState) if log.networkState else 1
                    })

                df = pd.DataFrame(data_rows)
                df['timestamp'] = pd.to_datetime(df['timestamp'])
                df = df.sort_values(['deviceNumber', 'timestamp'])

                # 移除重複記錄
                df = df.drop_duplicates(subset=['deviceNumber', 'timestamp'], keep='last')

                logger.info(f"[DATA_LOADER] 載入完成，共 {len(df)} 筆數據")
                logger.info(f"[DATA_LOADER] 設備數量: {df['deviceNumber'].nunique()}")
                logger.info(f"[DATA_LOADER] 時間範圍: {df['timestamp'].min()} 到 {df['timestamp'].max()}")
                logger.info(f"[DATA_LOADER] 欄位: {list(df.columns)}")

                return df

        except Exception as e:
            logger.error(f"[DATA_LOADER] load_meter_data_by_time_range 失敗: {e}")
            raise

# 創建服務實例
data_loader = DataLoaderService()
