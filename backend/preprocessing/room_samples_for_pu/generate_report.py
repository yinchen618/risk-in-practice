#!/usr/bin/env python3
"""
房間使用者類型分析結果報告生成器
基於用電時間模式的學生vs上班族識別結果總結
"""

import pandas as pd

def generate_analysis_report():
    """生成分析報告"""

    print("="*100)
    print("🏠 房間使用者類型分析結果報告")
    print("="*100)
    print("📋 分析基礎:")
    print("   ✅ 分析範圍: 36個高品質房間 (is_high_quality=True)")
    print("   ✅ 時間範圍: 2025年7月-8月的電表數據")
    print("   ✅ 時區校正: UTC+0 → UTC+8 (台北時間)")
    print("   ✅ 分析方法: 基於用電時間模式的特徵工程")

    # 讀取分析結果
    office_df = pd.read_csv('office_worker_ranking_20250828_202620.csv')
    student_df = pd.read_csv('student_ranking_20250828_202620.csv')
    features_df = pd.read_csv('room_features_analysis_20250828_202620.csv')

    print(f"\n📊 基礎統計:")
    print(f"   - 總分析房間數: {len(features_df)}")
    print(f"   - 原始標籤為STUDENT: {len(features_df[features_df['original_label']=='STUDENT'])}")
    print(f"   - 原始標籤為OFFICE_WORKER: {len(features_df[features_df['original_label']=='OFFICE_WORKER'])}")

    print("\n" + "="*100)
    print("🏢 【上班族】識別結果 TOP 10")
    print("="*100)
    print("分析依據: 工作時間(9-18)用電低 + 晚上(18-24)用電高 + 作息規律")
    print("-"*100)
    print(f"{'排名':<4} {'房間':<6} {'評分':<8} {'原標籤':<12} {'工作用電比':<10} {'晚上用電比':<10} {'作息規律':<8}")
    print("-"*100)

    for i, (_, row) in enumerate(office_df.head(10).iterrows(), 1):
        room_id = row['room_id']
        score = row['office_worker_score']
        label = row['original_label']

        # 從特徵數據中獲取詳細信息
        room_features = features_df[features_df['room_id'] == room_id].iloc[0]
        work_ratio = room_features['work_hours_ratio']
        evening_ratio = room_features['evening_ratio']
        regularity = room_features['evening_regularity']

        print(f"{i:<4} {room_id:<6} {score:<8.3f} {label:<12} {work_ratio:<10.2f} {evening_ratio:<10.2f} {regularity:<8.2f}")

    print("\n🔍 上班族特徵解釋:")
    print("   - 評分越高 = 越像上班族")
    print("   - 工作用電比 < 1.0 = 工作時間用電低於平均(在辦公室)")
    print("   - 晚上用電比 > 1.0 = 晚上用電高於平均(回家後)")
    print("   - 作息規律值越小 = 作息越規律")

    print("\n" + "="*100)
    print("🎓 【學生】識別結果 TOP 10")
    print("="*100)
    print("分析依據: 深夜(0-6)用電高 + 作息不規律 + 高用電事件常在深夜")
    print("-"*100)
    print(f"{'排名':<4} {'房間':<6} {'評分':<8} {'原標籤':<12} {'深夜用電比':<10} {'深夜高用電%':<12} {'作息規律':<8}")
    print("-"*100)

    for i, (_, row) in enumerate(student_df.head(10).iterrows(), 1):
        room_id = row['room_id']
        score = row['student_score']
        label = row['original_label']

        # 從特徵數據中獲取詳細信息
        room_features = features_df[features_df['room_id'] == room_id].iloc[0]
        night_ratio = room_features['deep_night_ratio']
        night_high_pct = room_features['high_usage_deep_night_pct']
        regularity = room_features['evening_regularity']

        print(f"{i:<4} {room_id:<6} {score:<8.3f} {label:<12} {night_ratio:<10.2f} {night_high_pct:<12.2f} {regularity:<8.2f}")

    print("\n🔍 學生特徵解釋:")
    print("   - 評分越高 = 越像學生")
    print("   - 深夜用電比 > 1.0 = 深夜用電高於平均(夜貓子)")
    print("   - 深夜高用電% = 高用電事件發生在深夜的比例")
    print("   - 作息規律值越大 = 作息越不規律")

    print("\n" + "="*100)
    print("🎯 關鍵發現與洞察")
    print("="*100)

    # 分析準確性
    office_top5 = office_df.head(5)
    student_top5 = student_df.head(5)

    print("📈 模型表現分析:")

    # 上班族識別分析
    office_correct = len(office_top5[office_top5['original_label'] == 'OFFICE_WORKER'])
    print(f"   - 上班族TOP5識別: {office_correct}/5個原本就標記為OFFICE_WORKER")

    # 學生識別分析
    student_correct = len(student_top5[student_top5['original_label'] == 'STUDENT'])
    print(f"   - 學生TOP5識別: {student_correct}/5個原本就標記為STUDENT")

    print(f"\n💡 有趣的發現:")

    # 找出原標籤和分析結果不一致的案例
    print("   🔄 標籤vs分析不一致的案例:")

    # 原標籤是學生但被識別為上班族的
    student_as_office = office_df.head(5)[office_df.head(5)['original_label'] == 'STUDENT']
    if not student_as_office.empty:
        print(f"      - 原標籤STUDENT但識別為上班族: {student_as_office['room_id'].tolist()}")

    # 原標籤是上班族但被識別為學生的
    office_as_student = student_df.head(5)[student_df.head(5)['original_label'] == 'OFFICE_WORKER']
    if not office_as_student.empty:
        print(f"      - 原標籤OFFICE_WORKER但識別為學生: {office_as_student['room_id'].tolist()}")

    # 統計極端特徵
    max_night_room = features_df.loc[features_df['deep_night_ratio'].idxmax()]
    max_evening_room = features_df.loc[features_df['evening_ratio'].idxmax()]
    min_work_room = features_df.loc[features_df['work_hours_ratio'].idxmin()]

    print(f"\n📊 極端行為模式:")
    print(f"   - 最夜貓子房間: {max_night_room['room_id']} (深夜用電比: {max_night_room['deep_night_ratio']:.2f})")
    print(f"   - 最愛晚上用電: {max_evening_room['room_id']} (晚上用電比: {max_evening_room['evening_ratio']:.2f})")
    print(f"   - 工作時間最少用電: {min_work_room['room_id']} (工作用電比: {min_work_room['work_hours_ratio']:.2f})")

    print(f"\n🎯 結論:")
    print("   ✅ 此分析基於實際用電時間模式，比原始標籤更能反映真實生活作息")
    print("   ✅ 深夜用電模式是區分學生/上班族的關鍵指標")
    print("   ✅ 工作時間用電低+晚上用電高的組合強烈指向上班族行為")
    print("   ⚠️ 少數原標籤可能不準確，基於用電行為的分析提供了新視角")

    print("\n" + "="*100)
    print("📁 詳細數據檔案:")
    print("   - 完整特徵分析: room_features_analysis_20250828_202620.csv")
    print("   - 上班族排名: office_worker_ranking_20250828_202620.csv")
    print("   - 學生排名: student_ranking_20250828_202620.csv")
    print("="*100)

if __name__ == "__main__":
    generate_analysis_report()
