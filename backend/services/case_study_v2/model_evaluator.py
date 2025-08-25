"""
Model Evaluator Service
Handles model evaluation with real-time logging
"""

import asyncio
import logging
from datetime import datetime
from typing import Dict, Any, List
import random
import pickle
import os

from .models import StartEvaluationJobRequest
from .database import DatabaseManager

logger = logging.getLogger(__name__)

class ModelEvaluator:
    def __init__(self, db_manager: DatabaseManager):
        self.db_manager = db_manager
        self.websocket_manager = None  # Will be injected by main app

    def set_websocket_manager(self, websocket_manager):
        """Inject websocket manager for real-time logging"""
        self.websocket_manager = websocket_manager

    async def evaluate_model(self, job_id: str, evaluation_run_id: str, config: StartEvaluationJobRequest):
        """
        Evaluate a trained model with real-time progress logging
        """
        logger.info(f"Starting evaluation job {job_id} for evaluation run {evaluation_run_id}")

        try:
            # Update evaluation status to running
            await self.db_manager.update_evaluation_run(evaluation_run_id, 'RUNNING')

            # Get trained model info
            trained_model = await self.db_manager.get_trained_model(config.trained_model_id)
            if not trained_model:
                raise ValueError(f"Trained model {config.trained_model_id} not found")

            model_name = trained_model.name
            await self._log(job_id, f"INFO: [Evaluation Job: {job_id}] Starting evaluation for model '{model_name}'.")

            # Simulate evaluation process
            evaluation_metrics = await self._simulate_evaluation_process(job_id, config, model_name)

            # Mark as completed
            await self.db_manager.update_evaluation_run(
                evaluation_run_id,
                'COMPLETED',
                evaluation_metrics=evaluation_metrics,
                completed_at=datetime.now()
            )

            await self._log(job_id, f"INFO: [Evaluation Job: {job_id}] Evaluation finished. Results: {evaluation_metrics}")

            logger.info(f"Evaluation job {job_id} completed successfully")

        except Exception as e:
            logger.error(f"Error in evaluation job {job_id}: {str(e)}")
            await self.db_manager.update_evaluation_run(evaluation_run_id, 'FAILED')
            await self._log(job_id, f"ERROR: [Evaluation Job: {job_id}] Evaluation failed: {str(e)}")

    async def _simulate_evaluation_process(self, job_id: str, config: StartEvaluationJobRequest, model_name: str) -> Dict[str, Any]:
        """Simulate the model evaluation process with realistic logging"""

        # Load test data
        if config.scenario_type == "GENERALIZATION_CHALLENGE":
            source_desc = "pre-trained model test set"
        elif config.scenario_type == "DOMAIN_ADAPTATION":
            target_run = config.test_set_source.experiment_run_id
            source_desc = f"Target ExperimentRun '{target_run}'"
        else:
            source_desc = "held-out test set"

        await self._log(job_id, f"INFO: [Evaluation Job: {job_id}] Loading test data from {source_desc}...")
        await asyncio.sleep(1)

        # Simulate test data statistics
        test_samples = random.randint(1000, 8000)
        await self._log(job_id, f"INFO: [Evaluation Job: {job_id}] Test data loaded: {test_samples} samples.")

        # Model prediction simulation
        await self._log(job_id, f"INFO: [Evaluation Job: {job_id}] Model prediction in progress...")

        # Simulate prediction progress
        batch_size = 1000
        for processed in range(batch_size, test_samples + 1, batch_size):
            await asyncio.sleep(0.2)  # Simulate processing time
            processed = min(processed, test_samples)
            await self._log(job_id, f"DEBUG: [Evaluation Job: {job_id}] Prediction completed for {processed}/{test_samples} samples.")

        await self._log(job_id, f"INFO: [Evaluation Job: {job_id}] All predictions completed. Calculating performance metrics...")
        await asyncio.sleep(1)

        # Generate realistic evaluation metrics
        metrics = self._generate_evaluation_metrics(config.scenario_type)

        return metrics

    def _generate_evaluation_metrics(self, scenario_type: str) -> Dict[str, Any]:
        """Generate realistic evaluation metrics based on scenario type"""

        # Base performance varies by scenario
        if scenario_type == "ERM_BASELINE":
            # Best case scenario - same distribution
            base_f1 = random.uniform(0.85, 0.95)
            base_precision = random.uniform(0.82, 0.93)
            base_recall = random.uniform(0.88, 0.96)
        elif scenario_type == "GENERALIZATION_CHALLENGE":
            # Pre-trained model may not generalize well
            base_f1 = random.uniform(0.65, 0.82)
            base_precision = random.uniform(0.70, 0.85)
            base_recall = random.uniform(0.60, 0.80)
        else:  # DOMAIN_ADAPTATION
            # Cross-domain performance
            base_f1 = random.uniform(0.72, 0.88)
            base_precision = random.uniform(0.75, 0.90)
            base_recall = random.uniform(0.70, 0.85)

        # Calculate dependent metrics
        accuracy = random.uniform(0.92, 0.98)

        # Generate confusion matrix (normalized)
        tp_rate = base_recall
        fp_rate = random.uniform(0.02, 0.15)
        fn_rate = 1 - tp_rate
        tn_rate = 1 - fp_rate

        # AUC-ROC and AUC-PR
        auc_roc = random.uniform(base_f1 - 0.1, min(0.99, base_f1 + 0.05))
        auc_pr = random.uniform(base_f1 - 0.15, min(0.95, base_f1))

        return {
            'f1_score': round(base_f1, 4),
            'precision': round(base_precision, 4),
            'recall': round(base_recall, 4),
            'accuracy': round(accuracy, 4),
            'auc_roc': round(auc_roc, 4),
            'auc_pr': round(auc_pr, 4),
            'confusion_matrix': {
                'true_positive_rate': round(tp_rate, 4),
                'false_positive_rate': round(fp_rate, 4),
                'false_negative_rate': round(fn_rate, 4),
                'true_negative_rate': round(tn_rate, 4)
            },
            'class_distribution': {
                'positive_samples': random.randint(50, 200),
                'negative_samples': random.randint(800, 1500),
                'total_samples': random.randint(1000, 2000)
            },
            'evaluation_time_seconds': random.randint(10, 60),
            'scenario_type': scenario_type
        }

    async def _log(self, job_id: str, message: str):
        """Send log message via WebSocket if available"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        formatted_message = f"[{timestamp}] {message}"

        if self.websocket_manager:
            await self.websocket_manager.broadcast_evaluation_log(job_id, formatted_message)

        # Also log to Python logger
        logger.info(f"Evaluation Job {job_id}: {message}")
