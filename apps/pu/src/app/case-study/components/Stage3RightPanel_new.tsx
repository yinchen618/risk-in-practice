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
	// 選中的模型 ID 狀態
	const [selectedModelId, setSelectedModelId] = useState<string>("");

	return (
		<div className="col-span-2 space-y-6">
			{/* Step 2: Model Training & Validation */}
			<Step2TrainingValidation
				selectedRunId={selectedRunId}
				trainingDataStats={trainingDataStats}
				trainingStage={trainingStage}
				experimentState={experimentState}
				experimentConfig={experimentConfig}
				trainingMonitor={trainingMonitor}
				predictionState={predictionState}
				validationResults={validationResults}
				scenarioType={scenarioType}
				handleStartPrediction={handleStartPrediction}
				onToastSuccess={onToastSuccess}
				onToastError={onToastError}
			/>

			{/* Step 3: Prediction Results */}
			<Step3PredictionResults
				selectedRunId={selectedRunId}
				trainingStage={trainingStage}
				predictionState={predictionState}
				selectedModelId={selectedModelId}
				setPredictionState={setPredictionState}
				onToastError={onToastError}
			/>

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
