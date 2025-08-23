#!/usr/bin/env python3
"""
數據損失分析詳細報告
重點分析從 chunk 到 deviceNumber 階段損失的 545,638 筆記錄
"""

import pandas as pd
import os
import logging
from pathlib import Path
from collections import defaultdict

# 設置日誌
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

def detailed_loss_analysis():
    """詳細分析數據損失的原因"""

    chunk_dir = "/home/infowin/Git-projects/pu-in-practice/backend/preprocessing/backup_20250823_235656/processed_data/chunk"
    device_dir = "/home/infowin/Git-projects/pu-in-practice/backend/preprocessing/backup_20250823_235656/processed_data/deviceNumber"

    logging.info("=" * 80)
    logging.info("數據損失詳細分析報告")
    logging.info("=" * 80)

    # 1. 分析標題行影響
    logging.info("1️⃣ 分析標題行對總記錄數的影響")
    analyze_header_impact(chunk_dir, device_dir)

    # 2. 分析重複記錄移除的影響
    logging.info("2️⃣ 分析重複記錄移除的影響")
    analyze_duplicate_removal(chunk_dir, device_dir)

    # 3. 分析設備過濾的影響
    logging.info("3️⃣ 分析設備過濾的影響")
    analyze_device_filtering(chunk_dir, device_dir)

    # 4. 驗證數據損失來源
    logging.info("4️⃣ 驗證數據損失來源")
    verify_loss_sources()

def analyze_header_impact(chunk_dir, device_dir):
    """分析標題行對總記錄數的影響"""

    # 計算 chunk 檔案數量和設備檔案數量
    chunk_path = Path(chunk_dir)
    chunk_files = list(chunk_path.glob("*.csv"))
    chunk_count = len(chunk_files)

    device_path = Path(device_dir)
    device_files = list(device_path.glob("device_*.csv"))
    device_count = len(device_files)

    # 標題行差異
    header_difference = chunk_count - device_count

    logging.info(f"  Chunk 檔案數量: {chunk_count}")
    logging.info(f"  Device 檔案數量: {device_count}")
    logging.info(f"  標題行淨減少: {header_difference}")
    logging.info(f"  標題行影響: 減少 {abs(header_difference)} 行")

def analyze_duplicate_removal(chunk_dir, device_dir):
    """分析重複記錄移除的影響"""

    logging.info("  檢查前幾個 chunk 檔案的重複記錄情況...")

    chunk_path = Path(chunk_dir)
    chunk_files = sorted(list(chunk_path.glob("*.csv")))

    total_chunk_records = 0
    total_unique_records = 0

    # 只檢查前5個檔案以節省時間
    for i, chunk_file in enumerate(chunk_files[:5]):
        df = pd.read_csv(chunk_file)
        chunk_records = len(df)
        unique_records = df['id'].nunique() if 'id' in df.columns else chunk_records

        total_chunk_records += chunk_records
        total_unique_records += unique_records

        duplicates = chunk_records - unique_records
        if duplicates > 0:
            logging.info(f"    {chunk_file.name}: {duplicates} 筆重複記錄")

        if i == 0:  # 詳細分析第一個檔案
            logging.info(f"    詳細分析 {chunk_file.name}:")
            logging.info(f"      總記錄: {chunk_records}")
            logging.info(f"      唯一ID: {unique_records}")
            logging.info(f"      重複記錄: {duplicates}")

    estimated_duplicates = (total_chunk_records - total_unique_records) * (26 / 5)
    logging.info(f"  前5個檔案統計:")
    logging.info(f"    總記錄數: {total_chunk_records}")
    logging.info(f"    唯一記錄數: {total_unique_records}")
    logging.info(f"    重複記錄數: {total_chunk_records - total_unique_records}")
    logging.info(f"  估計全部26個檔案的重複記錄: {estimated_duplicates:.0f}")

