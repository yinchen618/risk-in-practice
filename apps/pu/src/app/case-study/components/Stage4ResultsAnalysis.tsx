"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest } from "@/utils/global-api-manager";
import {
	BarChart3,
	CheckCircle,
	FileSearch,
	Target,
	TrendingUp,
} from "lucide-react";
import { useEffect, useMemo } from "react";
import type {
	ExperimentResult,
	Stage4ResultsAnalysisProps,
} from "./experiment";
import { ExperimentResultsContainer } from "./experiment/ExperimentResultsContainer";
import { type ExperimentState, useExperimentState } from "./experiment/hooks/";

const API_BASE = "http://localhost:8000";

export function Stage4ResultsAnalysis({
	selectedRunId,
}: Stage4ResultsAnalysisProps) {
	const { experimentState, setExperimentState } = useExperimentState();

	// Load historical experiment results and evaluations
	useEffect(() => {
		const loadExperimentHistory = async () => {
			try {
				const response = await apiRequest.get(
					`${API_BASE}/api/v1/models/experiment/${selectedRunId}/evaluations`,
				);

				if (response?.data?.evaluations) {
					const historicalResults: ExperimentResult[] =
						response.data.evaluations.map((evaluation: any) => ({
							id: evaluation.id,
							timestamp:
								evaluation.completed_at ||
								evaluation.created_at,
							experimentType:
								evaluation.scenario_type ===
								"GENERALIZATION_CHALLENGE"
									? "Cross-Domain"
									: "In-Domain",
							config: {
								...evaluation.data_source_config,
								modelParams: evaluation.model_config,
							},
							metrics: {
								validationF1: 0, // Evaluation doesn't have validation data
								testF1:
									evaluation.evaluation_metrics?.f1_score ||
									0,
								testPrecision:
									evaluation.evaluation_metrics?.precision ||
									0,
								testRecall:
									evaluation.evaluation_metrics?.recall || 0,
							},
							status: "completed" as const,
						}));

					setExperimentState((prev: ExperimentState) => ({
						...prev,
						results: historicalResults,
					}));
				}
			} catch (error) {
				console.error("Failed to load experiment history:", error);
			}
		};

		if (selectedRunId) {
			loadExperimentHistory();
		}
	}, [selectedRunId, setExperimentState]);

	// Calculate performance insights
	const performanceInsights = useMemo(() => {
		const results = experimentState.results;
		if (results.length === 0) {
			return null;
		}

		const inDomainResults = results.filter(
			(r) => r.experimentType === "In-Domain",
		);
		const crossDomainResults = results.filter(
			(r) => r.experimentType === "Cross-Domain",
		);

		const avgInDomainF1 =
			inDomainResults.length > 0
				? inDomainResults.reduce(
						(sum, r) => sum + r.metrics.testF1,
						0,
					) / inDomainResults.length
				: 0;

		const avgCrossDomainF1 =
			crossDomainResults.length > 0
				? crossDomainResults.reduce(
						(sum, r) => sum + r.metrics.testF1,
						0,
					) / crossDomainResults.length
				: 0;

		const generalizationGap = avgInDomainF1 - avgCrossDomainF1;

		return {
			totalExperiments: results.length,
			inDomainCount: inDomainResults.length,
			crossDomainCount: crossDomainResults.length,
			avgInDomainF1,
			avgCrossDomainF1,
			generalizationGap,
			bestOverallF1: Math.max(...results.map((r) => r.metrics.testF1)),
			worstOverallF1: Math.min(...results.map((r) => r.metrics.testF1)),
		};
	}, [experimentState.results]);

	return (
		<div className="space-y-6">
			{/* Header */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<TrendingUp className="h-6 w-6 text-purple-600" />
						Results Analysis & Model Performance Evaluation
					</CardTitle>
					<p className="text-sm text-muted-foreground">
						Analyze and compare experiment results, evaluate model
						performance across different scenarios, and gain
						insights into domain adaptation capabilities.
					</p>
				</CardHeader>
			</Card>

			{/* Performance Overview */}
			{performanceInsights && (
				<Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
					<CardHeader className="pb-3">
						<div className="flex items-center gap-2">
							<BarChart3 className="h-5 w-5 text-purple-600" />
							<CardTitle className="text-lg text-purple-800">
								Performance Overview
							</CardTitle>
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
							<div className="bg-white rounded-lg p-4 border border-purple-100">
								<div className="text-purple-700 font-medium text-xs uppercase tracking-wide">
									Total Experiments
								</div>
								<p className="text-2xl font-bold text-purple-800 mt-1">
									{performanceInsights.totalExperiments}
								</p>
								<p className="text-sm text-purple-600 mt-1">
									{performanceInsights.inDomainCount}{" "}
									In-Domain,{" "}
									{performanceInsights.crossDomainCount}{" "}
									Cross-Domain
								</p>
							</div>

							<div className="bg-white rounded-lg p-4 border border-green-100">
								<div className="text-green-700 font-medium text-xs uppercase tracking-wide">
									In-Domain Avg F1
								</div>
								<p className="text-2xl font-bold text-green-800 mt-1">
									{(
										performanceInsights.avgInDomainF1 * 100
									).toFixed(1)}
									%
								</p>
								<p className="text-sm text-green-600 mt-1">
									Best:{" "}
									{(
										performanceInsights.bestOverallF1 * 100
									).toFixed(1)}
									%
								</p>
							</div>

							<div className="bg-white rounded-lg p-4 border border-blue-100">
								<div className="text-blue-700 font-medium text-xs uppercase tracking-wide">
									Cross-Domain Avg F1
								</div>
								<p className="text-2xl font-bold text-blue-800 mt-1">
									{(
										performanceInsights.avgCrossDomainF1 *
										100
									).toFixed(1)}
									%
								</p>
								<p className="text-sm text-blue-600 mt-1">
									Worst:{" "}
									{(
										performanceInsights.worstOverallF1 * 100
									).toFixed(1)}
									%
								</p>
							</div>

							<div className="bg-white rounded-lg p-4 border border-orange-100">
								<div className="text-orange-700 font-medium text-xs uppercase tracking-wide">
									Generalization Gap
								</div>
								<p className="text-2xl font-bold text-orange-800 mt-1">
									{(
										performanceInsights.generalizationGap *
										100
									).toFixed(1)}
									%
								</p>
								<p className="text-sm text-orange-600 mt-1">
									{performanceInsights.generalizationGap > 0
										? "Domain sensitivity"
										: "Robust"}
								</p>
							</div>
						</div>

						{/* Insights */}
						{performanceInsights.generalizationGap > 0.1 && (
							<div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
								<div className="flex items-center gap-2 mb-2">
									<Target className="h-4 w-4 text-amber-600" />
									<span className="font-medium text-amber-800">
										Performance Insight
									</span>
								</div>
								<p className="text-sm text-amber-700">
									High generalization gap (
									{(
										performanceInsights.generalizationGap *
										100
									).toFixed(1)}
									%) indicates significant domain shift
									sensitivity. Consider domain adaptation
									techniques or more diverse training data.
								</p>
							</div>
						)}

						{performanceInsights.avgCrossDomainF1 >
							performanceInsights.avgInDomainF1 && (
							<div className="bg-green-50 border border-green-200 rounded-lg p-4">
								<div className="flex items-center gap-2 mb-2">
									<CheckCircle className="h-4 w-4 text-green-600" />
									<span className="font-medium text-green-800">
										Exceptional Performance
									</span>
								</div>
								<p className="text-sm text-green-700">
									Cross-domain performance exceeds in-domain
									results! This suggests excellent
									generalization capabilities or potential
									data leakage to investigate.
								</p>
							</div>
						)}
					</CardContent>
				</Card>
			)}

			{/* Detailed Results Analysis */}
			<div className="space-y-4">
				<ExperimentResultsContainer
					experimentResults={experimentState.results}
					selectedExperiments={experimentState.selectedForComparison}
					selectedExperimentForDetail={
						experimentState.selectedForDetail
					}
					insights={experimentState.insights}
					showComparison={experimentState.showComparison}
					trainingStage="completed" // Always show as completed in Stage 4
					currentModelId={experimentState.currentModelId}
					// Remove training data visualization props since this is results-focused
					trainingDataStats={null}
					sampleDistribution={null}
					isLoadingVisualization={false}
					onExperimentSelect={(id) =>
						setExperimentState((prev: ExperimentState) => ({
							...prev,
							selectedForComparison:
								prev.selectedForComparison.includes(id)
									? prev.selectedForComparison.filter(
											(expId: string) => expId !== id,
										)
									: [...prev.selectedForComparison, id],
						}))
					}
					onExperimentDetailSelect={(id) =>
						setExperimentState((prev: ExperimentState) => ({
							...prev,
							selectedForDetail: id,
						}))
					}
					onInsightsChange={(insights) =>
						setExperimentState((prev: ExperimentState) => ({
							...prev,
							insights,
						}))
					}
					onToggleComparison={() =>
						setExperimentState((prev: ExperimentState) => ({
							...prev,
							showComparison: true,
						}))
					}
					onCloseComparison={() =>
						setExperimentState((prev: ExperimentState) => ({
							...prev,
							showComparison: false,
						}))
					}
				/>
			</div>

			{/* Additional Analysis Tools */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<FileSearch className="h-5 w-5 text-blue-600" />
						Advanced Analysis Tools
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
						<div>
							<p className="font-medium text-foreground mb-2">
								Available Analysis
							</p>
							<ul className="space-y-1">
								<li>• Statistical significance testing</li>
								<li>• Performance trend analysis</li>
								<li>• Domain shift quantification</li>
								<li>• Model robustness evaluation</li>
							</ul>
						</div>
						<div>
							<p className="font-medium text-foreground mb-2">
								Export Options
							</p>
							<ul className="space-y-1">
								<li>• Performance comparison reports</li>
								<li>• Model evaluation summaries</li>
								<li>• Detailed metric breakdowns</li>
								<li>• Research publication tables</li>
							</ul>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
