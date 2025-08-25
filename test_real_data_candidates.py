#!/usr/bin/env python3
"""
測試使用真實數據的候選生成功能
"""

import requests
import json

def test_real_data_candidate_generation():
    """測試基於真實數據的候選生成"""
    print("🧪 測試真實數據候選生成...")
    print("="*60)

    # API 端點
    url = "http://localhost:8000/api/v2/generate-candidates"

    # 測試配置 - 使用真實的過濾參數
    test_config = {
        "filter_params": {
            "buildings": ["Building-A"],
            "floors": ["2F"],
            "rooms": ["Room-01", "Room-02"],
            "occupantTypes": ["STUDENT"],
            "zScoreThreshold": 2.5,
            "spikeThreshold": 800.0,  # 800W 閾值
            "minEventDuration": 30,   # 30 分鐘最小持續時間
            "startDate": "2025-01-01",
            "endDate": "2025-12-31"
        }
    }

    print("📋 測試參數:")
    print(f"   建築物: {test_config['filter_params']['buildings']}")
    print(f"   樓層: {test_config['filter_params']['floors']}")
    print(f"   房間: {test_config['filter_params']['rooms']}")
    print(f"   Z-score 閾值: {test_config['filter_params']['zScoreThreshold']}")
    print(f"   功率峰值閾值: {test_config['filter_params']['spikeThreshold']}W")
    print(f"   最小事件持續時間: {test_config['filter_params']['minEventDuration']} 分鐘")

    # 執行多次測試確認結果一致
    results = []

    for i in range(3):
        print(f"\n🔄 測試 #{i+1}...")
        try:
            response = requests.post(url, json=test_config, timeout=60)

            if response.status_code == 200:
                data = response.json()
                candidate_count = data.get('candidate_count', 0)
                results.append(candidate_count)

                print(f"✅ 成功: {candidate_count} 個候選")
                print(f"   實驗 ID: {data.get('experiment_run_id', 'N/A')}")
                print(f"   篩選數據集數: {data.get('filtered_datasets_count', 0)}")

            else:
                print(f"❌ API 錯誤: {response.status_code}")
                print(f"   回應: {response.text}")
                results.append(None)

        except Exception as e:
            print(f"❌ 請求失敗: {e}")
            results.append(None)

    # 分析結果
    print(f"\n📊 結果分析:")
    print(f"   所有結果: {results}")

    valid_results = [r for r in results if r is not None]

    if valid_results:
        if len(set(valid_results)) == 1:
            print(f"✅ 結果完全一致: {valid_results[0]} 個候選")
            print("🎯 真實數據分析成功 - 結果具有確定性！")
        else:
            print(f"❌ 結果不一致:")
            for i, result in enumerate(valid_results):
                print(f"     測試 #{i+1}: {result}")
            print("⚠️  需要進一步檢查為什麼結果不一致")
    else:
        print("❌ 所有測試都失敗了")

    return valid_results

if __name__ == "__main__":
    test_real_data_candidate_generation()
