"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Eye, Target, TrendingUp } from "lucide-react";
import { useState } from "react";

interface TestMetrics {
	test_accuracy?: number;
	test_precision?: number;
	test_recall?: number;
	test_f1?: number;
}

interface ConfusionMatrixData {
	tp: number; // True Positive
	fp: number; // False Positive
	tn: number; // True Negative
	fn: number; // False Negative
}

interface KPIMetricsCardsProps {
	testMetrics?: TestMetrics;
	confusionMatrix?: ConfusionMatrixData;
	testSampleCount?: number;
}

export function KPIMetricsCards({
	testMetrics,
	confusionMatrix,
	testSampleCount,
}: KPIMetricsCardsProps) {
	const [isConfusionMatrixOpen, setIsConfusionMatrixOpen] = useState(false);

	if (!testMetrics) {
		return null;
	}

	const formatMetric = (value: number | undefined) => {
		return value !== undefined ? `${(value * 100).toFixed(1)}%` : "N/A";
	};

	const getMetricColor = (value: number | undefined) => {
		if (value === undefined) {
			return "text-gray-500";
		}
		if (value >= 0.8) {
			return "text-green-600";
		}
		if (value >= 0.6) {
			return "text-yellow-600";
		}
		return "text-red-600";
	};

	const getMetricBadgeVariant = (
		value: number | undefined,
	): "default" | "secondary" | "destructive" => {
		if (value === undefined) {
			return "secondary";
		}
		if (value >= 0.8) {
			return "default";
		}
		if (value >= 0.6) {
			return "secondary";
		}
		return "destructive";
	};

	const getMetricBackground = (value: number | undefined) => {
		if (value === undefined) {
			return "bg-gray-50";
		}
		if (value >= 0.8) {
			return "bg-green-50";
		}
		if (value >= 0.6) {
			return "bg-yellow-50";
		}
		return "bg-red-50";
	};

	const renderConfusionMatrix = () => {
		if (!confusionMatrix) {
			return (
				<div className="text-center py-8 text-muted-foreground">
					<p>混淆矩陣數據不可用</p>
					<p className="text-sm">
						可能是由於數據分割未啟用或測試集為空
					</p>
				</div>
			);
		}

		const { tp, fp, tn, fn } = confusionMatrix;
		const total = tp + fp + tn + fn;

		return (
			<div className="space-y-6">
				{/* 混淆矩陣視覺化 */}
				<div className="max-w-md mx-auto">
					<div className="grid grid-cols-3 gap-2 text-center">
						{/* 標題行 */}
						<div />
						<div className="font-semibold text-sm text-gray-600">
							預測陰性
						</div>
						<div className="font-semibold text-sm text-gray-600">
							預測陽性
						</div>

						{/* 實際陰性行 */}
						<div className="font-semibold text-sm text-gray-600 writing-mode-vertical-lr text-center">
							實際陰性
						</div>
						<div className="bg-blue-100 border-2 border-blue-300 p-4 rounded-lg">
							<div className="text-2xl font-bold text-blue-800">
								{tn}
							</div>
							<div className="text-xs text-blue-600">
								真陰性 (TN)
							</div>
							<div className="text-xs text-blue-600">
								{((tn / total) * 100).toFixed(1)}%
							</div>
						</div>
						<div className="bg-red-100 border-2 border-red-300 p-4 rounded-lg">
							<div className="text-2xl font-bold text-red-800">
								{fp}
							</div>
							<div className="text-xs text-red-600">
								假陽性 (FP)
							</div>
							<div className="text-xs text-red-600">
								{((fp / total) * 100).toFixed(1)}%
							</div>
						</div>

						{/* 實際陽性行 */}
						<div className="font-semibold text-sm text-gray-600 writing-mode-vertical-lr text-center">
							實際陽性
						</div>
						<div className="bg-red-100 border-2 border-red-300 p-4 rounded-lg">
							<div className="text-2xl font-bold text-red-800">
								{fn}
							</div>
							<div className="text-xs text-red-600">
								假陰性 (FN)
							</div>
							<div className="text-xs text-red-600">
								{((fn / total) * 100).toFixed(1)}%
							</div>
						</div>
						<div className="bg-green-100 border-2 border-green-300 p-4 rounded-lg">
							<div className="text-2xl font-bold text-green-800">
								{tp}
							</div>
							<div className="text-xs text-green-600">
								真陽性 (TP)
							</div>
							<div className="text-xs text-green-600">
								{((tp / total) * 100).toFixed(1)}%
							</div>
						</div>
					</div>
				</div>

				{/* 統計摘要 */}
				<div className="bg-gray-50 p-4 rounded-lg">
					<h4 className="font-medium text-gray-800 mb-3">
						混淆矩陣解讀
					</h4>
					<div className="grid grid-cols-2 gap-4 text-sm">
						<div>
							<span className="font-medium">總樣本數：</span>{" "}
							{total}
						</div>
						<div>
							<span className="font-medium">正確預測：</span>{" "}
							{tp + tn} ({(((tp + tn) / total) * 100).toFixed(1)}
							%)
						</div>
						<div>
							<span className="font-medium">實際陽性：</span>{" "}
							{tp + fn}
						</div>
						<div>
							<span className="font-medium">預測陽性：</span>{" "}
							{tp + fp}
						</div>
					</div>
				</div>

				{/* 指標計算 */}
				<div className="bg-blue-50 p-4 rounded-lg">
					<h4 className="font-medium text-blue-800 mb-3">
						指標計算公式
					</h4>
					<div className="space-y-2 text-sm text-blue-700">
						<div>
							<strong>準確率 (Accuracy):</strong> (TP + TN) / (TP
							+ TN + FP + FN) ={" "}
							{(((tp + tn) / total) * 100).toFixed(1)}%
						</div>
						<div>
							<strong>精確率 (Precision):</strong> TP / (TP + FP)
							={" "}
							{tp + fp > 0
								? ((tp / (tp + fp)) * 100).toFixed(1)
								: "N/A"}
							%
						</div>
						<div>
							<strong>召回率 (Recall):</strong> TP / (TP + FN) ={" "}
							{tp + fn > 0
								? ((tp / (tp + fn)) * 100).toFixed(1)
								: "N/A"}
							%
						</div>
						<div>
							<strong>F1 分數:</strong> 2 × (Precision × Recall) /
							(Precision + Recall)
						</div>
					</div>
				</div>
			</div>
		);
	};

	return (
		<Card className="border border-blue-200 bg-blue-50/30">
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-lg">
					<Target className="h-5 w-5" />
					模型性能關鍵指標 (KPI)
				</CardTitle>
				<div className="text-sm text-gray-600">
					測試集性能評估結果 ({testSampleCount || 0} 個測試樣本)
				</div>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* KPI 指標卡片 */}
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
					{/* F1 Score - 主要指標 */}
					<div
						className={`p-4 rounded-lg border-2 ${
							testMetrics.test_f1 && testMetrics.test_f1 >= 0.8
								? "border-green-300 bg-green-50"
								: testMetrics.test_f1 &&
										testMetrics.test_f1 >= 0.6
									? "border-yellow-300 bg-yellow-50"
									: "border-red-300 bg-red-50"
						}`}
					>
						<div className="text-xs text-gray-600 font-medium mb-1">
							F1 分數 ⭐
						</div>
						<div
							className={`text-3xl font-bold ${getMetricColor(testMetrics.test_f1)}`}
						>
							{formatMetric(testMetrics.test_f1)}
						</div>
						<Badge
							variant={getMetricBadgeVariant(testMetrics.test_f1)}
							className="mt-2 text-xs"
						>
							平衡性能指標
						</Badge>
					</div>

					{/* Precision */}
					<div
						className={`p-4 rounded-lg border ${getMetricBackground(testMetrics.test_precision)}`}
					>
						<div className="text-xs text-gray-600 font-medium mb-1">
							精確率
						</div>
						<div
							className={`text-2xl font-bold ${getMetricColor(testMetrics.test_precision)}`}
						>
							{formatMetric(testMetrics.test_precision)}
						</div>
						<Badge
							variant={getMetricBadgeVariant(
								testMetrics.test_precision,
							)}
							className="mt-2 text-xs"
						>
							陽性預測品質
						</Badge>
					</div>

					{/* Recall */}
					<div
						className={`p-4 rounded-lg border ${getMetricBackground(testMetrics.test_recall)}`}
					>
						<div className="text-xs text-gray-600 font-medium mb-1">
							召回率
						</div>
						<div
							className={`text-2xl font-bold ${getMetricColor(testMetrics.test_recall)}`}
						>
							{formatMetric(testMetrics.test_recall)}
						</div>
						<Badge
							variant={getMetricBadgeVariant(
								testMetrics.test_recall,
							)}
							className="mt-2 text-xs"
						>
							異常檢測率
						</Badge>
					</div>

					{/* Accuracy */}
					<div
						className={`p-4 rounded-lg border ${getMetricBackground(testMetrics.test_accuracy)}`}
					>
						<div className="text-xs text-gray-600 font-medium mb-1">
							準確率
						</div>
						<div
							className={`text-2xl font-bold ${getMetricColor(testMetrics.test_accuracy)}`}
						>
							{formatMetric(testMetrics.test_accuracy)}
						</div>
						<Badge
							variant={getMetricBadgeVariant(
								testMetrics.test_accuracy,
							)}
							className="mt-2 text-xs"
						>
							總體正確性
						</Badge>
					</div>
				</div>

				{/* 混淆矩陣按鈕 */}
				<div className="flex justify-center">
					<Dialog
						open={isConfusionMatrixOpen}
						onOpenChange={setIsConfusionMatrixOpen}
					>
						<DialogTrigger asChild>
							<Button
								variant="outline"
								className="flex items-center gap-2"
							>
								<Eye className="h-4 w-4" />
								查看混淆矩陣
							</Button>
						</DialogTrigger>
						<DialogContent className="max-w-2xl">
							<DialogHeader>
								<DialogTitle className="flex items-center gap-2">
									<Target className="h-5 w-5" />
									測試集混淆矩陣分析
								</DialogTitle>
								<DialogDescription>
									詳細的預測結果分佈和性能指標計算
								</DialogDescription>
							</DialogHeader>
							{renderConfusionMatrix()}
						</DialogContent>
					</Dialog>
				</div>

				{/* 性能解讀 */}
				<div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
					<h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
						<TrendingUp className="h-4 w-4" />
						性能解讀指南
					</h4>
					<div className="text-sm text-blue-700 space-y-1">
						<p>
							<strong>F1 分數:</strong>{" "}
							{formatMetric(testMetrics.test_f1)} -
							{testMetrics.test_f1 && testMetrics.test_f1 >= 0.8
								? " 優秀的平衡性能"
								: testMetrics.test_f1 &&
										testMetrics.test_f1 >= 0.6
									? " 中等的平衡性能"
									: " 需要改進的平衡性能"}
						</p>
						<p>
							<strong>精確率:</strong>{" "}
							{formatMetric(testMetrics.test_precision)} -
							預測為異常的樣本中，實際為異常的比例
						</p>
						<p>
							<strong>召回率:</strong>{" "}
							{formatMetric(testMetrics.test_recall)} -
							實際異常樣本中，被成功檢測出的比例
						</p>
						<p>
							<strong>準確率:</strong>{" "}
							{formatMetric(testMetrics.test_accuracy)} -
							所有預測中正確的比例
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
