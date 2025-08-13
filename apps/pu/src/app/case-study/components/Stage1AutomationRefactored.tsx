"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Filter, Loader2, Target } from "lucide-react";
import { useCallback, useState } from "react";
import type { FilterParams } from "../types";
import type { FloorParams } from "../types";
import {
	FilteringRulesConfig,
	type FilteringRulesParams,
} from "./FilteringRulesConfig";
import { Stage1ResultsSummary } from "./Stage1ResultsSummary";
import { TimeRangeFilter, type TimeRangeParams } from "./TimeRangeFilter";

export interface PendingDiffItem {
	label: string;
	from: string;
	to: string;
}

interface Stage1AutomationProps {
	selectedRunId: string;
	filterParams: FilterParams;
	savedParams: FilterParams | null;
	onSaveParameters: () => Promise<void>;
	pendingDiffs: PendingDiffItem[];
	onFilterParamChange: (key: keyof FilterParams, value: any) => void;
	onProceedToStage2?: () => void;
}

// Helper function to format datetime for API - 與 datasetService.ts 保持一致
function pad2(n: number): string {
	return n < 10 ? `0${n}` : `${n}`;
}

function formatTaipeiISO(dateObj: Date, hhmm: string): string {
	const y = dateObj.getFullYear();
	const m = pad2(dateObj.getMonth() + 1);
	const d = pad2(dateObj.getDate());
	const time = hhmm && /^\d{2}:\d{2}$/.test(hhmm) ? hhmm : "00:00";
	return `${y}-${m}-${d}T${time}:00+08:00`;
}

