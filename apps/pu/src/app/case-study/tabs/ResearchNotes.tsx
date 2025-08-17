"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Book, List, Quote } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface TocItem {
	id: string;
	title: string;
	level: number;
}

const tocItems: TocItem[] = [
	{ id: "introduction", title: "Introduction", level: 1 },
	{ id: "note-1", title: "Positive-Unlabeled Learning with nnPU", level: 1 },
	{ id: "note-1-contribution", title: "Core Contribution", level: 2 },
	{ id: "note-1-perspective", title: "My Perspective", level: 2 },
	{ id: "note-1-challenge", title: "Challenge on Testbed", level: 2 },
	{ id: "note-1-future", title: "Future Research", level: 2 },
	{ id: "note-2", title: "Learning under Distribution Shift", level: 1 },
	{ id: "note-2-contribution", title: "Core Contribution", level: 2 },
	{ id: "note-2-perspective", title: "My Perspective", level: 2 },
	{ id: "note-2-challenge", title: "Challenge on Testbed", level: 2 },
	{ id: "note-2-future", title: "Future Research", level: 2 },
	{ id: "note-3", title: "Self-Training for Noisy Labels", level: 1 },
	{ id: "note-3-contribution", title: "Core Contribution", level: 2 },
	{ id: "note-3-perspective", title: "My Perspective", level: 2 },
	{ id: "note-3-challenge", title: "Challenge on Testbed", level: 2 },
	{ id: "note-3-future", title: "Future Research", level: 2 },
	{ id: "synthesis", title: "Synthesis & Future Directions", level: 1 },
];

