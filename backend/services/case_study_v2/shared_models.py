"""
Shared Model Definitions for Case Study v2
Contains PyTorch model architectures used by both Trainer and Evaluator
"""

import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np
import logging

logger = logging.getLogger(__name__)

class LSTMPULearningModel(nn.Module):
    """
    LSTM-based PU Learning Model for Ammeter Anomaly Detection
    Shared implementation to ensure consistency between training and evaluation
    """

    def __init__(self, input_size=12, hidden_size=64, num_layers=2, dropout=0.2):
        super(LSTMPULearningModel, self).__init__()

        self.input_size = input_size
        self.hidden_size = hidden_size
        self.num_layers = num_layers
        self.dropout = dropout

        # LSTM layer
        self.lstm = nn.LSTM(
            input_size=input_size,
            hidden_size=hidden_size,
            num_layers=num_layers,
            dropout=dropout if num_layers > 1 else 0,
            batch_first=True
        )

        # Batch normalization for LSTM output
        self.batch_norm = nn.BatchNorm1d(hidden_size)

        # Enhanced classification head with multiple layers
        self.classifier = nn.Sequential(
            nn.Linear(hidden_size, hidden_size // 2),
            nn.ReLU(),
            nn.Dropout(dropout),
            nn.Linear(hidden_size // 2, hidden_size // 4),
            nn.ReLU(),
            nn.Dropout(dropout),
            nn.Linear(hidden_size // 4, 1),
            nn.Sigmoid()
        )

        # Initialize weights
        self._init_weights()

    def _init_weights(self):
        """Initialize model weights for better convergence"""
        for name, param in self.named_parameters():
            if 'weight_ih' in name:
                # Initialize input-to-hidden weights
                nn.init.xavier_uniform_(param.data)
            elif 'weight_hh' in name:
                # Initialize hidden-to-hidden weights
                nn.init.orthogonal_(param.data)
            elif 'bias' in name:
                # Initialize biases
                param.data.fill_(0)
                # Set forget gate bias to 1 for better gradient flow
                n = param.size(0)
                param.data[(n//4):(n//2)].fill_(1)
            elif 'classifier' in name and 'weight' in name:
                # Initialize classifier weights
                nn.init.kaiming_normal_(param.data, nonlinearity='relu')
            elif 'classifier' in name and 'bias' in name:
                # Initialize classifier biases
                param.data.fill_(0)

    def forward(self, x):
        """
        Forward pass with flexible input handling

        Args:
            x: Input tensor of shape:
               - (batch_size, sequence_length, input_size) for sequence data
               - (batch_size, input_size) for single time step data

        Returns:
            output: Sigmoid probability score (batch_size,)
        """
        # Handle 2D input (batch_size, features) -> reshape for LSTM
        if x.dim() == 2:
            x = x.unsqueeze(1)  # Add sequence dimension: (batch_size, 1, features)

        # Handle 1D input (features,) -> add batch and sequence dimensions
        elif x.dim() == 1:
            x = x.unsqueeze(0).unsqueeze(0)  # (1, 1, features)

        batch_size, seq_len, features = x.shape

        # LSTM forward pass
        lstm_out, (hidden, cell) = self.lstm(x)

        # Use the last time step output
        last_output = lstm_out[:, -1, :]  # (batch_size, hidden_size)

        # Apply batch normalization (only if batch_size > 1)
        if batch_size > 1:
            last_output = self.batch_norm(last_output)

        # Classification
        output = self.classifier(last_output)

        # Squeeze to return (batch_size,) shape
        return output.squeeze(-1)


def extract_temporal_features(dataframe, window_size, set_name="data"):
    """
    Extract temporal features from time-sorted DataFrame
    Shared implementation to ensure consistency between training and evaluation

    Args:
        dataframe: DataFrame with columns ['timestamp', 'wattage_total', 'wattage_110v',
                   'wattage_220v', 'raw_l1', 'raw_l2', 'label']
        window_size: Size of sliding window
        set_name: Name for logging purposes

    Returns:
        X: Feature array of shape (n_samples, n_features)
        y: Label array of shape (n_samples,)
        timestamps: List of timestamps for each sample
    """
    logger.info("SHARED_MODELS: CORRECT (V2) extract_temporal_features function called.")
    logger.info(f"Extracting temporal features for {set_name} (window_size={window_size})...")

    X_features = []
    y_labels = []
    timestamps = []

    if len(dataframe) <= window_size:
        logger.warning(f"{set_name}: Insufficient data for windowing ({len(dataframe)} <= {window_size})")
        return np.array([]), np.array([]), []

    # Batch computation for efficiency
    for i in range(window_size, len(dataframe)):
        window_data = dataframe.iloc[i-window_size:i]
        current_timestamp = dataframe.iloc[i]['timestamp']

        # Enhanced feature engineering with numerical stability
        wattage_total = window_data['wattage_total']
        wattage_110v = window_data['wattage_110v']
        wattage_220v = window_data['wattage_220v']
        raw_l1 = window_data['raw_l1']
        raw_l2 = window_data['raw_l2']

        # Basic statistical features (with numerical stability)
        features = [
            # Main power statistics
            wattage_total.mean(),
            wattage_total.std() + 1e-8,  # Add small value to avoid numerical instability
            wattage_total.max(),
            wattage_total.min(),

            # Branch power statistics
            wattage_110v.mean(),
            wattage_220v.mean(),
            raw_l1.mean(),
            raw_l2.mean(),

            # Temporal dynamic features
            # Change rate features (time-series specific)
            (wattage_total.iloc[-1] - wattage_total.iloc[0]) / (window_size + 1e-8),  # Overall trend
            np.percentile(wattage_total, 75) - np.percentile(wattage_total, 25),  # Interquartile range

            # Power balance features
            abs(wattage_110v.mean() - wattage_220v.mean()) / (wattage_total.mean() + 1e-8),  # Load imbalance
            (raw_l1.mean() + raw_l2.mean()) / (wattage_total.mean() + 1e-8)  # Raw to total power ratio
        ]

        # Numerical validation: ensure no inf or nan
        features = [float(f) if np.isfinite(f) else 0.0 for f in features]

        X_features.append(features)
        y_labels.append(dataframe.iloc[i]['label'])
        timestamps.append(current_timestamp)

    X = np.array(X_features, dtype=np.float32)
    y = np.array(y_labels, dtype=np.int64)

    # Data quality check
    nan_count = np.sum(np.isnan(X))
    inf_count = np.sum(np.isinf(X))
    if nan_count > 0 or inf_count > 0:
        logger.warning(f"{set_name}: Data quality issues - NaN: {nan_count}, Inf: {inf_count}")
        X = np.nan_to_num(X, nan=0.0, posinf=1e6, neginf=-1e6)

    logger.info(f"{set_name} features: {X.shape}, labels: {y.shape}")
    logger.info(f"Positive: {np.sum(y == 1)}, Unlabeled: {np.sum(y == 0)}")
    logger.info(f"Feature range: [{X.min():.3f}, {X.max():.3f}]")

    return X, y, timestamps


def get_feature_names():
    """
    Get standardized feature names for model input

    Returns:
        list: Feature names in the correct order
    """
    return [
        # Basic statistical features
        'wattage_total_mean', 'wattage_total_std', 'wattage_total_max', 'wattage_total_min',
        'wattage_110v_mean', 'wattage_220v_mean', 'raw_l1_mean', 'raw_l2_mean',
        # Temporal dynamic features
        'wattage_trend_rate', 'wattage_iqr', 'load_imbalance_ratio', 'raw_to_total_ratio'
    ]


def load_model_artifacts(model_path: str):
    """
    Load model artifacts from file with validation

    Args:
        model_path: Path to the model file (.pkl)

    Returns:
        dict: Model artifacts containing model_state_dict, scaler, config, etc.

    Raises:
        FileNotFoundError: If model file doesn't exist
        ValueError: If model artifacts are invalid
    """
    import pickle
    import os

    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file not found: {model_path}")

    logger.info(f"Loading model artifacts from: {model_path}")

    try:
        with open(model_path, 'rb') as f:
            artifacts = pickle.load(f)

        # Validate required components
        required_keys = ['model_state_dict', 'scaler', 'model_config', 'feature_names']
        missing_keys = [key for key in required_keys if key not in artifacts]

        if missing_keys:
            raise ValueError(f"Model artifacts missing required keys: {missing_keys}")

        logger.info("Model artifacts loaded successfully")
        logger.info(f"Feature count: {len(artifacts.get('feature_names', []))}")
        logger.info(f"Model config: {artifacts.get('model_config', {})}")

        return artifacts

    except Exception as e:
        logger.error(f"Error loading model artifacts: {str(e)}")
        raise


def reconstruct_model(artifacts: dict) -> LSTMPULearningModel:
    """
    Reconstruct PyTorch model from artifacts

    Args:
        artifacts: Model artifacts from load_model_artifacts()

    Returns:
        LSTMPULearningModel: Reconstructed model with loaded weights

    Raises:
        ValueError: If model reconstruction fails
    """
    logger.info("SHARED_MODELS: CORRECT (V2) reconstruct_model function called.")
    try:
        model_config = artifacts['model_config']

        # Check if this is an old model with different architecture
        state_dict = artifacts['model_state_dict']
        state_dict_keys = list(state_dict.keys())

        # Detect old architecture (simple network vs LSTM)
        is_old_architecture = any(key.startswith('network.') for key in state_dict_keys)
        is_lstm_architecture = any(key.startswith('lstm.') for key in state_dict_keys)

        if is_old_architecture and not is_lstm_architecture:
            logger.warning("Detected old model architecture - model may need retraining with new LSTM architecture")
            logger.warning(f"Old model keys: {state_dict_keys}")

            # For backward compatibility, create a minimal model but don't load weights
            # This allows the system to continue working while encouraging retraining
            model = LSTMPULearningModel(
                input_size=model_config.get('input_size', 12),
                hidden_size=model_config.get('hiddenSize', 64),
                num_layers=model_config.get('numLayers', 2),
                dropout=model_config.get('dropout', 0.2)
            )

            logger.warning("⚠️ OLD MODEL DETECTED: Weights not loaded due to architecture mismatch")
            logger.warning("⚠️ RECOMMENDATION: Retrain model with new LSTM architecture for optimal performance")

            # Mark model as requiring retraining
            model._needs_retraining = True
            model._old_architecture = True

            return model

        # New LSTM architecture - normal loading
        model = LSTMPULearningModel(
            input_size=model_config.get('input_size', 12),
            hidden_size=model_config.get('hiddenSize', 64),
            num_layers=model_config.get('numLayers', 2),
            dropout=model_config.get('dropout', 0.2)
        )

        # Load trained weights for new architecture
        model.load_state_dict(artifacts['model_state_dict'])
        model.eval()  # Set to evaluation mode

        logger.info("Model reconstructed successfully with LSTM architecture")
        logger.info(f"Model architecture: input_size={model.input_size}, "
                   f"hidden_size={model.hidden_size}, num_layers={model.num_layers}")

        return model

    except Exception as e:
        logger.error(f"Error reconstructing model: {str(e)}")
        raise ValueError(f"Failed to reconstruct model: {str(e)}")
