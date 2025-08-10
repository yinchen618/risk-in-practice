"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { DataResultsPhase } from "../tabs/DataResultsPhase";
import { ImplementationPhase } from "../tabs/ImplementationPhase";
// import { ModelTrainingPhase } from "./ModelTrainingPhase";
import { ProblemApproachPhase } from "../tabs/ProblemApproachPhase";
import { BottomNavigation } from "./BottomNavigation";
import TabNavigation, { type TabKey } from "./TabNavigation";

export default function CaseStudyPageContent() {
	const searchParams = useSearchParams();
	const tabParam = searchParams.get("tab") as TabKey;
	const [activePhase, setActivePhase] = useState<TabKey>(
		tabParam || "problem-approach",
	);

	// Sync activePhase with URL parameters
	useEffect(() => {
		const tab = searchParams.get("tab") as TabKey;
		if (
			tab &&
			["problem-approach", "implementation", "data-results"].includes(tab)
		) {
			setActivePhase(tab);
		}
	}, [searchParams]);

	return (
		<div
			className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100"
			id="top"
		>
			{/* TabNavigation */}
			<TabNavigation
				activeTab={activePhase}
				onTabChange={setActivePhase}
			/>

			{/* Main Content */}
			<div className="container mx-auto px-4 py-8">
				{/* Phase Components */}
				{activePhase === "problem-approach" && <ProblemApproachPhase />}
				{activePhase === "implementation" && <ImplementationPhase />}
				{activePhase === "data-results" && <DataResultsPhase />}

				{/* Bottom Navigation */}
				<BottomNavigation />
			</div>
		</div>
	);
}
