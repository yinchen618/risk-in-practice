"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, Combine, Layers } from "lucide-react";

export default function ImplementationIntro() {
	return (
		<section id="implementation-intro" className="scroll-mt-6">
			<Card className="bg-white shadow-lg">
				<CardHeader>
					{/* Eyebrow Title for Section Identification */}
					<h2 className="text-base font-semibold uppercase text-blue-600 tracking-wider">
						Introduction
					</h2>
					<CardTitle className="text-3xl font-bold text-gray-800 pt-1">
						Uncovering Hidden Event Patterns in Real-World Data with
						LSTM and PU Learning
					</CardTitle>
					<p className="text-lg text-gray-500 pt-2">
						Detailing how we merge the temporal insight of deep
						learning with the label tolerance of PU Learning to
						address the challenges of real-world industrial data.
					</p>
				</CardHeader>
				<CardContent className="space-y-8">
					{/* Opening Paragraph */}
					<p className="text-base leading-relaxed text-gray-700">
						When processing continuous time-series data, the core
						challenge is not merely forecasting trends, but
						precisely identifying rare yet critical events.
						Traditional supervised learning methods often fall short
						in such scenarios as they rely on large, explicitly
						labeled sets of positive and negative samples. In the
						real world, however, we typically have only a small
						number of confirmed <b>Positive (P)</b> samples, while
						the vast majority of data consists of{" "}
						<b>Unlabeled (U)</b> samples that cannot be definitively
						classified. To resolve this dilemma, we have constructed
						an advanced training framework that combines
						Positive-Unlabeled (PU) Learning with Long Short-Term
						Memory (LSTM) networks.
					</p>

					<div className="space-y-6">
						{/* Why PU Learning? */}
						<div className="p-4 rounded-lg border bg-slate-50">
							<h4 className="text-xl font-semibold text-sky-700 flex items-center gap-2 mb-3">
								<BrainCircuit className="h-6 w-6" />
								Why PU Learning? — Embracing Imperfect Labels
							</h4>
							<p className="text-gray-600">
								PU Learning is specifically designed to handle
								the issue of asymmetric label information. It
								enables us to learn to distinguish patterns
								similar to known positive samples directly from
								a mixed pool of unlabeled data, eliminating the
								need for time-consuming and potentially
								erroneous manual negative labeling.
							</p>
							<ul className="mt-2 list-disc list-inside text-sm text-gray-500 space-y-1">
								<li>
									<b>Implementation Highlight:</b> Adopting
									the robust non-negative PU (nnPU) algorithm
									to effectively reduce model bias and enhance
									generalization.
								</li>
							</ul>
						</div>

						{/* Why LSTM? */}
						<div className="p-4 rounded-lg border bg-slate-50">
							<h4 className="text-xl font-semibold text-emerald-700 flex items-center gap-2 mb-3">
								<Layers className="h-6 w-6" />
								Why LSTM? — Decoding the Language of Time
							</h4>
							<p className="text-gray-600">
								Target events are dynamic processes, not
								isolated points in time. As a type of recurrent
								neural network, LSTM is inherently adept at
								processing sequential data. Its "memory"
								mechanism allows it to learn long-term
								dependencies and capture the specific temporal
								signatures of events.
							</p>
							<ul className="mt-2 list-disc list-inside text-sm text-gray-500 space-y-1">
								<li>
									<b>Implementation Highlight:</b> Utilizing a
									sliding window for dynamic temporal feature
									engineering, transforming single-point
									snapshots into rich, history-aware feature
									vectors.
								</li>
							</ul>
						</div>

						{/* Synergy */}
						<div className="p-4 rounded-lg border bg-slate-50">
							<h4 className="text-xl font-semibold text-amber-700 flex items-center gap-2 mb-3">
								<Combine className="h-6 w-6" />
								Conclusion: A Robust Framework for Real-World
								Application
							</h4>
							<p className="text-gray-600">
								The core value of this project lies in the
								seamless integration of the{" "}
								<b>deep temporal understanding of LSTMs</b> with
								the{" "}
								<b>
									flexibility of PU Learning in handling
									imperfect labels
								</b>
								. Through a rigorous data pipeline and advanced
								algorithms, we have engineered an intelligent
								solution capable of reliably detecting key
								events within complex and noisy real-world
								industrial data.
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</section>
	);
}
