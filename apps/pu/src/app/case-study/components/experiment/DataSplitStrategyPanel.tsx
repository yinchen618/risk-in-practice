"use client";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { BarChart3 } from "lucide-react";

interface DataSplitStrategy {
	trainRatio: number;
	validationRatio: number;
	testRatio: number;
}

interface DataSplitStrategyPanelProps {
	splitStrategy: DataSplitStrategy;
	onChange: (splitStrategy: DataSplitStrategy) => void;
}

export function DataSplitStrategyPanel({
	splitStrategy,
	onChange,
}: DataSplitStrategyPanelProps) {
	const handleRatioChange = (
		type: keyof DataSplitStrategy,
		value: number,
	) => {
		if (type === "testRatio") {
			// Test ratio is auto-calculated, don't allow manual changes
			return;
		}

		const newSplitStrategy = {
			...splitStrategy,
			[type]: value,
		};

		// Auto-calculate test ratio to make total = 100%
		const autoTestRatio =
			100 -
			newSplitStrategy.trainRatio -
			newSplitStrategy.validationRatio;

		// Ensure test ratio is within reasonable bounds (at least 10%, at most 40%)
		const clampedTestRatio = Math.max(10, Math.min(40, autoTestRatio));

		onChange({
			...newSplitStrategy,
			testRatio: clampedTestRatio,
		});
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-2">
				<BarChart3 className="h-4 w-4" />
				<h4 className="font-medium">Data Split Strategy</h4>
			</div>
			<div className="space-y-3">
				<div className="grid grid-cols-3 gap-3">
					<div>
						<Label className="text-xs">Train</Label>
						<div className="flex items-center space-x-2">
							<Slider
								value={[splitStrategy.trainRatio]}
								onValueChange={([value]) =>
									handleRatioChange("trainRatio", value)
								}
								max={80}
								min={50}
								step={5}
								className="flex-1"
							/>
							<span className="text-xs w-8">
								{splitStrategy.trainRatio}%
							</span>
						</div>
					</div>
					<div>
						<Label className="text-xs">Validation</Label>
						<div className="flex items-center space-x-2">
							<Slider
								value={[splitStrategy.validationRatio]}
								onValueChange={([value]) =>
									handleRatioChange("validationRatio", value)
								}
								max={30}
								min={10}
								step={5}
								className="flex-1"
							/>
							<span className="text-xs w-8">
								{splitStrategy.validationRatio}%
							</span>
						</div>
					</div>
					<div>
						<Label className="text-xs">Test (Auto)</Label>
						<div className="flex items-center space-x-2">
							<div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
								<div
									className="h-full bg-slate-500 transition-all duration-300"
									style={{
										width: `${(splitStrategy.testRatio / 40) * 100}%`,
									}}
								/>
							</div>
							<span className="text-xs w-8">
								{splitStrategy.testRatio}%
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
