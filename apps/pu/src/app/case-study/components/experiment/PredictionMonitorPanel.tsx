"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { X } from "lucide-react";

interface PredictionMonitorPanelProps {
	predictionProgress: number;
	currentStep?: number;
	totalSteps?: number;
	stage?: string;
	message?: string;
	onClose?: () => void; // 添加可選的關閉回調
}

export function PredictionMonitorPanel({
	predictionProgress,
	currentStep = 0,
	totalSteps = 100,
	stage = "",
	message = "",
	onClose,
}: PredictionMonitorPanelProps) {
	// 決定進度條顏色和狀態
	const isCompleted = predictionProgress >= 100 || stage === "completed";
	const isFailed = stage === "failed";

	const getProgressColor = () => {
		if (isFailed) {
			return "bg-red-500";
		}
		if (isCompleted) {
			return "bg-green-500";
		}
		return "bg-blue-500";
	};

	return (
		<Card
			className={`${isCompleted ? "border-green-200 bg-green-50" : isFailed ? "border-red-200 bg-red-50" : ""}`}
		>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle
						className={`text-sm font-medium ${isCompleted ? "text-green-700" : isFailed ? "text-red-700" : "text-slate-700"}`}
					>
						{isCompleted
							? "✅ Evaluation Completed"
							: isFailed
								? "❌ Evaluation Failed"
								: "🔄 Evaluation Monitor"}
					</CardTitle>
					{onClose && (isCompleted || isFailed) && (
						<Button
							variant="ghost"
							size="sm"
							onClick={onClose}
							className="h-6 w-6 p-0"
						>
							<X className="h-4 w-4" />
						</Button>
					)}
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Prediction Progress */}
				<div className="space-y-2">
					<div className="flex justify-between items-center text-sm">
						<span>Evaluation Progress</span>
						<span
							className={`font-medium ${isCompleted ? "text-green-600" : isFailed ? "text-red-600" : "text-blue-600"}`}
						>
							{Math.round(predictionProgress)}%
						</span>
					</div>
					<Progress
						value={predictionProgress}
						className={`w-full ${getProgressColor()}`}
					/>
				</div>

				{/* Step Progress */}
				{totalSteps > 0 && (
					<div className="space-y-2">
						<div className="flex justify-between items-center text-sm">
							<span>Step Progress</span>
							<span>
								{currentStep}/{totalSteps}
							</span>
						</div>
						<Progress
							value={(currentStep / totalSteps) * 100}
							className="w-full"
						/>
					</div>
				)}

				{/* Current Stage */}
				{stage && (
					<div className="text-sm">
						<span className="font-medium text-slate-600">
							Stage:{" "}
						</span>
						<span
							className={`font-medium ${isCompleted ? "text-green-700" : isFailed ? "text-red-700" : "text-blue-700"}`}
						>
							{stage}
						</span>
					</div>
				)}

				{/* Status Message */}
				{message && (
					<div className="text-sm">
						<span className="font-medium text-slate-600">
							Status:{" "}
						</span>
						<span
							className={`${isCompleted ? "text-green-800" : isFailed ? "text-red-800" : "text-slate-800"}`}
						>
							{message}
						</span>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
