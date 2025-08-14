"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, ListChecks, Zap } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DataSplitConfigPanel } from "./training/DataSplitConfigPanel";
import { PredictionConfigurationPanel } from "./training/PredictionConfigurationPanel";
import { SampleDistributionPanel } from "./training/SampleDistributionPanel";
import { TrainingCompletionCard } from "./training/TrainingCompletionCard";
import { TrainingConfigurationPanel } from "./training/TrainingConfigurationPanel";
import { TrainingDataStatsPanel } from "./training/TrainingDataStatsPanel";
import { TrainingMonitorPanel } from "./training/TrainingMonitorPanel";
import { useTrainingData, useTrainingJob } from "./training/hooks";
import type {
	Activation,
	ModelType,
	Optimizer,
	PriorMethod,
	TrainingPayload,
} from "./training/types";

interface Stage3ModelTrainingProps {
	onTrainingCompleted?: () => void;
	selectedRunId: string; // 外層已保證不為 null
}

export function Stage3ModelTraining({
	onTrainingCompleted,
	selectedRunId,
}: Stage3ModelTrainingProps) {
	const API_BASE = "http://localhost:8000";

	// Model configuration state
	const [modelType, setModelType] = useState<ModelType>("nnPU");
	const [priorMethod, setPriorMethod] = useState<PriorMethod>("median");
	const [classPrior, setClassPrior] = useState<string>("");
	const [hiddenUnits, setHiddenUnits] = useState<number>(100);
	const [activation, setActivation] = useState<Activation>("relu");
	const [lambdaReg, setLambdaReg] = useState<number>(0.005);
	const [optimizer, setOptimizer] = useState<Optimizer>("adam");
	const [learningRate, setLearningRate] = useState<number>(0.005);
	const [epochs, setEpochs] = useState<number>(100);
	const [batchSize, setBatchSize] = useState<number>(128);
	const [seed, setSeed] = useState<number>(42);

	// WebSocket logs state
	const [wsLogs, setWsLogs] = useState<string[]>([]);
	const wsLogsRef = useRef<HTMLTextAreaElement>(null);

	// Training data tracking state
	const [pSampleCount, setPSampleCount] = useState<number | undefined>(
		undefined,
	);
	const [uSampleCount, setUSampleCount] = useState<number | undefined>(
		undefined,
	);
	const [uSampleProgress, setUSampleProgress] = useState<number | undefined>(
		undefined,
	);
	const [currentModelName, setCurrentModelName] = useState<
		string | undefined
	>(undefined);

	// Prediction configuration state
	const [selectedModelId, setSelectedModelId] = useState<string>("");
	const [predictionTimeRange, setPredictionTimeRange] = useState({
		startDate: new Date(),
		endDate: new Date(),
		startTime: "00:00",
		endTime: "23:59",
	});
	const [predictionFloor, setPredictionFloor] = useState({
		selectedBuildings: [] as string[],
		selectedFloors: [] as string[],
		selectedFloorsByBuilding: {} as Record<string, string[]>,
	});

	// Time Range & Floor Selection state
	const [timeRangeMode, setTimeRangeMode] = useState<"original" | "custom">(
		"original",
	);
	const [timeRange, setTimeRange] = useState({
		startDate: new Date(),
		endDate: new Date(),
		startTime: "00:00",
		endTime: "23:59",
	});
	const [floor, setFloor] = useState({
		selectedBuildings: [] as string[],
		selectedFloors: [] as string[],
		selectedFloorsByBuilding: {} as Record<string, string[]>,
	});
	const [originalTimeRange, setOriginalTimeRange] = useState<{
		startDate: Date;
		endDate: Date;
		startTime: string;
		endTime: string;
	} | null>(null);
	const [originalFloor, setOriginalFloor] = useState<{
		selectedBuildings: string[];
		selectedFloors: string[];
		selectedFloorsByBuilding?: Record<string, string[]>;
	} | null>(null);

	// Data split configuration state
	const [dataSplitEnabled, setDataSplitEnabled] = useState<boolean>(true);
	const [trainRatio, setTrainRatio] = useState<number>(0.6);
	const [validationRatio, setValidationRatio] = useState<number>(0.2);
	const [testRatio, setTestRatio] = useState<number>(0.2);

	// Custom hooks for data and job management
	const {
		trainingDataStats,
		sampleDistribution,
		isLoadingVisualization,
		loadSampleDistribution,
	} = useTrainingData(selectedRunId, API_BASE);

	const {
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
		setTrainingLogs,
		setCurrentEpoch,
		setTrainingProgress,
		setJobId,
		setJobStatus,
		setErrorMessage,
		resetTrainingState,
		pollJobUntilDone,
	} = useTrainingJob(API_BASE);

	// Auto-scroll logs to bottom
	useEffect(() => {
		if (wsLogsRef.current) {
			wsLogsRef.current.scrollTop = wsLogsRef.current.scrollHeight;
		}
	}, [wsLogs]);

	// Load original labeling time range and floor selection from experiment run
	useEffect(() => {
		const loadOriginalLabelingRange = async () => {
			if (!selectedRunId) {
				return;
			}

			try {
				const response = await fetch(
					`http://localhost:8000/api/v1/experiment-runs/${selectedRunId}`,
				);
				if (response.ok) {
					const json = await response.json();
					const params = json?.data?.filteringParameters;

					if (params) {
						// 設置原始時間範圍
						const originalStart = new Date(params.start_date);
						const originalEnd = new Date(params.end_date);

						setOriginalTimeRange({
							startDate: originalStart,
							endDate: originalEnd,
							startTime: params.start_time || "00:00",
							endTime: params.end_time || "23:59",
						});

						// 設置原始樓層選擇
						const originalFloorData = {
							selectedBuildings: [] as string[],
							selectedFloors: [] as string[],
							selectedFloorsByBuilding:
								params.selected_floors_by_building ||
								({} as Record<string, string[]>),
						};

						// 從按建築分組的樓層數據中計算所有選中的樓層
						if (params.selected_floors_by_building) {
							const allSelectedFloors = Object.values(
								params.selected_floors_by_building,
							).flat() as string[];
							originalFloorData.selectedFloors =
								allSelectedFloors;
							originalFloorData.selectedBuildings = Object.keys(
								params.selected_floors_by_building,
							);
						}

						setOriginalFloor(originalFloorData);

						// 如果是原始模式，也同時設置當前值
						if (timeRangeMode === "original") {
							setTimeRange({
								startDate: originalStart,
								endDate: originalEnd,
								startTime: params.start_time || "00:00",
								endTime: params.end_time || "23:59",
							});
							setFloor({
								...originalFloorData,
								selectedFloorsByBuilding:
									originalFloorData.selectedFloorsByBuilding ||
									{},
							});
						}
					}
				}
			} catch (error) {
				console.error("Failed to load original labeling range:", error);
			}
		};

		loadOriginalLabelingRange();
	}, [selectedRunId, timeRangeMode]);

	// Handlers for time range and floor changes
	const handleTimeRangeChange = useCallback((key: string, value: any) => {
		setTimeRange((prev) => ({
			...prev,
			[key]: value,
		}));
	}, []);

	const handleFloorChange = useCallback((key: string, value: string[]) => {
		setFloor((prev) => ({
			...prev,
			[key]: value,
		}));
	}, []);

	const handleTimeRangeModeChange = useCallback(
		(mode: "original" | "custom") => {
			setTimeRangeMode(mode);

			// 如果切換到原始模式且有原始數據，則使用原始數據
			if (mode === "original" && originalTimeRange && originalFloor) {
				setTimeRange(originalTimeRange);
				setFloor({
					...originalFloor,
					selectedFloorsByBuilding:
						originalFloor.selectedFloorsByBuilding || {},
				});
			}
		},
		[originalTimeRange, originalFloor],
	);

	const isConfigValid = useMemo(() => {
		// 檢查時間範圍是否有效
		if (!timeRange.startDate || !timeRange.endDate) {
			return false;
		}
		return timeRange.startDate <= timeRange.endDate;
	}, [timeRange.startDate, timeRange.endDate]);

	const applyGoldenConfig = () => {
		setModelType("nnPU");
		setPriorMethod("median");
		setHiddenUnits(100);
		setActivation("relu");
		setLambdaReg(0.005);
		setOptimizer("adam");
		setLearningRate(0.005);
		setEpochs(100);
		setBatchSize(128);
		setSeed(42);
		// 重置數據切分為推薦配置
		setDataSplitEnabled(true);
		setTrainRatio(0.6);
		setValidationRatio(0.2);
		setTestRatio(0.2);
	};

	const startTrainAndPredict = async () => {
		setErrorMessage("");
		resetTrainingStateWithLogs(); // 使用我們的完整重置函數
		setTrainingStage("training"); // 在重置之後設置訓練狀態

		const payload: TrainingPayload = {
			experiment_run_id: selectedRunId,
			model_params: {
				model_type: modelType,
				prior_method: priorMethod,
				class_prior: classPrior ? Number(classPrior) : null,
				hidden_units: hiddenUnits,
				activation,
				lambda_reg: lambdaReg,
				optimizer,
				learning_rate: learningRate,
				epochs,
				batch_size: batchSize,
				seed,
				feature_version: "fe_v1",
			},
			prediction_start_date: timeRange.startDate
				.toISOString()
				.split("T")[0],
			prediction_end_date: timeRange.endDate.toISOString().split("T")[0],
			data_split_config: dataSplitEnabled
				? {
						enabled: dataSplitEnabled,
						trainRatio,
						validationRatio,
						testRatio,
					}
				: undefined,
			// 新增的 U 樣本生成配置
			u_sample_time_range: {
				start_date: timeRange.startDate.toISOString().split("T")[0],
				end_date: timeRange.endDate.toISOString().split("T")[0],
				start_time: timeRange.startTime,
				end_time: timeRange.endTime,
			},
			u_sample_building_floors: floor.selectedFloorsByBuilding,
			u_sample_limit: 5000,
		};

		try {
			// 清空之前的日誌
			setWsLogs([
				`[${new Date().toLocaleTimeString()}] Starting training job... 🚀`,
			]);

			// 建立 WebSocket 連接用於即時監控
			const wsUrl = `${API_BASE.replace("http", "ws")}/api/v1/models/training-progress`;
			console.log("Attempting to connect to WebSocket:", wsUrl);
			setWsLogs((prev) => [
				...prev,
				`[${new Date().toLocaleTimeString()}] Connecting to WebSocket: ${wsUrl}`,
			]);
			
			const ws = new WebSocket(wsUrl);

			ws.onopen = () => {
				console.log("WebSocket connected for training progress");
				setWsLogs((prev) => [
					...prev,
					`[${new Date().toLocaleTimeString()}] ✅ Connected to training progress WebSocket 🔗`,
				]);
			};

			ws.onmessage = (event) => {
				try {
					const data = JSON.parse(event.data);
					console.log("📨 Training progress update received:", data);

					// Add log to textarea
					const timestamp = new Date().toLocaleTimeString();
					const logMessage = `[${timestamp}] ${data.message || "Training update received"}`;
					setWsLogs((prev) => [...prev, logMessage]);

					// Handle sample count updates
					if (data.p_sample_count !== undefined) {
						console.log(
							"Updating P sample count:",
							data.p_sample_count,
						);
						setPSampleCount(data.p_sample_count);
					}
					if (data.u_sample_count !== undefined) {
						console.log(
							"Updating U sample count:",
							data.u_sample_count,
						);
						setUSampleCount(data.u_sample_count);
					}
					if (data.u_sample_progress !== undefined) {
						console.log(
							"Updating U sample progress:",
							data.u_sample_progress,
						);
						setUSampleProgress(data.u_sample_progress);
					}
					if (data.model_name !== undefined) {
						console.log("Updating model name:", data.model_name);
						setCurrentModelName(data.model_name);
					}

					// Handle training progress updates from backend
					if (data.progress !== undefined && data.progress >= 0) {
						console.log("📊 Updating training progress:", data.progress);
						setTrainingProgress(data.progress);
					}

					// Handle epoch and loss updates for training logs
					if (data.epoch !== undefined && data.loss !== undefined) {
						console.log("📈 Updating epoch and loss:", data.epoch, data.loss);
						
						const logEntry = {
							epoch: data.epoch,
							loss: data.loss,
							accuracy:
								data.accuracy ||
								0.5 +
									0.4 *
										(1 -
											Math.exp(
												-data.epoch / (epochs * 0.4),
											)),
						};

						setTrainingLogs((prev) => [
							...prev.slice(-9),
							logEntry,
						]);
						setCurrentEpoch(data.epoch);
						
						// Update training progress based on epoch if no explicit progress provided
						if (data.progress === undefined) {
							const epochProgress = (data.epoch / epochs) * 100;
							console.log("📊 Calculated epoch progress:", epochProgress);
							setTrainingProgress(epochProgress);
						}
					}

					// Handle training completion or failure
					// 只有在整個流程完成（包括 U 樣本產生和模型訓練）時才關閉 WebSocket
					if (
						data.progress === 100 ||
						(data.message?.includes("completed") && 
						 (data.message?.includes("Training completed") || 
						  data.message?.includes("All processes completed")))
					) {
						setTrainingStage("completed");
						setWsLogs((prev) => [
							...prev,
							`[${new Date().toLocaleTimeString()}] Training completed successfully! 🎉`,
						]);
						ws.close();
					} else if (
						data.progress === -1 ||
						data.message?.includes("failed") ||
						data.message?.includes("Training failed")
					) {
						setTrainingStage("failed");
						setErrorMessage(data.message || "Training failed");
						setWsLogs((prev) => [
							...prev,
							`[${new Date().toLocaleTimeString()}] Training failed: ${data.message || "Unknown error"} ❌`,
						]);
						ws.close();
					}
					// U 樣本產生完成不關閉 WebSocket，繼續等待訓練階段
					else if (data.message?.includes("U sample generation completed")) {
						setWsLogs((prev) => [
							...prev,
							`[${new Date().toLocaleTimeString()}] U sample generation completed, starting model training... ⏳`,
						]);
					}
				} catch (err) {
					console.error("Failed to parse WebSocket message:", err);
					setWsLogs((prev) => [
						...prev,
						`[${new Date().toLocaleTimeString()}] Error parsing WebSocket message`,
					]);
				}
			};

			ws.onerror = (error) => {
				console.error("WebSocket error:", error);
				setWsLogs((prev) => [
					...prev,
					`[${new Date().toLocaleTimeString()}] ❌ WebSocket error occurred`,
				]);
			};

			ws.onclose = (event) => {
				console.log("WebSocket connection closed. Code:", event.code, "Reason:", event.reason);
				setWsLogs((prev) => [
					...prev,
					`[${new Date().toLocaleTimeString()}] 🔌 WebSocket connection closed (Code: ${event.code})`,
				]);
			};

			// 等待 WebSocket 連接建立再發送訓練請求
			const waitForWebSocketConnection = () => {
				return new Promise<void>((resolve, reject) => {
					if (ws.readyState === WebSocket.OPEN) {
						resolve();
					} else {
						const timeout = setTimeout(() => {
							reject(new Error("WebSocket connection timeout"));
						}, 5000); // 5秒超時

						ws.addEventListener('open', () => {
							clearTimeout(timeout);
							resolve();
						});

						ws.addEventListener('error', () => {
							clearTimeout(timeout);
							reject(new Error("WebSocket connection failed"));
						});
					}
				});
			};

			try {
				// 等待 WebSocket 連接建立
				await waitForWebSocketConnection();
				setWsLogs((prev) => [
					...prev,
					`[${new Date().toLocaleTimeString()}] � WebSocket ready, sending training request...`,
				]);
			} catch (wsError) {
				console.warn("WebSocket connection failed, proceeding with polling fallback:", wsError);
				setWsLogs((prev) => [
					...prev,
					`[${new Date().toLocaleTimeString()}] ⚠️ WebSocket failed, using polling fallback`,
				]);
			}

			// 發送訓練請求
			setWsLogs((prev) => [
				...prev,
				`[${new Date().toLocaleTimeString()}] 📤 Sending training request to backend...`,
			]);

			const resp = await fetch(
				`${API_BASE}/api/v1/models/train-and-predict-v2`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
				},
			);

			if (!resp.ok) {
				const txt = await resp.text();
				throw new Error(txt || "Failed to start training job");
			}

			const data = await resp.json();
			const jid = data.job_id as string;
			setJobId(jid);
			setJobStatus("RUNNING");

			setWsLogs((prev) => [
				...prev,
				`[${new Date().toLocaleTimeString()}] Training job started with ID: ${jid}`,
			]);

			// 如果 WebSocket 失敗，使用輪詢作為後備
			if (ws.readyState !== WebSocket.OPEN) {
				pollJobUntilDone(jid, epochs, onTrainingCompleted);
			}
		} catch (err: any) {
			setTrainingStage("ready");
			setErrorMessage(err?.message || "Failed to start training job");
			setWsLogs((prev) => [
				...prev,
				`[${new Date().toLocaleTimeString()}] Error: ${err?.message || "Failed to start training job"} ❌`,
			]);
		}
	};

	const resetTrainingStateWithLogs = () => {
		resetTrainingState();
		setWsLogs([]);
		setPSampleCount(undefined);
		setUSampleCount(undefined);
		setUSampleProgress(undefined);
		setCurrentModelName(undefined);
	};

	const handleViewResults = () => {
		if (onTrainingCompleted) {
			onTrainingCompleted();
		}
	};

	const startPrediction = async () => {
		if (!selectedModelId) {
			setErrorMessage("Please select a trained model first");
			return;
		}

		setErrorMessage("");

		try {
			const payload = {
				model_id: selectedModelId,
				prediction_start_date: predictionTimeRange.startDate
					.toISOString()
					.split("T")[0],
				prediction_end_date: predictionTimeRange.endDate
					.toISOString()
					.split("T")[0],
				time_range: {
					start_time: predictionTimeRange.startTime,
					end_time: predictionTimeRange.endTime,
				},
				floor_selection: predictionFloor,
			};

			const response = await fetch(
				`${API_BASE}/api/v1/models/predict-only`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
				},
			);

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(errorText || "Failed to start prediction");
			}

			const data = await response.json();
			console.log("Prediction started:", data);

			// 可以在這裡處理預測結果或顯示成功訊息
		} catch (err: any) {
			setErrorMessage(err?.message || "Failed to start prediction");
		}
	};

	const renderVisualizationPanel = () => {
		if (trainingStage === "training" || trainingStage === "completed") {
			return (
				<div className="space-y-4">
					<TrainingMonitorPanel
						trainingStage={trainingStage}
						trainingProgress={trainingProgress}
						currentEpoch={currentEpoch}
						totalEpochs={epochs}
						trainingLogs={trainingLogs}
						pSampleCount={pSampleCount}
						uSampleCount={uSampleCount}
						uSampleProgress={uSampleProgress}
						modelName={currentModelName}
					/>

					{/* WebSocket Logs Panel */}
					<Card>
						<CardHeader>
							<CardTitle className="text-sm font-medium text-slate-700">
								Training Logs
							</CardTitle>
						</CardHeader>
						<div className="p-4 pt-0">
							<Textarea
								ref={wsLogsRef}
								value={wsLogs.join("\n")}
								readOnly
								className="h-64 text-xs font-mono bg-slate-50 border resize-none"
								placeholder="Training logs will appear here..."
							/>
						</div>
					</Card>
				</div>
			);
		}

		return (
			<SampleDistributionPanel
				sampleDistribution={sampleDistribution}
				isLoading={isLoadingVisualization}
				onRetryLoad={loadSampleDistribution}
			/>
		);
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<Card className="border border-blue-200">
				<CardHeader>
					<CardTitle className="flex items-center gap-3 text-xl text-slate-900">
						<Zap className="h-5 w-5" />
						Stage 3: Interactive PU Learning Model Training
					</CardTitle>
					<div className="text-slate-600 text-sm space-y-1">
						<p className="flex items-center gap-2">
							<ListChecks className="h-4 w-4" />
							Interactive training with real-time visualization
							and monitoring.
						</p>
						<p className="flex items-center gap-2">
							<Calendar className="h-4 w-4" />
							Preview your training data before starting and
							monitor progress during training.
						</p>
					</div>
				</CardHeader>
			</Card>

			{/* Error Message */}
			{errorMessage && (
				<Alert variant="destructive">
					<AlertDescription>{errorMessage}</AlertDescription>
				</Alert>
			)}

			{/* Main Content - Responsive Layout */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
				{/* Left Panel: Training Configuration */}
				<div className="space-y-6">
					{/* Dataset Info */}
					<TrainingDataStatsPanel
						trainingDataStats={trainingDataStats}
					/>

					{/* Data Split Configuration */}
					<DataSplitConfigPanel
						enabled={dataSplitEnabled}
						trainRatio={trainRatio}
						validationRatio={validationRatio}
						testRatio={testRatio}
						onEnabledChange={setDataSplitEnabled}
						onTrainRatioChange={setTrainRatio}
						onValidationRatioChange={setValidationRatio}
						onTestRatioChange={setTestRatio}
						totalPositiveSamples={
							trainingDataStats?.positiveSamples || 0
						}
					/>

					{/* Training Configuration */}
					<TrainingConfigurationPanel
						modelParams={{
							modelType,
							priorMethod,
							classPrior,
							hiddenUnits,
							activation,
							lambdaReg,
							optimizer,
							learningRate,
							epochs,
							batchSize,
							seed,
						}}
						onModelParamsChange={(params) => {
							if (params.modelType !== undefined) {
								setModelType(params.modelType);
							}
							if (params.priorMethod !== undefined) {
								setPriorMethod(params.priorMethod);
							}
							if (params.classPrior !== undefined) {
								setClassPrior(params.classPrior);
							}
							if (params.hiddenUnits !== undefined) {
								setHiddenUnits(params.hiddenUnits);
							}
							if (params.activation !== undefined) {
								setActivation(params.activation);
							}
							if (params.lambdaReg !== undefined) {
								setLambdaReg(params.lambdaReg);
							}
							if (params.optimizer !== undefined) {
								setOptimizer(params.optimizer);
							}
							if (params.learningRate !== undefined) {
								setLearningRate(params.learningRate);
							}
							if (params.epochs !== undefined) {
								setEpochs(params.epochs);
							}
							if (params.batchSize !== undefined) {
								setBatchSize(params.batchSize);
							}
							if (params.seed !== undefined) {
								setSeed(params.seed);
							}
						}}
						dataRangeConfig={{
							mode: timeRangeMode,
							timeRange,
							floor,
							originalTimeRange: originalTimeRange || undefined,
							originalFloor: originalFloor || undefined,
						}}
						onDataRangeConfigChange={(config) => {
							if (config.mode !== undefined) {
								handleTimeRangeModeChange(config.mode);
							}
							if (config.timeRange !== undefined) {
								setTimeRange(config.timeRange);
							}
							if (config.floor !== undefined) {
								setFloor({
									selectedBuildings:
										config.floor.selectedBuildings,
									selectedFloors: config.floor.selectedFloors,
									selectedFloorsByBuilding:
										config.floor.selectedFloorsByBuilding ||
										{},
								});
							}
						}}
						actions={{
							onApplyGoldenConfig: applyGoldenConfig,
							onStartTraining: startTrainAndPredict,
							onResetTraining: resetTrainingStateWithLogs,
						}}
						trainingStage={trainingStage}
						isConfigValid={isConfigValid}
					/>
				</div>

				{/* Right Panel: Prediction Configuration & Visualization */}
				<div className="space-y-6">
					{/* Prediction Configuration */}
					<PredictionConfigurationPanel
						selectedRunId={selectedRunId}
						trainingStage={trainingStage}
						config={{
							modelId: selectedModelId,
							timeRange: predictionTimeRange,
							floor: predictionFloor,
						}}
						onConfigChange={(config) => {
							if (config.modelId !== undefined) {
								setSelectedModelId(config.modelId);
							}
							if (config.timeRange !== undefined) {
								setPredictionTimeRange(config.timeRange);
							}
							if (config.floor !== undefined) {
								setPredictionFloor({
									selectedBuildings:
										config.floor.selectedBuildings,
									selectedFloors: config.floor.selectedFloors,
									selectedFloorsByBuilding:
										config.floor.selectedFloorsByBuilding ||
										{},
								});
							}
						}}
						onStartPrediction={startPrediction}
					/>

					{/* Visualization Panel */}
					{renderVisualizationPanel()}
				</div>
			</div>

			{/* Training Completion or Failure Status */}
			{trainingStage === "completed" && (
				<TrainingCompletionCard
					modelId={modelId}
					resultsMeta={resultsMeta}
					onViewResults={handleViewResults}
					onResetTraining={resetTrainingStateWithLogs}
				/>
			)}

			{/* Training Failure Status */}
			{trainingStage === "failed" && (
				<div className="bg-red-50 border border-red-200 rounded-lg p-4">
					<div className="flex items-center">
						<div className="flex-shrink-0">
							<svg
								className="h-5 w-5 text-red-400"
								viewBox="0 0 20 20"
								fill="currentColor"
								aria-hidden="true"
							>
								<title>Error</title>
								<path
									fillRule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
									clipRule="evenodd"
								/>
							</svg>
						</div>
						<div className="ml-3">
							<h3 className="text-sm font-medium text-red-800">
								Training Failed
							</h3>
							<div className="mt-2 text-sm text-red-700">
								<p>
									{errorMessage ||
										"An error occurred during training. Please check your data and configuration."}
								</p>
							</div>
							<div className="mt-3">
								<button
									type="button"
									onClick={resetTrainingStateWithLogs}
									className="text-sm bg-red-100 text-red-800 rounded px-3 py-1 hover:bg-red-200"
								>
									Reset and Try Again
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
