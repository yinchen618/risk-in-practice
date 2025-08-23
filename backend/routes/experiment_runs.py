"""
實驗批次管理 API 路由 - 管理科學實驗的完整生命週期
"""

from fastapi import APIRouter, HTTPException, BackgroundTasks, Query, Depends, Request
from pydantic import BaseModel
from typing import Dict, List, Optional, Any
import logging
import uuid
import asyncio
from datetime import datetime, date, timezone, time as dt_time, timedelta
import json
import pandas as pd
import numpy as np

from services.data_loader import data_loader
from services.anomaly_rules import anomaly_rules
from services.anomaly_service import anomaly_service
from services.candidate_calculation import candidate_calculation_service
from database import async_session
from sqlalchemy import text

# 使用與 coding 模組相同的 logger 配置
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('coding_backend.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/experiment-runs", tags=["Experiment Runs"])

# ========== Pydantic Models ==========

class ExperimentRunCreate(BaseModel):
    name: str
    description: Optional[str] = None

class ExperimentRunResponse(BaseModel):
    success: bool
    data: Dict[str, Any]
    message: Optional[str] = None

class ExperimentRunListResponse(BaseModel):
    success: bool
    data: List[Dict[str, Any]]
    message: Optional[str] = None

class ExperimentRunUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class FilteringParameters(BaseModel):
    # Top-level filter
    start_date: str
    end_date: str
    # Optional precise datetime window (prioritized over date if provided)
    start_time: str
    end_time: str

    # Value-based rules
    z_score_threshold: Optional[float] = 3.0
    spike_percentage: Optional[float] = 200.0

    # Time-based rules
    min_event_duration_minutes: Optional[int] = 30
    detect_holiday_pattern: Optional[bool] = True

    # Data integrity rules
    max_time_gap_minutes: Optional[int] = 60

    # Peer comparison rules
    peer_agg_window_minutes: Optional[int] = 5
    peer_exceed_percentage: Optional[float] = 150.0

    # 支援新的按建築分組功能
    selected_floors_by_building: Optional[Dict[str, List[str]]] = None

class CandidateGenerationRequest(BaseModel):
    filtering_parameters: FilteringParameters

# 全域任務追蹤
running_tasks: Dict[str, Dict[str, Any]] = {}

# ========== API Endpoints ==========

@router.post("", response_model=ExperimentRunResponse)
async def create_experiment_run(request: ExperimentRunCreate):
    """
    創建新的實驗批次
    """
    try:
        logger.info(f"Creating new experiment run: {request.name}")

        # 生成唯一 ID
        run_id = str(uuid.uuid4())

        # 插入到資料庫
        async with async_session() as session:
            query = text("""
                INSERT INTO experiment_run (
                    id, name, description, status, "createdAt", "updatedAt"
                ) VALUES (
                    :id, :name, :description, 'CONFIGURING', NOW(), NOW()
                )
            """)

            await session.execute(query, {
                "id": run_id,
                "name": request.name,
                "description": request.description
            })
            await session.commit()

        # 構建回應
        experiment_run = {
            "id": run_id,
            "name": request.name,
            "description": request.description,
            "status": "CONFIGURING",
            "createdAt": datetime.utcnow().isoformat(),
            "updatedAt": datetime.utcnow().isoformat()
        }

        return ExperimentRunResponse(
            success=True,
            data=experiment_run,
            message=f"Successfully created experiment run: {request.name}"
        )

    except Exception as e:
        logger.error(f"Failed to create experiment run: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to create experiment run: {str(e)}")

@router.get("", response_model=ExperimentRunListResponse)
async def list_experiment_runs(
    status: Optional[str] = Query(None, description="Status filter"),
    limit: int = Query(50, description="Number of results to return"),
    offset: int = Query(0, description="Number of results to skip")
):
    """
    列出實驗批次
    """
    try:
        async with async_session() as session:
            # 構建查詢
            where_conditions = []
            params = {"limit": limit, "offset": offset}

            if status:
                where_conditions.append('status = :status')
                params["status"] = status

            where_clause = " AND ".join(where_conditions) if where_conditions else "1=1"


            query = text(f"""
                SELECT
                    id, name, description, status, "candidateCount", "candidateStats",
                    "positiveLabelCount", "negativeLabelCount",
                    "createdAt", "updatedAt"
                FROM experiment_run
                WHERE {where_clause}
                ORDER BY "createdAt" DESC
                LIMIT :limit OFFSET :offset
            """)


            try:
                result = await session.execute(query, params)
                rows = result.fetchall()

                experiment_runs = []
                for row in rows:
                    try:
                        run_data = {
                            "id": row.id,
                            "name": row.name,
                            "description": row.description,
                            "status": row.status,
                            "candidateCount": row.candidateCount,
                            "candidateStats": row.candidateStats,
                            "positiveLabelCount": row.positiveLabelCount,
                            "negativeLabelCount": row.negativeLabelCount,
                            "createdAt": row.createdAt.isoformat() if row.createdAt else None,
                            "updatedAt": row.updatedAt.isoformat() if row.updatedAt else None
                        }
                        experiment_runs.append(run_data)
                        logger.debug(f"處理記錄: {run_data['id']}")
                    except Exception as row_error:
                        logger.error(f"處理記錄時出錯: {str(row_error)}")
                        continue

                return ExperimentRunListResponse(
                    success=True,
                    data=experiment_runs,
                    message=f"Retrieved {len(experiment_runs)} experiment runs"
                )
            except Exception as query_error:
                logger.error(f"執行查詢時出錯: {str(query_error)}")
                raise

    except Exception as e:
        logger.error(f"獲取實驗批次列表失敗", exc_info=True)
        if "connection" in str(e).lower():
            raise HTTPException(
                status_code=503,
                detail="資料庫連線失敗，可能是由於網路延遲或資料庫伺服器問題"
            )
        raise HTTPException(
            status_code=500,
            detail=f"獲取實驗批次列表失敗: {str(e)}"
        )

@router.patch("/{run_id}", response_model=ExperimentRunResponse)
async def update_experiment_run(run_id: str, request: ExperimentRunUpdate):
    """Update experiment run's name/description"""
    try:
        fields = []
        params: Dict[str, Any] = {"run_id": run_id}
        if request.name is not None:
            fields.append("name = :name")
            params["name"] = request.name
        if request.description is not None:
            fields.append("description = :description")
            params["description"] = request.description
        if not fields:
            raise HTTPException(status_code=400, detail="No fields to update")

        query = text(f"""
            UPDATE experiment_run
            SET {', '.join(fields)}, "updatedAt" = NOW()
            WHERE id = :run_id
            RETURNING id, name, description, status, "filteringParameters",
                      "candidateCount", "candidateStats", "positiveLabelCount", "negativeLabelCount",
                      "createdAt", "updatedAt"
        """)

        async with async_session() as session:
            result = await session.execute(query, params)
            row = result.fetchone()
            await session.commit()

            if not row:
                raise HTTPException(status_code=404, detail="Experiment run not found")

            experiment_run = {
                "id": row.id,
                "name": row.name,
                "description": row.description,
                "status": row.status,
                "filteringParameters": row.filteringParameters,
                "candidateCount": row.candidateCount,
                "candidateStats": row.candidateStats,
                "positiveLabelCount": row.positiveLabelCount,
                "negativeLabelCount": row.negativeLabelCount,
                "createdAt": row.createdAt.isoformat() if row.createdAt else None,
                "updatedAt": row.updatedAt.isoformat() if row.updatedAt else None
            }

        return ExperimentRunResponse(success=True, data=experiment_run, message="Experiment run updated")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to update experiment run: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to update experiment run: {str(e)}")

@router.delete("/{run_id}")
async def delete_experiment_run(run_id: str):
    """Delete an experiment run"""
    try:
        async with async_session() as session:
            query = text("DELETE FROM experiment_run WHERE id = :run_id RETURNING id")
            result = await session.execute(query, {"run_id": run_id})
            row = result.fetchone()
            await session.commit()
            if not row:
                raise HTTPException(status_code=404, detail="Experiment run not found")
        return {"success": True, "message": "Experiment run deleted"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to delete experiment run: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to delete experiment run: {str(e)}")


@router.get("/{run_id}", response_model=ExperimentRunResponse)
async def get_experiment_run(run_id: str):
    """
    獲取特定實驗批次的詳細資訊
    """
    try:
        async with async_session() as session:
            query = text("""
                SELECT
                    id, name, description, status, "filteringParameters",
                    "candidateCount", "candidateStats", "positiveLabelCount", "negativeLabelCount",
                    "createdAt", "updatedAt"
                FROM experiment_run
                WHERE id = :run_id
            """)

            result = await session.execute(query, {"run_id": run_id})
            row = result.fetchone()

            if not row:
                raise HTTPException(status_code=404, detail="Experiment run not found")

            # 派生標記統計（依事件表動態計算）
            counts_query = text(
                """
                SELECT
                    COUNT(*) as total,
                    COUNT(CASE WHEN status = 'CONFIRMED_POSITIVE' THEN 1 END) as positive,
                    COUNT(CASE WHEN status = 'REJECTED_NORMAL' THEN 1 END) as negative
                FROM anomaly_event
                WHERE "experimentRunId" = :run_id
                """
            )
            counts_res = await session.execute(counts_query, {"run_id": run_id})
            counts_row = counts_res.fetchone()
            positive_cnt = counts_row.positive if counts_row and counts_row.positive is not None else 0
            negative_cnt = counts_row.negative if counts_row and counts_row.negative is not None else 0

            experiment_run = {
                "id": row.id,
                "name": row.name,
                "description": row.description,
                "status": row.status,
                "filteringParameters": row.filteringParameters,
                "candidateCount": row.candidateCount,
                "positiveLabelCount": positive_cnt,
                "negativeLabelCount": negative_cnt,
                "createdAt": row.createdAt.isoformat() if row.createdAt else None,
                "updatedAt": row.updatedAt.isoformat() if row.updatedAt else None
            }

        return ExperimentRunResponse(
            success=True,
            data=experiment_run,
            message="Successfully retrieved experiment run"
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get experiment run: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get experiment run: {str(e)}")

@router.post("/{run_id}/complete", response_model=ExperimentRunResponse)
async def complete_experiment_run(run_id: str):
    """
    將實驗批次標記為 COMPLETED。
    條件：
    - 實驗批次存在
    - 狀態為 LABELING（或已 COMPLETED）
    - 該批次下無 UNREVIEWED 事件
    """
    try:
        async with async_session() as session:
            # 1) 讀取當前實驗批次狀態
            q_status = text("SELECT status FROM experiment_run WHERE id = :run_id")
            res_status = await session.execute(q_status, {"run_id": run_id})
            row_status = res_status.fetchone()
            if not row_status:
                raise HTTPException(status_code=404, detail="Experiment run not found")

            current_status = row_status.status
            if current_status == "COMPLETED":
                # 已完成則直接返回當前資料
                q_get = text(
                    """
                    SELECT id, name, description, status, "filteringParameters",
                           "candidateCount", "candidateStats", "positiveLabelCount", "negativeLabelCount",
                           "createdAt", "updatedAt"
                    FROM experiment_run WHERE id = :run_id
                    """
                )
                row = (await session.execute(q_get, {"run_id": run_id})).fetchone()
                # 動態統計
                counts_query = text(
                    """
                    SELECT
                        COUNT(*) as total,
                        COUNT(CASE WHEN status = 'CONFIRMED_POSITIVE' THEN 1 END) as positive,
                        COUNT(CASE WHEN status = 'REJECTED_NORMAL' THEN 1 END) as negative
                    FROM anomaly_event
                    WHERE "experimentRunId" = :run_id
                    """
                )
                counts_res = await session.execute(counts_query, {"run_id": run_id})
                counts_row = counts_res.fetchone()
                positive_cnt = counts_row.positive if counts_row and counts_row.positive is not None else 0
                negative_cnt = counts_row.negative if counts_row and counts_row.negative is not None else 0

                experiment_run = {
                    "id": row.id,
                    "name": row.name,
                    "description": row.description,
                    "status": row.status,
                    "filteringParameters": row.filteringParameters,
                    "candidateCount": row.candidateCount,
                    "candidateStats": row.candidateStats,
                    "positiveLabelCount": positive_cnt,
                    "negativeLabelCount": negative_cnt,
                    "createdAt": row.createdAt.isoformat() if row.createdAt else None,
                    "updatedAt": row.updatedAt.isoformat() if row.updatedAt else None,
                }
                return ExperimentRunResponse(success=True, data=experiment_run, message="Experiment run already completed")

            if current_status not in ("LABELING", "CONFIGURING"):
                raise HTTPException(status_code=400, detail=f"Experiment run cannot be completed in status: {current_status}")

            # 2) 驗證是否仍有未標註事件
            q_unreviewed = text(
                """
                SELECT COUNT(*) AS cnt
                FROM anomaly_event
                WHERE "experimentRunId" = :run_id AND status = 'UNREVIEWED'
                """
            )
            r_unrev = await session.execute(q_unreviewed, {"run_id": run_id})
            c_unrev = r_unrev.fetchone()
            unreviewed_count = int(c_unrev.cnt if c_unrev and c_unrev.cnt is not None else 0)
            if unreviewed_count > 0:
                raise HTTPException(status_code=400, detail=f"There are {unreviewed_count} UNREVIEWED events in this experiment run")

            # 3) 標記為 COMPLETED
            q_update = text(
                """
                UPDATE experiment_run
                SET status = 'COMPLETED', "updatedAt" = NOW()
                WHERE id = :run_id
                RETURNING id, name, description, status, "filteringParameters",
                          "candidateCount", "candidateStats", "positiveLabelCount", "negativeLabelCount",
                          "createdAt", "updatedAt"
                """
            )
            row = (await session.execute(q_update, {"run_id": run_id})).fetchone()
            await session.commit()

            if not row:
                raise HTTPException(status_code=404, detail="Experiment run not found after update")

            # 動態統計（完成時通常與先前一致，但仍以實際事件表為準）
            counts_query = text(
                """
                SELECT
                    COUNT(*) as total,
                    COUNT(CASE WHEN status = 'CONFIRMED_POSITIVE' THEN 1 END) as positive,
                    COUNT(CASE WHEN status = 'REJECTED_NORMAL' THEN 1 END) as negative
                FROM anomaly_event
                WHERE "experimentRunId" = :run_id
                """
            )
            counts_res = await session.execute(counts_query, {"run_id": run_id})
            counts_row = counts_res.fetchone()
            positive_cnt = counts_row.positive if counts_row and counts_row.positive is not None else 0
            negative_cnt = counts_row.negative if counts_row and counts_row.negative is not None else 0

            experiment_run = {
                "id": row.id,
                "name": row.name,
                "description": row.description,
                "status": row.status,
                "filteringParameters": row.filteringParameters,
                "candidateCount": row.candidateCount,
                "candidateStats": row.candidateStats,
                "positiveLabelCount": positive_cnt,
                "negativeLabelCount": negative_cnt,
                "createdAt": row.createdAt.isoformat() if row.createdAt else None,
                "updatedAt": row.updatedAt.isoformat() if row.updatedAt else None,
            }

        return ExperimentRunResponse(success=True, data=experiment_run, message="Experiment run marked as COMPLETED")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to complete experiment run: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to complete experiment run: {str(e)}")


# ========== 候選事件計算 API ==========

@router.post("/{run_id}/candidates/calculate")
async def calculate_candidates(run_id: str, request: CandidateGenerationRequest):
    """
    計算候選異常事件 - 實現完整的多維度異常檢測

    這個 API 實現了 Calculate Candidates 的完整流程：
    1. 載入和篩選數據
    2. 應用多維度規則
    3. 處理重疊
    4. 計算統計結果
    """
    try:
        logger.info(f"[CALCULATE_CANDIDATES] 開始為實驗 {run_id} 計算候選事件")
        logger.info(f"[CALCULATE_CANDIDATES] 請求參數: {request.dict()}")

        # 驗證實驗批次是否存在
        async with async_session() as session:
            verify_query = text("SELECT id, status FROM experiment_run WHERE id = :run_id")
            result = await session.execute(verify_query, {"run_id": run_id})
            run_row = result.fetchone()

            if not run_row:
                raise HTTPException(status_code=404, detail="Experiment run not found")

        # 提取篩選參數
        filter_params = request.filtering_parameters

        # 格式化時間範圍
        try:
            start_datetime = f"{filter_params.start_date}T{filter_params.start_time}:00"
            end_datetime = f"{filter_params.end_date}T{filter_params.end_time}:00"
            logger.info(f"[CALCULATE_CANDIDATES] 時間範圍: {start_datetime} 到 {end_datetime}")
        except Exception as e:
            logger.error(f"[CALCULATE_CANDIDATES] 時間格式化失敗: {e}")
            raise HTTPException(status_code=400, detail=f"Invalid time format: {e}")

        # 載入數據
        logger.info(f"[CALCULATE_CANDIDATES] 載入數據...")
        try:
            # 載入數據 - 直接使用 selected_floors_by_building
            df = await data_loader.load_meter_data_by_time_range(
                start_time=start_datetime,
                end_time=end_datetime,
                selected_floors_by_building=filter_params.selected_floors_by_building
            )

            logger.info(f"[CALCULATE_CANDIDATES] 載入了 {len(df)} 筆數據")

            if df.empty:
                logger.warning(f"[CALCULATE_CANDIDATES] 沒有找到符合條件的數據")
                empty_result = _convert_numpy_types(candidate_calculation_service._empty_result())
                return {
                    "success": True,
                    "data": empty_result,
                    "message": "No data found for the specified criteria"
                }

        except Exception as e:
            logger.error(f"[CALCULATE_CANDIDATES] 數據載入失敗: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to load data: {str(e)}")

        # 執行候選事件計算
        logger.info(f"[CALCULATE_CANDIDATES] 執行候選事件計算...")
        try:
            # 轉換參數格式
            calculation_params = {
                'z_score_threshold': filter_params.z_score_threshold,
                'spike_percentage': filter_params.spike_percentage,
                'min_event_duration_minutes': filter_params.min_event_duration_minutes,
                'detect_holiday_pattern': filter_params.detect_holiday_pattern,
                'max_time_gap_minutes': filter_params.max_time_gap_minutes,
                'peer_agg_window_minutes': filter_params.peer_agg_window_minutes,
                'peer_exceed_percentage': filter_params.peer_exceed_percentage,
            }

            # 執行計算
            calculation_result = await candidate_calculation_service.calculate_anomaly_candidates(
                df=df,
                filtering_params=calculation_params,
                selected_floors_by_building=filter_params.selected_floors_by_building
            )

            logger.info(f"[CALCULATE_CANDIDATES] 計算完成，找到 {calculation_result.get('totalCandidates', 0)} 個候選事件")

            # 更新實驗批次的統計資訊
            await _update_experiment_run_stats(run_id, calculation_result, filter_params.dict())

            # 轉換結果中的 numpy 類型為 Python 原生類型以便 JSON 序列化
            clean_calculation_result = _convert_numpy_types(calculation_result)

            return {
                "success": True,
                "data": clean_calculation_result,
                "message": f"Successfully calculated {clean_calculation_result.get('totalCandidates', 0)} candidate events"
            }

        except Exception as e:
            logger.error(f"[CALCULATE_CANDIDATES] 計算失敗: {e}")
            raise HTTPException(status_code=500, detail=f"Calculation failed: {str(e)}")

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"[CALCULATE_CANDIDATES] 未預期的錯誤: {e}")
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")



@router.post("/{run_id}/candidates/generate")
async def generate_candidates(
    run_id: str,
    request: CandidateGenerationRequest,
    allow_overwrite: bool = Query(False, description="Allow overwriting existing candidates")
):
    """
    生成候選事件並持久化到資料庫 - Proceed to Stage 2 Manual Annotation

    這個 API 實現了 Proceed to Stage 2 的完整流程：
    1. 執行候選事件計算（基於 calculate_candidates 邏輯）
    2. 持久化候選事件到 anomaly_event 表
    3. 更新實驗批次狀態為 LABELING
    """
    try:
        logger.info(f"[GENERATE_CANDIDATES] === API 被調用 ===")
        logger.info(f"[GENERATE_CANDIDATES] 開始為實驗 {run_id} 生成並持久化候選事件")
        logger.info(f"[GENERATE_CANDIDATES] 允許覆蓋: {allow_overwrite}")

        # 詳細記錄接收到的參數
        logger.info(f"=== 後端接收的參數 ===")
        logger.info(f"run_id: {run_id}")
        try:
            logger.info(f"request.filtering_parameters: {request.filtering_parameters}")
            logger.info(f"request dict: {request.dict()}")
        except Exception as param_error:
            logger.error(f"無法序列化請求參數: {param_error}")

        # 驗證實驗批次是否存在
        async with async_session() as session:
            verify_query = text("SELECT id, status FROM experiment_run WHERE id = :run_id")
            result = await session.execute(verify_query, {"run_id": run_id})
            run_row = result.fetchone()

            if not run_row:
                raise HTTPException(status_code=404, detail="Experiment run not found")

            current_status = run_row.status
            logger.info(f"[GENERATE_CANDIDATES] 當前實驗狀態: {current_status}")

        # 檢查是否已有候選事件（如果不允許覆蓋）
        if not allow_overwrite:
            async with async_session() as session:
                count_query = text(
                    'SELECT COUNT(*) as count FROM anomaly_event WHERE "experimentRunId" = :run_id'
                )
                count_result = await session.execute(count_query, {"run_id": run_id})
                existing_count = count_result.fetchone().count

                if existing_count > 0:
                    raise HTTPException(
                        status_code=409,
                        detail=f"Experiment run already has {existing_count} candidates. Use allow_overwrite=true to replace them."
                    )

        # 提取篩選參數
        filter_params = request.filtering_parameters

        # 格式化時間範圍
        try:
            start_datetime = f"{filter_params.start_date}T{filter_params.start_time}:00"
            end_datetime = f"{filter_params.end_date}T{filter_params.end_time}:00"
            logger.info(f"[GENERATE_CANDIDATES] 時間範圍: {start_datetime} 到 {end_datetime}")
        except Exception as e:
            logger.error(f"[GENERATE_CANDIDATES] 時間格式化失敗: {e}")
            raise HTTPException(status_code=400, detail=f"Invalid time format: {e}")

        # 載入數據
        logger.info(f"[GENERATE_CANDIDATES] 載入數據...")
        try:
            df = await data_loader.load_meter_data_by_time_range(
                start_time=start_datetime,
                end_time=end_datetime,
                selected_floors_by_building=filter_params.selected_floors_by_building
            )

            logger.info(f"[GENERATE_CANDIDATES] 載入了 {len(df)} 筆數據")

            if df.empty:
                logger.warning(f"[GENERATE_CANDIDATES] 沒有找到符合條件的數據")
                return {
                    "success": True,
                    "data": {
                        "candidatesGenerated": 0,
                        "experimentRunId": run_id,
                        "status": "LABELING"
                    },
                    "message": "No data found for the specified criteria, experiment run updated to LABELING status"
                }

        except Exception as e:
            logger.error(f"[GENERATE_CANDIDATES] 數據載入失敗: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to load data: {str(e)}")

        # 執行候選事件計算
        logger.info(f"[GENERATE_CANDIDATES] 執行候選事件計算...")
        try:
            calculation_params = {
                'z_score_threshold': filter_params.z_score_threshold,
                'spike_percentage': filter_params.spike_percentage,
                'min_event_duration_minutes': filter_params.min_event_duration_minutes,
                'detect_holiday_pattern': filter_params.detect_holiday_pattern,
                'max_time_gap_minutes': filter_params.max_time_gap_minutes,
                'peer_agg_window_minutes': filter_params.peer_agg_window_minutes,
                'peer_exceed_percentage': filter_params.peer_exceed_percentage,
            }

            calculation_result = await candidate_calculation_service.calculate_anomaly_candidates(
                df=df,
                filtering_params=calculation_params,
                selected_floors_by_building=filter_params.selected_floors_by_building
            )

            logger.info(f"[GENERATE_CANDIDATES] 計算完成，找到 {calculation_result.get('totalCandidates', 0)} 個候選事件")

        except Exception as e:
            logger.error(f"[GENERATE_CANDIDATES] 計算失敗: {e}")
            raise HTTPException(status_code=500, detail=f"Calculation failed: {str(e)}")

        # 持久化候選事件到資料庫
        logger.info(f"[GENERATE_CANDIDATES] 持久化候選事件到資料庫...")
        try:
            events = calculation_result.get("final_events", [])
            logger.info(f"[GENERATE_CANDIDATES] calculation_result 的鍵: {list(calculation_result.keys())}")
            logger.info(f"[GENERATE_CANDIDATES] final_events 類型: {type(events)}")
            logger.info(f"[GENERATE_CANDIDATES] final_events 長度: {len(events)}")

            # 如果 final_events 為空，檢查其他可能的鍵
            if not events:
                logger.warning(f"[GENERATE_CANDIDATES] final_events 為空，檢查其他可能的事件鍵...")
                potential_keys = ["events", "anomaly_events", "candidates", "detected_events"]
                for key in potential_keys:
                    if key in calculation_result:
                        alt_events = calculation_result[key]
                        logger.info(f"[GENERATE_CANDIDATES] 找到替代鍵 '{key}': {type(alt_events)}, 長度: {len(alt_events) if hasattr(alt_events, '__len__') else 'N/A'}")
                        if hasattr(alt_events, '__len__') and len(alt_events) > 0:
                            events = alt_events
                            logger.info(f"[GENERATE_CANDIDATES] 使用替代鍵 '{key}' 的事件數據")
                            break

            # 記錄完整的 calculation_result 結構（如果不太大的話）
            if len(str(calculation_result)) < 2000:
                logger.info(f"[GENERATE_CANDIDATES] 完整的 calculation_result: {calculation_result}")
            else:
                logger.info(f"[GENERATE_CANDIDATES] calculation_result 太大，只顯示鍵和基本統計")
                for key, value in calculation_result.items():
                    if hasattr(value, '__len__'):
                        logger.info(f"[GENERATE_CANDIDATES] {key}: {type(value)}, 長度: {len(value)}")
                    else:
                        logger.info(f"[GENERATE_CANDIDATES] {key}: {type(value)}, 值: {value}")

            events_saved = await _save_events_to_database_with_data_window(run_id, events, allow_overwrite, df)

            logger.info(f"[GENERATE_CANDIDATES] 成功持久化 {events_saved} 個事件")

        except Exception as e:
            logger.error(f"[GENERATE_CANDIDATES] 持久化失敗: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to persist events: {str(e)}")

        # 更新實驗批次狀態和統計資訊
        logger.info(f"[GENERATE_CANDIDATES] 更新實驗批次狀態...")
        try:
            await _update_experiment_run_to_labeling_status(run_id, calculation_result, filter_params.dict(), events_saved)
            logger.info(f"[GENERATE_CANDIDATES] 實驗批次狀態已更新為 LABELING")

        except Exception as e:
            logger.error(f"[GENERATE_CANDIDATES] 狀態更新失敗: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to update experiment run status: {str(e)}")

        return {
            "success": True,
            "data": {
                "candidatesGenerated": events_saved,
                "experimentRunId": run_id,
                "status": "LABELING",
                "totalCandidatesCalculated": calculation_result.get('totalCandidates', 0)
            },
            "message": f"Successfully generated and persisted {events_saved} candidate events. Experiment run is now ready for manual annotation."
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"[GENERATE_CANDIDATES] 未預期的錯誤: {e}")
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")


@router.get("/{run_id}/candidates/status/{task_id}")
async def get_generation_status(run_id: str, task_id: str):
    """
    獲取候選事件生成任務的狀態
    """
    try:
        if task_id not in running_tasks:
            raise HTTPException(status_code=404, detail="Task not found")

        task_info = running_tasks[task_id]

        # 如果任務完成，清理任務記錄
        if task_info["status"] in ["completed", "failed"]:
            # 保留一段時間後再清理
            if datetime.utcnow() - datetime.fromisoformat(task_info["started_at"]) > timedelta(minutes=5):
                del running_tasks[task_id]

        return {
            "success": True,
            "status": task_info["status"],
            "progress": task_info.get("progress", 0),
            "message": task_info.get("message", ""),
            "result": task_info.get("result"),
            "error": task_info.get("error")
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"[GET_GENERATION_STATUS] 錯誤: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get task status: {str(e)}")


# ========== 輔助函數 ==========

def _convert_numpy_types(obj):
    """轉換 numpy 類型為 Python 原生類型，以便 JSON 序列化"""
    if isinstance(obj, np.integer):
        return int(obj)
    elif isinstance(obj, np.floating):
        return float(obj)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    elif isinstance(obj, dict):
        return {key: _convert_numpy_types(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [_convert_numpy_types(item) for item in obj]
    elif hasattr(obj, 'item'):  # numpy scalars
        return obj.item()
    else:
        return obj

async def _update_experiment_run_stats(
    run_id: str,
    calculation_result: Dict[str, Any],
    filtering_parameters: Dict[str, Any]
):
    """更新實驗批次的統計資訊"""
    try:
        # 轉換 numpy 類型為 Python 原生類型
        clean_calculation_result = _convert_numpy_types(calculation_result)
        clean_filtering_parameters = _convert_numpy_types(filtering_parameters)

        # 確保 candidate_count 是純整數
        candidate_count = clean_calculation_result.get("totalCandidates", 0)
        if isinstance(candidate_count, (np.integer, np.int64)):
            candidate_count = int(candidate_count)

        async with async_session() as session:
            update_query = text("""
                UPDATE experiment_run
                SET
                    "candidateCount" = :candidate_count,
                    "candidateStats" = :candidate_stats,
                    "filteringParameters" = :filtering_parameters,
                    "updatedAt" = NOW()
                WHERE id = :run_id
            """)

            await session.execute(update_query, {
                "run_id": run_id,
                "candidate_count": candidate_count,
                "candidate_stats": json.dumps(clean_calculation_result),
                "filtering_parameters": json.dumps(clean_filtering_parameters)
            })
            await session.commit()

        logger.info(f"[UPDATE_STATS] 已更新實驗 {run_id} 的統計資訊")

    except Exception as e:
        logger.error(f"[UPDATE_STATS] 更新統計資訊失敗: {e}")
        # 不拋出異常，因為這不是關鍵操作


async def _update_experiment_run_stats(
    run_id: str,
    calculation_result: Dict[str, Any],
    filtering_parameters: Dict[str, Any]
):
    """更新實驗批次的統計資訊"""
    try:
        # 轉換 numpy 類型為 Python 原生類型
        clean_calculation_result = _convert_numpy_types(calculation_result)
        clean_filtering_parameters = _convert_numpy_types(filtering_parameters)

        # 確保 candidate_count 是純整數
        candidate_count = clean_calculation_result.get("totalCandidates", 0)
        if isinstance(candidate_count, (np.integer, np.int64)):
            candidate_count = int(candidate_count)

        async with async_session() as session:
            update_query = text("""
                UPDATE experiment_run
                SET
                    "candidateCount" = :candidate_count,
                    "candidateStats" = :candidate_stats,
                    "filteringParameters" = :filtering_parameters,
                    "updatedAt" = NOW()
                WHERE id = :run_id
            """)

            await session.execute(update_query, {
                "run_id": run_id,
                "candidate_count": candidate_count,
                "candidate_stats": json.dumps(clean_calculation_result),
                "filtering_parameters": json.dumps(clean_filtering_parameters)
            })
            await session.commit()

        logger.info(f"[UPDATE_STATS] 已更新實驗 {run_id} 的統計資訊")

    except Exception as e:
        logger.error(f"[UPDATE_STATS] 更新統計資訊失敗: {e}")
        # 不拋出異常，因為這不是關鍵操作


async def _save_events_to_database_with_data_window(
    run_id: str,
    events: List[Dict[str, Any]],
    allow_overwrite: bool,
    df: pd.DataFrame
) -> int:
    """
    將候選事件保存到資料庫，包含完整的 dataWindow 數據
    這是 Proceed to Stage 2 的核心功能 - 持久化候選事件
    """
    try:
        logger.info(f"[SAVE_EVENTS_WITH_DATA] 保存 {len(events)} 個事件到資料庫（包含 dataWindow）")
        logger.info(f"[SAVE_EVENTS_WITH_DATA] events 類型: {type(events)}")
        logger.info(f"[SAVE_EVENTS_WITH_DATA] events 是否為空: {len(events) == 0}")

        # 記錄前幾個事件的結構
        if events:
            logger.info(f"[SAVE_EVENTS_WITH_DATA] 第一個事件結構: {events[0] if events else 'N/A'}")
            logger.info(f"[SAVE_EVENTS_WITH_DATA] 事件的鍵: {list(events[0].keys()) if events else 'N/A'}")

        if not events:
            logger.warning(f"[SAVE_EVENTS_WITH_DATA] events 列表為空，直接返回 0")
            return 0

        async with async_session() as session:
            # 如果允許覆蓋，先刪除現有事件（確保冪等性）
            if allow_overwrite:
                delete_query = text(
                    'DELETE FROM anomaly_event WHERE "experimentRunId" = :run_id'
                )
                await session.execute(delete_query, {"run_id": run_id})
                logger.info(f"[SAVE_EVENTS_WITH_DATA] 已刪除實驗 {run_id} 的現有事件")

            # 批量插入新事件
            events_saved = 0
            for i, event in enumerate(events):
                try:
                    logger.info(f"[SAVE_EVENTS_WITH_DATA] 處理事件 {i+1}/{len(events)}: {event}")

                    # 生成人類可讀的 eventId
                    event_id = f"EXP-{run_id[:8]}-{datetime.utcnow().strftime('%Y%m%d')}-{i+1:03d}"
                    logger.info(f"[SAVE_EVENTS_WITH_DATA] 生成的 eventId: {event_id}")

                    # 為每個事件生成 dataWindow
                    logger.info(f"[SAVE_EVENTS_WITH_DATA] 開始生成 dataWindow...")
                    data_window = await _generate_data_window_for_event(event, df)
                    logger.info(f"[SAVE_EVENTS_WITH_DATA] 生成的 dataWindow 大小: {len(str(data_window))} 字符")

                    # 驗證必需字段
                    required_fields = ["meterId", "eventTimestamp", "detectionRule", "score"]
                    for field in required_fields:
                        if field not in event:
                            logger.error(f"[SAVE_EVENTS_WITH_DATA] 事件 {i} 缺少必需字段: {field}")
                            raise ValueError(f"Missing required field: {field}")

                    insert_query = text("""
                        INSERT INTO anomaly_event (
                            id, "eventId", "meterId", "eventTimestamp", "detectionRule",
                            score, "dataWindow", status, "experimentRunId", "createdAt", "updatedAt"
                        ) VALUES (
                            :id, :eventId, :meterId, :eventTimestamp, :detectionRule,
                            :score, :dataWindow, :status, :experimentRunId, NOW(), NOW()
                        )
                    """)

                    params = {
                        "id": str(uuid.uuid4()),
                        "eventId": event_id,
                        "meterId": event["meterId"],
                        "eventTimestamp": pd.to_datetime(event["eventTimestamp"]).to_pydatetime(),  # 轉換為 datetime 對象
                        "detectionRule": event["detectionRule"],
                        "score": event["score"],
                        "dataWindow": json.dumps(data_window),
                        "status": "UNREVIEWED",  # 預設狀態
                        "experimentRunId": run_id
                    }

                    logger.info(f"[SAVE_EVENTS_WITH_DATA] 插入參數: {params}")

                    await session.execute(insert_query, params)
                    events_saved += 1
                    logger.info(f"[SAVE_EVENTS_WITH_DATA] 成功保存事件 {i+1}, 累計: {events_saved}")

                    if events_saved % 10 == 0:
                        logger.info(f"[SAVE_EVENTS_WITH_DATA] 已保存 {events_saved}/{len(events)} 個事件")

                except Exception as e:
                    logger.error(f"[SAVE_EVENTS_WITH_DATA] 保存事件 {i} 失敗: {e}")
                    logger.error(f"[SAVE_EVENTS_WITH_DATA] 事件數據: {event}")
                    import traceback
                    logger.error(f"[SAVE_EVENTS_WITH_DATA] 詳細錯誤堆棧: {traceback.format_exc()}")
                    continue

            logger.info(f"[SAVE_EVENTS_WITH_DATA] 準備提交事務，已處理 {events_saved} 個事件")
            await session.commit()
            logger.info(f"[SAVE_EVENTS_WITH_DATA] 事務提交完成，成功保存 {events_saved} 個事件")
            return events_saved

    except Exception as e:
        logger.error(f"[SAVE_EVENTS_WITH_DATA] 保存事件到資料庫失敗: {e}")
        import traceback
        logger.error(f"[SAVE_EVENTS_WITH_DATA] 詳細錯誤堆棧: {traceback.format_exc()}")
        raise


async def _generate_data_window_for_event(event: Dict[str, Any], df: pd.DataFrame) -> Dict[str, Any]:
    """
    為候選事件生成包含時序數據的 dataWindow
    這個函數從原始數據中提取事件周圍的時間窗口數據
    """
    try:
        logger.info(f"[DATA_WINDOW] 為事件生成 dataWindow: {event}")

        meter_id = event.get("meterId")
        if not meter_id:
            logger.error(f"[DATA_WINDOW] 事件缺少 meterId 字段: {event}")
            return {
                "eventTimestamp": event.get("eventTimestamp", ""),
                "eventPowerValue": 0,
                "windowStart": event.get("eventTimestamp", ""),
                "windowEnd": event.get("eventTimestamp", ""),
                "timeSeries": [],
                "error": "Missing meterId"
            }

        event_timestamp_str = event.get("eventTimestamp")
        if not event_timestamp_str:
            logger.error(f"[DATA_WINDOW] 事件缺少 eventTimestamp 字段: {event}")
            return {
                "eventTimestamp": "",
                "eventPowerValue": 0,
                "windowStart": "",
                "windowEnd": "",
                "timeSeries": [],
                "error": "Missing eventTimestamp"
            }

        event_timestamp = pd.to_datetime(event_timestamp_str)

        # 檢查 DataFrame 中的列名
        logger.info(f"[DATA_WINDOW] DataFrame 列名: {list(df.columns)}")

        # 根據實際列名確定設備ID列
        device_column = None
        for col in ['meterId', 'deviceNumber', 'device_id']:
            if col in df.columns:
                device_column = col
                break

        if device_column is None:
            logger.error(f"[DATA_WINDOW] DataFrame 中找不到設備ID列")
            return {
                "eventTimestamp": event_timestamp_str,
                "eventPowerValue": 0,
                "windowStart": event_timestamp_str,
                "windowEnd": event_timestamp_str,
                "timeSeries": [],
                "error": "No device ID column found in DataFrame"
            }

        logger.info(f"[DATA_WINDOW] 使用設備ID列: {device_column}")

        # 篩選出該電表的數據
        meter_df = df[df[device_column] == meter_id].copy()

        if meter_df.empty:
            logger.warning(f"[DATA_WINDOW] 沒有找到電表 {meter_id} 的數據")
            return {
                "eventTimestamp": event_timestamp_str,
                "eventPowerValue": 0,
                "windowStart": event_timestamp_str,
                "windowEnd": event_timestamp_str,
                "timeSeries": []
            }

        # 確保時間戳是 datetime 類型
        meter_df['timestamp'] = pd.to_datetime(meter_df['timestamp'])
        meter_df = meter_df.sort_values('timestamp')

        # 定義時間窗口：事件前後各 15 分鐘
        window_start = event_timestamp - timedelta(minutes=15)
        window_end = event_timestamp + timedelta(minutes=15)

        # 篩選時間窗口內的數據
        window_df = meter_df[
            (meter_df['timestamp'] >= window_start) &
            (meter_df['timestamp'] <= window_end)
        ]

        # 找到最接近事件時間的數據點
        time_diffs = abs(meter_df['timestamp'] - event_timestamp)
        closest_idx = time_diffs.idxmin()
        event_power_value = meter_df.loc[closest_idx, 'power'] if not meter_df.empty else 0

        # 構建時序數據列表
        time_series = []
        for _, row in window_df.iterrows():
            time_series.append({
                "timestamp": row['timestamp'].isoformat(),
                "power": float(row['power']) if pd.notna(row['power']) else 0.0
            })

        # 構建 dataWindow 對象
        data_window = {
            "eventTimestamp": event_timestamp_str,
            "eventPowerValue": float(event_power_value) if pd.notna(event_power_value) else 0.0,
            "windowStart": window_start.isoformat(),
            "windowEnd": window_end.isoformat(),
            "timeSeries": time_series,
            "totalDataPoints": len(time_series),
            "detectionRule": event.get("detectionRule", ""),
            "anomalyScore": event.get("score", 0)
        }

        logger.info(f"[DATA_WINDOW] 為事件 {meter_id}@{event_timestamp} 生成了包含 {len(time_series)} 個數據點的時間窗口")
        return data_window

    except Exception as e:
        logger.error(f"[DATA_WINDOW] 生成 dataWindow 失敗: {e}")
        import traceback
        logger.error(f"[DATA_WINDOW] 詳細錯誤堆棧: {traceback.format_exc()}")
        # 返回最小化的 dataWindow
        return {
            "eventTimestamp": event.get("eventTimestamp", ""),
            "eventPowerValue": 0,
            "windowStart": event.get("eventTimestamp", ""),
            "windowEnd": event.get("eventTimestamp", ""),
            "timeSeries": [],
            "error": str(e)
        }


async def _update_experiment_run_to_labeling_status(
    run_id: str,
    calculation_result: Dict[str, Any],
    filtering_parameters: Dict[str, Any],
    events_saved: int
):
    """
    更新實驗批次狀態為 LABELING，並儲存完整的統計資訊
    這是 Proceed to Stage 2 的最後步驟
    """
    try:
        # 轉換 numpy 類型為 Python 原生類型
        clean_calculation_result = _convert_numpy_types(calculation_result)
        clean_filtering_parameters = _convert_numpy_types(filtering_parameters)

        async with async_session() as session:
            update_query = text("""
                UPDATE experiment_run
                SET
                    status = 'LABELING',
                    "candidateCount" = :candidate_count,
                    "candidateStats" = :candidate_stats,
                    "filteringParameters" = :filtering_parameters,
                    "positiveLabelCount" = 0,
                    "negativeLabelCount" = 0,
                    "updatedAt" = NOW()
                WHERE id = :run_id
            """)

            await session.execute(update_query, {
                "run_id": run_id,
                "candidate_count": events_saved,  # 使用實際保存的事件數量
                "candidate_stats": json.dumps(clean_calculation_result),
                "filtering_parameters": json.dumps(clean_filtering_parameters)
            })
            await session.commit()

        logger.info(f"[UPDATE_TO_LABELING] 已更新實驗 {run_id} 狀態為 LABELING，候選事件數量: {events_saved}")

    except Exception as e:
        logger.error(f"[UPDATE_TO_LABELING] 更新實驗狀態失敗: {e}")
        raise


async def _save_events_to_database(
    run_id: str,
    events: List[Dict[str, Any]],
    allow_overwrite: bool
) -> int:
    """將候選事件保存到資料庫"""
    try:
        logger.info(f"[SAVE_EVENTS] 保存 {len(events)} 個事件到資料庫")

        if not events:
            return 0

        async with async_session() as session:
            # 如果允許覆蓋，先刪除現有事件
            if allow_overwrite:
                delete_query = text(
                    'DELETE FROM anomaly_event WHERE "experimentRunId" = :run_id'
                )
                await session.execute(delete_query, {"run_id": run_id})
                logger.info(f"[SAVE_EVENTS] 已刪除實驗 {run_id} 的現有事件")

            # 批量插入新事件
            events_saved = 0
            for event in events:
                try:
                    insert_query = text("""
                        INSERT INTO anomaly_event (
                            id, "eventId", "meterId", "eventTimestamp", "detectionRule",
                            score, "dataWindow", status, "experimentRunId", "createdAt", "updatedAt"
                        ) VALUES (
                            :id, :eventId, :meterId, :eventTimestamp, :detectionRule,
                            :score, :dataWindow, :status, :experimentRunId, NOW(), NOW()
                        )
                    """)

                    await session.execute(insert_query, {
                        "id": event["id"],
                        "eventId": event["eventId"],
                        "meterId": event["meterId"],
                        "eventTimestamp": event["eventTimestamp"],
                        "detectionRule": event["detectionRule"],
                        "score": event["score"],
                        "dataWindow": json.dumps(event["dataWindow"]),
                        "status": event["status"],
                        "experimentRunId": run_id
                    })
                    events_saved += 1

                except Exception as e:
                    logger.warning(f"[SAVE_EVENTS] 保存事件失敗: {e}")
                    continue

            await session.commit()
            logger.info(f"[SAVE_EVENTS] 成功保存 {events_saved} 個事件")
            return events_saved

    except Exception as e:
        logger.error(f"[SAVE_EVENTS] 保存事件到資料庫失敗: {e}")
        raise

# ========== Stage 3 Training Data APIs ==========

@router.get("/{run_id}/training-stats")
async def get_training_stats(run_id: str):
    """
    獲取指定實驗批次的訓練數據統計
    """
    try:
        logger.info(f"Getting training stats for experiment run: {run_id}")

        async with async_session() as session:
            # 檢查實驗批次是否存在
            run_query = text('SELECT * FROM experiment_run WHERE id = :run_id')
            run_result = await session.execute(run_query, {"run_id": run_id})
            run = run_result.fetchone()

            if not run:
                raise HTTPException(status_code=404, detail="Experiment run not found")

            # 獲取真實的統計數據
            # 統計正樣本 (P) - 已標記為 CONFIRMED_POSITIVE 的事件
            positive_query = text("""
                SELECT COUNT(*) as count
                FROM anomaly_event
                WHERE "experimentRunId" = :run_id
                AND status = 'CONFIRMED_POSITIVE'
            """)
            positive_result = await session.execute(positive_query, {"run_id": run_id})
            positive_samples = positive_result.fetchone().count or 0

            # 統計未標記樣本 (U) - 包括 UNREVIEWED 和 REJECTED_NORMAL
            unlabeled_query = text("""
                SELECT COUNT(*) as count
                FROM anomaly_event
                WHERE "experimentRunId" = :run_id
                AND status IN ('UNREVIEWED', 'REJECTED_NORMAL')
            """)
            unlabeled_result = await session.execute(unlabeled_query, {"run_id": run_id})
            unlabeled_samples = unlabeled_result.fetchone().count or 0

            # 記錄統計數據
            if positive_samples == 0 and unlabeled_samples == 0:
                logger.warning(f"No training data found for {run_id}")

            stats = {
                "positiveSamples": positive_samples,
                "unlabeledSamples": unlabeled_samples
            }

            logger.info(f"Training stats for {run_id}: {stats}")
            return stats

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting training stats: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{run_id}/training-data-preview")
async def get_training_data_preview(run_id: str):
    """
    獲取訓練前的數據分布視覺化 - 降維後的 2D 散點圖數據

    這個 API 實現文檔中的「訓練前視覺化」需求：
    1. 獲取 P 樣本（正樣本）和 U 樣本（未標記樣本）
    2. 從 dataWindow 提取特徵
    3. 使用降維算法（t-SNE 或 PCA）降至 2 維
    4. 返回可視化所需的坐標數據
    """
    try:
        logger.info(f"Getting training data preview for experiment run: {run_id}")

        from services.feature_engineering import feature_engineering

        async with async_session() as session:
            # 檢查實驗批次是否存在
            run_query = text('SELECT * FROM experiment_run WHERE id = :run_id')
            run_result = await session.execute(run_query, {"run_id": run_id})
            run = run_result.fetchone()

            if not run:
                raise HTTPException(status_code=404, detail="Experiment run not found")

            # 1. 獲取正樣本 (P) - CONFIRMED_POSITIVE
            p_samples_query = text("""
                SELECT "eventId", "meterId", "eventTimestamp", "detectionRule",
                       score, "dataWindow", status
                FROM anomaly_event
                WHERE "experimentRunId" = :run_id
                AND status = 'CONFIRMED_POSITIVE'
                ORDER BY "eventTimestamp"
            """)
            p_result = await session.execute(p_samples_query, {"run_id": run_id})
            p_rows = p_result.fetchall()

            p_samples = []
            for row in p_rows:
                p_samples.append({
                    "eventId": row.eventId,
                    "meterId": row.meterId,
                    "eventTimestamp": row.eventTimestamp.isoformat() if row.eventTimestamp else "",
                    "detectionRule": row.detectionRule,
                    "score": float(row.score) if row.score else 0,
                    "dataWindow": json.loads(row.dataWindow) if isinstance(row.dataWindow, str) else row.dataWindow,
                    "status": row.status
                })

            # 2. 獲取未標記樣本 (U) - 隨機抽樣
            u_samples_query = text("""
                SELECT "eventId", "meterId", "eventTimestamp", "detectionRule",
                       score, "dataWindow", status
                FROM anomaly_event
                WHERE "experimentRunId" = :run_id
                AND status IN ('UNREVIEWED', 'REJECTED_NORMAL')
                ORDER BY RANDOM()
                LIMIT 1000
            """)
            u_result = await session.execute(u_samples_query, {"run_id": run_id})
            u_rows = u_result.fetchall()

            u_samples = []
            for row in u_rows:
                u_samples.append({
                    "eventId": row.eventId,
                    "meterId": row.meterId,
                    "eventTimestamp": row.eventTimestamp.isoformat() if row.eventTimestamp else "",
                    "detectionRule": row.detectionRule,
                    "score": float(row.score) if row.score else 0,
                    "dataWindow": json.loads(row.dataWindow) if isinstance(row.dataWindow, str) else row.dataWindow,
                    "status": row.status
                })

            logger.info(f"Found {len(p_samples)} P samples and {len(u_samples)} U samples")

            # 3. 檢查是否有足夠的真實數據進行視覺化
            if len(p_samples) < 10 or len(u_samples) < 50:
                logger.warning(f"Insufficient real data for preview (P: {len(p_samples)}, U: {len(u_samples)})")
                return {
                    "pSamples": [],
                    "uSamples": [],
                    "message": f"數據不足：需要至少10個正樣本和50個未標記樣本，當前有 {len(p_samples)} 個正樣本和 {len(u_samples)} 個未標記樣本"
                }

            # 4. 特徵工程
            all_samples = p_samples + u_samples
            feature_matrix, event_ids = feature_engineering.generate_feature_matrix(all_samples)

            if feature_matrix.size == 0:
                logger.warning("Failed to generate features")
                return {
                    "pSamples": [],
                    "uSamples": [],
                    "message": "無法生成特徵：特徵工程失敗"
                }

            # 5. 標準化特徵
            feature_matrix_scaled = feature_engineering.transform_features(feature_matrix)

            # 6. 降維到 2D
            reduced_data = feature_engineering.reduce_dimensions_tsne(feature_matrix_scaled)

            if reduced_data.size == 0:
                logger.warning("Dimensionality reduction failed")
                return {
                    "pSamples": [],
                    "uSamples": [],
                    "message": "降維失敗：無法處理特徵數據"
                }

            # 7. 構建返回數據
            preview_data = {
                "pSamples": [],
                "uSamples": []
            }

            # P 樣本
            for i, sample in enumerate(p_samples):
                if i < len(reduced_data):
                    preview_data["pSamples"].append({
                        "x": float(reduced_data[i][0]),
                        "y": float(reduced_data[i][1]),
                        "category": "P",
                        "id": sample["eventId"],
                        "meterId": sample["meterId"],
                        "score": sample["score"]
                    })

            # U 樣本
            p_count = len(p_samples)
            for i, sample in enumerate(u_samples):
                reduced_idx = p_count + i
                if reduced_idx < len(reduced_data):
                    preview_data["uSamples"].append({
                        "x": float(reduced_data[reduced_idx][0]),
                        "y": float(reduced_data[reduced_idx][1]),
                        "category": "U",
                        "id": sample["eventId"],
                        "meterId": sample["meterId"],
                        "score": sample["score"]
                    })

            logger.info(f"Generated preview with {len(preview_data['pSamples'])} P samples and {len(preview_data['uSamples'])} U samples")
            return preview_data

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting training data preview: {e}")
        import traceback
        logger.error(f"Detailed error: {traceback.format_exc()}")
        # 發生錯誤時返回錯誤信息
        return {
            "pSamples": [],
            "uSamples": [],
            "message": f"獲取訓練數據預覽失敗: {str(e)}"
        }

@router.get("/{run_id}/sample-distribution")
async def get_sample_distribution(run_id: str):
    """
    獲取指定實驗批次的樣本分佈數據 (2D投影) - 已廢棄，使用 training-data-preview 替代
    為了向後兼容而保留
    """
    logger.warning("get_sample_distribution is deprecated. Use get_training_data_preview instead.")
    return await get_training_data_preview(run_id)

# ========== Trained Models API ==========

@router.get("/{run_id}/trained-models")
async def get_trained_models(run_id: str):
    """
    獲取指定實驗批次的訓練模型列表
    這是前端在 Stage 3 Right Panel 中調用的 API
    """
    try:
        logger.info(f"Getting trained models for experiment run: {run_id}")

        async with async_session() as session:
            # 檢查實驗批次是否存在
            run_query = text('SELECT * FROM experiment_run WHERE id = :run_id')
            run_result = await session.execute(run_query, {"run_id": run_id})
            run = run_result.fetchone()

            if not run:
                raise HTTPException(status_code=404, detail="Experiment run not found")

            # 獲取該實驗批次的所有訓練模型
            models_query = text("""
                SELECT
                    tm.id,
                    tm.experiment_run_id,
                    tm.name,
                    tm.scenario_type,
                    tm.data_source_config,
                    tm.model_config,
                    tm.training_metrics,
                    tm.model_path,
                    tm.status,
                    tm.created_at,
                    tm.completed_at
                FROM trained_models tm
                WHERE tm.experiment_run_id = :run_id
                ORDER BY tm.created_at DESC
            """)

            result = await session.execute(models_query, {"run_id": run_id})
            rows = result.fetchall()

            trained_models = []
            for row in rows:
                try:
                    # 解析 JSON 字段
                    data_source_config = json.loads(row.data_source_config) if isinstance(row.data_source_config, str) else row.data_source_config
                    model_config = json.loads(row.model_config) if isinstance(row.model_config, str) else row.model_config
                    training_metrics = json.loads(row.training_metrics) if isinstance(row.training_metrics, str) else row.training_metrics

                    # 構建模型對象 - 符合前端期望的格式
                    model_data = {
                        "id": row.id,
                        "experimentRunId": row.experiment_run_id,
                        "modelName": row.name,
                        "modelType": row.scenario_type,  # 使用 scenario_type 作為模型類型
                        "hyperparameters": model_config or {},
                        "dataSourceConfig": data_source_config or {},
                        "trainingMetrics": training_metrics or {},
                        "status": row.status,
                        "modelPath": row.model_path,
                        "createdAt": row.created_at.isoformat() if row.created_at else None,
                        "completedAt": row.completed_at.isoformat() if row.completed_at else None
                    }

                    trained_models.append(model_data)
                    logger.debug(f"處理模型記錄: {model_data['id']}")

                except Exception as row_error:
                    logger.error(f"處理模型記錄時出錯: {str(row_error)}")
                    continue

            logger.info(f"Found {len(trained_models)} trained models for experiment {run_id}")

            return {
                "success": True,
                "data": trained_models,
                "message": f"Retrieved {len(trained_models)} trained models"
            }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting trained models: {e}")
        import traceback
        logger.error(f"Detailed error: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Failed to get trained models: {str(e)}")
