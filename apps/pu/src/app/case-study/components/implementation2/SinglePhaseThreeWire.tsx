"use client";

import { LaTeX } from "@/components/LaTeX";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { Database } from "lucide-react";
import { useState } from "react";
import { SinglePhaseThreeWireDiagramFlow } from "../diagrams/SinglePhaseThreeWireDiagramFlow";
import { TimeSyncPipelineDiagramFlow } from "../diagrams/TimeSyncPipelineDiagramFlow";

const CodeBlock = ({
	children,
	lang,
}: { children: React.ReactNode; lang: string }) => (
	<pre
		className={`bg-gray-800 text-white p-4 rounded-lg overflow-x-auto text-xs font-mono language-${lang}`}
	>
		<code>{children}</code>
	</pre>
);

export default function SinglePhaseThreeWire() {
	const [showImplementation, setShowImplementation] = useState(false);

	return (
		<section id="data-challenge" className="scroll-mt-6">
			<Card className="border-l-4 border-l-slate-400 bg-white shadow-lg p-0 overflow-hidden">
				<CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 border-b border-slate-200 p-6">
					<div className="flex items-center gap-4 mb-3">
						<div className="p-3 bg-slate-700 rounded-lg shadow-sm">
							<Database className="h-8 w-8 text-white" />
						</div>
						<div>
							<CardTitle className="text-3xl font-semibold text-slate-800 mb-1">
								Research Challenge 1: Data Quality & Integration
							</CardTitle>
							<div className="flex items-center gap-2">
								<div className="h-1 w-12 bg-slate-500 rounded-full" />
								<span className="text-sm font-medium text-slate-600 uppercase tracking-wide">
									Infrastructure Complexity
								</span>
							</div>
						</div>
					</div>
					<p className="text-lg text-slate-700 leading-relaxed bg-white/80 p-4 rounded-lg border border-slate-100">
						The first research challenge addresses the fundamental
						data quality and integration problems inherent in
						real-world energy monitoring systems. Understanding and
						systematically addressing multi-source data complexities
						is crucial for developing robust machine learning
						methodologies that can operate reliably in practical
						energy management environments.
					</p>
				</CardHeader>
				<CardContent className="space-y-8 p-6">
					{/* Testbed Data Collection & Transformation */}
					<h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
						<span className="text-2xl">🔬</span>
						1.1 Testbed Data Collection & Transformation
					</h2>
					<div id="taming-telemetry" className="scroll-mt-6">
						{/* Problem Statement */}
						<div className="bg-red-50 p-6 rounded-xl border-2 border-red-200 shadow-md mb-6">
							<h4 className="font-bold text-red-800 mb-4 flex items-center gap-3 text-xl">
								<AlertTriangle className="h-6 w-6" />
								The Challenge: Single-Phase Three-Wire System
								Complexity
							</h4>
							<div className="grid lg:grid-cols-2 gap-6">
								<div>
									<h5 className="font-semibold text-red-700 mb-3 text-lg">
										System Architecture
									</h5>
									<p className="text-slate-700 leading-relaxed text-base mb-4">
										A <LaTeX>{"1\\phi 3W"}</LaTeX>{" "}
										(single-phase, three-wire) system
										consists of two 110V live lines (L1, L2)
										and a neutral line (N). While 110V
										appliances draw from either L1 or L2,
										high-power 220V appliances draw from
										both simultaneously.
									</p>
									<h5 className="font-semibold text-red-700 mb-3 text-lg">
										Measurement Challenge
									</h5>
									<p className="text-slate-700 leading-relaxed text-base">
										The original two 110V meters can only
										measure the power usage of L1 and L2
										separately, making it impossible to
										directly distinguish which consumption
										is from 220V (across L1-L2) or 110V
										(from L1 or L2 alone).
									</p>
								</div>
								<div className="bg-white p-6 rounded-xl border-2 border-slate-200 shadow-sm">
									<h5 className="font-semibold text-slate-800 mb-4 text-lg">
										Real-World Challenges
									</h5>
									<ul className="text-slate-600 space-y-3">
										<li className="flex items-start gap-3">
											<div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
											<span>
												Dual-voltage systems create
												complex load patterns
											</span>
										</li>
										<li className="flex items-start gap-3">
											<div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
											<span>
												Power factor variations affect
												accuracy
											</span>
										</li>
										<li className="flex items-start gap-3">
											<div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
											<span>
												Harmonic distortions in
												non-linear loads
											</span>
										</li>
										<li className="flex items-start gap-3">
											<div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
											<span>
												Temperature-dependent meter
												calibration drift
											</span>
										</li>
									</ul>
								</div>
							</div>
						</div>

						{/* Our Solution: Core Feature Engineering */}
						<div className="bg-green-50 p-6 rounded-xl border-2 border-green-200 shadow-md mb-6">
							<h4 className="font-bold text-green-800 mb-4 flex items-center gap-3 text-xl">
								<span className="text-2xl">⚡</span>
								Our Solution: <LaTeX>{"1\\phi 3W"}</LaTeX>{" "}
								Feature Engineering
							</h4>
							<p className="text-slate-700 leading-relaxed text-base mb-6">
								Through mathematical derivation and feature
								engineering, we transform raw L1 and L2 meter
								readings into actionable insights that can
								differentiate between 110V and 220V usage,
								enabling comprehensive appliance identification
								and anomaly detection.
							</p>

							{/* Derived Feature Engineering Formulas */}
							<div className="bg-white p-6 rounded-lg border border-green-200 mb-6">
								<h5 className="font-semibold text-green-800 mb-4 text-lg text-center">
									Derived Feature Engineering Formulas
								</h5>
								<div className="grid md:grid-cols-3 gap-4 text-center">
									<div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
										<div className="font-medium text-blue-800 mb-2">
											Total Power
										</div>
										<LaTeX>
											{"\\text{Total} = P_{L1} + P_{L2}"}
										</LaTeX>
										<div className="text-xs text-slate-600 mt-2">
											Overall consumption
										</div>
									</div>
									<div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
										<div className="font-medium text-purple-800 mb-2">
											220V Load
										</div>
										<LaTeX>
											{
												"\\text{220V} = 2 \\times \\min(P_{L1}, P_{L2})"
											}
										</LaTeX>
										<div className="text-xs text-slate-600 mt-2">
											High-power appliances
										</div>
									</div>
									<div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
										<div className="font-medium text-amber-800 mb-2">
											110V Load
										</div>
										<LaTeX>
											{"\\text{110V} = |P_{L1} - P_{L2}|"}
										</LaTeX>
										<div className="text-xs text-slate-600 mt-2">
											Single-line appliances
										</div>
									</div>
								</div>
							</div>

							{/* Python Implementation */}
							<div className="bg-gray-100 p-6 rounded-lg border border-gray-300">
								<div className="font-medium text-gray-800 mb-3 text-lg">
									Python Implementation:
								</div>
								<div className="font-mono text-sm text-gray-700 bg-white p-4 rounded border overflow-x-auto">
									<div className="text-green-600">
										# 1φ 3W (Single-phase three-wire)
										feature engineering
									</div>
									<div>
										df_transformed['wattageTotal'] =
										df_merged['wattage_l1'] +
										df_merged['wattage_l2']
									</div>
									<div>
										df_transformed['wattage220v'] = 2 *
										np.minimum(df_merged['wattage_l1'],
										df_merged['wattage_l2'])
									</div>
									<div>
										df_transformed['wattage110v'] =
										np.abs(df_merged['wattage_l1'] -
										df_merged['wattage_l2'])
									</div>
								</div>
							</div>
						</div>

						{/* System Diagram */}
						<div className="mb-8">
							<SinglePhaseThreeWireDiagramFlow />
						</div>

						{/* Collapsible Mathematical Derivation */}
						<details className="bg-slate-50 p-6 rounded-xl border-2 border-slate-300 shadow-md">
							<summary className="font-bold text-slate-800 mb-4 flex items-center gap-3 text-xl cursor-pointer hover:text-slate-600">
								<span className="text-2xl">📐</span>
								[+] View Mathematical Derivation & Theoretical
								Foundation
							</summary>

							<div className="bg-white p-6 rounded-lg border border-slate-200 mt-4">
								<div className="text-center text-slate-700 space-y-6">
									<div className="text-lg font-semibold mb-6 text-slate-800">
										Mathematical Formulation & Trigonometric
										Derivation
									</div>

									{/* Fundamental Voltage Model */}
									<div className="bg-indigo-50 p-5 rounded-lg border border-indigo-200">
										<div className="font-medium text-indigo-800 mb-4 text-left">
											1. Fundamental AC Voltage Model (
											<LaTeX>{"1\\phi 3W"}</LaTeX> Taiwan{" "}
											<LaTeX>{"60\\,\\text{Hz}"}</LaTeX>{" "}
											System):
										</div>
										<div className="text-left space-y-3">
											<div className="flex items-center justify-between">
												<span className="text-sm text-slate-700">
													L1 to Neutral voltage:
												</span>
												<LaTeX>
													{
														"v_{L1}(t) = V_{peak} \\sin(\\omega t)"
													}
												</LaTeX>
											</div>
											<div className="flex items-center justify-between">
												<span className="text-sm text-slate-700">
													L2 to Neutral voltage (180°
													phase shift):
												</span>
												<LaTeX>
													{
														"v_{L2}(t) = V_{peak} \\sin(\\omega t + \\pi) = -V_{peak} \\sin(\\omega t)"
													}
												</LaTeX>
											</div>
										</div>
									</div>
								</div>
							</div>

							{/* Physical Interpretation */}
							<div className="grid md:grid-cols-2 gap-4 mt-6">
								<div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
									<h5 className="font-semibold text-purple-800 mb-3">
										Physical Basis
									</h5>
									<ul className="text-sm text-slate-700 space-y-2">
										<li className="flex items-start gap-2">
											<span className="text-purple-600">
												•
											</span>
											<span>
												<strong>Dual Voltage:</strong>{" "}
												L1-N, L2-N = 110V
											</span>
										</li>
										<li className="flex items-start gap-2">
											<span className="text-purple-600">
												•
											</span>
											<span>
												<strong>Line-to-Line:</strong>{" "}
												L1-L2 = 220V
											</span>
										</li>
									</ul>
								</div>

								<div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
									<h5 className="font-semibold text-teal-800 mb-3">
										Electrical Principles
									</h5>
									<ul className="text-sm text-slate-700 space-y-2">
										<li className="flex items-start gap-2">
											<span className="text-teal-600">
												•
											</span>
											<span>
												<strong>Power Factor:</strong>{" "}
												<LaTeX>
													{
														"P = V \\times I \\times \\cos(\\phi)"
													}
												</LaTeX>
											</span>
										</li>
										<li className="flex items-start gap-2">
											<span className="text-teal-600">
												•
											</span>
											<span>
												<strong>
													Phase Difference:
												</strong>{" "}
												L1, L2 = <LaTeX>{"180°"}</LaTeX>{" "}
												apart
											</span>
										</li>
									</ul>
								</div>
							</div>
						</details>
					</div>

					{/* Feature Engineering Mathematics */}
					<div className="bg-slate-50 p-6 rounded-xl border-2 border-slate-300 shadow-md">
						<h4 className="font-bold text-slate-800 mb-6 flex items-center gap-3 text-xl">
							<span className="text-2xl">⚡</span>
							<LaTeX>{"1\\phi 3W"}</LaTeX> Single-Phase Three-Wire
							Feature Engineering
						</h4>

						<div className="bg-white p-6 rounded-lg border border-slate-200 mb-4">
							<div className="text-center text-slate-700 space-y-6">
								<div className="text-lg font-semibold mb-6 text-slate-800">
									Mathematical Formulation & Trigonometric
									Derivation
								</div>

								{/* Fundamental Voltage Model */}
								<div className="bg-indigo-50 p-5 rounded-lg border border-indigo-200">
									<div className="font-medium text-indigo-800 mb-4 text-left">
										1. Fundamental AC Voltage Model (
										<LaTeX>{"1\\phi 3W"}</LaTeX> Taiwan{" "}
										<LaTeX>{"60\\,\\text{Hz}"}</LaTeX>{" "}
										System):
									</div>
									<div className="text-left space-y-3">
										<div className="flex items-center justify-between">
											<span className="text-sm text-slate-700">
												L1 to Neutral voltage:
											</span>
											<LaTeX>
												{
													"v_{L1}(t) = V_{peak} \\sin(\\omega t)"
												}
											</LaTeX>
										</div>
										<div className="flex items-center justify-between">
											<span className="text-sm text-slate-700">
												L2 to Neutral voltage (180°
												phase shift):
											</span>
											<LaTeX>
												{
													"v_{L2}(t) = V_{peak} \\sin(\\omega t + \\pi) = -V_{peak} \\sin(\\omega t)"
												}
											</LaTeX>
										</div>
										<div className="flex items-center justify-between">
											<span className="text-sm text-slate-700">
												Where angular frequency:
											</span>
											<LaTeX>
												{
													"\\omega = 2\\pi f = 2\\pi \\times 60\\,\\text{Hz} = 120\\pi \\text{ rad/s}"
												}
											</LaTeX>
										</div>
										<div className="flex items-center justify-between">
											<span className="text-sm text-slate-700">
												Peak voltage:
											</span>
											<LaTeX>
												{
													"V_{peak} = 110\\sqrt{2} \\approx 155.6 \\text{ V}"
												}
											</LaTeX>
										</div>
									</div>
								</div>

								{/* 220V Load Analysis */}
								<div className="bg-amber-50 p-5 rounded-lg border border-amber-200">
									<div className="font-medium text-amber-800 mb-4 text-left">
										2. Pure 220V Load Analysis (L1-L2
										Connection):
									</div>
									<div className="text-left space-y-3">
										<div className="text-sm text-slate-700 mb-2">
											Line-to-line voltage for 220V
											appliances:
										</div>
										<div className="text-center mb-3">
											<LaTeX>
												{
													"v_{L1-L2}(t) = v_{L1}(t) - v_{L2}(t) = 2V_{peak} \\sin(\\omega t)"
												}
											</LaTeX>
										</div>
										<div className="text-sm text-slate-700 mb-2">
											Current flow through 220V load
											creates balanced currents:
										</div>
										<div className="grid grid-cols-2 gap-4">
											<div className="text-center">
												<LaTeX>
													{"i_{L1}(t) = +i_{220V}(t)"}
												</LaTeX>
											</div>
											<div className="text-center">
												<LaTeX>
													{"i_{L2}(t) = -i_{220V}(t)"}
												</LaTeX>
											</div>
										</div>
										<div className="text-sm text-slate-700 mt-3 mb-2">
											Instantaneous power on each line:
										</div>
										<div className="space-y-2">
											<div className="text-center">
												<LaTeX>
													{
														"p_{L1}(t) = v_{L1}(t) \\times i_{L1}(t) = V_{peak} \\sin(\\omega t) \\times i_{220V}(t)"
													}
												</LaTeX>
											</div>
											<div className="text-center">
												<LaTeX>
													{
														"p_{L2}(t) = v_{L2}(t) \\times i_{L2}(t) = (-V_{peak} \\sin(\\omega t)) \\times (-i_{220V}(t))"
													}
												</LaTeX>
											</div>
										</div>
										<div className="bg-amber-100 p-3 rounded mt-3">
											<div className="text-center font-semibold text-amber-800">
												<strong>Key Result:</strong>{" "}
												<LaTeX>
													{"p_{L1}(t) = p_{L2}(t)"}
												</LaTeX>
											</div>
											<div className="text-xs text-amber-700 text-center mt-1">
												Balanced load condition: equal
												power draw from both lines
											</div>
										</div>
									</div>
								</div>

								{/* 110V Load Analysis */}
								<div className="bg-green-50 p-5 rounded-lg border border-green-200">
									<div className="font-medium text-green-800 mb-4 text-left">
										3. Pure 110V Load Analysis (L1-N or L2-N
										Connection):
									</div>
									<div className="text-left space-y-3">
										<div className="text-sm text-slate-700 mb-2">
											For a 110V load connected between L1
											and Neutral:
										</div>
										<div className="grid grid-cols-2 gap-4">
											<div className="text-center">
												<LaTeX>
													{"i_{L1}(t) = i_{110V}(t)"}
												</LaTeX>
											</div>
											<div className="text-center">
												<LaTeX>{"i_{L2}(t) = 0"}</LaTeX>
											</div>
										</div>
										<div className="text-sm text-slate-700 mt-3 mb-2">
											Resulting instantaneous powers:
										</div>
										<div className="space-y-2">
											<div className="text-center">
												<LaTeX>
													{
														"p_{L1}(t) = v_{L1}(t) \\times i_{110V}(t)"
													}
												</LaTeX>
											</div>
											<div className="text-center">
												<LaTeX>
													{
														"p_{L2}(t) = v_{L2}(t) \\times 0 = 0"
													}
												</LaTeX>
											</div>
										</div>
										<div className="bg-green-100 p-3 rounded mt-3">
											<div className="text-center font-semibold text-green-800">
												<strong>Key Result:</strong>{" "}
												<LaTeX>
													{
														"p_{L1}(t) \\neq p_{L2}(t)"
													}
												</LaTeX>
											</div>
											<div className="text-xs text-green-700 text-center mt-1">
												Imbalanced load condition: power
												difference indicates 110V
												consumption
											</div>
										</div>
									</div>
								</div>

								{/* Mixed Load Decomposition */}
								<div className="bg-purple-50 p-5 rounded-lg border border-purple-200">
									<div className="font-medium text-purple-800 mb-4 text-left">
										4. Mixed Load Decomposition (Real-World
										Scenario):
									</div>
									<div className="text-left space-y-3">
										<div className="text-sm text-slate-700 mb-2">
											In practical applications, both 110V
											and 220V loads operate
											simultaneously:
										</div>
										<div className="space-y-2">
											<div className="text-center">
												<LaTeX>
													{
														"P_{L1} = P_{balanced} + P_{imbalanced\\_L1}"
													}
												</LaTeX>
											</div>
											<div className="text-center">
												<LaTeX>
													{
														"P_{L2} = P_{balanced} + P_{imbalanced\\_L2}"
													}
												</LaTeX>
											</div>
										</div>
										<div className="text-sm text-slate-700 mt-3 mb-2">
											Where{" "}
											<LaTeX>{"P_{balanced}"}</LaTeX>{" "}
											represents the common power from
											220V loads, and{" "}
											<LaTeX>{"P_{imbalanced}"}</LaTeX>{" "}
											terms represent individual 110V
											loads.
										</div>
									</div>
								</div>

								{/* Final Formulas */}
								<div className="bg-slate-50 p-5 rounded-lg border border-slate-300">
									<div className="font-medium text-slate-800 mb-4 text-center text-lg">
										Derived Feature Engineering Formulas
									</div>
									<div className="space-y-4">
										{/* Total Power Formula */}
										<div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
											<div className="font-medium text-blue-800 mb-3">
												Total Power Consumption:
											</div>
											<div className="text-center text-xl">
												<LaTeX>
													{
														"P_{\\text{total}} = P_{L1} + P_{L2}"
													}
												</LaTeX>
											</div>
											<div className="text-sm text-slate-600 mt-3">
												Sum of all power drawn from both
												lines
											</div>
										</div>

										{/* 220V Power Formula */}
										<div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
											<div className="font-medium text-amber-800 mb-3">
												220V Appliance Power (Balanced
												Load):
											</div>
											<div className="text-center text-xl">
												<LaTeX>
													{
														"P_{220V} = 2 \\times \\min(P_{L1}, P_{L2})"
													}
												</LaTeX>
											</div>
											<div className="text-sm text-slate-600 mt-3">
												<LaTeX>{"\\min()"}</LaTeX>{" "}
												function extracts the balanced
												component; factor of 2 accounts
												for total 220V consumption
											</div>
										</div>

										{/* 110V Power Formula */}
										<div className="bg-green-50 p-4 rounded-lg border border-green-200">
											<div className="font-medium text-green-800 mb-3">
												110V Appliance Power (Imbalanced
												Load):
											</div>
											<div className="text-center text-xl">
												<LaTeX>
													{
														"P_{110V} = |P_{L1} - P_{L2}|"
													}
												</LaTeX>
											</div>
											<div className="text-sm text-slate-600 mt-3">
												Absolute difference captures the
												imbalanced portion representing
												110V consumption
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Physical Interpretation */}
						<div className="grid md:grid-cols-2 gap-4">
							<div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
								<h5 className="font-semibold text-purple-800 mb-3">
									Physical Basis
								</h5>
								<ul className="text-sm text-slate-700 space-y-2">
									<li className="flex items-start gap-2">
										<span className="text-purple-600">
											•
										</span>
										<span>
											<strong>L1-L2:</strong> 220V RMS
											voltage difference
										</span>
									</li>
									<li className="flex items-start gap-2">
										<span className="text-purple-600">
											•
										</span>
										<span>
											<strong>L1-N, L2-N:</strong> 110V
											RMS to neutral
										</span>
									</li>
									<li className="flex items-start gap-2">
										<span className="text-purple-600">
											•
										</span>
										<span>
											<strong>Balanced Load:</strong>{" "}
											Equal current flow
										</span>
									</li>
									<li className="flex items-start gap-2">
										<span className="text-purple-600">
											•
										</span>
										<span>
											<strong>Imbalanced Load:</strong>{" "}
											Single-phase operation
										</span>
									</li>
								</ul>
							</div>

							<div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
								<h5 className="font-semibold text-teal-800 mb-3">
									Electrical Principles
								</h5>
								<ul className="text-sm text-slate-700 space-y-2">
									<li className="flex items-start gap-2">
										<span className="text-teal-600">•</span>
										<span>
											<strong>Kirchhoff's Law:</strong>{" "}
											<LaTeX>{"\\sum I = 0"}</LaTeX> at
											neutral
										</span>
									</li>
									<li className="flex items-start gap-2">
										<span className="text-teal-600">•</span>
										<span>
											<strong>Power Factor:</strong>{" "}
											<LaTeX>
												{
													"P = V \\times I \\times \\cos(\\phi)"
												}
											</LaTeX>
										</span>
									</li>
									<li className="flex items-start gap-2">
										<span className="text-teal-600">•</span>
										<span>
											<strong>Phase Difference:</strong>{" "}
											L1, L2 = <LaTeX>{"180°"}</LaTeX>{" "}
											apart
										</span>
									</li>
									<li className="flex items-start gap-2">
										<span className="text-teal-600">•</span>
										<span>
											<strong>Load Attribution:</strong>{" "}
											Min() ensures accuracy
										</span>
									</li>
								</ul>
							</div>
						</div>

						{/* Code Implementation */}
						<div className="bg-gray-100 p-4 rounded-lg border border-gray-300 mt-4">
							<div className="font-medium text-gray-800 mb-2">
								Python Implementation:
							</div>
							<div className="font-mono text-sm text-gray-700 bg-white p-3 rounded border overflow-x-auto">
								<div>
									# 1φ 3W (Single-phase three-wire) feature
									engineering
								</div>
								<div>
									df_transformed['wattageTotal'] =
									df_merged['wattage_l1'] +
									df_merged['wattage_l2']
								</div>
								<div>
									df_transformed['wattage220v'] = 2 *
									np.minimum(df_merged['wattage_l1'],
									df_merged['wattage_l2'])
								</div>
								<div>
									df_transformed['wattage110v'] =
									np.abs(df_merged['wattage_l1'] -
									df_merged['wattage_l2'])
								</div>
							</div>
						</div>
					</div>

					{/* Temporal Synchronization */}
					<h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
						<span className="text-2xl">⏰</span>
						1.2 Temporal Synchronization
					</h2>
					<div id="time-alignment" className="scroll-mt-6">
						<div className="bg-blue-50 p-8 rounded-xl border-2 border-blue-200 shadow-md mb-8">
							<h4 className="font-bold text-blue-800 mb-6 flex items-center gap-3 text-xl">
								<Database className="h-6 w-6" />
								Stage 0: Automated Preprocessing ETL (Extract,
								Transform, Load) Pipeline
							</h4>
							<p className="text-slate-700 mb-6 leading-relaxed text-base">
								Independent IoT meters suffer from clock drift,
								network latency, and varying sampling rates,
								resulting in asynchronous, incomplete time
								series. Our automated ETL pipeline transforms
								this chaotic multi-source data into clean,
								synchronized, analysis-ready datasets through
								intelligent windowing, hybrid interpolation
								strategies, and feature engineering.
							</p>
						</div>

						{/* Golden Window Selection */}
						<div className="bg-slate-50 p-6 rounded-xl border-2 border-slate-200 shadow-md mb-8">
							<h4 className="font-bold text-slate-800 mb-6 flex items-center gap-3 text-xl">
								<span className="text-2xl">🔍</span>
								Golden Window Discovery
							</h4>

							{/* Engineering Rationale */}
							<div className="bg-slate-100 p-4 rounded-lg border border-slate-300 mb-6">
								<h6 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
									<span className="text-lg">⚙️</span>
									Engineering Rationale for Reproducible
									Research
								</h6>
								<p className="text-sm text-slate-700 leading-relaxed">
									To ensure the validity and reproducibility
									of our machine learning experiments, a
									stable and high-quality dataset is
									paramount. Our Golden Window Discovery is a{" "}
									<strong>critical preprocessing step</strong>{" "}
									designed to programmatically identify the
									most complete and consistent 7-day data
									segment. This is{" "}
									<strong>
										not a research contribution in itself
									</strong>
									, but a foundational engineering practice
									that mitigates the "Garbage In, Garbage Out"
									problem common in real-world IoT data,
									thereby guaranteeing that our subsequent{" "}
									<strong>
										PU Learning and Domain Adaptation
										research
									</strong>{" "}
									is evaluated on a reliable data foundation.
								</p>
							</div>

							<div className="grid lg:grid-cols-2 gap-6">
								<div>
									<h5 className="font-semibold text-slate-700 mb-3 text-lg">
										Intelligent Data Quality Assessment
									</h5>
									<p className="text-slate-700 leading-relaxed text-base mb-4">
										Rather than blindly processing all
										available data, our system performs a
										sliding window analysis across the
										entire collection period. For each
										potential 7-day window, it calculates a
										composite{" "}
										<strong>Data Quality Score</strong>{" "}
										prioritizing completeness ratio and
										minimizing missing periods.
									</p>
									<div className="bg-white p-4 rounded-lg border border-slate-200">
										<div className="text-center text-slate-800 mb-2">
											<LaTeX>
												{
													"\\text{Quality Score} = w_1 \\times \\text{completeness\\_ratio} - w_2 \\times \\text{missing\\_periods}"
												}
											</LaTeX>
										</div>
										<div className="text-xs text-slate-600 mt-2">
											Where w₁ = 0.8, w₂ = 0.2
											(prioritizing completeness)
										</div>
									</div>
								</div>
								<div className="space-y-4">
									<div className="bg-white p-4 rounded-lg border border-slate-200">
										<h6 className="font-semibold text-slate-800 mb-2">
											Benefits
										</h6>
										<ul className="text-sm text-slate-700 space-y-1">
											<li>
												• Automatic quality-based time
												window selection
											</li>
											<li>
												• Standardized 7-day analysis
												periods
											</li>
											<li>
												• Avoids "garbage in, garbage
												out" scenarios
											</li>
											<li>
												• Enables cross-room comparative
												analysis
											</li>
										</ul>
									</div>
									<div className="bg-white p-4 rounded-lg border border-amber-200">
										<h6 className="font-semibold text-amber-800 mb-2">
											Implementation
										</h6>
										<div className="text-xs font-mono text-slate-600 bg-gray-50 p-2 rounded">
											_evaluate_data_quality(window_data)
											<br />→ completeness_ratio: 0.95
											<br />→ missing_periods: 3<br />→
											quality_score: 0.76 - 0.6 = 0.16
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* ETL Processing Stages */}
						<div className="bg-slate-50 p-6 rounded-xl border-2 border-slate-300 shadow-md mb-8">
							<h4 className="font-bold text-slate-800 mb-6 flex items-center gap-3 text-xl">
								<span className="text-2xl">⚙️</span>
								Multi-Stage ETL Processing
							</h4>

							{/* Stage 1: Extract */}
							<div className="mb-6">
								<h5 className="font-semibold text-slate-800 mb-3 text-lg flex items-center gap-2">
									<span className="bg-blue-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center">
										1
									</span>
									Extract: Targeted Data Retrieval
								</h5>
								<div className="grid md:grid-cols-2 gap-4">
									<div className="bg-white p-4 rounded-lg border border-slate-200">
										<p className="text-slate-700 text-sm leading-relaxed">
											Extract raw L1 and L2 meter readings
											exclusively from the identified
											Golden Window period, avoiding
											unnecessary processing of
											poor-quality data segments.
										</p>
									</div>
									<div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
										<div className="text-xs font-mono text-blue-800">
											SELECT device_id, timestamp, wattage
											<br />
											FROM ammeter_logs
											<br />
											WHERE timestamp BETWEEN
											<br />
											&nbsp;&nbsp;golden_start AND
											golden_end
										</div>
									</div>
								</div>
							</div>

							{/* Stage 2: Transform */}
							<div className="mb-6">
								<h5 className="font-semibold text-slate-800 mb-3 text-lg flex items-center gap-2">
									<span className="bg-green-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center">
										2
									</span>
									Transform: Temporal Alignment & Hybrid Gap
									Handling
								</h5>

								{/* Temporal Bucketing */}
								<div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
									<h6 className="font-semibold text-green-800 mb-2">
										2.1 Temporal Bucketing
									</h6>
									<div className="grid md:grid-cols-2 gap-4">
										<div>
											<p className="text-slate-700 text-sm leading-relaxed mb-2">
												Resample both L1 and L2 time
												series to standardized 1-minute
												intervals, averaging any
												multiple readings within each
												bucket.
											</p>
											<div className="text-xs font-mono text-green-800 bg-white p-2 rounded">
												df.resample('1T').mean()
											</div>
										</div>
										<div className="bg-white p-3 rounded border">
											<div className="text-xs text-slate-600">
												<strong>Before:</strong>{" "}
												10:00:01, 10:00:58
												<br />
												<strong>After:</strong> 10:00:00
												(averaged)
											</div>
										</div>
									</div>
								</div>

								{/* Hybrid Gap Strategy */}
								<div className="bg-slate-50 p-4 rounded-lg border border-slate-300">
									<h6 className="font-semibold text-slate-800 mb-2">
										2.2 Hybrid Gap-Filling Strategy
									</h6>
									<div className="mb-3 p-3 bg-slate-100 rounded-lg border border-slate-400">
										<p className="text-slate-800 font-semibold text-sm flex items-center gap-2">
											<span className="text-lg">🎯</span>
											<span className="text-slate-700">
												Key Innovation:
											</span>
											Our temporal synchronization employs
											a{" "}
											<strong className="text-slate-900">
												hybrid gap-filling strategy
											</strong>
											that intelligently balances data
											continuity with authenticity,
											ensuring robust time-series analysis
											while preserving the temporal
											integrity essential for accurate
											anomaly detection.
										</p>
									</div>
									<div className="grid md:grid-cols-2 gap-4">
										<div>
											<p className="text-slate-700 text-sm leading-relaxed mb-3">
												Our system employs a{" "}
												<strong>
													layered approach
												</strong>{" "}
												that balances data continuity
												with authenticity:
											</p>
											<div className="space-y-2">
												<div className="bg-white p-3 rounded border border-slate-400">
													<div className="font-semibold text-slate-700 text-sm">
														✓ Forward Fill (≤3 min
														gaps)
													</div>
													<div className="text-xs text-slate-600">
														Brief network
														interruptions →
														interpolate
													</div>
												</div>
												<div className="bg-white p-3 rounded border border-slate-500">
													<div className="font-semibold text-slate-800 text-sm">
														✗ Deletion (&gt;3 min
														gaps)
													</div>
													<div className="text-xs text-slate-600">
														Extended outages →
														remove unreliable
														periods
													</div>
												</div>
											</div>
										</div>
										<div className="bg-white p-3 rounded border border-slate-300">
											<div className="text-xs font-mono text-slate-800">
												# Hybrid strategy implementation
												<br />
												df_merged = pd.merge(df_l1,
												df_l2, <br />
												&nbsp;&nbsp;how='outer',
												on='timestamp')
												<br />
												<br /># Limited forward fill
												<br />
												df_filled = df_merged.fillna(
												<br />
												&nbsp;&nbsp;method='ffill',
												limit=3)
												<br />
												<br /># Remove remaining gaps
												<br />
												df_clean = df_filled.dropna()
											</div>
										</div>
									</div>
								</div>
							</div>

							{/* Stage 3: Feature Engineering */}
							<div className="mb-6">
								<h5 className="font-semibold text-slate-800 mb-3 text-lg flex items-center gap-2">
									<span className="bg-purple-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center">
										3
									</span>
									Feature Engineering: Multi-Scale Power
									Analysis
								</h5>
								<div className="grid md:grid-cols-2 gap-4">
									<div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
										<h6 className="font-semibold text-purple-800 mb-2">
											Physical Power Features
										</h6>
										<div className="space-y-3 text-sm">
											<div className="flex items-center justify-between">
												<span>
													<strong>
														Total Power:
													</strong>
												</span>
												<LaTeX>
													{
														"P_{\\text{total}} = P_{L1} + P_{L2}"
													}
												</LaTeX>
											</div>
											<div className="flex items-center justify-between">
												<span>
													<strong>220V Load:</strong>
												</span>
												<LaTeX>
													{
														"P_{220V} = 2 \\times \\min(P_{L1}, P_{L2})"
													}
												</LaTeX>
											</div>
											<div className="flex items-center justify-between">
												<span>
													<strong>110V Load:</strong>
												</span>
												<LaTeX>
													{
														"P_{110V} = |P_{L1} - P_{L2}|"
													}
												</LaTeX>
											</div>
										</div>
									</div>
									<div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
										<h6 className="font-semibold text-teal-800 mb-2">
											Temporal Context Features
										</h6>
										<div className="space-y-2 text-sm">
											<div>
												•{" "}
												<strong>
													Short-term (15min):
												</strong>{" "}
												Mean, Std, Min, Max
											</div>
											<div>
												•{" "}
												<strong>
													Long-term (60min):
												</strong>{" "}
												Trend analysis
											</div>
											<div>
												• <strong>Time-based:</strong>{" "}
												hour_of_day, is_weekend
											</div>
										</div>
									</div>
								</div>
							</div>

							{/* Stage 4: Load */}
							<div>
								<h5 className="font-semibold text-slate-800 mb-3 text-lg flex items-center gap-2">
									<span className="bg-orange-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center">
										4
									</span>
									Load: Transactional Database Storage
								</h5>
								<div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
									<div className="grid md:grid-cols-2 gap-4">
										<div>
											<p className="text-slate-700 text-sm leading-relaxed">
												Atomically store processed
												datasets using database
												transactions, ensuring
												referential integrity between
												dataset metadata and individual
												data points.
											</p>
										</div>
										<div className="bg-white p-3 rounded border">
											<div className="text-xs font-mono text-orange-800">
												BEGIN TRANSACTION;
												<br />
												INSERT INTO analysis_datasets...
												<br />
												BULK INSERT
												analysis_ready_data...
												<br />
												COMMIT;
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Pipeline Visualization */}
						<div className="mb-8">
							<TimeSyncPipelineDiagramFlow />
						</div>

						{/* Quality Metrics */}
						<div className="bg-emerald-50 p-6 rounded-xl border-2 border-emerald-200 shadow-md">
							<h4 className="font-bold text-emerald-800 mb-6 flex items-center gap-3 text-xl">
								<span className="text-2xl">📈</span>
								Processing Quality Metrics
							</h4>
							<div className="grid md:grid-cols-3 gap-4">
								<div className="bg-white p-4 rounded-lg border border-emerald-200 text-center">
									<div className="text-2xl font-bold text-emerald-600 mb-2">
										83%
									</div>
									<div className="text-sm font-semibold text-emerald-800">
										Data Recovery Rate
									</div>
									<div className="text-xs text-slate-600 mt-1">
										From 40,320 theoretical to 33,466 clean
										points
									</div>
								</div>
								<div className="bg-white p-4 rounded-lg border border-emerald-200 text-center">
									<div className="text-2xl font-bold text-emerald-600 mb-2">
										≤3min
									</div>
									<div className="text-sm font-semibold text-emerald-800">
										Gap Tolerance
									</div>
									<div className="text-xs text-slate-600 mt-1">
										Optimal interpolation vs. deletion
										threshold
									</div>
								</div>
								<div className="bg-white p-4 rounded-lg border border-emerald-200 text-center">
									<div className="text-2xl font-bold text-emerald-600 mb-2">
										48%
									</div>
									<div className="text-sm font-semibold text-emerald-800">
										Labeling Coverage
									</div>
									<div className="text-xs text-slate-600 mt-1">
										Expert-annotated subset for PU learning
									</div>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</section>
	);
}
