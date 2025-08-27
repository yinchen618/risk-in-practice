"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Radar,
	RadarChart,
	PolarGrid,
	PolarAngleAxis,
	PolarRadiusAxis,
	ResponsiveContainer,
	Legend,
	Tooltip,
} from "recharts";
import type { EvaluationRun } from "../../types";

interface ScenarioPerformanceRadarProps {
	selectedEvaluations: { [key: string]: EvaluationRun | undefined };
}

const scenarioLabels = {
	ERM_BASELINE: "ERM Baseline",
	GENERALIZATION_CHALLENGE: "Generalization Challenge",
	DOMAIN_ADAPTATION: "Domain Adaptation",
};

const scenarioColors = {
	ERM_BASELINE: "#3b82f6",
	GENERALIZATION_CHALLENGE: "#10b981",
	DOMAIN_ADAPTATION: "#8b5cf6",
};

export function ScenarioPerformanceRadar({ selectedEvaluations }: ScenarioPerformanceRadarProps) {
	const validEvaluations = Object.entries(selectedEvaluations).filter(
		([, evaluation]) => evaluation?.evaluation_metrics
	);

	if (validEvaluations.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Performance Radar Chart</CardTitle>
					<CardDescription>
						Multi-dimensional performance comparison across scenarios
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex items-center justify-center h-64 text-muted-foreground">
						No evaluation data available for radar analysis
					</div>
				</CardContent>
			</Card>
		);
	}

	// 準備雷達圖數據
	const radarData = [
		{
			metric: "F1 Score",
			fullMark: 1,
			...validEvaluations.reduce((acc, [scenario, evaluation]) => {
				acc[scenarioLabels[scenario as keyof typeof scenarioLabels]] = 
					evaluation!.evaluation_metrics!.f1_score;
				return acc;
			}, {} as Record<string, number>),
		},
		{
			metric: "Precision",
			fullMark: 1,
			...validEvaluations.reduce((acc, [scenario, evaluation]) => {
				acc[scenarioLabels[scenario as keyof typeof scenarioLabels]] = 
					evaluation!.evaluation_metrics!.precision;
				return acc;
			}, {} as Record<string, number>),
		},
		{
			metric: "Recall",
			fullMark: 1,
			...validEvaluations.reduce((acc, [scenario, evaluation]) => {
				acc[scenarioLabels[scenario as keyof typeof scenarioLabels]] = 
					evaluation!.evaluation_metrics!.recall;
				return acc;
			}, {} as Record<string, number>),
		},
		{
			metric: "Accuracy",
			fullMark: 1,
			...validEvaluations.reduce((acc, [scenario, evaluation]) => {
				acc[scenarioLabels[scenario as keyof typeof scenarioLabels]] = 
					evaluation!.evaluation_metrics!.accuracy;
				return acc;
			}, {} as Record<string, number>),
		},
		{
			metric: "AUC-ROC",
			fullMark: 1,
			...validEvaluations.reduce((acc, [scenario, evaluation]) => {
				const auc = evaluation!.evaluation_metrics!.auc_roc;
				if (auc !== undefined) {
					acc[scenarioLabels[scenario as keyof typeof scenarioLabels]] = auc;
				}
				return acc;
			}, {} as Record<string, number>),
		},
	] as Array<{ metric: string; fullMark: number; [key: string]: string | number }>;

	// 獲取有效的場景標籤
	const validScenarios = validEvaluations.map(([scenario]) => 
		scenarioLabels[scenario as keyof typeof scenarioLabels]
	);

	// 計算每個場景的綜合得分
	const overallScores = validScenarios.map(scenario => {
		const scores = radarData
			.filter(item => typeof item[scenario] === 'number')
			.map(item => item[scenario] as number);
		const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
		return { scenario, score: average };
	}).sort((a, b) => b.score - a.score);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Performance Radar Chart</CardTitle>
				<CardDescription>
					Multi-dimensional performance comparison across scenarios
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-6">
					{/* 綜合得分排名 */}
					<div>
						<h4 className="font-medium mb-3">Overall Performance Ranking</h4>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							{overallScores.map((item, index) => {
								const scenario = Object.keys(scenarioLabels).find(
									key => scenarioLabels[key as keyof typeof scenarioLabels] === item.scenario
								);
								return (
									<div 
										key={item.scenario}
										className="flex items-center justify-between p-3 border rounded-lg"
									>
										<div className="flex items-center gap-2">
											<div className="font-bold text-lg">#{index + 1}</div>
											<div>
												<div 
													className="font-medium text-sm"
													style={{ 
														color: scenario ? scenarioColors[scenario as keyof typeof scenarioColors] : undefined 
													}}
												>
													{item.scenario}
												</div>
												<div className="text-xs text-muted-foreground">
													Avg Score: {(item.score * 100).toFixed(1)}%
												</div>
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</div>

					{/* 雷達圖 */}
					<div className="h-96">
						<ResponsiveContainer width="100%" height="100%">
							<RadarChart data={radarData} margin={{ top: 20, right: 80, bottom: 20, left: 80 }}>
								<PolarGrid gridType="polygon" />
								<PolarAngleAxis 
									dataKey="metric" 
									tick={{ fontSize: 12 }}
									className="text-xs"
								/>
								<PolarRadiusAxis 
									angle={90} 
									domain={[0, 1]} 
									tick={{ fontSize: 10 }}
									tickFormatter={(value) => (value * 100).toFixed(0) + '%'}
								/>
								<Tooltip
									formatter={(value: number, name: string) => [
										`${(value * 100).toFixed(1)}%`,
										name
									]}
									labelFormatter={(label) => `Metric: ${label}`}
								/>
								<Legend 
									wrapperStyle={{ fontSize: '12px' }}
								/>
								
								{validScenarios.map((scenario) => {
									const scenarioKey = Object.keys(scenarioLabels).find(
										key => scenarioLabels[key as keyof typeof scenarioLabels] === scenario
									);
									return (
										<Radar
											key={scenario}
											name={scenario}
											dataKey={scenario}
											stroke={scenarioKey ? scenarioColors[scenarioKey as keyof typeof scenarioColors] : "#666"}
											fill={scenarioKey ? scenarioColors[scenarioKey as keyof typeof scenarioColors] : "#666"}
											fillOpacity={0.1}
											strokeWidth={2}
											dot={{ r: 3 }}
										/>
									);
								})}
							</RadarChart>
						</ResponsiveContainer>
					</div>

					{/* 詳細指標表格 */}
					<div>
						<h4 className="font-medium mb-3">Detailed Metrics Breakdown</h4>
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
										<th className="border border-gray-200 px-3 py-2 text-left">Best</th>
									</tr>
								</thead>
								<tbody>
									{radarData.map((row) => {
										const values = validScenarios.map(scenario => {
											const value = row[scenario];
											return typeof value === 'number' ? value : 0;
										});
										const maxValue = Math.max(...values);
										const bestScenario = validScenarios[values.indexOf(maxValue)];
										
										return (
											<tr key={row.metric}>
												<td className="border border-gray-200 px-3 py-2 font-medium">
													{row.metric}
												</td>
												{validScenarios.map((scenario) => {
													const value = row[scenario];
													const numericValue = typeof value === 'number' ? value : undefined;
													const isBest = numericValue === maxValue && numericValue !== undefined;
													return (
														<td 
															key={scenario} 
															className={`border border-gray-200 px-3 py-2 ${
																isBest ? 'bg-green-50 font-medium' : ''
															}`}
														>
															{numericValue !== undefined ? `${(numericValue * 100).toFixed(1)}%` : "—"}
														</td>
													);
												})}
												<td className="border border-gray-200 px-3 py-2 text-green-600 font-medium">
													{bestScenario?.split(' ')[0]}
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					</div>

					{/* 性能分析摘要 */}
					<div className="p-4 bg-muted/50 rounded-lg">
						<h5 className="font-medium mb-2">Performance Analysis Summary</h5>
						<div className="space-y-2 text-sm text-muted-foreground">
							{overallScores.length > 0 && (
								<p>
									<strong>{overallScores[0].scenario}</strong> shows the best overall performance 
									with an average score of <strong>{(overallScores[0].score * 100).toFixed(1)}%</strong>.
								</p>
							)}
							{overallScores.length > 1 && (
								<p>
									The performance gap between the best and worst performing scenario is{' '}
									<strong>
										{((overallScores[0].score - overallScores[overallScores.length - 1].score) * 100).toFixed(1)}%
									</strong>.
								</p>
							)}
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
