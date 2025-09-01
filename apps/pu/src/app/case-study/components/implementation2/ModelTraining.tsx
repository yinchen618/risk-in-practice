"use client";

import { LaTeX } from "@/components/LaTeX";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Calculator, Network, Target } from "lucide-react";

export default function ModelTrainingRevised() {
	return (
		<Card className="bg-white shadow-lg border">
			<CardHeader>
				<CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
					<Network className="h-7 w-7 text-blue-600" />
					Model Architecture & Training Paradigm
				</CardTitle>
				<CardDescription className="text-md pt-1">
					Detailing the LSTM network structure and the non-negative PU
					(nnPU) learning framework used to train the model under
					label uncertainty.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Section 1: Architecture */}
				<div className="p-4 rounded-lg border bg-slate-50/70">
					<h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2 text-lg">
						LSTM Network Architecture
					</h4>
					<p className="text-sm text-gray-700 mb-3">
						A multi-layer recurrent neural network designed to
						capture temporal dependencies from the feature vectors:
					</p>
					<div className="text-xs text-gray-600 space-y-1 font-mono bg-white p-3 rounded-md border">
						<p>Input (Feature Vectors)</p>
						<p> -&gt; Batch Normalization</p>
						<p>
							{" "}
							-&gt; Multi-layer LSTM (hiddenSize: 64, layers: 1)
						</p>
						<p> -&gt; Dropout (rate: 0.4)</p>
						<p> -&gt; Fully-Connected Classifier (2 layers)</p>
						<p> -&gt; Sigmoid Output (Prediction Score)</p>
					</div>
				</div>

				{/* Section 2: nnPU Loss */}
				<div className="p-4 rounded-lg border bg-slate-50/70">
					<h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2 text-lg">
						<Calculator className="h-5 w-5" />
						The nnPU Learning Paradigm
					</h4>
					<p className="text-sm text-gray-700 mb-3">
						The non-negative PU (nnPU) loss function enables
						learning without explicit negative labels. It estimates
						the classification risk by statistically correcting for
						the bias of treating unlabeled data as negative.
					</p>
					<div className="p-4 bg-white rounded-md border">
						<div className="text-center mb-3">
							<LaTeX>
								{
									"R_{\\text{pu}}(f) = \\pi_p R_p^+(f) + \\max(0, R_u^-(f) - \\pi_p R_p^-(f))"
								}
							</LaTeX>
						</div>
						<div className="text-xs text-gray-600 space-y-2">
							<p className="flex items-center gap-2">
								<span className="font-medium">Where:</span>
							</p>
							<ul className="space-y-1 ml-4">
								<li className="flex items-start gap-2">
									<span className="text-blue-600">•</span>
									<span>
										<LaTeX>{"\\pi_p"}</LaTeX> is the{" "}
										<strong>class prior</strong> (proportion
										of positive samples)
									</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="text-green-600">•</span>
									<span>
										<LaTeX>{"R_p^+(f)"}</LaTeX> represents
										the <strong>positive risk</strong> on
										labeled positive set
									</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="text-orange-600">•</span>
									<span>
										<LaTeX>{"R_u^-(f)"}</LaTeX> represents
										the <strong>negative risk</strong> on
										unlabeled set
									</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="text-purple-600">•</span>
									<span>
										<LaTeX>{"R_p^-(f)"}</LaTeX> represents
										the <strong>negative risk</strong> on
										labeled positive set
									</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="text-red-600">•</span>
									<span>
										The <LaTeX>{"\\max(0, \\cdot)"}</LaTeX>{" "}
										constraint ensures{" "}
										<strong>non-negative risk</strong> and
										enhances training stability
									</span>
								</li>
							</ul>
						</div>
					</div>
				</div>

				{/* Section 3: Training Protocol */}
				<div className="p-4 rounded-lg border bg-slate-50/70">
					<h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2 text-lg">
						<Target className="h-5 w-5" />
						Training & Validation Protocol
					</h4>
					<ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
						<li>
							<strong>Optimizer:</strong> Adam with mini-batch
							gradient descent.
						</li>
						<li>
							<strong>Validation Metric:</strong> The{" "}
							<strong>F1-Score</strong> on the validation set is
							monitored at the end of each epoch.
						</li>
						<li>
							<strong>Model Selection:</strong>{" "}
							<strong>Early Stopping</strong> is used to halt
							training if the validation F1-score does not improve
							for 10 consecutive epochs. The model state with the
							highest validation F1-score is saved and used for
							final evaluation.
						</li>
					</ul>
				</div>
			</CardContent>
		</Card>
	);
}
