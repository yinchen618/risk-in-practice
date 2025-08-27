// Type definitions for Case Study v2

export interface FilteringParameters {
	// Value-based rules
	power_threshold_min: number;
	power_threshold_max: number;
	spike_detection_threshold: number;

	// Time-based rules
	start_date: string;
	end_date: string;
	exclude_weekends: boolean;
	time_window_hours: number;

	// Data integrity rules
	max_missing_ratio: number;
	min_data_points: number;

	// Peer comparison rules
	enable_peer_comparison: boolean;
	peer_deviation_threshold: number;

	// Scope selection
	buildings: string[];
	floors: string[];
	rooms: string[];
}

export interface ExperimentRun {
	id: string;
	name: string;
	description?: string;
	filtering_parameters?: FilteringParameters;
	status: "CONFIGURING" | "LABELING" | "COMPLETED";
	candidate_count?: number;
	total_data_pool_size?: number;
	positive_label_count?: number;
	negative_label_count?: number;
	created_at: string;
	updated_at: string;
}

export interface AnomalyEvent {
	id: string;
	event_id: string;
	meter_id: string;
	event_timestamp: string;
	detection_rule: string;
	score: number;
	data_window: {
		event_timestamp: string;
		window_start: string;
		window_end: string;
		data_points: Array<{
			timestamp: string;
			power_l1: number;
			power_l2: number;
			total_power: number;
		}>;
		sampling_interval: string;
	};
	status: "UNREVIEWED" | "CONFIRMED_POSITIVE" | "REJECTED_NORMAL";
	reviewer_id?: string;
	review_timestamp?: string;
	justification_notes?: string;
	created_at: string;
}

export interface ModelConfig {
	model_type: string;
	learning_rate: number;
	batch_size: number;
	epochs: number;
	prior?: number;
	beta?: number;
	gamma?: number;
}

export interface DataSourceConfig {
	source_type: string;
	experiment_run_id?: string;
	data_split_ratio: {
		train: number;
		val: number;
		test: number;
	};
	pretrained_model_id?: string;
}

export interface TrainedModel {
	id: string;
	name: string;
	scenarioType:
		| "ERM_BASELINE"
		| "GENERALIZATION_CHALLENGE"
		| "DOMAIN_ADAPTATION";
	status: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";
	experiment_run_id: string;
	model_config: ModelConfig;
	data_source_config: DataSourceConfig;
	model_path?: string;
	training_metrics?: {
		final_loss: number;
		final_accuracy: number;
		best_val_accuracy: number;
		training_time_seconds: number;
		total_epochs: number;
		model_parameters: any;
		convergence_epoch: number;
	};
	training_data_info?: {
		p_data_sources: {
			dataset_ids: string[];
			dataset_info: Record<string, {
				total_samples: number;
				train_samples: number;
				validation_samples: number;
				test_samples: number;
			}>;
			dataset_names: Record<string, string>;
			total_samples: number;
			total_train_samples: number;
			total_validation_samples: number;
			total_test_samples: number;
		};
		u_data_sources: {
			dataset_ids: string[];
			dataset_info: Record<string, {
				total_samples: number;
				train_samples: number;
				validation_samples: number;
				test_samples: number;
			}>;
			dataset_names: Record<string, string>;
			total_samples: number;
			total_train_samples: number;
			total_validation_samples: number;
			total_test_samples: number;
		};
		data_split_ratios: {
			train_ratio: number;
			validation_ratio: number;
			test_ratio: number;
		};
		overlap_removal: boolean;
		u_sampling_applied: boolean;
	};
	job_id?: string;
	created_at: string;
	completed_at?: string;
}

export interface EvaluationRun {
	id: string;
	name: string;
	scenario_type:
		| "ERM_BASELINE"
		| "GENERALIZATION_CHALLENGE"
		| "DOMAIN_ADAPTATION";
	status: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";
	trained_model_id: string;
	test_set_source: {
		source_type: string;
		experiment_run_id?: string;
		external_dataset_id?: string;
	};
	evaluation_metrics?: {
		f1_score: number;
		precision: number;
		recall: number;
		accuracy: number;
		auc_roc: number;
		auc_pr: number;
		confusion_matrix: {
			true_positive_rate: number;
			false_positive_rate: number;
			false_negative_rate: number;
			true_negative_rate: number;
		};
		class_distribution: {
			positive_samples: number;
			negative_samples: number;
			total_samples: number;
		};
		evaluation_time_seconds: number;
		scenario_type: string;
	};
	job_id?: string;
	created_at: string;
	completed_at?: string;
	trained_model?: TrainedModel;
}

export interface ExperimentHistory {
	experiment_run: ExperimentRun;
	trained_models: TrainedModel[];
	evaluation_runs: EvaluationRun[];
}

export interface AvailableModel {
	id: string;
	name: string;
	description: string;
	parameters: string[];
}

export interface TrainingJobResponse {
	job_id: string;
	trained_model_id: string;
}

export interface EvaluationJobResponse {
	job_id: string;
	evaluation_run_id: string;
}
