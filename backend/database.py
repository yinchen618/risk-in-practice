import os
import json
import logging
from datetime import datetime
from typing import Optional, List, Dict, Any
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, String, Float, Integer, DateTime, Boolean, Text, ForeignKey, JSON, Index, text
from sqlalchemy.future import select
import uuid

# Import base models and connection from core
from core.database import Ammeter, AmmeterLog, Base, engine, async_session, init_database as core_init_database

# 設置 logger
logger = logging.getLogger(__name__)

# Extend engine configuration for PU learning specific needs
# (Keep the existing engine configuration if needed)

# Import core DatabaseManager for inheritance
from core.database import DatabaseManager as CoreDatabaseManager

# Initialize database with all models (core + extended)
async def init_database():
    """Initialize database with both core and PU learning models"""
    await core_init_database()  # Initialize core models
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)  # Initialize extended models
    print("PostgreSQL 資料表已建立 (Core + PU Learning)")

# CRUD 範例
class DatabaseManager(CoreDatabaseManager):
    def __init__(self):
        super().__init__()

    # PU Learning 訓練模型相關方法
    async def save_trained_model(self, model_data: Dict[str, Any]) -> Optional[str]:
        """保存訓練好的模型資訊到數據庫"""
        async with self.session_factory() as session:
            trained_model = TrainedModel(**model_data)
            session.add(trained_model)
            await session.commit()
            return trained_model.id

    async def create_evaluation_run(
        self,
        name: str,
        scenario_type: str,
        trained_model_id: str,
        test_set_source: dict,
        evaluation_metrics: dict = None
    ) -> dict:
        """創建新的評估運行記錄"""
        from datetime import datetime
        import uuid

        evaluation_run_id = str(uuid.uuid4())

        max_retries = 3
        for attempt in range(max_retries):
            try:
                async with self.session_factory() as session:
                    # 使用原生 SQL 插入 EvaluationRun
                    insert_sql = """
                        INSERT INTO evaluation_runs (
                            id, name, scenario_type, status, trained_model_id,
                            test_set_source, evaluation_metrics, created_at
                        ) VALUES (
                            :id, :name, :scenario_type, :status, :trained_model_id,
                            :test_set_source, :evaluation_metrics, :created_at
                        )
                    """

                    await session.execute(
                        text(insert_sql),
                        {
                            "id": evaluation_run_id,
                            "name": name,
                            "scenario_type": scenario_type,
                            "status": "RUNNING",
                            "trained_model_id": trained_model_id,
                            "test_set_source": json.dumps(test_set_source),
                            "evaluation_metrics": json.dumps(evaluation_metrics or {}),
                            "created_at": datetime.utcnow()
                        }
                    )
                    await session.commit()

                    return {
                        "id": evaluation_run_id,
                        "name": name,
                        "scenario_type": scenario_type,
                        "status": "RUNNING",
                        "trained_model_id": trained_model_id,
                        "test_set_source": test_set_source,
                        "evaluation_metrics": evaluation_metrics or {},
                        "created_at": datetime.utcnow()
                    }
            except Exception as e:
                if attempt == max_retries - 1:
                    raise e
                import asyncio
                await asyncio.sleep(1)

    async def update_evaluation_run(
        self,
        evaluation_run_id: str,
        status: str = None,
        evaluation_metrics: dict = None
    ) -> bool:
        """更新評估運行結果"""
        from datetime import datetime

        max_retries = 3
        for attempt in range(max_retries):
            try:
                async with self.session_factory() as session:
                    update_data = {}
                    if status:
                        update_data["status"] = status
                    if evaluation_metrics:
                        update_data["evaluation_metrics"] = json.dumps(evaluation_metrics)
                    if status == "COMPLETED":
                        update_data["completed_at"] = datetime.utcnow()

                    if update_data:
                        # 構建 SET 子句
                        set_clauses = []
                        params = {"id": evaluation_run_id}

                        for key, value in update_data.items():
                            set_clauses.append(f"{key} = :{key}")
                            params[key] = value

                        update_sql = f"""
                            UPDATE evaluation_runs
                            SET {', '.join(set_clauses)}
                            WHERE id = :id
                        """

                        result = await session.execute(text(update_sql), params)
                        await session.commit()
                        return result.rowcount > 0
                    return True
            except Exception as e:
                if attempt == max_retries - 1:
                    raise e
                import asyncio
                await asyncio.sleep(1)

    async def get_evaluation_runs_by_model(
        self,
        trained_model_id: str
    ) -> list:
        """獲取特定模型的所有評估運行"""
        max_retries = 3
        for attempt in range(max_retries):
            try:
                async with self.session_factory() as session:
                    select_sql = """
                        SELECT id, name, scenario_type, status, trained_model_id,
                               test_set_source, evaluation_metrics, created_at, completed_at
                        FROM evaluation_runs
                        WHERE trained_model_id = :trained_model_id
                        ORDER BY created_at DESC
                    """

                    result = await session.execute(
                        text(select_sql),
                        {"trained_model_id": trained_model_id}
                    )

                    evaluations = []
                    for row in result:
                        # 安全處理 JSON 欄位，檢查資料類型
                        test_set_source = row.test_set_source
                        if isinstance(test_set_source, str):
                            try:
                                test_set_source = json.loads(test_set_source)
                            except (json.JSONDecodeError, TypeError):
                                test_set_source = {}
                        elif not isinstance(test_set_source, dict):
                            test_set_source = {}

                        evaluation_metrics = row.evaluation_metrics
                        if isinstance(evaluation_metrics, str):
                            try:
                                evaluation_metrics = json.loads(evaluation_metrics)
                            except (json.JSONDecodeError, TypeError):
                                evaluation_metrics = {}
                        elif not isinstance(evaluation_metrics, dict):
                            evaluation_metrics = {}

                        evaluation = {
                            "id": row.id,
                            "name": row.name,
                            "scenario_type": row.scenario_type,
                            "status": row.status,
                            "trained_model_id": row.trained_model_id,
                            "test_set_source": test_set_source,
                            "evaluation_metrics": evaluation_metrics,
                            "created_at": row.created_at,
                            "completed_at": row.completed_at
                        }
                        evaluations.append(evaluation)

                    return evaluations
            except Exception as e:
                if attempt == max_retries - 1:
                    raise e
                import asyncio
                await asyncio.sleep(1)

    async def get_trained_model_by_id(self, model_id: str) -> dict:
        """獲取訓練模型詳細信息"""
        max_retries = 3
        for attempt in range(max_retries):
            try:
                async with self.session_factory() as session:
                    result = await session.execute(
                        select(TrainedModel).where(TrainedModel.id == model_id)
                    )
                    model = result.scalar_one_or_none()

                    if model:
                        # 安全處理 JSON 欄位
                        model_config = model.model_config
                        if isinstance(model_config, str):
                            try:
                                model_config = json.loads(model_config)
                            except (json.JSONDecodeError, TypeError):
                                model_config = {}
                        elif not isinstance(model_config, dict):
                            model_config = {}

                        data_source_config = model.data_source_config
                        if isinstance(data_source_config, str):
                            try:
                                data_source_config = json.loads(data_source_config)
                            except (json.JSONDecodeError, TypeError):
                                data_source_config = {}
                        elif not isinstance(data_source_config, dict):
                            data_source_config = {}

                        training_metrics = model.training_metrics
                        if isinstance(training_metrics, str):
                            try:
                                training_metrics = json.loads(training_metrics)
                            except (json.JSONDecodeError, TypeError):
                                training_metrics = {}
                        elif not isinstance(training_metrics, dict):
                            training_metrics = {}

                        # 從 model_config 中提取 model_type
                        model_type = model_config.get("model_type", "unknown") if isinstance(model_config, dict) else "unknown"

                        return {
                            "id": model.id,
                            "name": model.name,
                            "scenario_type": model.scenario_type,
                            "status": model.status,
                            "experiment_run_id": model.experiment_run_id,
                            "model_config": model_config,
                            "data_source_config": data_source_config,
                            "model_path": model.model_path,
                            "training_metrics": training_metrics,
                            "created_at": model.created_at,
                            "completed_at": model.completed_at,
                            "model_type": model_type
                        }
                    return None
            except Exception as e:
                if attempt == max_retries - 1:
                    raise e
                import asyncio
                await asyncio.sleep(1)

    async def get_anomaly_events_for_evaluation(
        self,
        selected_floors_by_building: Dict[str, List[str]],
        start_date: str,
        end_date: str,
        start_time: str = "00:00",
        end_time: str = "23:59"
    ) -> Optional['pd.DataFrame']:
        """
        獲取指定範圍的測試數據，從 ammeter_log 真實數據生成樣本用於模型評估

        Args:
            selected_floors_by_building: 選擇的建築樓層（會被忽略，使用所有可用設備）
            start_date: 開始日期 (YYYY-MM-DD)
            end_date: 結束日期 (YYYY-MM-DD)
            start_time: 開始時間 (HH:MM)
            end_time: 結束時間 (HH:MM)

        Returns:
            DataFrame: 包含特徵的測試數據（用於預測）
        """
        import pandas as pd
        import numpy as np
        from datetime import datetime, timedelta
        from sqlalchemy import text

        try:
            async with self.session_factory() as session:
                # 構建時間範圍查詢條件
                start_datetime = datetime.strptime(f"{start_date} {start_time}", "%Y-%m-%d %H:%M")
                end_datetime = datetime.strptime(f"{end_date} {end_time}", "%Y-%m-%d %H:%M")

                logger.info("🔄 使用 ammeter_log 真實數據生成評估樣本")

                # 從 ammeter_log 獲取指定時間範圍內的真實數據
                query = text("""
                    SELECT
                        "deviceNumber" as meter_id,
                        "lastUpdated" as timestamp,
                        voltage,
                        currents as current,
                        power,
                        battery
                    FROM ammeter_log
                    WHERE "lastUpdated" >= :start_time
                        AND "lastUpdated" <= :end_time
                        AND voltage IS NOT NULL
                        AND currents IS NOT NULL
                        AND power IS NOT NULL
                    ORDER BY "lastUpdated" DESC
                    LIMIT 1000
                """)

                result = await session.execute(query, {
                    'start_time': start_datetime,
                    'end_time': end_datetime
                })

                raw_data = result.fetchall()

                if not raw_data:
                    logger.warning(f"⚠️ 在時間範圍 {start_datetime} 到 {end_datetime} 內沒有找到電表數據")
                    # 擴展時間範圍再試一次
                    extended_start = start_datetime - timedelta(days=7)
                    extended_end = end_datetime + timedelta(days=1)
                    logger.info(f"🔄 擴展時間範圍至 {extended_start} 到 {extended_end}")

                    result = await session.execute(query, {
                        'start_time': extended_start,
                        'end_time': extended_end
                    })
                    raw_data = result.fetchall()

                if raw_data:
                    # 轉換為 DataFrame
                    df = pd.DataFrame(raw_data, columns=['meter_id', 'timestamp', 'voltage', 'current', 'power', 'battery'])

                    # 生成真實數據特徵
                    samples = self._generate_real_test_features(df, selected_floors_by_building)

                    if samples:
                        test_df = pd.DataFrame(samples)
                        logger.info(f"🎯 從真實數據生成測試樣本: {len(test_df)} 條記錄")
                        logger.info(f"📊 涵蓋電表: {test_df['meter_id'].nunique()} 個")
                        logger.info(f"⏰ 時間範圍: {test_df['timestamp'].min()} 到 {test_df['timestamp'].max()}")
                        return test_df
                    else:
                        logger.warning("⚠️ 無法從真實數據生成特徵")
                        return None
                else:
                    logger.warning("⚠️ 在擴展時間範圍內仍未找到電表數據")
                    return None

        except Exception as e:
            logger.error(f"從 ammeter_log 獲取真實測試數據失敗: {e}")
            return None

    def _generate_real_test_features(self, df: 'pd.DataFrame', selected_floors_by_building: Dict[str, List[str]]) -> List[Dict]:
        """從真實電表數據生成測試特徵"""
        import numpy as np
        import pandas as pd
        from datetime import timedelta

        samples = []

        # 按電表分組處理數據
        for meter_id, meter_data in df.groupby('meter_id'):
            if len(meter_data) < 5:  # 需要足夠的數據點來計算統計特徵
                continue

            # 按時間排序
            meter_data = meter_data.sort_values('timestamp')

            # 為每個時間窗口生成特徵
            for i in range(len(meter_data)):
                row = meter_data.iloc[i]

                # 獲取當前時間窗口的數據（包括前面的幾個點）
                window_size = min(10, i + 1)  # 最多使用前10個數據點
                window_data = meter_data.iloc[max(0, i - window_size + 1):i + 1]

                if len(window_data) < 3:  # 至少需要3個數據點
                    continue

                # 計算統計特徵
                power_values = window_data['power'].values
                voltage_values = window_data['voltage'].values
                current_values = window_data['current'].values

                # 基本統計特徵
                power_mean = np.mean(power_values)
                power_std = np.std(power_values) if len(power_values) > 1 else 0
                power_max = np.max(power_values)
                power_min = np.min(power_values)
                power_range = power_max - power_min
                power_variance = np.var(power_values) if len(power_values) > 1 else 0

                # 電壓和電流特徵
                voltage_mean = np.mean(voltage_values)
                current_mean = np.mean(current_values)

                # 趨勢特徵（如果有足夠數據點）
                if len(power_values) >= 3:
                    # 計算簡單線性趨勢
                    x = np.arange(len(power_values))
                    try:
                        slope = np.polyfit(x, power_values, 1)[0]
                        power_trend = slope
                    except:
                        power_trend = 0
                else:
                    power_trend = 0

                # 時間特徵
                timestamp = row['timestamp']
                hour_of_day = timestamp.hour
                day_of_week = timestamp.weekday()
                is_weekend = 1 if day_of_week >= 5 else 0

                # 從設備ID映射建築和樓層（簡化映射）
                building, floor = self._map_device_to_building_floor(meter_id)

                features = {
                    'meter_id': meter_id,
                    'timestamp': timestamp,
                    'building': building,
                    'floor': floor,
                    'power_consumption': power_mean,
                    'power_variance': power_variance,
                    'power_trend': power_trend,
                    'power_max': power_max,
                    'power_min': power_min,
                    'power_std': power_std,
                    'power_range': power_range,
                    'voltage_mean': voltage_mean,
                    'current_mean': current_mean,
                    'hour_of_day': hour_of_day,
                    'day_of_week': day_of_week,
                    'is_weekend': is_weekend,
                }

                samples.append(features)

                # 限制樣本數量
                if len(samples) >= 1000:
                    break

            if len(samples) >= 1000:
                break

        logger.info(f"🔧 從真實數據生成特徵: {len(samples)} 條記錄")
        return samples

    def _map_device_to_building_floor(self, device_id: str) -> tuple:
        """將設備ID映射到建築和樓層（簡化版本）"""
        # 根據設備ID前綴或其他規則映射到建築樓層
        # 這裡使用簡化的映射邏輯
        if device_id.startswith('402A8FB0'):
            return 'Building A', '1'
        elif device_id.startswith('E8FDF8B4'):
            return 'Building A', '2'
        elif device_id.startswith('402A8FB1'):
            return 'Building B', '1'
        else:
            # 默認映射
            return 'Building A', '2'

