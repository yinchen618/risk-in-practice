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

// Custom Node Components for Time Series Sanctity
function TimeSeriesDataNode() {
	return (
		<div className="bg-blue-50 border-2 border-blue-400 rounded-lg p-4 min-w-[200px]">
			<Handle
				type="source"
				position={Position.Bottom}
				id="output"
				style={{ background: "#3b82f6" }}
			/>
			<div className="text-center mb-3">
				<div className="text-2xl mb-1">📊</div>
				<div className="font-bold text-blue-700 text-sm">
					Raw Time Series Data
				</div>
			</div>
			<div className="space-y-2">
				<div className="bg-blue-100 border border-blue-300 rounded p-2">
					<div className="text-xs font-medium text-blue-800">
						t₁: 2024-01-01 00:00:00
					</div>
				</div>
				<div className="bg-blue-100 border border-blue-300 rounded p-2">
					<div className="text-xs font-medium text-blue-800">
						t₂: 2024-01-01 00:01:00
					</div>
				</div>
				<div className="bg-blue-100 border border-blue-300 rounded p-2">
					<div className="text-xs font-medium text-blue-800">
						t₃: 2024-01-01 00:02:00
					</div>
				</div>
				<div className="text-center text-xs text-blue-600">
					⏰ Chronological Order
				</div>
			</div>
		</div>
	);
}

function SortingNode() {
	return (
		<div className="bg-indigo-50 border-2 border-indigo-500 rounded-lg p-4 min-w-[200px]">
			<Handle
				type="target"
				position={Position.Top}
				id="input"
				style={{ background: "#6366f1" }}
			/>
			<Handle
				type="source"
				position={Position.Bottom}
				id="output"
				style={{ background: "#6366f1" }}
			/>
			<div className="text-center mb-3">
				<div className="text-2xl mb-1">🔄</div>
				<div className="font-bold text-indigo-700 text-sm">
					Global Temporal Sorting
				</div>
				<div className="text-xs text-gray-600 mt-1">
					Sacred First Step
				</div>
			</div>
			<div className="space-y-1">
				<div className="text-xs bg-white/60 p-2 rounded border">
					df.sort_values('timestamp')
				</div>
				<div className="text-xs bg-white/60 p-2 rounded border">
					reset_index(drop=True)
				</div>
				<div className="text-xs bg-white/60 p-2 rounded border">
					Preserve chronological integrity
				</div>
			</div>
		</div>
	);
}

function ProtectedDataNode() {
	return (
		<div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 min-w-[200px]">
			<Handle
				type="target"
				position={Position.Top}
				id="input"
				style={{ background: "#22c55e" }}
			/>
			<div className="text-center mb-3">
				<div className="text-2xl mb-1">🛡️</div>
				<div className="font-bold text-green-700 text-sm">
					Temporally Protected
				</div>
				<div className="text-xs text-gray-600 mt-1">
					Inviolable Order
				</div>
			</div>
			<div className="space-y-2">
				<div className="bg-green-100 border border-green-300 rounded p-2">
					<div className="text-xs text-green-600">
						✅ No shuffling allowed
					</div>
				</div>
				<div className="bg-green-100 border border-green-300 rounded p-2">
					<div className="text-xs text-green-600">
						✅ Time causality preserved
					</div>
				</div>
				<div className="bg-green-100 border border-green-300 rounded p-2">
					<div className="text-xs text-green-600">
						✅ Future cannot predict past
					</div>
				</div>
			</div>
		</div>
	);
}

const timeSeriesNodeTypes: NodeTypes = {
	timeSeriesData: TimeSeriesDataNode,
	sorting: SortingNode,
	protected: ProtectedDataNode,
};

const timeSeriesNodes: Node[] = [
	{
		id: "raw-timeseries",
		type: "timeSeriesData",
		position: { x: 250, y: 50 },
		data: {},
	},
	{
		id: "global-sorting",
		type: "sorting",
		position: { x: 250, y: 220 },
		data: {},
	},
	{
		id: "protected-data",
		type: "protected",
		position: { x: 250, y: 390 },
		data: {},
	},
];

const timeSeriesEdges: Edge[] = [
	{
		id: "e1",
		source: "raw-timeseries",
		target: "global-sorting",
		sourceHandle: "output",
		targetHandle: "input",
		style: { stroke: "#3b82f6", strokeWidth: 2 },
		markerEnd: { type: MarkerType.ArrowClosed, color: "#3b82f6" },
	},
	{
		id: "e2",
		source: "global-sorting",
		target: "protected-data",
		sourceHandle: "output",
		targetHandle: "input",
		style: { stroke: "#6366f1", strokeWidth: 2 },
		markerEnd: { type: MarkerType.ArrowClosed, color: "#6366f1" },
	},
];

export default function TimeSeriesSanctityFlow() {
	return (
		<div className="h-96 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border">
			<ReactFlow
				nodes={timeSeriesNodes}
				edges={timeSeriesEdges}
				nodeTypes={timeSeriesNodeTypes}
				fitView
				attributionPosition="bottom-left"
				className="rounded-lg"
			>
				<Background color="#e2e8f0" gap={16} />
			</ReactFlow>
		</div>
	);
}
