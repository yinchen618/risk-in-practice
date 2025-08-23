"""
數據預處理 ETL 使用範例

這個腳本展示了如何使用 data_preprocessing_etl.py 來處理電錶數據。
包含單個房間處理和批量處理的範例。

執行前請確保：
1. 資料庫連接正常
2. 已執行 Prisma 遷移以創建新的資料表
3. 原始電錶數據已存在於 ammeter 表中
"""

import asyncio
import os
from datetime import datetime
from typing import List

from data_preprocessing_etl import DataPreprocessingETL, RoomInfo, OccupantType
from etl_config import PREDEFINED_ROOMS, TIME_RANGES, ETL_CONFIG

async def example_single_room_processing():
    """
    範例：處理單個房間的數據
    """
    print("=== 單個房間處理範例 ===")

    # 從環境變數或使用預設值獲取數據庫 URL
    database_url = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/pu_practice")

    # 創建 ETL 處理器
    etl = DataPreprocessingETL(database_url)

    try:
        # 連接數據庫
        await etl.connect_database()

        # 定義要處理的房間 (可以修改為您的實際房間資訊)
        room_info = RoomInfo(
            building="Building-A",
            floor="3F",
            room="Room-301",
            meter_id_l1="actual_meter_l1_id",  # 請替換為真實的電錶 ID
            meter_id_l2="actual_meter_l2_id",  # 請替換為真實的電錶 ID
            occupant_type=OccupantType.OFFICE_WORKER
        )

        # 定義處理時間範圍 (2025年8月)
        search_start = datetime(2025, 8, 1)
        search_end = datetime(2025, 8, 31)

        print(f"開始處理房間: {room_info.building}-{room_info.floor}-{room_info.room}")
        print(f"搜索範圍: {search_start} 到 {search_end}")

        # 執行 ETL 流程
        dataset_id = await etl.process_room_data(
            room_info=room_info,
            search_start=search_start,
            search_end=search_end,
            window_days=7
        )

        print(f"✅ 處理完成！創建的數據集 ID: {dataset_id}")

    except Exception as e:
        print(f"❌ 處理失敗: {e}")

    finally:
        await etl.close_database()

async def example_batch_processing():
    """
    範例：批量處理多個房間
    """
    print("\n=== 批量處理範例 ===")

    database_url = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/pu_practice")
    etl = DataPreprocessingETL(database_url)

    try:
        await etl.connect_database()

        # 使用預定義的房間列表 (前3個房間)
        rooms_to_process = PREDEFINED_ROOMS[:3]

        # 使用2025年8月的時間範圍
        time_range = TIME_RANGES["2025_08"]
        search_start = time_range["start"]
        search_end = time_range["end"]

        print(f"準備處理 {len(rooms_to_process)} 個房間")
        print(f"時間範圍: {search_start} 到 {search_end}")

        results = []

        for i, room_info in enumerate(rooms_to_process, 1):
            print(f"\n[{i}/{len(rooms_to_process)}] 處理房間: {room_info.room}")

            try:
                dataset_id = await etl.process_room_data(
                    room_info=room_info,
                    search_start=search_start,
                    search_end=search_end,
                    window_days=ETL_CONFIG["default_window_days"]
                )

                results.append({
                    "room": room_info.room,
                    "status": "success",
                    "dataset_id": dataset_id
                })

                print(f"  ✅ 成功，數據集 ID: {dataset_id}")

            except Exception as e:
                results.append({
                    "room": room_info.room,
                    "status": "failed",
                    "error": str(e)
                })

                print(f"  ❌ 失敗: {e}")

        # 顯示處理結果摘要
        print("\n=== 批量處理結果摘要 ===")
        success_count = sum(1 for r in results if r["status"] == "success")
        failed_count = len(results) - success_count

        print(f"總計: {len(results)} 個房間")
        print(f"成功: {success_count} 個")
        print(f"失敗: {failed_count} 個")

        if failed_count > 0:
            print("\n失敗房間詳情:")
            for result in results:
                if result["status"] == "failed":
                    print(f"  - {result['room']}: {result['error']}")

    except Exception as e:
        print(f"❌ 批量處理失敗: {e}")

    finally:
        await etl.close_database()

