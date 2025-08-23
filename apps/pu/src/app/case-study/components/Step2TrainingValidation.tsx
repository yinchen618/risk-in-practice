import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PYTHON_API_URL } from "@/config/api";
import { useEffect, useState } from "react";
import type { ExperimentConfig } from "./experiment";
import { TrainingMonitorPanel } from "./experiment/TrainingMonitorPanel";
import { ValidationSetResultsPanel } from "./experiment/ValidationSetResultsPanel";
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
	modelName: string;
	modelType: string;
	experimentRunId: string;
	createdAt?: string;
	hyperparameters?: {
		model_type?: string;
		activation?: string;
		n_epochs?: number;
		lr?: number;
		is_batch_norm?: boolean;
		batch_size?: number;
	};
	trainingMetrics?: {
		accuracy?: number;
		precision?: number;
		recall?: number;
		f1_score?: number;
	};
	dataSourceConfig?: any;
	featureConfig?: any;
}

interface Step2TrainingValidationProps {
	selectedRunId: string | undefined;
	trainingDataStats: TrainingDataStats | null;
	trainingStage: "training" | "predicting" | "completed" | "ready";
	experimentState: ExperimentState;
	experimentConfig: ExperimentConfig | null;
	trainingMonitor: TrainingMonitorState;
	predictionState: PredictionState;
	validationResults: ValidationState;
	scenarioType: string;
	handleStartPrediction: () => void;
	onToastSuccess: (message: string) => void;
	onToastError: (message: string) => void;
	onSelectedModelChange: (modelId: string) => void;
	setTrainingMonitor: React.Dispatch<
		React.SetStateAction<TrainingMonitorState>
	>;
	setValidationResults: (value: ValidationState) => void;
	setTrainingStage: React.Dispatch<
		React.SetStateAction<"training" | "predicting" | "completed" | "ready">
	>;
	setExperimentState: React.Dispatch<React.SetStateAction<ExperimentState>>;
}

