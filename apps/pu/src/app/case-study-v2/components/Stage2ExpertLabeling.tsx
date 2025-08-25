"use client";

import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Play } from "lucide-react";
import type { ExperimentRun } from "../types";

interface Stage2ExpertLabelingProps {
	experimentRun: ExperimentRun;
	onComplete: () => void;
}

export function Stage2ExpertLabeling({
	experimentRun,
}: Stage2ExpertLabelingProps) {
	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Play className="h-5 w-5" />
						Stage 2: Expert Labeling
					</CardTitle>
					<CardDescription>
						Review candidates generated in Stage 1 and establish the
						ground truth
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div className="text-center">
								<div className="text-2xl font-bold">
									{experimentRun.candidate_count || 0}
								</div>
								<div className="text-sm text-muted-foreground">
									Total Candidates
								</div>
							</div>
							<div className="text-center">
								<div className="text-2xl font-bold text-green-600">
									{experimentRun.positive_label_count || 0}
								</div>
								<div className="text-sm text-muted-foreground">
									Confirmed Anomalies
								</div>
							</div>
							<div className="text-center">
								<div className="text-2xl font-bold text-blue-600">
									{experimentRun.negative_label_count || 0}
								</div>
								<div className="text-sm text-muted-foreground">
									Confirmed Normal
								</div>
							</div>
						</div>

						<div className="flex items-center justify-between">
							<span>Labeling Progress:</span>
							<Badge variant="outline">
								{(experimentRun.positive_label_count || 0) +
									(experimentRun.negative_label_count ||
										0)}{" "}
								/ {experimentRun.candidate_count || 0} labeled
							</Badge>
						</div>

						<p className="text-sm text-muted-foreground">
							Expert labeling interface will be implemented here
							with three-column layout: candidate list,
							time-series visualization, and labeling tools.
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
