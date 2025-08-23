"""
預測工具模組 - 提供統一的模型預測功能
"""

import logging
import numpy as np
import pandas as pd
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime

logger = logging.getLogger(__name__)

class ModelPredictor:
    """統一的模型預測器"""

    @staticmethod
    async def make_predictions_with_evaluation_run(
        model: Any,
        X_test: np.ndarray,
        y_test: Optional[np.ndarray] = None,
        model_id: str = None,
        evaluation_config: Optional[Dict[str, Any]] = None,
        db_manager = None,
        job_id: Optional[str] = None,
        model_info: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        使用模型進行預測並自動管理 EvaluationRun 記錄

        Args:
            model: 訓練好的模型
            X_test: 測試特徵矩陣
            y_test: 測試標籤（可選，如果提供則計算指標）
            model_id: 模型ID
            evaluation_config: 評估配置
            db_manager: 資料庫管理器
            job_id: 作業ID（可選）
            model_info: 模型資訊（可選）

        Returns:
            Dict: 包含預測結果、指標和 evaluation_run_id 的字典
        """
        evaluation_run = None
        evaluation_run_id = None

        try:
            logger.info(f"🔮 開始模型預測和評估記錄，測試樣本數: {len(X_test)}")

            # 1. 創建 EvaluationRun 記錄
            if model_id and db_manager and evaluation_config:
                evaluation_run = await ModelPredictor._create_evaluation_run(
                    model_id=model_id,
                    evaluation_config=evaluation_config,
                    model_info=model_info,
                    job_id=job_id,
                    db_manager=db_manager
                )
                evaluation_run_id = evaluation_run["id"] if evaluation_run else None
                logger.info(f"✅ 創建 EvaluationRun 記錄: {evaluation_run_id}")

            # 2. 進行預測
            prediction_result = await ModelPredictor.make_predictions_with_metrics(
                model=model,
                X_test=X_test,
                y_test=y_test,
                evaluation_run_id=evaluation_run_id,
                db_manager=db_manager
            )

            # 3. 更新 EvaluationRun 狀態
            if evaluation_run and db_manager:
                metrics = prediction_result.get("evaluation_metrics", {})
                try:
                    await db_manager.update_evaluation_run(
                        evaluation_run_id,
                        status="COMPLETED",
                        evaluation_metrics=metrics
                    )
                    logger.info(f"✅ 更新 EvaluationRun {evaluation_run_id} 完成")
                except Exception as e:
                    logger.error(f"❌ 更新 EvaluationRun 失敗: {e}")
                    try:
                        await db_manager.update_evaluation_run(evaluation_run_id, status="FAILED")
                    except:
                        pass

            # 添加 evaluation_run_id 到結果中
            prediction_result["evaluation_run_id"] = evaluation_run_id
            prediction_result["evaluation_run"] = evaluation_run

            return prediction_result

        except Exception as e:
            logger.error(f"❌ 預測和評估記錄失敗: {e}")

            # 如果失敗，標記 EvaluationRun 為失敗
            if evaluation_run and db_manager:
                try:
                    await db_manager.update_evaluation_run(evaluation_run_id, status="FAILED")
                except:
                    pass

            raise e

    @staticmethod
    async def _create_evaluation_run(
        model_id: str,
        evaluation_config: Dict[str, Any],
        model_info: Optional[Dict[str, Any]],
        job_id: Optional[str],
        db_manager
    ) -> Optional[Dict[str, Any]]:
        """創建 EvaluationRun 記錄"""
        try:
            # 確定評估場景類型
            scenario_type = evaluation_config.get("scenario_type", "ERM_BASELINE")

            # 確定評估名稱
            if "name" in evaluation_config:
                eval_name = evaluation_config["name"]
            elif job_id:
                eval_name = f"External Evaluation {job_id[:8]}"
            else:
                eval_name = f"Test Set Evaluation - {model_info.get('name', 'Unknown Model') if model_info else 'Unknown Model'}"

            # 構建 test_set_source
            test_set_source = ModelPredictor._build_test_set_source(
                evaluation_config, model_info, job_id
            )

            # 創建 EvaluationRun 記錄
            evaluation_run = await db_manager.create_evaluation_run(
                name=eval_name,
                scenario_type=scenario_type,
                trained_model_id=model_id,
                test_set_source=test_set_source
            )

            return evaluation_run

        except Exception as e:
            logger.error(f"❌ 創建 EvaluationRun 記錄失敗: {e}")
            return None

    @staticmethod
    def _build_test_set_source(
        evaluation_config: Dict[str, Any],
        model_info: Optional[Dict[str, Any]],
        job_id: Optional[str]
    ) -> Dict[str, Any]:
        """構建 test_set_source 配置"""

        # 基本配置
        test_set_source = {
            "timestamp": datetime.now().isoformat()
        }

        # 如果是外部評估（通過 /evaluate API）
        if job_id:
            test_set_source.update({
                "type": "external_evaluation",
                "evaluation_scenario": evaluation_config.get("scenario_type", "GENERALIZATION_CHALLENGE"),
                "job_id": job_id,
                "evaluation_config": evaluation_config.get("test_set_source", {}),
                "original_model_info": {
                    "model_id": model_info.get("id") if model_info else None,
                    "scenario_type": model_info.get("scenario_type") if model_info else None,
                    "experiment_run_id": model_info.get("experiment_run_id") if model_info else None
                }
            })

            # 如果有模型資訊，加入詳細的 P/U 源資訊
            if model_info:
                data_source_config = model_info.get("data_source_config", {})
                test_set_source.update({
                    "p_source": {
                        "type": data_source_config.get("p_source", {}).get("type", "anomaly_events"),
                        "experiment_run_id": data_source_config.get("p_source", {}).get("experiment_run_id"),
                        "filter_criteria": data_source_config.get("p_source", {}).get("filter_criteria"),
                        "description": data_source_config.get("p_source", {}).get("description", "Positive samples from training data")
                    },
                    "u_source": {
                        "type": data_source_config.get("u_source", {}).get("type", "anomaly_events"),
                        "time_range": data_source_config.get("u_source", {}).get("time_range"),
                        "building_floors": data_source_config.get("u_source", {}).get("building_floors"),
                        "sample_limit": data_source_config.get("u_source", {}).get("sample_limit"),
                        "experiment_run_id": data_source_config.get("u_source", {}).get("experiment_run_id"),
                        "filter_criteria": data_source_config.get("u_source", {}).get("filter_criteria"),
                        "description": data_source_config.get("u_source", {}).get("description", "Unlabeled samples from training data")
                    },
                    "prediction_period": {
                        "start_date": data_source_config.get("prediction_config", {}).get("start_date"),
                        "end_date": data_source_config.get("prediction_config", {}).get("end_date")
                    }
                })
        else:
            # 如果是訓練期間的測試集評估
            test_set_source.update({
                "type": "auto_split_from_training",
                "scenario_type": evaluation_config.get("scenario_type", "ERM_BASELINE")
            })

            if model_info:
                data_source_config = model_info.get("data_source_config", {})
                data_split_config = data_source_config.get("data_split", {})
                p_source_config = data_source_config.get("p_source", {})
                u_source_config = data_source_config.get("u_source", {})
                prediction_config = data_source_config.get("prediction_config", {})

                test_set_source.update({
                    "split_configuration": {
                        "split_ratio": data_split_config.get("test_ratio", 0.2),
                        "enabled": data_split_config.get("enabled", False),
                        "train_ratio": data_split_config.get("train_ratio", 0.6),
                        "validation_ratio": data_split_config.get("validation_ratio", 0.2)
                    },
                    "p_source": {
                        "type": p_source_config.get("type", "anomaly_events"),
                        "experiment_run_id": p_source_config.get("experiment_run_id"),
                        "filter_criteria": p_source_config.get("filter_criteria", "status = 'CONFIRMED_POSITIVE'"),
                        "description": p_source_config.get("description", "Positive samples from anomaly events")
                    },
                    "u_source": {
                        "type": u_source_config.get("type", "anomaly_events"),
                        "time_range": u_source_config.get("time_range"),
                        "building_floors": u_source_config.get("building_floors"),
                        "sample_limit": u_source_config.get("sample_limit"),
                        "experiment_run_id": u_source_config.get("experiment_run_id"),
                        "filter_criteria": u_source_config.get("filter_criteria"),
                        "description": u_source_config.get("description", "Unlabeled samples")
                    },
                    "prediction_period": {
                        "start_date": prediction_config.get("start_date"),
                        "end_date": prediction_config.get("end_date")
                    },
                    "experiment_run_id": model_info.get("experiment_run_id")
                })

        return test_set_source

    @staticmethod
    async def make_predictions_with_metrics(
        model: Any,
        X_test: np.ndarray,
        y_test: Optional[np.ndarray] = None,
        evaluation_run_id: Optional[str] = None,
        db_manager = None
    ) -> Dict[str, Any]:
        """
        使用模型進行預測並計算指標

        Args:
            model: 訓練好的模型
            X_test: 測試特徵矩陣
            y_test: 測試標籤（可選，如果提供則計算指標）
            evaluation_run_id: 評估運行ID（可選，如果提供則記錄預測結果）
            db_manager: 資料庫管理器（用於記錄預測結果）

        Returns:
            Dict: 包含預測結果和指標的字典
        """
        try:
            logger.info(f"🔮 開始模型預測，測試樣本數: {len(X_test)}")

            # 進行預測
            if hasattr(model, 'predict_proba'):
                # 獲取預測概率
                y_pred_proba = model.predict_proba(X_test)[:, 1]
                y_pred = (y_pred_proba > 0.5).astype(int)
                logger.info(f"✅ 使用 predict_proba 進行預測")
            else:
                # 直接預測
                y_pred = model.predict(X_test)
                y_pred_proba = y_pred.astype(float)
                logger.info(f"✅ 使用 predict 進行預測")

            # 預測結果統計
            positive_predictions = int(np.sum(y_pred))
            negative_predictions = int(len(y_pred) - np.sum(y_pred))

            result = {
                "predictions": y_pred,
                "prediction_probabilities": y_pred_proba,
                "prediction_stats": {
                    "total_samples": len(y_pred),
                    "positive_predictions": positive_predictions,
                    "negative_predictions": negative_predictions,
                    "positive_ratio": positive_predictions / len(y_pred) if len(y_pred) > 0 else 0
                }
            }

            # 如果有真實標籤，計算評估指標
            if y_test is not None:
                metrics = ModelPredictor._calculate_evaluation_metrics(y_test, y_pred, y_pred_proba)
                result["evaluation_metrics"] = metrics
                logger.info(f"📊 計算評估指標完成: accuracy={metrics['accuracy']:.3f}")

            # 如果提供了evaluation_run_id，記錄個別預測結果
            if evaluation_run_id and db_manager:
                await ModelPredictor._record_predictions(
                    evaluation_run_id, y_pred_proba, y_test, db_manager
                )

            logger.info(f"🎯 預測完成: {positive_predictions} 正樣本, {negative_predictions} 負樣本")
            return result

        except Exception as e:
            logger.error(f"❌ 預測失敗: {e}")
            raise e

    @staticmethod
    def _calculate_evaluation_metrics(y_true: np.ndarray, y_pred: np.ndarray, y_pred_proba: np.ndarray) -> Dict[str, Any]:
        """計算評估指標"""
        from sklearn.metrics import (
            accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
        )

        # 計算混淆矩陣
        cm = confusion_matrix(y_true, y_pred, labels=[0, 1])
        tn, fp, fn, tp = cm.ravel()

        # 計算各項指標
        metrics = {
            "accuracy": float(accuracy_score(y_true, y_pred)),
            "precision": float(precision_score(y_true, y_pred, zero_division=0)),
            "recall": float(recall_score(y_true, y_pred, zero_division=0)),
            "f1_score": float(f1_score(y_true, y_pred, zero_division=0)),
            "confusion_matrix": {
                "tp": int(tp),
                "fp": int(fp),
                "tn": int(tn),
                "fn": int(fn)
            },
            "support": {
                "positive": int(np.sum(y_true == 1)),
                "negative": int(np.sum(y_true == 0)),
                "total": int(len(y_true))
            }
        }

        return metrics

    @staticmethod
    async def _record_predictions(
        evaluation_run_id: str,
        y_pred_proba: np.ndarray,
        y_true: Optional[np.ndarray],
        db_manager
    ) -> None:
        """記錄個別預測結果到資料庫"""
        try:
            predictions = []
            for i in range(len(y_pred_proba)):
                predictions.append({
                    "prediction_score": float(y_pred_proba[i]),
                    "ground_truth": int(y_true[i]) if y_true is not None else None,
                    "timestamp": datetime.utcnow()
                })

            # 批量創建 ModelPrediction 記錄
            if predictions:
                prediction_ids = await db_manager.create_model_predictions(
                    evaluation_run_id,
                    predictions
                )
                logger.info(f"📝 記錄了 {len(prediction_ids)} 個預測結果到資料庫")

        except Exception as e:
            logger.error(f"❌ 記錄預測結果失敗: {e}")
            # 不要因為記錄失敗而中斷主流程

    @staticmethod
    async def prepare_test_features(
        test_data: pd.DataFrame,
        job_id: Optional[str] = None,
        broadcast_progress_func = None
    ) -> np.ndarray:
        """
        準備測試特徵矩陣

        Args:
            test_data: 測試數據
            job_id: 任務ID（用於進度廣播）
            broadcast_progress_func: 進度廣播函數

        Returns:
            np.ndarray: 特徵矩陣
        """
        try:
            from services.feature_engineering import feature_engineering

            logger.info(f"🔧 準備測試特徵，數據形狀: {test_data.shape}")

            # 廣播進度（如果有廣播函數）
            if broadcast_progress_func:
                await broadcast_progress_func({
                    "stage": "feature_preparation",
                    "message": f"正在處理 {len(test_data)} 條測試數據",
                    "job_id": job_id,
                    "details": {
                        "samples_count": len(test_data),
                        "columns": test_data.columns.tolist()
                    }
                })

            # 檢查數據格式並處理
            if 'dataWindow' in test_data.columns:
                # 異常事件格式
                test_events = test_data.to_dict('records')
                logger.info(f"🔧 異常事件格式，轉換 {len(test_events)} 個事件")

                if broadcast_progress_func:
                    await broadcast_progress_func({
                        "stage": "feature_engineering",
                        "message": "從異常事件數據生成特徵",
                        "job_id": job_id,
                        "details": {
                            "data_format": "anomaly_events",
                            "events_count": len(test_events)
                        }
                    })

                # 使用特徵工程生成特徵矩陣
                feature_matrix, _ = feature_engineering.generate_feature_matrix(test_events)

            else:
                # 原始電表數據格式
                logger.info("🔧 原始電表數據格式，構建特徵矩陣")

                if broadcast_progress_func:
                    await broadcast_progress_func({
                        "stage": "feature_engineering",
                        "message": "處理原始電表數據特徵",
                        "job_id": job_id,
                        "details": {
                            "data_format": "raw_meter_data",
                            "samples_count": len(test_data)
                        }
                    })

                # 構建特徵矩陣
                feature_matrix = ModelPredictor._build_feature_matrix_from_raw_data(test_data)

            # 標準化特徵
            if broadcast_progress_func:
                await broadcast_progress_func({
                    "stage": "feature_normalization",
                    "message": "標準化特徵數據",
                    "job_id": job_id,
                    "details": {
                        "feature_matrix_shape": feature_matrix.shape
                    }
                })

            X_test = feature_engineering.transform_features(feature_matrix)

            # 處理 NaN 值
            if np.isnan(X_test).any():
                logger.warning("⚠️ 發現 NaN 值，用 0 填充")
                X_test = np.nan_to_num(X_test, nan=0.0)

            logger.info(f"✅ 特徵準備完成，形狀: {X_test.shape}")
            return X_test

        except Exception as e:
            logger.error(f"❌ 特徵準備失敗: {e}")
            raise e

    @staticmethod
    def _build_feature_matrix_from_raw_data(test_data: pd.DataFrame) -> np.ndarray:
        """從原始數據構建特徵矩陣"""
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

        # 補齊到17維特徵
        while len(available_features) < 17:
            available_features.append(np.zeros(len(test_data)))

        # 構建特徵矩陣
        feature_matrix = np.column_stack(available_features[:17])
        logger.info(f"🔧 構建特徵矩陣: {feature_matrix.shape}")

        return feature_matrix