export function Step2TrainingValidation({
	selectedRunId,
	trainingDataStats,
	trainingStage,
	experimentState: _experimentState,
	experimentConfig: _experimentConfig,
	trainingMonitor,
	predictionState,
	validationResults,
	scenarioType,
	handleStartPrediction: _handleStartPrediction,
	onToastSuccess,
	onToastError,
	onSelectedModelChange,
	setTrainingMonitor,
	setValidationResults,
	setTrainingStage,
	setExperimentState,
}: Step2TrainingValidationProps) {
	const [trainedModels, setTrainedModels] = useState<TrainedModel[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isLoadingModels, setIsLoadingModels] = useState(false);
	const [modelsError, setModelsError] = useState("");
	const [selectedModelId, setSelectedModelId] = useState("");

	// 格式化函數
	const formatAlgorithm = (model: TrainedModel) => {
		if (
			model.hyperparameters?.model_type === "neural_net" ||
			model.modelType === "nnPU"
		) {
			return "NNPU";
		}
		return (
			model.modelType?.toUpperCase() ||
			model.hyperparameters?.model_type?.toUpperCase() ||
			"Unknown"
		);
	};

	const formatPSource = (model: TrainedModel) => {
		// 從數據源配置中判斷正樣本來源
		return model.dataSourceConfig?.positive_source || "Historical";
	};

	const formatUSource = (_model: TrainedModel) => {
		return "Streaming Data";
	};

	const formatMetric = (value?: number) => {
		return value ? `${(value * 100).toFixed(1)}%` : "N/A";
	};

	const formatF1Score = (value?: number) => {
		return value ? value.toFixed(3) : "N/A";
	};

	const formatDateTime = (dateString?: string) => {
		if (!dateString) {
			return "N/A";
		}
		return new Date(dateString).toLocaleDateString();
	};

	// Fetch trained models function
	const fetchTrainedModels = async () => {
		if (!selectedRunId) {
			setTrainedModels([]);
			return;
		}

		setIsLoadingModels(true);
		setModelsError("");
		try {
			const response = await fetch(
				`${PYTHON_API_URL}/api/v1/experiment-runs/${selectedRunId}/trained-models`,
			);
			if (response.ok) {
				const responseData = await response.json();
				console.log("Fetched trained models:", responseData);
				// 後端返回的數據結構是 { success: true, data: [...], message: "..." }
				const models = responseData.data || [];
				setTrainedModels(models);
			} else {
				const errorText = await response.text();
				console.error(
					"Failed to fetch trained models:",
					response.status,
					errorText,
				);
				setTrainedModels([]);
				setModelsError(
					`Failed to fetch trained models (${response.status}): ${errorText}`,
				);
			}
		} catch (error) {
			console.error("Error fetching trained models:", error);
			setTrainedModels([]);
			setModelsError("Error connecting to server");
		} finally {
			setIsLoadingModels(false);
		}
	};

	// Fetch trained models when selectedRunId changes
	useEffect(() => {
		// 只有當 selectedRunId 存在且不為空時才獲取模型
		if (selectedRunId && selectedRunId.trim() !== "") {
			fetchTrainedModels();
		} else {
			setTrainedModels([]);
			setIsLoadingModels(false);
		}
	}, [selectedRunId]);

	const handleStartTraining = async () => {
		if (!selectedRunId) {
			onToastError("Please select an experiment run first");
			return;
		}

		setIsLoading(true);
		try {
			const response = await fetch(
				`${PYTHON_API_URL}/api/v1/models/train`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						model_name: `${scenarioType}_model_${Date.now()}`,
						model_type: "nnPU",
						experiment_run_id: selectedRunId,
						dataset_id: selectedRunId, // 使用 run_id 作為 dataset_id
						scenario_type: scenarioType,
					}),
				},
			);

			if (response.ok) {
				setTrainingStage("training");
				onToastSuccess(`${scenarioType} training started`);
			} else {
				const errorData = await response.json();
				onToastError(
					`Failed to start ${scenarioType} training: ${errorData.detail || "Unknown error"}`,
				);
			}
		} catch (error) {
			console.error("Error starting training:", error);
			onToastError(`Error starting ${scenarioType} training`);
		} finally {
			setIsLoading(false);
		}
	};

	const handleModelSelect = (modelId: string) => {
		setSelectedModelId(modelId);
		onSelectedModelChange(modelId);
	};

	const isTrainingInProgress =
		trainingStage === "training" && !predictionState.isPredicting;

	return (
		<div className="space-y-6">
			{/* Step 2 Header */}
			<Card>
				<CardHeader className="pb-4">
					<CardTitle className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
						Step 2. Model Training & Validation
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Training Data Overview */}
					<div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
						<h3 className="text-lg font-medium text-blue-900 mb-3">
							Training Data Overview
						</h3>
						{trainingDataStats ? (
							<div className="grid grid-cols-3 gap-4 text-sm">
								<div className="bg-white p-3 rounded border">
									<div className="text-gray-600">
										Total Samples
									</div>
									<div className="text-xl font-semibold text-blue-800">
										{trainingDataStats.positiveSamples +
											trainingDataStats.unlabeledSamples}
									</div>
								</div>
								<div className="bg-white p-3 rounded border">
									<div className="text-gray-600">
										Positive Samples
									</div>
									<div className="text-xl font-semibold text-green-600">
										{trainingDataStats.positiveSamples}
									</div>
								</div>
								<div className="bg-white p-3 rounded border">
									<div className="text-gray-600">
										Unlabeled Samples
									</div>
									<div className="text-xl font-semibold text-orange-600">
										{trainingDataStats.unlabeledSamples}
									</div>
								</div>
							</div>
						) : (
							<p className="text-blue-700">
								Select an experiment run to view training data
								statistics.
							</p>
						)}
					</div>

					{/* Training Monitor Panel */}
					{selectedRunId && (
						<TrainingMonitorPanel
							trainingStage={trainingStage}
							trainingProgress={trainingMonitor.progress}
							currentEpoch={trainingMonitor.currentEpoch}
							totalEpochs={100}
							trainingLogs={trainingMonitor.logs}
							pSampleCount={
								trainingMonitor.sampleCounts?.positive
							}
							uSampleCount={
								trainingMonitor.sampleCounts?.unlabeled
							}
							uSampleProgress={
								trainingMonitor.sampleCounts?.unlabeledProgress
							}
							modelName={trainingMonitor.modelName}
						/>
					)}

					{/* Validation Results Panel */}
					{selectedRunId && (
						<ValidationSetResultsPanel
							validationMetrics={validationResults.metrics}
							validationSampleCount={
								validationResults.sampleCount
							}
						/>
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
													{model.modelName ||
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
																.trainingMetrics
																?.accuracy,
														)}
													</span>
												</td>
												<td className="py-2 px-3">
													<span className="text-blue-600 font-medium">
														{formatF1Score(
															model
																.trainingMetrics
																?.f1_score,
														)}
													</span>
												</td>
												<td className="py-2 px-3 text-gray-600">
													{formatDateTime(
														model.createdAt,
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
									📁 Archive Model
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
										{trainedModels.length} models
									</span>{" "}
									available
									{trainedModels.length > 0 && (
										<span className="ml-1">
											(
											{
												trainedModels.filter(
													(m) =>
														formatAlgorithm(m) ===
														"NNPU",
												).length
											}{" "}
											NNPU,{" "}
											{
												trainedModels.filter(
													(m) =>
														formatAlgorithm(m) !==
														"NNPU",
												).length
											}{" "}
											other)
										</span>
									)}
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
			{/* WebSocket Communication for Training */}
			{selectedRunId && (
				<WebSocketCommunication
					selectedRunId={selectedRunId}
					isTraining={isTrainingInProgress}
					isPredicting={false}
					socketEndpoint="training-progress"
					onTrainingProgressUpdate={(data: any) => {
						console.log("Step2 received training progress:", data);
						setTrainingMonitor((prev: TrainingMonitorState) => ({
							...prev,
							progress: data.progress,
							currentEpoch:
								data.currentEpoch || prev.currentEpoch,
							logs: data.logs || prev.logs,
						}));
					}}
					onSampleCountUpdate={(data: any) => {
						setTrainingMonitor((prev: TrainingMonitorState) => ({
							...prev,
							sampleCounts: {
								positive: data.positive,
								unlabeled: data.unlabeled,
								unlabeledProgress: data.unlabeledProgress,
							},
						}));
					}}
					onModelInfoUpdate={(data: any) => {
						setTrainingMonitor((prev: TrainingMonitorState) => ({
							...prev,
							modelName: data.modelName,
						}));
					}}
					onHyperparametersUpdate={(data: any) => {
						console.log(
							"Step2 received hyperparameters update:",
							data,
						);
						setTrainingMonitor((prev: TrainingMonitorState) => ({
							...prev,
							hyperparameters: data.hyperparameters,
						}));
					}}
					onStageUpdate={(data: any) => {
						setTrainingMonitor((prev: TrainingMonitorState) => ({
							...prev,
							currentStage: data.stage,
							currentSubstage: data.substage,
						}));
					}}
					onDataSplitInfoUpdate={(data: any) => {
						setTrainingMonitor((prev: TrainingMonitorState) => ({
							...prev,
							dataSplitInfo: data.dataSplitInfo,
						}));
					}}
					onValidationMetricsUpdate={(data: any) => {
						setValidationResults({
							...validationResults,
							metrics: data.metrics,
							sampleCount: data.sampleCount,
						});
					}}
					onTrainingComplete={(data: any) => {
						if (data.success) {
							setTrainingStage("completed");

							// Store model info for later use
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
					onPredictionProgressUpdate={() => {
						// Not handled in Step2 - handled in Step3
					}}
					onPredictionComplete={() => {
						// Not handled in Step2 - handled in Step3
					}}
					onConnectionStatusChange={(status: any) => {
						console.log(`Training WebSocket status: ${status}`);
					}}
				/>
			)}
		</div>
	);
}
