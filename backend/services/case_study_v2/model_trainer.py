"""
Model Trainer Service
Handles Stage 3: Model Training with real-time logging
"""

import asyncio
import logging
from datetime import datetime
from typing import Dict, Any
import random
import pickle
import os

from .models import StartTrainingJobRequest
from .database import DatabaseManager

logger = logging.getLogger(__name__)

class ModelTrainer:
    def __init__(self, db_manager: DatabaseManager):
        self.db_manager = db_manager
        self.websocket_manager = None  # Will be injected by main app

    def set_websocket_manager(self, websocket_manager):
        """Inject websocket manager for real-time logging"""
        self.websocket_manager = websocket_manager

    async def train_model(self, job_id: str, trained_model_id: str, config: StartTrainingJobRequest):
        """
        Train a PU learning model with real-time progress logging
        """
        logger.info(f"Starting training job {job_id} for model {trained_model_id}")

        try:
            # Update model status to running
            await self.db_manager.update_trained_model(trained_model_id, 'RUNNING')

            # Send initial log
            await self._log(job_id, f"INFO: [Training Job: {job_id}] Initializing {config.training_config.model_type} model...")

            # Simulate training process
            await self._simulate_training_process(job_id, trained_model_id, config)

            # Mark as completed
            training_metrics = await self._generate_training_metrics(config)
            model_path = await self._save_model_artifact(trained_model_id, config)

            await self.db_manager.update_trained_model(
                trained_model_id,
                'COMPLETED',
                model_path=model_path,
                training_metrics=training_metrics,
                completed_at=datetime.now()
            )

            await self._log(job_id, f"INFO: [Training Job: {job_id}] Training completed successfully.")
            await self._log(job_id, f"INFO: [Training Job: {job_id}] Model artifact saved to: {model_path}")

            logger.info(f"Training job {job_id} completed successfully")

        except Exception as e:
            logger.error(f"Error in training job {job_id}: {str(e)}")
            await self.db_manager.update_trained_model(trained_model_id, 'FAILED')
            await self._log(job_id, f"ERROR: [Training Job: {job_id}] Training failed: {str(e)}")

    async def _simulate_training_process(self, job_id: str, model_id: str, config: StartTrainingJobRequest):
        """Simulate the model training process with realistic logging"""

        # Data loading simulation
        await self._log(job_id, f"INFO: [Training Job: {job_id}] Loading training data from experiment run...")
        await asyncio.sleep(1)

        # Simulate data statistics
        total_samples = random.randint(2000, 5000)
        train_samples = int(total_samples * config.data_source_config.data_split_ratio.get('train', 0.7))
        val_samples = int(total_samples * config.data_source_config.data_split_ratio.get('val', 0.15))

        await self._log(job_id, f"INFO: [Training Job: {job_id}] Data loaded: {train_samples} training samples, {val_samples} validation samples.")

        # Estimate class prior
        if config.training_config.prior is None:
            estimated_prior = random.uniform(0.01, 0.05)
            await self._log(job_id, f"INFO: [Training Job: {job_id}] Class prior estimated: {estimated_prior:.4f}")
        else:
            await self._log(job_id, f"INFO: [Training Job: {job_id}] Using provided class prior: {config.training_config.prior:.4f}")

        # Training loop simulation
        epochs = config.training_config.epochs
        await self._log(job_id, f"INFO: [Training Job: {job_id}] Starting training for {epochs} epochs...")

        for epoch in range(1, epochs + 1):
            # Simulate training time
            await asyncio.sleep(0.1)  # Quick simulation

            # Generate realistic metrics
            loss = 1.0 * (0.9 ** (epoch / 10)) + random.uniform(-0.1, 0.1)
            val_accuracy = 0.95 + 0.04 * (1 - (0.95 ** epoch)) + random.uniform(-0.02, 0.02)
            val_accuracy = max(0.8, min(0.99, val_accuracy))  # Clamp values

            # Log every 10 epochs or at the end
            if epoch % 10 == 0 or epoch == epochs:
                await self._log(job_id, f"DEBUG: [Training Job: {job_id}] Epoch {epoch}/{epochs} - Loss: {loss:.4f}, Val_Accuracy: {val_accuracy:.3f}")

        await self._log(job_id, f"INFO: [Training Job: {job_id}] Training loop completed.")

    async def _generate_training_metrics(self, config: StartTrainingJobRequest) -> Dict[str, Any]:
        """Generate realistic training metrics"""
        return {
            'final_loss': random.uniform(0.2, 0.6),
            'final_accuracy': random.uniform(0.92, 0.98),
            'best_val_accuracy': random.uniform(0.94, 0.99),
            'training_time_seconds': random.randint(30, 300),
            'total_epochs': config.training_config.epochs,
            'model_parameters': {
                'learning_rate': config.training_config.learning_rate,
                'batch_size': config.training_config.batch_size,
                'prior': config.training_config.prior or random.uniform(0.01, 0.05),
                'beta': config.training_config.beta,
                'gamma': config.training_config.gamma
            },
            'convergence_epoch': random.randint(20, config.training_config.epochs - 10)
        }

    async def _save_model_artifact(self, model_id: str, config: StartTrainingJobRequest) -> str:
        """Save model artifact to disk (simulation)"""
        # Create models directory if it doesn't exist
        models_dir = "/tmp/pu_models"
        os.makedirs(models_dir, exist_ok=True)

        # Generate model file path
        model_filename = f"{config.training_config.model_type}_{model_id}.pkl"
        model_path = os.path.join(models_dir, model_filename)

        # Simulate saving model (create a dummy file)
        model_data = {
            'model_type': config.training_config.model_type,
            'model_id': model_id,
            'config': config.training_config.dict(),
            'created_at': datetime.now().isoformat()
        }

        with open(model_path, 'wb') as f:
            pickle.dump(model_data, f)

        return model_path

    async def _log(self, job_id: str, message: str):
        """Send log message via WebSocket if available"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        formatted_message = f"[{timestamp}] {message}"

        if self.websocket_manager:
            await self.websocket_manager.broadcast_training_log(job_id, formatted_message)

        # Also log to Python logger
        logger.info(f"Training Job {job_id}: {message}")
