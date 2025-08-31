"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChartBig, BrainCircuit, Layers, Lightbulb } from "lucide-react";

export default function ResearchHighlights() {
	return (
		<section id="research-highlights" className="scroll-mt-6">
			<Card className="bg-white shadow-lg">
				<CardHeader>
					<h2 className="text-base font-semibold uppercase text-blue-600 tracking-wider  mb-4">
						Research Highlights
					</h2>
					<CardTitle className="text-3xl font-bold text-gray-800 ">
						Key Research Insights
					</CardTitle>
					<p className="text-lg text-gray-500 pt-2 ">
						When applying cutting-edge academic theories to complex,
						real-world data, we uncovered the following key
						challenges and opportunities for future research.
					</p>
				</CardHeader>
				<CardContent className="space-y-8">
					{/* Insight 1: nnPU */}
					<div className="space-y-4 p-4 rounded-lg border bg-slate-50/50">
						<h4 className="text-xl font-semibold text-slate-800">
							On nnPU Learning: The Challenge of a Dynamic Class
							Prior π(t)
						</h4>
						<div className="border-l-4 border-l-orange-400 pl-6 py-4 bg-orange-50 rounded-r-lg">
							<p className="font-semibold text-orange-800 mb-2">
								Challenge on My Testbed:
							</p>
							<ul className="space-y-1 text-orange-900">
								<li className="flex items-start gap-2">
									<span className="text-orange-600 mt-1">
										•
									</span>
									<span>
										Paper assumes{" "}
										<strong>static class prior π</strong>
									</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="text-orange-600 mt-1">
										•
									</span>
									<span>
										My data shows{" "}
										<strong>
											non-stationary, dynamic π(t)
										</strong>
									</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="text-orange-600 mt-1">
										•
									</span>
									<span>
										<strong>
											AC anomalies spike in summer
										</strong>{" "}
										→ time-varying prior
									</span>
								</li>
							</ul>
						</div>
						<div className="pt-2">
							<h5 className="font-semibold text-slate-700 flex items-center gap-2 mb-2">
								<Lightbulb className="w-5 h-5 text-yellow-500" />
								Inspired Future Question:
							</h5>
							<p className="text-slate-600 leading-relaxed">
								Can we design an <strong>"Online nnPU"</strong>{" "}
								algorithm that dynamically adapts to changing
								class prior π(t)?
							</p>
						</div>
					</div>

					{/* Insight 2: Distribution Shift */}
					<div className="space-y-4 p-4 rounded-lg border bg-slate-50/50">
						<h4 className="text-xl font-semibold text-slate-800">
							On Distribution Shift: The Problem of Compound
							Shifts
						</h4>
						<div className="border-l-4 border-l-purple-400 pl-6 py-4 bg-purple-50 rounded-r-lg">
							<p className="font-semibold text-purple-800 mb-2">
								Challenge on My Testbed:
							</p>
							<ul className="space-y-1 text-purple-900">
								<li className="flex items-start gap-2">
									<span className="text-purple-600 mt-1">
										•
									</span>
									<span>
										<strong>Covariate shift:</strong> energy
										usage patterns change by season
									</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="text-purple-600 mt-1">
										•
									</span>
									<span>
										<strong>Label shift:</strong> anomaly
										definition & frequency change
									</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="text-purple-600 mt-1">
										•
									</span>
									<span>
										<strong>
											Compound distribution shift
										</strong>{" "}
										beyond existing methods
									</span>
								</li>
							</ul>
						</div>
						<div className="pt-2">
							<h5 className="font-semibold text-slate-700 flex items-center gap-2 mb-2">
								<Lightbulb className="w-5 h-5 text-yellow-500" />
								Inspired Future Question:
							</h5>
							<p className="text-slate-600 leading-relaxed">
								How can we develop a{" "}
								<strong>unified framework</strong> to handle
								compound shifts within PU learning context?
							</p>
						</div>
					</div>

					{/* Insight 3: Noisy Labels */}
					<div className="space-y-4 p-4 rounded-lg border bg-slate-50/50">
						<h4 className="text-xl font-semibold text-slate-800">
							On Noisy Labels: The Signal in Structured "Noise"
						</h4>
						<div className="border-l-4 border-l-teal-400 pl-6 py-4 bg-teal-50 rounded-r-lg">
							<p className="font-semibold text-teal-800 mb-2">
								Challenge on My Testbed:
							</p>
							<ul className="space-y-1 text-teal-900">
								<li className="flex items-start gap-2">
									<span className="text-teal-600 mt-1">
										•
									</span>
									<span>
										Paper handles{" "}
										<strong>random noise</strong>
									</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="text-teal-600 mt-1">
										•
									</span>
									<span>
										My data has{" "}
										<strong>
											structured, behavior-related "noise"
										</strong>
									</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="text-teal-600 mt-1">
										•
									</span>
									<span>
										<strong>Systematic disagreement</strong>{" "}
										between operators
									</span>
								</li>
							</ul>
						</div>
						<div className="pt-2">
							<h5 className="font-semibold text-slate-700 flex items-center gap-2 mb-2">
								<Lightbulb className="w-5 h-5 text-yellow-500" />
								Inspired Future Question:
							</h5>
							<p className="text-slate-600 leading-relaxed">
								Can we leverage{" "}
								<strong>structured "noise"</strong> as valuable
								signal about context-dependence of anomaly
								detection?
							</p>
						</div>
					</div>

					{/* === NEW SECTION: Broader Architectural Explorations === */}
					<div className="border-t-2 border-dashed pt-8 mt-8">
						<h4 className="text-2xl font-bold text-gray-800 flex items-center gap-3 mb-4">
							<Layers className="h-7 w-7 text-gray-600" />
							Future Directions in Model Architecture
						</h4>
						<p className="text-gray-600 mb-6">
							Beyond refining the PU learning algorithm itself,
							exploring alternative model architectures offers
							promising avenues for enhancing different aspects of
							the system.
						</p>
						<div className="grid md:grid-cols-2 gap-6">
							{/* XGBoost Card */}
							<div className="p-4 rounded-lg border-2 border-slate-200 bg-white hover:border-slate-300 transition-all">
								<h5 className="font-semibold text-slate-700 flex items-center gap-2 mb-3">
									<BarChartBig className="w-5 h-5 text-green-600" />
									XGBoost for Interpretability
								</h5>
								<ul className="space-y-1 text-sm text-slate-600">
									<li className="flex items-start gap-2">
										<span className="text-green-600 mt-1">
											•
										</span>
										<span>
											<strong>Tree-based models</strong>{" "}
											with PU Learning
										</span>
									</li>
									<li className="flex items-start gap-2">
										<span className="text-green-600 mt-1">
											•
										</span>
										<span>
											<strong>
												Feature importance scores
											</strong>{" "}
											for interpretability
										</span>
									</li>
									<li className="flex items-start gap-2">
										<span className="text-green-600 mt-1">
											•
										</span>
										<span>
											Help operators understand{" "}
											<strong>anomaly drivers</strong>
										</span>
									</li>
								</ul>
							</div>
							{/* Transformer Card */}
							<div className="p-4 rounded-lg border-2 border-slate-200 bg-white hover:border-slate-300 transition-all">
								<h5 className="font-semibold text-slate-700 flex items-center gap-2 mb-3">
									<BrainCircuit className="w-5 h-5 text-purple-600" />
									Transformers for Long-Range Dependencies
								</h5>
								<ul className="space-y-1 text-sm text-slate-600">
									<li className="flex items-start gap-2">
										<span className="text-purple-600 mt-1">
											•
										</span>
										<span>
											<strong>
												Self-attention mechanism
											</strong>{" "}
											vs LSTMs
										</span>
									</li>
									<li className="flex items-start gap-2">
										<span className="text-purple-600 mt-1">
											•
										</span>
										<span>
											Capture{" "}
											<strong>
												complex, long-range dependencies
											</strong>
										</span>
									</li>
									<li className="flex items-start gap-2">
										<span className="text-purple-600 mt-1">
											•
										</span>
										<span>
											Detect{" "}
											<strong>
												slow-building anomalies
											</strong>{" "}
											(weeks/months)
										</span>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</section>
	);
}
