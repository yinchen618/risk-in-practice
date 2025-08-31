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

// Custom Node Components for Model Consistency
function SharedModelDefinitionNode() {
	return (
		<div className="bg-indigo-50 border-2 border-indigo-500 rounded-lg p-4 min-w-[250px]">
			<Handle
				type="source"
				position={Position.Bottom}
				id="output-trainer"
				style={{ background: "#6366f1", left: "30%" }}
			/>
			<Handle
				type="source"
				position={Position.Bottom}
				id="output-evaluator"
				style={{ background: "#6366f1", left: "70%" }}
			/>
			<div className="text-center mb-3">
				<div className="text-2xl mb-1">📝</div>
				<div className="font-bold text-indigo-700 text-sm">
					shared_models.py
				</div>
				<div className="text-xs text-gray-600 mt-1">
					Single source of truth
				</div>
			</div>
			<div className="space-y-2">
				<div className="bg-indigo-100 border border-indigo-300 rounded p-2">
					<div className="text-xs text-indigo-700 font-mono">
						class LSTMPULearningModel
					</div>
				</div>
				<div className="bg-white/60 border rounded p-2">
					<div className="text-xs text-gray-700">
						input_size=7, hidden_size=64
					</div>
				</div>
				<div className="bg-white/60 border rounded p-2">
					<div className="text-xs text-gray-700">
						num_layers=2, sequence_length=60
					</div>
				</div>
				<div className="bg-white/60 border rounded p-2">
					<div className="text-xs text-gray-700">
						LSTM + Dropout + Linear
					</div>
				</div>
			</div>
		</div>
	);
}

function ComponentNode({ data }: { data: any }) {
	const { title, role, color, bgColor, operations } = data;
	return (
		<div
			className={`${bgColor} border-2 ${color} rounded-lg p-4 min-w-[200px]`}
		>
			<Handle
				type="target"
				position={Position.Top}
				id="input"
				style={{
					background: color.includes("green") ? "#22c55e" : "#f59e0b",
				}}
			/>
			<Handle
				type="source"
				position={Position.Bottom}
				id="output"
				style={{
					background: color.includes("green") ? "#22c55e" : "#f59e0b",
				}}
			/>
			<div className="text-center mb-3">
				<div className="text-2xl mb-1">
					{color.includes("green") ? "🏋️" : "📊"}
				</div>
				<div
					className={`font-bold text-sm ${color.replace("border-", "text-")}`}
				>
					{title}
				</div>
				<div className="text-xs text-gray-600 mt-1">{role}</div>
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

function ConsistencyValidationNode() {
	return (
		<div className="bg-emerald-50 border-2 border-emerald-500 rounded-lg p-4 min-w-[250px]">
			<Handle
				type="target"
				position={Position.Top}
				id="input-trainer"
				style={{ background: "#10b981", left: "30%" }}
			/>
			<Handle
				type="target"
				position={Position.Top}
				id="input-evaluator"
				style={{ background: "#10b981", left: "70%" }}
			/>
			<div className="text-center mb-3">
				<div className="text-2xl mb-1">✅</div>
				<div className="font-bold text-emerald-700 text-sm">
					Architecture Consistency
				</div>
				<div className="text-xs text-gray-600 mt-1">
					Guaranteed by design
				</div>
			</div>
			<div className="space-y-2">
				<div className="bg-emerald-100 border border-emerald-300 rounded p-2">
					<div className="text-xs text-emerald-700">
						✓ Same model architecture
					</div>
				</div>
				<div className="bg-emerald-100 border border-emerald-300 rounded p-2">
					<div className="text-xs text-emerald-700">
						✓ Same forward() logic
					</div>
				</div>
				<div className="bg-emerald-100 border border-emerald-300 rounded p-2">
					<div className="text-xs text-emerald-700">
						✓ Same initialization
					</div>
				</div>
				<div className="bg-emerald-100 border border-emerald-300 rounded p-2">
					<div className="text-xs text-emerald-700">
						✓ Reproducible results
					</div>
				</div>
			</div>
		</div>
	);
}

const modelConsistencyNodeTypes: NodeTypes = {
	sharedModel: SharedModelDefinitionNode,
	component: ComponentNode,
	validation: ConsistencyValidationNode,
};

const modelConsistencyNodes: Node[] = [
	{
		id: "shared-model",
		type: "sharedModel",
		position: { x: 300, y: 50 },
		data: {},
	},
	{
		id: "trainer",
		type: "component",
		position: { x: 150, y: 250 },
		data: {
			title: "Model Trainer",
			role: "Training phase",
			color: "border-green-500",
			bgColor: "bg-green-50",
			operations: [
				"from shared_models import LSTMPULearningModel",
				"model = LSTMPULearningModel(...)",
				"train with nnPU loss",
				"save state_dict + config",
			],
		},
	},
	{
		id: "evaluator",
		type: "component",
		position: { x: 550, y: 250 },
		data: {
			title: "Model Evaluator",
			role: "Evaluation phase",
			color: "border-amber-500",
			bgColor: "bg-amber-50",
			operations: [
				"from shared_models import LSTMPULearningModel",
				"model = LSTMPULearningModel(...)",
				"load_state_dict(artifacts)",
				"evaluate on test data",
			],
		},
	},
	{
		id: "consistency-validation",
		type: "validation",
		position: { x: 325, y: 450 },
		data: {},
	},
];

const modelConsistencyEdges: Edge[] = [
	{
		id: "e1",
		source: "shared-model",
		target: "trainer",
		sourceHandle: "output-trainer",
		targetHandle: "input",
		style: { stroke: "#6366f1", strokeWidth: 2 },
		markerEnd: { type: MarkerType.ArrowClosed, color: "#6366f1" },
		label: "import",
	},
	{
		id: "e2",
		source: "shared-model",
		target: "evaluator",
		sourceHandle: "output-evaluator",
		targetHandle: "input",
		style: { stroke: "#6366f1", strokeWidth: 2 },
		markerEnd: { type: MarkerType.ArrowClosed, color: "#6366f1" },
		label: "import",
	},
	{
		id: "e3",
		source: "trainer",
		target: "consistency-validation",
		sourceHandle: "output",
		targetHandle: "input-trainer",
		style: { stroke: "#22c55e", strokeWidth: 2 },
		markerEnd: { type: MarkerType.ArrowClosed, color: "#22c55e" },
	},
	{
		id: "e4",
		source: "evaluator",
		target: "consistency-validation",
		sourceHandle: "output",
		targetHandle: "input-evaluator",
		style: { stroke: "#f59e0b", strokeWidth: 2 },
		markerEnd: { type: MarkerType.ArrowClosed, color: "#f59e0b" },
	},
];

export default function ModelConsistencyFlow() {
	return (
		<div className="h-96 bg-gradient-to-br from-indigo-50 to-emerald-50 rounded-lg border">
			<ReactFlow
				nodes={modelConsistencyNodes}
				edges={modelConsistencyEdges}
				nodeTypes={modelConsistencyNodeTypes}
				fitView
				attributionPosition="bottom-left"
				className="rounded-lg"
			>
				<Background color="#e2e8f0" gap={16} />
			</ReactFlow>
		</div>
	);
}
