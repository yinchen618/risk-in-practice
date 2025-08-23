"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest } from "@/utils/global-api-manager";
import { BarChart3, CheckCircle, FlaskConical } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Stage3LeftPanel } from "./Stage3LeftPanel";
import { Stage3RightPanel } from "./Stage3RightPanel";
import {
	type ExperimentConfig,
	type Stage3ExperimentWorkbenchProps,
	experimentConfigApi,
	trainedModelsApi,
} from "./experiment";
import { useTrainingData } from "./experiment/hooks";
import { useExperimentActions, useExperimentState } from "./experiment/hooks/";

// Safe default model parameters
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

const API_BASE = "http://localhost:8000";

export function Stage3ExperimentWorkbench({
	selectedRunId,
}: Stage3ExperimentWorkbenchProps) {
	const {
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
	} = useExperimentState();

	// Source Distribution Context (from current ExperimentRun)
	const [sourceDistribution, setSourceDistribution] = useState<{
		experimentRunName: string;
		location: string;
		timeRange: string;
		positiveSamplesCount: number;
	} | null>(null);

	// Training data hooks
	const { trainingDataStats, sampleDistribution, isLoadingVisualization } =
		useTrainingData(selectedRunId, API_BASE);

	// Experiment actions hook
	const { handleStartExperiment } = useExperimentActions({
		selectedRunId,
		experimentConfig,
		scenarioType,
		selectedModelId,
		setTrainingStage,
		setPredictionState,
		resetTrainingMonitor,
	});

	// Initialize experiment configuration and source distribution
	useEffect(() => {
		const initializeConfig = async () => {
			try {
				// Get experiment run details to establish source distribution context
				const runData = await apiRequest.get(
					`${API_BASE}/api/v1/experiment-runs/${selectedRunId}`,
				);
				let runDerivedConfig: Partial<ExperimentConfig> | null = null;
				if (runData) {
					const runInfo = runData.data;

					// Extract source distribution info
					if (runInfo) {
						const runParams = runInfo.filteringParameters || {};
						const selectedBuildings =
							runParams.selected_floors_by_building
								? Object.keys(
										runParams.selected_floors_by_building,
									)
								: ["Building A"];
						const timeRange = runParams
							? `${runParams.start_date || runParams.startDate} to ${runParams.end_date || runParams.endDate}`
							: "Not specified";

						setSourceDistribution({
							experimentRunName:
								runInfo.name || "Current Experiment",
							location: selectedBuildings.join(", "),
							timeRange,
							positiveSamplesCount:
								runInfo.positiveSamplesCount || 0,
						});

						// prepare a run-derived config base from filteringParameters
						const params = runParams;
						const runSelectedFloorsByBuilding =
							params.selected_floors_by_building || {
								"Building A": params.floors || ["1", "2"],
								"Building B": [],
							};

						const runTimeRange = {
							startDate:
								params.start_date || params.startDate || "",
							endDate: params.end_date || params.endDate || "",
							startTime:
								params.start_time ||
								params.startTime ||
								"00:00",
							endTime:
								(params.end_time || params.endTime) === "00:00"
									? "23:59"
									: params.end_time ||
										params.endTime ||
										"23:59",
						};

						runDerivedConfig = {
							positiveSource: {
								selectedFloorsByBuilding:
									runSelectedFloorsByBuilding,
								timeRange: runTimeRange,
							},
							unlabeledSource: {
								selectedFloorsByBuilding:
									runSelectedFloorsByBuilding,
								timeRange: runTimeRange,
								useSameAsPositive: true,
							},
							testSource: {
								selectedFloorsByBuilding:
									runSelectedFloorsByBuilding,
								timeRange: runTimeRange,
								useSameAsTraining: false, // 設為 false，讓使用者可以修改
							},
						};
					}
				}

				// Get default config as base
				const defaultConfig =
					await experimentConfigApi.getDefaultConfig();

				// Try to get run-specific saved config (may be null)
				let runConfig = null;
				try {
					runConfig =
						await experimentConfigApi.getConfigFromRun(
							selectedRunId,
						);
				} catch (err) {
					// ignore
				}

				// Merge defaults, run-saved config (if any), and run-derived config from filteringParameters
				const mergedModelParams = {
					...(DEFAULT_MODEL_PARAMS as any),
					...(defaultConfig?.modelParams || {}),
					...(runConfig?.modelParams || {}),
					...(runDerivedConfig?.modelParams || {}),
				};

				const finalConfig: ExperimentConfig = {
					...defaultConfig,
					...(runConfig || {}),
					...(runDerivedConfig || {}),
					modelParams: mergedModelParams,
				};

				setExperimentConfig(finalConfig);
			} catch (error) {
				console.error("Failed to initialize experiment config:", error);
				// Fallback to default config
				const defaultConfig =
					await experimentConfigApi.getDefaultConfig();
				setExperimentConfig(defaultConfig);
			}
		};

		if (selectedRunId) {
			initializeConfig();
		}
	}, [selectedRunId]);

	// Load trained models for Generalization Challenge scenario
	useEffect(() => {
		const loadTrainedModels = async () => {
			try {
				// Only load ERM baseline models for generalization challenge
				const models =
					await trainedModelsApi.getTrainedModelsByScenario(
						selectedRunId,
						"ERM_BASELINE",
					);

				setTrainedModels(models);
			} catch (error) {
				console.error("Failed to load trained models:", error);
				toast.error("Failed to load trained models.");
			}
		};

		if (scenarioType === "GENERALIZATION_CHALLENGE") {
			loadTrainedModels();
		}
	}, [scenarioType, selectedRunId]);

	// 自動選擇第一個訓練模型
	useEffect(() => {
		if (
			trainedModels.length > 0 &&
			!selectedModelId &&
			scenarioType === "GENERALIZATION_CHALLENGE"
		) {
			setSelectedModelId(trainedModels[0].id);
			console.log(
				"Auto-selected first trained model:",
				trainedModels[0].id,
			);
		}
	}, [trainedModels, selectedModelId, scenarioType]);

	// 重置模型選擇當情境類型改變
	useEffect(() => {
		if (scenarioType !== "GENERALIZATION_CHALLENGE") {
			setSelectedModelId("");
		}
	}, [scenarioType]);

	// Determine experiment type based on configuration
	const experimentType = useMemo(() => {
		if (!experimentConfig) {
			return "In-Domain";
		}

		const { positiveSource, testSource } = experimentConfig;
		if (
			testSource.useSameAsTraining ||
			JSON.stringify(positiveSource.selectedFloorsByBuilding) ===
				JSON.stringify(testSource.selectedFloorsByBuilding)
		) {
			return "In-Domain";
		}
		return "Cross-Domain";
	}, [experimentConfig]);

	// Start prediction after training completion
	const handleStartPrediction = useCallback(async () => {
		if (!selectedRunId) {
			toast.error("No experiment run selected");
			return;
		}

		if (!experimentState.currentModelId) {
			toast.error("No trained model available");
			return;
		}

		try {
			setTrainingStage("predicting");
			toast.info("Starting prediction on test data...");

			// Call prediction API
			const result = await apiRequest.post(
				`${API_BASE}/api/v1/models/predict`,
				{
					model_path: experimentState.currentModelId,
					experiment_run_id: selectedRunId,
				},
			);
			console.log("Prediction completed:", result);

			setTrainingStage("completed");
			toast.success("Prediction completed successfully!");
		} catch (error) {
			console.error("Prediction error:", error);
			setTrainingStage("completed");
			toast.error(
				error instanceof Error ? error.message : "Prediction failed",
			);
		}
	}, [selectedRunId, experimentState.currentModelId, API_BASE]);

	// Check if configuration is valid
	const isConfigValid = useMemo(() => {
		if (!experimentConfig) {
			return false;
		}

		const { positiveSource, splitStrategy } = experimentConfig;

		// Basic validation for all scenarios
		const basicValid =
			Object.keys(positiveSource.selectedFloorsByBuilding).length > 0 &&
			Object.values(positiveSource.selectedFloorsByBuilding).some(
				(floors) => Array.isArray(floors) && floors.length > 0,
			) &&
			splitStrategy.trainRatio +
				splitStrategy.validationRatio +
				splitStrategy.testRatio ===
				100;

		// Additional validation based on scenario
		switch (scenarioType) {
			case "ERM_BASELINE":
				return basicValid;

			case "GENERALIZATION_CHALLENGE":
				return basicValid && selectedModelId !== "";

			case "DOMAIN_ADAPTATION": {
				const { unlabeledSource } = experimentConfig;
				return (
					basicValid &&
					Object.keys(unlabeledSource.selectedFloorsByBuilding)
						.length > 0 &&
					Object.values(
						unlabeledSource.selectedFloorsByBuilding,
					).some(
						(floors) => Array.isArray(floors) && floors.length > 0,
					) &&
					!unlabeledSource.useSameAsPositive
				);
			}

			default:
				return basicValid;
		}
	}, [experimentConfig, scenarioType, selectedModelId]);

	return (
		<div className="space-y-6">
			{/* Header */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<FlaskConical className="h-6 w-6 text-blue-600" />
						Model Training & Prediction Workbench
					</CardTitle>
					<p className="text-sm text-muted-foreground">
						Configure, train, and execute PU Learning models across
						different scenarios. Focus on model development and
						prediction execution.
					</p>
				</CardHeader>
			</Card>

			{/* Source Distribution Context */}
			{sourceDistribution && (
				<Card className="bg-blue-50 border-blue-200">
					<CardHeader className="pb-3">
						<div className="flex items-center gap-2">
							<BarChart3 className="h-5 w-5 text-blue-600" />
							<CardTitle className="text-lg text-blue-800">
								Source Distribution (P Samples)
							</CardTitle>
						</div>
					</CardHeader>
					<CardContent className="space-y-3">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
							<div>
								<div className="text-blue-700 font-medium text-xs uppercase tracking-wide">
									Experiment Run
								</div>
								<p className="text-gray-800 mt-1">
									{sourceDistribution.experimentRunName}
								</p>
							</div>
							<div>
								<div className="text-blue-700 font-medium text-xs uppercase tracking-wide">
									Location
								</div>
								<p className="text-gray-800 mt-1">
									{sourceDistribution.location}
								</p>
							</div>
							<div>
								<div className="text-blue-700 font-medium text-xs uppercase tracking-wide">
									Time Range
								</div>
								<p className="text-gray-800 mt-1">
									{sourceDistribution.timeRange}
								</p>
							</div>
						</div>
						{sourceDistribution.positiveSamplesCount > 0 && (
							<div className="flex items-center gap-2 pt-2 border-t border-blue-200">
								<CheckCircle className="h-4 w-4 text-green-600" />
								<span className="text-sm text-green-700">
									{sourceDistribution.positiveSamplesCount}{" "}
									positive samples available
								</span>
							</div>
						)}
					</CardContent>
				</Card>
			)}

			{/* Main Layout: Left 1/3 Configuration, Right 2/3 Monitoring - Always Visible */}
			<div className="grid grid-cols-3 gap-6">
				{/* Left Panel: 1/3 - Configuration Only */}
				<Stage3LeftPanel
					experimentConfig={experimentConfig}
					setExperimentConfig={setExperimentConfig}
					scenarioType={scenarioType}
					setScenarioType={setScenarioType}
					trainedModels={trainedModels}
					selectedModelId={selectedModelId}
					setSelectedModelId={setSelectedModelId}
					selectedRunId={selectedRunId}
					isConfigValid={isConfigValid}
					trainingStage={trainingStage}
					onStartExperiment={handleStartExperiment}
					onResetExperiment={resetExperiment}
				/>

				{/* Right Panel: 2/3 - All Monitoring and Status */}
				<Stage3RightPanel
					selectedRunId={selectedRunId}
					trainingDataStats={trainingDataStats}
					trainingStage={trainingStage}
					experimentState={experimentState}
					experimentConfig={experimentConfig}
					trainingMonitor={trainingMonitor}
					predictionState={predictionState}
					validationResults={validationResults}
					scenarioType={scenarioType}
					setTrainingMonitor={setTrainingMonitor}
					setPredictionState={setPredictionState}
					setValidationResults={setValidationResults}
					setTrainingStage={setTrainingStage}
					setExperimentState={setExperimentState}
					handleStartPrediction={handleStartPrediction}
					onToastSuccess={(message: string) => toast.success(message)}
					onToastError={(message: string) => toast.error(message)}
				/>
			</div>
		</div>
	);
}
