"use client";

import { CheckCircle2, Circle } from "lucide-react";
import { useMemo } from "react";

interface StageInfo {
	id: string;
	title: string;
	subtitle: string;
}

const stages: StageInfo[] = [
	{
		id: "stage-1",
		title: "1 Data Filtering",
		subtitle: "Generate candidates",
	},
	{
		id: "stage-2",
		title: "2 Manual Labeling",
		subtitle: "Expert verification",
	},
	{
		id: "stage-3",
		title: "3 Model Training",
		subtitle: "uPU / nnPU",
	},
	{
		id: "stage-4",
		title: "4 Prediction & Evaluation",
		subtitle: "Results & insights",
	},
];

export function PipelineWizard() {
	// 簡化：狀態由各區塊內部呈現，wizard 僅作為導覽
	const computed = useMemo(() => stages, []);

	function handleJump(id: string) {
		const el =
			document.getElementById(id) || document.getElementById("backtest");
		if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
	}

	return (
		<div className="w-full bg-white/70 backdrop-blur border rounded-xl p-4">
			<div className="flex flex-col md:flex-row md:items-stretch gap-4">
				{computed.map((s) => (
					<button
						key={s.id}
						type="button"
						onClick={() => handleJump(s.id)}
						className="group flex-1 rounded-lg border bg-white hover:bg-slate-50 transition p-3 text-left"
					>
						<div className="flex items-center gap-3">
							<span className="text-slate-600">
								<Circle className="size-4 group-hover:hidden" />
								<CheckCircle2 className="size-4 hidden group-hover:inline" />
							</span>
							<div>
								<div className="text-sm font-semibold text-slate-900">
									{s.title}
								</div>
								<div className="text-xs text-slate-600">
									{s.subtitle}
								</div>
							</div>
						</div>
					</button>
				))}
			</div>
		</div>
	);
}

export default PipelineWizard;
