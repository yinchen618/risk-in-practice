"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	AlertTriangle,
	BookOpen,
	CheckCircle,
	Code,
	GitBranch,
} from "lucide-react";
import { useState } from "react";
import DataSplitStrategyFlow from "../diagrams/DataSplitStrategyFlow";

const CodeBlock = ({
	children,
	lang,
}: { children: React.ReactNode; lang: string }) => (
	<pre
		className={`bg-gray-800 text-white p-4 rounded-lg overflow-x-auto text-xs font-mono language-${lang}`}
	>
		<code>{children}</code>
	</pre>
);

export default function DataSplitStrategy() {
	const [showImplementation, setShowImplementation] = useState(false);

	return (
		<section id="data-split-strategy" className="scroll-mt-6">
			<Card className="border-l-4 border-l-slate-500 bg-white shadow-lg">
				<CardHeader>
					<CardTitle className="text-3xl font-semibold text-slate-700 flex items-center gap-3">
						<GitBranch className="h-8 w-8" />
						Data Splitting Strategy for PU Learning
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* 核心問題陳述 */}
					<div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
						<h4 className="font-semibold text-slate-700 mb-3">
							Core Problem: Class Imbalance in Temporal Splitting
						</h4>
						<p className="text-sm text-slate-600 leading-relaxed">
							When processing temporal data, relying solely on
							time-based proportional splits may result in
							validation or test sets containing only a single
							class (e.g., positive samples). This not only
							triggers{" "}
							<code className="bg-slate-200 px-1 rounded">
								RuntimeError
							</code>
							during training but also causes evaluation metrics
							to be completely distorted, failing to reflect true
							model performance.
						</p>
					</div>

					{/* 流程比較圖 */}
					<div className="mb-6">
						<h4 className="font-semibold text-slate-700 mb-4 text-center">
							Temporal Data Splitting Strategy Comparison
						</h4>
						<DataSplitStrategyFlow />
					</div>

					{/* 問題與解決方案對比 */}
					<div className="grid md:grid-cols-2 gap-6">
						{/* 問題分析 */}
						<div className="bg-red-50 p-4 rounded-lg border border-red-300">
							<h4 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
								<AlertTriangle className="h-4 w-4" />
								Problem Analysis: Flaws in Direct Temporal
								Splitting
							</h4>
							<div className="space-y-3">
								<div className="bg-red-100 p-3 rounded border border-red-300">
									<h5 className="font-semibold text-red-800 text-sm mb-2">
										Phenomenon
									</h5>
									<p className="text-xs text-red-700 leading-relaxed">
										Validation or test sets contain only
										positive samples (P) due to
										<strong>Temporal Bias</strong>.
									</p>
								</div>
								<div className="bg-white p-3 rounded border border-red-300">
									<h5 className="font-semibold text-red-800 text-sm mb-2">
										Impact
									</h5>
									<ul className="list-disc list-inside space-y-1 text-xs text-red-700">
										<li>
											<strong>
												🔥 Training Interruption
											</strong>
											: Gradient computation fails in nnPU
											Loss function due to lack of
											unlabeled samples
										</li>
										<li>
											<strong>
												📊 Evaluation Distortion
											</strong>
											: Models can achieve 100% F1,
											Precision, and Recall by predicting
											all as positive
										</li>
										<li>
											<strong>❌ Invalid Research</strong>
											: Unable to validate true model
											performance and generalization
											capability
										</li>
									</ul>
								</div>
							</div>
						</div>

						{/* 解決方案 */}
						<div className="bg-green-50 p-4 rounded-lg border border-green-300">
							<h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
								<CheckCircle className="h-4 w-4" />
								Solution: Stratified Temporal Splitting
							</h4>
							<div className="space-y-3">
								<div className="bg-green-100 p-3 rounded border border-green-300">
									<h5 className="font-semibold text-green-800 text-sm mb-2">
										Method
									</h5>
									<p className="text-xs text-green-700 leading-relaxed">
										<strong>
											Stratified Temporal Split
										</strong>
										: Separate positive and unlabeled
										samples, apply temporal splitting to
										each group independently, then combine
										while maintaining temporal order.
									</p>
								</div>
								<div className="bg-white p-3 rounded border border-green-300">
									<h5 className="font-semibold text-green-800 text-sm mb-2">
										Advantages
									</h5>
									<ul className="list-disc list-inside space-y-1 text-xs text-green-700">
										<li>
											<strong>🎯 Ensures Balance</strong>:
											Guarantees every dataset (train,
											validation, test) contains both
											sample types
										</li>
										<li>
											<strong>✅ Robustness</strong>: nnPU
											Loss function operates normally at
											any stage
										</li>
										<li>
											<strong>
												📈 Reliable Evaluation
											</strong>
											: Evaluation metrics truly reflect
											model performance on mixed data
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>

					{/* 技術考量 */}
					<div className="bg-slate-50 p-4 rounded-lg border border-slate-300">
						<h4 className="font-semibold text-slate-700 mb-3">
							Technical Considerations and Validation
						</h4>
						<div className="grid md:grid-cols-3 gap-4">
							<div className="bg-amber-50 border border-amber-300 rounded p-3">
								<h5 className="font-semibold text-amber-700 text-sm mb-2">
									⚠️ Important Checks
								</h5>
								<ul className="text-xs text-amber-600 space-y-1 list-disc list-inside">
									<li>Verify each split contains P & U</li>
									<li>Check temporal order preservation</li>
									<li>Monitor P/U ratio changes</li>
								</ul>
							</div>
							<div className="bg-blue-50 border border-blue-300 rounded p-3">
								<h5 className="font-semibold text-blue-700 text-sm mb-2">
									📊 Ratio Impact
								</h5>
								<p className="text-xs text-blue-600">
									P/U ratios may vary due to temporal
									distribution, reflecting real-world data
									evolution characteristics.
								</p>
							</div>
							<div className="bg-purple-50 border border-purple-300 rounded p-3">
								<h5 className="font-semibold text-purple-700 text-sm mb-2">
									🔬 Academic Contribution
								</h5>
								<p className="text-xs text-purple-600">
									This method ensures scientific rigor and
									reproducibility in PU Learning experiments.
								</p>
							</div>
						</div>
					</div>

					{/* 實現細節按鈕 */}
					<div className="text-center">
						<button
							type="button"
							onClick={() =>
								setShowImplementation(!showImplementation)
							}
							className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-3 rounded-lg text-sm font-medium flex items-center gap-2 mx-auto transition-colors"
						>
							{showImplementation ? (
								<>
									<BookOpen className="h-4 w-4" />
									Hide Implementation Details
								</>
							) : (
								<>
									<Code className="h-4 w-4" />
									View Implementation Details
								</>
							)}
						</button>
					</div>

					{/* 可折疊的實現細節 */}
					{showImplementation && (
						<div className="space-y-6 border-t pt-6">
							<div className="bg-red-50 p-4 rounded-lg border border-red-300">
								<h4 className="font-semibold text-red-700 mb-3">
									Method 1: Problematic Direct Temporal Split
								</h4>
								<CodeBlock lang="python">{`def problematic_time_split(df, train_ratio=0.7, val_ratio=0.1, test_ratio=0.2):
    """
    ❌ PROBLEMATIC: Direct time-based split can create P-only validation sets
    """
    # Sort by timestamp
    df_sorted = df.sort_values('timestamp').reset_index(drop=True)
    
    # Direct splitting by time ratios
    n = len(df_sorted)
    train_end = int(n * train_ratio)
    val_end = int(n * (train_ratio + val_ratio))
    
    train_df = df_sorted.iloc[:train_end]           # May contain P+U
    val_df = df_sorted.iloc[train_end:val_end]      # 🚫 Might be P-only!
    test_df = df_sorted.iloc[val_end:]              # 🚫 Might be P-only!
    
    return train_df, val_df, test_df`}</CodeBlock>
							</div>

							<div className="bg-green-50 p-4 rounded-lg border border-green-300">
								<h4 className="font-semibold text-green-700 mb-3">
									Method 2: Robust Stratified Temporal Split
								</h4>
								<CodeBlock lang="python">{`def robust_stratified_time_split(df, train_ratio=0.7, val_ratio=0.1, test_ratio=0.2):
    """
    ✅ ROBUST: Stratified split ensures all sets contain both P and U samples
    """
    # Step 1: Global temporal sorting (preserve time order)
    df_sorted = df.sort_values('timestamp').reset_index(drop=True)
    
    # Step 2: Separate P and U groups
    p_data = df_sorted[df_sorted['is_positive_label'] == 1]
    u_data = df_sorted[df_sorted['is_positive_label'] == 0]
    
    # Step 3: Apply time-based split to each group independently
    def time_split_group(group_df, ratios):
        n = len(group_df)
        train_end = int(n * ratios[0])
        val_end = int(n * (ratios[0] + ratios[1]))
        
        return {
            'train': group_df.iloc[:train_end],
            'val': group_df.iloc[train_end:val_end], 
            'test': group_df.iloc[val_end:]
        }
    
    ratios = [train_ratio, val_ratio, test_ratio]
    p_splits = time_split_group(p_data, ratios)
    u_splits = time_split_group(u_data, ratios)
    
    # Step 4: Combine corresponding P and U parts
    # CRITICAL: Re-sort by timestamp to preserve temporal order!
    splits = {}
    for split_name in ['train', 'val', 'test']:
        splits[split_name] = pd.concat([
            p_splits[split_name], 
            u_splits[split_name]
        ]).sort_values('timestamp').reset_index(drop=True)
    
    return splits['train'], splits['val'], splits['test']`}</CodeBlock>
							</div>

							<div className="bg-slate-50 p-4 rounded-lg border border-slate-300">
								<h4 className="font-semibold text-slate-700 mb-3">
									Validation Code
								</h4>
								<CodeBlock lang="python">{`# Validate splits after creation
for name, split_df in [('train', train), ('val', val), ('test', test)]:
    p_count = (split_df['is_positive_label'] == 1).sum()
    u_count = (split_df['is_positive_label'] == 0).sum()
    
    assert p_count > 0, f"{name} set has no positive samples!"
    assert u_count > 0, f"{name} set has no unlabeled samples!"
    
    print(f"{name}: P={p_count}, U={u_count}, ratio={p_count/u_count:.3f}")`}</CodeBlock>
							</div>
						</div>
					)}

					{/* 影響總結 */}
					<div className="bg-gradient-to-r from-slate-50 to-slate-100 p-4 rounded-lg border border-slate-300">
						<h4 className="font-semibold text-slate-700 mb-3">
							Impact of the Solution
						</h4>
						<div className="grid md:grid-cols-3 gap-3 text-center">
							<div className="bg-white p-3 rounded border shadow-sm">
								<div className="font-bold text-red-600 text-lg">
									0
								</div>
								<div className="text-xs text-slate-600">
									Runtime Errors
								</div>
							</div>
							<div className="bg-white p-3 rounded border shadow-sm">
								<div className="font-bold text-green-600 text-lg">
									100%
								</div>
								<div className="text-xs text-slate-600">
									Reliable Validation
								</div>
							</div>
							<div className="bg-white p-3 rounded border shadow-sm">
								<div className="font-bold text-blue-600 text-lg">
									Stable
								</div>
								<div className="text-xs text-slate-600">
									nnPU Training
								</div>
							</div>
						</div>
						<p className="text-sm text-slate-600 leading-relaxed mt-3 text-center">
							This robust splitting strategy eliminates P-only
							validation set problems, ensuring stable training
							and meaningful evaluation metrics throughout the
							entire PU Learning pipeline.
						</p>
					</div>
				</CardContent>
			</Card>
		</section>
	);
}
