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

// Custom Node Components for Stratified Time Split
function OriginalDataNode() {
	return (
		<div className="bg-slate-50 border-2 border-slate-400 rounded-lg p-4 min-w-[200px]">
			<Handle
				type="source"
				position={Position.Right}
				id="output-p"
				style={{ background: "#059669", top: "30%" }}
			/>
			<Handle
				type="source"
				position={Position.Right}
				id="output-u"
				style={{ background: "#dc2626", top: "70%" }}
			/>
			<div className="text-center mb-3">
				<div className="text-2xl mb-1">📊</div>
				<div className="font-bold text-slate-700 text-sm">
					Sorted DataFrame
				</div>
				<div className="text-xs text-gray-600 mt-1">
					Temporal order preserved
				</div>
			</div>
			<div className="space-y-2">
				<div className="bg-green-100 border border-green-300 rounded p-2">
					<div className="text-xs font-medium text-green-700">
						P samples (正例)
					</div>
					<div className="text-xs text-green-600">
						is_positive_label = 1
					</div>
				</div>
				<div className="bg-red-100 border border-red-300 rounded p-2">
					<div className="text-xs font-medium text-red-700">
						U samples (未标记)
					</div>
					<div className="text-xs text-red-600">
						is_positive_label = 0
					</div>
				</div>
			</div>
		</div>
	);
}

function GroupSeparationNode({ data }: { data: any }) {
	const { type, color, bgColor } = data;
	return (
		<div
			className={`${bgColor} border-2 ${color} rounded-lg p-4 min-w-[180px]`}
		>
			<Handle
				type="target"
				position={Position.Left}
				id="input"
				style={{
					background: color.includes("green") ? "#059669" : "#dc2626",
				}}
			/>
			<Handle
				type="source"
				position={Position.Bottom}
				id="output"
				style={{
					background: color.includes("green") ? "#059669" : "#dc2626",
				}}
			/>
			<div className="text-center mb-3">
				<div className="text-2xl mb-1">
					{type === "P" ? "✅" : "❓"}
				</div>
				<div
					className={`font-bold text-sm ${color.replace("border-", "text-")}`}
				>
					{type} Group Data
				</div>
				<div className="text-xs text-gray-600 mt-1">
					Chronologically sorted
				</div>
			</div>
			<div className="space-y-1">
				<div className="text-xs bg-white/60 p-2 rounded border">
					70% → Training
				</div>
				<div className="text-xs bg-white/60 p-2 rounded border">
					10% → Validation
				</div>
				<div className="text-xs bg-white/60 p-2 rounded border">
					20% → Testing
				</div>
			</div>
		</div>
	);
}

function TimeSplitNode({ data }: { data: any }) {
	const { splitType, color, samples } = data;
	return (
		<div className={`${color} border-2 rounded-lg p-4 min-w-[200px]`}>
			<Handle
				type="target"
				position={Position.Top}
				id="input-p"
				style={{ background: "#059669", left: "30%" }}
			/>
			<Handle
				type="target"
				position={Position.Top}
				id="input-u"
				style={{ background: "#dc2626", left: "70%" }}
			/>
			<div className="text-center mb-3">
				<div className="text-2xl mb-1">📦</div>
				<div className="font-bold text-sm">{splitType} Set</div>
				<div className="text-xs text-gray-600 mt-1">Combined P + U</div>
			</div>
			<div className="space-y-2">
				<div className="bg-green-100 border border-green-300 rounded p-2">
					<div className="text-xs text-green-700">P: {samples.p}</div>
				</div>
				<div className="bg-red-100 border border-red-300 rounded p-2">
					<div className="text-xs text-red-700">U: {samples.u}</div>
				</div>
				<div className="bg-white/60 border rounded p-2">
					<div className="text-xs text-gray-700">
						Re-sorted by timestamp
					</div>
				</div>
			</div>
		</div>
	);
}

const stratifiedNodeTypes: NodeTypes = {
	originalData: OriginalDataNode,
	groupSeparation: GroupSeparationNode,
	timeSplit: TimeSplitNode,
};

