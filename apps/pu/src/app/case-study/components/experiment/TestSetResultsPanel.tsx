"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Target, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

interface TestMetrics {
	test_accuracy?: number;
	test_precision?: number;
	test_recall?: number;
	test_f1?: number;
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
		if (!modelId) return;

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
	const effectiveTestMetrics = testMetrics || modelData?.metrics?.test_metrics;
	const effectiveTestSampleCount = testSampleCount || modelData?.metrics?.test_sample_count;

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
							No test set evaluation available. This could be because:
							<ul className="list-disc list-inside mt-2 ml-4">
								<li>Data split was not enabled during training</li>
								<li>Test set was empty or too small</li>
								<li>Model training is still in progress</li>
							</ul>
						</AlertDescription>
					</Alert>
				</CardContent>
			</Card>
		);
	}

	const formatMetric = (value: number | undefined) => {
		return value !== undefined ? (value * 100).toFixed(2) + "%" : "N/A";
	};

	const getMetricColor = (value: number | undefined) => {
		if (value === undefined) return "text-gray-500";
		if (value >= 0.8) return "text-green-600";
		if (value >= 0.6) return "text-yellow-600";
		return "text-red-600";
	};

	const getMetricBadgeVariant = (value: number | undefined): "default" | "secondary" | "destructive" => {
		if (value === undefined) return "secondary";
		if (value >= 0.8) return "default";
		if (value >= 0.6) return "secondary";
		return "destructive";
	};

	return (
		<Card className="border border-green-200 bg-green-50/30">
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-lg">
					<Target className="h-5 w-5" />
					Test Set Evaluation Results
				</CardTitle>
				<div className="text-sm text-gray-600">
					Final model performance on held-out test data ({effectiveTestSampleCount || 0} samples)
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Success indicator */}
				<Alert className="bg-green-50 border-green-200">
					<CheckCircle className="h-4 w-4 text-green-600" />
					<AlertDescription className="text-green-700">
						Test set evaluation completed successfully! These metrics represent 
						unbiased performance on data that was never seen during training.
					</AlertDescription>
				</Alert>

				{/* Metrics grid */}
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
					{/* Accuracy */}
					<div className="p-4 bg-white rounded-lg border border-gray-200">
						<div className="text-sm text-gray-600 font-medium mb-1">Accuracy</div>
						<div className={`text-2xl font-bold ${getMetricColor(effectiveTestMetrics.test_accuracy)}`}>
							{formatMetric(effectiveTestMetrics.test_accuracy)}
						</div>
						<Badge variant={getMetricBadgeVariant(effectiveTestMetrics.test_accuracy)} className="mt-2">
							Overall correctness
						</Badge>
					</div>

					{/* Precision */}
					<div className="p-4 bg-white rounded-lg border border-gray-200">
						<div className="text-sm text-gray-600 font-medium mb-1">Precision</div>
						<div className={`text-2xl font-bold ${getMetricColor(effectiveTestMetrics.test_precision)}`}>
							{formatMetric(effectiveTestMetrics.test_precision)}
						</div>
						<Badge variant={getMetricBadgeVariant(effectiveTestMetrics.test_precision)} className="mt-2">
							Positive prediction quality
						</Badge>
					</div>

					{/* Recall */}
					<div className="p-4 bg-white rounded-lg border border-gray-200">
						<div className="text-sm text-gray-600 font-medium mb-1">Recall</div>
						<div className={`text-2xl font-bold ${getMetricColor(effectiveTestMetrics.test_recall)}`}>
							{formatMetric(effectiveTestMetrics.test_recall)}
						</div>
						<Badge variant={getMetricBadgeVariant(effectiveTestMetrics.test_recall)} className="mt-2">
							Anomaly detection rate
						</Badge>
					</div>

					{/* F1 Score */}
					<div className="p-4 bg-white rounded-lg border border-gray-200">
						<div className="text-sm text-gray-600 font-medium mb-1">F1 Score</div>
						<div className={`text-2xl font-bold ${getMetricColor(effectiveTestMetrics.test_f1)}`}>
							{formatMetric(effectiveTestMetrics.test_f1)}
						</div>
						<Badge variant={getMetricBadgeVariant(effectiveTestMetrics.test_f1)} className="mt-2">
							Balanced performance
						</Badge>
					</div>
				</div>

				{/* Performance interpretation */}
				<div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
					<h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
						<TrendingUp className="h-4 w-4" />
						Performance Interpretation
					</h4>
					<div className="text-sm text-blue-700 space-y-1">
						<p>
							<strong>Accuracy:</strong> {formatMetric(effectiveTestMetrics.test_accuracy)} of all predictions were correct
						</p>
						<p>
							<strong>Precision:</strong> {formatMetric(effectiveTestMetrics.test_precision)} of predicted anomalies were actually anomalies
						</p>
						<p>
							<strong>Recall:</strong> {formatMetric(effectiveTestMetrics.test_recall)} of actual anomalies were successfully detected
						</p>
						{effectiveTestMetrics.test_f1 && (
							<p>
								<strong>F1 Score:</strong> {formatMetric(effectiveTestMetrics.test_f1)} represents the harmonic mean of precision and recall
							</p>
						)}
					</div>
				</div>

				{/* Data split note */}
				<div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
					<strong>Note:</strong> These metrics are computed on the test set that was held out during training. 
					This ensures an unbiased evaluation of the model's generalization capability to unseen data.
				</div>
			</CardContent>
		</Card>
	);
}
