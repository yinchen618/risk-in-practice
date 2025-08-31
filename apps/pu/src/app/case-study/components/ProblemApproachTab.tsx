"use client";

import { LaTeX } from "@/components/LaTeX";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	AlertTriangle,
	Brain,
	Database,
	Network,
	Target,
	Users,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { SinglePhaseThreeWireDiagramFlow } from "./diagrams/SinglePhaseThreeWireDiagramFlow";
import { TimeSyncPipelineDiagramFlow } from "./diagrams/TimeSyncPipelineDiagramFlow";

export default function ProblemApproachTab() {
	const [activeSection, setActiveSection] = useState("research-motivation");

	// Handle scroll to update active section
	useEffect(() => {
		const handleScroll = () => {
			const sections = [
				"research-motivation",
				"data-challenge",
				"labeling-challenge",
				"our-solution",
			];
			const scrollPosition = window.scrollY + 100;

			for (const section of sections) {
				const element = document.getElementById(section);
				if (element) {
					const { offsetTop, offsetHeight } = element;
					if (
						scrollPosition >= offsetTop &&
						scrollPosition < offsetTop + offsetHeight
					) {
						setActiveSection(section);
						break;
					}
				}
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const scrollToSection = (sectionId: string) => {
		const element = document.getElementById(sectionId);
		if (element) {
			const elementPosition = element.offsetTop;
			const offsetPosition = elementPosition - 100; // 避免被導航欄遮擋，偏移100px

			window.scrollTo({
				top: offsetPosition,
				behavior: "smooth",
			});
		}
	};

	return (
		<div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
			<div className="flex mx-auto">
				{/* Left Sidebar - Navigation (1/3) */}
				<div className="w-1/4 p-6">
					<div className="sticky top-6">
						{/* Page Title */}
						<div className="mb-8">
							<h1 className="text-2xl font-bold text-slate-800 mb-2">
								Research Problem & Methodology
							</h1>
							<p className="text-sm text-slate-600">
								Advanced Machine Learning for Energy Anomaly
								Detection
							</p>
						</div>

						{/* Navigation */}
						<nav className="space-y-2">
							{[
								{
									id: "research-motivation",
									label: "Research Problem & Motivation",
									icon: Brain,
								},
								{
									id: "data-challenge",
									label: "Research Challenge 1: Data Integration",
									icon: Database,
									subItems: [
										{
											id: "taming-telemetry",
											label: "1.1 Testbed Data Collection",
										},
										{
											id: "time-alignment",
											label: "1.2 Temporal Synchronization",
										},
									],
								},
								{
									id: "labeling-challenge",
									label: "Research Challenge 2: Limited Supervision",
									icon: AlertTriangle,
									subItems: [
										{
											id: "labeling-paradigm",
											label: "2.1 Labeling Paradigm Analysis",
										},
										{
											id: "pu-learning-motivation",
											label: "2.2 PU Learning Motivation",
										},
									],
								},
								{
									id: "our-solution",
									label: "Research Methodology & Contributions",
									icon: Target,
									subItems: [
										{
											id: "pu-learning",
											label: "Positive-Unlabeled Learning",
										},
										{
											id: "domain-adaptation",
											label: "Domain Adaptation",
										},
									],
								},
							].map((item) => (
								<div key={item.id}>
									<button
										type="button"
										onClick={() => scrollToSection(item.id)}
										className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
											activeSection === item.id
												? "bg-blue-100 text-blue-800 border-l-4 border-blue-600"
												: "text-slate-600 hover:bg-slate-100"
										}`}
									>
										<item.icon className="h-4 w-4" />
										<span className="text-sm font-medium">
											{item.label}
										</span>
									</button>
									{item.subItems && (
										<div className="ml-7 mt-1 space-y-1">
											{item.subItems.map((subItem) => (
												<button
													key={subItem.id}
													type="button"
													onClick={() =>
														scrollToSection(
															subItem.id,
														)
													}
													className="w-full text-left p-2 text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded"
												>
													{subItem.label}
												</button>
											))}
										</div>
									)}
								</div>
							))}
						</nav>
					</div>
				</div>

				{/* Right Content Area (2/3) */}
				<div className="w-3/4 p-6 space-y-12">
					{/* Research Problem & Motivation Section */}
					<section id="research-motivation" className="scroll-mt-6">
						<Card className="border-l-4 border-l-blue-400 bg-white shadow-lg p-0 overflow-hidden">
							<CardHeader className="bg-gradient-to-r from-blue-50 to-slate-50 border-b border-blue-200 p-6">
								<div className="flex items-center gap-4 mb-3">
									<div className="p-3 bg-blue-700 rounded-lg shadow-sm">
										<Brain className="h-8 w-8 text-white" />
									</div>
									<div>
										<CardTitle className="text-3xl font-semibold text-blue-800 mb-1">
											Research Problem & Motivation
										</CardTitle>
										<div className="flex items-center gap-2">
											<div className="h-1 w-12 bg-blue-500 rounded-full" />
											<span className="text-sm font-medium text-blue-700 uppercase tracking-wide">
												Problem Definition
											</span>
										</div>
									</div>
								</div>
								<p className="text-lg text-slate-700 leading-relaxed bg-white/80 p-4 rounded-lg border border-blue-100">
									Energy anomaly detection in smart buildings
									presents fundamental research challenges
									that current machine learning approaches
									cannot adequately address. This research
									investigates the critical gaps between
									theoretical supervised learning assumptions
									and real-world energy management
									constraints, proposing novel methodologies
									for learning from limited supervision in
									multi-domain environments.
								</p>
							</CardHeader>
							<CardContent className="space-y-8 p-6 pt-0">
								{/* Problem-Goal Visual Summary */}
								<div className="flex items-center justify-center space-x-6 mb-8 bg-gradient-to-r from-slate-50 to-blue-50 p-6 rounded-xl border border-slate-200">
									<div className="text-center">
										<AlertTriangle className="mx-auto h-10 w-10 text-red-500 mb-2" />
										<p className="text-sm font-semibold text-slate-800">
											Problem 1: Label Scarcity
										</p>
										<p className="text-xs text-slate-600 mt-1">
											Limited supervision challenge
										</p>
									</div>
									<div className="text-4xl font-light text-slate-400">
										+
									</div>
									<div className="text-center">
										<Network className="mx-auto h-10 w-10 text-purple-500 mb-2" />
										<p className="text-sm font-semibold text-slate-800">
											Problem 2: Domain Shift
										</p>
										<p className="text-xs text-slate-600 mt-1">
											Cross-domain generalization
										</p>
									</div>
									<div className="text-4xl font-light text-slate-400">
										=
									</div>
									<div className="text-center">
										<Target className="mx-auto h-10 w-10 text-green-500 mb-2" />
										<p className="text-sm font-semibold text-slate-800">
											Our Goal: Robust, Adaptive AI
										</p>
										<p className="text-xs text-slate-600 mt-1">
											Novel learning methodologies
										</p>
									</div>
								</div>

								<div className="grid md:grid-cols-2 gap-6">
									<div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-lg border border-blue-200">
										<h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
											<span className="text-xl">🎯</span>
											Research Problem 1: Limited
											Supervision Challenge
										</h3>
										<p className="text-sm text-slate-700 leading-relaxed">
											Current energy anomaly detection
											relies heavily on supervised
											learning paradigms that require
											extensive labeled datasets. However,
											in real-world energy management
											systems, obtaining comprehensive
											anomaly annotations is prohibitively
											expensive and time-intensive. This
											research gap necessitates novel
											learning paradigms that can
											effectively utilize abundant
											unlabeled data alongside sparse
											positive examples, fundamentally
											challenging traditional supervised
											learning assumptions in energy
											domain applications.
										</p>
									</div>

									<div className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-lg border border-purple-200">
										<h3 className="text-lg font-semibold text-purple-800 mb-3 flex items-center gap-2">
											<span className="text-xl">🌐</span>
											Research Problem 2: Cross-Domain
											Generalization
										</h3>
										<p className="text-sm text-slate-700 leading-relaxed">
											Energy consumption patterns exhibit
											significant domain-specific
											variations across building types,
											climates, usage scenarios, and
											temporal contexts. Current machine
											learning models trained on
											single-domain data fail to
											generalize effectively, requiring
											expensive re-training and
											re-labeling for each new deployment
											context. This research addresses the
											fundamental challenge of developing
											domain-adaptive learning
											methodologies that can transfer
											knowledge across heterogeneous
											energy environments with minimal
											supervision.
										</p>
									</div>
								</div>

								{/* Transition to Data Challenges */}
								<div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-slate-50 rounded-lg border border-blue-200">
									<p className="text-center text-slate-600 italic leading-relaxed">
										<span className="text-blue-600 font-medium">
											→
										</span>{" "}
										To address these fundamental research
										problems, we first had to overcome the
										significant, practical challenges
										inherent in the data itself.
									</p>
								</div>
							</CardContent>
						</Card>
					</section>

					{/* Research Challenge 1: Data Quality & Integration */}
					<section id="data-challenge" className="scroll-mt-6">
						<Card className="border-l-4 border-l-slate-400 bg-white shadow-lg p-0 overflow-hidden">
							<CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 border-b border-slate-200 p-6">
								<div className="flex items-center gap-4 mb-3">
									<div className="p-3 bg-slate-700 rounded-lg shadow-sm">
										<Database className="h-8 w-8 text-white" />
									</div>
									<div>
										<CardTitle className="text-3xl font-semibold text-slate-800 mb-1">
											Research Challenge 1: Data Quality &
											Integration
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
									The first research challenge addresses the
									fundamental data quality and integration
									problems inherent in real-world energy
									monitoring systems. Understanding and
									systematically addressing multi-source data
									complexities is crucial for developing
									robust machine learning methodologies that
									can operate reliably in practical energy
									management environments.
								</p>
							</CardHeader>
							<CardContent className="space-y-8 p-6">
								{/* Testbed Data Collection & Transformation */}
								<h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
									<span className="text-2xl">🔬</span>
									1.1 Testbed Data Collection & Transformation
								</h2>
								<div
									id="taming-telemetry"
									className="scroll-mt-6"
								>
									{/* Problem Statement */}
									<div className="bg-red-50 p-6 rounded-xl border-2 border-red-200 shadow-md mb-6">
										<h4 className="font-bold text-red-800 mb-4 flex items-center gap-3 text-xl">
											<AlertTriangle className="h-6 w-6" />
											The Challenge: Single-Phase
											Three-Wire System Complexity
										</h4>
										<div className="grid lg:grid-cols-2 gap-6">
											<div>
												<h5 className="font-semibold text-red-700 mb-3 text-lg">
													System Architecture
												</h5>
												<p className="text-slate-700 leading-relaxed text-base mb-4">
													A{" "}
													<LaTeX>{"1\\phi 3W"}</LaTeX>{" "}
													(single-phase, three-wire)
													system consists of two 110V
													live lines (L1, L2) and a
													neutral line (N). While 110V
													appliances draw from either
													L1 or L2, high-power 220V
													appliances draw from both
													simultaneously.
												</p>
												<h5 className="font-semibold text-red-700 mb-3 text-lg">
													Measurement Challenge
												</h5>
												<p className="text-slate-700 leading-relaxed text-base">
													The original two 110V meters
													can only measure the power
													usage of L1 and L2
													separately, making it
													impossible to directly
													distinguish which
													consumption is from 220V
													(across L1-L2) or 110V (from
													L1 or L2 alone).
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
															Dual-voltage systems
															create complex load
															patterns
														</span>
													</li>
													<li className="flex items-start gap-3">
														<div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
														<span>
															Power factor
															variations affect
															accuracy
														</span>
													</li>
													<li className="flex items-start gap-3">
														<div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
														<span>
															Harmonic distortions
															in non-linear loads
														</span>
													</li>
													<li className="flex items-start gap-3">
														<div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
														<span>
															Temperature-dependent
															meter calibration
															drift
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
											Our Solution:{" "}
											<LaTeX>{"1\\phi 3W"}</LaTeX> Feature
											Engineering
										</h4>
										<p className="text-slate-700 leading-relaxed text-base mb-6">
											Through mathematical derivation and
											feature engineering, we transform
											raw L1 and L2 meter readings into
											actionable insights that can
											differentiate between 110V and 220V
											usage, enabling comprehensive
											appliance identification and anomaly
											detection.
										</p>

										{/* Derived Feature Engineering Formulas */}
										<div className="bg-white p-6 rounded-lg border border-green-200 mb-6">
											<h5 className="font-semibold text-green-800 mb-4 text-lg text-center">
												Derived Feature Engineering
												Formulas
											</h5>
											<div className="grid md:grid-cols-3 gap-4 text-center">
												<div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
													<div className="font-medium text-blue-800 mb-2">
														Total Power
													</div>
													<LaTeX>
														{
															"\\text{Total} = P_{L1} + P_{L2}"
														}
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
														{
															"\\text{110V} = |P_{L1} - P_{L2}|"
														}
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
													# 1φ 3W (Single-phase
													three-wire) feature
													engineering
												</div>
												<div>
													df_transformed['wattageTotal']
													= df_merged['wattage_l1'] +
													df_merged['wattage_l2']
												</div>
												<div>
													df_transformed['wattage220v']
													= 2 *
													np.minimum(df_merged['wattage_l1'],
													df_merged['wattage_l2'])
												</div>
												<div>
													df_transformed['wattage110v']
													=
													np.abs(df_merged['wattage_l1']
													- df_merged['wattage_l2'])
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
											[+] View Mathematical Derivation &
											Theoretical Foundation
										</summary>

										<div className="bg-white p-6 rounded-lg border border-slate-200 mt-4">
											<div className="text-center text-slate-700 space-y-6">
												<div className="text-lg font-semibold mb-6 text-slate-800">
													Mathematical Formulation &
													Trigonometric Derivation
												</div>

												{/* Fundamental Voltage Model */}
												<div className="bg-indigo-50 p-5 rounded-lg border border-indigo-200">
													<div className="font-medium text-indigo-800 mb-4 text-left">
														1. Fundamental AC
														Voltage Model (
														<LaTeX>
															{"1\\phi 3W"}
														</LaTeX>{" "}
														Taiwan{" "}
														<LaTeX>
															{"60\\,\\text{Hz}"}
														</LaTeX>{" "}
														System):
													</div>
													<div className="text-left space-y-3">
														<div className="flex items-center justify-between">
															<span className="text-sm text-slate-700">
																L1 to Neutral
																voltage:
															</span>
															<LaTeX>
																{
																	"v_{L1}(t) = V_{peak} \\sin(\\omega t)"
																}
															</LaTeX>
														</div>
														<div className="flex items-center justify-between">
															<span className="text-sm text-slate-700">
																L2 to Neutral
																voltage (180°
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
															<strong>
																Dual Voltage:
															</strong>{" "}
															L1-N, L2-N = 110V
														</span>
													</li>
													<li className="flex items-start gap-2">
														<span className="text-purple-600">
															•
														</span>
														<span>
															<strong>
																Line-to-Line:
															</strong>{" "}
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
															<strong>
																Power Factor:
															</strong>{" "}
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
																Phase
																Difference:
															</strong>{" "}
															L1, L2 ={" "}
															<LaTeX>
																{"180°"}
															</LaTeX>{" "}
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
										<LaTeX>{"1\\phi 3W"}</LaTeX>{" "}
										Single-Phase Three-Wire Feature
										Engineering
									</h4>

									<div className="bg-white p-6 rounded-lg border border-slate-200 mb-4">
										<div className="text-center text-slate-700 space-y-6">
											<div className="text-lg font-semibold mb-6 text-slate-800">
												Mathematical Formulation &
												Trigonometric Derivation
											</div>

											{/* Fundamental Voltage Model */}
											<div className="bg-indigo-50 p-5 rounded-lg border border-indigo-200">
												<div className="font-medium text-indigo-800 mb-4 text-left">
													1. Fundamental AC Voltage
													Model (
													<LaTeX>{"1\\phi 3W"}</LaTeX>{" "}
													Taiwan{" "}
													<LaTeX>
														{"60\\,\\text{Hz}"}
													</LaTeX>{" "}
													System):
												</div>
												<div className="text-left space-y-3">
													<div className="flex items-center justify-between">
														<span className="text-sm text-slate-700">
															L1 to Neutral
															voltage:
														</span>
														<LaTeX>
															{
																"v_{L1}(t) = V_{peak} \\sin(\\omega t)"
															}
														</LaTeX>
													</div>
													<div className="flex items-center justify-between">
														<span className="text-sm text-slate-700">
															L2 to Neutral
															voltage (180° phase
															shift):
														</span>
														<LaTeX>
															{
																"v_{L2}(t) = V_{peak} \\sin(\\omega t + \\pi) = -V_{peak} \\sin(\\omega t)"
															}
														</LaTeX>
													</div>
													<div className="flex items-center justify-between">
														<span className="text-sm text-slate-700">
															Where angular
															frequency:
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
													2. Pure 220V Load Analysis
													(L1-L2 Connection):
												</div>
												<div className="text-left space-y-3">
													<div className="text-sm text-slate-700 mb-2">
														Line-to-line voltage for
														220V appliances:
													</div>
													<div className="text-center mb-3">
														<LaTeX>
															{
																"v_{L1-L2}(t) = v_{L1}(t) - v_{L2}(t) = 2V_{peak} \\sin(\\omega t)"
															}
														</LaTeX>
													</div>
													<div className="text-sm text-slate-700 mb-2">
														Current flow through
														220V load creates
														balanced currents:
													</div>
													<div className="grid grid-cols-2 gap-4">
														<div className="text-center">
															<LaTeX>
																{
																	"i_{L1}(t) = +i_{220V}(t)"
																}
															</LaTeX>
														</div>
														<div className="text-center">
															<LaTeX>
																{
																	"i_{L2}(t) = -i_{220V}(t)"
																}
															</LaTeX>
														</div>
													</div>
													<div className="text-sm text-slate-700 mt-3 mb-2">
														Instantaneous power on
														each line:
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
															<strong>
																Key Result:
															</strong>{" "}
															<LaTeX>
																{
																	"p_{L1}(t) = p_{L2}(t)"
																}
															</LaTeX>
														</div>
														<div className="text-xs text-amber-700 text-center mt-1">
															Balanced load
															condition: equal
															power draw from both
															lines
														</div>
													</div>
												</div>
											</div>

											{/* 110V Load Analysis */}
											<div className="bg-green-50 p-5 rounded-lg border border-green-200">
												<div className="font-medium text-green-800 mb-4 text-left">
													3. Pure 110V Load Analysis
													(L1-N or L2-N Connection):
												</div>
												<div className="text-left space-y-3">
													<div className="text-sm text-slate-700 mb-2">
														For a 110V load
														connected between L1 and
														Neutral:
													</div>
													<div className="grid grid-cols-2 gap-4">
														<div className="text-center">
															<LaTeX>
																{
																	"i_{L1}(t) = i_{110V}(t)"
																}
															</LaTeX>
														</div>
														<div className="text-center">
															<LaTeX>
																{
																	"i_{L2}(t) = 0"
																}
															</LaTeX>
														</div>
													</div>
													<div className="text-sm text-slate-700 mt-3 mb-2">
														Resulting instantaneous
														powers:
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
															<strong>
																Key Result:
															</strong>{" "}
															<LaTeX>
																{
																	"p_{L1}(t) \\neq p_{L2}(t)"
																}
															</LaTeX>
														</div>
														<div className="text-xs text-green-700 text-center mt-1">
															Imbalanced load
															condition: power
															difference indicates
															110V consumption
														</div>
													</div>
												</div>
											</div>

											{/* Mixed Load Decomposition */}
											<div className="bg-purple-50 p-5 rounded-lg border border-purple-200">
												<div className="font-medium text-purple-800 mb-4 text-left">
													4. Mixed Load Decomposition
													(Real-World Scenario):
												</div>
												<div className="text-left space-y-3">
													<div className="text-sm text-slate-700 mb-2">
														In practical
														applications, both 110V
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
														<LaTeX>
															{"P_{balanced}"}
														</LaTeX>{" "}
														represents the common
														power from 220V loads,
														and{" "}
														<LaTeX>
															{"P_{imbalanced}"}
														</LaTeX>{" "}
														terms represent
														individual 110V loads.
													</div>
												</div>
											</div>

											{/* Final Formulas */}
											<div className="bg-slate-50 p-5 rounded-lg border border-slate-300">
												<div className="font-medium text-slate-800 mb-4 text-center text-lg">
													Derived Feature Engineering
													Formulas
												</div>
												<div className="space-y-4">
													{/* Total Power Formula */}
													<div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
														<div className="font-medium text-blue-800 mb-3">
															Total Power
															Consumption:
														</div>
														<div className="text-center text-xl">
															<LaTeX>
																{
																	"P_{\\text{total}} = P_{L1} + P_{L2}"
																}
															</LaTeX>
														</div>
														<div className="text-sm text-slate-600 mt-3">
															Sum of all power
															drawn from both
															lines
														</div>
													</div>

													{/* 220V Power Formula */}
													<div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
														<div className="font-medium text-amber-800 mb-3">
															220V Appliance Power
															(Balanced Load):
														</div>
														<div className="text-center text-xl">
															<LaTeX>
																{
																	"P_{220V} = 2 \\times \\min(P_{L1}, P_{L2})"
																}
															</LaTeX>
														</div>
														<div className="text-sm text-slate-600 mt-3">
															<LaTeX>
																{"\\min()"}
															</LaTeX>{" "}
															function extracts
															the balanced
															component; factor of
															2 accounts for total
															220V consumption
														</div>
													</div>

													{/* 110V Power Formula */}
													<div className="bg-green-50 p-4 rounded-lg border border-green-200">
														<div className="font-medium text-green-800 mb-3">
															110V Appliance Power
															(Imbalanced Load):
														</div>
														<div className="text-center text-xl">
															<LaTeX>
																{
																	"P_{110V} = |P_{L1} - P_{L2}|"
																}
															</LaTeX>
														</div>
														<div className="text-sm text-slate-600 mt-3">
															Absolute difference
															captures the
															imbalanced portion
															representing 110V
															consumption
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
														<strong>L1-L2:</strong>{" "}
														220V RMS voltage
														difference
													</span>
												</li>
												<li className="flex items-start gap-2">
													<span className="text-purple-600">
														•
													</span>
													<span>
														<strong>
															L1-N, L2-N:
														</strong>{" "}
														110V RMS to neutral
													</span>
												</li>
												<li className="flex items-start gap-2">
													<span className="text-purple-600">
														•
													</span>
													<span>
														<strong>
															Balanced Load:
														</strong>{" "}
														Equal current flow
													</span>
												</li>
												<li className="flex items-start gap-2">
													<span className="text-purple-600">
														•
													</span>
													<span>
														<strong>
															Imbalanced Load:
														</strong>{" "}
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
													<span className="text-teal-600">
														•
													</span>
													<span>
														<strong>
															Kirchhoff's Law:
														</strong>{" "}
														<LaTeX>
															{"\\sum I = 0"}
														</LaTeX>{" "}
														at neutral
													</span>
												</li>
												<li className="flex items-start gap-2">
													<span className="text-teal-600">
														•
													</span>
													<span>
														<strong>
															Power Factor:
														</strong>{" "}
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
														L1, L2 ={" "}
														<LaTeX>{"180°"}</LaTeX>{" "}
														apart
													</span>
												</li>
												<li className="flex items-start gap-2">
													<span className="text-teal-600">
														•
													</span>
													<span>
														<strong>
															Load Attribution:
														</strong>{" "}
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
												# 1φ 3W (Single-phase
												three-wire) feature engineering
											</div>
											<div>
												df_transformed['wattageTotal'] =
												df_merged['wattage_l1'] +
												df_merged['wattage_l2']
											</div>
											<div>
												df_transformed['wattage220v'] =
												2 *
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
								<div
									id="time-alignment"
									className="scroll-mt-6"
								>
									<div className="bg-blue-50 p-8 rounded-xl border-2 border-blue-200 shadow-md mb-8">
										<h4 className="font-bold text-blue-800 mb-6 flex items-center gap-3 text-xl">
											<Database className="h-6 w-6" />
											Stage 0: Automated Preprocessing ETL
											(Extract, Transform, Load) Pipeline
										</h4>
										<p className="text-slate-700 mb-6 leading-relaxed text-base">
											Independent IoT meters suffer from
											clock drift, network latency, and
											varying sampling rates, resulting in
											asynchronous, incomplete time
											series. Our automated ETL pipeline
											transforms this chaotic multi-source
											data into clean, synchronized,
											analysis-ready datasets through
											intelligent windowing, hybrid
											interpolation strategies, and
											feature engineering.
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
												<span className="text-lg">
													⚙️
												</span>
												Engineering Rationale for
												Reproducible Research
											</h6>
											<p className="text-sm text-slate-700 leading-relaxed">
												To ensure the validity and
												reproducibility of our machine
												learning experiments, a stable
												and high-quality dataset is
												paramount. Our Golden Window
												Discovery is a{" "}
												<strong>
													critical preprocessing step
												</strong>{" "}
												designed to programmatically
												identify the most complete and
												consistent 7-day data segment.
												This is{" "}
												<strong>
													not a research contribution
													in itself
												</strong>
												, but a foundational engineering
												practice that mitigates the
												"Garbage In, Garbage Out"
												problem common in real-world IoT
												data, thereby guaranteeing that
												our subsequent{" "}
												<strong>
													PU Learning and Domain
													Adaptation research
												</strong>{" "}
												is evaluated on a reliable data
												foundation.
											</p>
										</div>

										<div className="grid lg:grid-cols-2 gap-6">
											<div>
												<h5 className="font-semibold text-slate-700 mb-3 text-lg">
													Intelligent Data Quality
													Assessment
												</h5>
												<p className="text-slate-700 leading-relaxed text-base mb-4">
													Rather than blindly
													processing all available
													data, our system performs a
													sliding window analysis
													across the entire collection
													period. For each potential
													7-day window, it calculates
													a composite{" "}
													<strong>
														Data Quality Score
													</strong>{" "}
													prioritizing completeness
													ratio and minimizing missing
													periods.
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
														(prioritizing
														completeness)
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
															• Automatic
															quality-based time
															window selection
														</li>
														<li>
															• Standardized 7-day
															analysis periods
														</li>
														<li>
															• Avoids "garbage
															in, garbage out"
															scenarios
														</li>
														<li>
															• Enables cross-room
															comparative analysis
														</li>
													</ul>
												</div>
												<div className="bg-white p-4 rounded-lg border border-amber-200">
													<h6 className="font-semibold text-amber-800 mb-2">
														Implementation
													</h6>
													<div className="text-xs font-mono text-slate-600 bg-gray-50 p-2 rounded">
														_evaluate_data_quality(window_data)
														<br />→
														completeness_ratio: 0.95
														<br />→ missing_periods:
														3<br />→ quality_score:
														0.76 - 0.6 = 0.16
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
														Extract raw L1 and L2
														meter readings
														exclusively from the
														identified Golden Window
														period, avoiding
														unnecessary processing
														of poor-quality data
														segments.
													</p>
												</div>
												<div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
													<div className="text-xs font-mono text-blue-800">
														SELECT device_id,
														timestamp, wattage
														<br />
														FROM ammeter_logs
														<br />
														WHERE timestamp BETWEEN
														<br />
														&nbsp;&nbsp;golden_start
														AND golden_end
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
												Transform: Temporal Alignment &
												Hybrid Gap Handling
											</h5>

											{/* Temporal Bucketing */}
											<div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
												<h6 className="font-semibold text-green-800 mb-2">
													2.1 Temporal Bucketing
												</h6>
												<div className="grid md:grid-cols-2 gap-4">
													<div>
														<p className="text-slate-700 text-sm leading-relaxed mb-2">
															Resample both L1 and
															L2 time series to
															standardized
															1-minute intervals,
															averaging any
															multiple readings
															within each bucket.
														</p>
														<div className="text-xs font-mono text-green-800 bg-white p-2 rounded">
															df.resample('1T').mean()
														</div>
													</div>
													<div className="bg-white p-3 rounded border">
														<div className="text-xs text-slate-600">
															<strong>
																Before:
															</strong>{" "}
															10:00:01, 10:00:58
															<br />
															<strong>
																After:
															</strong>{" "}
															10:00:00 (averaged)
														</div>
													</div>
												</div>
											</div>

											{/* Hybrid Gap Strategy */}
											<div className="bg-slate-50 p-4 rounded-lg border border-slate-300">
												<h6 className="font-semibold text-slate-800 mb-2">
													2.2 Hybrid Gap-Filling
													Strategy
												</h6>
												<div className="mb-3 p-3 bg-slate-100 rounded-lg border border-slate-400">
													<p className="text-slate-800 font-semibold text-sm flex items-center gap-2">
														<span className="text-lg">
															🎯
														</span>
														<span className="text-slate-700">
															Key Innovation:
														</span>
														Our temporal
														synchronization employs
														a{" "}
														<strong className="text-slate-900">
															hybrid gap-filling
															strategy
														</strong>
														that intelligently
														balances data continuity
														with authenticity,
														ensuring robust
														time-series analysis
														while preserving the
														temporal integrity
														essential for accurate
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
															that balances data
															continuity with
															authenticity:
														</p>
														<div className="space-y-2">
															<div className="bg-white p-3 rounded border border-slate-400">
																<div className="font-semibold text-slate-700 text-sm">
																	✓ Forward
																	Fill (≤3 min
																	gaps)
																</div>
																<div className="text-xs text-slate-600">
																	Brief
																	network
																	interruptions
																	→
																	interpolate
																</div>
															</div>
															<div className="bg-white p-3 rounded border border-slate-500">
																<div className="font-semibold text-slate-800 text-sm">
																	✗ Deletion
																	(&gt;3 min
																	gaps)
																</div>
																<div className="text-xs text-slate-600">
																	Extended
																	outages →
																	remove
																	unreliable
																	periods
																</div>
															</div>
														</div>
													</div>
													<div className="bg-white p-3 rounded border border-slate-300">
														<div className="text-xs font-mono text-slate-800">
															# Hybrid strategy
															implementation
															<br />
															df_merged =
															pd.merge(df_l1,
															df_l2, <br />
															&nbsp;&nbsp;how='outer',
															on='timestamp')
															<br />
															<br /># Limited
															forward fill
															<br />
															df_filled =
															df_merged.fillna(
															<br />
															&nbsp;&nbsp;method='ffill',
															limit=3)
															<br />
															<br /># Remove
															remaining gaps
															<br />
															df_clean =
															df_filled.dropna()
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
												Feature Engineering: Multi-Scale
												Power Analysis
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
																<strong>
																	220V Load:
																</strong>
															</span>
															<LaTeX>
																{
																	"P_{220V} = 2 \\times \\min(P_{L1}, P_{L2})"
																}
															</LaTeX>
														</div>
														<div className="flex items-center justify-between">
															<span>
																<strong>
																	110V Load:
																</strong>
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
														Temporal Context
														Features
													</h6>
													<div className="space-y-2 text-sm">
														<div>
															•{" "}
															<strong>
																Short-term
																(15min):
															</strong>{" "}
															Mean, Std, Min, Max
														</div>
														<div>
															•{" "}
															<strong>
																Long-term
																(60min):
															</strong>{" "}
															Trend analysis
														</div>
														<div>
															•{" "}
															<strong>
																Time-based:
															</strong>{" "}
															hour_of_day,
															is_weekend
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
												Load: Transactional Database
												Storage
											</h5>
											<div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
												<div className="grid md:grid-cols-2 gap-4">
													<div>
														<p className="text-slate-700 text-sm leading-relaxed">
															Atomically store
															processed datasets
															using database
															transactions,
															ensuring referential
															integrity between
															dataset metadata and
															individual data
															points.
														</p>
													</div>
													<div className="bg-white p-3 rounded border">
														<div className="text-xs font-mono text-orange-800">
															BEGIN TRANSACTION;
															<br />
															INSERT INTO
															analysis_datasets...
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
													From 40,320 theoretical to
													33,466 clean points
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
													Optimal interpolation vs.
													deletion threshold
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
													Expert-annotated subset for
													PU learning
												</div>
											</div>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</section>

					{/* Research Challenge 2: Limited Supervision */}
					<section id="labeling-challenge" className="scroll-mt-6">
						<Card className="border-l-4 border-l-amber-400 bg-white shadow-lg p-0 overflow-hidden">
							<CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200 p-6">
								<div className="flex items-center gap-4 mb-3">
									<div className="p-3 bg-amber-700 rounded-lg shadow-sm">
										<AlertTriangle className="h-8 w-8 text-white" />
									</div>
									<div>
										<CardTitle className="text-3xl font-semibold text-amber-800 mb-1">
											Research Challenge 2: Limited
											Supervision
										</CardTitle>
										<div className="flex items-center gap-2">
											<div className="h-1 w-12 bg-amber-500 rounded-full" />
											<span className="text-sm font-medium text-amber-700 uppercase tracking-wide">
												Learning Paradigm
											</span>
										</div>
									</div>
								</div>
								<p className="text-lg text-slate-700 leading-relaxed bg-white/80 p-4 rounded-lg border border-amber-100">
									The second research challenge investigates
									fundamental limitations of supervised
									learning in energy anomaly detection
									scenarios. This challenge examines how
									traditional machine learning paradigms fail
									when applied to real-world energy management
									contexts, necessitating novel learning
									approaches that can operate effectively
									under limited supervision constraints.
								</p>
							</CardHeader>
							<CardContent className="space-y-8 p-6">
								{/* Step 1: 呈現問題 - Testbed Data Distribution Analysis */}
								<h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
									<span className="text-2xl">📊</span>
									2.1 Testbed Data Distribution Analysis: The
									Fundamental Challenge
								</h2>
								<div
									id="labeling-paradigm"
									className="scroll-mt-6"
								>
									{/* Case Study Data */}
									<h4 className="font-bold text-slate-800 mb-3 flex items-center gap-3 text-xl">
										<span className="text-2xl">🔍</span>
										Room A-310 (R029) Case Study
									</h4>
									{/* 視覺化圖表 */}
									<div className="bg-white p-6 rounded-lg border border-slate-200">
										<div className="text-center mb-6">
											<h5 className="font-semibold text-slate-800 text-lg mb-2">
												Room A-310 (R029) Analysis
												Dataset Distribution
											</h5>
											<div className="grid grid-cols-2 gap-4 text-sm text-slate-600 mb-4">
												<div>
													<strong>Location:</strong>{" "}
													Building-A - 3F - Room-10
												</div>
												<div>
													<strong>Type:</strong>{" "}
													Student Activity Room
												</div>
												<div>
													<strong>Period:</strong>{" "}
													2025/7/21 - 2025/8/17 (28
													days)
												</div>
												<div>
													<strong>
														Total Records:
													</strong>{" "}
													16,078 data points
												</div>
											</div>
										</div>

										{/* 數據比例視覺化 */}
										<div className="space-y-4">
											{/* 理論筆數 */}
											<div className="flex items-center gap-4">
												<div className="w-32 text-sm text-slate-700 font-medium">
													Theoretical Maximum
												</div>
												<div className="flex-1 bg-gray-200 rounded-full h-8 relative overflow-hidden">
													<div
														className="bg-gray-400 h-full rounded-full"
														style={{
															width: "100%",
														}}
													/>
													<div className="absolute inset-0 flex items-center justify-center text-white text-sm font-bold">
														40,320 points (100%)
													</div>
												</div>
											</div>

											{/* 實際收集到的數據 */}
											<div className="flex items-center gap-4">
												<div className="w-32 text-sm text-slate-700 font-medium">
													Processed Dataset
												</div>
												<div className="flex-1 bg-gray-200 rounded-full h-8 relative overflow-hidden">
													<div
														className="bg-blue-500 h-full rounded-full"
														style={{
															width: "39.9%",
														}}
													/>
													<div className="absolute inset-0 flex items-center justify-center pl-24 text-slate-700 text-sm font-bold">
														16,078 points (39.9% of
														theoretical)
													</div>
												</div>
											</div>

											{/* Expert 標註的異常 - 使用實際處理數據作為基準 */}
											<div className="flex items-center gap-4">
												<div className="w-32 text-sm text-slate-700 font-medium">
													Known Anomalies
												</div>
												<div className="flex-1 bg-gray-200 rounded-full h-8 relative overflow-hidden">
													<div
														className="bg-red-400 h-full rounded-full"
														style={{
															width: "3.9%",
														}}
													/>
													<div className="absolute inset-0 flex items-center justify-start pl-10 text-slate-700 text-sm font-bold">
														1,607 points (10.0% of
														Processed Dataset)
													</div>
												</div>
											</div>

											{/* 未標註數據 - 使用實際處理數據作為基準 */}
											<div className="flex items-center gap-4">
												<div className="w-32 text-sm text-slate-700 font-medium">
													Unlabeled Data
												</div>
												<div className="flex-1 bg-gray-200 rounded-full h-8 relative overflow-hidden">
													<div
														className="bg-amber-400 h-full rounded-full"
														style={{
															width: "35.9%",
														}}
													/>
													<div className="absolute inset-0 flex items-center justify-center pl-22 text-slate-700 text-sm font-bold">
														14,471 points (90.0% of
														Processed Dataset)
													</div>
												</div>
											</div>
										</div>

										{/* 說明文字 */}
										<div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
											<div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
												<div className="text-gray-800 font-semibold text-sm">
													Theoretical Maximum
												</div>
												<div className="text-gray-700 text-xs mt-1">
													Expected 1 point/minute over
													28 days
												</div>
											</div>
											<div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
												<div className="text-blue-800 font-semibold text-sm">
													Processed Dataset
												</div>
												<div className="text-blue-700 text-xs mt-1">
													Post-ETL clean data after
													Golden Window selection
												</div>
											</div>
											<div className="bg-red-50 p-3 rounded-lg border border-red-200">
												<div className="text-red-800 font-semibold text-sm">
													Known Anomalies
												</div>
												<div className="text-red-700 text-xs mt-1">
													Expert-identified positive
													samples
												</div>
											</div>
											<div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
												<div className="text-amber-800 font-semibold text-sm">
													Unlabeled Data
												</div>
												<div className="text-amber-700 text-xs mt-1">
													Unknown classification
													status
												</div>
											</div>
										</div>
									</div>

									{/* Room A-310 特性分析 */}
									<div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200 mt-6">
										<h6 className="font-semibold text-indigo-800 mb-3">
											Room A-310 (R029) Characteristics
										</h6>
										<div className="grid md:grid-cols-3 gap-4 text-sm">
											<div>
												<div className="font-medium text-indigo-700">
													High Anomaly Rate
												</div>
												<div className="text-slate-600">
													10.0% known anomalies vs.
													typical &lt;0.1%
												</div>
											</div>
											<div>
												<div className="font-medium text-indigo-700">
													Student Activity Room
												</div>
												<div className="text-slate-600">
													Irregular usage patterns,
													equipment experiments
												</div>
											</div>
											<div>
												<div className="font-medium text-indigo-700">
													ETL Recovery Rate
												</div>
												<div className="text-slate-600">
													39.9% data recovery from
													Golden Window selection
												</div>
											</div>
										</div>
									</div>

									{/* Step 2: 提出論點 - This Data Distribution Renders Traditional Methods Obsolete */}
									<h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3 mt-8">
										<span className="text-2xl">🚨</span>
										2.2 This Data Distribution Renders
										Traditional Methods Obsolete
									</h2>
									<div className="my-6 p-6 bg-gradient-to-r from-red-100 to-orange-100 rounded-xl border-2 border-red-300">
										<div className="text-center">
											<h3 className="text-xl font-bold text-red-800 mb-3">
												The Fundamental Challenge
											</h3>
											<p className="text-slate-700 text-lg leading-relaxed">
												Even with sophisticated feature
												engineering and temporal
												synchronization, we face a
												fundamental challenge:
												<span className="font-semibold text-red-700">
													{" "}
													the scarcity of labeled
													anomalies makes traditional
													supervised learning
													impractical
												</span>
												. This reality demands a
												paradigm shift towards methods
												that can learn from
												predominantly unlabeled data.
											</p>
										</div>
									</div>

									<div className="grid md:grid-cols-3 gap-6 mb-8">
										<div className="bg-red-50 p-4 rounded-lg border border-red-200">
											<h5 className="font-semibold text-red-800 mb-2">
												The Labeling Challenge
											</h5>
											<p className="text-sm text-slate-700">
												In our testbed example, even
												with 1,607 labeled anomalies
												from Room A-310, we still have
												14,471 unlabeled data points.
												Traditional supervised learning
												cannot utilize this vast
												unlabeled majority, wasting 90%
												of available information across
												all monitored spaces.
											</p>
										</div>
										<div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
											<h5 className="font-semibold text-yellow-800 mb-2">
												The Expert Bottleneck
											</h5>
											<p className="text-sm text-slate-700">
												Manual labeling of anomalies
												requires extensive domain
												expertise and time. Scaling this
												approach across our entire
												testbed with multiple rooms and
												diverse usage patterns becomes
												prohibitively expensive and
												impractical for real-world
												deployment.
											</p>
										</div>
										<div className="bg-green-50 p-4 rounded-lg border border-green-200">
											<h5 className="font-semibold text-green-800 mb-2">
												The PU Learning Opportunity
											</h5>
											<p className="text-sm text-slate-700">
												Our PU learning approach
												transforms this testbed
												challenge into an advantage by
												learning from both the available
												positive examples and the vast
												unlabeled data points,
												maximizing information
												utilization across all monitored
												environments.
											</p>
										</div>
									</div>

									{/* Step 3: 比較方案 - Traditional vs PU Learning Paradigm */}
									<h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
										<span className="text-2xl">⚖️</span>
										2.3 Traditional vs PU Learning Paradigm
										Comparison
									</h2>

									{/* Direct Paradigm Comparison */}
									<h5 className="text-center text-lg text-slate-600 mb-4 italic">
										A Paradigm Shift in Learning Strategy
									</h5>
									<div className="grid md:grid-cols-2 gap-6 mb-8">
										<div className="bg-red-50 p-6 rounded-xl border-2 border-red-200 shadow-md">
											<h4 className="font-bold text-red-800 mb-4 flex items-center gap-3 text-xl">
												<span className="text-2xl">
													❌
												</span>
												Traditional Supervised Learning
											</h4>
											<ul className="space-y-3 text-sm text-slate-700">
												<li className="flex items-start gap-2">
													<span className="text-red-600 font-bold">
														✗
													</span>
													<span>
														<strong>
															Requires extensive
															labeled negative
															examples
														</strong>{" "}
														- costly and
														time-intensive
													</span>
												</li>
												<li className="flex items-start gap-2">
													<span className="text-red-600 font-bold">
														✗
													</span>
													<span>
														<strong>
															Wastes 90% of
															available data
														</strong>{" "}
														- ignores unlabeled
														instances completely
													</span>
												</li>
												<li className="flex items-start gap-2">
													<span className="text-red-600 font-bold">
														✗
													</span>
													<span>
														<strong>
															Expert bottleneck
														</strong>{" "}
														- manual annotation
														scales poorly
													</span>
												</li>
												<li className="flex items-start gap-2">
													<span className="text-red-600 font-bold">
														✗
													</span>
													<span>
														<strong>
															Domain-specific
															training
														</strong>{" "}
														- requires retraining
														for each new environment
													</span>
												</li>
											</ul>
										</div>

										<div className="bg-green-50 p-6 rounded-xl border-2 border-green-200 shadow-md">
											<h4 className="font-bold text-green-800 mb-4 flex items-center gap-3 text-xl">
												<span className="text-2xl">
													✅
												</span>
												PU Learning Approach
											</h4>
											<ul className="space-y-3 text-sm text-slate-700">
												<li className="flex items-start gap-2">
													<span className="text-green-600 font-bold">
														✓
													</span>
													<span>
														<strong>
															Works with positive
															+ unlabeled data
															only
														</strong>{" "}
														- realistic for
														real-world scenarios
													</span>
												</li>
												<li className="flex items-start gap-2">
													<span className="text-green-600 font-bold">
														✓
													</span>
													<span>
														<strong>
															Utilizes all
															available
															information
														</strong>{" "}
														- learns from both
														labeled and unlabeled
														instances
													</span>
												</li>
												<li className="flex items-start gap-2">
													<span className="text-green-600 font-bold">
														✓
													</span>
													<span>
														<strong>
															Scalable annotation
															process
														</strong>{" "}
														- minimal expert
														intervention required
													</span>
												</li>
												<li className="flex items-start gap-2">
													<span className="text-green-600 font-bold">
														✓
													</span>
													<span>
														<strong>
															Cross-domain
															adaptability
														</strong>{" "}
														- transfers knowledge
														across different
														environments
													</span>
												</li>
											</ul>
										</div>
									</div>

									{/* Why Our Testbed Validates PU Learning */}
									<div className="bg-slate-50 p-6 rounded-xl border-2 border-slate-200 shadow-md mt-6">
										<h4 className="font-bold text-slate-800 mb-4 flex items-center gap-3 text-xl">
											<span className="text-2xl">🎯</span>
											Why Our Testbed Validates PU
											Learning Effectiveness
										</h4>
										<div className="space-y-4">
											<p className="text-slate-700 leading-relaxed text-base">
												This real-world testbed
												perfectly demonstrates the core
												advantages and applicability of
												PU Learning. Room A-310's data
												distribution characteristics
												validate the limitations of
												traditional supervised learning
												in practical energy management
												scenarios while highlighting the
												critical value of PU Learning
												methods.
											</p>

											<div className="grid md:grid-cols-2 gap-6">
												<div className="bg-white p-5 rounded-lg border border-slate-200">
													<h6 className="font-semibold text-slate-800 mb-3">
														Optimal Positive Sample
														Density
													</h6>
													<div className="space-y-2 text-sm text-slate-700">
														<div className="flex items-start gap-2">
															<span className="text-slate-600 mt-1">
																✓
															</span>
															<span>
																<strong>
																	10% Anomaly
																	Rate:
																</strong>{" "}
																Provides
																sufficient
																positive samples
																for effective
																learning
															</span>
														</div>
														<div className="flex items-start gap-2">
															<span className="text-slate-600 mt-1">
																✓
															</span>
															<span>
																<strong>
																	1,607
																	Labeled
																	Samples:
																</strong>{" "}
																Far exceeds
																minimum positive
																sample
																requirements for
																PU Learning
															</span>
														</div>
														<div className="flex items-start gap-2">
															<span className="text-slate-600 mt-1">
																✓
															</span>
															<span>
																<strong>
																	Diversity
																	Assurance:
																</strong>{" "}
																Covers anomalous
																situations
																across different
																time periods and
																equipment usage
																patterns
															</span>
														</div>
													</div>
												</div>

												<div className="bg-white p-5 rounded-lg border border-slate-200">
													<h6 className="font-semibold text-slate-800 mb-3">
														Rich Unlabeled Data
													</h6>
													<div className="space-y-2 text-sm text-slate-700">
														<div className="flex items-start gap-2">
															<span className="text-slate-600 mt-1">
																✓
															</span>
															<span>
																<strong>
																	14,471
																	Unlabeled
																	Points:
																</strong>{" "}
																Provides rich
																distributional
																information and
																pattern learning
																opportunities
															</span>
														</div>
														<div className="flex items-start gap-2">
															<span className="text-slate-600 mt-1">
																✓
															</span>
															<span>
																<strong>
																	90%
																	Information
																	Utilization:
																</strong>{" "}
																PU Learning can
																fully leverage
																these valuable
																unlabeled data
																points
															</span>
														</div>
														<div className="flex items-start gap-2">
															<span className="text-slate-600 mt-1">
																✓
															</span>
															<span>
																<strong>
																	Hidden
																	Pattern
																	Discovery:
																</strong>{" "}
																Identifies
																potential normal
																and anomalous
																patterns from
																unlabeled data
															</span>
														</div>
													</div>
												</div>
											</div>

											<div className="bg-gradient-to-r from-slate-100 to-gray-100 p-5 rounded-lg border border-slate-300">
												<h6 className="font-semibold text-slate-800 mb-3">
													Strategic Advantages of PU
													Learning
												</h6>
												<div className="space-y-3 text-sm text-slate-700">
													<div className="flex items-start gap-3">
														<span className="bg-slate-600 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center mt-0.5">
															1
														</span>
														<div>
															<strong>
																Overcoming
																Labeling
																Bottlenecks:
															</strong>{" "}
															Traditional methods
															require labeling the
															remaining 14,471
															points
															individually—costly
															and impractical; PU
															Learning directly
															learns from existing
															1,607 positive
															samples and
															unlabeled data.
														</div>
													</div>
													<div className="flex items-start gap-3">
														<span className="bg-slate-600 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center mt-0.5">
															2
														</span>
														<div>
															<strong>
																Maximizing
																Information
																Utilization:
															</strong>{" "}
															Transforms 90%
															unlabeled data from
															"wasted resources"
															into "learning
															assets,"
															significantly
															improving model
															generalization and
															robustness.
														</div>
													</div>
													<div className="flex items-start gap-3">
														<span className="bg-slate-600 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center mt-0.5">
															3
														</span>
														<div>
															<strong>
																Adapting to
																Complex
																Scenarios:
															</strong>{" "}
															The irregular usage
															patterns of student
															activity rooms are
															exactly the complex,
															dynamic environments
															that PU Learning
															excels at handling,
															capable of adapting
															to new anomaly
															patterns.
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>

								{/* Step 4: 理論支撐 - Theoretical Foundation of PU Learning */}
								<h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
									<span className="text-2xl">🔬</span>
									2.4 Theoretical Foundation of PU Learning
								</h2>
								<div
									id="pu-learning-motivation"
									className="scroll-mt-6"
								>
									{/* Theoretical Foundation */}
									<div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200 shadow-md mb-6">
										<h4 className="font-bold text-blue-800 mb-6 flex items-center gap-3 text-xl">
											<span className="text-2xl">🔬</span>
											Theoretical Foundation of PU
											Learning
										</h4>
										<div className="grid lg:grid-cols-2 gap-6">
											<div>
												<h5 className="font-semibold text-blue-700 mb-3 text-lg">
													Mathematical Justification
												</h5>
												<p className="text-slate-700 leading-relaxed text-base mb-4">
													Positive-Unlabeled (PU)
													Learning addresses the
													fundamental challenge when
													only positive examples and
													unlabeled data are
													available. Unlike
													traditional binary
													classification, PU learning
													estimates the posterior
													probability P(y=1|x) without
													requiring negative examples,
													making it ideal for
													scenarios where negative
													instances are difficult or
													expensive to identify.
												</p>
												<div className="bg-white p-4 rounded-lg border border-blue-200">
													<div className="text-sm font-mono text-blue-800 mb-2">
														P(y=1|x) = P(s=1|x) /
														P(s=1|y=1)
													</div>
													<div className="text-xs text-slate-600">
														Where s=1 indicates
														selection into positive
														set, y=1 indicates true
														positive class
													</div>
												</div>
											</div>
											<div className="space-y-4">
												<div className="bg-white p-4 rounded-lg border border-blue-200">
													<h6 className="font-semibold text-blue-800 mb-2">
														Key Advantages
													</h6>
													<ul className="text-sm text-slate-700 space-y-1">
														<li>
															• Eliminates need
															for exhaustive
															negative labeling
														</li>
														<li>
															• Naturally handles
															class imbalance
															scenarios
														</li>
														<li>
															• Leverages abundant
															unlabeled
															information
														</li>
														<li>
															• Adapts to evolving
															anomaly patterns
														</li>
													</ul>
												</div>
												<div className="bg-white p-4 rounded-lg border border-blue-200">
													<h6 className="font-semibold text-blue-800 mb-2">
														Energy Domain
														Applications
													</h6>
													<ul className="text-sm text-slate-700 space-y-1">
														<li>
															• Fault detection
															without normal
															baselines
														</li>
														<li>
															• Equipment anomaly
															identification
														</li>
														<li>
															• Behavioral pattern
															discovery
														</li>
														<li>
															• Cross-building
															generalization
														</li>
													</ul>
												</div>
											</div>
										</div>
									</div>

									{/* Traditional vs PU Learning Comparison */}
									<div className="bg-amber-50 p-6 rounded-xl border-2 border-amber-200 shadow-md">
										<h4 className="font-bold text-amber-800 mb-6 flex items-center gap-3 text-xl">
											<span className="text-2xl">⚖️</span>
											Traditional vs PU Learning Paradigm
										</h4>
										<div className="grid lg:grid-cols-2 gap-6">
											<div className="bg-white p-5 rounded-lg border border-red-200">
												<h5 className="font-semibold text-red-700 mb-3 text-lg flex items-center gap-2">
													<span>❌</span>
													Traditional Binary
													Classification
												</h5>
												<div className="space-y-3">
													<div className="text-slate-700">
														<strong>
															Requirements:
														</strong>
														<ul className="mt-2 space-y-1 text-sm">
															<li>
																• Labeled
																positive
																examples
															</li>
															<li>
																• Labeled
																negative
																examples
															</li>
															<li>
																• Balanced
																training data
															</li>
															<li>
																• Exhaustive
																annotation
																effort
															</li>
														</ul>
													</div>
													<div className="text-slate-700">
														<strong>
															Challenges in Energy
															Domain:
														</strong>
														<ul className="mt-2 space-y-1 text-sm">
															<li>
																• High
																annotation cost
																for normal
																patterns
															</li>
															<li>
																• Class
																imbalance (rare
																anomalies)
															</li>
															<li>
																• Temporal
																pattern
																complexity
															</li>
															<li>
																• Domain expert
																requirement
															</li>
														</ul>
													</div>
												</div>
											</div>
											<div className="bg-white p-5 rounded-lg border border-green-200">
												<h5 className="font-semibold text-green-700 mb-3 text-lg flex items-center gap-2">
													<span>✅</span>
													PU Learning Approach
												</h5>
												<div className="space-y-3">
													<div className="text-slate-700">
														<strong>
															Requirements:
														</strong>
														<ul className="mt-2 space-y-1 text-sm">
															<li>
																• Only positive
																examples
															</li>
															<li>
																• Abundant
																unlabeled data
															</li>
															<li>
																• Class prior
																estimation
															</li>
															<li>
																• Minimal
																annotation
																effort
															</li>
														</ul>
													</div>
													<div className="text-slate-700">
														<strong>
															Energy Domain
															Benefits:
														</strong>
														<ul className="mt-2 space-y-1 text-sm">
															<li>
																• Cost-effective
																anomaly
																detection
															</li>
															<li>
																• Natural
																handling of
																imbalanced data
															</li>
															<li>
																• Leverages
																temporal
																patterns
															</li>
															<li>
																• Reduced expert
																dependency
															</li>
														</ul>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>

								{/* Transition to Labeling Challenge */}
								<div className="my-8 p-6 bg-gradient-to-r from-red-100 to-orange-100 rounded-xl border-2 border-red-300">
									<div className="text-center">
										<h3 className="text-xl font-bold text-red-800 mb-3">
											🚨 This Data Distribution Renders
											Traditional Methods Obsolete
										</h3>
										<p className="text-slate-700 text-lg leading-relaxed">
											Even with sophisticated feature
											engineering and temporal
											synchronization, we face a
											fundamental challenge:
											<span className="font-semibold text-red-700">
												{" "}
												the scarcity of labeled
												anomalies makes traditional
												supervised learning impractical
											</span>
											. This reality demands a paradigm
											shift towards methods that can learn
											from predominantly unlabeled data.
										</p>
									</div>
								</div>

								<div className="grid md:grid-cols-3 gap-6">
									<div className="bg-red-50 p-4 rounded-lg border border-red-200">
										<h5 className="font-semibold text-red-800 mb-2">
											The Labeling Challenge
										</h5>
										<p className="text-sm text-slate-700">
											In our testbed example, even with
											1,607 labeled anomalies from Room
											A-310, we still have 14,471
											unlabeled data points. Traditional
											supervised learning cannot utilize
											this vast unlabeled majority,
											wasting 90% of available information
											across all monitored spaces.
										</p>
									</div>
									<div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
										<h5 className="font-semibold text-yellow-800 mb-2">
											The Expert Bottleneck
										</h5>
										<p className="text-sm text-slate-700">
											Manual labeling of anomalies
											requires extensive domain expertise
											and time. Scaling this approach
											across our entire testbed with
											multiple rooms and diverse usage
											patterns becomes prohibitively
											expensive and impractical for
											real-world deployment.
										</p>
									</div>
									<div className="bg-green-50 p-4 rounded-lg border border-green-200">
										<h5 className="font-semibold text-green-800 mb-2">
											The PU Learning Opportunity
										</h5>
										<p className="text-sm text-slate-700">
											Our PU learning approach transforms
											this testbed challenge into an
											advantage by learning from both the
											available positive examples and the
											vast unlabeled data points,
											maximizing information utilization
											across all monitored environments.
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</section>

					{/* Research Methodology & Contributions */}
					<section id="our-solution" className="scroll-mt-6">
						<Card className="border-l-4 border-l-slate-400 bg-white shadow-lg p-0 overflow-hidden">
							<CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 border-b border-slate-200 p-6">
								<div className="flex items-center gap-4 mb-3">
									<div className="p-3 bg-slate-700 rounded-lg shadow-sm">
										<Brain className="h-6 w-6 text-white" />
									</div>
									<div>
										<CardTitle className="text-3xl font-semibold text-slate-800 mb-1">
											Research Methodology & Contributions
										</CardTitle>
										<div className="flex items-center gap-2">
											<div className="h-1 w-12 bg-slate-500 rounded-full" />
											<span className="text-sm font-medium text-slate-600 uppercase tracking-wide">
												Novel Approaches
											</span>
										</div>
									</div>
								</div>
								<p className="text-lg text-slate-700 leading-relaxed bg-white/80 p-4 rounded-lg border border-slate-100">
									This research proposes innovative machine
									learning methodologies that address the
									fundamental limitations of traditional
									supervised learning in energy anomaly
									detection. Our contributions advance the
									theoretical understanding of learning from
									positive and unlabeled data while developing
									practical solutions for cross-domain energy
									management challenges.
								</p>
							</CardHeader>
							<CardContent className="p-6 space-y-8">
								{/* Research Contributions Section */}
								<div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-xl border-2 border-emerald-300 shadow-md">
									<h3 className="text-2xl font-bold text-emerald-800 mb-6 flex items-center gap-3">
										<span className="text-2xl">🏆</span>
										Key Research Contributions
									</h3>
									<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
										{/* Contribution 1: Theoretical */}
										<div className="bg-white p-5 rounded-lg border border-emerald-200 shadow-sm">
											<div className="flex items-center gap-3 mb-3">
												<div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
													💡
												</div>
												<h4 className="text-lg font-semibold text-emerald-800">
													Theoretical Innovation
												</h4>
											</div>
											<ul className="text-sm text-slate-700 space-y-2">
												<li className="flex items-start gap-2">
													<span className="text-emerald-600 font-bold">
														•
													</span>
													<span>
														<strong>
															Extended PU Learning
															Theory
														</strong>{" "}
														to energy anomaly
														detection
													</span>
												</li>
												<li className="flex items-start gap-2">
													<span className="text-emerald-600 font-bold">
														•
													</span>
													<span>
														<strong>
															Cross-domain
															adaptation
														</strong>{" "}
														for unlabeled
														environments
													</span>
												</li>
												<li className="flex items-start gap-2">
													<span className="text-emerald-600 font-bold">
														•
													</span>
													<span>
														<strong>
															Temporal-aware PU
															formulation
														</strong>{" "}
														for time-series data
													</span>
												</li>
											</ul>
										</div>

										{/* Contribution 2: Methodological */}
										<div className="bg-white p-5 rounded-lg border border-blue-200 shadow-sm">
											<div className="flex items-center gap-3 mb-3">
												<div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
													⚙️
												</div>
												<h4 className="text-lg font-semibold text-blue-800">
													Technical Methodology
												</h4>
											</div>
											<ul className="text-sm text-slate-700 space-y-2">
												<li className="flex items-start gap-2">
													<span className="text-blue-600 font-bold">
														•
													</span>
													<span>
														<strong>
															Hybrid gap-filling
															strategy
														</strong>{" "}
														for temporal
														synchronization
													</span>
												</li>
												<li className="flex items-start gap-2">
													<span className="text-blue-600 font-bold">
														•
													</span>
													<span>
														<strong>
															1φ3W feature
															engineering
														</strong>{" "}
														for electrical systems
													</span>
												</li>
												<li className="flex items-start gap-2">
													<span className="text-blue-600 font-bold">
														•
													</span>
													<span>
														<strong>
															Domain-adaptive PU
															algorithms
														</strong>{" "}
														for cross-building
														deployment
													</span>
												</li>
											</ul>
										</div>

										{/* Contribution 3: Practical */}
										<div className="bg-white p-5 rounded-lg border border-purple-200 shadow-sm">
											<div className="flex items-center gap-3 mb-3">
												<div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
													🎯
												</div>
												<h4 className="text-lg font-semibold text-purple-800">
													Practical Impact
												</h4>
											</div>
											<ul className="text-sm text-slate-700 space-y-2">
												<li className="flex items-start gap-2">
													<span className="text-purple-600 font-bold">
														•
													</span>
													<span>
														<strong>
															90% reduction
														</strong>{" "}
														in labeled data
														requirements
													</span>
												</li>
												<li className="flex items-start gap-2">
													<span className="text-purple-600 font-bold">
														•
													</span>
													<span>
														<strong>
															Cross-domain
															deployment
														</strong>{" "}
														without retraining
													</span>
												</li>
												<li className="flex items-start gap-2">
													<span className="text-purple-600 font-bold">
														•
													</span>
													<span>
														<strong>
															Real-time anomaly
															detection
														</strong>{" "}
														for IoT energy systems
													</span>
												</li>
											</ul>
										</div>
									</div>

									{/* Research Impact Summary - moved here for better flow */}
									<div className="mt-6 bg-white p-6 rounded-lg border border-emerald-300 shadow-sm">
										<h4 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center gap-2">
											🌟 Research Impact & Practical
											Significance
										</h4>
										<p className="text-slate-700 leading-relaxed">
											This work bridges the gap between
											theoretical machine learning
											advances and practical energy
											management needs, providing the{" "}
											<strong className="text-emerald-700">
												first comprehensive framework
												for PU learning in energy
												anomaly detection
											</strong>
											. Our methodology enables scalable
											deployment across diverse building
											environments while maintaining high
											accuracy with minimal supervision
											requirements, achieving a{" "}
											<strong className="text-emerald-700">
												90% reduction in labeled data
												requirements
											</strong>{" "}
											while enabling{" "}
											<strong className="text-emerald-700">
												cross-domain deployment without
												retraining
											</strong>
											.
										</p>
									</div>
								</div>

								{/* Research Methodologies Detail */}
								<div className="space-y-8">
									{/* PU Learning */}
									<div
										id="pu-learning"
										className="scroll-mt-6"
									>
										<div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
											<h4 className="font-bold text-blue-800 mb-4 flex items-center gap-2">
												<Target className="h-5 w-5" />
												Positive-Unlabeled (PU) Learning
											</h4>
											<div className="grid md:grid-cols-2 gap-6">
												<div>
													<p className="text-slate-700 mb-4 leading-relaxed">
														Instead of requiring
														comprehensive labeled
														datasets, PU Learning
														leverages a small set of
														confirmed positive
														examples (known
														anomalies) and a large
														pool of unlabeled data.
														Our algorithm
														intelligently identifies
														reliable negative
														examples from the
														unlabeled pool,
														effectively
														bootstrapping the
														learning process.
													</p>
													<Badge className="bg-blue-100 text-blue-800">
														Mathematical Foundation
														(nnPU)
													</Badge>
													<div className=" text-slate-600 mt-2">
														<LaTeX>
															{
																"\\hat{R}_{\\text{nnPU}} = \\pi^+ \\hat{R}_P + \\max\\left(0, \\hat{R}_U - \\pi^+ \\hat{R}_P\\right)"
															}
														</LaTeX>
													</div>
												</div>
												<div className="space-y-3">
													<div className="bg-white p-3 rounded border">
														<span className="text-xs font-semibold text-green-600">
															Advantages:
														</span>
														<ul className="text-xs text-slate-600 mt-1 space-y-1">
															<li>
																• Reduces
																labeling
																requirements by
																90%
															</li>
															<li>
																• Handles class
																imbalance
																naturally
															</li>
															<li>
																• Adapts to new
																anomaly types
															</li>
														</ul>
													</div>
													<div className="bg-white p-3 rounded border">
														<span className="text-xs font-semibold text-blue-600">
															Technical
															Implementation:
														</span>
														<ul className="text-xs text-slate-600 mt-1 space-y-1">
															<li>
																• Biased SVM
																with class
																probability
																estimation
															</li>
															<li>
																• Non-negative
																risk estimation
															</li>
															<li>
																• Ensemble
																voting for
																robustness
															</li>
														</ul>
													</div>
												</div>
											</div>
										</div>
									</div>

									{/* Domain Adaptation */}
									<div
										id="domain-adaptation"
										className="scroll-mt-6"
									>
										<div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
											<h4 className="font-bold text-purple-800 mb-4 flex items-center gap-2">
												<Users className="h-5 w-5" />
												Domain Adaptation & Transfer
												Learning
											</h4>
											<div className="grid md:grid-cols-2 gap-6">
												<div>
													<p className="text-slate-700 mb-4 leading-relaxed">
														Energy consumption
														patterns vary
														significantly across
														different building
														types, climates, and
														usage scenarios. Our
														domain adaptation
														framework enables models
														trained on one facility
														to generalize
														effectively to new
														environments with
														minimal retraining.
													</p>
													<Badge className="bg-purple-100 text-purple-800">
														Cross-Domain
														Intelligence
													</Badge>
													<div className="text-slate-600 mt-2">
														<LaTeX>
															{
																"\\mathcal{L}_T \\leq \\mathcal{L}_S + \\frac{1}{2}d_{\\mathcal{H}\\Delta\\mathcal{H}}(\\mathcal{D}_S, \\mathcal{D}_T) + \\lambda"
															}
														</LaTeX>
													</div>
												</div>
												<div className="space-y-3">
													<div className="bg-white p-3 rounded border">
														<span className="text-xs font-semibold text-purple-600">
															Key Techniques:
														</span>
														<ul className="text-xs text-slate-600 mt-1 space-y-1">
															<li>
																• Feature
																distribution
																alignment
															</li>
															<li>
																• Adversarial
																domain
																adaptation
															</li>
															<li>
																• Meta-learning
																for quick
																adaptation
															</li>
														</ul>
													</div>
													<div className="bg-white p-3 rounded border">
														<span className="text-xs font-semibold text-amber-600">
															Real-World Impact:
														</span>
														<ul className="text-xs text-slate-600 mt-1 space-y-1">
															<li>
																• 75% reduction
																in deployment
																time
															</li>
															<li>
																• Consistent
																performance
																across sites
															</li>
															<li>
																• Automatic
																adaptation to
																seasonal changes
															</li>
														</ul>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</section>
				</div>
			</div>
		</div>
	);
}