export function ResearchNotes() {
	const [activeId, setActiveId] = useState<string>("");

	const scrollToSection = useCallback((id: string) => {
		const element = document.getElementById(id);
		if (element) {
			const offsetTop = element.offsetTop - 120; // 120px offset to account for header
			window.scrollTo({
				top: offsetTop,
				behavior: "smooth",
			});
		}
	}, []);

	useEffect(() => {
		const handleScroll = () => {
			const scrollY = window.scrollY + 140; // Offset slightly more than scroll offset for better UX
			const sections = tocItems.map((item) => {
				const element = document.getElementById(item.id);
				return {
					id: item.id,
					top: element?.offsetTop || 0,
				};
			});

			// Find the current section based on scroll position
			let currentId = "";
			for (let i = sections.length - 1; i >= 0; i--) {
				if (scrollY >= sections[i].top) {
					currentId = sections[i].id;
					break;
				}
			}
			setActiveId(currentId);
		};

		window.addEventListener("scroll", handleScroll);
		handleScroll(); // Initial call
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<div className="flex gap-8 max-w-7xl mx-auto py-8">
			{/* Main Content */}
			<div className="flex-1 space-y-8">
				{/* 主標題 */}
				<div id="introduction" className="text-center space-y-4">
					<h2 className="text-4xl font-serif font-bold text-slate-900">
						Bridging Theory and Practice: My Research Notes
					</h2>
					<div className="text-lg leading-relaxed text-slate-700 max-w-3xl mx-auto">
						<p>
							The empirical findings from the{" "}
							<strong>Interactive Lab</strong> tab are not
							generated in a vacuum. They are best understood when
							placed in a direct dialogue with the foundational
							and cutting-edge research in weakly-supervised
							learning. This section documents my attempt to build
							that bridge. Here, I analyze several key papers,
							critically examining their assumptions against the
							complex, non-stationary realities observed in my
							95-unit testbed, and explore the future research
							questions that arise from this intersection.
						</p>
					</div>
				</div>

				{/* 論文分析區塊 1 */}
				<Card
					id="note-1"
					className="border-l-4 border-l-blue-500 shadow-lg"
				>
					<CardHeader className="bg-gradient-to-r from-blue-50 to-slate-50">
						<div className="flex items-start justify-between">
							<div className="space-y-2">
								<Badge
									variant="outline"
									className="text-blue-700 border-blue-300"
								>
									<Book className="w-3 h-3 mr-1" />
									Note 1
								</Badge>
								<CardTitle className="text-2xl font-serif text-slate-900">
									Positive-Unlabeled Learning with
									Non-Negative Risk Estimator (nnPU)
								</CardTitle>
							</div>
						</div>
					</CardHeader>
					<CardContent className="space-y-6 p-8">
						{/* 專業引用格式區塊 */}
						<div className="bg-slate-100 border-l-4 border-l-slate-400 p-4 rounded-r-lg font-mono text-sm">
							<div className="flex items-start gap-2">
								<Quote className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
								<div>
									<strong>Citation:</strong> Kiryo, R., Niu,
									G., Plessis, M. C., & Sugiyama, M. (2017).
									Positive-Unlabeled Learning with
									Non-Negative Risk Estimator.{" "}
									<em>
										Advances in Neural Information
										Processing Systems (NeurIPS) 30
									</em>
									.
								</div>
							</div>
						</div>

						{/* Core Contribution */}
						<div id="note-1-contribution" className="space-y-3">
							<h4 className="text-xl font-semibold text-slate-800">
								Core Contribution
							</h4>
							<p className="text-slate-700 leading-relaxed">
								This paper solves the critical issue where the
								unbiased PU risk estimator (uPU) can become
								negative, leading to severe overfitting,
								especially when the class prior π is small. It
								proposes a non-negative risk estimator that is
								theoretically guaranteed to be non-negative,
								resulting in more stable and reliable model
								training without special techniques like early
								stopping.
							</p>
						</div>

						{/* My Perspective */}
						<div id="note-1-perspective" className="space-y-3">
							<h4 className="text-xl font-semibold text-slate-800">
								My Perspective & Connection to the Case Study
							</h4>
							<p className="text-slate-700 leading-relaxed">
								nnPU is one of the core algorithms I benchmarked
								in the <strong>Interactive Lab</strong>. My
								testbed, where many anomaly events have a very
								low true occurrence rate, represents a prime use
								case for the nnPU framework.
							</p>
						</div>

						{/* 關鍵洞察的引用區塊 */}
						<blockquote
							id="note-1-challenge"
							className="border-l-4 border-l-orange-400 pl-6 py-4 bg-orange-50 rounded-r-lg"
						>
							<div className="space-y-2">
								<p className="font-semibold text-orange-800">
									Challenge on My Testbed:
								</p>
								<p className="text-orange-900 leading-relaxed">
									The paper's framework assumes the class
									prior π is a static, fixed value. My testbed
									data, however, reveals that π is itself{" "}
									<strong>non-stationary and dynamic</strong>.
									For example, the frequency of
									air-conditioning-related anomalies is
									significantly higher during summer. This
									time-varying prior, π(t), directly
									challenges the core assumption of a static π
									and reveals a crucial gap: how can the
									non-negative risk estimator remain unbiased
									when the underlying data-generating
									statistics are constantly changing?
								</p>
							</div>
						</blockquote>

						{/* Inspired Future Question */}
						<div id="note-1-future" className="space-y-3">
							<h4 className="text-xl font-semibold text-slate-800">
								Inspired Future Question
							</h4>
							<p className="text-slate-700 leading-relaxed">
								This observation directly inspires a core
								question for my PhD research: Can we design an{" "}
								<strong>"Online nnPU"</strong>
								algorithm with a risk estimator that dynamically
								adapts to a changing class prior π(t)? This
								would require integrating the nnPU framework
								with principles from online learning or
								time-series analysis, a direction I am eager to
								explore.
							</p>
						</div>
					</CardContent>
				</Card>

				{/* 論文分析區塊 2 */}
				<Card
					id="note-2"
					className="border-l-4 border-l-green-500 shadow-lg"
				>
					<CardHeader className="bg-gradient-to-r from-green-50 to-slate-50">
						<div className="flex items-start justify-between">
							<div className="space-y-2">
								<Badge
									variant="outline"
									className="text-green-700 border-green-300"
								>
									<Book className="w-3 h-3 mr-1" />
									Note 2
								</Badge>
								<CardTitle className="text-2xl font-serif text-slate-900">
									Learning under Distribution Shift
								</CardTitle>
							</div>
						</div>
					</CardHeader>
					<CardContent className="space-y-6 p-8">
						{/* 專業引用格式區塊 */}
						<div className="bg-slate-100 border-l-4 border-l-slate-400 p-4 rounded-r-lg font-mono text-sm">
							<div className="flex items-start gap-2">
								<Quote className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
								<div>
									<strong>Citation:</strong> Sugiyama, M., &
									Kawanabe, M. (2012).{" "}
									<em>
										Machine Learning in Non-Stationary
										Environments: Introduction to Covariate
										Shift Adaptation.
									</em>{" "}
									MIT Press.
								</div>
							</div>
						</div>

						{/* Core Contribution */}
						<div id="note-2-contribution" className="space-y-3">
							<h4 className="text-xl font-semibold text-slate-800">
								Core Contribution
							</h4>
							<p className="text-slate-700 leading-relaxed">
								This foundational work addresses the common
								problem where a model's training data
								distribution differs from its test data
								distribution. It introduces methods based on
								importance weighting to correct for this
								"covariate shift," thereby improving the model's
								generalization performance on the target domain.
							</p>
						</div>

						{/* My Perspective */}
						<div id="note-2-perspective" className="space-y-3">
							<h4 className="text-xl font-semibold text-slate-800">
								My Perspective & Connection to the Case Study
							</h4>
							<p className="text-slate-700 leading-relaxed">
								Distribution shift is not an abstract concept in
								my testbed; it is a constant, observable
								phenomenon driven by seasons, holidays, and
								tenant behavior.
							</p>
						</div>

						{/* 關鍵洞察的引用區塊 */}
						<blockquote
							id="note-2-challenge"
							className="border-l-4 border-l-purple-400 pl-6 py-4 bg-purple-50 rounded-r-lg"
						>
							<div className="space-y-2">
								<p className="font-semibold text-purple-800">
									Challenge on My Testbed:
								</p>
								<p className="text-purple-900 leading-relaxed">
									My data exhibits a more complex form of
									shift than the classic covariate shift. For
									instance, not only does the input
									distribution of energy usage change between
									summer and winter (covariate shift), but the
									very definition and frequency of what
									constitutes an "anomaly" can also change
									(label shift). This presents a{" "}
									<strong>compound distribution shift</strong>
									, where existing importance weighting
									methods may not be sufficient.
								</p>
							</div>
						</blockquote>

						{/* Inspired Future Question */}
						<div id="note-2-future" className="space-y-3">
							<h4 className="text-xl font-semibold text-slate-800">
								Inspired Future Question
							</h4>
							<p className="text-slate-700 leading-relaxed">
								How can we develop a unified framework to handle
								compound distribution shifts within a PU
								learning context? Can we design an algorithm
								that can disentangle and adapt to both covariate
								and label shifts simultaneously in an online
								manner?
							</p>
						</div>
					</CardContent>
				</Card>

				{/* 論文分析區塊 3 */}
				<Card
					id="note-3"
					className="border-l-4 border-l-red-500 shadow-lg"
				>
					<CardHeader className="bg-gradient-to-r from-red-50 to-slate-50">
						<div className="flex items-start justify-between">
							<div className="space-y-2">
								<Badge
									variant="outline"
									className="text-red-700 border-red-300"
								>
									<Book className="w-3 h-3 mr-1" />
									Note 3
								</Badge>
								<CardTitle className="text-2xl font-serif text-slate-900">
									Self-Training for Learning with Noisy Labels
								</CardTitle>
							</div>
						</div>
					</CardHeader>
					<CardContent className="space-y-6 p-8">
						{/* 專業引用格式區塊 */}
						<div className="bg-slate-100 border-l-4 border-l-slate-400 p-4 rounded-r-lg font-mono text-sm">
							<div className="flex items-start gap-2">
								<Quote className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
								<div>
									<strong>Citation:</strong> Recent advances
									in self-training techniques for handling
									noisy labels in weakly supervised scenarios,
									as explored in leading venues like NeurIPS
									and ICML.
								</div>
							</div>
						</div>

						{/* Core Contribution */}
						<div id="note-3-contribution" className="space-y-3">
							<h4 className="text-xl font-semibold text-slate-800">
								Core Contribution
							</h4>
							<p className="text-slate-700 leading-relaxed">
								Self-training approaches iteratively improve
								model performance by using the model's own
								predictions to generate pseudo-labels for
								unlabeled data, while employing noise-robust
								techniques to handle inevitable labeling errors.
								These methods are particularly valuable when
								dealing with large amounts of unlabeled data and
								limited, potentially noisy labeled samples.
							</p>
						</div>

						{/* My Perspective */}
						<div id="note-3-perspective" className="space-y-3">
							<h4 className="text-xl font-semibold text-slate-800">
								My Perspective & Connection to the Case Study
							</h4>
							<p className="text-slate-700 leading-relaxed">
								In my testbed, the "noise" in labels isn't just
								random—it's structured and context-dependent,
								often reflecting the subjective nature of what
								different building operators consider
								"anomalous" behavior.
							</p>
						</div>

						{/* 關鍵洞察的引用區塊 */}
						<blockquote
							id="note-3-challenge"
							className="border-l-4 border-l-teal-400 pl-6 py-4 bg-teal-50 rounded-r-lg"
						>
							<div className="space-y-2">
								<p className="font-semibold text-teal-800">
									Challenge on My Testbed:
								</p>
								<p className="text-teal-900 leading-relaxed">
									The paper handles random noise, but my data
									contains structured, behavior-related
									"noise" that challenges traditional
									noise-robust assumptions. For example, what
									one building operator considers an anomaly
									(e.g., weekend usage patterns) might be
									perfectly normal for another building with
									different tenant demographics. This
									systematic disagreement in expert labeling
									represents a fundamental challenge to
									existing noise handling techniques.
								</p>
							</div>
						</blockquote>

						{/* Inspired Future Question */}
						<div id="note-3-future" className="space-y-3">
							<h4 className="text-xl font-semibold text-slate-800">
								Inspired Future Question
							</h4>
							<p className="text-slate-700 leading-relaxed">
								Can we develop context-aware self-training
								algorithms that can distinguish between random
								noise and systematic disagreement in expert
								annotations? How can we leverage this structured
								"noise" as valuable signal about the inherent
								ambiguity and context-dependence of anomaly
								detection in human-centric environments?
							</p>
						</div>
					</CardContent>
				</Card>

				{/* 結論區塊 */}
				<Card
					id="synthesis"
					className="border-2 border-slate-300 shadow-xl"
				>
					<CardHeader className="bg-gradient-to-r from-slate-100 to-slate-50">
						<CardTitle className="text-3xl font-serif text-slate-900">
							Synthesis & Future Directions
						</CardTitle>
					</CardHeader>
					<CardContent className="p-8">
						<div className="text-lg leading-relaxed text-slate-700 space-y-4">
							<p>
								The recurring theme across these analyses is a
								fascinating gap between the static, idealized
								assumptions of many theoretical models and the
								dynamic, messy reality of human-centric data. My
								testbed consistently reveals that factors like
								time-varying priors (π(t)) and compound
								distribution shifts are not edge cases, but the
								norm.
							</p>
							<p>
								This reinforces my conviction that my platform
								is not just a place to apply existing
								algorithms, but a crucible for forging new ones.
								The future questions raised here form the
								bedrock of the research I am determined to
								pursue.
							</p>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Table of Contents - Fixed Right Sidebar */}
			<div className="w-64 shrink-0">
				<div className="sticky top-8">
					<Card className="shadow-lg border-slate-200">
						<CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 pb-3">
							<CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
								<List className="w-5 h-5" />
								Table of Contents
							</CardTitle>
						</CardHeader>
						<CardContent className="p-4">
							<nav className="space-y-1">
								{tocItems.map((item) => (
									<button
										key={item.id}
										type="button"
										onClick={() => scrollToSection(item.id)}
										className={cn(
											"w-full text-left text-sm transition-colors duration-150 py-1.5 px-2 rounded-md",
											item.level === 1
												? "font-medium"
												: "ml-3 text-slate-600 font-normal",
											activeId === item.id
												? item.level === 1
													? "bg-blue-100 text-blue-800 font-semibold"
													: "bg-slate-100 text-slate-800 font-medium"
												: "hover:bg-slate-50 hover:text-slate-800",
										)}
									>
										{item.title}
									</button>
								))}
							</nav>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
