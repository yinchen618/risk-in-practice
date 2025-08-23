#!/usr/bin/env python3
"""
數據流比對分析腳本
比對從 chunk -> deviceNumber -> 最終目錄 的數據變化
分析數據丟失的原因和位置
"""

import pandas as pd
import os
import logging
from pathlib import Path
import time
from collections import defaultdict

# 設置日誌
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('data_comparison.log'),
        logging.StreamHandler()
    ]
)

def analyze_data_flow():
    """分析數據從 chunk 到最終目錄的流程變化"""

    # 定義路徑
    chunk_dir = "/home/infowin/Git-projects/pu-in-practice/backend/preprocessing/backup_20250823_235656/processed_data/chunk"
    device_dir = "/home/infowin/Git-projects/pu-in-practice/backend/preprocessing/backup_20250823_235656/processed_data/deviceNumber"
    final_dir = "/home/infowin/Git-projects/pu-in-practice/backend/preprocessing/backup_2025-07-21_2025-08-23"

    logging.info("=" * 80)
    logging.info("開始數據流比對分析")
    logging.info("=" * 80)

    # 階段 1: 分析 chunk 檔案
    logging.info("📊 階段 1: 分析 chunk 檔案")
    chunk_stats = analyze_chunk_files(chunk_dir)

    # 階段 2: 分析 deviceNumber 檔案
    logging.info("📊 階段 2: 分析 deviceNumber 檔案")
    device_stats = analyze_device_files(device_dir)

    # 階段 3: 分析最終檔案
    logging.info("📊 階段 3: 分析最終檔案")
    final_stats = analyze_final_files(final_dir)

    # 階段 4: 比對分析
    logging.info("📊 階段 4: 數據流比對分析")
    compare_data_flow(chunk_stats, device_stats, final_stats)

    # 階段 5: 深度分析 - 檢查具體數據差異
    logging.info("📊 階段 5: 深度分析 - 檢查數據差異原因")
    deep_analysis(chunk_dir, device_dir, final_dir)

def analyze_chunk_files(chunk_dir):
    """分析 chunk 檔案"""
    chunk_path = Path(chunk_dir)
    chunk_files = sorted(list(chunk_path.glob("*.csv")))

    total_records = 0
    device_records = defaultdict(int)
    duplicate_count = 0

    logging.info(f"發現 {len(chunk_files)} 個 chunk 檔案")

    for i, chunk_file in enumerate(chunk_files):
        try:
            df = pd.read_csv(chunk_file)
            records = len(df)
            total_records += records

            # 統計每個設備的記錄數
            if 'deviceNumber' in df.columns:
                device_counts = df['deviceNumber'].value_counts()
                for device, count in device_counts.items():
                    device_records[device] += count

            # 檢查重複記錄 (如果有 id 欄位)
            if 'id' in df.columns:
                duplicates = df.duplicated(subset=['id']).sum()
                duplicate_count += duplicates
                if duplicates > 0:
                    logging.warning(f"  {chunk_file.name}: 發現 {duplicates} 筆重複 ID")

            if (i + 1) % 5 == 0:
                logging.info(f"  已處理 {i + 1}/{len(chunk_files)} 個檔案，累計 {total_records:,} 筆記錄")

        except Exception as e:
            logging.error(f"處理 {chunk_file.name} 時發生錯誤: {e}")

    chunk_stats = {
        'total_records': total_records,
        'device_count': len(device_records),
        'device_records': dict(device_records),
        'duplicate_count': duplicate_count,
        'files_count': len(chunk_files)
    }

    logging.info(f"Chunk 階段統計:")
    logging.info(f"  - 總記錄數: {total_records:,}")
    logging.info(f"  - 設備數量: {len(device_records)}")
    logging.info(f"  - 重複記錄: {duplicate_count:,}")
    logging.info(f"  - 檔案數量: {len(chunk_files)}")

    return chunk_stats

