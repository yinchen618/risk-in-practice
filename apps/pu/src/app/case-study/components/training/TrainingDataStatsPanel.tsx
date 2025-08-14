"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database } from "lucide-react";

interface TrainingDataStats {
	positiveSamples: number;
	unlabeledSamples: number;
}

interface TrainingDataStatsPanelProps {
	trainingDataStats: TrainingDataStats | null;
	isLoading?: boolean;
}

export function TrainingDataStatsPanel({
	trainingDataStats,
	isLoading = false,
}: TrainingDataStatsPanelProps) {
	if (isLoading || !trainingDataStats) {
		return (
			<Card>
				<CardHeader className="pb-3">
					<CardTitle className="flex items-center gap-2 text-base">
						<Database className="h-4 w-4" />
						Training Data
					</CardTitle>
				</CardHeader>
				<CardContent className="pt-0">
					<div className="flex items-center justify-center h-16">
						<div className="text-center space-y-1">
							<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto" />
							<p className="text-xs text-gray-600">Loading...</p>
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader className="pb-3">
				<CardTitle className="flex items-center gap-2 text-base">
					<Database className="h-4 w-4" />
					Training Data
				</CardTitle>
			</CardHeader>
			<CardContent className="pt-0 space-y-2">
				<div className="grid grid-cols-2 gap-2">
					<div className="flex flex-col items-center p-2 bg-green-50 rounded border border-green-200">
						<span className="text-xs text-green-700 font-medium">
							Positive (P)
						</span>
						<Badge
							variant="secondary"
							className="bg-green-100 text-green-800 text-xs"
						>
							{trainingDataStats.positiveSamples.toLocaleString()}
						</Badge>
					</div>
					<div className="flex flex-col items-center p-2 bg-gray-50 rounded border border-gray-200">
						<span className="text-xs text-gray-700 font-medium">
							Unlabeled (U)
						</span>
						<Badge
							variant="secondary"
							className="bg-gray-100 text-gray-800 text-xs"
						>
							{trainingDataStats.unlabeledSamples.toLocaleString()}
						</Badge>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
