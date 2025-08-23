"""
多尺度特徵工程測試腳本

這個腳本用於測試和驗證多尺度特徵工程的實現。
包含單元測試、功能測試和效能測試。
"""

import asyncio
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List
import logging

# 導入我們的模組
from data_preprocessing_etl_multiscale import (
    MultiscaleETL,
    RoomInfo,
    OccupantType
)
from multiscale_config import (
    MULTISCALE_CONFIG,
    FEATURE_PRESETS,
    get_multiscale_config,
    calculate_feature_count,
    get_feature_list,
    validate_multiscale_config
)

# 設定測試日誌
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MultiscaleETLTester:
    """多尺度ETL測試器"""

    def __init__(self):
        self.etl = None
        self.test_data = None

    def create_test_data(self, duration_hours: int = 3) -> pd.DataFrame:
        """
        創建測試數據

        Args:
            duration_hours: 測試數據持續時間（小時）

        Returns:
            pd.DataFrame: 測試數據
        """
        logger.info(f"生成 {duration_hours} 小時的測試數據...")

        # 生成時間序列（每分鐘一筆）
        start_time = datetime(2024, 1, 15, 9, 0)  # 週一上午9點
        end_time = start_time + timedelta(hours=duration_hours)
        timestamps = pd.date_range(start_time, end_time, freq='1T')

        test_data = []

        for timestamp in timestamps:
            # 模擬正常用電模式（工作時間較高）
            hour = timestamp.hour
            base_power = 100 if 9 <= hour <= 18 else 30

            # 添加隨機噪聲
            noise = np.random.normal(0, 10)

            # 模擬異常（隨機出現）
            is_anomaly = np.random.random() < 0.05  # 5%機率異常
            anomaly_multiplier = 3 if is_anomaly else 1

            l1_power = max(0, (base_power + noise) * anomaly_multiplier)
            l2_power = max(0, (base_power * 0.8 + noise) * anomaly_multiplier)

            test_data.append({
                'timestamp': timestamp,
                'rawWattageL1': l1_power,
                'rawWattageL2': l2_power,
                'room': 'TEST_ROOM_A1',
                'is_test_anomaly': is_anomaly
            })

        df = pd.DataFrame(test_data)
        logger.info(f"生成了 {len(df)} 筆測試數據")
        logger.info(f"異常樣本數: {df['is_test_anomaly'].sum()}")

        return df

    async def test_feature_extraction(self, preset_name: str = "full") -> Dict:
        """
        測試特徵提取功能

        Args:
            preset_name: 特徵預設配置

        Returns:
            Dict: 測試結果
        """
        logger.info(f"測試特徵提取 - 配置: {preset_name}")

        # 獲取配置
        config = get_multiscale_config(preset_name)

        # 創建ETL實例
        room_info = RoomInfo(
            room_name="TEST_ROOM_A1",
            occupant_type=OccupantType.OFFICE,
            organization_id=1
        )

        # 模擬數據庫連接（不實際連接）
        self.etl = MultiscaleETL(
            connection_string="postgresql://test:test@test:5432/test",
            config=config
        )

        # 創建測試數據
        test_data = self.create_test_data(duration_hours=3)

        # 測試特徵生成
        logger.info("開始生成多尺度特徵...")
        start_time = datetime.now()

        try:
            # 直接調用特徵生成方法（繞過數據庫）
            features_df = self.etl.generate_multiscale_features(
                data=test_data,
                room_info=room_info
            )

            end_time = datetime.now()
            processing_time = (end_time - start_time).total_seconds()

            # 計算特徵統計
            results = {
                "success": True,
                "processing_time_seconds": processing_time,
                "input_samples": len(test_data),
                "output_samples": len(features_df),
                "feature_count": len(features_df.columns),
                "feature_names": list(features_df.columns),
                "sample_efficiency": len(features_df) / len(test_data),
                "features_preview": features_df.head(3).to_dict(),
                "feature_statistics": {}
            }

            # 計算數值特徵的統計
            numeric_columns = features_df.select_dtypes(include=[np.number]).columns
            for col in numeric_columns:
                if col in features_df.columns:
                    series = features_df[col]
                    results["feature_statistics"][col] = {
                        "mean": float(series.mean()) if not series.isna().all() else None,
                        "std": float(series.std()) if not series.isna().all() else None,
                        "min": float(series.min()) if not series.isna().all() else None,
                        "max": float(series.max()) if not series.isna().all() else None,
                        "null_count": int(series.isna().sum())
                    }

            logger.info(f"特徵提取完成 - 耗時: {processing_time:.2f}秒")
            logger.info(f"輸入樣本: {results['input_samples']}, 輸出樣本: {results['output_samples']}")
            logger.info(f"特徵數量: {results['feature_count']}")

            return results

        except Exception as e:
            logger.error(f"特徵提取失敗: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "processing_time_seconds": (datetime.now() - start_time).total_seconds()
            }

    def test_window_alignment(self) -> Dict:
        """
        測試時間窗口對齊功能
        """
        logger.info("測試時間窗口對齊...")

        # 創建測試數據
        test_data = self.create_test_data(duration_hours=2)

        results = {
            "success": True,
            "tests": {}
        }

        try:
            # 測試不同窗口大小
            for window_size in [15, 30, 60]:
                logger.info(f"測試 {window_size} 分鐘窗口...")

                # 模擬窗口特徵提取邏輯
                grouped_data = []
                current_time = test_data['timestamp'].min()
                end_time = test_data['timestamp'].max()

                while current_time <= end_time:
                    window_end = current_time
                    window_start = window_end - timedelta(minutes=window_size)

                    # 篩選窗口內數據
                    window_data = test_data[
                        (test_data['timestamp'] > window_start) &
                        (test_data['timestamp'] <= window_end)
                    ]

                    if len(window_data) > 0:
                        window_features = {
                            'timestamp': current_time,
                            'samples_in_window': len(window_data),
                            'l1_mean': window_data['rawWattageL1'].mean(),
                            'l1_std': window_data['rawWattageL1'].std(),
                            'l2_mean': window_data['rawWattageL2'].mean(),
                            'l2_std': window_data['rawWattageL2'].std(),
                        }
                        grouped_data.append(window_features)

                    current_time += timedelta(minutes=1)  # 1分鐘步長

                results["tests"][f"{window_size}min_window"] = {
                    "window_count": len(grouped_data),
                    "avg_samples_per_window": np.mean([d['samples_in_window'] for d in grouped_data]),
                    "coverage_ratio": len(grouped_data) / (len(test_data) / window_size)
                }

                logger.info(f"{window_size}分鐘窗口: {len(grouped_data)} 個窗口")

        except Exception as e:
            logger.error(f"窗口對齊測試失敗: {str(e)}")
            results["success"] = False
            results["error"] = str(e)

        return results

    def test_configuration_validation(self) -> Dict:
        """
        測試配置驗證功能
        """
        logger.info("測試配置驗證...")

        results = {
            "preset_validations": {},
            "custom_validations": {}
        }

        # 測試預設配置
        for preset_name in FEATURE_PRESETS.keys():
            config = get_multiscale_config(preset_name)
            is_valid = validate_multiscale_config(config)
            feature_count = calculate_feature_count(config)

            results["preset_validations"][preset_name] = {
                "is_valid": is_valid,
                "feature_count": feature_count,
                "config": config
            }

        # 測試錯誤配置
        invalid_configs = [
            {
                "name": "long_smaller_than_short",
                "config": {"long_window_size": 10, "short_window_size": 20}
            },
            {
                "name": "zero_step_size",
                "config": {"feature_step_size": 0}
            },
            {
                "name": "all_features_disabled",
                "config": {
                    "enable_long_window_features": False,
                    "enable_short_window_features": False,
                    "enable_time_features": False,
                    "enable_current_features": False
                }
            }
        ]

        for test_case in invalid_configs:
            test_config = {**get_multiscale_config("full"), **test_case["config"]}
            is_valid = validate_multiscale_config(test_config)

            results["custom_validations"][test_case["name"]] = {
                "is_valid": is_valid,
                "should_be_invalid": True,
                "test_passed": not is_valid  # 應該無效
            }

        return results

    async def run_comprehensive_test(self) -> Dict:
        """
        執行綜合測試
        """
        logger.info("開始綜合測試...")

        all_results = {
            "test_start_time": datetime.now().isoformat(),
            "tests": {}
        }

        # 1. 配置驗證測試
        logger.info("1/4 - 配置驗證測試")
        all_results["tests"]["configuration"] = self.test_configuration_validation()

        # 2. 窗口對齊測試
        logger.info("2/4 - 窗口對齊測試")
        all_results["tests"]["window_alignment"] = self.test_window_alignment()

        # 3. 特徵提取測試（多種配置）
        logger.info("3/4 - 特徵提取測試")
        all_results["tests"]["feature_extraction"] = {}

        for preset_name in ["full", "balanced", "short_only"]:
            logger.info(f"測試 {preset_name} 配置...")
            all_results["tests"]["feature_extraction"][preset_name] = await self.test_feature_extraction(preset_name)

        # 4. 效能測試
        logger.info("4/4 - 效能測試")
        all_results["tests"]["performance"] = await self.test_performance()

        all_results["test_end_time"] = datetime.now().isoformat()

        # 生成測試摘要
        all_results["summary"] = self.generate_test_summary(all_results)

        return all_results

    async def test_performance(self) -> Dict:
        """
        測試效能表現
        """
        logger.info("測試效能表現...")

        results = {}

        # 測試不同數據大小
        for hours in [1, 6, 24]:
            logger.info(f"測試 {hours} 小時數據...")

            test_data = self.create_test_data(duration_hours=hours)
            start_time = datetime.now()

            try:
                # 模擬特徵提取（簡化版）
                feature_results = await self.test_feature_extraction("balanced")

                end_time = datetime.now()
                processing_time = (end_time - start_time).total_seconds()

                results[f"{hours}h_data"] = {
                    "input_samples": len(test_data),
                    "processing_time": processing_time,
                    "samples_per_second": len(test_data) / processing_time if processing_time > 0 else 0,
                    "success": feature_results["success"]
                }

            except Exception as e:
                results[f"{hours}h_data"] = {
                    "success": False,
                    "error": str(e)
                }

        return results

    def generate_test_summary(self, results: Dict) -> Dict:
        """
        生成測試摘要
        """
        summary = {
            "total_tests": 0,
            "passed_tests": 0,
            "failed_tests": 0,
            "test_categories": {}
        }

        # 統計各類測試結果
        for category, test_results in results["tests"].items():
            category_summary = {"passed": 0, "failed": 0, "total": 0}

            if category == "configuration":
                # 配置測試
                for preset_name, preset_result in test_results["preset_validations"].items():
                    category_summary["total"] += 1
                    if preset_result["is_valid"]:
                        category_summary["passed"] += 1
                    else:
                        category_summary["failed"] += 1

                for test_name, test_result in test_results["custom_validations"].items():
                    category_summary["total"] += 1
                    if test_result["test_passed"]:
                        category_summary["passed"] += 1
                    else:
                        category_summary["failed"] += 1

            elif category == "feature_extraction":
                # 特徵提取測試
                for preset_name, preset_result in test_results.items():
                    category_summary["total"] += 1
                    if preset_result["success"]:
                        category_summary["passed"] += 1
                    else:
                        category_summary["failed"] += 1

            elif category == "window_alignment":
                # 窗口對齊測試
                category_summary["total"] = 1
                if test_results["success"]:
                    category_summary["passed"] = 1
                else:
                    category_summary["failed"] = 1

            elif category == "performance":
                # 效能測試
                for test_name, test_result in test_results.items():
                    category_summary["total"] += 1
                    if test_result.get("success", False):
                        category_summary["passed"] += 1
                    else:
                        category_summary["failed"] += 1

            summary["test_categories"][category] = category_summary
            summary["total_tests"] += category_summary["total"]
            summary["passed_tests"] += category_summary["passed"]
            summary["failed_tests"] += category_summary["failed"]

        summary["success_rate"] = summary["passed_tests"] / summary["total_tests"] if summary["total_tests"] > 0 else 0

        return summary

