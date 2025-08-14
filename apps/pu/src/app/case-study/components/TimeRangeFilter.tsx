"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Building2, Calendar, Loader2, Play } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import type { FloorParams } from "../types";

export interface TimeRangeParams {
	startDate: Date;
	endDate: Date;
	startTime: string;
	endTime: string;
}

export interface MeterDataCount {
	time_range: {
		start: string;
		end: string;
		span_days: number;
	};
	total_records: number;
	unique_devices: number;
	avg_records_per_device: number;
	records_per_day: number;
	device_distribution?: Array<{
		device_number: string;
		record_count: number;
	}>;
	filter_info?: {
		selected_floors_by_building?: Record<string, string[]>;
		matched_devices?: number;
	};
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

interface TimeRangeFilterProps {
	timeRange: TimeRangeParams;
	onTimeRangeChange: (key: keyof TimeRangeParams, value: any) => void;
	floor: FloorParams;
	onFloorChange: (key: keyof FloorParams, value: string[]) => void;
}

export function TimeRangeFilter({
	timeRange,
	onTimeRangeChange,
	floor,
	onFloorChange,
}: TimeRangeFilterProps) {
	const [meterDataCount, setMeterDataCount] = useState<MeterDataCount | null>(
		null,
	);
	const [isCountingMeterData, setIsCountingMeterData] = useState(false);

	// Floor filter handlers
	const handleBuildingChange = useCallback(
		(buildingId: string, checked: boolean) => {
			// 找到對應的建築物
			const building = BUILDINGS_WITH_FLOORS.find(
				(b) => b.id === buildingId,
			);
			if (!building) {
				return;
			}

			// 更新按建築分組的樓層選擇
			const currentFloorsByBuilding =
				floor.selectedFloorsByBuilding || {};
			const newFloorsByBuilding = {
				...currentFloorsByBuilding,
				[buildingId]: checked ? building.floors : [],
			};

			// 計算所有選中的樓層
			const allSelectedFloors = Object.values(newFloorsByBuilding).flat();

			// 同時更新所有相關狀態
			onFloorChange(
				"selectedFloorsByBuilding",
				newFloorsByBuilding as any,
			);
			onFloorChange("selectedFloors", allSelectedFloors);
		},
		[onFloorChange],
	);

	const handleFloorChange = useCallback(
		(floorId: string, checked: boolean, buildingId?: string) => {
			if (buildingId) {
				// 使用新的按建築分組的樓層選擇邏輯
				const currentFloorsByBuilding =
					floor.selectedFloorsByBuilding || {};
				const currentBuildingFloors =
					currentFloorsByBuilding[buildingId] || [];
				let newBuildingFloors: string[];

				if (checked) {
					newBuildingFloors = [...currentBuildingFloors, floorId];
				} else {
					newBuildingFloors = currentBuildingFloors.filter(
						(id) => id !== floorId,
					);
				}

				const newFloorsByBuilding = {
					...currentFloorsByBuilding,
					[buildingId]: newBuildingFloors,
				};

				// 同時更新傳統的 selectedFloors 以保持向後相容
				const allSelectedFloors =
					Object.values(newFloorsByBuilding).flat();

				onFloorChange(
					"selectedFloorsByBuilding",
					newFloorsByBuilding as any,
				);
				onFloorChange("selectedFloors", allSelectedFloors);
			} else {
				// 保留原有的全域樓層選擇邏輯
				const currentFloors = floor.selectedFloors || [];
				let newFloors: string[];

				if (checked) {
					newFloors = [...currentFloors, floorId];
				} else {
					newFloors = currentFloors.filter((id) => id !== floorId);
				}

				onFloorChange("selectedFloors", newFloors);

				// 同時更新按建築分組的結構
				if (checked) {
					const newFloorsByBuilding = {
						...floor.selectedFloorsByBuilding,
					};
					BUILDINGS_WITH_FLOORS.forEach((building) => {
						if (building.floors.includes(floorId)) {
							const currentBuildingFloors =
								newFloorsByBuilding[building.id] || [];
							if (!currentBuildingFloors.includes(floorId)) {
								newFloorsByBuilding[building.id] = [
									...currentBuildingFloors,
									floorId,
								];
							}
						}
					});
					onFloorChange(
						"selectedFloorsByBuilding",
						newFloorsByBuilding as any,
					);
				}
			}
		},
		[floor.selectedFloors, floor.selectedFloorsByBuilding, onFloorChange],
	);

	// Count meter data in time range
	const handleCountMeterData = useCallback(async () => {
		if (isCountingMeterData) {
			return;
		}

		setIsCountingMeterData(true);
		try {
			const response = await fetch(
				"http://localhost:8000/api/ammeters/data-count",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						start_date: timeRange.startDate
							.toISOString()
							.split("T")[0],
						end_date: timeRange.endDate.toISOString().split("T")[0],
						start_time: timeRange.startTime,
						end_time: timeRange.endTime,
						// 使用新的按建築分組功能
						selected_floors_by_building:
							floor.selectedFloorsByBuilding || {},
						selected_floors: floor.selectedFloors || [],
					}),
				},
			);

			if (response.ok) {
				const result = await response.json();
				setMeterDataCount(result.data);
			} else {
				console.error("Failed to fetch meter data count");
				toast.error("Failed to query meter data count");
			}
		} catch (error) {
			console.error("Error counting meter data:", error);
			toast.error("Error occurred while querying meter data count");
		} finally {
			setIsCountingMeterData(false);
		}
	}, [timeRange, floor.selectedFloors, isCountingMeterData]);

	return (
		<div className="space-y-6">
			{/* Main Filter Section */}
			<div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
				<h4 className="font-semibold text-slate-800 mb-4 flex items-center">
					<Calendar className="h-5 w-5 mr-2" />
					Time Range & Building Filter
				</h4>

				{/* Three Column Layout */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Time Range Section - Left Third */}
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
										onTimeRangeChange(
											"startDate",
											new Date(e.target.value),
										)
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
										onTimeRangeChange(
											"startTime",
											e.target.value,
										)
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
										onTimeRangeChange(
											"endDate",
											new Date(e.target.value),
										)
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
										onTimeRangeChange(
											"endTime",
											e.target.value,
										)
									}
									className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
								/>
							</div>
						</div>
					</div>

					{/* Building A Section - Middle Third */}
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
									BUILDINGS_WITH_FLOORS[0].floors.length
								}
								ref={(el) => {
									if (el && "indeterminate" in el) {
										const selectedFloorsCount =
											floor.selectedFloorsByBuilding?.[
												BUILDINGS_WITH_FLOORS[0].id
											]?.length || 0;
										const totalFloorsCount =
											BUILDINGS_WITH_FLOORS[0].floors
												.length;
										(el as any).indeterminate =
											selectedFloorsCount > 0 &&
											selectedFloorsCount <
												totalFloorsCount;
									}
								}}
								onCheckedChange={(checked) =>
									handleBuildingChange(
										BUILDINGS_WITH_FLOORS[0].id,
										checked as boolean,
									)
								}
							/>
						</div>
						<div className="space-y-2">
							{BUILDINGS_WITH_FLOORS[0].floors.map((floorId) => {
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
											checked={isFloorSelected}
											onCheckedChange={(checked) =>
												handleFloorChange(
													floorId,
													checked as boolean,
													BUILDINGS_WITH_FLOORS[0].id,
												)
											}
										/>
									</div>
								);
							})}
						</div>
					</div>

					{/* Building B Section - Right Third */}
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
									BUILDINGS_WITH_FLOORS[1].floors.length
								}
								ref={(el) => {
									if (el && "indeterminate" in el) {
										const selectedFloorsCount =
											floor.selectedFloorsByBuilding?.[
												BUILDINGS_WITH_FLOORS[1].id
											]?.length || 0;
										const totalFloorsCount =
											BUILDINGS_WITH_FLOORS[1].floors
												.length;
										(el as any).indeterminate =
											selectedFloorsCount > 0 &&
											selectedFloorsCount <
												totalFloorsCount;
									}
								}}
								onCheckedChange={(checked) =>
									handleBuildingChange(
										BUILDINGS_WITH_FLOORS[1].id,
										checked as boolean,
									)
								}
							/>
						</div>
						<div className="space-y-2">
							{BUILDINGS_WITH_FLOORS[1].floors.map((floorId) => {
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
											checked={isFloorSelected}
											onCheckedChange={(checked) =>
												handleFloorChange(
													floorId,
													checked as boolean,
													BUILDINGS_WITH_FLOORS[1].id,
												)
											}
										/>
									</div>
								);
							})}
						</div>
					</div>
				</div>

				{/* Meter Data Statistics Section */}
				<h5 className="font-semibold text-slate-800 mb-4 mt-4 flex items-center">
					<Play className="h-5 w-5 mr-2 text-blue-600" />
					Meter Data Statistics
				</h5>

				<div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
					{/* Button Section - Left Side */}
					<div className="lg:col-span-1">
						<div className="bg-white p-4 rounded-lg border border-slate-200 h-full flex flex-col justify-center">
							<Button
								onClick={handleCountMeterData}
								disabled={isCountingMeterData}
								size="lg"
								variant="outline"
								className="w-full text-blue-700 border-blue-300 hover:bg-blue-50 hover:border-blue-400 disabled:opacity-50"
							>
								{isCountingMeterData ? (
									<>
										<Loader2 className="h-5 w-5 mr-2 animate-spin" />
										Querying...
									</>
								) : (
									<>
										<Play className="h-5 w-5 mr-2" />
										Calculate Data Count
									</>
								)}
							</Button>

							{!meterDataCount && !isCountingMeterData && (
								<p className="text-sm text-slate-500 text-center mt-3">
									Click to view meter data statistics for the
									selected time range and filters
								</p>
							)}
						</div>
					</div>

					{/* Results Section - Right Side */}
					<div className="lg:col-span-4">
						{meterDataCount ? (
							<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
								{/* 多一欄選哪些樓層的 */}
								<div className="bg-white p-4 rounded-lg border border-slate-200">
									<div className="flex items-center mb-2">
										<Building2 className="h-4 w-4 mr-2 text-emerald-600" />
										<div className="font-medium text-slate-800">
											Selected Floors
										</div>
									</div>
									<div className="text-sm text-slate-600 space-y-1">
										{meterDataCount?.filter_info
											?.selected_floors_by_building &&
										Object.keys(
											meterDataCount.filter_info
												.selected_floors_by_building,
										).length > 0 ? (
											<div className="space-y-1">
												{Object.entries(
													meterDataCount.filter_info
														.selected_floors_by_building,
												)
													.filter(
														([, floors]) =>
															floors.length > 0,
													)
													.map(
														([
															buildingId,
															floors,
														]) => {
															const building =
																BUILDINGS_WITH_FLOORS.find(
																	(b) =>
																		b.id ===
																		buildingId,
																);
															const floorNames =
																floors
																	.map(
																		(
																			floorId,
																		) =>
																			ALL_FLOORS.find(
																				(
																					f,
																				) =>
																					f.id ===
																					floorId,
																			)
																				?.name ||
																			floorId,
																	)
																	.join(", ");
															return (
																<div
																	key={
																		buildingId
																	}
																	className="text-blue-700"
																>
																	<span className="font-medium">
																		{building?.name ||
																			buildingId}
																		:
																	</span>{" "}
																	{floorNames}
																</div>
															);
														},
													)}
											</div>
										) : (
											<div className="text-slate-400">
												No floors selected
											</div>
										)}
									</div>
								</div>

								<div className="bg-white p-4 rounded-lg border border-slate-200">
									<div className="flex items-center mb-2">
										<Calendar className="h-4 w-4 mr-2 text-blue-600" />
										<div className="font-medium text-slate-800">
											Time Range
										</div>
									</div>
									<div className="text-sm text-slate-600 space-y-1">
										<div>
											<span className="font-medium">
												Start:
											</span>{" "}
											{new Date(
												meterDataCount.time_range
													?.start,
											).toLocaleString("zh-TW")}
										</div>
										<div>
											<span className="font-medium">
												End:
											</span>{" "}
											{new Date(
												meterDataCount.time_range?.end,
											).toLocaleString("zh-TW")}
										</div>
									</div>
								</div>

								<div className="bg-white p-4 rounded-lg border border-slate-200">
									<div className="flex items-center mb-2">
										<Building2 className="h-4 w-4 mr-2 text-emerald-600" />
										<div className="font-medium text-slate-800">
											Data Overview
										</div>
									</div>
									<div className="text-sm text-slate-600 space-y-1">
										<div>
											<span className="font-medium">
												Records:
											</span>{" "}
											<span className="font-semibold text-blue-700">
												{meterDataCount.total_records?.toLocaleString()}
											</span>
										</div>
										<div>
											<span className="font-medium">
												Devices:
											</span>{" "}
											<span className="font-semibold text-emerald-700">
												{meterDataCount.unique_devices}
											</span>
										</div>
										<div>
											<span className="font-medium">
												Days:
											</span>{" "}
											<span className="font-semibold text-orange-700">
												{
													meterDataCount.time_range
														?.span_days
												}
											</span>
										</div>
									</div>
								</div>

								<div className="bg-white p-4 rounded-lg border border-slate-200">
									<div className="flex items-center mb-2">
										<Loader2 className="h-4 w-4 mr-2 text-purple-600" />
										<div className="font-medium text-slate-800">
											Averages
										</div>
									</div>
									<div className="text-sm text-slate-600 space-y-1">
										<div>
											<span className="font-medium">
												Per Device:
											</span>{" "}
											<span className="font-semibold text-purple-700">
												{
													meterDataCount.avg_records_per_device
												}
											</span>
										</div>
										<div>
											<span className="font-medium">
												Per Day:
											</span>{" "}
											<span className="font-semibold text-indigo-700">
												{meterDataCount.records_per_day}
											</span>
										</div>
										<div>
											<span className="font-medium">
												Per Hour:
											</span>{" "}
											<span className="font-semibold text-pink-700">
												{Math.round(
													meterDataCount.records_per_day /
														24,
												)}
											</span>
										</div>
									</div>
								</div>
							</div>
						) : (
							<div className="bg-white p-8 rounded-lg border border-slate-200 border-dashed">
								<div className="text-center text-slate-400">
									<Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
									<p className="text-lg font-medium">
										No Data Available
									</p>
									<p className="text-sm">
										Click "Calculate Data Count" to view
										statistics
									</p>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
