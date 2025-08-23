"""
PU Learning 數據預處理 ETL 腳本 - 設備檔案版本

這個腳本直接從設備 CSV 檔案執行 ETL 流程，
從 backup_2025-07-21_2025-08-23 資料夾中的設備檔案生成可用於模型訓練的數據集。

主要功能：
1. 掃描設備 CSV 檔案 (每個檔案代表一個設備)
2. 執行數據清理和時間戳對齊
3. 多尺度特徵工程 (15分鐘 + 60分鐘窗口)
4. 生成用於資料庫匯入的檔案
5. 支援批次處理和進度追蹤

作者: Auto-Generated
日期: 2025-08-24
"""

import os
import sys
import pandas as pd
import numpy as np
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
from pathlib import Path
import json
import glob
from tqdm import tqdm

# 設定日誌
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/home/infowin/Git-projects/pu-in-practice/backend/preprocessing/device_etl.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class DeviceETLProcessor:
    """設備數據 ETL 處理器"""

    def __init__(self,
                 input_dir: str = "/home/infowin/Git-projects/pu-in-practice/backend/preprocessing/backup_2025-07-21_2025-08-23",
                 output_dir: str = "/home/infowin/Git-projects/pu-in-practice/backend/preprocessing/processed_for_db"):
        """
        初始化 ETL 處理器

        Args:
            input_dir: 輸入設備 CSV 檔案目錄
            output_dir: 輸出處理後數據目錄
        """
        self.input_dir = Path(input_dir)
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)

        # 處理統計
        self.stats = {
            'total_devices': 0,
            'processed_devices': 0,
            'failed_devices': [],
            'total_records_input': 0,
            'total_records_output': 0,
            'processing_time': 0
        }

        # ETL 配置
        self.config = {
            'resample_frequency': '1T',  # 1分鐘重採樣
            'ffill_limit': 3,           # 前向填充限制
            'min_completeness_ratio': 0.1,  # 最小完整性比例
            'long_window_size': 60,     # 長窗口大小 (分鐘)
            'short_window_size': 15,    # 短窗口大小 (分鐘)
            'anomaly_threshold': 3,     # 異常值標準差倍數
        }

        logger.info(f"ETL 處理器初始化完成")
        logger.info(f"輸入目錄: {self.input_dir}")
        logger.info(f"輸出目錄: {self.output_dir}")

    def scan_device_files(self) -> List[Path]:
        """掃描設備 CSV 檔案"""
        pattern = str(self.input_dir / "device_*.csv")
        device_files = [Path(f) for f in glob.glob(pattern)]

        logger.info(f"發現 {len(device_files)} 個設備檔案")
        self.stats['total_devices'] = len(device_files)

        return sorted(device_files)

    def extract_device_number(self, file_path) -> str:
        """從檔案路徑提取設備編號"""
        if isinstance(file_path, str):
            file_path = Path(file_path)
        filename = file_path.stem  # device_402A8FB00A1D
        return filename.replace("device_", "")

    def load_device_data(self, file_path) -> Optional[pd.DataFrame]:
        """載入單一設備數據"""
        if isinstance(file_path, str):
            file_path = Path(file_path)

        try:
            df = pd.read_csv(file_path)

            # 檢查必要欄位
            required_columns = ['id', 'deviceNumber', 'voltage', 'currents', 'power',
                              'lastUpdated', 'battery', 'switchState', 'networkState', 'createdAt']

            missing_columns = [col for col in required_columns if col not in df.columns]
            if missing_columns:
                logger.warning(f"檔案 {file_path.name} 缺少欄位: {missing_columns}")
                return None

            # 轉換時間戳 - 使用混合格式解析
            df['timestamp'] = pd.to_datetime(df['lastUpdated'], format='mixed')
            df['created_timestamp'] = pd.to_datetime(df['createdAt'], format='mixed')

            # 排序並去重
            df = df.sort_values('timestamp').drop_duplicates(subset=['id'])

            logger.debug(f"載入設備 {file_path.name}: {len(df)} 筆記錄")
            return df

        except Exception as e:
            logger.error(f"載入檔案 {file_path.name} 失敗: {e}")
            return None

    def clean_data(self, df: pd.DataFrame, device_number: str) -> pd.DataFrame:
        """數據清理"""
        initial_count = len(df)

        # 移除異常值
        numeric_columns = ['voltage', 'currents', 'power', 'battery']
        for col in numeric_columns:
            if col in df.columns:
                mean_val = df[col].mean()
                std_val = df[col].std()
                threshold = self.config['anomaly_threshold']

                # 移除超過3個標準差的異常值
                df = df[
                    (df[col] >= mean_val - threshold * std_val) &
                    (df[col] <= mean_val + threshold * std_val)
                ]

        # 移除明顯錯誤的數據
        df = df[
            (df['voltage'] > 0) &
            (df['voltage'] < 1000) &  # 假設電壓不會超過1000V
            (df['currents'] >= 0) &
            (df['power'] >= 0) &
            (df['battery'] >= 0) &
            (df['battery'] <= 100)
        ]

        cleaned_count = len(df)
        logger.debug(f"設備 {device_number} 清理: {initial_count} -> {cleaned_count} 筆記錄")

        return df

    def resample_data(self, df: pd.DataFrame, device_number: str) -> pd.DataFrame:
        """時間重採樣"""
        if len(df) == 0:
            return df

        # 設定時間戳為索引
        df_resampled = df.set_index('timestamp')

        # 按分鐘重採樣
        numeric_columns = ['voltage', 'currents', 'power', 'battery']
        categorical_columns = ['switchState', 'networkState']

        agg_dict = {}

        # 數值欄位取平均
        for col in numeric_columns:
            if col in df_resampled.columns:
                agg_dict[col] = 'mean'

        # 分類欄位取平均（因為都是數值）
        for col in categorical_columns:
            if col in df_resampled.columns:
                agg_dict[col] = 'mean'

        # 其他欄位取第一個值
        for col in ['id', 'deviceNumber', 'createdAt']:
            if col in df_resampled.columns:
                agg_dict[col] = 'first'

        # 執行重採樣
        resampled = df_resampled.resample(self.config['resample_frequency']).agg(agg_dict)

        # 前向填充缺失值
        resampled = resampled.ffill(limit=self.config['ffill_limit'])

        # 重設索引
        resampled = resampled.reset_index()

        logger.debug(f"設備 {device_number} 重採樣: {len(df)} -> {len(resampled)} 筆記錄")

        return resampled

    def calculate_features(self, df: pd.DataFrame, device_number: str) -> pd.DataFrame:
        """計算多尺度特徵"""
        if len(df) < self.config['long_window_size']:
            logger.warning(f"設備 {device_number} 數據不足以計算特徵")
            return df

        # 複製數據避免修改原始數據
        df_features = df.copy()

        # 計算滾動特徵
        for window_size in [self.config['short_window_size'], self.config['long_window_size']]:
            window_name = f"{window_size}min"

            # 功率統計特徵
            df_features[f'power_mean_{window_name}'] = df_features['power'].rolling(window=window_size, min_periods=1).mean()
            df_features[f'power_std_{window_name}'] = df_features['power'].rolling(window=window_size, min_periods=1).std()
            df_features[f'power_max_{window_name}'] = df_features['power'].rolling(window=window_size, min_periods=1).max()
            df_features[f'power_min_{window_name}'] = df_features['power'].rolling(window=window_size, min_periods=1).min()

            # 電壓統計特徵
            df_features[f'voltage_mean_{window_name}'] = df_features['voltage'].rolling(window=window_size, min_periods=1).mean()
            df_features[f'voltage_std_{window_name}'] = df_features['voltage'].rolling(window=window_size, min_periods=1).std()

            # 電流統計特徵
            df_features[f'currents_mean_{window_name}'] = df_features['currents'].rolling(window=window_size, min_periods=1).mean()
            df_features[f'currents_std_{window_name}'] = df_features['currents'].rolling(window=window_size, min_periods=1).std()

        # 計算功率變化率
        df_features['power_change_rate'] = df_features['power'].pct_change(fill_method=None)
        df_features['power_change_abs'] = df_features['power'].diff().abs()

        # 計算功率因數 (如果有電壓和電流數據)
        if 'voltage' in df_features.columns and 'currents' in df_features.columns:
            apparent_power = df_features['voltage'] * df_features['currents']
            df_features['power_factor'] = np.where(apparent_power > 0,
                                                   df_features['power'] / apparent_power, 0)
            df_features['power_factor'] = df_features['power_factor'].clip(0, 1)

        # 設備狀態編碼 - 處理數值格式的狀態
        df_features['switch_state_encoded'] = (df_features['switchState'] > 0).astype(int)
        df_features['network_state_encoded'] = (df_features['networkState'] > 0).astype(int)

        # 時間特徵
        df_features['hour'] = df_features['timestamp'].dt.hour
        df_features['day_of_week'] = df_features['timestamp'].dt.dayofweek
        df_features['is_weekend'] = (df_features['day_of_week'] >= 5).astype(int)

        # 填充 NaN 值
        df_features = df_features.fillna(0)

        logger.debug(f"設備 {device_number} 特徵計算完成: {df_features.shape[1]} 個特徵")

        return df_features

    def process_device(self, file_path) -> bool:
        """處理單一設備"""
        if isinstance(file_path, str):
            file_path = Path(file_path)

        device_number = self.extract_device_number(file_path)

        try:
            logger.info(f"處理設備: {device_number}")

            # 載入數據
            df = self.load_device_data(file_path)
            if df is None:
                return False

            self.stats['total_records_input'] += len(df)

            # 數據清理
            df_clean = self.clean_data(df, device_number)
            if len(df_clean) == 0:
                logger.warning(f"設備 {device_number} 清理後無數據")
                return False

            # 時間重採樣
            df_resampled = self.resample_data(df_clean, device_number)
            if len(df_resampled) == 0:
                logger.warning(f"設備 {device_number} 重採樣後無數據")
                return False

            # 特徵計算
            df_features = self.calculate_features(df_resampled, device_number)

            # 保存處理後的數據
            output_file = self.output_dir / f"processed_{device_number}.csv"
            df_features.to_csv(output_file, index=False)

            # 保存原始數據摘要
            summary_file = self.output_dir / f"summary_{device_number}.json"
            summary = {
                'device_number': device_number,
                'original_records': len(df),
                'cleaned_records': len(df_clean),
                'final_records': len(df_features),
                'time_range': {
                    'start': df['timestamp'].min().isoformat(),
                    'end': df['timestamp'].max().isoformat()
                },
                'features_count': df_features.shape[1],
                'processing_timestamp': datetime.now().isoformat()
            }

            with open(summary_file, 'w', encoding='utf-8') as f:
                json.dump(summary, f, indent=2, ensure_ascii=False)

            self.stats['total_records_output'] += len(df_features)
            self.stats['processed_devices'] += 1

            logger.info(f"設備 {device_number} 處理完成: {len(df)} -> {len(df_features)} 筆記錄")
            return True

        except Exception as e:
            logger.error(f"處理設備 {device_number} 失敗: {e}")
            self.stats['failed_devices'].append(device_number)
            return False

    def create_database_import_files(self):
        """創建用於資料庫匯入的檔案"""
        logger.info("創建資料庫匯入檔案...")

        # 合併所有處理後的檔案
        all_processed_files = list(self.output_dir.glob("processed_*.csv"))

        if not all_processed_files:
            logger.warning("沒有找到處理後的檔案")
            return

        # 創建主要數據表檔案
        main_data_list = []
        device_summary_list = []

        for file_path in tqdm(all_processed_files, desc="合併檔案"):
            try:
                df = pd.read_csv(file_path)
                device_number = file_path.stem.replace("processed_", "")

                # 添加設備標識
                df['device_id'] = device_number
                main_data_list.append(df)

                # 創建設備摘要
                summary_file = self.output_dir / f"summary_{device_number}.json"
                if summary_file.exists():
                    with open(summary_file, 'r', encoding='utf-8') as f:
                        summary = json.load(f)
                        device_summary_list.append(summary)

            except Exception as e:
                logger.error(f"處理檔案 {file_path.name} 失敗: {e}")

        # 合併所有數據
        if main_data_list:
            combined_df = pd.concat(main_data_list, ignore_index=True)

            # 保存主要數據檔案
            main_output_file = self.output_dir / "ammeter_processed_data.csv"
            combined_df.to_csv(main_output_file, index=False)
            logger.info(f"主要數據檔案已保存: {main_output_file} ({len(combined_df)} 筆記錄)")

            # 保存設備摘要檔案
            summary_output_file = self.output_dir / "device_processing_summary.json"
            with open(summary_output_file, 'w', encoding='utf-8') as f:
                json.dump(device_summary_list, f, indent=2, ensure_ascii=False)
            logger.info(f"設備摘要檔案已保存: {summary_output_file}")

            # 創建數據字典
            data_dict = {
                'table_name': 'ammeter_processed_data',
                'description': '電錶數據多尺度特徵工程處理結果',
                'total_records': len(combined_df),
                'total_devices': len(device_summary_list),
                'columns': []
            }

            for col in combined_df.columns:
                data_dict['columns'].append({
                    'name': col,
                    'type': str(combined_df[col].dtype),
                    'description': self._get_column_description(col)
                })

            dict_output_file = self.output_dir / "data_dictionary.json"
            with open(dict_output_file, 'w', encoding='utf-8') as f:
                json.dump(data_dict, f, indent=2, ensure_ascii=False)
            logger.info(f"數據字典已保存: {dict_output_file}")

    def _get_column_description(self, column_name: str) -> str:
        """獲取欄位描述"""
        descriptions = {
            'id': '原始記錄ID',
            'deviceNumber': '設備編號',
            'voltage': '電壓值 (V)',
            'currents': '電流值 (A)',
            'power': '功率值 (W)',
            'lastUpdated': '最後更新時間',
            'battery': '電池電量 (%)',
            'switchState': '開關狀態',
            'networkState': '網路狀態',
            'createdAt': '記錄創建時間',
            'timestamp': '時間戳',
            'device_id': '設備識別碼',
            'hour': '小時 (0-23)',
            'day_of_week': '星期 (0-6)',
            'is_weekend': '是否週末 (0/1)',
            'switch_state_encoded': '開關狀態編碼 (0/1)',
            'network_state_encoded': '網路狀態編碼 (0/1)',
            'power_change_rate': '功率變化率',
            'power_change_abs': '功率絕對變化量',
            'power_factor': '功率因數'
        }

        # 處理窗口特徵
        if '_mean_' in column_name:
            return f"{column_name.split('_')[0]}的{column_name.split('_')[-1]}平均值"
        elif '_std_' in column_name:
            return f"{column_name.split('_')[0]}的{column_name.split('_')[-1]}標準差"
        elif '_max_' in column_name:
            return f"{column_name.split('_')[0]}的{column_name.split('_')[-1]}最大值"
        elif '_min_' in column_name:
            return f"{column_name.split('_')[0]}的{column_name.split('_')[-1]}最小值"

        return descriptions.get(column_name, f"欄位: {column_name}")

    def generate_processing_report(self):
        """生成處理報告"""
        report = {
            'processing_summary': {
                'total_devices_found': self.stats['total_devices'],
                'devices_processed_successfully': self.stats['processed_devices'],
                'devices_failed': len(self.stats['failed_devices']),
                'success_rate': (self.stats['processed_devices'] / self.stats['total_devices'] * 100) if self.stats['total_devices'] > 0 else 0,
                'total_input_records': self.stats['total_records_input'],
                'total_output_records': self.stats['total_records_output'],
                'processing_timestamp': datetime.now().isoformat()
            },
            'failed_devices': self.stats['failed_devices'],
            'configuration': self.config
        }

        report_file = self.output_dir / "processing_report.json"
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)

        logger.info(f"處理報告已保存: {report_file}")
        logger.info(f"處理完成 - 成功: {self.stats['processed_devices']}/{self.stats['total_devices']} 設備")

        return report

    def run_full_etl(self):
        """執行完整 ETL 流程"""
        start_time = datetime.now()
        logger.info("開始執行設備 ETL 流程...")

        # 掃描設備檔案
        device_files = self.scan_device_files()

        if not device_files:
            logger.error("沒有找到設備檔案")
            return

        # 處理每個設備
        for file_path in tqdm(device_files, desc="處理設備"):
            self.process_device(file_path)

        # 創建資料庫匯入檔案
        self.create_database_import_files()

        # 生成報告
        self.generate_processing_report()

        # 計算處理時間
        self.stats['processing_time'] = (datetime.now() - start_time).total_seconds()

        logger.info(f"ETL 流程完成，總耗時: {self.stats['processing_time']:.2f} 秒")

def main():
    """主函數"""
    processor = DeviceETLProcessor()
    processor.run_full_etl()

if __name__ == "__main__":
    main()
