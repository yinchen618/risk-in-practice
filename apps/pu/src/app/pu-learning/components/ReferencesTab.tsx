"use client";

import { LaTeX } from "@/components/LaTeX";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	BookOpen,
	FileText,
	Github,
	Link as LinkIcon,
	School,
} from "lucide-react";
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
						Core Papers: A Deep Dive into PU Learning
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6 divide-y">
					{/* Paper 1: uPU */}
					<div className="pt-6">
						<h4 className="text-xl font-bold text-slate-800 mb-2">
							[1] Analysis of Learning from Positive and Unlabeled
							Data
						</h4>
						<div className="text-sm text-slate-500 mb-3">
							<span className="font-semibold">Authors:</span>{" "}
							Marthinus C. du Plessis, Gang Niu, Masashi Sugiyama
							<br />
							<span className="font-semibold">Venue:</span>{" "}
							<em>
								Proceedings of the 32nd International Conference
								on Machine Learning (ICML 2015)
							</em>
						</div>
						<p className="text-slate-700 leading-relaxed mb-4">
							<strong>Core Contribution:</strong> This
							foundational paper introduced an unbiased risk
							estimator for PU learning (uPU). It elegantly
							reformulates the classification risk to be estimated
							using only positive and unlabeled data, making PU
							learning theoretically sound without requiring
							labeled negatives.
						</p>
						<div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r-md">
							<p className="text-sm font-semibold text-blue-800">
								Relevance to this Project:
							</p>
							<p className="text-xs text-blue-700 mt-1">
								The uPU risk estimator was implemented and
								benchmarked in our comparative analysis, serving
								as a crucial baseline to demonstrate the
								stability improvements offered by nnPU.
							</p>
						</div>
						<div className="flex items-center gap-4 mt-4 text-sm">
							<a
								href="https://proceedings.mlr.press/v37/plessis15.html"
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline"
							>
								<LinkIcon className="h-4 w-4" /> ICML 2015 Paper
							</a>
							<a
								href="https://www.ms.k.u-tokyo.ac.jp/sugi/2015/ICML2015.pdf"
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline"
							>
								<FileText className="h-4 w-4" /> PDF
							</a>
						</div>
					</div>

					{/* Paper 2: nnPU */}
					<div className="pt-6">
						<h4 className="text-xl font-bold text-slate-800 mb-2">
							[2] Positive-Unlabeled Learning with Non-Negative
							Risk Estimator
						</h4>
						<div className="text-sm text-slate-500 mb-3">
							<span className="font-semibold">Authors:</span>{" "}
							Ryuichi Kiryo, Gang Niu, Marthinus C. du Plessis,
							Masashi Sugiyama
							<br />
							<span className="font-semibold">Venue:</span>{" "}
							<em>
								Advances in Neural Information Processing
								Systems 30 (NeurIPS 2017)
							</em>
						</div>
						<p className="text-slate-700 leading-relaxed mb-4">
							<strong>Core Contribution:</strong> This paper
							addresses a critical flaw in uPU where the risk
							estimator can become negative, leading to severe
							overfitting. It introduces the non-negative PU risk
							estimator (nnPU), which constrains the risk to be
							non-negative, dramatically stabilizing training for
							complex models like neural networks.
						</p>
						<div className="bg-green-50 border-l-4 border-green-500 p-3 rounded-r-md">
							<p className="text-sm font-semibold text-green-800">
								Relevance to this Project:
							</p>
							<p className="text-xs text-green-700 mt-1">
								<strong>
									This is the core algorithm implemented in
									our system.
								</strong>{" "}
								The nnPU framework is the engine that powers our
								training pipeline, enabling the use of LSTMs in
								a PU setting without succumbing to overfitting.
							</p>
						</div>
						<div className="flex items-center gap-4 mt-4 text-sm">
							<a
								href="https://papers.nips.cc/paper/2017/hash/7cce53cf90577442771720a370c3c723-Abstract.html"
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-1 text-green-600 hover:text-green-800 hover:underline"
							>
								<LinkIcon className="h-4 w-4" /> NeurIPS 2017
								Paper
							</a>
							<a
								href="https://proceedings.neurips.cc/paper/2017/file/7cce53cf90577442771720a370c3c723-Paper.pdf"
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-1 text-green-600 hover:text-green-800 hover:underline"
							>
								<FileText className="h-4 w-4" /> PDF
							</a>
						</div>
					</div>

					{/* Paper 3: Theoretical Comparisons */}
					<div className="pt-6">
						<h4 className="text-xl font-bold text-slate-800 mb-2">
							[3] Theoretical Comparisons of Positive-Unlabeled
							Learning against Positive-Negative Learning
						</h4>
						<div className="text-sm text-slate-500 mb-3">
							<span className="font-semibold">Authors:</span> Gang
							Niu, Marthinus C. du Plessis, Tomoya Sakai, et al.
							<br />
							<span className="font-semibold">Venue:</span>{" "}
							<em>
								Advances in Neural Information Processing
								Systems 29 (NeurIPS 2016)
							</em>
						</div>
						<p className="text-slate-700 leading-relaxed mb-4">
							<strong>Core Contribution:</strong> This work
							provides a rigorous theoretical analysis comparing
							the performance of PU learning with traditional
							positive-negative (PN) learning. It establishes the
							conditions under which PU learning can be as
							effective as PN learning, providing a strong
							justification for its use in label-scarce scenarios.
						</p>
						<div className="bg-purple-50 border-l-4 border-purple-400 p-3 rounded-r-md">
							<p className="text-sm font-semibold text-purple-800">
								Relevance to this Project:
							</p>
							<p className="text-xs text-purple-700 mt-1">
								This paper provides the theoretical
								justification for our entire approach,
								validating why pursuing a PU-based strategy is a
								sound research direction for real-world problems
								where negative labels are unavailable.
							</p>
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

			{/* 4. Implementation Resources */}
			<Card className="shadow-lg border">
				<CardHeader>
					<CardTitle className="text-2xl font-semibold text-slate-800">
						Implementation Notes & Resources
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-slate-700 mb-4">
						The risk estimators defined above are implemented
						directly in our training pipeline. The nnPU’s
						non-negative constraint is applied before each gradient
						update to ensure training stability.
					</p>
					<ul className="text-sm space-y-2">
						<li>
							<a
								href="https://github.com/kiryor/nnPU"
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-2 text-blue-600 hover:underline"
							>
								<Github className="h-4 w-4" /> Official nnPU
								Implementation (GitHub)
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
