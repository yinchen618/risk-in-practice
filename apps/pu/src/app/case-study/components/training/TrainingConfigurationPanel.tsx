"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, RotateCcw, Settings, Zap } from "lucide-react";
import { DataRangeConfigPanel } from "./DataRangeConfigPanel";
import { ModelParametersPanel } from "./ModelParametersPanel";

type ModelType = "uPU" | "nnPU";
type PriorMethod = "mean" | "median" | "kmm" | "en" | "custom";
type Activation = "relu" | "tanh";
type Optimizer = "adam" | "sgd";
type TrainingStage = "ready" | "training" | "completed" | "failed";
type TimeRangeMode = "original" | "custom";

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

// 模型參數
interface ModelParams {
	modelType: ModelType;
	priorMethod: PriorMethod;
	classPrior: string;
	hiddenUnits: number;
	activation: Activation;
	lambdaReg: number;
	optimizer: Optimizer;
	learningRate: number;
	epochs: number;
	batchSize: number;
	seed: number;
}

// 數據範圍配置
interface DataRangeConfig {
	mode: TimeRangeMode;
	timeRange?: TimeRangeParams;
	floor?: FloorParams;
	originalTimeRange?: TimeRangeParams;
	originalFloor?: FloorParams;
}

// 動作配置
interface TrainingActions {
	onApplyGoldenConfig: () => void;
	onStartTraining: () => void;
	onResetTraining: () => void;
}

interface TrainingConfigurationPanelProps {
	modelParams: ModelParams;
	onModelParamsChange: (params: Partial<ModelParams>) => void;
	dataRangeConfig: DataRangeConfig;
	onDataRangeConfigChange: (config: Partial<DataRangeConfig>) => void;
	actions: TrainingActions;
	trainingStage: TrainingStage;
	isConfigValid: boolean;
}

export function TrainingConfigurationPanel({
	modelParams,
	onModelParamsChange,
	dataRangeConfig,
	onDataRangeConfigChange,
	actions,
	trainingStage,
	isConfigValid,
}: TrainingConfigurationPanelProps) {
	return (
		<Card className="border-blue-200">
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-lg">
					<Zap className="h-5 w-5 text-blue-600" />
					Training Configuration
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Data Range Configuration */}
				<DataRangeConfigPanel
					config={dataRangeConfig}
					onConfigChange={onDataRangeConfigChange}
				/>

				{/* Model Parameters */}
				<div className="space-y-4">
					<h4 className="font-medium text-slate-800 flex items-center">
						<Settings className="h-4 w-4 mr-2" />
						Model Parameters
					</h4>
					<ModelParametersPanel
						params={modelParams}
						onParamsChange={onModelParamsChange}
					/>
				</div>

				{/* Action Buttons */}
				<div className="flex items-center gap-3 pt-4 border-t">
					<Button
						onClick={actions.onApplyGoldenConfig}
						variant="outline"
						size="sm"
					>
						Apply Golden Config
					</Button>
					<Button
						onClick={actions.onStartTraining}
						disabled={
							!isConfigValid || trainingStage === "training"
						}
						className="bg-blue-600 hover:bg-blue-700"
					>
						<Play className="h-4 w-4 mr-2" />
						{trainingStage === "training"
							? "Training..."
							: trainingStage === "failed"
								? "Retry Training"
								: "Start Training"}
					</Button>
					<Button
						onClick={actions.onResetTraining}
						variant="outline"
						size="sm"
					>
						<RotateCcw className="h-4 w-4 mr-2" />
						Reset
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
