import { useState } from "react";
import { Step2TrainingValidation } from "./Step2TrainingValidation";
import { Step3PredictionResults } from "./Step3PredictionResults";
import type { DistributionShiftScenario, ExperimentConfig } from "./experiment";
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
	setTrainingStage: React.Dispatch<
		React.SetStateAction<"ready" | "training" | "completed" | "predicting">
	>;
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
				onSelectedModelChange={setSelectedModelId}
				setTrainingMonitor={setTrainingMonitor}
				setValidationResults={(value: ValidationState) =>
					setValidationResults(value)
				}
				setTrainingStage={setTrainingStage}
				setExperimentState={setExperimentState}
			/>

			{/* Step 3: Prediction Results */}
			<Step3PredictionResults
				selectedRunId={selectedRunId}
				trainingStage={trainingStage}
				predictionState={predictionState}
				selectedModelId={selectedModelId}
				setPredictionState={setPredictionState}
				onToastError={onToastError}
				onToastSuccess={onToastSuccess}
				setTrainingStage={setTrainingStage}
			/>
		</div>
	);
}
