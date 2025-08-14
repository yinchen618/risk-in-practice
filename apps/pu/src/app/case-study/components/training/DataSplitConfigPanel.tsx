"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Database, PieChart } from "lucide-react";
import { useMemo } from "react";

interface DataSplitConfigPanelProps {
	// 數據切分配置
	enabled: boolean;
	trainRatio: number;
	validationRatio: number;
	testRatio: number;

	// 控制函數
	onEnabledChange: (enabled: boolean) => void;
	onTrainRatioChange: (ratio: number) => void;
	onValidationRatioChange: (ratio: number) => void;
	onTestRatioChange: (ratio: number) => void;

	// 樣本統計（用於顯示實際數量）
	totalPositiveSamples: number;
}

export function DataSplitConfigPanel({
	enabled,
	trainRatio,
	validationRatio,
	testRatio,
	onEnabledChange,
	onTrainRatioChange,
	onValidationRatioChange,
	onTestRatioChange,
	totalPositiveSamples,
}: DataSplitConfigPanelProps) {
	// 計算實際樣本數量
	const sampleCounts = useMemo(() => {
		if (!enabled || totalPositiveSamples === 0) {
			return {
				train: totalPositiveSamples,
				validation: 0,
				test: 0,
			};
		}

		return {
			train: Math.floor(totalPositiveSamples * trainRatio),
			validation: Math.floor(totalPositiveSamples * validationRatio),
			test: Math.floor(totalPositiveSamples * testRatio),
		};
	}, [enabled, totalPositiveSamples, trainRatio, validationRatio, testRatio]);

	// 處理比例調整，確保總和為 100%
	const handleTrainRatioChange = (newRatio: number) => {
		const remaining = 1 - newRatio;
		const currentValidationTest = validationRatio + testRatio;

		if (currentValidationTest > 0) {
			// 按比例調整 validation 和 test
			const validationScale = validationRatio / currentValidationTest;
			const testScale = testRatio / currentValidationTest;

			onTrainRatioChange(newRatio);
			onValidationRatioChange(remaining * validationScale);
			onTestRatioChange(remaining * testScale);
		} else {
			// 如果 validation + test = 0，平均分配
			onTrainRatioChange(newRatio);
			onValidationRatioChange(remaining / 2);
			onTestRatioChange(remaining / 2);
		}
	};

	const handleValidationRatioChange = (newRatio: number) => {
		const remaining = 1 - trainRatio - newRatio;
		onValidationRatioChange(newRatio);
		onTestRatioChange(Math.max(0, remaining));
	};

	return (
		<Card className="border border-blue-200 bg-blue-50/30">
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-lg">
					<Database className="h-5 w-5" />
					Positive Sample Split Strategy
				</CardTitle>
				<p className="text-sm text-slate-600">
					Split positive samples into training, validation, and test
					sets to improve model evaluation reliability
				</p>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* 啟用開關 */}
				<div className="flex items-center space-x-2">
					<Checkbox
						id="enable-split"
						checked={enabled}
						onCheckedChange={(checked) =>
							onEnabledChange(!!checked)
						}
					/>
					<Label
						htmlFor="enable-split"
						className="text-sm font-medium cursor-pointer"
					>
						Enable Validation & Test Sets
					</Label>
				</div>

				{/* 比例設定器 - 只在啟用時顯示 */}
				{enabled && (
					<div className="space-y-4 pl-6">
						<Separator />
						<h4 className="font-medium text-slate-800 flex items-center gap-2">
							<PieChart className="h-4 w-4" />
							Split Ratios
						</h4>

						{/* 訓練集比例 */}
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<Label className="text-sm font-medium">
									Train Set
								</Label>
								<div className="flex items-center gap-2">
									<Input
										type="number"
										min={0.1}
										max={0.9}
										step={0.05}
										value={Math.round(trainRatio * 100)}
										onChange={(e) =>
											handleTrainRatioChange(
												Number(e.target.value) / 100,
											)
										}
										className="w-16 h-8 text-xs"
									/>
									<span className="text-xs text-slate-600">
										% ({sampleCounts.train} samples)
									</span>
								</div>
							</div>
							<Slider
								value={[trainRatio * 100]}
								onValueChange={([value]) =>
									handleTrainRatioChange(value / 100)
								}
								max={90}
								min={10}
								step={5}
								className="w-full"
							/>
						</div>

						{/* 驗證集比例 */}
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<Label className="text-sm font-medium">
									Validation Set
								</Label>
								<div className="flex items-center gap-2">
									<Input
										type="number"
										min={0.05}
										max={0.5}
										step={0.05}
										value={Math.round(
											validationRatio * 100,
										)}
										onChange={(e) =>
											handleValidationRatioChange(
												Number(e.target.value) / 100,
											)
										}
										className="w-16 h-8 text-xs"
									/>
									<span className="text-xs text-slate-600">
										% ({sampleCounts.validation} samples)
									</span>
								</div>
							</div>
							<Slider
								value={[validationRatio * 100]}
								onValueChange={([value]) =>
									handleValidationRatioChange(value / 100)
								}
								max={Math.min(50, (1 - trainRatio) * 100)}
								min={5}
								step={5}
								className="w-full"
							/>
						</div>

						{/* 測試集比例 - 只讀顯示 */}
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<Label className="text-sm font-medium">
									Test Set
								</Label>
								<div className="flex items-center gap-2">
									<div className="w-16 h-8 flex items-center justify-center text-xs bg-slate-100 border rounded-md">
										{Math.round(testRatio * 100)}
									</div>
									<span className="text-xs text-slate-600">
										% ({sampleCounts.test} samples)
									</span>
								</div>
							</div>
							<div className="h-2 bg-slate-200 rounded-full overflow-hidden">
								<div
									className="h-full bg-slate-500 transition-all duration-300"
									style={{ width: `${testRatio * 100}%` }}
								/>
							</div>
						</div>

						{/* 比例總覽 */}
						<div className="bg-slate-50 p-3 rounded-lg text-xs">
							<div className="flex justify-between items-center">
								<span className="font-medium">Total:</span>
								<span>
									{Math.round(
										(trainRatio +
											validationRatio +
											testRatio) *
											100,
									)}
									% ({totalPositiveSamples} samples)
								</span>
							</div>
						</div>

						{/* 說明文字 */}
						<div className="text-xs text-slate-500 bg-blue-50 p-3 rounded-lg">
							<p className="mb-1">
								<strong>Train Set:</strong> Used for model
								learning and weight updates
							</p>
							<p className="mb-1">
								<strong>Validation Set:</strong> Used for
								hyperparameter tuning and early stopping
							</p>
							<p>
								<strong>Test Set:</strong> Used for final model
								performance evaluation (Stage 4)
							</p>
						</div>
					</div>
				)}

				{/* 未啟用時的說明 */}
				{!enabled && (
					<div className="text-sm text-slate-500 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
						<p>
							When split strategy is disabled, all positive
							samples will be used for training. It is recommended
							to enable this feature for more reliable model
							evaluation.
						</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
