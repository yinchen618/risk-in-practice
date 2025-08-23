import { useEffect, useState } from "react";
import type { DistributionShiftScenario, ExperimentConfig } from "./experiment";
import { Step2TrainingValidation } from "./Step2TrainingValidation";
import { Step3PredictionResults } from "./Step3PredictionResults";
import { WebSocketCommunication } from "./experiment/WebSocketCommunication";
import type {
	ExperimentState,
	PredictionState,
	TrainingMonitorState,
	ValidationState,
} from "./experiment/hooks/";

interface TrainingDataStats {
	positiveSamples: number;
	unlabeledSamples: number;
}

interface TrainedModel {
	id: string;
	name: string;
	scenario_type: string;
	status: string;
	experiment_run_id: string;
	model_config: {
		model_type?: string;
		activation?: string;
		n_epochs?: number;
		lr?: number;
		is_batch_norm?: boolean;
		batch_size?: number;
		[key: string]: any;
	};
	data_source_config: {
		p_source?: {
			type: string;
			description?: string;
			time_range?: {
				start_date: string;
				end_date: string;
			};
			building_floors?: Record<string, any>;
		};
		u_source?: {
			type: string;
			description?: string;
			time_range?: {
				start_date: string;
				end_date: string;
			};
			building_floors?: Record<string, any>;
		};
		prediction_config?: {
			start_date?: string;
			end_date?: string;
		};
	};
	model_path?: string;
	training_metrics?: {
		accuracy?: number;
		precision?: number;
		recall?: number;
		f1_score?: number;
		test_accuracy?: number;
		test_f1?: number;
		confusion_matrix?: number[][];
		[key: string]: any;
	};
	created_at: string;
	completed_at?: string;
}

interface EvaluationResult {
	id: string;
	name: string;
	scenario_type: string;
	status: string;
	trained_model_id: string;
	test_set_source: {
		type?: string;
		description?: string;
		time_range?: {
			start_date: string;
			end_date: string;
		};
		building_floors?: Record<string, any>;
	};
	evaluation_metrics: {
		accuracy?: number;
		precision?: number;
		recall?: number;
		f1_score?: number;
		[key: string]: any;
	};
	created_at: string;
	completed_at?: string;
	model_name: string;
	model_config: Record<string, any>;
	data_source_config: Record<string, any>;
	predictions_count: number;
	accuracy: number;
	precision: number;
	recall: number;
	f1_score: number;
}

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

interface Stage3RightPanelProps {
	selectedRunId?: string;
	trainingDataStats: TrainingDataStats | null;
	trainingStage: "ready" | "training" | "completed" | "predicting";
	experimentState: ExperimentState;
	experimentConfig: ExperimentConfig | null;
	trainingMonitor: TrainingMonitorState;
	predictionState: PredictionState;
	validationResults: ValidationState;
	scenarioType: DistributionShiftScenario;
	setTrainingMonitor: (
		value: React.SetStateAction<TrainingMonitorState>,
	) => void;
	setPredictionState: (value: React.SetStateAction<PredictionState>) => void;
	setValidationResults: (value: ValidationState) => void;
	setTrainingStage: (
		stage: "ready" | "training" | "completed" | "predicting",
	) => void;
	setExperimentState: (value: React.SetStateAction<ExperimentState>) => void;
	handleStartPrediction: () => void;
	onToastSuccess: (message: string) => void;
	onToastError: (message: string) => void;
}

