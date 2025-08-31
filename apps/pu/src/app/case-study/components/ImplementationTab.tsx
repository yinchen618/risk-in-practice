"use client";
import {} from "@/components/ui/card";
import {
	Activity,
	BarChart3,
	Brain,
	Filter,
	GitBranch,
	Layers,
	Network,
	Shield,
	Target,
	Users,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import {
	DataPipelineFeatures,
	ReliableImplementation,
	StageImplementations,
	SystemOverview,
	TechnicalArchitecture,
	TechnicalContributions,
} from "./implementation";

// 假設您有一個 CodeBlock 元件用於語法高亮
// import { CodeBlock } from "@/components/CodeBlock";
// 為了演示，我們用一個簡單的 pre 標籤代替
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

export default function ImplementationTab() {
	const [activeSection, setActiveSection] = useState("system-overview");

	// Handle scroll to update active section (與 ProblemApproachTab 相同)
	useEffect(() => {
		const handleScroll = () => {
			const sections = [
				"system-overview",
				"architecture-design",
				"data-pipeline",
				"reliable-implementation",
				"data-split-strategy",
				"stage-1-implementation",
				"stage-2-implementation",
				"stage-3-implementation",
				"stage-4-implementation",
				"technical-contributions",
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
			const offsetPosition = elementPosition - 100;

			window.scrollTo({
				top: offsetPosition,
				behavior: "smooth",
			});
		}
	};

	return (
		<div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
			<div className="flex mx-auto">
				{/* Left Sidebar - Navigation (1/4) */}
				<div className="w-1/4 p-6">
					<div className="sticky top-6">
						{/* Page Title */}
						<div className="mb-8">
							<h1 className="text-2xl font-bold text-slate-800 mb-2">
								System Implementation & Architecture
							</h1>
							<p className="text-sm text-slate-600">
								PU Learning Workbench for IoT Anomaly Detection
							</p>
						</div>

						{/* Navigation */}
						<nav className="space-y-2">
							{[
								{
									id: "system-overview",
									label: "System Overview",
									icon: Brain,
								},
								{
									id: "architecture-design",
									label: "Technical Architecture",
									icon: Layers,
								},
								{
									id: "data-pipeline",
									label: "Data Pipeline & Features",
									icon: Activity,
								},
								{
									id: "reliable-implementation",
									label: "Reliable Training Pipeline",
									icon: Shield,
								},
								{
									id: "data-split-strategy",
									label: "Data Split Strategy Evolution",
									icon: GitBranch,
								},
								{
									id: "stage-1-implementation",
									label: "Stage 1: Candidate Generation",
									icon: Filter,
								},
								{
									id: "stage-2-implementation",
									label: "Stage 2: Expert Labeling",
									icon: Users,
								},
								{
									id: "stage-3-implementation",
									label: "Stage 3: PU Training",
									icon: Network,
								},
								{
									id: "stage-4-implementation",
									label: "Stage 4: Results Analysis",
									icon: BarChart3,
								},
								{
									id: "model-architecture",
									label: "LSTM+PU Model Architecture",
									icon: Brain,
								},
								{
									id: "technical-contributions",
									label: "Technical Contributions",
									icon: Target,
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
								</div>
							))}
						</nav>
					</div>
				</div>

				{/* Right Content Area (3/4) */}
				<div className="w-3/4 p-6 space-y-12">
					<SystemOverview />
					<TechnicalArchitecture />
					<DataPipelineFeatures />
					<ReliableImplementation />
					<StageImplementations />
					<TechnicalContributions />
				</div>
			</div>
		</div>
	);
}
