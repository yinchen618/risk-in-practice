"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { EvaluationRun } from "../../types";

interface ConfusionMatrixChartProps {
	selectedEvaluations: { [key: string]: EvaluationRun | undefined };
}

const scenarioLabels = {
	ERM_BASELINE: "ERM Baseline",
	GENERALIZATION_CHALLENGE: "Generalization Challenge",
	DOMAIN_ADAPTATION: "Domain Adaptation",
};

const scenarioColors = {
	ERM_BASELINE: "bg-blue-50 border-blue-200",
	GENERALIZATION_CHALLENGE: "bg-green-50 border-green-200",
	DOMAIN_ADAPTATION: "bg-purple-50 border-purple-200",
};

export function ConfusionMatrixChart({ selectedEvaluations }: ConfusionMatrixChartProps) {
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

	const ConfusionMatrix = ({ 
		confusion, 
		title, 
		colorClass 
	}: { 
		confusion: any; 
		title: string; 
		colorClass: string;
	}) => {
		const { true_positive_rate, false_positive_rate, false_negative_rate, true_negative_rate } = confusion;
		
		// 計算實際數值（假設總樣本數為100以便展示比例）
		const total = 100;
		const tp = Math.round(true_positive_rate * total);
		const fp = Math.round(false_positive_rate * total);
		const fn = Math.round(false_negative_rate * total);
		const tn = Math.round(true_negative_rate * total);

		return (
			<div className={`p-4 rounded-lg border ${colorClass}`}>
				<h4 className="font-medium text-center mb-4">{title}</h4>
				<div className="grid grid-cols-3 gap-2 text-sm">
					{/* 標題行 */}
					<div></div>
					<div className="text-center font-medium">Predicted</div>
					<div></div>
					
					<div></div>
					<div className="text-center text-xs text-muted-foreground">Positive</div>
					<div className="text-center text-xs text-muted-foreground">Negative</div>
					
					{/* Actual Positive 行 */}
					<div className="text-xs text-muted-foreground self-center">
						<div>Actual</div>
						<div>Positive</div>
					</div>
					<div className="bg-green-100 border border-green-300 p-3 rounded text-center">
						<div className="font-bold text-green-700">{tp}</div>
						<div className="text-xs text-green-600">TP</div>
						<div className="text-xs">{(true_positive_rate * 100).toFixed(1)}%</div>
					</div>
					<div className="bg-red-100 border border-red-300 p-3 rounded text-center">
						<div className="font-bold text-red-700">{fn}</div>
						<div className="text-xs text-red-600">FN</div>
						<div className="text-xs">{(false_negative_rate * 100).toFixed(1)}%</div>
					</div>
					
					{/* Actual Negative 行 */}
					<div className="text-xs text-muted-foreground self-center">
						<div>Actual</div>
						<div>Negative</div>
					</div>
					<div className="bg-red-100 border border-red-300 p-3 rounded text-center">
						<div className="font-bold text-red-700">{fp}</div>
						<div className="text-xs text-red-600">FP</div>
						<div className="text-xs">{(false_positive_rate * 100).toFixed(1)}%</div>
					</div>
					<div className="bg-green-100 border border-green-300 p-3 rounded text-center">
						<div className="font-bold text-green-700">{tn}</div>
						<div className="text-xs text-green-600">TN</div>
						<div className="text-xs">{(true_negative_rate * 100).toFixed(1)}%</div>
					</div>
				</div>
				
				{/* 指標摘要 */}
				<div className="mt-4 grid grid-cols-2 gap-2 text-xs">
					<div className="flex justify-between">
						<span>Precision:</span>
						<span className="font-medium">
							{(tp / (tp + fp) * 100).toFixed(1)}%
						</span>
					</div>
					<div className="flex justify-between">
						<span>Recall:</span>
						<span className="font-medium">
							{(tp / (tp + fn) * 100).toFixed(1)}%
						</span>
					</div>
					<div className="flex justify-between">
						<span>Specificity:</span>
						<span className="font-medium">
							{(tn / (tn + fp) * 100).toFixed(1)}%
						</span>
					</div>
					<div className="flex justify-between">
						<span>Accuracy:</span>
						<span className="font-medium">
							{((tp + tn) / total * 100).toFixed(1)}%
						</span>
					</div>
				</div>
			</div>
		);
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
					{validEvaluations.map(([scenario, evaluation]) => (
						<ConfusionMatrix
							key={scenario}
							confusion={evaluation!.evaluation_metrics!.confusion_matrix}
							title={scenarioLabels[scenario as keyof typeof scenarioLabels]}
							colorClass={scenarioColors[scenario as keyof typeof scenarioColors]}
						/>
					))}
				</div>

				{/* 比較摘要 */}
				{validEvaluations.length > 1 && (
					<div className="mt-8 space-y-4">
						<h4 className="font-medium">Comparative Summary</h4>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
							{['Precision', 'Recall', 'Specificity', 'Accuracy'].map((metric) => (
								<div key={metric} className="space-y-2">
									<h5 className="text-sm font-medium text-muted-foreground">{metric}</h5>
									{validEvaluations.map(([scenario, evaluation]) => {
										const confusion = evaluation!.evaluation_metrics!.confusion_matrix;
										const { true_positive_rate, false_positive_rate, false_negative_rate, true_negative_rate } = confusion;
										
										let value: number;
										switch (metric) {
											case 'Precision':
												value = true_positive_rate / (true_positive_rate + false_positive_rate);
												break;
											case 'Recall':
												value = true_positive_rate / (true_positive_rate + false_negative_rate);
												break;
											case 'Specificity':
												value = true_negative_rate / (true_negative_rate + false_positive_rate);
												break;
											case 'Accuracy':
												value = (true_positive_rate + true_negative_rate) / 
													(true_positive_rate + false_positive_rate + false_negative_rate + true_negative_rate);
												break;
											default:
												value = 0;
										}

										return (
											<div key={scenario} className="flex justify-between items-center">
												<span className="text-sm">
													{scenarioLabels[scenario as keyof typeof scenarioLabels].split(' ')[0]}
												</span>
												<Badge variant="outline">
													{(value * 100).toFixed(1)}%
												</Badge>
											</div>
										);
									})}
								</div>
							))}
						</div>
					</div>
				)}

				{/* 圖例說明 */}
				<div className="mt-6 p-4 bg-muted/50 rounded-lg">
					<h5 className="text-sm font-medium mb-2">Legend</h5>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
						<div className="flex items-center gap-2">
							<div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
							<span>True Positive (TP) / True Negative (TN)</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
							<span>False Positive (FP) / False Negative (FN)</span>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
