import { useCallback, useState } from "react";
import type {
	DistributionShiftScenario,
	ExperimentConfig,
	ExperimentResult,
	TrainedModel,
} from "../index";

export interface ExperimentState {
	results: ExperimentResult[];
	selectedForComparison: string[];
	selectedForDetail: string;
	insights: string;
	currentModelId: string;
	showComparison: boolean;
}

export interface TrainingMonitorState {
	progress: number;
	currentEpoch: number;
	logs: { epoch: number; loss: number; accuracy?: number }[];
	sampleCounts: {
		positive?: number;
		unlabeled?: number;
		unlabeledProgress?: number;
	};
	modelName?: string;
	hyperparameters?: any;
	dataSplitInfo?: any;
	currentStage?: string;
	currentSubstage?: string;
}

export interface PredictionState {
	isPredicting: boolean;
	showPredictionMonitor: boolean;
	progress: {
		progress: number;
		currentStep: number;
		totalSteps: number;
		stage: string;
		message: string;
	};
}

export interface ValidationState {
	metrics?: {
		val_accuracy: number;
		val_precision: number;
		val_recall: number;
		val_f1: number;
	};
	sampleCount?: number;
}

export function useExperimentState() {
	// Core State
	const [scenarioType, setScenarioType] =
		useState<DistributionShiftScenario>("ERM_BASELINE");
	const [trainedModels, setTrainedModels] = useState<TrainedModel[]>([]);
	const [selectedModelId, setSelectedModelId] = useState<string>("");
	const [trainingStage, setTrainingStage] = useState<
		"ready" | "training" | "completed" | "predicting"
	>("ready");
	const [experimentConfig, setExperimentConfig] =
		useState<ExperimentConfig | null>(null);

	// Experiment Management State
	const [experimentState, setExperimentState] = useState<ExperimentState>({
		results: [],
		selectedForComparison: [],
		selectedForDetail: "",
		insights: "",
		currentModelId: "",
		showComparison: false,
	});

	// Training Monitor State
	const [trainingMonitor, setTrainingMonitor] =
		useState<TrainingMonitorState>({
			progress: 0,
			currentEpoch: 0,
			logs: [],
			sampleCounts: {
				positive: undefined,
				unlabeled: undefined,
				unlabeledProgress: undefined,
			},
			modelName: undefined,
			hyperparameters: undefined,
			dataSplitInfo: undefined,
			currentStage: undefined,
			currentSubstage: undefined,
		});

	// Prediction State
	const [predictionState, setPredictionState] = useState<PredictionState>({
		isPredicting: false,
		showPredictionMonitor: false,
		progress: {
			progress: 0,
			currentStep: 0,
			totalSteps: 0,
			stage: "",
			message: "",
		},
	});

	// Validation State
	const [validationResults, setValidationResults] = useState<ValidationState>(
		{},
	);

	// UI State
	const [isConfigCollapsed, setIsConfigCollapsed] = useState(false);

	// Reset functions
	const resetTrainingMonitor = useCallback(() => {
		setTrainingMonitor({
			progress: 0,
			currentEpoch: 0,
			logs: [],
			sampleCounts: {
				positive: undefined,
				unlabeled: undefined,
				unlabeledProgress: undefined,
			},
			modelName: undefined,
			hyperparameters: undefined,
			dataSplitInfo: undefined,
			currentStage: undefined,
			currentSubstage: undefined,
		});
		setValidationResults({});
	}, []);

	const resetExperiment = useCallback(() => {
		setTrainingStage("ready");
		setPredictionState((prev) => ({
			...prev,
			isPredicting: false,
			showPredictionMonitor: false,
		}));
		setExperimentState((prev) => ({
			...prev,
			currentModelId: "",
		}));
	}, []);

	return {
		// State
		scenarioType,
		setScenarioType,
		trainedModels,
		setTrainedModels,
		selectedModelId,
		setSelectedModelId,
		trainingStage,
		setTrainingStage,
		experimentConfig,
		setExperimentConfig,
		experimentState,
		setExperimentState,
		trainingMonitor,
		setTrainingMonitor,
		predictionState,
		setPredictionState,
		validationResults,
		setValidationResults,
		isConfigCollapsed,
		setIsConfigCollapsed,

		// Actions
		resetTrainingMonitor,
		resetExperiment,
	};
}
