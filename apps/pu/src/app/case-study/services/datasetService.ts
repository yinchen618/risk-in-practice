import type { FilterParams } from "../types";

const API_BASE = "http://localhost:8000";

// Utility functions
function pad2(n: number): string {
	return n < 10 ? `0${n}` : `${n}`;
}

function formatTaipeiISO(dateObj: Date, hhmm: string): string {
	const y = dateObj.getFullYear();
	const m = pad2(dateObj.getMonth() + 1);
	const d = pad2(dateObj.getDate());
	const time = hhmm && /^\d{2}:\d{2}$/.test(hhmm) ? hhmm : "00:00";
	return `${y}-${m}-${d}T${time}:00+08:00`;
}

/**
 * 將 snake_case 鍵名轉換為 camelCase
 */
function toCamelCase(str: string): string {
	return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * 遞歸轉換物件的鍵名從 snake_case 到 camelCase
 */
function convertKeysToCamelCase(obj: any): any {
	if (obj === null || obj === undefined) {
		return obj;
	}

	if (Array.isArray(obj)) {
		return obj.map(convertKeysToCamelCase);
	}

	if (typeof obj === "object") {
		const converted: any = {};
		for (const [key, value] of Object.entries(obj)) {
			const camelKey = toCamelCase(key);
			converted[camelKey] = convertKeysToCamelCase(value);
		}
		return converted;
	}

	return obj;
}

/**
 * 格式化過濾參數為 API 格式
 */
function formatFilterParamsForAPI(filterParams: FilterParams) {
	return {
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
		selected_buildings: filterParams.selectedBuildings || [],
		selected_floors: filterParams.selectedFloors || [],
	};
}

/**
 * 載入所有實驗運行清單
 */
export async function loadExperimentRuns(): Promise<
	Array<{ id: string; name: string; status: string }>
> {
	const res = await fetch(`${API_BASE}/api/v1/experiment-runs`);
	if (res.ok) {
		const json = await res.json();
		return json.data ?? [];
	}
	throw new Error("Failed to load experiment runs");
}

/**
 * 建立新的實驗運行
 */
export async function createNewExperimentRun(
	customName?: string,
): Promise<{ id: string; name: string; status: string }> {
	const now = new Date();
	const name =
		customName ||
		`Dataset ${now.toISOString().replace("T", " ").slice(0, 16)}`;
	const res = await fetch(`${API_BASE}/api/v1/experiment-runs`, {
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

/**
 * 刪除實驗運行
 */
export async function deleteExperimentRun(runId: string): Promise<void> {
	const res = await fetch(`${API_BASE}/api/v1/experiment-runs/${runId}`, {
		method: "DELETE",
	});
	if (!res.ok) {
		throw new Error("Failed to delete experiment run");
	}
}

/**
 * 重命名實驗運行
 */
export async function renameExperimentRun(
	runId: string,
	newName: string,
): Promise<void> {
	const res = await fetch(`${API_BASE}/api/v1/experiment-runs/${runId}`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ name: newName }),
	});
	if (!res.ok) {
		throw new Error("Failed to rename experiment run");
	}
}

/**
 * 載入實驗運行的詳細資料
 */
export async function loadRunDetailData(runId: string): Promise<any> {
	const response = await fetch(`${API_BASE}/api/v1/experiment-runs/${runId}`);
	if (!response.ok) {
		throw new Error("Failed to load run detail");
	}
	const data = await response.json();
	return data.data;
}

/**
 * 載入實驗運行的參數
 */
export async function loadParametersFromRun(
	selectedRunId: string,
): Promise<FilterParams> {
	const response = await fetch(
		`${API_BASE}/api/v1/experiment-runs/${selectedRunId}/parameters`,
	);
	if (!response.ok) {
		throw new Error("Failed to load parameters");
	}
	const data = await response.json();
	return data.data;
}

/**
 * 儲存參數到實驗運行
 */
export async function saveParametersToRun(
	selectedRunId: string,
	filterParams: FilterParams,
): Promise<void> {
	const response = await fetch(
		`${API_BASE}/api/v1/experiment-runs/${selectedRunId}/candidates/save-calculation`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(formatFilterParamsForAPI(filterParams)),
		},
	);
	if (!response.ok) {
		throw new Error("Failed to save calculation");
	}
}

/**
 * 標記實驗運行為完成狀態
 */
export async function markRunAsComplete(runId: string): Promise<any> {
	const response = await fetch(
		`${API_BASE}/api/v1/experiment-runs/${runId}/complete`,
		{ method: "POST" },
	);
	if (!response.ok) {
		const msg = await response.text();
		throw new Error(msg || "Failed to mark as COMPLETED");
	}
	return response.json();
}

/**
 * 儲存候選計算結果到實驗運行
 */
