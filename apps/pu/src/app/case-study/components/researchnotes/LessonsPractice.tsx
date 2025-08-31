"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	GanttChart,
	GitCompareArrows,
	Microscope,
	SearchCheck,
	ShieldAlert,
} from "lucide-react";

// Define props type for Learning Point component
type LearningPointProps = {
	icon: React.ElementType;
	title: string;
	subtitle?: string;
	children: React.ReactNode;
};

// Reusable Learning Point subcomponent
const LearningPoint = ({
	icon: Icon,
	title,
	subtitle,
	children,
}: LearningPointProps) => (
	<div className="flex items-start gap-4 p-4 rounded-lg border bg-slate-50/50 hover:bg-slate-50 transition-colors">
		<Icon className="h-8 w-8 text-slate-500 mt-1 flex-shrink-0" />
		<div className="space-y-2">
			<h4 className="text-lg font-semibold text-slate-800">{title}</h4>
			{subtitle && (
				<p className="text-sm font-medium text-blue-600 mb-2">
					{subtitle}
				</p>
			)}
			<div className="text-gray-700 text-sm">{children}</div>
		</div>
	</div>
);

export default function LessonsPractice() {
	return (
		<section id="lessons-practice" className="scroll-mt-6">
			<Card className="bg-white shadow-lg">
				<CardHeader>
					<h2 className="text-base font-semibold uppercase text-blue-600 tracking-wider text-left mb-4">
						Lessons from Practice
					</h2>
					<CardTitle className="text-3xl font-bold text-gray-800 text-left">
						Core Takeaways & Key Learnings
					</CardTitle>
					<p className="text-lg text-gray-500 pt-2 text-left">
						Challenges, pitfalls, and key insights distilled from
						our entire development lifecycle and research journey.
					</p>
				</CardHeader>
				<CardContent className="space-y-4">
					<LearningPoint
						icon={GanttChart}
						title="The Sanctity of Time Series"
						subtitle="Temporal order is inviolable"
					>
						<ul className="space-y-1">
							<li className="flex items-start gap-2">
								<span className="text-blue-600 mt-1">•</span>
								<span>
									<strong>Chronological order</strong> is the
									inviolable first principle
								</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-blue-600 mt-1">•</span>
								<span>
									Any operation disrupting this order ={" "}
									<strong>disaster</strong>
								</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-blue-600 mt-1">•</span>
								<span>
									<strong>Time is sacred</strong> in
									sequential data analysis
								</span>
							</li>
						</ul>
					</LearningPoint>

					<LearningPoint
						icon={ShieldAlert}
						title="Data Leakage is a Silent Killer"
						subtitle="Prevention is better than detection"
					>
						<ul className="space-y-1">
							<li className="flex items-start gap-2">
								<span className="text-red-600 mt-1">•</span>
								<span>
									<strong>
										"Split first, process later"
									</strong>{" "}
									is the iron law
								</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-red-600 mt-1">•</span>
								<span>
									<strong>Temporal splitting before</strong>{" "}
									feature engineering
								</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-red-600 mt-1">•</span>
								<span>
									Ensures{" "}
									<strong>
										authentic evaluation results
									</strong>
								</span>
							</li>
						</ul>
					</LearningPoint>

					<LearningPoint
						icon={GitCompareArrows}
						title="Consistency is King"
						subtitle="Training and evaluation must use the same ruler"
					>
						<ul className="space-y-1">
							<li className="flex items-start gap-2">
								<span className="text-green-600 mt-1">•</span>
								<span>
									<strong>
										Same features, scalers, architecture
									</strong>{" "}
									across pipeline
								</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-green-600 mt-1">•</span>
								<span>
									Establish <strong>shared code</strong>{" "}
									(shared_models.py)
								</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-green-600 mt-1">•</span>
								<span>
									<strong>Best engineering practice</strong>{" "}
									for alignment
								</span>
							</li>
						</ul>
					</LearningPoint>

					<LearningPoint
						icon={SearchCheck}
						title="Trust Logs, but Question Results"
						subtitle="Critical thinking over blind acceptance"
					>
						<ul className="space-y-1">
							<li className="flex items-start gap-2">
								<span className="text-orange-600 mt-1">•</span>
								<span>
									<strong>"Successful execution"</strong> ≠
									correct results
								</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-orange-600 mt-1">•</span>
								<span>
									<strong>Inflated metrics</strong> (F1 &gt;
									0.9) are dangerous
								</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-orange-600 mt-1">•</span>
								<span>
									<strong>Mindless predictions</strong>{" "}
									(Recall = 1.0, TN = 0) = red flags
								</span>
							</li>
						</ul>
					</LearningPoint>

					<LearningPoint
						icon={Microscope}
						title="The Devil is in the Details"
						subtitle="Micro-level implementation determines macro-level success"
					>
						<ul className="space-y-1">
							<li className="flex items-start gap-2">
								<span className="text-purple-600 mt-1">•</span>
								<span>
									<strong>PyTorch gotchas:</strong>{" "}
									<code>.cpu()</code> and <code>grad_fn</code>{" "}
									issues
								</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-purple-600 mt-1">•</span>
								<span>
									<strong>Dimension mismatches:</strong>{" "}
									<code>BatchNorm1d</code> input shapes
								</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-purple-600 mt-1">•</span>
								<span>
									<strong>Micro-details</strong> determine
									macro success
								</span>
							</li>
						</ul>
					</LearningPoint>
				</CardContent>
			</Card>
		</section>
	);
}
