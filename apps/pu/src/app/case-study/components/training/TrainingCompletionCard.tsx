"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, RotateCcw, TrendingUp } from "lucide-react";

interface TrainingCompletionCardProps {
	modelId: string;
	resultsMeta: any;
	onViewResults: () => void;
	onResetTraining: () => void;
}

export function TrainingCompletionCard({
	modelId,
	resultsMeta,
	onViewResults,
	onResetTraining,
}: TrainingCompletionCardProps) {
	return (
		<Card className="bg-emerald-50 border-emerald-100">
			<CardContent className="p-6">
				<div className="text-center space-y-4">
					<CheckCircle className="h-12 w-12 text-emerald-600 mx-auto" />
					<h4 className="text-lg font-bold text-emerald-800">
						Training & Prediction Completed!
					</h4>
					<p className="text-slate-600">
						Model and top-K predictions are ready. Explore results
						and insights in Stage 4.
					</p>
					<div className="flex gap-4 justify-center">
						<Button
							onClick={onViewResults}
							size="lg"
							className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
						>
							<TrendingUp className="h-5 w-5 mr-2" />
							View Results & Insights
						</Button>
						<Button
							onClick={onResetTraining}
							variant="outline"
							size="lg"
							className="px-6 py-3"
						>
							<RotateCcw className="h-5 w-5 mr-2" />
							Retrain Model
						</Button>
					</div>
					{resultsMeta && (
						<div className="mt-6 text-sm text-slate-700 space-y-1">
							<div>
								Model ID:{" "}
								<span className="font-mono">{modelId}</span>
							</div>
							<div>Type: {resultsMeta.model_type}</div>
							<div>Created at: {resultsMeta.created_at}</div>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
