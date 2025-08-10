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
import {
	ArrowRight,
	Eye,
	Loader2,
	Play,
	Target,
	Users,
	Zap,
} from "lucide-react";
import { useState } from "react";
import { useStage1Logic } from "../utils/useStage1Logic";
import { useStage2Logic } from "../utils/useStage2Logic";
import { AnomalyLabelingSystem } from "./AnomalyLabelingSystem";

type ViewMode = "dashboard" | "workbench";

interface Stage2LabelingProps {
	onBackToOverview: () => void;
	onProceedToTraining: () => void;
}

export function Stage2Labeling({
	onBackToOverview,
	onProceedToTraining,
}: Stage2LabelingProps) {
	const [viewMode, setViewMode] = useState<ViewMode>("dashboard");
	const stage1Logic = useStage1Logic();
	const { isCompleting, handleMarkCompleted } = useStage2Logic();

	const AnomalyLabelingSystemAny = AnomalyLabelingSystem as any;

	return (
		<>
			<div id="stage-2">
				<Card className="border-purple-200">
					<CardHeader>
						<CardTitle className="flex items-center justify-between gap-3">
							<div className="flex items-center text-xl text-purple-800">
								<Users className="h-5 w-5 mr-2" />
								Stage 2: Expert Manual Verification & Labeling
							</div>
							<div className="flex items-center gap-3">
								{/* 模式切換按鈕 */}
								<div className="flex gap-2">
									<Button
										variant={
											viewMode === "dashboard"
												? "default"
												: "outline"
										}
										size="sm"
										onClick={() => setViewMode("dashboard")}
										className="flex items-center gap-2"
									>
										<Eye className="h-4 w-4" />
										總覽模式
									</Button>
									<Button
										variant={
											viewMode === "workbench"
												? "default"
												: "outline"
										}
										size="sm"
										onClick={() => setViewMode("workbench")}
										className="flex items-center gap-2"
									>
										<Zap className="h-4 w-4" />
										工作台模式
									</Button>
								</div>
								<div className="w-72">
									<Select
										value={stage1Logic.selectedRunId ?? ""}
										onValueChange={(val) =>
											stage1Logic.setSelectedRunId(
												val || null,
											)
										}
									>
										<SelectTrigger>
											<SelectValue
												placeholder={
													stage1Logic.isLoadingRuns
														? "Loading datasets..."
														: "Select dataset"
												}
											/>
										</SelectTrigger>
										<SelectContent>
											{stage1Logic.experimentRuns.map(
												(r) => (
													<SelectItem
														key={r.id}
														value={r.id}
													>
														{r.name} ({r.status})
													</SelectItem>
												),
											)}
										</SelectContent>
									</Select>
								</div>
								<Button
									variant="outline"
									onClick={onBackToOverview}
									className="flex items-center gap-2"
								>
									<ArrowRight className="h-4 w-4 rotate-180" />
									Back to Overview
								</Button>
								<Button
									onClick={() =>
										handleMarkCompleted(
											stage1Logic.selectedRunId,
											stage1Logic.candidateCount,
											stage1Logic.labeledPositive,
											stage1Logic.labeledNormal,
											stage1Logic.setExperimentRuns,
										)
									}
									disabled={
										!stage1Logic.selectedRunId ||
										stage1Logic.candidateCount === 0 ||
										stage1Logic.labeledPositive +
											stage1Logic.labeledNormal <
											stage1Logic.candidateCount ||
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
						<div className="bg-purple-50 p-4 rounded-lg mt-4">
							<div className="mb-3">
								<p className="text-purple-700">
									<strong>Task:</strong> Please review and
									label the following{" "}
									{stage1Logic.candidateCount.toLocaleString()}{" "}
									candidate events. Your expert annotations
									will create high-quality positive samples
									for training the PU Learning model.
								</p>
							</div>
							<div className="text-sm text-purple-600">
								{viewMode === "dashboard" ? (
									<p>
										<strong>總覽模式：</strong>{" "}
										查看完整的事件列表、統計資料，
										並可以審核所有狀態的事件。適合分析和管理。
									</p>
								) : (
									<p>
										<strong>工作台模式：</strong>{" "}
										專注於未標記事件的高效處理。
										自動載入下一個事件，提高標記效率。
									</p>
								)}
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{viewMode === "dashboard" ? (
								<AnomalyLabelingSystemAny
									candidateCount={stage1Logic.candidateCount}
									filterParams={stage1Logic.filterParams}
									experimentRunId={
										stage1Logic.selectedRunId ?? undefined
									}
									onLabelingProgress={(
										p: number,
										n: number,
									) => {
										// Update the labeling progress in stage1Logic
										stage1Logic.setLabeledPositive(p);
										stage1Logic.setLabeledNormal(n);
									}}
								/>
							) : (
								<div className="space-y-6">
									{/* 工作台模式 - 從 WorkbenchPage 組件移植過來 */}
									<div className="text-center">
										<h3 className="text-xl font-bold text-gray-900 mb-2">
											異常標記工作台
										</h3>
										<p className="text-gray-600 max-w-2xl mx-auto">
											專注模式 -
											高效完成異常事件標記任務。 剩餘{" "}
											{/* 這裡需要實際的未標記事件數量 */}
											{stage1Logic.candidateCount -
												stage1Logic.labeledPositive -
												stage1Logic.labeledNormal}{" "}
											個待審核事件。
										</p>
									</div>

									{/* 主要工作界面 */}
									<AnomalyLabelingSystemAny
										candidateCount={
											stage1Logic.candidateCount
										}
										filterParams={stage1Logic.filterParams}
										experimentRunId={
											stage1Logic.selectedRunId ??
											undefined
										}
										onLabelingProgress={(
											p: number,
											n: number,
										) => {
											stage1Logic.setLabeledPositive(p);
											stage1Logic.setLabeledNormal(n);
										}}
									/>
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			</div>

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
					{stage1Logic.candidateCount > 0 ? (
						<>
							<div className="grid grid-cols-4 gap-4 text-center mb-6">
								<div>
									<div className="text-2xl font-bold text-orange-600">
										{stage1Logic.candidateCount.toLocaleString()}
									</div>
									<div className="text-sm text-gray-600">
										Total Candidates
									</div>
								</div>
								<div>
									<div className="text-2xl font-bold text-blue-600">
										{stage1Logic.labeledPositive.toLocaleString()}
									</div>
									<div className="text-sm text-gray-600">
										Labeled Positive
									</div>
								</div>
								<div>
									<div className="text-2xl font-bold text-gray-600">
										{stage1Logic.labeledNormal.toLocaleString()}
									</div>
									<div className="text-sm text-gray-600">
										Labeled Normal
									</div>
								</div>
								<div>
									<div className="text-2xl font-bold text-green-600">
										{stage1Logic.candidateCount > 0
											? Math.round(
													((stage1Logic.labeledPositive +
														stage1Logic.labeledNormal) /
														stage1Logic.candidateCount) *
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
							{stage1Logic.labeledPositive +
								stage1Logic.labeledNormal ===
							0 ? (
								<Alert className="bg-orange-50 border-orange-200">
									<Target className="h-4 w-4 text-orange-600" />
									<AlertDescription>
										<strong>Ready for Labeling:</strong>{" "}
										{stage1Logic.candidateCount.toLocaleString()}{" "}
										candidate anomaly events have been
										identified from Stage 1 filtering. These
										candidates are now ready for expert
										review and manual labeling to create
										high-quality positive samples for PU
										Learning model training.
									</AlertDescription>
								</Alert>
							) : stage1Logic.labeledPositive +
									stage1Logic.labeledNormal ===
								stage1Logic.candidateCount ? (
								<Alert className="bg-green-50 border-green-200">
									<Play className="h-4 w-4 text-green-600" />
									<AlertDescription>
										<strong>Labeling Complete!</strong> You
										have successfully labeled{" "}
										{stage1Logic.labeledPositive.toLocaleString()}{" "}
										positive samples (anomalies) and{" "}
										{stage1Logic.labeledNormal.toLocaleString()}{" "}
										normal samples from{" "}
										{stage1Logic.candidateCount.toLocaleString()}{" "}
										candidates. These high-quality positive
										samples are now ready for model
										training.
									</AlertDescription>
								</Alert>
							) : (
								<Alert className="bg-blue-50 border-blue-200">
									<Target className="h-4 w-4 text-blue-600" />
									<AlertDescription>
										<strong>Labeling in Progress:</strong>{" "}
										{(
											stage1Logic.labeledPositive +
											stage1Logic.labeledNormal
										).toLocaleString()}{" "}
										of{" "}
										{stage1Logic.candidateCount.toLocaleString()}{" "}
										candidates have been labeled. Continue
										labeling to complete the dataset
										preparation for model training.
									</AlertDescription>
								</Alert>
							)}
						</>
					) : (
						<Alert>
							<Target className="h-4 w-4" />
							<AlertDescription>
								<strong>No Candidates Found:</strong> Please run
								Stage 1 candidate calculation first to identify
								anomaly candidates for labeling.
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
		</>
	);
}
