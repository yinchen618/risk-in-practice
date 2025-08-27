"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

import {
	Activity,
	AlertCircle,
	BarChart,
	BarChart3,
	Brain,
	CheckCircle,
	Clock,
	Database,
	Loader2,
	Play,
	RefreshCw,
	Settings,
	Trash2,
	TrendingUp,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { ExperimentRun } from "../types/index";

interface TrainedModel {
	id: string;
	name: string;
	scenarioType: string;
	status: string;
	modelConfig: string;
	dataSourceConfig: string;
	modelPath?: string;
	trainingMetrics?: string | object;
	jobId?: string;
	createdAt: string;
	completedAt?: string;
}

interface EvaluationRun {
	id: string;
	name: string;
	scenarioType: string;
	status: string;
	trainedModelId: string;
	testSetSource: string;
	evaluationMetrics?: string | object;
	jobId?: string;
	createdAt: string;
	completedAt?: string;
}

interface Stage3TrainingWorkbenchProps {
	experimentRun: ExperimentRun;
	onComplete: () => void;
}

interface ModelConfig {
	// PU Learning Strategy
	classPrior: number; // π_p

	// Data Preparation
	windowSize: number;

	// Model Architecture
	modelType: string;
	hiddenSize: number;
	numLayers: number;
	activationFunction: string;
	dropout: number;

	// Training Process
	epochs: number;
	batchSize: number;
	optimizer: string;
	learningRate: number;
	l2Regularization: number;

	// Training Stability
	earlyStopping: boolean;
	patience: number;
	learningRateScheduler: string;
}

interface DataSourceConfig {
	selectedDatasets: string[];
	positiveDataSourceIds: string[]; // P data: AnalysisDataset IDs for positive samples
	unlabeledDataSourceIds: string[]; // U data: AnalysisDataset IDs for unlabeled samples
	trainRatio: number;
	validationRatio: number;
	testRatio: number;
	timeRange: {
		startDate: string;
		endDate: string;
	};
}

interface EvaluationDataConfig {
	testDataSource: string;
	customDataRatio: number;
	timeRange: {
		startDate: string;
		endDate: string;
	};
}

export function Stage3TrainingWorkbench({
	experimentRun,
}: Stage3TrainingWorkbenchProps) {
	// State for configuration
	const [scenarioType, setScenarioType] = useState<string>("ERM_BASELINE");
	const [selectedTargetDataset, setSelectedTargetDataset] =
		useState<string>("");
	const [selectedSourceModel, setSelectedSourceModel] = useState<string>("");
	const [availableDatasets, setAvailableDatasets] = useState<any[]>([]);

	const [modelConfig, setModelConfig] = useState<ModelConfig>({
		// PU Learning Strategy
		classPrior: 0.05,

		// Data Preparation
		windowSize: 60,

		// Model Architecture
		modelType: "LSTM",
		hiddenSize: 128,
		numLayers: 2,
		activationFunction: "ReLU",
		dropout: 0.2,

		// Training Process
		epochs: 100,
		batchSize: 128,
		optimizer: "Adam",
		learningRate: 0.001,
		l2Regularization: 0.0001,

		// Training Stability
		earlyStopping: true,
		patience: 10,
		learningRateScheduler: "none",
	});
	const [dataSourceConfig, setDataSourceConfig] = useState<DataSourceConfig>({
		selectedDatasets: [],
		positiveDataSourceIds: [],
		unlabeledDataSourceIds: [],
		trainRatio: 70,
		validationRatio: 20,
		testRatio: 10,
		timeRange: {
			startDate: "",
			endDate: "",
		},
	});

	const [evaluationDataConfig, setEvaluationDataConfig] =
		useState<EvaluationDataConfig>({
			testDataSource: "training_holdout",
			customDataRatio: 20,
			timeRange: {
				startDate: "",
				endDate: "",
			},
		});

	// State for trained models and evaluation runs
	const [trainedModels, setTrainedModels] = useState<TrainedModel[]>([]);
	const [evaluationRuns, setEvaluationRuns] = useState<EvaluationRun[]>([]);
	const [selectedModel, setSelectedModel] = useState<string>("");
	const [selectedModelForEvalView, setSelectedModelForEvalView] = useState<
		string | null
	>(null);

	// References for auto-scrolling logs
	const trainingLogRef = useRef<HTMLDivElement>(null);
	const evaluationLogRef = useRef<HTMLDivElement>(null);

	// State for training monitoring
	const [isTraining, setIsTraining] = useState(false);
	const [isEvaluating, setIsEvaluating] = useState(false);

	// Add missing status states
	const trainingStatus = {
		isTraining: isTraining,
		isCompleted: false,
	};

	const evaluationStatus = {
		isEvaluating: isEvaluating,
	};
	const [trainingLogs, setTrainingLogs] = useState<string[]>([]);
	const [evaluationLogs, setEvaluationLogs] = useState<string[]>([]);

	// WebSocket connection status
	const [trainingWsConnected, setTrainingWsConnected] = useState(false);
	const [evaluationWsConnected, setEvaluationWsConnected] = useState(false);

	// Auto-scroll logs to bottom when new logs are added
	useEffect(() => {
		if (trainingLogRef.current) {
			trainingLogRef.current.scrollTop =
				trainingLogRef.current.scrollHeight;
		}
	}, [trainingLogs]);

	useEffect(() => {
		if (evaluationLogRef.current) {
			evaluationLogRef.current.scrollTop =
				evaluationLogRef.current.scrollHeight;
		}
	}, [evaluationLogs]);

	// Load existing data
	useEffect(() => {
		loadTrainedModels();
		loadEvaluationRuns();
		loadAvailableDatasets();
	}, []);

	// Handle data split ratio changes
	const handleRatioChange = (
		type: keyof Pick<
			DataSourceConfig,
			"trainRatio" | "validationRatio" | "testRatio"
		>,
		value: number,
	) => {
		if (type === "testRatio") {
			// Test ratio is auto-calculated, don't allow manual changes
			return;
		}

		const newDataSourceConfig = {
			...dataSourceConfig,
			[type]: value,
		};

		// Auto-calculate test ratio to make total = 100%
		const autoTestRatio =
			100 -
			newDataSourceConfig.trainRatio -
			newDataSourceConfig.validationRatio;

		// Ensure test ratio is within reasonable bounds (at least 10%, at most 40%)
		const clampedTestRatio = Math.max(10, Math.min(40, autoTestRatio));

		setDataSourceConfig({
			...newDataSourceConfig,
			testRatio: clampedTestRatio,
		});
	};

	const loadTrainedModels = async () => {
		try {
			const response = await fetch(
				`http://localhost:8000/api/v2/trained-models?experiment_run_id=${experimentRun.id}`,
			);
			if (response.ok) {
				const models = await response.json();
				setTrainedModels(models);

				// Auto-select first completed ERM_BASELINE model (for GENERALIZATION_CHALLENGE)
				if (
					scenarioType === "GENERALIZATION_CHALLENGE" &&
					!selectedSourceModel
				) {
					const firstERMModel = models.find(
						(m: any) =>
							m.scenarioType === "ERM_BASELINE" &&
							m.status === "COMPLETED",
					);
					if (firstERMModel) {
						setSelectedSourceModel(firstERMModel.id.toString());
					}
				}
			}
		} catch (error) {
			console.error("Failed to load trained models:", error);
		}
	};

	const loadEvaluationRuns = async () => {
		try {
			const response = await fetch(
				`http://localhost:8000/api/v2/evaluation-runs?experiment_run_id=${experimentRun.id}`,
			);
			if (response.ok) {
				const runs = await response.json();
				setEvaluationRuns(runs);
			}
		} catch (error) {
			console.error("Failed to load evaluation runs:", error);
		}
	};

	const loadAvailableDatasets = async () => {
		try {
			const response = await fetch(
				"http://localhost:8000/api/v2/analysis-datasets",
			);
			if (response.ok) {
				const datasets = await response.json();
				setAvailableDatasets(datasets);
			}
		} catch (error) {
			console.error("Failed to load available datasets:", error);
		}
	};

	const refreshData = async () => {
		console.log("🔄 Manual data refresh");
		try {
			await Promise.all([loadTrainedModels(), loadEvaluationRuns()]);
			toast.success("Data refreshed successfully");
		} catch (error) {
			console.error("Failed to refresh data:", error);
			toast.error("Failed to refresh data");
		}
	};

	// Helper functions for model-evaluation relationships
	const getEvaluationCount = (modelId: string) => {
		return evaluationRuns.filter((run) => run.trainedModelId === modelId)
			.length;
	};

	const getModelEvaluations = (modelId: string) => {
		return evaluationRuns.filter((run) => run.trainedModelId === modelId);
	};

	const handleModelEvaluationToggle = (modelId: string) => {
		setSelectedModelForEvalView(
			selectedModelForEvalView === modelId ? null : modelId,
		);
	};

	const handleDeleteModel = async (
		modelId: string,
		modelName: string,
		e: React.MouseEvent,
	) => {
		// Prevent event bubbling to the parent div
		e.stopPropagation();

		if (
			!confirm(
				`Are you sure you want to delete model "${modelName}"? This will also delete all related evaluation results.`,
			)
		) {
			return;
		}

		try {
			console.log("🗑️ Delete model request:", modelId);

			const response = await fetch(
				`http://localhost:8000/api/v2/trained-models/${modelId}`,
				{
					method: "DELETE",
				},
			);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const result = await response.json();
			console.log(
				"✅ Model deleted successfully:",
				result,
			);

			toast.success(
				`Successfully deleted model "${modelName}" and ${result.deletedEvaluations} evaluation results`,
			);

			// Refresh the data
			await loadTrainedModels();
			await loadEvaluationRuns();

			// Close the evaluation view if this model was selected
			if (selectedModelForEvalView === modelId) {
				setSelectedModelForEvalView(null);
			}
		} catch (error) {
			console.error("❌ Failed to delete model:", error);
			toast.error(
				`Failed to delete model: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		}
	};

	// Extract AnalysisDataset IDs for P and U data sources from experiment configuration
	const extractDataSourceIds = () => {
		console.log("📊 Extracting data source IDs from experiment configuration");
		
		const filteringParams = experimentRun.filtering_parameters;
		
		// For now, we'll use all available datasets for both P and U
		// In the future, this could be more granular based on user selection
		let availableDatasetIds: string[] = [];
		
		if (filteringParams && (filteringParams as any).selectedDatasetIds) {
			availableDatasetIds = (filteringParams as any).selectedDatasetIds;
		} else if (availableDatasets.length > 0) {
			// Fallback: use all loaded datasets
			availableDatasetIds = availableDatasets.map(dataset => dataset.id);
		}
		
		console.log("🔍 Available dataset IDs:", availableDatasetIds);
		
		// For PU Learning:
		// - P (Positive) data sources: All datasets (since they contain labeled positive samples)
		// - U (Unlabeled) data sources: All datasets (since they contain unlabeled samples)
		const result = {
			positive: availableDatasetIds,
			unlabeled: availableDatasetIds,
		};
		
		console.log("✅ Extracted P data sources:", result.positive);
		console.log("✅ Extracted U data sources:", result.unlabeled);
		
		return result;
	};

	const startTraining = async () => {
		console.log("🚀 Starting training request");
		setIsTraining(true);
		setTrainingLogs([]);

		try {
			// Extract AnalysisDataset IDs from experimentRun's filtering parameters
			const extractedDataSourceIds = extractDataSourceIds();
			
			// Prepare the enhanced data source configuration with P and U data sources
			const enhancedDataSourceConfig = {
				...dataSourceConfig,
				positiveDataSourceIds: extractedDataSourceIds.positive,
				unlabeledDataSourceIds: extractedDataSourceIds.unlabeled,
			};

			console.log("📤 Sending training API request with P and U data sources");
			console.log("🔍 Positive data sources:", extractedDataSourceIds.positive);
			console.log("🔍 Unlabeled data sources:", extractedDataSourceIds.unlabeled);
			
			const response = await fetch(
				"http://localhost:8000/api/v2/trained-models",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						name: `${scenarioType}_${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}`,
						scenarioType,
						experimentRunId: experimentRun.id,
						modelConfig: JSON.stringify(modelConfig),
						dataSourceConfig: JSON.stringify(enhancedDataSourceConfig),
					}),
				},
			);

			console.log(
				"📥 Received backend response:",
				response.status,
			);

			if (response.ok) {
				const newModel = await response.json();
				console.log(
					"✅ Training job created:",
					newModel,
				);
				console.log("🔍 Checking jobId:", newModel.jobId);
				console.log(
					"🔍 Full response object:",
					JSON.stringify(newModel, null, 2),
				);
				setTrainedModels((prev) => [...prev, newModel]);
				toast.success("Training job started successfully!");

				// Start WebSocket monitoring
				if (newModel.jobId) {
					console.log(
						"🔗 Starting WebSocket monitoring for job:",
						newModel.jobId,
					);
					startTrainingMonitor(newModel.jobId);
				} else {
					console.error(
						"❌ No jobId received, cannot start monitoring",
					);
					setTrainingLogs((prev) => [
						...prev,
						"❌ No jobId received, cannot start monitoring",
					]);
				}
			} else {
				const error = await response.json();
				console.error(
					"❌ Training request failed:",
					error,
				);
				toast.error(error.detail || "Failed to start training");
				setIsTraining(false); // Set to false on API error
			}
		} catch (error) {
			console.error(
				"❌ Training request exception:",
				error,
			);
			toast.error("Failed to start training");
			setIsTraining(false); // Only set to false on error
		}

		console.log(
			"🔚 Training request processing completed",
		);
	};

	const startEvaluation = async () => {
		// Check model selection based on scenario type
		const modelToUse = scenarioType === "GENERALIZATION_CHALLENGE" ? selectedSourceModel : selectedModel;
		
		if (!modelToUse) {
			toast.error("Please select a trained model for evaluation");
			return;
		}

		// For Domain Adaptation, also check if target dataset is selected
		if (scenarioType === "DOMAIN_ADAPTATION" && !selectedTargetDataset) {
			toast.error("Please select a target dataset for testing");
			return;
		}

		setIsEvaluating(true);
		setEvaluationLogs([]);

		try {
			// Prepare test set configuration based on scenario type
			let testSetConfig: any = evaluationDataConfig;
			
			if (scenarioType === "DOMAIN_ADAPTATION") {
				// For Domain Adaptation, use the selected target dataset
				const selectedDataset = availableDatasets.find(
					(dataset) => dataset.id.toString() === selectedTargetDataset
				);
				
				if (selectedDataset) {
					testSetConfig = {
						...evaluationDataConfig,
						targetDataset: {
							building: selectedDataset.building_name || selectedDataset.building,
							floor: selectedDataset.floor_name || selectedDataset.floor, 
							room: selectedDataset.room_name || selectedDataset.room,
							datasetId: selectedDataset.id
						}
					};
				}
			}

			const response = await fetch(
				"http://localhost:8000/api/v2/evaluation-runs",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						name: `Eval_${scenarioType}_${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}`,
						scenarioType,
						trainedModelId: modelToUse,
						testSetSource: JSON.stringify(testSetConfig),
					}),
				},
			);

			if (response.ok) {
				const newRun = await response.json();
				setEvaluationRuns((prev) => [...prev, newRun]);
				toast.success("Evaluation job started successfully!");

				// Start WebSocket monitoring
				startEvaluationMonitor(newRun.jobId);
			} else {
				const error = await response.json();
				toast.error(error.detail || "Failed to start evaluation");
			}
		} catch (error) {
			console.error("Failed to start evaluation:", error);
			toast.error("Failed to start evaluation");
		} finally {
			setIsEvaluating(false);
		}
	};

	// Function aliases for button handlers
	const handleStartTraining = startTraining;
	const handleStartEvaluation = startEvaluation;

	const startTrainingMonitor = (jobId: string) => {
		// Real WebSocket implementation for training monitoring
		console.log("Starting training monitor for job:", jobId);

		try {
			// Connect to WebSocket for real-time training updates
			const ws = new WebSocket(
				`ws://localhost:8000/api/v2/training-jobs/${jobId}/logs`,
			);

			ws.onopen = () => {
				console.log("Training WebSocket connected");
				setTrainingWsConnected(true);
				setTrainingLogs((prev) => [
					...prev,
					"� Connected to training monitor",
				]);
			};

			ws.onmessage = (event) => {
				console.log(
					"📨 Received training WebSocket message:",
					event.data,
				);

				// Handle ping/pong messages
				if (event.data === "ping") {
					console.log(
						"🏓 Training received ping, sending pong",
					);
					ws.send("pong");
					return;
				}

				if (event.data === "pong") {
					console.log(
						"🏓 Training received pong response",
					);
					return;
				}

				try {
					const data = JSON.parse(event.data);
					console.log(
						"📊 Parsed training update:",
						data,
					);

					// Check if training is completed
					if (
						data.type === "status" &&
						(data.message?.includes("completed") ||
							data.message?.includes("completed"))
					) {
						console.log(
							"🎉 Training completion detected, reloading trained models",
						);
						setTimeout(() => {
							loadTrainedModels();
							loadEvaluationRuns(); // Also refresh evaluation runs
						}, 1000);
					}

					// Format log message based on data type
					let logMessage = "";
					if (data.type === "log") {
						logMessage = data.message;
					} else if (data.type === "progress") {
						logMessage = `📈 Epoch ${data.epoch}/${data.total_epochs} - Loss: ${data.loss?.toFixed(4) || "N/A"}`;
					} else if (data.type === "metrics") {
						logMessage = `📊 ${data.metric_name}: ${data.value?.toFixed(4) || "N/A"}`;
					} else if (data.type === "status") {
						logMessage = `📊 Status: ${data.message}`;
					} else if (data.type === "error") {
						logMessage = `❌ Error: ${data.message}`;
					} else {
						logMessage = JSON.stringify(data);
					}

					setTrainingLogs((prev) => [...prev, logMessage]);
					console.log(
						"✅ Training log updated:",
						logMessage,
					);
				} catch (error) {
					console.error(
						"❌ Failed to parse training WebSocket message:",
						error,
					);
					console.log(
						"📝 Training raw message content:",
						event.data,
					);
					// Only add non-ping messages to logs
					if (event.data !== "ping" && event.data !== "pong") {
						setTrainingLogs((prev) => [
							...prev,
							`📨 ${event.data}`,
						]);
					}
				}
			};

			ws.onclose = () => {
				console.log(
					"🔌 Training WebSocket disconnected",
				);
				setTrainingWsConnected(false);
				setTrainingLogs((prev) => [
					...prev,
					"🔌 Training monitor disconnected",
				]);
				// Refresh trained models list after training completes
				console.log(
					"🔄 Training WebSocket closed, reloading training data",
				);
				setTimeout(() => {
					loadTrainedModels();
					loadEvaluationRuns();
				}, 2000);
			};

			ws.onerror = (error) => {
				console.error("Training WebSocket error:", error);
				setTrainingWsConnected(false);
				setTrainingLogs((prev) => [
					...prev,
					"❌ WebSocket connection error",
				]);
			};

			// Store WebSocket reference for cleanup
			return () => {
				if (ws.readyState === WebSocket.OPEN) {
					ws.close();
				}
			};
		} catch (error) {
			console.error("Failed to connect to training WebSocket:", error);
			setTrainingLogs((prev) => [
				...prev,
				"❌ Failed to connect to training monitor",
			]);
		}
	};

	const startEvaluationMonitor = (jobId: string) => {
		// Real WebSocket implementation for evaluation monitoring
		console.log("Starting evaluation monitor for job:", jobId);

		try {
			// Connect to WebSocket for real-time evaluation updates
			const ws = new WebSocket(
				`ws://localhost:8000/api/v2/evaluation-jobs/${jobId}/logs`,
			);

			ws.onopen = () => {
				console.log("Evaluation WebSocket connected");
				setEvaluationWsConnected(true);
				setEvaluationLogs((prev) => [
					...prev,
					"🔗 Connected to evaluation monitor",
				]);
			};

			ws.onmessage = (event) => {
				console.log(
					"📨 Received evaluation WebSocket message:",
					event.data,
				);

				// Handle ping/pong messages
				if (event.data === "ping") {
					console.log(
						"🏓 Evaluation received ping, sending pong",
					);
					ws.send("pong");
					return;
				}

				if (event.data === "pong") {
					console.log(
						"🏓 Evaluation received pong response",
					);
					return;
				}

				try {
					const data = JSON.parse(event.data);
					console.log(
						"📊 Parsed evaluation update:",
						data,
					);

					// Check if evaluation is completed
					if (
						data.type === "status" &&
						(data.message?.includes("completed") ||
							data.message?.includes("completed"))
					) {
						console.log(
							"🎉 Evaluation completion detected, reloading evaluation data",
						);
						setTimeout(() => {
							loadEvaluationRuns();
							loadTrainedModels(); // Also refresh trained models
						}, 1000);
					}

					// Format log message based on data type
					let logMessage = "";
					if (data.type === "log") {
						logMessage = data.message;
					} else if (data.type === "progress") {
						logMessage = `📊 Processing batch ${data.current_batch}/${data.total_batches}`;
					} else if (data.type === "metrics") {
						logMessage = `� ${data.metric_name}: ${data.value?.toFixed(4) || "N/A"}`;
					} else if (data.type === "status") {
						logMessage = `📊 Status: ${data.message}`;
					} else if (data.type === "error") {
						logMessage = `❌ Error: ${data.message}`;
					} else {
						logMessage = JSON.stringify(data);
					}

					setEvaluationLogs((prev) => [...prev, logMessage]);
					console.log(
						"✅ Evaluation log updated:",
						logMessage,
					);
				} catch (error) {
					console.error(
						"❌ Failed to parse evaluation WebSocket message:",
						error,
					);
					console.log(
						"📝 Evaluation raw message content:",
						event.data,
					);
					// Only add non-ping messages to logs
					if (event.data !== "ping" && event.data !== "pong") {
						setEvaluationLogs((prev) => [
							...prev,
							`📨 ${event.data}`,
						]);
					}
				}
			};

			ws.onclose = () => {
				console.log(
					"🔌 Evaluation WebSocket disconnected",
				);
				setEvaluationWsConnected(false);
				setEvaluationLogs((prev) => [
					...prev,
					"🔌 Evaluation monitor disconnected",
				]);
				// Refresh evaluation runs list after evaluation completes
				console.log(
					"🔄 Evaluation WebSocket closed, reloading evaluation data",
				);
				setTimeout(() => {
					loadEvaluationRuns();
					loadTrainedModels();
				}, 2000);
			};

			ws.onerror = (error) => {
				console.error("Evaluation WebSocket error:", error);
				setEvaluationWsConnected(false);
				setEvaluationLogs((prev) => [
					...prev,
					"❌ WebSocket connection error",
				]);
			};

			// Store WebSocket reference for cleanup
			return () => {
				if (ws.readyState === WebSocket.OPEN) {
					ws.close();
				}
			};
		} catch (error) {
			console.error("Failed to connect to evaluation WebSocket:", error);
			setEvaluationLogs((prev) => [
				...prev,
				"❌ Failed to connect to evaluation monitor",
			]);
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "COMPLETED":
				return <CheckCircle className="h-4 w-4 text-green-500" />;
			case "RUNNING":
				return (
					<Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
				);
			case "FAILED":
				return <AlertCircle className="h-4 w-4 text-red-500" />;
			default:
				return <Clock className="h-4 w-4 text-gray-500" />;
		}
	};

	// WebSocket connection indicator component
	const ConnectionIndicator = ({
		connected,
		isActive,
	}: { connected: boolean; isActive: boolean }) => {
		if (isActive) {
			return (
				<div className="flex items-center gap-1">
					<div
						className={`w-2 h-2 rounded-full ${connected ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
					/>
					<span className="text-xs text-muted-foreground">
						{connected ? "Connected" : "Disconnected"}
					</span>
				</div>
			);
		}
		return (
			<div className="flex items-center gap-1">
				<div className="w-2 h-2 rounded-full bg-gray-400" />
				<span className="text-xs text-muted-foreground">Idle</span>
			</div>
		);
	};

	// Render Data Configuration based on scenario type
	const renderDataConfiguration = () => {
		// Parse filtering parameters if available
		let filteringParams = null;
		// try {
		// 	if (experimentRun.filtering_parameters) {
		// 		filteringParams = JSON.parse(
		// 			experimentRun.filtering_parameters,
		// 		);
		// 	}
		// } catch (error) {
		// 	console.error("Failed to parse filtering parameters:", error);
		// }
		filteringParams = experimentRun.filtering_parameters;

		switch (scenarioType) {
			case "ERM_BASELINE":
				return (
					<div className="space-y-3 p-3 border rounded-lg bg-blue-50/30">
						<h5 className="text-sm font-medium text-blue-800">
							📊 Dataset Selection & Filtering Configuration
						</h5>
						<div className="space-y-2 text-sm text-blue-700">
							{filteringParams ? (
								<div className="space-y-2">
									{/* Selected Datasets Information */}
									{filteringParams.selectedDatasetIds &&
									Array.isArray(
										filteringParams.selectedDatasetIds,
									) &&
									filteringParams.selectedDatasetIds.length >
										0 ? (
										<div>
											<strong>Selected Datasets:</strong>{" "}
											<span className="text-blue-600">
												{
													filteringParams
														.selectedDatasetIds
														.length
												}{" "}
												dataset(s) selected
											</span>
											<div className="mt-2 space-y-1">
												{availableDatasets.length >
												0 ? (
													availableDatasets
														.filter((dataset) =>
															filteringParams.selectedDatasetIds.includes(
																dataset.id,
															),
														)
														.map((dataset) => (
															<div
																key={dataset.id}
																className="text-xs bg-white/70 p-2 rounded border"
															>
																<div className="font-medium text-blue-800">
																	{
																		dataset.name
																	}
																</div>
																<div className="text-blue-600">
																	{
																		dataset.building
																	}{" "}
																	-{" "}
																	{
																		dataset.floor
																	}{" "}
																	-{" "}
																	{
																		dataset.room
																	}{" "}
																	|{" "}
																	{
																		dataset.occupantType
																	}
																</div>
																<div className="text-blue-500">
																	{dataset.totalRecords?.toLocaleString()}{" "}
																	records,{" "}
																	{
																		dataset.positiveLabels
																	}{" "}
																	anomalies
																</div>
															</div>
														))
												) : (
													<div className="text-xs text-blue-600 italic">
														Loading dataset
														details...
													</div>
												)}
											</div>
										</div>
									) : (
										<div className="text-blue-600">
											<strong>Datasets:</strong> No
											specific datasets selected (legacy
											configuration)
										</div>
									)}

									{/* Time Range */}
									{filteringParams.startDate &&
										filteringParams.endDate && (
											<div>
												<strong>Time Range:</strong>{" "}
												{filteringParams.startDate}{" "}
												{filteringParams.startTime ||
													"00:00"}{" "}
												→ {filteringParams.endDate}{" "}
												{filteringParams.endTime ||
													"23:59"}
											</div>
										)}

									{/* Total Data Pool Statistics */}
									<div className="pt-2 border-t border-blue-200">
										<div>
											<strong>Total Data Pool:</strong>{" "}
											{(
												experimentRun.total_data_pool_size ||
												0
											).toLocaleString()}
										</div>
										<div>
											<strong>Positive Labels:</strong>{" "}
											{experimentRun.positive_label_count ||
												0}
										</div>
										<div>
											<strong>Unlabeled Labels:</strong>{" "}
											{(
												(experimentRun.total_data_pool_size ||
													0) -
												(experimentRun.positive_label_count ||
													0)
											).toLocaleString()}
										</div>
									</div>
								</div>
							) : (
								<div className="space-y-1">
									<div>
										Source: Total Data Pool from Selected
										Datasets
									</div>
									<div>
										Total Data Pool Size:{" "}
										{(
											experimentRun.total_data_pool_size ||
											0
										).toLocaleString()}
									</div>
									<div>
										Positive Labels:{" "}
										{experimentRun.positive_label_count ||
											0}
									</div>
									<div>
										Negative Labels:{" "}
										{experimentRun.negative_label_count ||
											0}
									</div>
									<div>
										Candidate Events:{" "}
										{experimentRun.candidate_count || 0}
									</div>
								</div>
							)}
						</div>
					</div>
				);

			case "GENERALIZATION_CHALLENGE":
				return (
					<div className="space-y-3">
						<div className="space-y-3 p-3 border rounded-lg bg-green-50/30">
							<h5 className="text-sm font-medium text-green-800">
								🎯 Source Model Selection
							</h5>
							<div>
								<Label className="text-xs">
									Select Model for Evaluation
								</Label>
								<Select
									value={selectedSourceModel}
									onValueChange={setSelectedSourceModel}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select source model..." />
									</SelectTrigger>
									<SelectContent>
										{/* Only show completed ERM_BASELINE models */}
										{trainedModels
											.filter(
												(m) =>
													m.scenarioType ===
														"ERM_BASELINE" &&
													m.status === "COMPLETED",
											)
											.map((model) => (
												<SelectItem
													key={model.id}
													value={model.id.toString()}
												>
													{model.name} (ID: {model.id}
													)
												</SelectItem>
											))}
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className="space-y-3 p-3 border rounded-lg bg-orange-50/30">
							<h5 className="text-sm font-medium text-orange-800">
								🎯 Target Distribution (Test Set)
							</h5>
							<div>
								<Label className="text-xs">
									Select Target Dataset for Testing
								</Label>
								<Select
									value={selectedTargetDataset}
									onValueChange={setSelectedTargetDataset}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select target dataset..." />
									</SelectTrigger>
									<SelectContent>
										{availableDatasets.map((dataset) => (
											<SelectItem
												key={dataset.id}
												value={dataset.id.toString()}
											>
												{dataset.building_name ||
													dataset.building}{" "}
												{dataset.floor_name ||
													dataset.floor}{" "}
												{dataset.room_name ||
													dataset.room}
												{": P"}{" "}
												{dataset.anomaly_count ||
													dataset.positiveLabels ||
													0}
												{" / Total "}
												{dataset.record_count ||
													dataset.totalRecords ||
													0}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
					</div>
				);

			case "DOMAIN_ADAPTATION":
				return (
					<div className="space-y-3">
						<div className="space-y-3 p-3 border rounded-lg bg-blue-50/30">
							<h5 className="text-sm font-medium text-blue-800">
								📊 Dataset Selection & Filtering Configuration
								(Source Domain)
							</h5>
							<div className="text-sm font-medium text-blue-800 mb-2">
								Source Distribution (Positive Samples):
							</div>
							<div className="space-y-2 text-sm text-blue-700">
								{filteringParams ? (
									<div className="space-y-2">
										{/* Selected Datasets Information */}
										{filteringParams.selectedDatasetIds &&
										Array.isArray(
											filteringParams.selectedDatasetIds,
										) &&
										filteringParams.selectedDatasetIds
											.length > 0 ? (
											<div>
												<strong>
													Selected Datasets:
												</strong>{" "}
												<span className="text-blue-600">
													{
														filteringParams
															.selectedDatasetIds
															.length
													}{" "}
													dataset(s) selected
												</span>
												<div className="mt-2 space-y-1">
													{availableDatasets.length >
													0 ? (
														availableDatasets
															.filter((dataset) =>
																filteringParams.selectedDatasetIds.includes(
																	dataset.id,
																),
															)
															.map((dataset) => (
																<div
																	key={
																		dataset.id
																	}
																	className="text-xs bg-white/70 p-2 rounded border"
																>
																	<div className="font-medium text-blue-800">
																		{
																			dataset.name
																		}
																	</div>
																	<div className="text-blue-600">
																		{
																			dataset.building
																		}{" "}
																		-{" "}
																		{
																			dataset.floor
																		}{" "}
																		-{" "}
																		{
																			dataset.room
																		}{" "}
																		|{" "}
																		{
																			dataset.occupantType
																		}
																	</div>
																	<div className="text-blue-500">
																		{dataset.totalRecords?.toLocaleString()}{" "}
																		records,{" "}
																		{
																			dataset.positiveLabels
																		}{" "}
																		anomalies
																	</div>
																</div>
															))
													) : (
														<div className="text-xs text-blue-600 italic">
															Loading dataset
															details...
														</div>
													)}
												</div>
											</div>
										) : (
											<div className="text-blue-600">
												<strong>Datasets:</strong> No
												specific datasets selected
												(legacy configuration)
											</div>
										)}

										{/* Time Range */}
										{filteringParams.startDate &&
											filteringParams.endDate && (
												<div>
													<strong>Time Range:</strong>{" "}
													{filteringParams.startDate}{" "}
													{filteringParams.startTime ||
														"00:00"}{" "}
													→ {filteringParams.endDate}{" "}
													{filteringParams.endTime ||
														"23:59"}
												</div>
											)}

										{/* Total Data Pool Statistics */}
										<div className="pt-2 border-t border-blue-200">
											<div>
												<strong>
													Positive Labels:
												</strong>{" "}
												{experimentRun.positive_label_count ||
													0}
											</div>
										</div>
									</div>
								) : (
									<div className="space-y-1">
										<div>
											Source: Total Data Pool from
											Selected Datasets
										</div>
										<div>
											Total Data Pool Size:{" "}
											{(
												experimentRun.total_data_pool_size ||
												0
											).toLocaleString()}
										</div>
										<div>
											Positive Labels:{" "}
											{experimentRun.positive_label_count ||
												0}
										</div>
										<div>
											Negative Labels:{" "}
											{experimentRun.negative_label_count ||
												0}
										</div>
										<div>
											Candidate Events:{" "}
											{experimentRun.candidate_count || 0}
										</div>
									</div>
								)}
							</div>
						</div>

						<div className="space-y-3 p-3 border rounded-lg bg-orange-50/30">
							<h5 className="text-sm font-medium text-orange-800">
								🎯 Target Distribution (Unlabeled & Test
								Samples)
							</h5>
							<div>
								<Label className="text-xs">
									Select Target Dataset for Unlabeled Data
								</Label>
								<Select
									value={selectedTargetDataset}
									onValueChange={setSelectedTargetDataset}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select target domain..." />
									</SelectTrigger>
									<SelectContent>
										{availableDatasets.map((dataset) => (
											<SelectItem
												key={dataset.id}
												value={dataset.id.toString()}
											>
												{dataset.building_name ||
													dataset.building}{" "}
												{dataset.floor_name ||
													dataset.floor}{" "}
												{dataset.room_name ||
													dataset.room}
												:{" "}
												{dataset.record_count ||
													dataset.totalRecords ||
													0}
											</SelectItem>
										))}
									</SelectContent>
								</Select>

								{/* Total Data Pool Statistics */}
								<div className="pt-2 border-t border-blue-200">
									<div>
										<strong>Unlabeled Labels:</strong>{" "}
										{(() => {
											const selectedDataset =
												availableDatasets.find(
													(dataset) =>
														dataset.id.toString() ===
														selectedTargetDataset,
												);
											return selectedDataset
												? (
														selectedDataset.record_count ||
														selectedDataset.totalRecords ||
														0
													).toLocaleString()
												: "0";
										})()}
									</div>
								</div>
							</div>
						</div>
					</div>
				);
			default:
				return null;
		}
	};

	// Render Model & Training Configuration (show for ERM_BASELINE and DOMAIN_ADAPTATION)
	const renderModelTrainingConfiguration = () => {
		if (
			scenarioType !== "ERM_BASELINE" &&
			scenarioType !== "DOMAIN_ADAPTATION"
		) {
			return null;
		}

		return (
			<div className="space-y-4">
				{/* PU Learning Strategy */}
				<div className="space-y-3 p-3 border rounded-lg bg-blue-50/30">
					<h5 className="text-sm font-medium text-blue-800">
						🎯 PU Learning Strategy
					</h5>

					<div className="space-y-2">
						<Label className="text-xs">
							Class Prior (π_p): {modelConfig.classPrior}
						</Label>
						<Slider
							value={[modelConfig.classPrior]}
							onValueChange={([value]) =>
								setModelConfig((prev) => ({
									...prev,
									classPrior: value,
								}))
							}
							min={0.001}
							max={0.2}
							step={0.001}
							className="w-full"
						/>
						<div className="flex justify-between text-xs text-gray-500 mt-1">
							<span>0.001 (Rare)</span>
							<span>0.200 (Common)</span>
						</div>
						<p className="text-xs text-blue-700">
							True positive proportion estimate, this is the most
							important parameter in nnPU
						</p>
					</div>
				</div>

				{/* Data Preparation */}
				<div className="space-y-3 p-3 border rounded-lg bg-green-50/30">
					<h5 className="text-sm font-medium text-green-800">
						📊 Data Preparation
					</h5>

					<div className="space-y-2">
						<Label className="text-xs">
							Window Size (Time Window): {modelConfig.windowSize}{" "}
							minutes
						</Label>
						<Slider
							value={[modelConfig.windowSize]}
							onValueChange={([value]) =>
								setModelConfig((prev) => ({
									...prev,
									windowSize: value,
								}))
							}
							min={30}
							max={240}
							step={10}
							className="w-full"
						/>
						<div className="flex justify-between text-xs text-gray-500 mt-1">
							<span>30 (Short)</span>
							<span>240 (Long)</span>
						</div>
						<p className="text-xs text-green-700">
							Time series length input to the model, must be
							sufficient to capture complete behavioral patterns
						</p>
					</div>
				</div>

				{/* Model Architecture */}
				<div className="space-y-3 p-3 border rounded-lg bg-purple-50/30">
					<h5 className="text-sm font-medium text-purple-800">
						🏗️ Model Architecture
					</h5>

					<div className="grid grid-cols-2 gap-3">
						<div>
							<Label className="text-xs">Model Type</Label>
							<Select
								value={modelConfig.modelType}
								onValueChange={(value) =>
									setModelConfig((prev) => ({
										...prev,
										modelType: value,
									}))
								}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="LSTM">
										LSTM ✅
									</SelectItem>
									<SelectItem value="GRU">GRU</SelectItem>
									<SelectItem value="Transformer">
										Transformer
									</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div>
							<Label className="text-xs">
								Activation Function
							</Label>
							<Select
								value={modelConfig.activationFunction}
								onValueChange={(value) =>
									setModelConfig((prev) => ({
										...prev,
										activationFunction: value,
									}))
								}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="ReLU">
										ReLU ✅
									</SelectItem>
									<SelectItem value="LeakyReLU">
										LeakyReLU
									</SelectItem>
									<SelectItem value="Tanh">Tanh</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="space-y-2">
						<Label className="text-xs">
							Hidden Layer Size: {modelConfig.hiddenSize}
						</Label>
						<Slider
							value={[modelConfig.hiddenSize]}
							onValueChange={([value]) =>
								setModelConfig((prev) => ({
									...prev,
									hiddenSize: value,
								}))
							}
							min={32}
							max={512}
							step={32}
							className="w-full"
						/>
						<div className="flex justify-between text-xs text-gray-500 mt-1">
							<span>32 (Simple)</span>
							<span>512 (Complex)</span>
						</div>
					</div>

					<div className="space-y-2">
						<Label className="text-xs">
							Number of Layers: {modelConfig.numLayers}
						</Label>
						<Slider
							value={[modelConfig.numLayers]}
							onValueChange={([value]) =>
								setModelConfig((prev) => ({
									...prev,
									numLayers: value,
								}))
							}
							min={1}
							max={6}
							step={1}
							className="w-full"
						/>
						<div className="flex justify-between text-xs text-gray-500 mt-1">
							<span>1 (Simple)</span>
							<span>6 (Deep)</span>
						</div>
					</div>

					<div className="space-y-2">
						<Label className="text-xs">
							Dropout Rate: {modelConfig.dropout}
						</Label>
						<Slider
							value={[modelConfig.dropout]}
							onValueChange={([value]) =>
								setModelConfig((prev) => ({
									...prev,
									dropout: value,
								}))
							}
							min={0.0}
							max={0.5}
							step={0.05}
							className="w-full"
						/>
						<div className="flex justify-between text-xs text-gray-500 mt-1">
							<span>0.0 (No Dropout)</span>
							<span>0.5 (Heavy)</span>
						</div>
					</div>
				</div>

				{/* Training Process */}
				<div className="space-y-3 p-3 border rounded-lg bg-orange-50/30">
					<h5 className="text-sm font-medium text-orange-800">
						⚡ Training Process
					</h5>

					<div className="grid grid-cols-2 gap-3">
						<div>
							<Label className="text-xs">Optimizer</Label>
							<Select
								value={modelConfig.optimizer}
								onValueChange={(value) =>
									setModelConfig((prev) => ({
										...prev,
										optimizer: value,
									}))
								}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Adam">
										Adam ✅
									</SelectItem>
									<SelectItem value="RMSprop">
										RMSprop
									</SelectItem>
									<SelectItem value="SGD">SGD</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div>
							<Label className="text-xs">Learning Rate</Label>
							<Select
								value={modelConfig.learningRate.toString()}
								onValueChange={(value) =>
									setModelConfig((prev) => ({
										...prev,
										learningRate: Number(value),
									}))
								}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="0.01">
										Fast (0.01)
									</SelectItem>
									<SelectItem value="0.005">
										Medium-Fast (0.005)
									</SelectItem>
									<SelectItem value="0.001">
										Medium (0.001) ✅
									</SelectItem>
									<SelectItem value="0.0005">
										Slow (0.0005)
									</SelectItem>
									<SelectItem value="0.0001">
										Very Slow (0.0001)
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<div>
							<Label className="text-xs">Batch Size</Label>
							<Select
								value={modelConfig.batchSize.toString()}
								onValueChange={(value) =>
									setModelConfig((prev) => ({
										...prev,
										batchSize: Number(value),
									}))
								}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="32">32</SelectItem>
									<SelectItem value="64">64</SelectItem>
									<SelectItem value="128">128 ✅</SelectItem>
									<SelectItem value="256">256</SelectItem>
									<SelectItem value="512">512</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div>
							<Label className="text-xs">L2 Regularization</Label>
							<Select
								value={modelConfig.l2Regularization.toString()}
								onValueChange={(value) =>
									setModelConfig((prev) => ({
										...prev,
										l2Regularization: Number(value),
									}))
								}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="0">None (0)</SelectItem>
									<SelectItem value="0.00001">
										Very Light (1e-5)
									</SelectItem>
									<SelectItem value="0.0001">
										Light (1e-4) ✅
									</SelectItem>
									<SelectItem value="0.001">
										Medium (1e-3)
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="space-y-2">
						<Label className="text-xs">
							Training Epochs: {modelConfig.epochs}
						</Label>
						<Slider
							value={[modelConfig.epochs]}
							onValueChange={([value]) =>
								setModelConfig((prev) => ({
									...prev,
									epochs: value,
								}))
							}
							min={20}
							max={500}
							step={10}
							className="w-full"
						/>
						<div className="flex justify-between text-xs text-gray-500 mt-1">
							<span>20 (Quick)</span>
							<span>500 (Thorough)</span>
						</div>
					</div>
				</div>

				{/* Training Stability */}
				<div className="space-y-3 p-3 border rounded-lg bg-red-50/30">
					<h5 className="text-sm font-medium text-red-800">
						🛡️ Training Stability
					</h5>

					<div className="flex items-center space-x-2">
						<input
							type="checkbox"
							id="early-stopping"
							checked={modelConfig.earlyStopping}
							onChange={(e) =>
								setModelConfig((prev) => ({
									...prev,
									earlyStopping: e.target.checked,
								}))
							}
							className="rounded"
						/>
						<Label htmlFor="early-stopping" className="text-xs">
							Enable Early Stopping
						</Label>
					</div>

					{modelConfig.earlyStopping && (
						<div className="space-y-2 ml-6">
							<Label className="text-xs">
								Patience: {modelConfig.patience} epochs
							</Label>
							<Slider
								value={[modelConfig.patience]}
								onValueChange={([value]) =>
									setModelConfig((prev) => ({
										...prev,
										patience: value,
									}))
								}
								min={5}
								max={30}
								step={1}
								className="w-full"
							/>
							<div className="flex justify-between text-xs text-gray-500 mt-1">
								<span>5 (Aggressive)</span>
								<span>30 (Patient)</span>
							</div>
						</div>
					)}

					<div>
						<Label className="text-xs">
							Learning Rate Scheduler
						</Label>
						<Select
							value={modelConfig.learningRateScheduler}
							onValueChange={(value) =>
								setModelConfig((prev) => ({
									...prev,
									learningRateScheduler: value,
								}))
							}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="none">None ✅</SelectItem>
								<SelectItem value="StepLR">Step LR</SelectItem>
								<SelectItem value="ReduceLROnPlateau">
									Reduce on Plateau
								</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>
		);
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Brain className="h-5 w-5" />
						Stage 3: Model Training & Evaluation Workbench
					</CardTitle>
					<CardDescription>
						Configure and execute model training and evaluation as
						two distinct, monitorable tasks
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div>
							<h3 className="font-semibold mb-2">
								Total Data Pool Distribution
							</h3>
							<div className="space-y-1 text-sm">
								<div>
									Total Data Pool:{" "}
									<Badge
										variant="default"
										className="bg-blue-600"
									>
										{(
											experimentRun.total_data_pool_size ||
											0
										).toLocaleString()}
									</Badge>
								</div>
								<div>
									Positive Labels:{" "}
									<Badge
										variant="outline"
										className="text-orange-600 border-orange-300"
									>
										{experimentRun.positive_label_count ||
											0}
									</Badge>
								</div>
								<div>
									Unlabeled Count:{" "}
									<Badge
										variant="outline"
										className="text-gray-600 border-gray-300"
									>
										{(
											(experimentRun.total_data_pool_size ||
												0) -
											(experimentRun.positive_label_count ||
												0)
										).toLocaleString()}
									</Badge>
								</div>
							</div>
						</div>
						<div>
							<div className="flex items-center justify-between mb-2">
								<h3 className="font-semibold">
									Experiment Status
								</h3>
								<Button
									variant="ghost"
									size="sm"
									onClick={refreshData}
									className="h-6 w-6 p-0"
									title="Refresh data"
								>
									<RefreshCw className="h-3 w-3" />
								</Button>
							</div>
							<div className="space-y-1 text-sm">
								<div>
									Current Stage:{" "}
									<Badge>{experimentRun.status}</Badge>
								</div>
								<div>
									Trained Models:{" "}
									<Badge variant="outline">
										{trainedModels.length}
									</Badge>
								</div>
								<div>
									Evaluation Runs:{" "}
									<Badge variant="outline">
										{evaluationRuns.length}
									</Badge>
								</div>
							</div>
						</div>
						<div>
							<h3 className="font-semibold mb-2">
								Available Scenarios
							</h3>
							<div className="space-y-1 text-sm text-muted-foreground">
								<div>• ERM Baseline</div>
								<div>• Generalization Challenge</div>
								<div>• Domain Adaptation</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Main Interface */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
				{/* Left Panel: Configuration */}
				<div className="lg:col-span-4 space-y-6">
					{/* Block 1: Experiment Scenario Selection */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Settings className="h-4 w-4" />
								Block 1: Experiment Scenario Selection
							</CardTitle>
							<CardDescription>
								Choose your experiment type to configure the
								appropriate workflow
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							{/* Scenario Type */}
							<div className="space-y-2">
								<Label className="text-sm font-medium">
									Scenario Type
								</Label>
								<RadioGroup
									value={scenarioType}
									onValueChange={setScenarioType}
									className="space-y-1"
								>
									<div className="flex items-start space-x-2 rounded-md hover:bg-accent/30 transition-colors">
										<RadioGroupItem
											value="ERM_BASELINE"
											id="erm-baseline"
											className="mt-1"
										/>
										<div className="flex-1">
											<Label
												htmlFor="erm-baseline"
												className="cursor-pointer text-sm font-medium"
											>
												ERM Baseline
											</Label>
											<p className="text-xs text-muted-foreground mt-0.5">
												Standard training approach
											</p>
										</div>
									</div>
									<div className="flex items-start space-x-2 rounded-md hover:bg-accent/30 transition-colors">
										<RadioGroupItem
											value="GENERALIZATION_CHALLENGE"
											id="gen-challenge"
											className="mt-1"
										/>
										<div className="flex-1">
											<Label
												htmlFor="gen-challenge"
												className="cursor-pointer text-sm font-medium"
											>
												Generalization Challenge
											</Label>
											<p className="text-xs text-muted-foreground mt-0.5">
												Test generalization across
												domains
											</p>
										</div>
									</div>
									<div className="flex items-start space-x-2 rounded-md hover:bg-accent/30 transition-colors">
										<RadioGroupItem
											value="DOMAIN_ADAPTATION"
											id="domain-adapt"
											className="mt-1"
										/>
										<div className="flex-1">
											<Label
												htmlFor="domain-adapt"
												className="cursor-pointer text-sm font-medium"
											>
												Domain Adaptation
											</Label>
											<p className="text-xs text-muted-foreground mt-0.5">
												Adapt across conditions
											</p>
										</div>
									</div>
								</RadioGroup>
							</div>
						</CardContent>
					</Card>

					{/* Block 2: Data Configuration (Dynamic based on scenario) */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Database className="h-4 w-4" />
								Block 2: Data Configuration
							</CardTitle>
							<CardDescription>
								{scenarioType === "ERM_BASELINE" &&
									"Source data information"}
								{scenarioType === "GENERALIZATION_CHALLENGE" &&
									"Model and dataset selection"}
								{scenarioType === "DOMAIN_ADAPTATION" &&
									"Source and target domain setup"}
							</CardDescription>
						</CardHeader>
						<CardContent>{renderDataConfiguration()}</CardContent>
					</Card>

					{/* Block 3: Model & Training Configuration (conditional visibility) */}
					{(scenarioType === "ERM_BASELINE" ||
						scenarioType === "DOMAIN_ADAPTATION") && (
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Brain className="h-4 w-4" />
									Block 3: Model & Training Configuration
								</CardTitle>
								<CardDescription>
									Configure nnPU hyperparameters and training
									settings
								</CardDescription>
							</CardHeader>
							<CardContent>
								{renderModelTrainingConfiguration()}
							</CardContent>
						</Card>
					)}

					{/* Data Split Strategy (for ERM_BASELINE and DOMAIN_ADAPTATION) */}
					{(scenarioType === "ERM_BASELINE" ||
						scenarioType === "DOMAIN_ADAPTATION") && (
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<BarChart3 className="h-4 w-4" />
									Data Split Strategy
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-3">
									<div className="grid grid-cols-3 gap-3">
										<div>
											<Label className="text-xs">
												Train
											</Label>
											<div className="flex items-center space-x-2">
												<Slider
													value={[
														dataSourceConfig.trainRatio,
													]}
													onValueChange={([value]) =>
														handleRatioChange(
															"trainRatio",
															value,
														)
													}
													max={80}
													min={50}
													step={5}
													className="flex-1"
												/>
												<span className="text-xs w-8">
													{
														dataSourceConfig.trainRatio
													}
													%
												</span>
											</div>
										</div>
										<div>
											<Label className="text-xs">
												Validation
											</Label>
											<div className="flex items-center space-x-2">
												<Slider
													value={[
														dataSourceConfig.validationRatio,
													]}
													onValueChange={([value]) =>
														handleRatioChange(
															"validationRatio",
															value,
														)
													}
													max={30}
													min={10}
													step={5}
													className="flex-1"
												/>
												<span className="text-xs w-8">
													{
														dataSourceConfig.validationRatio
													}
													%
												</span>
											</div>
										</div>
										<div>
											<Label className="text-xs">
												Test
											</Label>
											<div className="flex items-center space-x-2">
												<Slider
													value={[
														dataSourceConfig.testRatio,
													]}
													onValueChange={([value]) =>
														handleRatioChange(
															"testRatio",
															value,
														)
													}
													max={30}
													min={10}
													step={5}
													className="flex-1"
												/>
												<span className="text-xs w-8">
													{dataSourceConfig.testRatio}
													%
												</span>
											</div>
										</div>
									</div>
									<div className="text-xs text-muted-foreground">
										Total:{" "}
										{dataSourceConfig.trainRatio +
											dataSourceConfig.validationRatio +
											dataSourceConfig.testRatio}
										%
										{dataSourceConfig.trainRatio +
											dataSourceConfig.validationRatio +
											dataSourceConfig.testRatio !==
											100 && (
											<span className="text-red-600 ml-1">
												(Must equal 100%)
											</span>
										)}
									</div>
								</div>
							</CardContent>
						</Card>
					)}

					{/* Action Buttons */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Play className="h-4 w-4" />
								Actions
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								{/* Training Button (for ERM_BASELINE and DOMAIN_ADAPTATION) */}
								{(scenarioType === "ERM_BASELINE" ||
									scenarioType === "DOMAIN_ADAPTATION") && (
									<Button
										onClick={handleStartTraining}
										disabled={
											trainingStatus.isTraining ||
											dataSourceConfig.trainRatio +
												dataSourceConfig.validationRatio +
												dataSourceConfig.testRatio !==
												100
										}
										className="w-full"
									>
										{trainingStatus.isTraining ? (
											<>
												<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
												Starting Training...
											</>
										) : (
											<>
												<Play className="h-4 w-4 mr-2" />
												▶ Start Model Training
											</>
										)}
									</Button>
								)}

								{/* Model Selection and Evaluation for ERM_BASELINE */}
								{scenarioType === "ERM_BASELINE" &&
									trainedModels.length > 0 && (
										<>
											<div className="space-y-2">
												<Label className="text-sm font-medium">
													Select Model for Evaluation
												</Label>
												<Select
													value={selectedModel}
													onValueChange={
														setSelectedModel
													}
												>
													<SelectTrigger>
														<SelectValue placeholder="Choose a trained model..." />
													</SelectTrigger>
													<SelectContent>
														{trainedModels
															.filter(
																(model) =>
																	model.status ===
																	"COMPLETED",
															)
															.map((model) => (
																<SelectItem
																	key={
																		model.id
																	}
																	value={
																		model.id
																	}
																>
																	{model.name}{" "}
																	(
																	{
																		model.scenarioType
																	}
																	)
																</SelectItem>
															))}
													</SelectContent>
												</Select>
											</div>

											<Button
												onClick={handleStartEvaluation}
												disabled={
													evaluationStatus.isEvaluating ||
													!selectedModel
												}
												variant="outline"
												className="w-full"
											>
												{evaluationStatus.isEvaluating ? (
													<>
														<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2" />
														Evaluating...
													</>
												) : (
													<>
														<TrendingUp className="h-4 w-4 mr-2" />
														📈 Start Model
														Evaluation
													</>
												)}
											</Button>
										</>
									)}

								{/* Model Selection and Evaluation for DOMAIN_ADAPTATION */}
								{scenarioType === "DOMAIN_ADAPTATION" &&
									trainedModels.length > 0 && (
										<>
											<div className="space-y-2">
												<Label className="text-sm font-medium">
													Select Model for Evaluation
												</Label>
												<Select
													value={selectedModel}
													onValueChange={
														setSelectedModel
													}
												>
													<SelectTrigger>
														<SelectValue placeholder="Choose a trained model..." />
													</SelectTrigger>
													<SelectContent>
														{trainedModels
															.filter(
																(model) =>
																	model.status ===
																	"COMPLETED",
															)
															.map((model) => (
																<SelectItem
																	key={
																		model.id
																	}
																	value={
																		model.id
																	}
																>
																	{model.name}{" "}
																	(
																	{
																		model.scenarioType
																	}
																	)
																</SelectItem>
															))}
													</SelectContent>
												</Select>
											</div>

											<div className="space-y-2">
												<Label className="text-sm font-medium">
													🎯 Target Dataset for Testing
												</Label>
												<Select
													value={selectedTargetDataset}
													onValueChange={setSelectedTargetDataset}
												>
													<SelectTrigger>
														<SelectValue placeholder="Select target domain for testing..." />
													</SelectTrigger>
													<SelectContent>
														{availableDatasets.map((dataset) => (
															<SelectItem
																key={dataset.id}
																value={dataset.id.toString()}
															>
																{dataset.building_name ||
																	dataset.building}{" "}
																{dataset.floor_name ||
																	dataset.floor}{" "}
																{dataset.room_name ||
																	dataset.room}
																: P {dataset.positiveLabels || 0} / Total{" "}
																{dataset.record_count ||
																	dataset.totalRecords ||
																	0}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</div>

											<Button
												onClick={handleStartEvaluation}
												disabled={
													evaluationStatus.isEvaluating ||
													!selectedModel ||
													!selectedTargetDataset
												}
												variant="outline"
												className="w-full"
											>
												{evaluationStatus.isEvaluating ? (
													<>
														<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2" />
														Evaluating...
													</>
												) : (
													<>
														<TrendingUp className="h-4 w-4 mr-2" />
														📈 Start Model
														Evaluation
													</>
												)}
											</Button>
										</>
									)}

								{/* Evaluation Button (for GENERALIZATION_CHALLENGE) */}
								{scenarioType ===
									"GENERALIZATION_CHALLENGE" && (
									<Button
										onClick={handleStartEvaluation}
										disabled={
											evaluationStatus.isEvaluating ||
											!selectedSourceModel
										}
										variant="outline"
										className="w-full"
									>
										{evaluationStatus.isEvaluating ? (
											<>
												<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2" />
												Evaluating...
											</>
										) : (
											<>
												<TrendingUp className="h-4 w-4 mr-2" />
												📈 Start Model Evaluation
											</>
										)}
									</Button>
								)}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Right Panel: Monitoring and Results */}
				<div className="lg:col-span-8 space-y-6">
					{/* Monitoring Section */}
					<div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
						{/* Training Monitor */}
						<Card>
							<CardHeader>
								<div className="flex items-center justify-between">
									<CardTitle className="flex items-center gap-2">
										<Activity className="h-4 w-4" />
										Training Monitor
										{isTraining && (
											<Loader2 className="h-3 w-3 animate-spin text-blue-500" />
										)}
									</CardTitle>
									<ConnectionIndicator
										connected={trainingWsConnected}
										isActive={isTraining}
									/>
								</div>
							</CardHeader>
							<CardContent>
								<div
									ref={trainingLogRef}
									className="h-40 bg-gray-50 text-gray-800 font-mono text-xs p-3 rounded border overflow-y-auto"
								>
									{trainingLogs.length === 0 ? (
										<div className="text-gray-500 italic">
											No training logs yet...
										</div>
									) : (
										trainingLogs.map((log, index) => (
											<div
												key={index}
												className="mb-1 text-gray-700"
											>
												{log}
											</div>
										))
									)}
								</div>
							</CardContent>
						</Card>

						{/* Evaluation Monitor */}
						<Card>
							<CardHeader>
								<div className="flex items-center justify-between">
									<CardTitle className="flex items-center gap-2">
										<TrendingUp className="h-4 w-4" />
										Evaluation Monitor
										{isEvaluating && (
											<Loader2 className="h-3 w-3 animate-spin text-blue-500" />
										)}
									</CardTitle>
									<ConnectionIndicator
										connected={evaluationWsConnected}
										isActive={isEvaluating}
									/>
								</div>
							</CardHeader>
							<CardContent>
								<div
									ref={evaluationLogRef}
									className="h-40 bg-gray-50 text-gray-800 font-mono text-xs p-3 rounded border overflow-y-auto"
								>
									{evaluationLogs.length === 0 ? (
										<div className="text-gray-500 italic">
											No evaluation logs yet...
										</div>
									) : (
										evaluationLogs.map((log, index) => (
											<div
												key={index}
												className="mb-1 text-gray-700"
											>
												{log}
											</div>
										))
									)}
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Trained Models */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Database className="h-4 w-4" />
								Trained Models
							</CardTitle>
						</CardHeader>
						<CardContent>
							{trainedModels.length === 0 ? (
								<div className="text-center text-muted-foreground py-8">
									No trained models yet. Start your first
									training job above.
								</div>
							) : (
								<div className="space-y-3">
									{trainedModels.map((model) => {
										const evaluationCount =
											getEvaluationCount(model.id);
										const isSelected =
											selectedModelForEvalView ===
											model.id;
										const modelEvaluations =
											getModelEvaluations(model.id);

										return (
											<div
												key={model.id}
												className="border rounded-lg"
											>
												<div
													className={`p-3 cursor-pointer transition-colors hover:bg-gray-50 ${
														isSelected
															? "bg-blue-50 border-blue-200"
															: ""
													}`}
													onClick={() =>
														handleModelEvaluationToggle(
															model.id,
														)
													}
												>
													<div className="flex items-center justify-between">
														<div className="flex items-center gap-2">
															{getStatusIcon(
																model.status,
															)}
															<span className="font-medium">
																{model.name}
															</span>
															<Badge variant="outline">
																{
																	model.scenarioType
																}
															</Badge>
															{evaluationCount >
																0 && (
																<Badge
																	variant="secondary"
																	className="bg-green-100 text-green-800"
																>
																	{
																		evaluationCount
																	}{" "}
																	evaluations
																</Badge>
															)}
														</div>
														<div className="flex items-center gap-2">
															<Button
																variant="outline"
																size="sm"
																className="h-7 w-7 p-0 text-red-500 hover:bg-red-50 hover:text-red-600"
																onClick={(e) =>
																	handleDeleteModel(
																		model.id,
																		model.name,
																		e,
																	)
																}
																title="Delete model and related evaluations"
															>
																<Trash2 className="h-3 w-3" />
															</Button>
															<Badge
																variant={
																	model.status ===
																	"COMPLETED"
																		? "default"
																		: "secondary"
																}
															>
																{model.status}
															</Badge>
															{evaluationCount >
																0 && (
																<div className="text-xs text-muted-foreground">
																	Click to view{" "}
																	{isSelected
																		? "▼"
																		: "▶"}
																</div>
															)}
														</div>
													</div>
													<div className="text-sm text-muted-foreground mt-1">
														Created:{" "}
														{new Date(
															model.createdAt,
														).toLocaleString()}
													</div>
													
													{/* Training Data Information */}
													{model.training_data_info && (
														<div className="mt-3 p-3 bg-gray-50 border rounded-md">
															<h5 className="text-sm font-medium text-gray-800 mb-2">
																📊 Training Data Sources
															</h5>
															<div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
																{/* P Data Sources */}
																<div>
																	<div className="font-semibold text-orange-700 mb-1">
																		Positive (P) Data Sources:
																	</div>
																	{model.training_data_info.p_data_sources?.dataset_ids?.map((datasetId: string) => {
																		const datasetName = model.training_data_info.p_data_sources?.dataset_names?.[datasetId] || `Dataset ${datasetId}`;
																		const datasetInfo = model.training_data_info.p_data_sources?.dataset_info?.[datasetId];
																		return (
																			<div key={datasetId} className="mb-1 pl-2 border-l-2 border-orange-200">
																				<div className="font-medium text-gray-700">{datasetName}</div>
																				{datasetInfo && (
																					<div className="text-gray-600">
																						Total: {datasetInfo.total_samples} samples
																						<br />
																						Train: {datasetInfo.train_samples} | Val: {datasetInfo.validation_samples} | Test: {datasetInfo.test_samples}
																					</div>
																				)}
																			</div>
																		);
																	})}
																	<div className="mt-2 pt-2 border-t border-orange-200 font-medium text-orange-800">
																		Total P: {model.training_data_info.p_data_sources?.total_samples || 0} samples
																	</div>
																</div>
																
																{/* U Data Sources */}
																<div>
																	<div className="font-semibold text-blue-700 mb-1">
																		Unlabeled (U) Data Sources:
																	</div>
																	{model.training_data_info.u_data_sources?.dataset_ids?.map((datasetId: string) => {
																		const datasetName = model.training_data_info.u_data_sources?.dataset_names?.[datasetId] || `Dataset ${datasetId}`;
																		const datasetInfo = model.training_data_info.u_data_sources?.dataset_info?.[datasetId];
																		return (
																			<div key={datasetId} className="mb-1 pl-2 border-l-2 border-blue-200">
																				<div className="font-medium text-gray-700">{datasetName}</div>
																				{datasetInfo && (
																					<div className="text-gray-600">
																						Total: {datasetInfo.total_samples} samples
																						<br />
																						Train: {datasetInfo.train_samples} | Val: {datasetInfo.validation_samples} | Test: {datasetInfo.test_samples}
																					</div>
																				)}
																			</div>
																		);
																	})}
																	<div className="mt-2 pt-2 border-t border-blue-200 font-medium text-blue-800">
																		Total U: {model.training_data_info.u_data_sources?.total_samples || 0} samples
																	</div>
																</div>
															</div>
															
															{/* Data Split Information */}
															{model.training_data_info.data_split_ratios && (
																<div className="mt-3 pt-2 border-t border-gray-200">
																	<div className="text-xs text-gray-600">
																		<span className="font-medium">Data Split:</span>{" "}
																		Train {(model.training_data_info.data_split_ratios.train_ratio * 100).toFixed(0)}% | 
																		Val {(model.training_data_info.data_split_ratios.validation_ratio * 100).toFixed(0)}% | 
																		Test {(model.training_data_info.data_split_ratios.test_ratio * 100).toFixed(0)}%
																		
																		{model.training_data_info.overlap_removal && (
																			<span className="ml-2 px-1 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs">
																				Overlap Removed
																			</span>
																		)}
																		
																		{model.training_data_info.u_sampling_applied && (
																			<span className="ml-2 px-1 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
																				U Sampled (10x)
																			</span>
																		)}
																	</div>
																</div>
															)}
														</div>
													)}
												</div>

												{/* Model Evaluations - Only show when selected */}
												{isSelected &&
													modelEvaluations.length >
														0 && (
														<div className="border-t bg-gray-50 p-3">
															<div className="text-sm font-medium mb-2 text-gray-700">
																Evaluation Results (
																{
																	modelEvaluations.length
																}{" "}
																runs)
															</div>
															<div className="space-y-2">
																{modelEvaluations.map(
																	(
																		evaluation,
																	) => (
																		<div
																			key={
																				evaluation.id
																			}
																			className="bg-white border rounded p-2 text-xs"
																		>
																			<div className="flex items-center justify-between mb-1">
																				<span className="font-medium">
																					{
																						evaluation.name
																					}
																				</span>
																				<Badge
																					variant={
																						evaluation.status ===
																						"COMPLETED"
																							? "default"
																							: "secondary"
																					}
																					className="text-xs"
																				>
																					{
																						evaluation.status
																					}
																				</Badge>
																			</div>
																			<div className="text-gray-600">
																				Created:{" "}
																				{new Date(
																					evaluation.createdAt,
																				).toLocaleString()}
																			</div>
																			{evaluation.evaluationMetrics && (
																				<div className="mt-1 p-1 bg-gray-50 rounded">
																					<pre className="text-xs text-gray-700">
																						{JSON.stringify(
																							typeof evaluation.evaluationMetrics ===
																								"string"
																								? JSON.parse(
																										evaluation.evaluationMetrics,
																									)
																								: evaluation.evaluationMetrics,
																							null,
																							2,
																						)}
																					</pre>
																				</div>
																			)}
																		</div>
																	),
																)}
															</div>
														</div>
													)}
											</div>
										);
									})}
								</div>
							)}
						</CardContent>
					</Card>

					{/* Evaluation Results */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<BarChart className="h-4 w-4" />
								Evaluation Results
							</CardTitle>
						</CardHeader>
						<CardContent>
							{evaluationRuns.length === 0 ? (
								<div className="text-center text-muted-foreground py-8">
									No evaluation runs yet. Select a trained
									model and start evaluation.
								</div>
							) : (
								<div className="space-y-3">
									{evaluationRuns.map((run) => (
										<div
											key={run.id}
											className="border rounded-lg p-3"
										>
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-2">
													{getStatusIcon(run.status)}
													<span className="font-medium">
														{run.name}
													</span>
													<Badge variant="outline">
														{run.scenarioType}
													</Badge>
												</div>
												<Badge
													variant={
														run.status ===
														"COMPLETED"
															? "default"
															: "secondary"
													}
												>
													{run.status}
												</Badge>
											</div>
											<div className="text-sm text-muted-foreground mt-1">
												Created:{" "}
												{new Date(
													run.createdAt,
												).toLocaleString()}
											</div>
											{run.evaluationMetrics && (
												<>
													{/* Original JSON Data */}
													<div className="mt-2 p-2 bg-gray-50 rounded text-xs">
														<pre>
															{JSON.stringify(
																typeof run.evaluationMetrics ===
																	"string"
																	? JSON.parse(
																			run.evaluationMetrics,
																		)
																	: run.evaluationMetrics,
																null,
																2,
															)}
														</pre>
													</div>

													{/* Visualized Evaluation Results */}
													{(() => {
														const metrics =
															typeof run.evaluationMetrics ===
															"string"
																? JSON.parse(
																		run.evaluationMetrics,
																	)
																: run.evaluationMetrics;

														// Ensure necessary metric data is available
														if (
															!metrics ||
															!metrics.precision ||
															!metrics.recall
														) {
															return null;
														}

														// Debug: Output confusion_matrix structure (for development viewing)
														// console.log(
														// 	"Confusion Matrix structure:",
														// 	metrics.confusion_matrix,
														// );

														const confusionMatrix =
															metrics.confusion_matrix;

														// Safely extract confusion matrix data
														let tp: number;
														let fp: number;
														let fn: number;
														let tn: number;

														if (!confusionMatrix) {
															// If no confusion matrix, try to calculate from other metrics
															tp =
																fp =
																fn =
																tn =
																	0;
														} else if (
															Array.isArray(
																confusionMatrix,
															) &&
															confusionMatrix.length >=
																2
														) {
															// 2D array format: [[tn, fp], [fn, tp]]
															if (
																Array.isArray(
																	confusionMatrix[0],
																) &&
																Array.isArray(
																	confusionMatrix[1],
																)
															) {
																tn =
																	confusionMatrix[0][0] ||
																	0;
																fp =
																	confusionMatrix[0][1] ||
																	0;
																fn =
																	confusionMatrix[1][0] ||
																	0;
																tp =
																	confusionMatrix[1][1] ||
																	0;
															} else {
																// 1D array format: [tn, fp, fn, tp]
																tn =
																	confusionMatrix[0] ||
																	0;
																fp =
																	confusionMatrix[1] ||
																	0;
																fn =
																	confusionMatrix[2] ||
																	0;
																tp =
																	confusionMatrix[3] ||
																	0;
															}
														} else if (
															typeof confusionMatrix ===
															"object"
														) {
															// Object format: {tp: x, fp: x, fn: x, tn: x}
															tp =
																confusionMatrix.tp ||
																confusionMatrix.true_positive ||
																0;
															fp =
																confusionMatrix.fp ||
																confusionMatrix.false_positive ||
																0;
															fn =
																confusionMatrix.fn ||
																confusionMatrix.false_negative ||
																0;
															tn =
																confusionMatrix.tn ||
																confusionMatrix.true_negative ||
																0;
														} else {
															// If format is unknown, use default values
															tp =
																fp =
																fn =
																tn =
																	0;
														}

														const precision = (
															metrics.precision *
															100
														).toFixed(2);
														const recall = (
															metrics.recall * 100
														).toFixed(2);
														const f1Score = (
															metrics.f1_score *
															100
														).toFixed(2);
														const accuracy = (
															metrics.accuracy *
															100
														).toFixed(2);
														const aucRoc = (
															metrics.auc_roc *
															100
														).toFixed(1);

														return (
															<div className="mt-4 space-y-6">
																{/* Performance Metrics Table */}
																<div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
																	<div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
																		<h4 className="text-lg font-semibold text-gray-800">
																			Classification
																			Performance
																			Metrics
																		</h4>
																		<p className="text-sm text-gray-600 mt-1">
																			Statistical
																			evaluation
																			of
																			model
																			performance
																			on
																			anomaly
																			detection
																			task
																		</p>
																	</div>
																	<div className="p-6">
																		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
																			<div className="text-center">
																				<div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-3">
																					<span className="text-xl font-bold text-blue-700">
																						F₁
																					</span>
																				</div>
																				<div className="text-2xl font-bold text-gray-800 mb-1">
																					{
																						f1Score
																					}
																					%
																				</div>
																				<div className="text-sm font-medium text-gray-700 mb-1">
																					F₁-Score
																				</div>
																				<div className="text-xs text-gray-500">
																					Harmonic
																					mean
																					of
																					precision
																					and
																					recall
																				</div>
																			</div>
																			<div className="text-center">
																				<div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-3">
																					<span className="text-xl font-bold text-green-700">
																						P
																					</span>
																				</div>
																				<div className="text-2xl font-bold text-gray-800 mb-1">
																					{
																						precision
																					}
																					%
																				</div>
																				<div className="text-sm font-medium text-gray-700 mb-1">
																					Precision
																				</div>
																				<div className="text-xs text-gray-500">
																					TP
																					/
																					(TP
																					+
																					FP)
																				</div>
																			</div>
																			<div className="text-center">
																				<div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-3">
																					<span className="text-xl font-bold text-orange-700">
																						R
																					</span>
																				</div>
																				<div className="text-2xl font-bold text-gray-800 mb-1">
																					{
																						recall
																					}
																					%
																				</div>
																				<div className="text-sm font-medium text-gray-700 mb-1">
																					Recall
																					(Sensitivity)
																				</div>
																				<div className="text-xs text-gray-500">
																					TP
																					/
																					(TP
																					+
																					FN)
																				</div>
																			</div>
																			<div className="text-center">
																				<div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-3">
																					<span className="text-xl font-bold text-purple-700">
																						AUC
																					</span>
																				</div>
																				<div className="text-2xl font-bold text-gray-800 mb-1">
																					{
																						aucRoc
																					}
																					%
																				</div>
																				<div className="text-sm font-medium text-gray-700 mb-1">
																					AUC-ROC
																				</div>
																				<div className="text-xs text-gray-500">
																					Area
																					under
																					ROC
																					curve
																				</div>
																			</div>
																		</div>
																	</div>
																</div>

																{/* Confusion Matrix - Only show when data is available */}
																{(tp > 0 ||
																	fp > 0 ||
																	fn > 0 ||
																	tn > 0) && (
																	<div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
																		<div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
																			<h4 className="text-lg font-semibold text-gray-800">
																				Confusion
																				Matrix
																			</h4>
																			<p className="text-sm text-gray-600 mt-1">
																				2×2
																				contingency
																				table
																				for
																				binary
																				classification
																				evaluation
																			</p>
																		</div>
																		<div className="p-6">
																			<div className="flex justify-center">
																				<div className="border border-gray-300 rounded-lg overflow-hidden">
																					<table className="table-fixed">
																						<thead>
																							<tr>
																								<td className="w-32 h-16 bg-gray-100 border-r border-b border-gray-300" />
																								<td className="w-32 h-16 bg-gray-100 border-r border-b border-gray-300 text-center font-semibold text-sm text-gray-700 px-2">
																									<div className="flex flex-col justify-center h-full">
																										<div>
																											Predicted
																										</div>
																										<div>
																											Positive
																										</div>
																									</div>
																								</td>
																								<td className="w-32 h-16 bg-gray-100 border-b border-gray-300 text-center font-semibold text-sm text-gray-700 px-2">
																									<div className="flex flex-col justify-center h-full">
																										<div>
																											Predicted
																										</div>
																										<div>
																											Negative
																										</div>
																									</div>
																								</td>
																							</tr>
																						</thead>
																						<tbody>
																							<tr>
																								<td className="w-32 h-20 bg-gray-100 border-r border-b border-gray-300 text-center font-semibold text-sm text-gray-700 px-2">
																									<div className="flex flex-col justify-center h-full">
																										<div>
																											Actual
																										</div>
																										<div>
																											Positive
																										</div>
																									</div>
																								</td>
																								<td className="w-32 h-20 border-r border-b border-gray-300 text-center bg-green-50">
																									<div className="flex flex-col justify-center h-full">
																										<div className="text-2xl font-bold text-green-700">
																											{
																												tp
																											}
																										</div>
																										<div className="text-xs text-gray-600 mt-1">
																											True
																											Positive
																										</div>
																									</div>
																								</td>
																								<td className="w-32 h-20 border-b border-gray-300 text-center bg-red-50">
																									<div className="flex flex-col justify-center h-full">
																										<div className="text-2xl font-bold text-red-700">
																											{
																												fn
																											}
																										</div>
																										<div className="text-xs text-gray-600 mt-1">
																											False
																											Negative
																										</div>
																									</div>
																								</td>
																							</tr>
																							<tr>
																								<td className="w-32 h-20 bg-gray-100 border-r border-gray-300 text-center font-semibold text-sm text-gray-700 px-2">
																									<div className="flex flex-col justify-center h-full">
																										<div>
																											Actual
																										</div>
																										<div>
																											Negative
																										</div>
																									</div>
																								</td>
																								<td className="w-32 h-20 border-r border-gray-300 text-center bg-yellow-50">
																									<div className="flex flex-col justify-center h-full">
																										<div className="text-2xl font-bold text-yellow-700">
																											{
																												fp
																											}
																										</div>
																										<div className="text-xs text-gray-600 mt-1">
																											False
																											Positive
																										</div>
																									</div>
																								</td>
																								<td className="w-32 h-20 border-gray-300 text-center bg-blue-50">
																									<div className="flex flex-col justify-center h-full">
																										<div className="text-2xl font-bold text-blue-700">
																											{
																												tn
																											}
																										</div>
																										<div className="text-xs text-gray-600 mt-1">
																											True
																											Negative
																										</div>
																									</div>
																								</td>
																							</tr>
																						</tbody>
																					</table>
																				</div>
																			</div>
																			<div className="mt-4 text-center text-sm text-gray-600">
																				<p className="mb-2">
																					<strong>
																						Classification
																						Accuracy:
																					</strong>{" "}
																					{(
																						((tp +
																							tn) /
																							(tp +
																								fp +
																								fn +
																								tn)) *
																						100
																					).toFixed(
																						1,
																					)}
																					%
																				</p>
																				<p>
																					<strong>
																						Error
																						Rate:
																					</strong>{" "}
																					{(
																						((fp +
																							fn) /
																							(tp +
																								fp +
																								fn +
																								tn)) *
																						100
																					).toFixed(
																						1,
																					)}
																					%
																				</p>
																			</div>
																		</div>
																	</div>
																)}

																{/* Metric Explanations */}
																<div className="bg-gray-50 border rounded-lg p-4">
																	<h4 className="text-lg font-semibold mb-3">
																		Metric
																		Interpretations
																	</h4>
																	<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
																		<div className="space-y-2">
																			<div>
																				<strong className="text-green-700">
																					Precision
																					(
																					{
																						precision
																					}
																					%)
																				</strong>
																				<p className="text-gray-600">
																					Of
																					all
																					alerts,{" "}
																					{
																						precision
																					}
																					%
																					are
																					real
																					anomalies.
																					The
																					remaining{" "}
																					{(
																						100 -
																						Number.parseFloat(
																							precision,
																						)
																					).toFixed(
																						1,
																					)}
																					%
																					are
																					false
																					alarms.
																				</p>
																			</div>
																			<div>
																				<strong className="text-orange-700">
																					Recall
																					(
																					{
																						recall
																					}
																					%)
																				</strong>
																				<p className="text-gray-600">
																					Successfully
																					detected{" "}
																					{
																						recall
																					}
																					%
																					of
																					real
																					anomalies.{" "}
																					{(
																						100 -
																						Number.parseFloat(
																							recall,
																						)
																					).toFixed(
																						1,
																					)}
																					%
																					of
																					anomalies
																					were
																					missed.
																				</p>
																			</div>
																		</div>
																		<div className="space-y-2">
																			<div>
																				<strong className="text-blue-700">
																					F1-Score
																					(
																					{
																						f1Score
																					}
																					%)
																				</strong>
																				<p className="text-gray-600">
																					Harmonic
																					mean
																					of
																					Precision
																					and
																					Recall,
																					providing
																					a
																					balanced
																					performance
																					metric.
																				</p>
																			</div>
																			<div>
																				<strong className="text-purple-700">
																					AUC-ROC
																					(
																					{
																						aucRoc
																					}
																					%)
																				</strong>
																				<p className="text-gray-600">
																					Model's
																					ability
																					to
																					distinguish
																					between
																					anomalies
																					and
																					normal
																					patterns.
																					Closer
																					to
																					100%
																					is
																					better.
																				</p>
																			</div>
																		</div>
																	</div>
																</div>

																{/* Business Impact Assessment */}
																<div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
																	<div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
																		<h4 className="text-lg font-semibold text-gray-800">
																			Business
																			Impact
																			Assessment
																		</h4>
																		<p className="text-sm text-gray-600 mt-1">
																			Economic
																			and
																			operational
																			risk
																			analysis
																			based
																			on
																			classification
																			errors
																		</p>
																	</div>
																	<div className="p-6">
																		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
																			<div className="bg-red-50 border border-red-200 rounded-lg p-4">
																				<div className="flex items-center mb-3">
																					<div className="w-3 h-3 bg-red-500 rounded-full mr-2" />
																					<h5 className="font-semibold text-red-800">
																						Type
																						II
																						Error
																						Impact
																						(False
																						Negatives)
																					</h5>
																				</div>
																				<div className="mb-3">
																					<span className="text-2xl font-bold text-red-700">
																						{
																							fn
																						}
																					</span>
																					<span className="text-sm text-red-600 ml-2">
																						missed
																						anomalies
																					</span>
																				</div>
																				<div className="space-y-2 text-sm text-gray-700">
																					<div className="flex items-center">
																						<span className="w-2 h-2 bg-red-400 rounded-full mr-2" />
																						<span>
																							Equipment
																							damage
																							risk
																							escalation
																						</span>
																					</div>
																					<div className="flex items-center">
																						<span className="w-2 h-2 bg-red-400 rounded-full mr-2" />
																						<span>
																							Undetected
																							energy
																							consumption
																							inefficiencies
																						</span>
																					</div>
																					<div className="flex items-center">
																						<span className="w-2 h-2 bg-red-400 rounded-full mr-2" />
																						<span>
																							Potential
																							safety
																							protocol
																							violations
																						</span>
																					</div>
																				</div>
																			</div>
																			<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
																				<div className="flex items-center mb-3">
																					<div className="w-3 h-3 bg-yellow-500 rounded-full mr-2" />
																					<h5 className="font-semibold text-yellow-800">
																						Type
																						I
																						Error
																						Impact
																						(False
																						Positives)
																					</h5>
																				</div>
																				<div className="mb-3">
																					<span className="text-2xl font-bold text-yellow-700">
																						{
																							fp
																						}
																					</span>
																					<span className="text-sm text-yellow-600 ml-2">
																						false
																						alarms
																					</span>
																				</div>
																				<div className="space-y-2 text-sm text-gray-700">
																					<div className="flex items-center">
																						<span className="w-2 h-2 bg-yellow-400 rounded-full mr-2" />
																						<span>
																							Operator
																							alert
																							desensitization
																						</span>
																					</div>
																					<div className="flex items-center">
																						<span className="w-2 h-2 bg-yellow-400 rounded-full mr-2" />
																						<span>
																							Unnecessary
																							maintenance
																							resource
																							allocation
																						</span>
																					</div>
																					<div className="flex items-center">
																						<span className="w-2 h-2 bg-yellow-400 rounded-full mr-2" />
																						<span>
																							System
																							credibility
																							deterioration
																						</span>
																					</div>
																				</div>
																			</div>
																		</div>
																		<div className="mt-6 pt-4 border-t border-gray-200">
																			<div className="grid grid-cols-2 gap-4 text-center">
																				<div>
																					<div className="text-sm text-gray-600 mb-1">
																						Overall
																						Classification
																						Accuracy
																					</div>
																					<div className="text-2xl font-bold text-gray-800">
																						{(
																							((tp +
																								tn) /
																								(tp +
																									fp +
																									fn +
																									tn)) *
																							100
																						).toFixed(
																							1,
																						)}
																						%
																					</div>
																				</div>
																				<div>
																					<div className="text-sm text-gray-600 mb-1">
																						Error
																						Rate
																					</div>
																					<div className="text-2xl font-bold text-gray-800">
																						{(
																							((fp +
																								fn) /
																								(tp +
																									fp +
																									fn +
																									tn)) *
																							100
																						).toFixed(
																							1,
																						)}
																						%
																					</div>
																				</div>
																			</div>
																		</div>
																	</div>
																</div>
															</div>
														);
													})()}
												</>
											)}
										</div>
									))}
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
