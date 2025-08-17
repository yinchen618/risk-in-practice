"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Database, Play, Target, Zap } from "lucide-react";
import type { DistributionShiftScenario } from "./DistributionShiftScenarioPanel";

interface TrainingControlPanelProps {
	isValid: boolean;
	trainingStage: "ready" | "training" | "completed" | "failed" | "predicting";
	onStartTraining: () => void;
	onReset: () => void;
	wsLogs: string[];
	scenario?: DistributionShiftScenario;
}

export function TrainingControlPanel({
	isValid,
	trainingStage,
	onStartTraining,
	onReset,
	wsLogs,
	scenario = "ERM_BASELINE",
}: TrainingControlPanelProps) {
	const getButtonText = () => {
		if (trainingStage === "training") {
			switch (scenario) {
				case "ERM_BASELINE":
					return "Training & Predicting...";
				case "GENERALIZATION_CHALLENGE":
					return "Evaluating Model...";
				case "DOMAIN_ADAPTATION":
					return "Adapting Model...";
				default:
					return "Processing...";
			}
		}

		switch (scenario) {
			case "ERM_BASELINE":
				return "Start ERM Baseline Training & Prediction";
			case "GENERALIZATION_CHALLENGE":
				return "Start Generalization Evaluation";
			case "DOMAIN_ADAPTATION":
				return "Start Domain Adaptation";
			default:
				return "Start Training & Analysis";
		}
	};

	const getIcon = () => {
		switch (scenario) {
			case "ERM_BASELINE":
				return <Database className="h-4 w-4 mr-2" />;
			case "GENERALIZATION_CHALLENGE":
				return <Target className="h-4 w-4 mr-2" />;
			case "DOMAIN_ADAPTATION":
				return <Zap className="h-4 w-4 mr-2" />;
			default:
				return <Play className="h-4 w-4 mr-2" />;
		}
	};

	const getDescription = () => {
		switch (scenario) {
			case "ERM_BASELINE":
				return "Train a model using positive samples and unlabeled samples from the same distribution";
			case "GENERALIZATION_CHALLENGE":
				return "Evaluate pre-trained model performance on target domain without adaptation";
			case "DOMAIN_ADAPTATION":
				return "Train a model with positive samples from source domain and unlabeled samples from target domain";
			default:
				return "";
		}
	};

	return (
		<div className="space-y-4">
			{/* Scenario Description */}
			<div className="p-3 bg-gray-50 rounded-lg">
				<div className="text-sm text-gray-700">{getDescription()}</div>
			</div>

			{/* Action Buttons */}
			<div className="flex gap-2">
				<Button
					onClick={onStartTraining}
					disabled={!isValid || trainingStage === "training"}
					className="flex-1"
				>
					{getIcon()}
					{getButtonText()}
				</Button>
				{trainingStage !== "ready" && (
					<Button variant="outline" onClick={onReset} size="sm">
						Reset
					</Button>
				)}
			</div>

			{/* Training Progress */}
			{trainingStage === "training" && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Zap className="h-5 w-5" />
							{scenario === "GENERALIZATION_CHALLENGE"
								? "Evaluation"
								: "Training"}{" "}
							Progress
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div className="flex items-center gap-2">
								<div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
								<span className="text-sm">
									{scenario === "GENERALIZATION_CHALLENGE"
										? "Evaluation in progress..."
										: "Training in progress..."}
								</span>
							</div>
							{wsLogs.length > 0 && (
								<div>
									<Label className="text-xs">
										{scenario === "GENERALIZATION_CHALLENGE"
											? "Evaluation"
											: "Training"}{" "}
										Logs
									</Label>
									<Textarea
										value={wsLogs.join("\n")}
										readOnly
										className="h-32 text-xs font-mono"
									/>
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
