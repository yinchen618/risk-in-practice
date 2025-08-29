"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { BarChart, ChevronRight, Loader2, Play, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ExperimentRunSelector } from "./ExperimentRunSelector";
import { Stage1CandidateGeneration } from "./Stage1CandidateGeneration";
import { Stage2ExpertLabeling } from "./Stage2ExpertLabeling";
import { Stage3TrainingWorkbench } from "./Stage3TrainingWorkbench";
import Stage4ResultsAnalysis from "./Stage4ResultsAnalysis";

import { useExperimentHistory } from "../hooks/useExperimentHistory";
import { useExperimentRun } from "../hooks/useExperimentRun";

export function CaseStudyV2WorkbenchComponent() {
	const router = useRouter();

	// State management with URL query parameters
	const [selectedRunId, setSelectedRunId] = useState<string>("new");
	const [activeStage, setActiveStage] = useState<string>("stage-1");

	// Data fetching
	const {
		data: selectedRun,
		isLoading: runLoading,
		error: runError,
		refetch: refetchExperimentRun,
	} = useExperimentRun(selectedRunId !== "new" ? selectedRunId : undefined);
	const { data: history, isLoading: historyLoading } = useExperimentHistory(
		selectedRunId !== "new" ? selectedRunId : undefined,
	);

	// Update URL when selections change using query parameters
	const updateURL = (newRunId: string, newStage: string) => {
		const params = new URLSearchParams();
		if (newRunId !== "new") {
			params.set("run", newRunId);
		}
		params.set("stage", newStage);

		const newURL = `/case-study-v2?${params.toString()}`;
		router.push(newURL);
	};

	// Handle experiment run selection
	const handleRunSelection = (runId: string) => {
		setSelectedRunId(runId);
		// updateURL(runId, activeStage);
	};

	// Handle stage navigation
	const handleStageChange = (newStage: string) => {
		setActiveStage(newStage);
		// updateURL(selectedRunId, newStage);

		// Refetch experiment data to ensure UI reflects latest status
		if (selectedRunId !== "new" && refetchExperimentRun) {
			refetchExperimentRun();
		}
	};

	// Auto-navigate based on experiment status
	useEffect(() => {
		if (selectedRun && selectedRunId !== "new") {
			// Auto-navigate to appropriate stage based on experiment status
			if (
				selectedRun.status === "CONFIGURING" &&
				activeStage !== "stage-1"
			) {
				setActiveStage("stage-1");
				// updateURL(selectedRunId, "stage-1");
			} else if (
				selectedRun.status === "LABELING" &&
				activeStage === "stage-1"
			) {
				setActiveStage("stage-2");
				// updateURL(selectedRunId, "stage-2");
			}
		}
	}, [selectedRun, selectedRunId, activeStage]);

	// Stage configuration
	const stages = [
		{
			id: "stage-1",
			title: "Candidate Generation",
			description: "Filter and identify potential anomaly events",
			icon: Settings,
			enabled: true,
		},
		{
			id: "stage-2",
			title: "Expert Labeling",
			description: "Review candidates and establish ground truth",
			icon: Play,
			enabled: selectedRun?.status !== "CONFIGURING",
		},
		{
			id: "stage-3",
			title: "Training Workbench",
			description: "Configure and execute model training",
			icon: BarChart,
			enabled:
				selectedRun?.status === "COMPLETED" ||
				(selectedRun?.positive_label_count &&
					selectedRun.positive_label_count > 0),
		},
		{
			id: "stage-4",
			title: "Results Analysis",
			description: "Analyze and compare experiment outcomes",
			icon: BarChart,
			enabled: (history?.trained_models?.length || 0) > 0,
		},
	];

	// Loading state
	if (runLoading && selectedRunId !== "new") {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Loader2 className="h-8 w-8 animate-spin" />
			</div>
		);
	}

	// Error state
	if (runError) {
		return (
			<div className="container mx-auto px-4 py-8">
				<Alert variant="destructive">
					<AlertDescription>
						Error loading experiment run: {runError.message}
					</AlertDescription>
				</Alert>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8 space-y-6">
			{/* Header */}
			<div className="space-y-2">
				<h1 className="text-3xl font-bold tracking-tight">
					PU Learning Workbench v2
				</h1>
				<p className="text-muted-foreground">
					Advanced experimental workbench for PU Learning research
					with dynamic four-stage workflow
				</p>
			</div>

			{/* Experiment Run Selector */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Settings className="h-5 w-5" />
						Experiment Configuration
					</CardTitle>
					<CardDescription>
						Select or create an experiment run to begin the research
						workflow
					</CardDescription>
				</CardHeader>
				<CardContent>
					<ExperimentRunSelector
						selectedRunId={selectedRunId}
						onRunSelect={handleRunSelection}
						selectedRun={selectedRun}
					/>
				</CardContent>
			</Card>

			{/* Workflow Progress */}
			{selectedRunId !== "new" && selectedRun && (
				<Card>
					<CardHeader>
						<CardTitle>Workflow Progress</CardTitle>
						<CardDescription>
							Track your progress through the four-stage research
							workflow
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex items-center space-x-4 overflow-x-auto pb-2">
							{stages.map((stage, index) => {
								const Icon = stage.icon;
								const isActive = stage.id === activeStage;
								const isCompleted =
									stages.findIndex(
										(s) => s.id === activeStage,
									) > index;

								return (
									<div
										key={stage.id}
										className="flex items-center"
									>
										<Button
											variant={
												isActive
													? "default"
													: isCompleted
														? "secondary"
														: "outline"
											}
											className={`flex-col h-auto p-4 min-w-[140px] ${
												!stage.enabled
													? "opacity-50 cursor-not-allowed"
													: ""
											}`}
											onClick={() =>
												stage.enabled &&
												handleStageChange(stage.id)
											}
											disabled={!stage.enabled}
										>
											<Icon className="h-5 w-5 mb-2" />
											<span className="text-sm font-medium">
												{stage.title}
											</span>
											<span className="text-xs text-muted-foreground mt-1 text-center">
												{stage.description}
											</span>
										</Button>
										{index < stages.length - 1 && (
											<ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
										)}
									</div>
								);
							})}
						</div>

						{/* Status Indicators */}
						<Separator className="my-4" />
						<div className="flex items-center gap-4 text-sm">
							<div className="flex items-center gap-2">
								<Badge
									variant={
										selectedRun.status === "CONFIGURING"
											? "default"
											: "secondary"
									}
								>
									{selectedRun.status}
								</Badge>
								<span className="text-muted-foreground">
									Status
								</span>
							</div>
							{selectedRun.candidate_count !== null && (
								<div className="flex items-center gap-2">
									<Badge variant="outline">
										{selectedRun.candidate_count}
									</Badge>
									<span className="text-muted-foreground">
										Candidates
									</span>
								</div>
							)}
							{selectedRun.positive_label_count !== null && (
								<div className="flex items-center gap-2">
									<Badge variant="outline">
										{selectedRun.positive_label_count}/
										{selectedRun.candidate_count} labeled
									</Badge>
									<span className="text-muted-foreground">
										Progress
									</span>
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			)}

			{/* Main Content Area */}
			{selectedRunId !== "new" ? (
				<Tabs
					value={activeStage}
					onValueChange={handleStageChange}
					className="space-y-4"
				>
					<TabsContent value="stage-1" className="space-y-4">
						<Stage1CandidateGeneration
							experimentRun={selectedRun || undefined}
							onComplete={(newExperimentRunId) => {
								if (newExperimentRunId) {
									// Switch to the new experiment run and move to stage 2
									setSelectedRunId(newExperimentRunId);
									handleStageChange("stage-2");
								} else {
									// Just move to stage 2 with current run
									handleStageChange("stage-2");
								}
							}}
						/>
					</TabsContent>

					<TabsContent value="stage-2" className="space-y-4">
						{selectedRun && (
							<Stage2ExpertLabeling
								experimentRun={selectedRun}
								onComplete={() => handleStageChange("stage-3")}
							/>
						)}
					</TabsContent>

					<TabsContent value="stage-3" className="space-y-4">
						{selectedRun && (
							<Stage3TrainingWorkbench
								experimentRun={selectedRun}
							/>
						)}
					</TabsContent>

					<TabsContent value="stage-4" className="space-y-4">
						{selectedRun && history && (
							<Stage4ResultsAnalysis experiments={[history]} />
						)}
					</TabsContent>
				</Tabs>
			) : (
				<Card>
					<CardHeader>
						<CardTitle>
							Welcome to PU Learning Workbench v2
						</CardTitle>
						<CardDescription>
							Create a new experiment run or select an existing
							one to begin your research workflow
						</CardDescription>
					</CardHeader>
					<CardContent>
						<p className="text-muted-foreground">
							This workbench provides a structured four-stage
							approach to PU Learning research:
						</p>
						<ul className="mt-4 space-y-2 text-sm text-muted-foreground">
							<li>
								• <strong>Stage 1:</strong> Generate anomaly
								candidates from raw data using configurable
								filtering rules
							</li>
							<li>
								• <strong>Stage 2:</strong> Review and label
								candidates to establish ground truth
							</li>
							<li>
								• <strong>Stage 3:</strong> Train and evaluate
								PU Learning models with real-time monitoring
							</li>
							<li>
								• <strong>Stage 4:</strong> Analyze results and
								compare different experimental approaches
							</li>
						</ul>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
