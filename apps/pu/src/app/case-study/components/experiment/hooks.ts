"use client";

import { apiRequest } from "@/utils/global-api-manager";
import { useCallback, useEffect, useRef, useState } from "react";
import type { SampleDistribution, TrainingDataStats } from "./types";

interface UseTrainingDataReturn {
	trainingDataStats: TrainingDataStats | null;
	sampleDistribution: SampleDistribution | null;
	isLoadingVisualization: boolean;
	loadTrainingDataStats: () => Promise<void>;
	loadSampleDistribution: () => Promise<void>;
}

// 全局緩存以避免重複 API 調用
const trainingStatsCache = new Map<
	string,
	{ data: TrainingDataStats; timestamp: number }
>();
const sampleDistributionCache = new Map<
	string,
	{ data: SampleDistribution; timestamp: number }
>();
const CACHE_DURATION = 30000; // 30 秒緩存

// 全局載入狀態追蹤，避免多個組件同時發起相同請求
const loadingStates = new Map<string, Promise<any>>();

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
		if (!selectedRunId) {
			return;
		}

		const now = Date.now();
		const cached = trainingStatsCache.get(selectedRunId);

		// 檢查緩存是否有效
		if (cached && now - cached.timestamp < CACHE_DURATION) {
			setTrainingDataStats(cached.data);
			return;
		}

		// 檢查是否已經有正在進行的請求
		const loadingKey = `training-stats-${selectedRunId}`;
		if (loadingStates.has(loadingKey)) {
			try {
				const result = await loadingStates.get(loadingKey);
				setTrainingDataStats(result);
				return;
			} catch (error) {
				console.error("等待載入失敗:", error);
			}
		}

		// 創建新的請求 Promise
		const loadPromise = (async () => {
			try {
				const stats = await apiRequest.get(
					`${apiBase}/api/v1/experiment-runs/${selectedRunId}/training-stats`,
				);

				// 更新緩存
				trainingStatsCache.set(selectedRunId, {
					data: stats,
					timestamp: now,
				});
				return stats;
			} catch (error) {
				console.error("Failed to load training data stats:", error);
				throw error;
			} finally {
				// 清除載入狀態
				loadingStates.delete(loadingKey);
			}
		})();

		// 保存載入狀態
		loadingStates.set(loadingKey, loadPromise);

		try {
			const stats = await loadPromise;
			setTrainingDataStats(stats);
		} catch (error) {
			// 錯誤已在 Promise 中處理
		}
	}, [selectedRunId, apiBase]);
	const loadSampleDistribution = useCallback(async () => {
		if (isLoadingVisualization || !selectedRunId) {
			return;
		}

		const now = Date.now();
		const cached = sampleDistributionCache.get(selectedRunId);

		// 檢查緩存是否有效
		if (cached && now - cached.timestamp < CACHE_DURATION) {
			setSampleDistribution(cached.data);
			return;
		}

		// 檢查是否已經有正在進行的請求
		const loadingKey = `sample-distribution-${selectedRunId}`;
		if (loadingStates.has(loadingKey)) {
			try {
				const result = await loadingStates.get(loadingKey);
				setSampleDistribution(result);
				return;
			} catch (error) {
				console.error("等待載入失敗:", error);
			}
		}

		setIsLoadingVisualization(true);

		// 創建新的請求 Promise
		const loadPromise = (async () => {
			try {
				let distribution = await apiRequest.get(
					`${apiBase}/api/v1/experiment-runs/${selectedRunId}/training-data-preview`,
				);

				if (!distribution) {
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

					distribution = { pSamples, uSamples };
				}

				// 更新緩存
				sampleDistributionCache.set(selectedRunId, {
					data: distribution,
					timestamp: now,
				});
				return distribution;
			} catch (error) {
				console.error("Failed to load sample distribution:", error);
				// 生成模擬數據作為備用
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

				const distribution = { pSamples, uSamples };
				sampleDistributionCache.set(selectedRunId, {
					data: distribution,
					timestamp: now,
				});
				return distribution;
			} finally {
				// 清除載入狀態
				loadingStates.delete(loadingKey);
				setIsLoadingVisualization(false);
			}
		})();

		// 保存載入狀態
		loadingStates.set(loadingKey, loadPromise);

		try {
			const distribution = await loadPromise;
			setSampleDistribution(distribution);
		} catch (error) {
			// 錯誤已在 Promise 中處理
		}
	}, [selectedRunId, apiBase, isLoadingVisualization]);

	// 在組件加載時獲取訓練數據統計 - 使用緩存機制避免重複調用
	const hasLoadedRef = useRef(false);
	useEffect(() => {
		if (!selectedRunId || hasLoadedRef.current) {
			return;
		}

		hasLoadedRef.current = true;

		// 使用現有的緩存函數
		loadTrainingDataStats();
		loadSampleDistribution();

		// 當 selectedRunId 改變時重置標記
		return () => {
			hasLoadedRef.current = false;
		};
	}, [selectedRunId, loadTrainingDataStats, loadSampleDistribution]);

	return {
		trainingDataStats,
		sampleDistribution,
		isLoadingVisualization,
		loadTrainingDataStats,
		loadSampleDistribution,
	};
}
