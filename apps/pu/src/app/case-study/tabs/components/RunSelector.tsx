import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useCallback, useEffect, useState } from "react";
import * as datasetService from "../../services/datasetService";

interface RunSelectorProps {
	selectedRunId: string | null;
	onRunChange: (runId: string | null) => void;
	placeholder?: string;
	className?: string;
	label?: string;
}

/**
 * 統一的實驗運行選擇器組件
 * 用於所有 stage 的資料集選擇
 */
export function RunSelector({
	selectedRunId,
	onRunChange,
	placeholder = "-- Select dataset --",
	className = "w-80",
	label,
}: RunSelectorProps) {
	// 使用固定 ID 避免 hydration 問題
	const selectId = "run-selector";
	const [isLoadingRuns, setIsLoadingRuns] = useState(false);
	const [experimentRuns, setExperimentRuns] = useState<
		Array<{ id: string; name: string; status: string }>
	>([]);

	// 載入實驗運行清單
	const loadAllExperimentRuns = useCallback(async () => {
		setIsLoadingRuns(true);
		try {
			const runs = await datasetService.loadExperimentRuns();
			setExperimentRuns(runs);

			// 如果沒有選中的run且有可用的runs，選擇第一個
			if (!selectedRunId && runs.length > 0) {
				onRunChange(runs[0].id);
			}
		} catch (error) {
			console.error("Failed to load experiment runs:", error);
			setExperimentRuns([]);
		} finally {
			setIsLoadingRuns(false);
		}
	}, [selectedRunId, onRunChange]);

	// 組件初始化時載入所有 dataset
	useEffect(() => {
		loadAllExperimentRuns();
	}, [loadAllExperimentRuns]);

	// 獲取狀態顯示樣式
	const getStatusBadge = (status: string) => {
		switch (status) {
			case "COMPLETED":
				return (
					<span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
						✓ COMPLETED
					</span>
				);
			case "LABELING":
				return (
					<span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
						● LABELING
					</span>
				);
			case "CONFIGURING":
				return (
					<span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
						○ CONFIGURING
					</span>
				);
			default:
				return (
					<span className="ml-2 text-xs text-gray-500">
						({status})
					</span>
				);
		}
	};

	return (
		<div className={`flex items-center gap-3 ${className}`}>
			{label && (
				<label
					htmlFor={selectId}
					className="text-sm font-medium text-gray-700 whitespace-nowrap"
				>
					{label}
				</label>
			)}
			<div className="flex-1">
				<Select
					value={selectedRunId ?? ""}
					onValueChange={(val) =>
						onRunChange(val === "__clear" ? null : val)
					}
				>
					<SelectTrigger id={selectId}>
						<SelectValue
							placeholder={
								isLoadingRuns
									? "Loading datasets..."
									: placeholder
							}
						/>
					</SelectTrigger>
					<SelectContent>
						{!isLoadingRuns && experimentRuns.length > 0 && (
							<>
								<SelectItem value="__clear">
									-- Clear selection --
								</SelectItem>
								{experimentRuns.map((run) => (
									<SelectItem key={run.id} value={run.id}>
										<div className="flex items-center justify-between w-full">
											<span>{run.name}</span>
											{run.status &&
												getStatusBadge(run.status)}
										</div>
									</SelectItem>
								))}
							</>
						)}
						{!isLoadingRuns && experimentRuns.length === 0 && (
							<SelectItem value="__empty" disabled>
								No datasets available
							</SelectItem>
						)}
						{isLoadingRuns && (
							<SelectItem value="__loading" disabled>
								Loading...
							</SelectItem>
						)}
					</SelectContent>
				</Select>
			</div>
		</div>
	);
}
