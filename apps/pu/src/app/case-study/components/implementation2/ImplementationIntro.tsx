"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, Combine, Layers } from "lucide-react";

export default function ImplementationIntroRevised() {
	return (
		<section id="implementation-intro" className="scroll-mt-6">
			<Card className="bg-white/80 backdrop-blur-sm shadow-lg border">
				<CardHeader>
					<h2 className="text-base font-semibold uppercase text-blue-600 tracking-wider">
						Prologue
					</h2>
					<CardTitle className="text-3xl font-bold text-gray-800 pt-1">
						A Framework for Real-World Anomaly Detection
					</CardTitle>
					<p className="text-lg text-gray-500 pt-2">
						Detailing the synergy between deep learning's temporal
						insight and PU Learning's label tolerance to address the
						challenges of industrial time-series data.
					</p>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="p-4 rounded-lg border bg-slate-50/70">
						<h4 className="text-xl font-semibold text-sky-800 flex items-center gap-3 mb-3">
							<BrainCircuit className="h-6 w-6" />
							Why PU Learning? — Embracing Label Sparsity
						</h4>
						<ul className="space-y-2 list-disc list-inside text-gray-700">
							<li>
								<strong>Handles Asymmetric Information:</strong>{" "}
								Specifically designed for scenarios with few
								confirmed positive (P) labels and vast amounts
								of unlabeled (U) data.
							</li>
							<li>
								<strong>Reduces Manual Effort:</strong>{" "}
								Eliminates the need for exhaustive and often
								impractical negative (N) labeling.
							</li>
							<li>
								<strong>Robust Implementation:</strong> Utilizes
								the non-negative PU (nnPU) algorithm to reduce
								estimation bias and enhance training stability.
							</li>
						</ul>
					</div>

					<div className="p-4 rounded-lg border bg-slate-50/70">
						<h4 className="text-xl font-semibold text-emerald-800 flex items-center gap-3 mb-3">
							<Layers className="h-6 w-6" />
							Why LSTM (Long Short-Term Memory)? — Decoding
							Temporal Patterns
						</h4>
						<ul className="space-y-2 list-disc list-inside text-gray-700">
							<li>
								<strong>Sequential Awareness:</strong> RNN
								(Recurrent Neural Networks) are inherently
								suited for processing time-series data.
							</li>
							<li>
								<strong>Long-Term Dependencies:</strong> Learns
								the temporal "signatures" of events, as
								anomalies are often processes, not isolated
								points.
							</li>
							<li>
								<strong>Feature Compatibility:</strong>{" "}
								Perfectly complements sliding-window feature
								engineering, turning historical snapshots into
								actionable insights.
							</li>
						</ul>
					</div>
					<div className="p-4 rounded-lg border-2 border-slate-300 bg-slate-100 text-center">
						<h4 className="text-xl font-semibold text-slate-800 flex items-center justify-center gap-3 mb-2">
							<Combine className="h-6 w-6" />
							Synergy: A Robust Framework
						</h4>
						<p className="text-gray-700">
							By combining LSTM's ability to model complex
							temporal dynamics with nnPU's ability to learn from
							sparse labels, we create a powerful and practical
							framework for real-world anomaly detection.
						</p>
					</div>
				</CardContent>
			</Card>
		</section>
	);
}
