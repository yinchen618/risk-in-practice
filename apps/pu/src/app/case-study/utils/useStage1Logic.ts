import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { FilterParams } from "../types";
import {
	calculateCandidates,
	createNewExperimentRun,
	extractHHMMFromISO,
	formatTaipeiISO,
	loadExperimentRuns,
} from "./shared-utils";

export function useStage1Logic() {
	// State management
	const [candidateCount, setCandidateCount] = useState(0);
	const [candidateStats, setCandidateStats] = useState<any | null>(null);
	const [lastCalculatedParams, setLastCalculatedParams] =
		useState<FilterParams | null>(null);
	const [isCalculating, setIsCalculating] = useState(false);
	const [isGenerating, setIsGenerating] = useState(false);
	const [isLoadingRuns, setIsLoadingRuns] = useState(false);
	const [isCreatingRun, setIsCreatingRun] = useState(false);
	const [experimentRuns, setExperimentRuns] = useState<
		{ id: string; name: string; status: string }[]
	>([]);
	const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
	const [labeledPositive, setLabeledPositive] = useState(0);
	const [labeledNormal, setLabeledNormal] = useState(0);
	const [savedParams, setSavedParams] = useState<FilterParams | null>(null);

	// Filter parameters state
	const [filterParams, setFilterParams] = useState<FilterParams>({
		// Default date range: last 3 days for better performance with real data
		startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
		endDate: new Date(),
		startTime: "00:00",
		endTime: "00:00",

		// Value-based rules
		zScoreThreshold: 3.0,
		spikePercentage: 200,

		// Time-based rules
		minEventDuration: 30,
		weekendHolidayDetection: true,

		// Data integrity rules
		maxTimeGap: 60,

		// Peer comparison rules
		peerAggWindow: 5,
		peerExceedPercentage: 150,
	});

	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	// Initialize and load experiment runs
	useEffect(() => {
		async function initialize() {
			setIsLoadingRuns(true);
			try {
				const runs = await loadExperimentRuns();
				setExperimentRuns(runs);
				// deep-link: preselect run
				const runFromUrl = searchParams.get("run");
				if (runFromUrl && runs.some((r: any) => r.id === runFromUrl)) {
					setSelectedRunId(runFromUrl);
				}
			} catch (e) {
				console.error("Failed to load experiment runs", e);
			} finally {
				setIsLoadingRuns(false);
			}
		}
		initialize();
	}, [searchParams]);

	// Sync run param to URL when changed
	useEffect(() => {
		const current = new URLSearchParams(searchParams.toString());
		if (selectedRunId) {
			current.set("run", selectedRunId);
		} else {
			current.delete("run");
		}
		const next = `${pathname}?${current.toString()}`;
		router.replace(next, { scroll: false });
	}, [selectedRunId, pathname, router, searchParams]);

	// Backfill params upon run selection
	useEffect(() => {
		if (!selectedRunId) {
			return;
		}
		async function loadRunData() {
			try {
				const res = await fetch(
					`http://localhost:8000/api/v1/experiment-runs/${selectedRunId}`,
				);
				if (!res.ok) {
					return;
				}
				const json = await res.json();
				const params = json?.data?.filteringParameters as Record<
					string,
					any
				> | null;
				// update live labeled counts
				const pos = json?.data?.positiveLabelCount ?? 0;
				const neg = json?.data?.negativeLabelCount ?? 0;
				setLabeledPositive(pos);
				setLabeledNormal(neg);
				// 更新當前資料集的候選數量（若後端有提供）
				if (typeof json?.data?.candidateCount === "number") {
					setCandidateCount(json.data.candidateCount);
				}
				if (params) {
					const parsed: FilterParams = {
						startDate: new Date(params.start_date),
						endDate: new Date(params.end_date),
						startTime: extractHHMMFromISO(params.start_datetime),
						endTime: extractHHMMFromISO(params.end_datetime),
						zScoreThreshold: params.z_score_threshold ?? 3.0,
						spikePercentage: params.spike_percentage ?? 200,
						minEventDuration:
							params.min_event_duration_minutes ?? 30,
						weekendHolidayDetection:
							params.detect_holiday_pattern ?? true,
						maxTimeGap: params.max_time_gap_minutes ?? 60,
						peerAggWindow: params.peer_agg_window_minutes ?? 5,
						peerExceedPercentage:
							params.peer_exceed_percentage ?? 150,
					};
					setFilterParams(parsed);
					setSavedParams(parsed);
				}
			} catch (e) {
				console.error("Failed to load experiment run parameters", e);
			}
		}
		loadRunData();
	}, [selectedRunId]);

	// Handler functions
	const updateFilterParam = <K extends keyof FilterParams>(
		key: K,
		value: FilterParams[K],
	) => {
		setFilterParams((prev) => ({
			...prev,
			[key]: value,
		}));
	};

	const handleCalculateCandidates = useCallback(async () => {
		if (isCalculating) {
			return;
		}

		setIsCalculating(true);
		try {
			const result = await calculateCandidates(filterParams);
			setCandidateCount(result.candidateCount);
			setCandidateStats(result.candidateStats);
			setLastCalculatedParams({ ...filterParams });
		} catch (error) {
			console.error("Error calculating candidates:", error);
			setCandidateCount(0);
			setCandidateStats(null);
			setLastCalculatedParams(null);
		} finally {
			setIsCalculating(false);
		}
	}, [filterParams, isCalculating]);

	const handleCreateRun = useCallback(async () => {
		setIsCreatingRun(true);
		try {
			const run = await createNewExperimentRun();
			setExperimentRuns((prev) => [run, ...prev]);
			setSelectedRunId(run.id);
			// When creating a new run, treat current form as saved baseline
			setSavedParams(filterParams);
		} catch (e) {
			console.error("Failed to create dataset", e);
			alert("An error occurred while creating dataset");
		} finally {
			setIsCreatingRun(false);
		}
	}, [filterParams]);

	const handleSaveParameters = useCallback(async () => {
		if (!selectedRunId) {
			alert("Please select or create a dataset first");
			return;
		}
		const payload = {
			filtering_parameters: {
				start_date: filterParams.startDate.toISOString().split("T")[0],
				end_date: filterParams.endDate.toISOString().split("T")[0],
				start_datetime: formatTaipeiISO(
					filterParams.startDate,
					filterParams.startTime,
				),
				end_datetime: formatTaipeiISO(
					filterParams.endDate,
					filterParams.endTime,
				),
				z_score_threshold: filterParams.zScoreThreshold,
				spike_percentage: filterParams.spikePercentage,
				min_event_duration_minutes: filterParams.minEventDuration,
				detect_holiday_pattern: filterParams.weekendHolidayDetection,
				max_time_gap_minutes: filterParams.maxTimeGap,
				peer_agg_window_minutes: filterParams.peerAggWindow,
				peer_exceed_percentage: filterParams.peerExceedPercentage,
			},
		};
		try {
			const res = await fetch(
				`http://localhost:8000/api/v1/experiment-runs/${selectedRunId}/parameters`,
				{
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
				},
			);
			if (!res.ok) {
				alert("Failed to save parameters");
				return;
			}
			const json = await res.json();
			// 回填標記數
			setLabeledPositive(json?.data?.positiveLabelCount ?? 0);
			setLabeledNormal(json?.data?.negativeLabelCount ?? 0);
			// 將目前表單作為已儲存基準，清空 Pending Changes
			setSavedParams(filterParams);
		} catch (e) {
			console.error("Failed to save parameters", e);
			alert("An error occurred while saving parameters");
		}
	}, [selectedRunId, filterParams]);

	const handleRenameRun = useCallback(async () => {
		if (!selectedRunId) {
			return;
		}
		const newName = prompt("Rename dataset", "");
		if (!newName) {
			return;
		}
		try {
			const res = await fetch(
				`http://localhost:8000/api/v1/experiment-runs/${selectedRunId}`,
				{
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ name: newName }),
				},
			);
			if (!res.ok) {
				alert("Failed to rename dataset");
				return;
			}
			const json = await res.json();
			const updated = json.data;
			setExperimentRuns((prev) =>
				prev.map((r) =>
					r.id === updated.id ? { ...r, name: updated.name } : r,
				),
			);
		} catch (e) {
			console.error("Failed to rename dataset", e);
			alert("An error occurred while renaming dataset");
		}
	}, [selectedRunId]);

	const handleDeleteRun = useCallback(async () => {
		if (!selectedRunId) {
			return;
		}
		const ok = confirm("Delete this dataset? This cannot be undone.");
		if (!ok) {
			return;
		}
		try {
			const res = await fetch(
				`http://localhost:8000/api/v1/experiment-runs/${selectedRunId}`,
				{
					method: "DELETE",
				},
			);
			if (!res.ok) {
				alert("Failed to delete dataset");
				return;
			}
			setExperimentRuns((prev) =>
				prev.filter((r) => r.id !== selectedRunId),
			);
			setSelectedRunId(null);
			setSavedParams(null);
			setCandidateCount(0);
			setLabeledPositive(0);
			setLabeledNormal(0);
		} catch (e) {
			console.error("Failed to delete dataset", e);
			alert("An error occurred while deleting dataset");
		}
	}, [selectedRunId]);

	const handleGenerateCandidates = useCallback(async () => {
		if (isGenerating || candidateCount === 0) {
			return;
		}
		if (!selectedRunId) {
			alert("Please select or create a dataset first");
			return;
		}

		setIsGenerating(true);
		try {
			const payload = {
				filtering_parameters: {
					start_date: filterParams.startDate
						.toISOString()
						.split("T")[0],
					end_date: filterParams.endDate.toISOString().split("T")[0],
					start_datetime: formatTaipeiISO(
						filterParams.startDate,
						filterParams.startTime,
					),
					end_datetime: formatTaipeiISO(
						filterParams.endDate,
						filterParams.endTime,
					),
					z_score_threshold: filterParams.zScoreThreshold,
					spike_percentage: filterParams.spikePercentage,
					min_event_duration_minutes: filterParams.minEventDuration,
					detect_holiday_pattern:
						filterParams.weekendHolidayDetection,
					max_time_gap_minutes: filterParams.maxTimeGap,
					peer_agg_window_minutes: filterParams.peerAggWindow,
					peer_exceed_percentage: filterParams.peerExceedPercentage,
				},
			};

			const response = await fetch(
				`http://localhost:8000/api/v1/experiment-runs/${selectedRunId}/candidates/generate?allow_overwrite=true`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(payload),
				},
			);

			if (response.ok) {
				// Poll for completion
				let finished = false;
				while (!finished) {
					await new Promise((resolve) => setTimeout(resolve, 1000));
					const statusRes = await fetch(
						`http://localhost:8000/api/v1/experiment-runs/${selectedRunId}`,
					);
					if (statusRes.ok) {
						const statusJson = await statusRes.json();
						if (statusJson?.data?.status === "READY") {
							finished = true;
						}
					}
				}
				alert("Candidate events generated successfully!");
			} else {
				const errorText = await response.text();
				console.error("Failed to generate candidates:", errorText);
				alert("Failed to generate candidate events. Please try again.");
			}
		} catch (error) {
			console.error("Error generating candidate events:", error);
			alert(
				"An error occurred while generating candidate events. Please try again.",
			);
		} finally {
			setIsGenerating(false);
		}
	}, [filterParams, candidateCount, isGenerating, selectedRunId]);

	return {
		// State
		candidateCount,
		candidateStats,
		lastCalculatedParams,
		isCalculating,
		isGenerating,
		isLoadingRuns,
		isCreatingRun,
		experimentRuns,
		selectedRunId,
		labeledPositive,
		labeledNormal,
		savedParams,
		filterParams,

		// Handlers
		setSelectedRunId,
		setLabeledPositive,
		setLabeledNormal,
		setExperimentRuns,
		updateFilterParam,
		handleCalculateCandidates,
		handleCreateRun,
		handleSaveParameters,
		handleRenameRun,
		handleDeleteRun,
		handleGenerateCandidates,
	};
}
