"""
模型訓練 API 路由 - 支持 PU Learning 模型訓練和即時監控
"""

import logging
import json
from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from typing import Dict, List, Optional, Any
from datetime import datetime

from services.pu_training import trainer, TrainingRequest, add_websocket_connection, remove_websocket_connection
from services import pu_training

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/models", tags=["Model Training"])

# ========== Pydantic Models ==========

class TrainingResponse(BaseModel):
    success: bool
    job_id: str
    message: str

class JobStatusResponse(BaseModel):
    success: bool
    data: Dict[str, Any]

class JobListResponse(BaseModel):
    success: bool
    data: List[Dict[str, Any]]

# ========== API Endpoints ==========

@router.post("/train-and-predict-v2", response_model=TrainingResponse)
async def start_training_and_prediction(request: TrainingRequest):
    """
    啟動 PU Learning 模型訓練和預測任務

    這個 API 實現了文檔中的「即時訓練監控」需求：
    1. 接收訓練請求並立即返回任務 ID
    2. 在背景執行訓練任務
    3. 通過 WebSocket 提供即時進度更新
    """
    try:
        logger.info("="*60)
        logger.info("🚀 TRAINING API CALLED - /train-and-predict-v2")
        logger.info(f"📊 Experiment Run ID: {request.experiment_run_id}")
        logger.info(f"🔧 Model Type: {request.model_params.model_type}")
        logger.info(f"⚙️  Model Config: {request.model_params.dict()}")
        logger.info(f"📅 Prediction Period: {request.prediction_start_date} to {request.prediction_end_date}")
        logger.info("="*60)

        # 驗證請求參數
        if not request.experiment_run_id:
            logger.error("❌ Missing experiment_run_id in request")
            raise HTTPException(status_code=400, detail="experiment_run_id is required")

        if request.model_params.epochs <= 0:
            logger.error(f"❌ Invalid epochs value: {request.model_params.epochs}")
            raise HTTPException(status_code=400, detail="epochs must be positive")

        # 啟動異步訓練任務
        logger.info("🎯 Starting async training job...")
        job_id = await trainer.start_training_job(request)
        logger.info(f"✅ Training job created successfully with ID: {job_id}")

        response = TrainingResponse(
            success=True,
            job_id=job_id,
            message=f"Training job started successfully. Use job_id {job_id} to monitor progress."
        )

        logger.info(f"📤 Returning response: {response.dict()}")
        return response

    except HTTPException:
        raise
    except Exception as e:
        logger.error("="*60)
        logger.error("💥 TRAINING API ERROR")
        logger.error(f"❌ Error: {str(e)}")
        logger.error(f"📍 Exception type: {type(e).__name__}")
        logger.error("="*60)
        raise HTTPException(status_code=500, detail=f"Failed to start training job: {str(e)}")

@router.get("/jobs/{job_id}", response_model=JobStatusResponse)
async def get_job_status(job_id: str):
    """
    獲取訓練任務狀態
    """
    try:
        job_status = trainer.get_job_status(job_id)

        if not job_status:
            raise HTTPException(status_code=404, detail="Job not found")

        return JobStatusResponse(
            success=True,
            data=job_status
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get job status: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get job status: {str(e)}")

@router.get("/jobs", response_model=JobListResponse)
async def list_training_jobs():
    """
    列出所有訓練任務
    """
    try:
        jobs = trainer.list_jobs()

        return JobListResponse(
            success=True,
            data=jobs
        )

    except Exception as e:
        logger.error(f"Failed to list jobs: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to list jobs: {str(e)}")

@router.websocket("/training-progress")
async def training_progress_websocket(websocket: WebSocket):
    """
    WebSocket 端點用於即時訓練進度更新

    這個端點實現了文檔中的「即時通訊」需求：
    1. 建立 WebSocket 連接
    2. 接收來自訓練服務的進度更新
    3. 實時推送給前端客戶端
    """
    logger.info("🔌 WebSocket connection attempt - /training-progress")

    await websocket.accept()
    logger.info("✅ WebSocket connection accepted")

    await add_websocket_connection(websocket)
    logger.info(f"📊 Total WebSocket connections: {len(pu_training.websocket_connections)}")

    try:
        logger.info("🌐 WebSocket connection established for training progress")

        # 發送歡迎消息
        welcome_message = {
            "type": "connection_established",
            "message": "Connected to training progress updates",
            "timestamp": datetime.utcnow().isoformat()
        }
        await websocket.send_text(json.dumps(welcome_message))
        logger.info(f"📨 Sent welcome message: {welcome_message}")

        # 保持連接活躍
        while True:
            try:
                # 等待客戶端消息（心跳檢測）
                logger.debug("👂 Waiting for client message...")
                message = await websocket.receive_text()
                logger.info(f"📥 Received message from client: {message}")

                data = json.loads(message) if message else {}

                # 處理心跳檢測
                if data.get("type") == "ping":
                    pong_message = {
                        "type": "pong",
                        "timestamp": datetime.utcnow().isoformat()
                    }
                    await websocket.send_text(json.dumps(pong_message))
                    logger.debug(f"🏓 Sent pong response: {pong_message}")

            except WebSocketDisconnect:
                logger.info("🔌 WebSocket disconnected by client")
                break
            except Exception as e:
                logger.warning(f"⚠️  WebSocket message handling error: {e}")
                break

    except WebSocketDisconnect:
        logger.info("🔌 WebSocket disconnected")
    except Exception as e:
        logger.error(f"💥 WebSocket error: {e}")
    finally:
        await remove_websocket_connection(websocket)
        logger.info("� WebSocket connection removed successfully")

# ========== 輔助函數 ==========

import json  # 確保導入 json 模組