async def example_data_quality_check():
    """
    範例：檢查數據品質而不執行完整的 ETL
    """
    print("\n=== 數據品質檢查範例 ===")

    database_url = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/pu_practice")
    etl = DataPreprocessingETL(database_url)

    try:
        await etl.connect_database()

        # 選擇一個房間進行品質檢查
        room_info = PREDEFINED_ROOMS[0]  # 使用第一個預定義房間

        # 檢查最近30天的數據品質
        search_start = datetime(2025, 8, 1)
        search_end = datetime(2025, 8, 31)

        print(f"檢查房間: {room_info.room}")
        print(f"時間範圍: {search_start} 到 {search_end}")

        # 尋找最佳窗口（不執行後續步驟）
        try:
            best_start, best_end = await etl.find_golden_window(
                room_info, search_start, search_end, window_days=7
            )

            print(f"✅ 找到最佳數據窗口:")
            print(f"  開始時間: {best_start}")
            print(f"  結束時間: {best_end}")
            print(f"  窗口長度: {(best_end - best_start).days} 天")

            # 評估此窗口的詳細品質指標
            quality_metrics = await etl._evaluate_data_quality(
                room_info, best_start, best_end
            )

            print(f"  數據完整性: {quality_metrics.completeness_ratio:.2%}")
            print(f"  缺失時段: {quality_metrics.missing_periods}")

        except ValueError as e:
            print(f"❌ 找不到合適的數據窗口: {e}")

    except Exception as e:
        print(f"❌ 品質檢查失敗: {e}")

    finally:
        await etl.close_database()

def show_usage_instructions():
    """
    顯示使用說明
    """
    print("=== ETL 系統使用說明 ===")
    print()
    print("1. 執行前準備：")
    print("   - 確保資料庫連接正常")
    print("   - 設置環境變數 DATABASE_URL")
    print("   - 執行 Prisma 遷移創建新資料表")
    print("   - 確保原始電錶數據存在")
    print()
    print("2. 修改配置：")
    print("   - 編輯 etl_config.py 中的房間資訊")
    print("   - 調整 ETL_CONFIG 中的處理參數")
    print("   - 設置適當的時間範圍")
    print()
    print("3. 執行方式：")
    print("   基礎功能:")
    print("   - 單房間處理: python etl_examples.py --single")
    print("   - 批量處理: python etl_examples.py --batch")
    print("   - 品質檢查: python etl_examples.py --check")
    print()
    print("   多尺度特徵工程:")
    print("   - 多尺度範例: python etl_examples.py --multiscale")
    print("   - 配置比較: python etl_examples.py --compare")
    print("   - 場景範例: python etl_examples.py --scenarios")
    print()
    print("4. 注意事項：")
    print("   - 首次執行前請先進行品質檢查")
    print("   - 建議先處理少量房間測試")
    print("   - 留意日誌輸出以監控處理進度")

# ========== 多尺度特徵工程範例 ==========
async def etl_multiscale_features_example():
    """
    展示多尺度特徵工程的完整使用流程
    """
    from data_preprocessing_etl_multiscale import MultiscaleETL
    from multiscale_config import get_multiscale_config, get_feature_list, calculate_feature_count

    print("=== 多尺度特徵工程範例 ===")

    # 連接字符串
    connection_string = "postgresql://username:password@localhost:5432/your_database"

    # 測試不同的多尺度配置
    configurations = ["full", "balanced", "short_only", "long_only"]

    for config_name in configurations:
        print(f"\n--- 測試 {config_name.upper()} 配置 ---")

        # 獲取配置
        config = get_multiscale_config(config_name)
        feature_count = calculate_feature_count(config)
        feature_list = get_feature_list(config_name)

        print(f"配置摘要:")
        print(f"  長期窗口: {config['long_window_size']} 分鐘")
        print(f"  短期窗口: {config['short_window_size']} 分鐘")
        print(f"  特徵步長: {config['feature_step_size']} 分鐘")
        print(f"  預期特徵數: {feature_count['total_features']}")
        print(f"    - 長期特徵: {feature_count['long_window_features']}")
        print(f"    - 短期特徵: {feature_count['short_window_features']}")
        print(f"    - 時間特徵: {feature_count['time_features']}")
        print(f"    - 當前特徵: {feature_count['current_features']}")

        # 顯示前10個特徵名稱
        print(f"  特徵範例 (前10個):")
        for i, feature_name in enumerate(feature_list[:10], 1):
            print(f"    {i:2d}. {feature_name}")

        if len(feature_list) > 10:
            print(f"    ... 還有 {len(feature_list) - 10} 個特徵")

        # 創建ETL實例
        etl = MultiscaleETL(connection_string, config)

        # 房間資訊
        room_info = RoomInfo(
            room_name="A1",
            occupant_type=OccupantType.OFFICE,
            organization_id=1
        )

        # 時間範圍（示例）
        start_time = datetime(2024, 1, 15, 9, 0)  # 週一上午9點
        end_time = datetime(2024, 1, 15, 18, 0)   # 週一下午6點

        try:
            print(f"  執行多尺度特徵工程...")

            # 執行處理（僅展示，實際使用時取消註釋）
            # result = await etl.process_room_data(
            #     room_info=room_info,
            #     start_time=start_time,
            #     end_time=end_time,
            #     source_anomaly_event_id=1001
            # )
            #
            # print(f"  處理結果:")
            # print(f"    原始樣本數: {result['original_samples']}")
            # print(f"    對齊後樣本數: {result['aligned_samples']}")
            # print(f"    最終特徵樣本數: {result['feature_samples']}")
            # print(f"    處理時間: {result['processing_time']:.2f} 秒")

            print(f"  ✅ {config_name} 配置設定完成")

        except Exception as e:
            print(f"  ❌ 錯誤: {str(e)}")

        print()

