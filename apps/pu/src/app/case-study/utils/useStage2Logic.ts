import { useCallback, useState } from "react";

export function useStage2Logic() {
	const [isCompleting, setIsCompleting] = useState(false);

	const handleMarkCompleted = useCallback(
		async (
			selectedRunId: string | null,
			candidateCount: number,
			labeledPositive: number,
			labeledNormal: number,
			setExperimentRuns: React.Dispatch<
				React.SetStateAction<
					{ id: string; name: string; status: string }[]
				>
			>,
		) => {
			if (!selectedRunId) {
				return;
			}
			// 僅在所有候選已標記時允許
			if (
				candidateCount === 0 ||
				labeledPositive + labeledNormal < candidateCount
			) {
				return;
			}
			setIsCompleting(true);
			try {
				const res = await fetch(
					`http://localhost:8000/api/v1/experiment-runs/${selectedRunId}/complete`,
					{ method: "POST" },
				);
				if (!res.ok) {
					const msg = await res.text();
					alert(msg || "Failed to mark as COMPLETED");
					return;
				}
				// refresh runs list to reflect status
				const list = await fetch(
					"http://localhost:8000/api/v1/experiment-runs",
				);
				if (list.ok) {
					const json = await list.json();
					setExperimentRuns(json.data ?? []);
				}
				alert("Dataset marked as COMPLETED");
			} catch (e) {
				console.error("Failed to complete dataset", e);
				alert("An error occurred while marking dataset as COMPLETED");
			} finally {
				setIsCompleting(false);
			}
		},
		[],
	);

	return {
		isCompleting,
		handleMarkCompleted,
	};
}
