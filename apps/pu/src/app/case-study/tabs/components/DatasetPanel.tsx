import { useCallback } from "react";
import * as datasetService from "../../services/datasetService";
import type { FilterParams } from "../../types";
import { DatasetInfo } from "./DatasetInfo";
import { DatasetManager } from "./DatasetManager";
import { RunSelector } from "./RunSelector";

interface DatasetPanelProps {
	// Run 狀態
	selectedRunId: string | null;
	setSelectedRunId: (runId: string | null) => void;
	experimentRuns: Array<{ id: string; name: string; status: string }>;
	isLoadingRuns: boolean;
	isCreatingRun: boolean;
	setIsCreatingRun: (loading: boolean) => void;

	// 實驗運行管理
	addExperimentRun: (run: {
		id: string;
		name: string;
		status: string;
	}) => void;
	setExperimentRuns: React.Dispatch<
		React.SetStateAction<
			Array<{ id: string; name: string; status: string }>
		>
	>;

	// 其他功能
	onSaveParameters: () => Promise<void>;
	setSavedParams: (params: FilterParams) => void;

	// 參數相關
	filterParams?: FilterParams;
	showPendingChanges?: boolean;
	pendingDiffs?: Array<{ label: string; from: string; to: string }>;
	showFilterParams?: boolean;
}

/**
 * 統一的資料集選擇和管理面板
 * 整合了 RunSelector、DatasetManager 和 DatasetInfo 的功能
 */
export function DatasetPanel({
	selectedRunId,
	setSelectedRunId,
	experimentRuns,
	isLoadingRuns,
	isCreatingRun,
	setIsCreatingRun,
	addExperimentRun,
	setExperimentRuns,
	onSaveParameters,
	setSavedParams,
	filterParams,
	showPendingChanges = false,
	pendingDiffs = [],
	showFilterParams = false,
}: DatasetPanelProps) {
	// 創建新的實驗運行
	const createNewRun = useCallback(
		async (name?: string) => {
			setIsCreatingRun(true);
			try {
				const newRun =
					await datasetService.createNewExperimentRun(name);
				addExperimentRun(newRun);
				setSelectedRunId(newRun.id);
				if (filterParams) {
					setSavedParams(filterParams);
				}
				return newRun;
			} catch (error) {
				console.error("Failed to create new run:", error);
				throw error;
			} finally {
				setIsCreatingRun(false);
			}
		},
		[
			addExperimentRun,
			filterParams,
			setIsCreatingRun,
			setSelectedRunId,
			setSavedParams,
		],
	);

	// 刪除實驗運行
	const removeExperimentRun = useCallback(
		async (runId: string) => {
			try {
				// TODO: 呼叫後端 API 刪除 experiment run
				// const response = await fetch(`http://localhost:8000/api/v1/experiment-runs/${runId}`, {
				// 	method: "DELETE",
				// });
				// if (!response.ok) {
				// 	throw new Error("Failed to delete dataset");
				// }

				// 目前只從本地狀態移除
				setExperimentRuns((prev) => prev.filter((r) => r.id !== runId));

				// 如果刪除的是當前選中的 run，清除選擇
				if (runId === selectedRunId) {
					setSelectedRunId(null);
				}
			} catch (error) {
				console.error("Failed to delete dataset:", error);
				throw error;
			}
		},
		[selectedRunId, setExperimentRuns, setSelectedRunId],
	);

	return (
		<div className="space-y-4">
			{/* 資料集選擇器和管理 */}
			<div className="p-4 bg-slate-50 rounded-lg border space-y-4">
				<div className="flex items-start gap-4  lg:w-200">
					<div className="flex-1">
						<RunSelector
							label="Dataset:"
							selectedRunId={selectedRunId}
							onRunChange={setSelectedRunId}
							placeholder="Select an experiment run"
							className="w-full"
						/>
					</div>
					<DatasetManager
						selectedRunId={selectedRunId}
						onCreateRun={createNewRun}
						onDeleteRun={removeExperimentRun}
						onSaveParameters={onSaveParameters}
						isCreatingRun={isCreatingRun}
						isLoadingRuns={isLoadingRuns}
						showPendingChanges={showPendingChanges}
						pendingDiffs={pendingDiffs}
					/>
				</div>
			</div>

			{/* 資料集詳細資訊 */}
			<DatasetInfo
				selectedRunId={selectedRunId}
				experimentRuns={experimentRuns}
				filterParams={filterParams}
				showFilterParams={showFilterParams}
			/>
		</div>
	);
}
