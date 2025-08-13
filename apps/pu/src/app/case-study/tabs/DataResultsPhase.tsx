"use client";

import { DatasetPanel } from "@/app/case-study/tabs/components/DatasetPanel";
import { useCallback, useState } from "react";
import { Stage1Automation } from "../components/Stage1AutomationRefactored";
import Stage2LabelingRefactored from "../components/Stage2LabelingRefactored";
import { Stage3ModelTraining } from "../components/Stage3ModelTraining";
import { Stage4ModelEvaluation } from "../components/Stage4ModelEvaluation";
import * as datasetService from "../services/datasetService";
import type { FilterParams } from "../types";

type ViewMode = "overview" | "labeling" | "training" | "evaluation";

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
		title: "3 Model Training",
	},
	{
		key: "evaluation" as const,
		title: "4 Evaluation & Insights",
	},
];

export function DataResultsPhase() {
	const [viewMode, setViewMode] = useState<ViewMode>("overview");

	// Run 狀態管理
	const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
	const [experimentRuns, setExperimentRuns] = useState<
		{ id: string; name: string; status: string }[]
	>([]);
	const [isCreatingRun, setIsCreatingRun] = useState(false);
	const [isLoadingRuns, setIsLoadingRuns] = useState(false);

	// 候選事件和標註統計
	const [candidateCount, setCandidateCount] = useState(0);
	const [labeledPositive, setLabeledPositive] = useState(0);
	const [labeledNormal, setLabeledNormal] = useState(0);

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
		selectedBuildings: ["15學舍", "85學舍"],
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
		(runId: string, status: string) => {
			setExperimentRuns((prev) =>
				prev.map((r) => (r.id === runId ? { ...r, status } : r)),
			);
		},
		[],
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
			alert("Please select or create a dataset first");
			return;
		}

		try {
			await datasetService.saveParametersToRun(
				selectedRunId,
				filterParams,
			);
			setSavedParams({ ...filterParams });
			alert("Parameters saved successfully!");
		} catch (error) {
			console.error("Failed to save parameters:", error);
			alert("An error occurred while saving parameters");
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

	return (
		<div className="space-y-6" id="data-results-phase">
			{/* 資料集選擇器、管理和詳細資訊 */}
			<DatasetPanel
				selectedRunId={selectedRunId}
				setSelectedRunId={setSelectedRunId}
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
			{/* Stage Content - 只有在選擇資料集時才顯示 */}
			{selectedRunId && (
				<>
					{/* Tab Navigation */}
					<div className="flex items-center gap-2 border-b">
						{tabs.map((tab) => (
							<button
								key={tab.key}
								type="button"
								onClick={() => setViewMode(tab.key)}
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

					{viewMode === "overview" && (
						<Stage1Automation
							selectedRunId={selectedRunId}
							filterParams={filterParams}
							savedParams={savedParams}
							onSaveParameters={handleSaveParameters}
							pendingDiffs={pendingDiffs()}
							onFilterParamChange={updateFilterParam}
							onProceedToStage2={() => setViewMode("labeling")}
						/>
					)}

					{viewMode === "labeling" && (
						<Stage2LabelingRefactored
							selectedRunId={selectedRunId}
							candidateCount={candidateCount}
							labeledPositive={labeledPositive}
							labeledNormal={labeledNormal}
							onUpdateRunStatus={updateExperimentRunStatus}
							onBackToOverview={() => setViewMode("overview")}
							onProceedToTraining={() => setViewMode("training")}
						/>
					)}

					{viewMode === "training" && (
						<Stage3ModelTraining selectedRunId={selectedRunId} />
					)}

					{viewMode === "evaluation" && (
						<Stage4ModelEvaluation selectedRunId={selectedRunId} />
					)}
				</>
			)}
		</div>
	);
}
