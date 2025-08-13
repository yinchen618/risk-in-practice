// 異常事件類型定義
export interface AnomalyEvent {
	id: string;
	eventId: string;
	meterId: string;
	eventTimestamp: string;
	detectionRule: string;
	score: number;
	dataWindow?: {
		timestamps: string[];
		values: number[];
	};
	status: "UNREVIEWED" | "CONFIRMED_POSITIVE" | "REJECTED_NORMAL";
	reviewerId?: string;
	reviewTimestamp?: string;
	justificationNotes?: string;
	createdAt: string;
	updatedAt: string;
}

// 異常事件統計
export interface AnomalyEventStats {
	total: number;
	unreviewed: number;
	confirmed: number;
	rejected: number;
	avgScore?: number;
	maxScore?: number;
	uniqueMeters?: number;
}

// API 回應類型
export interface AnomalyEventsResponse {
	events: AnomalyEvent[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

// 審核資料類型
export interface ReviewEventData {
	status: "CONFIRMED_POSITIVE" | "REJECTED_NORMAL";
	reviewerId: string;
	justificationNotes?: string;
	labelIds?: string[];
}

// 篩選器類型
export interface EventFilters {
	status?: string;
	meterId?: string;
	search?: string;
	dateFrom?: string;
	dateTo?: string;
	page?: number;
	limit?: number;
}

// 資料探索階段篩選參數
export interface FilterParams {
	// Top-level filter
	startDate: Date;
	endDate: Date;
	// Time (Taiwan timezone, default 00:00)
	startTime: string; // HH:MM
	endTime: string; // HH:MM

	// Value-based rules
	zScoreThreshold: number;
	spikePercentage: number;

	// Time-based rules
	minEventDuration: number;
	weekendHolidayDetection: boolean;

	// Data integrity rules
	maxTimeGap: number;

	// Peer comparison rules
	peerAggWindow: number;
	peerExceedPercentage: number;

	// Floor filter
	selectedBuildings: string[]; // ["15學舍", "85學舍"]
	selectedFloors: string[]; // ["1", "2", "3", "5", "6"]
	selectedFloorsByBuilding?: Record<string, string[]>; // {"15學舍": ["1", "2"], "85學舍": ["3", "5"]}
}

// 樓層過濾參數
export interface FloorParams {
	selectedBuildings: string[];
	selectedFloors: string[];
	selectedFloorsByBuilding?: Record<string, string[]>;
}

export interface ExperimentRun {
	id: string;
	name: string;
	status: string;
}

export interface ExperimentData {
	selectedRunId: string | null;
	setSelectedRunId: (id: string | null) => void;
	experimentRuns: ExperimentRun[];
	isLoadingRuns: boolean;
	isLoadingDetail: boolean;
	isCalculating: boolean;
	isGenerating: boolean;
	isCreatingRun: boolean;
	candidateCount: number;
	labeledPositive: number;
	labeledNormal: number;
	candidateStats: any | null;
	filterParams: FilterParams;
	savedParams: FilterParams | null;
	lastCalculatedParams: FilterParams | null;
	runDetail: any | null;

	// Stage 1 特定功能
	loadExperimentRuns: () => Promise<void>;
	addExperimentRun: (run: ExperimentRun) => void;
	updateExperimentRunStatus: (runId: string, status: string) => void;
	removeExperimentRun: (runId: string) => void;
	setLabeledPositive: (count: number) => void;
	setLabeledNormal: (count: number) => void;
	updateFilterParam: (key: keyof FilterParams, value: any) => void;
	handleCalculateCandidates: () => Promise<void>;
	handleSaveParameters: () => Promise<void>;
	loadRunDetail: (runId: string | null) => Promise<void>;
	createNewRun: (name?: string) => Promise<ExperimentRun>;

	// Stage 2 特定功能
	isCompleting: boolean;
	handleMarkCompleted: (
		selectedRunId: string | null,
		candidateCount: number,
		labeledPositive: number,
		labeledNormal: number,
	) => Promise<void>;
}