def analyze_device_files(device_dir):
    """分析 deviceNumber 檔案"""
    device_path = Path(device_dir)
    device_files = sorted(list(device_path.glob("device_*.csv")))

    total_records = 0
    device_records = {}
    duplicate_count = 0

    logging.info(f"發現 {len(device_files)} 個設備檔案")

    for i, device_file in enumerate(device_files):
        try:
            df = pd.read_csv(device_file)
            records = len(df)
            total_records += records

            # 從檔名提取設備號
            device_name = device_file.stem.replace('device_', '')
            device_records[device_name] = records

            # 檢查重複記錄
            if 'id' in df.columns:
                duplicates = df.duplicated(subset=['id']).sum()
                duplicate_count += duplicates
                if duplicates > 0:
                    logging.warning(f"  {device_file.name}: 發現 {duplicates} 筆重複 ID")

            if (i + 1) % 20 == 0:
                logging.info(f"  已處理 {i + 1}/{len(device_files)} 個檔案，累計 {total_records:,} 筆記錄")

        except Exception as e:
            logging.error(f"處理 {device_file.name} 時發生錯誤: {e}")

    device_stats = {
        'total_records': total_records,
        'device_count': len(device_records),
        'device_records': device_records,
        'duplicate_count': duplicate_count,
        'files_count': len(device_files)
    }

    logging.info(f"DeviceNumber 階段統計:")
    logging.info(f"  - 總記錄數: {total_records:,}")
    logging.info(f"  - 設備數量: {len(device_records)}")
    logging.info(f"  - 重複記錄: {duplicate_count:,}")
    logging.info(f"  - 檔案數量: {len(device_files)}")

    return device_stats

def analyze_final_files(final_dir):
    """分析最終檔案"""
    final_path = Path(final_dir)
    if not final_path.exists():
        logging.error(f"最終目錄不存在: {final_dir}")
        return {}

    final_files = sorted(list(final_path.glob("device_*.csv")))

    total_records = 0
    device_records = {}

    logging.info(f"發現 {len(final_files)} 個最終檔案")

    for i, final_file in enumerate(final_files):
        try:
            df = pd.read_csv(final_file)
            records = len(df)
            total_records += records

            # 從檔名提取設備號
            device_name = final_file.stem.replace('device_', '')
            device_records[device_name] = records

            if (i + 1) % 20 == 0:
                logging.info(f"  已處理 {i + 1}/{len(final_files)} 個檔案，累計 {total_records:,} 筆記錄")

        except Exception as e:
            logging.error(f"處理 {final_file.name} 時發生錯誤: {e}")

    final_stats = {
        'total_records': total_records,
        'device_count': len(device_records),
        'device_records': device_records,
        'files_count': len(final_files)
    }

    logging.info(f"最終階段統計:")
    logging.info(f"  - 總記錄數: {total_records:,}")
    logging.info(f"  - 設備數量: {len(device_records)}")
    logging.info(f"  - 檔案數量: {len(final_files)}")

    return final_stats

def compare_data_flow(chunk_stats, device_stats, final_stats):
    """比對數據流的變化"""
    logging.info("=" * 80)
    logging.info("🔍 數據流比對結果")
    logging.info("=" * 80)

    # 總記錄數比較
    chunk_total = chunk_stats.get('total_records', 0)
    device_total = device_stats.get('total_records', 0)
    final_total = final_stats.get('total_records', 0)

    logging.info(f"📈 總記錄數變化:")
    logging.info(f"  Chunk 階段:        {chunk_total:,} 筆")
    logging.info(f"  DeviceNumber 階段: {device_total:,} 筆")
    logging.info(f"  最終階段:          {final_total:,} 筆")

    # 計算損失
    chunk_to_device_loss = chunk_total - device_total
    device_to_final_loss = device_total - final_total
    total_loss = chunk_total - final_total

    logging.info(f"📉 數據損失分析:")
    logging.info(f"  Chunk -> DeviceNumber: {chunk_to_device_loss:,} 筆 ({chunk_to_device_loss/chunk_total*100:.2f}%)")
    logging.info(f"  DeviceNumber -> 最終:  {device_to_final_loss:,} 筆 ({device_to_final_loss/device_total*100:.2f}%)")
    logging.info(f"  總損失:              {total_loss:,} 筆 ({total_loss/chunk_total*100:.2f}%)")

    # 設備數量比較
    chunk_devices = chunk_stats.get('device_count', 0)
    device_devices = device_stats.get('device_count', 0)
    final_devices = final_stats.get('device_count', 0)

    logging.info(f"📱 設備數量變化:")
    logging.info(f"  Chunk 階段:        {chunk_devices} 個設備")
    logging.info(f"  DeviceNumber 階段: {device_devices} 個設備")
    logging.info(f"  最終階段:          {final_devices} 個設備")

    # 檔案數量比較
    chunk_files = chunk_stats.get('files_count', 0)
    device_files = device_stats.get('files_count', 0)
    final_files = final_stats.get('files_count', 0)

    logging.info(f"📁 檔案數量變化:")
    logging.info(f"  Chunk 階段:        {chunk_files} 個檔案")
    logging.info(f"  DeviceNumber 階段: {device_files} 個檔案")
    logging.info(f"  最終階段:          {final_files} 個檔案")

