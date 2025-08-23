import type {
	DistributionShiftScenario,
	ExperimentConfig,
	TrainedModel,
} from "./experiment";
import { ExperimentConfigurationPanel } from "./experiment/ExperimentConfigurationPanel";

interface Stage3LeftPanelProps {
	experimentConfig: ExperimentConfig | null;
	setExperimentConfig: (config: ExperimentConfig | null) => void;
	scenarioType: DistributionShiftScenario;
	setScenarioType: (type: DistributionShiftScenario) => void;
	trainedModels: TrainedModel[];
	selectedModelId: string;
	setSelectedModelId: (id: string) => void;
	selectedRunId?: string;
	isConfigValid: boolean;
	trainingStage: "ready" | "training" | "completed" | "predicting";
	onStartExperiment: () => void;
	onResetExperiment: () => void;
}

export function Stage3LeftPanel({
	experimentConfig,
	setExperimentConfig,
	scenarioType,
	setScenarioType,
	trainedModels,
	selectedModelId,
	setSelectedModelId,
	selectedRunId,
	isConfigValid,
	trainingStage,
	onStartExperiment,
	onResetExperiment,
}: Stage3LeftPanelProps) {
	return (
		<div className="col-span-1 space-y-6">
			{/* Step 1 Header */}
			<div className="border-b-2 border-blue-200 pb-2">
				<h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
					<span className="text-blue-600 font-bold">Step 1.</span>
					Hyperparameter Configuration
				</h3>
			</div>

			{/* Experiment Configuration */}
			<ExperimentConfigurationPanel
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
				onStartExperiment={onStartExperiment}
				onResetExperiment={onResetExperiment}
			/>
		</div>
	);
}
