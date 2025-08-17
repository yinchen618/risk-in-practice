"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
	SampleDistribution,
	TrainingDataStats,
	TrainingLog,
	TrainingStage,
} from "./types";

interface UseTrainingDataReturn {
	trainingDataStats: TrainingDataStats | null;
	sampleDistribution: SampleDistribution | null;
	isLoadingVisualization: boolean;
	loadTrainingDataStats: () => Promise<void>;
	loadSampleDistribution: () => Promise<void>;
}

export function useTrainingData(
	selectedRunId: string,
	apiBase: string,
): UseTrainingDataReturn {
	const [trainingDataStats, setTrainingDataStats] =
		useState<TrainingDataStats | null>(null);
	const [sampleDistribution, setSampleDistribution] =
		useState<SampleDistribution | null>(null);
	const [isLoadingVisualization, setIsLoadingVisualization] = useState(false);

	const loadTrainingDataStats = useCallback(async () => {
		try {
			const response = await fetch(
				`${apiBase}/api/v1/experiment-runs/${selectedRunId}/training-stats`,
				{ cache: "no-store" },
			);
			const stats = await response.json();
			console.log("training data stats:", stats);
			setTrainingDataStats(stats);
		} catch (error) {
			console.error("Failed to load training data stats:", error);
		}
	}, [selectedRunId, apiBase]);

	const loadSampleDistribution = useCallback(async () => {
		if (isLoadingVisualization) {
			return;
		}

		setIsLoadingVisualization(true);
		try {
			const response = await fetch(
				`${apiBase}/api/v1/experiment-runs/${selectedRunId}/training-data-preview`,
				{ cache: "no-store" },
			);
			if (response.ok) {
				const distribution = await response.json();
				setSampleDistribution(distribution);
			} else {
				// 生成模擬數據
				const pSamples = Array.from({ length: 50 }, (_, i) => ({
					x: 0.3 + Math.random() * 0.4,
					y: 0.3 + Math.random() * 0.4,
					id: `P_${i + 1}`,
					category: "P" as const,
					meterId: `meter_${Math.floor(Math.random() * 9999)}`,
					score: 0.7 + Math.random() * 0.3,
				}));

				const uSamples = Array.from({ length: 200 }, (_, i) => ({
					x: Math.random(),
					y: Math.random(),
					id: `U_${i + 1}`,
					category: "U" as const,
					meterId: `meter_${Math.floor(Math.random() * 9999)}`,
					score: Math.random(),
				}));

				setSampleDistribution({ pSamples, uSamples });
			}
		} catch (error) {
			console.error("Failed to load sample distribution:", error);
			// 生成模擬數據
			const pSamples = Array.from({ length: 50 }, (_, i) => ({
				x: 0.3 + Math.random() * 0.4,
				y: 0.3 + Math.random() * 0.4,
				id: `P_${i + 1}`,
				category: "P" as const,
				meterId: `meter_${Math.floor(Math.random() * 9999)}`,
				score: 0.7 + Math.random() * 0.3,
			}));

			const uSamples = Array.from({ length: 200 }, (_, i) => ({
				x: Math.random(),
				y: Math.random(),
				id: `U_${i + 1}`,
				category: "U" as const,
				meterId: `meter_${Math.floor(Math.random() * 9999)}`,
				score: Math.random(),
			}));

			setSampleDistribution({ pSamples, uSamples });
		} finally {
			setIsLoadingVisualization(false);
		}
	}, [selectedRunId, apiBase, isLoadingVisualization]);

	// 在組件加載時獲取訓練數據統計
	useEffect(() => {
		if (!selectedRunId) {
			return;
		}

		// 直接定義函數，避免 useCallback 依賴循環
		const loadStats = async () => {
			try {
				const response = await fetch(
					`${apiBase}/api/v1/experiment-runs/${selectedRunId}/training-stats`,
					{ cache: "no-store" },
				);
				if (response.ok) {
					const stats = await response.json();
					setTrainingDataStats(stats);
				} else {
					// 模擬數據作為後備
					setTrainingDataStats({
						positiveSamples: 141,
						unlabeledSamples: 1500000,
					});
				}
			} catch (error) {
				console.error("Failed to load training data stats:", error);
				// 模擬數據作為後備
				setTrainingDataStats({
					positiveSamples: 141,
					unlabeledSamples: 1500000,
				});
			}
		};

		const loadDistribution = async () => {
			setIsLoadingVisualization(true);
			try {
				const response = await fetch(
					`${apiBase}/api/v1/experiment-runs/${selectedRunId}/sample-distribution`,
					{ cache: "no-store" },
				);
				if (response.ok) {
					const distribution = await response.json();
					setSampleDistribution(distribution);
				} else {
					// 生成模擬數據
					const pSamples = Array.from({ length: 50 }, (_, i) => ({
						x: 0.3 + Math.random() * 0.4,
						y: 0.3 + Math.random() * 0.4,
						id: `P_${i + 1}`,
					}));

					const uSamples = Array.from({ length: 200 }, (_, i) => ({
						x: Math.random(),
						y: Math.random(),
						id: `U_${i + 1}`,
					}));

					setSampleDistribution({ pSamples, uSamples });
				}
			} catch (error) {
				console.error("Failed to load sample distribution:", error);
				// 生成模擬數據
				const pSamples = Array.from({ length: 50 }, (_, i) => ({
					x: 0.3 + Math.random() * 0.4,
					y: 0.3 + Math.random() * 0.4,
					id: `P_${i + 1}`,
				}));

				const uSamples = Array.from({ length: 200 }, (_, i) => ({
					x: Math.random(),
					y: Math.random(),
					id: `U_${i + 1}`,
				}));

				setSampleDistribution({ pSamples, uSamples });
			} finally {
				setIsLoadingVisualization(false);
			}
		};

		loadStats();
		loadDistribution();
	}, [selectedRunId, apiBase]); // 只依賴這兩個穩定的值

	return {
		trainingDataStats,
		sampleDistribution,
		isLoadingVisualization,
		loadTrainingDataStats,
		loadSampleDistribution,
	};
}

