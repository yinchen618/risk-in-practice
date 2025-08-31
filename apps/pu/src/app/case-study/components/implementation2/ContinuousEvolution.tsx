"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarClock, TrendingUp, Users, Zap } from "lucide-react";

export default function ContinuousEvolution() {
	return (
		<section id="continuous-evolution" className="scroll-mt-6">
			<Card className="bg-white shadow-lg">
				<CardHeader>
					<h2 className="text-base font-semibold uppercase text-blue-600 tracking-wider">
						Part 4: Continuous Evolution
					</h2>
					<CardTitle className="text-3xl font-bold text-gray-800 flex items-center gap-3">
						<TrendingUp className="h-8 w-8 text-cyan-600" />
						Continuous Evolution: The Model's Adaptive Strategies
					</CardTitle>
					<p className="text-lg text-gray-500 pt-2">
						A static model becomes stale. Our system is designed
						with dynamic update mechanisms to adapt to new data
						patterns.
					</p>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="flex items-start gap-4 p-4 rounded-lg border bg-slate-50">
						<CalendarClock className="h-8 w-8 text-slate-500 mt-1 flex-shrink-0" />
						<div>
							<h4 className="text-xl font-semibold text-slate-700">
								Periodic Retraining
							</h4>
							<p className="text-gray-600">
								The model undergoes a full retraining schedule
								(e.g., weekly or monthly) on an aggregated
								dataset of historical and new data. This
								strategy adapts the model to long-term shifts
								and drifts in the data distribution.
							</p>
						</div>
					</div>

					<div className="flex items-start gap-4 p-4 rounded-lg border bg-slate-50">
						<Zap className="h-8 w-8 text-slate-500 mt-1 flex-shrink-0" />
						<div>
							<h4 className="text-xl font-semibold text-slate-700">
								Online Learning & Incremental Updates
							</h4>
							<p className="text-gray-600">
								For rapid adaptation to short-term changes, the
								system supports online learning. The model can
								be fine-tuned on new streams of data in small
								batches, ensuring immediate responsiveness
								without waiting for a full retraining cycle.
							</p>
						</div>
					</div>

					<div className="flex items-start gap-4 p-4 rounded-lg border bg-slate-50">
						<Users className="h-8 w-8 text-slate-500 mt-1 flex-shrink-0" />
						<div>
							<h4 className="text-xl font-semibold text-slate-700">
								Human-in-the-Loop & Active Learning
							</h4>
							<p className="text-gray-600">
								This is the most intelligent adaptation loop.
								The model identifies ambiguous, low-confidence
								predictions and flags them for review by domain
								experts. Their feedback (newly confirmed
								positive labels) is prioritized and fed back
								into the training set, allowing the model to
								learn efficiently from the most informative
								samples.
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</section>
	);
}