# 異常事件相關表
class AnomalyEvent(Base):
    __tablename__ = "anomaly_events"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    event_id = Column(String, nullable=False, unique=True)
    meter_id = Column(String, nullable=False)
    event_timestamp = Column(DateTime, nullable=False)
    detection_rule = Column(String, nullable=False)
    score = Column(Float, nullable=False)
    data_window = Column(JSON)  # 存儲時間序列資料
    status = Column(String, nullable=False, default="UNREVIEWED")  # UNREVIEWED, CONFIRMED_POSITIVE, REJECTED_NORMAL
    reviewer_id = Column(String)
    review_timestamp = Column(DateTime)
    justification_notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # 為效能建立索引
    __table_args__ = (
        Index('idx_anomaly_event_meter_timestamp', 'meter_id', 'event_timestamp'),
        Index('idx_anomaly_event_status', 'status'),
        Index('idx_anomaly_event_timestamp', 'event_timestamp'),
    )

class AnomalyLabel(Base):
    __tablename__ = "anomaly_labels"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    description = Column(Text)
    color = Column(String, default="#6B7280")  # 標籤顏色
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class EventLabelLink(Base):
    __tablename__ = "event_label_links"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    event_id = Column(String, ForeignKey('anomaly_events.id'), nullable=False)
    label_id = Column(String, ForeignKey('anomaly_labels.id'), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # 確保同一事件和標籤的組合唯一
    __table_args__ = (
        Index('idx_event_label_unique', 'event_id', 'label_id', unique=True),
    )

# 時間序列資料表（用於存儲詳細的感測器資料）
class TimeSeriesData(Base):
    __tablename__ = "timeseries_data"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    device_id = Column(String, nullable=False)
    timestamp = Column(DateTime, nullable=False)
    metric_name = Column(String, nullable=False)  # voltage, current, power, etc.
    value = Column(Float, nullable=False)
    unit = Column(String)  # V, A, W, etc.
    created_at = Column(DateTime, default=datetime.utcnow)

    # 為查詢效能建立關鍵索引
    __table_args__ = (
        Index('idx_timeseries_device_timestamp', 'device_id', 'timestamp'),
        Index('idx_timeseries_timestamp', 'timestamp'),
        Index('idx_timeseries_device_metric', 'device_id', 'metric_name'),
    )

# PU Learning 訓練模型表
class TrainedModel(Base):
    __tablename__ = "trained_models"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    experiment_run_id = Column(String, nullable=False)

    # 訓練情境相關（使用實際資料庫欄位名稱）
    scenario_type = Column('scenario_type', String, nullable=False) # 'ERM_BASELINE' or 'DOMAIN_ADAPTATION'
    data_source_config = Column('data_source_config', JSON) # Source data and split configuration
    model_config = Column('model_config', JSON)  # Model hyperparameters

    # 訓練結果
    model_path = Column('model_path', String, nullable=True) # Path to the stored model file, available on completion
    training_metrics = Column('training_metrics', JSON, nullable=True)  # Training and validation metrics

    # 狀態與時間戳
    status = Column(String, nullable=False, default="RUNNING")  # RUNNING, COMPLETED, FAILED
    created_at = Column('created_at', DateTime, default=datetime.utcnow)
    completed_at = Column('completed_at', DateTime, nullable=True)

    # 索引
    __table_args__ = (
        Index('idx_trained_model_experiment', 'experiment_run_id'),
        Index('idx_trained_model_status', 'status'),
    )

    async def create_model_predictions(
        self,
        evaluation_run_id: str,
        predictions: List[Dict[str, Any]]
    ) -> List[str]:
        """批量創建模型預測記錄"""
        from datetime import datetime
        import uuid

        prediction_ids = []
        max_retries = 3

        for attempt in range(max_retries):
            try:
                async with self.session_factory() as session:
                    for pred in predictions:
                        prediction_id = str(uuid.uuid4())
                        prediction_ids.append(prediction_id)

                        # 使用原生 SQL 插入 ModelPrediction
                        insert_sql = """
                            INSERT INTO model_predictions (
                                id, evaluation_run_id, anomaly_event_id, timestamp,
                                prediction_score, ground_truth
                            ) VALUES (
                                :id, :evaluation_run_id, :anomaly_event_id, :timestamp,
                                :prediction_score, :ground_truth
                            )
                        """

                        await session.execute(
                            text(insert_sql),
                            {
                                "id": prediction_id,
                                "evaluation_run_id": evaluation_run_id,
                                "anomaly_event_id": pred.get("anomaly_event_id"),
                                "timestamp": pred.get("timestamp", datetime.utcnow()),
                                "prediction_score": float(pred["prediction_score"]),
                                "ground_truth": int(pred["ground_truth"]) if pred.get("ground_truth") is not None else None
                            }
                        )

                    await session.commit()
                    return prediction_ids

            except Exception as e:
                if attempt == max_retries - 1:
                    raise e
                import asyncio
                await asyncio.sleep(1)

        return prediction_ids


db_manager = DatabaseManager()