export async function saveCandidateCalculationResults(
	selectedRunId: string,
	filterParams: FilterParams,
): Promise<{
	candidateCount: number;
	candidateStats: any;
}> {
	const response = await fetch(
		`${API_BASE}/api/v1/experiment-runs/${selectedRunId}/candidates/save-calculation`,
		{
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				filtering_parameters: formatFilterParamsForAPI(filterParams),
			}),
		},
	);

	if (response.ok) {
		const data = await response.json();
		return {
			candidateCount: data.data?.candidateCount || 0,
			candidateStats: data.data?.candidateStats || null,
		};
	}
	throw new Error("Failed to save candidate calculation results");
}

/**
 * 載入電表對應表 (deviceNumber -> electricMeterName)
 */
export async function loadAmmeterMap(): Promise<Record<string, string>> {
	try {
		const res = await fetch(`${API_BASE}/api/ammeters`, {
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

/**
 * 計算候選事件
 */
export async function calculateCandidates(filterParams: FilterParams): Promise<{
	candidateCount: number;
	candidateStats: any;
}> {
	const response = await fetch(`${API_BASE}/api/v1/candidates/calculate`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(formatFilterParamsForAPI(filterParams)),
	});

	if (!response.ok) {
		throw new Error("Failed to calculate candidates");
	}

	const data = await response.json();
	console.log("data", data);

	// 轉換後端的 snake_case 資料為 camelCase
	const convertedData = convertKeysToCamelCase(data);

	console.log("convertedData", convertedData);

	return {
		candidateCount:
			convertedData?.candidateCount ?? convertedData?.count ?? 0,
		candidateStats: convertedData,
	};
}

/**
 * 為特定實驗運行計算候選事件
 */
export async function calculateCandidatesForRun(
	runId: string,
	filterParams: FilterParams,
): Promise<{
	candidateCount: number;
	candidateStats: any;
}> {
	console.log("=== calculateCandidatesForRun ===");
	console.log("Run ID:", runId);
	console.log("Filter Params:", filterParams);

	// 準備請求體
	const requestBody = {
		filtering_parameters: {
			start_date: filterParams.startDate.toISOString().split("T")[0],
			end_date: filterParams.endDate.toISOString().split("T")[0],
			start_time: filterParams.startTime,
			end_time: filterParams.endTime,
			z_score_threshold: filterParams.zScoreThreshold,
			spike_percentage: filterParams.spikePercentage,
			min_event_duration_minutes: filterParams.minEventDuration,
			detect_holiday_pattern: filterParams.weekendHolidayDetection,
			max_time_gap_minutes: filterParams.maxTimeGap,
			peer_agg_window_minutes: filterParams.peerAggWindow,
			peer_exceed_percentage: filterParams.peerExceedPercentage,
			selected_floors_by_building:
				filterParams.selectedFloorsByBuilding || {},
		},
	};

	// console.log("Request body:", JSON.stringify(requestBody, null, 2));

	const response = await fetch(
		`${API_BASE}/api/v1/experiment-runs/${runId}/candidates/calculate`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(requestBody),
		},
	);

	if (!response.ok) {
		const errorText = await response.text();
		console.error("API Error:", errorText);
		throw new Error(`Failed to calculate candidates: ${errorText}`);
	}

	const data = await response.json();
	// console.log("API Response:", data);

	if (!data.success) {
		throw new Error(data.message || "API returned unsuccessful result");
	}

	// 從我們的新API結構中提取數據
	const candidateStats = data.data;

	return {
		candidateCount:
			candidateStats.totalCandidates ||
			candidateStats.overlapAdjustedTotal ||
			0,
		candidateStats: {
			stats: candidateStats,
		},
	};
}

// =============================================================================
// 模型訓練相關 API (Stage3)
// =============================================================================

/**
 * 開始模型訓練和預測任務
 */
export async function startTrainAndPredict(payload: {
	experiment_run_id: string;
	model_params: {
		model_type: string;
		prior_method: string;
		class_prior: number | null;
		hidden_units: number;
		activation: string;
		lambda_reg: number;
		optimizer: string;
		learning_rate: number;
		epochs: number;
		batch_size: number;
		seed: number;
		feature_version: string;
	};
	prediction_start_date: string;
	prediction_end_date: string;
}): Promise<any> {
	const resp = await fetch(`${API_BASE}/api/v1/models/train-and-predict`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	});
	if (!resp.ok) {
		const errText = await resp.text();
		throw new Error(`Training failed: ${errText}`);
	}
	return resp.json();
}

/**
 * 輪詢訓練任務狀態
 */
export async function pollJobStatus(jid: string): Promise<{
	status: string;
	progress: number;
	model_id?: string;
	result?: any;
	error?: string;
}> {
	const r = await fetch(`${API_BASE}/api/v1/models/jobs/${jid}`, {
		cache: "no-store",
	});
	if (!r.ok) {
		throw new Error(`Status ${r.status}`);
	}
	return r.json();
}

/**
 * 獲取模型結果
 */
export async function fetchModelResults(mid: string): Promise<{
	meta: any;
	metrics: any;
}> {
	const r = await fetch(`${API_BASE}/api/v1/models/${mid}/results`, {
		cache: "no-store",
	});
	if (!r.ok) {
		throw new Error(`Failed to fetch model results: ${r.status}`);
	}
	return r.json();
}
