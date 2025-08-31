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

// Custom Node Components for Feature Engineering Isolation
function DataSplitsNode() {
	return (
		<div className="bg-slate-50 border-2 border-slate-500 rounded-lg p-4 min-w-[200px]">
			<Handle
				type="source"
				position={Position.Right}
				id="output-train"
				style={{ background: "#3b82f6", top: "25%" }}
			/>
			<Handle
				type="source"
				position={Position.Right}
				id="output-val"
				style={{ background: "#eab308", top: "50%" }}
			/>
			<Handle
				type="source"
				position={Position.Right}
				id="output-test"
				style={{ background: "#8b5cf6", top: "75%" }}
			/>
			<div className="text-center mb-3">
				<div className="text-2xl mb-1">📊</div>
				<div className="font-bold text-slate-700 text-sm">
					Time-based Splits
				</div>
				<div className="text-xs text-gray-600 mt-1">
					Already isolated by time
				</div>
			</div>
			<div className="space-y-2">
				<div className="bg-blue-100 border border-blue-300 rounded p-2">
					<div className="text-xs text-blue-700">
						Train: 70% (earliest)
					</div>
				</div>
				<div className="bg-yellow-100 border border-yellow-300 rounded p-2">
					<div className="text-xs text-yellow-700">
						Val: 10% (middle)
					</div>
				</div>
				<div className="bg-purple-100 border border-purple-300 rounded p-2">
					<div className="text-xs text-purple-700">
						Test: 20% (latest)
					</div>
				</div>
			</div>
		</div>
	);
}

function FeatureExtractionNode({ data }: { data: any }) {
	const { title, color, bgColor, features } = data;
	return (
		<div
			className={`${bgColor} border-2 ${color} rounded-lg p-4 min-w-[200px]`}
		>
			<Handle
				type="target"
				position={Position.Left}
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
				position={Position.Right}
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
				<div className="text-2xl mb-1">⚙️</div>
				<div
					className={`font-bold text-sm ${color.replace("border-", "text-")}`}
				>
					{title}
				</div>
				<div className="text-xs text-gray-600 mt-1">
					Independent extraction
				</div>
			</div>
			<div className="space-y-1">
				{features.map((feature: string, index: number) => (
					<div
						key={index}
						className="text-xs bg-white/60 p-2 rounded border"
					>
						{feature}
					</div>
				))}
			</div>
		</div>
	);
}

function ScalingOperationNode({ data }: { data: any }) {
	const { title, operation, color, bgColor, isMain } = data;
	return (
		<div
			className={`${bgColor} border-2 ${color} rounded-lg p-4 min-w-[200px]`}
		>
			<Handle
				type="target"
				position={Position.Left}
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
			{isMain && (
				<Handle
					type="source"
					position={Position.Right}
					id="scaler-output"
					style={{ background: "#ef4444" }}
				/>
			)}
			<div className="text-center mb-3">
				<div className="text-2xl mb-1">{isMain ? "🎯" : "🔄"}</div>
				<div
					className={`font-bold text-sm ${color.replace("border-", "text-")}`}
				>
					{title}
				</div>
				<div className="text-xs text-gray-600 mt-1">{operation}</div>
			</div>
			<div className="space-y-1">
				<div className="text-xs bg-white/60 p-2 rounded border">
					{isMain
						? "scaler = StandardScaler()"
						: "Use existing scaler"}
				</div>
				<div className="text-xs bg-white/60 p-2 rounded border">
					{operation}
				</div>
				{isMain && (
					<div className="text-xs bg-red-100 p-2 rounded border">
						📤 Export fitted scaler
					</div>
				)}
			</div>
		</div>
	);
}

