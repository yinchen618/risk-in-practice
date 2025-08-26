#!/usr/bin/env python3
"""
測試 Stage 2 API 的簡單腳本
"""

import sqlite3
import json
from datetime import datetime, timedelta

def test_stage2_apis():
    """測試 Stage 2 相關的 API 函數"""
    db_path = '/home/infowin/Git-projects/pu-in-practice/backend/database/prisma/pu_practice.db'

    print("🔍 檢查資料庫內容...")

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # 檢查實驗運行
    cursor.execute("SELECT id, name, status FROM experiment_run LIMIT 5")
    experiments = cursor.fetchall()
    print(f"📊 實驗運行數量: {len(experiments)}")
    for exp in experiments:
        print(f"  - {exp[0]}: {exp[1]} ({exp[2]})")

    # 檢查異常事件
    cursor.execute("SELECT id, event_id, meter_id, status, score FROM anomaly_event WHERE status = 'UNREVIEWED' LIMIT 5")
    events = cursor.fetchall()
    print(f"⚠️  待審核異常事件數量: {len(events)}")
    for event in events:
        print(f"  - {event[0]}: {event[1]} (score: {event[4]})")

    # 檢查表結構
    cursor.execute("PRAGMA table_info(anomaly_event)")
    columns = cursor.fetchall()
    print(f"📋 anomaly_event 表結構:")
    for col in columns:
        print(f"  - {col[1]}: {col[2]}")

    # 測試獲取異常事件的查詢
    print("\n🧪 測試查詢異常事件...")
    try:
        query = """
            SELECT id, event_id, meter_id, event_timestamp, detection_rule,
                   score, status, data_window, reviewer_id, review_timestamp,
                   justification_notes, experiment_run_id, created_at
            FROM anomaly_event
            WHERE status = ?
            ORDER BY score DESC
            LIMIT ?
        """
        cursor.execute(query, ('UNREVIEWED', 3))
        results = cursor.fetchall()

        print(f"✅ 查詢成功，返回 {len(results)} 條記錄")

        # 轉換為字典格式
        columns = [desc[0] for desc in cursor.description]
        for i, row in enumerate(results):
            event_dict = dict(zip(columns, row))
            print(f"\n📝 事件 {i+1}:")
            print(f"  ID: {event_dict['id']}")
            print(f"  Meter: {event_dict['meter_id']}")
            print(f"  Score: {event_dict['score']}")
            print(f"  Timestamp: {event_dict['event_timestamp']}")

            # 解析 data_window
            if event_dict['data_window']:
                try:
                    data_window = json.loads(event_dict['data_window'])
                    print(f"  Window: {data_window}")
                except:
                    print(f"  Window (raw): {event_dict['data_window'][:100]}...")

    except Exception as e:
        print(f"❌ 查詢失敗: {e}")

    conn.close()

if __name__ == "__main__":
    test_stage2_apis()
