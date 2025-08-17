"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

interface ValidationMetrics {
	val_accuracy: number;
	val_precision: number;
	val_recall: number;
	val_f1: number;
}

interface ValidationSetResultsPanelProps {
	validationMetrics?: ValidationMetrics;
	validationSampleCount?: number;
	modelId?: string;
}

export function ValidationSetResultsPanel({
	validationMetrics,
	validationSampleCount,
	modelId,
}: ValidationSetResultsPanelProps) {
	const [modelData, setModelData] = useState<any>(null);
	const [loading, setLoading] = useState(false);

	// Auto-fetch model data if modelId is provided but validationMetrics is not
	useEffect(() => {
		if (modelId && !validationMetrics) {
			const fetchModelData = async () => {
				setLoading(true);
				try {
					const response = await fetch(
						`http://localhost:8000/api/v1/models/${modelId}`,
					);
					if (response.ok) {
						const data = await response.json();
						setModelData(data);
					}
				} catch (error) {
					console.error("Failed to fetch model data:", error);
				} finally {
					setLoading(false);
				}
			};

			fetchModelData();
		}
	}, [modelId, validationMetrics]);

	// Get validation metrics from either props or model data
	const effectiveValidationMetrics =
		validationMetrics || modelData?.metrics?.validation_metrics;
	const effectiveValidationSampleCount =
		validationSampleCount || modelData?.metrics?.validation_sample_count;

	if (!effectiveValidationMetrics) {
		return null;
	}

	const formatMetric = (value: number) => {
		return `${(value * 100).toFixed(1)}%`;
	};

	const getMetricColor = (value: number) => {
		if (value >= 0.9) return "text-green-600";
		if (value >= 0.8) return "text-blue-600";
		if (value >= 0.7) return "text-yellow-600";
		return "text-red-600";
	};

	const getMetricBadgeVariant = (
		value: number,
	): "default" | "secondary" | "destructive" | "outline" => {
		if (value >= 0.9) return "default";
		if (value >= 0.8) return "secondary";
		if (value >= 0.7) return "outline";
		return "destructive";
	};

	return (
		<Card className="border-blue-200">
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-blue-800">
					<TrendingUp className="h-5 w-5" />
					Validation Set Results
				</CardTitle>
				<div className="text-sm text-blue-600">
					<div className="flex items-center gap-2">
						<CheckCircle className="h-4 w-4" />
						Validation set evaluation completed successfully! These
						metrics represent model performance on held-out
						validation data during training.
						{effectiveValidationSampleCount && (
							<span className="font-medium">
								({effectiveValidationSampleCount} samples)
							</span>
						)}
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					<div className="text-center">
						<div className="text-sm font-medium text-slate-600 mb-1">
							Accuracy
						</div>
						<div
							className={`text-2xl font-bold ${getMetricColor(effectiveValidationMetrics.val_accuracy)}`}
						>
							{formatMetric(
								effectiveValidationMetrics.val_accuracy,
							)}
						</div>
						<Badge
							variant={getMetricBadgeVariant(
								effectiveValidationMetrics.val_accuracy,
							)}
							className="mt-2"
						>
							Overall Performance
						</Badge>
					</div>

					<div className="text-center">
						<div className="text-sm font-medium text-slate-600 mb-1">
							Precision
						</div>
						<div
							className={`text-2xl font-bold ${getMetricColor(effectiveValidationMetrics.val_precision)}`}
						>
							{formatMetric(
								effectiveValidationMetrics.val_precision,
							)}
						</div>
						<Badge
							variant={getMetricBadgeVariant(
								effectiveValidationMetrics.val_precision,
							)}
							className="mt-2"
						>
							Positive Accuracy
						</Badge>
					</div>

					<div className="text-center">
						<div className="text-sm font-medium text-slate-600 mb-1">
							Recall
						</div>
						<div
							className={`text-2xl font-bold ${getMetricColor(effectiveValidationMetrics.val_recall)}`}
						>
							{formatMetric(
								effectiveValidationMetrics.val_recall,
							)}
						</div>
						<Badge
							variant={getMetricBadgeVariant(
								effectiveValidationMetrics.val_recall,
							)}
							className="mt-2"
						>
							Anomaly Detection
						</Badge>
					</div>

					<div className="text-center">
						<div className="text-sm font-medium text-slate-600 mb-1">
							F1-Score
						</div>
						<div
							className={`text-2xl font-bold ${getMetricColor(effectiveValidationMetrics.val_f1)}`}
						>
							{formatMetric(effectiveValidationMetrics.val_f1)}
						</div>
						<Badge
							variant={getMetricBadgeVariant(
								effectiveValidationMetrics.val_f1,
							)}
							className="mt-2"
						>
							Balanced Score
						</Badge>
					</div>
				</div>

				<div className="mt-6 p-4 bg-blue-50 rounded-lg">
					<h4 className="font-medium text-blue-800 mb-2">
						Understanding Validation Metrics
					</h4>
					<div className="text-sm text-blue-700 space-y-1">
						<div>
							<strong>Accuracy:</strong>{" "}
							{formatMetric(
								effectiveValidationMetrics.val_accuracy,
							)}{" "}
							of validation predictions were correct
						</div>
						<div>
							<strong>Precision:</strong>{" "}
							{formatMetric(
								effectiveValidationMetrics.val_precision,
							)}{" "}
							of predicted anomalies were actually anomalies
						</div>
						<div>
							<strong>Recall:</strong>{" "}
							{formatMetric(
								effectiveValidationMetrics.val_recall,
							)}{" "}
							of actual anomalies were correctly detected
						</div>
						<div>
							<strong>F1-Score:</strong> Harmonic mean of
							precision and recall -{" "}
							{formatMetric(effectiveValidationMetrics.val_f1)}
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
