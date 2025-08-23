"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, CheckCircle, Clock, Play, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface EvaluationRun {
	id: string;
	name: string;
	scenario_type: string;
	status: "RUNNING" | "COMPLETED" | "FAILED";
	test_set_source: {
		location?: string;
		timeRange?: string;
		type?: string;
		[key: string]: any;
	};
	evaluation_metrics?: {
		test_accuracy?: number;
		test_precision?: number;
		test_recall?: number;
		test_f1?: number;
		confusion_matrix?: {
			tp: number;
			fp: number;
			tn: number;
			fn: number;
		};
		[key: string]: any;
	};
	created_at: string;
	completed_at?: string;
}

interface ModelEvaluationPanelProps {
	modelId: string;
	modelName?: string;
	modelScenarioType?: string;
}

export function ModelEvaluationPanel({
	modelId,
	modelName = "Unknown Model",
	modelScenarioType = "ERM_BASELINE",
}: ModelEvaluationPanelProps) {
	const [evaluationRuns, setEvaluationRuns] = useState<EvaluationRun[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isEvaluating, setIsEvaluating] = useState(false);

	const loadEvaluationRuns = async () => {
		setIsLoading(true);
		try {
			const response = await fetch(
				`http://localhost:8000/api/v1/models/${modelId}/evaluations`,
			);
			if (response.ok) {
				const data = await response.json();
				setEvaluationRuns(data.data?.evaluations || []);
			} else {
				toast.error("Failed to load evaluation history");
			}
		} catch (error) {
			console.error("Error loading evaluation runs:", error);
			toast.error("Failed to load evaluation history");
		} finally {
			setIsLoading(false);
		}
	};

	const startGeneralizationChallenge = async (targetConfig: {
		location: string;
		timeRange: string;
		selectedFloorsByBuilding?: Record<string, string[]>;
	}) => {
		setIsEvaluating(true);
		try {
			const response = await fetch(
				`http://localhost:8000/api/v1/models/${modelId}/evaluate`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						scenario_type: "GENERALIZATION_CHALLENGE",
						name: `Generalization Challenge - ${targetConfig.location}`,
						test_set_source: {
							type: "cross_domain_evaluation",
							location: targetConfig.location,
							timeRange: targetConfig.timeRange,
							selectedFloorsByBuilding:
								targetConfig.selectedFloorsByBuilding || {
									[targetConfig.location]: ["1", "2", "3"],
								},
							timestamp: new Date().toISOString(),
						},
					}),
				},
			);

			if (response.ok) {
				const result = await response.json();
				toast.success(`Evaluation started: ${result.message}`);
				// 刷新評估列表
				await loadEvaluationRuns();
			} else {
				const error = await response.json();
				toast.error(`Failed to start evaluation: ${error.detail}`);
			}
		} catch (error) {
			console.error("Error starting evaluation:", error);
			toast.error("Failed to start evaluation");
		} finally {
			setIsEvaluating(false);
		}
	};

	useEffect(() => {
		loadEvaluationRuns();
	}, [modelId]);

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "COMPLETED":
				return <CheckCircle className="h-4 w-4 text-green-600" />;
			case "RUNNING":
				return <Clock className="h-4 w-4 text-blue-600" />;
			case "FAILED":
				return <AlertTriangle className="h-4 w-4 text-red-600" />;
			default:
				return <Clock className="h-4 w-4 text-gray-600" />;
		}
	};

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "COMPLETED":
				return (
					<Badge
						variant="default"
						className="bg-green-100 text-green-800"
					>
						Completed
					</Badge>
				);
			case "RUNNING":
				return (
					<Badge
						variant="default"
						className="bg-blue-100 text-blue-800"
					>
						Running
					</Badge>
				);
			case "FAILED":
				return <Badge variant="destructive">Failed</Badge>;
			default:
				return <Badge variant="secondary">Unknown</Badge>;
		}
	};

	const formatMetric = (value: number | undefined) => {
		return value !== undefined ? `${(value * 100).toFixed(2)}%` : "N/A";
	};

	const canStartGeneralizationChallenge =
		modelScenarioType === "ERM_BASELINE";

	return (
		<Card className="border border-gray-200">
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-lg">
					<Target className="h-5 w-5" />
					Model Evaluation History
				</CardTitle>
				<div className="text-sm text-gray-600">
					Model: {modelName} ({modelScenarioType})
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* 泛化挑戰啟動按鈕 */}
				{canStartGeneralizationChallenge && (
					<div className="space-y-2">
						<h4 className="text-sm font-medium">
							Start New Evaluation
						</h4>
						<div className="flex gap-2 flex-wrap">
							<Button
								onClick={() =>
									startGeneralizationChallenge({
										location: "Building_B",
										timeRange: "2024-01-01_to_2024-12-31",
									})
								}
								disabled={isEvaluating}
								size="sm"
								variant="outline"
							>
								<Play className="h-4 w-4 mr-1" />
								Building B Challenge
							</Button>
							<Button
								onClick={() =>
									startGeneralizationChallenge({
										location: "Building_C",
										timeRange: "2024-01-01_to_2024-12-31",
									})
								}
								disabled={isEvaluating}
								size="sm"
								variant="outline"
							>
								<Play className="h-4 w-4 mr-1" />
								Building C Challenge
							</Button>
						</div>
						<Separator />
					</div>
				)}

				{!canStartGeneralizationChallenge && (
					<Alert>
						<AlertTriangle className="h-4 w-4" />
						<AlertDescription>
							Generalization Challenge is only available for
							ERM_BASELINE models. This model was trained with{" "}
							{modelScenarioType}.
						</AlertDescription>
					</Alert>
				)}

				{/* 評估歷史列表 */}
				<div className="space-y-2">
					<h4 className="text-sm font-medium">Evaluation History</h4>

					{isLoading ? (
						<div className="text-sm text-gray-500">
							Loading evaluation history...
						</div>
					) : evaluationRuns.length === 0 ? (
						<div className="text-sm text-gray-500">
							No evaluations performed yet.
						</div>
					) : (
						<div className="space-y-2">
							{evaluationRuns.map((run) => (
								<EvaluationRunCard
									key={run.id}
									evaluationRun={run}
								/>
							))}
						</div>
					)}
				</div>

				{/* 刷新按鈕 */}
				<Button
					onClick={loadEvaluationRuns}
					variant="ghost"
					size="sm"
					disabled={isLoading}
				>
					Refresh
				</Button>
			</CardContent>
		</Card>
	);
}

