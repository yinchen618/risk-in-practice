"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
	ArrowRight,
	Building,
	Database,
	Filter,
	Loader2,
	MapPin,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useCallback, useEffect, useMemo } from "react";
import { D3ParameterChart } from "../../case-study/components/D3ParameterChart";

interface AnalysisDataset {
	id: string;
	name: string;
	description?: string;
	building: string;
	floor: string;
	room: string;
	startDate: string;
	endDate: string;
	occupantType: string;
	totalRecords: number;
	positiveLabels: number;
}

interface FilterParams {
	// Dataset selection - Support multiple dataset selection
	selectedDatasetIds: string[];

	// Multi-dimensional filtering criteria
	buildings: string[];
	floors: string[];
	rooms: string[];
	occupantTypes: string[];

	// Value-based anomaly rules
	zScoreThreshold: number;
	spikeThreshold: number;

	// Time-based anomaly rules
	minEventDuration: number;
	weekendPatternEnabled: boolean;
	holidayPatternEnabled: boolean;

	// Data integrity rules
	maxTimeGap: number;

	// Peer comparison rules
	aggregationWindow: number;
	peerExceedThreshold: number;

	// Time range
	startDate: string;
	startTime: string;
	endDate: string;
	endTime: string;

	// Building selection
	buildingA: Record<string, boolean>;
	buildingB: Record<string, boolean>;
}

interface ExperimentRun {
	id: string;
	timestamp: string;
	status: "completed" | "running" | "failed";
	candidate_count: number;
	parameters: FilterParams;
}

