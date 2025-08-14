"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { RefreshCw, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { AnomalyEvent } from "../types";
import { EventListItem } from "./EventListItem";

interface EventListProps {
	events: AnomalyEvent[];
	selectedEventId?: string;
	isLoading?: boolean;
	onEventSelect: (event: AnomalyEvent) => void;
	onRefresh?: () => void;
	showSearch?: boolean;
	showStatusFilter?: boolean;
	// 分頁相關
	total?: number;
	page?: number;
	limit?: number;
	onPageChange?: (page: number) => void;
	onFiltersChange?: (filters: any) => void;
	meterLabelMap?: Record<string, string>;
	// 批量標註功能
	onBatchConfirmAnomaly?: (eventIds: string[]) => void;
	isBatchProcessing?: boolean;
}

export function EventList({
	events,
	selectedEventId,
	isLoading = false,
	onEventSelect,
	onRefresh,
	showSearch = true,
	showStatusFilter = true,
	total = 0,
	page = 1,
	limit = 50,
	onPageChange,
	onFiltersChange,
	meterLabelMap = {},
	onBatchConfirmAnomaly,
	isBatchProcessing = false,
}: EventListProps) {
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);
	const [pendingBatchIds, setPendingBatchIds] = useState<string[]>([]);

	// 處理篩選變更
	const handleFilterChange = (
		newSearchTerm?: string,
		newStatusFilter?: string,
	) => {
		const search = newSearchTerm !== undefined ? newSearchTerm : searchTerm;
		const status =
			newStatusFilter !== undefined ? newStatusFilter : statusFilter;

		if (onFiltersChange) {
			const filters: any = {};
			if (search) {
				filters.search = search;
			}
			if (status !== "all") {
				filters.status = status;
			}
			onFiltersChange(filters);
		}
	};

	// 使用所有事件，不進行前端篩選（已由後端處理）
	const displayEvents = events || [];

	// 批量確認異常事件
	const handleBatchConfirmAnomaly = () => {
		if (!onBatchConfirmAnomaly || displayEvents.length === 0) {
			return;
		}

		// 過濾出未處理的事件IDs
		const unprocessedEventIds = displayEvents
			.filter((event) => event.status === "UNREVIEWED")
			.map((event) => event.id);

		if (unprocessedEventIds.length === 0) {
			toast.warning("No unreviewed events available for labeling");
			return;
		}

		// 設置待處理的事件IDs並顯示確認對話框
		setPendingBatchIds(unprocessedEventIds);
		setShowConfirmDialog(true);
	};

	// 確認批量處理
	const handleConfirmBatch = async () => {
		setShowConfirmDialog(false);

		if (pendingBatchIds.length > 0 && onBatchConfirmAnomaly) {
			toast.promise(
				Promise.resolve(onBatchConfirmAnomaly(pendingBatchIds)),
				{
					loading: `Processing ${pendingBatchIds.length} events...`,
					success: "Batch labeling completed successfully",
					error: "Failed to complete batch labeling",
				},
			);
		}

		setPendingBatchIds([]);
	};

	// 取消批量處理
	const handleCancelBatch = () => {
		setShowConfirmDialog(false);
		setPendingBatchIds([]);
	};

	return (
		<div className="h-full flex flex-col">
			{/* Title and Action Buttons */}
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-lg font-semibold text-gray-800">
					Anomaly Candidates
				</h3>
				<div className="flex items-center gap-2">
					{onRefresh && (
						<Button
							variant="outline"
							size="sm"
							onClick={onRefresh}
							disabled={isLoading}
						>
							<RefreshCw
								className={`size-4 mr-1 ${
									isLoading ? "animate-spin" : ""
								}`}
							/>
							Refresh
						</Button>
					)}
				</div>
			</div>

			{/* Filter Controls */}
			<div className="space-y-3 mb-4">
				{showSearch && (
					<div>
						<Label htmlFor="search" className="text-sm font-medium">
							Search Events
						</Label>
						<div className="relative mt-1">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
							<Input
								id="search"
								placeholder="Search by Event ID or Meter ID..."
								value={searchTerm}
								onChange={(e) => {
									setSearchTerm(e.target.value);
									// Delayed search execution to avoid too frequent API calls
									const timeoutId = setTimeout(() => {
										handleFilterChange(e.target.value);
									}, 500);
									return () => clearTimeout(timeoutId);
								}}
								className="pl-10"
							/>
						</div>
					</div>
				)}

				{showStatusFilter && (
					<div>
						<Label
							htmlFor="status-filter"
							className="text-sm font-medium"
						>
							Filter by Status
						</Label>
						<Select
							value={statusFilter}
							onValueChange={(value) => {
								setStatusFilter(value);
								handleFilterChange(undefined, value);
							}}
						>
							<SelectTrigger className="mt-1">
								<SelectValue placeholder="Select Status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Status</SelectItem>
								<SelectItem value="UNREVIEWED">
									Pending Review
								</SelectItem>
								<SelectItem value="CONFIRMED_POSITIVE">
									Confirmed Anomaly
								</SelectItem>
								<SelectItem value="REJECTED_NORMAL">
									Rejected Normal
								</SelectItem>
							</SelectContent>
						</Select>
					</div>
				)}
			</div>

			{/* Batch Action Button */}
			{onBatchConfirmAnomaly && (
				<div className="mb-4">
					<Button
						variant="secondary"
						size="sm"
						onClick={handleBatchConfirmAnomaly}
						disabled={isLoading || isBatchProcessing}
						className="bg-orange-100 hover:bg-orange-200 text-orange-800 border-orange-300 w-full"
					>
						{isBatchProcessing ? (
							<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600 mr-2" />
						) : null}
						Confirm All as Anomaly
					</Button>
				</div>
			)}

			{/* Event Statistics and Pagination */}
			<div className="flex items-center justify-between text-sm text-gray-600 mb-3">
				<div>
					Showing {displayEvents.length} / {total} events
					{total > limit && (
						<span className="ml-2">
							(Page {page}, Total {Math.ceil(total / limit)}{" "}
							pages)
						</span>
					)}
				</div>
				{total > limit && onPageChange && (
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => onPageChange(page - 1)}
							disabled={page <= 1}
						>
							Previous
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => onPageChange(page + 1)}
							disabled={page >= Math.ceil(total / limit)}
						>
							Next
						</Button>
					</div>
				)}
			</div>

			{/* Event List */}
			<div className="flex-1 overflow-y-auto space-y-2 border rounded-lg p-3 bg-gray-50">
				{isLoading ? (
					<div className="flex items-center justify-center h-32">
						<div className="flex items-center gap-2">
							<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
							<div className="text-gray-500">Loading...</div>
						</div>
					</div>
				) : displayEvents.length === 0 ? (
					<div className="flex items-center justify-center h-32">
						<div className="text-center text-gray-500">
							<p>No events found matching the criteria</p>
							{(searchTerm || statusFilter !== "all") && (
								<p className="text-xs mt-1">
									Try adjusting search terms or filters
								</p>
							)}
						</div>
					</div>
				) : (
					displayEvents.map((event) => (
						<EventListItem
							key={event.id}
							event={event}
							isSelected={selectedEventId === event.id}
							onSelect={onEventSelect}
							meterLabel={meterLabelMap[event.meterId]}
						/>
					))
				)}
			</div>

			{/* Confirmation Dialog */}
			<Dialog
				open={showConfirmDialog}
				onOpenChange={setShowConfirmDialog}
			>
				<DialogContent className="max-w-md">
					<DialogHeader className="space-y-4">
						<DialogTitle className="text-xl font-semibold text-gray-900">
							Batch Anomaly Classification Confirmation
						</DialogTitle>
						<DialogDescription className="text-gray-600 leading-relaxed">
							You are about to classify{" "}
							<span className="font-medium text-gray-900">
								{pendingBatchIds.length}
							</span>{" "}
							unreviewed events as anomalous instances. This
							operation will update the training dataset and
							cannot be reversed.
							<br />
							<br />
							<span className="text-sm text-gray-500">
								Please confirm to proceed with the batch
								labeling operation.
							</span>
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="flex gap-3 pt-6">
						<Button
							variant="outline"
							onClick={handleCancelBatch}
							disabled={isBatchProcessing}
							className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
						>
							Cancel Operation
						</Button>
						<Button
							onClick={handleConfirmBatch}
							disabled={isBatchProcessing}
							className="flex-1 bg-slate-700 hover:bg-slate-800 text-white font-medium"
						>
							{isBatchProcessing ? (
								<>
									<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
									Processing...
								</>
							) : (
								"Confirm Classification"
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
