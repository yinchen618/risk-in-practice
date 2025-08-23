import { SampleDistributionPanel } from "./SampleDistributionPanel";
import { TestSetResultsPanel } from "./TestSetResultsPanel";
import { TrainingDataStatsPanel } from "./TrainingDataStatsPanel";
import { ValidationSetResultsPanel } from "./ValidationSetResultsPanel";
import {
	ExperimentComparisonView,
	type ExperimentResult,
	ExperimentResultsPanel,
} from "./index";

interface ExperimentResultsContainerProps {
	experimentResults: ExperimentResult[];
	selectedExperiments: string[];
	selectedExperimentForDetail: string;
	insights: string;
	showComparison: boolean;
	trainingStage: "ready" | "training" | "completed" | "predicting";
	currentModelId: string;
	trainingDataStats: any;
	sampleDistribution: any;
	isLoadingVisualization: boolean;
	onExperimentSelect: (id: string) => void;
	onExperimentDetailSelect: (id: string) => void;
	onInsightsChange: (insights: string) => void;
	onToggleComparison: () => void;
	onCloseComparison: () => void;
}

export function ExperimentResultsContainer({
	experimentResults,
	selectedExperiments,
	selectedExperimentForDetail,
	insights,
	showComparison,
	trainingStage,
	currentModelId,
	trainingDataStats,
	sampleDistribution,
	isLoadingVisualization,
	onExperimentSelect,
	onExperimentDetailSelect,
	onInsightsChange,
	onToggleComparison,
	onCloseComparison,
}: ExperimentResultsContainerProps) {
	return (
		<>
			{/* Experiment History & Comparison */}
			{!showComparison ? (
				<ExperimentResultsPanel
					experimentResults={experimentResults}
					selectedExperiments={selectedExperiments}
					selectedExperimentForDetail={selectedExperimentForDetail}
					onExperimentSelect={onExperimentSelect}
					onExperimentDetailSelect={onExperimentDetailSelect}
					insights={insights}
					onInsightsChange={onInsightsChange}
					onToggleComparison={onToggleComparison}
				/>
			) : (
				<ExperimentComparisonView
					selectedExperiments={experimentResults.filter((exp) =>
						selectedExperiments.includes(exp.id),
					)}
					onClose={onCloseComparison}
				/>
			)}

			{/* Detailed Analysis for Selected Experiment */}
			{selectedExperimentForDetail &&
				trainingStage === "completed" &&
				currentModelId && (
					<div className="space-y-4">
						{/* Validation Results */}
						<ValidationSetResultsPanel modelId={currentModelId} />

						{/* Test Results */}
						<TestSetResultsPanel modelId={currentModelId} />

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
		</>
	);
}
