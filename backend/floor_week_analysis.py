#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import asyncio
import json
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Tuple, Optional
from collections import defaultdict
import pandas as pd
from sqlalchemy import text
from database import async_session

# 設置日誌
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('floor_week_analysis.log', encoding='utf-8'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class FloorWeekAnalyzer:
    def __init__(self):
        pass

    async def get_all_meters_data(self, start_date: str, end_date: str) -> List[Dict]:
        """獲取所有電錶的週統計數據"""
        logger.info("正在獲取電錶數據進行週分析...")

        query = f"""
        WITH meter_weekly_stats AS (
            SELECT
                "deviceNumber",
                DATE_TRUNC('week', "lastUpdated" AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Taipei') as week_start,
                COUNT(*) as record_count,
                AVG("currents") as avg_current,
                STDDEV("currents") as stddev_current,
                MIN("currents") as min_current,
                MAX("currents") as max_current,
                COUNT(CASE WHEN "currents" > 0 THEN 1 END) as active_records,
                COUNT(CASE WHEN "currents" IS NULL THEN 1 END) as null_records
            FROM ammeter_log
            WHERE "lastUpdated" >= '{start_date}'::timestamp
                AND "lastUpdated" <= '{end_date}'::timestamp
                AND "deviceNumber" IS NOT NULL
            GROUP BY "deviceNumber", week_start
        )
        SELECT
            "deviceNumber",
            week_start,
            record_count,
            avg_current,
            stddev_current,
            min_current,
            max_current,
            active_records,
            null_records,
            CASE
                WHEN record_count > 0 THEN (active_records::float / record_count) * 100
                ELSE 0
            END as activity_rate,
            CASE
                WHEN avg_current > 0 AND stddev_current IS NOT NULL THEN stddev_current / avg_current
                ELSE 0
            END as coefficient_of_variation
        FROM meter_weekly_stats
        ORDER BY week_start, "deviceNumber"
        """

        async with async_session() as session:
            result = await session.execute(text(query))
            return [dict(row._mapping) for row in result.fetchall()]

    def load_meter_mappings(self) -> Dict[str, str]:
        """載入電錶名稱映射"""
        logger.info("正在載入電錶名稱映射...")
        try:
            df = pd.read_csv('meter.csv', encoding='utf-8')
            device_to_name = {}

            for _, row in df.iterrows():
                device_num = str(row['设备编号']).strip()
                meter_name = str(row['电表名称']).strip()
                if device_num and device_num != 'nan':
                    device_to_name[device_num] = meter_name

            logger.info(f"載入 {len(device_to_name)} 個電錶映射")
            return device_to_name
        except Exception as e:
            logger.error(f"載入電錶映射失敗: {e}")
            return {}

    def extract_floor_info(self, meter_name: str) -> Tuple[Optional[str], Optional[str]]:
        """從電錶名稱提取樓層和建築物信息"""
        if not meter_name or meter_name == 'nan':
            return None, None

        # 解析格式如 "Building A101", "Building B205a" 等
        parts = meter_name.split()
        if len(parts) >= 2:
            building = parts[1][0]  # A 或 B
            room_number = parts[1][1:]  # 101, 205a 等

            # 提取樓層 (第一個數字)
            floor_num = None
            for char in room_number:
                if char.isdigit():
                    floor_num = char
                    break

            if floor_num:
                floor = f"{building}{floor_num}"  # A1, B2 等
                return building, floor

        return None, None

    def calculate_floor_week_scores(self, data: List[Dict], meter_mappings: Dict[str, str]) -> List[Dict]:
        """計算每個樓層每週的綜合評分"""
        logger.info("正在計算樓層週評分...")

        # 按樓層和週組織數據
        floor_week_data = defaultdict(lambda: defaultdict(list))

        for record in data:
            device_number = record['deviceNumber']
            meter_name = meter_mappings.get(device_number, device_number)
            building, floor = self.extract_floor_info(meter_name)

            if floor:
                week_start = record['week_start']
                floor_week_data[floor][week_start].append(record)

        # 計算每個樓層每週的統計指標
        floor_week_scores = []

        for floor, week_data in floor_week_data.items():
            for week_start, records in week_data.items():
                if len(records) == 0:
                    continue

                # 基本統計
                total_records = sum(r['record_count'] for r in records)
                total_active = sum(r['active_records'] for r in records)
                total_meters = len(records)

                # 數據覆蓋率 (記錄數量指標)
                avg_records_per_meter = total_records / total_meters if total_meters > 0 else 0

                # 數據活躍率
                activity_rate = (total_active / total_records * 100) if total_records > 0 else 0

                # 數據穩定性 (變異係數的平均)
                valid_cvs = [r['coefficient_of_variation'] for r in records if r['coefficient_of_variation'] and r['coefficient_of_variation'] > 0]
                avg_cv = sum(valid_cvs) / len(valid_cvs) if valid_cvs else 0
                stability_score = max(0, 100 - avg_cv * 100)  # CV越低，穩定性越高

                # 數據完整性 (非空值比例)
                total_possible = sum(r['record_count'] + r['null_records'] for r in records)
                completeness = (total_records / total_possible * 100) if total_possible > 0 else 0

                # 電錶數量權重 (更多電錶提供更好的代表性)
                meter_count_score = min(100, total_meters * 10)  # 每個電錶10分，最高100分

                # 綜合評分計算 (各指標權重)
                # 覆蓋率 30%, 活躍率 25%, 穩定性 20%, 完整性 15%, 電錶數量 10%
                coverage_score = min(100, avg_records_per_meter / 150 * 100)  # 假設150條記錄/週為滿分

                total_score = (
                    coverage_score * 0.30 +
                    activity_rate * 0.25 +
                    stability_score * 0.20 +
                    completeness * 0.15 +
                    meter_count_score * 0.10
                )

                floor_week_scores.append({
                    'floor': floor,
                    'week_start': week_start,
                    'total_score': round(total_score, 2),
                    'meter_count': total_meters,
                    'total_records': total_records,
                    'avg_records_per_meter': round(avg_records_per_meter, 1),
                    'activity_rate': round(activity_rate, 1),
                    'stability_score': round(stability_score, 1),
                    'completeness': round(completeness, 1),
                    'coverage_score': round(coverage_score, 1),
                    'meter_count_score': round(meter_count_score, 1)
                })

        return floor_week_scores

    def rank_floor_weeks(self, floor_week_scores: List[Dict]) -> List[Dict]:
        """對樓層週進行排名"""
        logger.info("正在對樓層週進行排名...")

        # 按總分排序
        ranked = sorted(floor_week_scores, key=lambda x: x['total_score'], reverse=True)

        # 添加排名
        for i, item in enumerate(ranked, 1):
            item['rank'] = i

        return ranked

    def save_results(self, ranked_results: List[Dict]):
        """保存分析結果"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

        # 保存 JSON
        json_filename = f"floor_week_analysis_{timestamp}.json"
        with open(json_filename, 'w', encoding='utf-8') as f:
            json.dump(ranked_results, f, ensure_ascii=False, indent=2, default=str)
        logger.info(f"JSON 結果已保存到 {json_filename}")

        # 保存 CSV
        csv_filename = f"floor_week_analysis_{timestamp}.csv"
        df = pd.DataFrame(ranked_results)
        df.to_csv(csv_filename, index=False, encoding='utf-8')
        logger.info(f"CSV 結果已保存到 {csv_filename}")

        return json_filename, csv_filename

    def print_top_results(self, ranked_results: List[Dict], top_n: int = 20):
        """打印頂部結果"""
        logger.info(f"\n=== 前 {top_n} 名最適合數據判讀的樓層週區間 ===")

        print(f"\n{'排名':<4} {'樓層':<6} {'週開始日期':<12} {'總分':<6} {'電錶數':<6} {'記錄數':<8} {'活躍率':<7} {'穩定性':<7} {'完整性':<7}")
        print("-" * 80)

        for i, result in enumerate(ranked_results[:top_n]):
            week_start = result['week_start'].strftime('%Y-%m-%d') if isinstance(result['week_start'], datetime) else str(result['week_start'])[:10]
            print(f"{result['rank']:<4} {result['floor']:<6} {week_start:<12} {result['total_score']:<6} {result['meter_count']:<6} {result['total_records']:<8} {result['activity_rate']:<7}% {result['stability_score']:<7} {result['completeness']:<7}%")

    async def analyze(self):
        """執行完整分析"""
        logger.info("=== 樓層週區間數據品質分析開始 ===")

        # 設定分析時間範圍 (最近一個月)
        end_date = datetime.now()
        start_date = end_date - timedelta(days=35)  # 5週數據

        start_date_str = start_date.strftime('%Y-%m-%d')
        end_date_str = end_date.strftime('%Y-%m-%d')

        logger.info(f"分析時間範圍: {start_date_str} 至 {end_date_str}")

        # 獲取數據
        data = await self.get_all_meters_data(start_date_str, end_date_str)
        logger.info(f"獲取到 {len(data)} 條週統計記錄")

        # 載入電錶映射
        meter_mappings = self.load_meter_mappings()

        # 計算樓層週評分
        floor_week_scores = self.calculate_floor_week_scores(data, meter_mappings)
        logger.info(f"計算出 {len(floor_week_scores)} 個樓層週評分")

        # 排名
        ranked_results = self.rank_floor_weeks(floor_week_scores)

        # 保存結果
        json_file, csv_file = self.save_results(ranked_results)

        # 打印頂部結果
        self.print_top_results(ranked_results)

        # 分析摘要
        logger.info(f"\n=== 分析摘要 ===")
        logger.info(f"分析期間: {start_date_str} 至 {end_date_str}")
        logger.info(f"總樓層週組合: {len(ranked_results)}")

        if ranked_results:
            best = ranked_results[0]
            logger.info(f"最佳樓層週: {best['floor']} 週 {best['week_start']} (總分: {best['total_score']})")

            # 按樓層統計
            floor_stats = defaultdict(list)
            for result in ranked_results:
                floor_stats[result['floor']].append(result['total_score'])

            logger.info(f"\n各樓層平均表現:")
            floor_avg = [(floor, sum(scores)/len(scores)) for floor, scores in floor_stats.items()]
            floor_avg.sort(key=lambda x: x[1], reverse=True)

            for floor, avg_score in floor_avg:
                logger.info(f"  {floor}: 平均分數 {avg_score:.1f}")

        logger.info("=== 樓層週區間分析完成 ===")

async def main():
    analyzer = FloorWeekAnalyzer()
    await analyzer.analyze()

if __name__ == "__main__":
    asyncio.run(main())
