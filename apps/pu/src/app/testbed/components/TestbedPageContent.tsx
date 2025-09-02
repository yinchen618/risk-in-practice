"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import TabNavigation, { type TabKey } from "./TabNavigation";
import {
	DetailedPhotoGallery,
	ExplorerTab,
	OverviewTab,
	TestbedInfrastructure,
} from "./index";

export default function TestbedPageContent() {
	const searchParams = useSearchParams();
	const tabParam = searchParams.get("tab") as TabKey;
	const [activeTab, setActiveTab] = useState<TabKey>(tabParam || "overview");

	// Sync activeTab with URL parameters and load data when needed
	useEffect(() => {
		const tab = searchParams.get("tab") as TabKey | "live" | null;
		if (tab === "live") {
			setActiveTab("explorer");
			return;
		}
		if (tab && (tab === "overview" || tab === "explorer")) {
			setActiveTab(tab);
		}
	}, [searchParams]);

	const handleTabChange = (tab: TabKey) => {
		setActiveTab(tab);
	};

	return (
		<div
			className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100"
			id="top"
		>
			{/* TabNavigation */}
			<TabNavigation
				activeTab={activeTab}
				onTabChange={handleTabChange}
			/>

			{/* Main Content */}
			<div className="container mx-auto px-6 py-8">
				{/* 1. Page Title */}
				{/* <div className="text-center mb-8">
					<h1 className="text-4xl font-bold text-slate-900 mb-2">
						Smart Residential IoT Testbed
					</h1>
					<h2 className="text-lg text-slate-700 mb-4">
						Real-World Data Foundation for PU Learning
					</h2>
					<p className="text-xl text-slate-600 max-w-4xl mx-auto">
						A 95-unit residential testbed, providing high-resolution
						electricity data. Designed to replicate the challenges
						of weak supervision: unlabeled events dominate, rare
						anomalies form the positive set, and behavior shifts
						over time cause label drift.
					</p>
				</div> */}

				{/* Overview Tab Content */}
				{activeTab === "overview" && (
					<div className="space-y-8">
						{/* Tab-specific heading */}
						<div className="text-center mb-8">
							<h2 className="text-3xl font-semibold text-slate-800 mb-4">
								Overview
							</h2>
						</div>

						{/* 2. Testbed Infrastructure Section - Hero Images */}
						<TestbedInfrastructure />

						{/* 3. Detailed Photo Gallery Section */}
						{/* <DetailedPhotoGallery /> */}

						{/* 4. Key Metrics Section */}
						<OverviewTab />
					</div>
				)}

				{/* Explorer Tab */}
				{activeTab === "explorer" && (
					<div className="space-y-6">
						{/* Tab-specific heading */}
						<div className="text-center mb-8">
							<h2 className="text-3xl font-semibold text-slate-800 mb-4">
								Live Data Explorer
							</h2>
							<p className="text-slate-600 max-w-3xl mx-auto">
								Visualize live and historical power data,
								overlay detected candidate anomalies and
								confirmed events, and link directly to their
								labeling or prediction results.
							</p>
							<div className="mt-4 text-sm text-slate-700">
								<p className="mb-1 font-medium">
									Overlay Legend:
								</p>
								<ul className="list-disc text-left max-w-lg mx-auto pl-6">
									<li>
										Gray diamonds: Stage-1 rule-detected
										candidates
									</li>
									<li>
										Red stars: Stage-2 confirmed anomalies
									</li>
								</ul>
							</div>
						</div>
						<ExplorerTab />
					</div>
				)}
			</div>
		</div>
	);
}
