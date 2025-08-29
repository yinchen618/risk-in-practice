"use client";

import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { GitCompare } from "lucide-react";
import { useMemo, useState } from "react";
import type { EvaluationRun, ExperimentHistory, TrainedModel } from "../types";

// 內聯組件：指標比較圖表
const MetricsComparisonView = ({
	selectedEvaluations,
}: {
	selectedEvaluations: {
		[key: string]: EvaluationRun | TrainedModel | undefined;
	};
}) => {
	const validEvaluations = Object.entries(selectedEvaluations).filter(
		([, evaluation]) => {
			// 檢查 evaluation_metrics 或 training_metrics
			const hasEvaluationMetrics =
				(evaluation as any)?.evaluationMetrics ||
				(evaluation as any)?.evaluation_metrics;
			if (hasEvaluationMetrics) {
				return true;
			}
			// if ("training_metrics" in (evaluation || {})) {
			// 	const metrics = (evaluation as TrainedModel)?.training_metrics;
			// 	try {
			// 		return metrics ? JSON.parse(metrics) : null;
			// 	} catch {
			// 		return null;
			// 	}
			// }
			return false;
		},
	);

	if (validEvaluations.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Performance Metrics Comparison</CardTitle>
					<CardDescription>
						Compare key performance metrics across selected
						scenarios
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex items-center justify-center h-64 text-muted-foreground">
						No evaluation data available for comparison
					</div>
				</CardContent>
			</Card>
		);
	}

	const scenarioLabels = {
		ERM_BASELINE: "ERM Baseline",
		GENERALIZATION_CHALLENGE: "Generalization Challenge",
		DOMAIN_ADAPTATION: "Domain Adaptation",
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Performance Metrics Comparison</CardTitle>
				<CardDescription>
					Compare key performance metrics across selected scenarios
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-6">
					{/* 指標卡片 - 只保留 F1 Score, Precision, Recall */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						{["f1_score", "precision", "recall"].map((metric) => (
							<div key={metric} className="space-y-3">
								<h4 className="font-medium capitalize text-center">
									{metric.replace("_", " ")}
								</h4>
								{validEvaluations.map(
									([scenario, evaluation]) => {
										if (!evaluation) {
											return null;
										}

										let value: number | undefined;

										// 從 evaluationMetrics/evaluation_metrics 或 training_metrics 中獲取值
										const evaluationMetrics =
											(evaluation as any)
												.evaluationMetrics ||
											(evaluation as any)
												.evaluation_metrics;
										if (evaluationMetrics) {
											value = evaluationMetrics[
												metric
											] as number;
										} else if (
											"training_metrics" in evaluation
										) {
											const trainedModel =
												evaluation as TrainedModel;
											try {
												const metrics =
													trainedModel.training_metrics
														? JSON.parse(
																trainedModel.training_metrics,
															)
														: null;
												value = metrics?.[metric];
											} catch {
												value = undefined;
											}
										}

										if (value === undefined) {
											return null;
										}

										const label =
											scenarioLabels[
												scenario as keyof typeof scenarioLabels
											];
										return (
											<div
												key={scenario}
												className="text-center p-3 border rounded"
											>
												<div className="text-sm text-muted-foreground mb-1">
													{label}
												</div>
												<div className="text-xl font-bold">
													{(value * 100).toFixed(1)}%
												</div>
											</div>
										);
									},
								)}
							</div>
						))}
					</div>

					{/* 詳細指標表格 */}
					<div className="overflow-x-auto">
						<table className="w-full border-collapse border border-gray-200">
							<thead>
								<tr className="bg-gray-50">
									<th className="border border-gray-200 px-3 py-2 text-left">
										Scenario
									</th>
									<th className="border border-gray-200 px-3 py-2 text-center">
										F1 Score
									</th>
									<th className="border border-gray-200 px-3 py-2 text-center">
										Precision
									</th>
									<th className="border border-gray-200 px-3 py-2 text-center">
										Recall
									</th>
								</tr>
							</thead>
							<tbody>
								{validEvaluations.map(
									([scenario, evaluation]) => {
										const label =
											scenarioLabels[
												scenario as keyof typeof scenarioLabels
											];
										return (
											<tr key={scenario}>
												<td className="border border-gray-200 px-3 py-2 font-medium">
													{label}
												</td>
												{[
													"f1_score",
													"precision",
													"recall",
												].map((metric) => {
													let value:
														| number
														| undefined;

													const evaluationMetrics =
														(evaluation as any)
															?.evaluationMetrics ||
														(evaluation as any)
															?.evaluation_metrics;
													if (evaluationMetrics) {
														value =
															evaluationMetrics[
																metric
															] as number;
													} else if (
														"training_metrics" in
														(evaluation || {})
													) {
														const trainedModel =
															evaluation as TrainedModel;
														try {
															const metrics =
																trainedModel.training_metrics
																	? JSON.parse(
																			trainedModel.training_metrics,
																		)
																	: null;
															value =
																metrics?.[
																	metric
																];
														} catch {
															value = undefined;
														}
													}

													return (
														<td
															key={metric}
															className="border border-gray-200 px-3 py-2 text-center"
														>
															{value
																? `${(value * 100).toFixed(2)}%`
																: "—"}
														</td>
													);
												})}
											</tr>
										);
									},
								)}
							</tbody>
						</table>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

// 主要組件
export default function Stage4ResultsAnalysis({
	experiments,
}: {
	experiments: ExperimentHistory[];
}) {
	const [selectedEvaluations, setSelectedEvaluations] = useState<{
		[key: string]: EvaluationRun | TrainedModel | undefined;
	}>({
		ERM_BASELINE: undefined,
		GENERALIZATION_CHALLENGE: undefined,
		DOMAIN_ADAPTATION: undefined,
	});

	// 獲取每個情境的評估運行或訓練模型
	const evaluationsByScenario = useMemo(() => {
		// console.log("Processing experiments:", experiments);
		const scenarioMap: { [key: string]: (EvaluationRun | TrainedModel)[] } =
			{
				ERM_BASELINE: [],
				GENERALIZATION_CHALLENGE: [],
				DOMAIN_ADAPTATION: [],
			};

		experiments.forEach((experiment, index) => {
			// console.log(`Experiment ${index}:`, experiment);

			// 對於 ERM_BASELINE 和 DOMAIN_ADAPTATION，使用 trained_models
			const trainedModels = experiment.trained_models;
			trainedModels?.forEach((model, modelIndex) => {
				// console.log(
				// 	`Trained model ${modelIndex} in experiment ${index}:`,
				// 	model,
				// );
				// 使用型別斷言來存取 scenario_type 欄位
				const modelScenarioType = (model as any).scenario_type;
				// console.log(`Model scenario type: "${modelScenarioType}"`);

				if (
					(modelScenarioType === "ERM_BASELINE" ||
						modelScenarioType === "DOMAIN_ADAPTATION") &&
					scenarioMap[modelScenarioType]
				) {
					// console.log(`Adding trained model to ${modelScenarioType}`);
					scenarioMap[modelScenarioType].push(model);
				}
			});

			// 對於 GENERALIZATION_CHALLENGE，使用 evaluation_runs
			const evaluationRuns = experiment.evaluation_runs;
			evaluationRuns?.forEach((evaluation, evalIndex) => {
				// console.log(
				// 	`Evaluation ${evalIndex} in experiment ${index}:`,
				// 	evaluation,
				// );
				// 使用型別斷言來存取 scenario_type 欄位
				const evaluationScenarioType = (evaluation as any)
					.scenario_type;
				// console.log(`Scenario type: "${evaluationScenarioType}"`);

				if (
					evaluationScenarioType === "GENERALIZATION_CHALLENGE" &&
					scenarioMap.GENERALIZATION_CHALLENGE
				) {
					// console.log(
					// 	"Adding evaluation to GENERALIZATION_CHALLENGE",
					// );
					scenarioMap.GENERALIZATION_CHALLENGE.push(evaluation);
				}
			});
		});

		// console.log("Final scenarioMap:", scenarioMap);
		return scenarioMap;
	}, [experiments]);

	// 處理選擇變更
	const handleSelectionChange = (scenario: string, itemId: string) => {
		const item = evaluationsByScenario[scenario]?.find(
			(item) => item.id === itemId,
		);
		setSelectedEvaluations((prev) => ({
			...prev,
			[scenario]: item,
		}));
	};

	// 統計信息
	const stats = useMemo(() => {
		const selectedCount =
			Object.values(selectedEvaluations).filter(Boolean).length;
		const totalAvailable = Object.values(evaluationsByScenario).reduce(
			(sum, evals) => sum + evals.length,
			0,
		);

		return { selectedCount, totalAvailable };
	}, [selectedEvaluations, evaluationsByScenario]);

	const scenarioLabels = {
		ERM_BASELINE: "ERM Baseline",
		GENERALIZATION_CHALLENGE: "Generalization Challenge",
		DOMAIN_ADAPTATION: "Domain Adaptation",
	};

	console.log("evaluationsByScenario", evaluationsByScenario);
	// console.log("experiments data:", experiments);
	// console.log("experiments[0]:", experiments[0]);

	return (
		<div className="space-y-6">
			{/* 標題和統計 */}
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold tracking-tight">
						Results Analysis
					</h2>
					<p className="text-muted-foreground">
						Compare evaluation results across different scenarios
					</p>
				</div>
				<div className="text-right">
					<div className="text-sm text-muted-foreground">
						{stats.selectedCount} of 3 scenarios selected
					</div>
					<div className="text-xs text-muted-foreground">
						{stats.totalAvailable} total evaluations available
					</div>
				</div>
			</div>

			{/* 情境選擇器 */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<GitCompare className="h-5 w-5" />
						Scenario Selection
					</CardTitle>
					<CardDescription>
						Select models or evaluation runs for each scenario to
						compare their performance
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						{Object.entries(scenarioLabels).map(
							([scenario, label]) => (
								<div key={scenario} className="space-y-2">
									<div className="text-sm font-medium">
										{label}
									</div>
									<Select
										value={
											selectedEvaluations[scenario]?.id ||
											""
										}
										onValueChange={(value) =>
											handleSelectionChange(
												scenario,
												value,
											)
										}
									>
										<SelectTrigger className="w-full">
											<SelectValue
												placeholder={`Select ${label}`}
											/>
										</SelectTrigger>
										<SelectContent>
											{evaluationsByScenario[
												scenario
											]?.map((item) => {
												console.log("item:", item);
												// 檢查是 TrainedModel 還是 EvaluationRun
												// 根據實際資料結構檢測
												const isTrainedModel =
													"training_metrics" in
														item &&
													"model_config" in item;
												const isEvaluationRun =
													"testSetSource" in item ||
													"test_set_source" in item;

												let displayText = "";
												let badgeText = "";

												if (isTrainedModel) {
													const model =
														item as TrainedModel;
													displayText = model.name; // ||
													// `Model ${model.id.slice(-8)}`;
													// 嘗試從 training_metrics 獲取 F1 分數
													// try {
													// 	const metrics =
													// 		model.training_metrics
													// 			? JSON.parse(
													// 					model.training_metrics,
													// 				)
													// 			: null;
													// 	if (metrics?.f1_score) {
													// 		badgeText = `F1: ${(metrics.f1_score * 100).toFixed(1)}%`;
													// 	}
													// } catch {
													// 	// 忽略解析錯誤
													// }
												} else if (isEvaluationRun) {
													const evaluation =
														item as EvaluationRun;
													// displayText = `Run ${evaluation.id.slice(-8)}`;
													displayText = `${evaluation.name}`;
													// 檢查 evaluationMetrics 或 evaluation_metrics
													const metrics =
														(evaluation as any)
															.evaluationMetrics ||
														(evaluation as any)
															.evaluation_metrics;
													if (metrics?.f1_score) {
														badgeText = `F1: ${(metrics.f1_score * 100).toFixed(1)}%`;
													}
												}

												return (
													<SelectItem
														key={item.id}
														value={item.id}
													>
														<div className="flex items-center justify-between w-full">
															<span className="truncate">
																{/* {displayText} */}
																{item.name}
															</span>
															{badgeText && (
																<Badge
																	variant="outline"
																	className="ml-2 text-xs"
																>
																	{badgeText}
																</Badge>
															)}
														</div>
													</SelectItem>
												);
											})}
										</SelectContent>
									</Select>
									<div className="text-xs text-muted-foreground">
										{evaluationsByScenario[scenario]
											?.length || 0}{" "}
										items available
									</div>
								</div>
							),
						)}
					</div>
				</CardContent>
			</Card>

			{/* 比較圖表 */}
			{stats.selectedCount > 0 ? (
				<div className="space-y-4">
					<MetricsComparisonView
						selectedEvaluations={selectedEvaluations}
					/>
				</div>
			) : (
				<Card>
					<CardContent className="flex items-center justify-center h-64">
						<div className="text-center space-y-2">
							<GitCompare className="h-12 w-12 text-muted-foreground mx-auto" />
							<h3 className="text-lg font-medium">
								No Scenarios Selected
							</h3>
							<p className="text-muted-foreground">
								Please select at least one model or evaluation
								run from the scenarios above to view
								comparisons.
							</p>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
