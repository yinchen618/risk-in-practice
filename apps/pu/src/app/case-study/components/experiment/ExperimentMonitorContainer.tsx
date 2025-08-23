import { PredictionMonitorPanel } from "./PredictionMonitorPanel";
import { TrainingMonitorPanel } from "./TrainingMonitorPanel";
import { ValidationSetResultsPanel } from "./ValidationSetResultsPanel";
import type {
	PredictionState,
	TrainingMonitorState,
	ValidationState,
} from "./hooks/useExperimentState";

interface ExperimentMonitorContainerProps {
	trainingStage: "ready" | "training" | "completed" | "predicting";
	isPredicting: boolean;
	showPredictionMonitor: boolean;
	trainingMonitor: TrainingMonitorState;
	predictionProgress: PredictionState["progress"];
	validationResults: ValidationState;
	totalEpochs: number;
	onStartPrediction: () => void;
	onClosePredictionMonitor: () => void;
}

export function ExperimentMonitorContainer({
	trainingStage,
	isPredicting,
	showPredictionMonitor,
	trainingMonitor,
	predictionProgress,
	validationResults,
	totalEpochs,
	onStartPrediction,
	onClosePredictionMonitor,
}: ExperimentMonitorContainerProps) {
	if (trainingStage !== "training" && trainingStage !== "predicting") {
		return null;
	}

	return (
		<div className="space-y-4">
			{/* Training Monitor - Only during actual training */}
			{trainingStage === "training" && !isPredicting && (
				<div className="space-y-4">
					<TrainingMonitorPanel
						trainingStage={trainingStage}
						trainingProgress={trainingMonitor.progress}
						currentEpoch={trainingMonitor.currentEpoch}
						totalEpochs={totalEpochs}
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
						onStartPrediction={onStartPrediction}
					/>

					{/* Real-time Validation Results - Only show if we have validation metrics */}
					{validationResults.metrics && (
						<ValidationSetResultsPanel
							validationMetrics={validationResults.metrics}
							validationSampleCount={
								validationResults.sampleCount
							}
						/>
					)}
				</div>
			)}

			{/* Prediction Monitor - Only during evaluation */}
			{trainingStage === "predicting" && showPredictionMonitor && (
				<PredictionMonitorPanel
					predictionProgress={predictionProgress.progress}
					currentStep={predictionProgress.currentStep}
					totalSteps={predictionProgress.totalSteps}
					stage={predictionProgress.stage}
					message={predictionProgress.message}
					onClose={onClosePredictionMonitor}
				/>
			)}
		</div>
	);
}
