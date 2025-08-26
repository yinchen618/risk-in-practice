#!/usr/bin/env python3

import sqlite3
import json

# 連接到數據庫
db_path = '/home/infowin/Git-projects/pu-in-practice/backend/database/prisma/pu_practice.db'
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

print("=== 測試新的 schema 是否正常工作 ===")

# 1. 測試異常事件列表查詢
print("\n1. 測試異常事件列表查詢:")
cursor.execute("""
    SELECT ae.id, ae.event_id, ae.dataset_id, ae.line, ae.event_timestamp, ae.detection_rule,
           ae.score, ae.status, ae.data_window, ae.reviewer_id, ae.review_timestamp,
           ae.justification_notes, ae.experiment_run_id, ae.created_at,
           ad.name as dataset_name
    FROM anomaly_event ae
    LEFT JOIN analysis_datasets ad ON ae.dataset_id = ad.id
    WHERE ae.experiment_run_id = ? AND ae.status = ?
    ORDER BY ae.score DESC, ae.event_timestamp DESC
""", ("test_experiment_001", "UNREVIEWED"))

events = cursor.fetchall()
print(f"找到 {len(events)} 個未審核事件")

for event in events:
    print(f"  - 事件 ID: {event[0]}")
    print(f"    數據集: {event[14]} (ID: {event[2]})")
    print(f"    線路: {event[3]}")
    print(f"    時間: {event[4]}")
    print(f"    分數: {event[6]}")

# 2. 測試事件數據查詢
print("\n2. 測試事件數據查詢:")
if events:
    event_id = events[0][0]
    dataset_id = events[0][2]
    data_window_str = events[0][8]

    print(f"  查詢事件 {event_id} 的數據")
    print(f"  數據集 ID: {dataset_id}")
    print(f"  數據窗口: {data_window_str}")

    # 解析數據窗口
    try:
        data_window = json.loads(data_window_str)
        start_time = data_window.get('startTime')
        end_time = data_window.get('endTime')

        print(f"  時間範圍: {start_time} 到 {end_time}")

        # 查詢實際數據
        cursor.execute("""
            SELECT timestamp, raw_wattage_l1, raw_wattage_l2, wattage_110v, wattage_220v, wattage_total, is_positive_label
            FROM analysis_ready_data
            WHERE dataset_id = ?
            AND timestamp BETWEEN ? AND ?
            ORDER BY timestamp
        """, (dataset_id, start_time, end_time))

        data_rows = cursor.fetchall()
        print(f"  找到 {len(data_rows)} 個數據點")

        for i, row in enumerate(data_rows[:3]):  # 只顯示前3個
            print(f"    [{i+1}] {row[0]} - 總功率: {row[5]}W")

    except json.JSONDecodeError as e:
        print(f"  解析數據窗口失敗: {e}")

# 3. 測試審核功能
print("\n3. 測試審核功能:")
if events:
    event_id = events[0][0]
    event_dataset_id = events[0][2]
    event_timestamp = events[0][4]

    print(f"  模擬審核事件 {event_id}")
    print(f"  數據集 ID: {event_dataset_id}")
    print(f"  事件時間: {event_timestamp}")

    # 查找對應的數據記錄
    cursor.execute("""
        SELECT id, timestamp, wattage_total, is_positive_label
        FROM analysis_ready_data
        WHERE dataset_id = ? AND timestamp = ?
    """, (event_dataset_id, event_timestamp))

    matching_data = cursor.fetchone()
    if matching_data:
        print(f"  找到匹配的數據記錄: ID {matching_data[0]}")
        print(f"    時間戳: {matching_data[1]}")
        print(f"    總功率: {matching_data[2]}W")
        print(f"    當前標籤: {'正面' if matching_data[3] else '未標記'}")
    else:
        print("  警告: 找不到匹配的數據記錄")

conn.close()
print("\n=== 測試完成 ===")
