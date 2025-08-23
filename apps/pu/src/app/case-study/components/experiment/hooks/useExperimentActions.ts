import { apiRequest } from "@/utils/global-api-manager";
import { useCallback } from "react";
import { toast } from "sonner";
import type { DistributionShiftScenario, ExperimentConfig } from "../index";

const API_BASE = "http://localhost:8000";

const DEFAULT_MODEL_PARAMS = {
	modelType: "neural_net",
	priorMethod: "estimated",
	classPrior: 0.5,
	hiddenUnits: 128,
	activation: "relu",
	lambdaReg: 0.001,
	optimizer: "adam",
	learningRate: 0.001,
	epochs: 10,
	batchSize: 64,
	seed: 42,
} as const;

export interface UseExperimentActionsProps {
	selectedRunId?: string;
	experimentConfig: ExperimentConfig | null;
	scenarioType: DistributionShiftScenario;
	selectedModelId: string;
	setTrainingStage: (
		stage: "ready" | "training" | "completed" | "predicting",
	) => void;
	setPredictionState: (updater: (prev: any) => any) => void;
	resetTrainingMonitor: () => void;
}

export function useExperimentActions({
	selectedRunId,
	experimentConfig,
	scenarioType,
	selectedModelId,
	setTrainingStage,
	setPredictionState,
	resetTrainingMonitor,
}: UseExperimentActionsProps) {
	// Helper function to build model configuration
	const buildModelConfig = useCallback(() => {
		if (!experimentConfig) {
			throw new Error("Experiment configuration not available");
		}

		return {
			model_type: experimentConfig.modelParams.modelType,
			prior_method: experimentConfig.modelParams.priorMethod,
			class_prior: experimentConfig.modelParams.classPrior || null,
			model_params: {
				model_type: experimentConfig.modelParams.modelType,
				prior_method: experimentConfig.modelParams.priorMethod,
				class_prior: experimentConfig.modelParams.classPrior
					? Number(experimentConfig.modelParams.classPrior)
					: null,
				hidden_units: experimentConfig.modelParams.hiddenUnits,
				activation: experimentConfig.modelParams.activation,
				lambda_reg: experimentConfig.modelParams.lambdaReg,
				optimizer: experimentConfig.modelParams.optimizer,
				learning_rate: experimentConfig.modelParams.learningRate,
				epochs: experimentConfig.modelParams.epochs,
				batch_size: experimentConfig.modelParams.batchSize,
				seed: experimentConfig.modelParams.seed,
				feature_version: "v1",
			},
			validation_config: {
				enabled: true,
				method: "split_ratios",
				params: {
					train_ratio:
						experimentConfig.splitStrategy.trainRatio / 100,
					validation_ratio:
						experimentConfig.splitStrategy.validationRatio / 100,
					test_ratio: experimentConfig.splitStrategy.testRatio / 100,
				},
			},
		};
	}, [experimentConfig]);

	// Handle ERM Baseline scenario
	const handleERMBaseline = useCallback(async () => {
		setTrainingStage("training");
		resetTrainingMonitor();

		if (!experimentConfig) {
			throw new Error("Experiment configuration not available");
		}

		// Build training payload compatible with Stage3ModelTraining format
		const trainingPayload = {
			experiment_run_id: selectedRunId,
			scenario_type: "ERM_BASELINE",
			model_params: buildModelConfig().model_params,
			prediction_start_date:
				experimentConfig.positiveSource.timeRange.startDate,
			prediction_end_date:
				experimentConfig.positiveSource.timeRange.endDate,
			data_split_config: buildModelConfig().validation_config,
			u_sample_time_range: {
				start_date: experimentConfig.positiveSource.timeRange.startDate,
				end_date: experimentConfig.positiveSource.timeRange.endDate,
				start_time:
					experimentConfig.positiveSource.timeRange.startTime ||
					"00:00",
				end_time:
					experimentConfig.positiveSource.timeRange.endTime ||
					"23:59",
			},
			u_sample_building_floors:
				experimentConfig.positiveSource.selectedFloorsByBuilding,
			u_sample_limit: 5000,
		};

		console.log("ERM Baseline training payload:", trainingPayload);

		const result = await apiRequest.post(
			`${API_BASE}/api/v1/models/train-and-predict-v2`,
			trainingPayload,
		);
		console.log("ERM Baseline training started:", result);
	}, [
		selectedRunId,
		experimentConfig,
		setTrainingStage,
		resetTrainingMonitor,
		buildModelConfig,
	]);

	// Handle Generalization Challenge scenario
	const handleGeneralizationChallenge = useCallback(async () => {
		if (!selectedModelId) {
			toast.error("Please select a baseline model first");
			return;
		}

		if (!experimentConfig) {
			toast.error("Experiment configuration not available");
			return;
		}

		// 確保時間範圍正確：如果 endTime 是 "00:00"，改為 "23:59"
		const correctedTimeRange = {
			...experimentConfig.testSource.timeRange,
			endTime:
				experimentConfig.testSource.timeRange.endTime === "00:00"
					? "23:59"
					: experimentConfig.testSource.timeRange.endTime,
		};

		const evaluationPayload = {
			scenario_type: "GENERALIZATION_CHALLENGE",
			test_set_source: {
				location:
					Object.keys(
						experimentConfig.testSource.selectedFloorsByBuilding,
					)[0] || "",
				timeRange: `${correctedTimeRange.startDate} to ${correctedTimeRange.endDate}`,
				floors: Object.values(
					experimentConfig.testSource.selectedFloorsByBuilding,
				).flat(),
				selectedFloorsByBuilding:
					experimentConfig.testSource.selectedFloorsByBuilding,
				timeRange_detail: correctedTimeRange,
			},
			name: `ERM on Target: ${Object.keys(experimentConfig.testSource.selectedFloorsByBuilding)[0] || "Unknown"}`,
		};

		console.log(
			"Evaluation payload time range detail:",
			correctedTimeRange,
		);
		console.log(
			"Full experimentConfig.testSource:",
			experimentConfig.testSource,
		);

		const result = await apiRequest.post(
			`${API_BASE}/api/v1/models/${selectedModelId}/evaluate`,
			evaluationPayload,
		);
		console.log("Generalization Challenge evaluation started:", result);

		// 檢查返回結果的格式並獲取正確的評估 ID
		let evaluationId = null;
		if (result?.evaluation_run_id) {
			evaluationId = result.evaluation_run_id;
		} else if (result?.data?.evaluation_run_id) {
			evaluationId = result.data.evaluation_run_id;
		} else if (result?.id) {
			evaluationId = result.id;
		}

		if (!evaluationId) {
			console.error("無法獲取評估 ID:", result);
			setTrainingStage("ready");
			setPredictionState((prev) => ({ ...prev, isPredicting: false }));
			toast.error("評估啟動失敗：無法獲取評估 ID");
			return;
		}

		console.log("Starting evaluation with WebSocket monitoring...");

		// 使用 React 的批量更新來確保狀態同時更新，避免重複渲染
		setTrainingStage("predicting");
		setPredictionState((prev) => ({
			...prev,
			isPredicting: true,
			showPredictionMonitor: true,
			progress: {
				progress: 0,
				currentStep: 0,
				totalSteps: 100,
				stage: "starting",
				message: "Starting evaluation...",
			},
		}));
	}, [
		selectedModelId,
		experimentConfig,
		setTrainingStage,
		setPredictionState,
	]);

	// Handle Domain Adaptation scenario
	const handleDomainAdaptation = useCallback(async () => {
		if (!experimentConfig) {
			toast.error("Experiment configuration not available");
			return;
		}

		setTrainingStage("training");
		resetTrainingMonitor();

		const trainingPayload = {
			experiment_run_id: selectedRunId,
			scenario_type: "DOMAIN_ADAPTATION",
			model_params: buildModelConfig().model_params,
			prediction_start_date:
				experimentConfig.unlabeledSource.timeRange.startDate,
			prediction_end_date:
				experimentConfig.unlabeledSource.timeRange.endDate,
			data_split_config: buildModelConfig().validation_config,
			u_sample_time_range: {
				start_date:
					experimentConfig.unlabeledSource.timeRange.startDate,
				end_date: experimentConfig.unlabeledSource.timeRange.endDate,
				start_time:
					experimentConfig.unlabeledSource.timeRange.startTime ||
					"00:00",
				end_time:
					experimentConfig.unlabeledSource.timeRange.endTime ||
					"23:59",
			},
			u_sample_building_floors:
				experimentConfig.unlabeledSource.selectedFloorsByBuilding,
			u_sample_limit: 5000,
		};

		const result = await apiRequest.post(
			`${API_BASE}/api/v1/models/train-and-predict-v2`,
			trainingPayload,
		);
		console.log("Domain Adaptation training started:", result);
	}, [
		selectedRunId,
		experimentConfig,
		setTrainingStage,
		resetTrainingMonitor,
		buildModelConfig,
	]);

	// Main experiment handler
	const handleStartExperiment = useCallback(async () => {
		if (!selectedRunId) {
			toast.error("No experiment run selected");
			return;
		}

		if (!experimentConfig) {
			toast.error("Experiment configuration not loaded");
			return;
		}

		try {
			if (scenarioType === "ERM_BASELINE") {
				await handleERMBaseline();
			} else if (scenarioType === "GENERALIZATION_CHALLENGE") {
				await handleGeneralizationChallenge();
			} else if (scenarioType === "DOMAIN_ADAPTATION") {
				await handleDomainAdaptation();
			}
		} catch (error) {
			console.error("Error starting experiment:", error);
			setTrainingStage("ready");
			toast.error("Failed to start experiment");
		}
	}, [
		selectedRunId,
		experimentConfig,
		scenarioType,
		handleERMBaseline,
		handleGeneralizationChallenge,
		handleDomainAdaptation,
		setTrainingStage,
	]);

	return {
		handleStartExperiment,
		handleERMBaseline,
		handleGeneralizationChallenge,
		handleDomainAdaptation,
	};
}
