"use client";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Settings } from "lucide-react";
import { D3ParameterChart } from "./D3ParameterChart";

export interface FilteringRulesParams {
	zScoreThreshold: number;
	spikePercentage: number;
	minEventDuration: number;
	weekendHolidayDetection: boolean;
	maxTimeGap: number;
	peerAggWindow: number;
	peerExceedPercentage: number;
}

interface FilteringRulesConfigProps {
	filterParams: FilteringRulesParams;
	onFilterChange: (key: keyof FilteringRulesParams, value: any) => void;
}

export function FilteringRulesConfig({
	filterParams,
	onFilterChange,
}: FilteringRulesConfigProps) {
	return (
		<div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
			<h4 className="font-semibold text-slate-700 mb-4 flex items-center">
				<Settings className="h-4 w-4 mr-2" />
				Multi-Dimensional Filtering Rules
			</h4>

			{/* A. Value-based Rules */}
			<div className="mb-6">
				<h5 className="font-medium text-slate-600 mb-3">
					A. Value-based Anomaly Rules
				</h5>
				<p className="text-sm text-slate-500 mb-3">
					Focus on numerical value anomalies such as sudden power
					consumption spikes
				</p>
				<div className="grid md:grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label className="text-sm font-medium">
							Z-Score Threshold: {filterParams.zScoreThreshold}
						</Label>
						<div className="flex items-center gap-3">
							<Slider
								min={1.0}
								max={4.0}
								step={0.1}
								value={[filterParams.zScoreThreshold]}
								onValueChange={(value) =>
									onFilterChange("zScoreThreshold", value[0])
								}
								className="flex-1"
							/>
							<D3ParameterChart
								parameterType="zscore"
								threshold={filterParams.zScoreThreshold}
								width={160}
								height={80}
							/>
						</div>
						<p className="text-xs text-gray-600">
							Individual comparison - detect values far from
							historical average (Recommended: 2.0-3.0)
						</p>
					</div>
					<div className="space-y-2">
						<Label className="text-sm font-medium">
							Spike Threshold: {filterParams.spikePercentage}% of
							baseline
						</Label>
						<div className="flex items-center gap-3">
							<Slider
								min={25}
								max={200}
								step={5}
								value={[filterParams.spikePercentage]}
								onValueChange={(value) =>
									onFilterChange("spikePercentage", value[0])
								}
								className="flex-1"
							/>
							<D3ParameterChart
								parameterType="spike"
								threshold={filterParams.spikePercentage}
								width={160}
								height={80}
							/>
						</div>
						<p className="text-xs text-gray-600">
							Sudden consumption spike detection (Recommended:
							50-100% above baseline)
						</p>
					</div>
				</div>
			</div>

			{/* B. Time-based Rules */}
			<div className="mb-6">
				<h5 className="font-medium text-slate-600 mb-3">
					B. Time-based Anomaly Rules
				</h5>
				<p className="text-sm text-slate-500 mb-3">
					Focus on temporal pattern anomalies
				</p>
				<div className="grid md:grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label className="text-sm font-medium">
							Min Event Duration: {filterParams.minEventDuration}{" "}
							minutes
						</Label>
						<div className="flex items-center gap-3">
							<Slider
								min={0}
								max={120}
								step={15}
								value={[filterParams.minEventDuration]}
								onValueChange={(value) =>
									onFilterChange("minEventDuration", value[0])
								}
								className="flex-1"
							/>
							<D3ParameterChart
								parameterType="duration"
								threshold={filterParams.minEventDuration}
								width={160}
								height={80}
							/>
						</div>
						<p className="text-xs text-gray-600">
							Capture events with excessive duration
						</p>
					</div>
					<div className="space-y-2">
						<Label className="text-sm font-medium">
							Weekend/Holiday Pattern Detection
						</Label>
						<div className="flex items-center gap-3">
							<div className="flex items-center space-x-2">
								<input
									type="checkbox"
									checked={
										filterParams.weekendHolidayDetection
									}
									onChange={(e) =>
										onFilterChange(
											"weekendHolidayDetection",
											e.target.checked,
										)
									}
									className="h-4 w-4 text-slate-500 focus:ring-slate-400 border-gray-300 rounded"
								/>
								<span className="text-sm text-gray-700">
									{filterParams.weekendHolidayDetection
										? "Enabled"
										: "Disabled"}
								</span>
							</div>
							<D3ParameterChart
								parameterType="weekendHoliday"
								threshold={0}
								enabled={filterParams.weekendHolidayDetection}
								width={160}
								height={80}
							/>
						</div>
						<p className="text-xs text-gray-600">
							Detect activity during unexpected times
						</p>
					</div>
				</div>
			</div>

			{/* C. Data Integrity Rules */}
			<div className="mb-6">
				<h5 className="font-medium text-slate-600 mb-3">
					C. Data Integrity Rules
				</h5>
				<p className="text-sm text-slate-500 mb-3">
					Focus on data continuity anomalies, capturing communication
					failures or power outages
				</p>
				<div className="space-y-2">
					<Label className="text-sm font-medium">
						Max Time Gap Between Records: {filterParams.maxTimeGap}{" "}
						minutes
					</Label>
					<div className="flex items-center gap-3">
						<Slider
							min={0}
							max={180}
							step={15}
							value={[filterParams.maxTimeGap]}
							onValueChange={(value) =>
								onFilterChange("maxTimeGap", value[0])
							}
							className="flex-1"
						/>
						<D3ParameterChart
							parameterType="timegap"
							threshold={filterParams.maxTimeGap}
							width={160}
							height={80}
						/>
					</div>
					<p className="text-xs text-gray-600">
						Identify excessive gaps between data records
					</p>
				</div>
			</div>

			{/* D. Peer Comparison Rules */}
			<div className="mb-6">
				<h5 className="font-medium text-slate-600 mb-3">
					D. Peer Comparison Rules
				</h5>
				<p className="text-sm text-slate-500 mb-3">
					Focus on group-based comparisons to find user behavior
					anomalies relative to peer groups
				</p>
				<div className="grid md:grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label className="text-sm font-medium">
							Aggregation Window: {filterParams.peerAggWindow}{" "}
							minutes
						</Label>
						<div className="flex items-center gap-3">
							<Slider
								min={0}
								max={60}
								step={5}
								value={[filterParams.peerAggWindow]}
								onValueChange={(value) =>
									onFilterChange("peerAggWindow", value[0])
								}
								className="flex-1"
							/>
							<div className="w-[120px] h-[60px] bg-slate-100 border border-slate-200 rounded flex items-center justify-center">
								<span className="text-xs text-slate-500">
									Window: {filterParams.peerAggWindow}m
								</span>
							</div>
						</div>
						<p className="text-xs text-gray-600">
							Time window for calculating average consumption
						</p>
					</div>
					<div className="space-y-2">
						<Label className="text-sm font-medium">
							Peer Exceed Threshold:{" "}
							{filterParams.peerExceedPercentage}% above peer
							average
						</Label>
						<div className="flex items-center gap-3">
							<Slider
								min={10}
								max={150}
								step={5}
								value={[filterParams.peerExceedPercentage]}
								onValueChange={(value) =>
									onFilterChange(
										"peerExceedPercentage",
										value[0],
									)
								}
								className="flex-1"
							/>
							<D3ParameterChart
								parameterType="peer"
								threshold={filterParams.peerExceedPercentage}
								width={160}
								height={80}
							/>
						</div>
						<p className="text-xs text-gray-600">
							Threshold for triggering peer comparison anomaly
							(Recommended: 20-80% above peer average)
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
