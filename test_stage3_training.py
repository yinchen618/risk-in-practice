#!/usr/bin/env python3
"""
測試 Stage 3 互動式模型訓練功能
"""

import requests
import json
import time

API_BASE = "http://localhost:8000"

def test_experiment_runs_api():
    """測試實驗批次 API"""
    print("🧪 測試實驗批次 API...")
    
    # 1. 列出實驗批次
    response = requests.get(f"{API_BASE}/api/v1/experiment-runs")
    if response.status_code == 200:
        runs = response.json()
        print(f"✅ 找到 {len(runs.get('data', []))} 個實驗批次")
        return runs.get('data', [])
    else:
        print(f"❌ 無法獲取實驗批次列表: {response.status_code}")
        return []

def test_training_stats_api(run_id):
    """測試訓練統計 API"""
    print(f"🧪 測試訓練統計 API (run_id: {run_id[:8]}...)...")
    
    response = requests.get(f"{API_BASE}/api/v1/experiment-runs/{run_id}/training-stats")
    if response.status_code == 200:
        stats = response.json()
        print(f"✅ 訓練統計: P={stats.get('positiveSamples', 0)}, U={stats.get('unlabeledSamples', 0)}")
        return stats
    else:
        print(f"❌ 無法獲取訓練統計: {response.status_code}")
        return None

def test_training_data_preview_api(run_id):
    """測試訓練數據預覽 API"""
    print(f"🧪 測試訓練數據預覽 API (run_id: {run_id[:8]}...)...")
    
    response = requests.get(f"{API_BASE}/api/v1/experiment-runs/{run_id}/training-data-preview")
    if response.status_code == 200:
        preview = response.json()
        p_count = len(preview.get('pSamples', []))
        u_count = len(preview.get('uSamples', []))
        print(f"✅ 訓練數據預覽: {p_count} P樣本, {u_count} U樣本")
        
        # 檢查數據格式
        if p_count > 0:
            sample = preview['pSamples'][0]
            required_fields = ['x', 'y', 'id', 'category']
            missing_fields = [f for f in required_fields if f not in sample]
            if not missing_fields:
                print(f"✅ 數據格式正確，樣本範例: {sample}")
            else:
                print(f"⚠️ 數據格式缺少欄位: {missing_fields}")
        
        return preview
    else:
        print(f"❌ 無法獲取訓練數據預覽: {response.status_code}")
        return None

def test_model_training_api(run_id):
    """測試模型訓練 API"""
    print(f"🧪 測試模型訓練 API (run_id: {run_id[:8]}...)...")
    
    training_payload = {
        "experiment_run_id": run_id,
        "model_params": {
            "model_type": "nnPU",
            "prior_method": "median",
            "class_prior": None,
            "hidden_units": 100,
            "activation": "relu",
            "lambda_reg": 0.005,
            "optimizer": "adam",
            "learning_rate": 0.005,
            "epochs": 20,  # 較少的 epochs 用於測試
            "batch_size": 128,
            "seed": 42,
            "feature_version": "fe_v1"
        },
        "prediction_start_date": "2024-01-01",
        "prediction_end_date": "2024-12-31"
    }
    
    response = requests.post(
        f"{API_BASE}/api/v1/models/train-and-predict",
        json=training_payload,
        headers={"Content-Type": "application/json"}
    )
    
    if response.status_code == 200:
        result = response.json()
        job_id = result.get('job_id')
        print(f"✅ 訓練任務已啟動，Job ID: {job_id}")
        
        # 監控任務狀態
        for i in range(10):  # 檢查 10 次
            time.sleep(2)
            status_response = requests.get(f"{API_BASE}/api/v1/models/jobs/{job_id}")
            if status_response.status_code == 200:
                status = status_response.json()
                job_status = status.get('data', {}).get('status')
                progress = status.get('data', {}).get('progress', 0)
                print(f"📊 任務狀態: {job_status}, 進度: {progress}%")
                
                if job_status in ['COMPLETED', 'FAILED']:
                    break
            else:
                print(f"⚠️ 無法獲取任務狀態: {status_response.status_code}")
                break
        
        return result
    else:
        try:
            error_detail = response.json()
            print(f"❌ 訓練任務啟動失敗: {response.status_code}, 詳情: {error_detail}")
        except:
            print(f"❌ 訓練任務啟動失敗: {response.status_code}, {response.text}")
        return None

def main():
    """主測試函數"""
    print("🚀 開始測試 Stage 3 互動式模型訓練功能")
    print("=" * 60)
    
    # 測試實驗批次 API
    runs = test_experiment_runs_api()
    
    if not runs:
        print("❌ 沒有找到實驗批次，請先創建一些實驗數據")
        return
    
    # 選擇第一個實驗批次進行測試
    test_run = runs[0]
    run_id = test_run['id']
    
    print(f"\n📝 使用實驗批次: {test_run['name']} (ID: {run_id[:8]}...)")
    print("=" * 60)
    
    # 測試訓練統計 API
    test_training_stats_api(run_id)
    print()
    
    # 測試訓練數據預覽 API
    test_training_data_preview_api(run_id)
    print()
    
    # 測試模型訓練 API
    test_model_training_api(run_id)
    print()
    
    print("✅ 所有測試完成！")

if __name__ == "__main__":
    main()
