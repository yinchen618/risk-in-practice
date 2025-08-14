"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Building2, Calendar } from "lucide-react";
import { useCallback } from "react";

type TimeRangeMode = "original" | "custom";

interface TimeRangeParams {
	startDate: Date;
	endDate: Date;
	startTime: string;
	endTime: string;
}

interface FloorParams {
	selectedBuildings: string[];
	selectedFloors: string[];
	selectedFloorsByBuilding?: Record<string, string[]>;
}

interface DataRangeConfig {
	mode: TimeRangeMode;
	timeRange?: TimeRangeParams;
	floor?: FloorParams;
	originalTimeRange?: TimeRangeParams;
	originalFloor?: FloorParams;
}

interface DataRangeConfigPanelProps {
	config?: DataRangeConfig;
	onConfigChange?: (config: Partial<DataRangeConfig>) => void;
}

// 根據 meter.csv 分析的樓層資料
const BUILDINGS_WITH_FLOORS = [
	{
		id: "Building A",
		name: "Building A",
		floors: ["1", "2", "3", "5"],
	},
	{
		id: "Building B",
		name: "Building B",
		floors: ["1", "2", "3", "5", "6"],
	},
];

const ALL_FLOORS = [
	{ id: "1", name: "1F" },
	{ id: "2", name: "2F" },
	{ id: "3", name: "3F" },
	{ id: "5", name: "5F" },
	{ id: "6", name: "6F" },
];

