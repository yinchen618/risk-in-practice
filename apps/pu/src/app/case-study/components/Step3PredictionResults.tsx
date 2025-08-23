import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PYTHON_API_URL } from "@/config/api";
import { useEffect, useState } from "react";
import { PredictionMonitorPanel } from "./experiment/PredictionMonitorPanel";
import { WebSocketCommunication } from "./experiment/WebSocketCommunication";
import type { PredictionState } from "./experiment/hooks/";

interface EvaluationResult {
	id: string;
	name: string;
	scenario_type: string;
	status: string;
	trained_model_id: string;
	test_set_source: {
		type?: string;
		description?: string;
		time_range?: {
			start_date: string;
			end_date: string;
		};
		building_floors?: Record<string, any>;
	};
	evaluation_metrics: {
		accuracy?: number;
		precision?: number;
		recall?: number;
		f1_score?: number;
		[key: string]: any;
	};
	created_at: string;
	completed_at?: string;
	model_name: string;
	model_config: Record<string, any>;
	data_source_config: Record<string, any>;
	predictions_count: number;
	accuracy: number;
	precision: number;
	recall: number;
	f1_score: number;
}

interface Step3PredictionResultsProps {
	selectedRunId?: string;
	trainingStage: "ready" | "training" | "completed" | "predicting";
	predictionState: PredictionState;
	selectedModelId: string;
	setPredictionState: (value: React.SetStateAction<PredictionState>) => void;
	onToastError: (message: string) => void;
	onToastSuccess: (message: string) => void;
	setTrainingStage: React.Dispatch<
		React.SetStateAction<"training" | "predicting" | "completed" | "ready">
	>;
}

