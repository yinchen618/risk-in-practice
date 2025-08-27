#!/usr/bin/env python3
"""
測試即時訓練進度回報功能
Test real-time training progress reporting functionality
"""

import requests
import websocket
import json
import threading
import time

def on_message(ws, message):
    """處理 WebSocket 消息"""
    try:
        data = json.loads(message)
        print(f"📱 收到消息: {data}")

        if data.get('type') == 'training_log':
            log_data = data.get('data', {})
            log_type = log_data.get('type', 'unknown')
            log_message = log_data.get('message', '')

            if log_type == 'status':
                print(f"🟢 狀態更新: {log_message}")
            elif log_type == 'log':
                print(f"📊 訓練日誌: {log_message}")
            elif log_type == 'progress':
                print(f"📈 進度更新: {log_message}")
            elif log_type == 'error':
                print(f"❌ 錯誤: {log_message}")
            else:
                print(f"ℹ️  其他: {log_message}")

    except json.JSONDecodeError:
        print(f"❌ 無法解析消息: {message}")

def on_error(ws, error):
    """處理 WebSocket 錯誤"""
    print(f"❌ WebSocket 錯誤: {error}")

def on_close(ws, close_status_code, close_msg):
    """處理 WebSocket 關閉"""
    print(f"🔌 WebSocket 連接已關閉: {close_status_code}, {close_msg}")

def on_open(ws):
    """處理 WebSocket 開啟"""
    print("🔗 WebSocket 連接已建立")

def start_training():
    """啟動訓練任務"""
    print("🚀 啟動訓練任務...")

    # 準備訓練參數
    training_data = {
        "experiment_id": "test_experiment_001",
        "training_config": {
            "classPrior": 0.5,
            "windowSize": 24,
            "modelType": "LSTM",
            "hiddenSize": 128,
            "numLayers": 2,
            "activationFunction": "relu",
            "dropout": 0.2,
            "epochs": 20,  # 設定 20 個 epoch 來測試即時進度
            "batchSize": 64,
            "optimizer": "adam",
            "learningRate": 0.001,
            "l2Regularization": 0.0001,
            "earlyStopping": True,
            "patience": 5,
            "learningRateScheduler": "cosine"
        },
        "data_source_config": {
            "trainRatio": 0.7,
            "validationRatio": 0.15,
            "testRatio": 0.15,
            "timeRange": {
                "start": "2024-01-01T00:00:00Z",
                "end": "2024-12-31T23:59:59Z"
            }
        }
    }

    try:
        # 發送訓練請求
        response = requests.post(
            "http://localhost:8000/api/v2/start-training",
            json=training_data,
            timeout=10
        )

        if response.status_code == 200:
            result = response.json()
            job_id = result.get('job_id')
            print(f"✅ 訓練任務已啟動，Job ID: {job_id}")
            return job_id
        else:
            print(f"❌ 啟動訓練失敗: {response.status_code}, {response.text}")
            return None

    except Exception as e:
        print(f"❌ 請求失敗: {e}")
        return None

def main():
    """主函數"""
    print("🎯 開始測試即時訓練進度回報功能")
    print("=" * 60)

    # 先啟動訓練任務
    job_id = start_training()
    if not job_id:
        print("❌ 無法啟動訓練任務，結束測試")
        return

    # 等待一秒讓訓練開始
    time.sleep(1)

    # 建立 WebSocket 連接
    print("🔗 建立 WebSocket 連接...")
    ws_url = f"ws://localhost:8000/api/v2/ws/training/{job_id}"
    print(f"📡 連接 URL: {ws_url}")

    ws = websocket.WebSocketApp(
        ws_url,
        on_message=on_message,
        on_error=on_error,
        on_close=on_close,
        on_open=on_open
    )

    # 在背景執行 WebSocket
    def run_websocket():
        ws.run_forever()

    ws_thread = threading.Thread(target=run_websocket, daemon=True)
    ws_thread.start()

    # 等待訓練完成（最多等待 5 分鐘）
    print("⏳ 等待訓練完成...")
    time.sleep(300)  # 5 分鐘

    print("🏁 測試完成")

if __name__ == "__main__":
    main()