export function Stage3RightPanel({
	selectedRunId,
	trainingDataStats,
	trainingStage,
	experimentState,
	experimentConfig,
	trainingMonitor,
	predictionState,
	validationResults,
	scenarioType,
	setTrainingMonitor,
	setPredictionState,
	setValidationResults,
	setTrainingStage,
	setExperimentState,
	handleStartPrediction,
	onToastSuccess,
	onToastError,
}: Stage3RightPanelProps) {
	// 模型數據狀態
	const [trainedModels, setTrainedModels] = useState<TrainedModel[]>([]);
	const [selectedModelId, setSelectedModelId] = useState<string>("");
	const [isLoadingModels, setIsLoadingModels] = useState(false);
	const [modelsError, setModelsError] = useState<string>("");

	// 評估結果狀態
	const [evaluationResults, setEvaluationResults] = useState<
		EvaluationResult[]
	>([]);
	const [isLoadingEvaluations, setIsLoadingEvaluations] = useState(false);
	const [evaluationsError, setEvaluationsError] = useState<string>("");

	// 載入訓練模型數據
	const fetchTrainedModels = async () => {
		if (!selectedRunId) {
			return;
		}

		setIsLoadingModels(true);
		setModelsError("");

		try {
			const response = await fetch(
				`http://localhost:8000/api/v1/models/experiment/${selectedRunId}`,
			);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			console.log("Fetched trained models:", data);

			setTrainedModels(data.data?.models || []);

			// 自動選擇第一個模型
			if (data.data?.models && data.data.models.length > 0) {
				setSelectedModelId(data.data.models[0].id);
			}
		} catch (error) {
			console.error("Error fetching trained models:", error);
			setModelsError("Failed to load trained models");
			onToastError("Failed to load trained models");
		} finally {
			setIsLoadingModels(false);
		}
	};

	// 載入評估結果數據
	const fetchEvaluationResults = async (modelId: string) => {
		if (!modelId) {
			setEvaluationResults([]);
			return;
		}

		setIsLoadingEvaluations(true);
		setEvaluationsError("");

		try {
			const response = await fetch(
				`http://localhost:8000/api/v1/models/${modelId}/evaluations`,
			);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			console.log("Fetched evaluation results:", data);

			setEvaluationResults(data.data?.evaluations || []);
		} catch (error) {
			console.error("Error fetching evaluation results:", error);
			setEvaluationsError("Failed to load evaluation results");
			onToastError("Failed to load evaluation results");
		} finally {
			setIsLoadingEvaluations(false);
		}
	};

	// 當 selectedRunId 變化時重新載入數據
	useEffect(() => {
		fetchTrainedModels();
	}, [selectedRunId]);

	// 當 selectedModelId 變化時重新載入評估結果
	useEffect(() => {
		if (selectedModelId) {
			fetchEvaluationResults(selectedModelId);
		} else {
			setEvaluationResults([]);
		}
	}, [selectedModelId]);

	// 格式化P源和U源描述
	const formatPSource = (model: TrainedModel): string => {
		const pSource = model.data_source_config?.p_source;
		if (!pSource) {
			return "Unknown";
		}

		if (pSource.type === "anomaly_events") {
			return "Anomaly Events";
		}
		return pSource.description || pSource.type || "Unknown";
	};

	const formatUSource = (model: TrainedModel): string => {
		const uSource = model.data_source_config?.u_source;
		if (!uSource) {
			return "Unknown";
		}

		if (uSource.type === "dynamic_generation") {
			const timeRange = uSource.time_range;
			const buildings = uSource.building_floors;

			if (timeRange && buildings) {
				const buildingNames = Object.keys(buildings);
				return `Dynamic (${timeRange.start_date} - ${timeRange.end_date}, ${buildingNames.length} buildings)`;
			}
			return "Dynamic Generation";
		}
		if (uSource.type === "anomaly_events") {
			return "Anomaly Events";
		}
		return uSource.description || uSource.type || "Unknown";
	};

	// 格式化模型算法
	const formatAlgorithm = (model: TrainedModel): string => {
		const modelType = model.model_config?.model_type;
		if (!modelType) {
			return "Unknown";
		}

		return modelType.toUpperCase();
	};

	// 格式化指標
	const formatMetric = (value: number | undefined): string => {
		if (value === undefined || value === null) {
			return "-";
		}
		return `${(value * 100).toFixed(1)}%`;
	};

	const formatF1Score = (value: number | undefined): string => {
		if (value === undefined || value === null) {
			return "-";
		}
		return value.toFixed(3);
	};

	// 格式化時間
	const formatDateTime = (dateString: string): string => {
		try {
			const date = new Date(dateString);
			return date.toLocaleString("zh-TW", {
				year: "numeric",
				month: "2-digit",
				day: "2-digit",
				hour: "2-digit",
				minute: "2-digit",
			});
		} catch {
			return dateString;
		}
	};
	return (
		<div className="col-span-2 space-y-6">
			{/* Step 2 Header */}
			<div className="border-b-2 border-green-200 pb-2">
				<h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
					<span className="text-green-600 font-bold">Step 2.</span>
					Model Training & Validation
				</h3>
			</div>

			{/* Training Data Overview */}
			{trainingDataStats && (
				<Card>
					<CardHeader>
						<CardTitle className="text-lg">
							Training Data Overview
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-3 gap-4 text-sm">
							<div>
								<div className="text-muted-foreground font-medium">
									Total Samples
								</div>
								<p className="text-xl font-bold">
									{trainingDataStats.positiveSamples +
										trainingDataStats.unlabeledSamples}
								</p>
							</div>
							<div>
								<div className="text-muted-foreground font-medium">
									Positive Samples
								</div>
								<p className="text-xl font-bold text-green-600">
									{trainingDataStats.positiveSamples}
								</p>
							</div>
							<div>
								<div className="text-muted-foreground font-medium">
									Unlabeled Samples
								</div>
								<p className="text-xl font-bold text-blue-600">
									{trainingDataStats.unlabeledSamples}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Status Row: Experiment Status & WebSocket Status */}
			<div className="grid grid-cols-2 gap-4">
				{/* Experiment Status Summary */}
				<Card>
					<CardHeader>
						<CardTitle className="text-lg flex items-center gap-2">
							<div
								className={`w-3 h-3 rounded-full ${
									trainingStage === "training"
										? "bg-blue-500 animate-pulse"
										: trainingStage === "predicting"
											? "bg-orange-500 animate-pulse"
											: trainingStage === "completed"
												? "bg-green-500"
												: "bg-gray-400"
								}`}
							/>
							Experiment Status
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-2 text-sm">
							<div className="flex justify-between">
								<span>Current Stage:</span>
								<span className="font-medium capitalize">
									{trainingStage}
								</span>
							</div>
							{experimentState.currentModelId && (
								<div className="flex justify-between">
									<span>Model ID:</span>
									<span className="font-mono text-xs">
										{experimentState.currentModelId.slice(
											-8,
										)}
									</span>
								</div>
							)}
							{trainingMonitor.currentEpoch > 0 && (
								<div className="flex justify-between">
									<span>Training Progress:</span>
									<span>
										{trainingMonitor.currentEpoch}/
										{experimentConfig?.modelParams
											?.epochs ||
											DEFAULT_MODEL_PARAMS.epochs}{" "}
										epochs
									</span>
								</div>
							)}
						</div>
					</CardContent>
				</Card>

				{/* WebSocket Communication Status */}
				<Card className="border-purple-200 bg-purple-50/50">
					<CardHeader>
						<CardTitle className="text-lg flex items-center gap-2 text-purple-700">
							<div
								className={`w-3 h-3 rounded-full ${
									(
										trainingStage === "training" &&
											!predictionState.isPredicting
									) ||
									(
										trainingStage === "predicting" &&
											predictionState.isPredicting
									)
										? "bg-green-500 animate-pulse"
										: "bg-gray-400"
								}`}
							/>
							WebSocket Status
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-sm text-gray-600">
							{trainingStage === "training" &&
								!predictionState.isPredicting &&
								"🔗 Connected to training monitor"}
							{trainingStage === "predicting" &&
								predictionState.isPredicting &&
								"🔗 Connected to prediction monitor"}
							{!(
								(trainingStage === "training" &&
									!predictionState.isPredicting) ||
								(trainingStage === "predicting" &&
									predictionState.isPredicting)
							) && "⏸️ WebSocket inactive"}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Training Section */}
			<Card className="border-blue-200 bg-blue-50/50">
				<CardHeader>
					<CardTitle className="text-lg flex items-center gap-2 text-blue-700">
						<div
							className={`w-3 h-3 rounded-full ${
								trainingStage === "training"
									? "bg-blue-500 animate-pulse"
									: trainingStage === "completed"
										? "bg-green-500"
										: "bg-gray-400"
							}`}
						/>
						Training Section
					</CardTitle>
				</CardHeader>
				<CardContent>
					{trainingStage === "training" &&
					!predictionState.isPredicting ? (
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
							uSampleCount={
								trainingMonitor.sampleCounts.unlabeled
							}
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
					) : (
						<div className="text-sm text-gray-600 p-4">
							{trainingStage === "ready" &&
								"Ready to start training..."}
							{trainingStage === "completed" &&
								"Training completed successfully!"}
							{trainingStage === "predicting" &&
								"Training completed, now predicting..."}
						</div>
					)}

					{/* Real-time Validation Results - Always show if available */}
					{validationResults.metrics && (
						<div className="mt-4">
							<ValidationSetResultsPanel
								validationMetrics={validationResults.metrics}
								validationSampleCount={
									validationResults.sampleCount
								}
							/>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Trained Models Table */}
			<Card className="border-indigo-200 bg-indigo-50/50">
				<CardHeader>
					<CardTitle className="text-lg flex items-center gap-2 text-indigo-700">
						<div className="w-3 h-3 rounded-full bg-indigo-500" />
						Trained Models
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{/* Models Table */}
						<div className="overflow-x-auto">
							<table className="w-full text-sm">
								<thead>
									<tr className="border-b border-indigo-200">
										<th className="text-left py-2 px-3 font-medium text-indigo-800">
											Select
										</th>
										<th className="text-left py-2 px-3 font-medium text-indigo-800">
											Model ID
										</th>
										<th className="text-left py-2 px-3 font-medium text-indigo-800">
											Algorithm
										</th>
										<th className="text-left py-2 px-3 font-medium text-indigo-800">
											P Source
										</th>
										<th className="text-left py-2 px-3 font-medium text-indigo-800">
											U Source
										</th>
										<th className="text-left py-2 px-3 font-medium text-indigo-800">
											Accuracy
										</th>
										<th className="text-left py-2 px-3 font-medium text-indigo-800">
											F1 Score
										</th>
										<th className="text-left py-2 px-3 font-medium text-indigo-800">
											Created
										</th>
									</tr>
								</thead>
								<tbody>
									{isLoadingModels ? (
										// 載入中的動畫
										Array.from({ length: 3 }).map(
											(_, index) => (
												<tr
													key={`loading-${index}`}
													className="border-b border-indigo-100"
												>
													<td className="py-2 px-3">
														<div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
													</td>
													<td className="py-2 px-3">
														<div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
													</td>
													<td className="py-2 px-3">
														<div className="h-6 bg-gray-200 rounded animate-pulse w-12" />
													</td>
													<td className="py-2 px-3">
														<div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
													</td>
													<td className="py-2 px-3">
														<div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
													</td>
													<td className="py-2 px-3">
														<div className="h-4 bg-gray-200 rounded animate-pulse w-12" />
													</td>
													<td className="py-2 px-3">
														<div className="h-4 bg-gray-200 rounded animate-pulse w-12" />
													</td>
													<td className="py-2 px-3">
														<div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
													</td>
												</tr>
											),
										)
									) : modelsError ? (
										// 錯誤狀態
										<tr>
											<td
												colSpan={8}
												className="py-8 px-3 text-center text-red-600"
											>
												<div className="flex flex-col items-center gap-2">
													<span>
														❌ {modelsError}
													</span>
													<button
														type="button"
														onClick={
															fetchTrainedModels
														}
														className="text-sm bg-red-100 hover:bg-red-200 px-3 py-1 rounded text-red-700"
													>
														Retry
													</button>
												</div>
											</td>
										</tr>
									) : trainedModels.length === 0 ? (
										// 無數據狀態
										<tr>
											<td
												colSpan={8}
												className="py-8 px-3 text-center text-gray-500"
											>
												No trained models found for this
												experiment run.
											</td>
										</tr>
									) : (
										// 實際數據
										trainedModels.map((model) => (
											<tr
												key={model.id}
												className="border-b border-indigo-100 hover:bg-indigo-25"
											>
												<td className="py-2 px-3">
													<input
														type="radio"
														name="selectedModel"
														value={model.id}
														checked={
															selectedModelId ===
															model.id
														}
														onChange={(e) =>
															setSelectedModelId(
																e.target.value,
															)
														}
														className="text-indigo-600 focus:ring-indigo-500"
													/>
												</td>
												<td className="py-2 px-3 font-mono text-xs">
													{model.name ||
														model.id.slice(-8)}
												</td>
												<td className="py-2 px-3">
													<span
														className={`px-2 py-1 rounded text-xs font-medium ${
															formatAlgorithm(
																model,
															) === "NNPU"
																? "bg-blue-100 text-blue-800"
																: "bg-purple-100 text-purple-800"
														}`}
													>
														{formatAlgorithm(model)}
													</span>
												</td>
												<td className="py-2 px-3 text-gray-600">
													<span className="text-xs">
														{formatPSource(model)}
													</span>
												</td>
												<td className="py-2 px-3 text-gray-600">
													<span className="text-xs">
														{formatUSource(model)}
													</span>
												</td>
												<td className="py-2 px-3">
													<span className="text-green-600 font-medium">
														{formatMetric(
															model
																.training_metrics
																?.accuracy,
														)}
													</span>
												</td>
												<td className="py-2 px-3">
													<span className="text-blue-600 font-medium">
														{formatF1Score(
															model
																.training_metrics
																?.f1_score,
														)}
													</span>
												</td>
												<td className="py-2 px-3 text-gray-600">
													{formatDateTime(
														model.created_at,
													)}
												</td>
											</tr>
										))
									)}
								</tbody>
							</table>
						</div>

						{/* Action Buttons */}
						<div className="flex items-center justify-between bg-white rounded border border-indigo-200 p-4">
							<div className="flex gap-3">
								<button
									type="button"
									className="bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
									disabled={trainingStage === "predicting"}
								>
									Execute Evaluation
								</button>
								<button
									type="button"
									className="bg-slate-500 hover:bg-slate-600 text-white px-4 py-2 rounded font-medium transition-colors"
								>
									�Archive Model
								</button>
							</div>
							<div className="text-sm text-gray-600">
								Select a model above to enable actions
							</div>
						</div>

						{/* Empty state when no models */}
						{/* Uncomment when implementing actual data loading
						{trainedModels.length === 0 && (
							<div className="text-center py-8 text-gray-500">
								<div className="mb-2">📊</div>
								<p>No trained models found for this experiment run.</p>
								<p className="text-xs mt-1">Complete training to see models here.</p>
							</div>
						)}
						*/}

						{/* Summary info */}
						<div className="bg-white rounded border border-indigo-200 p-3">
							<div className="flex items-center justify-between text-sm">
								<div className="text-gray-600">
									<span className="font-medium">
										3 models
									</span>{" "}
									available (nnPU: 2, uPU: 1)
								</div>
								<div className="text-indigo-600 text-xs">
									💡 Select a model and use buttons below to
									take actions
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Step 3 Header */}
			<div className="border-b-2 border-purple-200 pb-2">
				<h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
					<span className="text-purple-600 font-bold">Step 3.</span>
					Prediction Results
				</h3>
			</div>

			{/* Prediction Section */}
			<Card className="border-orange-200 bg-orange-50/50">
				<CardHeader>
					<CardTitle className="text-lg flex items-center gap-2 text-orange-700">
						<div
							className={`w-3 h-3 rounded-full ${
								trainingStage === "predicting"
									? "bg-orange-500 animate-pulse"
									: trainingStage === "completed"
										? "bg-green-500"
										: "bg-gray-400"
							}`}
						/>
						Prediction Section
					</CardTitle>
				</CardHeader>
				<CardContent>
					{trainingStage === "predicting" &&
					predictionState.showPredictionMonitor ? (
						<PredictionMonitorPanel
							predictionProgress={
								predictionState.progress.progress
							}
							currentStep={predictionState.progress.currentStep}
							totalSteps={predictionState.progress.totalSteps}
							stage={predictionState.progress.stage}
							message={predictionState.progress.message}
							onClose={() => {
								setPredictionState((prev: PredictionState) => ({
									...prev,
									isPredicting: false,
									showPredictionMonitor: false,
								}));
							}}
						/>
					) : (
						<div className="text-sm text-gray-600 p-4">
							{trainingStage === "ready" &&
								"Complete training first to start prediction..."}
							{trainingStage === "training" &&
								"Training in progress..."}
							{trainingStage === "completed" &&
								"Ready for prediction!"}
						</div>
					)}
				</CardContent>
			</Card>

			{/* Evaluation Results Table */}
			<Card className="border-emerald-200 bg-emerald-50/50">
				<CardHeader>
					<CardTitle className="text-lg flex items-center gap-2 text-emerald-700">
						<div className="w-3 h-3 rounded-full bg-emerald-500" />
						Evaluation Results
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{/* Evaluation Runs Table */}
						<div className="overflow-x-auto">
							<table className="w-full text-sm">
								<thead>
									<tr className="border-b border-emerald-200">
										<th className="text-left py-2 px-3 font-medium text-emerald-800">
											Evaluation ID
										</th>
										<th className="text-left py-2 px-3 font-medium text-emerald-800">
											Model Used
										</th>
										<th className="text-left py-2 px-3 font-medium text-emerald-800">
											Scenario Type
										</th>
										<th className="text-left py-2 px-3 font-medium text-emerald-800">
											Test Set Source
										</th>
										<th className="text-left py-2 px-3 font-medium text-emerald-800">
											Status
										</th>
										<th className="text-left py-2 px-3 font-medium text-emerald-800">
											Predictions Count
										</th>
										<th className="text-left py-2 px-3 font-medium text-emerald-800">
											Accuracy
										</th>
										<th className="text-left py-2 px-3 font-medium text-emerald-800">
											Completed At
										</th>
									</tr>
								</thead>
								<tbody>
									{isLoadingEvaluations ? (
										<tr>
											<td
												colSpan={8}
												className="py-8 text-center"
											>
												<div className="flex items-center justify-center space-x-2">
													<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-500" />
													<span className="text-gray-600">
														Loading evaluation
														results...
													</span>
												</div>
											</td>
										</tr>
									) : evaluationsError ? (
										<tr>
											<td
												colSpan={8}
												className="py-8 text-center"
											>
												<div className="text-red-600">
													<p className="font-medium">
														Error loading evaluation
														results
													</p>
													<p className="text-sm mt-1">
														{evaluationsError}
													</p>
												</div>
											</td>
										</tr>
									) : evaluationResults.length === 0 ? (
										<tr>
											<td
												colSpan={8}
												className="py-8 text-center text-gray-500"
											>
												{selectedModelId ? (
													<div>
														<p className="font-medium">
															No evaluation
															results found
														</p>
														<p className="text-xs mt-1">
															This model has not
															been evaluated yet.
														</p>
													</div>
												) : (
													<div>
														<p className="font-medium">
															Select a model to
															view evaluation
															results
														</p>
														<p className="text-xs mt-1">
															Choose a trained
															model from the table
															above.
														</p>
													</div>
												)}
											</td>
										</tr>
									) : (
										evaluationResults.map((evaluation) => (
											<tr
												key={evaluation.id}
												className="border-b border-emerald-100 hover:bg-emerald-25"
											>
												<td className="py-2 px-3 font-mono text-xs">
													{evaluation.id.substring(
														0,
														8,
													)}
													...
												</td>
												<td className="py-2 px-3 font-mono text-xs">
													{evaluation.trained_model_id.substring(
														0,
														8,
													)}
													...
												</td>
												<td className="py-2 px-3">
													<span
														className={`px-2 py-1 rounded text-xs font-medium ${
															evaluation.scenario_type ===
															"DISTRIBUTION_SHIFT"
																? "bg-blue-100 text-blue-800"
																: evaluation.scenario_type ===
																		"CONCEPT_DRIFT"
																	? "bg-purple-100 text-purple-800"
																	: evaluation.scenario_type ===
																			"DOMAIN_ADAPTATION"
																		? "bg-orange-100 text-orange-800"
																		: evaluation.scenario_type ===
																				"GENERALIZATION_CHALLENGE"
																			? "bg-green-100 text-green-800"
																			: "bg-gray-100 text-gray-800"
														}`}
													>
														{evaluation.scenario_type.replace(
															"_",
															" ",
														)}
													</span>
												</td>
												<td className="py-2 px-3 text-gray-600">
													<span className="text-xs">
														{evaluation
															.test_set_source
															.description ||
															evaluation
																.test_set_source
																.type ||
															"Test Dataset"}
													</span>
												</td>
												<td className="py-2 px-3">
													<span
														className={`px-2 py-1 rounded text-xs font-medium ${
															evaluation.status ===
															"COMPLETED"
																? "bg-green-100 text-green-800"
																: evaluation.status ===
																		"RUNNING"
																	? "bg-yellow-100 text-yellow-800"
																	: evaluation.status ===
																			"FAILED"
																		? "bg-red-100 text-red-800"
																		: "bg-gray-100 text-gray-800"
														}`}
													>
														{evaluation.status}
													</span>
												</td>
												<td className="py-2 px-3 text-center">
													{evaluation.predictions_count.toLocaleString()}
												</td>
												<td className="py-2 px-3">
													{evaluation.status ===
													"COMPLETED" ? (
														<span className="text-green-600 font-medium">
															{(
																evaluation.accuracy *
																100
															).toFixed(1)}
															%
														</span>
													) : (
														<span className="text-gray-400">
															-
														</span>
													)}
												</td>
												<td className="py-2 px-3 text-gray-600">
													{evaluation.completed_at
														? new Date(
																evaluation.completed_at,
															).toLocaleDateString(
																"zh-TW",
																{
																	year: "numeric",
																	month: "2-digit",
																	day: "2-digit",
																	hour: "2-digit",
																	minute: "2-digit",
																},
															)
														: "-"}
												</td>
											</tr>
										))
									)}
								</tbody>
							</table>
						</div>

						{/* Evaluation Summary */}
						<div className="bg-white rounded border border-emerald-200 p-4">
							<div className="grid grid-cols-3 gap-4 text-sm">
								<div className="text-center">
									<div className="text-2xl font-bold text-emerald-600">
										3
									</div>
									<div className="text-gray-600">
										Total Evaluations
									</div>
								</div>
								<div className="text-center">
									<div className="text-2xl font-bold text-green-600">
										2
									</div>
									<div className="text-gray-600">
										Completed
									</div>
								</div>
								<div className="text-center">
									<div className="text-2xl font-bold text-orange-600">
										1
									</div>
									<div className="text-gray-600">Running</div>
								</div>
							</div>
							<div className="mt-3 pt-3 border-t border-emerald-200">
								<div className="text-xs text-emerald-600 text-center">
									📊 Each evaluation tests model performance
									on different test sets
								</div>
							</div>
						</div>

						{/* Empty state when no evaluations */}
						{/* Uncomment when implementing actual data loading
						{evaluationRuns.length === 0 && (
							<div className="text-center py-8 text-gray-500">
								<div className="mb-2">🔍</div>
								<p>No evaluation runs found.</p>
								<p className="text-xs mt-1">Start prediction to generate evaluation results.</p>
							</div>
						)}
						*/}
					</div>
				</CardContent>
			</Card>

			{/* WebSocket Communication - Always Active and Visible */}
			<WebSocketCommunication
				selectedRunId={selectedRunId}
				isTraining={
					trainingStage === "training" &&
					!predictionState.isPredicting
				}
				isPredicting={
					trainingStage === "predicting" &&
					predictionState.isPredicting
				}
				socketEndpoint={
					trainingStage === "training"
						? "training-progress"
						: "evaluation-progress"
				}
				onTrainingProgressUpdate={(data) => {
					console.log(
						"Stage3RightPanel received training progress:",
						data,
					);
					setTrainingMonitor((prev: TrainingMonitorState) => ({
						...prev,
						progress: data.progress,
						currentEpoch: data.currentEpoch || prev.currentEpoch,
						logs: data.logs || prev.logs,
					}));
					console.log(
						"Updated training logs, count:",
						data.logs?.length || 0,
					);
				}}
				onSampleCountUpdate={(data) => {
					setTrainingMonitor((prev: TrainingMonitorState) => ({
						...prev,
						sampleCounts: {
							positive: data.positive,
							unlabeled: data.unlabeled,
							unlabeledProgress: data.unlabeledProgress,
						},
					}));
				}}
				onModelInfoUpdate={(data) => {
					setTrainingMonitor((prev: TrainingMonitorState) => ({
						...prev,
						modelName: data.modelName,
					}));
				}}
				onHyperparametersUpdate={(data) => {
					console.log(
						"Stage3RightPanel received hyperparameters update:",
						data,
					);
					setTrainingMonitor((prev: TrainingMonitorState) => ({
						...prev,
						hyperparameters: data.hyperparameters,
					}));
					console.log(
						"Updated trainingMonitor.hyperparameters to:",
						data.hyperparameters,
					);
				}}
				onStageUpdate={(data) => {
					setTrainingMonitor((prev: TrainingMonitorState) => ({
						...prev,
						currentStage: data.stage,
						currentSubstage: data.substage,
					}));
				}}
				onDataSplitInfoUpdate={(data) => {
					setTrainingMonitor((prev: TrainingMonitorState) => ({
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
				onPredictionProgressUpdate={(data) => {
					console.log(
						"Stage3RightPanel received prediction progress:",
						data,
					);
					setPredictionState((prev: PredictionState) => ({
						...prev,
						progress: {
							progress: data.progress,
							currentStep: data.currentStep || 0,
							totalSteps: data.totalSteps || 100,
							stage: data.stage || "",
							message: data.message || "",
						},
					}));
				}}
				onTrainingComplete={(data) => {
					if (data.success) {
						setTrainingStage("completed");

						// Store model info for later use (accessible in Stage 4)
						setExperimentState((prev: ExperimentState) => ({
							...prev,
							currentModelId:
								data.modelId || data.modelPath || "",
						}));

						onToastSuccess(
							`${scenarioType} training completed successfully! Proceed to Stage 4 for results analysis.`,
						);
					} else {
						setTrainingStage("ready");
						onToastError(`${scenarioType} training failed`);
					}
				}}
				onPredictionComplete={(data) => {
					console.log(
						"Stage3RightPanel received prediction complete:",
						data,
					);

					if (data.success) {
						setTrainingStage("completed");

						// Update final progress state
						setPredictionState((prev: PredictionState) => ({
							...prev,
							progress: {
								progress: 100,
								currentStep: 100,
								totalSteps: 100,
								stage: "completed",
								message: "Prediction completed successfully!",
							},
						}));

						onToastSuccess(
							"Prediction completed! Proceed to Stage 4 to analyze results.",
						);
					} else {
						setTrainingStage("ready");

						const errorMessage = data.error
							? `Prediction failed: ${data.error}`
							: "Prediction failed";
						onToastError(errorMessage);
					}
				}}
				onConnectionStatusChange={(status) => {
					console.log(`WebSocket status: ${status}`);

					if (
						status === "disconnected" &&
						predictionState.isPredicting
					) {
						console.log("WebSocket disconnected during prediction");
						setPredictionState((prev: PredictionState) => ({
							...prev,
							progress: {
								...prev.progress,
								progress: 100,
								stage: "failed",
								message: "Connection lost during prediction",
							},
						}));
					}
				}}
			/>
		</div>
	);
}
