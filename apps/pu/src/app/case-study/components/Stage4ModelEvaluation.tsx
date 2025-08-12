"use client";

// import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ArrowRight, TrendingUp } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ResultsPhase } from "./ResultsPhase";
import { InteractiveModelComparison } from "./interactive-model-comparison";

interface Stage4ModelEvaluationProps {
	isTrainingCompleted?: boolean;
	onBackToTraining?: () => void;
}

export function Stage4ModelEvaluation({
	isTrainingCompleted = false,
	onBackToTraining,
}: Stage4ModelEvaluationProps) {
	// 本階段也先強制選擇 experiment run（completed），未選不顯示工作台
	const [experimentRuns, setExperimentRuns] = useState<
		Array<{ id: string; name: string }>
	>([]);
	const [isLoadingRuns, setIsLoadingRuns] = useState(false);
	const [selectedRunId, setSelectedRunId] = useState<string>("");
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

	// URL 深連結與同步
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	useEffect(() => {
		let cancelled = false;
		async function loadRuns() {
			setIsLoadingRuns(true);
			try {
				const resp = await fetch(
					"http://localhost:8000/api/v1/experiment-runs?status=COMPLETED",
					{ cache: "no-store" },
				);
				if (!resp.ok) {
					return;
				}
				const data = await resp.json();
				const runs = (data?.data || []).map((r: any) => ({
					id: r.id,
					name: r.name,
				}));
				if (!cancelled) {
					setExperimentRuns(runs);
					// 若 URL 有 run 參數且有效，預先選定
					const runFromUrl = searchParams.get("run");
					if (
						runFromUrl &&
						runs.some((r: { id: string }) => r.id === runFromUrl)
					) {
						setSelectedRunId(runFromUrl);
					}
				}
			} catch {
				// no-op
			} finally {
				setIsLoadingRuns(false);
			}
		}
		loadRuns();
		return () => {
			cancelled = true;
		};
	}, [searchParams]);

	// 載入某 run 的模型清單
	useEffect(() => {
		if (!selectedRunId) {
			return;
		}
		let cancelled = false;
		(async () => {
			try {
				const resp = await fetch(
					`http://localhost:8000/api/v1/experiment-runs/${selectedRunId}/models`,
					{ cache: "no-store" },
				);
				if (!resp.ok) {
					return;
				}
				const data = await resp.json();
				const rows = (data?.data || []).map((m: any) => ({
					id: m.id,
					modelName: m.modelName,
				}));
				if (!cancelled) {
					setModels(rows);
					if (rows.length > 0) {
						setSelectedModelId(rows[0].id);
					}
				}
			} catch {}
		})();
		return () => {
			cancelled = true;
		};
	}, [selectedRunId]);

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

	// 選擇改變時，同步更新 URL 的 run 參數
	useEffect(() => {
		const current = new URLSearchParams(searchParams.toString());
		if (selectedRunId) {
			current.set("run", selectedRunId);
		} else {
			current.delete("run");
		}
		const next = `${pathname}?${current.toString()}`;
		router.replace(next, { scroll: false });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedRunId]);

	if (!selectedRunId) {
		return (
			<Card className="border border-blue-200">
				<CardHeader>
					<CardTitle className="flex items-center justify-between gap-3 text-xl text-slate-900">
						<div className="flex items-center">
							<TrendingUp className="h-5 w-5 mr-2" />
							Stage 4: Model Evaluation & Performance Analysis
						</div>
						<div className="w-72">
							<Select
								value={selectedRunId}
								onValueChange={(val) =>
									setSelectedRunId(
										val === "__clear" ? "" : val,
									)
								}
							>
								<SelectTrigger>
									<SelectValue
										placeholder={
											isLoadingRuns
												? "Loading datasets..."
												: "-- Select dataset --"
										}
									/>
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="__clear">
										-- Select dataset --
									</SelectItem>
									{experimentRuns.map((r) => (
										<SelectItem key={r.id} value={r.id}>
											{r.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</CardTitle>
					<div className="pb-2 mb-2 border-b-4 border-slate-400" />
					<p className="text-slate-600 text-sm">
						Please select a completed experiment run to view
						results.
					</p>
				</CardHeader>
				<CardContent>
					{!isTrainingCompleted && (
						<div className="flex justify-center mt-2">
							<Button
								onClick={onBackToTraining}
								variant="outline"
								className="flex items-center gap-2"
							>
								<ArrowRight className="h-4 w-4 rotate-180" />
								Go to Stage 3 - Model Training
							</Button>
						</div>
					)}
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="border border-blue-200">
			<CardHeader>
				<CardTitle className="flex items-center justify-between gap-3 text-xl text-slate-900">
					<div className="flex items-center">
						<TrendingUp className="h-5 w-5 mr-2" />
						Stage 4: Model Evaluation & Performance Analysis
					</div>
					<div className="flex items-center gap-2">
						<div className="w-72">
							<Select
								value={selectedRunId}
								onValueChange={(val) =>
									setSelectedRunId(
										val === "__clear" ? "" : val,
									)
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select completed run" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="__clear">
										Please select
									</SelectItem>
									{experimentRuns.map((r) => (
										<SelectItem key={r.id} value={r.id}>
											{r.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
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
			</CardContent>
		</Card>
	);
}
