"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

type ModelType = "uPU" | "nnPU";
type PriorMethod = "mean" | "median" | "kmm" | "en" | "custom";
type Activation = "relu" | "tanh";
type Optimizer = "adam" | "sgd";

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

interface ModelParametersPanelProps {
	params: ModelParams;
	onParamsChange: (params: Partial<ModelParams>) => void;
}

export function ModelParametersPanel({
	params,
	onParamsChange,
}: ModelParametersPanelProps) {
	return (
		<div className="space-y-4">
			<h4 className="font-medium text-slate-800">Model Parameters</h4>
			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label>Model Type</Label>
					<Select
						value={params.modelType}
						onValueChange={(value: ModelType) =>
							onParamsChange({ modelType: value })
						}
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
						value={params.priorMethod}
						onValueChange={(value: PriorMethod) =>
							onParamsChange({ priorMethod: value })
						}
					>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="mean">Mean</SelectItem>
							<SelectItem value="median">Median</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className="space-y-2">
					<Label>Hidden Units</Label>
					<Input
						type="number"
						min={4}
						max={500}
						value={params.hiddenUnits}
						onChange={(e) =>
							onParamsChange({
								hiddenUnits: Number(e.target.value || 0),
							})
						}
					/>
				</div>
				<div className="space-y-2">
					<Label>Activation</Label>
					<Select
						value={params.activation}
						onValueChange={(value: Activation) =>
							onParamsChange({ activation: value })
						}
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
						value={params.learningRate}
						onChange={(e) =>
							onParamsChange({
								learningRate: Number(e.target.value || 0),
							})
						}
					/>
				</div>
				<div className="space-y-2">
					<Label>Optimizer</Label>
					<Select
						value={params.optimizer}
						onValueChange={(value: Optimizer) =>
							onParamsChange({ optimizer: value })
						}
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
						value={params.epochs}
						onChange={(e) =>
							onParamsChange({
								epochs: Number(e.target.value || 0),
							})
						}
					/>
				</div>
				<div className="space-y-2">
					<Label>Batch Size</Label>
					<Input
						type="number"
						min={16}
						max={512}
						value={params.batchSize}
						onChange={(e) =>
							onParamsChange({
								batchSize: Number(e.target.value || 0),
							})
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
						value={params.lambdaReg}
						onChange={(e) =>
							onParamsChange({
								lambdaReg: Number(e.target.value || 0),
							})
						}
					/>
				</div>
				<div className="space-y-2">
					<Label>Random Seed</Label>
					<Input
						type="number"
						min={0}
						value={params.seed}
						onChange={(e) =>
							onParamsChange({
								seed: Number(e.target.value || 0),
							})
						}
					/>
				</div>
				{params.classPrior && (
					<div className="space-y-2 col-span-2">
						<Label>Class Prior (optional)</Label>
						<Input
							type="number"
							min={0}
							max={1}
							step={0.01}
							value={params.classPrior}
							onChange={(e) =>
								onParamsChange({ classPrior: e.target.value })
							}
							placeholder="Auto-computed if empty"
						/>
					</div>
				)}
			</div>
		</div>
	);
}
