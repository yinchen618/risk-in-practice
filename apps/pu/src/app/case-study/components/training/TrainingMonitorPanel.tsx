"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Activity, CheckCircle } from "lucide-react";

interface TrainingLog {
	epoch: number;
	loss: number;
	accuracy?: number;
}

type TrainingStage = "ready" | "training" | "completed";

interface TrainingMonitorPanelProps {
	trainingStage: TrainingStage;
	trainingProgress: number;
	currentEpoch: number;
	totalEpochs: number;
	trainingLogs: TrainingLog[];
	pSampleCount?: number; // 載入狀態: undefined = 載入中, number = 已載入
	uSampleCount?: number;
	uSampleProgress?: number; // U 樣本生成進度 0-100
	modelName?: string; // 模型名稱
}

export function TrainingMonitorPanel({
	trainingStage,
	trainingProgress,
	currentEpoch,
	totalEpochs,
	trainingLogs,
	pSampleCount,
	uSampleCount,
	uSampleProgress,
	modelName,
}: TrainingMonitorPanelProps) {
	// 調試日誌
	console.log("TrainingMonitorPanel props:", {
		trainingStage,
		trainingProgress,
		pSampleCount,
		uSampleCount,
		uSampleProgress,
		modelName,
	});

	return (
		<Card className="h-full">
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-lg">
					<Activity className="h-5 w-5" />
					Training Monitor
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Model Information */}
				<div className="space-y-2">
					<h4 className="text-sm font-medium text-gray-700">
						Model Information
					</h4>
					<div className="p-3 bg-gray-50 rounded-lg border">
						<div className="text-sm">
							<span className="font-medium">Model:</span>{" "}
							{modelName || "PU Learning Model"}
						</div>
					</div>
				</div>

				{/* Sample Counts */}
				<div className="space-y-2">
					<h4 className="text-sm font-medium text-gray-700">
						Training Data
					</h4>
					<div className="grid grid-cols-2 gap-3">
						{/* P Samples */}
						<div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
							<div className="text-sm text-blue-600 font-medium">
								Positive Samples
							</div>
							<div className="text-xl font-bold text-blue-800">
								{pSampleCount !== undefined
									? pSampleCount
									: "Loading..."}
							</div>
						</div>

						{/* U Samples */}
						<div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
							<div className="text-sm text-purple-600 font-medium">
								Unlabeled Samples
							</div>
							<div className="text-xl font-bold text-purple-800">
								{uSampleCount !== undefined
									? uSampleCount
									: "Generating..."}
							</div>
							{uSampleProgress !== undefined && (
								<div className="mt-2 space-y-1">
									<Progress
										value={uSampleProgress}
										className="h-1"
									/>
									<div className="text-xs text-purple-600 text-right">
										{uSampleProgress.toFixed(1)}%
									</div>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Training Progress */}
				<div className="space-y-2">
					<div className="flex justify-between text-sm">
						<span>Training Progress</span>
						<span>{Math.round(trainingProgress)}%</span>
					</div>
					<Progress value={trainingProgress} className="w-full" />
					{currentEpoch > 0 && (
						<div className="text-sm text-gray-600 text-center">
							Epoch: {currentEpoch} / {totalEpochs}
						</div>
					)}
				</div>

				{/* Real-time Metrics */}
				{trainingLogs.length > 0 && (
					<div className="grid grid-cols-2 gap-4">
						<div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
							<div className="text-sm text-blue-600 font-medium">
								Training Loss
							</div>
							<div className="text-xl font-bold text-blue-800">
								{trainingLogs[
									trainingLogs.length - 1
								]?.loss.toFixed(4) || "N/A"}
							</div>
						</div>
						{trainingLogs[trainingLogs.length - 1]?.accuracy && (
							<div className="p-3 bg-green-50 rounded-lg border border-green-200">
								<div className="text-sm text-green-600 font-medium">
									Accuracy
								</div>
								<div className="text-xl font-bold text-green-800">
									{(
										(trainingLogs[trainingLogs.length - 1]
											?.accuracy || 0) * 100
									).toFixed(1)}
									%
								</div>
							</div>
						)}
					</div>
				)}

				{/* Loss Curve */}
				{trainingLogs.length > 1 && (
					<div className="space-y-2">
						<h4 className="text-sm font-medium text-gray-700">
							Loss Curve
						</h4>
						<div className="border rounded-lg p-4 bg-gray-50">
							<svg
								width="100%"
								height="200"
								viewBox="0 0 400 200"
								className="border bg-white rounded"
								role="img"
								aria-label="Training loss curve"
							>
								{/* Training loss curve */}
								{trainingLogs.length > 1 && (
									<polyline
										fill="none"
										stroke="#3B82F6"
										strokeWidth="2"
										points={trainingLogs
											.map(
												(log, idx) =>
													`${(idx / (trainingLogs.length - 1)) * 380 + 20},${200 - (log.loss * 150) - 20}`,
											)
											.join(" ")}
									/>
								)}
							</svg>
						</div>
					</div>
				)}

				{trainingStage === "completed" && (
					<Alert className="bg-green-50 border-green-200">
						<CheckCircle className="h-4 w-4 text-green-600" />
						<AlertDescription className="text-green-700">
							Training completed successfully! Model is ready for
							prediction.
						</AlertDescription>
					</Alert>
				)}
			</CardContent>
		</Card>
	);
}