export function Step3PredictionResults({
	selectedRunId,
	trainingStage,
	predictionState,
	selectedModelId,
	setPredictionState,
	onToastError,
	onToastSuccess,
	setTrainingStage,
}: Step3PredictionResultsProps) {
	// 評估結果狀態
	const [evaluationResults, setEvaluationResults] = useState<
		EvaluationResult[]
	>([]);
	const [isLoadingEvaluations, setIsLoadingEvaluations] = useState(false);
	const [evaluationsError, setEvaluationsError] = useState<string>("");

	// 載入評估結果數據
	const fetchEvaluationResults = async (modelId: string) => {
		if (!modelId) {
			setEvaluationResults([]);
			return;
		}

		setIsLoadingEvaluations(true);
		setEvaluationsError("");

		try {
			const response = await fetch(
				`${PYTHON_API_URL}/api/v1/models/${modelId}/evaluations`,
			);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			console.log("Fetched evaluation results:", data);

			setEvaluationResults(data.data?.evaluations || []);
		} catch (error) {
			console.error("Error fetching evaluation results:", error);
			setEvaluationsError("Failed to load evaluation results");
			onToastError("Failed to load evaluation results");
		} finally {
			setIsLoadingEvaluations(false);
		}
	};

	// 當 selectedModelId 變化時重新載入評估結果
	useEffect(() => {
		if (selectedModelId) {
			fetchEvaluationResults(selectedModelId);
		} else {
			setEvaluationResults([]);
		}
	}, [selectedModelId]);

	return (
		<div className="space-y-6">
			{/* Step 3 Header */}
			<div className="border-b-2 border-purple-200 pb-2">
				<h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
					<span className="text-purple-600 font-bold">Step 3.</span>
					Prediction Results
				</h3>
			</div>

			{/* Prediction Section */}
			<Card className="border-orange-200 bg-orange-50/50">
				<CardHeader>
					<CardTitle className="text-lg flex items-center gap-2 text-orange-700">
						<div
							className={`w-3 h-3 rounded-full ${
								trainingStage === "predicting"
									? "bg-orange-500 animate-pulse"
									: trainingStage === "completed"
										? "bg-green-500"
										: "bg-gray-400"
							}`}
						/>
						Prediction Section
					</CardTitle>
				</CardHeader>
				<CardContent>
					{trainingStage === "predicting" &&
					predictionState.showPredictionMonitor ? (
						<PredictionMonitorPanel
							predictionProgress={
								predictionState.progress.progress
							}
							currentStep={predictionState.progress.currentStep}
							totalSteps={predictionState.progress.totalSteps}
							stage={predictionState.progress.stage}
							message={predictionState.progress.message}
							onClose={() => {
								setPredictionState((prev: PredictionState) => ({
									...prev,
									isPredicting: false,
									showPredictionMonitor: false,
								}));
							}}
						/>
					) : (
						<div className="text-sm text-gray-600 p-4">
							{trainingStage === "ready" &&
								"Complete training first to start prediction..."}
							{trainingStage === "training" &&
								"Training in progress..."}
							{trainingStage === "completed" &&
								"Ready for prediction!"}
						</div>
					)}
				</CardContent>
			</Card>

			{/* Evaluation Results Table */}
			<Card className="border-emerald-200 bg-emerald-50/50">
				<CardHeader>
					<CardTitle className="text-lg flex items-center gap-2 text-emerald-700">
						<div className="w-3 h-3 rounded-full bg-emerald-500" />
						Evaluation Results
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{/* Evaluation Runs Table */}
						<div className="overflow-x-auto">
							<table className="w-full text-sm">
								<thead>
									<tr className="border-b border-emerald-200">
										<th className="text-left py-2 px-3 font-medium text-emerald-800">
											Evaluation ID
										</th>
										<th className="text-left py-2 px-3 font-medium text-emerald-800">
											Model Used
										</th>
										<th className="text-left py-2 px-3 font-medium text-emerald-800">
											Scenario Type
										</th>
										<th className="text-left py-2 px-3 font-medium text-emerald-800">
											Test Set Source
										</th>
										<th className="text-left py-2 px-3 font-medium text-emerald-800">
											Status
										</th>
										<th className="text-left py-2 px-3 font-medium text-emerald-800">
											Predictions Count
										</th>
										<th className="text-left py-2 px-3 font-medium text-emerald-800">
											Accuracy
										</th>
										<th className="text-left py-2 px-3 font-medium text-emerald-800">
											Completed At
										</th>
									</tr>
								</thead>
								<tbody>
									{isLoadingEvaluations ? (
										<tr>
											<td
												colSpan={8}
												className="py-8 text-center"
											>
												<div className="flex items-center justify-center space-x-2">
													<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-500" />
													<span className="text-gray-600">
														Loading evaluation
														results...
													</span>
												</div>
											</td>
										</tr>
									) : evaluationsError ? (
										<tr>
											<td
												colSpan={8}
												className="py-8 text-center"
											>
												<div className="text-red-600">
													<p className="font-medium">
														Error loading evaluation
														results
													</p>
													<p className="text-sm mt-1">
														{evaluationsError}
													</p>
												</div>
											</td>
										</tr>
									) : evaluationResults.length === 0 ? (
										<tr>
											<td
												colSpan={8}
												className="py-8 text-center text-gray-500"
											>
												{selectedModelId ? (
													<div>
														<p className="font-medium">
															No evaluation
															results found
														</p>
														<p className="text-xs mt-1">
															This model has not
															been evaluated yet.
														</p>
													</div>
												) : (
													<div>
														<p className="font-medium">
															Select a model to
															view evaluation
															results
														</p>
														<p className="text-xs mt-1">
															Choose a trained
															model from the table
															above.
														</p>
													</div>
												)}
											</td>
										</tr>
									) : (
										evaluationResults.map((evaluation) => (
											<tr
												key={evaluation.id}
												className="border-b border-emerald-100 hover:bg-emerald-25"
											>
												<td className="py-2 px-3 font-mono text-xs">
													{evaluation.id.substring(
														0,
														8,
													)}
													...
												</td>
												<td className="py-2 px-3 font-mono text-xs">
													{evaluation.trained_model_id.substring(
														0,
														8,
													)}
													...
												</td>
												<td className="py-2 px-3">
													<span
														className={`px-2 py-1 rounded text-xs font-medium ${
															evaluation.scenario_type ===
															"DISTRIBUTION_SHIFT"
																? "bg-blue-100 text-blue-800"
																: evaluation.scenario_type ===
																		"CONCEPT_DRIFT"
																	? "bg-purple-100 text-purple-800"
																	: evaluation.scenario_type ===
																			"DOMAIN_ADAPTATION"
																		? "bg-orange-100 text-orange-800"
																		: evaluation.scenario_type ===
																				"GENERALIZATION_CHALLENGE"
																			? "bg-green-100 text-green-800"
																			: "bg-gray-100 text-gray-800"
														}`}
													>
														{evaluation.scenario_type.replace(
															"_",
															" ",
														)}
													</span>
												</td>
												<td className="py-2 px-3 text-gray-600">
													<span className="text-xs">
														{evaluation
															.test_set_source
															.description ||
															evaluation
																.test_set_source
																.type ||
															"Test Dataset"}
													</span>
												</td>
												<td className="py-2 px-3">
													<span
														className={`px-2 py-1 rounded text-xs font-medium ${
															evaluation.status ===
															"COMPLETED"
																? "bg-green-100 text-green-800"
																: evaluation.status ===
																		"RUNNING"
																	? "bg-yellow-100 text-yellow-800"
																	: evaluation.status ===
																			"FAILED"
																		? "bg-red-100 text-red-800"
																		: "bg-gray-100 text-gray-800"
														}`}
													>
														{evaluation.status}
													</span>
												</td>
												<td className="py-2 px-3 text-center">
													{evaluation.predictions_count.toLocaleString()}
												</td>
												<td className="py-2 px-3">
													{evaluation.status ===
													"COMPLETED" ? (
														<span className="text-green-600 font-medium">
															{(
																evaluation.accuracy *
																100
															).toFixed(1)}
															%
														</span>
													) : (
														<span className="text-gray-400">
															-
														</span>
													)}
												</td>
												<td className="py-2 px-3 text-gray-600">
													{evaluation.completed_at
														? new Date(
																evaluation.completed_at,
															).toLocaleDateString(
																"zh-TW",
																{
																	year: "numeric",
																	month: "2-digit",
																	day: "2-digit",
																	hour: "2-digit",
																	minute: "2-digit",
																},
															)
														: "-"}
												</td>
											</tr>
										))
									)}
								</tbody>
							</table>
						</div>

						{/* Evaluation Summary */}
						<div className="bg-white rounded border border-emerald-200 p-4">
							<div className="grid grid-cols-3 gap-4 text-sm">
								<div className="text-center">
									<div className="text-2xl font-bold text-emerald-600">
										{evaluationResults.length}
									</div>
									<div className="text-gray-600">
										Total Evaluations
									</div>
								</div>
								<div className="text-center">
									<div className="text-2xl font-bold text-green-600">
										{
											evaluationResults.filter(
												(e) => e.status === "COMPLETED",
											).length
										}
									</div>
									<div className="text-gray-600">
										Completed
									</div>
								</div>
								<div className="text-center">
									<div className="text-2xl font-bold text-orange-600">
										{
											evaluationResults.filter(
												(e) => e.status === "RUNNING",
											).length
										}
									</div>
									<div className="text-gray-600">Running</div>
								</div>
							</div>
							<div className="mt-3 pt-3 border-t border-emerald-200">
								<div className="text-xs text-emerald-600 text-center">
									📊 Each evaluation tests model performance
									on different test sets
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* WebSocket Communication for Prediction */}
			{selectedRunId && (
				<WebSocketCommunication
					selectedRunId={selectedRunId}
					isTraining={false}
					isPredicting={
						trainingStage === "predicting" &&
						predictionState.isPredicting
					}
					socketEndpoint="evaluation-progress"
					onTrainingProgressUpdate={() => {
						// Not handled in Step3 - handled in Step2
					}}
					onSampleCountUpdate={() => {
						// Not handled in Step3 - handled in Step2
					}}
					onModelInfoUpdate={() => {
						// Not handled in Step3 - handled in Step2
					}}
					onHyperparametersUpdate={() => {
						// Not handled in Step3 - handled in Step2
					}}
					onStageUpdate={() => {
						// Not handled in Step3 - handled in Step2
					}}
					onDataSplitInfoUpdate={() => {
						// Not handled in Step3 - handled in Step2
					}}
					onValidationMetricsUpdate={() => {
						// Not handled in Step3 - handled in Step2
					}}
					onTrainingComplete={() => {
						// Not handled in Step3 - handled in Step2
					}}
					onPredictionProgressUpdate={(data) => {
						console.log(
							"Step3 received prediction progress:",
							data,
						);
						setPredictionState((prev: PredictionState) => ({
							...prev,
							progress: {
								progress: data.progress,
								currentStep: data.currentStep || 0,
								totalSteps: data.totalSteps || 100,
								stage: data.stage || "",
								message: data.message || "",
							},
						}));
					}}
					onPredictionComplete={(data) => {
						console.log(
							"Step3 received prediction complete:",
							data,
						);

						if (data.success) {
							setTrainingStage("completed");

							// Update final progress state
							setPredictionState((prev: PredictionState) => ({
								...prev,
								progress: {
									progress: 100,
									currentStep: 100,
									totalSteps: 100,
									stage: "completed",
									message:
										"Prediction completed successfully!",
								},
							}));

							onToastSuccess(
								"Prediction completed! Proceed to Stage 4 to analyze results.",
							);
						} else {
							setTrainingStage("ready");

							const errorMessage = data.error
								? `Prediction failed: ${data.error}`
								: "Prediction failed";
							onToastError(errorMessage);
						}
					}}
					onConnectionStatusChange={(status) => {
						console.log(`Prediction WebSocket status: ${status}`);

						if (
							status === "disconnected" &&
							predictionState.isPredicting
						) {
							console.log(
								"WebSocket disconnected during prediction",
							);
							setPredictionState((prev: PredictionState) => ({
								...prev,
								progress: {
									...prev.progress,
									progress: 100,
									stage: "failed",
									message:
										"Connection lost during prediction",
								},
							}));
						}
					}}
				/>
			)}
		</div>
	);
}
