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

// Reusable Learning Point subcomponent - 簡化版本
const LearningPoint = ({
	icon: Icon,
	title,
	subtitle,
	children,
}: LearningPointProps) => (
	<div className="flex items-start gap-4 p-4 rounded-lg border bg-slate-50/50 hover:bg-slate-50 transition-colors">
		<Icon className="h-6 w-6 text-slate-500 mt-1 flex-shrink-0" />
		<div className="space-y-2">
			<h4 className="text-lg font-semibold text-slate-800">{title}</h4>
			{subtitle && (
				<p className="text-sm font-medium text-blue-600 mb-2">
					{subtitle}
				</p>
			)}
			<div className="text-gray-700 text-sm leading-relaxed">
				{children}
			</div>
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
						Critical insights distilled from our development
						lifecycle and research journey.
					</p>
				</CardHeader>
				<CardContent className="space-y-4">
					<LearningPoint
						icon={GanttChart}
						title="The Sanctity of Time Series"
						subtitle="Temporal order is inviolable"
					>
						<div className="space-y-2">
							<p>
								<strong>Chronological order</strong> is the
								inviolable first principle
							</p>
							<p>
								Any operation disrupting this order ={" "}
								<strong>disaster</strong>
							</p>
							<p>
								<strong>Time is sacred</strong> in sequential
								data analysis
							</p>
						</div>
					</LearningPoint>

					<LearningPoint
						icon={ShieldAlert}
						title="Data Leakage is a Silent Killer"
						subtitle="Prevention is better than detection"
					>
						<div className="space-y-2">
							<p>
								<strong>"Split first, process later"</strong> is
								the iron law
							</p>
							<p>
								<strong>Temporal splitting before</strong>{" "}
								feature engineering
							</p>
							<p>
								Ensures{" "}
								<strong>authentic evaluation results</strong>
							</p>
						</div>
					</LearningPoint>

					<LearningPoint
						icon={GitCompareArrows}
						title="Consistency is King"
						subtitle="Training and evaluation must use the same ruler"
					>
						<div className="space-y-2">
							<p>
								<strong>
									Same features, scalers, architecture
								</strong>{" "}
								across pipeline
							</p>
							<p>
								Establish <strong>shared code</strong>{" "}
								(shared_models.py)
							</p>
							<p>
								<strong>Best engineering practice</strong> for
								alignment
							</p>
						</div>
					</LearningPoint>

					<LearningPoint
						icon={SearchCheck}
						title="Trust Logs, but Question Results"
						subtitle="Critical thinking over blind acceptance"
					>
						<div className="space-y-2">
							<p>
								<strong>"Successful execution"</strong> ≠
								correct results
							</p>
							<p>
								<strong>Inflated metrics</strong> (F1 &gt; 0.9)
								are dangerous
							</p>
							<p>
								<strong>Mindless predictions</strong> (Recall =
								1.0, TN = 0) = red flags
							</p>
						</div>
					</LearningPoint>

					<LearningPoint
						icon={Microscope}
						title="The Devil is in the Details"
						subtitle="Micro-level implementation determines macro-level success"
					>
						<div className="space-y-2">
							<p>
								<strong>PyTorch gotchas:</strong>{" "}
								<code>.cpu()</code> and <code>grad_fn</code>{" "}
								issues
							</p>
							<p>
								<strong>Dimension mismatches:</strong>{" "}
								<code>BatchNorm1d</code> input shapes
							</p>
							<p>
								<strong>Micro-details</strong> determine macro
								success
							</p>
						</div>
					</LearningPoint>
				</CardContent>
			</Card>
		</section>
	);
}
