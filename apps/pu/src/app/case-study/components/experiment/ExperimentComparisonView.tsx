"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, X } from "lucide-react";
import dynamic from "next/dynamic";
import { useMemo } from "react";

// 動態導入 Plotly 組件，禁用 SSR
const Plot = dynamic(() => import("react-plotly.js"), {
	ssr: false,
	loading: () => (
		<div className="h-[300px] flex items-center justify-center">
			<div className="text-slate-500">Loading chart...</div>
		</div>
	),
});

interface ExperimentResult {
	id: string;
	timestamp: string;
	experimentType: "In-Domain" | "Cross-Domain";
	config: any;
	metrics: {
		validationF1: number;
		testF1: number;
		testPrecision: number;
		testRecall: number;
	};
	status: "running" | "completed" | "failed";
}

interface ExperimentComparisonViewProps {
	selectedExperiments: ExperimentResult[];
	onClose: () => void;
}

export function ExperimentComparisonView({
	selectedExperiments,
	onClose,
}: ExperimentComparisonViewProps) {
	// 準備圖表數據
	const chartData = useMemo(() => {
		if (selectedExperiments.length === 0) {
			return [];
		}

		const metrics = ["Test F1", "Precision", "Recall", "Validation F1"];

		return selectedExperiments.map((exp, index) => ({
			x: metrics,
			y: [
				exp.metrics.testF1,
				exp.metrics.testPrecision,
				exp.metrics.testRecall,
				exp.metrics.validationF1,
			],
			name: `Exp ${exp.id.slice(-6)} (${exp.experimentType})`,
			type: "bar" as const,
			marker: {
				color: [
					"#3b82f6", // Blue
					"#10b981", // Green
					"#f59e0b", // Yellow
					"#ef4444", // Red
					"#8b5cf6", // Purple
				][index % 5],
			},
		}));
	}, [selectedExperiments]);

	// 準備雷達圖數據
	const radarData = useMemo(() => {
		if (selectedExperiments.length === 0) {
			return [];
		}

		return selectedExperiments.map((exp, index) => ({
			type: "scatterpolar" as const,
			r: [
				exp.metrics.testF1,
				exp.metrics.testPrecision,
				exp.metrics.testRecall,
				exp.metrics.validationF1,
			],
			theta: ["Test F1", "Precision", "Recall", "Validation F1"],
			fill: "toself" as const,
			name: `Exp ${exp.id.slice(-6)}`,
			line: {
				color: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"][
					index % 5
				],
			},
		}));
	}, [selectedExperiments]);

	// 計算統計摘要
	const comparisonStats = useMemo(() => {
		if (selectedExperiments.length === 0) {
			return null;
		}

		const metrics = [
			"testF1",
			"testPrecision",
			"testRecall",
			"validationF1",
		];
		const stats: Record<
			string,
			{ best: ExperimentResult; worst: ExperimentResult; avg: number }
		> = {};

		metrics.forEach((metric) => {
			const values = selectedExperiments.map((exp) => ({
				exp,
				value: exp.metrics[metric as keyof typeof exp.metrics],
			}));

			const sorted = values.sort((a, b) => b.value - a.value);
			const avg =
				values.reduce((sum, v) => sum + v.value, 0) / values.length;

			stats[metric] = {
				best: sorted[0].exp,
				worst: sorted[sorted.length - 1].exp,
				avg,
			};
		});

		return stats;
	}, [selectedExperiments]);

	if (selectedExperiments.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center justify-between">
						<span className="flex items-center gap-2">
							<BarChart3 className="h-5 w-5" />
							Experiment Comparison
						</span>
						<Button variant="ghost" size="sm" onClick={onClose}>
							<X className="h-4 w-4" />
						</Button>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-center py-8 text-muted-foreground">
						<BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
						<p>Select experiments to compare</p>
						<p className="text-sm">
							Use the checkboxes in the experiment table to select
							experiments for comparison.
						</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center justify-between">
					<span className="flex items-center gap-2">
						<BarChart3 className="h-5 w-5" />
						Experiment Comparison ({selectedExperiments.length}{" "}
						experiments)
					</span>
					<Button variant="ghost" size="sm" onClick={onClose}>
						<X className="h-4 w-4" />
					</Button>
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Selected Experiments Overview */}
				<div>
					<h4 className="font-medium mb-3">Selected Experiments</h4>
					<div className="flex flex-wrap gap-2">
						{selectedExperiments.map((exp) => (
							<Badge
								key={exp.id}
								variant={
									exp.experimentType === "In-Domain"
										? "default"
										: "secondary"
								}
								className="text-xs"
							>
								{exp.id.slice(-6)} - {exp.experimentType}
							</Badge>
						))}
					</div>
				</div>

				{/* Metrics Bar Chart */}
				<div>
					<h4 className="font-medium mb-3">
						Performance Metrics Comparison
					</h4>
					<div className="h-[400px]">
						<Plot
							data={chartData}
							layout={{
								autosize: true,
								height: 400,
								margin: { l: 60, r: 30, t: 40, b: 60 },
								barmode: "group",
								xaxis: {
									title: { text: "Metrics" },
								},
								yaxis: {
									title: { text: "Score" },
									range: [0, 1],
								},
								legend: {
									orientation: "h",
									y: -0.2,
								},
								title: {
									text: "Performance Metrics by Experiment",
									font: { size: 14 },
								},
							}}
							config={{
								responsive: true,
								displayModeBar: false,
							}}
						/>
					</div>
				</div>

				{/* Radar Chart */}
				<div>
					<h4 className="font-medium mb-3">Radar Chart Comparison</h4>
					<div className="h-[400px]">
						<Plot
							data={radarData}
							layout={{
								autosize: true,
								height: 400,
								margin: { l: 60, r: 60, t: 40, b: 60 },
								polar: {
									radialaxis: {
										visible: true,
										range: [0, 1],
									},
								},
								showlegend: true,
								legend: {
									orientation: "h",
									y: -0.1,
								},
								title: {
									text: "Performance Profile Comparison",
									font: { size: 14 },
								},
							}}
							config={{
								responsive: true,
								displayModeBar: false,
							}}
						/>
					</div>
				</div>

				{/* Statistical Summary */}
				{comparisonStats && (
					<div>
						<h4 className="font-medium mb-3 flex items-center gap-2">
							<TrendingUp className="h-4 w-4" />
							Statistical Summary
						</h4>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{Object.entries(comparisonStats).map(
								([metric, stats]) => (
									<div
										key={metric}
										className="border rounded-lg p-4"
									>
										<h5 className="font-medium text-sm mb-2 capitalize">
											{metric
												.replace(/([A-Z])/g, " $1")
												.toLowerCase()}
										</h5>
										<div className="space-y-2 text-xs">
											<div className="flex justify-between">
												<span className="text-green-600">
													Best:
												</span>
												<span className="font-mono">
													{stats.best.id.slice(-6)} (
													{stats.best.metrics[
														metric as keyof typeof stats.best.metrics
													].toFixed(3)}
													)
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-red-600">
													Worst:
												</span>
												<span className="font-mono">
													{stats.worst.id.slice(-6)} (
													{stats.worst.metrics[
														metric as keyof typeof stats.worst.metrics
													].toFixed(3)}
													)
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-blue-600">
													Average:
												</span>
												<span className="font-mono">
													{stats.avg.toFixed(3)}
												</span>
											</div>
										</div>
									</div>
								),
							)}
						</div>
					</div>
				)}

				{/* Configuration Comparison */}
				<div>
					<h4 className="font-medium mb-3">Configuration Details</h4>
					<div className="overflow-x-auto">
						<table className="w-full text-xs border-collapse">
							<thead>
								<tr className="border-b">
									<th className="text-left p-2">
										Experiment
									</th>
									<th className="text-left p-2">Type</th>
									<th className="text-left p-2">Lambda</th>
									<th className="text-left p-2">
										Learning Rate
									</th>
									<th className="text-left p-2">
										P/U Source
									</th>
									<th className="text-left p-2">
										Test Source
									</th>
								</tr>
							</thead>
							<tbody>
								{selectedExperiments.map((exp) => (
									<tr key={exp.id} className="border-b">
										<td className="p-2 font-mono">
											{exp.id.slice(-6)}
										</td>
										<td className="p-2">
											<Badge
												variant={
													exp.experimentType ===
													"In-Domain"
														? "default"
														: "secondary"
												}
												className="text-xs"
											>
												{exp.experimentType}
											</Badge>
										</td>
										<td className="p-2 font-mono">
											{exp.config?.modelParams
												?.lambdaReg || "N/A"}
										</td>
										<td className="p-2 font-mono">
											{exp.config?.modelParams
												?.learningRate || "N/A"}
										</td>
										<td className="p-2 text-xs">
											{exp.config?.positiveSource
												?.selectedFloorsByBuilding
												? Object.entries(
														exp.config
															.positiveSource
															.selectedFloorsByBuilding,
													)
														.filter(
															([, floors]) =>
																(
																	floors as string[]
																).length > 0,
														)
														.map(
															([
																building,
																floors,
															]) =>
																`${building}:${(floors as string[]).join(",")}`,
														)
														.join("; ") || "N/A"
												: "N/A"}
										</td>
										<td className="p-2 text-xs">
											{exp.config?.testSource
												?.selectedFloorsByBuilding
												? Object.entries(
														exp.config.testSource
															.selectedFloorsByBuilding,
													)
														.filter(
															([, floors]) =>
																(
																	floors as string[]
																).length > 0,
														)
														.map(
															([
																building,
																floors,
															]) =>
																`${building}:${(floors as string[]).join(",")}`,
														)
														.join("; ") || "N/A"
												: "N/A"}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
