"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { DataResultsPhase } from "../tabs/DataResultsPhase";
import { ImplementationPhase } from "../tabs/ImplementationPhase";
import { ProblemApproachPhase } from "../tabs/ProblemApproachPhase";
import { BottomNavigation } from "./BottomNavigation";
import TabNavigation from "./TabNavigation";
import type { TabKey } from "./TabNavigation";

export default function CaseStudyPageContent() {
	const searchParams = useSearchParams();
	const tabParam = searchParams.get("tab") as TabKey;
	const [activeTab, setActiveTab] = useState<TabKey>(
		tabParam || "problem-approach",
	);
	// Sync activeTab with URL parameters
	useEffect(() => {
		const tab = searchParams.get("tab") as TabKey;
		if (
			tab &&
			["problem-approach", "implementation", "data-results"].includes(tab)
		) {
			setActiveTab(tab);
		}
	}, [searchParams]);

	return (
		<div
			className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100"
			id="top"
		>
			{/* Top Navigation */}
			<TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

			{/* Main Content */}
			<div className="container mx-auto px-4 py-8">
				{activeTab === "problem-approach" && <ProblemApproachPhase />}
				{activeTab === "implementation" && <ImplementationPhase />}
				{activeTab === "data-results" && <DataResultsPhase />}

				<BottomNavigation />
			</div>
		</div>
	);
}