function IsolatedResultNode() {
	return (
		<div className="bg-emerald-50 border-2 border-emerald-500 rounded-lg p-4 min-w-[250px]">
			<Handle
				type="target"
				position={Position.Top}
				id="input-train"
				style={{ background: "#10b981", left: "25%" }}
			/>
			<Handle
				type="target"
				position={Position.Top}
				id="input-val"
				style={{ background: "#10b981", left: "50%" }}
			/>
			<Handle
				type="target"
				position={Position.Top}
				id="input-test"
				style={{ background: "#10b981", left: "75%" }}
			/>
			<div className="text-center mb-3">
				<div className="text-2xl mb-1">🔒</div>
				<div className="font-bold text-emerald-700 text-sm">
					Isolated Feature Sets
				</div>
				<div className="text-xs text-gray-600 mt-1">
					Zero cross-contamination
				</div>
			</div>
			<div className="space-y-2">
				<div className="bg-emerald-100 border border-emerald-300 rounded p-2">
					<div className="text-xs text-emerald-700">
						✓ Same feature engineering function
					</div>
				</div>
				<div className="bg-emerald-100 border border-emerald-300 rounded p-2">
					<div className="text-xs text-emerald-700">
						✓ Same scaler parameters
					</div>
				</div>
				<div className="bg-emerald-100 border border-emerald-300 rounded p-2">
					<div className="text-xs text-emerald-700">
						✓ Different scaling operations
					</div>
				</div>
				<div className="bg-emerald-100 border border-emerald-300 rounded p-2">
					<div className="text-xs text-emerald-700">
						✓ No future information leakage
					</div>
				</div>
			</div>
		</div>
	);
}

const featureIsolationNodeTypes: NodeTypes = {
	dataSplits: DataSplitsNode,
	featureExtraction: FeatureExtractionNode,
	scalingOperation: ScalingOperationNode,
	isolatedResult: IsolatedResultNode,
};

const featureIsolationNodes: Node[] = [
	{
		id: "data-splits",
		type: "dataSplits",
		position: { x: 50, y: 200 },
		data: {},
	},
	{
		id: "train-features",
		type: "featureExtraction",
		position: { x: 350, y: 100 },
		data: {
			title: "Train Features",
			color: "border-blue-500",
			bgColor: "bg-blue-50",
			features: [
				"extract_temporal_features(train_df)",
				"window_size=60",
				"mean, std, max, min, slope",
				"diff_mean, diff_std",
			],
		},
	},
	{
		id: "val-features",
		type: "featureExtraction",
		position: { x: 350, y: 250 },
		data: {
			title: "Val Features",
			color: "border-yellow-500",
			bgColor: "bg-yellow-50",
			features: [
				"extract_temporal_features(val_df)",
				"window_size=60",
				"Same function, different data",
				"Independent computation",
			],
		},
	},
	{
		id: "test-features",
		type: "featureExtraction",
		position: { x: 350, y: 400 },
		data: {
			title: "Test Features",
			color: "border-purple-500",
			bgColor: "bg-purple-50",
			features: [
				"extract_temporal_features(test_df)",
				"window_size=60",
				"Same function, different data",
				"Independent computation",
			],
		},
	},
	{
		id: "train-scaling",
		type: "scalingOperation",
		position: { x: 650, y: 100 },
		data: {
			title: "Train Scaling",
			operation: "fit_transform(X_train)",
			color: "border-blue-500",
			bgColor: "bg-blue-50",
			isMain: true,
		},
	},
	{
		id: "val-scaling",
		type: "scalingOperation",
		position: { x: 650, y: 250 },
		data: {
			title: "Val Scaling",
			operation: "transform(X_val)",
			color: "border-yellow-500",
			bgColor: "bg-yellow-50",
			isMain: false,
		},
	},
	{
		id: "test-scaling",
		type: "scalingOperation",
		position: { x: 650, y: 400 },
		data: {
			title: "Test Scaling",
			operation: "transform(X_test)",
			color: "border-purple-500",
			bgColor: "bg-purple-50",
			isMain: false,
		},
	},
	{
		id: "isolated-result",
		type: "isolatedResult",
		position: { x: 400, y: 600 },
		data: {},
	},
];

