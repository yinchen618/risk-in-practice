"""
模型訓練 API 路由 - 處理 PU Learning 模型訓練
"""

import json
from fastapi import APIRouter, HTTPException, BackgroundTasks, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from typing import Dict, Optional, Any, List
import logging
import uuid

# 建立日誌記錄器
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/models", tags=["Model Training"])

# Pydantic 模型
class ModelTrainingRequest(BaseModel):
    model_config = {"protected_namespaces": ()}

    model_name: str
    model_type: str  # "uPU" or "nnPU"
    activation: Optional[str] = "relu"
    n_epochs: Optional[int] = 100
    lr: Optional[float] = 0.001
    is_batch_norm: Optional[bool] = True
    batch_size: Optional[int] = 64
    experiment_run_id: str
    dataset_id: str

class ModelResultsResponse(BaseModel):
    success: bool
    data: Optional[Dict[str, Any]] = None
    message: str

# 新的評估相關 API 端點
class EvaluationRequest(BaseModel):
    scenario_type: str  # "GENERALIZATION_CHALLENGE", "DOMAIN_ADAPTATION"
    test_set_source: Dict[str, Any]  # 測試集來源配置
    name: Optional[str] = None  # 評估任務名稱

class EvaluationResponse(BaseModel):
    success: bool
    evaluation_run_id: str
    message: str

@router.post("/{model_id}/evaluate", response_model=EvaluationResponse)
async def evaluate_model(model_id: str, request: EvaluationRequest):
    """對模型進行新的評估（如 Generalization Challenge）"""
    try:
        from database import db_manager
        from services.model_evaluation import evaluator

        # 驗證模型是否存在且為有效的 PU 模型
        model = await db_manager.get_trained_model_by_id(model_id)
        if not model:
            raise HTTPException(status_code=404, detail="未找到指定的模型")

        model_type = model.get("model_type")
        if not model_type or model_type not in ["uPU", "nnPU"]:
            raise HTTPException(status_code=400, detail="只支援 PU Learning 模型的評估")

        # 啟動評估任務
        evaluation_run_id = await evaluator.start_evaluation_job(
            model_id=model_id,
            evaluation_request=request.dict()
        )

        return EvaluationResponse(
            success=True,
            evaluation_run_id=evaluation_run_id,
            message=f"評估任務已啟動，評估 ID: {evaluation_run_id}"
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"評估模型失敗: {e}")
        raise HTTPException(status_code=500, detail=f"評估模型失敗: {str(e)}")

@router.get("/{model_id}/evaluations")
async def get_model_evaluations(model_id: str):
    """獲取模型的所有評估歷史"""
    try:
        from database import db_manager

        # 驗證模型是否存在
        model = await db_manager.get_trained_model_by_id(model_id)
        if not model:
            raise HTTPException(status_code=404, detail="未找到指定的模型")

        # 獲取評估歷史
        evaluations = await db_manager.get_evaluation_runs_by_model(model_id)

        return ModelResultsResponse(
            success=True,
            data={'evaluations': evaluations},
            message=f"成功獲取模型 {model_id} 的 {len(evaluations)} 個評估記錄"
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"獲取模型評估失敗: {e}")
        raise HTTPException(status_code=500, detail=f"獲取模型評估失敗: {str(e)}")

@router.get("/evaluation-runs/{evaluation_run_id}")
async def get_evaluation_run(evaluation_run_id: str):
    """獲取特定評估的詳細結果"""
    try:
        from services.model_evaluation import evaluator

        # 獲取評估狀態
        evaluation_status = evaluator.get_evaluation_status(evaluation_run_id)

        if evaluation_status.get("status") == "not_found":
            raise HTTPException(status_code=404, detail="評估任務未找到")

        return ModelResultsResponse(
            success=True,
            data=evaluation_status,
            message=f"評估 {evaluation_run_id} 的詳細結果"
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"獲取評估詳細結果失敗: {e}")
        raise HTTPException(status_code=500, detail=f"獲取評估詳細結果失敗: {str(e)}")

