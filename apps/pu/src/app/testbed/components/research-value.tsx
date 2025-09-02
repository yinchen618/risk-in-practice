import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

export function ResearchValue() {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Lightbulb className="h-5 w-5" />
					Unique Dataset Characteristics
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-3">
				<div className="flex items-start gap-3">
					<div className="w-2 h-2 bg-slate-600 rounded-full mt-2" />
					<div>
						<p className="font-medium">
							Data duration: Long-term longitudinal data reveals
							seasonal and behavioral shifts
						</p>
					</div>
				</div>
				<div className="flex items-start gap-3">
					<div className="w-2 h-2 bg-slate-600 rounded-full mt-2" />
					<div>
						<p className="font-medium">
							Measurement setup: Dual-meter design decouples
							whole-household consumption from high-power
							appliance usage
						</p>
					</div>
				</div>
				<div className="flex items-start gap-3">
					<div className="w-2 h-2 bg-slate-600 rounded-full mt-2" />
					<div>
						<p className="font-medium">
							Data quality: Natural, unscripted behavioral
							patterns from real-world residential environment
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
