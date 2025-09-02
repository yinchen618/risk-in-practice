"use client";

import { LaTeX } from "@/components/LaTeX";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TheoryTab() {
	return (
		<div className="max-w-4xl mx-auto space-y-6">
			<h2 className="text-3xl font-bold text-slate-900 mb-2">
				Theoretical Background
			</h2>
			<p className="text-slate-700 mb-6">
				PU learning reformulates binary classification using only
				positive and unlabeled data. This section summarizes two key
				algorithms from Sugiyama Lab: unbiased PU learning (uPU) and
				non-negative PU learning (nnPU).
			</p>

			<div className="p-6 bg-blue-50 rounded-lg">
				<h4 className="font-semibold text-blue-900 mb-2">
					[1] Unbiased PU Learning (ICML 2015)
				</h4>
				<p className="text-sm text-blue-800 mb-3">
					<strong>Authors:</strong> Marthinus Christoffel du Plessis,
					Gang Niu, Masashi Sugiyama
				</p>
				<p className="text-sm text-blue-700 mb-3">
					Reformulates classification risk to avoid needing labeled
					negatives, using class-prior π for risk estimation. Prone to
					overfitting with complex models.
				</p>
				<div className="text-xs">
					<a
						href="https://proceedings.mlr.press/v37/plessis15.html"
						target="_blank"
						rel="noopener noreferrer"
						className="text-blue-600 hover:text-blue-800 underline mr-3"
					>
						📄 ICML 2015 Paper
					</a>
					<a
						href="https://www.ms.k.u-tokyo.ac.jp/sugi/2015/ICML2015.pdf"
						target="_blank"
						rel="noopener noreferrer"
						className="text-blue-600 hover:text-blue-800 underline"
					>
						📎 PDF
					</a>
				</div>
			</div>

			<div className="p-6 bg-green-50 rounded-lg">
				<h4 className="font-semibold text-green-900 mb-2">
					[2] Non-negative PU Learning (NeurIPS 2017)
				</h4>
				<p className="text-sm text-green-800 mb-3">
					<strong>Authors:</strong> Ryuichi Kiryo, Gang Niu, Marthinus
					Christoffel du Plessis, Masashi Sugiyama
				</p>
				<p className="text-sm text-green-700 mb-3">
					Constrains risk to be non-negative, preventing overfitting
					and stabilizing training.
				</p>
				<div className="text-xs">
					<a
						href="https://papers.nips.cc/paper/2017/hash/7cce53cf90577442771720a370c3c723-Abstract.html"
						target="_blank"
						rel="noopener noreferrer"
						className="text-green-600 hover:text-green-800 underline mr-3"
					>
						📄 NIPS 2017 Paper
					</a>
					<a
						href="https://proceedings.neurips.cc/paper/2017/file/7cce53cf90577442771720a370c3c723-Paper.pdf"
						target="_blank"
						rel="noopener noreferrer"
						className="text-green-600 hover:text-green-800 underline"
					>
						📎 PDF
					</a>
				</div>
			</div>

			<div className="p-6 bg-purple-50 rounded-lg">
				<h4 className="font-semibold text-purple-900 mb-2">
					Key Theoretical Insights
				</h4>
				<ul className="text-sm text-purple-700 space-y-1">
					<li>
						• PU learning reformulates binary classification using
						only positive and unlabeled data
					</li>
					<li>
						• The class-prior{" "}
						<span className="font-mono">
							<LaTeX displayMode={false}>{"\\pi_p"}</LaTeX>
						</span>{" "}
						is crucial for unbiased risk estimation
					</li>
					<li>
						• uPU risk:{" "}
						<span className="font-mono">
							<LaTeX displayMode={false}>
								{
									"\\hat{R}_{\\text{pu}}(g) = \\pi_p \\hat{R}_{p}^{+}(g) - \\pi_p \\hat{R}_{p}^{-}(g) + \\hat{R}_{u}^{-}(g)"
								}
							</LaTeX>
						</span>
					</li>
					<li>
						• nnPU risk:{" "}
						<span className="font-mono">
							<LaTeX displayMode={false}>
								{
									"\\tilde{R}_{\\text{pu}}(g) = \\pi_p \\hat{R}_{p}^{+}(g) + \\max\\{0, \\hat{R}_{u}^{-}(g) - \\pi_p \\hat{R}_{p}^{-}(g)\\}"
								}
							</LaTeX>
						</span>
					</li>
					<li>
						• uPU uses <strong>Squared Loss</strong> with linear
						algebraic solution
					</li>
					<li>
						• nnPU uses{" "}
						<strong>
							<LaTeX displayMode={false}>{"l_{\\rm sig}"}</LaTeX>
						</strong>{" "}
						for gradient-based optimization
					</li>
				</ul>
			</div>

			<div className="p-6 bg-slate-50 rounded-lg">
				<h4 className="font-semibold text-slate-900 mb-2">In System</h4>
				<p className="text-sm text-slate-700 mb-3">
					Risk estimators here are implemented exactly in my training
					pipeline. nnPU’s non-negative constraint is applied before
					gradient updates.
				</p>
				<h4 className="font-semibold text-slate-900 mb-2">
					Failure Modes
				</h4>
				<p className="text-sm text-slate-700">
					Prior misestimation, high unlabeled contamination, risk &lt;
					0 in uPU.
				</p>
			</div>
			<h2 className="text-3xl font-bold text-slate-900 mb-2">
				References
			</h2>
			<p className="text-slate-700 mb-6">
				Core references from Sugiyama Lab underpinning this work. Each
				method is either implemented directly in the Demo or applied to
				real testbed data in the Case Study.
			</p>

			<div className="space-y-4">
				<Card>
					<CardHeader>
						<CardTitle>Primary Research Papers</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<h5 className="font-medium">
								1. du Plessis, M. C., Niu, G., & Sugiyama, M.
								(2015)
							</h5>
							<p className="text-sm text-slate-600">
								Analysis of learning from positive and unlabeled
								data. <em>ICML 2015</em>
							</p>
							<p className="text-xs text-slate-600">
								[Implemented: Yes – Where used: Demo (uPU risk),
								Case Study Stage 3]
							</p>
						</div>
						<div>
							<h5 className="font-medium">
								2. Kiryo, R., Niu, G., du Plessis, M. C., &
								Sugiyama, M. (2017)
							</h5>
							<p className="text-sm text-slate-600">
								Positive-unlabeled learning with non-negative
								risk estimator. <em>NIPS 2017</em>
							</p>
							<p className="text-xs text-slate-600">
								[Implemented: Yes – Where used: Demo (nnPU),
								Case Study Stage 3]
							</p>
						</div>
						<div>
							<h5 className="font-medium">
								3. Niu, G., du Plessis, M. C., Sakai, T., Ma,
								Y., & Sugiyama, M. (2016)
							</h5>
							<p className="text-sm text-slate-600">
								Theoretical comparisons of positive-unlabeled
								learning against positive-negative learning.{" "}
								<em>NIPS 2016</em>
							</p>
							<p className="text-xs text-slate-600">
								[Implemented: Yes – Where used: Comparative
								analysis in Case Study]
							</p>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Implementation Resources</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className="text-sm space-y-2">
							<li>
								•{" "}
								<a
									href="https://github.com/kiryor/nnPU"
									className="text-blue-600 hover:underline"
								>
									Official nnPU Implementation (GitHub)
								</a>
							</li>
							<li>
								•{" "}
								<a
									href="https://www.ms.k.u-tokyo.ac.jp/sugi/"
									className="text-blue-600 hover:underline"
								>
									Sugiyama Lab Homepage
								</a>
							</li>
							<li>
								•{" "}
								<a
									href="https://scikit-learn.org/"
									className="text-blue-600 hover:underline"
								>
									Scikit-learn Documentation
								</a>
							</li>
							<li>
								•{" "}
								<a
									href="https://pytorch.org/"
									className="text-blue-600 hover:underline"
								>
									PyTorch Framework
								</a>
							</li>
						</ul>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
