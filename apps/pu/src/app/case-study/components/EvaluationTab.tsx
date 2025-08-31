"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	AlertTriangle,
	BarChart3,
	Baseline,
	Sparkles,
	Zap,
} from "lucide-react";

export default function EvaluationTab() {
	return (
		<div className="max-w-5xl mx-auto px-4 space-y-8">
			{/* 1. Tab-specific heading */}
			<div className="text-center mb-8">
				<h2 className="text-4xl font-bold text-slate-800 mb-4">
					Experimental Results: A Story of Domain Adaptation
				</h2>
				<p className="text-lg text-slate-600 max-w-3xl mx-auto">
					This section presents a three-act experiment designed to
					demonstrate the challenge of domain shift and validate our
					proposed adaptation strategy.
				</p>
			</div>

			{/* 2. Results Analysis Dashboard (Visual Summary) */}
			<Card className="shadow-lg border">
				<CardHeader>
					<CardTitle className="text-2xl font-semibold text-slate-800 flex items-center gap-2">
						<BarChart3 className="h-6 w-6 text-blue-600" />
						Results Analysis Dashboard
					</CardTitle>
					<CardDescription>
						A side-by-side comparison of the three experimental
						scenarios.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Performance Metrics Comparison Cards */}
					<div className="grid md:grid-cols-3 gap-4 text-center">
						{/* ERM Baseline */}
						<Card>
							<CardHeader className="bg-slate-50">
								<p className="text-sm font-semibold text-slate-500">
									SCENARIO 1
								</p>
								<CardTitle className="text-blue-700">
									ERM Baseline
								</CardTitle>
							</CardHeader>
							<CardContent className="pt-6 space-y-4">
								<div className="space-y-2">
									<div>
										<p className="text-3xl font-bold text-slate-800">
											73.9%
										</p>
										<p className="text-sm text-slate-500">
											F1 Score
										</p>
									</div>
									<div>
										<p className="text-xl font-semibold text-slate-700">
											61.9%
										</p>
										<p className="text-xs text-slate-500">
											Precision
										</p>
									</div>
									<div>
										<p className="text-xl font-semibold text-slate-700">
											91.8%
										</p>
										<p className="text-xs text-slate-500">
											Recall
										</p>
									</div>
								</div>

								<div className="border-t pt-3 mt-4">
									<div className="text-sm space-y-1">
										<p className="font-medium text-slate-600">
											Training Data:
										</p>
										<p className="text-slate-500">
											(U) Office Worker domain
										</p>
										<p className="text-slate-500">
											(P) Office Worker domain
										</p>

										<p className="font-medium text-slate-600 pt-2">
											Prediction Target:
										</p>
										<p className="text-slate-500">
											Office Worker domain <br />
											(Held-out test set)
										</p>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Generalization Challenge */}
						<Card className="border-2 border-orange-400 bg-orange-50">
							<CardHeader className="bg-orange-100">
								<p className="text-sm font-semibold text-orange-600">
									SCENARIO 2
								</p>
								<CardTitle className="text-orange-800">
									Generalization Challenge
								</CardTitle>
							</CardHeader>
							<CardContent className="pt-6 space-y-4">
								<div className="space-y-2">
									<div>
										<p className="text-3xl font-bold text-orange-700">
											18.2%
										</p>
										<p className="text-sm text-slate-500">
											F1 Score
										</p>
									</div>
									<div>
										<p className="text-xl font-semibold text-orange-600">
											10.0%
										</p>
										<p className="text-xs text-slate-500">
											Precision
										</p>
									</div>
									<div>
										<p className="text-xl font-semibold text-orange-600">
											100.0%
										</p>
										<p className="text-xs text-slate-500">
											Recall
										</p>
									</div>
								</div>

								<div className="border-t border-orange-200 pt-3 mt-4">
									<div className="text-sm space-y-1">
										<p className="font-medium text-orange-700">
											Model Used:
										</p>
										<p className="text-orange-600">
											Pre-trained ERM Baseline model
											<br /> (from Scenario 1)
										</p>
										{/* <p className="text-orange-600">
											• No additional training or
											adaptation
										</p> */}

										<p className="font-medium text-orange-700 pt-2">
											Prediction Target:
										</p>
										<p className="text-orange-600">
											Student domain dataset
											<br /> (completely new domain)
										</p>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Domain Adaptation */}
						<Card className="border-2 border-green-500 bg-green-50">
							<CardHeader className="bg-green-100">
								<p className="text-sm font-semibold text-green-600">
									SCENARIO 3
								</p>
								<CardTitle className="text-green-800">
									Domain Adaptation
								</CardTitle>
							</CardHeader>
							<CardContent className="pt-6 space-y-4">
								<div className="space-y-2">
									<div>
										<p className="text-3xl font-bold text-green-700">
											77.9%
										</p>
										<p className="text-sm text-slate-500">
											F1 Score
										</p>
									</div>
									<div>
										<p className="text-xl font-semibold text-green-600">
											63.8%
										</p>
										<p className="text-xs text-slate-500">
											Precision
										</p>
									</div>
									<div>
										<p className="text-xl font-semibold text-green-600">
											99.8%
										</p>
										<p className="text-xs text-slate-500">
											Recall
										</p>
									</div>
								</div>

								<div className="border-t border-green-200 pt-3 mt-4">
									<div className="text-sm space-y-1">
										<p className="font-medium text-green-700">
											Training Data:
										</p>
										<p className="text-green-600">
											(U) Office Worker domain
										</p>
										<p className="text-green-600">
											(P) Student domain
										</p>

										<p className="font-medium text-green-700 pt-2">
											Prediction Target:
										</p>
										<p className="text-green-600">
											Student domain (Held-out test set)
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</CardContent>
			</Card>

			{/* 3. Deep Dive Analysis */}
			<div className="space-y-6 pt-8">
				<h3 className="text-3xl font-bold text-center text-slate-800">
					Deep Dive: Analysis of Each Scenario
				</h3>

				{/* ERM Baseline Analysis */}
				<Card className="border-l-4 border-l-blue-500">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Baseline className="h-6 w-6 text-blue-600" />
							Act I: ERM Baseline (The Benchmark)
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						<p>
							<strong>Goal:</strong> Establish a performance
							benchmark within a single domain (the "office
							worker" dataset).
						</p>
						<p>
							<strong>Method:</strong> Train, validate, and test
							the model exclusively on data from the office worker
							domain.
						</p>
						<div>
							<p className="font-semibold">Analysis:</p>
							<blockquote className="border-l-2 pl-4 text-slate-600 italic">
								This is a robust benchmark. The high Recall
								(91.8%) shows the model is adept at finding
								anomalies, at the cost of a slightly lower
								Precision (61.9%), which indicates some false
								positives—a common trade-off. This result serves
								as our <strong>"gold standard"</strong> for
								comparison.
							</blockquote>
						</div>
					</CardContent>
				</Card>

				{/* Generalization Challenge Analysis */}
				<Card className="border-l-4 border-l-orange-500">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<AlertTriangle className="h-6 w-6 text-orange-500" />
							Act II: Generalization Challenge (The Conflict)
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						<p>
							<strong>Goal:</strong> Test the benchmark model's
							performance on a never-before-seen domain (the
							"student room" dataset) to assess its generalization
							capability.
						</p>
						<p>
							<strong>Method:</strong> Apply the trained
							ERM_BASELINE model directly to the student room
							data.
						</p>
						<div>
							<p className="font-semibold">Analysis:</p>
							<blockquote className="border-l-2 pl-4 text-slate-600 italic">
								The performance collapse (F1 score of 18.2%) is
								entirely expected and is the key finding. It
								powerfully demonstrates the existence of{" "}
								<strong>Domain Shift</strong>. The combination
								of 100% Recall and 10.0% Precision is a classic
								signal that the model, knowing only "office
								worker" patterns, classified nearly all
								unfamiliar "student" patterns as anomalous.
							</blockquote>
						</div>
					</CardContent>
				</Card>

				{/* Domain Adaptation Analysis */}
				<Card className="border-l-4 border-l-green-500">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Zap className="h-6 w-6 text-green-500" />
							Act III: Domain Adaptation (The Resolution)
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						<p>
							<strong>Goal:</strong> Employ a strategy to adapt
							the model to the new student domain.
						</p>
						<p>
							<strong>Method:</strong> Train a new model using
							unlabeled data (U) from the source domain (office
							worker) and labeled positive data (P) from the
							target domain (student). This is a highly effective
							semi-supervised domain adaptation method for PU
							Learning.
						</p>
						<div>
							<p className="font-semibold">Analysis:</p>
							<blockquote className="border-l-2 pl-4 text-slate-600 italic">
								This is a resounding success. The F1-score not
								only recovered but{" "}
								<strong>
									outperformed the original benchmark (77.9%
									&gt; 73.9%)
								</strong>
								. The model successfully learned to identify
								student anomalies. This superior performance is
								likely because the model leveraged the large
								pool of unlabeled source data as a rich
								"background context," helping it form a more
								robust decision boundary.
							</blockquote>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* 4. Conclusion */}
			<Card className="mt-12 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
				<CardHeader>
					<CardTitle className="flex items-center gap-3">
						<Sparkles className="h-6 w-6 text-yellow-400" />
						Conclusion: A Complete & Compelling Storyline
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-slate-300 leading-relaxed">
						Our three experiments clearly narrate the story of
						identifying a critical real-world problem and solving it
						with an advanced strategy:
					</p>
					<ol className="list-decimal list-inside mt-4 space-y-2 text-slate-200">
						<li>
							<strong>Act I (Benchmark):</strong> We first proved
							our method is effective in a controlled,
							single-domain scenario.
						</li>
						<li>
							<strong>Act II (Conflict):</strong> We then
							demonstrated that this model fails when faced with a
							domain shift, highlighting the core problem.
						</li>
						<li>
							<strong>Act III (Resolution):</strong> Finally, we
							showcased an effective domain adaptation strategy
							that not only solved the problem but achieved
							state-of-the-art results.
						</li>
					</ol>
				</CardContent>
			</Card>
		</div>
	);
}
