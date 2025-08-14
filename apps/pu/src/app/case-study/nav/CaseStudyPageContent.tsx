"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { DataResultsPhase } from "../tabs/DataResultsPhase";
import { ImplementationPhase } from "../tabs/ImplementationPhase";
import { ProblemApproachPhase } from "../tabs/ProblemApproachPhase";
import { BottomNavigation } from "./BottomNavigation";
import TabNavigation from "./TabNavigation";
import type { TabKey } from "./TabNavigation";

export default function CaseStudyPageContent() {
	const searchParams = useSearchParams();
	const [activeTab, setActiveTab] = useState<TabKey>(
		() => (searchParams.get("tab") as TabKey) || "problem-approach",
	);

	const handleTabChange = (tab: TabKey) => {
		setActiveTab(tab);
	};

	return (
		<div className="min-h-screen bg-blue-50/40" id="top">
			{/* Top Navigation */}
			<TabNavigation
				activeTab={activeTab}
				onTabChange={handleTabChange}
			/>

			{/* Main Content */}
			<div className="container mx-auto px-4 py-8">
				{activeTab === "problem-approach" && <ProblemApproachPhase />}
				{activeTab === "implementation" && <ImplementationPhase />}
				{activeTab === "data-results" && (
					<DataResultsPhase
						stageParam={searchParams.get("stage")}
						runParam={searchParams.get("run")}
					/>
				)}

				<BottomNavigation />
			</div>
		</div>
	);
}
