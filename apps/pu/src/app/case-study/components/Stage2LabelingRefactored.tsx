import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Loader2, Play, Users } from "lucide-react";
import { useCallback, useState } from "react";
import { AnomalyLabelingSystem } from "./AnomalyLabelingSystem";

interface Stage2LabelingProps {
	selectedRunId: string; // 外層已保證不為 null
	candidateCount: number;
	labeledPositive: number;
	labeledNormal: number;
	onUpdateRunStatus: (runId: string, status: string) => void;
	onBackToOverview: () => void;
	onProceedToTraining: () => void;
	onLabelingProgress?: (positive: number, normal: number) => void;
}

export default function Stage2LabelingRefactored({
	selectedRunId,
	candidateCount,
	labeledPositive,
	labeledNormal,
	onUpdateRunStatus,
	onProceedToTraining,
	onLabelingProgress,
}: Stage2LabelingProps) {
	const [isCompleting, setIsCompleting] = useState(false);

	// Mark run as completed
	const handleMarkCompleted = useCallback(async () => {
		if (candidateCount === 0) {
			alert(
				"No candidates found. Please generate and label candidates before marking as complete.",
			);
			return;
		}

		const totalLabeled = labeledPositive + labeledNormal;
		if (totalLabeled < candidateCount) {
			alert(
				"Labeling not complete. Please label all candidate events before marking as complete.",
			);
			return;
		}

		setIsCompleting(true);
		try {
			await onUpdateRunStatus(selectedRunId, "COMPLETED");
			alert("Dataset marked as COMPLETED!");
		} catch (error) {
			console.error("Failed to mark dataset as complete", error);
			alert("An error occurred while marking dataset as complete");
		} finally {
			setIsCompleting(false);
		}
	}, [
		selectedRunId,
		candidateCount,
		labeledPositive,
		labeledNormal,
		onUpdateRunStatus,
	]);

	const isLabelingComplete =
		candidateCount > 0 && labeledPositive + labeledNormal >= candidateCount;

	return (
		<>
			<Card className="border border-blue-200 rounded-xl">
				<CardHeader>
					<CardTitle className="flex items-center justify-between gap-3 text-xl text-slate-900">
						<div className="flex items-center">
							<Users className="h-5 w-5 mr-2" />
							Stage 2: Expert Manual Verification & Labeling
						</div>
						<Button
							onClick={handleMarkCompleted}
							disabled={
								candidateCount === 0 ||
								!isLabelingComplete ||
								isCompleting
							}
							className="bg-green-600 hover:bg-green-700 text-white"
						>
							{isCompleting && (
								<Loader2 className="h-4 w-4 mr-2 animate-spin" />
							)}
							<Play className="h-4 w-4 mr-2" />
							Mark as Complete
						</Button>
					</CardTitle>
				</CardHeader>
			</Card>

			{candidateCount === 0 ? (
				<Card>
					<CardContent className="p-6">
						<Alert>
							<AlertDescription>
								No candidates found for this dataset. Please
								generate candidates in Stage 1 first.
							</AlertDescription>
						</Alert>
					</CardContent>
				</Card>
			) : (
				<>
					{/* Labeling Interface */}
					<Card>
						<CardContent className="p-6">
							<AnomalyLabelingSystem
								experimentRunId={selectedRunId}
								candidateCount={candidateCount}
								onLabelingProgress={onLabelingProgress}
							/>
						</CardContent>
					</Card>

					{/* Progress to Stage 3 */}
					{isLabelingComplete && (
						<Card>
							<CardContent className="p-4">
								<div className="flex items-center justify-between">
									<div className="text-sm text-gray-600">
										Labeling complete! Ready for model
										training.
									</div>
									<Button onClick={onProceedToTraining}>
										Proceed to Stage 3
										<ArrowRight className="h-4 w-4 ml-2" />
									</Button>
								</div>
							</CardContent>
						</Card>
					)}
				</>
			)}
		</>
	);
}
