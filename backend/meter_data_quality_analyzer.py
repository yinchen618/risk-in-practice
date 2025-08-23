#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
電錶數據品質分析與最佳分析區間推薦腳本

此腳本用於分析指定時間範圍內電錶數據的品質，並找出最適合進行標註和趨勢分析的連續7天區間。

使用方法:
    python meter_data_quality_analyzer.py

功能:
1. 分析每個電錶每天的數據品質（完整度、中斷次數、最長中斷時間）
2. 找出最佳的連續7天分析區間
3. 生成詳細的分析報告並保存為 JSON 檔案

作者: AI Assistant
日期: 2025-08-23
版本: 1.0
"""

import os
import sys
import json
import logging
import asyncio
import pandas as pd
import numpy as np
from datetime import datetime, timedelta, timezone
from typing import List, Dict, Any, Optional
from dataclasses import dataclass
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import and_, func

# 添加父目錄到路徑以導入核心模組
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from core.database import AmmeterLog, DatabaseManager

# 配置日誌
def setup_logging(log_file: str = "meter_quality_analysis.log"):
    """設置日誌配置"""
    log_format = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"

    # 創建日誌記錄器
    logger = logging.getLogger("meter_quality_analyzer")
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

@dataclass
class DailySummary:
    """每日數據品質摘要"""
    date: str
    completeness_rate: float
    max_continuous_gap_minutes: int
    gap_count: int

@dataclass
class QualityScore:
    """品質評分"""
    avg_completeness_rate: float
    total_gap_count: int
    max_gap_in_window: int

@dataclass
class BestWindow:
    """最佳分析窗口"""
    start_date: str
    end_date: str
    quality_score: QualityScore

class MeterDataQualityAnalyzer:
    """電錶數據品質分析器"""

    def __init__(self, data_frequency_minutes: int = 15):
        """
        初始化分析器

        Args:
            data_frequency_minutes: 電錶數據的預期時間頻率（分鐘），預設為15分鐘
        """
        self.data_frequency_minutes = data_frequency_minutes
        self.db_manager = DatabaseManager()
        self.logger = setup_logging()

        # 台灣時區 (UTC+8)
        self.taiwan_tz = timezone(timedelta(hours=8))

    async def load_meter_data(self, meter_names: List[str], start_date: str, end_date: str) -> Dict[str, pd.DataFrame]:
        """
        從資料庫載入指定電錶的數據

        Args:
            meter_names: 電錶名稱列表 (例如: ['101', '102a'])
            start_date: 開始日期 'YYYY-MM-DD'
            end_date: 結束日期 'YYYY-MM-DD'

        Returns:
            Dict[meter_name, DataFrame]: 每個電錶的數據 DataFrame
        """
        self.logger.info(f"開始載入電錶數據，時間範圍: {start_date} 至 {end_date}")

        # 轉換為台灣時間的 UTC 時間範圍
        start_datetime_tw = datetime.strptime(start_date, '%Y-%m-%d').replace(tzinfo=self.taiwan_tz)
        end_datetime_tw = datetime.strptime(end_date, '%Y-%m-%d').replace(hour=23, minute=59, second=59, tzinfo=self.taiwan_tz)

        # 轉換為 UTC 時間（資料庫存儲格式）
        start_datetime_utc = start_datetime_tw.astimezone(timezone.utc).replace(tzinfo=None)
        end_datetime_utc = end_datetime_tw.astimezone(timezone.utc).replace(tzinfo=None)

        self.logger.info(f"UTC 時間範圍: {start_datetime_utc} 至 {end_datetime_utc}")

        meter_data = {}

        async with self.db_manager.get_async_session() as session:
            for meter_name in meter_names:
                self.logger.info(f"載入電錶 {meter_name} 的數據...")

                # 查詢數據庫
                query = select(AmmeterLog.lastUpdated, AmmeterLog.power).where(
                    and_(
                        func.split_part(AmmeterLog.deviceNumber, ' ', 2) == meter_name,  # 從 deviceNumber 提取電錶名稱
                        AmmeterLog.lastUpdated >= start_datetime_utc,
                        AmmeterLog.lastUpdated <= end_datetime_utc,
                        AmmeterLog.power.isnot(None),  # 確保有功率數據
                        AmmeterLog.success == True  # 只取成功的記錄
                    )
                ).order_by(AmmeterLog.lastUpdated)

                result = await session.execute(query)
                records = result.fetchall()

                if records:
                    # 轉換為 DataFrame
                    df = pd.DataFrame(records, columns=['timestamp', 'power'])
                    df['timestamp'] = pd.to_datetime(df['timestamp'])

                    # 轉換為台灣時間
                    df['timestamp'] = df['timestamp'].dt.tz_localize('UTC').dt.tz_convert(self.taiwan_tz)

                    # 設置時間索引
                    df.set_index('timestamp', inplace=True)

                    meter_data[meter_name] = df
                    self.logger.info(f"電錶 {meter_name} 載入 {len(df)} 筆記錄")
                else:
                    self.logger.warning(f"電錶 {meter_name} 在指定時間範圍內沒有數據")
                    meter_data[meter_name] = pd.DataFrame(columns=['power'])

        self.logger.info(f"數據載入完成，共載入 {len(meter_data)} 個電錶的數據")
        return meter_data

    def create_standard_time_index(self, start_date: str, end_date: str) -> pd.DatetimeIndex:
        """
        創建標準時間索引

        Args:
            start_date: 開始日期 'YYYY-MM-DD'
            end_date: 結束日期 'YYYY-MM-DD'

        Returns:
            標準時間索引（台灣時間）
        """
        start_datetime = datetime.strptime(start_date, '%Y-%m-%d').replace(tzinfo=self.taiwan_tz)
        end_datetime = datetime.strptime(end_date, '%Y-%m-%d').replace(hour=23, minute=59, second=59, tzinfo=self.taiwan_tz)

        # 創建時間索引
        time_index = pd.date_range(
            start=start_datetime,
            end=end_datetime,
            freq=f'{self.data_frequency_minutes}T',
            tz=self.taiwan_tz
        )

        return time_index

    def analyze_daily_quality(self, df: pd.DataFrame, standard_index: pd.DatetimeIndex) -> List[DailySummary]:
        """
        分析每日數據品質

        Args:
            df: 電錶數據 DataFrame
            standard_index: 標準時間索引

        Returns:
            每日數據品質摘要列表
        """
        # 重採樣到標準時間索引
        df_resampled = df.reindex(standard_index)

        daily_summaries = []

        # 按日期分組
        for date, group in df_resampled.groupby(df_resampled.index.date):
            date_str = date.strftime('%Y-%m-%d')

            # 計算每日應有的數據點數
            expected_points = len(group)
            actual_points = group['power'].notna().sum()

            # 數據完整度
            completeness_rate = (actual_points / expected_points * 100) if expected_points > 0 else 0

            # 找出 NaN 位置
            is_nan = group['power'].isna()

            # 計算連續中斷
            nan_changes = is_nan.diff().fillna(False)
            gap_starts = nan_changes & is_nan
            gap_ends = nan_changes & (~is_nan)

            # 計算中斷次數
            gap_count = gap_starts.sum()

            # 計算最長連續中斷時間
            max_continuous_gap_minutes = 0
            if gap_count > 0:
                # 找出所有中斷區間
                gap_lengths = []
                current_gap_start = None

                for i, (ts, is_gap) in enumerate(zip(group.index, is_nan)):
                    if is_gap and current_gap_start is None:
                        current_gap_start = i
                    elif not is_gap and current_gap_start is not None:
                        gap_length = i - current_gap_start
                        gap_lengths.append(gap_length)
                        current_gap_start = None

                # 處理到結尾還在中斷的情況
                if current_gap_start is not None:
                    gap_length = len(group) - current_gap_start
                    gap_lengths.append(gap_length)

                if gap_lengths:
                    max_continuous_gap_minutes = max(gap_lengths) * self.data_frequency_minutes

            daily_summary = DailySummary(
                date=date_str,
                completeness_rate=round(completeness_rate, 2),
                max_continuous_gap_minutes=max_continuous_gap_minutes,
                gap_count=gap_count
            )

            daily_summaries.append(daily_summary)

        return daily_summaries

    def find_best_7day_window(self, daily_summaries: List[DailySummary]) -> Optional[BestWindow]:
        """
        尋找最佳連續7天區間

        Args:
            daily_summaries: 每日數據品質摘要列表

        Returns:
            最佳分析窗口，如果沒有找到合適的窗口則返回 None
        """
        if len(daily_summaries) < 7:
            self.logger.warning("數據天數少於7天，無法找到7天窗口")
            return None

        best_window = None
        best_score = None

        # 滑動窗口分析
        for i in range(len(daily_summaries) - 6):
            window = daily_summaries[i:i+7]

            # 計算窗口評分
            avg_completeness = sum(day.completeness_rate for day in window) / 7
            total_gap_count = sum(day.gap_count for day in window)
            max_gap_in_window = max(day.max_continuous_gap_minutes for day in window)

            # 檢查是否有足夠的數據品質（至少 50% 完整度）
            if avg_completeness < 50:
                continue

            current_score = QualityScore(
                avg_completeness_rate=round(avg_completeness, 2),
                total_gap_count=total_gap_count,
                max_gap_in_window=max_gap_in_window
            )

            # 比較評分（多級優先制）
            if best_score is None or self._is_better_score(current_score, best_score):
                best_score = current_score
                best_window = BestWindow(
                    start_date=window[0].date,
                    end_date=window[6].date,
                    quality_score=current_score
                )

        return best_window

    def _is_better_score(self, current: QualityScore, best: QualityScore) -> bool:
        """
        比較兩個評分，判斷當前評分是否更好

        Args:
            current: 當前評分
            best: 最佳評分

        Returns:
            如果當前評分更好則返回 True
        """
        # 第一優先級：平均數據完整度
        if current.avg_completeness_rate > best.avg_completeness_rate:
            return True
        elif current.avg_completeness_rate < best.avg_completeness_rate:
            return False

        # 第二優先級：總中斷次數（越少越好）
        if current.total_gap_count < best.total_gap_count:
            return True
        elif current.total_gap_count > best.total_gap_count:
            return False

        # 第三優先級：區間內最長中斷（越短越好）
        if current.max_gap_in_window < best.max_gap_in_window:
            return True

        return False

    async def analyze_meters(self, meter_names: List[str], start_date: str, end_date: str) -> Dict[str, Any]:
        """
        分析多個電錶的數據品質

        Args:
            meter_names: 電錶名稱列表
            start_date: 開始日期 'YYYY-MM-DD'
            end_date: 結束日期 'YYYY-MM-DD'

        Returns:
            分析結果字典
        """
        self.logger.info(f"開始分析 {len(meter_names)} 個電錶的數據品質")

        # 載入數據
        meter_data = await self.load_meter_data(meter_names, start_date, end_date)

        # 創建標準時間索引
        standard_index = self.create_standard_time_index(start_date, end_date)

        results = {}

        for meter_name in meter_names:
            self.logger.info(f"分析電錶 {meter_name}...")

            if meter_name not in meter_data or meter_data[meter_name].empty:
                self.logger.warning(f"電錶 {meter_name} 沒有數據，跳過分析")
                results[meter_name] = {
                    "daily_summary": [],
                    "best_window": None
                }
                continue

            # 分析每日品質
            daily_summaries = self.analyze_daily_quality(meter_data[meter_name], standard_index)

            # 尋找最佳7天窗口
            best_window = self.find_best_7day_window(daily_summaries)

            # 轉換為字典格式
            daily_summary_dicts = [
                {
                    "date": summary.date,
                    "completeness_rate": summary.completeness_rate,
                    "max_continuous_gap_minutes": summary.max_continuous_gap_minutes,
                    "gap_count": summary.gap_count
                }
                for summary in daily_summaries
            ]

            best_window_dict = None
            if best_window:
                best_window_dict = {
                    "start_date": best_window.start_date,
                    "end_date": best_window.end_date,
                    "quality_score": {
                        "avg_completeness_rate": best_window.quality_score.avg_completeness_rate,
                        "total_gap_count": best_window.quality_score.total_gap_count,
                        "max_gap_in_window": best_window.quality_score.max_gap_in_window
                    }
                }

            results[meter_name] = {
                "daily_summary": daily_summary_dicts,
                "best_window": best_window_dict
            }

            self.logger.info(f"電錶 {meter_name} 分析完成")
            if best_window:
                self.logger.info(f"  最佳7天窗口: {best_window.start_date} 至 {best_window.end_date}")
                self.logger.info(f"  平均完整度: {best_window.quality_score.avg_completeness_rate}%")
            else:
                self.logger.warning(f"  未找到合適的7天窗口")

        self.logger.info("所有電錶分析完成")
        return results

    def save_results(self, results: Dict[str, Any], output_file: str = "meter_quality_analysis_results.json"):
        """
        保存分析結果到 JSON 檔案

        Args:
            results: 分析結果
            output_file: 輸出檔案名稱
        """
        try:
            # 添加元資訊
            output_data = {
                "analysis_info": {
                    "analysis_time": datetime.now(self.taiwan_tz).isoformat(),
                    "data_frequency_minutes": self.data_frequency_minutes,
                    "total_meters_analyzed": len(results)
                },
                "results": results
            }

            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(output_data, f, ensure_ascii=False, indent=2)

            self.logger.info(f"分析結果已保存到 {output_file}")
        except Exception as e:
            self.logger.error(f"保存結果失敗: {e}")

async def main():
    """主程式"""
    logger = setup_logging()
    logger.info("=== 電錶數據品質分析程式啟動 ===")

    # 配置參數
    analyzer = MeterDataQualityAnalyzer(data_frequency_minutes=15)

    # 設定分析參數
    start_date = "2025-07-21"  # 分析開始日期
    end_date = "2025-08-22"    # 分析結束日期

    # 要分析的電錶名稱列表（基於 meter.csv 中的電錶名稱）
    meter_names = [
        "101", "101a", "102", "102a", "103", "103a",  # A棟1樓
        "201", "201a", "202", "202a", "203", "203a",  # A棟2樓
        "301", "301a", "302", "302a", "303", "303a",  # A棟3樓
        "101", "102", "102a", "103", "105", "105a",   # B棟1樓 (注意B棟101沒有appliance)
    ]

    try:
        # 執行分析
        logger.info(f"分析時間範圍: {start_date} 至 {end_date}")
        logger.info(f"目標電錶數量: {len(meter_names)}")

        results = await analyzer.analyze_meters(meter_names, start_date, end_date)

        # 保存結果
        analyzer.save_results(results)

        # 輸出摘要
        logger.info("=== 分析摘要 ===")
        meters_with_good_windows = 0
        meters_without_data = 0

        for meter_name, result in results.items():
            if result["best_window"]:
                meters_with_good_windows += 1
                logger.info(f"電錶 {meter_name}: 找到最佳7天窗口 "
                          f"({result['best_window']['start_date']} 至 {result['best_window']['end_date']}, "
                          f"完整度 {result['best_window']['quality_score']['avg_completeness_rate']}%)")
            elif not result["daily_summary"]:
                meters_without_data += 1
                logger.warning(f"電錶 {meter_name}: 無數據")
            else:
                logger.warning(f"電錶 {meter_name}: 未找到合適的7天窗口")

        logger.info(f"總計: {len(results)} 個電錶")
        logger.info(f"  有良好7天窗口: {meters_with_good_windows} 個")
        logger.info(f"  無數據: {meters_without_data} 個")
        logger.info(f"  品質不佳: {len(results) - meters_with_good_windows - meters_without_data} 個")

        logger.info("=== 程式執行完成 ===")

    except Exception as e:
        logger.error(f"程式執行失敗: {e}")
        raise

if __name__ == "__main__":
    asyncio.run(main())
