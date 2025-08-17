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

type TrainingStage =
	| "ready"
	| "training"
	| "completed"
	| "failed"
	| "predicting";

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
	currentStage?: string; // 目前進行的階段
	currentSubstage?: string; // 目前進行的子階段
	hyperparameters?: {
		model_type: string;
		prior_method: string;
		class_prior?: number;
		hidden_units: number;
		activation: string;
		lambda_reg: number;
		optimizer: string;
		learning_rate: number;
		epochs: number;
		batch_size: number;
		seed: number;
		feature_version: string;
	};
	dataSplitInfo?: {
		train_samples?: number;
		validation_samples?: number;
		test_samples?: number;
		train_p_samples?: number;
		validation_p_samples?: number;
		test_p_samples?: number;
		split_enabled?: boolean;
	};
	onStartPrediction?: () => void; // 新增預測回調
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
	currentStage,
	currentSubstage,
	hyperparameters,
	dataSplitInfo,
	onStartPrediction,
}: TrainingMonitorPanelProps) {
	// 調試日誌
	console.log("TrainingMonitorPanel props:", {
		trainingStage,
		trainingProgress,
		pSampleCount,
		uSampleCount,
		uSampleProgress,
		modelName,
		hyperparameters,
		trainingLogs: trainingLogs.length,
		hasHyperparameters: !!hyperparameters,
		hasTrainingLogs: trainingLogs.length > 0,
	});

	return (
		<Card className="">
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

				{/* Training Stage Information */}
				{(currentStage || currentSubstage) && (
					<div className="space-y-2">
						<h4 className="text-sm font-medium text-gray-700">
							Training Stage
						</h4>
						<div className="p-3 bg-green-50 rounded-lg border border-green-200">
							<div className="text-sm">
								{currentStage && (
									<div>
										<span className="font-medium">
											Current Stage:
										</span>{" "}
										<span className="text-green-700">
											{currentStage}
										</span>
									</div>
								)}
								{currentSubstage && (
									<div>
										<span className="font-medium">
											Substage:
										</span>{" "}
										<span className="text-green-600">
											{currentSubstage}
										</span>
									</div>
								)}
							</div>
						</div>
					</div>
				)}

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

				{/* Data Split Information */}
				{dataSplitInfo?.split_enabled && (
					<div className="space-y-2">
						<h4 className="text-sm font-medium text-gray-700">
							Data Split Distribution
						</h4>
						<div className="grid grid-cols-3 gap-2 text-xs">
							{/* Training Set */}
							<div className="p-2 bg-green-50 rounded border border-green-200">
								<div className="font-medium text-green-700">
									Training Set
								</div>
								<div className="text-green-800">
									Total: {dataSplitInfo.train_samples || 0}
								</div>
								<div className="text-green-600">
									P: {dataSplitInfo.train_p_samples || 0} | U:{" "}
									{(dataSplitInfo.train_samples || 0) -
										(dataSplitInfo.train_p_samples || 0)}
								</div>
							</div>

							{/* Validation Set */}
							<div className="p-2 bg-yellow-50 rounded border border-yellow-200">
								<div className="font-medium text-yellow-700">
									Validation Set
								</div>
								<div className="text-yellow-800">
									Total:{" "}
									{dataSplitInfo.validation_samples || 0}
								</div>
								<div className="text-yellow-600">
									P: {dataSplitInfo.validation_p_samples || 0}{" "}
									| U:{" "}
									{(dataSplitInfo.validation_samples || 0) -
										(dataSplitInfo.validation_p_samples ||
											0)}
								</div>
							</div>

							{/* Test Set */}
							<div className="p-2 bg-orange-50 rounded border border-orange-200">
								<div className="font-medium text-orange-700">
									Test Set
								</div>
								<div className="text-orange-800">
									Total: {dataSplitInfo.test_samples || 0}
								</div>
								<div className="text-orange-600">
									P: {dataSplitInfo.test_p_samples || 0} | U:{" "}
									{(dataSplitInfo.test_samples || 0) -
										(dataSplitInfo.test_p_samples || 0)}
								</div>
							</div>
						</div>
						<div className="text-xs text-gray-500 bg-blue-50 p-2 rounded">
							<strong>Note:</strong> Data split ensures proper
							model evaluation without data leakage between
							training, validation, and test sets.
						</div>
					</div>
				)}

				{/* Hyperparameters */}
				{hyperparameters && (
					<div className="space-y-2">
						<h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
							<Activity className="h-4 w-4" />
							Training Hyperparameters
						</h4>
						<div className="grid grid-cols-2 gap-2 text-xs">
							<div className="p-2 bg-gray-50 rounded border">
								<div className="font-medium text-gray-700">
									Model Type
								</div>
								<div className="text-gray-800">
									{hyperparameters.model_type}
								</div>
							</div>
							<div className="p-2 bg-gray-50 rounded border">
								<div className="font-medium text-gray-700">
									Prior Method
								</div>
								<div className="text-gray-800">
									{hyperparameters.prior_method}
								</div>
							</div>
							<div className="p-2 bg-gray-50 rounded border">
								<div className="font-medium text-gray-700">
									Hidden Units
								</div>
								<div className="text-gray-800">
									{hyperparameters.hidden_units}
								</div>
							</div>
							<div className="p-2 bg-gray-50 rounded border">
								<div className="font-medium text-gray-700">
									Learning Rate
								</div>
								<div className="text-gray-800">
									{hyperparameters.learning_rate}
								</div>
							</div>
							<div className="p-2 bg-gray-50 rounded border">
								<div className="font-medium text-gray-700">
									Epochs
								</div>
								<div className="text-gray-800">
									{hyperparameters.epochs}
								</div>
							</div>
							<div className="p-2 bg-gray-50 rounded border">
								<div className="font-medium text-gray-700">
									Batch Size
								</div>
								<div className="text-gray-800">
									{hyperparameters.batch_size}
								</div>
							</div>
							<div className="p-2 bg-gray-50 rounded border">
								<div className="font-medium text-gray-700">
									Optimizer
								</div>
								<div className="text-gray-800">
									{hyperparameters.optimizer}
								</div>
							</div>
							<div className="p-2 bg-gray-50 rounded border">
								<div className="font-medium text-gray-700">
									Lambda Reg
								</div>
								<div className="text-gray-800">
									{hyperparameters.lambda_reg}
								</div>
							</div>
						</div>
					</div>
				)}

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
					<div className="space-y-3">
						<Alert className="bg-green-50 border-green-200">
							<CheckCircle className="h-4 w-4 text-green-600" />
							<AlertDescription className="text-green-700">
								Training completed successfully! Model is ready
								for prediction.
							</AlertDescription>
						</Alert>

						{onStartPrediction && (
							<div className="flex justify-center">
								<button
									type="button"
									onClick={onStartPrediction}
									className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
								>
									<Activity className="h-4 w-4" />
									Start Prediction
								</button>
							</div>
						)}
					</div>
				)}

				{trainingStage === "predicting" && (
					<Alert className="bg-blue-50 border-blue-200">
						<Activity className="h-4 w-4 text-blue-600" />
						<AlertDescription className="text-blue-700">
							Running prediction on test data...
						</AlertDescription>
					</Alert>
				)}
			</CardContent>
		</Card>
	);
}
