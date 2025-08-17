"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Building2 } from "lucide-react";
import type { DistributionShiftScenario } from "./DistributionShiftScenarioPanel";
import { useTrainingData } from "./hooks";

// Building and floor data based on meter.csv analysis
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

interface TimeRange {
	startDate: string;
	endDate: string;
	startTime: string;
	endTime: string;
}

interface DataSource {
	timeRange: TimeRange;
	selectedFloorsByBuilding: Record<string, string[]>;
}

interface DataSourceConfig {
	positiveSource: DataSource;
	unlabeledSource: DataSource & { useSameAsPositive: boolean };
	testSource: DataSource & { useSameAsTraining: boolean };
}

interface DataSourceConfigurationPanelProps {
	config: DataSourceConfig;
	onChange: (config: DataSourceConfig) => void;
	scenario: DistributionShiftScenario;
	selectedRunId: string;
	trainedModels: any[];
	selectedModelId: string;
	onModelSelect: (modelId: string) => void;
}

export function DataSourceConfigurationPanel({
	config,
	onChange,
	scenario,
	selectedRunId,
	trainedModels,
	selectedModelId,
	onModelSelect,
}: DataSourceConfigurationPanelProps) {
	const { trainingDataStats } = useTrainingData(
		selectedRunId,
		"http://localhost:8000",
	);

	const handleTimeRangeChange = (
		sourceType: "positive" | "unlabeled" | "test",
		field: keyof TimeRange,
		value: string,
	) => {
		onChange({
			...config,
			[`${sourceType}Source`]: {
				...config[`${sourceType}Source` as keyof DataSourceConfig],
				timeRange: {
					...(
						config[
							`${sourceType}Source` as keyof DataSourceConfig
						] as any
					).timeRange,
					[field]: value,
				},
			},
		});
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-2">
				<Building2 className="h-4 w-4" />
				<h4 className="font-medium">Data Source Configuration</h4>
			</div>

			{/* Generalization Challenge: Model Selection */}
			{scenario === "GENERALIZATION_CHALLENGE" && (
				<div className="space-y-3 p-3 border rounded-lg bg-blue-50/50">
					<Label className="text-sm font-medium text-blue-700">
						Pre-trained Model Selection
					</Label>
					<Select
						value={selectedModelId}
						onValueChange={onModelSelect}
					>
						<SelectTrigger>
							<SelectValue placeholder="Select pre-trained ERM Baseline model" />
						</SelectTrigger>
						<SelectContent>
							{(() => {
								const ermBaselineModels = trainedModels.filter(
									(model) =>
										model.scenario === "ERM_BASELINE",
								);

								if (ermBaselineModels.length === 0) {
									return (
										<SelectItem value="no-data" disabled>
											No data available
										</SelectItem>
									);
								}

								return ermBaselineModels.map((model) => (
									<SelectItem key={model.id} value={model.id}>
										{model.name} (F1:{" "}
										{model.metrics.testF1.toFixed(2)})
									</SelectItem>
								));
							})()}
						</SelectContent>
					</Select>
					{selectedModelId && (
						<div className="text-xs text-slate-500 italic">
							Use this pre-trained model for generalization
							testing on target domain data
						</div>
					)}
				</div>
			)}

			{/* ERM Baseline & Domain Adaptation: Positive Samples Source */}
			{(scenario === "ERM_BASELINE" ||
				scenario === "DOMAIN_ADAPTATION") && (
				<div className="space-y-3 p-3 border rounded-lg bg-green-50/50">
					<Label className="text-sm font-medium text-green-700">
						Positive (P) Samples Source
					</Label>
					<div className="space-y-3">
						{/* Display labeled data info */}
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-1">
								<Label className="text-xs text-slate-600">
									Source Buildings
								</Label>
								<div className="text-sm font-medium text-slate-900">
									{Object.entries(
										config.positiveSource
											.selectedFloorsByBuilding,
									)
										.filter(
											([, floors]) => floors.length > 0,
										)
										.map(([building]) => building)
										.join(", ") || "None"}
								</div>
							</div>
							<div className="space-y-1">
								<Label className="text-xs text-slate-600">
									Source Floors
								</Label>
								<div className="text-sm font-medium text-slate-900">
									{Object.entries(
										config.positiveSource
											.selectedFloorsByBuilding,
									)
										.filter(
											([, floors]) => floors.length > 0,
										)
										.map(
											([building, floors]) =>
												`${building}: ${floors.join(", ")}F`,
										)
										.join("; ") || "None"}
								</div>
							</div>
						</div>

						{/* Display time range */}
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-1">
								<Label className="text-xs text-slate-600">
									Start Date
								</Label>
								<div className="text-sm font-medium text-slate-900">
									{config.positiveSource.timeRange.startDate}{" "}
									{config.positiveSource.timeRange.startTime}
								</div>
							</div>
							<div className="space-y-1">
								<Label className="text-xs text-slate-600">
									End Date
								</Label>
								<div className="text-sm font-medium text-slate-900">
									{config.positiveSource.timeRange.endDate}{" "}
									{config.positiveSource.timeRange.endTime}
								</div>
							</div>
						</div>

						{/* Display sample count */}
						<div className="flex items-center justify-between p-3 bg-green-100 rounded-lg">
							<div className="flex items-center gap-2">
								<div className="w-3 h-3 bg-green-500 rounded-full" />
								<span className="text-sm font-medium text-green-800">
									Labeled Positive Samples
								</span>
							</div>
							<div className="text-lg font-bold text-green-700">
								{trainingDataStats?.positiveSamples?.toLocaleString() ||
									"Loading..."}
							</div>
						</div>

						{/* Info note */}
						<div className="text-xs text-slate-500 italic">
							* These are the samples you have manually labeled as
							positive during the labeling phase.
						</div>
					</div>
				</div>
			)}

			{/* Unlabeled Samples Source - Dynamic based on scenario */}
			{scenario === "ERM_BASELINE" && (
				<div className="space-y-3 p-3 border rounded-lg">
					<div className="flex items-center justify-between">
						<Label className="text-sm font-medium text-orange-700">
							Unlabeled (U) Samples Source
						</Label>
						<div className="flex items-center space-x-2">
							<Checkbox
								id="unlabeled-same-as-positive"
								checked={true}
								disabled={true}
							/>
							<Label
								htmlFor="unlabeled-same-as-positive"
								className="text-xs text-slate-500"
							>
								Same as Positive (locked)
							</Label>
						</div>
					</div>
					<div className="text-xs text-slate-500 italic">
						ERM Baseline: Unlabeled samples source is automatically
						set to be the same as positive samples
					</div>
				</div>
			)}

			{scenario === "DOMAIN_ADAPTATION" && (
				<div className="space-y-3 p-3 border rounded-lg">
					<div className="flex items-center justify-between">
						<Label className="text-sm font-medium text-orange-700">
							Unlabeled (U) Samples Source
						</Label>
					</div>

					{/* Building and Floor Selection for Domain Adaptation */}
					<div className="grid grid-cols-2 gap-3">
						{/* Building A Section */}
						<div className="bg-white p-3 rounded-md border border-slate-200">
							<div className="flex items-center justify-between mb-2">
								<Label className="text-xs font-medium text-slate-700 flex items-center">
									<Building2 className="h-3 w-3 mr-1 text-emerald-600" />
									Building A
								</Label>
								<Checkbox
									id="unlabeled-building-a"
									checked={
										config.unlabeledSource
											.selectedFloorsByBuilding?.[
											"Building A"
										]?.length ===
										BUILDINGS_WITH_FLOORS[0].floors.length
									}
									ref={(el) => {
										if (el && "indeterminate" in el) {
											const selectedCount =
												config.unlabeledSource
													.selectedFloorsByBuilding?.[
													"Building A"
												]?.length || 0;
											const totalCount =
												BUILDINGS_WITH_FLOORS[0].floors
													.length;
											(el as any).indeterminate =
												selectedCount > 0 &&
												selectedCount < totalCount;
										}
									}}
									onCheckedChange={(checked) => {
										const newFloorsByBuilding = {
											...config.unlabeledSource
												.selectedFloorsByBuilding,
											"Building A": checked
												? BUILDINGS_WITH_FLOORS[0]
														.floors
												: [],
										};
										onChange({
											...config,
											unlabeledSource: {
												...config.unlabeledSource,
												selectedFloorsByBuilding:
													newFloorsByBuilding,
												useSameAsPositive: false,
											},
										});
									}}
								/>
							</div>
							<div className="space-y-1">
								{BUILDINGS_WITH_FLOORS[0].floors.map(
									(floorId) => {
										const isFloorSelected =
											config.unlabeledSource.selectedFloorsByBuilding?.[
												"Building A"
											]?.includes(floorId) || false;
										return (
											<div
												key={`unlabeled-building-a-${floorId}`}
												className="flex items-center justify-between py-1 px-2 bg-slate-50 rounded text-xs hover:bg-slate-100 transition-colors"
											>
												<Label
													htmlFor={`unlabeled-floor-a-${floorId}`}
													className="text-slate-700 cursor-pointer"
												>
													{floorId}F
												</Label>
												<Checkbox
													id={`unlabeled-floor-a-${floorId}`}
													checked={isFloorSelected}
													onCheckedChange={(
														checked,
													) => {
														const currentBuildingFloors =
															config
																.unlabeledSource
																.selectedFloorsByBuilding?.[
																"Building A"
															] || [];
														let newBuildingFloors: string[];
														if (checked) {
															newBuildingFloors =
																[
																	...currentBuildingFloors,
																	floorId,
																];
														} else {
															newBuildingFloors =
																currentBuildingFloors.filter(
																	(
																		id: string,
																	) =>
																		id !==
																		floorId,
																);
														}
														const newFloorsByBuilding =
															{
																...config
																	.unlabeledSource
																	.selectedFloorsByBuilding,
																"Building A":
																	newBuildingFloors,
															};
														onChange({
															...config,
															unlabeledSource: {
																...config.unlabeledSource,
																selectedFloorsByBuilding:
																	newFloorsByBuilding,
																useSameAsPositive: false,
															},
														});
													}}
												/>
											</div>
										);
									},
								)}
							</div>
						</div>

						{/* Building B Section */}
						<div className="bg-white p-3 rounded-md border border-slate-200">
							<div className="flex items-center justify-between mb-2">
								<Label className="text-xs font-medium text-slate-700 flex items-center">
									<Building2 className="h-3 w-3 mr-1 text-orange-600" />
									Building B
								</Label>
								<Checkbox
									id="unlabeled-building-b"
									checked={
										config.unlabeledSource
											.selectedFloorsByBuilding?.[
											"Building B"
										]?.length ===
										BUILDINGS_WITH_FLOORS[1].floors.length
									}
									ref={(el) => {
										if (el && "indeterminate" in el) {
											const selectedCount =
												config.unlabeledSource
													.selectedFloorsByBuilding?.[
													"Building B"
												]?.length || 0;
											const totalCount =
												BUILDINGS_WITH_FLOORS[1].floors
													.length;
											(el as any).indeterminate =
												selectedCount > 0 &&
												selectedCount < totalCount;
										}
									}}
									onCheckedChange={(checked) => {
										const newFloorsByBuilding = {
											...config.unlabeledSource
												.selectedFloorsByBuilding,
											"Building B": checked
												? BUILDINGS_WITH_FLOORS[1]
														.floors
												: [],
										};
										onChange({
											...config,
											unlabeledSource: {
												...config.unlabeledSource,
												selectedFloorsByBuilding:
													newFloorsByBuilding,
												useSameAsPositive: false,
											},
										});
									}}
								/>
							</div>
							<div className="space-y-1">
								{BUILDINGS_WITH_FLOORS[1].floors.map(
									(floorId) => {
										const isFloorSelected =
											config.unlabeledSource.selectedFloorsByBuilding?.[
												"Building B"
											]?.includes(floorId) || false;
										return (
											<div
												key={`unlabeled-building-b-${floorId}`}
												className="flex items-center justify-between py-1 px-2 bg-slate-50 rounded text-xs hover:bg-slate-100 transition-colors"
											>
												<Label
													htmlFor={`unlabeled-floor-b-${floorId}`}
													className="text-slate-700 cursor-pointer"
												>
													{floorId}F
												</Label>
												<Checkbox
													id={`unlabeled-floor-b-${floorId}`}
													checked={isFloorSelected}
													onCheckedChange={(
														checked,
													) => {
														const currentBuildingFloors =
															config
																.unlabeledSource
																.selectedFloorsByBuilding?.[
																"Building B"
															] || [];
														let newBuildingFloors: string[];
														if (checked) {
															newBuildingFloors =
																[
																	...currentBuildingFloors,
																	floorId,
																];
														} else {
															newBuildingFloors =
																currentBuildingFloors.filter(
																	(
																		id: string,
																	) =>
																		id !==
																		floorId,
																);
														}
														const newFloorsByBuilding =
															{
																...config
																	.unlabeledSource
																	.selectedFloorsByBuilding,
																"Building B":
																	newBuildingFloors,
															};
														onChange({
															...config,
															unlabeledSource: {
																...config.unlabeledSource,
																selectedFloorsByBuilding:
																	newFloorsByBuilding,
																useSameAsPositive: false,
															},
														});
													}}
												/>
											</div>
										);
									},
								)}
							</div>
						</div>
					</div>

					{/* Date Range */}
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label className="text-xs text-slate-600">
								Start Date
							</Label>
							<Input
								type="date"
								value={
									config.unlabeledSource.timeRange.startDate
								}
								onChange={(e) =>
									handleTimeRangeChange(
										"unlabeled",
										"startDate",
										e.target.value,
									)
								}
							/>
						</div>
						<div className="space-y-2">
							<Label className="text-xs text-slate-600">
								End Date
							</Label>
							<Input
								type="date"
								value={config.unlabeledSource.timeRange.endDate}
								onChange={(e) =>
									handleTimeRangeChange(
										"unlabeled",
										"endDate",
										e.target.value,
									)
								}
							/>
						</div>
					</div>

					{/* Time Range */}
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label className="text-xs text-slate-600">
								Start Time
							</Label>
							<Input
								type="time"
								value={
									config.unlabeledSource.timeRange.startTime
								}
								onChange={(e) =>
									handleTimeRangeChange(
										"unlabeled",
										"startTime",
										e.target.value,
									)
								}
							/>
						</div>
						<div className="space-y-2">
							<Label className="text-xs text-slate-600">
								End Time
							</Label>
							<Input
								type="time"
								value={config.unlabeledSource.timeRange.endTime}
								onChange={(e) =>
									handleTimeRangeChange(
										"unlabeled",
										"endTime",
										e.target.value,
									)
								}
							/>
						</div>
					</div>
				</div>
			)}

			{/* Test Set Source - Dynamic based on scenario */}
			{scenario === "ERM_BASELINE" && (
				<div className="space-y-3 p-3 border rounded-lg bg-blue-50/50">
					<div className="flex items-center justify-between">
						<Label className="text-sm font-medium text-blue-700">
							Test Set Source
						</Label>
						<div className="flex items-center space-x-2">
							<Checkbox
								id="test-same-as-unlabeled"
								checked={true}
								disabled={true}
							/>
							<Label
								htmlFor="test-same-as-unlabeled"
								className="text-xs text-slate-500"
							>
								Same as Unlabeled (locked)
							</Label>
						</div>
					</div>
					<div className="text-xs text-slate-500 italic">
						ERM Baseline: Test set source is automatically set to be
						the same as unlabeled samples
					</div>
				</div>
			)}

			{scenario === "GENERALIZATION_CHALLENGE" && (
				<div className="space-y-3 p-3 border rounded-lg bg-blue-50/50">
					<Label className="text-sm font-medium text-blue-700">
						Test Set Source
					</Label>

					{/* Building and Floor Selection for Generalization Challenge */}
					<div className="grid grid-cols-2 gap-3">
						{/* Building A Section */}
						<div className="bg-white p-3 rounded-md border border-slate-200">
							<div className="flex items-center justify-between mb-2">
								<Label className="text-xs font-medium text-slate-700 flex items-center">
									<Building2 className="h-3 w-3 mr-1 text-emerald-600" />
									Building A
								</Label>
								<Checkbox
									id="test-building-a"
									checked={
										config.testSource
											.selectedFloorsByBuilding?.[
											"Building A"
										]?.length ===
										BUILDINGS_WITH_FLOORS[0].floors.length
									}
									ref={(el) => {
										if (el && "indeterminate" in el) {
											const selectedCount =
												config.testSource
													.selectedFloorsByBuilding?.[
													"Building A"
												]?.length || 0;
											const totalCount =
												BUILDINGS_WITH_FLOORS[0].floors
													.length;
											(el as any).indeterminate =
												selectedCount > 0 &&
												selectedCount < totalCount;
										}
									}}
									onCheckedChange={(checked) => {
										const newFloorsByBuilding = {
											...config.testSource
												.selectedFloorsByBuilding,
											"Building A": checked
												? BUILDINGS_WITH_FLOORS[0]
														.floors
												: [],
										};
										onChange({
											...config,
											testSource: {
												...config.testSource,
												selectedFloorsByBuilding:
													newFloorsByBuilding,
												useSameAsTraining: false,
											},
										});
									}}
								/>
							</div>
							<div className="space-y-1">
								{BUILDINGS_WITH_FLOORS[0].floors.map(
									(floorId) => {
										const isFloorSelected =
											config.testSource.selectedFloorsByBuilding?.[
												"Building A"
											]?.includes(floorId) || false;
										return (
											<div
												key={`building-a-${floorId}`}
												className="flex items-center justify-between py-1 px-2 bg-slate-50 rounded text-xs hover:bg-slate-100 transition-colors"
											>
												<Label
													htmlFor={`test-floor-a-${floorId}`}
													className="text-slate-700 cursor-pointer"
												>
													{floorId}F
												</Label>
												<Checkbox
													id={`test-floor-a-${floorId}`}
													checked={isFloorSelected}
													onCheckedChange={(
														checked,
													) => {
														const currentBuildingFloors =
															config.testSource
																.selectedFloorsByBuilding?.[
																"Building A"
															] || [];
														let newBuildingFloors: string[];
														if (checked) {
															newBuildingFloors =
																[
																	...currentBuildingFloors,
																	floorId,
																];
														} else {
															newBuildingFloors =
																currentBuildingFloors.filter(
																	(
																		id: string,
																	) =>
																		id !==
																		floorId,
																);
														}
														const newFloorsByBuilding =
															{
																...config
																	.testSource
																	.selectedFloorsByBuilding,
																"Building A":
																	newBuildingFloors,
															};
														onChange({
															...config,
															testSource: {
																...config.testSource,
																selectedFloorsByBuilding:
																	newFloorsByBuilding,
																useSameAsTraining: false,
															},
														});
													}}
												/>
											</div>
										);
									},
								)}
							</div>
						</div>

						{/* Building B Section */}
						<div className="bg-white p-3 rounded-md border border-slate-200">
							<div className="flex items-center justify-between mb-2">
								<Label className="text-xs font-medium text-slate-700 flex items-center">
									<Building2 className="h-3 w-3 mr-1 text-orange-600" />
									Building B
								</Label>
								<Checkbox
									id="test-building-b"
									checked={
										config.testSource
											.selectedFloorsByBuilding?.[
											"Building B"
										]?.length ===
										BUILDINGS_WITH_FLOORS[1].floors.length
									}
									ref={(el) => {
										if (el && "indeterminate" in el) {
											const selectedCount =
												config.testSource
													.selectedFloorsByBuilding?.[
													"Building B"
												]?.length || 0;
											const totalCount =
												BUILDINGS_WITH_FLOORS[1].floors
													.length;
											(el as any).indeterminate =
												selectedCount > 0 &&
												selectedCount < totalCount;
										}
									}}
									onCheckedChange={(checked) => {
										const newFloorsByBuilding = {
											...config.testSource
												.selectedFloorsByBuilding,
											"Building B": checked
												? BUILDINGS_WITH_FLOORS[1]
														.floors
												: [],
										};
										onChange({
											...config,
											testSource: {
												...config.testSource,
												selectedFloorsByBuilding:
													newFloorsByBuilding,
												useSameAsTraining: false,
											},
										});
									}}
								/>
							</div>
							<div className="space-y-1">
								{BUILDINGS_WITH_FLOORS[1].floors.map(
									(floorId) => {
										const isFloorSelected =
											config.testSource.selectedFloorsByBuilding?.[
												"Building B"
											]?.includes(floorId) || false;
										return (
											<div
												key={`building-b-${floorId}`}
												className="flex items-center justify-between py-1 px-2 bg-slate-50 rounded text-xs hover:bg-slate-100 transition-colors"
											>
												<Label
													htmlFor={`test-floor-b-${floorId}`}
													className="text-slate-700 cursor-pointer"
												>
													{floorId}F
												</Label>
												<Checkbox
													id={`test-floor-b-${floorId}`}
													checked={isFloorSelected}
													onCheckedChange={(
														checked,
													) => {
														const currentBuildingFloors =
															config.testSource
																.selectedFloorsByBuilding?.[
																"Building B"
															] || [];
														let newBuildingFloors: string[];
														if (checked) {
															newBuildingFloors =
																[
																	...currentBuildingFloors,
																	floorId,
																];
														} else {
															newBuildingFloors =
																currentBuildingFloors.filter(
																	(
																		id: string,
																	) =>
																		id !==
																		floorId,
																);
														}
														const newFloorsByBuilding =
															{
																...config
																	.testSource
																	.selectedFloorsByBuilding,
																"Building B":
																	newBuildingFloors,
															};
														onChange({
															...config,
															testSource: {
																...config.testSource,
																selectedFloorsByBuilding:
																	newFloorsByBuilding,
																useSameAsTraining: false,
															},
														});
													}}
												/>
											</div>
										);
									},
								)}
							</div>
						</div>
					</div>

					{/* Date Range */}
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label className="text-xs text-slate-600">
								Start Date
							</Label>
							<Input
								type="date"
								value={config.testSource.timeRange.startDate}
								onChange={(e) =>
									handleTimeRangeChange(
										"test",
										"startDate",
										e.target.value,
									)
								}
							/>
						</div>
						<div className="space-y-2">
							<Label className="text-xs text-slate-600">
								End Date
							</Label>
							<Input
								type="date"
								value={config.testSource.timeRange.endDate}
								onChange={(e) =>
									handleTimeRangeChange(
										"test",
										"endDate",
										e.target.value,
									)
								}
							/>
						</div>
					</div>

					{/* Time Range */}
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label className="text-xs text-slate-600">
								Start Time
							</Label>
							<Input
								type="time"
								value={config.testSource.timeRange.startTime}
								onChange={(e) =>
									handleTimeRangeChange(
										"test",
										"startTime",
										e.target.value,
									)
								}
							/>
						</div>
						<div className="space-y-2">
							<Label className="text-xs text-slate-600">
								End Time
							</Label>
							<Input
								type="time"
								value={config.testSource.timeRange.endTime}
								onChange={(e) =>
									handleTimeRangeChange(
										"test",
										"endTime",
										e.target.value,
									)
								}
							/>
						</div>
					</div>
				</div>
			)}

			{scenario === "DOMAIN_ADAPTATION" && (
				<div className="space-y-3 p-3 border rounded-lg bg-blue-50/50">
					<div className="flex items-center justify-between">
						<Label className="text-sm font-medium text-blue-700">
							Test Set Source
						</Label>
						<div className="flex items-center space-x-2">
							<Checkbox
								id="test-same-as-unlabeled-domain"
								checked={true}
								disabled={true}
							/>
							<Label
								htmlFor="test-same-as-unlabeled-domain"
								className="text-xs text-slate-500"
							>
								Same as Unlabeled (locked)
							</Label>
						</div>
					</div>
					<div className="text-xs text-slate-500 italic">
						Domain Adaptation: Test set source is automatically set
						to be the same as unlabeled target samples
					</div>
				</div>
			)}
		</div>
	);
}
