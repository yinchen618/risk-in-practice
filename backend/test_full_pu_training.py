#!/usr/bin/env python3
"""
測試完整的 PU Learning 訓練流程，包含動態 U 樣本生成
測試 WebSocket 進度更新和英文訊息
"""

import requests
import json
import time

def test_api_connectivity():
    """測試 API 連接性"""
    print("=== 測試 API 連接性 ===")

    try:
        response = requests.get("http://localhost:8000/", timeout=5)
        if response.status_code == 200:
            print("✅ 後端服務運行正常")
            return True
        else:
            print(f"⚠️ 後端服務狀態異常: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ 無法連接到後端服務: {e}")
        return False

def monitor_training_progress(job_id, max_attempts=30, interval=2):
    """監控訓練進度"""
    print(f"🔍 監控 Job {job_id} 的進度...")

    for attempt in range(max_attempts):
        try:
            status_url = f"http://localhost:8000/api/v1/models/jobs/{job_id}"
            response = requests.get(status_url, timeout=10)

            if response.status_code == 200:
                result = response.json()
                data = result.get('data', {})
                status = data.get('status', 'unknown')
                progress = data.get('progress', 0)

                print(f"📊 [{attempt+1}/{max_attempts}] 狀態: {status}, 進度: {progress}%")

                if status == 'COMPLETED':
                    print("✅ 訓練完成!")
                    metrics = data.get('metrics', {})
                    print(f"🎯 訓練指標: {json.dumps(metrics, indent=2, ensure_ascii=False)}")
                    return data
                elif status == 'FAILED':
                    print("❌ 訓練失敗!")
                    error = data.get('error', 'Unknown error')
                    print(f"🔍 錯誤詳情: {error}")
                    return data
                elif status in ['RUNNING', 'running', 'in_progress']:
                    print(f"🔄 訓練中... ({progress}%)")
                else:
                    print(f"⏳ 當前狀態: {status}")

            else:
                print(f"⚠️ 無法獲取狀態: {response.status_code}")

        except Exception as e:
            print(f"⚠️ 監控錯誤: {e}")

        time.sleep(interval)

    print("⏱️ 監控超時，請手動檢查訓練狀態")
    return None

def test_pu_training_with_dynamic_u_samples():
    """測試包含動態 U 樣本生成的完整訓練流程"""
    print("=== 測試 PU Learning 動態 U 樣本訓練 ===")

    # 模擬前端發送的訓練請求（使用有事件的實驗 ID）
    training_payload = {
        "experiment_run_id": "bc37eb3c-aff3-4c05-a2ad-6e272887f5b4",  # 使用有141個事件的實驗ID
        "model_params": {
            "model_type": "uPU",
            "prior_method": "median",
            "class_prior": None,
            "hidden_units": 100,
            "activation": "relu",
            "lambda_reg": 0.005,
            "optimizer": "adam",
            "learning_rate": 0.005,
            "epochs": 10,  # 測試用較少的 epochs
            "batch_size": 32,
            "seed": 42,
            "feature_version": "fe_v1"
        },
        "prediction_start_date": "2025-08-13",
        "prediction_end_date": "2025-08-14",
        "data_split_config": {
            "enabled": True,
            "train_ratio": 0.6,
            "validation_ratio": 0.2,
            "test_ratio": 0.2
        },
        # 動態 U 樣本生成配置
        "u_sample_time_range": {
            "start_date": "2025-08-13",
            "end_date": "2025-08-14",
            "start_time": "00:00",
            "end_time": "23:59"
        },
        "u_sample_building_floors": {
            "Building A": ["2"]
        },
        "u_sample_limit": 100
    }

    print("📋 發送訓練請求...")
    print(f"🔄 使用動態 U 樣本生成: {training_payload['u_sample_time_range'] is not None}")
    print(f"📅 U 樣本時間範圍: {training_payload['u_sample_time_range']}")
    print(f"🏢 U 樣本建築樓層: {training_payload['u_sample_building_floors']}")
    print(f"📊 U 樣本數量: {training_payload['u_sample_limit']}")

    try:
        # 發送訓練請求
        response = requests.post(
            "http://localhost:8000/api/v1/models/train-and-predict-v2",
            json=training_payload,
            headers={"Content-Type": "application/json"},
            timeout=30
        )

        print(f"\\n📡 請求狀態: {response.status_code}")

        if response.status_code == 200:
            result = response.json()
            print("✅ 訓練請求發送成功!")
            print(f"🆔 Job ID: {result.get('job_id')}")
            print(f"💬 Message: {result.get('message')}")

            job_id = result.get('job_id')
            if job_id:
                # 監控訓練進度
                print(f"\\n🔄 監控訓練進度...")
                final_result = monitor_training_progress(job_id)

                if final_result:
                    print("\\n🎊 測試完成!")
                    print(f"📈 最終結果: {json.dumps(final_result, indent=2, ensure_ascii=False)}")
                else:
                    print("\\n⚠️ 無法獲取最終結果")
            else:
                print("❌ 未獲得 Job ID")
        else:
            print(f"❌ 訓練請求失敗: {response.status_code}")
            try:
                error_detail = response.json()
                print(f"🔍 錯誤詳情: {json.dumps(error_detail, indent=2, ensure_ascii=False)}")
            except:
                print(f"🔍 錯誤詳情: {response.text}")

    except Exception as e:
        print(f"💥 測試過程中發生錯誤: {e}")

def main():
    """主函數"""
    print("🎯" + "="*60)
    print("🧪 PU Learning 動態 U 樣本訓練測試")
    print("📅 " + time.strftime("%Y-%m-%d %H:%M:%S"))
    print("🎯" + "="*60)

    # 1. 測試 API 連接性
    if not test_api_connectivity():
        print("❌ 請確保後端服務正在運行 (python3 main.py)")
        return

    print()

    # 2. 測試 PU Learning 訓練
    test_pu_training_with_dynamic_u_samples()

if __name__ == "__main__":
    main()
