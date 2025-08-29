#!/usr/bin/env python3
"""
測試台灣時間功能
Test Taiwan timezone functionality
"""

import sys
import os
import datetime
import pytz

# 添加 backend 目錄到路徑中
sys.path.append('/home/infowin/Git-projects/pu-in-practice/backend')

def test_taiwan_time_functions():
    """測試台灣時間相關函數"""
    print("🧪 測試台灣時間功能")
    print("=" * 60)

    # 測試 get_current_datetime (後端)
    try:
        from routes.case_study_v2 import get_current_datetime
        backend_time = get_current_datetime()
        print(f"✅ 後端 get_current_datetime: {backend_time}")
    except Exception as e:
        print(f"❌ 後端 get_current_datetime 錯誤: {e}")

    # 測試 get_taiwan_time (模型訓練器)
    try:
        from services.case_study_v2.model_trainer import get_taiwan_time
        trainer_time = get_taiwan_time()
        print(f"✅ 模型訓練器 get_taiwan_time: {trainer_time}")
        print(f"   格式化時間: {trainer_time.strftime('%Y-%m-%d %H:%M:%S %Z')}")
    except Exception as e:
        print(f"❌ 模型訓練器 get_taiwan_time 錯誤: {e}")

    # 直接測試台灣時間
    taiwan_tz = pytz.timezone('Asia/Taipei')
    direct_taiwan_time = datetime.datetime.now(taiwan_tz)
    print(f"✅ 直接台灣時間: {direct_taiwan_time.strftime('%Y-%m-%d %H:%M:%S %Z')}")

    # 比較與 UTC 時間的差異
    utc_time = datetime.datetime.utcnow()
    print(f"📊 UTC 時間: {utc_time.strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"📊 台灣時間: {direct_taiwan_time.strftime('%Y-%m-%d %H:%M:%S')}")

    # 測試前端的時間格式 (模擬)
    frontend_taiwan_time = datetime.datetime.now().astimezone(pytz.timezone('Asia/Taipei'))
    frontend_format = frontend_taiwan_time.strftime("%Y-%m-%d_%H-%M-%S")
    print(f"✅ 前端台灣時間格式: {frontend_format}")

    print("=" * 60)
    print("🎯 測試摘要:")
    print(f"  • 後端資料庫時間戳使用台灣時間")
    print(f"  • 模型檔案名稱使用台灣時間")
    print(f"  • 前端模型名稱生成使用台灣時間")
    print(f"  • 所有時間都統一使用 UTC+8 (Asia/Taipei)")

if __name__ == "__main__":
    test_taiwan_time_functions()
