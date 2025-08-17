"use client";

import { BookOpenText, FlaskConical, Target, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export type TabKey =
	| "problem-approach"
	| "implementation"
	| "data-results"
	| "research-notes";

interface TabNavigationProps {
	activeTab: TabKey;
	onTabChange: (tab: TabKey) => void;
}

const tabs: {
	key: TabKey;
	label: string;
	icon: React.ComponentType<any>;
}[] = [
	{
		key: "problem-approach",
		label: "Problem & Approach",
		icon: Target,
	},
	{
		key: "implementation",
		label: "Implementation",
		icon: FlaskConical,
	},
	{
		key: "data-results",
		label: "Data & Results",
		icon: TrendingUp,
	},
	{
		key: "research-notes",
		label: "Research Notes",
		icon: BookOpenText,
	},
];

export default function TabNavigation({
	activeTab,
	onTabChange,
}: TabNavigationProps) {
	const router = useRouter();

	const handleTabClick = (tab: TabKey) => {
		// 同時立即更新URL，不等待任何資料載入
		router.push(`/case-study?tab=${tab}`);
		// 立即更新本地狀態，讓UI即時響應
		onTabChange(tab);
	};

	return (
		<nav className="sticky top-0 z-50 bg-white shadow-sm border-b">
			<div className="container mx-auto px-4 py-4">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-xl font-bold text-slate-900">
							Case Study: Weakly-Supervised Anomaly Detection
						</h1>
					</div>
					<div className="flex space-x-6">
						{tabs.map((tab) => {
							const Icon = tab.icon;
							const isActive = activeTab === tab.key;
							return (
								<button
									key={tab.key}
									type="button"
									onClick={() => handleTabClick(tab.key)}
									className={`h-10 flex items-center px-3 text-sm transition-colors gap-2 cursor-pointer border-b-2 ${
										isActive
											? "text-blue-600 font-semibold border-blue-600"
											: "text-neutral-600 border-transparent hover:text-blue-500 hover:border-blue-300"
									}`}
								>
									<Icon className="h-4 w-4" />
									{tab.label}
								</button>
							);
						})}
					</div>
				</div>
			</div>
		</nav>
	);
}