async def etl_feature_analysis_example():
    """
    展示特徵分析和比較的範例
    """
    from multiscale_config import FEATURE_PRESETS, calculate_feature_count

    print("\n=== 多尺度特徵配置比較 ===")

    comparison_data = []

    for preset_name, preset_config in FEATURE_PRESETS.items():
        feature_count = calculate_feature_count(preset_config)

        comparison_data.append({
            "配置": preset_name,
            "長期窗口": f"{preset_config['long_window_size']}分",
            "短期窗口": f"{preset_config['short_window_size']}分",
            "步長": f"{preset_config['feature_step_size']}分",
            "長期特徵": feature_count['long_window_features'],
            "短期特徵": feature_count['short_window_features'],
            "時間特徵": feature_count['time_features'],
            "當前特徵": feature_count['current_features'],
            "總特徵": feature_count['total_features']
        })

    # 打印比較表格
    print(f"{'配置':<12} {'長期窗口':<8} {'短期窗口':<8} {'步長':<6} {'長期':<4} {'短期':<4} {'時間':<4} {'當前':<4} {'總計':<4}")
    print("-" * 80)

    for data in comparison_data:
        print(f"{data['配置']:<12} {data['長期窗口']:<8} {data['短期窗口']:<8} {data['步長']:<6} "
              f"{data['長期特徵']:<4} {data['短期特徵']:<4} {data['時間特徵']:<4} {data['當前特徵']:<4} {data['總特徵']:<4}")

    print("\n=== 特徵選擇建議 ===")
    print("🎯 FULL: 完整特徵集，適用於模型訓練和實驗")
    print("⚡ BALANCED: 平衡效能與精度，適用於生產環境")
    print("🔍 SHORT_ONLY: 專注短期模式，適用於即時異常檢測")
    print("📈 LONG_ONLY: 專注長期趨勢，適用於趨勢分析")
    print("🎯 HIGH_PRECISION: 高精度模式，適用於詳細分析")

async def etl_real_world_scenario_example():
    """
    展示真實世界場景的ETL使用範例
    """
    from multiscale_config import get_multiscale_config

    print("\n=== 真實世界場景範例 ===")

    # 場景1: 辦公室異常檢測
    print("📊 場景1: 辦公室用電異常檢測")
    print("  需求: 檢測辦公時間外的異常用電")
    print("  建議配置: BALANCED (平衡短期波動和長期趨勢)")
    print("  關鍵特徵: 時間特徵 + 60分鐘平均功率 + 15分鐘標準差")

    config = get_multiscale_config("balanced")
    print(f"  窗口設定: {config['long_window_size']}分鐘 / {config['short_window_size']}分鐘")

    # 場景2: 設備故障預警
    print("\n🔧 場景2: 設備故障預警")
    print("  需求: 捕捉設備功率異常波動")
    print("  建議配置: SHORT_ONLY (專注短期變化)")
    print("  關鍵特徵: 15分鐘功率變異數 + 最大最小值範圍")

    config = get_multiscale_config("short_only")
    print(f"  窗口設定: {config['short_window_size']}分鐘短期分析")

    # 場景3: 能耗趨勢分析
    print("\n📈 場景3: 長期能耗趨勢分析")
    print("  需求: 分析月度/季度用電模式")
    print("  建議配置: LONG_ONLY (專注長期趨勢)")
    print("  關鍵特徵: 60分鐘平均功率 + 時間特徵")

    config = get_multiscale_config("long_only")
    print(f"  窗口設定: {config['long_window_size']}分鐘長期分析")

    # 場景4: 高精度研究
    print("\n🎯 場景4: 高精度研究分析")
    print("  需求: 最詳細的特徵分析")
    print("  建議配置: HIGH_PRECISION (最大特徵集)")
    print("  關鍵特徵: 2小時長期 + 5分鐘短期 + 完整統計特徵")

    config = get_multiscale_config("high_precision")
    print(f"  窗口設定: {config['long_window_size']}分鐘 / {config['short_window_size']}分鐘")

async def main():
    """
    主函數：根據命令行參數執行不同的範例
    """
    import sys

    if len(sys.argv) < 2:
        show_usage_instructions()
        return

    command = sys.argv[1]

    if command == "--single":
        await example_single_room_processing()
    elif command == "--batch":
        await example_batch_processing()
    elif command == "--check":
        await example_data_quality_check()
    elif command == "--multiscale":
        await etl_multiscale_features_example()
    elif command == "--compare":
        await etl_feature_analysis_example()
    elif command == "--scenarios":
        await etl_real_world_scenario_example()
    elif command == "--help":
        show_usage_instructions()
    else:
        print(f"未知命令: {command}")
        print("使用 --help 查看使用說明")

if __name__ == "__main__":
    asyncio.run(main())