@router.post("/train", response_model=ModelResultsResponse)
async def train_model(request: ModelTrainingRequest, background_tasks: BackgroundTasks):
    """訓練新的 PU Learning 模型"""
    try:
        from services.pu_training import PUTrainingService

        # 轉換請求為訓練配置
        model_config = {
            "model_name": request.model_name,
            "model_type": request.model_type,
            "activation": request.activation or "relu",
            "n_epochs": request.n_epochs or 100,
            "lr": request.lr or 0.001,
            "is_batch_norm": request.is_batch_norm if request.is_batch_norm is not None else True,
            "batch_size": request.batch_size or 64,
            "experiment_run_id": request.experiment_run_id,
            "dataset_id": request.dataset_id
        }

        # 啟動背景訓練任務
        training_service = PUTrainingService()
        background_tasks.add_task(
            training_service.train_model,
            model_config
        )

        return ModelResultsResponse(
            success=True,
            message=f"模型 {request.model_name} 訓練已開始"
        )

    except Exception as e:
        logger.error(f"開始模型訓練失敗: {e}")
        raise HTTPException(status_code=500, detail=f"開始模型訓練失敗: {str(e)}")

@router.get("/{model_id}")
async def get_model_by_id(model_id: str):
    """根據模型 ID 獲取模型詳細信息"""
    try:
        from database import db_manager, async_session
        from sqlalchemy import text

        # 從 TrainedModel 表查詢特定模型
        query = text("""
        SELECT
            id,
            name,
            scenario_type,
            status,
            experiment_run_id,
            model_config,
            data_source_config,
            model_path,
            training_metrics,
            created_at,
            completed_at
        FROM trained_models
        WHERE id = :model_id
        """)

        async with async_session() as session:
            result = await session.execute(query, {"model_id": model_id})
            row = result.fetchone()

        if not row:
            raise HTTPException(status_code=404, detail=f"Model with ID {model_id} not found")

        model_data = {
            'id': row[0],
            'name': row[1],
            'scenario_type': row[2],
            'status': row[3],
            'experiment_run_id': row[4],
            'model_config': row[5] if row[5] else {},
            'data_source_config': row[6] if row[6] else {},
            'model_path': row[7],
            'training_metrics': row[8] if row[8] else {},
            'created_at': row[9].isoformat() if row[9] else None,
            'completed_at': row[10].isoformat() if row[10] else None
        }

        return ModelResultsResponse(
            success=True,
            data=model_data,
            message=f"成功獲取模型 {model_id}"
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"獲取模型詳細信息失敗: {e}")
        raise HTTPException(status_code=500, detail=f"獲取模型信息失敗: {str(e)}")

@router.get("/experiment/{experiment_run_id}")
async def get_experiment_models(experiment_run_id: str):
    """獲取實驗的所有模型"""
    try:
        from database import db_manager, async_session
        from sqlalchemy import text

        # 從 TrainedModel 表查詢該實驗的所有已完成模型
        query = text("""
        SELECT
            id,
            name,
            scenario_type,
            status,
            experiment_run_id,
            model_config,
            data_source_config,
            model_path,
            training_metrics,
            created_at,
            completed_at
        FROM trained_models
        WHERE experiment_run_id = :experiment_run_id AND status = 'COMPLETED'
        ORDER BY created_at DESC
        """)

        async with async_session() as session:
            result = await session.execute(query, {"experiment_run_id": experiment_run_id})
            rows = result.fetchall()

        models_list = []
        for row in rows:
            model_data = {
                'id': row[0],
                'name': row[1],
                'scenario_type': row[2],
                'status': row[3],
                'experiment_run_id': row[4],
                'model_config': row[5] if row[5] else {},
                'data_source_config': row[6] if row[6] else {},
                'model_path': row[7],
                'training_metrics': row[8] if row[8] else {},
                'created_at': row[9].isoformat() if row[9] else None,
                'completed_at': row[10].isoformat() if row[10] else None
            }
            models_list.append(model_data)

        return ModelResultsResponse(
            success=True,
            data={'models': models_list, 'total': len(models_list)},
            message=f"成功獲取實驗 {experiment_run_id} 的 {len(models_list)} 個模型"
        )

    except Exception as e:
        logger.error(f"獲取實驗所有模型失敗: {e}")
        raise HTTPException(status_code=500, detail=f"獲取實驗模型列表失敗: {str(e)}")

