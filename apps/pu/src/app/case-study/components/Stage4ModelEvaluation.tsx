"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { ResultsPhase } from "./ResultsPhase";
import { InteractiveModelComparison } from "./interactive-model-comparison";

interface Stage4ModelEvaluationProps {
	selectedRunId: string; // 外層已保證不為 null
}

export function Stage4ModelEvaluation({
	selectedRunId,
}: Stage4ModelEvaluationProps) {
	// 本階段也先強制選擇 experiment run（completed），未選不顯示工作台
	const [models, setModels] = useState<
		Array<{ id: string; modelName: string }>
	>([]);
	const [selectedModelId, setSelectedModelId] = useState<string>("");
	const [predictions, setPredictions] = useState<
		Array<{
			timestamp: string;
			predictionScore: number;
			groundTruth?: number | null;
		}>
	>([]);
	const [threshold] = useState(0.95);

	// 載入模型預測資料（用於互動式圖表）
	useEffect(() => {
		if (!selectedModelId) {
			return;
		}
		let cancelled = false;
		(async () => {
			try {
				const resp = await fetch(
					`http://localhost:8000/api/v1/models/${selectedModelId}/predictions`,
					{ cache: "no-store" },
				);
				if (!resp.ok) {
					return;
				}
				const data = await resp.json();
				const rows = (data?.data || []).map((r: any) => ({
					timestamp: r.timestamp,
					predictionScore: r.predictionScore,
					groundTruth: r.groundTruth ?? null,
				}));
				if (!cancelled) {
					setPredictions(rows);
				}
			} catch {}
		})();
		return () => {
			cancelled = true;
		};
	}, [selectedModelId]);

	return (
		<Card className="border border-blue-200">
			<CardHeader>
				<CardTitle className="flex items-center justify-between gap-3 text-xl text-slate-900">
					<div className="flex items-center">
						<TrendingUp className="h-5 w-5 mr-2" />
						Stage 4: Model Evaluation & Performance Analysis
					</div>
				</CardTitle>
				<div className="bg-blue-50 border border-blue-100 p-4 rounded-lg mt-4 space-y-3">
					<p className="text-slate-600">
						<strong>Evaluation Results:</strong> The following
						metrics and insights are based on the model's
						performance on the <strong>validation dataset</strong>,
						ensuring unbiased evaluation.
					</p>
					{/* 模型選擇下拉 */}
					<div className="w-80">
						<Select
							value={selectedModelId}
							onValueChange={setSelectedModelId}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select model" />
							</SelectTrigger>
							<SelectContent>
								{models.map((m) => (
									<SelectItem key={m.id} value={m.id}>
										{m.modelName}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				{selectedRunId ? (
					<>
						{/* 圖表：若有選定模型，優先顯示真實預測資料 */}
						<div className="mb-6">
							<InteractiveModelComparison
								activeModel="nnpu"
								confidenceThreshold={threshold}
								predictions={predictions}
								modelLabel={
									models.find((m) => m.id === selectedModelId)
										?.modelName
								}
							/>
						</div>

						{/* 下面保留原有的比較與洞察 */}
						<ResultsPhase />
					</>
				) : null}
			</CardContent>
		</Card>
	);
}
