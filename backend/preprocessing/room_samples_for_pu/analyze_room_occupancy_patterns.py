#!/usr/bin/env python3
"""
房間使用者類型分析器 - 基於用電模式區分學生和上班族
根據時間特徵和用電行為模式來分析房間的使用者類型

核心假設：
- 上班族：平日9-18點用電較少（在辦公室），晚上回家後用電增加，週末在家
- 學生：作息不規律，深夜用電較多，平日白天可能在宿舍
"""

import pandas as pd
import numpy as np
import json
import os
from datetime import datetime, timedelta
from typing import Dict, List, Tuple
import warnings
warnings.filterwarnings('ignore')

class RoomOccupancyAnalyzer:
    def __init__(self, data_dir: str):
        """
        初始化分析器

        Args:
            data_dir: 包含room_samples_*.csv和rooms_metadata.csv的目錄路徑
        """
        self.data_dir = data_dir
        self.metadata_df = None
        self.high_quality_rooms = []
        self.room_features = {}

    def load_metadata(self):
        """載入房間元數據，只保留高品質房間"""
        metadata_path = os.path.join(self.data_dir, 'rooms_metadata.csv')
        self.metadata_df = pd.read_csv(metadata_path)

        # 只保留高品質房間
        high_quality_mask = self.metadata_df['is_high_quality'] == True
        self.high_quality_rooms = self.metadata_df[high_quality_mask]['room_id'].tolist()

        print(f"✅ 載入元數據完成")
        print(f"📊 總房間數: {len(self.metadata_df)}")
        print(f"🏆 高品質房間數: {len(self.high_quality_rooms)}")
        print(f"🏆 高品質房間: {self.high_quality_rooms}")

    def load_room_data(self, room_id: str) -> pd.DataFrame:
        """
        載入單個房間的電表數據

        Args:
            room_id: 房間ID

        Returns:
            處理後的DataFrame，時間已轉換為台北時間(+8)
        """
        csv_path = os.path.join(self.data_dir, f'room_samples_{room_id}.csv')

        if not os.path.exists(csv_path):
            print(f"⚠️ 檔案不存在: {csv_path}")
            return pd.DataFrame()

        df = pd.read_csv(csv_path)

        # 轉換時間格式，從UTC+0調整為台北時間UTC+8
        df['timestamp'] = pd.to_datetime(df['timestamp']) + timedelta(hours=8)

        # 添加時間特徵
        df['hour'] = df['timestamp'].dt.hour
        df['day_of_week'] = df['timestamp'].dt.dayofweek  # 0=週一, 6=週日
        df['is_weekend'] = df['day_of_week'].isin([5, 6])  # 週六、週日
        df['is_workday'] = ~df['is_weekend']

        return df

    def calculate_time_usage_patterns(self, df: pd.DataFrame) -> Dict:
        """
        計算時間使用模式特徵

        Args:
            df: 房間的電表數據

        Returns:
            包含各種時間模式特徵的字典
        """
        if df.empty:
            return {}

        features = {}

        # 1. 基本統計
        features['total_samples'] = len(df)
        features['avg_total_wattage'] = df['wattageTotal_current'].mean()
        features['std_total_wattage'] = df['wattageTotal_current'].std()

        # 2. 定義時段
        DEEP_NIGHT = (0, 6)      # 深夜 00:00-06:00
        MORNING = (6, 9)         # 早上 06:00-09:00
        WORK_HOURS = (9, 18)     # 工作時間 09:00-18:00
        EVENING = (18, 24)       # 晚上 18:00-24:00

        # 3. 計算各時段的平均用電量（只考慮平日）
        workday_df = df[df['is_workday']]
        weekend_df = df[df['is_weekend']]

        if not workday_df.empty:
            # 平日各時段平均用電
            deep_night_mask = workday_df['hour'].between(DEEP_NIGHT[0], DEEP_NIGHT[1]-1)
            morning_mask = workday_df['hour'].between(MORNING[0], MORNING[1]-1)
            work_mask = workday_df['hour'].between(WORK_HOURS[0], WORK_HOURS[1]-1)
            evening_mask = workday_df['hour'].between(EVENING[0], EVENING[1]-1)

            features['workday_deep_night_avg'] = workday_df[deep_night_mask]['wattageTotal_current'].mean() if deep_night_mask.any() else 0
            features['workday_morning_avg'] = workday_df[morning_mask]['wattageTotal_current'].mean() if morning_mask.any() else 0
            features['workday_work_hours_avg'] = workday_df[work_mask]['wattageTotal_current'].mean() if work_mask.any() else 0
            features['workday_evening_avg'] = workday_df[evening_mask]['wattageTotal_current'].mean() if evening_mask.any() else 0

            # 計算比例特徵 (關鍵區分指標)
            total_workday_avg = workday_df['wattageTotal_current'].mean()
            if total_workday_avg > 0:
                features['deep_night_ratio'] = features['workday_deep_night_avg'] / total_workday_avg
                features['work_hours_ratio'] = features['workday_work_hours_avg'] / total_workday_avg
                features['evening_ratio'] = features['workday_evening_avg'] / total_workday_avg

                # 上班族特徵：工作時間用電低，晚上用電高
                features['office_worker_score'] = features['evening_ratio'] - features['work_hours_ratio']

                # 學生特徵：深夜用電相對較高，白天用電不規律
                features['student_score'] = features['deep_night_ratio'] + (1 - abs(features['work_hours_ratio'] - features['evening_ratio']))
            else:
                features.update({
                    'deep_night_ratio': 0, 'work_hours_ratio': 0, 'evening_ratio': 0,
                    'office_worker_score': 0, 'student_score': 0
                })
        else:
            features.update({
                'workday_deep_night_avg': 0, 'workday_morning_avg': 0,
                'workday_work_hours_avg': 0, 'workday_evening_avg': 0,
                'deep_night_ratio': 0, 'work_hours_ratio': 0, 'evening_ratio': 0,
                'office_worker_score': 0, 'student_score': 0
            })

        # 4. 週末vs平日用電比較
        if not weekend_df.empty and not workday_df.empty:
            features['weekend_avg'] = weekend_df['wattageTotal_current'].mean()
            features['workday_avg'] = workday_df['wattageTotal_current'].mean()
            features['weekend_workday_ratio'] = features['weekend_avg'] / features['workday_avg'] if features['workday_avg'] > 0 else 0
        else:
            features.update({'weekend_avg': 0, 'workday_avg': 0, 'weekend_workday_ratio': 0})

        # 5. 作息規律性 - 計算每日同一時段用電的變異係數
        if not workday_df.empty:
            # 計算平日晚上用電的變異係數（規律性指標）
            evening_data = workday_df[workday_df['hour'].between(19, 22)].groupby(workday_df['timestamp'].dt.date)['wattageTotal_current'].mean()
            if len(evening_data) > 1:
                features['evening_regularity'] = evening_data.std() / evening_data.mean() if evening_data.mean() > 0 else 0
            else:
                features['evening_regularity'] = 0
        else:
            features['evening_regularity'] = 0

        # 6. 高用電事件分析
        high_usage_threshold = df['wattageTotal_current'].quantile(0.8)  # 前20%用電量
        high_usage_df = df[df['wattageTotal_current'] > high_usage_threshold]

        if not high_usage_df.empty:
            # 高用電事件的時間分佈
            features['high_usage_deep_night_pct'] = (high_usage_df['hour'].between(0, 5)).mean()
            features['high_usage_work_hours_pct'] = (high_usage_df['hour'].between(9, 17)).mean()
            features['high_usage_evening_pct'] = (high_usage_df['hour'].between(18, 23)).mean()
        else:
            features.update({
                'high_usage_deep_night_pct': 0, 'high_usage_work_hours_pct': 0, 'high_usage_evening_pct': 0
            })

        return features

    def analyze_all_rooms(self):
        """分析所有高品質房間"""
        print("\n🔍 開始分析所有高品質房間...")

        successful_analyses = 0

        for room_id in self.high_quality_rooms:
            print(f"\n📊 分析房間 {room_id}...")

            # 載入房間數據
            df = self.load_room_data(room_id)

            if df.empty:
                print(f"❌ 房間 {room_id} 數據載入失敗")
                continue

            # 計算特徵
            features = self.calculate_time_usage_patterns(df)

            if features:
                features['room_id'] = room_id
                # 添加原始標籤（僅供參考）
                metadata_row = self.metadata_df[self.metadata_df['room_id'] == room_id]
                if not metadata_row.empty:
                    features['original_label'] = metadata_row['occupant_type'].iloc[0]

                self.room_features[room_id] = features
                successful_analyses += 1
                print(f"✅ 房間 {room_id} 分析完成")
            else:
                print(f"❌ 房間 {room_id} 特徵計算失敗")

        print(f"\n📈 分析完成！成功分析 {successful_analyses}/{len(self.high_quality_rooms)} 個房間")

    def generate_rankings(self) -> Tuple[List[Tuple], List[Tuple]]:
        """
        生成房間的使用者類型排名

        Returns:
            (office_worker_ranking, student_ranking): 兩個排名列表
        """
        if not self.room_features:
            print("❌ 沒有可用的房間特徵數據")
            return [], []

        # 創建特徵DataFrame
        features_list = []
        for room_id, features in self.room_features.items():
            features_list.append(features)

        df = pd.DataFrame(features_list)

        # 計算綜合評分
        # 上班族評分權重
        office_worker_weights = {
            'office_worker_score': 0.3,      # 晚上高用電-工作時間低用電
            'work_hours_ratio': -0.2,        # 工作時間用電越少越像上班族
            'evening_ratio': 0.2,            # 晚上用電越多越像上班族
            'evening_regularity': -0.1,      # 作息越規律越像上班族
            'weekend_workday_ratio': 0.1,    # 週末在家用電比平日多
            'high_usage_work_hours_pct': -0.1 # 高用電很少發生在工作時間
        }

        # 學生評分權重
        student_weights = {
            'student_score': 0.3,            # 深夜用電+不規律性
            'deep_night_ratio': 0.25,        # 深夜用電比例
            'high_usage_deep_night_pct': 0.15, # 高用電事件在深夜的比例
            'evening_regularity': 0.1,       # 作息不規律性
            'work_hours_ratio': 0.1,          # 白天也可能在宿舍
            'weekend_workday_ratio': -0.1     # 週末和平日差異較小
        }

        # 計算評分
        df['office_worker_final_score'] = 0
        df['student_final_score'] = 0

        for feature, weight in office_worker_weights.items():
            if feature in df.columns:
                # 正規化特徵值到0-1範圍
                feature_normalized = (df[feature] - df[feature].min()) / (df[feature].max() - df[feature].min() + 1e-8)
                df['office_worker_final_score'] += weight * feature_normalized

        for feature, weight in student_weights.items():
            if feature in df.columns:
                feature_normalized = (df[feature] - df[feature].min()) / (df[feature].max() - df[feature].min() + 1e-8)
                df['student_final_score'] += weight * feature_normalized

        # 生成排名
        office_worker_ranking = df.nlargest(len(df), 'office_worker_final_score')[['room_id', 'office_worker_final_score', 'original_label']].values.tolist()
        student_ranking = df.nlargest(len(df), 'student_final_score')[['room_id', 'student_final_score', 'original_label']].values.tolist()

        return office_worker_ranking, student_ranking

    def print_rankings(self, office_ranking: List[Tuple], student_ranking: List[Tuple]):
        """輸出排名結果"""
        print("\n" + "="*80)
        print("🏢 最有可能是【上班族】的房間排名 (基於用電時間模式分析)")
        print("="*80)
        print(f"{'排名':<4} {'房間ID':<8} {'評分':<8} {'原始標籤':<15} {'分析依據'}")
        print("-" * 80)

        for i, (room_id, score, original_label) in enumerate(office_ranking[:10], 1):
            features = self.room_features.get(room_id, {})
            analysis = f"工作時間用電比:{features.get('work_hours_ratio', 0):.2f}, 晚上比:{features.get('evening_ratio', 0):.2f}"
            print(f"{i:<4} {room_id:<8} {score:<8.3f} {original_label:<15} {analysis}")

        print("\n" + "="*80)
        print("🎓 最有可能是【學生】的房間排名 (基於用電時間模式分析)")
        print("="*80)
        print(f"{'排名':<4} {'房間ID':<8} {'評分':<8} {'原始標籤':<15} {'分析依據'}")
        print("-" * 80)

        for i, (room_id, score, original_label) in enumerate(student_ranking[:10], 1):
            features = self.room_features.get(room_id, {})
            analysis = f"深夜用電比:{features.get('deep_night_ratio', 0):.2f}, 高用電深夜比:{features.get('high_usage_deep_night_pct', 0):.2f}"
            print(f"{i:<4} {room_id:<8} {score:<8.3f} {original_label:<15} {analysis}")

    def save_detailed_results(self, office_ranking: List[Tuple], student_ranking: List[Tuple]):
        """保存詳細分析結果"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

        # 保存特徵數據
        features_df = pd.DataFrame([features for features in self.room_features.values()])
        features_df.to_csv(f'room_features_analysis_{timestamp}.csv', index=False)

        # 保存排名結果
        office_df = pd.DataFrame(office_ranking, columns=['room_id', 'office_worker_score', 'original_label'])
        student_df = pd.DataFrame(student_ranking, columns=['room_id', 'student_score', 'original_label'])

        office_df.to_csv(f'office_worker_ranking_{timestamp}.csv', index=False)
        student_df.to_csv(f'student_ranking_{timestamp}.csv', index=False)

        print(f"\n💾 詳細結果已保存:")
        print(f"   - 特徵分析: room_features_analysis_{timestamp}.csv")
        print(f"   - 上班族排名: office_worker_ranking_{timestamp}.csv")
        print(f"   - 學生排名: student_ranking_{timestamp}.csv")

    def run_analysis(self):
        """執行完整分析流程"""
        print("🚀 開始房間使用者類型分析...")
        print("📋 分析基於以下假設:")
        print("   上班族: 工作時間(9-18)用電少，晚上(18-24)用電多，作息規律")
        print("   學生: 深夜(0-6)用電較多，白天用電不規律，作息較隨意")

        # 載入元數據
        self.load_metadata()

        # 分析所有房間
        self.analyze_all_rooms()

        # 生成排名
        office_ranking, student_ranking = self.generate_rankings()

        # 輸出結果
        self.print_rankings(office_ranking, student_ranking)

        # 保存結果
        self.save_detailed_results(office_ranking, student_ranking)

        return office_ranking, student_ranking


def main():
    """主函數"""
    # 設定數據目錄
    data_dir = '/home/infowin/Git-projects/pu-in-practice/backend/preprocessing/room_samples_for_pu'

    # 創建分析器並執行分析
    analyzer = RoomOccupancyAnalyzer(data_dir)
    office_ranking, student_ranking = analyzer.run_analysis()

    print("\n🎯 分析完成！")
    print(f"📊 共分析了 {len(analyzer.room_features)} 個高品質房間")
    print("💡 排名基於用電時間模式，數值越高代表越符合該類型特徵")


if __name__ == "__main__":
    main()
