import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Database, Gauge, TrendingUp } from "lucide-react";

export function OverviewMetrics() {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			<Card className="border-l-4 border-l-slate-600">
				<CardHeader className="pb-2">
					<CardTitle className="text-lg flex items-center gap-2">
						<Building className="h-5 w-5 text-slate-600" />
						Total Apartments
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-3xl font-bold text-slate-700">95</div>
					<p className="text-sm text-slate-600 mt-1">
						Two residential buildings
					</p>
				</CardContent>
			</Card>

			<Card className="border-l-4 border-l-slate-600">
				<CardHeader className="pb-2">
					<CardTitle className="text-lg flex items-center gap-2">
						<Gauge className="h-5 w-5 text-slate-600" />
						Active Sensors
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-3xl font-bold text-slate-700">190</div>
					<p className="text-sm text-slate-600 mt-1">
						Smart meters per unit
					</p>
				</CardContent>
			</Card>

			<Card className="border-l-4 border-l-slate-600">
				<CardHeader className="pb-2">
					<CardTitle className="text-lg flex items-center gap-2">
						<Database className="h-5 w-5 text-slate-600" />
						Data Points/Day
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-3xl font-bold text-slate-700">
						~240K
					</div>
					<p className="text-sm text-slate-600 mt-1">
						Per-minute resolution
					</p>
				</CardContent>
			</Card>

			<Card className="border-l-4 border-l-slate-600">
				<CardHeader className="pb-2">
					<CardTitle className="text-lg flex items-center gap-2">
						<TrendingUp className="h-5 w-5 text-slate-600" />
						Platform Uptime
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-3xl font-bold text-slate-700">
						99.7%
					</div>
					<p className="text-sm text-slate-600 mt-1">
						Continuous data stream
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
