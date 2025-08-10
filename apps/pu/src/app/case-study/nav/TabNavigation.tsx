"use client";

import { FlaskConical, Target, TrendingUp } from "lucide-react";
import Link from "next/link";
import React from "react";

export type TabKey = "problem-approach" | "implementation" | "data-results";

interface TabNavigationProps {
	activeTab: TabKey;
	onTabChange: (tab: TabKey) => void;
}

const tabs: {
	key: TabKey;
	label: string;
	icon: React.ComponentType<any>;
	href: string;
}[] = [
	{
		key: "problem-approach",
		label: "Problem & Approach",
		icon: Target,
		href: "/case-study?tab=problem-approach#top",
	},
	{
		key: "implementation",
		label: "Implementation",
		icon: FlaskConical,
		href: "/case-study?tab=implementation#top",
	},
	{
		key: "data-results",
		label: "Data & Results",
		icon: TrendingUp,
		href: "/case-study?tab=data-results#top",
	},
];

export default function TabNavigation({
	activeTab,
	onTabChange,
}: TabNavigationProps) {
	return (
		<nav className="sticky top-0 z-50 bg-white shadow-sm border-b">
			<div className="container mx-auto px-4 py-4">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-xl font-bold text-slate-800">
							Case Study: Weakly-Supervised Anomaly Detection
						</h1>
					</div>
					<div className="flex space-x-6">
						{tabs.map((tab) => {
							const Icon = tab.icon;
							const isActive = activeTab === tab.key;
							return (
								<Link
									key={tab.key}
									href={tab.href}
									prefetch={false}
									onClick={() => onTabChange(tab.key)}
									className={`px-3 py-2 text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer ${
										isActive
											? "text-blue-600 border-b-2 border-blue-600"
											: "text-slate-600 hover:text-slate-800"
									}`}
								>
									<Icon className="h-4 w-4" />
									{tab.label}
								</Link>
							);
						})}
					</div>
				</div>
			</div>
		</nav>
	);
}
