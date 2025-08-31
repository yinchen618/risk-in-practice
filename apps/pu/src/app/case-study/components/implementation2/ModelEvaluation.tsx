"use client";

import { LaTeX } from "@/components/LaTeX";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle2, ClipboardCheck } from "lucide-react";

export default function ModelEvaluation() {
	return (
		<section id="model-evaluation" className="scroll-mt-6">
			<Card className="bg-white shadow-lg">
				<CardHeader>
					<h2 className="text-base font-semibold uppercase text-blue-600 tracking-wider">
						Part 3: Model Evaluation
					</h2>
					<CardTitle className="text-3xl font-bold text-gray-800 flex items-center gap-3">
						<ClipboardCheck className="h-8 w-8 text-teal-600" />
						Model Evaluation: Dual Metrics for Verifying Performance
					</CardTitle>
					<p className="text-lg text-gray-500 pt-2">
						Standard metrics can be misleading in PU scenarios. We
						adopt a dual-metric approach for a more accurate
						assessment.
					</p>
				</CardHeader>
				<CardContent className="grid md:grid-cols-2 gap-6">
					{/* Limitations of Traditional Metrics */}
					<div className="p-4 rounded-lg border border-amber-300 bg-amber-50">
						<h4 className="text-xl font-semibold text-amber-800 flex items-center gap-2 mb-3">
							<AlertTriangle className="h-6 w-6" />
							Limitations of Traditional Metrics
						</h4>
						<p className="text-gray-700 mb-2">
							Metrics like F1-Score, Precision, and Recall provide
							a baseline but must be interpreted with caution.
						</p>
						<div className="text-sm font-semibold text-red-600 p-3 bg-red-100 border border-red-200 rounded">
							<strong>Caveat:</strong> In the test set, labels of
							'0' represent 'Unlabeled' data, not 'Confirmed
							Negative'. This mixture of true negatives and
							unknown positives can artificially deflate precision
							scores.
						</div>
					</div>

					{/* Key PU Learning Metrics */}
					<div className="p-4 rounded-lg border border-green-300 bg-green-50">
						<h4 className="text-xl font-semibold text-green-800 flex items-center gap-2 mb-3">
							<CheckCircle2 className="h-6 w-6" />
							Key Performance Metrics in PU Scenarios
						</h4>
						<p className="text-gray-700 mb-2">
							We focus on two more reliable indicators:
						</p>
						<ul className="space-y-3 text-sm">
							<li className="p-3 bg-white rounded border">
								<strong className="block text-green-700">
									True Positive Recall
								</strong>
								Measures how many of the known positive samples
								were correctly identified. This is our most
								reliable metric as it is based solely on
								confirmed data.
							</li>
							<li className="p-3 bg-white rounded border">
								<strong className="block text-green-700">
									Estimated Positive Rate in Unlabeled
								</strong>
								Indicates the proportion of the unlabeled set
								that the model classifies as positive. Comparing
								this value to our initial class prior (
								<LaTeX>{"$\\pi_p$"}</LaTeX>) helps validate if
								the model has learned the underlying data
								distribution.
							</li>
						</ul>
					</div>
				</CardContent>
			</Card>
		</section>
	);
}
