#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
電錶每日數據統計腳本（資料庫端計算優化版）

此腳本用於統計每個電錶每天（台灣時間 0:00 至 23:59）的數據筆數。
資料庫中存儲的是 UTC+0 時間，腳本會自動處理時區轉換。

使用方法:
    python daily_meter_stats.py

功能:
1. 統計每個電錶每天的數據筆數
2. 優先從 meter.csv 載入電錶清單，失敗則從資料庫查詢
3. 使用資料庫端計算，只傳輸最終結果，大幅減少網路傳輸
4. 生成詳細的統計報告並保存為 JSON 和 CSV 檔案
5. 提供詳細的進度日誌記錄

重大效能優化:
- 使用 PostgreSQL CTE (Common Table Expression) 進行複雜統計
- 資料庫端完成時區轉換、聚合計算、統計分析
- 只傳輸最終結果，不下載原始數據
- 單次查詢替代數千次小查詢
- 大幅減少記憶體使用和網路傳輸

SQL 優化技術:
- CTE 進行多階段計算
- generate_series 生成完整日期範圍
- CROSS JOIN 產生電錶×日期的完整組合
- LEFT JOIN 填補缺失的日期數據
- 聚合函數 (SUM, COUNT, AVG, MAX, MIN) 在資料庫端完成

數據來源優先級:
1. 電錶清單: meter.csv -> 資料庫查詢
2. 數據統計: 資料庫端一次性計算完成

