from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict, Optional, Any
from pydantic import BaseModel
from datetime import datetime, date
import sys
import os
import uuid
import json
import logging
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from services.anomaly_service import anomaly_service
from core.database import db_manager
from sqlalchemy import text
from services.data_loader import data_loader

# 設置日誌
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1", tags=["Case Study Anomaly Detection"])

# ========== Response Models ==========
class AnomalyEventResponse(BaseModel):
    success: bool
    data: Dict[str, Any]
    message: Optional[str] = None

class AnomalyEventsListResponse(BaseModel):
    success: bool
    data: Dict[str, Any]
    message: Optional[str] = None

class AnomalyLabelsResponse(BaseModel):
    success: bool
    data: List[Dict[str, Any]]
    message: Optional[str] = None

class AnomalyStatsResponse(BaseModel):
    success: bool
    data: Dict[str, Any]
    message: Optional[str] = None

class ProjectInsightsResponse(BaseModel):
    success: bool
    data: Dict[str, Any]
    message: Optional[str] = None

# ========== API Endpoints ==========
@router.get("/events", response_model=AnomalyEventsListResponse)
async def get_anomaly_events(
    status: Optional[str] = Query(None, description="Event status filter"),
    meter_id: Optional[str] = Query(None, description="Meter ID filter"),
    search: Optional[str] = Query(None, description="Search term"),
    date_from: Optional[str] = Query(None, description="Start date filter (YYYY-MM-DD)"),
    date_to: Optional[str] = Query(None, description="End date filter (YYYY-MM-DD)"),
    experiment_run_id: Optional[str] = Query(None, description="Experiment run ID filter"),
    page: int = Query(1, description="Page number"),
    limit: int = Query(50, description="Items per page")
):
    """Get anomaly events list with filters and pagination"""
    try:
        # 若指定了 experiment_run_id，且該 run 仍為 CONFIGURING，按規格切換為 LABELING
        if experiment_run_id:
            async with db_manager.get_session() as session:
                q = text("SELECT status FROM experiment_run WHERE id = :rid")
                res = await session.execute(q, {"rid": experiment_run_id})
                row = res.first()
                if row and row.status == 'CONFIGURING':
                    await session.execute(
                        text('UPDATE experiment_run SET status = \"LABELING\", \"updatedAt\" = NOW() WHERE id = :rid'),
                        {"rid": experiment_run_id}
                    )
                    await session.commit()

        # 使用真實的異常服務從資料庫獲取資料，案例研究不使用組織ID
        result = await anomaly_service.get_anomaly_events(
            organization_id=None,  # 案例研究不使用組織ID
            experiment_run_id=experiment_run_id,
            status=status,
            meter_id=meter_id,
            search=search,
            date_from=date_from,
            date_to=date_to,
            page=page,
            limit=limit
        )

        return AnomalyEventsListResponse(
            success=True,
            data=result.dict(),
            message=f"Successfully retrieved {len(result.events)} anomaly events"
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve anomaly events: {str(e)}")

@router.get("/events/{event_id}", response_model=AnomalyEventResponse)
async def get_anomaly_event_detail(event_id: str):
    """Get detailed anomaly event including dataWindow"""
    try:
        event_data = await anomaly_service.get_anomaly_event_by_id(event_id)

        if not event_data:
            raise HTTPException(status_code=404, detail="Anomaly event not found")

        return AnomalyEventResponse(
            success=True,
            data=event_data,
            message="Successfully retrieved anomaly event details"
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve anomaly event details: {str(e)}")

@router.get("/events/{event_id}/window")
async def get_event_data_window(event_id: str, minutes: int = Query(10, ge=1, le=24*60)):
    """Fetch surrounding raw timeseries data for an event within ±minutes window.
    Returns timestamps and values arrays for charting.
    """
    try:
        # 1) Load event basic info (meterId and timestamp)
        async with db_manager.get_session() as session:
            query = text(
                """
                SELECT "meterId" AS meter_id, "eventTimestamp" AS event_ts
                FROM anomaly_event
                WHERE id = :event_id
                """
            )
            res = await session.execute(query, {"event_id": event_id})
            row = res.fetchone()
            if not row:
                raise HTTPException(status_code=404, detail="Anomaly event not found")

        meter_id = row.meter_id
        event_time = row.event_ts

        # 2) Compute window
        from datetime import timedelta
        delta = timedelta(minutes=minutes)
        start_dt = event_time - delta
        end_dt = event_time + delta

        # 3) Load raw data in window and filter by meter
        raw_df = await data_loader.load_meter_data_by_time_range(
            start_time=start_dt.isoformat(),
            end_time=end_dt.isoformat(),
            meter_id=meter_id
        )
        if raw_df.empty:
            return {
                "success": True,
                "data": {
                    "eventId": event_id,
                    "meterId": meter_id,
                    "eventTimestamp": event_time.isoformat(),
                    "dataWindow": {"timestamps": [], "values": []},
                },
                "message": "No raw data in the specified window"
            }

        # Ensure datetime type and filter by device
        import pandas as pd
        df = raw_df.copy()
        if not pd.api.types.is_datetime64_any_dtype(df['timestamp']):
            df['timestamp'] = pd.to_datetime(df['timestamp'])
        df = df[(df['deviceNumber'] == meter_id) & (df['timestamp'] >= start_dt) & (df['timestamp'] <= end_dt)]
        df = df.sort_values('timestamp')

        timestamps = df['timestamp'].dt.strftime('%Y-%m-%d %H:%M:%S').tolist() if len(df) else []
        values = df['power'].astype(float).tolist() if len(df) else []

        return {
            "success": True,
            "data": {
                "eventId": event_id,
                "meterId": meter_id,
                "eventTimestamp": event_time.isoformat(),
                "dataWindow": {"timestamps": timestamps, "values": values},
            },
            "message": f"Fetched ±{minutes} minutes window"
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch event window: {str(e)}")

@router.post("/events", response_model=AnomalyEventResponse)
async def create_anomaly_event(
    event_id: str,
    meter_id: str,
    event_timestamp: str,  # ISO format string
    detection_rule: str,
    score: float,
    data_window: Dict[str, Any]
):
    """Create a new anomaly event"""
    try:
        # Convert timestamp string to datetime
        event_time = datetime.fromisoformat(event_timestamp.replace('Z', '+00:00'))

        # 使用真實的異常服務創建事件，案例研究不使用組織ID
        event_data = await anomaly_service.create_anomaly_event(
            event_id=event_id,
            meter_id=meter_id,
            event_timestamp=event_time,
            detection_rule=detection_rule,
            score=score,
            data_window=data_window,
            organization_id=None  # 案例研究不使用組織ID
        )

        return AnomalyEventResponse(
            success=True,
            data=event_data,
            message="Successfully created anomaly event"
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create anomaly event: {str(e)}")

class ReviewEventRequest(BaseModel):
    status: str
    reviewer_id: str
    justification_notes: Optional[str] = None
    label_ids: Optional[List[str]] = None

class BatchLabelRequest(BaseModel):
    event_ids: List[str]
    status: Optional[str] = None
    label_name: Optional[str] = None
    justification_notes: Optional[str] = ""
    reviewer_id: Optional[str] = "system"

@router.patch("/events/{event_id}/label")
async def label_anomaly_event(
    event_id: str,
    label_data: Dict[str, Any]
):
    """Add labels to anomaly events (corresponding to Stage 2 labeling buttons)"""
    try:
        label_name = label_data.get('label_name')
        status = label_data.get('status')
        justification_notes = label_data.get('justification_notes', '')
        reviewer_id = label_data.get('reviewer_id', 'system')

        if not label_name and not status:
            raise HTTPException(status_code=400, detail="Must provide label_name or status")

        async with db_manager.get_session() as session:
            # 首先檢查事件是否存在
            check_query = "SELECT id, \"experimentRunId\" as run_id FROM anomaly_event WHERE id = :event_id"
            result = await session.execute(text(check_query), {"event_id": event_id})
            row_event = result.first()
            if not row_event:
                raise HTTPException(status_code=404, detail="Anomaly event not found")
            parent_run_id = row_event.run_id

            # 更新事件狀態
            if status:
                update_query = """
                    UPDATE anomaly_event
                    SET status = :status, "reviewerId" = :reviewer_id,
                        "reviewTimestamp" = NOW(), "justificationNotes" = :notes,
                        "updatedAt" = NOW()
                    WHERE id = :event_id
                """
                await session.execute(text(update_query), {
                    "event_id": event_id,
                    "status": status,
                    "reviewer_id": reviewer_id,
                    "notes": justification_notes
                })
                # 同步更新父 ExperimentRun 的標記統計（若有隸屬）
                if parent_run_id:
                    counts_sql = text(
                        """
                        SELECT
                          COUNT(CASE WHEN status = 'CONFIRMED_POSITIVE' THEN 1 END) AS pos,
                          COUNT(CASE WHEN status = 'REJECTED_NORMAL' THEN 1 END) AS neg
                        FROM anomaly_event
                        WHERE "experimentRunId" = :rid
                        """
                    )
                    res_counts = await session.execute(counts_sql, {"rid": parent_run_id})
                    c = res_counts.first()
                    pos_cnt = int(c.pos or 0)
                    neg_cnt = int(c.neg or 0)
                    await session.execute(
                        text(
                            'UPDATE experiment_run SET "positiveLabelCount" = :p, "negativeLabelCount" = :n, "updatedAt" = NOW() WHERE id = :rid'
                        ),
                        {"p": pos_cnt, "n": neg_cnt, "rid": parent_run_id}
                    )

            # 如果提供了標籤名稱，添加標籤關聯
            if label_name:
                # 首先查找或創建標籤（案例研究不使用組織ID）
                label_query = """
                    SELECT id FROM anomaly_label
                    WHERE name = :label_name
                """

                label_result = await session.execute(text(label_query), {
                    "label_name": label_name
                })
                label_record = label_result.first()

                if not label_record:
                    # 創建新標籤
                    create_label_query = """
                        INSERT INTO anomaly_label (id, name, createdAt, updatedAt)
                        VALUES (gen_random_uuid()::text, :label_name, NOW(), NOW())
                        RETURNING id
                    """
                    label_result = await session.execute(text(create_label_query), {
                        "label_name": label_name
                    })
                    label_id = label_result.scalar()
                else:
                    label_id = label_record.id

                # 創建事件-標籤關聯（如果不存在）
                link_query = """
                    INSERT INTO event_label_link (id, eventId, labelId, createdAt)
                    VALUES (gen_random_uuid()::text, :event_id, :label_id, NOW())
                    ON CONFLICT (eventId, labelId) DO NOTHING
                """
                await session.execute(text(link_query), {
                    "event_id": event_id,
                    "label_id": label_id
                })

            await session.commit()

        return {
            "success": True,
            "message": "Anomaly event label updated successfully",
            "updated_fields": {
                "status": status,
                "label_name": label_name,
                "reviewer_id": reviewer_id
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update event label: {str(e)}")

@router.patch("/events/batch-label")
async def batch_label_anomaly_events(
    request: BatchLabelRequest
):
    """Batch add labels to anomaly events"""
    logger.info(f"Batch label request received: {request.dict()}")

    try:
        event_ids = request.event_ids
        label_name = request.label_name
        status = request.status
        justification_notes = request.justification_notes
        reviewer_id = request.reviewer_id

        logger.info(f"Processing batch label for {len(event_ids)} events with status: {status}")

        if not event_ids:
            logger.error("No event IDs provided")
            raise HTTPException(status_code=400, detail="Must provide event ID list")

        if not label_name and not status:
            logger.error("Neither label_name nor status provided")
            raise HTTPException(status_code=400, detail="Must provide label_name or status")

        success_count = 0
        failed_count = 0
        errors = []

        logger.info(f"Starting batch processing for {len(event_ids)} events")

        async with db_manager.get_session() as session:
            # 首先檢查所有事件是否存在
            check_query = """
                SELECT id, "experimentRunId" as run_id
                FROM anomaly_event
                WHERE id = ANY(:event_ids)
            """
            result = await session.execute(text(check_query), {"event_ids": event_ids})
            existing_events = {row.id: row.run_id for row in result.fetchall()}

            logger.info(f"Found {len(existing_events)} existing events out of {len(event_ids)} requested")

            # 處理每個事件
            for event_id in event_ids:
                try:
                    if event_id not in existing_events:
                        failed_count += 1
                        error_msg = f"Event {event_id} not found"
                        errors.append(error_msg)
                        logger.warning(error_msg)
                        continue

                    parent_run_id = existing_events[event_id]

                    # 更新事件狀態
                    if status:
                        update_query = """
                            UPDATE anomaly_event
                            SET status = :status, "reviewerId" = :reviewer_id,
                                "reviewTimestamp" = NOW(), "justificationNotes" = :notes,
                                "updatedAt" = NOW()
                            WHERE id = :event_id
                        """
                        await session.execute(text(update_query), {
                            "event_id": event_id,
                            "status": status,
                            "reviewer_id": reviewer_id,
                            "notes": justification_notes
                        })
                        logger.debug(f"Updated event {event_id} status to {status}")

                    # 如果提供了標籤名稱，添加標籤關聯
                    if label_name:
                        # 查找或創建標籤
                        label_query = """
                            SELECT id FROM anomaly_label
                            WHERE name = :label_name
                        """
                        label_result = await session.execute(text(label_query), {
                            "label_name": label_name
                        })
                        label_record = label_result.first()

                        if not label_record:
                            # 創建新標籤
                            create_label_query = """
                                INSERT INTO anomaly_label (id, name, createdAt, updatedAt)
                                VALUES (gen_random_uuid()::text, :label_name, NOW(), NOW())
                                RETURNING id
                            """
                            label_result = await session.execute(text(create_label_query), {
                                "label_name": label_name
                            })
                            label_id = label_result.scalar()
                            logger.debug(f"Created new label '{label_name}' with ID {label_id}")
                        else:
                            label_id = label_record.id
                            logger.debug(f"Using existing label '{label_name}' with ID {label_id}")

                        # 創建事件-標籤關聯
                        link_query = """
                            INSERT INTO event_label_link (id, eventId, labelId, createdAt)
                            VALUES (gen_random_uuid()::text, :event_id, :label_id, NOW())
                            ON CONFLICT (eventId, labelId) DO NOTHING
                        """
                        await session.execute(text(link_query), {
                            "event_id": event_id,
                            "label_id": label_id
                        })
                        logger.debug(f"Linked event {event_id} to label {label_id}")

                    success_count += 1
                    logger.debug(f"Successfully processed event {event_id}")

                except Exception as e:
                    failed_count += 1
                    error_msg = f"Event {event_id} processing failed: {str(e)}"
                    errors.append(error_msg)
                    logger.error(error_msg)

            # 批量更新父 ExperimentRun 的標記統計
            if status:
                parent_run_ids = set(run_id for run_id in existing_events.values() if run_id)
                logger.info(f"Updating statistics for {len(parent_run_ids)} experiment runs")

                for parent_run_id in parent_run_ids:
                    counts_sql = text(
                        """
                        SELECT
                          COUNT(CASE WHEN status = 'CONFIRMED_POSITIVE' THEN 1 END) AS pos,
                          COUNT(CASE WHEN status = 'REJECTED_NORMAL' THEN 1 END) AS neg
                        FROM anomaly_event
                        WHERE "experimentRunId" = :rid
                        """
                    )
                    res_counts = await session.execute(counts_sql, {"rid": parent_run_id})
                    c = res_counts.first()
                    pos_cnt = int(c.pos or 0)
                    neg_cnt = int(c.neg or 0)
                    await session.execute(
                        text(
                            'UPDATE experiment_run SET "positiveLabelCount" = :p, "negativeLabelCount" = :n, "updatedAt" = NOW() WHERE id = :rid'
                        ),
                        {"p": pos_cnt, "n": neg_cnt, "rid": parent_run_id}
                    )
                    logger.debug(f"Updated experiment run {parent_run_id}: {pos_cnt} positive, {neg_cnt} negative")

            await session.commit()
            logger.info(f"Batch processing completed: {success_count} successful, {failed_count} failed")

        return {
            "success": True,
            "data": {
                "success": success_count,
                "failed": failed_count,
                "errors": errors
            },
            "message": f"Batch label update completed: {success_count} successful, {failed_count} failed"
        }

    except HTTPException:
        raise
    except Exception as e:
        error_msg = f"Failed to batch update event labels: {str(e)}"
        logger.error(error_msg)
        raise HTTPException(status_code=500, detail=error_msg)

@router.delete("/events/{event_id}")
async def delete_anomaly_event(event_id: str):
    """Delete an anomaly event"""
    try:
        success = await anomaly_service.delete_anomaly_event(event_id)

        if not success:
            raise HTTPException(status_code=404, detail="Anomaly event not found")

        return {"success": True, "message": "Anomaly event deleted successfully"}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete anomaly event: {str(e)}")

@router.get("/stats", response_model=AnomalyStatsResponse)
async def get_anomaly_stats(
    experiment_run_id: Optional[str] = Query(None, description="Experiment run ID filter for stats")
):
    """Get anomaly events statistics"""
    try:
        # 使用真實的異常服務獲取統計資料，支援依實驗批次過濾
        stats_data = await anomaly_service.get_anomaly_stats(
            experiment_run_id=experiment_run_id
        )

        return AnomalyStatsResponse(
            success=True,
            data=stats_data.dict(),
            message="Successfully retrieved anomaly statistics"
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve anomaly statistics: {str(e)}")

@router.get("/labels", response_model=AnomalyLabelsResponse)
async def get_anomaly_labels():
    """Get anomaly labels"""
    try:
        # 使用真實的異常服務獲取標籤資料，案例研究不使用組織ID
        labels = await anomaly_service.get_anomaly_labels()

        return AnomalyLabelsResponse(
            success=True,
            data=labels,
            message=f"Successfully retrieved {len(labels)} anomaly labels"
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve anomaly labels: {str(e)}")

@router.post("/labels")
async def create_anomaly_label(
    name: str,
    description: Optional[str]
):
    """Create a new anomaly label"""
    try:
        # 使用真實的異常服務創建標籤，案例研究不使用組織ID
        new_label = await anomaly_service.create_anomaly_label(
            name=name,
            description=description
        )

        return {
            "success": True,
            "data": new_label,
            "message": "Successfully created anomaly label"
        }

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create anomaly label: {str(e)}")

@router.put("/labels/{label_id}")
async def update_anomaly_label(
    label_id: str,
    name: Optional[str] = None,
    description: Optional[str] = None
):
    """Update an anomaly label"""
    try:
        # 使用真實的異常服務更新標籤
        label_data = await anomaly_service.update_anomaly_label(
            label_id=label_id,
            name=name,
            description=description
        )

        if not label_data:
            raise HTTPException(status_code=404, detail="Anomaly label not found")

        return {
            "success": True,
            "data": label_data,
            "message": "Successfully updated anomaly label"
        }

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update anomaly label: {str(e)}")

@router.delete("/labels/{label_id}")
async def delete_anomaly_label(label_id: str):
    """Delete an anomaly label"""
    try:
        success = await anomaly_service.delete_anomaly_label(label_id)

        if not success:
            raise HTTPException(status_code=404, detail="Anomaly label not found")

        return {"success": True, "message": "Anomaly label deleted successfully"}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete anomaly label: {str(e)}")
