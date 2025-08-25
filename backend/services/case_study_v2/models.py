"""
Pydantic models for Case Study v2 API
"""

from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime
from enum import Enum

# ========== Enums ==========

class ExperimentRunStatus(str, Enum):
    CONFIGURING = "CONFIGURING"
    LABELING = "LABELING"
    COMPLETED = "COMPLETED"

class AnomalyEventStatus(str, Enum):
    UNREVIEWED = "UNREVIEWED"
    CONFIRMED_POSITIVE = "CONFIRMED_POSITIVE"
    REJECTED_NORMAL = "REJECTED_NORMAL"

class ModelStatus(str, Enum):
    PENDING = "PENDING"
    RUNNING = "RUNNING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"

class ScenarioType(str, Enum):
    ERM_BASELINE = "ERM_BASELINE"
    GENERALIZATION_CHALLENGE = "GENERALIZATION_CHALLENGE"
    DOMAIN_ADAPTATION = "DOMAIN_ADAPTATION"

# ========== Request Models ==========

class FilteringParameters(BaseModel):
    """Stage 1 filtering configuration"""
    # Value-based rules
    power_threshold_min: float = Field(default=0.0, description="Minimum power threshold")
    power_threshold_max: float = Field(default=10000.0, description="Maximum power threshold")
    spike_detection_threshold: float = Field(default=2.0, description="Spike detection multiplier")

    # Time-based rules
    start_date: datetime = Field(description="Analysis start date")
    end_date: datetime = Field(description="Analysis end date")
    exclude_weekends: bool = Field(default=False, description="Exclude weekend data")
    time_window_hours: int = Field(default=24, description="Time window for analysis")

    # Data integrity rules
    max_missing_ratio: float = Field(default=0.1, description="Maximum allowed missing data ratio")
    min_data_points: int = Field(default=100, description="Minimum required data points")

    # Peer comparison rules
    enable_peer_comparison: bool = Field(default=True, description="Enable peer comparison")
    peer_deviation_threshold: float = Field(default=1.5, description="Peer deviation threshold")

    # Scope selection
    buildings: List[str] = Field(default=[], description="Selected buildings")
    floors: List[str] = Field(default=[], description="Selected floors")
    rooms: List[str] = Field(default=[], description="Selected rooms")

class CreateExperimentRunRequest(BaseModel):
    name: str = Field(description="Experiment run name")
    description: Optional[str] = Field(default=None, description="Optional description")
    filtering_parameters: FilteringParameters = Field(description="Stage 1 filtering configuration")

class LabelEventRequest(BaseModel):
    status: AnomalyEventStatus = Field(description="New status for the event")
    reviewer_id: str = Field(description="ID of the reviewer")
    justification_notes: Optional[str] = Field(default=None, description="Optional justification notes")

class ModelConfig(BaseModel):
    """Model training configuration"""
    model_type: str = Field(description="Type of model to train")
    learning_rate: float = Field(default=0.001, description="Learning rate")
    batch_size: int = Field(default=32, description="Batch size")
    epochs: int = Field(default=100, description="Number of epochs")
    prior: Optional[float] = Field(default=None, description="Class prior estimate")
    beta: Optional[float] = Field(default=0.0, description="Beta parameter for nnPU")
    gamma: Optional[float] = Field(default=1.0, description="Gamma parameter for nnPU")

    model_config = {"protected_namespaces": ()}

class DataSourceConfig(BaseModel):
    """Data source configuration for training/evaluation"""
    source_type: str = Field(description="Type of data source")
    experiment_run_id: Optional[str] = Field(default=None, description="Source experiment run ID")
    data_split_ratio: Dict[str, float] = Field(default={"train": 0.7, "val": 0.15, "test": 0.15}, description="Data split ratios")
    pretrained_model_id: Optional[str] = Field(default=None, description="Pre-trained model ID for transfer learning")

class StartTrainingJobRequest(BaseModel):
    model_name: str = Field(description="Name for the trained model")
    scenario_type: ScenarioType = Field(description="Experiment scenario type")
    experiment_run_id: str = Field(description="Source experiment run ID")
    training_config: ModelConfig = Field(description="Model configuration")
    data_source_config: DataSourceConfig = Field(description="Data source configuration")

class TestSetSource(BaseModel):
    """Test set source configuration"""
    source_type: str = Field(description="Type of test set source")
    experiment_run_id: Optional[str] = Field(default=None, description="Source experiment run ID")
    external_dataset_id: Optional[str] = Field(default=None, description="External dataset ID")

class StartEvaluationJobRequest(BaseModel):
    evaluation_name: str = Field(description="Name for the evaluation run")
    scenario_type: ScenarioType = Field(description="Evaluation scenario type")
    trained_model_id: str = Field(description="Trained model to evaluate")
    test_set_source: TestSetSource = Field(description="Test set configuration")

# ========== Response Models ==========

class ExperimentRunResponse(BaseModel):
    id: str
    name: str
    description: Optional[str]
    filtering_parameters: Optional[Dict[str, Any]] = Field(alias="filteringParameters")
    status: str
    candidate_count: Optional[int] = Field(alias="candidateCount")
    positive_label_count: Optional[int] = Field(alias="positiveLabelCount")
    negative_label_count: Optional[int] = Field(alias="negativeLabelCount")
    created_at: datetime = Field(alias="createdAt")
    updated_at: datetime = Field(alias="updatedAt")

    model_config = {"from_attributes": True, "populate_by_name": True}

class AnomalyEventResponse(BaseModel):
    id: str
    event_id: str
    meter_id: str
    event_timestamp: datetime
    detection_rule: str
    score: float
    data_window: Dict[str, Any]
    status: str
    reviewer_id: Optional[str]
    review_timestamp: Optional[datetime]
    justification_notes: Optional[str]
    created_at: datetime

    model_config = {"from_attributes": True}

class TrainedModelResponse(BaseModel):
    id: str
    name: str
    scenario_type: str
    status: str
    experiment_run_id: str
    model_config: Dict[str, Any]
    data_source_config: Dict[str, Any]
    model_path: Optional[str]
    training_metrics: Optional[Dict[str, Any]]
    job_id: Optional[str]
    created_at: datetime
    completed_at: Optional[datetime]

    model_config = {"from_attributes": True}

class EvaluationRunResponse(BaseModel):
    id: str
    name: str
    scenario_type: str
    status: str
    trained_model_id: str
    test_set_source: Dict[str, Any]
    evaluation_metrics: Optional[Dict[str, Any]]
    job_id: Optional[str]
    created_at: datetime
    completed_at: Optional[datetime]
    trained_model: Optional[TrainedModelResponse]

    model_config = {"from_attributes": True}

class TrainingJobResponse(BaseModel):
    job_id: str
    trained_model_id: str

class EvaluationJobResponse(BaseModel):
    job_id: str
    evaluation_run_id: str

class AvailableModelResponse(BaseModel):
    id: str
    name: str
    description: str
    parameters: List[str]

class ExperimentHistoryResponse(BaseModel):
    experiment_run: ExperimentRunResponse
    trained_models: List[TrainedModelResponse]
    evaluation_runs: List[EvaluationRunResponse]

class AnalysisDatasetResponse(BaseModel):
    id: str
    name: str
    building: str
    floor: str
    room: str
    startDate: datetime
    endDate: datetime
    occupantType: str
    meterIdL1: str
    meterIdL2: str
    totalRecords: int
    positiveLabels: int
    createdAt: datetime

    model_config = {"from_attributes": True}
