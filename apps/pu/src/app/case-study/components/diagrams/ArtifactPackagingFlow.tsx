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

// Custom Node Components for Artifact Packaging
function TrainingArtifactsNode() {
	return (
		<div className="bg-blue-50 border-2 border-blue-500 rounded-lg p-4 min-w-[200px]">
			<Handle
				type="source"
				position={Position.Right}
				id="output"
				style={{ background: "#3b82f6" }}
			/>
			<div className="text-center mb-3">
				<div className="text-2xl mb-1">🏋️</div>
				<div className="font-bold text-blue-700 text-sm">
					Training Artifacts
				</div>
				<div className="text-xs text-gray-600 mt-1">
					Generated components
				</div>
			</div>
			<div className="space-y-2">
				<div className="bg-blue-100 border border-blue-300 rounded p-2">
					<div className="text-xs text-blue-700">
						model.state_dict()
					</div>
				</div>
				<div className="bg-blue-100 border border-blue-300 rounded p-2">
					<div className="text-xs text-blue-700">
						fitted StandardScaler
					</div>
				</div>
				<div className="bg-blue-100 border border-blue-300 rounded p-2">
					<div className="text-xs text-blue-700">
						model_config dict
					</div>
				</div>
				<div className="bg-blue-100 border border-blue-300 rounded p-2">
					<div className="text-xs text-blue-700">
						feature_names list
					</div>
				</div>
				<div className="bg-blue-100 border border-blue-300 rounded p-2">
					<div className="text-xs text-blue-700">training_config</div>
				</div>
			</div>
		</div>
	);
}

function PackagingProcessNode() {
	return (
		<div className="bg-purple-50 border-2 border-purple-500 rounded-lg p-4 min-w-[200px]">
			<Handle
				type="target"
				position={Position.Left}
				id="input"
				style={{ background: "#8b5cf6" }}
			/>
			<Handle
				type="source"
				position={Position.Right}
				id="output"
				style={{ background: "#8b5cf6" }}
			/>
			<div className="text-center mb-3">
				<div className="text-2xl mb-1">📦</div>
				<div className="font-bold text-purple-700 text-sm">
					Atomic Packaging
				</div>
				<div className="text-xs text-gray-600 mt-1">
					Single file operation
				</div>
			</div>
			<div className="space-y-1">
				<div className="text-xs bg-white/60 p-2 rounded border">
					artifacts = {"{"}...{"}"}
				</div>
				<div className="text-xs bg-white/60 p-2 rounded border">
					pickle.dump(artifacts, f)
				</div>
				<div className="text-xs bg-white/60 p-2 rounded border">
					complete_artifacts.pkl
				</div>
				<div className="text-xs bg-purple-100 p-2 rounded border">
					⚛️ Atomic operation
				</div>
			</div>
		</div>
	);
}

function StoredArtifactNode() {
	return (
		<div className="bg-slate-50 border-2 border-slate-500 rounded-lg p-4 min-w-[200px]">
			<Handle
				type="target"
				position={Position.Left}
				id="input"
				style={{ background: "#64748b" }}
			/>
			<Handle
				type="source"
				position={Position.Bottom}
				id="output"
				style={{ background: "#64748b" }}
			/>
			<div className="text-center mb-3">
				<div className="text-2xl mb-1">💾</div>
				<div className="font-bold text-slate-700 text-sm">
					Stored Artifact
				</div>
				<div className="text-xs text-gray-600 mt-1">
					Ready for deployment
				</div>
			</div>
			<div className="space-y-2">
				<div className="bg-slate-100 border border-slate-300 rounded p-2">
					<div className="text-xs text-slate-700 font-mono">
						complete_artifacts.pkl
					</div>
				</div>
				<div className="bg-white/60 border rounded p-2">
					<div className="text-xs text-gray-700">
						Version: PyTorch {"{torch.__version__}"}
					</div>
				</div>
				<div className="bg-white/60 border rounded p-2">
					<div className="text-xs text-gray-700">
						Created: {"{timestamp}"}
					</div>
				</div>
				<div className="text-center text-xs text-slate-600">
					🔒 Self-contained
				</div>
			</div>
		</div>
	);
}

