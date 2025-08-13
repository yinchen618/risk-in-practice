import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

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

			// 如果 URL 有 run 參數，設定為選中；否則選第一個
			const runFromUrl = searchParams.get("run");
			if (runFromUrl && runs.some((r: any) => r.id === runFromUrl)) {
				onRunChange(runFromUrl);
			} else if (!selectedRunId && runs.length > 0) {
				onRunChange(runs[0].id);
			}
		} catch (error) {
			console.error("Failed to load experiment runs:", error);
			setExperimentRuns([]);
		} finally {
			setIsLoadingRuns(false);
		}
	}, [searchParams, selectedRunId, onRunChange]);

	// 組件初始化時載入所有 dataset
	useEffect(() => {
		loadAllExperimentRuns();
	}, [loadAllExperimentRuns]);

	// URL 同步管理
	useEffect(() => {
		const current = new URLSearchParams(searchParams.toString());
		if (selectedRunId) {
			current.set("run", selectedRunId);
		} else {
			current.delete("run");
		}
		const next = `${pathname}?${current.toString()}`;
		router.replace(next, { scroll: false });
	}, [selectedRunId, pathname, router, searchParams]);

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
										{run.name}
										{run.status && (
											<span className="ml-2 text-xs text-gray-500">
												({run.status})
											</span>
										)}
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
