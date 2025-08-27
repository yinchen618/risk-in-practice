#!/usr/bin/env python3
"""
測試總數據池功能的實現
"""

import requests
import json

def test_total_data_pool_api():
    """測試 generate-candidates API 的總數據池功能"""
    url = "http://localhost:8000/api/v2/generate-candidates"

    # 測試數據 - 選擇一些數據集
    payload = {
        "filter_params": {
            "selectedDatasetIds": ["cm1f5s0ja0000rjv79zcq8k9z"],  # 假設這是一個有效的數據集ID
            "zScoreThreshold": 2.8,
            "spikeThreshold": 250,
            "minEventDuration": 45,
            "startDate": "2025-01-01",
            "startTime": "00:00",
            "endDate": "2025-01-31",
            "endTime": "23:59"
        },
        "save_labels": False  # 預覽模式
    }

    print("🧪 測試總數據池功能...")
    print(f"📤 請求 URL: {url}")
    print(f"📦 請求數據: {json.dumps(payload, indent=2)}")

    try:
        response = requests.post(url, json=payload, timeout=30)

        print(f"📥 響應狀態碼: {response.status_code}")

        if response.status_code == 200:
            data = response.json()
            print("✅ API 調用成功!")
            print(f"📊 響應數據: {json.dumps(data, indent=2)}")

            # 檢查總數據池相關字段
            required_fields = [
                'total_data_pool_size',
                'positive_label_count',
                'negative_label_count',
                'data_pool_summary'
            ]

            print("\n🔍 檢查總數據池相關字段:")
            for field in required_fields:
                if field in data:
                    print(f"✅ {field}: {data[field]}")
                else:
                    print(f"❌ 缺少字段: {field}")

            # 驗證數據邏輯
            if 'total_data_pool_size' in data and 'positive_label_count' in data and 'negative_label_count' in data:
                total = data['total_data_pool_size']
                positive = data['positive_label_count']
                negative = data['negative_label_count']

                print(f"\n🧮 數據邏輯驗證:")
                print(f"   總數據池大小: {total}")
                print(f"   正樣本數量: {positive}")
                print(f"   負樣本數量: {negative}")
                print(f"   總和: {positive + negative}")

                if total == positive + negative:
                    print("✅ 數據邏輯正確: 總數據池 = 正樣本 + 負樣本")
                else:
                    print("❌ 數據邏輯錯誤: 總數據池 != 正樣本 + 負樣本")

        else:
            print(f"❌ API 調用失敗: {response.status_code}")
            print(f"錯誤響應: {response.text}")

    except requests.exceptions.RequestException as e:
        print(f"❌ 請求異常: {e}")
    except Exception as e:
        print(f"❌ 其他錯誤: {e}")

def test_get_available_datasets():
    """獲取可用的數據集以便測試"""
    url = "http://localhost:8000/api/v2/analysis-datasets"

    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            datasets = response.json()
            print(f"📊 可用數據集數量: {len(datasets)}")

            if datasets:
                print("\n📋 前3個數據集:")
                for i, dataset in enumerate(datasets[:3]):
                    print(f"  {i+1}. ID: {dataset['id']}")
                    print(f"     名稱: {dataset['name']}")
                    print(f"     總記錄: {dataset['totalRecords']}")
                    print(f"     正標籤: {dataset['positiveLabels']}")
                    print()

                return [d['id'] for d in datasets[:2]]  # 返回前兩個數據集ID用於測試
        else:
            print(f"❌ 獲取數據集失敗: {response.status_code}")

    except Exception as e:
        print(f"❌ 獲取數據集時出錯: {e}")

    return []

if __name__ == "__main__":
    print("=" * 60)
    print("🚀 總數據池功能測試")
    print("=" * 60)

    # 首先獲取可用的數據集
    available_dataset_ids = test_get_available_datasets()

    if available_dataset_ids:
        print(f"\n🎯 使用數據集ID進行測試: {available_dataset_ids}")

        # 使用實際的數據集ID測試
        test_payload = {
            "filter_params": {
                "selectedDatasetIds": available_dataset_ids,
                "zScoreThreshold": 2.8,
                "spikeThreshold": 250,
                "minEventDuration": 45,
                "startDate": "2024-01-01",
                "startTime": "00:00",
                "endDate": "2024-12-31",
                "endTime": "23:59"
            },
            "save_labels": False
        }

        url = "http://localhost:8000/api/v2/generate-candidates"
        try:
            response = requests.post(url, json=test_payload, timeout=30)

            if response.status_code == 200:
                data = response.json()
                print("\n✅ 總數據池測試成功!")
                print("=" * 60)
                print(f"📊 完整響應數據: {json.dumps(data, indent=2)}")
                print("=" * 60)
                print("📊 總數據池統計:")

                if 'data_pool_summary' in data:
                    summary = data['data_pool_summary']
                    print(f"   📦 總數據集數量: {summary.get('total_datasets', 'N/A')}")
                    print(f"   📏 總數據池大小: {summary.get('total_pool_size', 'N/A'):,}")
                    print(f"   🟢 正樣本數量: {summary.get('positive_labels', 'N/A'):,}")
                    print(f"   🔴 負樣本數量: {summary.get('negative_labels', 'N/A'):,}")
                    print(f"   📈 正樣本比例: {summary.get('positive_ratio', 'N/A')}%")

                print(f"\n🎯 候選數量: {data.get('candidate_count', 'N/A')}")
                print("=" * 60)

            else:
                print(f"\n❌ 測試失敗: {response.status_code}")
                print(f"錯誤: {response.text}")

        except Exception as e:
            print(f"\n❌ 測試過程中出錯: {e}")
    else:
        print("\n⚠️ 沒有可用的數據集，跳過總數據池測試")
