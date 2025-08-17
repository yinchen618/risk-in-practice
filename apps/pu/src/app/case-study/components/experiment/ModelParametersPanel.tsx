"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Brain, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import type { Activation, ModelType, Optimizer, PriorMethod } from "./types";

interface ModelParameters {
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
	modelParams: ModelParameters;
	onChange: (modelParams: ModelParameters) => void;
}

export function ModelParametersPanel({
	modelParams,
	onChange,
}: ModelParametersPanelProps) {
	const [isCollapsed, setIsCollapsed] = useState(false);

	const handleParamChange = (key: keyof ModelParameters, value: any) => {
		onChange({
			...modelParams,
			[key]: value,
		});
	};

	// 判斷是否為 uPU 演算法
	const isUPU = modelParams.modelType === "uPU";

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Brain className="h-4 w-4" />
					<h4 className="font-medium">Model Parameters</h4>
				</div>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => setIsCollapsed(!isCollapsed)}
					className="h-8 w-8 p-0"
				>
					{isCollapsed ? (
						<ChevronDown className="h-4 w-4" />
					) : (
						<ChevronUp className="h-4 w-4" />
					)}
				</Button>
			</div>

			{!isCollapsed && (
				<div className="space-y-4">
					{/* Algorithm Selection */}
					<div className="space-y-2">
						<Label className="text-xs">Algorithm Selection:</Label>
						<RadioGroup
							value={modelParams.modelType}
							onValueChange={(value) =>
								handleParamChange("modelType", value)
							}
						>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="uPU" id="upu-exp" />
								<Label htmlFor="upu-exp" className="text-xs">
									uPU (ICML 2015)
								</Label>
							</div>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="nnPU" id="nnpu-exp" />
								<Label htmlFor="nnpu-exp" className="text-xs">
									nnPU (NIPS 2017)
								</Label>
							</div>
						</RadioGroup>
					</div>

					{/* uPU 說明文字 */}
					{isUPU && (
						<div className="p-2 bg-blue-50 border border-blue-200 rounded-md">
							<p className="text-xs text-blue-800">
								<strong>
									Classic uPU uses kernel methods with
									cross-validation to automatically find
									optimal solutions.
								</strong>
							</p>
						</div>
					)}

					{/* Prior Estimation Method */}
					<div className="space-y-2">
						<Label className="text-xs">
							Prior Estimation Method:
						</Label>
						<Select
							value={modelParams.priorMethod}
							onValueChange={(value) =>
								handleParamChange("priorMethod", value)
							}
						>
							<SelectTrigger className="h-8">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="mean">
									Mean (Original)
								</SelectItem>
								<SelectItem value="median">
									Median (Recommended) ✅
								</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Model Complexity (Hidden Layer Size) */}
					<div className="space-y-2">
						<Label className="text-xs">
							{isUPU
								? "Model Complexity (Basis Functions):"
								: "Model Complexity (Hidden Layer Size):"}{" "}
							{modelParams.hiddenUnits}
						</Label>
						<Slider
							value={[modelParams.hiddenUnits]}
							onValueChange={(value) =>
								handleParamChange("hiddenUnits", value[0])
							}
							min={10}
							max={500}
							step={10}
							className="w-full"
						/>
						<div className="flex justify-between text-xs text-gray-500 mt-1">
							<span>10 (Simple)</span>
							<span>500 (Complex)</span>
						</div>
					</div>

					{/* Activation Function */}
					<div className="space-y-2">
						<Label className="text-xs">Activation Function:</Label>
						<Select
							value={modelParams.activation}
							onValueChange={(value) =>
								handleParamChange("activation", value)
							}
							disabled={isUPU}
						>
							<SelectTrigger
								className={`h-8 ${isUPU ? "opacity-50 cursor-not-allowed" : ""}`}
							>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="relu">ReLU ✅</SelectItem>
								<SelectItem value="tanh">Tanh</SelectItem>
							</SelectContent>
						</Select>
						{isUPU && (
							<div className="text-xs text-gray-500">
								uPU uses kernel methods, no activation function
								needed
							</div>
						)}
					</div>

					{/* Learning Rate */}
					<div className="space-y-2">
						<Label className="text-xs">Learning Rate:</Label>
						<Select
							value={modelParams.learningRate.toString()}
							onValueChange={(value) =>
								handleParamChange("learningRate", Number(value))
							}
							disabled={isUPU}
						>
							<SelectTrigger
								className={`h-8 ${isUPU ? "opacity-50 cursor-not-allowed" : ""}`}
							>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="0.01">
									Fast (0.01)
								</SelectItem>
								<SelectItem value="0.005">
									Medium (0.005) ✅
								</SelectItem>
								<SelectItem value="0.001">
									Slow (0.001)
								</SelectItem>
							</SelectContent>
						</Select>
						{isUPU && (
							<div className="text-xs text-gray-500">
								uPU uses direct analytical solution, no learning
								rate needed
							</div>
						)}
					</div>

					{/* Lambda Regularization */}
					<div className="space-y-2">
						<Label className="text-xs">
							Lambda Regularization:
						</Label>
						<Select
							value={modelParams.lambdaReg.toString()}
							onValueChange={(value) =>
								handleParamChange("lambdaReg", Number(value))
							}
							disabled={isUPU}
						>
							<SelectTrigger
								className={`h-8 ${isUPU ? "opacity-50 cursor-not-allowed" : ""}`}
							>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="0">None (0)</SelectItem>
								<SelectItem value="0.0001">
									Subtle (0.0001) ✅
								</SelectItem>
								<SelectItem value="0.001">
									Light (0.001)
								</SelectItem>
								<SelectItem value="0.005">
									Medium (0.005)
								</SelectItem>
								<SelectItem value="0.01">
									Strong (0.01)
								</SelectItem>
								<SelectItem value="0.1">
									Too Strong (0.1)
								</SelectItem>
							</SelectContent>
						</Select>
						{isUPU && (
							<div className="text-xs text-gray-500">
								uPU regularization parameters are automatically
								selected by cross-validation
							</div>
						)}
					</div>

					{/* Training Epochs */}
					<div className="space-y-2">
						<Label className="text-xs">
							Training Epochs: {modelParams.epochs}
						</Label>
						<Slider
							value={[modelParams.epochs]}
							onValueChange={(value) =>
								handleParamChange("epochs", value[0])
							}
							min={50}
							max={500}
							step={10}
							className="w-full"
							disabled={isUPU}
						/>
						<div className="flex justify-between text-xs text-gray-500 mt-1">
							<span>50 (Fast)</span>
							<span>500 (Thorough)</span>
						</div>
						{isUPU && (
							<div className="text-xs text-gray-500">
								uPU uses analytical solution, no iterative
								training needed
							</div>
						)}
					</div>

					{/* Batch Size - 只在 nnPU 時顯示 */}
					{!isUPU && (
						<div className="space-y-2">
							<Label className="text-xs">
								Batch Size: {modelParams.batchSize}
							</Label>
							<Slider
								value={[modelParams.batchSize]}
								onValueChange={(value) =>
									handleParamChange("batchSize", value[0])
								}
								min={32}
								max={512}
								step={32}
								className="w-full"
							/>
							<div className="flex justify-between text-xs text-gray-500 mt-1">
								<span>32 (Small)</span>
								<span>512 (Large)</span>
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
