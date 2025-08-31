"use client";

import {
	Background,
	Controls,
	type Edge,
	Handle,
	MarkerType,
	type Node,
	type NodeTypes,
	Position,
	ReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

// 時間序列節點 - 展示原始PU分布
function TimeSeriesNode() {
	// 調整為 P 樣本都集中在前面（訓練集），後面都是 U 樣本
	const samples = [
		"P",
		"U",
		"P",
		"U",
		"U",
		"P",
		"U",
		"U",
		"U",
		"U",
		"U",
		"U",
		"U",
		"U",
		"U",
	]; // 總共 15 個樣本: 3個P在前面, 12個U在後面

	return (
		<div className="bg-slate-50 border-2 border-slate-400 rounded-lg p-6 min-w-[800px] shadow-md">
			<Handle
				type="source"
				position={Position.Bottom}
				id="method1"
				style={{ left: "40%" }}
			/>
			<Handle
				type="source"
				position={Position.Bottom}
				id="method2"
				style={{ left: "60%" }}
			/>
			<div className="text-center mb-6">
				<div className="font-bold text-slate-700 text-2xl mb-2">
					Original Time Series Dataset (Chronologically Ordered)
				</div>
				<div className="text-lg text-slate-600 mb-4">
					P = Positive Sample, U = Unlabeled Sample (P is rare)
				</div>
			</div>
			<div className="relative">
				{/* 時間軸 */}
				<div className="flex items-center justify-between mb-3">
					<span className="text-lg text-slate-500">T0</span>
					<span className="text-lg text-slate-500">Time Axis →</span>
					<span className="text-lg text-slate-500">T15</span>
				</div>
				{/* 樣本序列 */}
				<div className="flex gap-2 justify-center">
					{samples.map((sample, index) => (
						<div
							key={index}
							className={`w-12 h-12 flex items-center justify-center text-lg font-bold rounded ${
								sample === "P"
									? "bg-blue-100 text-blue-700 border border-blue-300"
									: "bg-amber-100 text-amber-700 border border-amber-300"
							}`}
						>
							{sample}
						</div>
					))}
				</div>
				<div className="flex justify-between text-lg text-slate-500 mt-2">
					{Array.from({ length: 16 }, (_, i) => (
						<span key={i} className="w-12 text-center">
							{i}
						</span>
					))}
				</div>
			</div>
		</div>
	);
}

// 方法一切割展示
function Method1SplitNode() {
	// 根據 TimeSeriesNode 的調整，重新定義樣本序列
	const samples = [
		"P",
		"U",
		"P",
		"U",
		"U",
		"P",
		"U",
		"U",
		"U",
		"U",
		"U",
		"U",
		"U",
		"U",
		"U",
	];
	const trainEnd = 10; // 70%
	const valEnd = 13; // 20%

	// 計算各分區的 P/U 數量
	const getCounts = (start: number, end: number) => {
		let p = 0;
		let u = 0;
		for (let i = start; i < end; i++) {
			if (samples[i] === "P") {
				p++;
			} else {
				u++;
			}
		}
		return { p, u };
	};

	const trainCounts = getCounts(0, trainEnd); // 索引 0-9: P,U,P,U,U,P,U,U,U,U
	const valCounts = getCounts(trainEnd, valEnd); // 索引 10-12: U,U,U
	const testCounts = getCounts(valEnd, samples.length); // 索引 13-14: U,U

	return (
		<div className="bg-red-50 border-2 border-red-400 rounded-lg p-6 min-w-[800px] shadow-md h-66">
			<Handle
				type="target"
				position={Position.Top}
				style={{ left: "40%" }}
			/>
			<Handle type="source" position={Position.Right} />
			<div className="text-center mb-6">
				<div className="font-bold text-red-600 text-2xl mb-2">
					Method 1: Direct Time-based Split
				</div>
				<div className="text-lg text-red-500 mb-4">
					Problem: May produce validation/test sets with only one
					class
				</div>
			</div>
			<div className="space-y-4">
				{/* 分割線示意 */}
				<div className="relative">
					<div className="flex gap-2 justify-center">
						{samples.map((sample, index) => (
							<div
								key={index}
								className={`w-12 h-12 flex items-center justify-center text-lg font-bold rounded ${
									index < trainEnd
										? sample === "P"
											? "bg-green-100 text-green-700 border border-green-300"
											: "bg-green-50 text-green-600 border border-green-200"
										: index < valEnd
											? sample === "P"
												? "bg-yellow-100 text-yellow-700 border border-yellow-300"
												: "bg-yellow-50 text-yellow-600 border border-yellow-200"
											: sample === "P"
												? "bg-purple-100 text-purple-700 border border-purple-300"
												: "bg-purple-50 text-purple-600 border border-purple-200"
								}`}
							>
								{sample}
							</div>
						))}
					</div>
					{/* 分割線 */}
					<div
						className="absolute top-0 h-12 border-l-2 border-dashed border-slate-400"
						style={{
							left: `${(trainEnd / samples.length) * 100}%`,
						}}
					/>
					<div
						className="absolute top-0 h-12 border-l-2 border-dashed border-slate-400"
						style={{ left: `${(valEnd / samples.length) * 100}%` }}
					/>
				</div>
				{/* 標籤 */}
				<div className="relative">
					<div className="absolute w-full flex">
						<div
							className="text-center"
							style={{
								width: `${(trainEnd / samples.length) * 100}%`,
								left: 0,
							}}
						>
							<div className="font-bold text-green-600">
								Train (67%)
							</div>
							<div className="text-green-600">
								P: {trainCounts.p}, U: {trainCounts.u} ✅
							</div>
						</div>

						{/* Val 標籤 */}
						<div
							className="text-center"
							style={{
								width: `${((valEnd - trainEnd) / samples.length) * 100}%`,
							}}
						>
							<div className="font-bold text-yellow-600">
								Val (20%)
							</div>
							<div className="text-red-500">
								P: {valCounts.p}, U: {valCounts.u} ❌ <br />
								(U-only)
							</div>
						</div>

						{/* Test 標籤 */}
						<div
							className="text-center"
							style={{
								width: `${((samples.length - valEnd) / samples.length) * 100}%`,
							}}
						>
							<div className="font-bold text-purple-600">
								Test (13%)
							</div>
							<div className="text-red-500">
								P: {testCounts.p}, U: {testCounts.u} ❌ <br />
								(U-only)
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

// 方法二切割展示
function Method2SplitNode() {
	// 根據 TimeSeriesNode 的調整，重新定義 P 和 U 樣本的時間位置
	const pSamples = [0, 2, 5]; // 3個P樣本的位置 (都在前面)
	const uSamples = [1, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14]; // 12個U樣本的位置

	// 計算各分區的 P/U 數量
	const getSplitCounts = (total: number, ratios: number[]) => {
		const trainCount = Math.floor(total * ratios[0]);
		const valCount = Math.floor(total * ratios[1]);
		const testCount = total - trainCount - valCount;
		return { train: trainCount, val: valCount, test: testCount };
	};

	const ratios = [0.7, 0.1, 0.2]; // 訓練、驗證、測試的比例
	const pSplitCounts = getSplitCounts(pSamples.length, ratios); // P: 3 * 0.7 = 2.1 -> 2; 3 * 0.2 = 0.6 -> 0; 3 - 2 - 0 = 1
	const uSplitCounts = getSplitCounts(uSamples.length, ratios); // U: 12 * 0.7 = 8.4 -> 8; 12 * 0.2 = 2.4 -> 2; 12 - 8 - 2 = 2

	return (
		<div className="bg-green-50 border-2 border-green-400 rounded-lg p-6 min-w-[800px] shadow-md">
			<Handle
				type="target"
				position={Position.Top}
				style={{ left: "66%" }}
			/>
			<Handle type="source" position={Position.Right} />
			<div className="text-center mb-6">
				<div className="font-bold text-green-600 text-2xl mb-2">
					Method 2: Stratified Time-based Split
				</div>
				<div className="text-lg text-green-500 mb-4">
					Solution: Split P and U samples separately, then recombine
				</div>
			</div>
			<div className="space-y-5">
				{/* P樣本分割 */}
				<div>
					<div className="text-lg font-semibold text-blue-700 mb-2">
						1. P Sample Time-based Split (
						{Math.round(ratios[0] * 100)}% /{" "}
						{Math.round(ratios[1] * 100)}% /{" "}
						{Math.round(ratios[2] * 100)}%)
					</div>
					<div className="flex gap-2 justify-start items-center">
						{Array(pSplitCounts.train)
							.fill("P")
							.map((_, idx) => (
								<div
									key={`p_train_${idx}`}
									className="w-12 h-10 flex items-center justify-center text-lg font-bold rounded bg-green-100 text-green-700 border border-green-300"
								>
									P
								</div>
							))}
						{Array(pSplitCounts.val)
							.fill("P")
							.map((_, idx) => (
								<div
									key={`p_val_${idx}`}
									className="w-12 h-10 flex items-center justify-center text-lg font-bold rounded bg-yellow-100 text-yellow-700 border border-yellow-300"
								>
									P
								</div>
							))}
						{Array(pSplitCounts.test)
							.fill("P")
							.map((_, idx) => (
								<div
									key={`p_test_${idx}`}
									className="w-12 h-10 flex items-center justify-center text-lg font-bold rounded bg-purple-100 text-purple-700 border border-purple-300"
								>
									P
								</div>
							))}
						<span className="text-lg text-slate-500 ml-3">
							({pSamples.length} P samples total)
						</span>
					</div>
				</div>

				{/* U樣本分割 */}
				<div>
					<div className="text-lg font-semibold text-amber-700 mb-2">
						2. U Sample Time-based Split (
						{Math.round(ratios[0] * 100)}% /{" "}
						{Math.round(ratios[1] * 100)}% /{" "}
						{Math.round(ratios[2] * 100)}%)
					</div>
					<div className="flex gap-2 justify-start items-center">
						{Array(uSplitCounts.train)
							.fill("U")
							.map((_, idx) => (
								<div
									key={`u_train_${idx}`}
									className="w-12 h-10 flex items-center justify-center text-lg font-bold rounded bg-green-50 text-green-600 border border-green-200"
								>
									U
								</div>
							))}
						{Array(uSplitCounts.val)
							.fill("U")
							.map((_, idx) => (
								<div
									key={`u_val_${idx}`}
									className="w-12 h-10 flex items-center justify-center text-lg font-bold rounded bg-yellow-50 text-yellow-600 border border-yellow-200"
								>
									U
								</div>
							))}
						{Array(uSplitCounts.test)
							.fill("U")
							.map((_, idx) => (
								<div
									key={`u_test_${idx}`}
									className="w-12 h-10 flex items-center justify-center text-lg font-bold rounded bg-purple-50 text-purple-600 border border-purple-200"
								>
									U
								</div>
							))}
						<span className="text-lg text-slate-500 ml-3">
							({uSamples.length} U samples total)
						</span>
					</div>
				</div>

				{/* 合併結果 */}
				<div>
					<div className="text-lg font-semibold text-slate-700 mb-2">
						3. Recombine and Sort by Time
					</div>
					<div className="flex justify-between text-lg">
						<div className="flex-1 text-center">
							<div className="font-bold text-green-600">
								Train
							</div>
							<div className="text-green-600">
								P: {pSplitCounts.train}, U: {uSplitCounts.train}{" "}
								✅
							</div>
						</div>
						<div className="flex-1 text-center">
							<div className="font-bold text-yellow-600">Val</div>
							<div className="text-green-600">
								P: {pSplitCounts.val}, U: {uSplitCounts.val} ✅
							</div>
						</div>
						<div className="flex-1 text-center">
							<div className="font-bold text-purple-600">
								Test
							</div>
							<div className="text-green-600">
								P: {pSplitCounts.test}, U: {uSplitCounts.test}{" "}
								✅
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

// 結果對比節點
function ResultComparisonNode({ data }: { data: any }) {
	const { type } = data;
	const isProblematic = type === "problematic";

	return (
		<div
			className={`${isProblematic ? "bg-red-50" : "bg-green-50"} border-2 ${isProblematic ? "border-red-400" : "border-green-400"} rounded-lg p-6 min-w-[350px] shadow-md`}
		>
			<Handle type="target" position={Position.Left} />
			<div className="text-center">
				<div
					className={`font-bold ${isProblematic ? "text-red-600" : "text-green-600"} text-2xl mb-5`}
				>
					{data.title}
				</div>
				<div className="space-y-5">
					{data.outcomes.map((outcome: string, index: number) => (
						<div
							key={index}
							className="bg-white border rounded p-5"
						>
							<div className="text-xl text-slate-700">
								{outcome}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

// 重新定義節點類型
const nodeTypes: NodeTypes = {
	timeSeries: TimeSeriesNode,
	method1: Method1SplitNode,
	method2: Method2SplitNode,
	result: ResultComparisonNode,
};

const nodes: Node[] = [
	{
		id: "1",
		type: "timeSeries",
		position: { x: 50, y: 50 },
		data: {},
	},
	{
		id: "2",
		type: "method1",
		position: { x: 50, y: 390 },
		data: {},
	},
	{
		id: "3",
		type: "method2",
		position: { x: 50, y: 730 },
		data: {},
	},
	{
		id: "4",
		type: "result",
		position: { x: 1000, y: 346 },
		data: {
			type: "problematic",
			title: "Result: Training Failed",
			outcomes: [
				"🚫 RuntimeError: nnPU loss calculation failed",
				"📊 Meaningless validation metrics (F1=100%)",
				"❌ Unable to complete model training",
			],
		},
	},
	{
		id: "5",
		type: "result",
		position: { x: 1000, y: 770 },
		data: {
			type: "robust",
			title: "Result: Robust Training",
			outcomes: [
				"✅ nnPU loss calculated stably",
				"📈 Meaningful and reliable evaluation metrics",
				"🎯 Successfully completed model training",
			],
		},
	},
];

const edges: Edge[] = [
	{
		id: "e1",
		source: "1",
		sourceHandle: "method1",
		target: "2",
		type: "smoothstep",
		// label: "Method 1: Direct Split",
		labelBgStyle: { fill: "#b91c1c", fillOpacity: 0.7 },
		labelStyle: { fill: "#fff", fontSize: "14px", fontWeight: "bold" },
		style: { stroke: "#b91c1c", strokeWidth: 3 },
		markerEnd: { type: MarkerType.ArrowClosed, color: "#b91c1c" },
	},
	{
		id: "e2",
		source: "1",
		sourceHandle: "method2",
		target: "3",
		type: "smoothstep",
		// label: "Method 2: Stratified Split",
		labelBgStyle: { fill: "#047857", fillOpacity: 0.7 },
		labelStyle: { fill: "#fff", fontSize: "14px", fontWeight: "bold" },
		style: { stroke: "#047857", strokeWidth: 3 },
		markerEnd: { type: MarkerType.ArrowClosed, color: "#047857" },
	},
	{
		id: "e3",
		source: "2",
		target: "4",
		type: "straight",
		style: { stroke: "#b91c1c", strokeWidth: 2 },
		markerEnd: { type: MarkerType.ArrowClosed, color: "#b91c1c" },
	},
	{
		id: "e4",
		source: "3",
		target: "5",
		type: "straight",
		style: { stroke: "#047857", strokeWidth: 2 },
		markerEnd: { type: MarkerType.ArrowClosed, color: "#047857" },
	},
];

export default function DataSplitStrategyFlow() {
	return (
		<div className="h-[800px] bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border border-slate-300 shadow-inner">
			<ReactFlow
				nodes={nodes}
				edges={edges}
				nodeTypes={nodeTypes}
				fitView
				attributionPosition="bottom-left"
				className="rounded-lg"
				nodesDraggable={false}
				nodesConnectable={false}
				elementsSelectable={false}
				panOnDrag={false}
				zoomOnScroll={false}
				zoomOnPinch={false}
				defaultViewport={{ x: 0, y: 0, zoom: 1 }}
			>
				<Controls />
				<Background color="#f1f5f9" gap={20} />
			</ReactFlow>
		</div>
	);
}
