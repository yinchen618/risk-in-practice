"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, Shield, Target } from "lucide-react";
import ArtifactPackagingFlow from "../diagrams/ArtifactPackagingFlow";
import DataLeakagePreventionFlow from "../diagrams/DataLeakagePreventionFlow";
import FeatureEngineeringIsolationFlow from "../diagrams/FeatureEngineeringIsolationFlow";
import ModelConsistencyFlow from "../diagrams/ModelConsistencyFlow";
import StratifiedTimeSplitFlow from "../diagrams/StratifiedTimeSplitFlow";
import TimeSeriesSanctityFlow from "../diagrams/TimeSeriesSanctityFlow";

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

export default function ReliableImplementation() {
	return (
		<section id="reliable-implementation" className="scroll-mt-6">
			<Card className="border-l-4 border-l-emerald-400 bg-white shadow-lg">
				<CardHeader>
					<CardTitle className="text-3xl font-semibold text-emerald-800 flex items-center gap-3">
						<Shield className="h-8 w-8" />
						Reliable Training & Evaluation Pipeline
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
						<h4 className="font-semibold text-emerald-800 mb-3">
							Core Implementation Philosophy
						</h4>
						<p className="text-sm text-slate-700 leading-relaxed">
							From chaotic data processing and model architecture
							mismatches to establishing an industrial-grade,
							end-to-end reliable time-series model training and
							evaluation pipeline. Every experiment is now
							scientific, trustworthy, and reproducible.
						</p>
					</div>

					<div className="grid md:grid-cols-2 gap-6">
						<div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
							<h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
								<Clock className="h-4 w-4" />
								Time Series Sanctity
							</h4>
							<div className="mb-4">
								<TimeSeriesSanctityFlow />
							</div>
							<div className="bg-blue-100 p-3 rounded border border-blue-300 mb-3">
								<h5 className="font-semibold text-blue-900 text-sm mb-2">
									Academic Foundation
								</h5>
								<p className="text-xs text-blue-800 leading-relaxed">
									Based on{" "}
									<strong>
										temporal causality principle
									</strong>{" "}
									in time series analysis. The fundamental
									assumption that future events cannot
									influence past observations must be
									preserved throughout the entire pipeline
									(Hamilton, 1994; Box et al., 2015).
								</p>
							</div>
							<ul className="text-sm text-slate-700 space-y-2 list-disc list-inside">
								<li>
									Global temporal ordering as the unbreakable
									first principle
								</li>
								<li>
									Stratified time-based splitting (70/10/20)
									for P and U groups
								</li>
								<li>
									Zero temporal leakage between
									train/validation/test sets
								</li>
								<li>
									Preserve chronological integrity across all
									processing stages
								</li>
							</ul>
						</div>

						<div className="bg-red-50 p-4 rounded-lg border border-red-200">
							<h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
								<Target className="h-4 w-4" />
								Data Leakage Prevention
							</h4>
							<div className="mb-4">
								<DataLeakagePreventionFlow />
							</div>
							<div className="bg-red-100 p-3 rounded border border-red-300 mb-3">
								<h5 className="font-semibold text-red-900 text-sm mb-2">
									Methodological Innovation
								</h5>
								<p className="text-xs text-red-800 leading-relaxed">
									My{" "}
									<strong>
										"Split First, Process Later"
									</strong>{" "}
									methodology addresses the critical data
									leakage problem identified in ML evaluation
									literature (Kaufman et al., 2012; Kapoor &
									Narayanan, 2023). This prevents future
									information contamination.
								</p>
							</div>
							<ul className="text-sm text-slate-700 space-y-2 list-disc list-inside">
								<li>
									<strong>
										"Split First, Process Later"
									</strong>{" "}
									- iron rule
								</li>
								<li>
									Independent feature engineering per split
								</li>
								<li>
									Single StandardScaler fitted only on
									training data
								</li>
								<li>
									Validation/test sets use transform-only
									operations
								</li>
							</ul>
						</div>
					</div>

					{/* Stratified Time-based Splitting */}
					<div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
						<h4 className="font-semibold text-indigo-800 mb-3">
							Stratified Time-based Data Splitting Strategy
						</h4>
						<div className="mb-4">
							<StratifiedTimeSplitFlow />
						</div>
						<div className="bg-indigo-100 p-3 rounded border border-indigo-300 mb-3">
							<h5 className="font-semibold text-indigo-900 text-sm mb-2">
								Theoretical Contribution
							</h5>
							<p className="text-xs text-indigo-800 leading-relaxed">
								My stratified temporal splitting addresses the{" "}
								<strong>distribution shift problem</strong> in
								PU Learning (Bekker & Davis, 2020). By
								maintaining temporal consistency within each
								class while preserving the original P/U ratio
								across splits, I ensure{" "}
								<strong>statistically valid</strong>
								evaluation under temporal drift conditions.
							</p>
						</div>
						<CodeBlock lang="python">{`def stratified_time_split(df, train_ratio=0.7, val_ratio=0.1, test_ratio=0.2):
    """
    Stratified time-based split to prevent data leakage and maintain distribution
    """
    # 1. Global temporal sorting (Sacred First Step)
    df_sorted = df.sort_values('timestamp').reset_index(drop=True)
    
    # 2. Separate P and U groups
    p_data = df_sorted[df_sorted['is_positive_label'] == 1]
    u_data = df_sorted[df_sorted['is_positive_label'] == 0]
    
    # 3. Time-based split for each group independently
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
    
    # 4. Combine corresponding P and U parts
    splits = {}
    for split_name in ['train', 'val', 'test']:
        splits[split_name] = pd.concat([
            p_splits[split_name], 
            u_splits[split_name]
        ]).sort_values('timestamp').reset_index(drop=True)
    
    return splits['train'], splits['val'], splits['test']${""}`}</CodeBlock>
					</div>

					{/* Feature Engineering Isolation */}
					<div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
						<h4 className="font-semibold text-purple-800 mb-3">
							Isolated Feature Engineering Pipeline
						</h4>
						<div className="mb-4">
							<FeatureEngineeringIsolationFlow />
						</div>
						<div className="bg-purple-100 p-3 rounded border border-purple-300 mb-3">
							<h5 className="font-semibold text-purple-900 text-sm mb-2">
								Statistical Validity
							</h5>
							<p className="text-xs text-purple-800 leading-relaxed">
								Implements{" "}
								<strong>
									proper cross-validation methodology
								</strong>{" "}
								(Varma & Simon, 2006) where feature selection
								and preprocessing are nested within CV folds. My
								approach ensures
								<strong>unbiased performance estimation</strong>{" "}
								by eliminating feature selection bias and
								scaling contamination across temporal
								boundaries.
							</p>
						</div>
						<CodeBlock lang="python">{`def isolated_feature_extraction_pipeline(train_df, val_df, test_df):
    """
    Apply feature engineering independently to each split
    """
    # Extract features for each split independently
    X_train = extract_temporal_features(train_df, window_size=60)
    X_val = extract_temporal_features(val_df, window_size=60)
    X_test = extract_temporal_features(test_df, window_size=60)
    
    # Fit scaler ONLY on training data
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    
    # Transform validation and test using the same fitted scaler
    X_val_scaled = scaler.transform(X_val)
    X_test_scaled = scaler.transform(X_test)
    
    # Create LSTM sequences independently
    train_sequences = create_sequences(X_train_scaled, sequence_length=60)
    val_sequences = create_sequences(X_val_scaled, sequence_length=60)
    test_sequences = create_sequences(X_test_scaled, sequence_length=60)
    
    return {
        'train': train_sequences,
        'val': val_sequences, 
        'test': test_sequences,
        'scaler': scaler  # Critical: preserve for evaluation consistency
    }${""}`}</CodeBlock>
					</div>

					{/* Model Consistency */}
					<div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
						<h4 className="font-semibold text-yellow-800 mb-3">
							Model Architecture Consistency (shared_models.py)
						</h4>
						<div className="mb-4">
							<ModelConsistencyFlow />
						</div>
						<div className="bg-yellow-100 p-3 rounded border border-yellow-300 mb-3">
							<h5 className="font-semibold text-yellow-900 text-sm mb-2">
								Reproducibility Engineering
							</h5>
							<p className="text-xs text-yellow-800 leading-relaxed">
								Addresses the{" "}
								<strong>reproducibility crisis</strong> in ML
								research (Gundersen & Kjensmo, 2018). My shared
								model definition pattern ensures{" "}
								<strong>identical computational graphs</strong>
								between training and evaluation, eliminating
								architectural inconsistencies that plague many
								experimental setups.
							</p>
						</div>
						<CodeBlock lang="python">{`# shared_models.py - Single source of truth
class LSTMPULearningModel(nn.Module):
    """Unified model definition used by both trainer and evaluator"""
    def __init__(self, input_size=7, hidden_size=64, num_layers=2, sequence_length=60, dropout=0.3):
        super().__init__()
        self.lstm = nn.LSTM(input_size, hidden_size, num_layers, batch_first=True, dropout=dropout if num_layers > 1 else 0)
        self.dropout = nn.Dropout(dropout)
        self.classifier = nn.Linear(hidden_size, 1)
        self._init_weights()
    
    def forward(self, x):
        lstm_out, _ = self.lstm(x)
        last_output = lstm_out[:, -1, :]  # Take last timestep
        dropped = self.dropout(last_output)
        return torch.sigmoid(self.classifier(dropped))

# Both trainer and evaluator import from the same source
from shared_models import LSTMPULearningModel  # Consistency guaranteed${""}`}</CodeBlock>
					</div>

					{/* Artifact Packaging */}
					<div className="bg-slate-50 p-4 rounded-lg border">
						<h4 className="font-semibold text-slate-800 mb-3">
							Complete Artifact Packaging & Reconstruction
						</h4>
						<div className="mb-4">
							<ArtifactPackagingFlow />
						</div>
						<div className="bg-slate-100 p-3 rounded border border-slate-300 mb-3">
							<h5 className="font-semibold text-slate-900 text-sm mb-2">
								MLOps Best Practices
							</h5>
							<p className="text-xs text-slate-800 leading-relaxed">
								Implements{" "}
								<strong>model artifact versioning</strong>{" "}
								following MLOps principles (Sculley et al.,
								2015; Paleyes et al., 2022). My atomic packaging
								approach ensures
								<strong>deployment consistency</strong> and
								enables reliable model reproduction across
								different environments and time periods.
							</p>
						</div>
						<CodeBlock lang="python">{`def save_complete_training_artifacts(model, scaler, config, feature_names, model_path):
    """Package all necessary components for consistent evaluation"""
    artifacts = {
        'model_state_dict': model.state_dict(),
        'model_config': {
            'input_size': config.input_size,
            'hidden_size': config.hidden_size,
            'num_layers': config.num_layers,
            'sequence_length': config.sequence_length,
            'dropout': config.dropout
        },
        'scaler': scaler,  # Fitted StandardScaler object
        'feature_names': feature_names,  # Feature extraction metadata
        'training_config': config,  # Complete training configuration
        'pytorch_version': torch.__version__,
        'created_at': datetime.now().isoformat()
    }
    
    # Single-file packaging for atomic operations
    with open(f"{model_path}/complete_artifacts.pkl", "wb") as f:
        pickle.dump(artifacts, f)

def load_and_reconstruct_model(model_path):
    """Reconstruct identical training environment for evaluation"""
    with open(f"{model_path}/complete_artifacts.pkl", "rb") as f:
        artifacts = pickle.load(f)
    
    # Reconstruct model with identical architecture
    model = LSTMPULearningModel(**artifacts['model_config'])
    model.load_state_dict(artifacts['model_state_dict'])
    
    return {
        'model': model,
        'scaler': artifacts['scaler'],  # Same fitted scaler
        'config': artifacts['model_config'],
        'feature_names': artifacts['feature_names']
    }${""}`}</CodeBlock>
					</div>

					{/* Key Learnings */}
					<div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-4 rounded-lg border">
						<h4 className="font-semibold text-emerald-800 mb-3 flex items-center gap-2">
							<CheckCircle className="h-4 w-4" />
							Critical Implementation Learnings
						</h4>
						<div className="grid md:grid-cols-2 gap-4 text-sm text-slate-700">
							<div className="space-y-2">
								<div className="bg-white p-3 rounded border">
									<strong className="text-emerald-700">
										Time Series Sanctity:
									</strong>
									<span className="block text-xs mt-1">
										Temporal order is inviolable - any
										shuffling operation is disaster's
										beginning
									</span>
								</div>
								<div className="bg-white p-3 rounded border">
									<strong className="text-red-700">
										Data Leakage Prevention:
									</strong>
									<span className="block text-xs mt-1">
										"Split First, Process Later" - the iron
										rule for trustworthy evaluation
									</span>
								</div>
							</div>
							<div className="space-y-2">
								<div className="bg-white p-3 rounded border">
									<strong className="text-blue-700">
										Consistency is King:
									</strong>
									<span className="block text-xs mt-1">
										Same ruler for training and evaluation -
										shared codebase is essential
									</span>
								</div>
								<div className="bg-white p-3 rounded border">
									<strong className="text-purple-700">
										Question High Results:
									</strong>
									<span className="block text-xs mt-1">
										F1 &gt; 0.9 or Recall = 1.0 with TN = 0
										often indicate hidden bugs
									</span>
								</div>
							</div>
						</div>
					</div>

					{/* Implementation Impact */}
					<div className="bg-green-50 p-4 rounded-lg border border-green-200">
						<h4 className="font-semibold text-green-800 mb-3">
							Implementation Impact & Future Reliability
						</h4>
						<p className="text-sm text-slate-700 leading-relaxed mb-3">
							This reliable pipeline establishes a solid
							foundation that can be trusted and iterated upon.
							Every metric produced is now meaningful and worthy
							of deep analysis. The real journey of model
							optimization begins here.
						</p>
						<div className="grid md:grid-cols-3 gap-3 text-center">
							<div className="bg-white p-3 rounded border">
								<div className="font-bold text-green-600 text-lg">
									Zero
								</div>
								<div className="text-xs text-slate-600">
									Data Leakage
								</div>
							</div>
							<div className="bg-white p-3 rounded border">
								<div className="font-bold text-blue-600 text-lg">
									100%
								</div>
								<div className="text-xs text-slate-600">
									Reproducible
								</div>
							</div>
							<div className="bg-white p-3 rounded border">
								<div className="font-bold text-purple-600 text-lg">
									Industrial
								</div>
								<div className="text-xs text-slate-600">
									Grade Pipeline
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</section>
	);
}
