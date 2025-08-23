"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useCallback, useEffect, useRef, useState } from "react";

// 通用進度更新類型
interface ProgressUpdate {
	progress: number;
	currentEpoch?: number;
	logs?: { epoch: number; loss: number; accuracy?: number }[];
}

// 樣本計數更新類型
interface SampleCountUpdate {
	positive?: number;
	unlabeled?: number;
	unlabeledProgress?: number;
}

// 模型信息更新類型
interface ModelInfoUpdate {
	modelName?: string;
}

// 超參數更新類型
interface HyperparametersUpdate {
	hyperparameters?: any;
}

// 數據分割信息更新類型
interface DataSplitInfoUpdate {
	dataSplitInfo?: any;
}

// 階段更新類型
interface StageUpdate {
	stage?: string;
	substage?: string;
	message?: string;
}

// 驗證指標更新類型
interface ValidationMetricsUpdate {
	metrics?: {
		val_accuracy: number;
		val_precision: number;
		val_recall: number;
		val_f1: number;
	};
	sampleCount?: number;
}

// 任務完成類型
interface TaskComplete {
	success: boolean;
	modelPath?: string;
	modelId?: string;
	metrics?: any;
	evaluationId?: string;
	error?: string;
	stage?: string;
}

// 預測進度更新類型
interface PredictionProgressUpdate {
	progress: number;
	currentStep?: number;
	totalSteps?: number;
	stage?: string;
	message?: string;
}

// 預測結果更新類型
interface PredictionResultUpdate {
	predictions?: any[];
	metrics?: any;
	sampleCount?: number;
}

export interface WebSocketCommunicationProps {
	selectedRunId?: string;
	isTraining?: boolean;
	isPredicting?: boolean;
	socketEndpoint: string; // "training-progress" 或 "evaluation-progress"

	// 訓練相關回調
	onTrainingProgressUpdate?: (data: ProgressUpdate) => void;
	onSampleCountUpdate?: (data: SampleCountUpdate) => void;
	onModelInfoUpdate?: (data: ModelInfoUpdate) => void;
	onHyperparametersUpdate?: (data: HyperparametersUpdate) => void;
	onDataSplitInfoUpdate?: (data: DataSplitInfoUpdate) => void;
	onStageUpdate?: (data: StageUpdate) => void;
	onValidationMetricsUpdate?: (data: ValidationMetricsUpdate) => void;
	onTrainingComplete?: (data: TaskComplete) => void;

	// 預測相關回調
	onPredictionProgressUpdate?: (data: PredictionProgressUpdate) => void;
	onPredictionResultUpdate?: (data: PredictionResultUpdate) => void;
	onPredictionComplete?: (data: TaskComplete) => void;

	// 通用回調
	onConnectionStatusChange?: (
		status: "connected" | "disconnected" | "error",
	) => void;
}

