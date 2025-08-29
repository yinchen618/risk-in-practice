"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	AlertTriangle,
	Brain,
	CheckCircle,
	Database,
	Target,
	TrendingUp,
	Users,
	Zap,
} from "lucide-react";

export default function ProblemApproachTab() {
	return (
		<div className="space-y-8">
			{/* Tab-specific heading */}
			<div className="text-center mb-8">
				<h2 className="text-3xl font-semibold text-slate-800 mb-4">
					Problem Definition & PU Learning Approach
				</h2>
				<p className="text-lg text-slate-600 max-w-3xl mx-auto">
					Understanding the core challenges of anomaly detection in
					smart homes and why Positive-Unlabeled Learning is the
					optimal solution
				</p>
			</div>

			{/* Problem Statement */}
			<Card className="border-l-4 border-l-red-500">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<AlertTriangle className="h-5 w-5 text-red-500" />
						The Core Problem
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid md:grid-cols-2 gap-6">
						<div>
							<h4 className="font-semibold mb-2 flex items-center gap-2">
								<Database className="h-4 w-4" />
								Data Characteristics
							</h4>
							<ul className="space-y-2 text-sm text-slate-600">
								<li>
									• <strong>Imbalanced:</strong> Anomalies are
									rare (&lt;1% of data)
								</li>
								<li>
									• <strong>Unlabeled majority:</strong> 99%+
									normal behavior unlabeled
								</li>
								<li>
									• <strong>Temporal drift:</strong> Behavior
									patterns change over time
								</li>
								<li>
									• <strong>High-dimensional:</strong>{" "}
									Multi-scale temporal features
								</li>
							</ul>
						</div>
						<div>
							<h4 className="font-semibold mb-2 flex items-center gap-2">
								<Users className="h-4 w-4" />
								Real-World Constraints
							</h4>
							<ul className="space-y-2 text-sm text-slate-600">
								<li>
									• <strong>Limited experts:</strong> Manual
									labeling is expensive
								</li>
								<li>
									• <strong>Subjective labels:</strong> What
									constitutes "anomalous"?
								</li>
								<li>
									• <strong>Privacy concerns:</strong>{" "}
									Sensitive residential data
								</li>
								<li>
									• <strong>Scalability:</strong> Need
									automated detection
								</li>
							</ul>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Why Traditional Methods Fail */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Zap className="h-5 w-5 text-orange-500" />
						Why Traditional Approaches Fall Short
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid md:grid-cols-3 gap-6">
						<div className="p-4 bg-red-50 rounded-lg">
							<h4 className="font-semibold text-red-700 mb-2">
								Supervised Learning
							</h4>
							<p className="text-sm text-red-600">
								Requires balanced labeled datasets. In our
								domain, we have:
								<br />• Only 696 positive labels
								<br />• No confirmed negative labels
								<br />• Extreme class imbalance
							</p>
						</div>
						<div className="p-4 bg-orange-50 rounded-lg">
							<h4 className="font-semibold text-orange-700 mb-2">
								Unsupervised Learning
							</h4>
							<p className="text-sm text-orange-600">
								Can't leverage domain knowledge:
								<br />• No use of expert-labeled anomalies
								<br />• High false positive rates
								<br />• Difficult to tune without ground truth
							</p>
						</div>
						<div className="p-4 bg-yellow-50 rounded-lg">
							<h4 className="font-semibold text-yellow-700 mb-2">
								Semi-Supervised
							</h4>
							<p className="text-sm text-yellow-600">
								Assumes clean negative samples:
								<br />• No guaranteed "normal" data
								<br />• Hidden anomalies in unlabeled set
								<br />• Distribution mismatch issues
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* PU Learning Solution */}
			<Card className="border-l-4 border-l-green-500">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Brain className="h-5 w-5 text-green-500" />
						PU Learning: The Optimal Solution
					</CardTitle>
					<CardDescription>
						Positive-Unlabeled Learning perfectly matches our
						problem characteristics
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="grid md:grid-cols-2 gap-6">
						<div>
							<h4 className="font-semibold mb-3 flex items-center gap-2">
								<Target className="h-4 w-4 text-green-600" />
								Perfect Problem Match
							</h4>
							<div className="space-y-2">
								<div className="flex items-center gap-2">
									<CheckCircle className="h-4 w-4 text-green-500" />
									<span className="text-sm">
										Works with only positive + unlabeled
										data
									</span>
								</div>
								<div className="flex items-center gap-2">
									<CheckCircle className="h-4 w-4 text-green-500" />
									<span className="text-sm">
										No need for negative examples
									</span>
								</div>
								<div className="flex items-center gap-2">
									<CheckCircle className="h-4 w-4 text-green-500" />
									<span className="text-sm">
										Handles class imbalance naturally
									</span>
								</div>
								<div className="flex items-center gap-2">
									<CheckCircle className="h-4 w-4 text-green-500" />
									<span className="text-sm">
										Estimates class prior automatically
									</span>
								</div>
							</div>
						</div>
						<div>
							<h4 className="font-semibold mb-3 flex items-center gap-2">
								<TrendingUp className="h-4 w-4 text-blue-600" />
								Implementation Variants
							</h4>
							<div className="space-y-3">
								<div className="p-3 bg-blue-50 rounded">
									<Badge className="mb-1">
										uPU (Unbiased PU)
									</Badge>
									<p className="text-xs text-blue-700">
										Theoretical guarantees, risk correction
										approach
									</p>
								</div>
								<div className="p-3 bg-purple-50 rounded">
									<Badge className="mb-1">
										nnPU (Non-negative PU)
									</Badge>
									<p className="text-xs text-purple-700">
										Prevents overfitting, more robust in
										practice
									</p>
								</div>
							</div>
						</div>
					</div>

					<Alert>
						<Brain className="h-4 w-4" />
						<AlertDescription>
							<strong>Our Architecture:</strong> LSTM-based
							temporal feature extraction + PU learning loss
							functions. The LSTM captures temporal dependencies
							in electricity usage patterns, while PU learning
							handles the positive-unlabeled nature of our anomaly
							detection problem.
						</AlertDescription>
					</Alert>
				</CardContent>
			</Card>

			{/* Methodology Overview */}
			<Card>
				<CardHeader>
					<CardTitle>Our 4-Stage Methodology</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
						<div className="text-center p-4 bg-blue-50 rounded-lg">
							<div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">
								1
							</div>
							<h4 className="font-semibold text-blue-700">
								Candidate Generation
							</h4>
							<p className="text-xs text-blue-600 mt-1">
								Statistical rules identify potential anomalies
							</p>
						</div>
						<div className="text-center p-4 bg-green-50 rounded-lg">
							<div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">
								2
							</div>
							<h4 className="font-semibold text-green-700">
								Expert Labeling
							</h4>
							<p className="text-xs text-green-600 mt-1">
								Domain experts confirm true anomalies
							</p>
						</div>
						<div className="text-center p-4 bg-purple-50 rounded-lg">
							<div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">
								3
							</div>
							<h4 className="font-semibold text-purple-700">
								Model Training
							</h4>
							<p className="text-xs text-purple-600 mt-1">
								LSTM + PU learning with hyperparameter
								optimization
							</p>
						</div>
						<div className="text-center p-4 bg-orange-50 rounded-lg">
							<div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">
								4
							</div>
							<h4 className="font-semibold text-orange-700">
								Evaluation
							</h4>
							<p className="text-xs text-orange-600 mt-1">
								Cross-domain testing and performance analysis
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
