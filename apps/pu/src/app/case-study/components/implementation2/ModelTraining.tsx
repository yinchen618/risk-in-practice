"use client";

import { LaTeX } from "@/components/LaTeX";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, Network, Rocket, Target } from "lucide-react";

export default function ModelTraining() {
	return (
		<section id="model-training" className="scroll-mt-6">
			<Card className="bg-white shadow-lg">
				<CardHeader>
					<h2 className="text-base font-semibold uppercase text-blue-600 tracking-wider">
						Part 2: Model Training
					</h2>
					<CardTitle className="text-3xl font-bold text-gray-800 flex items-center gap-3">
						<Rocket className="h-8 w-8 text-indigo-600" />
						Model Training: The nnPU Framework for Learning under
						Uncertainty
					</CardTitle>
					<p className="text-lg text-gray-500 pt-2">
						Detailing the model architecture and the specialized
						training process designed to learn from unlabeled data.
					</p>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* LSTM Network Architecture */}
					<div className="p-4 rounded-lg border bg-slate-50">
						<h4 className="text-xl font-semibold text-slate-700 flex items-center gap-2 mb-3">
							<Network className="h-6 w-6" />
							LSTM Network Architecture
						</h4>
						<p className="text-gray-600 mb-2">
							The model is structured as a deep recurrent neural
							network specifically designed for time-series
							classification:
						</p>
						<div className="text-sm text-gray-600 space-y-1 font-mono bg-white p-3 rounded">
							<p>Input Layer (Batch, windowSize, features)</p>
							<p>↓</p>
							<p>Batch Normalization</p>
							<p>↓</p>
							<p>
								Multi-layer LSTM (hiddenSize: {"hiddenSize"},
								layers: {"numLayers"})
							</p>
							<p>↓</p>
							<p>Dropout (rate: {"dropout"})</p>
							<p>↓</p>
							<p>Classifier (Two Fully-Connected Layers)</p>
							<p>↓</p>
							<p>Sigmoid Output</p>
						</div>
					</div>

					{/* nnPU Loss Mechanism */}
					<div className="p-4 rounded-lg border bg-slate-50">
						<h4 className="text-xl font-semibold text-slate-700 flex items-center gap-2 mb-3">
							<Calculator className="h-6 w-6" />
							The Core Mechanism of nnPU Loss
						</h4>
						<p className="text-gray-600 mb-3">
							The non-negative PU (nnPU) loss function allows the
							model to learn without explicit negative labels. It
							statistically corrects for the bias introduced by
							treating unlabeled data as negative. The risk is
							estimated as:
						</p>
						<div className="p-3 bg-white rounded-md border text-center">
							<LaTeX>
								{
									"$$R_{pu}(f) = \\pi_p R_p^+(f) + \\max(0, R_u^-(f) - \\pi_p R_p^-(f))$$"
								}
							</LaTeX>
						</div>
						<p className="text-sm text-gray-500 mt-3">
							Where <LaTeX>{"$\\pi_p$"}</LaTeX> is the class
							prior, <LaTeX>{"$R_p^+(f)$"}</LaTeX> is the risk on
							positive samples, and <LaTeX>{"$R_u^-(f)$"}</LaTeX>{" "}
							and <LaTeX>{"$R_p^-(f)$"}</LaTeX> are risks on
							unlabeled samples. The "non-negative" constraint (
							<LaTeX>{"$\\max(0, ...)$"}</LaTeX>) enhances
							training stability against overfitting.
						</p>
					</div>

					{/* Training Process */}
					<div className="p-4 rounded-lg border bg-slate-50">
						<h4 className="text-xl font-semibold text-slate-700 flex items-center gap-2 mb-3">
							<Target className="h-6 w-6" />
							Training Process & Early Stopping
						</h4>
						<p className="text-gray-600">
							Training is conducted using mini-batch gradient
							descent with an Adam optimizer. To ensure model
							robustness and prevent overfitting, we monitor the{" "}
							<strong>F1-Score</strong> on the validation set.{" "}
							<strong>Early Stopping</strong> is enabled to halt
							the training process when the F1-Score no longer
							improves for a given number of epochs (patience),
							preserving the best-performing model state.
						</p>
					</div>
				</CardContent>
			</Card>
		</section>
	);
}
