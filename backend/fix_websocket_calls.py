#!/usr/bin/env python3
"""
修正 case_study_v2.py 中的 WebSocket 調用，加上 None 檢查
"""

import re

def fix_websocket_calls():
    file_path = '/home/infowin/Git-projects/pu-in-practice/backend/routes/case_study_v2.py'

    # 讀取文件內容
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 搜索並替換所有未加條件檢查的 WebSocket 調用
    pattern = r'(\s+)await websocket_manager\.send_training_log\('
    replacement = r'\1if websocket_manager:\n\1    await websocket_manager.send_training_log('

    # 使用正則表達式進行替換
    new_content = re.sub(pattern, replacement, content)

    # 檢查是否有變化
    if new_content != content:
        # 寫入修改後的內容
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("✅ WebSocket 調用已成功修正")

        # 顯示修改統計
        changes = len(re.findall(pattern, content))
        print(f"📊 修正了 {changes} 個 WebSocket 調用")
    else:
        print("ℹ️ 沒有發現需要修正的 WebSocket 調用")

if __name__ == "__main__":
    fix_websocket_calls()
