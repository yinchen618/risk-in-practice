"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

interface SamplePoint {
	x: number;
	y: number;
	id: string;
}

interface SampleDistribution {
	pSamples: SamplePoint[];
	uSamples: SamplePoint[];
}

interface SampleDistributionPanelProps {
	sampleDistribution: SampleDistribution | null;
	isLoading?: boolean;
	onRetryLoad?: () => void;
}

export function SampleDistributionPanel({
	sampleDistribution,
	isLoading = false,
	onRetryLoad,
}: SampleDistributionPanelProps) {
	if (isLoading) {
		return (
			<Card className="h-full">
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-lg">
						<BarChart3 className="h-5 w-5" />
						P/U Sample Distribution (2D Projection)
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-center justify-center h-64">
						<div className="text-center space-y-2">
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
							<p className="text-sm text-gray-600">
								Generating visualization...
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	if (!sampleDistribution) {
		return (
			<Card className="h-full">
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-lg">
						<BarChart3 className="h-5 w-5" />
						P/U Sample Distribution (2D Projection)
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-center justify-center h-64">
						<div className="text-center space-y-2">
							<BarChart3 className="h-12 w-12 text-gray-400 mx-auto" />
							<p className="text-sm text-gray-600">
								No visualization data available
							</p>
							{onRetryLoad && (
								<Button
									onClick={onRetryLoad}
									variant="outline"
									size="sm"
								>
									Retry Loading
								</Button>
							)}
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="h-full">
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-lg">
					<BarChart3 className="h-5 w-5" />
					P/U Sample Distribution (2D Projection)
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{/* SVG 散點圖 */}
					<div className="border rounded-lg p-4 bg-gray-50">
						<svg
							width="100%"
							height="300"
							viewBox="0 0 400 300"
							className="border bg-white rounded"
							role="img"
							aria-label="Sample distribution scatter plot"
						>
							{/* 繪製 U 樣本 (灰色) */}
							{sampleDistribution.uSamples.map((point, idx) => (
								<circle
									key={`u-${idx}`}
									cx={point.x * 380 + 20}
									cy={point.y * 280 + 20}
									r="2"
									fill="#9CA3AF"
									opacity="0.6"
									className="hover:opacity-100 cursor-pointer"
								>
									<title>Unlabeled Sample {point.id}</title>
								</circle>
							))}
							{/* 繪製 P 樣本 (綠色) */}
							{sampleDistribution.pSamples.map((point, idx) => (
								<circle
									key={`p-${idx}`}
									cx={point.x * 380 + 20}
									cy={point.y * 280 + 20}
									r="3"
									fill="#10B981"
									opacity="0.8"
									className="hover:opacity-100 cursor-pointer"
								>
									<title>Positive Sample {point.id}</title>
								</circle>
							))}
						</svg>
					</div>
					{/* 圖例 */}
					<div className="flex items-center gap-6 text-sm">
						<div className="flex items-center gap-2">
							<div className="w-3 h-3 bg-green-500 rounded-full" />
							<span>Positive Samples (P)</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-3 h-3 bg-gray-400 rounded-full" />
							<span>Unlabeled Samples (U)</span>
						</div>
					</div>
					<Alert>
						<BarChart3 className="h-4 w-4" />
						<AlertDescription>
							This 2D projection shows the distribution of your
							training samples in feature space. Green dots are
							confirmed positive samples, gray dots are unlabeled
							samples that may contain both positive and negative
							examples.
						</AlertDescription>
					</Alert>
				</div>
			</CardContent>
		</Card>
	);
}