const stratifiedNodes: Node[] = [
	{
		id: "original-data",
		type: "originalData",
		position: { x: 50, y: 200 },
		data: {},
	},
	{
		id: "p-group",
		type: "groupSeparation",
		position: { x: 350, y: 100 },
		data: {
			type: "P",
			color: "border-green-500",
			bgColor: "bg-green-50",
		},
	},
	{
		id: "u-group",
		type: "groupSeparation",
		position: { x: 350, y: 300 },
		data: {
			type: "U",
			color: "border-red-500",
			bgColor: "bg-red-50",
		},
	},
	{
		id: "train-set",
		type: "timeSplit",
		position: { x: 650, y: 50 },
		data: {
			splitType: "Training",
			color: "bg-blue-50 border-blue-500",
			samples: { p: "70% P", u: "70% U" },
		},
	},
	{
		id: "val-set",
		type: "timeSplit",
		position: { x: 650, y: 200 },
		data: {
			splitType: "Validation",
			color: "bg-yellow-50 border-yellow-500",
			samples: { p: "10% P", u: "10% U" },
		},
	},
	{
		id: "test-set",
		type: "timeSplit",
		position: { x: 650, y: 350 },
		data: {
			splitType: "Testing",
			color: "bg-purple-50 border-purple-500",
			samples: { p: "20% P", u: "20% U" },
		},
	},
];

const stratifiedEdges: Edge[] = [
	{
		id: "e1",
		source: "original-data",
		target: "p-group",
		sourceHandle: "output-p",
		targetHandle: "input",
		style: { stroke: "#059669", strokeWidth: 2 },
		markerEnd: { type: MarkerType.ArrowClosed, color: "#059669" },
		label: "P samples",
	},
	{
		id: "e2",
		source: "original-data",
		target: "u-group",
		sourceHandle: "output-u",
		targetHandle: "input",
		style: { stroke: "#dc2626", strokeWidth: 2 },
		markerEnd: { type: MarkerType.ArrowClosed, color: "#dc2626" },
		label: "U samples",
	},
	{
		id: "e3",
		source: "p-group",
		target: "train-set",
		sourceHandle: "output",
		targetHandle: "input-p",
		style: { stroke: "#059669", strokeWidth: 2 },
		markerEnd: { type: MarkerType.ArrowClosed, color: "#059669" },
	},
	{
		id: "e4",
		source: "u-group",
		target: "train-set",
		sourceHandle: "output",
		targetHandle: "input-u",
		style: { stroke: "#dc2626", strokeWidth: 2 },
		markerEnd: { type: MarkerType.ArrowClosed, color: "#dc2626" },
	},
	{
		id: "e5",
		source: "p-group",
		target: "val-set",
		sourceHandle: "output",
		targetHandle: "input-p",
		style: { stroke: "#059669", strokeWidth: 2 },
		markerEnd: { type: MarkerType.ArrowClosed, color: "#059669" },
	},
	{
		id: "e6",
		source: "u-group",
		target: "val-set",
		sourceHandle: "output",
		targetHandle: "input-u",
		style: { stroke: "#dc2626", strokeWidth: 2 },
		markerEnd: { type: MarkerType.ArrowClosed, color: "#dc2626" },
	},
	{
		id: "e7",
		source: "p-group",
		target: "test-set",
		sourceHandle: "output",
		targetHandle: "input-p",
		style: { stroke: "#059669", strokeWidth: 2 },
		markerEnd: { type: MarkerType.ArrowClosed, color: "#059669" },
	},
	{
		id: "e8",
		source: "u-group",
		target: "test-set",
		sourceHandle: "output",
		targetHandle: "input-u",
		style: { stroke: "#dc2626", strokeWidth: 2 },
		markerEnd: { type: MarkerType.ArrowClosed, color: "#dc2626" },
	},
];

export default function StratifiedTimeSplitFlow() {
	return (
		<div className="h-96 bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg border">
			<ReactFlow
				nodes={stratifiedNodes}
				edges={stratifiedEdges}
				nodeTypes={stratifiedNodeTypes}
				fitView
				attributionPosition="bottom-left"
				className="rounded-lg"
			>
				<Background color="#e2e8f0" gap={16} />
			</ReactFlow>
		</div>
	);
}
