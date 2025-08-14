export type TrainingStage = "ready" | "training" | "completed" | "failed";

export type ModelType = "uPU" | "nnPU";

export type PriorMethod = "mean" | "median" | "kmm" | "en" | "custom";

export type Activation = "relu" | "tanh";

export type Optimizer = "adam" | "sgd";

export interface TrainingDataStats {
	positiveSamples: number;
	unlabeledSamples: number;
}

export interface SamplePoint {
	x: number;
	y: number;
	id: string;
	category?: "P" | "U";
	meterId?: string;
	score?: number;
}

export interface SampleDistribution {
	pSamples: SamplePoint[];
	uSamples: SamplePoint[];
}

export interface TrainingLog {
	epoch: number;
	loss: number;
	accuracy?: number;
}

export interface ModelParameters {
	model_type: ModelType;
	prior_method: PriorMethod;
	class_prior: number | null;
	hidden_units: number;
	activation: Activation;
	lambda_reg: number;
	optimizer: Optimizer;
	learning_rate: number;
	epochs: number;
	batch_size: number;
	seed: number;
	feature_version: string;
}

export interface DataSplitConfig {
	enabled: boolean;
	trainRatio: number;
	validationRatio: number;
	testRatio: number;
}

export interface TrainingPayload {
	experiment_run_id: string;
	model_params: ModelParameters;
	prediction_start_date: string;
	prediction_end_date: string;
	data_split_config?: DataSplitConfig;
	// 新增的 U 樣本生成配置
	u_sample_time_range?: {
		start_date: string;
		end_date: string;
		start_time: string;
		end_time: string;
	};
	u_sample_building_floors?: Record<string, string[]>;
	u_sample_limit?: number;
}
