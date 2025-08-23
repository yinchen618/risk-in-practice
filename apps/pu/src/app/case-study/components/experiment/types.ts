import type { DistributionShiftScenario } from "./DistributionShiftScenarioPanel";

// 更新 TrainedModel 介面以符合新的數據庫 Schema
export interface TrainedModel {
	id: string;
	name: string;
	scenario_type: DistributionShiftScenario; // 使用 snake_case 與後端一致
	status: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";
	experiment_run_id: string; // 使用 snake_case 與後端一致
	model_config: ModelParameters; // 使用 snake_case 與後端一致
	data_source_config: DataSourceConfiguration; // 使用 snake_case 與後端一致
	model_path?: string; // 使用 snake_case 與後端一致
	training_metrics?: TrainingMetrics; // 使用 snake_case 與後端一致
	created_at: string; // 使用 snake_case 與後端一致
	completed_at?: string; // 使用 snake_case 與後端一致
	evaluationRuns?: EvaluationRun[];
}

// 新增 EvaluationRun 介面
export interface EvaluationRun {
	id: string;
	name: string;
	scenarioType: DistributionShiftScenario;
	status: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";
	trainedModelId: string;
	testSetSource: TestSetSource;
	evaluationMetrics?: EvaluationMetrics;
	createdAt: string;
	completedAt?: string;
	predictions?: ModelPrediction[];
}

// 新增 ModelPrediction 介面
export interface ModelPrediction {
	id: string;
	evaluationRunId: string;
	anomalyEventId?: string;
	timestamp: string;
	predictionScore: number;
	groundTruth?: number; // 1 for positive, 0 for negative
}

// 訓練指標介面
export interface TrainingMetrics {
	loss: number;
	accuracy?: number;
	precision?: number;
	recall?: number;
	f1_score?: number;
	val_loss?: number;
	val_accuracy?: number;
	val_precision?: number;
	val_recall?: number;
	val_f1_score?: number;
}

// 評估指標介面
export interface EvaluationMetrics {
	accuracy: number;
	precision: number;
	recall: number;
	f1_score: number;
	auc_roc?: number;
	auc_pr?: number;
	confusion_matrix?: number[][];
}

// 測試集來源設定
export interface TestSetSource {
	location: string;
	timeRange: string;
	floors: string[];
}

// 數據源配置介面 - 匹配現有的 DataSourceConfigurationPanel
export interface DataSourceConfiguration {
	positiveSource: DataSource;
	unlabeledSource: DataSource & { useSameAsPositive: boolean };
	testSource: DataSource & { useSameAsTraining: boolean };
}

export interface DataSource {
	selectedFloorsByBuilding: Record<string, string[]>;
	timeRange: {
		startDate: string;
		endDate: string;
		startTime: string;
		endTime: string;
	};
}

export interface SplitConfiguration {
	trainRatio: number;
	validationRatio: number;
	testRatio: number;
}

export interface Stage3ExperimentWorkbenchProps {
	selectedRunId: string;
}

export interface Stage4ResultsAnalysisProps {
	selectedRunId: string;
}

export interface ExperimentConfig {
	scenarioType: DistributionShiftScenario;
	positiveSource: DataSource;
	unlabeledSource: DataSource & { useSameAsPositive: boolean };
	testSource: DataSource & { useSameAsTraining: boolean };
	splitStrategy: SplitConfiguration;
	modelParams: ModelParameters; // 使用現有的 ModelParameters 類型
}

// 主要的 ModelParameters 介面 - 用於前端組件
export interface ModelParameters {
	modelType: ModelType;
	priorMethod: PriorMethod;
	classPrior: string; // 保持為 string 以兼容現有組件
	hiddenUnits: number;
	activation: Activation;
	lambdaReg: number;
	optimizer: Optimizer;
	learningRate: number;
	epochs: number;
	batchSize: number;
	seed: number;
}

export interface ExperimentResult {
	id: string;
	timestamp: string;
	experimentType: "In-Domain" | "Cross-Domain";
	config: ExperimentConfig;
	metrics: {
		validationF1: number;
		testF1: number;
		testPrecision: number;
		testRecall: number;
	};
	status: "running" | "completed" | "failed";
}

export type TrainingStage =
	| "ready"
	| "training"
	| "completed"
	| "failed"
	| "predicting";

export type ModelType = "uPU" | "nnPU" | "neural_net";

export type PriorMethod =
	| "mean"
	| "median"
	| "kmm"
	| "en"
	| "estimated"
	| "custom";

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

// API 層使用的 ModelConfig 介面 - 用於後端通信
export interface ModelConfig {
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
