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
            await self._log(job_id, f"INFO: [Training Job: {job_id}] Initializing {config.training_config.modelType} model...")

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
        """Simulate the nnPU model training process with realistic logging"""

        # Data loading simulation
        await self._log(job_id, f"🚀 Initializing nnPU training environment...")
        await self._log(job_id, f"📊 Loading training data from experiment run...")
        await asyncio.sleep(1)

        # Simulate data statistics
        total_samples = random.randint(2000, 5000)
        train_ratio = config.data_source_config.trainRatio / 100.0
        val_ratio = config.data_source_config.validationRatio / 100.0

        train_samples = int(total_samples * train_ratio)
        val_samples = int(total_samples * val_ratio)

        await self._log(job_id, f"📈 Data loaded: {train_samples} training samples, {val_samples} validation samples")
        await self._log(job_id, f"🔧 Setting up {config.training_config.modelType} architecture...")

        # Model configuration logging
        model_config = config.training_config
        await self._log(job_id, f"⚙️  Model Configuration:")
        await self._log(job_id, f"   • Architecture: {model_config.modelType}")
        await self._log(job_id, f"   • Hidden Size: {model_config.hiddenSize}")
        await self._log(job_id, f"   • Layers: {model_config.numLayers}")
        await self._log(job_id, f"   • Activation: {model_config.activationFunction}")
        await self._log(job_id, f"   • Dropout: {model_config.dropout}")
        await self._log(job_id, f"   • Window Size: {model_config.windowSize} minutes")

        # nnPU specific configuration
        await self._log(job_id, f"🎯 nnPU Configuration:")
        await self._log(job_id, f"   • Class Prior (π_p): {model_config.classPrior}")
        await self._log(job_id, f"   • Optimizer: {model_config.optimizer}")
        await self._log(job_id, f"   • Learning Rate: {model_config.learningRate}")
        await self._log(job_id, f"   • Batch Size: {model_config.batchSize}")
        await self._log(job_id, f"   • L2 Regularization: {model_config.l2Regularization}")

        if model_config.earlyStopping:
            await self._log(job_id, f"   • Early Stopping: Enabled (patience: {model_config.patience})")
        else:
            await self._log(job_id, f"   • Early Stopping: Disabled")

        if model_config.learningRateScheduler != "none":
            await self._log(job_id, f"   • LR Scheduler: {model_config.learningRateScheduler}")

        await asyncio.sleep(0.5)

        # Training loop simulation
        epochs = model_config.epochs
        await self._log(job_id, f"⚡ Starting nnPU training for {epochs} epochs...")

        best_val_accuracy = 0.0
        no_improvement_count = 0
        early_stopped = False

        for epoch in range(1, epochs + 1):
            # Simulate training time
            await asyncio.sleep(0.1)  # Quick simulation

            # Generate realistic nnPU training metrics
            # nnPU loss typically starts higher and decreases more gradually
            base_loss = 0.8 * (0.95 ** (epoch / 15)) + random.uniform(-0.05, 0.05)
            nnpu_loss = max(0.1, base_loss + random.uniform(0, 0.2))  # nnPU loss is typically higher

            # Validation accuracy improves more gradually with nnPU
            val_accuracy = 0.85 + 0.12 * (1 - (0.98 ** epoch)) + random.uniform(-0.02, 0.02)
            val_accuracy = max(0.75, min(0.97, val_accuracy))  # nnPU typically has lower but more stable accuracy

            # F1 score for PU learning
            f1_score = val_accuracy * random.uniform(0.95, 1.05)
            f1_score = max(0.7, min(0.95, f1_score))

            # Check for improvement
            if val_accuracy > best_val_accuracy:
                best_val_accuracy = val_accuracy
                no_improvement_count = 0
            else:
                no_improvement_count += 1

            # Log every 10 epochs or at the end
            if epoch % 10 == 0 or epoch == epochs:
                await self._log(job_id, f"📈 Epoch {epoch}/{epochs} - nnPU Loss: {nnpu_loss:.4f}, Val_Accuracy: {val_accuracy:.3f}, F1: {f1_score:.3f}")

            # Early stopping check
            if model_config.earlyStopping and no_improvement_count >= model_config.patience:
                await self._log(job_id, f"🛑 Early stopping triggered after {epoch} epochs (patience: {model_config.patience})")
                early_stopped = True
                break

            # Simulate learning rate scheduling
            if epoch % 30 == 0 and model_config.learningRateScheduler == "StepLR":
                new_lr = model_config.learningRate * (0.5 ** (epoch // 30))
                await self._log(job_id, f"📉 Learning rate reduced to: {new_lr:.6f}")

        if not early_stopped:
            await self._log(job_id, f"✅ Training completed after {epochs} epochs")

        await self._log(job_id, f"🎯 Best validation accuracy: {best_val_accuracy:.3f}")
        await self._log(job_id, f"💾 Saving model checkpoint...")
        await self._log(job_id, f"📊 Calculating final metrics...")

    async def _generate_training_metrics(self, config: StartTrainingJobRequest) -> Dict[str, Any]:
        """Generate realistic nnPU training metrics"""
        model_config = config.training_config

        return {
            # Final training results
            'final_nnpu_loss': random.uniform(0.3, 0.8),
            'final_accuracy': random.uniform(0.85, 0.95),
            'final_f1_score': random.uniform(0.82, 0.93),
            'final_precision': random.uniform(0.80, 0.92),
            'final_recall': random.uniform(0.85, 0.95),

            # Best validation metrics
            'best_val_accuracy': random.uniform(0.88, 0.97),
            'best_val_f1_score': random.uniform(0.85, 0.94),
            'best_val_loss': random.uniform(0.25, 0.65),

            # Training process info
            'training_time_seconds': random.randint(45, 420),
            'total_epochs_trained': random.randint(50, config.training_config.epochs),
            'convergence_epoch': random.randint(25, config.training_config.epochs - 15),
            'early_stopped': random.choice([True, False]) if model_config.earlyStopping else False,

            # nnPU specific metrics
            'class_prior_used': model_config.classPrior,
            'positive_samples_estimated': random.randint(100, 500),
            'unlabeled_samples_used': random.randint(1500, 4500),

            # Model hyperparameters used
            'hyperparameters': {
                'model_type': model_config.modelType,
                'hidden_size': model_config.hiddenSize,
                'num_layers': model_config.numLayers,
                'activation_function': model_config.activationFunction,
                'dropout': model_config.dropout,
                'window_size': model_config.windowSize,
                'learning_rate': model_config.learningRate,
                'batch_size': model_config.batchSize,
                'optimizer': model_config.optimizer,
                'l2_regularization': model_config.l2Regularization,
                'early_stopping': model_config.earlyStopping,
                'patience': model_config.patience if model_config.earlyStopping else None,
                'lr_scheduler': model_config.learningRateScheduler
            },

            # Data configuration
            'data_config': {
                'train_ratio': config.data_source_config.trainRatio,
                'validation_ratio': config.data_source_config.validationRatio,
                'test_ratio': config.data_source_config.testRatio,
                'time_range': config.data_source_config.timeRange
            },

            # Performance indicators
            'training_stability': random.uniform(0.85, 0.98),
            'overfitting_risk': random.uniform(0.1, 0.4),
            'model_complexity_score': min(10, model_config.hiddenSize / 50 + model_config.numLayers),

            # Timestamps
            'training_started_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'training_completed_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }

    async def _save_model_artifact(self, model_id: str, config: StartTrainingJobRequest) -> str:
        """Save model artifact to disk (simulation)"""
        # Create models directory if it doesn't exist
        models_dir = "/tmp/pu_models"
        os.makedirs(models_dir, exist_ok=True)

        # Generate model file path
        model_filename = f"{config.training_config.modelType}_{model_id}.pkl"
        model_path = os.path.join(models_dir, model_filename)

        # Simulate saving model (create a dummy file)
        model_data = {
            'model_type': config.training_config.modelType,
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
