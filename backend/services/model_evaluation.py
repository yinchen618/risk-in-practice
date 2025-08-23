"""
模型評估服務 - 專門處理 Generalization Challenge 等跨域評估
"""

import asyncio
import json
import logging
import uuid
from datetime import datetime
from typing import Dict, List, Any, Optional, Tuple, Set
import numpy as np
import pandas as pd
import joblib
import os
from sklearn.metrics import precision_score, recall_score, f1_score, accuracy_score

# WebSocket 相關
from fastapi import WebSocket

logger = logging.getLogger(__name__)

# 全域變量用於追蹤評估任務和 WebSocket 連接
evaluation_jobs: Dict[str, Dict[str, Any]] = {}
evaluation_websocket_connections: Set[WebSocket] = set()
evaluation_websocket_lock = asyncio.Lock()  # 添加異步鎖保護 WebSocket 操作

class ModelEvaluator:
    """模型評估器"""

    def __init__(self):
        # 獲取項目根目錄
        current_dir = os.path.dirname(os.path.abspath(__file__))
        project_root = os.path.dirname(current_dir)
        self.models_dir = os.path.join(project_root, "trained_models")  # 模型保存目錄
        os.makedirs(self.models_dir, exist_ok=True)

        # 初始化資料庫管理器
        self.db_manager = None

    async def start_evaluation_job(self, model_id: str, evaluation_request: dict) -> str:
        """
        啟動異步評估任務

        Args:
            model_id: 要評估的模型ID
            evaluation_request: 評估請求配置

        Returns:
            str: 評估任務ID
        """
        job_id = str(uuid.uuid4())

        # 創建評估任務記錄
        evaluation_jobs[job_id] = {
            "id": job_id,
            "model_id": model_id,
            "status": "starting",
            "created_at": datetime.now().isoformat(),
            "progress": 0,
            "error": None,
            "results": None,
            "request": evaluation_request
        }

        # 在背景執行評估
        asyncio.create_task(self._run_evaluation(job_id, model_id, evaluation_request))

        logger.info(f"📊 評估任務已啟動: {job_id} for model {model_id}")
        return job_id

    async def _run_evaluation(self, job_id: str, model_id: str, evaluation_request: dict):
        """
        執行實際的模型評估

        Args:
            job_id: 評估任務ID
            model_id: 模型ID
            evaluation_request: 評估請求
        """
        try:
            logger.info(f"🚀 開始執行評估任務: {job_id}")

            # 更新狀態為進行中
            evaluation_jobs[job_id]["status"] = "running"
            evaluation_jobs[job_id]["progress"] = 10

            # 廣播進度更新
            await broadcast_evaluation_progress({
                "type": "prediction_progress",
                "progress": 10,
                "stage": "starting",
                "message": "Starting evaluation...",
                "job_id": job_id
            })

            # 1. 載入模型
            logger.info(f"📦 載入模型: {model_id}")
            # 初始化資料庫管理器
            if not self.db_manager:
                from database import db_manager
                self.db_manager = db_manager

            model_info = await self._load_model_info(model_id)
            if not model_info:
                raise Exception(f"找不到模型 {model_id}")

            evaluation_jobs[job_id]["progress"] = 20

            # 廣播進度更新
            await broadcast_evaluation_progress({
                "type": "prediction_progress",
                "progress": 20,
                "stage": "loading_model",
                "message": f"Model {model_id} loaded successfully",
                "job_id": job_id
            })

            # 2. 準備測試數據
            logger.info("📊 準備測試數據...")
            test_data = await self._prepare_test_data(evaluation_request, job_id)
            if test_data is None or test_data.empty:
                raise Exception("無法獲取測試數據：指定的時間範圍和建築樓層內沒有可用的異常事件數據")

            evaluation_jobs[job_id]["progress"] = 40

            # 廣播進度更新
            await broadcast_evaluation_progress({
                "type": "prediction_progress",
                "progress": 40,
                "stage": "preparing_data",
                "message": f"Test data prepared: {len(test_data)} samples",
                "job_id": job_id
            })

            # 3. 載入訓練好的模型
            logger.info("🔧 載入訓練好的模型...")
            trained_model = await self._load_trained_model(model_info)
            if trained_model is None:
                raise Exception("無法載入訓練好的模型")

            evaluation_jobs[job_id]["progress"] = 60

            # 廣播進度更新
            await broadcast_evaluation_progress({
                "type": "prediction_progress",
                "progress": 60,
                "stage": "loading_trained_model",
                "message": "Trained model loaded successfully",
                "job_id": job_id
            })

            # 4. 進行預測並創建 EvaluationRun 記錄
            logger.info("🎯 執行模型預測...")

            # 使用統一的預測工具（包含 EvaluationRun 管理）
            from services.prediction_utils import ModelPredictor

            # 準備評估配置
            evaluation_config = {
                "scenario_type": evaluation_request.get("scenario_type", "GENERALIZATION_CHALLENGE"),
                "name": evaluation_request.get("name", f"External Evaluation {job_id[:8]}"),
                "test_set_source": evaluation_request.get("test_set_source", {})
            }

            # 準備測試特徵
            X_test = await ModelPredictor.prepare_test_features(
                test_data,
                job_id=job_id,
                broadcast_progress_func=broadcast_evaluation_progress
            )

            # 進行預測並自動管理 EvaluationRun
            prediction_result = await ModelPredictor.make_predictions_with_evaluation_run(
                model=trained_model,
                X_test=X_test,
                y_test=test_data.get('ground_truth') if 'ground_truth' in test_data.columns else None,
                model_id=model_id,
                evaluation_config=evaluation_config,
                db_manager=self.db_manager,
                job_id=job_id,
                model_info=model_info
            )

            # 提取結果
            predictions = prediction_result["predictions"]
            metrics = prediction_result.get("evaluation_metrics", {})
            evaluation_run = prediction_result.get("evaluation_run")
            evaluation_run_id = prediction_result.get("evaluation_run_id")

            evaluation_jobs[job_id]["progress"] = 80

            # 廣播進度更新
            await broadcast_evaluation_progress({
                "type": "prediction_progress",
                "progress": 80,
                "stage": "predicting",
                "message": "Model predictions completed",
                "job_id": job_id
            })

            # 5. 處理評估指標
            logger.info("📈 處理評估指標...")

            # 如果沒有指標（沒有真實標籤），則創建基本的預測統計
            if not metrics:
                import numpy as np
                metrics = {
                    "prediction_stats": prediction_result["prediction_stats"],
                    "total_predictions": len(predictions),
                    "positive_predictions": int(np.sum(predictions)),
                    "negative_predictions": int(len(predictions) - np.sum(predictions))
                }

            evaluation_jobs[job_id]["progress"] = 100

            # 廣播進度更新
            await broadcast_evaluation_progress({
                "type": "prediction_progress",
                "progress": 100,
                "stage": "calculating_metrics",
                "message": "Evaluation metrics calculated",
                "job_id": job_id
            })

            # 6. 更新評估結果
            logger.info("💾 更新評估結果...")
            if evaluation_run:
                await self._update_evaluation_results(evaluation_run["id"], metrics)
            else:
                # 如果沒有創建 EvaluationRun，則創建一個
                await self._save_evaluation_results(job_id, model_id, evaluation_request, metrics)

            # 更新任務狀態為完成
            evaluation_jobs[job_id]["status"] = "completed"
            evaluation_jobs[job_id]["results"] = metrics

            # 廣播完成消息
            await broadcast_evaluation_progress({
                "type": "evaluation_completed",
                "progress": 100,
                "stage": "completed",
                "message": "Evaluation completed successfully",
                "job_id": job_id,
                "metrics": metrics
            })

            logger.info(f"✅ 評估任務完成: {job_id}")
            logger.info(f"📊 評估結果: {metrics}")

        except Exception as e:
            logger.error(f"❌ 評估任務失敗 {job_id}: {str(e)}")
            evaluation_jobs[job_id]["status"] = "failed"
            evaluation_jobs[job_id]["error"] = str(e)
            evaluation_jobs[job_id]["progress"] = 100

            # 廣播失敗消息
            await broadcast_evaluation_progress({
                "type": "evaluation_failed",
                "progress": 100,
                "stage": "failed",
                "message": f"Evaluation failed: {str(e)}",
                "job_id": job_id,
                "error": str(e)
            })

    async def _create_evaluation_run_record(
        self,
        job_id: str,
        model_id: str,
        evaluation_request: dict,
        model_info: dict
    ) -> Optional[dict]:
        """創建 EvaluationRun 記錄，包含詳細的 P/U 源資訊"""
        try:
            # 從 model_info 中提取 data_source_config
            data_source_config = model_info.get("data_source_config", {})
            p_source_config = data_source_config.get("p_source", {})
            u_source_config = data_source_config.get("u_source", {})
            prediction_config = data_source_config.get("prediction_config", {})

            # 構建詳細的測試集來源配置
            test_set_source = {
                "type": "external_evaluation",
                "evaluation_scenario": evaluation_request.get("scenario_type", "GENERALIZATION_CHALLENGE"),
                "job_id": job_id,
                "original_model_info": {
                    "model_id": model_id,
                    "scenario_type": model_info.get("scenario_type", "ERM_BASELINE"),
                    "experiment_run_id": model_info.get("experiment_run_id")
                },
                "p_source": {
                    "type": p_source_config.get("type", "anomaly_events"),
                    "experiment_run_id": p_source_config.get("experiment_run_id"),
                    "filter_criteria": p_source_config.get("filter_criteria"),
                    "description": p_source_config.get("description", "Positive samples from training data")
                },
                "u_source": {
                    "type": u_source_config.get("type", "anomaly_events"),
                    "time_range": u_source_config.get("time_range"),
                    "building_floors": u_source_config.get("building_floors"),
                    "sample_limit": u_source_config.get("sample_limit"),
                    "experiment_run_id": u_source_config.get("experiment_run_id"),
                    "filter_criteria": u_source_config.get("filter_criteria"),
                    "description": u_source_config.get("description", "Unlabeled samples from training data")
                },
                "prediction_period": {
                    "start_date": prediction_config.get("start_date"),
                    "end_date": prediction_config.get("end_date")
                },
                "evaluation_config": evaluation_request.get("test_set_source", {}),
                "timestamp": datetime.now().isoformat()
            }

            # 創建 EvaluationRun 記錄
            evaluation_run = await self.db_manager.create_evaluation_run(
                name=evaluation_request.get("name", f"External Evaluation {job_id[:8]}"),
                scenario_type=evaluation_request.get("scenario_type", "GENERALIZATION_CHALLENGE"),
                trained_model_id=model_id,
                test_set_source=test_set_source
            )

            logger.info(f"✅ 創建 EvaluationRun 記錄: {evaluation_run['id']}")
            logger.info(f"📊 P源類型: {p_source_config.get('type')}, U源類型: {u_source_config.get('type')}")

            return evaluation_run

        except Exception as e:
            logger.error(f"❌ 創建 EvaluationRun 記錄失敗: {e}")
            return None

    async def _load_model_info(self, model_id: str) -> Dict[str, Any]:
        """載入模型信息"""
        try:
            from database import db_manager
            model_info = await db_manager.get_trained_model_by_id(model_id)
            return model_info
        except Exception as e:
            logger.error(f"載入模型信息失敗: {e}")
            return None

    async def _prepare_test_data(self, evaluation_request: dict, job_id: str = None) -> pd.DataFrame:
        """
        準備測試數據

        Args:
            evaluation_request: 評估請求，包含 test_set_source 配置

        Returns:
            pd.DataFrame: 測試數據
        """
        try:
            from database import db_manager

            test_source = evaluation_request.get("test_set_source", {})

            # 從 test_set_source 中提取配置
            selected_floors_by_building = test_source.get("selectedFloorsByBuilding", {})
            time_range = test_source.get("timeRange_detail", {})

            if not selected_floors_by_building or not time_range:
                logger.error("測試集配置不完整")
                return None

            start_date = time_range.get("startDate")
            end_date = time_range.get("endDate")
            start_time = time_range.get("startTime", "00:00")
            end_time = time_range.get("endTime", "23:59")

            logger.info(f"🎯 測試數據範圍:")
            logger.info(f"   📅 日期: {start_date} 到 {end_date}")
            logger.info(f"   ⏰ 時間: {start_time} 到 {end_time}")
            logger.info(f"   🏢 建築樓層: {selected_floors_by_building}")

            # 獲取測試數據 - 這裡使用實際的異常事件數據作為測試集
            test_data = await db_manager.get_anomaly_events_for_evaluation(
                selected_floors_by_building=selected_floors_by_building,
                start_date=start_date,
                end_date=end_date,
                start_time=start_time,
                end_time=end_time
            )

            if test_data is not None and not test_data.empty:
                logger.info(f"✅ 成功獲取測試數據: {len(test_data)} 條記錄")

                # 廣播測試數據準備完成
                await broadcast_evaluation_progress({
                    "type": "prediction_progress",
                    "progress": 30,
                    "stage": "test_data_ready",
                    "message": f"Test data prepared: {len(test_data)} samples found",
                    "job_id": job_id
                })

                return test_data
            else:
                logger.error("❌ 指定的時間範圍和建築樓層內沒有可用的測試數據")

                # 廣播數據不足錯誤
                await broadcast_evaluation_progress({
                    "type": "evaluation_failed",
                    "progress": 30,
                    "stage": "no_test_data",
                    "message": "No test data found in the specified time range and building floors",
                    "error": "No test data available"
                })

                return None

        except Exception as e:
            logger.error(f"準備測試數據失敗: {e}")
            return None

    async def _load_trained_model(self, model_info: dict):
        """載入訓練好的模型"""
        try:
            model_path = model_info.get("model_path")
            if not model_path or not os.path.exists(model_path):
                logger.error(f"模型文件不存在: {model_path}")
                return None

            # 載入模型數據
            model_data = joblib.load(model_path)
            logger.info(f"✅ 成功載入模型數據: {model_path}")

            # 檢查模型數據格式
            if isinstance(model_data, dict) and "model" in model_data:
                # 新格式：模型保存為字典，實際模型在 "model" 鍵下
                model = model_data["model"]
                logger.info(f"🔧 提取模型對象，類型: {type(model)}")
            else:
                # 舊格式：直接保存的模型對象
                model = model_data
                logger.info(f"🔧 直接載入模型對象，類型: {type(model)}")

            return model

        except Exception as e:
            logger.error(f"載入模型失敗: {e}")
            return None

    async def _make_predictions(self, model, test_data: pd.DataFrame, job_id: str = None) -> np.ndarray:
        """使用模型進行預測"""
        try:
            from services.feature_engineering import feature_engineering

            logger.info(f"🔧 測試數據格式: columns={test_data.columns.tolist()}, shape={test_data.shape}")

            # 廣播數據準備階段
            await broadcast_evaluation_progress({
                "type": "prediction_progress",
                "progress": 75,
                "stage": "data_preprocessing",
                "message": f"正在處理 {len(test_data)} 條測試數據",
                "job_id": job_id,
                "details": {
                    "samples_count": len(test_data),
                    "features_available": test_data.columns.tolist()
                }
            })

            # 檢查測試數據的格式
            if 'dataWindow' in test_data.columns:
                # 如果是異常事件格式，直接轉換
                test_events = test_data.to_dict('records')
                logger.info(f"🔧 使用異常事件格式，轉換為 {len(test_events)} 個事件")

                # 廣播特徵工程進度
                await broadcast_evaluation_progress({
                    "type": "prediction_detail",
                    "progress": 78,
                    "stage": "feature_engineering",
                    "message": "正在從異常事件數據生成特徵",
                    "details": {
                        "data_format": "anomaly_events",
                        "events_count": len(test_events)
                    }
                })

                # 使用相同的特徵工程方法生成特徵矩陣
                feature_matrix, _ = feature_engineering.generate_feature_matrix(test_events)
            else:
                # 如果是模擬特徵數據，直接構建特徵矩陣
                logger.info("🔧 檢測到真實特徵數據格式，直接構建特徵矩陣")

                # 廣播特徵處理進度
                await broadcast_evaluation_progress({
                    "type": "prediction_detail",
                    "progress": 78,
                    "stage": "feature_engineering",
                    "message": "正在處理真實電表數據特徵",
                    "details": {
                        "data_format": "real_meter_data",
                        "samples_count": len(test_data),
                        "meters_count": test_data['meter_id'].nunique() if 'meter_id' in test_data.columns else "未知"
                    }
                })

                feature_columns = [
                    'power_consumption', 'power_variance', 'power_trend', 'power_max', 'power_min',
                    'power_std', 'power_range', 'hour_of_day', 'day_of_week', 'is_weekend'
                ]

                # 確保所有需要的列都存在
                available_features = []
                for col in feature_columns:
                    if col in test_data.columns:
                        available_features.append(test_data[col].values)
                    else:
                        logger.warning(f"缺少特徵列: {col}，使用默認值0")
                        available_features.append(np.zeros(len(test_data)))

                # 添加額外的特徵以匹配訓練時的17維特徵向量
                # 補齊到17維特徵
                while len(available_features) < 17:
                    available_features.append(np.zeros(len(test_data)))

                # 構建特徵矩陣
                feature_matrix = np.column_stack(available_features[:17])
                logger.info(f"🔧 構建特徵矩陣: shape={feature_matrix.shape}")

            logger.info(f"🔧 特徵矩陣生成完成: shape={feature_matrix.shape}")

            # 廣播特徵標準化進度
            await broadcast_evaluation_progress({
                "type": "prediction_detail",
                "progress": 82,
                "stage": "feature_normalization",
                "message": "正在標準化特徵數據",
                "details": {
                    "feature_matrix_shape": feature_matrix.shape,
                    "features_dimension": feature_matrix.shape[1]
                }
            })

            # 標準化特徵（使用訓練時的標準化參數）
            X_test = feature_engineering.transform_features(feature_matrix)

            # 處理 NaN 值
            if np.isnan(X_test).any():
                logger.warning("⚠️ Found NaN values in test feature matrix, filling with 0")
                X_test = np.nan_to_num(X_test, nan=0.0)

            # 廣播模型預測進度
            await broadcast_evaluation_progress({
                "type": "prediction_detail",
                "progress": 85,
                "stage": "model_inference",
                "message": "正在執行模型推理",
                "details": {
                    "input_shape": X_test.shape,
                    "model_type": str(type(model).__name__)
                }
            })

            # 進行預測
            if hasattr(model, 'predict_proba'):
                # 如果有 predict_proba 方法，獲取正類概率
                probabilities = model.predict_proba(X_test)
                predictions = (probabilities[:, 1] > 0.5).astype(int)

                # 廣播預測完成詳情
                await broadcast_evaluation_progress({
                    "type": "prediction_detail",
                    "progress": 88,
                    "stage": "prediction_completed",
                    "message": "模型預測完成，正在分析結果",
                    "details": {
                        "prediction_method": "probability_based",
                        "positive_predictions": int(np.sum(predictions)),
                        "negative_predictions": int(len(predictions) - np.sum(predictions)),
                        "prediction_distribution": np.bincount(predictions).tolist()
                    }
                })
            else:
                # 否則直接預測
                predictions = model.predict(X_test)

                # 廣播預測完成詳情
                await broadcast_evaluation_progress({
                    "type": "prediction_detail",
                    "progress": 88,
                    "stage": "prediction_completed",
                    "message": "模型預測完成，正在分析結果",
                    "details": {
                        "prediction_method": "direct_prediction",
                        "positive_predictions": int(np.sum(predictions)),
                        "negative_predictions": int(len(predictions) - np.sum(predictions)),
                        "prediction_distribution": np.bincount(predictions).tolist()
                    }
                })

            logger.info(f"✅ 預測完成，預測結果分佈: {np.bincount(predictions)}")
            return predictions

        except Exception as e:
            logger.error(f"預測失敗: {e}")

            # 廣播錯誤信息
            await broadcast_evaluation_progress({
                "type": "prediction_error",
                "progress": 0,
                "stage": "prediction_failed",
                "message": f"預測過程發生錯誤: {str(e)}",
                "details": {
                    "error_type": type(e).__name__,
                    "error_message": str(e)
                }
            })

            raise Exception(f"模型預測失敗: {str(e)}")

    async def _calculate_metrics(self, test_data: pd.DataFrame, predictions: np.ndarray) -> Dict[str, float]:
        """計算評估指標"""
        try:
            # 廣播指標計算開始
            await broadcast_evaluation_progress({
                "type": "metrics_calculation",
                "progress": 90,
                "stage": "metrics_analysis",
                "message": "正在分析預測結果並計算評估指標",
                "details": {
                    "total_predictions": len(predictions),
                    "positive_predictions": int(np.sum(predictions)),
                    "negative_predictions": int(len(predictions) - np.sum(predictions))
                }
            })

            # 檢查是否有真實標籤
            if 'is_anomaly' in test_data.columns:
                y_true = test_data['is_anomaly'].values

                # 廣播真實標籤對比
                await broadcast_evaluation_progress({
                    "type": "metrics_calculation",
                    "progress": 92,
                    "stage": "label_comparison",
                    "message": "發現真實標籤，正在計算精確指標",
                    "details": {
                        "has_true_labels": True,
                        "true_anomalies": int(np.sum(y_true)),
                        "true_normals": int(len(y_true) - np.sum(y_true))
                    }
                })

                # 計算各種指標
                accuracy = accuracy_score(y_true, predictions)
                precision = precision_score(y_true, predictions, zero_division=0)
                recall = recall_score(y_true, predictions, zero_division=0)
                f1 = f1_score(y_true, predictions, zero_division=0)

                # 計算混淆矩陣元素
                tp = int(np.sum((y_true == 1) & (predictions == 1)))
                fp = int(np.sum((y_true == 0) & (predictions == 1)))
                fn = int(np.sum((y_true == 1) & (predictions == 0)))
                tn = int(np.sum((y_true == 0) & (predictions == 0)))

                metrics = {
                    "test_accuracy": float(accuracy),
                    "test_precision": float(precision),
                    "test_recall": float(recall),
                    "test_f1": float(f1),
                    "test_samples": len(test_data),
                    "positive_predictions": int(np.sum(predictions)),
                    "true_positives": tp,
                    "false_positives": fp,
                    "false_negatives": fn,
                    "true_negatives": tn
                }

                # 廣播完整指標結果
                await broadcast_evaluation_progress({
                    "type": "metrics_calculated",
                    "progress": 95,
                    "stage": "metrics_completed",
                    "message": "評估指標計算完成",
                    "details": {
                        "has_true_labels": True,
                        "accuracy": float(accuracy),
                        "precision": float(precision),
                        "recall": float(recall),
                        "f1_score": float(f1),
                        "confusion_matrix": {
                            "true_positives": tp,
                            "false_positives": fp,
                            "false_negatives": fn,
                            "true_negatives": tn
                        }
                    }
                })

            else:
                # 對於模擬數據，沒有真實標籤，只報告預測統計
                logger.warning("⚠️ 測試數據中沒有真實標籤 'is_anomaly'，使用模擬評估")

                # 廣播模擬評估信息
                await broadcast_evaluation_progress({
                    "type": "metrics_calculation",
                    "progress": 92,
                    "stage": "simulated_evaluation",
                    "message": "無真實標籤，正在生成模擬評估指標",
                    "details": {
                        "has_true_labels": False,
                        "evaluation_type": "simulated",
                        "data_source": "real_meter_data"
                    }
                })

                # 為了演示目的，生成一些模擬真實標籤（基於功率異常）
                if 'power_consumption' in test_data.columns:
                    # 簡單規則：功率消耗超過均值+2倍標準差的視為異常
                    power_mean = test_data['power_consumption'].mean()
                    power_std = test_data['power_consumption'].std()
                    threshold = power_mean + 2 * power_std
                    simulated_labels = (test_data['power_consumption'] > threshold).astype(int)

                    logger.info(f"🔧 使用功率閾值 {threshold:.2f} 生成模擬標籤")
                else:
                    # 隨機生成一些異常標籤（約8%的異常率）
                    anomaly_rate = 0.08
                    num_anomalies = int(len(predictions) * anomaly_rate)
                    simulated_labels = np.zeros(len(predictions))
                    anomaly_indices = np.random.choice(len(predictions), num_anomalies, replace=False)
                    simulated_labels[anomaly_indices] = 1

                    logger.info(f"🔧 隨機生成 {num_anomalies} 個模擬異常標籤")

                simulated_labels = simulated_labels.astype(int)

                # 計算模擬指標
                accuracy = accuracy_score(simulated_labels, predictions)
                precision = precision_score(simulated_labels, predictions, zero_division=0)
                recall = recall_score(simulated_labels, predictions, zero_division=0)
                f1 = f1_score(simulated_labels, predictions, zero_division=0)

                # 計算混淆矩陣元素
                tp = int(np.sum((simulated_labels == 1) & (predictions == 1)))
                fp = int(np.sum((simulated_labels == 0) & (predictions == 1)))
                fn = int(np.sum((simulated_labels == 1) & (predictions == 0)))
                tn = int(np.sum((simulated_labels == 0) & (predictions == 0)))

                metrics = {
                    "test_accuracy": float(accuracy),
                    "test_precision": float(precision),
                    "test_recall": float(recall),
                    "test_f1": float(f1),
                    "test_samples": len(test_data),
                    "positive_predictions": int(np.sum(predictions)),
                    "simulated_labels": True,
                    "true_positives": tp,
                    "false_positives": fp,
                    "false_negatives": fn,
                    "true_negatives": tn
                }

                # 廣播模擬指標結果
                await broadcast_evaluation_progress({
                    "type": "metrics_calculated",
                    "progress": 95,
                    "stage": "simulated_metrics_completed",
                    "message": "模擬評估指標計算完成",
                    "details": {
                        "has_true_labels": False,
                        "evaluation_type": "simulated",
                        "simulated_accuracy": float(accuracy),
                        "simulated_precision": float(precision),
                        "simulated_recall": float(recall),
                        "simulated_f1": float(f1),
                        "confusion_matrix": {
                            "true_positives": tp,
                            "false_positives": fp,
                            "false_negatives": fn,
                            "true_negatives": tn
                        }
                    }
                })

            return metrics

        except Exception as e:
            logger.error(f"計算指標失敗: {e}")

            # 廣播指標計算錯誤
            await broadcast_evaluation_progress({
                "type": "metrics_error",
                "progress": 0,
                "stage": "metrics_failed",
                "message": f"指標計算發生錯誤: {str(e)}",
                "details": {
                    "error_type": type(e).__name__,
                    "error_message": str(e)
                }
            })

            return {
                "test_accuracy": 0.0,
                "test_precision": 0.0,
                "test_recall": 0.0,
                "test_f1": 0.0,
                "test_samples": len(test_data),
                "error": str(e)
            }

    async def _save_evaluation_results(self, job_id: str, model_id: str, evaluation_request: dict, metrics: dict):
        """保存評估結果到數據庫"""
        try:
            from database import db_manager

            # 創建評估記錄
            await db_manager.create_evaluation_run(
                name=evaluation_request.get("name", f"Evaluation {job_id}"),
                trained_model_id=model_id,
                scenario_type=evaluation_request.get("scenario_type", "GENERALIZATION_CHALLENGE"),
                test_set_source=evaluation_request.get("test_set_source", {}),
                evaluation_metrics=metrics
            )

            logger.info(f"✅ 評估結果已保存: {job_id}")

        except Exception as e:
            logger.error(f"保存評估結果失敗: {e}")

    async def _update_evaluation_results(self, evaluation_run_id: str, metrics: dict):
        """更新已存在的 EvaluationRun 記錄"""
        try:
            await self.db_manager.update_evaluation_run(
                evaluation_run_id,
                status="COMPLETED",
                evaluation_metrics=metrics
            )
            logger.info(f"✅ 評估結果已更新: {evaluation_run_id}")
        except Exception as e:
            logger.error(f"更新評估結果失敗: {e}")

    def get_evaluation_status(self, job_id: str) -> Dict[str, Any]:
        """獲取評估任務狀態"""
        return evaluation_jobs.get(job_id, {
            "status": "not_found",
            "error": "Evaluation job not found"
        })

