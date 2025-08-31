// Type definitions for Case Study v2

export interface FilteringParameters {
  // Value-based rules
  power_threshold_min: number
  power_threshold_max: number
  spike_detection_threshold: number

  // Time-based rules
  start_date: string
  end_date: string
  exclude_weekends: boolean
  time_window_hours: number

  // Additional time properties
  startDate?: string
  endDate?: string
  startTime?: string
  endTime?: string

  // Data integrity rules
  max_missing_ratio: number
  min_data_points: number

  // Peer comparison rules
  enable_peer_comparison: boolean
  peer_deviation_threshold: number

  // Scope selection
  buildings: string[]
  floors: string[]
  rooms: string[]

  // Dataset selection (for experiment scenarios)
  selectedDatasetIds?: string[]
}

export interface ExperimentRun {
  id: string
  name: string
  description?: string
  filtering_parameters?: FilteringParameters
  status: 'CONFIGURING' | 'LABELING' | 'COMPLETED'
  candidate_count?: number
  total_data_pool_size?: number
  positive_label_count?: number
  negative_label_count?: number
  created_at: string
  updated_at: string
}

export interface AnomalyEvent {
  id: string
  event_id: string
  meter_id: string
  event_timestamp: string
  detection_rule: string
  score: number
  data_window: {
    event_timestamp: string
    window_start: string
    window_end: string
    data_points: Array<{
      timestamp: string
      power_l1: number
      power_l2: number
      total_power: number
    }>
    sampling_interval: string
  }
  status: 'UNREVIEWED' | 'CONFIRMED_POSITIVE' | 'REJECTED_NORMAL'
  reviewer_id?: string
  review_timestamp?: string
  justification_notes?: string
  created_at: string
}

export interface ModelConfig {
  model_type: string
  learning_rate: number
  batch_size: number
  epochs: number
  prior?: number
  beta?: number
  gamma?: number
}

export interface DataSourceConfig {
  source_type: string
  experiment_run_id?: string
  data_split_ratio: {
    train: number
    val: number
    test: number
  }
  pretrained_model_id?: string
}

export interface TrainedModel {
  id: string
  experiment_run_id: string
  name: string
  status: string
  scenarioType: string
  model_config: string
  data_source_config: string
  model_path?: string
  training_metrics?: string
  // 🆕 統一的 training_data_info 格式（整合詳細 P/U 資訊和靜態子集法資訊）
  training_data_info?: {
    // 詳細 P/U 資料源資訊（可選）
    p_data_sources?: {
      dataset_ids: string[]
      dataset_info: Record<string, any>
      dataset_names: Record<string, string>
      total_samples: number
      total_train_samples?: number
      total_validation_samples?: number
      total_test_samples?: number
      actual_train_samples?: number
      actual_validation_samples?: number
      actual_test_samples?: number
    }
    u_data_sources?: {
      dataset_ids: string[]
      dataset_info: Record<string, any>
      dataset_names: Record<string, string>
      total_samples: number
      total_train_samples?: number
      total_validation_samples?: number
      total_test_samples?: number
      actual_train_samples?: number
      actual_validation_samples?: number
      actual_test_samples?: number
    }
    data_split_ratios?: {
      train_ratio: number
      validation_ratio: number
      test_ratio: number
    }
    overlap_removal?: boolean
    u_sampling_applied?: boolean

    // 靜態子集法核心資訊
    total_samples?: number
    split_ratios?: {
      train: number
      validation: number
      test: number
    }
    train_pool_size?: number
    validation_pool_size?: number
    test_pool_size?: number
    train_p_count?: number
    train_u_full_count?: number
    train_u_sampled_count?: number
    u_sample_ratio?: number
    random_seed?: number
    sampling_method?: string
    split_method?: string

    // 最終訓練集資訊
    final_training_samples?: number
    actual_train_p_samples?: number
    actual_train_u_samples?: number
  }
  job_id?: string
  created_at: string
  started_at?: string
  completed_at?: string
  evaluation_runs?: EvaluationRun[]
}

export interface EvaluationRun {
  id: string
  name: string
  scenarioType: string // 使用 camelCase
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED'
  trainedModelId: string // 使用 camelCase
  testSetSource: string // JSON string format
  evaluationMetrics?: {
    accuracy: number
    precision: number
    recall: number
    f1_score: number
    auc_roc: number
    confusion_matrix: {
      tp: number
      fp: number
      tn: number
      fn: number
    }
    test_data_info?: {
      total_samples: number
      positive_samples: number
      negative_samples: number
      feature_dimensions: number
    }
    static_subset_evaluation?: {
      method: string
      split_method: string
      split_ratios: {
        train: number
        validation: number
        test: number
      }
      random_seed: number
      total_dataset_size: number
      test_pool_size: number
      test_pool_ratio: number
      evaluation_timestamp: string
    }
  }
  jobId?: string // 使用 camelCase
  createdAt: string // 使用 camelCase
  completedAt?: string // 使用 camelCase
  modelName?: string // 新增模型名稱
  experimentRunId?: string // 使用 camelCase
  trained_model?: TrainedModel // 保持兼容性
}

export interface ExperimentHistory {
  experiment_run: ExperimentRun
  trained_models: TrainedModel[]
  evaluation_runs: EvaluationRun[]
}

export interface AvailableModel {
  id: string
  name: string
  description: string
  parameters: string[]
}

export interface TrainingJobResponse {
  job_id: string
  trained_model_id: string
}

export interface EvaluationJobResponse {
  job_id: string
  evaluation_run_id: string
}