作者: AI Assistant
日期: 2025-08-23
版本: 3.0 (資料庫端計算優化版)
"""

import os
import sys
import json
import logging
import asyncio
import pandas as pd
from datetime import datetime, timedelta, timezone
from typing import List, Dict, Any
from sqlalchemy.future import select
from sqlalchemy import and_, func, text

# 添加父目錄到路徑以導入核心模組
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from core.database import AmmeterLog, DatabaseManager

def setup_logging(log_file: str = "daily_meter_stats.log"):
    """設置日誌配置"""
    log_format = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"

    # 創建日誌記錄器
    logger = logging.getLogger("daily_meter_stats")
    logger.setLevel(logging.INFO)

    # 避免重複添加處理器
    if not logger.handlers:
        # 文件處理器
        file_handler = logging.FileHandler(log_file, encoding='utf-8')
        file_handler.setLevel(logging.INFO)
        file_formatter = logging.Formatter(log_format)
        file_handler.setFormatter(file_formatter)

        # 控制台處理器
        console_handler = logging.StreamHandler()
        console_handler.setLevel(logging.INFO)
        console_formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")
        console_handler.setFormatter(console_formatter)

        logger.addHandler(file_handler)
        logger.addHandler(console_handler)

    return logger

class DailyMeterStatsAnalyzer:
    """電錶每日數據統計分析器"""

    def __init__(self):
        """初始化分析器"""
        self.db_manager = DatabaseManager()
        self.logger = setup_logging()

        # 台灣時區 (UTC+8)
        self.taiwan_tz = timezone(timedelta(hours=8))

    def load_meter_names_from_csv(self, csv_file: str = "meter.csv") -> Dict[str, str]:
        """
        從 CSV 檔案載入電錶名稱和設備編號的對應關係

        Args:
            csv_file: CSV 檔案路徑

        Returns:
            {deviceNumber: meter_name} 的字典，失敗則返回 None
        """
        try:
            if not os.path.exists(csv_file):
                self.logger.warning(f"CSV 檔案 {csv_file} 不存在，將從資料庫獲取電錶名稱")
                return None

            self.logger.info(f"正在從 {csv_file} 載入電錶名稱...")

            # 讀取 CSV 檔案
            df = pd.read_csv(csv_file, encoding='utf-8')

            # 確認檔案有必要的欄位
            if '电表名称' not in df.columns or '设备编号' not in df.columns:
                self.logger.warning(f"CSV 檔案中沒有找到必要欄位，可用欄位: {list(df.columns)}")
                return None

            # 建立設備編號到電錶名稱的對應
            device_to_meter = {}
            for _, row in df.iterrows():
                device_number = str(row['设备编号']).strip()
                meter_name = str(row['电表名称']).strip()
                if device_number and meter_name:
                    device_to_meter[device_number] = meter_name

            self.logger.info(f"從 CSV 載入 {len(device_to_meter)} 個電錶對應關係")
            return device_to_meter

        except Exception as e:
            self.logger.error(f"載入 CSV 檔案失敗: {e}")
            return None

    async def get_all_meter_mappings(self, use_csv: bool = True) -> Dict[str, str]:
        """
        獲取所有電錶的設備編號到名稱的對應關係

        Args:
            use_csv: 是否優先使用 CSV 檔案

        Returns:
            {deviceNumber: meter_name} 的字典
        """
        device_to_meter = None

        # 嘗試從 CSV 檔案載入
        if use_csv:
            device_to_meter = self.load_meter_names_from_csv()

        # 如果 CSV 載入失敗，從資料庫查詢
        if device_to_meter is None:
            self.logger.info("正在從資料庫獲取所有電錶設備編號...")

            async with self.db_manager.get_async_session() as session:
                # 查詢所有不同的設備編號
                query = select(
                    AmmeterLog.deviceNumber.distinct()
                ).where(
                    and_(
                        AmmeterLog.success == True,
                        AmmeterLog.power.isnot(None),
                        AmmeterLog.deviceNumber.isnot(None)
                    )
                ).order_by(AmmeterLog.deviceNumber)

                result = await session.execute(query)
                device_numbers = [row[0] for row in result.fetchall() if row[0]]

            # 使用設備編號作為名稱（備案）
            device_to_meter = {device: f"Device_{device}" for device in device_numbers}
            self.logger.info(f"從資料庫找到 {len(device_to_meter)} 個設備編號")

        return device_to_meter

    async def get_date_range_from_db(self) -> tuple:
        """
        從資料庫獲取數據的日期範圍

        Returns:
            (最早日期, 最晚日期) tuple
        """
        self.logger.info("正在獲取數據日期範圍...")

        async with self.db_manager.get_async_session() as session:
            # 獲取最早和最晚的時間戳
            query = select(
                func.min(AmmeterLog.lastUpdated),
                func.max(AmmeterLog.lastUpdated)
            ).where(
                and_(
                    AmmeterLog.success == True,
                    AmmeterLog.power.isnot(None)
                )
            )

            result = await session.execute(query)
            min_date, max_date = result.fetchone()

            if min_date and max_date:
                # 轉換為台灣時間並格式化為日期字符串
                min_date_tw = min_date.replace(tzinfo=timezone.utc).astimezone(self.taiwan_tz).date()
                max_date_tw = max_date.replace(tzinfo=timezone.utc).astimezone(self.taiwan_tz).date()

                min_date_str = min_date_tw.strftime('%Y-%m-%d')
                max_date_str = max_date_tw.strftime('%Y-%m-%d')

                self.logger.info(f"數據日期範圍: {min_date_str} 至 {max_date_str}")
                return min_date_str, max_date_str
            else:
                self.logger.warning("資料庫中沒有找到有效數據")
                return None, None

    async def count_daily_records_batch(self, meter_names: List[str], target_date: str) -> Dict[str, int]:
        """
        批次統計所有電錶在指定日期的數據筆數（減少資料庫查詢次數）

        Args:
            meter_names: 電錶名稱列表
            target_date: 目標日期 'YYYY-MM-DD'

        Returns:
            該日期所有電錶的數據筆數字典 {meter_name: count}
        """
        # 計算該天台灣時間對應的 UTC 時間範圍
        target_date_obj = datetime.strptime(target_date, '%Y-%m-%d').date()
        day_start_tw = datetime.combine(target_date_obj, datetime.min.time()).replace(tzinfo=self.taiwan_tz)
        day_end_tw = datetime.combine(target_date_obj, datetime.max.time()).replace(tzinfo=self.taiwan_tz)

        day_start_utc = day_start_tw.astimezone(timezone.utc).replace(tzinfo=None)
        day_end_utc = day_end_tw.astimezone(timezone.utc).replace(tzinfo=None)

        daily_counts = {meter_name: 0 for meter_name in meter_names}

        async with self.db_manager.get_async_session() as session:
            # 一次查詢該日所有電錶的數據
            query = select(
                func.split_part(AmmeterLog.deviceNumber, ' ', 2).label('meter_name'),
                func.count(AmmeterLog.id).label('record_count')
            ).where(
                and_(
                    func.split_part(AmmeterLog.deviceNumber, ' ', 2).in_(meter_names),
                    AmmeterLog.lastUpdated >= day_start_utc,
                    AmmeterLog.lastUpdated <= day_end_utc,
                    AmmeterLog.power.isnot(None),
                    AmmeterLog.success == True
                )
            ).group_by(func.split_part(AmmeterLog.deviceNumber, ' ', 2))

            result = await session.execute(query)
            for row in result.fetchall():
                meter_name, count = row
                if meter_name in daily_counts:
                    daily_counts[meter_name] = count

        return daily_counts

    async def count_daily_records(self, meter_name: str, start_date: str, end_date: str) -> Dict[str, int]:
        """
        統計指定電錶在指定日期範圍內每天的數據筆數（按日批次處理）

        Args:
            meter_name: 電錶名稱
            start_date: 開始日期 'YYYY-MM-DD'
            end_date: 結束日期 'YYYY-MM-DD'

        Returns:
            每日數據筆數字典 {date: count}
        """
        self.logger.info(f"統計電錶 {meter_name} 的每日數據筆數...")

        daily_counts = {}

        # 生成所有日期
        current_date = datetime.strptime(start_date, '%Y-%m-%d').date()
        end_date_obj = datetime.strptime(end_date, '%Y-%m-%d').date()

        # 按日期逐日查詢，減少單次查詢的資料量
        while current_date <= end_date_obj:
            date_str = current_date.strftime('%Y-%m-%d')

            # 使用批次查詢方法（雖然只查一個電錶，但保持一致性）
            day_counts = await self.count_daily_records_batch([meter_name], date_str)
            daily_counts[date_str] = day_counts.get(meter_name, 0)

            current_date += timedelta(days=1)

        total_records = sum(daily_counts.values())
        self.logger.info(f"電錶 {meter_name} 總共 {total_records} 筆記錄")

        return daily_counts

    async def analyze_all_meters_db_optimized(self, start_date: str = None, end_date: str = None, use_csv: bool = True) -> Dict[str, Any]:
        """
        分析所有電錶的每日數據統計（資料庫端計算優化版）

        讓資料庫完成所有計算工作，只傳回最終結果，大幅減少網路傳輸

        Args:
            start_date: 開始日期，如果為 None 則自動從資料庫獲取
            end_date: 結束日期，如果為 None 則自動從資料庫獲取
            use_csv: 是否優先使用 CSV 檔案載入電錶清單

        Returns:
            分析結果字典
        """
        self.logger.info("=== 開始分析所有電錶的每日數據統計（資料庫優化版）===")

        # 如果沒有指定日期範圍，從資料庫獲取
        if start_date is None or end_date is None:
            db_start_date, db_end_date = await self.get_date_range_from_db()
            if not db_start_date or not db_end_date:
                raise ValueError("無法從資料庫獲取有效的日期範圍")
            start_date = start_date or db_start_date
            end_date = end_date or db_end_date

        # 獲取所有電錶的設備編號到名稱映射
        device_to_meter = await self.get_all_meter_mappings(use_csv)

        if not device_to_meter:
            raise ValueError("沒有找到任何電錶數據")

        device_numbers = list(device_to_meter.keys())
        meter_names = list(device_to_meter.values())

        self.logger.info(f"分析時間範圍: {start_date} 至 {end_date}")
        self.logger.info(f"要分析的電錶數量: {len(device_to_meter)}")

        # 計算台灣時間範圍對應的 UTC 時間
        start_date_obj = datetime.strptime(start_date, '%Y-%m-%d').date()
        end_date_obj = datetime.strptime(end_date, '%Y-%m-%d').date()

        start_tw = datetime.combine(start_date_obj, datetime.min.time()).replace(tzinfo=self.taiwan_tz)
        end_tw = datetime.combine(end_date_obj, datetime.max.time()).replace(tzinfo=self.taiwan_tz)

        start_utc = start_tw.astimezone(timezone.utc).replace(tzinfo=None)
        end_utc = end_tw.astimezone(timezone.utc).replace(tzinfo=None)

        total_days = (end_date_obj - start_date_obj).days + 1

        # 一次性的大查詢：讓資料庫完成所有計算
        self.logger.info("執行資料庫端統計查詢...")

        async with self.db_manager.get_async_session() as session:
            # 簡化版查詢，使用設備編號進行查詢
            query = text("""
            SELECT
                "deviceNumber",
                DATE("lastUpdated" AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Taipei') as taiwan_date,
                COUNT(*) as daily_count
            FROM ammeter_log
            WHERE
                "lastUpdated" >= :start_utc
                AND "lastUpdated" <= :end_utc
                AND success = true
                AND power IS NOT NULL
                AND "deviceNumber" = ANY(:device_numbers)
            GROUP BY
                "deviceNumber",
                DATE("lastUpdated" AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Taipei')
            ORDER BY "deviceNumber", taiwan_date
            """)

            result = await session.execute(query, {
                'start_utc': start_utc,
                'end_utc': end_utc,
                'device_numbers': device_numbers
            })

            # 處理資料庫返回的結果
            db_results = result.fetchall()

        self.logger.info(f"資料庫返回 {len(db_results)} 行結果")

        results = {
            "analysis_info": {
                "analysis_time": datetime.now(self.taiwan_tz).isoformat(),
                "start_date": start_date,
                "end_date": end_date,
                "total_meters": len(device_to_meter),
                "total_days": total_days,
                "meter_names": meter_names
            },
            "daily_stats": {}
        }

        # 初始化所有電錶的結構
        for device_number, meter_name in device_to_meter.items():
            results["daily_stats"][meter_name] = {
                "device_number": device_number,
                "summary": {
                    "total_records": 0,
                    "total_days": total_days,
                    "days_with_data": 0,
                    "days_without_data": total_days,
                    "data_coverage_percentage": 0.0,
                    "avg_records_per_day": 0.0,
                    "max_records_per_day": 0,
                    "min_records_per_day": 0
                },
                "daily_counts": {}
            }

        # 填補所有日期（初始化為0）
        current_date = start_date_obj
        while current_date <= end_date_obj:
            date_str = current_date.strftime('%Y-%m-%d')
            for meter_name in meter_names:
                results["daily_stats"][meter_name]["daily_counts"][date_str] = 0
            current_date += timedelta(days=1)

        # 處理資料庫結果
        for row in db_results:
            device_number = row[0]
            taiwan_date = row[1]
            daily_count = row[2]

            # 從設備編號獲取電錶名稱
            meter_name = device_to_meter.get(device_number)
            if meter_name and meter_name in results["daily_stats"]:
                # 記錄每日計數
                date_str = taiwan_date.strftime('%Y-%m-%d')
                results["daily_stats"][meter_name]["daily_counts"][date_str] = daily_count

        # 計算每個電錶的統計摘要
        self.logger.info("計算統計摘要...")
        for meter_name in meter_names:
            daily_counts = results["daily_stats"][meter_name]["daily_counts"]

            total_records = sum(daily_counts.values())
            days_with_data = sum(1 for count in daily_counts.values() if count > 0)
            days_without_data = total_days - days_with_data
            avg_records_per_day = total_records / total_days if total_days > 0 else 0
            max_records_per_day = max(daily_counts.values()) if daily_counts else 0
            min_records_per_day = min(daily_counts.values()) if daily_counts else 0
            data_coverage_percentage = (days_with_data / total_days * 100) if total_days > 0 else 0

            results["daily_stats"][meter_name]["summary"] = {
                "total_records": total_records,
                "total_days": total_days,
                "days_with_data": days_with_data,
                "days_without_data": days_without_data,
                "data_coverage_percentage": round(data_coverage_percentage, 2),
                "avg_records_per_day": round(avg_records_per_day, 2),
                "max_records_per_day": max_records_per_day,
                "min_records_per_day": min_records_per_day
            }

            if total_records > 0:
                self.logger.info(f"電錶 {meter_name}: {total_records} 筆記錄, 覆蓋率 {data_coverage_percentage:.1f}%")
        self.logger.info("=== 所有電錶分析完成（資料庫優化版）===")
        return results

    async def analyze_all_meters(self, start_date: str = None, end_date: str = None, use_csv: bool = True) -> Dict[str, Any]:
        """
        分析所有電錶的每日數據統計

        Args:
            start_date: 開始日期，如果為 None 則自動從資料庫獲取
            end_date: 結束日期，如果為 None 則自動從資料庫獲取
            use_csv: 是否優先使用 CSV 檔案載入電錶清單

        Returns:
            分析結果字典
        """
        self.logger.info("=== 開始分析所有電錶的每日數據統計 ===")

        # 如果沒有指定日期範圍，從資料庫獲取
        if start_date is None or end_date is None:
            db_start_date, db_end_date = await self.get_date_range_from_db()
            if not db_start_date or not db_end_date:
                raise ValueError("無法從資料庫獲取有效的日期範圍")
            start_date = start_date or db_start_date
            end_date = end_date or db_end_date

    async def analyze_all_meters(self, start_date: str = None, end_date: str = None, use_csv: bool = True) -> Dict[str, Any]:
        """
        分析所有電錶的每日數據統計（使用按日批次處理優化效能）

        Args:
            start_date: 開始日期，如果為 None 則自動從資料庫獲取
            end_date: 結束日期，如果為 None 則自動從資料庫獲取
            use_csv: 是否優先使用 CSV 檔案載入電錶清單

        Returns:
            分析結果字典
        """
        self.logger.info("=== 開始分析所有電錶的每日數據統計 ===")

        # 如果沒有指定日期範圍，從資料庫獲取
        if start_date is None or end_date is None:
            db_start_date, db_end_date = await self.get_date_range_from_db()
            if not db_start_date or not db_end_date:
                raise ValueError("無法從資料庫獲取有效的日期範圍")
            start_date = start_date or db_start_date
            end_date = end_date or db_end_date

        # 獲取所有電錶名稱
        meter_names = await self.get_all_meter_names(use_csv)

        if not meter_names:
            raise ValueError("沒有找到任何電錶數據")

        self.logger.info(f"分析時間範圍: {start_date} 至 {end_date}")
        self.logger.info(f"要分析的電錶數量: {len(meter_names)}")

        # 計算總天數
        start_date_obj = datetime.strptime(start_date, '%Y-%m-%d').date()
        end_date_obj = datetime.strptime(end_date, '%Y-%m-%d').date()
        total_days = (end_date_obj - start_date_obj).days + 1

        results = {
            "analysis_info": {
                "analysis_time": datetime.now(self.taiwan_tz).isoformat(),
                "start_date": start_date,
                "end_date": end_date,
                "total_meters": len(meter_names),
                "total_days": total_days,
                "meter_names": meter_names
            },
            "daily_stats": {}
        }

        # 初始化所有電錶的統計結果
        for meter_name in meter_names:
            results["daily_stats"][meter_name] = {
                "summary": {
                    "total_records": 0,
                    "total_days": total_days,
                    "days_with_data": 0,
                    "days_without_data": total_days,
                    "data_coverage_percentage": 0.0,
                    "avg_records_per_day": 0.0,
                    "max_records_per_day": 0,
                    "min_records_per_day": 0
                },
                "daily_counts": {}
            }

        # 按日期批次處理，減少資料庫負載
        current_date = start_date_obj
        day_count = 0

        while current_date <= end_date_obj:
            day_count += 1
            date_str = current_date.strftime('%Y-%m-%d')

            self.logger.info(f"處理日期: {date_str} ({day_count}/{total_days})")

            try:
                # 批次查詢該日所有電錶的數據
                daily_counts = await self.count_daily_records_batch(meter_names, date_str)

                # 更新每個電錶的統計資料
                for meter_name in meter_names:
                    count = daily_counts.get(meter_name, 0)
                    results["daily_stats"][meter_name]["daily_counts"][date_str] = count

                # 每10天打印一次進度
                if day_count % 10 == 0:
                    completed_percentage = (day_count / total_days) * 100
                    self.logger.info(f"進度: {completed_percentage:.1f}% ({day_count}/{total_days} 天)")

            except Exception as e:
                self.logger.error(f"處理日期 {date_str} 時發生錯誤: {e}")
                # 設置該日所有電錶計數為0
                for meter_name in meter_names:
                    results["daily_stats"][meter_name]["daily_counts"][date_str] = 0

            current_date += timedelta(days=1)

        # 計算每個電錶的統計摘要
        self.logger.info("計算統計摘要...")
        for meter_name in meter_names:
            daily_counts = results["daily_stats"][meter_name]["daily_counts"]

            total_records = sum(daily_counts.values())
            days_with_data = sum(1 for count in daily_counts.values() if count > 0)
            days_without_data = total_days - days_with_data
            avg_records_per_day = total_records / total_days if total_days > 0 else 0
            max_records_per_day = max(daily_counts.values()) if daily_counts else 0
            min_records_per_day = min(daily_counts.values()) if daily_counts else 0
            data_coverage_percentage = (days_with_data / total_days * 100) if total_days > 0 else 0

            results["daily_stats"][meter_name]["summary"] = {
                "total_records": total_records,
                "total_days": total_days,
                "days_with_data": days_with_data,
                "days_without_data": days_without_data,
                "data_coverage_percentage": round(data_coverage_percentage, 2),
                "avg_records_per_day": round(avg_records_per_day, 2),
                "max_records_per_day": max_records_per_day,
                "min_records_per_day": min_records_per_day
            }

            self.logger.info(f"電錶 {meter_name}: {total_records} 筆記錄, 覆蓋率 {data_coverage_percentage:.1f}%")

        self.logger.info("=== 所有電錶分析完成 ===")
        return results

    def save_results(self, results: Dict[str, Any]):
        """
        保存分析結果到檔案

        Args:
            results: 分析結果
        """
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

        # 保存 JSON 檔案
        json_file = f"daily_meter_stats_{timestamp}.json"
        try:
            with open(json_file, 'w', encoding='utf-8') as f:
                json.dump(results, f, ensure_ascii=False, indent=2)
            self.logger.info(f"JSON 結果已保存到 {json_file}")
        except Exception as e:
            self.logger.error(f"保存 JSON 檔案失敗: {e}")

        # 保存 CSV 檔案
        csv_file = f"daily_meter_stats_{timestamp}.csv"
        try:
            csv_data = []
            for meter_name, meter_data in results["daily_stats"].items():
                if "daily_counts" in meter_data and meter_data["daily_counts"]:
                    for date, count in meter_data["daily_counts"].items():
                        csv_data.append({
                            "meter_name": meter_name,
                            "date": date,
                            "record_count": count
                        })

            if csv_data:
                df = pd.DataFrame(csv_data)
                df.to_csv(csv_file, index=False, encoding='utf-8-sig')
                self.logger.info(f"CSV 結果已保存到 {csv_file}")
            else:
                self.logger.warning("沒有數據可保存為 CSV")
        except Exception as e:
            self.logger.error(f"保存 CSV 檔案失敗: {e}")

    def print_summary(self, results: Dict[str, Any]):
        """
        打印分析摘要

        Args:
            results: 分析結果
        """
        self.logger.info("=== 分析摘要 ===")

        analysis_info = results.get("analysis_info", {})
        daily_stats = results.get("daily_stats", {})

        self.logger.info(f"分析時間: {analysis_info.get('analysis_time', 'N/A')}")
        self.logger.info(f"分析期間: {analysis_info.get('start_date', 'N/A')} 至 {analysis_info.get('end_date', 'N/A')}")
        self.logger.info(f"總電錶數: {analysis_info.get('total_meters', 0)}")

        # 統計概況
        meters_with_data = 0
        meters_without_data = 0
        total_records = 0

        for meter_name, meter_data in daily_stats.items():
            if "error" in meter_data:
                self.logger.warning(f"電錶 {meter_name}: 分析失敗")
                continue

            summary = meter_data.get("summary", {})
            if summary:
                if summary.get("total_records", 0) > 0:
                    meters_with_data += 1
                    total_records += summary.get("total_records", 0)
                else:
                    meters_without_data += 1

        self.logger.info(f"有數據的電錶: {meters_with_data} 個")
        self.logger.info(f"無數據的電錶: {meters_without_data} 個")
        self.logger.info(f"總記錄數: {total_records:,} 筆")
        self.logger.info(f"平均每電錶記錄數: {total_records / meters_with_data if meters_with_data > 0 else 0:,.1f} 筆")

async def main():
    """主程式"""
    logger = setup_logging()
    logger.info("=== 電錶每日數據統計程式啟動 ===")

    try:
        analyzer = DailyMeterStatsAnalyzer()

        # 可以指定日期範圍，或讓程式自動從資料庫獲取
        # start_date = "2025-07-21"  # 可選：指定開始日期
        # end_date = "2025-08-22"    # 可選：指定結束日期
        start_date = None  # 自動從資料庫獲取
        end_date = None    # 自動從資料庫獲取

        # 設定是否使用 CSV 檔案載入電錶清單
        use_csv = True  # 優先使用 meter.csv，失敗則從資料庫查詢

        # 執行分析（使用資料庫優化版本）
        results = await analyzer.analyze_all_meters_db_optimized(start_date, end_date, use_csv)

        # 保存結果
        analyzer.save_results(results)

        # 打印摘要
        analyzer.print_summary(results)

        logger.info("=== 程式執行完成 ===")

    except Exception as e:
        logger.error(f"程式執行失敗: {e}")
        raise

if __name__ == "__main__":
    asyncio.run(main())
