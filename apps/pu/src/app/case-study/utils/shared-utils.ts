import type { FilterParams } from "../types";

/**
 * Utility functions shared across the Data Exploration components
 */

// Date/Time formatting utilities
export function pad2(n: number): string {
	return n < 10 ? `0${n}` : `${n}`;
}

export function formatTaipeiISO(dateObj: Date, hhmm: string): string {
	const y = dateObj.getFullYear();
	const m = pad2(dateObj.getMonth() + 1);
	const d = pad2(dateObj.getDate());
	const time = hhmm && /^\d{2}:\d{2}$/.test(hhmm) ? hhmm : "00:00";
	return `${y}-${m}-${d}T${time}:00+08:00`;
}

export function extractHHMMFromISO(input?: string | null): string {
	if (!input) {
		return "00:00";
	}
	const m = input.match(/T(\d{2}:\d{2})/);
	return m?.[1] ?? "00:00";
}

// Parameter formatting for display
export function formatParamValue(key: keyof FilterParams, value: any): string {
	switch (key) {
		case "startDate":
		case "endDate":
			return (value as Date).toLocaleDateString();
		case "spikePercentage":
		case "peerExceedPercentage":
			return `${value}%`;
		case "minEventDuration":
		case "maxTimeGap":
		case "peerAggWindow":
			return `${value} minutes`;
		case "weekendHolidayDetection":
			return value ? "Enabled" : "Disabled";
		default:
			return String(value);
	}
}

// Parameter labels mapping
export const paramLabels: Record<keyof FilterParams, string> = {
	startDate: "Start Date",
	endDate: "End Date",
	startTime: "Start Time (TW)",
	endTime: "End Time (TW)",
	zScoreThreshold: "Z-Score Threshold",
	spikePercentage: "Spike Threshold",
	minEventDuration: "Min Event Duration",
	weekendHolidayDetection: "Weekend/Holiday Detection",
	maxTimeGap: "Max Time Gap",
	peerAggWindow: "Peer Aggregation Window",
	peerExceedPercentage: "Peer Exceed Threshold",
};

// API utility functions
export async function loadAmmeterMap(): Promise<Record<string, string>> {
	try {
		const res = await fetch("http://localhost:8000/api/ammeters", {
			method: "GET",
			headers: { "Content-Type": "application/json" },
		});
		if (!res.ok) {
			return {};
		}
		const json = await res.json();
		if (json?.success && Array.isArray(json.data)) {
			const map: Record<string, string> = {};
			for (const item of json.data) {
				const info = item?.deviceInfo;
				if (info?.deviceNumber && info?.electricMeterName) {
					map[info.deviceNumber] = info.electricMeterName as string;
				}
			}
			return map;
		}
		return {};
	} catch {
		// ignore mapping errors
		return {};
	}
}

// Experiment run API functions
export async function loadExperimentRuns() {
	const res = await fetch("http://localhost:8000/api/v1/experiment-runs");
	if (res.ok) {
		const json = await res.json();
		return json.data ?? [];
	}
	throw new Error("Failed to load experiment runs");
}

export async function createNewExperimentRun() {
	const now = new Date();
	const name = `Dataset ${now.toISOString().replace("T", " ").slice(0, 16)}`;
	const res = await fetch("http://localhost:8000/api/v1/experiment-runs", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ name }),
	});
	if (res.ok) {
		const json = await res.json();
		return json.data;
	}
	throw new Error("Failed to create dataset");
}

export async function calculateCandidates(filterParams: FilterParams) {
	const response = await fetch(
		"http://localhost:8000/api/v1/candidates/calculate",
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
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
			}),
		},
	);

	if (response.ok) {
		const data = await response.json();
		return {
			candidateCount: data.candidate_count || 0,
			candidateStats: data.stats || data.processing_details || null,
		};
	}
	throw new Error("Failed to calculate candidates");
}
