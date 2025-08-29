#!/usr/bin/env python3
"""
更新數據庫中 AnalysisDataset 的 occupantType
根據修改後的 rooms_metadata.csv 同步更新 SQLite 數據庫
"""

import sqlite3
import pandas as pd
import os
from datetime import datetime

def update_database_occupant_types():
    """根據rooms_metadata.csv更新數據庫中的occupantType"""

    print("="*80)
    print("🔄 更新數據庫 AnalysisDataset.occupantType")
    print("="*80)

    # 路徑設定
    metadata_path = '/home/infowin/Git-projects/pu-in-practice/backend/preprocessing/room_samples_for_pu/rooms_metadata.csv'
    db_path = '/home/infowin/Git-projects/pu-in-practice/backend/database/prisma/pu_practice.db'

    # 檢查檔案是否存在
    if not os.path.exists(metadata_path):
        print(f"❌ 找不到檔案: {metadata_path}")
        return

    if not os.path.exists(db_path):
        print(f"❌ 找不到數據庫: {db_path}")
        return

    # 讀取房間元數據
    print(f"📖 讀取房間元數據: {metadata_path}")
    metadata_df = pd.read_csv(metadata_path)

    # 只處理高品質房間
    high_quality_rooms = metadata_df[metadata_df['is_high_quality'] == True]
    print(f"🏆 找到 {len(high_quality_rooms)} 個高品質房間")

    # 連接數據庫
    print(f"🔗 連接數據庫: {db_path}")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    try:
        # 獲取當前數據庫中的數據
        cursor.execute("SELECT id, name, room, occupant_type FROM analysis_datasets")
        db_records = cursor.fetchall()

        print(f"📊 數據庫中找到 {len(db_records)} 筆 AnalysisDataset 記錄")

        # 創建房間ID到occupant_type的映射
        room_occupant_map = {}
        for _, row in high_quality_rooms.iterrows():
            room_occupant_map[row['room_id']] = row['occupant_type']

        # 統計更新數據
        updates_needed = []
        no_update_needed = []
        not_found_in_metadata = []

        for db_id, db_name, db_room, db_occupant_type in db_records:
            # 從數據庫名稱中提取房間ID (例如: "Room R009 Analysis Dataset" -> "R009")
            room_id = None
            for rid in room_occupant_map.keys():
                if rid in db_name:
                    room_id = rid
                    break

            if room_id and room_id in room_occupant_map:
                new_occupant_type = room_occupant_map[room_id]
                if db_occupant_type != new_occupant_type:
                    updates_needed.append((db_id, room_id, db_occupant_type, new_occupant_type))
                else:
                    no_update_needed.append((db_id, room_id, db_occupant_type))
            else:
                not_found_in_metadata.append((db_id, db_name, db_occupant_type))

        print(f"\n📋 更新分析:")
        print(f"   🔄 需要更新: {len(updates_needed)} 筆")
        print(f"   ✅ 無需更新: {len(no_update_needed)} 筆")
        print(f"   ⚠️ 元數據中找不到: {len(not_found_in_metadata)} 筆")

        if updates_needed:
            print(f"\n🔄 開始更新 {len(updates_needed)} 筆記錄...")
            print("-"*80)

            update_count = 0
            for db_id, room_id, old_type, new_type in updates_needed:
                cursor.execute(
                    "UPDATE analysis_datasets SET occupant_type = ? WHERE id = ?",
                    (new_type, db_id)
                )
                update_count += 1
                print(f"   {room_id}: {old_type} → {new_type}")

            # 提交更改
            conn.commit()
            print(f"\n✅ 成功更新 {update_count} 筆記錄")

        else:
            print("\n✅ 所有記錄都已是最新狀態，無需更新")

        # 顯示更新後的統計
        cursor.execute("SELECT occupant_type, COUNT(*) FROM analysis_datasets GROUP BY occupant_type")
        type_counts = cursor.fetchall()

        print(f"\n📊 更新後的標籤分佈:")
        for occupant_type, count in type_counts:
            print(f"   {occupant_type}: {count} 筆")

        # 顯示不在元數據中的記錄（可能是低品質房間）
        if not_found_in_metadata:
            print(f"\n⚠️ 以下記錄在高品質房間元數據中找不到（可能是低品質房間）:")
            for db_id, db_name, db_occupant_type in not_found_in_metadata[:5]:  # 只顯示前5筆
                print(f"   {db_name}: {db_occupant_type}")
            if len(not_found_in_metadata) > 5:
                print(f"   ... 還有 {len(not_found_in_metadata) - 5} 筆")

    except Exception as e:
        print(f"❌ 更新過程中發生錯誤: {e}")
        conn.rollback()

    finally:
        conn.close()
        print(f"\n🔌 數據庫連接已關閉")

    print("="*80)
    print("🎯 數據庫更新完成！")
    print("="*80)

if __name__ == "__main__":
    update_database_occupant_types()
