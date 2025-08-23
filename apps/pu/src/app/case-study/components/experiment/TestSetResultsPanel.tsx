"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Target, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { KPIMetricsCards } from "./KPIMetricsCards";
import { ModelEvaluationPanel } from "./ModelEvaluationPanel";

interface TestMetrics {
	test_accuracy?: number;
	test_precision?: number;
	test_recall?: number;
	test_f1?: number;
}

interface ConfusionMatrixData {
	tp: number; // True Positive
	fp: number; // False Positive
	tn: number; // True Negative
	fn: number; // False Negative
}

interface TestSetResultsPanelProps {
	modelId?: string;
	testMetrics?: TestMetrics;
	testSampleCount?: number;
}

export function TestSetResultsPanel({
	modelId,
	testMetrics,
	testSampleCount,
}: TestSetResultsPanelProps) {
	const [modelData, setModelData] = useState<any>(null);
	const [loading, setLoading] = useState(false);

	// Load model details if modelId is provided
	useEffect(() => {
		if (!modelId) {
			return;
		}

		const fetchModelData = async () => {
			setLoading(true);
			try {
				const response = await fetch(
					`http://localhost:8000/api/v1/models/${modelId}`,
				);
				if (response.ok) {
					const data = await response.json();
					setModelData(data.data);
				}
			} catch (error) {
				console.error("Failed to fetch model data:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchModelData();
	}, [modelId]);

	// Get test metrics from either props or model data
	const effectiveTestMetrics =
		testMetrics || modelData?.metrics?.test_metrics;
	const effectiveTestSampleCount =
		testSampleCount || modelData?.metrics?.test_sample_count;

	// Get confusion matrix from model data if available
	const confusionMatrix =
		effectiveTestMetrics?.confusion_matrix ||
		generateConfusionMatrix(effectiveTestMetrics, effectiveTestSampleCount);

	// Generate mock confusion matrix based on test metrics (fallback)
	function generateConfusionMatrix(
		metrics: TestMetrics | undefined,
		sampleCount: number | undefined,
	): ConfusionMatrixData | undefined {
		if (
			!metrics?.test_accuracy ||
			!metrics?.test_precision ||
			!metrics?.test_recall ||
			!sampleCount ||
			sampleCount <= 0
		) {
			return undefined;
		}

		// 假設 10% 的樣本是正類（異常）
		const positives = Math.round(sampleCount * 0.1);
		const negatives = sampleCount - positives;

		// 根據 recall 計算 TP
		const tp = Math.round(positives * metrics.test_recall);
		const fn = positives - tp;

		// 根據 precision 計算 FP
		const totalPredictedPositives = tp / (metrics.test_precision || 1);
		const fp = Math.round(totalPredictedPositives - tp);
		const tn = negatives - fp;

		return { tp, fp, tn, fn };
	}

	if (!effectiveTestMetrics) {
		return (
			<Card className="border border-gray-200">
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-lg">
						<Target className="h-5 w-5" />
						Test Set Evaluation
					</CardTitle>
				</CardHeader>
				<CardContent>
					<Alert>
						<AlertDescription>
							No test set evaluation available. This could be
							because:
							<ul className="list-disc list-inside mt-2 ml-4">
								<li>
									Data split was not enabled during training
								</li>
								<li>Test set was empty or too small</li>
								<li>Model training is still in progress</li>
							</ul>
						</AlertDescription>
					</Alert>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="space-y-4">
			{/* Performance KPI Cards - Replaces original metric display */}
			<KPIMetricsCards
				testMetrics={effectiveTestMetrics}
				confusionMatrix={confusionMatrix}
				testSampleCount={effectiveTestSampleCount}
			/>

			{/* Retain original detailed results card */}
			<Card className="border border-green-200 bg-green-50/30">
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-lg">
						<Target className="h-5 w-5" />
						Detailed Test Results Analysis
					</CardTitle>
					<div className="text-sm text-gray-600">
						Final model performance evaluation on test set (
						{effectiveTestSampleCount || 0} samples)
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* Success indicator */}
					<Alert className="bg-green-50 border-green-200">
						<CheckCircle className="h-4 w-4 text-green-600" />
						<AlertDescription className="text-green-700">
							Test set evaluation completed successfully! These
							metrics represent unbiased performance on data that
							was never seen during training.
						</AlertDescription>
					</Alert>

					{/* Performance interpretation */}
					<div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
						<h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
							<TrendingUp className="h-4 w-4" />
							Performance Interpretation
						</h4>
						<div className="text-sm text-blue-700 space-y-1">
							<p>
								<strong>Accuracy:</strong>{" "}
								{formatMetric(
									effectiveTestMetrics.test_accuracy,
								)}{" "}
								of predictions were correct
							</p>
							<p>
								<strong>Precision:</strong>{" "}
								{formatMetric(
									effectiveTestMetrics.test_precision,
								)}{" "}
								of predicted anomalies were actually anomalies
							</p>
							<p>
								<strong>Recall:</strong>{" "}
								{formatMetric(effectiveTestMetrics.test_recall)}{" "}
								of actual anomalies were successfully detected
							</p>
							{effectiveTestMetrics.test_f1 && (
								<p>
									<strong>F1 Score:</strong>{" "}
									{formatMetric(effectiveTestMetrics.test_f1)}{" "}
									represents the harmonic mean of precision
									and recall
								</p>
							)}
						</div>
					</div>

					{/* Data split note */}
					<div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
						<strong>Note:</strong> These metrics are computed on the
						test set that was held out during training. This ensures
						an unbiased evaluation of the model's generalization
						capability.
					</div>
				</CardContent>
			</Card>

			{/* Model Evaluation Panel - 新增的評估歷史和泛化挑戰 */}
			{modelId && (
				<ModelEvaluationPanel
					modelId={modelId}
					modelName={modelData?.name || "Unknown Model"}
					modelScenarioType={
						modelData?.scenario_type || "ERM_BASELINE"
					}
				/>
			)}
		</div>
	);

	function formatMetric(value: number | undefined) {
		return value !== undefined ? `${(value * 100).toFixed(2)}%` : "N/A";
	}
}
