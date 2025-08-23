"use client";
import type { MeterData } from "@/hooks/use-testbed-data";
import {
	fetchMeterDataWithTime,
	getUnitOptionsForBuilding,
} from "@/hooks/use-testbed-data";
import { parseAsString, useQueryState } from "nuqs";
import { useMemo, useState } from "react";
import { DataStatistics } from "./data-statistics";
import { ExplorerControls } from "./explorer-controls";
import { SimpleTimeChart } from "./simple-time-chart";

// 擴展 MeterData 以支持整層數據
type FloorMeterData = MeterData & {
	isFloorData?: boolean;
	roomData?: Array<{
		roomNumber: string;
		hasAppliance: boolean;
		data: MeterData;
	}>;
};

export function ExplorerTab() {
	// Default time range (past 7 days), calculated in Taipei time
	const defaultEndDate = useMemo(() => {
		return new Date();
	}, []);
	const defaultStartDate = useMemo(() => {
		const date = new Date();
		date.setDate(date.getDate() - 7);
		return date;
	}, []);
	const defaultTime = "00:00";

	// States synchronized with URL (nuqs)
	const [selectedBuilding, setSelectedBuilding] = useQueryState(
		"building",
		parseAsString.withDefault("a").withOptions({ shallow: false }),
	);
	const [selectedUnit, setSelectedUnit] = useQueryState(
		"unit",
		parseAsString.withDefault("").withOptions({ shallow: false }),
	);
	const [selectedMeter, setSelectedMeter] = useQueryState(
		"meter",
		parseAsString.withDefault("main").withOptions({ shallow: false }),
	);
	const [displayMode, setDisplayMode] = useQueryState(
		"mode",
		parseAsString.withDefault("single").withOptions({ shallow: false }),
	);
	const [selectedFloor, setSelectedFloor] = useQueryState(
		"floor",
		parseAsString.withDefault("").withOptions({ shallow: false }),
	);

	// Date and time states (not synced to URL for simplicity)
	const [startDate, setStartDate] = useState<Date>(defaultStartDate);
	const [endDate, setEndDate] = useState<Date>(defaultEndDate);
	const [startTime, setStartTime] = useState<string>(defaultTime);
	const [endTime, setEndTime] = useState<string>("23:59");

	// Range mode state
	const [rangeParam, setRangeParam] = useQueryState(
		"range",
		parseAsString.withOptions({ shallow: false }),
	);
	type RangeMode = "6h" | "12h" | "1d" | "3d" | "1w" | "custom";
	const rangeMode: RangeMode = (rangeParam as RangeMode) || "custom";
	const setRangeMode = (mode: RangeMode) =>
		setRangeParam(mode === "custom" ? null : mode);

	const [meterData, setMeterData] = useState<FloorMeterData | null>(null);
	const [chartLoading, setChartLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// 無需額外 useEffect，預設值由 nuqs defaultValue 提供

	// Load meter data
	const loadMeterData = async (
		building: string,
		unit: string,
		meter: string,
		startDate: Date,
		endDate: Date,
		startTime: string,
		endTime: string,
		mode: "single" | "floor",
		floor?: string,
	) => {
		if (mode === "single" && !unit) {
			return;
		}
		if (mode === "floor" && !floor) {
			return;
		}

		setChartLoading(true);
		setError(null);

		try {
			if (mode === "single") {
				// Single unit mode - load single room data
				const start = startDate.toISOString().split("T")[0];
				const end = endDate.toISOString().split("T")[0];

				if (meter === "both") {
					// For "both" mode, fetch main and appliance data separately
					const mainData = await fetchMeterDataWithTime(
						unit,
						"main",
						start,
						end,
						startTime,
						endTime,
					);
					let applianceData = null;
					try {
						applianceData = await fetchMeterDataWithTime(
							unit,
							"appliance",
							start,
							end,
							startTime,
							endTime,
						);
					} catch {
						// Some rooms don't have appliance meters
						applianceData = null;
					}

					// Create combined data with separate chart data
					const combinedData: FloorMeterData = {
						...mainData,
						isFloorData: false,
						roomData: [
							{
								roomNumber: unit,
								hasAppliance: false,
								data: mainData,
							},
							...(applianceData
								? [
										{
											roomNumber: `${unit}a`,
											hasAppliance: true,
											data: applianceData,
										},
									]
								: []),
						],
					};
					setMeterData(combinedData);
				} else {
					// Single meter type
					const data = await fetchMeterDataWithTime(
						unit,
						meter,
						start,
						end,
						startTime,
						endTime,
					);
					setMeterData(data);
				}
			} else {
				// Floor mode - load all room data for the floor
				const start = startDate.toISOString().split("T")[0];
				const end = endDate.toISOString().split("T")[0];

				// Get all units for this floor
				const floorUnits = getUnitOptionsForBuilding(building, floor);

				// Load data for each room
				const roomDataPromises = floorUnits.map(async (roomUnit) => {
					try {
						if (meter === "both") {
							// For "both" mode, fetch main and appliance data separately
							const mainData = await fetchMeterDataWithTime(
								roomUnit.value,
								"main",
								start,
								end,
								startTime,
								endTime,
							);

							const results = [
								{
									roomNumber: roomUnit.value,
									hasAppliance: false,
									data: mainData,
								},
							];

							// Try to fetch appliance data
							try {
								const applianceData =
									await fetchMeterDataWithTime(
										roomUnit.value,
										"appliance",
										start,
										end,
										startTime,
										endTime,
									);
								results.push({
									roomNumber: `${roomUnit.value}a`,
									hasAppliance: true,
									data: applianceData,
								});
							} catch {
								// Some rooms don't have appliance meters, ignore
							}

							return results;
						}

						// Single meter type
						const roomData = await fetchMeterDataWithTime(
							roomUnit.value,
							meter,
							start,
							end,
							startTime,
							endTime,
						);
						return [
							{
								roomNumber:
									roomUnit.value +
									(meter === "appliance" ? "a" : ""),
								hasAppliance: meter === "appliance",
								data: roomData,
							},
						];
					} catch (error) {
						console.error(
							`Failed to load data for room ${roomUnit.value}:`,
							error,
						);
						return [];
					}
				});

				const results = await Promise.all(roomDataPromises);
				const successfulRoomData = results
					.flat()
					.filter((result) => result !== null);

				// Create combined floor data
				const floorData: FloorMeterData = {
					timeSeries: [], // Empty for floor mode
					statistics: {
						totalDataPoints: 0,
						averagePower: 0,
						maxPower: 0,
						minPower: 0,
						powerFactor: 0,
					},
					events: { anomalies: [], highUsagePeriods: [] },
					isFloorData: true,
					roomData: successfulRoomData,
				};

				setMeterData(floorData);
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unknown error");
		} finally {
			setChartLoading(false);
		}
	};

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
				{/* Control Panel */}
				<div className="lg:col-span-1">
					<ExplorerControls
						selectedBuilding={selectedBuilding || "a"}
						setSelectedBuilding={(v) => setSelectedBuilding(v)}
						selectedUnit={selectedUnit || ""}
						setSelectedUnit={(v) => setSelectedUnit(v)}
						selectedMeter={selectedMeter || "main"}
						setSelectedMeter={(v) => setSelectedMeter(v)}
						displayMode={
							(displayMode as "single" | "floor") || "single"
						}
						setDisplayMode={(mode) => setDisplayMode(mode)}
						selectedFloor={selectedFloor || ""}
						setSelectedFloor={(floor) => setSelectedFloor(floor)}
						startDate={startDate}
						setStartDate={setStartDate}
						endDate={endDate}
						setEndDate={setEndDate}
						startTime={startTime}
						setStartTime={setStartTime}
						endTime={endTime}
						setEndTime={setEndTime}
						rangeMode={rangeMode}
						setRangeMode={setRangeMode}
						onLoadData={loadMeterData}
					/>
				</div>

				{/* Chart Area */}
				<div className="lg:col-span-3">
					{(displayMode as "single" | "floor") === "floor" &&
					meterData?.roomData ? (
						/* Floor mode: Display separate charts for each room */
						<div className="space-y-6">
							<div className="mb-4">
								<h3 className="text-lg font-semibold text-slate-800">
									Floor {selectedFloor} Meter Data
								</h3>
								<p className="text-sm text-slate-600">
									Total {meterData.roomData.length} rooms
								</p>
							</div>
							{meterData.roomData.map((room) => (
								<div
									key={room.roomNumber}
									className="border rounded-lg p-4 bg-white shadow-sm"
								>
									<div className="mb-3">
										<h4 className="text-md font-medium text-slate-700">
											Room {room.roomNumber}
											{room.roomNumber.endsWith("a")
												? " (Appliance Meter)"
												: " (Main Meter)"}
										</h4>
									</div>
									<SimpleTimeChart
										chartLoading={chartLoading}
										error={error}
										meterData={room.data}
										selectedMeter={
											room.roomNumber.endsWith("a")
												? "appliance"
												: "main"
										}
									/>
									{/* Statistics for each room */}
									<DataStatistics meterData={room.data} />
								</div>
							))}
						</div>
					) : meterData?.roomData ? (
						/* Single unit mode - Both mode: Display separate charts */
						<div className="space-y-6">
							<div className="mb-4">
								<h3 className="text-lg font-semibold text-slate-800">
									Room {selectedUnit} Meter Data
								</h3>
								<p className="text-sm text-slate-600">
									Shows main meter and appliance meter
								</p>
							</div>
							{meterData.roomData.map((room) => (
								<div
									key={room.roomNumber}
									className="border rounded-lg p-4 bg-white shadow-sm"
								>
									<div className="mb-3">
										<h4 className="text-md font-medium text-slate-700">
											{room.roomNumber.endsWith("a")
												? `Room ${room.roomNumber.slice(0, -1)} (Appliance Meter)`
												: `Room ${room.roomNumber} (Main Meter)`}
										</h4>
									</div>
									<SimpleTimeChart
										chartLoading={chartLoading}
										error={error}
										meterData={room.data}
										selectedMeter={
											room.roomNumber.endsWith("a")
												? "appliance"
												: "main"
										}
									/>
									{/* Statistics */}
									<DataStatistics meterData={room.data} />
								</div>
							))}
						</div>
					) : (
						/* Single unit mode: Display single chart */
						<>
							<SimpleTimeChart
								chartLoading={chartLoading}
								error={error}
								meterData={meterData}
								selectedMeter={selectedMeter}
							/>

							{/* Statistics */}
							{meterData && (
								<DataStatistics meterData={meterData} />
							)}
						</>
					)}

					<div className="mt-6 text-sm text-slate-600 space-y-2">
						<div className="grid grid-cols-2 gap-4">
							<div>
								<p className="font-medium mb-2">
									📊 Chart Features:
								</p>
								<ul className="space-y-1 text-xs">
									<li>• Interactive D3.js visualization</li>
									<li>• Hover for detailed information</li>
									<li>• Automatic time format adjustment</li>
								</ul>
							</div>
							<div>
								<p className="font-medium mb-2">
									⚠️ Data Indicators:
								</p>
								<ul className="space-y-1 text-xs">
									<li>
										• Red diamonds = potential anomalies
									</li>
									<li>• Line breaks = gaps &gt; 5 minutes</li>
									<li>• All times in Taiwan Time (UTC+8)</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
