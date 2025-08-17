import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { ArrowRight, CheckCircle, Loader2, Play, Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
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
	isCompleted?: boolean; // 是否已標記為完成狀態
}

export default function Stage2LabelingRefactored({
	selectedRunId,
	candidateCount,
	labeledPositive,
	labeledNormal,
	onUpdateRunStatus,
	onProceedToTraining,
	onLabelingProgress,
	isCompleted = false,
}: Stage2LabelingProps) {
	const [isCompleting, setIsCompleting] = useState(false);
	const [showCompletionDialog, setShowCompletionDialog] = useState(false);
	// localCompleted mirrors the prop so UI can update immediately after completion
	const [localCompleted, setLocalCompleted] = useState(isCompleted);

	useEffect(() => {
		setLocalCompleted(isCompleted);
	}, [isCompleted]);

	// Define completion thresholds
	const WARNING_THRESHOLD = 0.2; // 20%
	const RECOMMENDED_THRESHOLD = 0.8; // 80%
	const MIN_POSITIVE_SAMPLES = 10;
	const RECOMMENDED_POSITIVE_SAMPLES = 30;

	// Calculate completion statistics
	const totalLabeled = labeledPositive + labeledNormal;
	const labelingProgress =
		candidateCount > 0 ? totalLabeled / candidateCount : 0;
	const hasMinimumPositiveSamples = labeledPositive >= MIN_POSITIVE_SAMPLES;
	const hasRecommendedPositiveSamples =
		labeledPositive >= RECOMMENDED_POSITIVE_SAMPLES;

	// Determine completion status
	const isAboveWarningThreshold =
		labelingProgress >= WARNING_THRESHOLD && hasMinimumPositiveSamples;
	const isAboveRecommendedThreshold =
		labelingProgress >= RECOMMENDED_THRESHOLD &&
		hasRecommendedPositiveSamples;
	const isFullyComplete = totalLabeled >= candidateCount;

	// Mark run as completed
	const handleMarkCompleted = useCallback(async () => {
		if (candidateCount === 0) {
			toast.warning(
				"No candidates found. Please generate and label candidates before marking as complete.",
			);
			return;
		}

		// If not fully complete and below recommended threshold, show warning dialog
		if (!isFullyComplete && !isAboveRecommendedThreshold) {
			setShowCompletionDialog(true);
			return;
		}

		// Proceed with completion
		await completeDataset();
	}, [candidateCount, isFullyComplete, isAboveRecommendedThreshold]);

	// Handle actual completion process
	const completeDataset = useCallback(async () => {
		setIsCompleting(true);
		try {
			await onUpdateRunStatus(selectedRunId, "COMPLETED");
			// Immediately reflect completion in this component
			setLocalCompleted(true);
			toast.success("Dataset marked as COMPLETED!");
		} catch (error) {
			console.error("Failed to mark dataset as complete", error);
			toast.error("An error occurred while marking dataset as complete");
		} finally {
			setIsCompleting(false);
		}
	}, [selectedRunId, onUpdateRunStatus]);

	// Handle dialog confirmation
	const handleConfirmCompletion = useCallback(async () => {
		setShowCompletionDialog(false);
		await completeDataset();
	}, [completeDataset]);

	// Handle dialog cancellation
	const handleCancelCompletion = useCallback(() => {
		setShowCompletionDialog(false);
	}, []);

	const getButtonText = () => {
		if (candidateCount === 0) {
			return "Mark as Complete";
		}
		if (!isAboveWarningThreshold) {
			return "Mark as Complete";
		}
		if (!isAboveRecommendedThreshold) {
			return "Mark as Complete (Early)";
		}
		return "Mark as Complete";
	};

	const getButtonColor = () => {
		if (candidateCount === 0 || !isAboveWarningThreshold) {
			return "bg-gray-400 hover:bg-gray-500 cursor-not-allowed";
		}
		if (!isAboveRecommendedThreshold) {
			return "bg-orange-500 hover:bg-orange-600";
		}
		return "bg-green-600 hover:bg-green-700";
	};

	const getTooltipText = () => {
		if (candidateCount === 0) {
			return "No candidates to label";
		}
		if (labelingProgress < WARNING_THRESHOLD) {
			return `Recommend labeling at least ${Math.ceil(candidateCount * WARNING_THRESHOLD)} events (${(WARNING_THRESHOLD * 100).toFixed(0)}%) to ensure model training quality.`;
		}
		if (labeledPositive < MIN_POSITIVE_SAMPLES) {
			return `Recommend finding at least ${MIN_POSITIVE_SAMPLES} positive samples for better model performance.`;
		}
		if (!isAboveRecommendedThreshold) {
			return "You may proceed, but more labeling is recommended for better model accuracy.";
		}
		return "Ready to complete - sufficient labeling achieved.";
	};

	return (
		<>
			<Card className={"border rounded-xl border-blue-200"}>
				<CardHeader>
					<CardTitle className="flex items-center justify-between gap-3 text-xl text-slate-900">
						<div className="flex items-center">
							{isCompleted ? (
								<CheckCircle className="h-5 w-5 mr-2 text-green-600" />
							) : (
								<Users className="h-5 w-5 mr-2" />
							)}
							<span>
								Stage 2: Expert Manual Verification & Labeling
							</span>
							{isCompleted && (
								<span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
									✓ COMPLETED
								</span>
							)}
						</div>
						<div className="flex flex-col items-end gap-2">
							{/* Completion Status */}
							<div className="text-sm text-gray-600">
								{candidateCount > 0 && (
									<div className="text-right">
										<div>
											Progress: {totalLabeled}/
											{candidateCount} (
											{(labelingProgress * 100).toFixed(
												1,
											)}
											%)
										</div>
										<div>
											Positive samples: {labeledPositive}
										</div>
									</div>
								)}
							</div>

							{/* Mark as Complete Button */}
							<div className="relative group">
								{localCompleted ? (
									<div className="flex items-center gap-2 px-3 py-2 bg-green-100 rounded-lg border border-green-200">
										<CheckCircle className="h-4 w-4 text-green-600" />
										<span className="text-sm font-semibold text-green-700">
											Dataset Completed
										</span>
									</div>
								) : (
									<Button
										onClick={handleMarkCompleted}
										disabled={
											candidateCount === 0 ||
											!isAboveWarningThreshold ||
											isCompleting
										}
										className={`${getButtonColor()} text-white transition-colors`}
										title={getTooltipText()}
									>
										{isCompleting && (
											<Loader2 className="h-4 w-4 mr-2 animate-spin" />
										)}
										<Play className="h-4 w-4 mr-2" />
										{getButtonText()}
									</Button>
								)}

								{/* Tooltip-like message */}
								{candidateCount > 0 &&
									!isAboveWarningThreshold && (
										<div className="absolute bottom-full right-0 mb-2 w-80 p-3 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
											{getTooltipText()}
										</div>
									)}
							</div>
						</div>
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

					{/* Progress to Stage 3 - only show if not completed and fully labeled */}
					{!isCompleted && isFullyComplete && (
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

			{/* Early Completion Warning Dialog */}
			<Dialog
				open={showCompletionDialog}
				onOpenChange={setShowCompletionDialog}
			>
				<DialogContent className="max-w-md">
					<DialogHeader className="space-y-4">
						<DialogTitle className="text-xl font-semibold text-gray-900">
							Early Completion Warning
						</DialogTitle>
						<DialogDescription className="text-gray-600 leading-relaxed">
							You have labeled {totalLabeled} out of{" "}
							{candidateCount} events (
							{(labelingProgress * 100).toFixed(1)}%) with{" "}
							{labeledPositive} positive samples.
							<br />
							<br />
							<span className="text-orange-600 font-medium">
								The current labeling may be insufficient for
								optimal model performance.
							</span>{" "}
							We recommend labeling at least{" "}
							{Math.ceil(candidateCount * RECOMMENDED_THRESHOLD)}{" "}
							events with {RECOMMENDED_POSITIVE_SAMPLES}+ positive
							samples for better accuracy.
							<br />
							<br />
							<span className="text-sm text-gray-500">
								Are you sure you want to proceed with the
								current labeling?
							</span>
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="flex gap-3 pt-6">
						<Button
							variant="outline"
							onClick={handleCancelCompletion}
							disabled={isCompleting}
							className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
						>
							Continue Labeling
						</Button>
						<Button
							onClick={handleConfirmCompletion}
							disabled={isCompleting}
							className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-medium"
						>
							{isCompleting ? (
								<>
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
									Processing...
								</>
							) : (
								"Proceed Anyway"
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