export function Stage1Automation({
	selectedRunId,
	filterParams,
	savedParams: _savedParams,
	onSaveParameters,
	pendingDiffs,
	onFilterParamChange,
	onProceedToStage2: _onProceedToStage2,
}: Stage1AutomationProps) {
	// Additional state
	const [candidateCount, setCandidateCount] = useState(0);
	const [candidateStats, setCandidateStats] = useState<any | null>(null);
	const [lastCalculatedParams, setLastCalculatedParams] =
		useState<FilterParams | null>(null);
	const [isGenerating, setIsGenerating] = useState(false);
	const [generationTaskId, setGenerationTaskId] = useState<string | null>(
		null,
	);

	// Helper function to update time range params
	const updateTimeRangeParam = useCallback(
		(key: keyof TimeRangeParams, value: any) => {
			onFilterParamChange(key, value);
		},
		[onFilterParamChange],
	);

	// Helper function to update filtering rules params
	const updateFilteringRulesParam = useCallback(
		(key: keyof FilteringRulesParams, value: any) => {
			onFilterParamChange(key, value);
		},
		[onFilterParamChange],
	);

	// Helper function to update floor params
	const updateFloorParam = useCallback(
		(key: keyof FloorParams, value: any) => {
			onFilterParamChange(key, value);
		},
		[onFilterParamChange],
	);

	// Extract time range params from filter params
	const timeRangeParams: TimeRangeParams = {
		startDate: filterParams.startDate,
		endDate: filterParams.endDate,
		startTime: filterParams.startTime,
		endTime: filterParams.endTime,
	};

	// Extract filtering rules params from filter params
	const filteringRulesParams: FilteringRulesParams = {
		zScoreThreshold: filterParams.zScoreThreshold,
		spikePercentage: filterParams.spikePercentage,
		minEventDuration: filterParams.minEventDuration,
		weekendHolidayDetection: filterParams.weekendHolidayDetection,
		maxTimeGap: filterParams.maxTimeGap,
		peerAggWindow: filterParams.peerAggWindow,
		peerExceedPercentage: filterParams.peerExceedPercentage,
	};

	// Extract floor params from filter params
	const floorParams: FloorParams = {
		selectedBuildings: filterParams.selectedBuildings || [],
		selectedFloors: filterParams.selectedFloors || [],
		selectedFloorsByBuilding: filterParams.selectedFloorsByBuilding || {},
	};

	// Callback handlers for Stage1ResultsSummary
	const handleCandidateStatsChange = useCallback((stats: any) => {
		setCandidateStats(stats);
		// 同時更新候選事件數量 - 使用 camelCase 屬性
		if (stats && typeof stats.overlapAdjustedTotal === "number") {
			setCandidateCount(stats.overlapAdjustedTotal);
		} else if (stats && typeof stats.candidateCount === "number") {
			setCandidateCount(stats.candidateCount);
		}
	}, []);

	const handleLastCalculatedParamsChange = useCallback(
		(params: FilterParams) => {
			setLastCalculatedParams(params);
		},
		[],
	);

	// Poll task status
	const pollTaskStatus = useCallback(
		async (taskId: string) => {
			const maxAttempts = 60; // 最多輪詢 5 分鐘
			let attempts = 0;

			const poll = async (): Promise<void> => {
				try {
					const response = await fetch(
						`http://localhost:8000/api/v1/experiment-runs/${selectedRunId}/candidates/status/${taskId}`,
					);

					if (response.ok) {
						const result = await response.json();
						console.log("Task status:", result);

						if (result.status === "completed") {
							setIsGenerating(false);
							setGenerationTaskId(null);

							// 刷新實驗數據以獲取最新狀態
							// Note: 移除了 loadRunDetail 調用，因為不再需要

							alert(
								`候選事件生成完成！\n生成了 ${result.result?.events_generated || 0} 個候選事件`,
							);
							return;
						}

						if (result.status === "failed") {
							setIsGenerating(false);
							setGenerationTaskId(null);
							alert(`生成失敗：${result.error || "未知錯誤"}`);
							return;
						}

						if (
							result.status === "running" ||
							result.status === "pending"
						) {
							// 繼續輪詢
							attempts++;
							if (attempts < maxAttempts) {
								setTimeout(() => poll(), 5000); // 每5秒輪詢一次
							} else {
								setIsGenerating(false);
								setGenerationTaskId(null);
								alert("生成任務超時，請檢查後端狀態");
							}
						}
					} else {
						throw new Error(`HTTP ${response.status}`);
					}
				} catch (error) {
					console.error("Failed to poll task status:", error);
					attempts++;
					if (attempts < maxAttempts) {
						setTimeout(() => poll(), 5000);
					} else {
						setIsGenerating(false);
						setGenerationTaskId(null);
						alert("無法獲取任務狀態，請檢查網路連接");
					}
				}
			};

			poll();
		},
		[selectedRunId],
	);

	// Generate candidates - 實際調用後端 API
	const handleGenerateCandidates = useCallback(async () => {
		setIsGenerating(true);
		try {
			// 準備 API 請求的參數 - 使用與 datasetService 相同的格式化邏輯
			const payload = {
				filtering_parameters: {
					start_date: filterParams.startDate
						.toISOString()
						.split("T")[0],
					end_date: filterParams.endDate.toISOString().split("T")[0],
					start_time: filterParams.startTime,
					end_time: filterParams.endTime,
					z_score_threshold: filterParams.zScoreThreshold,
					spike_percentage: filterParams.spikePercentage,
					min_event_duration_minutes: filterParams.minEventDuration,
					detect_holiday_pattern:
						filterParams.weekendHolidayDetection,
					max_time_gap_minutes: filterParams.maxTimeGap,
					peer_agg_window_minutes: filterParams.peerAggWindow,
					peer_exceed_percentage: filterParams.peerExceedPercentage,
					// 使用新的按建築分組功能
					selected_floors_by_building:
						filterParams.selectedFloorsByBuilding || {},
				},
			};

			console.log("=== 前端發送的參數 ===");
			console.log("filterParams:", filterParams);
			console.log("payload:", JSON.stringify(payload, null, 2));

			// 調用候選事件生成 API
			const response = await fetch(
				`http://localhost:8000/api/v1/experiment-runs/${selectedRunId}/candidates/generate?allow_overwrite=true`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(payload),
				},
			);

			if (response.ok) {
				const result = await response.json();
				console.log("=== 後端回應結果 ===");
				console.log("Generation result:", result);

				if (result.success) {
					setIsGenerating(false);
					setGenerationTaskId(null);

					const candidatesGenerated =
						result.data?.candidatesGenerated || 0;
					alert(
						`候選事件生成完成！\n生成了 ${candidatesGenerated} 個候選事件\n實驗狀態已更新為 LABELING`,
					);

					// 可以在這裡觸發頁面刷新或導航到 Stage 2
					// if (_onProceedToStage2) {
					//     _onProceedToStage2();
					// }
				} else {
					setIsGenerating(false);
					alert(`生成失敗：${result.message || "未知錯誤"}`);
				}
			} else {
				const errorText = await response.text();
				console.error("=== HTTP 錯誤回應 ===");
				console.error("Status:", response.status);
				console.error("Response text:", errorText);
				setIsGenerating(false);
				alert(
					`生成候選事件失敗：HTTP ${response.status}\n${errorText}`,
				);
			}
		} catch (error) {
			console.error("Error generating candidate events:", error);
			setIsGenerating(false);
			alert("生成候選事件時發生錯誤，請檢查網路連接");
		}
	}, [selectedRunId, filterParams, pollTaskStatus]);

	return (
		<>
			{/* Stage 1: Automated Candidate Generation */}
			<Card className="border border-blue-200 rounded-xl">
				<CardHeader>
					<CardTitle className="flex items-center text-xl text-slate-900">
						<Filter className="h-5 w-5 mr-2" />
						Stage 1: Automated Candidate Generation
					</CardTitle>
					<p className="text-slate-600 text-sm">
						Apply multi-dimensional filtering rules to extract
						candidate anomaly events from massive raw data
					</p>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* 顯示當前生成狀態 */}
					{isGenerating && generationTaskId && (
						<Alert className="bg-yellow-50 border-yellow-200">
							<Loader2 className="h-4 w-4 text-yellow-600 animate-spin" />
							<AlertDescription>
								正在生成候選事件... 任務 ID: {generationTaskId}
								<br />
								請勿關閉頁面，系統會自動更新完成狀態。
							</AlertDescription>
						</Alert>
					)}

					{/* 顯示參數變更狀態 */}
					{pendingDiffs.length > 0 && (
						<Alert className="bg-orange-50 border-orange-200">
							<Target className="h-4 w-4 text-orange-600" />
							<AlertDescription>
								<div className="space-y-2">
									<div className="font-semibold text-orange-800">
										未保存的參數變更 ({pendingDiffs.length}{" "}
										項):
									</div>
									{pendingDiffs.map((diff, index) => (
										<div key={index} className="text-sm">
											<span className="font-medium">
												{diff.label}:
											</span>{" "}
											<span className="text-red-600">
												{diff.from}
											</span>{" "}
											→{" "}
											<span className="text-green-600">
												{diff.to}
											</span>
										</div>
									))}
									<button
										type="button"
										onClick={onSaveParameters}
										className="mt-2 px-3 py-1 bg-orange-600 text-white text-sm rounded hover:bg-orange-700"
									>
										保存參數變更
									</button>
								</div>
							</AlertDescription>
						</Alert>
					)}
					{/* Filtering Rules Configuration */}
					<FilteringRulesConfig
						filterParams={filteringRulesParams}
						onFilterChange={updateFilteringRulesParam}
					/>

					{/* Time Range Filter */}
					<TimeRangeFilter
						timeRange={timeRangeParams}
						onTimeRangeChange={updateTimeRangeParam}
						floor={floorParams}
						onFloorChange={updateFloorParam}
					/>

					{/* Results Summary */}
					<Stage1ResultsSummary
						candidateCount={candidateCount}
						filterParams={filterParams}
						selectedRunId={selectedRunId}
						onCandidateStatsChange={handleCandidateStatsChange}
						onLastCalculatedParamsChange={
							handleLastCalculatedParamsChange
						}
					/>

					{/* Progress to Stage 2 */}
					<div className="flex justify-center pt-4">
						<Button
							onClick={() => {
								handleGenerateCandidates();
								// 只有在生成成功後才切換到 Stage 2
								// onProceedToStage2(); // 移除這個，改為在生成完成後的回調中處理
							}}
							size="lg"
							disabled={isGenerating}
							className="bg-slate-600 hover:bg-slate-700 text-white px-8 py-3"
						>
							{isGenerating ? (
								<>
									<Loader2 className="h-5 w-5 mr-2 animate-spin" />
									Generating Events...
								</>
							) : (
								<>
									<ArrowRight className="h-5 w-5 mr-2" />
									Proceed to Stage 2 Manual Annotation
								</>
							)}
						</Button>
					</div>
				</CardContent>
			</Card>
		</>
	);
}
