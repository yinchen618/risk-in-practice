"""
Database manager for Case Study v2
Handles all database operations using Prisma ORM
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'database', 'prisma', 'generated'))

from prisma import Prisma
from typing import List, Dict, Any, Optional
import json
from datetime import datetime
import logging

from .models import ExperimentHistoryResponse, ExperimentRunResponse, TrainedModelResponse, EvaluationRunResponse

logger = logging.getLogger(__name__)

class DateTimeEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.isoformat()
        return super().default(obj)

class DatabaseManager:
    def __init__(self):
        self.db = Prisma()

    async def connect(self):
        """Connect to the database"""
        await self.db.connect()
        logger.info("Database connected successfully")

    async def disconnect(self):
        """Disconnect from the database"""
        await self.db.disconnect()
        logger.info("Database disconnected")

    # ========== ExperimentRun Operations ==========

    async def create_experiment_run(
        self,
        name: str,
        description: Optional[str],
        filtering_parameters: Dict[str, Any]
    ):
        """Create a new experiment run"""
        return await self.db.experimentrun.create(
            data={
                'name': name,
                'description': description,
                'filteringParameters': json.dumps(filtering_parameters, cls=DateTimeEncoder),
                'status': 'CONFIGURING'
            }
        )

    async def get_experiment_runs(self) -> List[Any]:
        """獲取所有實驗運行列表"""
        try:
            runs = await self.db.experimentrun.find_many(
            order={'createdAt': 'desc'}
        )
            return runs
        except Exception as e:
            logger.error(f"Error fetching experiment runs: {e}")
            raise

    async def get_experiment_run(self, run_id: str):
        """Get a specific experiment run by ID"""
        return await self.db.experimentrun.find_unique(
            where={'id': run_id}
        )

    async def update_experiment_run_status(self, run_id: str, status: str, stats: Optional[Dict[str, Any]] = None):
        """Update experiment run status and stats"""
        update_data = {'status': status, 'updated_at': datetime.now()}
        if stats:
            update_data.update({
                'candidate_count': stats.get('candidate_count'),
                'positive_label_count': stats.get('positive_label_count'),
                'negative_label_count': stats.get('negative_label_count'),
                'candidate_stats': json.dumps(stats)
            })

        return await self.db.experimentrun.update(
            where={'id': run_id},
            data=update_data
        )

    # ========== AnomalyEvent Operations ==========

    async def create_anomaly_event(
        self,
        event_id: str,
        meter_id: str,
        event_timestamp: datetime,
        detection_rule: str,
        score: float,
        data_window: Dict[str, Any],
        experiment_run_id: str
    ):
        """Create a new anomaly event"""
        return await self.db.anomalyevent.create(
            data={
                'event_id': event_id,
                'meter_id': meter_id,
                'event_timestamp': event_timestamp,
                'detection_rule': detection_rule,
                'score': score,
                'data_window': json.dumps(data_window),
                'experiment_run_id': experiment_run_id,
                'status': 'UNREVIEWED'
            }
        )

    async def get_anomaly_events_by_experiment(self, experiment_run_id: str):
        """獲取指定實驗運行的異常事件"""
        events = await self.db.anomalyevent.find_many(
            where={'experimentRunId': experiment_run_id},
        )
        return events

    async def update_anomaly_event_status(
        self,
        event_id: str,
        status: str,
        reviewer_id: str,
        justification_notes: Optional[str] = None
    ):
        """Update anomaly event label status"""
        return await self.db.anomalyevent.update(
            where={'id': event_id},
            data={
                'status': status,
                'reviewer_id': reviewer_id,
                'review_timestamp': datetime.now(),
                'justification_notes': justification_notes,
                'updated_at': datetime.now()
            }
        )

    # ========== TrainedModel Operations ==========

    async def create_trained_model(
        self,
        name: str,
        scenario_type: str,
        experiment_run_id: str,
        model_config: Dict[str, Any],
        data_source_config: Dict[str, Any],
        job_id: Optional[str] = None
    ) -> Any:
        """創建新的訓練模型記錄"""
        try:
            model = await self.db.trainedmodel.create(
                data={
                'name': name,
                'scenarioType': scenario_type,
                'status': 'PENDING',
                'experimentRunId': experiment_run_id,
                'modelConfig': json.dumps(model_config),
                'dataSourceConfig': json.dumps(data_source_config),
                'jobId': job_id
            }
        )
            return model
        except Exception as e:
            logger.error(f"Error creating trained model: {e}")
            raise

    async def update_trained_model(
        self,
        model_id: str,
        status: str,
        model_path: Optional[str] = None,
        training_metrics: Optional[Dict[str, Any]] = None,
        completed_at: Optional[datetime] = None
    ):
        """Update trained model status and results"""
        update_data = {'status': status}

        if model_path:
            update_data['model_path'] = model_path
        if training_metrics:
            update_data['training_metrics'] = json.dumps(training_metrics)
        if completed_at:
            update_data['completed_at'] = completed_at

        return await self.db.trainedmodel.update(
            where={'id': model_id},
            data=update_data
        )

    async def get_trained_model(self, model_id: str):
        """Get a trained model by ID"""
        model = await self.db.trainedmodel.find_unique(
            where={'id': model_id}
        )

        if model:
            if model.model_config:
                model.model_config = json.loads(model.model_config)
            if model.data_source_config:
                model.data_source_config = json.loads(model.data_source_config)
            if model.training_metrics:
                model.training_metrics = json.loads(model.training_metrics)

        return model

    # ========== EvaluationRun Operations ==========

    async def create_evaluation_run(
        self,
        name: str,
        scenario_type: str,
        trained_model_id: str,
        test_set_source: Dict[str, Any],
        job_id: str
    ):
        """Create a new evaluation run record"""
        return await self.db.evaluationrun.create(
            data={
                'name': name,
                'scenarioType': scenario_type,
                'status': 'PENDING',
                'trainedModelId': trained_model_id,
                'testSetSource': json.dumps(test_set_source),
                'jobId': job_id
            }
        )

    async def update_evaluation_run(
        self,
        evaluation_id: str,
        status: str,
        evaluation_metrics: Optional[Dict[str, Any]] = None,
        completed_at: Optional[datetime] = None
    ):
        """Update evaluation run status and results"""
        update_data = {'status': status}

        if evaluation_metrics:
            update_data['evaluation_metrics'] = json.dumps(evaluation_metrics)
        if completed_at:
            update_data['completed_at'] = completed_at

        return await self.db.evaluationrun.update(
            where={'id': evaluation_id},
            data=update_data
        )

    async def get_evaluation_run(self, evaluation_id: str):
        """Get an evaluation run by ID with trained model"""
        evaluation = await self.db.evaluationrun.find_unique(
            where={'id': evaluation_id},
            include={'trained_model': True}
        )

        if evaluation:
            if evaluation.test_set_source:
                evaluation.test_set_source = json.loads(evaluation.test_set_source)
            if evaluation.evaluation_metrics:
                evaluation.evaluation_metrics = json.loads(evaluation.evaluation_metrics)

            # Parse trained model JSON fields
            if evaluation.trained_model:
                if evaluation.trained_model.model_config:
                    evaluation.trained_model.model_config = json.loads(evaluation.trained_model.model_config)
                if evaluation.trained_model.data_source_config:
                    evaluation.trained_model.data_source_config = json.loads(evaluation.trained_model.data_source_config)
                if evaluation.trained_model.training_metrics:
                    evaluation.trained_model.training_metrics = json.loads(evaluation.trained_model.training_metrics)

        return evaluation

    # ========== Experiment History Operations ==========

    async def get_experiment_history(self, experiment_run_id: str) -> ExperimentHistoryResponse:
        """Get full experiment history including all trained models and evaluation runs"""
        # Get experiment run
        experiment_run = await self.db.experimentrun.find_unique(
            where={'id': experiment_run_id}
        )

        if not experiment_run:
            raise ValueError(f"Experiment run {experiment_run_id} not found")

        # Parse JSON fields
        if experiment_run.filtering_parameters:
            experiment_run.filtering_parameters = json.loads(experiment_run.filtering_parameters)
        if experiment_run.candidate_stats:
            experiment_run.candidate_stats = json.loads(experiment_run.candidate_stats)

        # Get all trained models
        trained_models = await self.db.trainedmodel.find_many(
            where={'experimentRunId': experiment_run_id},
            order={'createdAt': 'desc'}
        )

        # Parse JSON fields for trained models
        for model in trained_models:
            if model.model_config:
                model.model_config = json.loads(model.model_config)
            if model.data_source_config:
                model.data_source_config = json.loads(model.data_source_config)
            if model.training_metrics:
                model.training_metrics = json.loads(model.training_metrics)

        # Get all evaluation runs for these models
        model_ids = [model.id for model in trained_models]
        evaluation_runs = []

        if model_ids:
            evaluations = await self.db.evaluationrun.find_many(
                where={'trainedModelId': {'in': model_ids}},
                include={'trainedModel': True},
                order={'createdAt': 'desc'}
            )

            # Parse JSON fields for evaluation runs
            for evaluation in evaluations:
                if evaluation.test_set_source:
                    evaluation.test_set_source = json.loads(evaluation.test_set_source)
                if evaluation.evaluation_metrics:
                    evaluation.evaluation_metrics = json.loads(evaluation.evaluation_metrics)

                evaluation_runs.append(evaluation)

        return ExperimentHistoryResponse(
            experiment_run=ExperimentRunResponse.from_orm(experiment_run),
            trained_models=[TrainedModelResponse.from_orm(model) for model in trained_models],
            evaluation_runs=[EvaluationRunResponse.from_orm(eval_run) for eval_run in evaluation_runs]
        )

    # ========== AnalysisDataset Operations ==========

    async def get_analysis_datasets(self):
        """Get all available analysis datasets"""
        return await self.db.analysisdataset.find_many(
            order={'createdAt': 'desc'}
        )

    async def get_analysis_dataset(self, dataset_id: str):
        """Get a specific analysis dataset by ID"""
        return await self.db.analysisdataset.find_unique(
            where={'id': dataset_id}
        )
