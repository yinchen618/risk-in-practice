"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Calendar,
	CheckCircle,
	ListChecks,
	Play,
	RotateCcw,
	Settings,
	TrendingUp,
	Zap,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

type TrainingStage = "ready" | "training" | "completed";

interface Stage3ModelTrainingProps {
	onTrainingCompleted?: () => void;
}

export function Stage3ModelTraining({
	onTrainingCompleted,
}: Stage3ModelTrainingProps) {
	const [trainingStage, setTrainingStage] = useState<TrainingStage>("ready");
	const [trainingProgress, setTrainingProgress] = useState(0);

	// Console state
	const [experimentRuns, setExperimentRuns] = useState<
		Array<{ id: string; name: string }>
	>([]);
	const [selectedRunId, setSelectedRunId] = useState<string>("");
	const [predictionStart, setPredictionStart] = useState<string>("");
	const [predictionEnd, setPredictionEnd] = useState<string>("");

	const [isLoadingRuns, setIsLoadingRuns] = useState(false);
	const [modelType, setModelType] = useState<"uPU" | "nnPU">("nnPU");
	const [priorMethod, setPriorMethod] = useState<"mean" | "median">("median");
	const [classPrior, setClassPrior] = useState<string>("");
	const [hiddenUnits, setHiddenUnits] = useState<number>(100);
	const [activation, setActivation] = useState<"relu" | "tanh">("relu");
	const [lambdaReg, setLambdaReg] = useState<number>(0.005);
	const [optimizer, setOptimizer] = useState<"adam" | "sgd">("adam");
	const [learningRate, setLearningRate] = useState<number>(0.005);
	const [epochs, setEpochs] = useState<number>(100);
	const [batchSize, setBatchSize] = useState<number>(128);
	const [seed, setSeed] = useState<number>(42);

	// Job tracking
	const [jobId, setJobId] = useState<string>("");
	const [jobStatus, setJobStatus] = useState<string>("");
	const pollTimerRef = useRef<NodeJS.Timeout | null>(null);

	// Results
	const [modelId, setModelId] = useState<string>("");
	const [resultsMeta, setResultsMeta] = useState<any>(null);
	const [metrics, setMetrics] = useState<any>(null);
	const [topPredictions, setTopPredictions] = useState<Array<any>>([]);
	const [errorMessage, setErrorMessage] = useState<string>("");

	const API_BASE = "http://localhost:8000";
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	useEffect(() => {
		let cancelled = false;
		async function loadRuns() {
			setIsLoadingRuns(true);
			try {
				const resp = await fetch(
					`${API_BASE}/api/v1/experiment-runs?status=COMPLETED`,
					{ cache: "no-store" },
				);
				if (!resp.ok) {
					return;
				}
				const data = await resp.json();
				if (!cancelled) {
					interface RunRow {
						id: string;
						name: string;
					}
					const runs = (data?.data || []).map((r: RunRow) => ({
						id: r.id,
						name: r.name,
					}));
					setExperimentRuns(runs);
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

	const selectedRunName = useMemo(() => {
		return experimentRuns.find((r) => r.id === selectedRunId)?.name || "";
	}, [experimentRuns, selectedRunId]);

	// keep URL in sync with selected run
	useEffect(() => {
		const current = new URLSearchParams(searchParams.toString());
		if (selectedRunId) {
			current.set("run", selectedRunId);
		} else {
			current.delete("run");
		}
		const next = `${pathname}?${current.toString()}`;
		router.replace(next, { scroll: false });
	}, [selectedRunId]);

	const isConfigValid = useMemo(() => {
		if (!selectedRunId) {
			return false;
		}
		if (!predictionStart || !predictionEnd) {
			return false;
		}
		return new Date(predictionStart) <= new Date(predictionEnd);
	}, [selectedRunId, predictionStart, predictionEnd]);

	function applyGoldenConfig() {
		setModelType("nnPU");
		setPriorMethod("median");
		setHiddenUnits(100);
		setActivation("relu");
		setLambdaReg(0.005);
		setOptimizer("adam");
		setLearningRate(0.005);
		setEpochs(100);
		setBatchSize(128);
		setSeed(42);
	}

	function stopPolling() {
		if (pollTimerRef.current) {
			clearTimeout(pollTimerRef.current);
			pollTimerRef.current = null;
		}
	}

	async function fetchModelResults(mid: string) {
		try {
			const r = await fetch(`${API_BASE}/api/v1/models/${mid}/results`, {
				cache: "no-store",
			});
			if (!r.ok) {
				return;
			}
			const data = await r.json();
			setResultsMeta(data.meta);
			setMetrics(data.metrics);
		} catch {
			// no-op
		}
	}

	async function pollJobOnce(jid: string) {
		try {
			const r = await fetch(`${API_BASE}/api/v1/models/jobs/${jid}`, {
				cache: "no-store",
			});
			if (!r.ok) {
				throw new Error(`Status ${r.status}`);
			}
			const s = await r.json();
			setJobStatus(s.status);
			const progressNumber = Math.round((s.progress || 0) * 100);
			setTrainingProgress(progressNumber);
			if (s.status === "SUCCEEDED") {
				stopPolling();
				setTrainingStage("completed");
				const mid = s.model_id as string;
				setModelId(mid);
				setTopPredictions(s.result?.predictions_topk || []);
				fetchModelResults(mid);
				// 通知父組件訓練完成
				if (onTrainingCompleted) {
					onTrainingCompleted();
				}
				return true;
			}
			if (s.status === "FAILED") {
				stopPolling();
				setTrainingStage("ready");
				setErrorMessage(s.error || "Job failed");
				return true;
			}
			return false;
		} catch (err: any) {
			stopPolling();
			setTrainingStage("ready");
			setErrorMessage(err?.message || "Polling failed");
			return true;
		}
	}

	function pollJobUntilDone(jid: string) {
		stopPolling();
		const tick = async () => {
			const done = await pollJobOnce(jid);
			if (!done) {
				pollTimerRef.current = setTimeout(tick, 1200);
			}
		};
		tick();
	}

	// cleanup on unmount
	useEffect(() => {
		return () => {
			stopPolling();
		};
	}, []);

	async function startTrainAndPredict() {
		setErrorMessage("");
		setResultsMeta(null);
		setMetrics(null);
		setTopPredictions([]);
		setModelId("");
		setJobId("");
		setJobStatus("");
		setTrainingStage("training");
		setTrainingProgress(0);

		const payload = {
			experiment_run_id: selectedRunId,
			model_params: {
				model_type: modelType,
				prior_method: priorMethod,
				class_prior: classPrior ? Number(classPrior) : null,
				hidden_units: hiddenUnits,
				activation,
				lambda_reg: lambdaReg,
				optimizer,
				learning_rate: learningRate,
				epochs,
				batch_size: batchSize,
				seed,
				feature_version: "fe_v1",
			},
			prediction_start_date: predictionStart,
			prediction_end_date: predictionEnd,
		};

		try {
			const resp = await fetch(
				`${API_BASE}/api/v1/models/train-and-predict`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
				},
			);
			if (!resp.ok) {
				const txt = await resp.text();
				throw new Error(txt || "Failed to start job");
			}
			const data = await resp.json();
			const jid = data.job_id as string;
			setJobId(jid);
			setJobStatus("QUEUED");
			pollJobUntilDone(jid);
		} catch (err: any) {
			setTrainingStage("ready");
			setErrorMessage(err?.message || "Failed to start job");
		}
	}

	const handleResetTraining = () => {
		stopPolling();
		setTrainingStage("ready");
		setTrainingProgress(0);
		setJobId("");
		setJobStatus("");
		setModelId("");
		setResultsMeta(null);
		setMetrics(null);
		setTopPredictions([]);
		setErrorMessage("");
	};

	return (
		<Card className="border border-blue-200">
			<CardHeader>
				<CardTitle className="flex items-center justify-between gap-3 text-xl text-slate-900">
					<div className="flex items-center">
						<Zap className="h-5 w-5 mr-2" />
						Stage 3: PU Learning Model Training & Prediction
					</div>
					<div className="w-72">
						<Select
							value={selectedRunId}
							onValueChange={(val) =>
								setSelectedRunId(val === "__clear" ? "" : val)
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
								{experimentRuns.map((run) => (
									<SelectItem key={run.id} value={run.id}>
										{run.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</CardTitle>
				<div className="text-slate-600 text-sm space-y-1">
					<p className="flex items-center gap-2">
						<ListChecks className="h-4 w-4" /> Training set =
						ExperimentRun labeled events (P/U, optional RN).
						Prediction = ammeter_log in date range. Leakage guarded.
					</p>
					<p className="flex items-center gap-2">
						<Calendar className="h-4 w-4" /> Make sure training
						windows do not overlap with prediction range.
					</p>
				</div>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Error Message */}
				{errorMessage && (
					<Alert variant="destructive">
						<AlertDescription>{errorMessage}</AlertDescription>
					</Alert>
				)}

				{/* Console */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="space-y-4">
						<h4 className="font-semibold text-slate-800">
							Dataset
						</h4>
						<div className="space-y-2">
							<Label>ExperimentRun</Label>
							<div className="text-sm text-slate-700 px-3 py-2 border rounded-md bg-slate-50">
								{selectedRunName ||
									"Select dataset from header"}
							</div>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label>Prediction start</Label>
								<Input
									type="date"
									value={predictionStart}
									onChange={(e) =>
										setPredictionStart(e.target.value)
									}
								/>
							</div>
							<div className="space-y-2">
								<Label>Prediction end</Label>
								<Input
									type="date"
									value={predictionEnd}
									onChange={(e) =>
										setPredictionEnd(e.target.value)
									}
								/>
							</div>
						</div>
					</div>
					<div className="space-y-4">
						<h4 className="font-semibold text-slate-800">
							Model Config
						</h4>
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label>Model Type</Label>
								<Select
									value={modelType}
									onValueChange={(v) =>
										setModelType(v as any)
									}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="uPU">uPU</SelectItem>
										<SelectItem value="nnPU">
											nnPU
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-2">
								<Label>Prior Method</Label>
								<Select
									value={priorMethod}
									onValueChange={(v) =>
										setPriorMethod(v as any)
									}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="mean">
											Mean
										</SelectItem>
										<SelectItem value="median">
											Median
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-2">
								<Label>Class Prior (optional)</Label>
								<Input
									type="number"
									min={0}
									max={1}
									step={0.01}
									value={classPrior}
									onChange={(e) =>
										setClassPrior(e.target.value)
									}
								/>
							</div>
							<div className="space-y-2">
								<Label>Hidden Units</Label>
								<Input
									type="number"
									min={4}
									max={500}
									value={hiddenUnits}
									onChange={(e) =>
										setHiddenUnits(
											Number(e.target.value || 0),
										)
									}
								/>
							</div>
							<div className="space-y-2">
								<Label>Activation</Label>
								<Select
									value={activation}
									onValueChange={(v) =>
										setActivation(v as any)
									}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="relu">
											ReLU
										</SelectItem>
										<SelectItem value="tanh">
											Tanh
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-2">
								<Label>Lambda (L2)</Label>
								<Input
									type="number"
									min={0}
									max={0.1}
									step={0.001}
									value={lambdaReg}
									onChange={(e) =>
										setLambdaReg(
											Number(e.target.value || 0),
										)
									}
								/>
							</div>
							<div className="space-y-2">
								<Label>Optimizer</Label>
								<Select
									value={optimizer}
									onValueChange={(v) =>
										setOptimizer(v as any)
									}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="adam">
											Adam
										</SelectItem>
										<SelectItem value="sgd">SGD</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-2">
								<Label>Learning Rate</Label>
								<Input
									type="number"
									min={0.00001}
									step={0.001}
									value={learningRate}
									onChange={(e) =>
										setLearningRate(
											Number(e.target.value || 0),
										)
									}
								/>
							</div>
							<div className="space-y-2">
								<Label>Epochs</Label>
								<Input
									type="number"
									min={10}
									max={1000}
									value={epochs}
									onChange={(e) =>
										setEpochs(Number(e.target.value || 0))
									}
								/>
							</div>
							<div className="space-y-2">
								<Label>Batch Size</Label>
								<Input
									type="number"
									min={16}
									step={16}
									value={batchSize}
									onChange={(e) =>
										setBatchSize(
											Number(e.target.value || 0),
										)
									}
								/>
							</div>
							<div className="space-y-2">
								<Label>Seed</Label>
								<Input
									type="number"
									min={0}
									max={999999}
									value={seed}
									onChange={(e) =>
										setSeed(Number(e.target.value || 0))
									}
								/>
							</div>
						</div>
					</div>
				</div>

				<div className="flex items-center gap-3">
					<Button
						onClick={applyGoldenConfig}
						variant="outline"
						className="inline-flex items-center rounded-md border border-blue-200 text-slate-700 px-3 py-2 hover:border-blue-300"
					>
						Apply Golden Configuration
					</Button>
					<Button
						onClick={startTrainAndPredict}
						disabled={
							!isConfigValid || trainingStage === "training"
						}
						className="inline-flex items-center rounded-md bg-blue-600 text-white px-3 py-2 hover:bg-blue-700"
					>
						<Play className="h-5 w-5 mr-2" />
						Start Training & Prediction
					</Button>
					<Button
						onClick={handleResetTraining}
						variant="outline"
						className="inline-flex items-center rounded-md border border-blue-200 text-slate-700 px-3 py-2 hover:border-blue-300"
					>
						<RotateCcw className="h-5 w-5 mr-2" />
						Reset
					</Button>
				</div>

				{/* Training Status */}
				{!selectedRunId ? (
					<Alert>
						<AlertDescription>
							Please select a completed experiment run to
							configure and start training.
						</AlertDescription>
					</Alert>
				) : trainingStage === "ready" ? (
					<Card className="bg-emerald-50 border-emerald-100">
						<CardContent className="p-6">
							<div className="text-center space-y-4">
								<CheckCircle className="h-12 w-12 text-emerald-600 mx-auto" />
								<h4 className="text-lg font-bold text-emerald-800">
									Ready to Train Model
								</h4>
								<p className="text-slate-600">
									Select dataset and date range, then run
									training & prediction.
								</p>
								<Button
									onClick={startTrainAndPredict}
									size="lg"
									className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg"
									disabled={!isConfigValid}
								>
									<Play className="h-6 w-6 mr-3" />
									Start Model Training
								</Button>
							</div>
						</CardContent>
					</Card>
				) : null}

				{trainingStage === "training" && (
					<Card className="bg-blue-50 border-blue-100">
						<CardContent className="p-6">
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<h4 className="text-lg font-bold text-slate-800">
										Training in Progress...
									</h4>
									<Badge
										variant="secondary"
										className="bg-blue-100 text-blue-800"
									>
										{Math.round(trainingProgress)}%
									</Badge>
								</div>
								<Progress
									value={trainingProgress}
									className="w-full"
								/>
								<div className="grid grid-cols-2 gap-4 text-sm">
									<div>
										<strong>Current Stage:</strong>
										<div className="text-blue-700">
											{trainingProgress < 25
												? "Data preprocessing"
												: trainingProgress < 50
													? "Feature extraction"
													: trainingProgress < 75
														? "Model training"
														: "Validation"}
										</div>
									</div>
									<div>
										<strong>Estimated Time:</strong>
										<div className="text-blue-700">
											~
											{Math.max(
												0,
												Math.round(
													(100 - trainingProgress) /
														10,
												),
											)}{" "}
											minutes remaining
										</div>
									</div>
								</div>
								<Alert>
									<Settings className="h-4 w-4" />
									<AlertDescription>
										Async job with server-side progress.
										Please keep this page open. Results will
										load when finished.
									</AlertDescription>
								</Alert>
							</div>
						</CardContent>
					</Card>
				)}

				{trainingStage === "completed" && (
					<Card className="bg-emerald-50 border-emerald-100">
						<CardContent className="p-6">
							<div className="text-center space-y-4">
								<CheckCircle className="h-12 w-12 text-emerald-600 mx-auto" />
								<h4 className="text-lg font-bold text-emerald-800">
									Training & Prediction Completed!
								</h4>
								<p className="text-slate-600">
									Model and top-K predictions are ready.
									Explore results and insights in Stage 4.
								</p>
								<div className="flex gap-4 justify-center">
									<Button
										onClick={() => {
											if (onTrainingCompleted) {
												onTrainingCompleted();
											}
										}}
										size="lg"
										className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
									>
										<TrendingUp className="h-5 w-5 mr-2" />
										View Results & Insights
									</Button>
									<Button
										onClick={handleResetTraining}
										variant="outline"
										size="lg"
										className="px-6 py-3"
									>
										<RotateCcw className="h-5 w-5 mr-2" />
										Retrain Model
									</Button>
								</div>
								{errorMessage && (
									<p className="text-red-600 mt-2">
										{errorMessage}
									</p>
								)}
								{resultsMeta && (
									<div className="mt-6 text-sm text-slate-700 space-y-1">
										<div>
											Model ID:{" "}
											<span className="font-mono">
												{modelId}
											</span>
										</div>
										<div>
											Type: {resultsMeta.model_type}
										</div>
										<div>
											Created at: {resultsMeta.created_at}
										</div>
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				)}
			</CardContent>
		</Card>
	);
}
