"use client";

import { useCallback } from "react";
import ReactFlow, {
	addEdge,
	ConnectionLineType,
	type Edge,
	MarkerType,
	type Node,
	Panel,
	useEdgesState,
	useNodesState,
	type Connection,
} from "reactflow";
import "reactflow/dist/style.css";

const initialNodes: Node[] = [
	{
		id: "1",
		type: "default",
		position: { x: 50, y: 100 },
		data: {
			label: (
				<div className="text-center">
					<div className="font-semibold text-blue-600">React UI</div>
					<div className="text-xs text-slate-500">(Frontend)</div>
				</div>
			),
		},
		style: {
			background: "#e0f2fe",
			border: "2px solid #0ea5e9",
			borderRadius: "8px",
			width: 120,
			height: 60,
		},
	},
	{
		id: "2",
		type: "default",
		position: { x: 250, y: 100 },
		data: {
			label: (
				<div className="text-center">
					<div className="font-semibold text-green-600">FastAPI</div>
					<div className="text-xs text-slate-500">(Backend)</div>
				</div>
			),
		},
		style: {
			background: "#f0fdf4",
			border: "2px solid #22c55e",
			borderRadius: "8px",
			width: 120,
			height: 60,
		},
	},
	{
		id: "3",
		type: "default",
		position: { x: 450, y: 100 },
		data: {
			label: (
				<div className="text-center">
					<div className="font-semibold text-purple-600">
						SQLite DB
					</div>
					<div className="text-xs text-slate-500">(Storage)</div>
				</div>
			),
		},
		style: {
			background: "#faf5ff",
			border: "2px solid #a855f7",
			borderRadius: "8px",
			width: 120,
			height: 60,
		},
	},
	{
		id: "4",
		type: "default",
		position: { x: 250, y: 250 },
		data: {
			label: (
				<div className="text-center">
					<div className="font-semibold text-red-600">PyTorch</div>
					<div className="font-medium text-red-600">
						LSTM+PU Model
					</div>
					<div className="text-xs text-slate-500">Training</div>
				</div>
			),
		},
		style: {
			background: "#fef2f2",
			border: "2px solid #ef4444",
			borderRadius: "8px",
			width: 140,
			height: 80,
		},
	},
];

const initialEdges: Edge[] = [
	{
		id: "e1-2",
		source: "1",
		target: "2",
		type: "smoothstep",
		animated: true,
		style: { stroke: "#6366f1", strokeWidth: 2 },
		markerEnd: {
			type: MarkerType.ArrowClosed,
			color: "#6366f1",
		},
	},
	{
		id: "e2-3",
		source: "2",
		target: "3",
		type: "smoothstep",
		animated: true,
		style: { stroke: "#6366f1", strokeWidth: 2 },
		markerEnd: {
			type: MarkerType.ArrowClosed,
			color: "#6366f1",
		},
	},
	{
		id: "e2-4",
		source: "2",
		target: "4",
		type: "smoothstep",
		animated: true,
		style: { stroke: "#6366f1", strokeWidth: 2 },
		markerEnd: {
			type: MarkerType.ArrowClosed,
			color: "#6366f1",
		},
	},
	{
		id: "e1-4",
		source: "1",
		target: "4",
		type: "smoothstep",
		animated: true,
		style: { stroke: "#f59e0b", strokeWidth: 2, strokeDasharray: "5,5" },
		markerEnd: {
			type: MarkerType.ArrowClosed,
			color: "#f59e0b",
		},
		label: "WebSocket Updates",
		labelStyle: { fontSize: "10px", fill: "#f59e0b", fontWeight: "bold" },
		labelBgStyle: { fill: "#fffbeb", fillOpacity: 0.8 },
	},
	{
		id: "e4-3",
		source: "4",
		target: "3",
		type: "smoothstep",
		animated: true,
		style: { stroke: "#8b5cf6", strokeWidth: 2, strokeDasharray: "3,3" },
		markerEnd: {
			type: MarkerType.ArrowClosed,
			color: "#8b5cf6",
		},
		label: "Model Artifacts",
		labelStyle: { fontSize: "10px", fill: "#8b5cf6", fontWeight: "bold" },
		labelBgStyle: { fill: "#f5f3ff", fillOpacity: 0.8 },
	},
];

export default function SystemArchitectureFlow() {
	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

	const onConnect = useCallback(
		(params: Connection) => setEdges((eds) => addEdge(params, eds)),
		[setEdges],
	);

	return (
		<div
			style={{ width: "100%", height: "400px" }}
			className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg border"
		>
			<ReactFlow
				nodes={nodes}
				edges={edges}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onConnect={onConnect}
				connectionLineType={ConnectionLineType.SmoothStep}
				fitView
				fitViewOptions={{ padding: 0.2 }}
				attributionPosition="bottom-left"
			>
				<Panel
					position="top-left"
					className="bg-white rounded-lg shadow-md border p-3"
				>
					<h4 className="font-semibold text-slate-800 text-sm mb-2">
						System Architecture Flow
					</h4>
					<div className="space-y-1 text-xs">
						<div className="flex items-center gap-2">
							<div className="w-4 h-0.5 bg-indigo-500" />
							<span>Data Flow</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-4 h-0.5 bg-amber-500 border-dashed border-t-2 border-amber-500" />
							<span>WebSocket</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-4 h-0.5 bg-violet-500 border-dashed border-t-2 border-violet-500" />
							<span>Persistence</span>
						</div>
					</div>
				</Panel>
			</ReactFlow>
		</div>
	);
}
