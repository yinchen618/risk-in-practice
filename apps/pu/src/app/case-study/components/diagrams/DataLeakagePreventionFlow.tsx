"use client";

import {
	Background,
	type Edge,
	Handle,
	MarkerType,
	type Node,
	type NodeTypes,
	Position,
	ReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

// Custom Node Components for Data Leakage Prevention
function WrongApproachNode() {
	return (
		<div className="bg-red-50 border-2 border-red-500 rounded-lg p-4 min-w-[200px]">
			<Handle
				type="source"
				position={Position.Bottom}
				id="output"
				style={{ background: "#dc2626" }}
			/>
			<div className="text-center mb-3">
				<div className="text-2xl mb-1">❌</div>
				<div className="font-bold text-red-700 text-sm">
					Wrong: Process First
				</div>
				<div className="text-xs text-gray-600 mt-1">
					Data leakage disaster
				</div>
			</div>
			<div className="space-y-2">
				<div className="bg-red-100 border border-red-300 rounded p-2">
					<div className="text-xs text-red-700">
						1. Feature engineering on all data
					</div>
				</div>
				<div className="bg-red-100 border border-red-300 rounded p-2">
					<div className="text-xs text-red-700">
						2. Scaling on all data
					</div>
				</div>
				<div className="bg-red-100 border border-red-300 rounded p-2">
					<div className="text-xs text-red-700">3. Then split</div>
				</div>
				<div className="text-center text-xs text-red-600">
					💀 Future info leaks to past
				</div>
			</div>
		</div>
	);
}

function CorrectApproachNode() {
	return (
		<div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 min-w-[200px]">
			<Handle
				type="source"
				position={Position.Bottom}
				id="output"
				style={{ background: "#22c55e" }}
			/>
			<div className="text-center mb-3">
				<div className="text-2xl mb-1">✅</div>
				<div className="font-bold text-green-700 text-sm">
					Correct: Split First
				</div>
				<div className="text-xs text-gray-600 mt-1">Iron rule</div>
			</div>
			<div className="space-y-2">
				<div className="bg-green-100 border border-green-300 rounded p-2">
					<div className="text-xs text-green-700">
						1. Split data by time
					</div>
				</div>
				<div className="bg-green-100 border border-green-300 rounded p-2">
					<div className="text-xs text-green-700">
						2. Process each split independently
					</div>
				</div>
				<div className="bg-green-100 border border-green-300 rounded p-2">
					<div className="text-xs text-green-700">
						3. Fit scaler only on training
					</div>
				</div>
				<div className="text-center text-xs text-green-600">
					🛡️ Zero temporal leakage
				</div>
			</div>
		</div>
	);
}

function ProcessingStageNode({ data }: { data: any }) {
	const { title, stage, color, bgColor, operations } = data;
	return (
		<div
			className={`${bgColor} border-2 ${color} rounded-lg p-4 min-w-[200px]`}
		>
			<Handle
				type="target"
				position={Position.Top}
				id="input"
				style={{
					background: color.includes("blue")
						? "#3b82f6"
						: color.includes("yellow")
							? "#eab308"
							: "#8b5cf6",
				}}
			/>
			<Handle
				type="source"
				position={Position.Bottom}
				id="output"
				style={{
					background: color.includes("blue")
						? "#3b82f6"
						: color.includes("yellow")
							? "#eab308"
							: "#8b5cf6",
				}}
			/>
			<div className="text-center mb-3">
				<div className="text-2xl mb-1">📊</div>
				<div
					className={`font-bold text-sm ${color.replace("border-", "text-")}`}
				>
					{title}
				</div>
				<div className="text-xs text-gray-600 mt-1">{stage}</div>
			</div>
			<div className="space-y-1">
				{operations.map((op: string, index: number) => (
					<div
						key={index}
						className="text-xs bg-white/60 p-2 rounded border"
					>
						{op}
					</div>
				))}
			</div>
		</div>
	);
}

function IsolatedProcessingNode() {
	return (
		<div className="bg-emerald-50 border-2 border-emerald-500 rounded-lg p-4 min-w-[250px]">
			<Handle
				type="target"
				position={Position.Top}
				id="input"
				style={{ background: "#10b981" }}
			/>
			<div className="text-center mb-3">
				<div className="text-2xl mb-1">🔒</div>
				<div className="font-bold text-emerald-700 text-sm">
					Isolated Processing
				</div>
				<div className="text-xs text-gray-600 mt-1">
					No cross-contamination
				</div>
			</div>
			<div className="space-y-2">
				<div className="bg-blue-100 border border-blue-300 rounded p-2">
					<div className="text-xs text-blue-700">
						Training: fit_transform()
					</div>
				</div>
				<div className="bg-yellow-100 border border-yellow-300 rounded p-2">
					<div className="text-xs text-yellow-700">
						Validation: transform()
					</div>
				</div>
				<div className="bg-purple-100 border border-purple-300 rounded p-2">
					<div className="text-xs text-purple-700">
						Testing: transform()
					</div>
				</div>
				<div className="bg-white/60 border rounded p-2">
					<div className="text-xs text-gray-700">
						Same scaler, different operations
					</div>
				</div>
			</div>
		</div>
	);
}

const leakagePreventionNodeTypes: NodeTypes = {
	wrongApproach: WrongApproachNode,
	correctApproach: CorrectApproachNode,
	processingStage: ProcessingStageNode,
	isolatedProcessing: IsolatedProcessingNode,
};

const leakagePreventionNodes: Node[] = [
	{
		id: "wrong",
		type: "wrongApproach",
		position: { x: 50, y: 50 },
		data: {},
	},
	{
		id: "correct",
		type: "correctApproach",
		position: { x: 350, y: 50 },
		data: {},
	},
	{
		id: "train-processing",
		type: "processingStage",
		position: { x: 150, y: 250 },
		data: {
			title: "Training Set",
			stage: "70% earliest data",
			color: "border-blue-500",
			bgColor: "bg-blue-50",
			operations: [
				"extract_features(train_df)",
				"scaler.fit_transform(X_train)",
				"create_sequences(X_train_scaled)",
			],
		},
	},
	{
		id: "val-processing",
		type: "processingStage",
		position: { x: 400, y: 250 },
		data: {
			title: "Validation Set",
			stage: "10% middle data",
			color: "border-yellow-500",
			bgColor: "bg-yellow-50",
			operations: [
				"extract_features(val_df)",
				"scaler.transform(X_val)",
				"create_sequences(X_val_scaled)",
			],
		},
	},
	{
		id: "test-processing",
		type: "processingStage",
		position: { x: 650, y: 250 },
		data: {
			title: "Test Set",
			stage: "20% latest data",
			color: "border-purple-500",
			bgColor: "bg-purple-50",
			operations: [
				"extract_features(test_df)",
				"scaler.transform(X_test)",
				"create_sequences(X_test_scaled)",
			],
		},
	},
	{
		id: "isolated-result",
		type: "isolatedProcessing",
		position: { x: 350, y: 450 },
		data: {},
	},
];

const leakagePreventionEdges: Edge[] = [
	{
		id: "e1",
		source: "correct",
		target: "train-processing",
		sourceHandle: "output",
		targetHandle: "input",
		style: { stroke: "#22c55e", strokeWidth: 2 },
		markerEnd: { type: MarkerType.ArrowClosed, color: "#22c55e" },
	},
	{
		id: "e2",
		source: "correct",
		target: "val-processing",
		sourceHandle: "output",
		targetHandle: "input",
		style: { stroke: "#22c55e", strokeWidth: 2 },
		markerEnd: { type: MarkerType.ArrowClosed, color: "#22c55e" },
	},
	{
		id: "e3",
		source: "correct",
		target: "test-processing",
		sourceHandle: "output",
		targetHandle: "input",
		style: { stroke: "#22c55e", strokeWidth: 2 },
		markerEnd: { type: MarkerType.ArrowClosed, color: "#22c55e" },
	},
	{
		id: "e4",
		source: "train-processing",
		target: "isolated-result",
		sourceHandle: "output",
		targetHandle: "input",
		style: { stroke: "#3b82f6", strokeWidth: 2 },
		markerEnd: { type: MarkerType.ArrowClosed, color: "#3b82f6" },
	},
	{
		id: "e5",
		source: "val-processing",
		target: "isolated-result",
		sourceHandle: "output",
		targetHandle: "input",
		style: { stroke: "#eab308", strokeWidth: 2 },
		markerEnd: { type: MarkerType.ArrowClosed, color: "#eab308" },
	},
	{
		id: "e6",
		source: "test-processing",
		target: "isolated-result",
		sourceHandle: "output",
		targetHandle: "input",
		style: { stroke: "#8b5cf6", strokeWidth: 2 },
		markerEnd: { type: MarkerType.ArrowClosed, color: "#8b5cf6" },
	},
];

export default function DataLeakagePreventionFlow() {
	return (
		<div className="h-96 bg-gradient-to-br from-red-50 to-green-50 rounded-lg border">
			<ReactFlow
				nodes={leakagePreventionNodes}
				edges={leakagePreventionEdges}
				nodeTypes={leakagePreventionNodeTypes}
				fitView
				attributionPosition="bottom-left"
				className="rounded-lg"
			>
				<Background color="#e2e8f0" gap={16} />
			</ReactFlow>
		</div>
	);
}
