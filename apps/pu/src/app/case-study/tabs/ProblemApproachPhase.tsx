"use client";

import { LaTeX } from "@/components/LaTeX";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Database, Target } from "lucide-react";
import Link from "next/link";

export function ProblemApproachPhase() {
	return (
		<div className="space-y-8">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center">
						<Target className="h-5 w-5 mr-2 text-red-600" />
						Problem & Approach
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-8">
					{/* Top Goal summary in red block */}
					<div className="bg-red-50 p-6 rounded-lg border border-red-100">
						<h4 className="font-semibold text-red-800 mb-2">
							Goal
						</h4>
						<p className="text-sm text-red-700">
							Develop a PU-learning based anomaly detection system
							that identifies energy anomalies using confirmed
							positives and massive unlabeled data, with near
							real-time response.
						</p>
					</div>

					{/* Dataset vs Constraints side-by-side */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						<div className="bg-yellow-50 p-6 rounded-lg">
							<h4 className="font-semibold text-yellow-800 mb-4">
								Dataset Characteristics
							</h4>
							<div className="grid grid-cols-2 gap-4 text-sm">
								<div>
									<p className="text-yellow-700">
										<strong>Time Period:</strong> 18 months
									</p>
									<p className="text-yellow-700">
										<strong>Apartments:</strong> 95 units
									</p>
									<p className="text-yellow-700">
										<strong>Sensors:</strong> 1,695 devices
									</p>
								</div>
								<div>
									<p className="text-yellow-700">
										<strong>Data Points:</strong> 43.2M
										readings
									</p>
									<p className="text-yellow-700">
										<strong>Labeled Anomalies:</strong> 200
										cases
									</p>
									<p className="text-yellow-700">
										<strong>Unlabeled:</strong> 43.2M - 200
									</p>
								</div>
							</div>
						</div>
						<div className="bg-blue-50 p-6 rounded-lg">
							<h4 className="font-semibold text-blue-800 mb-4">
								Real-world Constraints
							</h4>
							<ul className="text-sm text-blue-700 space-y-2">
								<li>
									• <strong>Limited Labels:</strong> Only 200
									confirmed anomalies
								</li>
								<li>
									• <strong>Unlabeled Data:</strong> 2.4M+
									daily readings with unknown status
								</li>
								<li>
									• <strong>Cost Sensitivity:</strong> Manual
									inspection is expensive
								</li>
								<li>
									• <strong>Real-time:</strong> Detection
									within 5 minutes
								</li>
							</ul>
						</div>
					</div>

					{/* Approach: Why PU + Methodology combined */}
					<div className="space-y-6">
						<div className="bg-green-50 p-6 rounded-lg">
							<h4 className="font-semibold text-green-800 mb-3">
								Why PU Learning?
							</h4>
							<div className="space-y-2 text-sm text-green-700">
								<div className="flex items-start gap-2">
									<CheckCircle className="h-4 w-4 mt-0.5 text-green-600" />
									<p>
										Positive-only labels with massive
										unlabeled data
									</p>
								</div>
								<div className="flex items-start gap-2">
									<CheckCircle className="h-4 w-4 mt-0.5 text-green-600" />
									<p>
										Addresses labeling bias in real-world
										anomaly detection
									</p>
								</div>
								<div className="flex items-start gap-2">
									<CheckCircle className="h-4 w-4 mt-0.5 text-green-600" />
									<p>
										Sound theoretical guarantees under SCAR
									</p>
								</div>
							</div>
						</div>

						<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
							<div className="bg-purple-50 p-6 rounded-lg">
								<h4 className="font-semibold text-purple-800 mb-4">
									1. Problem Formulation
								</h4>
								<div className="space-y-3 text-sm text-purple-700">
									<p>
										<strong>P:</strong> ~200 manually
										confirmed anomalies
									</p>
									<p>
										<strong>U:</strong> 43.2M readings (mix
										of normal + unknown anomalies)
									</p>
									<p>
										<strong>Assumption:</strong> SCAR
									</p>
									<div className="bg-slate-50 p-3 rounded border">
										<LaTeX
											className="block text-center mb-2 text-sm"
											displayMode
										>
											{
												"P(s=1 \\mid x, y=1) = c\\ \text{(constant)}"
											}
										</LaTeX>
										<p className="text-xs text-purple-600">
											SCAR enables unbiased risk
											estimation from biased P and U.
										</p>
									</div>
								</div>
							</div>

							<div className="bg-blue-50 p-6 rounded-lg">
								<h4 className="font-semibold text-blue-800 mb-4">
									2. Algorithm Selection
								</h4>
								<div className="space-y-3 text-sm text-blue-700">
									<p>
										<strong>Primary:</strong> nnPU
									</p>
									<p>
										<strong>Backup:</strong> uPU
									</p>
									<div className="bg-white p-3 rounded border">
										<LaTeX
											className="block text-center text-sm"
											displayMode
										>
											{
												"\\hat{R}_{\\mathrm{nnPU}} = \\pi^{+} \\hat{R}_{P}^{+} + \\max\\left(0, \\hat{R}_{U} - \\pi^{+} \\hat{R}_{P}^{+}\\right)"
											}
										</LaTeX>
									</div>
								</div>
							</div>

							<div className="bg-emerald-50 p-6 rounded-lg">
								<h4 className="font-semibold text-emerald-800 mb-4">
									3. Class Prior Estimation
								</h4>
								<div className="space-y-3 text-sm text-emerald-700">
									<p>
										<strong>Method:</strong> AlphaMax
									</p>
									<p>
										<strong>Estimated π⁺:</strong> 0.0046
										(0.46%)
									</p>
									<div className="bg-white p-3 rounded border">
										<LaTeX
											className="block text-center text-sm"
											displayMode
										>
											{
												"\\pi^{+} = \\frac{|P|}{|P| + |\\text{positive samples in } U|}"
											}
										</LaTeX>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Feature Engineering */}
					<div className="bg-slate-50 p-6 rounded-lg">
						<h4 className="font-semibold text-slate-800 mb-4">
							Feature Engineering for Energy Anomalies
						</h4>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<h5 className="font-medium text-slate-700 mb-3">
									Temporal Features
								</h5>
								<ul className="text-sm text-slate-600 space-y-1">
									<li>
										• Hour-of-day & day-of-week patterns
									</li>
									<li>• Monthly seasonal trends</li>
									<li>
										• Multi-scale moving averages (1h, 6h,
										24h)
									</li>
								</ul>
							</div>
							<div>
								<h5 className="font-medium text-slate-700 mb-3">
									Statistical Features
								</h5>
								<ul className="text-sm text-slate-600 space-y-1">
									<li>• Deviation from personal baseline</li>
									<li>• Z-score normalization</li>
									<li>• Rate of change detection</li>
									<li>• Appliance-level disaggregation</li>
								</ul>
							</div>
						</div>
					</div>

					{/* CTA */}
					<div className="mt-2 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
						<div className="flex items-center justify-between">
							<div>
								<h4 className="text-lg font-semibold text-blue-900 mb-2">
									Explore the Full IoT Testbed
								</h4>
								<p className="text-blue-700">
									See how our 95-apartment, 1,695-sensor
									testbed generates real-time data for anomaly
									detection research.
								</p>
							</div>
							<Link href="/testbed">
								<Button className="bg-blue-600 hover:bg-blue-700 text-white">
									<Database className="h-4 w-4 mr-2" />
									View Testbed Platform
								</Button>
							</Link>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

export default ProblemApproachPhase;