function EvaluationProcessNode() {
	return (
		<div className="bg-amber-50 border-2 border-amber-500 rounded-lg p-4 min-w-[200px]">
			<Handle
				type="target"
				position={Position.Top}
				id="input"
				style={{ background: "#f59e0b" }}
			/>
			<Handle
				type="source"
				position={Position.Right}
				id="output"
				style={{ background: "#f59e0b" }}
			/>
			<div className="text-center mb-3">
				<div className="text-2xl mb-1">🔄</div>
				<div className="font-bold text-amber-700 text-sm">
					Reconstruction
				</div>
				<div className="text-xs text-gray-600 mt-1">
					Identical environment
				</div>
			</div>
			<div className="space-y-1">
				<div className="text-xs bg-white/60 p-2 rounded border">
					artifacts = pickle.load(f)
				</div>
				<div className="text-xs bg-white/60 p-2 rounded border">
					model = LSTMPULearningModel(**config)
				</div>
				<div className="text-xs bg-white/60 p-2 rounded border">
					model.load_state_dict(artifacts)
				</div>
				<div className="text-xs bg-amber-100 p-2 rounded border">
					🎯 Perfect reconstruction
				</div>
			</div>
		</div>
	);
}

function ReliableResultsNode() {
	return (
		<div className="bg-emerald-50 border-2 border-emerald-500 rounded-lg p-4 min-w-[200px]">
			<Handle
				type="target"
				position={Position.Left}
				id="input"
				style={{ background: "#10b981" }}
			/>
			<div className="text-center mb-3">
				<div className="text-2xl mb-1">✅</div>
				<div className="font-bold text-emerald-700 text-sm">
					Reliable Evaluation
				</div>
				<div className="text-xs text-gray-600 mt-1">
					Trustworthy metrics
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
						✓ Same preprocessing
					</div>
				</div>
				<div className="bg-emerald-100 border border-emerald-300 rounded p-2">
					<div className="text-xs text-emerald-700">
						✓ Same feature engineering
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

const artifactPackagingNodeTypes: NodeTypes = {
	trainingArtifacts: TrainingArtifactsNode,
	packaging: PackagingProcessNode,
	storedArtifact: StoredArtifactNode,
	evaluation: EvaluationProcessNode,
	reliableResults: ReliableResultsNode,
};

const artifactPackagingNodes: Node[] = [
	{
		id: "training-artifacts",
		type: "trainingArtifacts",
		position: { x: 50, y: 150 },
		data: {},
	},
	{
		id: "packaging-process",
		type: "packaging",
		position: { x: 350, y: 150 },
		data: {},
	},
	{
		id: "stored-artifact",
		type: "storedArtifact",
		position: { x: 650, y: 150 },
		data: {},
	},
	{
		id: "evaluation-process",
		type: "evaluation",
		position: { x: 650, y: 350 },
		data: {},
	},
	{
		id: "reliable-results",
		type: "reliableResults",
		position: { x: 950, y: 350 },
		data: {},
	},
];

const artifactPackagingEdges: Edge[] = [
	{
		id: "e1",
		source: "training-artifacts",
		target: "packaging-process",
		sourceHandle: "output",
		targetHandle: "input",
		style: { stroke: "#3b82f6", strokeWidth: 2 },
		markerEnd: { type: MarkerType.ArrowClosed, color: "#3b82f6" },
		label: "collect",
	},
	{
		id: "e2",
		source: "packaging-process",
		target: "stored-artifact",
		sourceHandle: "output",
		targetHandle: "input",
		style: { stroke: "#8b5cf6", strokeWidth: 2 },
		markerEnd: { type: MarkerType.ArrowClosed, color: "#8b5cf6" },
		label: "save",
	},
	{
		id: "e3",
		source: "stored-artifact",
		target: "evaluation-process",
		sourceHandle: "output",
		targetHandle: "input",
		style: { stroke: "#64748b", strokeWidth: 2 },
		markerEnd: { type: MarkerType.ArrowClosed, color: "#64748b" },
		label: "load",
	},
	{
		id: "e4",
		source: "evaluation-process",
		target: "reliable-results",
		sourceHandle: "output",
		targetHandle: "input",
		style: { stroke: "#f59e0b", strokeWidth: 2 },
		markerEnd: { type: MarkerType.ArrowClosed, color: "#f59e0b" },
		label: "evaluate",
	},
];

export default function ArtifactPackagingFlow() {
	return (
		<div className="h-96 bg-gradient-to-br from-blue-50 to-emerald-50 rounded-lg border">
			<ReactFlow
				nodes={artifactPackagingNodes}
				edges={artifactPackagingEdges}
				nodeTypes={artifactPackagingNodeTypes}
				fitView
				attributionPosition="bottom-left"
				className="rounded-lg"
			>
				<Background color="#e2e8f0" gap={16} />
			</ReactFlow>
		</div>
	);
}
