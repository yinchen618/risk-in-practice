"use client";

import { DatasetPanel } from "@/app/case-study/tabs/components/DatasetPanel";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest } from "@/utils/global-api-manager";
import { apiLogger } from "@/utils/logger";
import dynamic from "next/dynamic";
import { useQueryState } from "nuqs";
import { useCallback, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import * as datasetService from "../services/datasetService";
import type { FilterParams } from "../types";

// 動態載入較重的分頁，避免切換時阻塞 UI
const Stage3ExperimentWorkbench = dynamic(
	() =>
		import("../components/Stage3ExperimentWorkbench").then(
			(m) => m.Stage3ExperimentWorkbench,
		),
	{ ssr: false },
);
const Stage1Automation = dynamic(
	() =>
		import("../components/Stage1AutomationRefactored").then(
			(m) => m.Stage1Automation,
		),
	{ ssr: false },
);
const Stage2LabelingRefactored = dynamic(
	() => import("../components/Stage2LabelingRefactored"),
	{ ssr: false },
);

const Stage4ResultsAnalysis = dynamic(
	() =>
		import("../components/Stage4ResultsAnalysis").then(
			(m) => m.Stage4ResultsAnalysis,
		),
	{ ssr: false },
);

type ViewMode = "overview" | "labeling" | "training" | "results-analysis";

interface DataResultsPhaseProps {
	stageParam?: string | null;
	runParam?: string | null;
}

const tabs = [
	{
		key: "overview" as const,
		title: "1 Candidate Generation",
	},
	{
		key: "labeling" as const,
		title: "2 Expert Labeling",
	},
	{
		key: "training" as const,
		title: "3 Training & Analysis Workbench",
	},
	{
		key: "results-analysis" as const,
		title: "4 Results Analysis",
	},
];

// 將 stage 參數映射到 viewMode
const stageToViewMode = (stage: string | null | undefined): ViewMode => {
	switch (stage) {
		case "1":
			return "overview";
		case "2":
			return "labeling";
		case "3": // Redirect Stage 4 to Stage 3 (Training & Analysis Workbench)
			return "training";
		case "4":
			return "results-analysis";
		default:
			return "overview";
	}
};

// 將 viewMode 映射到 stage 參數
const viewModeToStage = (viewMode: ViewMode): string => {
	switch (viewMode) {
		case "overview":
			return "1";
		case "labeling":
			return "2";
		case "training":
			return "3";
		case "results-analysis": // 如果有結果分析階段，則映射到 4
			return "4";
		default:
			return "1";
	}
};

export function DataResultsPhase({
	stageParam,
	runParam,
}: DataResultsPhaseProps) {
	// 以 nuqs 維持 URL 狀態，避免觸發整頁導航
	const [stageQuery, setStageQuery] = useQueryState("stage");
	const [runQuery, setRunQuery] = useQueryState("run");

	const [viewMode, setViewMode] = useState<ViewMode>(() =>
		stageToViewMode(stageQuery ?? stageParam),
	);

	// 新增：分頁載入狀態
	const [isTabLoading, setIsTabLoading] = useState(false);

	// Run 狀態管理 - 提前定義以供URL同步使用
	const [selectedRunId, setSelectedRunId] = useState<string | null>(() => {
		// 從URL參數初始化selectedRunId
		return runParam || null;
	});
	const [experimentRuns, setExperimentRuns] = useState<
		{ id: string; name: string; status: string }[]
	>([]);
	const [isCreatingRun, setIsCreatingRun] = useState(false);
	const [isLoadingRuns, setIsLoadingRuns] = useState(false);

	const [isPending, startTransition] = useTransition();

	// 載入候選統計資料 (提前宣告以供其他 hook 使用，例如在切換 view 時重新載入統計) - 優化版本
	const [statsCache, setStatsCache] = useState<Map<string, any>>(new Map());
	const [lastStatsLoad, setLastStatsLoad] = useState<Map<string, number>>(
		new Map(),
	);
	const STATS_CACHE_DURATION = 10000; // 10秒緩存

	const loadCandidateStats = useCallback(
		async (runId: string, forceRefresh = false) => {
			const now = Date.now();
			const lastLoad = lastStatsLoad.get(runId) || 0;
			const logId = Math.random().toString(36).substr(2, 9);
			const url = `http://localhost:8000/api/v1/stats?experiment_run_id=${runId}`;

			apiLogger.request(url, "GET", { runId, forceRefresh, logId });

			// 檢查緩存
			if (
				!forceRefresh &&
				statsCache.has(runId) &&
				now - lastLoad < STATS_CACHE_DURATION
			) {
				const cachedData = statsCache.get(runId);
				apiLogger.cached(url, { runId, cachedData, logId });
				setCandidateCount(cachedData.totalEvents);
				setLabeledPositive(cachedData.confirmedCount);
				setLabeledNormal(cachedData.rejectedCount);
				return;
			}

			try {
				// 使用統一的API管理器來避免重複調用
				const result = await apiRequest.get(url, !forceRefresh, true);

				if (result.success && result.data) {
					// 更新緩存
					setStatsCache((prev) =>
						new Map(prev).set(runId, result.data),
					);
					setLastStatsLoad((prev) => new Map(prev).set(runId, now));

					setCandidateCount(result.data.totalEvents);
					setLabeledPositive(result.data.confirmedCount);
					setLabeledNormal(result.data.rejectedCount);
					apiLogger.response(url, 200, {
						runId,
						data: result.data,
						logId,
					});
				}
			} catch (error) {
				apiLogger.error(url, { error, runId, logId });
			}
		},
		[statsCache, lastStatsLoad],
	);

	// 處理 viewMode 改變並同步到 URL（使用 nuqs，避免觸發 RSC 重新載入）
	const handleViewModeChange = useCallback(
		(newViewMode: ViewMode) => {
			if (newViewMode !== viewMode) {
				setIsTabLoading(true);
				startTransition(() => {
					setViewMode(newViewMode);
					setStageQuery(viewModeToStage(newViewMode));
				});
				// 如果切換到標註頁 (labeling)，立即重新載入 runs 以反映後端狀態變更
				if (newViewMode === "labeling") {
					(async () => {
						try {
							// 使用緩存機制的強制刷新
							await loadExperimentRunsThrottled(true);
							// 如果目前有選中的 run，重新載入其統計資料 (強制刷新)
							if (selectedRunId) {
								await loadCandidateStats(selectedRunId, true);
							}
						} catch (e) {
							console.error(
								"Failed to refresh experiment runs on view change:",
								e,
							);
						}
					})();
				}
				setTimeout(() => {
					setIsTabLoading(false);
				}, 300);
			}
		},
		[setStageQuery, viewMode, selectedRunId, loadCandidateStats],
	);

	// 處理 selectedRunId 改變並同步到 URL（使用 nuqs）
	const handleSelectedRunIdChange = useCallback(
		(newRunId: string | null) => {
			setSelectedRunId(newRunId);
			startTransition(() => {
				setRunQuery(newRunId ?? null);
			});
		},
		[setRunQuery],
	);

	// 當 stageQuery 或 stageParam 改變時，同步 viewMode（優先使用 stageQuery）
	useEffect(() => {
		const newStage = stageQuery ?? stageParam;
		const newViewMode = stageToViewMode(newStage);
		if (newViewMode !== viewMode) {
			if (!isTabLoading) {
				setIsTabLoading(true);
				setViewMode(newViewMode);
				setTimeout(() => {
					setIsTabLoading(false);
				}, 300);
			} else {
				setViewMode(newViewMode);
			}
		}
	}, [stageQuery, stageParam, viewMode, isTabLoading]);

	// 當 runQuery 或 runParam 改變時同步 selectedRunId（優先使用 runQuery）
	useEffect(() => {
		const nextRunId = runQuery ?? runParam ?? null;
		if (nextRunId !== selectedRunId) {
			setSelectedRunId(nextRunId);
		}
	}, [runQuery, runParam, selectedRunId]);

	// 載入實驗運行清單 - 優化: 減少重複調用
	const [lastLoadTime, setLastLoadTime] = useState(0);
	const LOAD_THROTTLE_MS = 2000; // 2秒內不重複載入

	const loadExperimentRunsThrottled = useCallback(
		async (forceRefresh = false) => {
			const now = Date.now();
			if (!forceRefresh && now - lastLoadTime < LOAD_THROTTLE_MS) {
				return;
			}

			setIsLoadingRuns(true);
			setLastLoadTime(now);
			try {
				const runs =
					await datasetService.loadExperimentRuns(forceRefresh);
				setExperimentRuns(runs);

				// 如果URL中有runParam，並且該run存在於載入的runs中，確保它被選中
				if (runParam && runs.some((run) => run.id === runParam)) {
					if (selectedRunId !== runParam) {
						setSelectedRunId(runParam);
					}
				} else if (!selectedRunId && runs.length > 0) {
					// 無指定且尚未選擇時，自動選擇第一個可用的 run，避免頁面空白
					setSelectedRunId(runs[0].id);
					setRunQuery(runs[0].id);
				}
			} catch (error) {
				console.error("Failed to load experiment runs:", error);
			} finally {
				setIsLoadingRuns(false);
			}
		},
		[runParam, selectedRunId, setRunQuery, lastLoadTime],
	);

	useEffect(() => {
		loadExperimentRunsThrottled();
	}, [runParam, selectedRunId, setRunQuery]); // 移除 loadExperimentRunsThrottled 依賴避免循環

	// 候選事件和標註統計
	const [candidateCount, setCandidateCount] = useState(0);
	const [labeledPositive, setLabeledPositive] = useState(0);
	const [labeledNormal, setLabeledNormal] = useState(0);

	// 處理標籤進度更新 - 優化版本，移除全局緩存清除以避免循環
	const handleLabelingProgress = useCallback(
		(positive: number, normal: number) => {
			setLabeledPositive(positive);
			setLabeledNormal(normal);

			// 只清除當前 runId 的統計緩存，不觸發全局事件
			if (selectedRunId) {
				setStatsCache((prev) => {
					const newMap = new Map(prev);
					newMap.delete(selectedRunId);
					return newMap;
				});
			}
		},
		[selectedRunId],
	);

	// 當選擇的運行ID改變時載入統計資料
	useEffect(() => {
		if (selectedRunId) {
			loadCandidateStats(selectedRunId);
		}
	}, [selectedRunId, loadCandidateStats]);

	// 過濾參數狀態管理 - 優化後的預設值以獲得合理候選數量
	const [filterParams, setFilterParams] = useState<FilterParams>({
		startDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // 改為 1 天前，減少資料量
		endDate: new Date(),
		startTime: "00:00",
		endTime: "00:00",
		zScoreThreshold: 3.0, // 從 3.0 降到 2.5，增加檢測敏感度
		spikePercentage: 200, // 從 200% 降到 80%，更合理的突增閾值
		minEventDuration: 30, // 保持 30 分鐘，合理
		weekendHolidayDetection: true,
		maxTimeGap: 120, // 從 60 增加到 120 分鐘，允許更大的時間間隙
		peerAggWindow: 60, // 從 5 增加到 60 分鐘，更合理的聚合窗口
		peerExceedPercentage: 150, // 從 150% 降到 50%，減少同儕比較檢測的誤報
		// 樓層過濾 - 默認選擇所有建築和樓層
		selectedBuildings: ["Building A", "Building B"],
		selectedFloors: ["1", "2", "3", "5", "6"],
	});

	const [savedParams, setSavedParams] = useState<FilterParams | null>(null);

	// 實驗運行管理函數
	const addExperimentRun = useCallback(
		(run: { id: string; name: string; status: string }) => {
			setExperimentRuns((prev) => [...prev, run]);
		},
		[],
	);

	const updateExperimentRunStatus = useCallback(
		async (runId: string, status: string) => {
			try {
				// 調用後端 API 更新狀態
				if (status === "COMPLETED") {
					await datasetService.markRunAsComplete(runId);
				}

				// 使用緩存機制的強制刷新來重新載入 experiment runs 列表
				await loadExperimentRunsThrottled(true);

				// 重新載入統計資料 (強制刷新)
				if (selectedRunId === runId) {
					await loadCandidateStats(runId, true);
				}
			} catch (error) {
				console.error("Failed to update experiment run status:", error);
				throw error; // 重新拋出錯誤，讓 Stage2 組件可以處理
			}
		},
		[selectedRunId, loadCandidateStats, loadExperimentRunsThrottled],
	);

	// 更新過濾參數的輔助函數
	const updateFilterParam = useCallback(
		(key: keyof FilterParams, value: any) => {
			setFilterParams((prev) => ({
				...prev,
				[key]: value,
			}));
		},
		[],
	);

	// 保存參數
	const handleSaveParameters = useCallback(async () => {
		if (!selectedRunId) {
			toast.warning("Please select or create a dataset first");
			return;
		}

		try {
			await datasetService.saveParametersToRun(
				selectedRunId,
				filterParams,
			);
			setSavedParams({ ...filterParams });
			toast.success("Parameters saved successfully!");
		} catch (error) {
			console.error("Failed to save parameters:", error);
			toast.error("An error occurred while saving parameters");
		}
	}, [filterParams, selectedRunId]);

	// 計算參數變更差異
	const pendingDiffs = useCallback(() => {
		if (!savedParams) {
			return [];
		}
		const diffs: { label: string; from: string; to: string }[] = [];
		const paramLabels: Record<keyof FilterParams, string> = {
			startDate: "Start Date",
			endDate: "End Date",
			startTime: "Start Time",
			endTime: "End Time",
			zScoreThreshold: "Z-Score Threshold",
			spikePercentage: "Spike Percentage",
			minEventDuration: "Min Event Duration",
			weekendHolidayDetection: "Weekend/Holiday Detection",
			maxTimeGap: "Max Time Gap",
			peerAggWindow: "Peer Aggregation Window",
			peerExceedPercentage: "Peer Exceed Percentage",
			selectedBuildings: "Selected Buildings",
			selectedFloors: "Selected Floors",
			selectedFloorsByBuilding: "Selected Floors by Building",
		};

		const formatParamValue = (
			key: keyof FilterParams,
			value: any,
		): string => {
			if (key === "startDate" || key === "endDate") {
				return (value as Date).toLocaleDateString();
			}
			if (key === "weekendHolidayDetection") {
				return value ? "Enabled" : "Disabled";
			}
			if (key === "spikePercentage" || key === "peerExceedPercentage") {
				return `${value}%`;
			}
			if (
				key === "minEventDuration" ||
				key === "maxTimeGap" ||
				key === "peerAggWindow"
			) {
				return `${value} minutes`;
			}
			if (key === "selectedBuildings" || key === "selectedFloors") {
				return Array.isArray(value) ? value.join(", ") : "None";
			}
			if (key === "selectedFloorsByBuilding") {
				if (value && typeof value === "object") {
					return Object.entries(value)
						.map(
							([building, floors]) =>
								`${building}: ${Array.isArray(floors) ? floors.join(", ") : floors}`,
						)
						.join("; ");
				}
				return "None";
			}
			return String(value);
		};

		(Object.keys(paramLabels) as (keyof FilterParams)[]).forEach((k) => {
			const a = savedParams[k];
			const b = filterParams[k];
			if (a === undefined) {
				return;
			}

			const isDate = k === "startDate" || k === "endDate";
			const isArray = k === "selectedBuildings" || k === "selectedFloors";
			const isObject = k === "selectedFloorsByBuilding";

			let changed: boolean;
			if (isDate) {
				changed = (a as Date).getTime() !== (b as Date).getTime();
			} else if (isArray) {
				// 比較數組內容
				const arrayA = Array.isArray(a) ? a : [];
				const arrayB = Array.isArray(b) ? b : [];
				changed =
					arrayA.length !== arrayB.length ||
					!arrayA.every(
						(item: any, index: number) => item === arrayB[index],
					);
			} else if (isObject) {
				// 比較物件內容
				changed = JSON.stringify(a) !== JSON.stringify(b);
			} else {
				changed = a !== b;
			}

			if (changed) {
				diffs.push({
					label: paramLabels[k],
					from: formatParamValue(k, a),
					to: formatParamValue(k, b),
				});
			}
		});
		return diffs;
	}, [savedParams, filterParams]);

	// Skeleton 組件
	const StageContentSkeleton = ({ type }: { type: ViewMode }) => {
		const baseSkeletonClass = "animate-pulse rounded-md bg-muted";

		if (type === "overview") {
			return (
				<div className="space-y-6">
					{/* 過濾參數 skeleton */}
					<Card>
						<CardHeader>
							<Skeleton className="h-6 w-48" />
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<Skeleton className="h-20" />
								<Skeleton className="h-20" />
							</div>
							<Skeleton className="h-32" />
							<div className="flex gap-2">
								<Skeleton className="h-10 w-24" />
								<Skeleton className="h-10 w-32" />
							</div>
						</CardContent>
					</Card>
					{/* 結果摘要 skeleton */}
					<Card>
						<CardHeader>
							<Skeleton className="h-6 w-36" />
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<Skeleton className="h-24" />
								<Skeleton className="h-24" />
								<Skeleton className="h-24" />
							</div>
						</CardContent>
					</Card>
				</div>
			);
		}

		if (type === "labeling") {
			return (
				<div className="space-y-6">
					{/* 標註進度 skeleton */}
					<Card>
						<CardHeader>
							<Skeleton className="h-6 w-40" />
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<Skeleton className="h-20" />
								<Skeleton className="h-20" />
								<Skeleton className="h-20" />
							</div>
							<Skeleton className="h-4 w-full" />
							<div className="flex gap-2">
								<Skeleton className="h-10 w-28" />
								<Skeleton className="h-10 w-36" />
							</div>
						</CardContent>
					</Card>
					{/* 標註系統 skeleton */}
					<Card>
						<CardContent className="p-6">
							<Skeleton className="h-96 w-full" />
						</CardContent>
					</Card>
				</div>
			);
		}

		if (type === "training") {
			return (
				<div className="space-y-6">
					{/* Header */}
					<Card>
						<CardHeader>
							<Skeleton className="h-6 w-72" />
							<Skeleton className="h-4 w-96" />
						</CardHeader>
					</Card>

					{/* Source Distribution Context */}
					<Card>
						<CardContent className="p-6 space-y-3">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div className="space-y-2">
									<Skeleton className="h-3 w-24" />
									<Skeleton className="h-4 w-40" />
								</div>
								<div className="space-y-2">
									<Skeleton className="h-3 w-24" />
									<Skeleton className="h-4 w-36" />
								</div>
								<div className="space-y-2">
									<Skeleton className="h-3 w-24" />
									<Skeleton className="h-4 w-32" />
								</div>
							</div>
							<div className="flex items-center gap-2 pt-2">
								<Skeleton className="h-4 w-4 rounded-full" />
								<Skeleton className="h-4 w-56" />
							</div>
						</CardContent>
					</Card>

					{/* Main Grid */}
					<div className="grid lg:grid-cols-5 gap-6">
						{/* Left: Setup Panels */}
						<div className="lg:col-span-2 space-y-4">
							<Card>
								<CardHeader>
									<Skeleton className="h-5 w-40" />
								</CardHeader>
								<CardContent>
									<Skeleton className="h-24" />
								</CardContent>
							</Card>
							<Card>
								<CardHeader>
									<Skeleton className="h-5 w-44" />
								</CardHeader>
								<CardContent>
									<Skeleton className="h-40" />
								</CardContent>
							</Card>
							<Card>
								<CardHeader>
									<Skeleton className="h-5 w-40" />
								</CardHeader>
								<CardContent>
									<Skeleton className="h-40" />
								</CardContent>
							</Card>
							<Card>
								<CardHeader>
									<Skeleton className="h-5 w-36" />
								</CardHeader>
								<CardContent>
									<Skeleton className="h-20" />
								</CardContent>
							</Card>
						</div>

						{/* Right: Results & Monitor */}
						<div className="lg:col-span-3 space-y-4">
							<Card>
								<CardContent className="p-6">
									<Skeleton className="h-56" />
								</CardContent>
							</Card>
							<Card>
								<CardContent className="p-6">
									<Skeleton className="h-64" />
								</CardContent>
							</Card>
							<div className="grid md:grid-cols-2 gap-4">
								<Card>
									<CardContent className="p-6">
										<Skeleton className="h-32" />
									</CardContent>
								</Card>
								<Card>
									<CardContent className="p-6">
										<Skeleton className="h-32" />
									</CardContent>
								</Card>
								<Card>
									<CardContent className="p-6">
										<Skeleton className="h-32" />
									</CardContent>
								</Card>
								<Card>
									<CardContent className="p-6">
										<Skeleton className="h-32" />
									</CardContent>
								</Card>
							</div>
						</div>
					</div>
				</div>
			);
		}

		if (type === "results-analysis") {
			<div>
				<Skeleton className="h-32" />
			</div>;
		}

		return null;
	};

	return (
		<div className="space-y-8">
			<Card className="border border-blue-200">
				<CardHeader>
					<div className="mb-4 flex items-center gap-2">
						<span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
							D
						</span>
						<h2 className="text-lg font-semibold text-slate-900">
							Data & Results Analysis
						</h2>
					</div>
					<header className="pb-2 mb-2 border-b-4 border-emerald-600" />
				</CardHeader>
				<CardContent className="space-y-6" id="data-results-phase">
					{/* 資料集選擇器、管理和詳細資訊 */}
					<DatasetPanel
						selectedRunId={selectedRunId}
						setSelectedRunId={handleSelectedRunIdChange}
						experimentRuns={experimentRuns}
						isLoadingRuns={isLoadingRuns}
						isCreatingRun={isCreatingRun}
						setIsCreatingRun={setIsCreatingRun}
						addExperimentRun={addExperimentRun}
						setExperimentRuns={setExperimentRuns}
						onSaveParameters={handleSaveParameters}
						setSavedParams={setSavedParams}
						filterParams={filterParams}
						showPendingChanges={pendingDiffs().length > 0}
						pendingDiffs={pendingDiffs()}
						showFilterParams={viewMode === "overview"}
					/>
					{/* Stage Content */}
					{!selectedRunId ? (
						<Card>
							<CardHeader>
								<div className="text-slate-800 font-semibold">
									No dataset selected
								</div>
							</CardHeader>
							<CardContent>
								<div className="text-slate-600">
									Please select an existing dataset or create
									a new one to begin.
								</div>
							</CardContent>
						</Card>
					) : (
						<>
							{/* Tab Navigation */}
							<div className="flex items-center gap-2 border-b">
								{tabs.map((tab) => (
									<button
										key={tab.key}
										type="button"
										onClick={() =>
											handleViewModeChange(tab.key)
										}
										className={`px-4 py-2 border-b-2 transition-colors ${
											viewMode === tab.key
												? "text-blue-600 font-semibold border-blue-600"
												: "text-slate-500 border-transparent hover:text-slate-700"
										}`}
									>
										{tab.title}
									</button>
								))}
							</div>

							{viewMode === "overview" &&
								(isTabLoading ? (
									<StageContentSkeleton type="overview" />
								) : (
									<Stage1Automation
										selectedRunId={selectedRunId}
										filterParams={filterParams}
										savedParams={savedParams}
										onSaveParameters={handleSaveParameters}
										pendingDiffs={pendingDiffs()}
										onFilterParamChange={updateFilterParam}
										onProceedToStage2={() =>
											handleViewModeChange("labeling")
										}
									/>
								))}

							{viewMode === "labeling" &&
								(isTabLoading ? (
									<StageContentSkeleton type="labeling" />
								) : (
									<Stage2LabelingRefactored
										selectedRunId={selectedRunId}
										candidateCount={candidateCount}
										labeledPositive={labeledPositive}
										labeledNormal={labeledNormal}
										onUpdateRunStatus={
											updateExperimentRunStatus
										}
										onBackToOverview={() =>
											handleViewModeChange("overview")
										}
										onProceedToTraining={() =>
											handleViewModeChange("training")
										}
										onLabelingProgress={
											handleLabelingProgress
										}
										isCompleted={
											experimentRuns.find(
												(run) =>
													run.id === selectedRunId,
											)?.status === "COMPLETED"
										}
									/>
								))}
							{viewMode === "training" &&
								(isTabLoading ? (
									<StageContentSkeleton type="training" />
								) : (
									<Stage3ExperimentWorkbench
										selectedRunId={selectedRunId}
									/>
								))}
							{viewMode === "results-analysis" && (
								<Stage4ResultsAnalysis
									selectedRunId={selectedRunId}
									// filterParams={filterParams}
									// savedParams={savedParams}
									// onSaveParameters={handleSaveParameters}
									// pendingDiffs={pendingDiffs()}
									// onFilterParamChange={updateFilterParam}
								/>
							)}
						</>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
