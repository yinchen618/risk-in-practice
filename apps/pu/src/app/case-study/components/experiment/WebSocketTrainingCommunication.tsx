"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useCallback, useEffect, useRef, useState } from "react";

interface WebSocketTrainingCommunicationProps {
	selectedRunId: string;
	isTraining: boolean;
	onTrainingProgressUpdate?: (data: {
		progress: number;
		currentEpoch: number;
		logs: { epoch: number; loss: number; accuracy?: number }[];
	}) => void;
	onSampleCountUpdate?: (data: {
		positive?: number;
		unlabeled?: number;
		unlabeledProgress?: number;
	}) => void;
	onModelInfoUpdate?: (data: {
		modelName?: string;
	}) => void;
	onHyperparametersUpdate?: (data: {
		hyperparameters?: {
			model_type: string;
			prior_method: string;
			class_prior?: number;
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
	}) => void;
	onDataSplitInfoUpdate?: (data: {
		dataSplitInfo?: {
			train_samples?: number;
			validation_samples?: number;
			test_samples?: number;
			train_p_samples?: number;
			validation_p_samples?: number;
			test_p_samples?: number;
			split_enabled?: boolean;
		};
	}) => void;
	onStageUpdate?: (data: {
		stage?: string;
		substage?: string;
		message?: string;
	}) => void;
	onValidationMetricsUpdate?: (data: {
		metrics?: {
			val_accuracy: number;
			val_precision: number;
			val_recall: number;
			val_f1: number;
		};
		sampleCount?: number;
	}) => void;
	onConnectionStatusChange?: (
		status: "connected" | "disconnected" | "error",
	) => void;
	onTrainingComplete?: (data: {
		success: boolean;
		modelPath?: string;
		metrics?: any;
	}) => void;
}

export function WebSocketTrainingCommunication({
	selectedRunId,
	isTraining,
	onTrainingProgressUpdate,
	onSampleCountUpdate,
	onModelInfoUpdate,
	onHyperparametersUpdate,
	onDataSplitInfoUpdate,
	onStageUpdate,
	onValidationMetricsUpdate,
	onConnectionStatusChange,
	onTrainingComplete,
}: WebSocketTrainingCommunicationProps) {
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
	const trainingStartedRef = useRef<boolean>(false);

	// Stable callback refs to avoid reconnections
	const onTrainingProgressUpdateRef = useRef(onTrainingProgressUpdate);
	const onSampleCountUpdateRef = useRef(onSampleCountUpdate);
	const onModelInfoUpdateRef = useRef(onModelInfoUpdate);
	const onHyperparametersUpdateRef = useRef(onHyperparametersUpdate);
	const onDataSplitInfoUpdateRef = useRef(onDataSplitInfoUpdate);
	const onStageUpdateRef = useRef(onStageUpdate);
	const onValidationMetricsUpdateRef = useRef(onValidationMetricsUpdate);
	const onConnectionStatusChangeRef = useRef(onConnectionStatusChange);
	const onTrainingCompleteRef = useRef(onTrainingComplete);

	// Update refs when callbacks change
	useEffect(() => {
		onTrainingProgressUpdateRef.current = onTrainingProgressUpdate;
		onSampleCountUpdateRef.current = onSampleCountUpdate;
		onModelInfoUpdateRef.current = onModelInfoUpdate;
		onHyperparametersUpdateRef.current = onHyperparametersUpdate;
		onDataSplitInfoUpdateRef.current = onDataSplitInfoUpdate;
		onStageUpdateRef.current = onStageUpdate;
		onValidationMetricsUpdateRef.current = onValidationMetricsUpdate;
		onConnectionStatusChangeRef.current = onConnectionStatusChange;
		onTrainingCompleteRef.current = onTrainingComplete;
	}, [
		onTrainingProgressUpdate,
		onSampleCountUpdate,
		onModelInfoUpdate,
		onHyperparametersUpdate,
		onDataSplitInfoUpdate,
		onStageUpdate,
		onValidationMetricsUpdate,
		onConnectionStatusChange,
		onTrainingComplete,
	]);

	// Function to create WebSocket connection
	const createWebSocketConnection = useCallback(() => {
		if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
			console.log("WebSocket already connected, skipping...");
			return;
		}

		console.log("Creating new WebSocket connection...");
		const ws = new WebSocket(
			"ws://localhost:8000/api/v1/models/training-progress",
		);

		ws.onopen = () => {
			console.log("WebSocket connection opened");
			setConnectionStatus("connected");
			onConnectionStatusChangeRef.current?.("connected");
			isConnectedRef.current = true;
		};

		ws.onmessage = (event) => {
			const data = JSON.parse(event.data);
			console.log("WebSocket received data:", data);

			// Add to logs
			setLogs((prev) => [...prev, data.message || JSON.stringify(data)]);

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

					onTrainingProgressUpdateRef.current?.({
						progress: data.progress,
						currentEpoch: data.epoch,
						logs: trainingLogsRef.current,
					});
				}
				// For stage-based progress (model saving, data loading, etc.)
				else {
					onTrainingProgressUpdateRef.current?.({
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

				onTrainingProgressUpdateRef.current?.({
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
				onSampleCountUpdateRef.current?.({
					positive: data.p_samples || data.p_sample_count,
					unlabeled: data.u_samples || data.u_sample_count,
					unlabeledProgress: data.u_progress,
				});
			}

			// Handle model name updates
			if (data.type === "model_info") {
				onModelInfoUpdateRef.current?.({
					modelName: data.model_name,
				});
			}

			// Handle hyperparameters updates
			if (data.hyperparameters !== undefined) {
				console.log(
					"WebSocket received hyperparameters:",
					data.hyperparameters,
				);
				onHyperparametersUpdateRef.current?.({
					hyperparameters: data.hyperparameters,
				});
				console.log(
					"Called onHyperparametersUpdate with:",
					data.hyperparameters,
				);
			}

			// Handle stage updates
			if (data.stage !== undefined || data.substage !== undefined) {
				onStageUpdateRef.current?.({
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
				onDataSplitInfoUpdateRef.current?.({
					dataSplitInfo: data.split_info || data.data_split_info,
				});
			}

			// Handle validation metrics updates
			if (data.type === "validation_metrics") {
				onValidationMetricsUpdateRef.current?.({
					metrics: data.metrics,
					sampleCount: data.sample_count,
				});
			}

			// Handle training completion - Close connection after completion
			if (
				data.type === "training_completed" ||
				(data.type === "training_progress" && data.progress >= 1.0) ||
				data.progress >= 100 ||
				data.message?.includes("training completed successfully")
			) {
				console.log(
					"Training completed, closing WebSocket connection...",
				);
				onTrainingCompleteRef.current?.({
					success: true,
					modelPath: data.model_path,
					metrics: data.metrics || data,
				});

				// Close connection after completion
				setTimeout(() => {
					if (wsRef.current) {
						wsRef.current.close();
						wsRef.current = null;
						isConnectedRef.current = false;
						trainingStartedRef.current = false;
						setConnectionStatus("disconnected");
					}
				}, 1000); // Give a small delay to ensure all data is processed
			}

			// Handle training failure - Close connection after failure
			if (data.type === "training_failed") {
				console.log("Training failed, closing WebSocket connection...");
				onTrainingCompleteRef.current?.({
					success: false,
				});

				// Close connection after failure
				setTimeout(() => {
					if (wsRef.current) {
						wsRef.current.close();
						wsRef.current = null;
						isConnectedRef.current = false;
						trainingStartedRef.current = false;
						setConnectionStatus("disconnected");
					}
				}, 1000);
			}
		};

		ws.onclose = () => {
			console.log("WebSocket connection closed");
			setConnectionStatus("disconnected");
			onConnectionStatusChangeRef.current?.("disconnected");
			isConnectedRef.current = false;
		};

		ws.onerror = (error) => {
			console.error("WebSocket error:", error);
			setConnectionStatus("error");
			onConnectionStatusChangeRef.current?.("error");
			isConnectedRef.current = false;
		};

		wsRef.current = ws;
	}, []);

	// WebSocket connection management - only connect when training starts
	useEffect(() => {
		if (isTraining && selectedRunId && !trainingStartedRef.current) {
			// Training just started, create connection
			console.log("Training started, creating WebSocket connection...");
			trainingStartedRef.current = true;
			createWebSocketConnection();
		} else if (!isTraining && trainingStartedRef.current) {
			// Training stopped manually, close connection
			console.log(
				"Training stopped manually, closing WebSocket connection...",
			);
			if (wsRef.current) {
				wsRef.current.close();
				wsRef.current = null;
			}
			setConnectionStatus("disconnected");
			onConnectionStatusChangeRef.current?.("disconnected");
			isConnectedRef.current = false;
			trainingStartedRef.current = false;
		}

		// Cleanup on unmount
		return () => {
			if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
				wsRef.current.close();
				wsRef.current = null;
			}
			isConnectedRef.current = false;
			trainingStartedRef.current = false;
		};
	}, [isTraining, selectedRunId, createWebSocketConnection]);

	// Reset logs and training logs when training starts
	useEffect(() => {
		if (isTraining) {
			setLogs([]);
			trainingLogsRef.current = [];
		}
	}, [isTraining]);

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

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-sm font-medium text-slate-700 flex items-center">
					{getConnectionStatusIndicator()}
					Training Logs
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
					placeholder="Training logs will appear here..."
				/>
			</div>
		</Card>
	);
}
