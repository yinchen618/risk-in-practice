#!/usr/bin/env python3
"""
測試候選生成的一致性
"""

import requests
import json

def test_candidate_generation_consistency():
    """測試候選生成是否每次都產生相同的結果"""

    API_BASE = "http://localhost:8000/api/v2"

    # 標準化的測試參數
    test_params = {
        "filter_params": {
            "selectedDatasetIds": [],
            "buildings": ["Building-A"],
            "floors": ["2F", "3F"],
            "rooms": [],
            "occupantTypes": ["STUDENT"],
            "zScoreThreshold": 2.5,
            "spikeThreshold": 200,
            "minEventDuration": 30,
            "startDate": "2025-08-01",
            "startTime": "00:00",
            "endDate": "2025-08-25",
            "endTime": "23:59",
            "random_seed": 42  # 固定種子
        }
    }

    print("🧪 測試候選生成一致性...")
    print("=" * 60)

    results = []

    # 執行多次測試
    for i in range(5):
        try:
            response = requests.post(
                f"{API_BASE}/generate-candidates",
                json=test_params,
                headers={"Content-Type": "application/json"},
                timeout=30
            )

            if response.status_code == 200:
                data = response.json()
                candidate_count = data.get("candidate_count", 0)
                results.append(candidate_count)
                print(f"測試 {i+1}: {candidate_count} 個候選")
            else:
                print(f"測試 {i+1}: API 錯誤 {response.status_code}")
                results.append(None)

        except Exception as e:
            print(f"測試 {i+1}: 請求失敗 - {e}")
            results.append(None)

    # 分析結果
    print("\n" + "=" * 60)
    print("📊 結果分析:")

    valid_results = [r for r in results if r is not None]

    if len(valid_results) == 0:
        print("❌ 所有測試都失敗了")
        return False

    unique_counts = set(valid_results)

    if len(unique_counts) == 1:
        print(f"✅ 所有測試結果一致: {list(unique_counts)[0]} 個候選")
        print("🎯 候選生成已經是確定性的！")
        return True
    else:
        print(f"❌ 結果不一致: {unique_counts}")
        print(f"📈 最小值: {min(valid_results)}")
        print(f"📈 最大值: {max(valid_results)}")
        print(f"📈 平均值: {sum(valid_results) / len(valid_results):.1f}")
        print("💡 建議檢查是否還有隨機因子影響結果")
        return False

if __name__ == "__main__":
    test_candidate_generation_consistency()