function EvaluationRunCard({
	evaluationRun,
}: { evaluationRun: EvaluationRun }) {
	const getStatusIcon = (status: string) => {
		switch (status) {
			case "COMPLETED":
				return <CheckCircle className="h-4 w-4 text-green-600" />;
			case "RUNNING":
				return <Clock className="h-4 w-4 text-blue-600" />;
			case "FAILED":
				return <AlertTriangle className="h-4 w-4 text-red-600" />;
			default:
				return <Clock className="h-4 w-4 text-gray-600" />;
		}
	};

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "COMPLETED":
				return (
					<Badge
						variant="default"
						className="bg-green-100 text-green-800"
					>
						Completed
					</Badge>
				);
			case "RUNNING":
				return (
					<Badge
						variant="default"
						className="bg-blue-100 text-blue-800"
					>
						Running
					</Badge>
				);
			case "FAILED":
				return <Badge variant="destructive">Failed</Badge>;
			default:
				return <Badge variant="secondary">Unknown</Badge>;
		}
	};

	const formatMetric = (value: number | undefined) => {
		return value !== undefined ? `${(value * 100).toFixed(2)}%` : "N/A";
	};

	return (
		<Card className="border border-gray-100">
			<CardContent className="p-3">
				<div className="flex items-start justify-between mb-2">
					<div className="flex-1">
						<div className="flex items-center gap-2 mb-1">
							{getStatusIcon(evaluationRun.status)}
							<span className="text-sm font-medium">
								{evaluationRun.name}
							</span>
							{getStatusBadge(evaluationRun.status)}
						</div>
						<div className="text-xs text-gray-500">
							{evaluationRun.test_set_source.location && (
								<span>
									Target:{" "}
									{evaluationRun.test_set_source.location}
								</span>
							)}
							{evaluationRun.test_set_source.timeRange && (
								<span>
									{" "}
									• {evaluationRun.test_set_source.timeRange}
								</span>
							)}
						</div>
						<div className="text-xs text-gray-500">
							Started:{" "}
							{new Date(
								evaluationRun.created_at,
							).toLocaleString()}
						</div>
					</div>
				</div>

				{evaluationRun.status === "COMPLETED" &&
					evaluationRun.evaluation_metrics && (
						<div className="grid grid-cols-2 gap-2 text-xs">
							<div>
								<span className="text-gray-500">Accuracy:</span>{" "}
								{formatMetric(
									evaluationRun.evaluation_metrics
										.test_accuracy,
								)}
							</div>
							<div>
								<span className="text-gray-500">F1-Score:</span>{" "}
								{formatMetric(
									evaluationRun.evaluation_metrics.test_f1,
								)}
							</div>
							<div>
								<span className="text-gray-500">
									Precision:
								</span>{" "}
								{formatMetric(
									evaluationRun.evaluation_metrics
										.test_precision,
								)}
							</div>
							<div>
								<span className="text-gray-500">Recall:</span>{" "}
								{formatMetric(
									evaluationRun.evaluation_metrics
										.test_recall,
								)}
							</div>
						</div>
					)}

				{evaluationRun.status === "RUNNING" && (
					<div className="text-xs text-blue-600">
						Evaluation in progress...
					</div>
				)}

				{evaluationRun.status === "FAILED" && (
					<div className="text-xs text-red-600">
						Evaluation failed. Please check logs.
					</div>
				)}
			</CardContent>
		</Card>
	);
}