export function DataRangeConfigPanel({
	config,
	onConfigChange,
}: DataRangeConfigPanelProps) {
	if (!config || !onConfigChange) {
		return null;
	}

	const {
		mode: timeRangeMode,
		timeRange,
		floor,
		originalTimeRange,
		originalFloor,
	} = config;

	// Handler for building selection
	const handleBuildingChange = useCallback(
		(buildingId: string, checked: boolean) => {
			if (!floor) {
				return;
			}

			const building = BUILDINGS_WITH_FLOORS.find(
				(b) => b.id === buildingId,
			);
			if (!building) {
				return;
			}

			const currentFloorsByBuilding =
				floor.selectedFloorsByBuilding || {};
			const newFloorsByBuilding = {
				...currentFloorsByBuilding,
				[buildingId]: checked ? building.floors : [],
			};

			const allSelectedFloors = Object.values(newFloorsByBuilding).flat();

			onConfigChange({
				floor: {
					...floor,
					selectedFloorsByBuilding: newFloorsByBuilding,
					selectedFloors: allSelectedFloors,
				},
			});
		},
		[onConfigChange, floor],
	);

	// Handler for individual floor selection
	const handleFloorChange = useCallback(
		(floorId: string, checked: boolean, buildingId?: string) => {
			if (!floor || !buildingId) {
				return;
			}

			const currentFloorsByBuilding =
				floor.selectedFloorsByBuilding || {};
			const currentBuildingFloors =
				currentFloorsByBuilding[buildingId] || [];
			let newBuildingFloors: string[];

			if (checked) {
				newBuildingFloors = [...currentBuildingFloors, floorId];
			} else {
				newBuildingFloors = currentBuildingFloors.filter(
					(id: string) => id !== floorId,
				);
			}

			const newFloorsByBuilding = {
				...currentFloorsByBuilding,
				[buildingId]: newBuildingFloors,
			};

			const allSelectedFloors = Object.values(newFloorsByBuilding).flat();

			onConfigChange({
				floor: {
					...floor,
					selectedFloorsByBuilding: newFloorsByBuilding,
					selectedFloors: allSelectedFloors,
				},
			});
		},
		[floor, onConfigChange],
	);

	return (
		<div className="space-y-4">
			<h4 className="font-medium text-slate-800 flex items-center">
				<Calendar className="h-4 w-4 mr-2" />
				Training Data Range Selection
			</h4>
			<RadioGroup
				value={timeRangeMode}
				onValueChange={(value) =>
					onConfigChange({ mode: value as TimeRangeMode })
				}
				className="flex flex-col space-y-2"
			>
				<div className="flex items-center space-x-2">
					<RadioGroupItem value="original" id="original" />
					<Label htmlFor="original" className="text-sm">
						Use Original Labeling Period (Recommended)
					</Label>
				</div>
				<div className="flex items-center space-x-2">
					<RadioGroupItem value="custom" id="custom" />
					<Label htmlFor="custom" className="text-sm">
						Custom Time Range & Building Selection
					</Label>
				</div>
			</RadioGroup>

			{timeRangeMode === "original" && originalTimeRange && (
				<div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
					<div className="text-sm text-blue-800">
						<div className="font-medium mb-2">
							Original Labeling Period:
						</div>
						<div className="space-y-1">
							<div>
								Start:{" "}
								{originalTimeRange.startDate.toLocaleDateString()}{" "}
								{originalTimeRange.startTime}
							</div>
							<div>
								End:{" "}
								{originalTimeRange.endDate.toLocaleDateString()}{" "}
								{originalTimeRange.endTime}
							</div>
							{originalFloor?.selectedFloorsByBuilding &&
							Object.keys(originalFloor.selectedFloorsByBuilding)
								.length > 0 ? (
								<div>
									Buildings & Floors:{" "}
									{Object.entries(
										originalFloor.selectedFloorsByBuilding,
									)
										.filter(
											([_, floors]) => floors.length > 0,
										)
										.map(
											([building, floors]) =>
												`${building}: ${floors.map((f) => `${f}F`).join(", ")}`,
										)
										.join(" | ")}
								</div>
							) : (
								originalFloor?.selectedFloors &&
								originalFloor.selectedFloors.length > 0 && (
									<div>
										Floors:{" "}
										{originalFloor.selectedFloors
											.map((f) => `${f}F`)
											.join(", ")}
									</div>
								)
							)}
						</div>
					</div>
				</div>
			)}

			{/* Custom Time Range & Building Filter */}
			{timeRangeMode === "custom" && timeRange && floor && (
				<div className="space-y-6">
					<div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
						<h4 className="font-semibold text-slate-800 mb-4 flex items-center">
							<Calendar className="h-5 w-5 mr-2" />
							Custom Time Range & Building Filter
						</h4>

						{/* Three Column Layout */}
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
							{/* Time Range Section */}
							<div className="bg-white p-4 rounded-lg border border-slate-200">
								<h5 className="font-medium text-slate-700 mb-3 flex items-center">
									<Calendar className="h-4 w-4 mr-2 text-blue-600" />
									Date & Time Selection
								</h5>
								<div className="space-y-4">
									<div>
										<Label className="text-sm font-medium text-slate-700 mb-1 block">
											Start Date
										</Label>
										<input
											type="date"
											value={
												timeRange.startDate
													.toISOString()
													.split("T")[0]
											}
											onChange={(e) =>
												onConfigChange({
													timeRange: {
														...timeRange,
														startDate: new Date(
															e.target.value,
														),
													},
												})
											}
											className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
										/>
									</div>
									<div>
										<Label className="text-sm font-medium text-slate-700 mb-1 block">
											Start Time
										</Label>
										<input
											type="time"
											value={timeRange.startTime}
											onChange={(e) =>
												onConfigChange({
													timeRange: {
														...timeRange,
														startTime:
															e.target.value,
													},
												})
											}
											className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
										/>
									</div>
									<div>
										<Label className="text-sm font-medium text-slate-700 mb-1 block">
											End Date
										</Label>
										<input
											type="date"
											value={
												timeRange.endDate
													.toISOString()
													.split("T")[0]
											}
											onChange={(e) =>
												onConfigChange({
													timeRange: {
														...timeRange,
														endDate: new Date(
															e.target.value,
														),
													},
												})
											}
											className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
										/>
									</div>
									<div>
										<Label className="text-sm font-medium text-slate-700 mb-1 block">
											End Time
										</Label>
										<input
											type="time"
											value={timeRange.endTime}
											onChange={(e) =>
												onConfigChange({
													timeRange: {
														...timeRange,
														endTime: e.target.value,
													},
												})
											}
											className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
										/>
									</div>
								</div>
							</div>

							{/* Building A Section */}
							<div className="bg-white p-4 rounded-lg border border-slate-200">
								<div className="flex items-center justify-between mb-3">
									<h5 className="font-medium text-slate-700 flex items-center">
										<Building2 className="h-4 w-4 mr-2 text-emerald-600" />
										Building A
									</h5>
									<Checkbox
										id={`building-${BUILDINGS_WITH_FLOORS[0].id}`}
										checked={
											floor.selectedFloorsByBuilding?.[
												BUILDINGS_WITH_FLOORS[0].id
											]?.length ===
											BUILDINGS_WITH_FLOORS[0].floors
												.length
										}
										onCheckedChange={(checked) =>
											handleBuildingChange(
												BUILDINGS_WITH_FLOORS[0].id,
												checked as boolean,
											)
										}
									/>
								</div>
								<div className="space-y-2">
									{BUILDINGS_WITH_FLOORS[0].floors.map(
										(floorId) => {
											const floorInfo = ALL_FLOORS.find(
												(f) => f.id === floorId,
											);
											const isFloorSelected =
												floor.selectedFloorsByBuilding?.[
													BUILDINGS_WITH_FLOORS[0].id
												]?.includes(floorId) || false;
											return (
												<div
													key={`${BUILDINGS_WITH_FLOORS[0].id}-${floorId}`}
													className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-md hover:bg-slate-100 transition-colors"
												>
													<Label
														htmlFor={`floor-${BUILDINGS_WITH_FLOORS[0].id}-${floorId}`}
														className="text-sm text-slate-700 cursor-pointer"
													>
														{floorInfo?.name}
													</Label>
													<Checkbox
														id={`floor-${BUILDINGS_WITH_FLOORS[0].id}-${floorId}`}
														checked={
															isFloorSelected
														}
														onCheckedChange={(
															checked,
														) =>
															handleFloorChange(
																floorId,
																checked as boolean,
																BUILDINGS_WITH_FLOORS[0]
																	.id,
															)
														}
													/>
												</div>
											);
										},
									)}
								</div>
							</div>

							{/* Building B Section */}
							<div className="bg-white p-4 rounded-lg border border-slate-200">
								<div className="flex items-center justify-between mb-3">
									<h5 className="font-medium text-slate-700 flex items-center">
										<Building2 className="h-4 w-4 mr-2 text-orange-600" />
										Building B
									</h5>
									<Checkbox
										id={`building-${BUILDINGS_WITH_FLOORS[1].id}`}
										checked={
											floor.selectedFloorsByBuilding?.[
												BUILDINGS_WITH_FLOORS[1].id
											]?.length ===
											BUILDINGS_WITH_FLOORS[1].floors
												.length
										}
										onCheckedChange={(checked) =>
											handleBuildingChange(
												BUILDINGS_WITH_FLOORS[1].id,
												checked as boolean,
											)
										}
									/>
								</div>
								<div className="space-y-2">
									{BUILDINGS_WITH_FLOORS[1].floors.map(
										(floorId) => {
											const floorInfo = ALL_FLOORS.find(
												(f) => f.id === floorId,
											);
											const isFloorSelected =
												floor.selectedFloorsByBuilding?.[
													BUILDINGS_WITH_FLOORS[1].id
												]?.includes(floorId) || false;
											return (
												<div
													key={`${BUILDINGS_WITH_FLOORS[1].id}-${floorId}`}
													className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-md hover:bg-slate-100 transition-colors"
												>
													<Label
														htmlFor={`floor-${BUILDINGS_WITH_FLOORS[1].id}-${floorId}`}
														className="text-sm text-slate-700 cursor-pointer"
													>
														{floorInfo?.name}
													</Label>
													<Checkbox
														id={`floor-${BUILDINGS_WITH_FLOORS[1].id}-${floorId}`}
														checked={
															isFloorSelected
														}
														onCheckedChange={(
															checked,
														) =>
															handleFloorChange(
																floorId,
																checked as boolean,
																BUILDINGS_WITH_FLOORS[1]
																	.id,
															)
														}
													/>
												</div>
											);
										},
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
