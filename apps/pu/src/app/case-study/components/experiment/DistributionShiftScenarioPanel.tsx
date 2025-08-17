"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Building2 } from "lucide-react";

export type DistributionShiftScenario =
	| "ERM_BASELINE"
	| "GENERALIZATION_CHALLENGE"
	| "DOMAIN_ADAPTATION";

interface DistributionShiftScenarioPanelProps {
	value: DistributionShiftScenario;
	onChange: (value: DistributionShiftScenario) => void;
}

export function DistributionShiftScenarioPanel({
	value,
	onChange,
}: DistributionShiftScenarioPanelProps) {
	return (
		<div className="space-y-4">
			<div className="flex items-center gap-2">
				<Building2 className="h-4 w-4" />
				<h4 className="font-medium">Distribution Shift Scenario</h4>
			</div>

			<RadioGroup
				value={value}
				onValueChange={(value) =>
					onChange(value as DistributionShiftScenario)
				}
				className="space-y-3 pl-4"
			>
				<div className="flex items-center space-x-2">
					<RadioGroupItem value="ERM_BASELINE" id="erm-baseline" />
					<Label htmlFor="erm-baseline" className="cursor-pointer">
						ERM Baseline
					</Label>
				</div>
				<div className="flex items-center space-x-2">
					<RadioGroupItem
						value="GENERALIZATION_CHALLENGE"
						id="generalization-challenge"
					/>
					<Label
						htmlFor="generalization-challenge"
						className="cursor-pointer"
					>
						Generalization Challenge
					</Label>
				</div>
				<div className="flex items-center space-x-2">
					<RadioGroupItem
						value="DOMAIN_ADAPTATION"
						id="domain-adaptation"
					/>
					<Label
						htmlFor="domain-adaptation"
						className="cursor-pointer"
					>
						Domain Adaptation
					</Label>
				</div>
			</RadioGroup>
		</div>
	);
}
