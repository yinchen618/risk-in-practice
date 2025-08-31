"use client";

import { LaTeX } from "@/components/LaTeX";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Network } from "lucide-react";

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

export default function StageImplementations() {
	return (
		<>
			{/* Stage 1: Candidate Generation */}
			{/* <section id="stage-1-implementation" className="scroll-mt-6">
        <Card className="border-l-4 border-l-blue-400 bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-semibold text-blue-800 flex items-center gap-3">
              <Filter className="h-8 w-8" />
              Stage 1: Anomaly Candidate Generation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-slate-700 text-sm leading-relaxed">
              Multi-dimensional statistical & rule-based filters generate high quality anomaly
              candidates minimizing expert burden while preserving recall.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2 text-sm">
                  Filter Parameters Interface
                </h4>
                <CodeBlock lang="typescript">{`interface FilterParams {
  selectedDatasetIds: string[];
  zScoreThreshold: number;
  spikeThreshold: number;
  minEventDuration: number;
  weekendPatternEnabled: boolean;
  holidayPatternEnabled: boolean;
  maxTimeGap: number;
  aggregationWindow: number;
  peerExceedThreshold: number;
}${''}`}</CodeBlock>
              </div>

              <div className="bg-blue-50 p-4 rounded border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2 text-sm">Generation Algorithm</h4>
                <CodeBlock lang="python">{`async def generate_candidates(params):
    # 1. Statistical outliers (Z-score > threshold)
    outliers = detect_z_score_outliers(data, params.zScoreThreshold)
    
    # 2. Power spike detection
    spikes = detect_power_spikes(data, params.spikeThreshold)
    
    # 3. Temporal duration & calendar rules
    events = filter_by_duration_and_calendar(outliers + spikes, params)
    
    # 4. Peer comparison (aggregation window)
    final_events = peer_comparison_filter(events, params)
    
    # 5. Persist to anomaly_event table
    return await persist_events(final_events)${''}`}</CodeBlock>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded border">
              <h4 className="font-semibold text-slate-800 mb-2 text-sm">
                Adaptive Parameter Heuristics
              </h4>
              <CodeBlock lang="typescript">{`const adjustedParams = useMemo(() => {
  const datasetCount = filterParams.selectedDatasetIds.length;
  return {
    zScoreThreshold: Math.max(2.0, 3.5 - datasetCount * 0.1),
    spikeThreshold: Math.max(150, 300 - datasetCount * 10),
    minEventDuration: Math.max(30, 60 - datasetCount * 2)
  };
}, [filterParams.selectedDatasetIds]);${''}`}</CodeBlock>
            </div>
          </CardContent>
        </Card>
      </section> */}

			{/* Stage 2: Expert Labeling */}
			{/* <section id="stage-2-implementation" className="scroll-mt-6">
        <Card className="border-l-4 border-l-green-400 bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-semibold text-green-800 flex items-center gap-3">
              <Users className="h-8 w-8" />
              Stage 2: Expert Labeling & Review
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-slate-700 text-sm leading-relaxed">
              Interactive labeling dashboard accelerates expert validation with contextual time
              windows, multi-resolution views, and bulk acceptance/rejection workflows.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-4 rounded border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2 text-sm">Review Workflow</h4>
                <ol className="text-xs text-slate-700 space-y-1 list-decimal list-inside">
                  <li>Load UNREVIEWED events (paginated)</li>
                  <li>Pull contextual raw series window</li>
                  <li>Visual inspection & pattern reasoning</li>
                  <li>Mark CONFIRMED_POSITIVE / REJECTED_NORMAL</li>
                  <li>Bulk review for repetitive signatures</li>
                </ol>
              </div>

              <div className="bg-green-50 p-4 rounded border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2 text-sm">
                  Labeling Interface Features
                </h4>
                <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
                  <li>Time-series visualization with zoom/pan</li>
                  <li>Multi-channel overlay (Total, 110V, 220V)</li>
                  <li>Contextual window expansion</li>
                  <li>Keyboard shortcuts for rapid labeling</li>
                  <li>Batch operations for similar patterns</li>
                </ul>
              </div>
            </div>

            <div className="bg-white p-4 rounded border">
              <h4 className="font-semibold text-slate-800 mb-2 text-sm">
                Transactional Consistency
              </h4>
              <CodeBlock lang="sql">{`-- Atomic labeling transaction
BEGIN;
UPDATE anomaly_event 
SET status = 'CONFIRMED_POSITIVE' 
WHERE id = ?;

UPDATE analysis_ready_data 
SET is_positive_label = 1 
WHERE source_anomaly_event_id = ?;

UPDATE analysis_datasets 
SET positive_labels = (
    SELECT COUNT(*) FROM analysis_ready_data 
    WHERE dataset_id = ? AND is_positive_label = 1
) 
WHERE id = ?;
COMMIT;${''}`}</CodeBlock>
            </div>
          </CardContent>
        </Card>
      </section> */}

			{/* Stage 3: PU Training */}
			<section id="stage-3-implementation" className="scroll-mt-6">
				<Card className="border-l-4 border-l-red-400 bg-white shadow-lg">
					<CardHeader>
						<CardTitle className="text-3xl font-semibold text-red-800 flex items-center gap-3">
							<Network className="h-8 w-8" />
							Stage 3: LSTM + PU Learning Training
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-6">
						<p className="text-slate-700 text-sm leading-relaxed">
							Unified training interface for LSTM + PU Learning
							variants with real-time monitoring, multi-scenario
							support, and comprehensive artifact management.
						</p>

						<div className="bg-red-50 p-4 rounded-lg border border-red-200">
							<h4 className="font-semibold text-red-800 mb-3">
								LSTM + PU Model Architecture
							</h4>
							<CodeBlock lang="python">{`class LSTMPULearningModel(nn.Module):
    def __init__(self, input_size=7, hidden_size=64, num_layers=2, dropout=0.3):
        super().__init__()
        self.lstm = nn.LSTM(input_size, hidden_size, num_layers, 
                           batch_first=True, dropout=dropout if num_layers > 1 else 0)
        self.dropout = nn.Dropout(dropout)
        self.classifier = nn.Linear(hidden_size, 1)
        self._init_weights()
    
    def forward(self, x):
        lstm_out, _ = self.lstm(x)  # (batch, seq_len, hidden)
        last_output = lstm_out[:, -1, :]  # Take last timestep
        dropped = self.dropout(last_output)
        return torch.sigmoid(self.classifier(dropped))${""}`}</CodeBlock>
						</div>

						<div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
							<h4 className="font-semibold text-indigo-800 mb-3">
								Non-Negative PU Loss Function
							</h4>
							<div className="mb-3">
								<LaTeX>{`$$R_{nn}(f) = \\max(0, \\pi R_P(f) + R_U(f) - \\pi R_{PN}(f))$$${""}`}</LaTeX>
							</div>
							<CodeBlock lang="python">{`def nnpu_loss(y_pred, y_true, prior_prob=0.1):
    positive_mask = (y_true == 1).float()
    unlabeled_mask = (y_true == 0).float()
    
    # Positive risk
    pos_risk = -torch.mean(positive_mask * torch.log(y_pred + 1e-8))
    
    # Unlabeled risk decomposition
    unl_pos_risk = -torch.mean(unlabeled_mask * torch.log(y_pred + 1e-8))
    unl_neg_risk = -torch.mean(unlabeled_mask * torch.log(1 - y_pred + 1e-8))
    
    # Non-negative constraint
    unl_risk = torch.max(
        torch.tensor(0.0), 
        prior_prob * unl_pos_risk - (1 - prior_prob) * unl_neg_risk
    )
    
    return pos_risk + unl_risk${""}`}</CodeBlock>
						</div>

						<div className="grid md:grid-cols-3 gap-4">
							<div className="bg-orange-50 p-3 rounded border border-orange-200">
								<h5 className="font-semibold text-orange-800 text-sm mb-1">
									ERM Baseline
								</h5>
								<p className="text-xs text-slate-600">
									60/20/20 temporal split for supervised
									upper-bound
								</p>
							</div>
							<div className="bg-orange-50 p-3 rounded border border-orange-200">
								<h5 className="font-semibold text-orange-800 text-sm mb-1">
									Generalization
								</h5>
								<p className="text-xs text-slate-600">
									Zero-shot transfer to unseen
									buildings/seasons
								</p>
							</div>
							<div className="bg-orange-50 p-3 rounded border border-orange-200">
								<h5 className="font-semibold text-orange-800 text-sm mb-1">
									Domain Adaptation
								</h5>
								<p className="text-xs text-slate-600">
									Source positives + target unlabeled
									fine-tuning
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</section>

			{/* Stage 4: Results Analysis */}
			<section id="stage-4-implementation" className="scroll-mt-6">
				<Card className="border-l-4 border-l-orange-400 bg-white shadow-lg">
					<CardHeader>
						<CardTitle className="text-3xl font-semibold text-orange-800 flex items-center gap-3">
							<BarChart3 className="h-8 w-8" />
							Stage 4: Results Analysis & Evaluation
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-6">
						<p className="text-slate-700 text-sm leading-relaxed">
							Comprehensive evaluation framework comparing model
							performance across scenarios: supervised baseline,
							generalization challenges, and domain adaptation.
						</p>

						<div className="grid md:grid-cols-3 gap-4">
							<div className="bg-orange-50 p-4 rounded border border-orange-200">
								<h4 className="font-semibold text-orange-800 mb-2 text-sm">
									ERM Baseline Evaluation
								</h4>
								<ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
									<li>Temporal 60/20/20 split</li>
									<li>Fully supervised training</li>
									<li>Performance upper-bound</li>
									<li>Standard F1/Precision/Recall</li>
								</ul>
							</div>

							<div className="bg-orange-50 p-4 rounded border border-orange-200">
								<h4 className="font-semibold text-orange-800 mb-2 text-sm">
									Generalization Challenge
								</h4>
								<ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
									<li>Zero-shot transfer testing</li>
									<li>Cross-building evaluation</li>
									<li>Temporal domain shifts</li>
									<li>Robustness assessment</li>
								</ul>
							</div>

							<div className="bg-orange-50 p-4 rounded border border-orange-200">
								<h4 className="font-semibold text-orange-800 mb-2 text-sm">
									Domain Adaptation
								</h4>
								<ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
									<li>Source positive labels</li>
									<li>Target unlabeled data</li>
									<li>PU Learning fine-tuning</li>
									<li>Adaptation effectiveness</li>
								</ul>
							</div>
						</div>

						<div className="bg-white p-4 rounded border">
							<h4 className="font-semibold text-slate-800 mb-2 text-sm">
								Evaluation Pipeline
							</h4>
							<CodeBlock lang="python">{`def evaluate_model(model, test_loader, scenario_type):
    model.eval()
    all_predictions = []
    all_labels = []
    
    with torch.no_grad():
        for batch_x, batch_y in test_loader:
            predictions = model(batch_x)
            all_predictions.extend(predictions.cpu().numpy())
            all_labels.extend(batch_y.numpy())
    
    y_pred = (np.array(all_predictions) > 0.5).astype(int)
    y_true = np.array(all_labels)
    
    return {
        'f1_score': f1_score(y_true, y_pred),
        'precision': precision_score(y_true, y_pred, zero_division=0),
        'recall': recall_score(y_true, y_pred, zero_division=0),
        'scenario': scenario_type
    }${""}`}</CodeBlock>
						</div>

						<div className="bg-slate-50 p-4 rounded border">
							<h4 className="font-semibold text-slate-800 mb-2 text-sm">
								Results Visualization
							</h4>
							<div className="grid md:grid-cols-2 gap-3 text-xs">
								<div className="bg-white p-3 rounded border">
									<strong>Performance Charts:</strong>{" "}
									F1/Precision/Recall comparison
								</div>
								<div className="bg-white p-3 rounded border">
									<strong>Confusion Matrix:</strong>{" "}
									True/False Positive/Negative breakdown
								</div>
								<div className="bg-white p-3 rounded border">
									<strong>Training Curves:</strong> Loss and
									metrics over epochs
								</div>
								<div className="bg-white p-3 rounded border">
									<strong>Risk Analysis:</strong> PU risk
									estimation trends
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</section>
		</>
	);
}
