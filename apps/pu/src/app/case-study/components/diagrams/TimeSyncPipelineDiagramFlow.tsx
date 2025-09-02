"use client";

import {
	Background,
	type Edge,
	Handle,
	type Node,
	type NodeTypes,
	Position,
	ReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

// Custom Node Components
function RawDataNode() {
	return (
		<div className="bg-red-50 border-2 border-red-400 rounded-lg p-4 min-w-[200px]">
			<Handle
				type="source"
				position={Position.Bottom}
				id="output"
				style={{ background: "#ef4444" }}
			/>
			<div className="text-center mb-3">
				<div className="font-bold text-red-700 text-sm">
					Unsynchronized Raw Data
				</div>
			</div>
			<div className="space-y-2">
				<div className="bg-red-100 border border-red-300 rounded p-2">
					<div className="text-xs font-medium text-red-800">
						Meter A: 10:00:01, 10:01:03, 10:02:05...
					</div>
				</div>
				<div className="bg-red-100 border border-red-300 rounded p-2">
					<div className="text-xs font-medium text-red-800">
						Meter B: 10:00:58, 10:01:56, 10:02:59...
					</div>
				</div>
			</div>
			<div className="text-center mt-2 text-xs text-red-600">
				❌ Clock drift & network latency
			</div>
		</div>
	);
}

function ProcessingStepNode({ data }: { data: any }) {
	const { title, description, items, color, icon } = data;
	return (
		<div className={`border-2 rounded-lg p-4 min-w-[200px] ${color}`}>
			<Handle
				type="target"
				position={Position.Top}
				id="input-top"
				style={{ background: "#374151" }}
			/>
			<Handle
				type="target"
				position={Position.Left}
				id="input"
				style={{ background: "#374151" }}
			/>
			<Handle
				type="source"
				position={Position.Right}
				id="output"
				style={{ background: "#374151" }}
			/>
			<Handle
				type="source"
				position={Position.Bottom}
				id="output-bottom"
				style={{ background: "#374151" }}
			/>
			<div className="text-center mb-3">
				<div className="text-2xl mb-1">{icon}</div>
				<div className="font-bold text-sm">{title}</div>
				<div className="text-xs text-gray-600 mt-1">{description}</div>
			</div>
			<div className="space-y-1">
				{items.map((item: string, index: number) => (
					<div
						key={index}
						className="text-xs bg-white/60 p-2 rounded border"
					>
						{item}
					</div>
				))}
			</div>
		</div>
	);
}

function OutputNode() {
	return (
		<div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 min-w-[250px]">
			<Handle
				type="target"
				position={Position.Left}
				id="input"
				style={{ background: "#22c55e", border: "none" }}
			/>
			<div className="text-center mb-3">
				<div className="text-2xl mb-1">✅</div>
				<div className="font-bold text-green-800 text-sm">
					Synchronized Data
				</div>
				<div className="text-xs text-gray-600 mt-1">
					Ready for Analysis
				</div>
			</div>
			<div className="space-y-2">
				<div className="bg-green-100 border border-green-300 rounded p-2">
					<div className="text-xs font-medium text-green-800">
						10:00:00, 10:01:00, 10:02:00...
					</div>
				</div>
				<div className="bg-green-100 border border-green-300 rounded p-2">
					<div className="text-xs text-green-600">
						Complete time coverage
					</div>
				</div>
				<div className="bg-green-100 border border-green-300 rounded p-2">
					<div className="text-xs text-green-600">
						No missing values
					</div>
				</div>
			</div>
		</div>
	);
}

const nodeTypes: NodeTypes = {
	rawData: RawDataNode,
	processingStep: ProcessingStepNode,
	output: OutputNode,
};

const initialNodes: Node[] = [
	{
		id: "raw-data",
		type: "rawData",
		position: { x: 300, y: 30 },
		data: {},
	},
	{
		id: "step-1",
		type: "processingStep",
		position: { x: 150, y: 250 },
		data: {
			title: "Time Bucketing",
			description: "1-minute intervals",
			icon: "🕐",
			items: [
				"Round timestamps to minute boundaries",
				"Create uniform time windows",
				"Group readings by time bucket",
			],
			color: "bg-yellow-50 border-yellow-500 text-yellow-800",
		},
	},
	{
		id: "step-2",
		type: "processingStep",
		position: { x: 500, y: 250 },
		data: {
			title: "Aggregation",
			description: "Average within buckets",
			icon: "📊",
			items: [
				"Calculate mean values per bucket",
				"Remove outliers and noise",
				"Reduce data volume",
			],
			color: "bg-purple-50 border-purple-500 text-purple-800",
		},
	},
	{
		id: "step-3",
		type: "processingStep",
		position: { x: 820, y: 250 },
		data: {
			title: "Re-indexing",
			description: "Complete time grid",
			icon: "🔄",
			items: [
				"Create complete minute sequence",
				"Identify missing time points",
				"Establish master time index",
			],
			color: "bg-indigo-50 border-indigo-500 text-indigo-800",
		},
	},
	{
		id: "step-4",
		type: "processingStep",
		position: { x: 160, y: 550 },
		data: {
			title: "Interpolation",
			description: "Fill missing values",
			icon: "📈",
			items: [
				"Linear interpolation for gaps",
				"Forward/backward fill",
				"Quality validation checks",
			],
			color: "bg-teal-50 border-teal-500 text-teal-800",
		},
	},
	{
		id: "step-5",
		type: "processingStep",
		position: { x: 480, y: 550 },
		data: {
			title: "Validation",
			description: "Quality checks",
			icon: "✅",
			items: [
				"Data completeness verification",
				"Outlier detection and flagging",
				"Consistency validation",
			],
			color: "bg-cyan-50 border-cyan-500 text-cyan-800",
		},
	},
	{
		id: "output",
		type: "output",
		position: { x: 820, y: 550 },
		data: {},
	},
];

const initialEdges: Edge[] = [
	{
		id: "raw-to-step1",
		source: "raw-data",
		target: "step-1",
		sourceHandle: "output",
		targetHandle: "input-top",
		style: { stroke: "#374151", strokeWidth: 3 },
		label: "Step 1",
		labelStyle: { fill: "#374151", fontWeight: "bold", fontSize: "12px" },
	},
	{
		id: "step1-to-step2",
		source: "step-1",
		target: "step-2",
		sourceHandle: "output",
		targetHandle: "input",
		style: { stroke: "#374151", strokeWidth: 3 },
		label: "Step 2",
		labelStyle: { fill: "#374151", fontWeight: "bold", fontSize: "12px" },
	},
	{
		id: "step2-to-step3",
		source: "step-2",
		target: "step-3",
		sourceHandle: "output",
		targetHandle: "input",
		style: { stroke: "#374151", strokeWidth: 3 },
		label: "Step 3",
		labelStyle: { fill: "#374151", fontWeight: "bold", fontSize: "12px" },
	},
	{
		id: "step3-to-step4",
		source: "step-3",
		target: "step-4",
		sourceHandle: "output-bottom",
		targetHandle: "input-top",
		style: { stroke: "#374151", strokeWidth: 3 },
		label: "Step 4",
		labelStyle: { fill: "#374151", fontWeight: "bold", fontSize: "12px" },
	},
	{
		id: "step4-to-step5",
		source: "step-4",
		target: "step-5",
		sourceHandle: "output",
		targetHandle: "input",
		style: { stroke: "#374151", strokeWidth: 3 },
		label: "Step 5",
		labelStyle: { fill: "#374151", fontWeight: "bold", fontSize: "12px" },
	},
	{
		id: "step5-to-output",
		source: "step-5",
		target: "output",
		sourceHandle: "output",
		targetHandle: "input",
		style: { stroke: "#22c55e", strokeWidth: 4 },
		label: "Complete!",
		labelStyle: { fill: "#22c55e", fontWeight: "bold", fontSize: "12px" },
	},
];

export function TimeSyncPipelineDiagramFlow({
	className = "",
}: { className?: string }) {
	return (
		<div className={`w-full ${className}`}>
			{/* React Flow 圖表 */}
			<div className="h-[900px] w-full border border-gray-200 rounded-lg mb-6">
				<ReactFlow
					nodes={initialNodes}
					edges={initialEdges}
					nodeTypes={nodeTypes}
					fitView
					minZoom={0.3}
					maxZoom={1.5}
					defaultViewport={{ x: 0, y: 0, zoom: 0.6 }}
					nodesDraggable={false}
					elementsSelectable={false}
					panOnDrag={false}
					zoomOnScroll={false}
					zoomOnPinch={false}
				>
					<Background color="#f1f5f9" gap={20} />
					{/* <Controls /> */}
					{/* <MiniMap
						nodeColor={(node) => {
							switch (node.type) {
								case "rawData":
									return "#fca5a5";
								case "processingStep":
									return "#a78bfa";
								case "output":
									return "#4ade80";
								case "pipelineInfo":
									return "#e2e8f0";
								default:
									return "#9ca3af";
							}
						}}
						className="bg-white border border-gray-300"
					/> */}
				</ReactFlow>
			</div>

			{/* 文字區塊說明 */}
			<div className="mt-4 text-slate-700">
				<p className="mb-2">
					My ETL pipeline effectively addresses the time-alignment
					hurdle by implementing a series of robust synchronization
					techniques.
				</p>
				<p className="mb-6">
					Through temporal bucketing, clock drift compensation, and
					advanced interpolation methods, I ensure that all meter
					readings are aligned to a common timeline, enabling accurate
					and reliable analysis.
				</p>

				{/* 詳細技術資訊區塊 */}
				<div className="grid md:grid-cols-3 gap-6 mt-6">
					{/* Pipeline Benefits */}
					<div className="bg-blue-50 border border-blue-300 rounded-lg p-4">
						<h4 className="font-bold text-blue-800 mb-3">
							Pipeline Benefits:
						</h4>
						<ul className="text-sm text-blue-700 space-y-1">
							<li>• Eliminates clock drift issues</li>
							<li>• Ensures consistent time intervals</li>
							<li>• Handles missing data gracefully</li>
							<li>• Maintains data integrity throughout</li>
						</ul>
					</div>

					{/* Technical Implementation */}
					<div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
						<h4 className="font-bold text-gray-800 mb-3">
							Technical Implementation:
						</h4>
						<ul className="text-sm text-gray-700 space-y-1">
							<li>• Pandas DataFrame operations</li>
							<li>• GroupBy and Resample functions</li>
							<li>• Configurable interpolation methods</li>
							<li>• Automated quality validation</li>
						</ul>
					</div>

					{/* Performance Metrics */}
					{/* <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-4">
						<h4 className="font-bold text-emerald-800 mb-3">
							Performance Metrics:
						</h4>
						<ul className="text-sm text-emerald-700 space-y-1">
							<li>• Processing time: ~2-3 seconds per day</li>
							<li>• Memory usage: &lt; 500MB for 24h data</li>
							<li>• Data accuracy: 99.7% retention rate</li>
							<li>• Scalability: Handles 1000+ meters</li>
						</ul>
					</div> */}
					{/* Data Quality Assurance */}
					<div className="bg-orange-50 border border-orange-300 rounded-lg p-4">
						<h4 className="font-bold text-orange-800 mb-3">
							Data Quality Assurance:
						</h4>
						<ul className="text-sm text-orange-700 space-y-1">
							<li>• Real-time anomaly detection</li>
							<li>• Statistical outlier filtering</li>
							<li>• Cross-meter validation checks</li>
							<li>• Automated data healing protocols</li>
						</ul>
					</div>
				</div>

				{/* 第二排技術資訊區塊 */}
				<div className="grid md:grid-cols-2 gap-6 mt-6 hidden">
					{/* Data Quality Assurance */}
					<div className="bg-orange-50 border border-orange-300 rounded-lg p-4">
						<h4 className="font-bold text-orange-800 mb-3">
							Data Quality Assurance:
						</h4>
						<ul className="text-sm text-orange-700 space-y-1">
							<li>• Real-time anomaly detection</li>
							<li>• Statistical outlier filtering</li>
							<li>• Cross-meter validation checks</li>
							<li>• Automated data healing protocols</li>
						</ul>
					</div>

					{/* Scalability Features */}
					<div className="bg-violet-50 border border-violet-300 rounded-lg p-4">
						<h4 className="font-bold text-violet-800 mb-3">
							Scalability Features:
						</h4>
						<ul className="text-sm text-violet-700 space-y-1">
							<li>• Distributed processing support</li>
							<li>• Horizontal scaling capabilities</li>
							<li>• Load balancing mechanisms</li>
							<li>• Cloud-native architecture</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
