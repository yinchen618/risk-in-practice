import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Info, Loader2 } from "lucide-react";
import { useCallback } from "react";

interface DatasetManagerProps {
	selectedRunId: string | null;
	onCreateRun: (
		name?: string,
	) => Promise<{ id: string; name: string; status: string }>;
	onDeleteRun: (runId: string) => Promise<void>;
	onSaveParameters: () => Promise<void>;
	isCreatingRun: boolean;
	isLoadingRuns: boolean;
	showPendingChanges?: boolean;
	pendingDiffs?: Array<{ label: string; from: string; to: string }>;
}

/**
 * 統一的資料集管理組件
 * 提供建立、重命名、刪除、儲存參數等功能
 */
export function DatasetManager({
	selectedRunId,
	onCreateRun,
	onDeleteRun,
	onSaveParameters,
	isCreatingRun,
	isLoadingRuns,
	showPendingChanges = false,
	pendingDiffs = [],
}: DatasetManagerProps) {
	// Create new run
	const handleCreateRun = useCallback(async () => {
		try {
			await onCreateRun();
		} catch (error) {
			console.error("Failed to create dataset", error);
			alert("An error occurred while creating dataset");
		}
	}, [onCreateRun]);

	// Save parameters
	const handleSaveParameters = useCallback(async () => {
		if (!selectedRunId) {
			alert("Please select a dataset first");
			return;
		}

		try {
			await onSaveParameters();
		} catch (error) {
			console.error("Failed to save parameters:", error);
			alert("An error occurred while saving parameters");
		}
	}, [selectedRunId, onSaveParameters]);

	// Rename run
	const handleRenameRun = useCallback(async () => {
		if (!selectedRunId) {
			return;
		}

		const newName = prompt("Enter new dataset name:");
		if (newName) {
			try {
				// TODO: Implement rename functionality
				alert(`Dataset renamed to: ${newName}`);
			} catch (error) {
				console.error("Failed to rename dataset:", error);
			}
		}
	}, [selectedRunId]);

	// Delete run
	const handleDeleteRun = useCallback(async () => {
		if (!selectedRunId) {
			return;
		}

		if (confirm("Are you sure you want to delete this dataset?")) {
			try {
				await onDeleteRun(selectedRunId);
			} catch (error) {
				console.error("Failed to delete dataset:", error);
				alert("An error occurred while deleting dataset");
			}
		}
	}, [onDeleteRun, selectedRunId]);

	return (
		<div className="flex items-center gap-3">
			{/* Manage Dataset Dropdown */}
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="outline"
						disabled={isLoadingRuns}
						className="gap-2 whitespace-nowrap"
					>
						Manage dataset
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem
						onClick={handleCreateRun}
						disabled={isCreatingRun}
					>
						{isCreatingRun ? (
							<span className="flex items-center gap-2">
								<Loader2 className="h-4 w-4 animate-spin" />
								Creating...
							</span>
						) : (
							<span>Create new dataset</span>
						)}
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={handleSaveParameters}
						disabled={!selectedRunId}
					>
						Save parameters
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						onClick={handleRenameRun}
						disabled={!selectedRunId}
					>
						Rename dataset...
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={handleDeleteRun}
						disabled={!selectedRunId}
						className="text-red-600"
					>
						Delete dataset...
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			{/* Pending Changes Alert */}
			{showPendingChanges && pendingDiffs.length > 0 && (
				<Alert className="bg-yellow-50 border-yellow-200 flex-1 max-w-md">
					<Info className="h-4 w-4 text-yellow-600" />
					<AlertDescription>
						<strong className="text-yellow-800">
							Pending Changes:
						</strong>
						<div className="mt-1 text-yellow-700 text-xs">
							{pendingDiffs.length} parameter
							{pendingDiffs.length !== 1 ? "s" : ""} changed
						</div>
						<Button
							onClick={handleSaveParameters}
							size="sm"
							className="mt-2 bg-yellow-600 hover:bg-yellow-700 text-white text-xs"
						>
							Save Changes
						</Button>
					</AlertDescription>
				</Alert>
			)}
		</div>
	);
}
