"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
	BarChart3,
	CheckCircle,
	ChevronDown,
	ChevronUp,
	FlaskConical,
	Settings,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
	DataSourceConfigurationPanel,
	DataSplitStrategyPanel,
	type DistributionShiftScenario,
	DistributionShiftScenarioPanel,
	type ExperimentConfig,
	type ExperimentResult,
	ExperimentResultsPanel,
	ModelParametersPanel,
	type Stage3ExperimentWorkbenchProps,
	type TrainedModel,
	TrainingControlPanel,
	experimentConfigApi,
	trainedModelsApi,
} from "./experiment";
import { SampleDistributionPanel } from "./experiment/SampleDistributionPanel";
import { TestSetResultsPanel } from "./experiment/TestSetResultsPanel";
import { TrainingDataStatsPanel } from "./experiment/TrainingDataStatsPanel";
import { TrainingMonitorPanel } from "./experiment/TrainingMonitorPanel";
import { ValidationSetResultsPanel } from "./experiment/ValidationSetResultsPanel";
import { WebSocketTrainingCommunication } from "./experiment/WebSocketTrainingCommunication";
import { useTrainingData } from "./experiment/hooks";

export function Stage3ExperimentWorkbench({
	selectedRunId,
}: Stage3ExperimentWorkbenchProps) {
	const API_BASE = "http://localhost:8000";

	// Core State - 根據文件設計重新組織狀態
	const [scenarioType, setScenarioType] =
		useState<DistributionShiftScenario>("ERM_BASELINE");
	const [trainedModels, setTrainedModels] = useState<TrainedModel[]>([]);
	const [selectedModelId, setSelectedModelId] = useState<string>("");
	const [trainingStage, setTrainingStage] = useState<
		"ready" | "training" | "completed" | "predicting"
	>("ready");
	const [experimentConfig, setExperimentConfig] =
		useState<ExperimentConfig | null>(null);

	// Safe default model parameters — used to ensure UI doesn't crash and to show defaults
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

	// Source Distribution Context (from current ExperimentRun)
	const [sourceDistribution, setSourceDistribution] = useState<{
		experimentRunName: string;
		location: string;
		timeRange: string;
		positiveSamplesCount: number;
	} | null>(null);

	// Experiment Management State
	const [experimentState, setExperimentState] = useState({
		results: [] as ExperimentResult[],
		selectedForComparison: [] as string[],
		selectedForDetail: "",
		insights: "",
		currentModelId: "",
	});

	// UI State
	const [isConfigCollapsed, setIsConfigCollapsed] = useState(false);

	// Training Monitoring State
	const [trainingMonitor, setTrainingMonitor] = useState({
		progress: 0,
		currentEpoch: 0,
		logs: [] as { epoch: number; loss: number; accuracy?: number }[],
		sampleCounts: {
			positive: undefined as number | undefined,
			unlabeled: undefined as number | undefined,
			unlabeledProgress: undefined as number | undefined,
		},
		modelName: undefined as string | undefined,
		hyperparameters: undefined as
			| {
					model_type: string;
					prior_method: string;
					class_prior?: number;
					hidden_units: number;
					activation: string;
					lambda_reg: number;
					optimizer: string;
					learning_rate: number;
					epochs: number;
					batch_size: number;
					seed: number;
					feature_version: string;
			  }
			| undefined,
		dataSplitInfo: undefined as
			| {
					train_samples?: number;
					validation_samples?: number;
					test_samples?: number;
					train_p_samples?: number;
					validation_p_samples?: number;
					test_p_samples?: number;
					split_enabled?: boolean;
			  }
			| undefined,
		currentStage: undefined as string | undefined,
		currentSubstage: undefined as string | undefined,
	});

	// Validation Results State
	const [validationResults, setValidationResults] = useState<{
		metrics?: {
			val_accuracy: number;
			val_precision: number;
			val_recall: number;
			val_f1: number;
		};
		sampleCount?: number;
	}>({});

	// Training data hooks
	const { trainingDataStats, sampleDistribution, isLoadingVisualization } =
		useTrainingData(selectedRunId, API_BASE);

	// Initialize experiment configuration and source distribution
	useEffect(() => {
		const initializeConfig = async () => {
			try {
				// Get experiment run details to establish source distribution context
				const runResponse = await fetch(
					`${API_BASE}/api/v1/experiment-runs/${selectedRunId}`,
				);
				let runDerivedConfig: Partial<ExperimentConfig> | null = null;
				if (runResponse.ok) {
					const runData = await runResponse.json();
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
								params.end_time || params.endTime || "23:59",
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
								useSameAsTraining: true,
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
						"ERM_BASELINE",
					);
				// Filter models that belong to current experiment run
				const filteredModels = models.filter(
					(model) =>
						model.id.includes(selectedRunId) ||
						model.experimentRunId === selectedRunId,
				);

				setTrainedModels(filteredModels);
			} catch (error) {
				console.error("Failed to load trained models:", error);
				toast.error("Failed to load trained models.");
			}
		};

		if (scenarioType === "GENERALIZATION_CHALLENGE") {
			loadTrainedModels();
		}
	}, [scenarioType, selectedRunId]);

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

	// Start experiment training
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
				// Flow 1: ERM Baseline
				await handleERMBaseline();
			} else if (scenarioType === "GENERALIZATION_CHALLENGE") {
				// Flow 2: Generalization Challenge (evaluation only)
				await handleGeneralizationChallenge();
			} else if (scenarioType === "DOMAIN_ADAPTATION") {
				// Flow 3: Domain Adaptation
				await handleDomainAdaptation();
			}
		} catch (error) {
			console.error("Error starting experiment:", error);
			setTrainingStage("ready");
			toast.error("Failed to start experiment");
		}
	}, [selectedRunId, experimentConfig, scenarioType, selectedModelId]);

	// Handle ERM Baseline scenario
	const handleERMBaseline = async () => {
		setTrainingStage("training");
		resetTrainingMonitor();

		if (!experimentConfig) {
			throw new Error("Experiment configuration not available");
		}

		// Build training payload compatible with Stage3ModelTraining format
		const trainingPayload = {
			experiment_run_id: selectedRunId,
			model_params: buildModelConfig().model_params,
			// For ERM Baseline: prediction range uses same source as P samples
			prediction_start_date:
				experimentConfig.positiveSource.timeRange.startDate,
			prediction_end_date:
				experimentConfig.positiveSource.timeRange.endDate,
			data_split_config: buildModelConfig().validation_config,
			// For ERM Baseline: U samples use same source as P samples
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

		const response = await fetch(
			`${API_BASE}/api/v1/models/train-and-predict-v2`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(trainingPayload),
			},
		);

		if (!response.ok) {
			throw new Error(`Training failed: ${response.statusText}`);
		}

		const result = await response.json();
		console.log("ERM Baseline training started:", result);

		// Don't poll for completion, rely on WebSocket for progress updates
		// The WebSocket will handle completion notifications
	};

	// Handle Generalization Challenge scenario
	const handleGeneralizationChallenge = async () => {
		if (!selectedModelId) {
			toast.error("Please select a baseline model first");
			return;
		}

		if (!experimentConfig) {
			toast.error("Experiment configuration not available");
			return;
		}

		setTrainingStage("training");

		const evaluationPayload = {
			trainedModelId: selectedModelId,
			testSetSource: {
				location:
					Object.keys(
						experimentConfig.testSource.selectedFloorsByBuilding,
					)[0] || "",
				timeRange: `${experimentConfig.testSource.timeRange.startDate} to ${experimentConfig.testSource.timeRange.endDate}`,
				floors: Object.values(
					experimentConfig.testSource.selectedFloorsByBuilding,
				).flat(),
			},
			name: `ERM on Target: ${Object.keys(experimentConfig.testSource.selectedFloorsByBuilding)[0] || "Unknown"}`,
		};

		const response = await fetch(`${API_BASE}/api/v1/evaluation-runs`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(evaluationPayload),
		});

		if (!response.ok) {
			throw new Error(`Evaluation failed: ${response.statusText}`);
		}

		const result = await response.json();
		console.log("Generalization Challenge evaluation started:", result);

		// Start polling for evaluation completion
		pollForEvaluationCompletion(result.evaluationRunId);
	};

	// Handle Domain Adaptation scenario
	const handleDomainAdaptation = async () => {
		if (!experimentConfig) {
			toast.error("Experiment configuration not available");
			return;
		}

		setTrainingStage("training");
		resetTrainingMonitor();

		const trainingPayload = {
			experimentRunId: selectedRunId,
			scenarioType: "DOMAIN_ADAPTATION",
			dataSourceConfig: {
				positiveSamples: {
					sourceType: "ExperimentRun",
					experimentRunId: selectedRunId,
				},
				unlabeledSamples: {
					sourceType: "Custom",
					location:
						Object.keys(
							experimentConfig.unlabeledSource
								.selectedFloorsByBuilding,
						)[0] || "",
					timeRange: `${experimentConfig.unlabeledSource.timeRange.startDate} to ${experimentConfig.unlabeledSource.timeRange.endDate}`,
					floors: Object.values(
						experimentConfig.unlabeledSource
							.selectedFloorsByBuilding,
					).flat(),
				},
			},
			modelConfig: buildModelConfig(),
		};

		const response = await fetch(`${API_BASE}/api/v1/trained-models`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(trainingPayload),
		});

		if (!response.ok) {
			throw new Error(
				`Domain adaptation training failed: ${response.statusText}`,
			);
		}

		const result = await response.json();
		console.log("Domain Adaptation training started:", result);

		// Start polling for completion
		pollForCompletion(result.trainedModelId);
	};

	// Helper function to build model configuration
	const buildModelConfig = () => {
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
	};

	// Helper function to reset training monitor
	const resetTrainingMonitor = () => {
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
	};

	// Helper function to poll for training completion
	const pollForCompletion = (jobId: string) => {
		const pollInterval = setInterval(async () => {
			try {
				const statusResponse = await fetch(
					`${API_BASE}/api/v1/models/jobs/${jobId}`,
				);
				if (statusResponse.ok) {
					const statusData = await statusResponse.json();
					const jobStatus = statusData.data;

					if (jobStatus.status === "COMPLETED") {
						setTrainingStage("completed");
						clearInterval(pollInterval);

						setExperimentState((prev) => ({
							...prev,
							currentModelId: jobStatus.model_path || jobId,
						}));

						if (experimentConfig && jobStatus.metrics) {
							const newResult: ExperimentResult = {
								id: `exp_${Date.now()}`,
								timestamp: new Date().toISOString(),
								experimentType,
								config: experimentConfig,
								metrics: {
									validationF1:
										jobStatus.metrics.validation_f1 || 0,
									testF1: jobStatus.metrics.test_f1 || 0,
									testPrecision:
										jobStatus.metrics.test_precision || 0,
									testRecall:
										jobStatus.metrics.test_recall || 0,
								},
								status: "completed",
							};

							setExperimentState((prev) => ({
								...prev,
								results: [...prev.results, newResult],
								selectedForDetail: newResult.id,
							}));
						}

						toast.success(
							`${scenarioType} completed successfully!`,
						);
					} else if (jobStatus.status === "FAILED") {
						setTrainingStage("ready");
						clearInterval(pollInterval);
						toast.error(
							`${scenarioType} failed: ${jobStatus.error || "Unknown error"}`,
						);
					}
				}
			} catch (error) {
				console.error("Error polling training status:", error);
			}
		}, 3000);
	};

	// Helper function to poll for evaluation completion
	const pollForEvaluationCompletion = (evaluationId: string) => {
		const pollInterval = setInterval(async () => {
			try {
				const statusResponse = await fetch(
					`${API_BASE}/api/v1/evaluation-runs/${evaluationId}/status`,
				);
				if (statusResponse.ok) {
					const statusData = await statusResponse.json();
					if (statusData.status === "completed") {
						setTrainingStage("completed");
						clearInterval(pollInterval);

						if (experimentConfig) {
							const newResult: ExperimentResult = {
								id: `exp_${Date.now()}`,
								timestamp: new Date().toISOString(),
								experimentType: "Cross-Domain",
								config: experimentConfig,
								metrics: {
									validationF1: 0, // Evaluation doesn't have validation
									testF1: statusData.metrics?.test_f1 || 0,
									testPrecision:
										statusData.metrics?.test_precision || 0,
									testRecall:
										statusData.metrics?.test_recall || 0,
								},
								status: "completed",
							};

							setExperimentState((prev) => ({
								...prev,
								results: [...prev.results, newResult],
								selectedForDetail: newResult.id,
							}));
						}

						toast.success(
							"Generalization Challenge evaluation completed!",
						);
					} else if (statusData.status === "failed") {
						setTrainingStage("ready");
						clearInterval(pollInterval);
						toast.error(
							"Generalization Challenge evaluation failed",
						);
					}
				}
			} catch (error) {
				console.error("Error polling evaluation status:", error);
			}
		}, 3000);
	};

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
			const response = await fetch(`${API_BASE}/api/v1/models/predict`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					model_path: experimentState.currentModelId,
					experiment_run_id: selectedRunId,
				}),
			});

			if (!response.ok) {
				throw new Error(`Prediction failed: ${response.statusText}`);
			}

			const result = await response.json();
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

	// Reset experiment
	const handleResetExperiment = useCallback(() => {
		setTrainingStage("ready");
		setExperimentState((prev) => ({
			...prev,
			currentModelId: "",
		}));
	}, []);

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
				(floors) => floors.length > 0,
			) &&
			splitStrategy.trainRatio +
				splitStrategy.validationRatio +
				splitStrategy.testRatio ===
				100;

		// Additional validation based on scenario
		switch (scenarioType) {
			case "ERM_BASELINE":
				// ERM baseline just needs basic validation
				return basicValid;

			case "GENERALIZATION_CHALLENGE":
				// Generalization Challenge needs a selected model
				return basicValid && selectedModelId !== "";

			case "DOMAIN_ADAPTATION": {
				// Domain Adaptation needs unlabeled source configuration
				const { unlabeledSource } = experimentConfig;
				return (
					basicValid &&
					Object.keys(unlabeledSource.selectedFloorsByBuilding)
						.length > 0 &&
					Object.values(
						unlabeledSource.selectedFloorsByBuilding,
					).some((floors) => floors.length > 0) &&
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
						Model Training & Analysis Workbench
					</CardTitle>
					<p className="text-sm text-muted-foreground">
						Design and execute experiments to analyze PU Learning
						model performance across different scenarios, including
						in-domain and cross-domain evaluation.
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

			<div className="grid lg:grid-cols-5 gap-6">
				{/* Left Panel: Experiment Setup */}
				<div
					className={`lg:col-span-2 space-y-4 ${isConfigCollapsed ? "lg:col-span-1" : ""}`}
				>
					<Card>
						<CardHeader className="">
							<div className="flex items-center justify-between">
								<CardTitle className="flex items-center gap-2 text-lg">
									<Settings className="h-5 w-5" />
									Experiment Setup
								</CardTitle>
								<Button
									variant="ghost"
									size="sm"
									onClick={() =>
										setIsConfigCollapsed(!isConfigCollapsed)
									}
									className="lg:hidden"
								>
									{isConfigCollapsed ? (
										<ChevronDown className="h-4 w-4" />
									) : (
										<ChevronUp className="h-4 w-4" />
									)}
								</Button>
							</div>
						</CardHeader>

						{!isConfigCollapsed && (
							<CardContent className="space-y-6">
								{!experimentConfig ? (
									<div className="p-4 text-sm text-gray-600">
										Loading experiment configuration...
									</div>
								) : (
									<>
										{/* Distribution Shift Scenario */}
										<DistributionShiftScenarioPanel
											value={scenarioType}
											onChange={setScenarioType}
										/>

										{/* Data Source Configuration */}
										<DataSourceConfigurationPanel
											config={{
												positiveSource:
													experimentConfig.positiveSource,
												unlabeledSource:
													experimentConfig.unlabeledSource,
												testSource:
													experimentConfig.testSource,
											}}
											onChange={(config) =>
												setExperimentConfig(
													(
														prev: ExperimentConfig | null,
													) =>
														prev
															? {
																	...prev,
																	...config,
																}
															: null,
												)
											}
											scenario={scenarioType}
											selectedRunId={selectedRunId}
											trainedModels={trainedModels}
											selectedModelId={selectedModelId}
											onModelSelect={(id) =>
												setSelectedModelId(id)
											}
										/>

										<Separator />

										{/* Data Split Strategy */}
										<DataSplitStrategyPanel
											splitStrategy={
												experimentConfig.splitStrategy
											}
											onChange={(splitStrategy) =>
												setExperimentConfig(
													(
														prev: ExperimentConfig | null,
													) =>
														prev
															? {
																	...prev,
																	splitStrategy,
																}
															: null,
												)
											}
										/>

										<Separator />

										{/* Model Parameters */}
										<ModelParametersPanel
											modelParams={
												experimentConfig.modelParams
											}
											onChange={(modelParams) =>
												setExperimentConfig(
													(
														prev: ExperimentConfig | null,
													) =>
														prev
															? {
																	...prev,
																	modelParams,
																}
															: null,
												)
											}
										/>

										<Separator />

										{/* Training Control */}
										<TrainingControlPanel
											isValid={Boolean(isConfigValid)}
											trainingStage={trainingStage}
											onStartTraining={
												handleStartExperiment
											}
											onReset={handleResetExperiment}
											wsLogs={[]}
											scenario={scenarioType}
										/>
									</>
								)}
							</CardContent>
						)}
					</Card>
				</div>

				{/* Right Panel: Experiment Results & Comparison */}
				<div
					className={`lg:col-span-3 space-y-4 ${isConfigCollapsed ? "lg:col-span-4" : ""}`}
				>
					{/* Experiment History & Comparison */}
					<ExperimentResultsPanel
						experimentResults={experimentState.results}
						selectedExperiments={
							experimentState.selectedForComparison
						}
						selectedExperimentForDetail={
							experimentState.selectedForDetail
						}
						onExperimentSelect={(id) =>
							setExperimentState((prev) => ({
								...prev,
								selectedForComparison:
									prev.selectedForComparison.includes(id)
										? prev.selectedForComparison.filter(
												(expId) => expId !== id,
											)
										: [...prev.selectedForComparison, id],
							}))
						}
						onExperimentDetailSelect={(id) =>
							setExperimentState((prev) => ({
								...prev,
								selectedForDetail: id,
							}))
						}
						insights={experimentState.insights}
						onInsightsChange={(insights) =>
							setExperimentState((prev) => ({
								...prev,
								insights,
							}))
						}
					/>

					{/* Detailed Analysis for Selected Experiment */}
					{experimentState.selectedForDetail &&
						trainingStage === "completed" &&
						experimentState.currentModelId && (
							<div className="space-y-4">
								{/* Validation Results */}
								<ValidationSetResultsPanel
									modelId={experimentState.currentModelId}
								/>

								{/* Test Results */}
								<TestSetResultsPanel
									modelId={experimentState.currentModelId}
								/>

								{/* Training Data Stats */}
								<TrainingDataStatsPanel
									trainingDataStats={trainingDataStats}
									isLoading={isLoadingVisualization}
								/>

								{/* Sample Distribution */}
								<SampleDistributionPanel
									sampleDistribution={sampleDistribution}
									isLoading={isLoadingVisualization}
								/>
							</div>
						)}

					{/* Training Monitor */}
					<TrainingMonitorPanel
						trainingStage={trainingStage}
						trainingProgress={trainingMonitor.progress}
						currentEpoch={trainingMonitor.currentEpoch}
						totalEpochs={
							experimentConfig?.modelParams?.epochs ||
							DEFAULT_MODEL_PARAMS.epochs
						}
						trainingLogs={trainingMonitor.logs}
						pSampleCount={trainingMonitor.sampleCounts.positive}
						uSampleCount={trainingMonitor.sampleCounts.unlabeled}
						uSampleProgress={
							trainingMonitor.sampleCounts.unlabeledProgress
						}
						modelName={trainingMonitor.modelName}
						currentStage={trainingMonitor.currentStage}
						currentSubstage={trainingMonitor.currentSubstage}
						hyperparameters={trainingMonitor.hyperparameters}
						dataSplitInfo={trainingMonitor.dataSplitInfo}
						onStartPrediction={handleStartPrediction}
					/>

					{/* Training Logs */}
					<WebSocketTrainingCommunication
						selectedRunId={selectedRunId}
						isTraining={trainingStage === "training"}
						onTrainingProgressUpdate={(data) => {
							setTrainingMonitor((prev) => ({
								...prev,
								progress: data.progress,
								currentEpoch: data.currentEpoch,
								logs: data.logs,
							}));
						}}
						onSampleCountUpdate={(data) => {
							setTrainingMonitor((prev) => ({
								...prev,
								sampleCounts: {
									positive: data.positive,
									unlabeled: data.unlabeled,
									unlabeledProgress: data.unlabeledProgress,
								},
							}));
						}}
						onModelInfoUpdate={(data) => {
							setTrainingMonitor((prev) => ({
								...prev,
								modelName: data.modelName,
							}));
						}}
						onHyperparametersUpdate={(data) => {
							setTrainingMonitor((prev) => ({
								...prev,
								hyperparameters: data.hyperparameters,
							}));
						}}
						onStageUpdate={(data) => {
							setTrainingMonitor((prev) => ({
								...prev,
								currentStage: data.stage,
								currentSubstage: data.substage,
							}));
						}}
						onDataSplitInfoUpdate={(data) => {
							setTrainingMonitor((prev) => ({
								...prev,
								dataSplitInfo: data.dataSplitInfo,
							}));
						}}
						onValidationMetricsUpdate={(data) => {
							setValidationResults({
								metrics: data.metrics,
								sampleCount: data.sampleCount,
							});
						}}
						onTrainingComplete={(data) => {
							if (data.success) {
								setTrainingStage("completed");

								// Create experiment result
								if (experimentConfig) {
									const newResult: ExperimentResult = {
										id: `exp_${Date.now()}`,
										timestamp: new Date().toISOString(),
										experimentType,
										config: experimentConfig,
										metrics: {
											validationF1:
												data.metrics?.val_f1 || 0,
											testF1: data.metrics?.test_f1 || 0,
											testPrecision:
												data.metrics?.test_precision ||
												0,
											testRecall:
												data.metrics?.test_recall || 0,
										},
										status: "completed",
									};

									setExperimentState((prev) => ({
										...prev,
										results: [...prev.results, newResult],
										selectedForDetail: newResult.id,
										currentModelId: data.modelPath || "",
									}));
								}

								toast.success(
									`${scenarioType} completed successfully!`,
								);
							} else {
								setTrainingStage("ready");
								toast.error(`${scenarioType} failed`);
							}
						}}
					/>

					{/* Validation Set Results Panel */}
					{validationResults.metrics && (
						<ValidationSetResultsPanel
							validationMetrics={validationResults.metrics}
							validationSampleCount={
								validationResults.sampleCount
							}
						/>
					)}
				</div>
			</div>
		</div>
	);
}
