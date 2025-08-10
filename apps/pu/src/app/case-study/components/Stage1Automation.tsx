"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
	ArrowRight,
	Calendar,
	Database,
	Filter,
	Info,
	Loader2,
	Play,
	Settings,
	Users,
} from "lucide-react";
import {} from "react";
import type { FilterParams } from "../types";
import { formatParamValue, paramLabels } from "../utils/shared-utils";
import { useStage1Logic } from "../utils/useStage1Logic";

export interface PendingDiffItem {
	label: string;
	from: string;
	to: string;
}

interface Stage1AutomationProps {
	onProceedToStage2: () => void;
}

export function Stage1Automation({ onProceedToStage2 }: Stage1AutomationProps) {
	const stage1Logic = useStage1Logic();

	// Build diffs between savedParams (baseline) and current form state
	const pendingDiffs = (() => {
		if (!stage1Logic.savedParams) {
			return [] as { label: string; from: string; to: string }[];
		}
		const diffs: { label: string; from: string; to: string }[] = [];
		(Object.keys(paramLabels) as (keyof FilterParams)[]).forEach((k) => {
			const a = stage1Logic.savedParams?.[k];
			const b = stage1Logic.filterParams[k];
			if (a === undefined) {
				return;
			}
			const isDate = k === "startDate" || k === "endDate";
			const changed = isDate
				? (a as Date).getTime() !== (b as Date).getTime()
				: a !== b;
			if (changed) {
				diffs.push({
					label: paramLabels[k],
					from: formatParamValue(k, a),
					to: formatParamValue(k, b),
				});
			}
		});
		return diffs;
	})();

	return (
		<>
			{/* Page Header */}
			<Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
				<CardHeader>
					<CardTitle className="flex items-center text-2xl text-blue-900">
						<Database className="h-6 w-6 mr-3" />
						Data Exploration & Labeling
					</CardTitle>
					<p className="text-blue-700 mt-2">
						Execute the two-stage funnel labeling approach to
						generate high-quality positive samples for model
						training
					</p>
				</CardHeader>
			</Card>

			{/* Stage 1: Automated Candidate Generation */}
			<Card className="border-orange-200">
				<CardHeader>
					<CardTitle className="flex items-center text-xl text-orange-800">
						<Filter className="h-5 w-5 mr-2" />
						Stage 1: Automated Candidate Generation
					</CardTitle>
					<p className="text-orange-600 text-sm">
						Apply multi-dimensional filtering rules to extract
						candidate anomaly events from massive raw data
					</p>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Dataset (Experiment Run) Selection */}
					<div className="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-400">
						<h4 className="font-semibold text-indigo-800 mb-3">
							Dataset (Experiment Run)
						</h4>
						<div className="flex flex-col md:flex-row gap-3 md:items-center">
							<div className="w-full md:w-80">
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
										{stage1Logic.experimentRuns.map((r) => (
											<SelectItem key={r.id} value={r.id}>
												{r.name} ({r.status})
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="outline"
										disabled={stage1Logic.isLoadingRuns}
										className="gap-2"
									>
										Manage dataset
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									<DropdownMenuItem
										onClick={stage1Logic.handleCreateRun}
										disabled={stage1Logic.isCreatingRun}
									>
										{stage1Logic.isCreatingRun ? (
											<span className="flex items-center gap-2">
												<Loader2 className="h-4 w-4 animate-spin" />
												Creating...
											</span>
										) : (
											<span>Create dataset</span>
										)}
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={
											stage1Logic.handleSaveParameters
										}
										disabled={!stage1Logic.selectedRunId}
									>
										Save parameters
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										onClick={stage1Logic.handleRenameRun}
										disabled={!stage1Logic.selectedRunId}
									>
										Rename dataset...
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={stage1Logic.handleDeleteRun}
										disabled={!stage1Logic.selectedRunId}
										className="text-red-600"
									>
										Delete dataset...
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
						{stage1Logic.selectedRunId && (
							<div className="mt-3 text-sm text-indigo-900 grid md:grid-cols-2 gap-3">
								<div className="space-y-1">
									<div className="font-medium">
										Current Dataset Parameters
									</div>
									<div>
										日期:{" "}
										{stage1Logic.filterParams.startDate.toLocaleDateString()}{" "}
										-{" "}
										{stage1Logic.filterParams.endDate.toLocaleDateString()}
									</div>
									<div>
										Z-Score:{" "}
										{
											stage1Logic.filterParams
												.zScoreThreshold
										}
										, Spike:{" "}
										{
											stage1Logic.filterParams
												.spikePercentage
										}
										%
									</div>
									<div>
										Duration:{" "}
										{
											stage1Logic.filterParams
												.minEventDuration
										}{" "}
										minutes, Gap:{" "}
										{stage1Logic.filterParams.maxTimeGap}{" "}
										minutes
									</div>
								</div>
								<div className="space-y-1">
									<div className="font-medium">
										Labeled Statistics
									</div>
									<div>
										Confirmed: {stage1Logic.labeledPositive}
									</div>
									<div>
										Rejected: {stage1Logic.labeledNormal}
									</div>
								</div>
							</div>
						)}
						{pendingDiffs.length > 0 && (
							<Alert className="mt-4 bg-yellow-50 border-yellow-200">
								<Info className="h-4 w-4 text-yellow-600" />
								<AlertDescription>
									<strong className="text-yellow-800">
										Pending Changes (not saved):
									</strong>
									<ul className="list-disc list-inside mt-1 text-yellow-700">
										{pendingDiffs.map((diff, index) => (
											<li key={index}>
												{diff.label}: {diff.from}{" "}
												<span className="mx-1">→</span>{" "}
												{diff.to}
											</li>
										))}
									</ul>
									<Button
										onClick={
											stage1Logic.handleSaveParameters
										}
										size="sm"
										className="mt-2 bg-yellow-600 hover:bg-yellow-700 text-white"
									>
										Save Pending Changes
									</Button>
								</AlertDescription>
							</Alert>
						)}
					</div>

					{/* Top-Level Date/Time Range Filter */}
					<div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
						<h4 className="font-semibold text-blue-800 mb-3 flex items-center">
							<Calendar className="h-4 w-4 mr-2" />
							Primary Time Range Filter
						</h4>
						<p className="text-blue-700 text-sm mb-4">
							Set the analysis time window to limit computational
							scope and enable focused analysis
						</p>
						<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
							<div className="space-y-2">
								<Label className="text-sm font-medium text-blue-800">
									Start Date
								</Label>
								<input
									type="date"
									value={
										stage1Logic.filterParams.startDate
											.toISOString()
											.split("T")[0]
									}
									onChange={(e) =>
										stage1Logic.updateFilterParam(
											"startDate",
											new Date(e.target.value),
										)
									}
									className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>
							<div className="space-y-2">
								<Label className="text-sm font-medium text-blue-800">
									Start Time (TW)
								</Label>
								<input
									type="time"
									value={stage1Logic.filterParams.startTime}
									onChange={(e) =>
										stage1Logic.updateFilterParam(
											"startTime",
											e.target.value,
										)
									}
									className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>
							<div className="space-y-2">
								<Label className="text-sm font-medium text-blue-800">
									End Date
								</Label>
								<input
									type="date"
									value={
										stage1Logic.filterParams.endDate
											.toISOString()
											.split("T")[0]
									}
									onChange={(e) =>
										stage1Logic.updateFilterParam(
											"endDate",
											new Date(e.target.value),
										)
									}
									className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>
							<div className="space-y-2">
								<Label className="text-sm font-medium text-blue-800">
									End Time (TW)
								</Label>
								<input
									type="time"
									value={stage1Logic.filterParams.endTime}
									onChange={(e) =>
										stage1Logic.updateFilterParam(
											"endTime",
											e.target.value,
										)
									}
									className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>
						</div>
					</div>

					{/* Filtering Rules Configuration */}
					<div className="bg-orange-50 p-4 rounded-lg">
						<h4 className="font-semibold text-orange-800 mb-4 flex items-center">
							<Settings className="h-4 w-4 mr-2" />
							Multi-Dimensional Filtering Rules
						</h4>

						{/* A. Value-based Rules */}
						<div className="mb-6">
							<h5 className="font-medium text-orange-700 mb-3">
								A. Value-based Anomaly Rules
							</h5>
							<p className="text-sm text-orange-600 mb-3">
								Focus on numerical value anomalies such as
								sudden power consumption spikes
							</p>
							<div className="grid md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label className="text-sm font-medium">
										Z-Score Threshold:{" "}
										{
											stage1Logic.filterParams
												.zScoreThreshold
										}
									</Label>
									<Slider
										min={0}
										max={5.0}
										step={0.1}
										value={[
											stage1Logic.filterParams
												.zScoreThreshold,
										]}
										onValueChange={(value) =>
											stage1Logic.updateFilterParam(
												"zScoreThreshold",
												value[0],
											)
										}
										className="w-full"
									/>
									<p className="text-xs text-gray-600">
										Individual comparison - detect values
										far from historical average
									</p>
								</div>
								<div className="space-y-2">
									<Label className="text-sm font-medium">
										Spike Threshold:{" "}
										{
											stage1Logic.filterParams
												.spikePercentage
										}
										% of baseline
									</Label>
									<Slider
										min={0}
										max={500}
										step={25}
										value={[
											stage1Logic.filterParams
												.spikePercentage,
										]}
										onValueChange={(value) =>
											stage1Logic.updateFilterParam(
												"spikePercentage",
												value[0],
											)
										}
										className="w-full"
									/>
									<p className="text-xs text-gray-600">
										Sudden consumption spike detection
									</p>
								</div>
							</div>
						</div>

						{/* B. Time-based Rules */}
						<div className="mb-6">
							<h5 className="font-medium text-orange-700 mb-3">
								B. Time-based Anomaly Rules
							</h5>
							<p className="text-sm text-orange-600 mb-3">
								Focus on temporal pattern anomalies
							</p>
							<div className="grid md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label className="text-sm font-medium">
										Min Event Duration:{" "}
										{
											stage1Logic.filterParams
												.minEventDuration
										}{" "}
										minutes
									</Label>
									<Slider
										min={0}
										max={120}
										step={15}
										value={[
											stage1Logic.filterParams
												.minEventDuration,
										]}
										onValueChange={(value) =>
											stage1Logic.updateFilterParam(
												"minEventDuration",
												value[0],
											)
										}
										className="w-full"
									/>
									<p className="text-xs text-gray-600">
										Capture events with excessive duration
									</p>
								</div>
								<div className="space-y-2">
									<Label className="text-sm font-medium">
										Weekend/Holiday Pattern Detection
									</Label>
									<div className="flex items-center space-x-2">
										<input
											type="checkbox"
											checked={
												stage1Logic.filterParams
													.weekendHolidayDetection
											}
											onChange={(e) =>
												stage1Logic.updateFilterParam(
													"weekendHolidayDetection",
													e.target.checked,
												)
											}
											className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
										/>
										<span className="text-sm text-gray-700">
											{stage1Logic.filterParams
												.weekendHolidayDetection
												? "Enabled"
												: "Disabled"}
										</span>
									</div>
									<p className="text-xs text-gray-600">
										Detect activity during unexpected times
									</p>
								</div>
							</div>
						</div>

						{/* C. Data Integrity Rules */}
						<div className="mb-6">
							<h5 className="font-medium text-orange-700 mb-3">
								C. Data Integrity Rules (New)
							</h5>
							<p className="text-sm text-orange-600 mb-3">
								Focus on data continuity anomalies, capturing
								communication failures or power outages
							</p>
							<div className="space-y-2">
								<Label className="text-sm font-medium">
									Max Time Gap Between Records:{" "}
									{stage1Logic.filterParams.maxTimeGap}{" "}
									minutes
								</Label>
								<Slider
									min={0}
									max={180}
									step={15}
									value={[
										stage1Logic.filterParams.maxTimeGap,
									]}
									onValueChange={(value) =>
										stage1Logic.updateFilterParam(
											"maxTimeGap",
											value[0],
										)
									}
									className="w-full"
								/>
								<p className="text-xs text-gray-600">
									Identify excessive gaps between data records
								</p>
							</div>
						</div>

						{/* D. Peer Comparison Rules */}
						<div className="mb-6">
							<h5 className="font-medium text-orange-700 mb-3">
								D. Peer Comparison Rules (New)
							</h5>
							<p className="text-sm text-orange-600 mb-3">
								Focus on group-based comparisons to find user
								behavior anomalies relative to peer groups
							</p>
							<div className="grid md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label className="text-sm font-medium">
										Aggregation Window:{" "}
										{stage1Logic.filterParams.peerAggWindow}{" "}
										minutes
									</Label>
									<Slider
										min={0}
										max={60}
										step={5}
										value={[
											stage1Logic.filterParams
												.peerAggWindow,
										]}
										onValueChange={(value) =>
											stage1Logic.updateFilterParam(
												"peerAggWindow",
												value[0],
											)
										}
										className="w-full"
									/>
									<p className="text-xs text-gray-600">
										Time window for calculating average
										consumption
									</p>
								</div>
								<div className="space-y-2">
									<Label className="text-sm font-medium">
										Peer Exceed Threshold:{" "}
										{
											stage1Logic.filterParams
												.peerExceedPercentage
										}
										% above peer average
									</Label>
									<Slider
										min={0}
										max={300}
										step={10}
										value={[
											stage1Logic.filterParams
												.peerExceedPercentage,
										]}
										onValueChange={(value) =>
											stage1Logic.updateFilterParam(
												"peerExceedPercentage",
												value[0],
											)
										}
										className="w-full"
									/>
									<p className="text-xs text-gray-600">
										Threshold for triggering peer comparison
										anomaly
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Results Summary */}
					<Card className="bg-green-50 border-green-200">
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<h4 className="text-lg font-bold text-green-800 mb-2">
										Stage 1 Results
									</h4>
									<p className="text-green-700">
										Based on the above rules and date range,
										the system will filter{" "}
										<Badge
											variant="secondary"
											className="mx-1 bg-green-100 text-green-800"
										>
											{stage1Logic.isCalculating ? (
												<span className="flex items-center gap-1">
													<Loader2 className="h-3 w-3 animate-spin" />
													Calculating...
												</span>
											) : (
												stage1Logic.candidateCount.toLocaleString()
											)}
										</Badge>
										candidate events from the specified data
										range.
									</p>
									{/* 搜尋條件（使用最近一次計算的參數快照） */}
									{stage1Logic.lastCalculatedParams &&
										!stage1Logic.isCalculating && (
											<div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-green-900">
												<div className="space-y-1 p-3 rounded-md bg-green-50 border border-green-200">
													<div className="font-medium">
														Search Conditions
													</div>
													<div>
														Time (TW):{" "}
														{
															stage1Logic
																.lastCalculatedParams
																.startTime
														}{" "}
														-{" "}
														{
															stage1Logic
																.lastCalculatedParams
																.endTime
														}
													</div>
													<div>
														Date:{" "}
														{stage1Logic.lastCalculatedParams.startDate.toLocaleDateString()}{" "}
														-{" "}
														{stage1Logic.lastCalculatedParams.endDate.toLocaleDateString()}
													</div>
													<div>
														Z-Score:{" "}
														{
															stage1Logic
																.lastCalculatedParams
																.zScoreThreshold
														}
													</div>
													<div>
														Spike:{" "}
														{
															stage1Logic
																.lastCalculatedParams
																.spikePercentage
														}
														%
													</div>
													<div>
														Min duration:{" "}
														{
															stage1Logic
																.lastCalculatedParams
																.minEventDuration
														}{" "}
														minutes
													</div>
													<div>
														Weekend/Holiday:{" "}
														{stage1Logic
															.lastCalculatedParams
															.weekendHolidayDetection
															? "Enabled"
															: "Disabled"}
													</div>
													<div>
														Max time gap:{" "}
														{
															stage1Logic
																.lastCalculatedParams
																.maxTimeGap
														}{" "}
														minutes
													</div>
													<div>
														Peer window:{" "}
														{
															stage1Logic
																.lastCalculatedParams
																.peerAggWindow
														}{" "}
														minutes
													</div>
													<div>
														Peer exceed:{" "}
														{
															stage1Logic
																.lastCalculatedParams
																.peerExceedPercentage
														}
														%
													</div>
												</div>
											</div>
										)}
									{stage1Logic.candidateStats &&
										!stage1Logic.isCalculating && (
											<div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-green-900">
												<div className="space-y-1 p-3 rounded-md bg-green-50 border border-green-200">
													<div className="font-medium">
														Data Overview
													</div>
													<div>
														Total records:{" "}
														{stage1Logic.candidateStats.total_records?.toLocaleString?.() ??
															stage1Logic
																.candidateStats
																.data_range
																?.total_records ??
															"-"}
													</div>
													<div>
														Devices:{" "}
														{stage1Logic
															.candidateStats
															.unique_devices ??
															"-"}
													</div>
													{typeof stage1Logic
														.candidateStats
														.insufficient_data_devices ===
														"number" && (
														<div>
															Devices skipped
															(insufficient data):{" "}
															{
																stage1Logic
																	.candidateStats
																	.insufficient_data_devices
															}
														</div>
													)}
													{stage1Logic.candidateStats
														.time_range?.start && (
														<div>
															Range:{" "}
															{new Date(
																stage1Logic
																	.candidateStats
																	.time_range
																	.start,
															).toLocaleString()}{" "}
															-{" "}
															{new Date(
																stage1Logic
																	.candidateStats
																	.time_range
																	.end,
															).toLocaleString()}
														</div>
													)}
													{Array.isArray(
														stage1Logic
															.candidateStats
															.records_by_date,
													) &&
														stage1Logic
															.candidateStats
															.records_by_date
															.length > 0 && (
															<div className="pt-2">
																<div className="font-medium mb-1">
																	Records by
																	Day
																</div>
																<ul className="list-disc list-inside max-h-40 overflow-auto">
																	{stage1Logic.candidateStats.records_by_date.map(
																		(
																			r: any,
																		) => (
																			<li
																				key={
																					r.date
																				}
																			>
																				{
																					r.date
																				}
																				:{" "}
																				{
																					r.count
																				}
																			</li>
																		),
																	)}
																</ul>
															</div>
														)}
												</div>
												<div className="space-y-1 p-3 rounded-md bg-green-50 border border-green-200">
													<div className="font-medium">
														Rule Contributions
													</div>
													<div>
														Z-Score:{" "}
														{stage1Logic
															.candidateStats
															.per_rule
															?.zscore_estimate ??
															"-"}
													</div>
													<div>
														Spike:{" "}
														{stage1Logic
															.candidateStats
															.per_rule
															?.spike_estimate ??
															"-"}
													</div>
													<div>
														Time:{" "}
														{stage1Logic
															.candidateStats
															.per_rule
															?.time_estimate ??
															"-"}
													</div>
													<div>
														Gap:{" "}
														{stage1Logic
															.candidateStats
															.per_rule
															?.gap_estimate ??
															"-"}
													</div>
													<div>
														Peer:{" "}
														{stage1Logic
															.candidateStats
															.per_rule
															?.peer_estimate ??
															"-"}
													</div>
												</div>
												<div className="space-y-1 p-3 rounded-md bg-green-50 border border-green-200">
													<div className="font-medium">
														Estimation Summary
													</div>
													<div>
														Before overlap:{" "}
														{stage1Logic
															.candidateStats
															.total_estimated_before_overlap ??
															"-"}
													</div>
													<div>
														Overlap factor:{" "}
														{stage1Logic
															.candidateStats
															.overlap_reduction_factor ??
															"-"}
													</div>
													<div>
														Adjusted total:{" "}
														{stage1Logic
															.candidateStats
															.overlap_adjusted_total ??
															"-"}
													</div>
												</div>
												{Array.isArray(
													stage1Logic.candidateStats
														.top_devices_by_estimated_anomalies,
												) &&
													stage1Logic.candidateStats
														.top_devices_by_estimated_anomalies
														.length > 0 && (
														<div className="md:col-span-3 p-3 rounded-md bg-green-50 border border-green-200">
															<div className="font-medium mb-1">
																Top devices by
																estimated
																anomalies
															</div>
                                                        <ul className="list-disc list-inside">
                                                            {stage1Logic.candidateStats.top_devices_by_estimated_anomalies.map(
                                                                (d: any) => (
                                                                    <li key={d.deviceNumber}>
                                                                        Device {d.deviceNumber}: {d.estimated_anomalies}
                                                                    </li>
                                                                ),
                                                            )}
                                                        </ul>
														</div>
													)}
											</div>
										)}
									{/* 手動計算按鈕 */}
									<div className="mt-3">
										<Button
											onClick={
												stage1Logic.handleCalculateCandidates
											}
											disabled={stage1Logic.isCalculating}
											size="sm"
											variant="outline"
											className="text-green-700 border-green-300 hover:bg-green-100"
										>
											{stage1Logic.isCalculating ? (
												<>
													<Loader2 className="h-4 w-4 mr-2 animate-spin" />
													Calculating...
												</>
											) : (
												<>
													<Play className="h-4 w-4 mr-2" />
													Calculate Candidates
												</>
											)}
										</Button>
									</div>
								</div>
								<div className="text-right">
									<div className="text-3xl font-bold text-green-600">
										{stage1Logic.isCalculating ? (
											<Loader2 className="h-8 w-8 animate-spin mx-auto" />
										) : (
											stage1Logic.candidateCount.toLocaleString()
										)}
									</div>
									<div className="text-sm text-green-600">
										Candidates
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Progress to Stage 2 */}
					<div className="flex justify-center pt-4">
						<Button
							onClick={() => {
								stage1Logic.handleGenerateCandidates();
								onProceedToStage2();
							}}
							size="lg"
							disabled={
								!stage1Logic.selectedRunId ||
								stage1Logic.isGenerating ||
								stage1Logic.candidateCount === 0
							}
							className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
						>
							{stage1Logic.isGenerating ? (
								<>
									<Loader2 className="h-5 w-5 mr-2 animate-spin" />
									Generating Events...
								</>
							) : (
								<>
									<ArrowRight className="h-5 w-5 mr-2" />
									Proceed to Manual Verification & Labeling
								</>
							)}
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Stage 2 Preview */}
			<Card className="border-purple-200">
				<CardHeader>
					<CardTitle className="flex items-center text-xl text-purple-800">
						<Users className="h-5 w-5 mr-2" />
						Stage 2: Expert Manual Verification & Labeling
					</CardTitle>
					<p className="text-purple-600 text-sm">
						Manual review and annotation of candidate events by
						domain experts
					</p>
				</CardHeader>
				<CardContent>
					<Alert>
						<ArrowRight className="h-4 w-4 rotate-0" />
						<AlertDescription>
							<strong>Next Step:</strong> You will review and
							label the{" "}
							{stage1Logic.candidateCount.toLocaleString()}{" "}
							candidate events to create high-quality positive
							samples for model training. This step is crucial for
							the success of the PU Learning approach.
						</AlertDescription>
					</Alert>
				</CardContent>
			</Card>
		</>
	);
}
