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
import type { ExperimentRun } from "../types";

interface Stage3TrainingWorkbenchProps {
	experimentRun: ExperimentRun;
	onComplete: () => void;
}

export function Stage3TrainingWorkbench({
	experimentRun,
}: Stage3TrainingWorkbenchProps) {
	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<BarChart className="h-5 w-5" />
						Stage 3: Training & Evaluation Workbench
					</CardTitle>
					<CardDescription>
						Configure and execute model training and evaluation as
						two distinct, monitorable tasks
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<h3 className="font-semibold mb-2">
									Source Distribution Info
								</h3>
								<div className="space-y-1 text-sm">
									<div>
										Positive Labels:{" "}
										<Badge variant="outline">
											{experimentRun.positive_label_count ||
												0}
										</Badge>
									</div>
									<div>
										Negative Labels:{" "}
										<Badge variant="outline">
											{experimentRun.negative_label_count ||
												0}
										</Badge>
									</div>
									<div>
										Total Samples:{" "}
										<Badge variant="outline">
											{experimentRun.candidate_count || 0}
										</Badge>
									</div>
								</div>
							</div>

							<div>
								<h3 className="font-semibold mb-2">
									Experiment Scenarios
								</h3>
								<div className="space-y-1 text-sm text-muted-foreground">
									<div>• ERM Baseline</div>
									<div>• Generalization Challenge</div>
									<div>• Domain Adaptation</div>
								</div>
							</div>
						</div>

						<p className="text-sm text-muted-foreground">
							Training workbench interface will include: - Left
							panel: Experiment setup with scenario selection and
							configuration - Right panel: Task monitoring center
							with separate tabs for training and evaluation logs
							- Real-time WebSocket connections for live progress
							monitoring
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
