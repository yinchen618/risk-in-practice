"""
Ammeter Service - 電表數據服務
專門處理電表相關的數據獲取和管理
"""
import csv
import os
import logging
from typing import List, Dict, Optional
from pydantic import BaseModel
from sqlalchemy.future import select
from sqlalchemy import func, and_
import sys
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from core.database import db_manager

# 設置日誌
logger = logging.getLogger(__name__)


# ========== 資料模型 ==========
class AmmeterDevice(BaseModel):
    electricMeterNumber: str
    electricMeterName: str
    deviceNumber: str


class AmmeterData(BaseModel):
    factory: str
    device: str
    voltage: float
    currents: float
    power: float
    battery: float
    switchState: int
    networkState: int
    deviceInfo: Dict[str, str]


class AmmeterStatistics(BaseModel):
    totalDevices: int
    onlineDevices: int
    activeDevices: int
    totalPower: float
    averageVoltage: float


# ========== 單例服務類 ==========
class AmmeterService:
    _instance = None
    _ammeter_devices: List[AmmeterDevice] = []
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(AmmeterService, cls).__new__(cls)
            cls._instance._load_ammeter_devices()
        return cls._instance
    
    def _load_ammeter_devices(self):
        """從 CSV 檔案載入電表設備清單"""
        self._ammeter_devices = []
        csv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "meter.csv")
        
        try:
            with open(csv_path, 'r', encoding='utf-8') as file:
                reader = csv.DictReader(file)
                for row in reader:
                    self._ammeter_devices.append(AmmeterDevice(
                        electricMeterNumber=row["电表号"],
                        electricMeterName=row["电表名称"],
                        deviceNumber=row["设备编号"]
                    ))
        except Exception as e:
            print(f"載入電表設備清單失敗: {e}")
    
    @property
    def ammeter_devices(self) -> List[AmmeterDevice]:
        """獲取電表設備清單"""
        return self._ammeter_devices
    
    def get_device_info(self, device_number: str) -> Optional[AmmeterDevice]:
        """根據設備編號獲取設備資訊"""
        for device in self._ammeter_devices:
            if device.deviceNumber == device_number:
                return device
        return None
    
    def get_device_by_electric_meter_number(self, electric_meter_number: str) -> Optional[AmmeterDevice]:
        """根據電表號獲取設備資訊"""
        for device in self._ammeter_devices:
            if device.electricMeterNumber == electric_meter_number:
                return device
        return None
    
    def get_device_by_electric_meter_name(self, electric_meter_name: str) -> Optional[AmmeterDevice]:
        """根據電表名稱獲取設備資訊"""
        for device in self._ammeter_devices:
            if device.electricMeterName == electric_meter_name:
                return device
        return None
    
    def get_devices_by_building(self, building_name: str) -> List[AmmeterDevice]:
        """根據建築物名稱獲取所有設備資訊"""
        devices = []
        for device in self._ammeter_devices:
            if building_name in device.electricMeterName:
                devices.append(device)
        return devices
    
    async def get_all_ammeters_detail(self) -> List[AmmeterData]:
        """獲取所有電表詳情"""
        try:
            # 使用 testbed_service 獲取所有電表數據
            all_ammeters = await db_manager.get_all_ammeters()
            
            # 格式化為前端期望的格式
            formatted_results = []
            for ammeter in all_ammeters:
                # 獲取設備資訊
                device_info = self.get_device_by_electric_meter_number(ammeter.electricMeterNumber)
                
                result = AmmeterData(
                    factory=ammeter.factory or "",
                    device=ammeter.deviceNumber,
                    voltage=ammeter.voltage or 0,
                    currents=ammeter.currents or 0,
                    power=ammeter.power or 0,
                    battery=ammeter.battery or 0,
                    switchState=ammeter.switchState or 0,
                    networkState=ammeter.networkState or 0,
                    deviceInfo={
                        "electricMeterNumber": device_info.electricMeterNumber if device_info else ammeter.electricMeterNumber,
                        "electricMeterName": device_info.electricMeterName if device_info else f"電表 {ammeter.electricMeterNumber}",
                        "deviceNumber": ammeter.deviceNumber
                    } if device_info else {
                        "electricMeterNumber": ammeter.electricMeterNumber,
                        "electricMeterName": f"電表 {ammeter.electricMeterNumber}",
                        "deviceNumber": ammeter.deviceNumber
                    }
                )
                formatted_results.append(result)
            
            return formatted_results
        except Exception as e:
            raise Exception(f"獲取電表詳情失敗: {str(e)}")
    
    async def get_ammeters_statistics(self) -> AmmeterStatistics:
        """獲取電表統計資料"""
        try:
            all_ammeters = await self.get_all_ammeters_detail()
            
            total_devices = len(all_ammeters)
            online_devices = len([a for a in all_ammeters if a.networkState == 1])
            active_devices = len([a for a in all_ammeters if a.switchState == 1])
            total_power = sum(a.power for a in all_ammeters)
            average_voltage = sum(a.voltage for a in all_ammeters) / total_devices if total_devices > 0 else 0
            
            return AmmeterStatistics(
                totalDevices=total_devices,
                onlineDevices=online_devices,
                activeDevices=active_devices,
                totalPower=round(total_power, 1),
                averageVoltage=round(average_voltage, 1)
            )
        except Exception as e:
            raise Exception(f"獲取統計資料失敗: {str(e)}")

    async def get_meter_data_count_by_time_range(self, 
                                               start_date: str, 
                                               end_date: str, 
                                               start_time: str, 
                                               end_time: str,
                                               selected_floors_by_building: Optional[Dict[str, List[str]]] = None) -> Dict:
        """獲取指定時間範圍內的電表資料筆數（支援建築和樓層過濾）"""
        try:
            from datetime import datetime, timedelta
            from sqlalchemy import func, and_, or_
            from core.database import AmmeterLog
            from services.data_loader import DataLoaderService
            
            # 解析日期和時間
            start_datetime = datetime.strptime(f"{start_date} {start_time}", "%Y-%m-%d %H:%M")
            end_datetime = datetime.strptime(f"{end_date} {end_time}", "%Y-%m-%d %H:%M")
            
            # 如果結束時間是 00:00，則設為該日期的 23:59:59
            if end_time == "00:00":
                end_datetime = end_datetime.replace(hour=23, minute=59, second=59)
            
            # 初始化設備過濾條件
            device_filter_condition = None
            allowed_devices = []
            
            # 如果有樓層/建築過濾條件，獲取符合條件的設備列表
            if selected_floors_by_building:
                data_loader = DataLoaderService()
                device_room_mapping = data_loader.get_device_room_mapping()
                
                # 優先使用 selected_floors_by_building 進行精確過濾
                logger.info(f"使用按建築分組的樓層過濾: {selected_floors_by_building}")
                
                for device_id, room_info in device_room_mapping.items():
                    device_building = room_info["building"]
                    device_floor = room_info["floor"]
                    
                    # 檢查該設備的建築物是否在選擇列表中
                    if device_building in selected_floors_by_building:
                        selected_floors_for_building = selected_floors_by_building[device_building]
                        # 檢查該設備的樓層是否在該建築物的選擇樓層中
                        if device_floor in selected_floors_for_building:
                            allowed_devices.append(device_id)
                            logger.debug(f"匹配設備: {device_id} - {room_info['building']} {room_info['floor']}F {room_info['room']}")
                       
                       
                logger.info(f"過濾後匹配的設備數量: {len(allowed_devices)}")
                
                # 建立設備過濾條件
                if allowed_devices:
                    device_filter_condition = AmmeterLog.deviceNumber.in_(allowed_devices)
                else:
                    # 如果沒有符合條件的設備，返回空結果
                    logger.info("沒有設備符合過濾條件，返回空結果")
                    return {
                        "time_range": {
                            "start": start_datetime.isoformat(),
                            "end": end_datetime.isoformat(),
                            "span_days": (end_datetime - start_datetime).days + 1
                        },
                        "search_conditions": {
                            "time_filter": {
                                "start_date": start_date,
                                "end_date": end_date,
                                "start_time": start_time,
                                "end_time": end_time
                            },
                            "building_floor_filter": {
                                "selected_floors_by_building": selected_floors_by_building
                            },
                            "filter_applied": True,
                            "matched_devices": 0
                        },
                        "filter_info": {
                            "selected_floors_by_building": selected_floors_by_building,
                            "matched_devices": 0
                        },
                        "total_records": 0,
                        "unique_devices": 0,
                        "avg_records_per_device": 0,
                        "records_per_day": 0,
                        "device_distribution": []
                    }
            
            async with db_manager.get_async_session() as session:
                # 建立基本查詢條件
                base_conditions = [
                    AmmeterLog.createdAt >= start_datetime,
                    AmmeterLog.createdAt <= end_datetime,
                    AmmeterLog.action == "ammeterDetail",
                    AmmeterLog.success == True
                ]
                
                # 如果有設備過濾條件，加入查詢
                if device_filter_condition is not None:
                    base_conditions.append(device_filter_condition)
                
                combined_condition = and_(*base_conditions)
                
                # 查詢時間範圍內的總記錄數
                total_query = await session.execute(
                    select(func.count(AmmeterLog.id)).where(combined_condition)
                )
                total_records = total_query.scalar() or 0
                
                # 查詢涉及的唯一設備數
                unique_devices_query = await session.execute(
                    select(func.count(func.distinct(AmmeterLog.deviceNumber))).where(combined_condition)
                )
                unique_devices = unique_devices_query.scalar() or 0
                
                # 查詢每個設備的記錄數分布
                device_distribution_query = await session.execute(
                    select(
                        AmmeterLog.deviceNumber,
                        func.count(AmmeterLog.id).label('record_count')
                    ).where(combined_condition).group_by(AmmeterLog.deviceNumber).order_by(func.count(AmmeterLog.id).desc())
                )
                device_distribution = device_distribution_query.fetchall()
                
                # 計算平均每個設備的記錄數
                avg_records_per_device = total_records / unique_devices if unique_devices > 0 else 0
                
                # 計算時間跨度（天數）
                time_span_days = (end_datetime - start_datetime).days + 1
                
                # 添加設備和房間資訊到分布統計中
                device_distribution_with_info = []
                if device_distribution:
                    data_loader = DataLoaderService()
                    device_room_mapping = data_loader.get_device_room_mapping()
                    
                    for row in device_distribution[:10]:  # 只返回前10個設備
                        room_info = device_room_mapping.get(row.deviceNumber, {
                            "building": "未知", "room": "未知", "floor": "未知"
                        })
                        device_distribution_with_info.append({
                            "device_number": row.deviceNumber,
                            "record_count": row.record_count,
                            "building": room_info["building"],
                            "floor": room_info["floor"],
                            "room": room_info["room"],
                            "location": f"{room_info['building']} {room_info['floor']}F {room_info['room']}"
                        })
                
                return {
                    "time_range": {
                        "start": start_datetime.isoformat(),
                        "end": end_datetime.isoformat(),
                        "span_days": time_span_days
                    },
                    "search_conditions": {
                        "time_filter": {
                            "start_date": start_date,
                            "end_date": end_date,
                            "start_time": start_time,
                            "end_time": end_time
                        },
                        "building_floor_filter": {
                            "selected_floors_by_building": selected_floors_by_building
                        },
                        "filter_applied": bool(selected_floors_by_building),
                        "matched_devices": len(allowed_devices) if 'allowed_devices' in locals() else None
                    },
                    "filter_info": {
                        "selected_floors_by_building": selected_floors_by_building,
                        "matched_devices": len(allowed_devices) if 'allowed_devices' in locals() else None
                    },
                    "total_records": total_records,
                    "unique_devices": unique_devices,
                    "avg_records_per_device": round(avg_records_per_device, 1),
                    "records_per_day": round(total_records / time_span_days, 1) if time_span_days > 0 else 0,
                    "device_distribution": device_distribution_with_info
                }
        except Exception as e:
            raise Exception(f"獲取時間範圍資料筆數失敗: {str(e)}")


# ========== 創建單例實例 ==========
ammeter_service = AmmeterService() 
