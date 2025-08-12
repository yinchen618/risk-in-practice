"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ArrowRight, Loader2, Play, Target, Users } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useStage2Logic } from "../utils/useStage2Logic";
import { AnomalyLabelingSystem } from "./AnomalyLabelingSystem";

interface Stage2LabelingProps {
	onBackToOverview: () => void;
	onProceedToTraining: () => void;
}

export function Stage2Labeling({
	onBackToOverview,
	onProceedToTraining,
}: Stage2LabelingProps) {
	const { isCompleting, handleMarkCompleted } = useStage2Logic();

	// 本頁自管狀態，直接從後端載入
	const [experimentRuns, setExperimentRuns] = useState<
		{ id: string; name: string; status: string }[]
	>([]);
	const [isLoadingRuns, setIsLoadingRuns] = useState(false);
	const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
	const [candidateCount, setCandidateCount] = useState(0);
	const [labeledPositive, setLabeledPositive] = useState(0);
	const [labeledNormal, setLabeledNormal] = useState(0);

	// URL 深連結：讀取與同步 run 參數
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	function loadRuns() {
		setIsLoadingRuns(true);
		fetch("http://localhost:8000/api/v1/experiment-runs")
			.then(async (res) => {
				if (!res.ok) return [];
				const json = await res.json();
				return (json?.data ?? []) as {
					id: string;
					name: string;
					status: string;
				}[];
			})
			.then((runs) => {
				setExperimentRuns(runs);
			})
			.finally(() => setIsLoadingRuns(false));
	}

	function loadRunDetail(runId: string) {
		fetch(`http://localhost:8000/api/v1/experiment-runs/${runId}`)
			.then(async (res) => {
				if (!res.ok) return null;
				return (await res.json())?.data ?? null;
			})
			.then((data) => {
				if (!data) return;
				setCandidateCount(
					typeof data.candidateCount === "number"
						? data.candidateCount
						: 0,
				);
				setLabeledPositive(data.positiveLabelCount ?? 0);
				setLabeledNormal(data.negativeLabelCount ?? 0);
			})
			.catch(() => {
				setCandidateCount(0);
				setLabeledPositive(0);
				setLabeledNormal(0);
			});
	}

	useEffect(() => {
		loadRuns();
	}, []);

	// 若 URL 帶有 run 參數且存在於清單，優先選用該 run
	useEffect(() => {
		const runFromUrl = searchParams.get("run");
		if (!runFromUrl) return;
		if (experimentRuns.some((r) => r.id === runFromUrl)) {
			setSelectedRunId(runFromUrl);
		}
		// 僅在 experimentRuns 或 searchParams 改變時嘗試一次
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [experimentRuns, searchParams]);

	// 同步選擇至 URL（與其他 Stage 行為一致）
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

	useEffect(() => {
		if (selectedRunId) {
			loadRunDetail(selectedRunId);
		} else {
			setCandidateCount(0);
			setLabeledPositive(0);
			setLabeledNormal(0);
		}
	}, [selectedRunId]);

	const AnomalyLabelingSystemAny = AnomalyLabelingSystem as any;

	return (
		<>
			<div id="stage-2">
				<Card className="border border-blue-200">
					<CardHeader>
						<CardTitle className="flex items-center justify-between gap-3">
							<div className="flex items-center text-xl text-slate-900 ">
								<Users className="h-5 w-5 mr-2" />
								Stage 2: Expert Manual Verification & Labeling
							</div>
							<div className="flex items-center gap-3">
								{/* Mode toggle removed; dashboard only */}
								<div className="w-80">
									<Select
										value={selectedRunId ?? ""}
										onValueChange={(val) =>
											setSelectedRunId(
												val === "__clear" ? null : val,
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
												<SelectItem
													key={r.id}
													value={r.id}
												>
													{r.name} ({r.status})
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<Button
									onClick={() =>
										handleMarkCompleted(
											selectedRunId,
											candidateCount,
											labeledPositive,
											labeledNormal,
											setExperimentRuns,
										)
									}
									disabled={
										!selectedRunId ||
										candidateCount === 0 ||
										labeledPositive + labeledNormal <
											candidateCount ||
										isCompleting
									}
									className="bg-green-600 hover:bg-green-700 text-white"
								>
									{isCompleting ? (
										<span className="flex items-center gap-2">
											<Loader2 className="h-4 w-4 animate-spin" />
											Marking…
										</span>
									) : (
										<span>Mark as Complete</span>
									)}
								</Button>
							</div>
						</CardTitle>
					</CardHeader>
					<CardContent>
						{!selectedRunId ? (
							<Alert className="bg-blue-50 border-blue-200">
								<Target className="h-4 w-4 text-blue-600" />
								<AlertDescription>
									Please select a dataset from the dropdown to
									start Stage 2 labeling.
								</AlertDescription>
							</Alert>
						) : (
							<div className="space-y-4">
								<AnomalyLabelingSystemAny
									candidateCount={candidateCount}
									experimentRunId={selectedRunId ?? undefined}
									onLabelingProgress={(
										p: number,
										n: number,
									) => {
										setLabeledPositive(p);
										setLabeledNormal(n);
									}}
								/>
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			{selectedRunId && (
				<Card className="bg-green-50 border-green-200">
					<CardHeader>
						<CardTitle className="text-green-800">
							Labeling Progress
						</CardTitle>
						<p className="text-green-600 text-sm mt-2">
							Showing candidate anomalies identified from Stage 1
							filtering for manual labeling
						</p>
					</CardHeader>
					<CardContent>
						{candidateCount > 0 ? (
							<>
								<div className="grid grid-cols-4 gap-4 text-center mb-6">
									<div>
										<div className="text-2xl font-bold text-orange-600">
											{candidateCount.toLocaleString()}
										</div>
										<div className="text-sm text-gray-600">
											Total Candidates
										</div>
									</div>
									<div>
										<div className="text-2xl font-bold text-blue-600">
											{labeledPositive.toLocaleString()}
										</div>
										<div className="text-sm text-gray-600">
											Labeled Positive
										</div>
									</div>
									<div>
										<div className="text-2xl font-bold text-gray-600">
											{labeledNormal.toLocaleString()}
										</div>
										<div className="text-sm text-gray-600">
											Labeled Normal
										</div>
									</div>
									<div>
										<div className="text-2xl font-bold text-green-600">
											{candidateCount > 0
												? Math.round(
														((labeledPositive +
															labeledNormal) /
															candidateCount) *
															100,
													)
												: 0}
											%
										</div>
										<div className="text-sm text-gray-600">
											Completion
										</div>
									</div>
								</div>
								{labeledPositive + labeledNormal === 0 ? (
									<Alert className="bg-orange-50 border-orange-200">
										<Target className="h-4 w-4 text-orange-600" />
										<AlertDescription>
											<strong>Ready for Labeling:</strong>{" "}
											{candidateCount.toLocaleString()}{" "}
											candidate anomaly events have been
											identified from Stage 1 filtering.
											These candidates are now ready for
											expert review and manual labeling to
											create high-quality positive samples
											for PU Learning model training.
										</AlertDescription>
									</Alert>
								) : labeledPositive + labeledNormal ===
									candidateCount ? (
									<Alert className="bg-green-50 border-green-200">
										<Play className="h-4 w-4 text-green-600" />
										<AlertDescription>
											<strong>Labeling Complete!</strong>{" "}
											You have successfully labeled{" "}
											{labeledPositive.toLocaleString()}{" "}
											positive samples (anomalies) and{" "}
											{labeledNormal.toLocaleString()}{" "}
											normal samples from{" "}
											{candidateCount.toLocaleString()}{" "}
											candidates. These high-quality
											positive samples are now ready for
											model training.
										</AlertDescription>
									</Alert>
								) : (
									<Alert className="bg-blue-50 border-blue-200">
										<Target className="h-4 w-4 text-blue-600" />
										<AlertDescription>
											<strong>
												Labeling in Progress:
											</strong>{" "}
											{(
												labeledPositive + labeledNormal
											).toLocaleString()}{" "}
											of {candidateCount.toLocaleString()}{" "}
											candidates have been labeled.
											Continue labeling to complete the
											dataset preparation for model
											training.
										</AlertDescription>
									</Alert>
								)}
							</>
						) : (
							<Alert>
								<Target className="h-4 w-4" />
								<AlertDescription>
									<strong>No Candidates Found:</strong> Please
									run Stage 1 candidate calculation first to
									identify anomaly candidates for labeling.
								</AlertDescription>
							</Alert>
						)}
						<div className="flex justify-center mt-6">
							<Button
								size="lg"
								onClick={onProceedToTraining}
								className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
							>
								<ArrowRight className="h-5 w-5 mr-2" />
								Proceed to Model Training & Results
							</Button>
						</div>
					</CardContent>
				</Card>
			)}
		</>
	);
}
