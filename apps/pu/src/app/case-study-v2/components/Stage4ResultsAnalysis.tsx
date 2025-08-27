"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	BarChart,
	Download,
	GitCompare,
	LineChart,
	PieChart,
	RefreshCw,
} from "lucide-react";
import { useState, useMemo } from "react";
import type { ExperimentHistory, ExperimentRun, EvaluationRun } from "../types";

// 內聯組件：指標比較圖表
const MetricsComparisonView = ({ 
	selectedEvaluations 
}: { 
	selectedEvaluations: { [key: string]: EvaluationRun | undefined } 
}) => {
	const validEvaluations = Object.entries(selectedEvaluations).filter(
		([, evaluation]) => evaluation?.evaluation_metrics
	);

	if (validEvaluations.length === 0) {
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

	const scenarioLabels = {
		ERM_BASELINE: "ERM Baseline",
		GENERALIZATION_CHALLENGE: "Generalization Challenge",
		DOMAIN_ADAPTATION: "Domain Adaptation",
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Performance Metrics Comparison</CardTitle>
				<CardDescription>
					Compare key performance metrics across selected scenarios
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-6">
					{/* 指標卡片 */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						{['f1_score', 'precision', 'recall', 'accuracy'].map((metric) => (
							<div key={metric} className="space-y-3">
								<h4 className="font-medium capitalize text-center">
									{metric.replace('_', ' ')}
								</h4>
								{validEvaluations.map(([scenario, evaluation]) => {
									if (!evaluation || !evaluation.evaluation_metrics) return null;
									const value = evaluation.evaluation_metrics[metric as keyof typeof evaluation.evaluation_metrics] as number;
									const label = scenarioLabels[scenario as keyof typeof scenarioLabels];
									return (
										<div key={scenario} className="text-center p-3 border rounded">
											<div className="text-sm text-muted-foreground mb-1">
												{label}
											</div>
											<div className="text-xl font-bold">
												{(value * 100).toFixed(1)}%
											</div>
										</div>
									);
								})}
							</div>
						))}
					</div>

					{/* 詳細比較表格 */}
					<div className="overflow-x-auto">
						<table className="w-full border-collapse border border-gray-200 text-sm">
							<thead>
								<tr className="bg-gray-50">
									<th className="border border-gray-200 px-3 py-2 text-left">Metric</th>
									{validEvaluations.map(([scenario]) => (
										<th key={scenario} className="border border-gray-200 px-3 py-2 text-left">
											{scenarioLabels[scenario as keyof typeof scenarioLabels]}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{['f1_score', 'precision', 'recall', 'accuracy', 'auc_roc'].map((metric) => (
									<tr key={metric}>
										<td className="border border-gray-200 px-3 py-2 font-medium capitalize">
											{metric.replace('_', ' ')}
										</td>
										{validEvaluations.map(([scenario, evaluation]) => {
											if (!evaluation || !evaluation.evaluation_metrics) return (
												<td key={scenario} className="border border-gray-200 px-3 py-2">—</td>
											);
											const value = evaluation.evaluation_metrics[metric as keyof typeof evaluation.evaluation_metrics] as number;
											return (
												<td key={scenario} className="border border-gray-200 px-3 py-2">
													{value ? (value * 100).toFixed(2) + '%' : '—'}
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
};

// 內聯組件：混淆矩陣視圖
const ConfusionMatrixView = ({ 
	selectedEvaluations 
}: { 
	selectedEvaluations: { [key: string]: EvaluationRun | undefined } 
}) => {
	const validEvaluations = Object.entries(selectedEvaluations).filter(
		([, evaluation]) => evaluation?.evaluation_metrics?.confusion_matrix
	);

	if (validEvaluations.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Confusion Matrix Analysis</CardTitle>
					<CardDescription>
						Detailed confusion matrix breakdown for each scenario
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex items-center justify-center h-64 text-muted-foreground">
						No confusion matrix data available
					</div>
				</CardContent>
			</Card>
		);
	}

	const scenarioLabels = {
		ERM_BASELINE: "ERM Baseline",
		GENERALIZATION_CHALLENGE: "Generalization Challenge",
		DOMAIN_ADAPTATION: "Domain Adaptation",
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Confusion Matrix Analysis</CardTitle>
				<CardDescription>
					Detailed confusion matrix breakdown for each scenario
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
					{validEvaluations.map(([scenario, evaluation]) => {
						const confusion = evaluation!.evaluation_metrics!.confusion_matrix!;
						const { true_positive_rate, false_positive_rate, false_negative_rate, true_negative_rate } = confusion;

						return (
							<div key={scenario} className="p-4 border rounded-lg">
								<h4 className="font-medium text-center mb-4">
									{scenarioLabels[scenario as keyof typeof scenarioLabels]}
								</h4>
								<div className="grid grid-cols-3 gap-2 text-sm">
									<div></div>
									<div className="text-center font-medium">Predicted</div>
									<div></div>
									<div></div>
									<div className="text-center text-xs text-muted-foreground">Positive</div>
									<div className="text-center text-xs text-muted-foreground">Negative</div>
									<div className="text-xs text-muted-foreground self-center">
										<div>Actual</div>
										<div>Positive</div>
									</div>
									<div className="bg-green-100 border border-green-300 p-2 rounded text-center">
										<div className="font-bold text-green-700">TP</div>
										<div className="text-xs">{(true_positive_rate * 100).toFixed(1)}%</div>
									</div>
									<div className="bg-red-100 border border-red-300 p-2 rounded text-center">
										<div className="font-bold text-red-700">FN</div>
										<div className="text-xs">{(false_negative_rate * 100).toFixed(1)}%</div>
									</div>
									<div className="text-xs text-muted-foreground self-center">
										<div>Actual</div>
										<div>Negative</div>
									</div>
									<div className="bg-red-100 border border-red-300 p-2 rounded text-center">
										<div className="font-bold text-red-700">FP</div>
										<div className="text-xs">{(false_positive_rate * 100).toFixed(1)}%</div>
									</div>
									<div className="bg-green-100 border border-green-300 p-2 rounded text-center">
										<div className="font-bold text-green-700">TN</div>
										<div className="text-xs">{(true_negative_rate * 100).toFixed(1)}%</div>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</CardContent>
		</Card>
	);
};

// 內聯組件：ROC 曲線視圖
const ROCCurveView = ({ 
	selectedEvaluations 
}: { 
	selectedEvaluations: { [key: string]: EvaluationRun | undefined } 
}) => {
	const validEvaluations = Object.entries(selectedEvaluations).filter(
		([, evaluation]) => evaluation?.evaluation_metrics
	);

	if (validEvaluations.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>ROC Curve Analysis</CardTitle>
					<CardDescription>
						Receiver Operating Characteristic curves for scenario comparison
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex items-center justify-center h-64 text-muted-foreground">
						No evaluation data available for ROC analysis
					</div>
				</CardContent>
			</Card>
		);
	}

	const scenarioLabels = {
		ERM_BASELINE: "ERM Baseline",
		GENERALIZATION_CHALLENGE: "Generalization Challenge",
		DOMAIN_ADAPTATION: "Domain Adaptation",
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>ROC Curve Analysis</CardTitle>
				<CardDescription>
					Receiver Operating Characteristic curves for scenario comparison
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-6">
					{/* AUC 摘要 */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						{validEvaluations.map(([scenario, evaluation]) => (
							<div key={scenario} className="text-center p-4 border rounded-lg">
								<div className="text-sm text-muted-foreground mb-1">
									{scenarioLabels[scenario as keyof typeof scenarioLabels]}
								</div>
								<div className="text-2xl font-bold">
									{evaluation!.evaluation_metrics!.auc_roc?.toFixed(3) || "N/A"}
								</div>
								<div className="text-xs text-muted-foreground">AUC-ROC</div>
								{evaluation!.evaluation_metrics!.auc_pr && (
									<div className="mt-2">
										<Badge variant="outline" className="text-xs">
											AUC-PR: {evaluation!.evaluation_metrics!.auc_pr.toFixed(3)}
										</Badge>
									</div>
								)}
							</div>
						))}
					</div>

					{/* 性能排名 */}
					<div className="p-4 bg-muted/50 rounded-lg">
						<h5 className="font-medium mb-2">Performance Ranking by AUC-ROC</h5>
						<div className="space-y-1">
							{validEvaluations
								.sort(([,a], [,b]) => (b!.evaluation_metrics!.auc_roc || 0) - (a!.evaluation_metrics!.auc_roc || 0))
								.map(([scenario, evaluation], index) => (
									<div key={scenario} className="flex items-center justify-between text-sm">
										<span className="flex items-center gap-2">
											<span className="font-medium">#{index + 1}</span>
											<span>
												{scenarioLabels[scenario as keyof typeof scenarioLabels]}
											</span>
										</span>
										<span className="font-mono">
											AUC: {evaluation!.evaluation_metrics!.auc_roc?.toFixed(3) || "N/A"}
										</span>
									</div>
								))}
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

// 內聯組件：雷達圖視圖
const RadarChartView = ({ 
	selectedEvaluations 
}: { 
	selectedEvaluations: { [key: string]: EvaluationRun | undefined } 
}) => {
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

	const scenarioLabels = {
		ERM_BASELINE: "ERM Baseline",
		GENERALIZATION_CHALLENGE: "Generalization Challenge",
		DOMAIN_ADAPTATION: "Domain Adaptation",
	};

	// 計算綜合得分
	const overallScores = validEvaluations.map(([scenario, evaluation]) => {
		const metrics = evaluation!.evaluation_metrics!;
		const scores = [
			metrics.f1_score,
			metrics.precision,
			metrics.recall,
			metrics.accuracy,
			metrics.auc_roc || 0
		].filter(Boolean);
		const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
		return { 
			scenario: scenarioLabels[scenario as keyof typeof scenarioLabels], 
			score: average 
		};
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
					{/* 綜合排名 */}
					<div>
						<h4 className="font-medium mb-3">Overall Performance Ranking</h4>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							{overallScores.map((item, index) => (
								<div 
									key={item.scenario}
									className="flex items-center justify-between p-3 border rounded-lg"
								>
									<div className="flex items-center gap-2">
										<div className="font-bold text-lg">#{index + 1}</div>
										<div>
											<div className="font-medium text-sm">
												{item.scenario}
											</div>
											<div className="text-xs text-muted-foreground">
												Avg Score: {(item.score * 100).toFixed(1)}%
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* 詳細指標表格 */}
					<div className="overflow-x-auto">
						<table className="w-full border-collapse border border-gray-200 text-sm">
							<thead>
								<tr className="bg-gray-50">
									<th className="border border-gray-200 px-3 py-2 text-left">Metric</th>
									{validEvaluations.map(([scenario]) => (
										<th key={scenario} className="border border-gray-200 px-3 py-2 text-left">
											{scenarioLabels[scenario as keyof typeof scenarioLabels]}
										</th>
									))}
									<th className="border border-gray-200 px-3 py-2 text-left">Best</th>
								</tr>
							</thead>
							<tbody>
								{['f1_score', 'precision', 'recall', 'accuracy', 'auc_roc'].map((metric) => {
									const values = validEvaluations.map(([, evaluation]) => 
										evaluation && evaluation.evaluation_metrics 
											? evaluation.evaluation_metrics[metric as keyof typeof evaluation.evaluation_metrics] as number || 0
											: 0
									);
									const maxValue = Math.max(...values);
									const bestIndex = values.indexOf(maxValue);
									const bestScenario = validEvaluations[bestIndex]?.[0];

									return (
										<tr key={metric}>
											<td className="border border-gray-200 px-3 py-2 font-medium capitalize">
												{metric.replace('_', ' ')}
											</td>
											{validEvaluations.map(([scenario, evaluation], index) => {
												if (!evaluation || !evaluation.evaluation_metrics) return (
													<td key={scenario} className="border border-gray-200 px-3 py-2">—</td>
												);
												const value = evaluation.evaluation_metrics[metric as keyof typeof evaluation.evaluation_metrics] as number;
												const isBest = index === bestIndex;
												return (
													<td 
														key={scenario} 
														className={`border border-gray-200 px-3 py-2 ${
															isBest ? 'bg-green-50 font-medium' : ''
														}`}
													>
														{value ? `${(value * 100).toFixed(1)}%` : "—"}
													</td>
												);
											})}
											<td className="border border-gray-200 px-3 py-2 text-green-600 font-medium">
												{bestScenario ? scenarioLabels[bestScenario as keyof typeof scenarioLabels].split(' ')[0] : '—'}
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

// 主要組件
export default function Stage4ResultsAnalysis({
	experiments,
}: {
	experiments: ExperimentHistory[];
}) {
	const [selectedEvaluations, setSelectedEvaluations] = useState<{
		[key: string]: EvaluationRun | undefined;
	}>({
		ERM_BASELINE: undefined,
		GENERALIZATION_CHALLENGE: undefined,
		DOMAIN_ADAPTATION: undefined,
	});

	// 獲取每個情境的評估運行
	const evaluationsByScenario = useMemo(() => {
		console.log('Processing experiments:', experiments);
		const scenarioMap: { [key: string]: EvaluationRun[] } = {
			ERM_BASELINE: [],
			GENERALIZATION_CHALLENGE: [],
			DOMAIN_ADAPTATION: [],
		};

		experiments.forEach((experiment, index) => {
			console.log(`Experiment ${index}:`, experiment);
			// Access evaluation_runs from ExperimentHistory structure
			const evaluationRuns = experiment.evaluation_runs;
			console.log(`Evaluation runs in experiment ${index}:`, evaluationRuns);
			
			evaluationRuns?.forEach((evaluation, evalIndex) => {
				console.log(`Evaluation ${evalIndex} in experiment ${index}:`, evaluation);
				console.log(`Scenario type: "${evaluation.scenario_type}"`);
				
				if (evaluation.scenario_type && scenarioMap[evaluation.scenario_type]) {
					console.log(`Adding evaluation to ${evaluation.scenario_type}`);
					scenarioMap[evaluation.scenario_type].push(evaluation);
				} else {
					console.log(`Scenario type "${evaluation.scenario_type}" not found in scenarioMap or is undefined`);
				}
			});
		});

		console.log('Final scenarioMap:', scenarioMap);
		return scenarioMap;
	}, [experiments]);

	// 處理選擇變更
	const handleSelectionChange = (scenario: string, evaluationId: string) => {
		const evaluation = evaluationsByScenario[scenario]?.find(
			(e) => e.id === evaluationId
		);
		setSelectedEvaluations((prev) => ({
			...prev,
			[scenario]: evaluation,
		}));
	};

	// 統計信息
	const stats = useMemo(() => {
		const selectedCount = Object.values(selectedEvaluations).filter(Boolean).length;
		const totalAvailable = Object.values(evaluationsByScenario).reduce(
			(sum, evals) => sum + evals.length,
			0
		);

		return { selectedCount, totalAvailable };
	}, [selectedEvaluations, evaluationsByScenario]);

	const scenarioLabels = {
		ERM_BASELINE: "ERM Baseline",
		GENERALIZATION_CHALLENGE: "Generalization Challenge",
		DOMAIN_ADAPTATION: "Domain Adaptation",
	};

	console.log('evaluationsByScenario',evaluationsByScenario)
	console.log('experiments data:', experiments)
	console.log('experiments[0]:', experiments[0])

	return (
		<div className="space-y-6">
			{/* 標題和統計 */}
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold tracking-tight">Results Analysis</h2>
					<p className="text-muted-foreground">
						Compare evaluation results across different scenarios
					</p>
				</div>
				<div className="text-right">
					<div className="text-sm text-muted-foreground">
						{stats.selectedCount} of 3 scenarios selected
					</div>
					<div className="text-xs text-muted-foreground">
						{stats.totalAvailable} total evaluations available
					</div>
				</div>
			</div>

			{/* 情境選擇器 */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<GitCompare className="h-5 w-5" />
						Scenario Selection
					</CardTitle>
					<CardDescription>
						Select evaluation runs for each scenario to compare their performance
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						{Object.entries(scenarioLabels).map(([scenario, label]) => (
							<div key={scenario} className="space-y-2">
								<label className="text-sm font-medium">{label}</label>
								<Select
									value={selectedEvaluations[scenario]?.id || ""}
									onValueChange={(value) => handleSelectionChange(scenario, value)}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder={`Select ${label}`} />
									</SelectTrigger>
									<SelectContent>
										{evaluationsByScenario[scenario]?.map((evaluation) => (
											<SelectItem key={evaluation.id} value={evaluation.id}>
												<div className="flex items-center justify-between w-full">
													<span className="truncate">
														Run {evaluation.id.slice(-8)}
													</span>
													{evaluation.evaluation_metrics?.f1_score && (
														<Badge variant="outline" className="ml-2 text-xs">
															F1: {(evaluation.evaluation_metrics.f1_score * 100).toFixed(1)}%
														</Badge>
													)}
												</div>
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<div className="text-xs text-muted-foreground">
									{evaluationsByScenario[scenario]?.length || 0} evaluations available
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* 比較圖表 */}
			{stats.selectedCount > 0 ? (
				<Tabs defaultValue="metrics" className="space-y-4">
					<TabsList className="grid w-full grid-cols-4">
						<TabsTrigger value="metrics" className="flex items-center gap-2">
							<BarChart className="h-4 w-4" />
							Metrics
						</TabsTrigger>
						<TabsTrigger value="confusion" className="flex items-center gap-2">
							<PieChart className="h-4 w-4" />
							Confusion Matrix
						</TabsTrigger>
						<TabsTrigger value="roc" className="flex items-center gap-2">
							<LineChart className="h-4 w-4" />
							ROC Analysis
						</TabsTrigger>
						<TabsTrigger value="radar" className="flex items-center gap-2">
							<RefreshCw className="h-4 w-4" />
							Overall Comparison
						</TabsTrigger>
					</TabsList>

					<TabsContent value="metrics">
						<MetricsComparisonView selectedEvaluations={selectedEvaluations} />
					</TabsContent>

					<TabsContent value="confusion">
						<ConfusionMatrixView selectedEvaluations={selectedEvaluations} />
					</TabsContent>

					<TabsContent value="roc">
						<ROCCurveView selectedEvaluations={selectedEvaluations} />
					</TabsContent>

					<TabsContent value="radar">
						<RadarChartView selectedEvaluations={selectedEvaluations} />
					</TabsContent>
				</Tabs>
			) : (
				<Card>
					<CardContent className="flex items-center justify-center h-64">
						<div className="text-center space-y-2">
							<GitCompare className="h-12 w-12 text-muted-foreground mx-auto" />
							<h3 className="text-lg font-medium">No Scenarios Selected</h3>
							<p className="text-muted-foreground">
								Please select at least one evaluation run from the scenarios above to view comparisons.
							</p>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
