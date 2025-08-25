"use client";

import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { BarChart } from "lucide-react";
import type { ExperimentHistory, ExperimentRun } from "../types";

interface Stage4ResultsAnalysisProps {
	experimentRun: ExperimentRun;
	history?: ExperimentHistory | null;
}

export function Stage4ResultsAnalysis({ history }: Stage4ResultsAnalysisProps) {
	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<BarChart className="h-5 w-5" />
						Stage 4: Results Analysis & Comparison
					</CardTitle>
					<CardDescription>
						Analyze, compare, visualize, and summarize all
						experiment outcomes
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div className="text-center">
								<div className="text-2xl font-bold">
									{history?.trained_models?.length || 0}
								</div>
								<div className="text-sm text-muted-foreground">
									Trained Models
								</div>
							</div>
							<div className="text-center">
								<div className="text-2xl font-bold">
									{history?.evaluation_runs?.length || 0}
								</div>
								<div className="text-sm text-muted-foreground">
									Evaluation Runs
								</div>
							</div>
							<div className="text-center">
								<div className="text-2xl font-bold text-green-600">
									{history?.evaluation_runs?.filter(
										(run) => run.status === "COMPLETED",
									).length || 0}
								</div>
								<div className="text-sm text-muted-foreground">
									Completed
								</div>
							</div>
						</div>

						{history?.trained_models &&
							history.trained_models.length > 0 && (
								<div>
									<h3 className="font-semibold mb-2">
										Recent Models
									</h3>
									<div className="space-y-2">
										{history.trained_models
											.slice(0, 3)
											.map((model) => (
												<div
													key={model.id}
													className="flex items-center justify-between p-2 border rounded"
												>
													<span className="text-sm">
														{model.name}
													</span>
													<Badge
														variant={
															model.status ===
															"COMPLETED"
																? "default"
																: model.status ===
																		"RUNNING"
																	? "secondary"
																	: "outline"
														}
													>
														{model.status}
													</Badge>
												</div>
											))}
									</div>
								</div>
							)}

						<p className="text-sm text-muted-foreground">
							Results analysis interface will include: -
							Experiment history & comparison table - Multi-run
							comparison mode with side-by-side results - KPI
							cards with key metrics (F1-Score, Precision, Recall,
							Accuracy) - Confusion matrix visualization -
							Insights & export panel
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
