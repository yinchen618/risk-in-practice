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
import { Separator } from "@/components/ui/separator";
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
	Settings,
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
	trainingMetrics?: string;
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
	evaluationMetrics?: string;
	jobId?: string;
	createdAt: string;
	completedAt?: string;
}

interface Stage3TrainingWorkbenchProps {
	experimentRun: ExperimentRun;
	onComplete: () => void;
}

interface ModelConfig {
	// PU Learning 策略
	classPrior: number; // π_p

	// 資料準備
	windowSize: number;

	// 模型架構
	modelType: string;
	hiddenSize: number;
	numLayers: number;
	activationFunction: string;
	dropout: number;

	// 訓練過程
	epochs: number;
	batchSize: number;
	optimizer: string;
	learningRate: number;
	l2Regularization: number;

	// 訓練穩定性
	earlyStopping: boolean;
	patience: number;
	learningRateScheduler: string;
}

interface DataSourceConfig {
	selectedDatasets: string[];
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
	const [modelConfig, setModelConfig] = useState<ModelConfig>({
		// PU Learning 策略
		classPrior: 0.05,

		// 資料準備
		windowSize: 60,

		// 模型架構
		modelType: "LSTM",
		hiddenSize: 128,
		numLayers: 2,
		activationFunction: "ReLU",
		dropout: 0.2,

		// 訓練過程
		epochs: 100,
		batchSize: 128,
		optimizer: "Adam",
		learningRate: 0.001,
		l2Regularization: 0.0001,

		// 訓練穩定性
		earlyStopping: true,
		patience: 10,
		learningRateScheduler: "none",
	});
	const [dataSourceConfig, setDataSourceConfig] = useState<DataSourceConfig>({
		selectedDatasets: [],
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

	// References for auto-scrolling logs
	const trainingLogRef = useRef<HTMLDivElement>(null);
	const evaluationLogRef = useRef<HTMLDivElement>(null);

	// State for training monitoring
	const [isTraining, setIsTraining] = useState(false);
	const [isEvaluating, setIsEvaluating] = useState(false);
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

	const startTraining = async () => {
		setIsTraining(true);
		setTrainingLogs([]);

		try {
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
						dataSourceConfig: JSON.stringify(dataSourceConfig),
					}),
				},
			);

