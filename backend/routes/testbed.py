from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict, Optional, Any
from pydantic import BaseModel
from datetime import datetime, timezone
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from services.testbed_service import testbed_service
from services.ammeter_service import ammeter_service

router = APIRouter(prefix="/api/testbed", tags=["Smart Meter Research Testbed"])

# ========== Response Models ==========
class TestbedOverviewResponse(BaseModel):
    success: bool
    data: Dict[str, Any]
    message: Optional[str] = None

class ResidentialUnitsResponse(BaseModel):
    success: bool
    data: List[Dict[str, Any]]
    message: Optional[str] = None

class SmartMeterDataResponse(BaseModel):
    success: bool
    data: Dict[str, Any]
    message: Optional[str] = None

# ========== API Endpoints ==========
@router.get("/overview", response_model=TestbedOverviewResponse)
async def get_testbed_overview():
    """Retrieve comprehensive testbed overview and system status metrics"""
    try:
        overview = await testbed_service.get_testbed_overview()
        return TestbedOverviewResponse(
            success=True,
            data=overview.dict(),
            message="Successfully retrieved smart meter testbed overview"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve testbed overview: {str(e)}")

@router.get("/units", response_model=ResidentialUnitsResponse)
async def get_residential_units(building: Optional[str] = Query(None, description="Building filter (15 or 85)")):
    """Retrieve list of residential units with smart meter installations"""
    try:
        units = await testbed_service.get_testbed_units(building)

        return ResidentialUnitsResponse(
            success=True,
            data=units,
            message=f"Successfully retrieved {'Building ' + building if building else 'all'} residential unit data"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve residential units: {str(e)}")

@router.get("/meter-data", response_model=SmartMeterDataResponse)
async def get_smart_meter_data(
    unit_id: str = Query(..., description="Residential unit identifier"),
    meter_type: str = Query(..., description="Meter configuration (main, appliance, or both)"),
    start_date: str = Query(..., description="Analysis start date (YYYY-MM-DD)"),
    end_date: str = Query(..., description="Analysis end date (YYYY-MM-DD)")
):
    """Retrieve smart meter data for research analysis (deprecated, use ammeter-history)"""
    try:
        # 嘗試將 unit_id 作為電表號碼直接使用
        # 如果失敗，則嘗試將其作為電表名稱查找
        try:
            # 首先嘗試直接使用 unit_id 作為電表號碼
            device_info = ammeter_service.get_device_by_electric_meter_number(unit_id)
            if device_info:
                electric_meter_number = unit_id
            else:
                # 如果找不到，嘗試將其作為電表名稱查找
                device_info = ammeter_service.get_device_by_electric_meter_name(unit_id)
                if device_info:
                    electric_meter_number = device_info.electricMeterNumber
                else:
                    raise Exception(f"找不到電表號碼或電表名稱 '{unit_id}' 對應的設備資訊")
        except Exception as e:
            raise HTTPException(status_code=404, detail=str(e))

        # 如果是 appliance 類型，需要加上 'a' 後綴
        if meter_type == "appliance":
            # 查找對應的 appliance 電表
            appliance_name = f"{unit_id}a"
            appliance_device = ammeter_service.get_device_by_electric_meter_name(appliance_name)
            if appliance_device:
                electric_meter_number = appliance_device.electricMeterNumber
            else:
                raise HTTPException(
                    status_code=404,
                    detail=f"找不到 appliance 電表 '{appliance_name}' 對應的設備資訊"
                )

        # Utilize unified service for data retrieval
        meter_data = await testbed_service.get_ammeter_history_data_by_datetime_range(
            electric_meter_number, start_date, end_date, "00:00", "23:59"
        )

        # Maintain backward compatibility in response format
        response_data = {
            "unitId": unit_id,
            "meterType": meter_type,
            "analysisTimeframe": {
                "startDate": start_date,
                "endDate": end_date
            },
            **meter_data.dict()
        }

        return SmartMeterDataResponse(
            success=True,
            data=response_data,
            message="Successfully retrieved smart meter data for analysis"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve smart meter data: {str(e)}")

@router.get("/ammeter-history", response_model=SmartMeterDataResponse)
async def get_ammeter_historical_data(
    building: Optional[str] = Query(None, description="Building identifier (a for 15學舍, b for 85學舍)"),
    meter_number: Optional[str] = Query(None, description="Meter number (e.g., 102)"),
    electric_meter_number: Optional[str] = Query(None, description="Full electric meter number"),
    start_date: Optional[str] = Query(None, description="Analysis start date (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="Analysis end date (YYYY-MM-DD)"),
    start_datetime: Optional[str] = Query(None, description="Optional start datetime (ISO 8601, UTC preferred)"),
    end_datetime: Optional[str] = Query(None, description="Optional end datetime (ISO 8601, UTC preferred)")
):
    """
    Retrieve historical smart meter data for energy consumption analysis.

    Supports two filtering modes:
    1) Date-only mode (default): use `start_date` and `end_date` (YYYY-MM-DD) to fetch whole-day data.
    2) Datetime mode (optional): if both `start_datetime` and `end_datetime` (ISO 8601) are provided,
       the service will use them for precise time-range filtering (UTC recommended).
    """
    try:
        # 驗證時間參數 - 必須提供兩種模式之一
        if start_datetime and end_datetime:
            # Datetime 模式
            datetime_mode = True
        elif start_date and end_date:
            # Date 模式
            datetime_mode = False
        else:
            raise HTTPException(
                status_code=422,
                detail="Must provide either both 'start_datetime' and 'end_datetime' OR both 'start_date' and 'end_date'"
            )

        # 處理不同的參數格式
        if electric_meter_number:
            # 直接使用完整的電表號碼
            target_meter_number = electric_meter_number
        elif building and meter_number:
            # 根據 building 和 meter_number 構建電表名稱
            building_prefix = "Building A" if building == "a" else "Building B"
            meter_name = f"{building_prefix}{meter_number}"

            # 根據電表名稱查找對應的電表號碼
            device_info = ammeter_service.get_device_by_electric_meter_name(meter_name)
            if not device_info:
                raise HTTPException(
                    status_code=404,
                    detail=f"找不到電表名稱 '{meter_name}' 對應的設備資訊"
                )
            target_meter_number = device_info.electricMeterNumber
        else:
            raise HTTPException(
                status_code=422,
                detail="Either 'electric_meter_number' or both 'building' and 'meter_number' must be provided"
            )

        # 記錄除錯資訊
        print(f"[DEBUG] API Request:")
        print(f"  Building: {building}")
        print(f"  Meter Number: {meter_number}")
        print(f"  Electric Meter Number: {electric_meter_number}")
        print(f"  Target Meter Number: {target_meter_number}")
        print(f"  Start Date: {start_date}")
        print(f"  End Date: {end_date}")
        print(f"  Start Datetime: {start_datetime}")
        print(f"  End Datetime: {end_datetime}")
        print(f"  Datetime Mode: {datetime_mode}")

        # 如果有 datetime 參數，需要轉換為日期和時間格式
        if datetime_mode:
            # 解析 datetime（支援台灣時區 +08:00）
            from datetime import datetime
            # 將時區信息保留，正確解析帶時區的時間
            start_dt = datetime.fromisoformat(start_datetime)
            end_dt = datetime.fromisoformat(end_datetime)

            print(f"[DEBUG] 接收到的 datetime 參數:")
            print(f"  start_datetime: {start_datetime}")
            print(f"  end_datetime: {end_datetime}")
            print(f"  解析後的時間:")
            print(f"    start_dt: {start_dt} (tzinfo: {start_dt.tzinfo})")
            print(f"    end_dt: {end_dt} (tzinfo: {end_dt.tzinfo})")

            # 如果有時區信息，轉換為 UTC；如果沒有，假設是 UTC
            if start_dt.tzinfo is not None:
                # 轉換為 UTC 時間
                start_dt_utc = start_dt.astimezone(timezone.utc).replace(tzinfo=None)
                end_dt_utc = end_dt.astimezone(timezone.utc).replace(tzinfo=None)

                start_date_part = start_dt_utc.strftime('%Y-%m-%d')
                start_time_part = start_dt_utc.strftime('%H:%M')
                end_date_part = end_dt_utc.strftime('%Y-%m-%d')
                end_time_part = end_dt_utc.strftime('%H:%M')
            else:
                # 沒有時區信息，假設是 UTC
                start_date_part = start_dt.strftime('%Y-%m-%d')
                start_time_part = start_dt.strftime('%H:%M')
                end_date_part = end_dt.strftime('%Y-%m-%d')
                end_time_part = end_dt.strftime('%H:%M')

            print(f"[DEBUG] 轉換為 UTC 後的日期時間:")
            print(f"  start_date_part: {start_date_part}")
            print(f"  start_time_part: {start_time_part}")
            print(f"  end_date_part: {end_date_part}")
            print(f"  end_time_part: {end_time_part}")

            meter_data = await testbed_service.get_ammeter_history_data_by_datetime_range(
                target_meter_number,
                start_date=start_date_part,
                end_date=end_date_part,
                start_time=start_time_part,
                end_time=end_time_part,
            )
        else:
            # 使用日期模式，設定全天時間範圍
            meter_data = await testbed_service.get_ammeter_history_data_by_datetime_range(
                target_meter_number,
                start_date=start_date,
                end_date=end_date,
                start_time="00:00",
                end_time="23:59",
            )

        # Build informative message about effective filters
        if start_datetime and end_datetime:
            filter_msg = (
                f"Filtered by datetime range: {start_datetime} ~ {end_datetime}"
            )
        else:
            filter_msg = (
                f"Filtered by date range: {start_date} ~ {end_date}"
            )

        return SmartMeterDataResponse(
            success=True,
            data=meter_data.dict(),
            message=(
                f"Successfully retrieved historical data for smart meter {target_meter_number}. "
                + filter_msg
            )
        )
    except Exception as e:
        print(f"[ERROR] API Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve smart meter historical data: {str(e)}")


@router.get("/ammeter-history-range", response_model=SmartMeterDataResponse)
async def get_ammeter_history_by_datetime_range(
    electric_meter_number: str = Query(..., description="Full electric meter number"),
    start_date: str = Query(..., description="Start date (YYYY-MM-DD)"),
    end_date: str = Query(..., description="End date (YYYY-MM-DD)"),
    start_time: str = Query(..., description="Start time (HH:MM)"),
    end_time: str = Query(..., description="End time (HH:MM)")
):
    """
    Unified endpoint for retrieving smart meter historical data with separate date and time parameters.
    This is the recommended function for all meter data retrieval operations.
    """
    try:
        print(f"[DEBUG] API Request - Range Mode:")
        print(f"  Electric Meter Number: {electric_meter_number}")
        print(f"  Start Date: {start_date}")
        print(f"  End Date: {end_date}")
        print(f"  Start Time: {start_time}")
        print(f"  End Time: {end_time}")

        meter_data = await testbed_service.get_ammeter_history_data_by_datetime_range(
            electric_meter_number=electric_meter_number,
            start_date=start_date,
            end_date=end_date,
            start_time=start_time,
            end_time=end_time,
        )

        return SmartMeterDataResponse(
            success=True,
            data=meter_data.dict(),
            message=(
                f"Successfully retrieved historical data for smart meter {electric_meter_number}. "
                f"Range: {start_date} {start_time} ~ {end_date} {end_time}"
            )
        )
    except Exception as e:
        print(f"[ERROR] API Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve smart meter historical data: {str(e)}")

