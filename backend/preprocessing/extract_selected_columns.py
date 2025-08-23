#!/usr/bin/env python3
"""
提取指定欄位的設備數據腳本
從 backup_20250823_235656/processed_data/deviceNumber 提取指定欄位
輸出到 2025-07-21_2025-08-23 目錄
"""

import pandas as pd
import os
import logging
from pathlib import Path
import time

# 設置日誌
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('extract_columns.log'),
        logging.StreamHandler()
    ]
)

def extract_device_columns():
    """提取設備數據的指定欄位"""

    # 定義路徑
    source_dir = "/home/infowin/Git-projects/pu-in-practice/backend/preprocessing/backup_20250823_235656/processed_data/deviceNumber"
    target_dir = "/home/infowin/Git-projects/pu-in-practice/backend/preprocessing/2025-07-21_2025-08-23"

    # 指定要保留的欄位
    selected_columns = [
        'id', 'deviceNumber', 'voltage', 'currents', 'power',
        'lastUpdated', 'battery', 'switchState', 'networkState', 'createdAt'
    ]

    # 確保目標目錄存在
    os.makedirs(target_dir, exist_ok=True)

    # 獲取所有設備檔案
    source_path = Path(source_dir)
    device_files = list(source_path.glob("device_*.csv"))

    logging.info(f"開始處理 {len(device_files)} 個設備檔案")
    logging.info(f"來源目錄: {source_dir}")
    logging.info(f"目標目錄: {target_dir}")
    logging.info(f"選定欄位: {', '.join(selected_columns)}")

    start_time = time.time()
    processed_count = 0
    total_records = 0
    error_files = []

    for i, device_file in enumerate(device_files, 1):
        try:
            # 讀取設備檔案
            logging.info(f"處理檔案 {i}/{len(device_files)}: {device_file.name}")

            # 讀取 CSV 檔案
            df = pd.read_csv(device_file)
            original_count = len(df)

            # 檢查是否包含所需欄位
            missing_columns = [col for col in selected_columns if col not in df.columns]
            if missing_columns:
                logging.warning(f"  - 檔案 {device_file.name} 缺少欄位: {missing_columns}")
                # 為缺少的欄位填入 None
                for col in missing_columns:
                    df[col] = None

            # 選擇指定欄位
            df_selected = df[selected_columns].copy()

            # 按 createdAt 排序 (保持原有排序)
            if 'createdAt' in df_selected.columns:
                df_selected = df_selected.sort_values('createdAt')

            # 構建輸出檔案名稱 (保持原有命名格式)
            output_filename = device_file.name  # 保持 device_xxxxx.csv 格式
            output_path = os.path.join(target_dir, output_filename)

            # 保存檔案
            df_selected.to_csv(output_path, index=False)

            # 統計
            final_count = len(df_selected)
            total_records += final_count
            processed_count += 1

            logging.info(f"  - 處理了 {original_count} 筆記錄，輸出 {final_count} 筆記錄")
            logging.info(f"  - 檔案大小: {os.path.getsize(output_path) / 1024 / 1024:.2f} MB")

            # 每處理 10 個檔案顯示進度
            if i % 10 == 0:
                elapsed = time.time() - start_time
                avg_time = elapsed / i
                estimated_total = avg_time * len(device_files)
                remaining = estimated_total - elapsed
                logging.info(f"  進度: {i}/{len(device_files)} ({i/len(device_files)*100:.1f}%), "
                           f"預計剩餘時間: {remaining/60:.1f} 分鐘")

        except Exception as e:
            error_files.append((device_file.name, str(e)))
            logging.error(f"  - 處理檔案 {device_file.name} 時發生錯誤: {e}")
            continue

    # 處理完成報告
    end_time = time.time()
    total_time = end_time - start_time

    logging.info("=" * 60)
    logging.info("處理完成！")
    logging.info(f"總處理時間: {total_time:.2f} 秒 ({total_time/60:.1f} 分鐘)")
    logging.info(f"成功處理: {processed_count} 個檔案")
    logging.info(f"總記錄數: {total_records:,} 筆")
    logging.info(f"錯誤檔案: {len(error_files)} 個")

    if error_files:
        logging.warning("錯誤檔案列表:")
        for filename, error in error_files:
            logging.warning(f"  - {filename}: {error}")

    # 檢查輸出目錄統計
    target_path = Path(target_dir)
    output_files = list(target_path.glob("device_*.csv"))
    total_size = sum(f.stat().st_size for f in output_files)

    logging.info(f"輸出目錄統計:")
    logging.info(f"  - 檔案數量: {len(output_files)}")
    logging.info(f"  - 總大小: {total_size / 1024 / 1024:.2f} MB")
    logging.info(f"  - 平均檔案大小: {total_size / len(output_files) / 1024 / 1024:.2f} MB")

    # 驗證欄位
    if output_files:
        sample_file = output_files[0]
        sample_df = pd.read_csv(sample_file)
        logging.info(f"輸出檔案欄位驗證 (使用 {sample_file.name}):")
        logging.info(f"  - 欄位: {list(sample_df.columns)}")
        logging.info(f"  - 記錄數: {len(sample_df)}")
        if 'createdAt' in sample_df.columns:
            logging.info(f"  - 時間範圍: {sample_df['createdAt'].min()} 至 {sample_df['createdAt'].max()}")

if __name__ == "__main__":
    try:
        extract_device_columns()
    except KeyboardInterrupt:
        logging.info("處理被使用者中斷")
    except Exception as e:
        logging.error(f"處理過程中發生錯誤: {e}")
        raise
