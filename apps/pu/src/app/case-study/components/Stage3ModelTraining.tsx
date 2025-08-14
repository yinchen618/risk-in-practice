"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ListChecks, Zap } from "lucide-react";
import { useMemo, useState } from "react";
import { ModelConfigurationPanel } from "./training/ModelConfigurationPanel";
import { SampleDistributionPanel } from "./training/SampleDistributionPanel";
import { TrainingCompletionCard } from "./training/TrainingCompletionCard";
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
	const [predictionStart, setPredictionStart] = useState<string>("");
	const [predictionEnd, setPredictionEnd] = useState<string>("");
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

	const isConfigValid = useMemo(() => {
		if (!predictionStart || !predictionEnd) {
			return false;
		}
		return new Date(predictionStart) <= new Date(predictionEnd);
	}, [predictionStart, predictionEnd]);

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
	};

	const startTrainAndPredict = async () => {
		setErrorMessage("");
		resetTrainingState();
		setTrainingStage("training");

		// 生成模擬訓練日誌
		const simulateTraining = () => {
			const totalEpochs = epochs;
			let epoch = 0;

			const interval = setInterval(() => {
				epoch++;

				const loss =
					1.0 * Math.exp(-epoch / (totalEpochs * 0.3)) +
					0.1 * Math.random();
				const accuracy =
					Math.min(
						0.95,
						0.5 +
							0.4 * (1 - Math.exp(-epoch / (totalEpochs * 0.4))),
					) +
					0.05 * Math.random();

				const logEntry = {
					epoch,
					loss,
					accuracy,
				};

				setTrainingLogs((prev) => [...prev.slice(-9), logEntry]);
				setCurrentEpoch(epoch);
				setTrainingProgress((epoch / totalEpochs) * 100);

				if (epoch >= totalEpochs) {
					clearInterval(interval);
				}
			}, 200); // 較快的更新頻率用於演示
		};

		// 啟動模擬訓練
		setTimeout(simulateTraining, 1000);

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
			prediction_start_date: predictionStart,
			prediction_end_date: predictionEnd,
		};

		try {
			const resp = await fetch(
				`${API_BASE}/api/v1/models/train-and-predict`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
				},
			);
			if (!resp.ok) {
				const txt = await resp.text();
				throw new Error(txt || "Failed to start job");
			}
			const data = await resp.json();
			const jid = data.job_id as string;
			setJobId(jid);
			setJobStatus("QUEUED");
			pollJobUntilDone(jid, epochs, onTrainingCompleted);
		} catch (err: any) {
			setTrainingStage("ready");
			setErrorMessage(err?.message || "Failed to start job");
		}
	};

	const handleViewResults = () => {
		if (onTrainingCompleted) {
			onTrainingCompleted();
		}
	};

	const renderVisualizationPanel = () => {
		if (trainingStage === "training" || trainingStage === "completed") {
			return (
				<TrainingMonitorPanel
					trainingStage={trainingStage}
					trainingProgress={trainingProgress}
					currentEpoch={currentEpoch}
					totalEpochs={epochs}
					trainingLogs={trainingLogs}
				/>
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

			{/* Main Content - Two Column Layout */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Left Panel: Configuration & Control */}
				<div className="space-y-6">
					{/* Dataset Info */}
					<TrainingDataStatsPanel
						trainingDataStats={trainingDataStats}
					/>

					{/* Model Configuration */}
					<ModelConfigurationPanel
						predictionStart={predictionStart}
						predictionEnd={predictionEnd}
						onPredictionStartChange={setPredictionStart}
						onPredictionEndChange={setPredictionEnd}
						modelType={modelType}
						priorMethod={priorMethod}
						classPrior={classPrior}
						hiddenUnits={hiddenUnits}
						activation={activation}
						lambdaReg={lambdaReg}
						optimizer={optimizer}
						learningRate={learningRate}
						epochs={epochs}
						batchSize={batchSize}
						seed={seed}
						onModelTypeChange={setModelType}
						onPriorMethodChange={setPriorMethod}
						onClassPriorChange={setClassPrior}
						onHiddenUnitsChange={setHiddenUnits}
						onActivationChange={setActivation}
						onLambdaRegChange={setLambdaReg}
						onOptimizerChange={setOptimizer}
						onLearningRateChange={setLearningRate}
						onEpochsChange={setEpochs}
						onBatchSizeChange={setBatchSize}
						onSeedChange={setSeed}
						onApplyGoldenConfig={applyGoldenConfig}
						onStartTraining={startTrainAndPredict}
						onResetTraining={resetTrainingState}
						trainingStage={trainingStage}
						isConfigValid={isConfigValid}
					/>
				</div>

				{/* Right Panel: Visualization & Monitoring */}
				<div className="space-y-6">{renderVisualizationPanel()}</div>
			</div>

			{/* Training Completion Status */}
			{trainingStage === "completed" && (
				<TrainingCompletionCard
					modelId={modelId}
					resultsMeta={resultsMeta}
					onViewResults={handleViewResults}
					onResetTraining={resetTrainingState}
				/>
			)}
		</div>
	);
}
