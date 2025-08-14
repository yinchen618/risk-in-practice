"use client";

// This component is now replaced by PredictionConfigurationPanel
// Keeping this for backward compatibility

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PredictionConfig {
	start: string;
	end: string;
}

interface PredictionConfigPanelProps {
	config: PredictionConfig;
	onConfigChange: (config: Partial<PredictionConfig>) => void;
}

export function PredictionConfigPanel({
	config,
	onConfigChange,
}: PredictionConfigPanelProps) {
	return (
		<div className="space-y-4">
			<h4 className="font-medium text-slate-800">
				Legacy Prediction Settings
			</h4>
			<div className="text-sm text-slate-500 mb-4">
				This component has been replaced by PredictionConfigurationPanel
			</div>
			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label>Prediction Start</Label>
					<Input
						type="date"
						value={config.start}
						onChange={(e) =>
							onConfigChange({ start: e.target.value })
						}
					/>
				</div>
				<div className="space-y-2">
					<Label>Prediction End</Label>
					<Input
						type="date"
						value={config.end}
						onChange={(e) =>
							onConfigChange({ end: e.target.value })
						}
					/>
				</div>
			</div>
		</div>
	);
}
