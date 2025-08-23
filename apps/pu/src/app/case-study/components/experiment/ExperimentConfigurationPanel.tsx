import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Settings } from "lucide-react";
import {
	DataSourceConfigurationPanel,
	DataSplitStrategyPanel,
	type DistributionShiftScenario,
	DistributionShiftScenarioPanel,
	type ExperimentConfig,
	ModelParametersPanel,
	type TrainedModel,
	TrainingControlPanel,
} from "./index";

interface ExperimentConfigurationPanelProps {
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

export function ExperimentConfigurationPanel({
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
}: ExperimentConfigurationPanelProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-lg">
					<Settings className="h-5 w-5" />
					Experiment Setup
				</CardTitle>
			</CardHeader>

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
								positiveSource: experimentConfig.positiveSource,
								unlabeledSource:
									experimentConfig.unlabeledSource,
								testSource: experimentConfig.testSource,
							}}
							onChange={(config) => {
								if (experimentConfig) {
									setExperimentConfig({
										...experimentConfig,
										...config,
									});
								}
							}}
							scenario={scenarioType}
							selectedRunId={selectedRunId || ""}
							trainedModels={trainedModels}
							selectedModelId={selectedModelId}
							onModelSelect={setSelectedModelId}
						/>

						{/* Data Split Strategy - Only show for scenarios that need training */}
						{scenarioType !== "GENERALIZATION_CHALLENGE" && (
							<>
								<Separator />
								<DataSplitStrategyPanel
									splitStrategy={
										experimentConfig.splitStrategy
									}
									onChange={(splitStrategy) => {
										if (experimentConfig) {
											setExperimentConfig({
												...experimentConfig,
												splitStrategy,
											});
										}
									}}
								/>
							</>
						)}

						{/* Model Parameters - Only show for scenarios that need training */}
						{scenarioType !== "GENERALIZATION_CHALLENGE" && (
							<>
								<Separator />
								<ModelParametersPanel
									modelParams={experimentConfig.modelParams}
									onChange={(modelParams) => {
										if (experimentConfig) {
											setExperimentConfig({
												...experimentConfig,
												modelParams,
											});
										}
									}}
								/>
							</>
						)}

						<Separator />

						{/* Training Control */}
						<TrainingControlPanel
							isValid={isConfigValid}
							trainingStage={trainingStage}
							onStartTraining={onStartExperiment}
							onReset={onResetExperiment}
							wsLogs={[]}
							scenario={scenarioType}
						/>
					</>
				)}
			</CardContent>
		</Card>
	);
}