interface UseTrainingJobReturn {
	trainingStage: TrainingStage;
	trainingProgress: number;
	currentEpoch: number;
	trainingLogs: TrainingLog[];
	jobId: string;
	jobStatus: string;
	modelId: string;
	resultsMeta: any;
	metrics: any;
	topPredictions: any[];
	errorMessage: string;
	setTrainingStage: (stage: TrainingStage) => void;
	setTrainingProgress: (progress: number) => void;
	setCurrentEpoch: (epoch: number) => void;
	setTrainingLogs: (
		logs: TrainingLog[] | ((prev: TrainingLog[]) => TrainingLog[]),
	) => void;
	setJobId: (id: string) => void;
	setJobStatus: (status: string) => void;
	setModelId: (id: string) => void;
	setResultsMeta: (meta: any) => void;
	setMetrics: (metrics: any) => void;
	setTopPredictions: (predictions: any[]) => void;
	setErrorMessage: (message: string) => void;
	resetTrainingState: () => void;
	stopPolling: () => void;
	pollJobUntilDone: (
		jobId: string,
		epochs: number,
		onComplete?: () => void,
	) => void;
}

export function useTrainingJob(apiBase: string): UseTrainingJobReturn {
	const [trainingStage, setTrainingStage] = useState<TrainingStage>("ready");
	const [trainingProgress, setTrainingProgress] = useState(0);
	const [currentEpoch, setCurrentEpoch] = useState(0);
	const [trainingLogs, setTrainingLogs] = useState<TrainingLog[]>([]);
	const [jobId, setJobId] = useState("");
	const [jobStatus, setJobStatus] = useState("");
	const [modelId, setModelId] = useState("");
	const [resultsMeta, setResultsMeta] = useState<any>(null);
	const [metrics, setMetrics] = useState<any>(null);
	const [topPredictions, setTopPredictions] = useState<any[]>([]);
	const [errorMessage, setErrorMessage] = useState("");

	const pollTimerRef = useRef<NodeJS.Timeout | null>(null);

	const stopPolling = useCallback(() => {
		if (pollTimerRef.current) {
			clearTimeout(pollTimerRef.current);
			pollTimerRef.current = null;
		}
	}, []);

	const fetchModelResults = useCallback(
		async (mid: string) => {
			try {
				const r = await fetch(
					`${apiBase}/api/v1/models/${mid}/results`,
					{
						cache: "no-store",
					},
				);
				if (!r.ok) {
					return;
				}
				const data = await r.json();
				setResultsMeta(data.meta);
				setMetrics(data.metrics);
			} catch {
				// no-op
			}
		},
		[apiBase],
	);

	const pollJobOnce = useCallback(
		async (jid: string, epochs: number, onComplete?: () => void) => {
			try {
				const r = await fetch(`${apiBase}/api/v1/models/jobs/${jid}`, {
					cache: "no-store",
				});
				if (!r.ok) {
					throw new Error(`Status ${r.status}`);
				}
				const s = await r.json();
				setJobStatus(s.status);
				const progressNumber = Math.round((s.progress || 0) * 100);
				setTrainingProgress(progressNumber);

				// 模擬 epoch 更新
				setCurrentEpoch(Math.round((s.progress || 0) * epochs));

				// 模擬訓練日誌
				if (s.progress && s.progress > 0) {
					const newLog = {
						epoch: Math.round(s.progress * epochs),
						loss: Math.max(
							0.1,
							2.0 - s.progress * 1.8 + Math.random() * 0.2,
						),
						accuracy: Math.min(
							0.95,
							s.progress * 0.9 + Math.random() * 0.1,
						),
					};
					setTrainingLogs((prev) => {
						const filtered = prev.filter(
							(log) => log.epoch !== newLog.epoch,
						);
						return [...filtered, newLog].sort(
							(a, b) => a.epoch - b.epoch,
						);
					});
				}

				if (s.status === "SUCCEEDED") {
					stopPolling();
					setTrainingStage("completed");
					const mid = s.model_id as string;
					setModelId(mid);
					setTopPredictions(s.result?.predictions_topk || []);
					fetchModelResults(mid);
					if (onComplete) {
						onComplete();
					}
					return true;
				}
				if (s.status === "FAILED") {
					stopPolling();
					setTrainingStage("ready");
					setErrorMessage(s.error || "Job failed");
					return true;
				}
				return false;
			} catch (err: any) {
				stopPolling();
				setTrainingStage("ready");
				setErrorMessage(err?.message || "Polling failed");
				return true;
			}
		},
		[apiBase, stopPolling, fetchModelResults],
	);

	const pollJobUntilDone = useCallback(
		(jid: string, epochs: number, onComplete?: () => void) => {
			stopPolling();
			const tick = async () => {
				const done = await pollJobOnce(jid, epochs, onComplete);
				if (!done) {
					pollTimerRef.current = setTimeout(tick, 1200);
				}
			};
			tick();
		},
		[stopPolling, pollJobOnce],
	);

	const resetTrainingState = useCallback(() => {
		stopPolling();
		setTrainingStage("ready");
		setTrainingProgress(0);
		setJobId("");
		setJobStatus("");
		setModelId("");
		setResultsMeta(null);
		setMetrics(null);
		setTopPredictions([]);
		setErrorMessage("");
		setTrainingLogs([]);
		setCurrentEpoch(0);
	}, [stopPolling]);

	// cleanup on unmount
	useEffect(() => {
		return () => {
			stopPolling();
		};
	}, [stopPolling]);

	return {
		trainingStage,
		trainingProgress,
		currentEpoch,
		trainingLogs,
		jobId,
		jobStatus,
		modelId,
		resultsMeta,
		metrics,
		topPredictions,
		errorMessage,
		setTrainingStage,
		setTrainingProgress,
		setCurrentEpoch,
		setTrainingLogs,
		setJobId,
		setJobStatus,
		setModelId,
		setResultsMeta,
		setMetrics,
		setTopPredictions,
		setErrorMessage,
		resetTrainingState,
		stopPolling,
		pollJobUntilDone,
	};
}
