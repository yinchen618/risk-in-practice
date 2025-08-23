"use client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { DataResultsPhase } from "../tabs/DataResultsPhase";
import { ImplementationPhase } from "../tabs/ImplementationPhase";
import { ProblemApproachPhase } from "../tabs/ProblemApproachPhase";
import { ResearchNotes } from "../tabs/ResearchNotes";
import { BottomNavigation } from "./BottomNavigation";
import TabNavigation from "./TabNavigation";
import type { TabKey } from "./TabNavigation";

export default function CaseStudyPageContent() {
	const searchParams = useSearchParams();
	const [activeTab, setActiveTab] = useState<TabKey>(
		() => (searchParams.get("tab") as TabKey) || "problem-approach",
	);

	const isDevelopment = process.env.NODE_ENV === "development";

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
					<div className="space-y-6">
						<DataResultsPhase
							stageParam={searchParams.get("stage")}
							runParam={searchParams.get("run")}
						/>
						{/* 開發模式下顯示日誌檢視器 */}
						{/* {isDevelopment && (
							<div className="mt-8">
								<LogViewer />
							</div>
						)} */}
					</div>
				)}
				{activeTab === "research-notes" && <ResearchNotes />}

				<BottomNavigation />
			</div>
		</div>
	);
}
