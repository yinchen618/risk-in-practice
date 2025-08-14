"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Play, RotateCcw, Settings } from "lucide-react";

type ModelType = "uPU" | "nnPU";
type PriorMethod = "mean" | "median";
type Activation = "relu" | "tanh";
type Optimizer = "adam" | "sgd";
type TrainingStage = "ready" | "training" | "completed";

interface ModelConfigurationPanelProps {
	// Prediction settings
	predictionStart: string;
	predictionEnd: string;
	onPredictionStartChange: (value: string) => void;
	onPredictionEndChange: (value: string) => void;

	// Model parameters
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

	// Setters
	onModelTypeChange: (value: ModelType) => void;
	onPriorMethodChange: (value: PriorMethod) => void;
	onClassPriorChange: (value: string) => void;
	onHiddenUnitsChange: (value: number) => void;
	onActivationChange: (value: Activation) => void;
	onLambdaRegChange: (value: number) => void;
	onOptimizerChange: (value: Optimizer) => void;
	onLearningRateChange: (value: number) => void;
	onEpochsChange: (value: number) => void;
	onBatchSizeChange: (value: number) => void;
	onSeedChange: (value: number) => void;

	// Actions
	onApplyGoldenConfig: () => void;
	onStartTraining: () => void;
	onResetTraining: () => void;

	// State
	trainingStage: TrainingStage;
	isConfigValid: boolean;
}

export function ModelConfigurationPanel({
	predictionStart,
	predictionEnd,
	onPredictionStartChange,
	onPredictionEndChange,
	modelType,
	priorMethod,
	classPrior,
	hiddenUnits,
	activation,
	lambdaReg,
	optimizer,
	learningRate,
	epochs,
	batchSize,
	seed,
	onModelTypeChange,
	onPriorMethodChange,
	onClassPriorChange,
	onHiddenUnitsChange,
	onActivationChange,
	onLambdaRegChange,
	onOptimizerChange,
	onLearningRateChange,
	onEpochsChange,
	onBatchSizeChange,
	onSeedChange,
	onApplyGoldenConfig,
	onStartTraining,
	onResetTraining,
	trainingStage,
	isConfigValid,
}: ModelConfigurationPanelProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-lg">
					<Settings className="h-5 w-5" />
					Model Configuration
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Prediction Date Range */}
				<div className="space-y-4">
					<h4 className="font-medium text-slate-800">
						Prediction Settings
					</h4>
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label>Prediction Start</Label>
							<Input
								type="date"
								value={predictionStart}
								onChange={(e) =>
									onPredictionStartChange(e.target.value)
								}
							/>
						</div>
						<div className="space-y-2">
							<Label>Prediction End</Label>
							<Input
								type="date"
								value={predictionEnd}
								onChange={(e) =>
									onPredictionEndChange(e.target.value)
								}
							/>
						</div>
					</div>
				</div>

				{/* Model Parameters */}
				<div className="space-y-4">
					<h4 className="font-medium text-slate-800">
						Model Parameters
					</h4>
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label>Model Type</Label>
							<Select
								value={modelType}
								onValueChange={onModelTypeChange}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="uPU">uPU</SelectItem>
									<SelectItem value="nnPU">nnPU</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label>Prior Method</Label>
							<Select
								value={priorMethod}
								onValueChange={onPriorMethodChange}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="mean">Mean</SelectItem>
									<SelectItem value="median">
										Median
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label>Hidden Units</Label>
							<Input
								type="number"
								min={4}
								max={500}
								value={hiddenUnits}
								onChange={(e) =>
									onHiddenUnitsChange(
										Number(e.target.value || 0),
									)
								}
							/>
						</div>
						<div className="space-y-2">
							<Label>Activation</Label>
							<Select
								value={activation}
								onValueChange={onActivationChange}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="relu">ReLU</SelectItem>
									<SelectItem value="tanh">Tanh</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label>Learning Rate</Label>
							<Input
								type="number"
								min={0.00001}
								step={0.001}
								value={learningRate}
								onChange={(e) =>
									onLearningRateChange(
										Number(e.target.value || 0),
									)
								}
							/>
						</div>
						<div className="space-y-2">
							<Label>Optimizer</Label>
							<Select
								value={optimizer}
								onValueChange={onOptimizerChange}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="adam">Adam</SelectItem>
									<SelectItem value="sgd">SGD</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label>Epochs</Label>
							<Input
								type="number"
								min={10}
								max={1000}
								value={epochs}
								onChange={(e) =>
									onEpochsChange(Number(e.target.value || 0))
								}
							/>
						</div>
						<div className="space-y-2">
							<Label>Batch Size</Label>
							<Input
								type="number"
								min={16}
								max={512}
								value={batchSize}
								onChange={(e) =>
									onBatchSizeChange(
										Number(e.target.value || 0),
									)
								}
							/>
						</div>
						<div className="space-y-2">
							<Label>Lambda (L2)</Label>
							<Input
								type="number"
								min={0}
								max={0.1}
								step={0.001}
								value={lambdaReg}
								onChange={(e) =>
									onLambdaRegChange(
										Number(e.target.value || 0),
									)
								}
							/>
						</div>
						<div className="space-y-2">
							<Label>Random Seed</Label>
							<Input
								type="number"
								min={0}
								value={seed}
								onChange={(e) =>
									onSeedChange(Number(e.target.value || 0))
								}
							/>
						</div>
						{classPrior && (
							<div className="space-y-2 col-span-2">
								<Label>Class Prior (optional)</Label>
								<Input
									type="number"
									min={0}
									max={1}
									step={0.01}
									value={classPrior}
									onChange={(e) =>
										onClassPriorChange(e.target.value)
									}
									placeholder="Auto-computed if empty"
								/>
							</div>
						)}
					</div>
				</div>

				{/* Action Buttons */}
				<div className="flex items-center gap-3 pt-4">
					<Button
						onClick={onApplyGoldenConfig}
						variant="outline"
						size="sm"
					>
						Apply Golden Config
					</Button>
					<Button
						onClick={onStartTraining}
						disabled={
							!isConfigValid || trainingStage === "training"
						}
						className="bg-blue-600 hover:bg-blue-700"
					>
						<Play className="h-4 w-4 mr-2" />
						{trainingStage === "training"
							? "Training..."
							: "Start Training"}
					</Button>
					<Button
						onClick={onResetTraining}
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