export function WebSocketCommunication({
	selectedRunId,
	isTraining = false,
	isPredicting = false,
	socketEndpoint,
	onTrainingProgressUpdate,
	onSampleCountUpdate,
	onModelInfoUpdate,
	onHyperparametersUpdate,
	onDataSplitInfoUpdate,
	onStageUpdate,
	onValidationMetricsUpdate,
	onTrainingComplete,
	onPredictionProgressUpdate,
	onPredictionResultUpdate,
	onPredictionComplete,
	onConnectionStatusChange,
}: WebSocketCommunicationProps) {
	const [logs, setLogs] = useState<string[]>([]);
	const [connectionStatus, setConnectionStatus] = useState<
		"disconnected" | "connected" | "error"
	>("disconnected");
	const wsRef = useRef<WebSocket | null>(null);
	const wsLogsRef = useRef<HTMLTextAreaElement>(null);
	const trainingLogsRef = useRef<
		{ epoch: number; loss: number; accuracy?: number }[]
	>([]);
	const isConnectedRef = useRef<boolean>(false);
	const taskStartedRef = useRef<boolean>(false);
	const isTrainingRef = useRef<boolean>(isTraining);
	const isPredictingRef = useRef<boolean>(isPredicting);

	// Update refs when props change
	useEffect(() => {
		isTrainingRef.current = isTraining;
		isPredictingRef.current = isPredicting;
	}, [isTraining, isPredicting]);

	// Stable callback refs to avoid reconnections
	const callbackRefs = {
		onTrainingProgressUpdate: useRef(onTrainingProgressUpdate),
		onSampleCountUpdate: useRef(onSampleCountUpdate),
		onModelInfoUpdate: useRef(onModelInfoUpdate),
		onHyperparametersUpdate: useRef(onHyperparametersUpdate),
		onDataSplitInfoUpdate: useRef(onDataSplitInfoUpdate),
		onStageUpdate: useRef(onStageUpdate),
		onValidationMetricsUpdate: useRef(onValidationMetricsUpdate),
		onTrainingComplete: useRef(onTrainingComplete),
		onPredictionProgressUpdate: useRef(onPredictionProgressUpdate),
		onPredictionResultUpdate: useRef(onPredictionResultUpdate),
		onPredictionComplete: useRef(onPredictionComplete),
		onConnectionStatusChange: useRef(onConnectionStatusChange),
	};

	// Update refs when callbacks change
	useEffect(() => {
		callbackRefs.onTrainingProgressUpdate.current =
			onTrainingProgressUpdate;
		callbackRefs.onSampleCountUpdate.current = onSampleCountUpdate;
		callbackRefs.onModelInfoUpdate.current = onModelInfoUpdate;
		callbackRefs.onHyperparametersUpdate.current = onHyperparametersUpdate;
		callbackRefs.onDataSplitInfoUpdate.current = onDataSplitInfoUpdate;
		callbackRefs.onStageUpdate.current = onStageUpdate;
		callbackRefs.onValidationMetricsUpdate.current =
			onValidationMetricsUpdate;
		callbackRefs.onTrainingComplete.current = onTrainingComplete;
		callbackRefs.onPredictionProgressUpdate.current =
			onPredictionProgressUpdate;
		callbackRefs.onPredictionResultUpdate.current =
			onPredictionResultUpdate;
		callbackRefs.onPredictionComplete.current = onPredictionComplete;
		callbackRefs.onConnectionStatusChange.current =
			onConnectionStatusChange;
	}, [
		onTrainingProgressUpdate,
		onSampleCountUpdate,
		onModelInfoUpdate,
		onHyperparametersUpdate,
		onDataSplitInfoUpdate,
		onStageUpdate,
		onValidationMetricsUpdate,
		onTrainingComplete,
		onPredictionProgressUpdate,
		onPredictionResultUpdate,
		onPredictionComplete,
		onConnectionStatusChange,
	]);

	// Function to create WebSocket connection
	const createWebSocketConnection = useCallback(() => {
		// 強化重複連接檢查
		if (wsRef.current) {
			if (wsRef.current.readyState === WebSocket.OPEN) {
				console.log("WebSocket already connected, skipping...");
				return;
			}
			if (wsRef.current.readyState === WebSocket.CONNECTING) {
				console.log("WebSocket already connecting, skipping...");
				return;
			}
		}

		// 檢查是否已經有任務在運行
		if (taskStartedRef.current && isConnectedRef.current) {
			console.log("Task already started with connection, skipping...");
			return;
		}

		console.log(
			`🔗 Creating new WebSocket connection to: ${socketEndpoint} (Component ID: ${Math.random().toString(36).substr(2, 9)})`,
		);
		const ws = new WebSocket(
			`ws://localhost:8000/api/v1/models/${socketEndpoint}`,
		);

		ws.onopen = () => {
			console.log("WebSocket connection opened");
			setConnectionStatus("connected");
			callbackRefs.onConnectionStatusChange.current?.("connected");
			isConnectedRef.current = true;
		};

		ws.onmessage = (event) => {
			const data = JSON.parse(event.data);
			console.log("WebSocket received data:", data);

			// Add to logs
			setLogs((prev) => [...prev, data.message || JSON.stringify(data)]);

			// 使用 ref 來獲取最新的狀態值以避免依賴項問題
			const currentIsTraining = isTrainingRef.current;
			const currentIsPredicting = isPredictingRef.current;

			// 處理訓練相關的消息
			if (currentIsTraining) {
				handleTrainingMessage(data);
			}

			// 處理預測相關的消息
			if (currentIsPredicting) {
				handlePredictionMessage(data);
			}
		};

		ws.onclose = () => {
			console.log("WebSocket connection closed");
			setConnectionStatus("disconnected");
			callbackRefs.onConnectionStatusChange.current?.("disconnected");
			isConnectedRef.current = false;
		};

		ws.onerror = (error) => {
			console.error("WebSocket error:", error);
			setConnectionStatus("error");
			callbackRefs.onConnectionStatusChange.current?.("error");
			isConnectedRef.current = false;
		};

		wsRef.current = ws;
	}, [socketEndpoint]); // 移除 isTraining, isPredicting 依賴項以避免重複創建

	// 處理訓練相關消息
	const handleTrainingMessage = useCallback((data: any) => {
		// Handle general progress updates (including stage-based progress)
		if (data.progress !== undefined) {
			// For epoch-based training progress with loss data
			if (data.epoch !== undefined && data.loss !== undefined) {
				const newLogEntry = {
					epoch: data.epoch,
					loss: data.loss,
					accuracy: data.accuracy,
				};

				trainingLogsRef.current = [
					...trainingLogsRef.current.filter(
						(log) => log.epoch !== newLogEntry.epoch,
					),
					newLogEntry,
				].sort((a, b) => a.epoch - b.epoch);

				callbackRefs.onTrainingProgressUpdate.current?.({
					progress: data.progress,
					currentEpoch: data.epoch,
					logs: trainingLogsRef.current,
				});
			}
			// For stage-based progress (model saving, data loading, etc.)
			else {
				callbackRefs.onTrainingProgressUpdate.current?.({
					progress: data.progress,
					currentEpoch: data.epoch || 0,
					logs: trainingLogsRef.current,
				});
			}
		}
		// Handle legacy format with type field
		else if (data.type === "training_progress") {
			const newLogEntry =
				data.loss !== undefined
					? {
							epoch: data.epoch || 0,
							loss: data.loss,
							accuracy: data.accuracy,
						}
					: null;

			if (newLogEntry) {
				trainingLogsRef.current = [
					...trainingLogsRef.current,
					newLogEntry,
				];
			}

			callbackRefs.onTrainingProgressUpdate.current?.({
				progress: data.progress || 0,
				currentEpoch: data.epoch || 0,
				logs: trainingLogsRef.current,
			});
		}

		// Handle sample count updates
		if (
			data.type === "sample_count" ||
			data.p_sample_count !== undefined ||
			data.u_sample_count !== undefined
		) {
			callbackRefs.onSampleCountUpdate.current?.({
				positive: data.p_samples || data.p_sample_count,
				unlabeled: data.u_samples || data.u_sample_count,
				unlabeledProgress: data.u_progress,
			});
		}

		// Handle model name updates
		if (data.type === "model_info") {
			callbackRefs.onModelInfoUpdate.current?.({
				modelName: data.model_name,
			});
		}

		// Handle hyperparameters updates
		if (data.hyperparameters !== undefined) {
			console.log(
				"WebSocket received hyperparameters:",
				data.hyperparameters,
			);
			callbackRefs.onHyperparametersUpdate.current?.({
				hyperparameters: data.hyperparameters,
			});
		}

		// Handle stage updates
		if (data.stage !== undefined || data.substage !== undefined) {
			callbackRefs.onStageUpdate.current?.({
				stage: data.stage,
				substage: data.substage,
				message: data.message,
			});
		}

		// Handle data split info updates
		if (
			data.type === "data_split_info" ||
			data.data_split_info !== undefined
		) {
			callbackRefs.onDataSplitInfoUpdate.current?.({
				dataSplitInfo: data.split_info || data.data_split_info,
			});
		}

		// Handle validation metrics updates
		if (data.type === "validation_metrics") {
			callbackRefs.onValidationMetricsUpdate.current?.({
				metrics: data.metrics,
				sampleCount: data.sample_count,
			});
		}

		// Handle training completion
		if (
			data.type === "training_completed" ||
			(data.type === "training_progress" && data.progress >= 100) ||
			data.progress >= 100 ||
			data.message?.includes("training completed successfully")
		) {
			console.log("Training completed, closing WebSocket connection...");
			callbackRefs.onTrainingComplete.current?.({
				success: true,
				modelPath: data.model_path,
				modelId: data.model_id,
				metrics: data.metrics || data,
			});

			// Close connection after completion
			setTimeout(() => {
				if (wsRef.current) {
					wsRef.current.close();
					wsRef.current = null;
					isConnectedRef.current = false;
					taskStartedRef.current = false;
					setConnectionStatus("disconnected");
				}
			}, 1000);
		}

		// Handle training failure
		if (data.type === "training_failed") {
			console.log("Training failed, closing WebSocket connection...");
			callbackRefs.onTrainingComplete.current?.({
				success: false,
			});

			// Close connection after failure
			setTimeout(() => {
				if (wsRef.current) {
					wsRef.current.close();
					wsRef.current = null;
					isConnectedRef.current = false;
					taskStartedRef.current = false;
					setConnectionStatus("disconnected");
				}
			}, 1000);
		}
	}, []);

	// 處理預測相關消息
	const handlePredictionMessage = useCallback(
		(data: any) => {
			// Handle prediction progress updates
			if (
				data.type === "prediction_progress" ||
				(data.progress !== undefined && isPredicting)
			) {
				callbackRefs.onPredictionProgressUpdate.current?.({
					progress: data.progress || 0,
					currentStep: data.current_step,
					totalSteps: data.total_steps,
					stage: data.stage,
					message: data.message,
				});
			}

			// Handle prediction results updates
			if (data.type === "prediction_results") {
				callbackRefs.onPredictionResultUpdate.current?.({
					predictions: data.predictions,
					metrics: data.metrics,
					sampleCount: data.sample_count,
				});
			}

			// Handle evaluation/prediction completion
			if (
				data.type === "evaluation_completed" ||
				data.type === "prediction_completed" ||
				(data.type === "prediction_progress" && data.progress >= 100) ||
				data.message?.includes("evaluation completed successfully") ||
				data.message?.includes("prediction completed successfully")
			) {
				console.log(
					"Prediction/Evaluation completed, closing WebSocket connection...",
				);
				callbackRefs.onPredictionComplete.current?.({
					success: true,
					metrics: data.metrics || data,
					evaluationId: data.evaluation_id,
				});

				// Close connection after completion
				setTimeout(() => {
					if (wsRef.current) {
						wsRef.current.close();
						wsRef.current = null;
						isConnectedRef.current = false;
						taskStartedRef.current = false;
						setConnectionStatus("disconnected");
					}
				}, 1000);
			}

			// Handle prediction/evaluation failure
			if (
				data.type === "evaluation_failed" ||
				data.type === "prediction_failed"
			) {
				console.log(
					"Prediction/Evaluation failed, closing WebSocket connection...",
					data,
				);
				callbackRefs.onPredictionComplete.current?.({
					success: false,
					error: data.error || data.message || "Unknown error",
					stage: data.stage || "failed",
				});

				// Close connection after failure
				setTimeout(() => {
					if (wsRef.current) {
						wsRef.current.close();
						wsRef.current = null;
						isConnectedRef.current = false;
						taskStartedRef.current = false;
						setConnectionStatus("disconnected");
					}
				}, 1000);
			}
		},
		[isPredicting],
	);

	// WebSocket connection management
	useEffect(() => {
		const shouldConnect =
			(isTraining || isPredicting) &&
			selectedRunId &&
			!taskStartedRef.current;
		const shouldDisconnect =
			!isTraining && !isPredicting && taskStartedRef.current;

		if (shouldConnect) {
			// Task just started, create connection
			console.log(
				`${isTraining ? "Training" : "Prediction"} started, creating WebSocket connection...`,
			);
			taskStartedRef.current = true;
			createWebSocketConnection();
		} else if (shouldDisconnect) {
			// Task stopped manually, close connection
			console.log(
				`${isTraining ? "Training" : "Prediction"} stopped manually, closing WebSocket connection...`,
			);
			if (wsRef.current) {
				wsRef.current.close();
				wsRef.current = null;
			}
			setConnectionStatus("disconnected");
			callbackRefs.onConnectionStatusChange.current?.("disconnected");
			isConnectedRef.current = false;
			taskStartedRef.current = false;
		}

		// Cleanup on unmount
		return () => {
			if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
				wsRef.current.close();
				wsRef.current = null;
			}
			isConnectedRef.current = false;
			taskStartedRef.current = false;
		};
	}, [isTraining, isPredicting, selectedRunId, createWebSocketConnection]);

	// Reset logs when task starts
	useEffect(() => {
		if (isTraining || isPredicting) {
			setLogs([]);
			trainingLogsRef.current = [];
		}
	}, [isTraining, isPredicting]);

	// Auto-scroll logs to bottom
	useEffect(() => {
		if (wsLogsRef.current) {
			wsLogsRef.current.scrollTop = wsLogsRef.current.scrollHeight;
		}
	}, [logs]);

	// Get connection status indicator
	const getConnectionStatusIndicator = () => {
		switch (connectionStatus) {
			case "connected":
				return (
					<span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2" />
				);
			case "error":
				return (
					<span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2" />
				);
			default:
				return (
					<span className="inline-block w-2 h-2 bg-gray-400 rounded-full mr-2" />
				);
		}
	};

	// 決定標題
	const getTitle = () => {
		if (isTraining) {
			return "Training Logs";
		}
		if (isPredicting) {
			return "Prediction Logs";
		}
		return "Task Logs";
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-sm font-medium text-slate-700 flex items-center">
					{getConnectionStatusIndicator()}
					{getTitle()}
					<span className="ml-2 text-xs text-slate-500">
						({connectionStatus})
					</span>
				</CardTitle>
			</CardHeader>
			<div className="p-4 pt-0">
				<Textarea
					ref={wsLogsRef}
					value={logs.join("\n")}
					readOnly
					className="h-48 text-xs font-mono bg-slate-50 border resize-none"
					placeholder={`${getTitle()} will appear here...`}
				/>
			</div>
		</Card>
	);
}
