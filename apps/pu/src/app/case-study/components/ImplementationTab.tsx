"use client";

import { BrainCircuit, Cpu, Database } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import SystemNarrative from "./SystemNarrative.tsx"; // We will use the new English content component

export default function ImplementationTabEnglish() {
	const [activeSection, setActiveSection] = useState("data-challenge");

	// Logic to update active section on scroll (remains the same)
	useEffect(() => {
		const handleScroll = () => {
			const sections = [
				"data-challenge",
				"learning-challenge",
				"architecture-challenge",
			];
			const scrollPosition = window.scrollY + 200; // Offset for better accuracy

			for (const sectionId of sections) {
				const element = document.getElementById(sectionId);
				if (element) {
					const { offsetTop, offsetHeight } = element;
					if (
						scrollPosition >= offsetTop &&
						scrollPosition < offsetTop + offsetHeight
					) {
						setActiveSection(sectionId);
						break;
					}
				}
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Smooth scroll to section
	const scrollToSection = (sectionId: string) => {
		const element = document.getElementById(sectionId);
		if (element) {
			const elementPosition = element.offsetTop;
			const offsetPosition = elementPosition - 100; // Account for sticky header

			window.scrollTo({
				top: offsetPosition,
				behavior: "smooth",
			});
		}
	};

	// New, simplified navigation structure in English
	const navigationItems = [
		{
			id: "data-challenge",
			label: "Act I: The Data Challenge",
			description: "From Raw Signals to Clean Data",
			icon: Database,
		},
		{
			id: "learning-challenge",
			label: "Act II: The Learning Challenge",
			description: "Learning from Imperfect Labels",
			icon: BrainCircuit,
		},
		{
			id: "architecture-challenge",
			label: "Act III: The Architectural Challenge",
			description: "Building a Reproducible System",
			icon: Cpu,
		},
	];

	return (
		<div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
			<div className="flex max-w-screen-xl mx-auto">
				{/* Left Sidebar (1/4) */}
				<aside className="w-1/4 p-6">
					<div className="sticky top-24">
						<div className="mb-8">
							<h1 className="text-2xl font-bold text-slate-800 mb-2">
								System Implementation
							</h1>
							<p className="text-sm text-slate-600">
								An End-to-End Story from Data to Model
							</p>
						</div>
						<nav className="space-y-3">
							{navigationItems.map((item) => (
								<button
									key={item.id}
									type="button"
									onClick={() => scrollToSection(item.id)}
									className={`w-full text-left p-4 rounded-lg transition-all duration-200 flex items-start gap-4 border-l-4 ${
										activeSection === item.id
											? "bg-blue-100 text-blue-800 border-blue-600"
											: "text-slate-600 hover:bg-slate-100 border-transparent"
									}`}
								>
									<item.icon className="h-6 w-6 mt-1 flex-shrink-0" />
									<div>
										<span className="text-sm font-bold block">
											{item.label}
										</span>
										<span className="text-xs text-slate-500">
											{item.description}
										</span>
									</div>
								</button>
							))}
						</nav>
					</div>
				</aside>

				{/* Right Content Area (3/4) */}
				<main className="w-3/4 p-6">
					<SystemNarrative />
				</main>
			</div>
		</div>
	);
}
