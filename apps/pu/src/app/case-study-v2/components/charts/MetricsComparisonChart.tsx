"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import type { EvaluationRun } from "../../types";

interface MetricsComparisonChartProps {
	selectedEvaluations: { [key: string]: EvaluationRun | undefined };
}

const scenarioColors = {
	ERM_BASELINE: "#3b82f6", // blue
	GENERALIZATION_CHALLENGE: "#10b981", // green
	DOMAIN_ADAPTATION: "#8b5cf6", // purple
};

const scenarioLabels = {
	ERM_BASELINE: "ERM Baseline",
	GENERALIZATION_CHALLENGE: "Generalization Challenge",
	DOMAIN_ADAPTATION: "Domain Adaptation",
};

export function MetricsComparisonChart({ selectedEvaluations }: MetricsComparisonChartProps) {
	// 準備圖表數據
	const chartData = [
		{
			metric: "F1 Score",
			...Object.entries(selectedEvaluations).reduce((acc, [scenario, evaluation]) => {
				if (evaluation?.evaluation_metrics) {
					acc[scenarioLabels[scenario as keyof typeof scenarioLabels]] = 
						evaluation.evaluation_metrics.f1_score;
				}
				return acc;
			}, {} as Record<string, number>),
		},
		{
			metric: "Precision",
			...Object.entries(selectedEvaluations).reduce((acc, [scenario, evaluation]) => {
				if (evaluation?.evaluation_metrics) {
					acc[scenarioLabels[scenario as keyof typeof scenarioLabels]] = 
						evaluation.evaluation_metrics.precision;
				}
				return acc;
			}, {} as Record<string, number>),
		},
		{
			metric: "Recall",
			...Object.entries(selectedEvaluations).reduce((acc, [scenario, evaluation]) => {
				if (evaluation?.evaluation_metrics) {
					acc[scenarioLabels[scenario as keyof typeof scenarioLabels]] = 
						evaluation.evaluation_metrics.recall;
				}
				return acc;
			}, {} as Record<string, number>),
		},
		{
			metric: "Accuracy",
			...Object.entries(selectedEvaluations).reduce((acc, [scenario, evaluation]) => {
				if (evaluation?.evaluation_metrics) {
					acc[scenarioLabels[scenario as keyof typeof scenarioLabels]] = 
						evaluation.evaluation_metrics.accuracy;
				}
				return acc;
			}, {} as Record<string, number>),
		},
		{
			metric: "AUC-ROC",
			...Object.entries(selectedEvaluations).reduce((acc, [scenario, evaluation]) => {
				if (evaluation?.evaluation_metrics?.auc_roc) {
					acc[scenarioLabels[scenario as keyof typeof scenarioLabels]] = 
						evaluation.evaluation_metrics.auc_roc;
				}
				return acc;
			}, {} as Record<string, number>),
		},
	] as Array<{ metric: string; [key: string]: string | number }>;

	// 獲取有效的場景標籤
	const validScenarios = Object.entries(selectedEvaluations)
		.filter(([, evaluation]) => evaluation?.evaluation_metrics)
		.map(([scenario]) => scenarioLabels[scenario as keyof typeof scenarioLabels]);

	if (validScenarios.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Performance Metrics Comparison</CardTitle>
					<CardDescription>
						Compare key performance metrics across selected scenarios
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex items-center justify-center h-64 text-muted-foreground">
						No evaluation data available for comparison
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Performance Metrics Comparison</CardTitle>
				<CardDescription>
					Compare key performance metrics across selected scenarios
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="h-96">
					<ResponsiveContainer width="100%" height="100%">
						<BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="metric" />
							<YAxis domain={[0, 1]} tickFormatter={(value: any) => value.toFixed(2)} />
							<Tooltip 
								formatter={(value: number) => [value.toFixed(4), ""]}
								labelFormatter={(label: any) => `Metric: ${label}`}
							/>
							<Legend />
							{validScenarios.map((scenario) => (
								<Bar
									key={scenario}
									dataKey={scenario}
									fill={Object.values(scenarioColors)[validScenarios.indexOf(scenario) % 3]}
									radius={[2, 2, 0, 0]}
								/>
							))}
						</BarChart>
					</ResponsiveContainer>
				</div>

				{/* 數值表格 */}
				<div className="mt-6 space-y-4">
					<h4 className="font-medium">Detailed Metrics</h4>
					<div className="overflow-x-auto">
						<table className="w-full border-collapse border border-gray-200 text-sm">
							<thead>
								<tr className="bg-gray-50">
									<th className="border border-gray-200 px-3 py-2 text-left">Metric</th>
									{validScenarios.map((scenario) => (
										<th key={scenario} className="border border-gray-200 px-3 py-2 text-left">
											{scenario}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{chartData.map((row) => (
									<tr key={row.metric}>
										<td className="border border-gray-200 px-3 py-2 font-medium">
											{row.metric}
										</td>
										{validScenarios.map((scenario) => {
											const value = row[scenario];
											return (
												<td key={scenario} className="border border-gray-200 px-3 py-2">
													{typeof value === 'number' ? value.toFixed(4) : "—"}
												</td>
											);
										})}
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
