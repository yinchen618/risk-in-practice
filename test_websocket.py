#!/usr/bin/env python3
"""
簡單的 WebSocket 測試腳本
用於測試訓練監控 WebSocket 連接
"""

import asyncio
import websockets
import json
import requests

async def test_websocket_connection():
    """測試 WebSocket 連接"""
    print("🔗 開始測試 WebSocket 連接...")

    # 首先創建一個訓練作業以獲得 job_id
    print("📤 創建測試訓練作業...")

    try:
        response = requests.post(
                "http://localhost:8000/api/v2/trained-models",
                json={
                    "name": "test_websocket_model",
                    "scenarioType": "ERM_BASELINE",
                    "experimentRunId": "668c91c3-13cd-48dd-91b6-d2344a650b61",  # 使用真實的實驗 ID
                    "modelConfig": json.dumps({
                        "hidden_dim": 64,
                        "learning_rate": 0.001,
                        "epochs": 5,
                        "batch_size": 32
                    }),
                    "dataSourceConfig": json.dumps({
                        "trainRatio": 60,
                        "validationRatio": 20,
                        "testRatio": 20
                    })
                },
                headers={"Content-Type": "application/json"}
            )

        if response.status_code == 200:
            model_data = response.json()
            job_id = model_data.get("jobId")
            print(f"✅ 訓練作業已創建，Job ID: {job_id}")

            if job_id:
                # 測試 WebSocket 連接
                ws_url = f"ws://localhost:8000/api/v2/training-jobs/{job_id}/logs"
                print(f"🌐 連接到 WebSocket: {ws_url}")

                try:
                    async with websockets.connect(ws_url) as websocket:
                        print("✅ WebSocket 連接成功！")

                        # 發送 ping
                        await websocket.send("ping")
                        print("🏓 發送 ping...")

                        # 等待回應
                        try:
                            response = await asyncio.wait_for(websocket.recv(), timeout=5.0)
                            print(f"📨 收到回應: {response}")
                        except asyncio.TimeoutError:
                            print("⏰ 等待回應超時")

                        # 等待一些訓練日誌
                        print("⏳ 等待訓練日誌...")
                        for i in range(30):  # 增加等待時間以便看到更多日誌
                            try:
                                message = await asyncio.wait_for(websocket.recv(), timeout=3.0)
                                print(f"📝 收到日誌: {message}")
                            except asyncio.TimeoutError:
                                print(f"⏰ 等待第 {i+1} 條日誌超時")
                                if i >= 5:  # 如果 5 次都沒收到日誌就停止
                                    break

                except Exception as e:
                    print(f"❌ WebSocket 連接失敗: {e}")
            else:
                print("❌ 沒有收到 job_id")
        else:
            print(f"❌ 創建訓練作業失敗: {response.status_code} - {response.text}")

    except Exception as e:
        print(f"❌ 測試過程中發生錯誤: {e}")

if __name__ == "__main__":
    asyncio.run(test_websocket_connection())