def deep_analysis(chunk_dir, device_dir, final_dir):
    """深度分析數據差異的具體原因"""
    logging.info("=" * 80)
    logging.info("🔬 深度分析 - 數據差異原因")
    logging.info("=" * 80)

    # 1. 檢查重複記錄影響
    logging.info("1️⃣ 分析重複記錄的影響")
    analyze_duplicates(chunk_dir, device_dir)

    # 2. 檢查標題行影響
    logging.info("2️⃣ 分析標題行的影響")
    analyze_headers(chunk_dir, device_dir, final_dir)

    # 3. 檢查設備分布差異
    logging.info("3️⃣ 分析設備分布差異")
    analyze_device_distribution(chunk_dir, device_dir)

    # 4. 檢查數據完整性
    logging.info("4️⃣ 檢查數據完整性")
    analyze_data_integrity(device_dir, final_dir)

def analyze_duplicates(chunk_dir, device_dir):
    """分析重複記錄的影響"""
    try:
        # 檢查第一個 chunk 檔案的重複情況
        chunk_path = Path(chunk_dir)
        chunk_files = sorted(list(chunk_path.glob("*.csv")))

        if chunk_files:
            sample_chunk = chunk_files[0]
            df_chunk = pd.read_csv(sample_chunk)

            if 'id' in df_chunk.columns:
                total_chunk = len(df_chunk)
                unique_chunk = df_chunk['id'].nunique()
                duplicates_chunk = total_chunk - unique_chunk

                logging.info(f"  範例 chunk 檔案 ({sample_chunk.name}):")
                logging.info(f"    總記錄數: {total_chunk}")
                logging.info(f"    唯一 ID: {unique_chunk}")
                logging.info(f"    重複記錄: {duplicates_chunk}")

        # 檢查對應的設備檔案
        device_path = Path(device_dir)
        device_files = list(device_path.glob("device_*.csv"))

        if device_files:
            sample_device = device_files[0]
            df_device = pd.read_csv(sample_device)

            if 'id' in df_device.columns:
                total_device = len(df_device)
                unique_device = df_device['id'].nunique()
                duplicates_device = total_device - unique_device

                logging.info(f"  範例設備檔案 ({sample_device.name}):")
                logging.info(f"    總記錄數: {total_device}")
                logging.info(f"    唯一 ID: {unique_device}")
                logging.info(f"    重複記錄: {duplicates_device}")

    except Exception as e:
        logging.error(f"分析重複記錄時發生錯誤: {e}")

def analyze_headers(chunk_dir, device_dir, final_dir):
    """分析標題行的影響"""
    try:
        # 計算各階段的標題行數量
        chunk_path = Path(chunk_dir)
        chunk_files = list(chunk_path.glob("*.csv"))
        chunk_headers = len(chunk_files)  # 每個檔案一個標題行

        device_path = Path(device_dir)
        device_files = list(device_path.glob("device_*.csv"))
        device_headers = len(device_files)

        final_path = Path(final_dir)
        final_files = list(final_path.glob("device_*.csv")) if final_path.exists() else []
        final_headers = len(final_files)

        logging.info(f"  標題行數量影響:")
        logging.info(f"    Chunk 檔案標題行: {chunk_headers}")
        logging.info(f"    DeviceNumber 檔案標題行: {device_headers}")
        logging.info(f"    最終檔案標題行: {final_headers}")
        logging.info(f"    標題行差異: {chunk_headers - device_headers}")

    except Exception as e:
        logging.error(f"分析標題行時發生錯誤: {e}")