# 創建全域評估器實例
evaluator = ModelEvaluator()

# ========================
# WebSocket 管理函數
# ========================

async def broadcast_evaluation_progress(message: dict):
    """
    向所有連接的 WebSocket 客戶端廣播評估進度

    Args:
        message: 要廣播的消息字典
    """
    if not evaluation_websocket_connections:
        logger.debug("📡 No WebSocket connections to broadcast to")
        return

    async with evaluation_websocket_lock:
        logger.info(f"🔌 WebSocket Connections: {len(evaluation_websocket_connections)}")
        logger.info(f"📡 Broadcasting evaluation message: {message}")

        # 創建連接副本以避免在迭代期間修改集合
        connections_copy = list(evaluation_websocket_connections)

        for ws in connections_copy:
            try:
                # 檢查連接是否仍然有效
                if ws.client_state.name == "DISCONNECTED":
                    logger.warning("🔌 WebSocket already disconnected, removing...")
                    evaluation_websocket_connections.discard(ws)
                    continue

                await ws.send_text(json.dumps(message))
                logger.debug(f"✅ Successfully sent message to WebSocket: {id(ws)}")

            except Exception as e:
                logger.error(f"❌ Failed to send WebSocket message to {id(ws)}: {e}")
                # 移除失效的連接
                try:
                    evaluation_websocket_connections.discard(ws)
                    logger.info(f"🗑️ Removed invalid WebSocket connection: {id(ws)}")
                except Exception as cleanup_error:
                    logger.error(f"❌ Error cleaning up WebSocket: {cleanup_error}")

async def add_evaluation_websocket_connection(websocket: WebSocket):
    """添加評估 WebSocket 連接"""
    async with evaluation_websocket_lock:
        evaluation_websocket_connections.add(websocket)
        logger.info(f"✅ Added evaluation WebSocket connection: {id(websocket)}")

    logger.info(f"📊 Total evaluation connections: {len(evaluation_websocket_connections)}")

async def remove_evaluation_websocket_connection(websocket: WebSocket):
    """移除評估 WebSocket 連接"""
    async with evaluation_websocket_lock:
        evaluation_websocket_connections.discard(websocket)
        logger.info(f"🗑️ Removed evaluation WebSocket connection: {id(websocket)}")

    logger.info(f"📊 Remaining evaluation connections: {len(evaluation_websocket_connections)}")

# 導出供外部使用的函數
__all__ = [
    'evaluator',
    'evaluation_jobs',
    'add_evaluation_websocket_connection',
    'remove_evaluation_websocket_connection',
    'broadcast_evaluation_progress'
]