@router.get("/experiment/{experiment_run_id}/evaluations")
async def get_experiment_evaluations(experiment_run_id: str):
    """獲取某個實驗的所有評估運行結果"""
    try:
        from database import async_session
        from sqlalchemy import text

        # 查詢該實驗相關的所有評估運行
        query = text("""
        SELECT
            er.id,
            er.name,
            er.scenario_type,
            er.status,
            er.trained_model_id,
            er.test_set_source,
            er.evaluation_metrics,
            er.created_at,
            er.completed_at,
            tm.name as model_name,
            tm.model_config,
            tm.data_source_config
        FROM evaluation_runs er
        JOIN trained_models tm ON er.trained_model_id = tm.id
        WHERE tm.experiment_run_id = :experiment_run_id AND er.status = 'COMPLETED'
        ORDER BY er.created_at DESC
        """)

        async with async_session() as session:
            result = await session.execute(query, {"experiment_run_id": experiment_run_id})
            rows = result.fetchall()

        evaluations_list = []
        for row in rows:
            evaluation_data = {
                'id': row[0],
                'name': row[1],
                'scenario_type': row[2],
                'status': row[3],
                'trained_model_id': row[4],
                'test_set_source': row[5] if row[5] else {},
                'evaluation_metrics': row[6] if row[6] else {},
                'created_at': row[7].isoformat() if row[7] else None,
                'completed_at': row[8].isoformat() if row[8] else None,
                'model_name': row[9],
                'model_config': row[10] if row[10] else {},
                'data_source_config': row[11] if row[11] else {}
            }
            evaluations_list.append(evaluation_data)

        return ModelResultsResponse(
            success=True,
            data={'evaluations': evaluations_list, 'total': len(evaluations_list)},
            message=f"成功獲取實驗 {experiment_run_id} 的 {len(evaluations_list)} 個評估結果"
        )

    except Exception as e:
        logger.error(f"獲取實驗評估結果失敗: {e}")
        raise HTTPException(status_code=500, detail=f"獲取實驗評估結果失敗: {str(e)}")

@router.websocket("/evaluation-progress")
async def evaluation_progress_websocket(websocket: WebSocket):
    """
    WebSocket 端點用於即時評估進度更新

    建立連接後，客戶端將接收評估進度更新：
    1. 建立 WebSocket 連接
    2. 監聽評估進度事件
    3. 接收即時更新
    """
    logger.info("🔌 WebSocket connection attempt - /evaluation-progress")

    await websocket.accept()
    logger.info("✅ Evaluation WebSocket connection accepted")

    from services.model_evaluation import add_evaluation_websocket_connection, remove_evaluation_websocket_connection
    await add_evaluation_websocket_connection(websocket)
    logger.info(f"📊 Total evaluation WebSocket connections after add")

    try:
        # 保持連接開放，監聽客戶端消息
        while True:
            try:
                # 接收客戶端消息（雖然在此應用中可能不需要）
                data = await websocket.receive_text()
                logger.info(f"📨 Received evaluation WebSocket message: {data}")

                # 可以在這裡處理客戶端消息，例如心跳檢測
                await websocket.send_text(json.dumps({
                    "type": "ack",
                    "message": "Message received"
                }))

            except WebSocketDisconnect:
                logger.info("🔌 Evaluation WebSocket disconnected normally")
                break
            except Exception as e:
                logger.error(f"❌ Error handling evaluation WebSocket message: {e}")
                break

    except WebSocketDisconnect:
        logger.info("🔌 Evaluation WebSocket disconnected")
    except Exception as e:
        logger.error(f"❌ Evaluation WebSocket error: {e}")
    finally:
        # 清理連接
        await remove_evaluation_websocket_connection(websocket)
        logger.info("🧹 Evaluation WebSocket connection cleaned up")