def analyze_device_distribution(chunk_dir, device_dir):
    """分析設備分布差異"""
    try:
        # 從 chunk 中統計設備分布
        chunk_path = Path(chunk_dir)
        chunk_files = sorted(list(chunk_path.glob("*.csv")))

        chunk_devices = set()
        chunk_device_records = defaultdict(int)

        # 只檢查前幾個 chunk 檔案以節省時間
        for chunk_file in chunk_files[:3]:
            df = pd.read_csv(chunk_file)
            if 'deviceNumber' in df.columns:
                devices = df['deviceNumber'].unique()
                chunk_devices.update(devices)

                device_counts = df['deviceNumber'].value_counts()
                for device, count in device_counts.items():
                    chunk_device_records[device] += count

        # 從 deviceNumber 目錄統計設備分布
        device_path = Path(device_dir)
        device_files = list(device_path.glob("device_*.csv"))
        device_devices = set()

        for device_file in device_files:
            device_name = device_file.stem.replace('device_', '')
            device_devices.add(device_name)

        logging.info(f"  設備分布分析:")
        logging.info(f"    Chunk 中發現的設備 (前3檔): {len(chunk_devices)}")
        logging.info(f"    DeviceNumber 目錄中的設備: {len(device_devices)}")

        # 檢查是否有設備遺失
        missing_devices = chunk_devices - device_devices
        extra_devices = device_devices - chunk_devices

        if missing_devices:
            logging.warning(f"    遺失的設備: {len(missing_devices)}")
            for device in list(missing_devices)[:5]:  # 只顯示前5個
                logging.warning(f"      - {device}")

        if extra_devices:
            logging.info(f"    額外的設備: {len(extra_devices)}")
            for device in list(extra_devices)[:5]:  # 只顯示前5個
                logging.info(f"      - {device}")

    except Exception as e:
        logging.error(f"分析設備分布時發生錯誤: {e}")

def analyze_data_integrity(device_dir, final_dir):
    """檢查數據完整性"""
    try:
        final_path = Path(final_dir)
        if not final_path.exists():
            logging.warning(f"  最終目錄不存在，跳過完整性檢查")
            return

        # 比較相同設備檔案的記錄數
        device_path = Path(device_dir)
        device_files = list(device_path.glob("device_*.csv"))
        final_files = list(final_path.glob("device_*.csv"))

        device_dict = {f.stem: f for f in device_files}
        final_dict = {f.stem: f for f in final_files}

        mismatches = 0
        total_device_records = 0
        total_final_records = 0

        for device_name in device_dict.keys():
            if device_name in final_dict:
                device_records = len(pd.read_csv(device_dict[device_name]))
                final_records = len(pd.read_csv(final_dict[device_name]))

                total_device_records += device_records
                total_final_records += final_records

                if device_records != final_records:
                    mismatches += 1
                    logging.warning(f"    {device_name}: {device_records} -> {final_records} ({device_records - final_records})")

        logging.info(f"  數據完整性檢查:")
        logging.info(f"    記錄數不匹配的檔案: {mismatches}")
        logging.info(f"    DeviceNumber 總記錄: {total_device_records}")
        logging.info(f"    最終總記錄: {total_final_records}")
        logging.info(f"    差異: {total_device_records - total_final_records}")

    except Exception as e:
        logging.error(f"檢查數據完整性時發生錯誤: {e}")

if __name__ == "__main__":
    try:
        start_time = time.time()
        analyze_data_flow()
        end_time = time.time()
        logging.info(f"分析完成，總耗時: {end_time - start_time:.2f} 秒")
    except KeyboardInterrupt:
        logging.info("分析被使用者中斷")
    except Exception as e:
        logging.error(f"分析過程中發生錯誤: {e}")
        raise
