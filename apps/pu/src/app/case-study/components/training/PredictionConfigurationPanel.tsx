"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Brain, Building2, Calendar, Target } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

// 時間範圍參數
interface TimeRangeParams {
	startDate: Date;
	endDate: Date;
	startTime: string;
	endTime: string;
}

// 樓層過濾參數
interface FloorParams {
	selectedBuildings: string[];
	selectedFloors: string[];
	selectedFloorsByBuilding?: Record<string, string[]>;
}

// 預測配置
interface PredictionConfig {
	modelId: string;
	timeRange: TimeRangeParams;
	floor: FloorParams;
}

// 訓練模型信息
interface TrainedModel {
	id: string;
	model_name: string;
	model_type: string;
	status: string;
	created_at: string;
	metrics?: any;
}

interface PredictionConfigurationPanelProps {
	selectedRunId: string;
	config: PredictionConfig;
	onConfigChange: (config: Partial<PredictionConfig>) => void;
	onStartPrediction: () => void;
	isLoading?: boolean;
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

export function PredictionConfigurationPanel({
	selectedRunId,
	config,
	onConfigChange,
	onStartPrediction,
	isLoading = false,
}: PredictionConfigurationPanelProps) {
	const [availableModels, setAvailableModels] = useState<TrainedModel[]>([]);
	const [loadingModels, setLoadingModels] = useState(false);

	// 載入可用的訓練模型
	useEffect(() => {
		const loadAvailableModels = async () => {
			if (!selectedRunId) {
				return;
			}

			setLoadingModels(true);
			try {
				const response = await fetch(
					`http://localhost:8000/api/v1/models/experiment/${selectedRunId}`,
				);
				if (response.ok) {
					const data = await response.json();
					if (data.success && data.data?.models) {
						setAvailableModels(data.data.models);
						// 如果還沒有選擇模型且有可用模型，自動選擇第一個
						if (!config.modelId && data.data.models.length > 0) {
							onConfigChange({ modelId: data.data.models[0].id });
						}
					}
				}
			} catch (error) {
				console.error("Failed to load available models:", error);
			} finally {
				setLoadingModels(false);
			}
		};

		loadAvailableModels();
	}, [selectedRunId, config.modelId, onConfigChange]);

	// Handler for building selection
	const handleBuildingChange = useCallback(
		(buildingId: string, checked: boolean) => {
			const building = BUILDINGS_WITH_FLOORS.find(
				(b) => b.id === buildingId,
			);
			if (!building) {
				return;
			}

			const currentFloorsByBuilding =
				config.floor.selectedFloorsByBuilding || {};
			const newFloorsByBuilding = {
				...currentFloorsByBuilding,
				[buildingId]: checked ? building.floors : [],
			};

			const allSelectedFloors = Object.values(newFloorsByBuilding).flat();

			onConfigChange({
				floor: {
					...config.floor,
					selectedFloorsByBuilding: newFloorsByBuilding,
					selectedFloors: allSelectedFloors,
					selectedBuildings: Object.keys(newFloorsByBuilding).filter(
						(bid) => newFloorsByBuilding[bid].length > 0,
					),
				},
			});
		},
		[config.floor, onConfigChange],
	);

	// Handler for floor selection
	const handleFloorChange = useCallback(
		(floorId: string, checked: boolean) => {
			const currentFloors = config.floor.selectedFloors || [];
			const newFloors = checked
				? [...currentFloors, floorId]
				: currentFloors.filter((f) => f !== floorId);

			onConfigChange({
				floor: {
					...config.floor,
					selectedFloors: newFloors,
				},
			});
		},
		[config.floor, onConfigChange],
	);

	const formatModelDisplayName = (model: TrainedModel) => {
		const date = new Date(model.created_at).toLocaleDateString();
		const time = new Date(model.created_at).toLocaleTimeString();
		return `${model.model_type} - ${date} ${time}`;
	};

	const isConfigValid =
		config.modelId &&
		config.timeRange.startDate &&
		config.timeRange.endDate;

	return (
		<Card className="border-green-200">
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-lg">
					<Target className="h-5 w-5 text-green-600" />
					Prediction Configuration
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Model Selection */}
				<div className="space-y-4">
					<h4 className="font-medium text-slate-800 flex items-center">
						<Brain className="h-4 w-4 mr-2" />
						Select Trained Model
					</h4>
					<div className="space-y-2">
						<Label>Available Models</Label>
						<Select
							value={config.modelId}
							onValueChange={(value) =>
								onConfigChange({ modelId: value })
							}
							disabled={loadingModels}
						>
							<SelectTrigger>
								<SelectValue
									placeholder={
										loadingModels
											? "Loading models..."
											: availableModels.length === 0
												? "No trained models available"
												: "Select a model"
									}
								/>
							</SelectTrigger>
							<SelectContent>
								{availableModels.map((model) => (
									<SelectItem key={model.id} value={model.id}>
										{formatModelDisplayName(model)}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{availableModels.length === 0 && !loadingModels && (
							<p className="text-sm text-slate-500">
								No trained models found for this experiment.
								Please train a model first.
							</p>
						)}
					</div>
				</div>

				{/* Time Range Selection */}
				<div className="space-y-4">
					<h4 className="font-medium text-slate-800 flex items-center">
						<Calendar className="h-4 w-4 mr-2" />
						Prediction Time Range
					</h4>
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label>Start Date</Label>
							<Input
								type="date"
								value={
									config.timeRange.startDate
										? config.timeRange.startDate
												.toISOString()
												.split("T")[0]
										: ""
								}
								onChange={(e) =>
									onConfigChange({
										timeRange: {
											...config.timeRange,
											startDate: new Date(e.target.value),
										},
									})
								}
							/>
						</div>
						<div className="space-y-2">
							<Label>End Date</Label>
							<Input
								type="date"
								value={
									config.timeRange.endDate
										? config.timeRange.endDate
												.toISOString()
												.split("T")[0]
										: ""
								}
								onChange={(e) =>
									onConfigChange({
										timeRange: {
											...config.timeRange,
											endDate: new Date(e.target.value),
										},
									})
								}
							/>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label>Start Time</Label>
							<Input
								type="time"
								value={config.timeRange.startTime}
								onChange={(e) =>
									onConfigChange({
										timeRange: {
											...config.timeRange,
											startTime: e.target.value,
										},
									})
								}
							/>
						</div>
						<div className="space-y-2">
							<Label>End Time</Label>
							<Input
								type="time"
								value={config.timeRange.endTime}
								onChange={(e) =>
									onConfigChange({
										timeRange: {
											...config.timeRange,
											endTime: e.target.value,
										},
									})
								}
							/>
						</div>
					</div>
				</div>

				{/* Floor Selection */}
				<div className="space-y-4">
					<h4 className="font-medium text-slate-800 flex items-center">
						<Building2 className="h-4 w-4 mr-2" />
						Building & Floor Selection
					</h4>

					{/* Building Selection */}
					<div className="space-y-3">
						<Label className="text-sm font-medium">Buildings</Label>
						<div className="grid grid-cols-2 gap-3">
							{BUILDINGS_WITH_FLOORS.map((building) => {
								const isSelected =
									config.floor.selectedBuildings?.includes(
										building.id,
									) || false;
								return (
									<div
										key={building.id}
										className="flex items-center space-x-2"
									>
										<Checkbox
											id={`building-${building.id}`}
											checked={isSelected}
											onCheckedChange={(checked) =>
												handleBuildingChange(
													building.id,
													checked as boolean,
												)
											}
										/>
										<Label
											htmlFor={`building-${building.id}`}
											className="text-sm"
										>
											{building.name}
										</Label>
									</div>
								);
							})}
						</div>
					</div>

					{/* Floor Selection */}
					<div className="space-y-3">
						<Label className="text-sm font-medium">Floors</Label>
						<div className="grid grid-cols-5 gap-3">
							{ALL_FLOORS.map((floor) => {
								const isSelected =
									config.floor.selectedFloors?.includes(
										floor.id,
									) || false;
								return (
									<div
										key={floor.id}
										className="flex items-center space-x-2"
									>
										<Checkbox
											id={`floor-${floor.id}`}
											checked={isSelected}
											onCheckedChange={(checked) =>
												handleFloorChange(
													floor.id,
													checked as boolean,
												)
											}
										/>
										<Label
											htmlFor={`floor-${floor.id}`}
											className="text-sm"
										>
											{floor.name}
										</Label>
									</div>
								);
							})}
						</div>
					</div>
				</div>

				{/* Action Button */}
				<div className="pt-4 border-t">
					<Button
						onClick={onStartPrediction}
						disabled={!isConfigValid || isLoading}
						className="bg-green-600 hover:bg-green-700"
					>
						<Target className="h-4 w-4 mr-2" />
						{isLoading ? "Predicting..." : "Start Prediction"}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
