#!/usr/bin/env python3
"""
PostgreSQL 版本的 AnalysisDataset positiveLabels 更新腳本

這個腳本會：
1. 自動偵測 PostgreSQL 連接
2. 檢查並更新每個 AnalysisDataset 的 positiveLabels
3. 提供詳細的日誌記錄和一致性檢查
"""

import asyncio
import asyncpg
import os
from datetime import datetime
from typing import List, Dict, Optional, Tuple

# 設定日誌
import logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('update_positive_labels_pg.log', encoding='utf-8')
    ]
)
logger = logging.getLogger(__name__)

class PostgreSQLPositiveLabelsUpdater:
    """PostgreSQL 版本的 Positive Labels 更新器"""

    def __init__(self):
        """初始化更新器"""
        self.database_url = self.get_database_url()
        self.conn = None

    def get_database_url(self) -> str:
        """自動檢測數據庫 URL"""
        # 從環境變量讀取
        db_url = os.getenv("DATABASE_URL")
        if db_url:
            # 轉換為 asyncpg 格式
            if db_url.startswith("postgresql+asyncpg://"):
                return db_url.replace("postgresql+asyncpg://", "postgresql://")
            elif db_url.startswith("postgresql://"):
                return db_url

        # 默認連接
        return "postgresql://postgres:Info4467@supa.clkvfvz5fxb3.ap-northeast-3.rds.amazonaws.com:5432/supa"

    async def connect(self):
        """連接數據庫"""
        try:
            self.conn = await asyncpg.connect(self.database_url)
            logger.info(f"✅ 成功連接 PostgreSQL: {self.database_url.split('@')[-1] if '@' in self.database_url else 'localhost'}")
            return True
        except Exception as e:
            logger.error(f"❌ 連接數據庫失敗: {e}")
            return False

    async def close(self):
        """關閉數據庫連接"""
        if self.conn:
            await self.conn.close()
            self.conn = None

    async def get_analysis_datasets(self) -> List[Dict]:
        """獲取所有 AnalysisDataset 記錄"""
        try:
            query = """
            SELECT id, name, positive_labels
            FROM analysis_datasets
            ORDER BY name
            """
            rows = await self.conn.fetch(query)
            return [dict(row) for row in rows]
        except Exception as e:
            logger.error(f"❌ 查詢 analysis_datasets 失敗: {e}")
            return []

    async def calculate_positive_labels(self, dataset_id: str) -> Tuple[int, int]:
        """計算數據集的正標籤數量

        返回: (analysis_positive_count, confirmed_positive_count)
        """
        try:
            # 1. 計算 analysis_ready_data 中的正標籤
            analysis_query = """
            SELECT COUNT(*) as count
            FROM analysis_ready_data
            WHERE dataset_id = $1 AND is_positive_label = true
            """
            analysis_result = await self.conn.fetchval(analysis_query, dataset_id)
            analysis_positive_count = analysis_result or 0

            # 2. 計算已確認的異常事件 (通過 source_anomaly_event_id 關聯)
            confirmed_query = """
            SELECT COUNT(*) as count
            FROM analysis_ready_data ard
            JOIN anomaly_event ae ON ard.source_anomaly_event_id = ae.id
            WHERE ard.dataset_id = $1 AND ae.status = 'CONFIRMED_POSITIVE'
            """
            confirmed_result = await self.conn.fetchval(confirmed_query, dataset_id)
            confirmed_positive_count = confirmed_result or 0

            return analysis_positive_count, confirmed_positive_count

        except Exception as e:
            logger.error(f"❌ 計算數據集 {dataset_id} 的正標籤失敗: {e}")
            return 0, 0

    async def update_dataset_positive_labels(self, dataset_id: str, new_value: int) -> bool:
        """更新數據集的 positive_labels"""
        try:
            query = """
            UPDATE analysis_datasets
            SET positive_labels = $1
            WHERE id = $2
            """
            await self.conn.execute(query, new_value, dataset_id)
            return True
        except Exception as e:
            logger.error(f"❌ 更新數據集 {dataset_id} 的 positive_labels 失敗: {e}")
            return False

    async def update_all_positive_labels(self) -> Dict:
        """更新所有數據集的 positiveLabels"""
        logger.info("🚀 開始更新所有 AnalysisDataset 的 positiveLabels...")

        datasets = await self.get_analysis_datasets()
        if not datasets:
            logger.warning("❌ 未找到任何 AnalysisDataset 記錄")
            return {"updated": 0, "total": 0, "errors": 0}

        logger.info(f"📊 找到 {len(datasets)} 個數據集")

        updated_count = 0
        error_count = 0
        total_positive_labels = 0
        total_confirmed = 0

        print("=" * 100)
        print("📋 AnalysisDataset Positive Labels 更新報告")
        print("=" * 100)
        print(f"{'數據集名稱':<30} | {'當前值':<8} | {'分析數':<8} | {'確認數':<8} | {'新值':<8} | {'狀態':<6}")
        print("-" * 100)

        for dataset in datasets:
            dataset_id = dataset['id']
            current_value = dataset.get('positive_labels', 0) or 0
            dataset_name = dataset.get('name', 'Unknown')[:28]

            # 計算新值
            analysis_count, confirmed_count = await self.calculate_positive_labels(dataset_id)
            new_value = max(analysis_count, confirmed_count)

            total_positive_labels += new_value
            total_confirmed += confirmed_count

            # 檢查是否需要更新
            if current_value != new_value:
                success = await self.update_dataset_positive_labels(dataset_id, new_value)
                if success:
                    updated_count += 1
                    status = "🔄 更新"
                    logger.info(f"✅ 更新 {dataset_name}: {current_value} → {new_value}")
                else:
                    error_count += 1
                    status = "❌ 錯誤"
                    logger.error(f"❌ 更新失敗 {dataset_name}")
            else:
                status = "✅ 正確"

            print(f"{dataset_name:<30} | {current_value:>8} | {analysis_count:>8} | {confirmed_count:>8} | {new_value:>8} | {status}")

        print("-" * 100)
        print(f"📊 統計摘要:")
        print(f"   • 總數據集: {len(datasets)}")
        print(f"   • 已更新: {updated_count}")
        print(f"   • 錯誤: {error_count}")
        print(f"   • 總正標籤: {total_positive_labels:,}")
        print(f"   • 總確認異常: {total_confirmed:,}")
        print("=" * 100)

        logger.info(f"🎯 更新完成: {updated_count} 個數據集已更新，{error_count} 個錯誤")

        return {
            "updated": updated_count,
            "total": len(datasets),
            "errors": error_count,
            "total_positive_labels": total_positive_labels,
            "total_confirmed": total_confirmed
        }

    async def check_labeling_consistency(self) -> Dict:
        """檢查標籤一致性"""
        logger.info("🔍 檢查標籤一致性...")

        try:
            # 檢查不一致的數據集
            query = """
            SELECT
                ad.id,
                ad.name,
                ad.positive_labels as current_labels,
                COALESCE(analysis_counts.analysis_positive, 0) as analysis_positive,
                COALESCE(confirmed_counts.confirmed_positive, 0) as confirmed_positive,
                GREATEST(
                    COALESCE(analysis_counts.analysis_positive, 0),
                    COALESCE(confirmed_counts.confirmed_positive, 0)
                ) as expected_labels
            FROM analysis_datasets ad
            LEFT JOIN (
                SELECT
                    dataset_id,
                    COUNT(*) as analysis_positive
                FROM analysis_ready_data
                WHERE is_positive_label = true
                GROUP BY dataset_id
            ) analysis_counts ON ad.id = analysis_counts.dataset_id
            LEFT JOIN (
                SELECT
                    ard.dataset_id,
                    COUNT(*) as confirmed_positive
                FROM anomaly_event ae
                JOIN analysis_ready_data ard ON ard.source_anomaly_event_id = ae.id
                WHERE ae.status = 'CONFIRMED_POSITIVE'
                GROUP BY ard.dataset_id
            ) confirmed_counts ON ad.id = confirmed_counts.dataset_id
            WHERE
                ad.positive_labels != GREATEST(
                    COALESCE(analysis_counts.analysis_positive, 0),
                    COALESCE(confirmed_counts.confirmed_positive, 0)
                )
            ORDER BY ad.name
            """

            inconsistent = await self.conn.fetch(query)

            if inconsistent:
                logger.warning(f"⚠️  發現 {len(inconsistent)} 個不一致的數據集:")
                for row in inconsistent:
                    logger.warning(f"   • {row['name']}: 當前={row['current_labels']}, 預期={row['expected_labels']}")
            else:
                logger.info("✅ 所有數據集標籤都一致")

            return {
                "consistent": len(inconsistent) == 0,
                "inconsistent_count": len(inconsistent),
                "inconsistent_datasets": [dict(row) for row in inconsistent]
            }

        except Exception as e:
            logger.error(f"❌ 檢查一致性失敗: {e}")
            return {"consistent": False, "error": str(e)}

async def main():
    """主函數"""
    updater = PostgreSQLPositiveLabelsUpdater()

    try:
        # 連接數據庫
        if not await updater.connect():
            return

        print("🚀 AnalysisDataset Positive Labels 更新工具 (PostgreSQL 版)")
        print("=" * 60)

        # 執行更新
        result = await updater.update_all_positive_labels()

        # 檢查一致性
        consistency = await updater.check_labeling_consistency()

        # 生成摘要報告
        print("\n📋 最終報告:")
        print(f"• 總數據集: {result['total']}")
        print(f"• 已更新: {result['updated']}")
        print(f"• 錯誤: {result['errors']}")
        print(f"• 一致性: {'✅ 通過' if consistency['consistent'] else '❌ 有問題'}")
        print(f"• 總正標籤: {result['total_positive_labels']:,}")
        print(f"• 總確認異常: {result['total_confirmed']:,}")

        if result['updated'] > 0:
            logger.info("✅ 更新完成！建議重啟後端服務以確保更改生效。")

    except Exception as e:
        logger.error(f"❌ 程序執行失敗: {e}")

    finally:
        await updater.close()

if __name__ == "__main__":
    asyncio.run(main())
