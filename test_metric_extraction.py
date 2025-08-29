#!/usr/bin/env python3
"""
測試已完成模型的指標提取
"""
import requests
import json

def test_metric_extraction():
    """測試從已完成的模型中提取指標"""
    print("🧪 測試指標提取功能")
    print("=" * 50)

    # 獲取最近完成的模型
    response = requests.get("http://localhost:8000/api/v2/trained-models")
    if response.status_code == 200:
        models = response.json()

        # 找到最近的 Quick_ 測試模型
        test_models = [m for m in models if m.get('name', '').startswith('ERM_BASELINE_Quick_') and m.get('status') == 'COMPLETED']

        if test_models:
            # 取第一個測試模型
            model = test_models[0]
            print(f"📊 測試模型: {model['name']}")
            print(f"📊 狀態: {model['status']}")

            # 檢查指標字段
            training_metrics = model.get('training_metrics') or model.get('trainingMetrics')
            validation_metrics = model.get('validation_metrics') or model.get('validationMetrics')

            print(f"📊 訓練指標存在: {training_metrics is not None}")
            print(f"📊 驗證指標存在: {validation_metrics is not None}")

            if training_metrics:
                metrics = training_metrics if isinstance(training_metrics, dict) else json.loads(training_metrics)

                print(f"✅ F1 Score: {metrics.get('best_val_f1_score', 'N/A')}")
                print(f"✅ Test F1 Score: {metrics.get('final_test_f1_score', 'N/A')}")
                print(f"✅ Precision: {metrics.get('final_test_precision', 'N/A')}")
                print(f"✅ Recall: {metrics.get('final_test_recall', 'N/A')}")
                print(f"✅ 訓練時間: {metrics.get('training_time_seconds', 'N/A')}s")
                print(f"✅ 訓練輪數: {metrics.get('total_epochs_trained', 'N/A')}")

                # 顯示前幾個指標鍵
                print(f"📋 可用指標鍵 (前10個): {list(metrics.keys())[:10]}")

            else:
                print("❌ 沒有找到訓練指標")
                print(f"📋 可用字段: {list(model.keys())}")
        else:
            print("❌ 沒有找到已完成的測試模型")
    else:
        print(f"❌ 無法獲取模型列表: {response.status_code}")

if __name__ == "__main__":
    test_metric_extraction()
