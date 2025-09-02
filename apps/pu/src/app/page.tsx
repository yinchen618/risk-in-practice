"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Activity,
	Brain,
	Cpu,
	FileText, // Replaced Settings for model display
	FlaskConical,
	Layers,
	type LucideIcon,
	Microscope,
	Network,
	Rocket, // New icon for impact
	Target,
	TrendingUp,
} from "lucide-react";
import Link from "next/link";

// No changes to the interface
interface FeatureCardData {
	icon: LucideIcon;
	title: string;
	description: string;
	href: string;
	difficulty: string;
	tags: string[];
	color: string;
	academicValue: string;
	isHighlight?: boolean;
	isNew?: boolean;
}

export default function HomePage() {
	return (
		<div className="container mx-auto px-4 py-12">
			{/* --- Hero Section (MODIFIED) --- */}
			<div className="text-center mb-16" id="top">
				<div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-slate-700 to-slate-800 text-white mb-8">
					<Brain className="h-10 w-10" />
				</div>
				<h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-800">
					PU Learning in Practice
				</h1>
				<h2 className="text-xl md:text-2xl text-slate-600 mb-6 font-medium">
					From nnPU Theory to a Real-World Smart Grid: An AI-Powered
					Testbed
				</h2>
				<p className="text-lg text-slate-600 max-w-5xl mx-auto leading-relaxed mb-8">
					In this project, I demonstrate the practical application of{" "}
					<strong>Prof. Masashi Sugiyama's</strong> nnPU Learning
					theory on a 95-unit smart residential testbed. By
					integrating advanced models, I achieved significant results
					in a real-world, non-stationary environment.
				</p>

				{/* --- Highlighted Models Section (NEW) --- */}
				<div className="max-w-4xl mx-auto mb-8">
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
						{/* Main Highlight: LSTM + PU Learning */}
						<div className="lg:col-span-2 bg-white border-2 border-slate-700 rounded-lg p-6 text-left shadow-lg">
							<div className="flex items-start">
								<div className="bg-slate-700 text-white rounded-full h-12 w-12 flex-shrink-0 flex items-center justify-center mr-4">
									<Cpu className="h-6 w-6" />
								</div>
								<div>
									<h3 className="text-xl font-bold text-slate-800 mb-1 mt-2">
										Core Implementation: LSTM + PU Learning
									</h3>
									<p className="text-slate-600 mb-5 mt-4">
										Leveraging the strength of{" "}
										<strong>
											Long Short-Term Memory (LSTM)
										</strong>{" "}
										networks in sequential data, I
										successfully modeled energy consumption
										patterns, leading to robust anomaly
										detection.
									</p>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
										<div className="bg-slate-100 border border-slate-200 rounded-lg p-3">
											<div className="font-bold text-slate-800">
												F1-Score 73.9%
											</div>
											<div className="text-slate-600">
												ERM Baseline
											</div>
										</div>
										<div className="bg-slate-100 border border-slate-200 rounded-lg p-3">
											<div className="font-bold text-slate-800">
												F1-Score 77.9%
											</div>
											<div className="text-slate-600">
												Domain Adaptation
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						{/* Future Directions */}
						<div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-left">
							<h3 className="text-lg font-semibold text-slate-800 mb-3">
								Future Research Directions
							</h3>
							<div className="space-y-3">
								<div className="bg-white p-3 rounded-md border border-slate-200">
									<p className="font-semibold text-slate-700">
										XGBoost + PU Learning
									</p>
									<p className="text-xs text-slate-500">
										For structured data & feature importance
									</p>
								</div>
								<div className="bg-white p-3 rounded-md border border-slate-200">
									<p className="font-semibold text-slate-700">
										Transformer + PU Learning
									</p>
									<p className="text-xs text-slate-500">
										For complex long-range dependencies
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<p className="text-lg text-slate-600 max-w-5xl mx-auto leading-relaxed mb-12">
					This interactive platform bridges the gap between
					cutting-edge theory and complex reality, providing concrete
					data and insights for practical PU Learning implementation.
				</p>
			</div>

			{/* --- Core Navigation Area (MODIFIED) --- */}
			<div className="mb-16">
				<h2 className="text-3xl font-bold text-center mb-4 text-slate-800">
					Research Path: From Theory to Deployment
				</h2>
				<div className="text-lg text-slate-600 text-center mb-12 max-w-3xl mx-auto">
					<p className="mb-2">A three-stage journey:</p>
					<ul className="list-none space-y-1">
						<li>• Mastering the core theory</li>
						<li>• Understanding the real-world environment</li>
						<li>• Implementing an advanced PU Learning model</li>
					</ul>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{/* Card 1: PU Learning Theory (MODIFIED) */}
					<Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-slate-200 hover:border-slate-300">
						<CardHeader className="text-center pb-4">
							<div className="w-16 h-16 bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
								<FlaskConical className="h-8 w-8 text-white" />
							</div>
							<CardTitle className="text-xl text-slate-800 group-hover:text-slate-700 transition-colors">
								① Synthetic Sandbox: uPU vs. nnPU
							</CardTitle>
						</CardHeader>
						<CardContent className="text-center">
							<CardDescription className="text-base mb-6 leading-relaxed text-slate-600">
								<p className="mb-3">Replicating Prof. Sugiyama's foundational algorithms:</p>
								<ul className="text-sm list-none space-y-1 text-left">
									<li>• Understanding uPU vs. nnPU performance</li>
									<li>• Exploring hyperparameter impacts</li>
									<li>• Testing class-prior and model complexity</li>
									<li>• Controlled environment validation</li>
								</ul>
							</CardDescription>
							<div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-6">
								<p className="text-sm text-slate-700 font-medium">
									🎯 Goal: Deep dive into the core mechanisms
									of PU algorithms.
								</p>
							</div>
							<Button
								size="lg"
								className="w-full bg-slate-700 hover:bg-slate-800 text-white"
								asChild
							>
								<Link href="/pu-learning">
									Open Interactive Demo
									<Microscope className="ml-2 h-4 w-4" />
								</Link>
							</Button>
						</CardContent>
					</Card>

					{/* Card 2: Smart Residential Testbed (MODIFIED) */}
					<Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-slate-200 hover:border-slate-300">
						<CardHeader className="text-center pb-4">
							<div className="w-16 h-16 bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
								<Network className="h-8 w-8 text-white" />
							</div>
							<CardTitle className="text-xl text-slate-800 group-hover:text-slate-700 transition-colors">
								② Real-World Testbed & Data
							</CardTitle>
						</CardHeader>
						<CardContent className="text-center">
							<CardDescription className="text-base mb-6 leading-relaxed text-slate-600">
								<p className="mb-3">95-unit smart residential testbed features:</p>
								<ul className="text-sm list-none space-y-1 text-left">
									<li>• Non-stationary environment</li>
									<li>• Diverse users: students & office workers</li>
									<li>• Live data streams monitoring</li>
									<li>• Real-world data collection challenges</li>
								</ul>
							</CardDescription>
							<div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-6">
								<p className="text-sm text-slate-700 font-medium">
									🏠 Environment: 95 diverse residential units
									with live monitoring.
								</p>
							</div>
							<Button
								size="lg"
								className="w-full bg-slate-700 hover:bg-slate-800 text-white"
								asChild
							>
								<Link href="/testbed">
									Explore The Environment
									<Activity className="ml-2 h-4 w-4" />
								</Link>
							</Button>
						</CardContent>
					</Card>

					{/* Card 3: Application Case Study (MODIFIED) */}
					<Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-slate-200 hover:border-slate-300">
						<CardHeader className="text-center pb-4">
							<div className="w-16 h-16 bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
								<Target className="h-8 w-8 text-white" />
							</div>
							<CardTitle className="text-xl text-slate-800 group-hover:text-slate-700 transition-colors">
								③ LSTM+PU Training & Evaluation
							</CardTitle>
						</CardHeader>
						<CardContent className="text-center">
							<CardDescription className="text-base mb-6 leading-relaxed text-slate-600">
								<p className="mb-3">LSTM+PU Learning implementation:</p>
								<ul className="text-sm list-none space-y-1 text-left">
									<li>• Process collected real-world data</li>
									<li>• Train LSTM+PU model</li>
									<li>• Evaluate against ERM & Domain Adaptation</li>
									<li>• Validate effectiveness with rigorous testing</li>
								</ul>
							</CardDescription>
							<div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-6">
								<p className="text-sm text-slate-700 font-medium">
									⚡ Core Model: Achieving F1-Score of 77.9%
									with LSTM.
								</p>
							</div>
							<Button
								size="lg"
								className="w-full bg-slate-700 hover:bg-slate-800 text-white"
								asChild
							>
								<Link href="/case-study">
									View Training Results
									<TrendingUp className="ml-2 h-4 w-4" />
								</Link>
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* --- Research Impact & Innovation (MODIFIED) --- */}
			<div className="mb-16">
				<h2 className="text-3xl font-bold text-center mb-8 text-slate-800">
					Key Research Contributions
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					<div className="text-center p-6 bg-white border border-slate-200 rounded-lg">
						<div className="w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
							<FlaskConical className="h-6 w-6 text-white" />
						</div>
						<h3 className="font-semibold mb-2 text-slate-800">
							Theory to Practice
						</h3>
						<ul className="text-sm text-slate-600 list-none space-y-1 text-left">
							<li>• Bridged nnPU theory gap</li>
							<li>• Applied to noisy real-world data</li>
							<li>• Validated practical effectiveness</li>
						</ul>
					</div>
					<div className="text-center p-6 bg-white border border-slate-200 rounded-lg">
						<div className="w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
							<Network className="h-6 w-6 text-white" />
						</div>
						<h3 className="font-semibold mb-2 text-slate-800">
							Non-Negative Risk in the Wild
						</h3>
						<ul className="text-sm text-slate-600 list-none space-y-1 text-left">
							<li>• Demonstrated <strong>nnPU</strong> core principle</li>
							<li>• Prevented overfitting effectively</li>
							<li>• Handled non-stationary time-series</li>
						</ul>
					</div>
					<div className="text-center p-6 bg-white border border-slate-200 rounded-lg">
						<div className="w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
							<Rocket className="h-6 w-6 text-white" />
						</div>
						<h3 className="font-semibold mb-2 text-slate-800">
							Deep Learning Integration
						</h3>
						<ul className="text-sm text-slate-600 list-none space-y-1 text-left">
							<li>• Successfully integrated LSTM</li>
							<li>• Combined with PU learning framework</li>
							<li>• Handled complex sequential data</li>
						</ul>
					</div>
					<div className="text-center p-6 bg-white border border-slate-200 rounded-lg">
						<div className="w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
							<Layers className="h-6 w-6 text-white" />
						</div>
						<h3 className="font-semibold mb-2 text-slate-800">
							Open & Reproducible
						</h3>
						<ul className="text-sm text-slate-600 list-none space-y-1 text-left">
							<li>• Transparent experiment inspection</li>
							<li>• Reproducible key results</li>
							<li>• Interactive platform access</li>
						</ul>
					</div>
				</div>
			</div>

			{/* --- Footer Information (MODIFIED) --- */}
			<div className="mt-16 border-t border-slate-200 pt-8">
				<div className="text-center">
					<h3 className="text-lg font-semibold mb-3 text-slate-800">
						About This Project
					</h3>
					<p className="text-slate-600 mb-4 max-w-4xl mx-auto">
						This interactive research prototype was developed by{" "}
						<strong>Yin-Chen Chen</strong> as a demonstration of
						research capabilities in machine learning engineering
						and practical application. The project's methodology is
						designed to align with the research focus of{" "}
						<strong>
							Prof. Masashi Sugiyama's lab at the University of
							Tokyo
						</strong>
						.
					</p>

					<div className="mb-6">
						<Button
							size="lg"
							variant="outline"
							className="border-slate-300 text-slate-700 hover:bg-slate-50"
							asChild
						>
							<Link href="/about">
								<FileText className="h-4 w-4 mr-2" />
								View My Application Statement
							</Link>
						</Button>
					</div>

					<div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-500">
						<div className="flex items-center gap-2">
							<span>Backend: PyTorch + FastAPI</span>
						</div>
						<div className="flex items-center gap-2">
							<span>Frontend: Next.js + TypeScript</span>
						</div>
						<div className="flex items-center gap-2">
							<span>Data Source: Live IoT System</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