			if (response.ok) {
				const newModel = await response.json();
				setTrainedModels((prev) => [...prev, newModel]);
				toast.success("Training job started successfully!");

				// Start WebSocket monitoring
				startTrainingMonitor(newModel.jobId);
			} else {
				const error = await response.json();
				toast.error(error.detail || "Failed to start training");
			}
		} catch (error) {
			console.error("Failed to start training:", error);
			toast.error("Failed to start training");
		} finally {
			setIsTraining(false);
		}
	};

	const startEvaluation = async () => {
		if (!selectedModel) {
			toast.error("Please select a trained model for evaluation");
			return;
		}

		setIsEvaluating(true);
		setEvaluationLogs([]);

		try {
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
						trainedModelId: selectedModel,
						testSetSource: JSON.stringify(evaluationDataConfig),
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

	const startTrainingMonitor = (jobId: string) => {
		// WebSocket implementation for real-time training monitoring
		console.log("Starting training monitor for job:", jobId);

		// Simulate WebSocket connection
		setTrainingWsConnected(true);

		// Mock WebSocket connection for demonstration
		const simulateTrainingProgress = () => {
			const messages = [
				"🚀 Initializing training environment...",
				"📊 Loading training data...",
				"🔧 Setting up model architecture...",
				"⚡ Starting training loop...",
				"📈 Epoch 1/100 - Loss: 0.8542, Accuracy: 0.7234",
				"📈 Epoch 10/100 - Loss: 0.4521, Accuracy: 0.8456",
				"📈 Epoch 25/100 - Loss: 0.2843, Accuracy: 0.8923",
				"📈 Epoch 50/100 - Loss: 0.1754, Accuracy: 0.9234",
				"📈 Epoch 75/100 - Loss: 0.1203, Accuracy: 0.9456",
				"📈 Epoch 100/100 - Loss: 0.0987, Accuracy: 0.9578",
				"✅ Training completed successfully!",
				"💾 Saving model checkpoint...",
				"🎯 Final metrics calculated.",
			];

			let messageIndex = 0;
			const interval = setInterval(() => {
				if (messageIndex < messages.length) {
					setTrainingLogs((prev) => [
						...prev,
						messages[messageIndex],
					]);
					messageIndex++;
				} else {
					clearInterval(interval);
					// Disconnect WebSocket when training completes
					setTrainingWsConnected(false);
					// Refresh models list after training completes
					setTimeout(loadTrainedModels, 2000);
				}
			}, 500);

			// Clean up interval when component unmounts
			return () => {
				clearInterval(interval);
				setTrainingWsConnected(false);
			};
		};

		simulateTrainingProgress();
	};

	const startEvaluationMonitor = (jobId: string) => {
		// WebSocket implementation for real-time evaluation monitoring
		console.log("Starting evaluation monitor for job:", jobId);

		// Simulate WebSocket connection
		setEvaluationWsConnected(true);

		// Mock WebSocket connection for demonstration
		const simulateEvaluationProgress = () => {
			const messages = [
				"🚀 Initializing evaluation environment...",
				"📊 Loading test dataset...",
				"🔧 Loading trained model...",
				"⚡ Starting evaluation...",
				"📊 Processing batch 1/10...",
				"📊 Processing batch 5/10...",
				"📊 Processing batch 10/10...",
				"📈 Calculating metrics...",
				"📊 Accuracy: 0.9234",
				"📊 Precision: 0.8765",
				"📊 Recall: 0.8543",
				"📊 F1-Score: 0.8652",
				"✅ Evaluation completed successfully!",
			];

			let messageIndex = 0;
			const interval = setInterval(() => {
				if (messageIndex < messages.length) {
					setEvaluationLogs((prev) => [
						...prev,
						messages[messageIndex],
					]);
					messageIndex++;
				} else {
					clearInterval(interval);
					// Disconnect WebSocket when evaluation completes
					setEvaluationWsConnected(false);
					// Refresh evaluation runs list after evaluation completes
					setTimeout(loadEvaluationRuns, 2000);
				}
			}, 400);

			// Clean up interval when component unmounts
			return () => {
				clearInterval(interval);
				setEvaluationWsConnected(false);
			};
		};

		simulateEvaluationProgress();
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
								Source Distribution
							</h3>
							<div className="space-y-1 text-sm">
								<div>
									Positive Labels:{" "}
									<Badge variant="outline">
										{experimentRun.positive_label_count ||
											0}
									</Badge>
								</div>
								<div>
									Negative Labels:{" "}
									<Badge variant="outline">
										{experimentRun.negative_label_count ||
											0}
									</Badge>
								</div>
								<div>
									Total Samples:{" "}
									<Badge variant="outline">
										{experimentRun.candidate_count || 0}
									</Badge>
								</div>
							</div>
						</div>
						<div>
							<h3 className="font-semibold mb-2">
								Experiment Status
							</h3>
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
					{/* Step 1: Experiment Configuration */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Settings className="h-4 w-4" />
								Step 1: Hyperparameter Configuration
							</CardTitle>
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

							{/* Model Configuration */}
							<Separator />
							<h4 className="font-medium">
								nnPU Hyperparameter Configuration
							</h4>

							{/* PU Learning 策略 */}
							<div className="space-y-3 p-3 border rounded-lg bg-blue-50/30">
								<h5 className="text-sm font-medium text-blue-800">
									🎯 PU Learning Strategy
								</h5>

								<div className="space-y-2">
									<Label className="text-xs">
										Class Prior (π_p):{" "}
										{modelConfig.classPrior}
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
										真實正樣本比例估計值，這是 nnPU
										最重要的參數
									</p>
								</div>
							</div>

							{/* 資料準備 */}
							<div className="space-y-3 p-3 border rounded-lg bg-green-50/30">
								<h5 className="text-sm font-medium text-green-800">
									📊 Data Preparation
								</h5>

								<div className="space-y-2">
									<Label className="text-xs">
										Window Size (時間窗口):{" "}
										{modelConfig.windowSize} minutes
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
										輸入模型的時間序列長度，需要足夠捕捉完整行為模式
									</p>
								</div>
							</div>

							{/* 模型架構 */}
							<div className="space-y-3 p-3 border rounded-lg bg-purple-50/30">
								<h5 className="text-sm font-medium text-purple-800">
									🏗️ Model Architecture
								</h5>

								<div className="grid grid-cols-2 gap-3">
									<div>
										<Label className="text-xs">
											Model Type
										</Label>
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
												<SelectItem value="GRU">
													GRU
												</SelectItem>
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
											value={
												modelConfig.activationFunction
											}
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
												<SelectItem value="Tanh">
													Tanh
												</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>

								<div className="space-y-2">
									<Label className="text-xs">
										Hidden Layer Size:{" "}
										{modelConfig.hiddenSize}
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
										Number of Layers:{" "}
										{modelConfig.numLayers}
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

							{/* 訓練過程 */}
							<div className="space-y-3 p-3 border rounded-lg bg-orange-50/30">
								<h5 className="text-sm font-medium text-orange-800">
									⚡ Training Process
								</h5>

								<div className="grid grid-cols-2 gap-3">
									<div>
										<Label className="text-xs">
											Optimizer
										</Label>
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
												<SelectItem value="SGD">
													SGD
												</SelectItem>
											</SelectContent>
										</Select>
									</div>

									<div>
										<Label className="text-xs">
											Learning Rate
										</Label>
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
										<Label className="text-xs">
											Batch Size
										</Label>
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
												<SelectItem value="32">
													32
												</SelectItem>
												<SelectItem value="64">
													64
												</SelectItem>
												<SelectItem value="128">
													128 ✅
												</SelectItem>
												<SelectItem value="256">
													256
												</SelectItem>
												<SelectItem value="512">
													512
												</SelectItem>
											</SelectContent>
										</Select>
									</div>

									<div>
										<Label className="text-xs">
											L2 Regularization
										</Label>
										<Select
											value={modelConfig.l2Regularization.toString()}
											onValueChange={(value) =>
												setModelConfig((prev) => ({
													...prev,
													l2Regularization:
														Number(value),
												}))
											}
										>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="0">
													None (0)
												</SelectItem>
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

							{/* 訓練穩定性 */}
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
									<Label
										htmlFor="early-stopping"
										className="text-xs"
									>
										Enable Early Stopping
									</Label>
								</div>

								{modelConfig.earlyStopping && (
									<div className="space-y-2 ml-6">
										<Label className="text-xs">
											Patience: {modelConfig.patience}{" "}
											epochs
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
										value={
											modelConfig.learningRateScheduler
										}
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
											<SelectItem value="none">
												None ✅
											</SelectItem>
											<SelectItem value="StepLR">
												Step LR
											</SelectItem>
											<SelectItem value="ReduceLROnPlateau">
												Reduce on Plateau
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>

							{/* Data Split Strategy */}
							<Separator />
							<div className="space-y-4">
								<div className="flex items-center gap-2">
									<BarChart3 className="h-4 w-4" />
									<h4 className="font-medium">
										Data Split Strategy
									</h4>
								</div>
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
												Test (Auto)
											</Label>
											<div className="flex items-center space-x-2">
												<div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
													<div
														className="h-full bg-slate-500 transition-all duration-300"
														style={{
															width: `${(dataSourceConfig.testRatio / 40) * 100}%`,
														}}
													/>
												</div>
												<span className="text-xs w-8">
													{dataSourceConfig.testRatio}
													%
												</span>
											</div>
										</div>
									</div>
								</div>
							</div>

							{/* Action Buttons */}
							<Separator />
							<div className="space-y-2">
								<Button
									onClick={startTraining}
									disabled={isTraining}
									className="w-full"
								>
									{isTraining ? (
										<>
											<Loader2 className="h-4 w-4 mr-2 animate-spin" />
											Starting Training...
										</>
									) : (
										<>
											<Play className="h-4 w-4 mr-2" />
											Start Model Training
										</>
									)}
								</Button>

								<div>
									<Label htmlFor="model-select">
										Select Model for Evaluation
									</Label>
									<Select
										value={selectedModel}
										onValueChange={setSelectedModel}
									>
										<SelectTrigger>
											<SelectValue placeholder="Choose a trained model" />
										</SelectTrigger>
										<SelectContent>
											{trainedModels
												.filter(
													(m) =>
														m.status ===
														"COMPLETED",
												)
												.map((model) => (
													<SelectItem
														key={model.id}
														value={model.id}
													>
														{model.name}
													</SelectItem>
												))}
										</SelectContent>
									</Select>
								</div>

								{/* Evaluation Data Configuration */}
								{selectedModel && (
									<div className="space-y-3 p-3 border rounded-lg bg-accent/20">
										<div className="flex items-center gap-2">
											<BarChart3 className="h-3 w-3" />
											<Label className="text-sm font-medium">
												Evaluation Data Source
											</Label>
										</div>

										<div>
											<Label className="text-xs">
												Test Data Source
											</Label>
											<Select
												value={
													evaluationDataConfig.testDataSource
												}
												onValueChange={(value) =>
													setEvaluationDataConfig(
														(prev) => ({
															...prev,
															testDataSource:
																value,
														}),
													)
												}
											>
												<SelectTrigger>
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="training_holdout">
														Training Holdout (
														{
															dataSourceConfig.testRatio
														}
														%)
													</SelectItem>
													<SelectItem value="fresh_data">
														Fresh Data Sample
													</SelectItem>
													<SelectItem value="custom_timerange">
														Custom Time Range
													</SelectItem>
												</SelectContent>
											</Select>
										</div>

										{evaluationDataConfig.testDataSource ===
											"fresh_data" && (
											<div>
												<Label className="text-xs">
													Sample Ratio
												</Label>
												<div className="flex items-center space-x-2">
													<Slider
														value={[
															evaluationDataConfig.customDataRatio,
														]}
														onValueChange={([
															value,
														]) =>
															setEvaluationDataConfig(
																(prev) => ({
																	...prev,
																	customDataRatio:
																		value,
																}),
															)
														}
														max={50}
														min={5}
														step={5}
														className="flex-1"
													/>
													<span className="text-xs w-8">
														{
															evaluationDataConfig.customDataRatio
														}
														%
													</span>
												</div>
											</div>
										)}
									</div>
								)}

								<Button
									onClick={startEvaluation}
									disabled={isEvaluating || !selectedModel}
									variant="outline"
									className="w-full"
								>
									{isEvaluating ? (
										<>
											<Loader2 className="h-4 w-4 mr-2 animate-spin" />
											Starting Evaluation...
										</>
									) : (
										<>
											<TrendingUp className="h-4 w-4 mr-2" />
											Start Model Evaluation
										</>
									)}
								</Button>
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
									{trainedModels.map((model) => (
										<div
											key={model.id}
											className="border rounded-lg p-3"
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
														{model.scenarioType}
													</Badge>
												</div>
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
											</div>
											<div className="text-sm text-muted-foreground mt-1">
												Created:{" "}
												{new Date(
													model.createdAt,
												).toLocaleString()}
											</div>
										</div>
									))}
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
												<div className="mt-2 p-2 bg-gray-50 rounded text-xs">
													<pre>
														{JSON.stringify(
															JSON.parse(
																run.evaluationMetrics,
															),
															null,
															2,
														)}
													</pre>
												</div>
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
