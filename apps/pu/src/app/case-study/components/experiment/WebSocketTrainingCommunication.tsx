"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useRef, useState } from "react";

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

	// WebSocket connection management
	useEffect(() => {
		if (!isTraining || !selectedRunId) {
			// Close existing connection if training stopped
			if (wsRef.current) {
				wsRef.current.close();
				wsRef.current = null;
			}
			setConnectionStatus("disconnected");
			onConnectionStatusChange?.("disconnected");
			return;
		}

		// Setup WebSocket connection for real-time logs
		const ws = new WebSocket(
			"ws://localhost:8000/api/v1/models/training-progress",
		);

		ws.onopen = () => {
			console.log("WebSocket connection opened");
			setConnectionStatus("connected");
			onConnectionStatusChange?.("connected");
		};

		ws.onmessage = (event) => {
			const data = JSON.parse(event.data);

			// Add to logs
			setLogs((prev) => [...prev, data.message || JSON.stringify(data)]);

			// Handle training progress updates
			// Check if this is a training progress message (has epoch and loss data)
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

				onTrainingProgressUpdate?.({
					progress: data.progress || 0,
					currentEpoch: data.epoch,
					logs: trainingLogsRef.current,
				});
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

				onTrainingProgressUpdate?.({
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
				onSampleCountUpdate?.({
					positive: data.p_samples || data.p_sample_count,
					unlabeled: data.u_samples || data.u_sample_count,
					unlabeledProgress: data.u_progress,
				});
			}

			// Handle model name updates
			if (data.type === "model_info") {
				onModelInfoUpdate?.({
					modelName: data.model_name,
				});
			}

			// Handle hyperparameters updates
			if (data.hyperparameters !== undefined) {
				onHyperparametersUpdate?.({
					hyperparameters: data.hyperparameters,
				});
			}

			// Handle stage updates
			if (data.stage !== undefined || data.substage !== undefined) {
				onStageUpdate?.({
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
				onDataSplitInfoUpdate?.({
					dataSplitInfo: data.split_info || data.data_split_info,
				});
			}

			// Handle validation metrics updates
			if (data.type === "validation_metrics") {
				onValidationMetricsUpdate?.({
					metrics: data.metrics,
					sampleCount: data.sample_count,
				});
			}

			// Handle training completion
			if (
				data.type === "training_completed" ||
				(data.type === "training_progress" && data.progress >= 1.0) ||
				data.progress >= 100 ||
				data.message?.includes("training completed successfully")
			) {
				onTrainingComplete?.({
					success: true,
					modelPath: data.model_path,
					metrics: data.metrics || data,
				});
			}

			// Handle training failure
			if (data.type === "training_failed") {
				onTrainingComplete?.({
					success: false,
				});
			}
		};

		ws.onclose = () => {
			console.log("WebSocket connection closed");
			setConnectionStatus("disconnected");
			onConnectionStatusChange?.("disconnected");
		};

		ws.onerror = (error) => {
			console.error("WebSocket error:", error);
			setConnectionStatus("error");
			onConnectionStatusChange?.("error");
		};

		wsRef.current = ws;

		// Cleanup on unmount
		return () => {
			if (ws.readyState === WebSocket.OPEN) {
				ws.close();
			}
		};
	}, [
		selectedRunId,
		isTraining,
		onTrainingProgressUpdate,
		onSampleCountUpdate,
		onModelInfoUpdate,
		onDataSplitInfoUpdate,
		onValidationMetricsUpdate,
		onConnectionStatusChange,
		onTrainingComplete,
	]);

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
