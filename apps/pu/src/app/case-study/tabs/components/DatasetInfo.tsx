import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Target } from "lucide-react";
import { useEffect, useState } from "react";
import { loadRunDetailData } from "../../services/datasetService";
import type { FilterParams } from "../../types";

interface DatasetInfoProps {
	selectedRunId: string | null;
	experimentRuns: Array<{ id: string; name: string; status: string }>;
	filterParams?: FilterParams;
	showFilterParams?: boolean;
}

/**
 * 資料集詳細資訊顯示組件
 * 顯示當前選中資料集的統計資訊和參數
 */
export function DatasetInfo({
	selectedRunId,
	experimentRuns,
	filterParams,
	showFilterParams = false,
}: DatasetInfoProps) {
	// 從 API 獲取的統計資料
	const [candidateCount, setCandidateCount] = useState<number>(0);
	const [labeledPositive, setLabeledPositive] = useState<number>(0);
	const [labeledNormal, setLabeledNormal] = useState<number>(0);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	// 當選中的實驗運行改變時，重新獲取統計資料
	useEffect(() => {
		if (!selectedRunId) {
			setCandidateCount(0);
			setLabeledPositive(0);
			setLabeledNormal(0);
			return;
		}

		const fetchStats = async () => {
			setIsLoading(true);
			try {
				const runDetail = await loadRunDetailData(selectedRunId);
				setCandidateCount(runDetail.candidateCount || 0);
				setLabeledPositive(runDetail.positiveLabelCount || 0);
				setLabeledNormal(runDetail.negativeLabelCount || 0);
			} catch (error) {
				console.error("Failed to fetch dataset stats:", error);
				// 如果發生錯誤，保持為 0
				setCandidateCount(0);
				setLabeledPositive(0);
				setLabeledNormal(0);
			} finally {
				setIsLoading(false);
			}
		};

		fetchStats();
	}, [selectedRunId]);

	if (!selectedRunId) {
		return (
			<Alert className="bg-blue-50 border-blue-200">
				<Target className="h-4 w-4 text-blue-600" />
				<AlertDescription>
					Please select a dataset from the dropdown to view details.
				</AlertDescription>
			</Alert>
		);
	}

	return (
		<div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
			<div className="mb-4">
				<h4 className="font-semibold text-indigo-800 text-lg mb-2">
					Dataset (Experiment Run)
				</h4>
				<div className="flex flex-wrap items-center gap-3 text-sm">
					<div className="flex items-center gap-2">
						<span className="text-gray-600">Name:</span>
						<span className="font-mono text-blue-800 px-2 py-1 bg-blue-100 rounded">
							{experimentRuns.find(
								(r: any) => r.id === selectedRunId,
							)?.name || "Unknown"}
						</span>
					</div>
					<div className="flex items-center gap-2">
						<span className="text-gray-600">Status:</span>
						<Badge variant="secondary" className="text-xs">
							{experimentRuns.find(
								(r: any) => r.id === selectedRunId,
							)?.status || "Unknown"}
						</Badge>
					</div>
				</div>
			</div>

			{/* Basic Info */}
			<div className="grid md:grid-cols-4 gap-4 text-sm text-indigo-900">
				{/* Filter Parameters */}
				<div className="space-y-2">
					<div className="font-medium">Filter Parameters</div>
					<div className="space-y-1">
						{filterParams ? (
							<>
								<div className="flex justify-between">
									<span>Z-Score:</span>
									<span className="font-semibold text-blue-800">
										{filterParams.zScoreThreshold || "N/A"}
									</span>
								</div>
								<div className="flex justify-between">
									<span>Spike %:</span>
									<span className="font-semibold text-orange-700">
										{filterParams.spikePercentage || "N/A"}%
									</span>
								</div>
								<div className="flex justify-between">
									<span>Min Duration:</span>
									<span className="font-semibold text-green-700">
										{filterParams.minEventDuration || "N/A"}{" "}
										min
									</span>
								</div>
								<div className="flex justify-between">
									<span>Max Gap:</span>
									<span className="font-semibold text-red-700">
										{filterParams.maxTimeGap || "N/A"} min
									</span>
								</div>
							</>
						) : (
							<div className="text-gray-500 text-xs">
								No filter params
							</div>
						)}
					</div>
				</div>

				{/* Dataset Statistics */}
				<div className="space-y-2">
					<div className="font-medium">Labeled Statistics</div>
					<div className="space-y-1">
						<div className="flex justify-between">
							<span>Candidates:</span>
							<span className="font-semibold text-blue-800">
								{isLoading ? "Loading..." : candidateCount || 0}
							</span>
						</div>
						<div className="flex justify-between">
							<span>Confirmed Positive:</span>
							<span className="font-semibold text-green-700">
								{isLoading
									? "Loading..."
									: labeledPositive || 0}
							</span>
						</div>
						<div className="flex justify-between">
							<span>Rejected Normal:</span>
							<span className="font-semibold text-red-700">
								{isLoading ? "Loading..." : labeledNormal || 0}
							</span>
						</div>
						<div className="flex justify-between pt-1 border-t border-blue-200">
							<span>Total Labeled:</span>
							<span className="font-semibold">
								{isLoading
									? "Loading..."
									: (labeledPositive || 0) +
										(labeledNormal || 0)}
							</span>
						</div>
					</div>
				</div>

				{/* Training Metrics */}
				<div className="space-y-2">
					<div className="font-medium">Training Metrics</div>
					<div className="space-y-1">
						<div className="flex justify-between">
							<span>Training Accuracy:</span>
							<span className="font-semibold text-purple-700">
								87.2%
							</span>
						</div>
						<div className="flex justify-between">
							<span>Training Loss:</span>
							<span className="font-semibold text-red-600">
								0.234
							</span>
						</div>
						<div className="flex justify-between">
							<span>Epochs Completed:</span>
							<span className="font-semibold text-blue-700">
								150/200
							</span>
						</div>
						<div className="flex justify-between">
							<span>Learning Rate:</span>
							<span className="font-semibold text-gray-600">
								0.001
							</span>
						</div>
					</div>
				</div>

				{/* Prediction Metrics */}
				<div className="space-y-2">
					<div className="font-medium">Prediction Metrics</div>
					<div className="space-y-1">
						<div className="flex justify-between">
							<span>Precision:</span>
							<span className="font-semibold text-indigo-700">
								91.3%
							</span>
						</div>
						<div className="flex justify-between">
							<span>Recall:</span>
							<span className="font-semibold text-teal-700">
								85.7%
							</span>
						</div>
						<div className="flex justify-between">
							<span>F1-Score:</span>
							<span className="font-semibold text-green-600">
								88.4%
							</span>
						</div>
						<div className="flex justify-between">
							<span>AUC-ROC:</span>
							<span className="font-semibold text-blue-600">
								0.923
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* Filter Parameters (Only for Stage 1) */}
			{showFilterParams && filterParams && (
				<div className="mt-4 pt-4 border-t border-blue-200">
					<div className="font-medium text-indigo-800 mb-2">
						Current Filter Parameters
					</div>
					<div className="grid md:grid-cols-2 gap-3 text-sm text-indigo-900">
						<div>
							<div>
								Date:{" "}
								{filterParams.startDate?.toLocaleDateString()}
								{" - "}
								{filterParams.endDate?.toLocaleDateString()}
							</div>
							<div>
								Z-Score: {filterParams.zScoreThreshold}, Spike:{" "}
								{filterParams.spikePercentage}%
							</div>
						</div>
						<div>
							<div>
								Duration: {filterParams.minEventDuration}{" "}
								minutes, Gap: {filterParams.maxTimeGap} minutes
							</div>
							<div>
								Peer Window: {filterParams.peerAggWindow} min,
								Exceed: {filterParams.peerExceedPercentage}%
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