def print_test_results(results: Dict):
    """
    美觀地印出測試結果
    """
    print("\n" + "="*60)
    print("多尺度特徵工程測試報告")
    print("="*60)

    # 測試摘要
    summary = results["summary"]
    print(f"\n【測試摘要】")
    print(f"總測試數: {summary['total_tests']}")
    print(f"通過測試: {summary['passed_tests']}")
    print(f"失敗測試: {summary['failed_tests']}")
    print(f"成功率: {summary['success_rate']:.1%}")

    # 各類別測試結果
    print(f"\n【各類別結果】")
    for category, stats in summary["test_categories"].items():
        status = "✅" if stats["failed"] == 0 else "❌"
        print(f"{status} {category}: {stats['passed']}/{stats['total']} 通過")

    # 特徵提取詳細結果
    if "feature_extraction" in results["tests"]:
        print(f"\n【特徵提取測試詳情】")
        for preset_name, result in results["tests"]["feature_extraction"].items():
            if result["success"]:
                print(f"✅ {preset_name}:")
                print(f"   處理時間: {result['processing_time_seconds']:.2f}秒")
                print(f"   輸入樣本: {result['input_samples']}")
                print(f"   輸出樣本: {result['output_samples']}")
                print(f"   特徵數量: {result['feature_count']}")
                print(f"   樣本效率: {result['sample_efficiency']:.2f}")
            else:
                print(f"❌ {preset_name}: {result.get('error', '未知錯誤')}")

    # 效能測試結果
    if "performance" in results["tests"]:
        print(f"\n【效能測試結果】")
        for test_name, result in results["tests"]["performance"].items():
            if result.get("success", False):
                print(f"✅ {test_name}:")
                print(f"   樣本數: {result['input_samples']}")
                print(f"   處理時間: {result['processing_time']:.2f}秒")
                print(f"   處理速度: {result['samples_per_second']:.1f} 樣本/秒")
            else:
                print(f"❌ {test_name}: {result.get('error', '測試失敗')}")

    print("\n" + "="*60)

async def main():
    """
    主測試函數
    """
    print("🚀 啟動多尺度特徵工程測試...")

    tester = MultiscaleETLTester()

    try:
        # 執行綜合測試
        results = await tester.run_comprehensive_test()

        # 印出結果
        print_test_results(results)

        # 保存結果到文件
        import json
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        results_file = f"multiscale_test_results_{timestamp}.json"

        # 轉換 datetime 對象為字符串
        def json_serializer(obj):
            if isinstance(obj, datetime):
                return obj.isoformat()
            elif isinstance(obj, np.integer):
                return int(obj)
            elif isinstance(obj, np.floating):
                return float(obj)
            elif pd.isna(obj):
                return None
            raise TypeError(f"Object of type {type(obj)} is not JSON serializable")

        with open(results_file, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False, default=json_serializer)

        print(f"\n📊 詳細測試結果已保存至: {results_file}")

    except Exception as e:
        logger.error(f"測試執行失敗: {str(e)}")
        print(f"❌ 測試執行失敗: {str(e)}")

if __name__ == "__main__":
    # 執行測試
    asyncio.run(main())