const featureIsolationEdges: Edge[] = [
	// Data splits to feature extraction
	{
		id: "e1",
		source: "data-splits",
		target: "train-features",
		sourceHandle: "output-train",
		targetHandle: "input",
		style: { stroke: "#3b82f6", strokeWidth: 2 },
		markerEnd: { type: MarkerType.ArrowClosed, color: "#3b82f6" },
	},
	{
		id: "e2",
		source: "data-splits",
		target: "val-features",
		sourceHandle: "output-val",
		targetHandle: "input",
		style: { stroke: "#eab308", strokeWidth: 2 },
		markerEnd: { type: MarkerType.ArrowClosed, color: "#eab308" },
	},
	{
		id: "e3",
		source: "data-splits",
		target: "test-features",
		sourceHandle: "output-test",
		targetHandle: "input",
		style: { stroke: "#8b5cf6", strokeWidth: 2 },
		markerEnd: { type: MarkerType.ArrowClosed, color: "#8b5cf6" },
	},
	// Feature extraction to scaling
	{
		id: "e4",
		source: "train-features",
		target: "train-scaling",
		sourceHandle: "output",
		targetHandle: "input",
		style: { stroke: "#3b82f6", strokeWidth: 2 },
		markerEnd: { type: MarkerType.ArrowClosed, color: "#3b82f6" },
	},
	{
		id: "e5",
		source: "val-features",
		target: "val-scaling",
		sourceHandle: "output",
		targetHandle: "input",
		style: { stroke: "#eab308", strokeWidth: 2 },
		markerEnd: { type: MarkerType.ArrowClosed, color: "#eab308" },
	},
	{
		id: "e6",
		source: "test-features",
		target: "test-scaling",
		sourceHandle: "output",
		targetHandle: "input",
		style: { stroke: "#8b5cf6", strokeWidth: 2 },
		markerEnd: { type: MarkerType.ArrowClosed, color: "#8b5cf6" },
	},
	// Scaler sharing (red dashed lines)
	{
		id: "e7",
		source: "train-scaling",
		target: "val-scaling",
		sourceHandle: "scaler-output",
		targetHandle: "input",
		style: { stroke: "#ef4444", strokeWidth: 2, strokeDasharray: "5,5" },
		markerEnd: { type: MarkerType.ArrowClosed, color: "#ef4444" },
		label: "fitted scaler",
	},
	{
		id: "e8",
		source: "train-scaling",
		target: "test-scaling",
		sourceHandle: "scaler-output",
		targetHandle: "input",
		style: { stroke: "#ef4444", strokeWidth: 2, strokeDasharray: "5,5" },
		markerEnd: { type: MarkerType.ArrowClosed, color: "#ef4444" },
		label: "fitted scaler",
	},
	// Scaling to result
	{
		id: "e9",
		source: "train-scaling",
		target: "isolated-result",
		sourceHandle: "output",
		targetHandle: "input-train",
		style: { stroke: "#3b82f6", strokeWidth: 2 },
		markerEnd: { type: MarkerType.ArrowClosed, color: "#3b82f6" },
	},
	{
		id: "e10",
		source: "val-scaling",
		target: "isolated-result",
		sourceHandle: "output",
		targetHandle: "input-val",
		style: { stroke: "#eab308", strokeWidth: 2 },
		markerEnd: { type: MarkerType.ArrowClosed, color: "#eab308" },
	},
	{
		id: "e11",
		source: "test-scaling",
		target: "isolated-result",
		sourceHandle: "output",
		targetHandle: "input-test",
		style: { stroke: "#8b5cf6", strokeWidth: 2 },
		markerEnd: { type: MarkerType.ArrowClosed, color: "#8b5cf6" },
	},
];

export default function FeatureEngineeringIsolationFlow() {
	return (
		<div className="h-[500px] bg-gradient-to-br from-slate-50 to-emerald-50 rounded-lg border">
			<ReactFlow
				nodes={featureIsolationNodes}
				edges={featureIsolationEdges}
				nodeTypes={featureIsolationNodeTypes}
				fitView
				attributionPosition="bottom-left"
				className="rounded-lg"
			>
				<Background color="#e2e8f0" gap={16} />
			</ReactFlow>
		</div>
	);
}
