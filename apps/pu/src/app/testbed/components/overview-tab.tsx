import { OverviewDetails } from "./overview-details";
import { OverviewMetrics } from "./overview-metrics";
import { ResearchValue } from "./research-value";

export function OverviewTab() {
	return (
		<div className="space-y-8">
			{/* Key Metrics */}
			<OverviewMetrics />

			{/* Bottom Section */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* Left Column */}
				<OverviewDetails />

				{/* Right Column - Research Value */}
				<ResearchValue />
			</div>
		</div>
	);
}
