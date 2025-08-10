"use client";

import { ArrowRight, Target, TrendingUp } from "lucide-react";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import { Button } from "../../../components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "../../../components/ui/card";
import { ResultsPhase } from "./ResultsPhase";

interface Stage4ModelEvaluationProps {
	isTrainingCompleted?: boolean;
	onBackToTraining?: () => void;
}

export function Stage4ModelEvaluation({
	isTrainingCompleted = false,
	onBackToTraining,
}: Stage4ModelEvaluationProps) {
	if (!isTrainingCompleted) {
		return (
			<Card className="border-purple-200">
				<CardHeader>
					<CardTitle className="flex items-center text-xl text-purple-800">
						<TrendingUp className="h-5 w-5 mr-2" />
						Stage 4: Model Evaluation & Performance Analysis
					</CardTitle>
					<p className="text-purple-600 text-sm">
						Comprehensive evaluation of model performance and
						predicted anomalies
					</p>
				</CardHeader>
				<CardContent>
					<Alert>
						<Target className="h-4 w-4" />
						<AlertDescription>
							<strong>Training Required:</strong> Please complete
							Stage 3 (Model Training) first to proceed with model
							evaluation and performance analysis.
						</AlertDescription>
					</Alert>
					<div className="flex justify-center mt-4">
						<Button
							onClick={onBackToTraining}
							variant="outline"
							className="flex items-center gap-2"
						>
							<ArrowRight className="h-4 w-4 rotate-180" />
							Go to Stage 3 - Model Training
						</Button>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="border-purple-200">
			<CardHeader>
				<CardTitle className="flex items-center justify-between">
					<div className="flex items-center text-xl text-purple-800">
						<TrendingUp className="h-5 w-5 mr-2" />
						Stage 4: Model Evaluation & Performance Analysis
					</div>
					{onBackToTraining && (
						<Button
							variant="outline"
							onClick={onBackToTraining}
							className="flex items-center gap-2"
						>
							<ArrowRight className="h-4 w-4 rotate-180" />
							Back to Training
						</Button>
					)}
				</CardTitle>
				<div className="bg-purple-50 p-4 rounded-lg mt-4">
					<p className="text-purple-700">
						<strong>Evaluation Results:</strong> The following
						metrics and insights are based on the model's
						performance on the <strong>validation dataset</strong>,
						ensuring unbiased evaluation.
					</p>
				</div>
			</CardHeader>
			<CardContent>
				{/* Integrated Results Component */}
				<ResultsPhase />
			</CardContent>
		</Card>
	);
}
