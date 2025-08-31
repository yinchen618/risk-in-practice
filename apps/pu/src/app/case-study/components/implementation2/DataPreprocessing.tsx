"use client";

import DataSplitStrategy from "@/app/case-study/components/implementation2/DataSplitStrategy";
import SinglePhaseThreeWire from "@/app/case-study/components/implementation2/SinglePhaseThreeWire";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, GitMerge, Scaling, Split } from "lucide-react";

export default function DataPreprocessing() {
	return (
		<section id="data-preprocessing" className="scroll-mt-6">
			<Card className="bg-white shadow-lg">
				<CardHeader>
					<h2 className="text-base font-semibold uppercase text-blue-600 tracking-wider">
						Part 1: Data Preprocessing
					</h2>
					<CardTitle className="text-3xl font-bold text-gray-800 pt-1">
						Crafting Feature Vectors with Temporal Context
					</CardTitle>
					<p className="text-lg text-gray-500 pt-2">
						This section details the critical steps taken to
						transform raw, individual data points into rich,
						history-aware feature vectors suitable for our LSTM
						model.
					</p>
				</CardHeader>
				<CardContent className="grid md:grid-cols-2 gap-6">
					{/* Step 1: Data Integration */}
					<div className="p-6 border rounded-xl bg-slate-50/70 space-y-3">
						<h3 className="text-xl font-semibold text-gray-700 flex items-center gap-3">
							<GitMerge className="h-7 w-7 text-indigo-500" />
							1. Data Integration & Chronological Alignment
						</h3>
						<p className="text-sm text-gray-600">
							The process begins by extracting five key electrical
							features (e.g., `wattage_total`) from the database.
							Positive (P) and Unlabeled (U) data are then merged.
						</p>
						<p className="text-sm text-gray-800 bg-indigo-100 border-l-4 border-indigo-500 p-3 rounded">
							<b>Key Step:</b> The combined dataset is immediately
							sorted by timestamp. This strict chronological
							ordering is the bedrock of temporal integrity for
							all subsequent operations.
						</p>
					</div>

					{/* Step 2: Feature Engineering */}
					<div className="p-6 border rounded-xl bg-slate-50/70 space-y-3">
						<h3 className="text-xl font-semibold text-gray-700 flex items-center gap-3">
							<Activity className="h-7 w-7 text-red-500" />
							2. Dynamic Temporal Feature Engineering
						</h3>
						<p className="text-sm text-gray-600">
							We employ a sliding window mechanism. For each time
							point <em>t</em>, we look back at the data over a
							defined `window_size` to compute a new set of
							features.
						</p>
						<div>
							<h4 className="font-semibold text-sm text-gray-800">
								Generated Feature Types:
							</h4>
							<ul className="mt-1 list-disc list-inside text-sm text-gray-600 space-y-1">
								<li>
									<b>Statistical Features:</b> Mean, standard
									deviation (std), min/max values within the
									window.
								</li>
								<li>
									<b>Trend Features:</b> The delta between the
									current value and the window's mean, rate of
									change, etc.
								</li>
							</ul>
						</div>
						<p className="text-sm text-gray-800 bg-red-100 border-l-4 border-red-500 p-3 rounded">
							<b>Outcome:</b> This step expands the feature
							dimension from <b>5 to over 25</b>, transforming
							each sample from a single 'point' into a 'snapshot
							of a timeline'.
						</p>
					</div>

					{/* Step 3: Data Splitting */}
					<div className="p-6 border rounded-xl bg-slate-50/70 space-y-3">
						<h3 className="text-xl font-semibold text-gray-700 flex items-center gap-3">
							<Split className="h-7 w-7 text-green-500" />
							3. Chronological Splitting to Prevent Data Leakage
						</h3>
						<p className="text-sm text-gray-600">
							To ensure robust evaluation without data leakage, we
							use a unique time-based splitting strategy:
						</p>
						<ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
							<li>
								Separate the sorted data into P and U subsets.
							</li>
							<li>
								Independently split each subset chronologically
								(e.g., 70% train, 20% val, 10% test).
							</li>
							<li>
								Merge the corresponding subsets (e.g., P_train +
								U_train) and re-sort by time.
							</li>
						</ol>
						<p className="text-sm text-gray-800 bg-green-100 border-l-4 border-green-500 p-3 rounded">
							<b>Advantage:</b> This method perfectly guarantees
							that (a) validation/test sets are strictly in the
							future relative to the training set, and (b) all
							sets contain a mix of P and U samples for meaningful
							evaluation.
						</p>
					</div>

					{/* Step 4: Standardization */}
					<div className="p-6 border rounded-xl bg-slate-50/70 space-y-3">
						<h3 className="text-xl font-semibold text-gray-700 flex items-center gap-3">
							<Scaling className="h-7 w-7 text-amber-500" />
							4. Feature Standardization
						</h3>
						<p className="text-sm text-gray-600">
							We use the `StandardScaler` from scikit-learn to
							normalize the feature vectors.
						</p>
						<p className="text-sm text-gray-800 bg-amber-100 border-l-4 border-amber-500 p-3 rounded">
							<b>The Principle:</b> The scaler is{" "}
							<b>
								fitted <em>only</em> on the training data
							</b>{" "}
							(<code>X_train</code>) and then used to{" "}
							<b>transform</b> the validation and test sets. This
							is a critical practice to prevent statistical
							information from the validation/test sets from
							leaking into the training process.
						</p>
					</div>
				</CardContent>
			</Card>
			{/* Data Split Strategy Section */}
			<div className="mt-12">
				<SinglePhaseThreeWire />
				<DataSplitStrategy />
			</div>
		</section>
	);
}