def analyze_device_filtering(chunk_dir, device_dir):
    """分析設備過濾的影響"""

    logging.info("  分析設備過濾對記錄數的影響...")

    # 從 chunk 中統計所有設備的記錄數
    chunk_path = Path(chunk_dir)
    chunk_files = sorted(list(chunk_path.glob("*.csv")))

    chunk_device_records = defaultdict(int)
    total_chunk_records = 0

    # 統計所有 chunk 中的設備記錄
    for i, chunk_file in enumerate(chunk_files):
        df = pd.read_csv(chunk_file)
        total_chunk_records += len(df)

        if 'deviceNumber' in df.columns:
            device_counts = df['deviceNumber'].value_counts()
            for device, count in device_counts.items():
                chunk_device_records[device] += count

        if (i + 1) % 5 == 0:
            logging.info(f"    已處理 {i + 1}/{len(chunk_files)} 個 chunk 檔案")

    # 從 device 目錄統計記錄數
    device_path = Path(device_dir)
    device_files = list(device_path.glob("device_*.csv"))

    device_records = {}
    total_device_records = 0

    for device_file in device_files:
        device_name = device_file.stem.replace('device_', '')
        df = pd.read_csv(device_file)
        record_count = len(df)
        device_records[device_name] = record_count
        total_device_records += record_count

    # 比較分析
    chunk_devices = set(chunk_device_records.keys())
    device_devices = set(device_records.keys())

    missing_devices = chunk_devices - device_devices
    extra_devices = device_devices - chunk_devices
    common_devices = chunk_devices & device_devices

    logging.info(f"  設備統計:")
    logging.info(f"    Chunk 中的設備數: {len(chunk_devices)}")
    logging.info(f"    Device 目錄中的設備數: {len(device_devices)}")
    logging.info(f"    共同設備數: {len(common_devices)}")
    logging.info(f"    遺失設備數: {len(missing_devices)}")
    logging.info(f"    新增設備數: {len(extra_devices)}")

    # 計算遺失的記錄數
    missing_records = 0
    if missing_devices:
        logging.info(f"  遺失的設備及其記錄數:")
        for device in sorted(missing_devices):
            records = chunk_device_records[device]
            missing_records += records
            logging.info(f"    {device}: {records} 筆記錄")

    # 計算新增的記錄數
    extra_records = 0
    if extra_devices:
        logging.info(f"  新增的設備及其記錄數:")
        for device in sorted(extra_devices):
            records = device_records[device]
            extra_records += records
            logging.info(f"    {device}: {records} 筆記錄")

    # 計算共同設備的記錄差異
    common_difference = 0
    significant_differences = []

    for device in common_devices:
        chunk_count = chunk_device_records[device]
        device_count = device_records[device]
        diff = chunk_count - device_count
        common_difference += diff

        if abs(diff) > 100:  # 只報告顯著差異
            significant_differences.append((device, chunk_count, device_count, diff))

    if significant_differences:
        logging.info(f"  共同設備中的顯著記錄數差異:")
        for device, chunk_count, device_count, diff in significant_differences[:10]:
            logging.info(f"    {device}: {chunk_count} -> {device_count} (差異: {diff})")

    logging.info(f"  記錄數變化總結:")
    logging.info(f"    Chunk 總記錄數: {total_chunk_records}")
    logging.info(f"    Device 總記錄數: {total_device_records}")
    logging.info(f"    總差異: {total_chunk_records - total_device_records}")
    logging.info(f"    遺失設備的記錄: {missing_records}")
    logging.info(f"    新增設備的記錄: {extra_records}")
    logging.info(f"    共同設備記錄差異: {common_difference}")

def verify_loss_sources():
    """驗證數據損失的來源"""

    logging.info("  數據損失來源驗證:")

    # 根據之前的分析結果
    chunk_total = 2545638
    device_total = 2000000
    total_loss = chunk_total - device_total

    # 預估各種損失來源
    header_loss = 26 - 182  # 標題行減少 (實際上是負數，表示增加)
    estimated_duplicate_loss = 0  # 基於前面的分析，重複記錄很少

    # 主要損失應該來自設備過濾和數據清理
    device_filtering_loss = total_loss - estimated_duplicate_loss + header_loss

    logging.info(f"    總損失: {total_loss:,} 筆記錄")
    logging.info(f"    標題行變化: {header_loss} 行 (從26個檔案合併到182個設備檔案)")
    logging.info(f"    估計重複記錄移除: {estimated_duplicate_loss:,} 筆")
    logging.info(f"    設備過濾和數據清理: {device_filtering_loss:,} 筆")

    logging.info("\n  可能的損失原因:")
    logging.info("    1. 數據重組過程中的去重處理")
    logging.info("    2. 某些設備數據的過濾")
    logging.info("    3. 數據清理過程中移除的無效記錄")
    logging.info("    4. 時間範圍過濾")

    # 計算損失比例
    loss_percentage = (total_loss / chunk_total) * 100
    logging.info(f"\n  總損失比例: {loss_percentage:.2f}%")

    if loss_percentage > 20:
        logging.warning("  ⚠️  損失比例超過20%，建議檢查數據處理邏輯")
    else:
        logging.info("  ✅ 損失比例在合理範圍內")

if __name__ == "__main__":
    try:
        detailed_loss_analysis()
    except Exception as e:
        logging.error(f"分析過程中發生錯誤: {e}")
        raise