export function Stage1CandidateGeneration() {
	const router = useRouter();

	const [filterParams, setFilterParams] = useState<FilterParams>({
		// Dataset selection - Support multiple dataset selection
		selectedDatasetIds: [],

		// Multi-dimensional filtering criteria
		buildings: [],
		floors: [],
		rooms: [],
		occupantTypes: [],

		// Value-based anomaly rules
		zScoreThreshold: 2.8,
		spikeThreshold: 250,

		// Time-based anomaly rules
		minEventDuration: 45,
		weekendPatternEnabled: true,
		holidayPatternEnabled: true,

		// Data integrity rules
		maxTimeGap: 120,

		// Peer comparison rules
		aggregationWindow: 60,
		peerExceedThreshold: 150,

		// Time range (default to last week)
		startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
			.toISOString()
			.split("T")[0],
		startTime: "00:00",
		endDate: new Date().toISOString().split("T")[0],
		endTime: "23:59",

		// Building selection
		buildingA: {
			"1F": true,
			"2F": true,
			"3F": true,
			"5F": true,
		},
		buildingB: {
			"1F": true,
			"2F": true,
			"3F": true,
			"5F": true,
			"6F": true,
		},
	});

	const [isGenerating, setIsGenerating] = useState(false);
	const [candidateCount, setCandidateCount] = useState(0);
	const [experimentRun, setExperimentRun] = useState<ExperimentRun | null>(
		null,
	);
	const [availableDatasets, setAvailableDatasets] = useState<
		AnalysisDataset[]
	>([]);
	const [isLoadingDatasets, setIsLoadingDatasets] = useState(false);
	const [isContinuingLabeling, setIsContinuingLabeling] = useState(false);
	const [labelingReady, setLabelingReady] = useState(false);
	const [labelingInfo, setLabelingInfo] = useState<{
		anomaly_events_created: number;
		experiment_run_id: string;
		status: string;
	} | null>(null);

	// Automatically update selected datasets based on filter criteria
	useEffect(() => {
		const filteredDatasets = availableDatasets.filter((dataset) => {
			const buildingMatch =
				filterParams.buildings.length === 0 ||
				filterParams.buildings.includes(dataset.building);
			const floorMatch =
				filterParams.floors.length === 0 ||
				filterParams.floors.includes(dataset.floor);
			const roomMatch =
				filterParams.rooms.length === 0 ||
				filterParams.rooms.includes(dataset.room);
			const typeMatch =
				filterParams.occupantTypes.length === 0 ||
				filterParams.occupantTypes.includes(dataset.occupantType);

			return buildingMatch && floorMatch && roomMatch && typeMatch;
		});

		const filteredIds = filteredDatasets.map((d) => d.id);
		if (
			JSON.stringify(filteredIds.sort()) !==
			JSON.stringify(filterParams.selectedDatasetIds.sort())
		) {
			setFilterParams((prev) => ({
				...prev,
				selectedDatasetIds: filteredIds,
			}));
		}
	}, [
		filterParams.buildings,
		filterParams.floors,
		filterParams.rooms,
		filterParams.occupantTypes,
		availableDatasets,
	]);

	// Fetch available datasets on component mount
	useEffect(() => {
		fetchAvailableDatasets();
	}, []);

	const fetchAvailableDatasets = async () => {
		setIsLoadingDatasets(true);
		try {
			const response = await fetch(
				"http://localhost:8000/api/v2/analysis-datasets",
			);
			if (response.ok) {
				const datasets = await response.json();
				setAvailableDatasets(datasets);

				// Auto-select first dataset if available and no filtering criteria set
				if (
					datasets.length > 0 &&
					filterParams.selectedDatasetIds.length === 0 &&
					filterParams.buildings.length === 0 &&
					filterParams.floors.length === 0 &&
					filterParams.rooms.length === 0 &&
					filterParams.occupantTypes.length === 0
				) {
					const firstDataset = datasets[0];
					setFilterParams((prev) => ({
						...prev,
						selectedDatasetIds: [firstDataset.id],
						buildings: [firstDataset.building],
						floors: [firstDataset.floor],
						rooms: [firstDataset.room],
						occupantTypes: [firstDataset.occupantType],
					}));
				}
			}
		} catch (error) {
			console.error("Error fetching datasets:", error);
		} finally {
			setIsLoadingDatasets(false);
		}
	};

	const onFilterParamChange = useCallback(
		(key: keyof FilterParams, value: any) => {
			setFilterParams((prev) => ({
				...prev,
				[key]: value,
			}));
		},
		[],
	);

	const handleGenerateCandidates = async () => {
		setIsGenerating(true);

		try {
			const response = await fetch(
				"http://localhost:8000/api/v2/generate-candidates",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						filter_params: filterParams,
					}),
				},
			);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			setCandidateCount(data.candidate_count || 0);

			// Create experiment run record
			const newExperimentRun: ExperimentRun = {
				id: `exp_${Date.now()}`,
				timestamp: new Date().toISOString(),
				status: "completed",
				candidate_count: data.candidate_count || 0,
				parameters: { ...filterParams },
			};

			setExperimentRun(newExperimentRun);
		} catch (error) {
			console.error("Error generating candidates:", error);
			setExperimentRun({
				id: `exp_${Date.now()}`,
				timestamp: new Date().toISOString(),
				status: "failed",
				candidate_count: 0,
				parameters: { ...filterParams },
			});
		} finally {
			setIsGenerating(false);
		}
	};

	const handleContinueLabeling = async () => {
		if (!experimentRun) {
			console.error("No experiment run available");
			return;
		}

		setIsContinuingLabeling(true);

		try {
			// 使用修改後的 generate-candidates API，並設置 save_labels: true
			const response = await fetch(
				"http://localhost:8000/api/v2/generate-candidates",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						filter_params: filterParams,
						save_labels: true, // 新增參數：直接保存為標籤
					}),
				},
			);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			console.log("Continue labeling response:", data);

			// Update experiment run with new labeling experiment
			const newExperimentRun: ExperimentRun = {
				id: data.experiment_run_id,
				timestamp: new Date().toISOString(),
				status: "completed" as const, // Update to completed for labeling ready
				candidate_count: data.candidate_count,
				parameters: { ...filterParams },
			};

			setExperimentRun(newExperimentRun);

			// Update candidate count with the returned data
			setCandidateCount(data.candidate_count);

			// Set labeling ready state
			setLabelingReady(true);
			setLabelingInfo({
				anomaly_events_created: data.anomaly_events_created,
				experiment_run_id: data.experiment_run_id,
				status: data.status,
			});

			// Show success message with detailed information
			const eventsCreated =
				data.anomaly_events_created || data.candidate_count;
			alert(
				`✅ Successfully created ${eventsCreated} anomaly event labels!\n\n📊 Total candidates: ${data.candidate_count}\n🆔 Experiment ID: ${data.experiment_run_id}\n📍 Datasets processed: ${data.filtered_datasets_count}\n\n🎯 Status: ${data.status} - Ready for labeling phase (Stage 2)`,
			);
		} catch (error) {
			console.error("Error continuing to labeling:", error);
			alert(
				"Error occurred while creating labeling stage. Please retry.",
			);
		} finally {
			setIsContinuingLabeling(false);
		}
	};

	// Calculate selected datasets
	const selectedDatasets = availableDatasets.filter((d) =>
		filterParams.selectedDatasetIds.includes(d.id),
	);

	// Get available filter options - show ALL available options from all datasets
	const filterOptions = useMemo(() => {
		// Show all possible options from all available datasets, not just selected ones
		const buildings = [
			...new Set(availableDatasets.map((d) => d.building)),
		].sort();
		const floors = [
			...new Set(availableDatasets.map((d) => d.floor)),
		].sort();
		const rooms = [...new Set(availableDatasets.map((d) => d.room))].sort();
		const occupantTypes = [
			...new Set(availableDatasets.map((d) => d.occupantType)),
		].sort();

		return { buildings, floors, rooms, occupantTypes };
	}, [availableDatasets]); // Only depend on availableDatasets, not selected ones

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<Card>
				<CardHeader>
					<CardTitle>
						Stage 1: Anomaly Candidate Generation Framework
					</CardTitle>
					<p className="text-sm text-muted-foreground">
						Multi-dimensional filtering methodology for systematic
						anomaly detection in occupancy sensing data
					</p>
				</CardHeader>
			</Card>

			{/* Multi-Dimensional Dataset Selection */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Filter className="h-5 w-5" />
						Dataset Selection & Filtering Configuration
					</CardTitle>
					<p className="text-sm text-muted-foreground">
						Configure spatial and temporal filtering parameters for
						multi-dimensional anomaly detection
					</p>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Filter Criteria */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						{/* Building Filter */}
						<div className="space-y-2">
							<Label className="text-sm font-medium flex items-center gap-2">
								<Building className="h-4 w-4" />
								Building
							</Label>
							<div className="space-y-2 max-h-32 overflow-y-auto">
								{filterOptions.buildings.map((building) => (
									<div
										key={building}
										className="flex items-center space-x-2"
									>
										<Checkbox
											id={`building-${building}`}
											checked={filterParams.buildings.includes(
												building,
											)}
											onCheckedChange={(checked) => {
												const newBuildings = checked
													? [
															...filterParams.buildings,
															building,
														]
													: filterParams.buildings.filter(
															(b) =>
																b !== building,
														);
												onFilterParamChange(
													"buildings",
													newBuildings,
												);
											}}
										/>
										<Label
											htmlFor={`building-${building}`}
											className="text-sm cursor-pointer"
										>
											{building}
										</Label>
									</div>
								))}
							</div>
						</div>

						{/* Floor Filter */}
						<div className="space-y-2">
							<Label className="text-sm font-medium flex items-center gap-2">
								<MapPin className="h-4 w-4" />
								Floor
							</Label>
							<div className="space-y-2 max-h-32 overflow-y-auto">
								{filterOptions.floors.map((floor) => (
									<div
										key={floor}
										className="flex items-center space-x-2"
									>
										<Checkbox
											id={`floor-${floor}`}
											checked={filterParams.floors.includes(
												floor,
											)}
											onCheckedChange={(checked) => {
												const newFloors = checked
													? [
															...filterParams.floors,
															floor,
														]
													: filterParams.floors.filter(
															(f) => f !== floor,
														);
												onFilterParamChange(
													"floors",
													newFloors,
												);
											}}
										/>
										<Label
											htmlFor={`floor-${floor}`}
											className="text-sm cursor-pointer"
										>
											{floor}
										</Label>
									</div>
								))}
							</div>
						</div>

						{/* Room Filter */}
						<div className="space-y-2">
							<Label className="text-sm font-medium">Room</Label>
							<div className="space-y-2 max-h-32 overflow-y-auto">
								{filterOptions.rooms.map((room) => (
									<div
										key={room}
										className="flex items-center space-x-2"
									>
										<Checkbox
											id={`room-${room}`}
											checked={filterParams.rooms.includes(
												room,
											)}
											onCheckedChange={(checked) => {
												const newRooms = checked
													? [
															...filterParams.rooms,
															room,
														]
													: filterParams.rooms.filter(
															(r) => r !== room,
														);
												onFilterParamChange(
													"rooms",
													newRooms,
												);
											}}
										/>
										<Label
											htmlFor={`room-${room}`}
											className="text-sm cursor-pointer"
										>
											{room}
										</Label>
									</div>
								))}
							</div>
						</div>

						{/* Occupant Type Filter */}
						<div className="space-y-2">
							<Label className="text-sm font-medium">
								Occupant Type
							</Label>
							<div className="space-y-2 max-h-32 overflow-y-auto">
								{filterOptions.occupantTypes.map((type) => (
									<div
										key={type}
										className="flex items-center space-x-2"
									>
										<Checkbox
											id={`type-${type}`}
											checked={filterParams.occupantTypes.includes(
												type,
											)}
											onCheckedChange={(checked) => {
												const newTypes = checked
													? [
															...filterParams.occupantTypes,
															type,
														]
													: filterParams.occupantTypes.filter(
															(t) => t !== type,
														);
												onFilterParamChange(
													"occupantTypes",
													newTypes,
												);
											}}
										/>
										<Label
											htmlFor={`type-${type}`}
											className="text-sm cursor-pointer"
										>
											{type}
										</Label>
									</div>
								))}
							</div>
						</div>
					</div>

					<Separator />

					{/* Filter Results Preview */}
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<div>
								<h4 className="text-sm font-medium">
									Dataset Selection Results
								</h4>
								<p className="text-xs text-muted-foreground mt-1">
									{selectedDatasets.length > 0 ? (
										<>
											Selected{" "}
											{selectedDatasets
												.reduce(
													(sum, dataset) =>
														sum +
														dataset.totalRecords,
													0,
												)
												.toLocaleString()}{" "}
											records from{" "}
											{selectedDatasets.length} of{" "}
											{availableDatasets.length} available
											datasets
										</>
									) : (
										<>
											{availableDatasets.length} datasets
											available. Please configure
											filtering criteria above.
										</>
									)}
								</p>
							</div>
							<div className="flex items-center gap-2">
								<Badge variant="outline">
									{selectedDatasets.length} /{" "}
									{availableDatasets.length} datasets
								</Badge>
								{selectedDatasets.length > 0 && (
									<Badge variant="secondary">
										{selectedDatasets
											.reduce(
												(sum, d) =>
													sum + d.totalRecords,
												0,
											)
											.toLocaleString()}{" "}
										records
									</Badge>
								)}
							</div>
						</div>

						{selectedDatasets.length > 0 ? (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-64 overflow-y-auto">
								{selectedDatasets.map((dataset) => (
									<Card
										key={dataset.id}
										className="border border-blue-200 bg-blue-50"
									>
										<CardContent className="p-4">
											<div className="space-y-2">
												<div className="text-sm font-medium">
													{dataset.name}
												</div>
												<div className="text-xs text-gray-600 space-y-1">
													<div>
														📍 Location:{" "}
														{dataset.building} -{" "}
														{dataset.floor} -{" "}
														{dataset.room}
													</div>
													<div>
														👥 Occupant Type:{" "}
														{dataset.occupantType}
													</div>
													<div>
														📊 Total Records:{" "}
														{dataset.totalRecords.toLocaleString()}
													</div>
													<div>
														⚠️ Known Anomalies:{" "}
														{dataset.positiveLabels}
													</div>
												</div>
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						) : (
							<div className="text-center py-8 text-gray-500">
								<Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
								<div className="space-y-2">
									<p className="font-medium">
										No Filtering Criteria Configured
									</p>
									<p className="text-sm">
										Configure spatial and temporal filters
										above to select datasets for analysis
									</p>
									<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-xs">
										<div className="bg-gray-50 p-2 rounded">
											<div className="font-medium">
												Buildings
											</div>
											<div>
												{filterOptions.buildings.length}{" "}
												available
											</div>
										</div>
										<div className="bg-gray-50 p-2 rounded">
											<div className="font-medium">
												Floors
											</div>
											<div>
												{filterOptions.floors.length}{" "}
												available
											</div>
										</div>
										<div className="bg-gray-50 p-2 rounded">
											<div className="font-medium">
												Rooms
											</div>
											<div>
												{filterOptions.rooms.length}{" "}
												available
											</div>
										</div>
										<div className="bg-gray-50 p-2 rounded">
											<div className="font-medium">
												Occupant Types
											</div>
											<div>
												{
													filterOptions.occupantTypes
														.length
												}{" "}
												available
											</div>
										</div>
									</div>
								</div>
							</div>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Statistical Anomaly Detection Configuration */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<ArrowRight className="h-5 w-5" />
						Statistical Anomaly Detection Parameters
					</CardTitle>
					<p className="text-sm text-muted-foreground">
						Configure statistical thresholds and temporal
						constraints for anomaly identification
					</p>

					{/* Filtering Logic Explanation */}
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
						<h6 className="font-medium text-blue-800 mb-2">
							Anomaly Detection Methodology
						</h6>
						<div className="text-sm text-blue-700 space-y-1">
							<p>
								• <strong>Z-Score Threshold:</strong>{" "}
								Statistical outlier detection for data points
								deviating from mean (σ {">"}&#8194;
								{filterParams.zScoreThreshold})
							</p>
							<p>
								• <strong>Power Spike Detection:</strong>{" "}
								Identifies consumption patterns exceeding{" "}
								{filterParams.spikeThreshold}% above baseline
								average
							</p>
							<p>
								• <strong>Temporal Duration Filter:</strong>{" "}
								Excludes transient events lasting less than{" "}
								{filterParams.minEventDuration} minutes
							</p>
							<p>
								• <strong>Power Jump Analysis:</strong> Detects
								rapid consumption changes exceeding 50% between
								adjacent time points
							</p>
						</div>

						{/* Intelligent Parameter Recommendation */}
						<div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded">
							<div className="text-xs text-amber-800">
								<strong>
									💡 Adaptive Parameter Recommendations:
								</strong>
								{selectedDatasets.length === 0 &&
									" Please select spatial domains for analysis"}
								{selectedDatasets.length === 1 &&
									" Single-room analysis: Recommend 'Balanced Detection' mode (Expected: 50-100 candidates)"}
								{selectedDatasets.length >= 2 &&
									selectedDatasets.length <= 5 &&
									" Multi-room analysis: Recommend 'Balanced' or 'Conservative Detection' modes"}
								{selectedDatasets.length > 5 &&
									" Large-scale analysis: Strongly recommend 'Conservative Detection' to manage candidate volume"}
								{selectedDatasets.length > 10 &&
									" ⚠️ Extensive dataset scope: Consider batch processing or most restrictive parameters"}
							</div>
							{selectedDatasets.length > 0 && (
								<div className="text-xs text-amber-700 mt-1">
									Expected candidate range:{" "}
									{selectedDatasets.length * 30} -{" "}
									{selectedDatasets.length * 150} candidates
								</div>
							)}
						</div>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* Parameter Preset Configuration */}
					<div className="space-y-3">
						{/* Auto-optimization button */}
						{selectedDatasets.length > 0 && (
							<div className="mb-3">
								<Button
									variant="outline"
									className="w-full bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
									onClick={() => {
										let recommendedParams: {
											zScoreThreshold: number;
											spikeThreshold: number;
											minEventDuration: number;
										};
										if (selectedDatasets.length === 1) {
											// Single room - balanced
											recommendedParams = {
												zScoreThreshold: 2.8,
												spikeThreshold: 250,
												minEventDuration: 45,
											};
										} else if (
											selectedDatasets.length <= 5
										) {
											// Multiple rooms - more strict
											recommendedParams = {
												zScoreThreshold: 3.2,
												spikeThreshold: 350,
												minEventDuration: 60,
											};
										} else {
											// Many rooms - very strict
											recommendedParams = {
												zScoreThreshold: 3.8,
												spikeThreshold: 450,
												minEventDuration: 90,
											};
										}
										setFilterParams((prev) => ({
											...prev,
											...recommendedParams,
										}));
									}}
								>
									🎯 Apply Adaptive Parameter Optimization (
									{selectedDatasets.length} spatial domains)
								</Button>
							</div>
						)}

						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<Button
								variant="outline"
								onClick={() =>
									setFilterParams((prev) => ({
										...prev,
										zScoreThreshold: 2.0,
										spikeThreshold: 150,
										minEventDuration: 20,
									}))
								}
							>
								Sensitive Detection (High Recall)
							</Button>
							<Button
								variant="outline"
								onClick={() =>
									setFilterParams((prev) => ({
										...prev,
										zScoreThreshold: 2.8,
										spikeThreshold: 250,
										minEventDuration: 45,
									}))
								}
							>
								Balanced Detection (Recommended)
							</Button>
							<Button
								variant="outline"
								onClick={() =>
									setFilterParams((prev) => ({
										...prev,
										zScoreThreshold: 3.5,
										spikeThreshold: 400,
										minEventDuration: 90,
									}))
								}
							>
								Conservative Detection (High Precision)
							</Button>
						</div>
					</div>

					{/* Statistical Parameter Configuration and Visualization */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="space-y-4">
							<h5 className="font-medium text-slate-600">
								Active Detection Parameters
							</h5>
							<div className="grid grid-cols-2 gap-4">
								<div className="text-center p-3 bg-gray-50 rounded">
									<div className="text-sm font-medium">
										Z-Score Threshold
									</div>
									<div className="text-lg">
										{filterParams.zScoreThreshold}σ
									</div>
								</div>
								<div className="text-center p-3 bg-gray-50 rounded">
									<div className="text-sm font-medium">
										Spike Threshold
									</div>
									<div className="text-lg">
										{filterParams.spikeThreshold}%
									</div>
								</div>
								<div className="text-center p-3 bg-gray-50 rounded">
									<div className="text-sm font-medium">
										Min Duration
									</div>
									<div className="text-lg">
										{filterParams.minEventDuration}min
									</div>
								</div>
								<div className="text-center p-3 bg-gray-50 rounded">
									<div className="text-sm font-medium">
										Max Time Gap
									</div>
									<div className="text-lg">
										{filterParams.maxTimeGap}min
									</div>
								</div>
							</div>
						</div>

						<div className="space-y-4">
							<h5 className="font-medium text-slate-600">
								Parameter Visualization
							</h5>
							<div className="grid grid-cols-2 gap-4">
								{/* Z-Score Chart */}
								<div className="flex flex-col items-center p-3 bg-white border rounded">
									<div className="text-xs font-medium mb-2">
										Z-Score Threshold
									</div>
									<D3ParameterChart
										parameterType="zscore"
										threshold={filterParams.zScoreThreshold}
										width={120}
										height={60}
									/>
									<div className="text-xs text-gray-500 mt-1">
										{filterParams.zScoreThreshold}σ
									</div>
								</div>

								{/* Spike Chart */}
								<div className="flex flex-col items-center p-3 bg-white border rounded">
									<div className="text-xs font-medium mb-2">
										Power Spike Analysis
									</div>
									<D3ParameterChart
										parameterType="spike"
										threshold={filterParams.spikeThreshold}
										width={120}
										height={60}
									/>
									<div className="text-xs text-gray-500 mt-1">
										{filterParams.spikeThreshold}% above
										baseline
									</div>
								</div>

								{/* Duration Chart */}
								<div className="flex flex-col items-center p-3 bg-white border rounded">
									<div className="text-xs font-medium mb-2">
										Temporal Duration
									</div>
									<D3ParameterChart
										parameterType="duration"
										threshold={
											filterParams.minEventDuration
										}
										width={120}
										height={60}
									/>
									<div className="text-xs text-gray-500 mt-1">
										{filterParams.minEventDuration} minutes
										minimum
									</div>
								</div>

								{/* Time Gap Chart */}
								<div className="flex flex-col items-center p-3 bg-white border rounded">
									<div className="text-xs font-medium mb-2">
										Temporal Continuity
									</div>
									<D3ParameterChart
										parameterType="timegap"
										threshold={filterParams.maxTimeGap}
										width={120}
										height={60}
									/>
									<div className="text-xs text-gray-500 mt-1">
										{filterParams.maxTimeGap} minutes
										maximum gap
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Generate Button */}
					<div className="flex justify-end pt-4">
						<Button
							onClick={handleGenerateCandidates}
							size="lg"
							disabled={
								isGenerating || selectedDatasets.length === 0
							}
							className="min-w-[200px]"
						>
							{isGenerating ? (
								<>
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
									Generating Candidates...
								</>
							) : (
								"Execute Candidate Generation"
							)}
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Experimental Results Analysis */}
			{experimentRun && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<ArrowRight className="h-5 w-5" />
							Anomaly Detection Results
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{candidateCount === 0 ? (
								// No candidates detected - academic warning message
								<div className="text-center py-8">
									<div className="text-4xl font-bold text-orange-500 mb-2">
										∅
									</div>
									<div className="text-lg font-medium text-orange-700 mb-4">
										No Anomaly Candidates Detected
									</div>
									<div className="bg-orange-50 border border-orange-200 rounded-lg p-4 max-w-md mx-auto">
										<p className="text-sm text-orange-800 mb-3">
											Current statistical parameters
											yielded zero anomaly candidates.
											Parameter adjustment
											recommendations:
										</p>
										<ul className="text-sm text-orange-700 list-disc list-inside space-y-1 text-left">
											<li>
												Reduce Z-Score threshold
												(current: σ ≥{" "}
												{filterParams.zScoreThreshold})
											</li>
											<li>
												Lower power spike threshold
												(current: ≥{" "}
												{filterParams.spikeThreshold}%
												above baseline)
											</li>
											<li>
												Decrease minimum temporal
												duration (current: ≥{" "}
												{filterParams.minEventDuration}{" "}
												minutes)
											</li>
											<li>
												Expand temporal or spatial scope
												for analysis
											</li>
										</ul>
									</div>
									{experimentRun && (
										<div className="text-sm text-gray-600 mt-4">
											<span>Generated at:</span>
											<span className="ml-2">
												{new Date(
													experimentRun.timestamp,
												).toLocaleString()}
											</span>
										</div>
									)}
								</div>
							) : (
								// Normal results display when candidates > 0
								<>
									<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
										<div className="text-center">
											<div className="text-2xl font-bold text-blue-600">
												{candidateCount}
											</div>
											<div className="text-sm text-gray-600">
												Detected Candidates
											</div>
										</div>
										{experimentRun && (
											<div className="text-center">
												<Badge
													variant={
														labelingReady
															? "default"
															: experimentRun.status ===
																	"completed"
																? "default"
																: "destructive"
													}
													className={
														labelingReady
															? "bg-green-600"
															: ""
													}
												>
													{labelingReady
														? "ANNOTATION READY"
														: experimentRun.status}
												</Badge>
												<div className="text-sm text-gray-600 mt-1">
													Processing Status
												</div>
											</div>
										)}
										{selectedDatasets.length > 0 && (
											<div className="text-center">
												<div className="text-lg font-semibold text-green-600">
													{selectedDatasets.length ===
													1
														? selectedDatasets[0]
																.room
														: `${selectedDatasets.length} spatial domains`}
												</div>
												<div className="text-sm text-gray-600">
													Analysis Scope
												</div>
											</div>
										)}
										{selectedDatasets.length > 0 && (
											<div className="text-center">
												<div className="text-lg font-semibold text-purple-600">
													{selectedDatasets
														.reduce(
															(sum, d) =>
																sum +
																d.totalRecords,
															0,
														)
														.toLocaleString()}
												</div>
												<div className="text-sm text-gray-600">
													Sensor Records
												</div>
											</div>
										)}
									</div>

									{experimentRun && (
										<div className="text-sm text-gray-600">
											<span>Generated at:</span>
											<span className="ml-2">
												{new Date(
													experimentRun.timestamp,
												).toLocaleString()}
											</span>
										</div>
									)}

									{/* Labeling Ready Info */}
									{labelingReady && labelingInfo && (
										<div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
											<div className="flex items-center gap-2 mb-3">
												<div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
												<span className="font-medium text-green-800">
													🎯 Anomaly Event Labels
													Successfully Generated
												</span>
											</div>
											<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
												<div className="bg-white p-3 rounded border">
													<div className="font-medium text-green-700">
														Event Count
													</div>
													<div className="text-lg font-bold text-green-600">
														{
															labelingInfo.anomaly_events_created
														}
													</div>
												</div>
												<div className="bg-white p-3 rounded border">
													<div className="font-medium text-blue-700">
														Experiment ID
													</div>
													<div className="text-xs font-mono text-blue-600 break-all">
														{
															labelingInfo.experiment_run_id
														}
													</div>
												</div>
												<div className="bg-white p-3 rounded border">
													<div className="font-medium text-purple-700">
														Pipeline Status
													</div>
													<div className="text-sm font-bold text-purple-600">
														{labelingInfo.status}
													</div>
												</div>
											</div>
											<p className="text-sm text-green-700 mt-3">
												✅ All anomaly candidates
												successfully converted to
												annotation events and persisted
												to database. Ready to proceed to
												Stage 2 for expert validation
												and ground truth establishment.
											</p>
										</div>
									)}

									{/* Continue Labeling Button */}
									{candidateCount > 0 &&
										experimentRun &&
										experimentRun.status ===
											"completed" && (
											<div className="pt-4 border-t">
												{labelingReady ? (
													// 已經創建了異常事件，顯示前往Stage 2的按鈕
													<>
														<div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
															<div className="flex items-center gap-2 mb-2">
																<div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
																<span className="font-medium text-blue-800">
																	準備進入人工標註階段
																</span>
															</div>
															<p className="text-sm text-blue-700">
																異常事件已準備完成，點擊下方按鈕進入
																Stage 2
																進行人工標註審核。
															</p>
														</div>
														<Button
															onClick={() => {
																// Navigate to Stage 2 with current URL parameters
																const currentUrl =
																	new URL(
																		window
																			.location
																			.href,
																	);
																currentUrl.searchParams.set(
																	"stage",
																	"stage-2",
																);
																router.push(
																	`${currentUrl.pathname}?${currentUrl.searchParams.toString()}`,
																);
															}}
															className="w-full bg-blue-600 hover:bg-blue-700 text-white"
														>
															<ArrowRight className="mr-2 h-4 w-4" />
															🏷️ Proceed to Stage 2
															(Expert Labeling)
														</Button>
														<p className="text-xs text-gray-500 mt-2 text-center">
															將開始{" "}
															{candidateCount}{" "}
															個異常事件的人工審核標註
														</p>
													</>
												) : (
													// 還沒創建異常事件，顯示創建按鈕
													<>
														<div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
															<div className="flex items-center gap-2 mb-2">
																<div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
																<span className="font-medium text-green-800">
																	準備創建異常事件標籤
																</span>
															</div>
															<p className="text-sm text-green-700">
																候選生成完成，點擊下方按鈕將{" "}
																{candidateCount}{" "}
																個候選轉換為異常事件標籤。
															</p>
														</div>
														<Button
															onClick={
																handleContinueLabeling
															}
															disabled={
																isContinuingLabeling
															}
															className="w-full bg-green-600 hover:bg-green-700 text-white"
														>
															{isContinuingLabeling ? (
																<>
																	<Loader2 className="mr-2 h-4 w-4 animate-spin" />
																	正在創建異常事件標籤...
																</>
															) : (
																<>
																	<ArrowRight className="mr-2 h-4 w-4" />
																	📝
																	創建異常事件標籤
																</>
															)}
														</Button>
														<p className="text-xs text-gray-500 mt-2 text-center">
															將創建{" "}
															{candidateCount}{" "}
															個異常事件到資料庫中準備標註
														</p>
													</>
												)}
											</div>
										)}
								</>
							)}
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}

export default Stage1CandidateGeneration;
