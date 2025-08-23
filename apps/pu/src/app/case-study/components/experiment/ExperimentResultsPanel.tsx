"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { BarChart3, FlaskConical, Target, TrendingUp } from "lucide-react";

interface ExperimentResult {
	id: string;
	timestamp: string;
	experimentType: "In-Domain" | "Cross-Domain";
	config: any;
	metrics: {
		validationF1: number;
		testF1: number;
		testPrecision: number;
		testRecall: number;
	};
	status: "running" | "completed" | "failed";
}

interface ExperimentResultsPanelProps {
	experimentResults: ExperimentResult[];
	selectedExperiments: string[];
	selectedExperimentForDetail: string;
	onExperimentSelect: (experimentId: string) => void;
	onExperimentDetailSelect: (experimentId: string) => void;
	insights: string;
	onInsightsChange: (insights: string) => void;
	onToggleComparison?: () => void;
}

export function ExperimentResultsPanel({
	experimentResults,
	selectedExperiments,
	selectedExperimentForDetail,
	onExperimentSelect,
	onExperimentDetailSelect,
	insights,
	onInsightsChange,
	onToggleComparison,
}: ExperimentResultsPanelProps) {
	const handleExperimentToggle = (
		experimentId: string,
		_checked: boolean,
	) => {
		// Handle experiment selection logic
		onExperimentSelect(experimentId);
	};

	return (
		<div className="space-y-4">
			{/* Experiment History & Comparison Table */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Target className="h-5 w-5" />
							Experiment History & Comparison
						</div>
						{selectedExperiments.length > 0 &&
							onToggleComparison && (
								<Button
									variant="outline"
									size="sm"
									onClick={onToggleComparison}
									className="flex items-center gap-2"
								>
									<BarChart3 className="h-4 w-4" />
									Compare ({selectedExperiments.length})
								</Button>
							)}
					</CardTitle>
				</CardHeader>
				<CardContent>
					{experimentResults.length === 0 ? (
						<div className="text-center py-8 text-muted-foreground">
							<FlaskConical className="h-12 w-12 mx-auto mb-4 opacity-50" />
							<p>No experiments completed yet.</p>
							<p className="text-sm">
								Configure and run your first experiment to see
								results here.
							</p>
						</div>
					) : (
						<div className="space-y-4">
							<div className="overflow-x-auto">
								<table className="w-full text-sm">
									<thead>
										<tr className="border-b">
											<th className="text-left p-2">
												Select
											</th>
											<th className="text-left p-2">
												Exp ID
											</th>
											<th className="text-left p-2">
												Time
											</th>
											<th className="text-left p-2">
												Type
											</th>
											<th className="text-left p-2">
												P/U Source
											</th>
											<th className="text-left p-2">
												Test Source
											</th>
											<th className="text-left p-2">
												Key Params
											</th>
											<th className="text-left p-2">
												Val F1
											</th>
											<th className="text-left p-2">
												Test F1
											</th>
											<th className="text-left p-2">
												Precision
											</th>
											<th className="text-left p-2">
												Recall
											</th>
										</tr>
									</thead>
									<tbody>
										{experimentResults.map((result) => (
											<tr
												key={result.id}
												className={`border-b hover:bg-muted/50 cursor-pointer ${
													selectedExperimentForDetail ===
													result.id
														? "bg-blue-50"
														: ""
												}`}
												onClick={() =>
													onExperimentDetailSelect(
														result.id,
													)
												}
												onKeyDown={(e) => {
													if (
														e.key === "Enter" ||
														e.key === " "
													) {
														onExperimentDetailSelect(
															result.id,
														);
													}
												}}
											>
												<td className="p-2">
													<Checkbox
														checked={selectedExperiments.includes(
															result.id,
														)}
														onCheckedChange={(
															checked,
														) =>
															handleExperimentToggle(
																result.id,
																checked as boolean,
															)
														}
														onClick={(e) =>
															e.stopPropagation()
														}
													/>
												</td>
												<td className="p-2 font-mono text-xs">
													{result.id.slice(-8)}
												</td>
												<td className="p-2 text-xs">
													{new Date(
														result.timestamp,
													).toLocaleString()}
												</td>
												<td className="p-2">
													<span
														className={`px-2 py-1 text-xs rounded ${
															result.experimentType ===
															"In-Domain"
																? "bg-green-100 text-green-700"
																: "bg-blue-100 text-blue-700"
														}`}
													>
														{result.experimentType}
													</span>
												</td>
												<td className="p-2 text-xs">
													{result.config
														?.positiveSource
														?.selectedFloorsByBuilding
														? Object.entries(
																result.config
																	.positiveSource
																	.selectedFloorsByBuilding,
															)
																.filter(
																	([
																		,
																		floors,
																	]) =>
																		(
																			floors as string[]
																		)
																			.length >
																		0,
																)
																.map(
																	([
																		building,
																		floors,
																	]) =>
																		`${building}:${(floors as string[]).join(",")}`,
																)
																.join("; ") ||
															"N/A"
														: "N/A"}
												</td>
												<td className="p-2 text-xs">
													{result.config?.testSource
														?.selectedFloorsByBuilding
														? Object.entries(
																result.config
																	.testSource
																	.selectedFloorsByBuilding,
															)
																.filter(
																	([
																		,
																		floors,
																	]) =>
																		(
																			floors as string[]
																		)
																			.length >
																		0,
																)
																.map(
																	([
																		building,
																		floors,
																	]) =>
																		`${building}:${(floors as string[]).join(",")}`,
																)
																.join("; ") ||
															"N/A"
														: "N/A"}
												</td>
												<td className="p-2 text-xs">
													λ=
													{result.config?.modelParams
														?.lambdaReg || "N/A"}
													, LR=
													{result.config?.modelParams
														?.learningRate || "N/A"}
												</td>
												<td className="p-2 font-mono">
													{result.metrics.validationF1.toFixed(
														3,
													)}
												</td>
												<td className="p-2 font-mono font-bold">
													{result.metrics.testF1.toFixed(
														3,
													)}
												</td>
												<td className="p-2 font-mono">
													{result.metrics.testPrecision.toFixed(
														3,
													)}
												</td>
												<td className="p-2 font-mono">
													{result.metrics.testRecall.toFixed(
														3,
													)}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Insights & Conclusions */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<TrendingUp className="h-5 w-5" />
						Insights & Conclusions
					</CardTitle>
				</CardHeader>
				<CardContent>
					<Textarea
						placeholder="Record your findings and insights from the experiments. For example: 'When Lambda increases, Precision improves but Recall decreases' or 'Cross-Domain testing shows 25% F1-Score drop compared to In-Domain'..."
						value={insights}
						onChange={(e) => onInsightsChange(e.target.value)}
						className="min-h-[100px]"
					/>
				</CardContent>
			</Card>
		</div>
	);
}
