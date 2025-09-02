"use client";

import { LaTeX } from "@/components/LaTeX";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, School } from "lucide-react";
import React from "react";

export default function ReferencesTab() {
	return (
		<div className="max-w-4xl mx-auto space-y-12">
			{/* 1. Page Header */}
			<div className="text-center">
				<h1 className="text-4xl font-bold  text-slate-800 mb-4">
					References & Theoretical Foundations
				</h1>
				<p className="text-lg text-slate-600 max-w-3xl mx-auto">
					This section summarizes the core academic papers from
					Sugiyama Lab that form the theoretical bedrock of this
					project, particularly the seminal works on unbiased (uPU)
					and non-negative (nnPU) learning.
				</p>
			</div>

			{/* 2. Core Papers Analysis */}
			<Card className="shadow-lg border">
				<CardHeader>
					<CardTitle className="text-2xl font-semibold text-slate-800 flex items-center gap-3">
						<BookOpen className="h-6 w-6 text-blue-700" />
						Core Foundations: uPU & nnPU
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6 divide-y">
					{/* uPU */}
					<div className="pt-6">
						<h4 className="text-xl font-bold text-slate-800 mb-2">
							[1] Analysis of Learning from Positive and Unlabeled
							Data
						</h4>
						<p className="text-sm text-slate-500 mb-3">
							du Plessis, M. C., Niu, G., & Sugiyama, M. NIPS 2014
						</p>
						<p className="text-slate-700 text-sm mb-3">
							Introduced the unbiased PU (uPU) risk estimator,
							enabling classification with only positive and
							unlabeled data. Presented at Neural Information
							Processing Systems (NIPS2014), Montreal, Quebec,
							Canada.
						</p>
						<div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r-md text-xs text-blue-700">
							Used as baseline in my experiments to highlight
							stability improvements in nnPU.
						</div>
					</div>

					{/* nnPU */}
					<div className="pt-6">
						<h4 className="text-xl font-bold text-slate-800 mb-2">
							[2] Positive-Unlabeled Learning with Non-Negative
							Risk Estimator
						</h4>
						<p className="text-sm text-slate-500 mb-3">
							Kiryo, R., du Plessis, M. C., Niu, G., & Sugiyama,
							M. NIPS 2017
						</p>
						<p className="text-slate-700 text-sm mb-3">
							Proposed the non-negative PU (nnPU) risk estimator,
							preventing negative risk and stabilizing training
							for deep models. Presented at Neural Information
							Processing Systems (NIPS2017), Long Beach,
							California, USA.
						</p>
						<div className="bg-green-50 border-l-4 border-green-500 p-3 rounded-r-md text-xs text-green-700">
							Core method implemented in this project, enabling
							LSTM training without overfitting.
						</div>
					</div>
				</CardContent>
			</Card>

			{/* 3. Theoretical Summary & Comparison */}
			<Card className="shadow-lg border">
				<CardHeader>
					<CardTitle className="text-2xl font-semibold text-slate-800">
						Theoretical Summary: uPU vs. nnPU
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead>
								<tr className="border-b">
									<th className="text-left p-3 font-semibold text-slate-600 w-1/4">
										Aspect
									</th>
									<th className="text-left p-3 font-semibold text-slate-800">
										Unbiased PU Learning (uPU)
									</th>
									<th className="text-left p-3 font-semibold text-slate-800">
										Non-negative PU Learning (nnPU)
									</th>
								</tr>
							</thead>
							<tbody>
								<tr className="border-b">
									<td className="p-3 font-medium text-slate-600">
										Risk Estimator
									</td>
									<td className="p-3 font-mono">
										<LaTeX displayMode={false}>
											{
												"\\hat{R}_{\\text{pu}} = \\pi_p \\hat{R}_{p}^{+} - \\pi_p \\hat{R}_{p}^{-} + \\hat{R}_{u}^{-}"
											}
										</LaTeX>
									</td>
									<td className="p-3 font-mono">
										<LaTeX displayMode={false}>
											{
												"\\tilde{R}_{\\text{pu}} = \\pi_p \\hat{R}_{p}^{+} + \\max\\{0, \\hat{R}_{u}^{-} - \\pi_p \\hat{R}_{p}^{-}\\}"
											}
										</LaTeX>
									</td>
								</tr>
								<tr className="border-b">
									<td className="p-3 font-medium text-slate-600">
										Key Idea
									</td>
									<td className="p-3 text-slate-700">
										Unbiasedly estimates risk without
										negative labels.
									</td>
									<td className="p-3 text-slate-700">
										Adds a non-negative constraint to
										prevent overfitting.
									</td>
								</tr>
								<tr className="border-b">
									<td className="p-3 font-medium text-slate-600">
										Primary Loss
									</td>
									<td className="p-3 text-slate-700">
										Typically Squared Loss for a closed-form
										solution.
									</td>
									<td className="p-3 text-slate-700">
										Any classification loss (e.g.,
										Sigmoid/Logistic) for gradient-based
										optimization.
									</td>
								</tr>
								<tr>
									<td className="p-3 font-medium text-slate-600">
										Failure Mode
									</td>
									<td className="p-3 text-red-600">
										Risk can become negative, leading to
										severe overfitting, especially with
										complex models.
									</td>
									<td className="p-3 text-slate-700">
										Relatively robust, but still sensitive
										to severe class prior misestimation.
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</CardContent>
			</Card>
			<Card className="shadow-lg border">
				<CardHeader>
					<CardTitle className="text-2xl font-semibold text-slate-800">
						Theoretical Summary: uPU vs. nnPU
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="overflow-x-auto">
						<table className="w-full text-sm border border-slate-200">
							<thead>
								<tr className="bg-slate-50 border-b">
									<th className="text-left p-3 font-semibold text-slate-600 w-1/4">
										Aspect
									</th>
									<th className="text-left p-3 font-semibold text-blue-800">
										uPU (NIPS 2014)
									</th>
									<th className="text-left p-3 font-semibold text-green-800">
										nnPU (NIPS 2017)
									</th>
								</tr>
							</thead>
							<tbody>
								<tr className="border-b">
									<td className="p-3 font-medium text-slate-600">
										PU Risk Definition
									</td>
									<td className="p-3 font-mono">
										<LaTeX displayMode={false}>
											{
												"\\hat{R}_{\\text{pu}} = \\pi_p \\hat{R}_{p}^{+} - \\pi_p \\hat{R}_{p}^{-} + \\hat{R}_{u}^{-}"
											}
										</LaTeX>
									</td>
									<td className="p-3 font-mono">
										<LaTeX displayMode={false}>
											{
												"\\tilde{R}_{\\text{pu}} = \\pi_p \\hat{R}_{p}^{+} + \\max\\{0, \\hat{R}_{u}^{-} - \\pi_p \\hat{R}_{p}^{-}\\}"
											}
										</LaTeX>
									</td>
								</tr>
								<tr className="border-b">
									<td className="p-3 font-medium text-slate-600">
										Risk Estimator
									</td>
									<td className="p-3 text-slate-700">
										Unbiased, but can go negative
									</td>
									<td className="p-3 text-slate-700">
										Non-negative constraint
									</td>
								</tr>
								<tr className="border-b">
									<td className="p-3 font-medium text-slate-600">
										Key Strength
									</td>
									<td className="p-3 text-slate-700">
										Theoretically sound baseline
									</td>
									<td className="p-3 text-slate-700">
										Stable with deep models
									</td>
								</tr>
								<tr>
									<td className="p-3 font-medium text-slate-600">
										Failure Mode
									</td>
									<td className="p-3 text-red-600">
										Overfitting when risk &lt; 0
									</td>
									<td className="p-3 text-slate-700">
										Robust, but class prior sensitive
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</CardContent>
			</Card>

			{/* 4. Implementation Resources */}
			{/* 4. Implementation Resources */}
			<Card className="shadow-lg border">
				<CardHeader>
					<CardTitle className="text-2xl font-semibold text-slate-800">
						Implementation Notes & Resources
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-slate-700 mb-4">
						The nnPU risk estimator implemented in this demo is
						directly adapted from{" "}
						<strong>Sugiyama Lab’s official PU code</strong>(
						<code>PU.zip</code>). I modified and extended the
						original implementation to integrate sequential models
						(LSTM) and evaluate on my 95-unit smart residential
						testbed.
					</p>
					<ul className="text-sm space-y-2">
						<li>
							<a
								href="https://www.ms.k.u-tokyo.ac.jp/sugi/software/PU/PU.zip"
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-2 text-blue-600 hover:underline"
							>
								<BookOpen className="h-4 w-4" /> Official PU
								Code (Sugiyama Lab)
							</a>
						</li>
						<li>
							<a
								href="https://www.ms.k.u-tokyo.ac.jp/sugi/"
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-2 text-blue-600 hover:underline"
							>
								<School className="h-4 w-4" /> Sugiyama Lab
								Homepage
							</a>
						</li>
					</ul>
				</CardContent>
			</Card>
		</div>
	);
}
