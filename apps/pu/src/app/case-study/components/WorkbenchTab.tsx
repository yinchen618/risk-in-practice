"use client";

import { useEffect } from "react";

export default function WorkbenchTab() {
	useEffect(() => {
		// Redirect to the existing case-study-v2 page
		window.location.href = "/case-study-v2";
	}, []);

	return (
		<div className="flex items-center justify-center min-h-[400px]">
			<div className="text-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
				<p className="text-slate-600">
					Redirecting to Data Workbench...
				</p>
			</div>
		</div>
	);
}
