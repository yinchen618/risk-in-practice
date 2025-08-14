"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Play } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import * as datasetService from "../services/datasetService";
import type { FilterParams } from "../types";

// 使用 datasetService 中的函式，移除重複定義

interface Stage1ResultsSummaryProps {
	candidateCount: number;
	filterParams: FilterParams;
	selectedRunId: string; // 外層已保證不為 null
	onCandidateStatsChange: (stats: any) => void;
	onLastCalculatedParamsChange: (params: FilterParams) => void;
}

export function Stage1ResultsSummary({
	candidateCount,
	filterParams,
	selectedRunId,
	onCandidateStatsChange,
	onLastCalculatedParamsChange,
}: Stage1ResultsSummaryProps) {
	const [isCalculating, setIsCalculating] = useState(false);
	const [candidateStats, setCandidateStats] = useState<any | null>(null);
	const [lastCalculatedParams, setLastCalculatedParams] =
		useState<FilterParams | null>(null);
	const [calculatedCandidateCount, setCalculatedCandidateCount] = useState<
		number | null
	>(null);

	// Calculate candidates - moved from parent component
	const handleCalculateCandidates = useCallback(async () => {
		if (isCalculating) {
			return;
		}

		console.log("=== Calculate Candidates Started ===");
		console.log("Selected Run ID:", selectedRunId);
		console.log("Filter Parameters:", filterParams);

		setIsCalculating(true);
		try {
			// 使用真實 API 計算並保存結果
			const result = await datasetService.calculateCandidatesForRun(
				selectedRunId,
				filterParams,
			);

			console.log("=== Calculation Results ===");
			console.log("Candidate Count:", result.candidateCount);
			console.log("Candidate Stats:", result.candidateStats);

			// Update local state
			setCandidateStats(result.candidateStats.stats);
			setLastCalculatedParams(filterParams);
			setCalculatedCandidateCount(result.candidateCount);

			// Notify parent about changes
			onCandidateStatsChange(result.candidateStats);
			onLastCalculatedParamsChange(filterParams);
		} catch (error) {
			console.error("Failed to calculate candidates:", error);
			toast.error("Failed to calculate candidates. Please try again.");
		} finally {
			setIsCalculating(false);
		}
	}, [
		filterParams,
		selectedRunId,
		isCalculating,
		onCandidateStatsChange,
		onLastCalculatedParamsChange,
	]);
	return (
		<Card className="bg-emerald-50 border-emerald-100">
			<CardContent className="p-6">
				<div className="flex items-start justify-between gap-6">
					<div className="flex-1">
						<h4 className="text-lg font-bold text-emerald-800 mb-2">
							Stage 1 Results
						</h4>
						<p className="text-slate-600">
							Based on the above rules and date range, the system
							will filter{" "}
							<Badge
								variant="secondary"
								className="mx-1 bg-emerald-50 text-emerald-700"
							>
								{isCalculating ? (
									<span className="flex items-center gap-1">
										<Loader2 className="h-3 w-3 animate-spin" />
										Calculating...
									</span>
								) : (
									(
										calculatedCandidateCount ??
										candidateCount
									).toLocaleString()
								)}
							</Badge>
							candidate events from the specified data range.
						</p>

						{/* Manual calculation button */}
						<div className="mt-3">
							<Button
								onClick={handleCalculateCandidates}
								disabled={isCalculating}
								size="sm"
								variant="outline"
								className="text-green-700 border-green-300 hover:bg-green-100"
							>
								{isCalculating ? (
									<>
										<Loader2 className="h-4 w-4 mr-2 animate-spin" />
										Calculating...
									</>
								) : (
									<>
										<Play className="h-4 w-4 mr-2" />
										Calculate Candidates
									</>
								)}
							</Button>
						</div>
					</div>

					{/* Right side - Candidates count */}
					<div className="flex-shrink-0 text-center">
						<div className="text-3xl font-bold text-emerald-600">
							{isCalculating ? (
								<Loader2 className="h-8 w-8 animate-spin mx-auto" />
							) : (
								(
									calculatedCandidateCount ?? candidateCount
								).toLocaleString()
							)}
						</div>
						<div className="text-sm text-slate-600">Candidates</div>
					</div>
				</div>

				{/* Search Conditions and Statistics - moved outside the flex container */}
				{lastCalculatedParams && !isCalculating && (
					<div className="mt-4 space-y-3">
						<div className="p-4 rounded-md bg-green-50 border border-green-200">
							<div className="font-medium mb-3 text-green-800">
								Search Conditions
							</div>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-2 text-sm text-green-900">
								<span className="flex flex-wrap items-center">
									<span className="font-medium mr-1 whitespace-nowrap">
										Time (TW):
									</span>
									<span className="whitespace-nowrap">
										{lastCalculatedParams.startTime} -{" "}
										{lastCalculatedParams.endTime}
									</span>
								</span>
								<span className="flex flex-wrap items-center">
									<span className="font-medium mr-1 whitespace-nowrap">
										Date Range:
									</span>
									<span className="text-xs">
										{lastCalculatedParams.startDate.toLocaleDateString()}{" "}
										-{" "}
										{lastCalculatedParams.endDate.toLocaleDateString()}
									</span>
								</span>
								<span className="flex items-center">
									<span className="font-medium mr-1">
										Z-Score:
									</span>
									<span>
										{lastCalculatedParams.zScoreThreshold}
									</span>
								</span>
								<span className="flex items-center">
									<span className="font-medium mr-1">
										Spike:
									</span>
									<span>
										{lastCalculatedParams.spikePercentage}%
									</span>
								</span>
								<span className="flex items-center">
									<span className="font-medium mr-1 whitespace-nowrap">
										Min Duration:
									</span>
									<span className="whitespace-nowrap">
										{lastCalculatedParams.minEventDuration}{" "}
										min
									</span>
								</span>
								<span className="flex items-center">
									<span className="font-medium mr-1 whitespace-nowrap">
										Weekend/Holiday:
									</span>
									<span>
										{lastCalculatedParams.weekendHolidayDetection
											? "Enabled"
											: "Disabled"}
									</span>
								</span>
								<span className="flex items-center">
									<span className="font-medium mr-1 whitespace-nowrap">
										Max Time Gap:
									</span>
									<span className="whitespace-nowrap">
										{lastCalculatedParams.maxTimeGap} min
									</span>
								</span>
								<span className="flex items-center">
									<span className="font-medium mr-1 whitespace-nowrap">
										Peer Window:
									</span>
									<span className="whitespace-nowrap">
										{lastCalculatedParams.peerAggWindow} min
									</span>
								</span>
								<span className="flex items-center">
									<span className="font-medium mr-1 whitespace-nowrap">
										Peer Exceed:
									</span>
									<span>
										{
											lastCalculatedParams.peerExceedPercentage
										}
										%
									</span>
								</span>
							</div>
						</div>
					</div>
				)}
				{/* Statistics */}
				{candidateStats && !isCalculating && (
					<div className="mt-4 space-y-3">
						{/* Data Overview */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
							<div className="p-3 rounded-md bg-blue-50 border border-blue-200">
								<div className="font-medium text-blue-800 mb-2">
									Data Overview
								</div>
								<div className="space-y-1 text-blue-900">
									<div className="flex justify-between">
										<span>Total Records:</span>
										<span className="font-medium">
											{candidateStats.totalRecords?.toLocaleString?.() ??
												"-"}
										</span>
									</div>
									<div className="flex justify-between">
										<span>Active Devices:</span>
										<span className="font-medium">
											{candidateStats.uniqueDevices ??
												"-"}
										</span>
									</div>
									{candidateStats.insufficientDataDevices >
										0 && (
										<div className="flex justify-between">
											<span>Insufficient Data:</span>
											<span className="font-medium text-orange-600">
												{
													candidateStats.insufficientDataDevices
												}
											</span>
										</div>
									)}
								</div>
							</div>

							<div className="p-3 rounded-md bg-purple-50 border border-purple-200">
								<div className="font-medium text-purple-800 mb-2">
									Device Statistics
								</div>
								<div className="space-y-1 text-purple-900">
									<div className="flex justify-between">
										<span>Avg Records/Device:</span>
										<span className="font-medium">
											{candidateStats.deviceRecordsSummary?.avgRecordsPerDevice?.toFixed?.(
												1,
											) ?? "-"}
										</span>
									</div>
									<div className="flex justify-between">
										<span>Median Records:</span>
										<span className="font-medium">
											{candidateStats.deviceRecordsSummary
												?.medianRecordsPerDevice ?? "-"}
										</span>
									</div>
									<div className="flex justify-between">
										<span>Range:</span>
										<span className="font-medium">
											{candidateStats.deviceRecordsSummary
												?.minRecordsPerDevice ??
												"-"}{" "}
											-{" "}
											{candidateStats.deviceRecordsSummary
												?.maxRecordsPerDevice ?? "-"}
										</span>
									</div>
								</div>
							</div>

							<div className="p-3 rounded-md bg-green-50 border border-green-200">
								<div className="font-medium text-green-800 mb-2">
									Rule Contributions
								</div>
								<div className="space-y-1 text-green-900">
									<div className="flex justify-between">
										<span>Z-Score:</span>
										<span className="font-medium">
											{candidateStats.perRule?.zscoreEstimate?.toLocaleString?.() ??
												"-"}
										</span>
									</div>
									<div className="flex justify-between">
										<span>Spike:</span>
										<span className="font-medium">
											{candidateStats.perRule?.spikeEstimate?.toLocaleString?.() ??
												"-"}
										</span>
									</div>
									<div className="flex justify-between">
										<span>Time:</span>
										<span className="font-medium">
											{candidateStats.perRule?.timeEstimate?.toLocaleString?.() ??
												"-"}
										</span>
									</div>
									<div className="flex justify-between">
										<span>Gap:</span>
										<span className="font-medium">
											{candidateStats.perRule?.gapEstimate?.toLocaleString?.() ??
												"-"}
										</span>
									</div>
									<div className="flex justify-between">
										<span>Peer:</span>
										<span className="font-medium">
											{candidateStats.perRule?.peerEstimate?.toLocaleString?.() ??
												"-"}
										</span>
									</div>
								</div>
							</div>

							<div className="p-3 rounded-md bg-orange-50 border border-orange-200">
								<div className="font-medium text-orange-800 mb-2">
									Overlap Analysis
								</div>
								<div className="space-y-1 text-orange-900">
									<div className="flex justify-between">
										<span>Before Overlap:</span>
										<span className="font-medium">
											{candidateStats.totalEstimatedBeforeOverlap?.toLocaleString?.() ??
												"-"}
										</span>
									</div>
									<div className="flex justify-between">
										<span>Reduction Factor:</span>
										<span className="font-medium">
											{candidateStats.overlapReductionFactor
												? `${(candidateStats.overlapReductionFactor * 100).toFixed(1)}%`
												: "-"}
										</span>
									</div>
									<div className="flex justify-between">
										<span>After Overlap:</span>
										<span className="font-medium">
											{candidateStats.overlapAdjustedTotal?.toLocaleString?.() ??
												"-"}
										</span>
									</div>
								</div>
							</div>
						</div>

						{/* Top Devices */}
						{candidateStats.topDevicesByEstimatedAnomalies &&
							candidateStats.topDevicesByEstimatedAnomalies
								.length > 0 && (
								<div className="p-3 rounded-md bg-red-50 border border-red-200">
									<div className="font-medium text-red-800 mb-2">
										Top 5 Devices by Estimated Anomalies
									</div>
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2 text-sm text-red-900">
										{candidateStats.topDevicesByEstimatedAnomalies
											.slice(0, 5)
											.map(
												(
													device: any,
													index: number,
												) => (
													<div
														key={
															device.deviceNumber
														}
														className="flex justify-between p-2 bg-red-100 rounded"
													>
														<span className="font-mono text-xs truncate mr-2">
															#{index + 1}{" "}
															{/* {device.deviceNumber.slice(
																-4,
															)} */}
															{device.displayName}
														</span>
														<span className="font-medium">
															{device.estimatedAnomalies?.toLocaleString?.()}
														</span>
													</div>
												),
											)}
									</div>
								</div>
							)}

						{/* Time Range */}
						{candidateStats.timeRange && (
							<div className="p-3 rounded-md bg-gray-50 border border-gray-200">
								<div className="font-medium text-gray-800 mb-2">
									Data Time Range
								</div>
								<div className="text-sm text-gray-900 grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="flex items-center">
										<span className="font-medium mr-2">
											Start:
										</span>
										<span className="font-mono text-xs">
											{candidateStats.timeRange.start
												? new Date(
														candidateStats.timeRange
															.start,
													).toLocaleString("zh-TW")
												: "-"}
										</span>
									</div>
									<div className="flex items-center">
										<span className="font-medium mr-2">
											End:
										</span>
										<span className="font-mono text-xs">
											{candidateStats.timeRange.end
												? new Date(
														candidateStats.timeRange
															.end,
													).toLocaleString("zh-TW")
												: "-"}
										</span>
									</div>
								</div>
							</div>
						)}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
