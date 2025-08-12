"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Stage1Automation } from "../components/Stage1Automation";
import { Stage2Labeling } from "../components/Stage2Labeling";
import { Stage3ModelTraining } from "../components/Stage3ModelTraining";
import { Stage4ModelEvaluation } from "../components/Stage4ModelEvaluation";

type ViewMode = "overview" | "labeling" | "training" | "evaluation";

export function DataResultsPhase() {
	const [viewMode, setViewMode] = useState<ViewMode>("overview");
	const [isTrainingCompleted, setIsTrainingCompleted] = useState(false);
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const tabs = [
		{
			id: "stage-1",
			key: "overview" as const,
			title: "1 Candidate Generation",
			subtitle: "Automated anomaly detection heuristics",
			activeColor: "text-blue-600 font-semibold border-blue-600",
		},
		{
			id: "stage-2",
			key: "labeling" as const,
			title: "2 Expert Labeling",
			subtitle: "Domain expert verification of positives",
			activeColor: "text-blue-600 font-semibold border-blue-600",
		},
		{
			id: "stage-3",
			key: "training" as const,
			title: "3 Model Training",
			subtitle: "uPU / nnPU learning with class prior",
			activeColor: "text-blue-600 font-semibold border-blue-600",
		},
		{
			id: "stage-4",
			key: "evaluation" as const,
			title: "4 Evaluation & Insights",
			subtitle: "Model performance and research findings",
			activeColor: "text-blue-600 font-semibold border-blue-600",
		},
	];

	return (
		<div className="space-y-6" id="data-results-phase">
			{/* Top Tabs for Stage 1 / Stage 2 / Stage 3 / Stage 4 */}
			<div className="flex items-center gap-2 border-b overflow-x-auto">
				{tabs.map((tab) => (
					<button
						key={tab.key}
						type="button"
						onClick={() => setViewMode(tab.key)}
						className={`h-10 px-4 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
							viewMode === tab.key
								? tab.activeColor
								: "border-transparent text-slate-600 hover:text-blue-600 hover:border-blue-300"
						}`}
					>
						<div className="text-left">
							<div className="font-semibold">{tab.title}</div>
							<div
								className={`text-xs ${viewMode === tab.key ? "text-blue-600" : "text-slate-500"}`}
							>
								{tab.subtitle}
							</div>
						</div>
					</button>
				))}
			</div>

			{viewMode === "overview" && (
				<Stage1Automation
					onProceedToStage2={() => setViewMode("labeling")}
				/>
			)}

			{viewMode === "labeling" && (
				<Stage2Labeling
					onBackToOverview={() => setViewMode("overview")}
					onProceedToTraining={() => setViewMode("training")}
				/>
			)}

			{viewMode === "training" && (
				<Stage3ModelTraining
					onTrainingCompleted={() => {
						setIsTrainingCompleted(true);
						setViewMode("evaluation");
					}}
				/>
			)}

			{viewMode === "evaluation" && (
				<Stage4ModelEvaluation
					isTrainingCompleted={isTrainingCompleted}
					onBackToTraining={() => setViewMode("training")}
				/>
			)}
		</div>
	);
}

export default DataResultsPhase;
