'use client'

import { Activity } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const CodeBlock = ({ children, lang }: { children: React.ReactNode; lang: string }) => (
  <pre
    className={`bg-gray-800 text-white p-4 rounded-lg overflow-x-auto text-xs font-mono language-${lang}`}
  >
    <code>{children}</code>
  </pre>
)

export default function DataPipelineFeatures() {
  return (
    <section id="data-pipeline" className="scroll-mt-6">
      <Card className="border-l-4 border-l-green-400 bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold text-green-800 flex items-center gap-3">
            <Activity className="h-8 w-8" />
            Data Pipeline & Features
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg text-slate-700">
            Raw power meter readings are transformed through a reproducible ETL flow: extraction →
            cleaning & validation → temporal/statistical feature extraction → sliding sequence
            assembly → scaling → model-ready tensors.
          </p>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-800 mb-3">Feature Engineering Pipeline</h4>
            <CodeBlock lang="python">{`def extract_temporal_features(series, window=60):
    """Extract 7D features from time series window"""
    features = []
    for i in range(len(series) - window + 1):
        w = series[i:i + window]
        features.append([
            w.mean(),           # Statistical: mean
            w.std(),            # Statistical: std
            w.max(),            # Statistical: max
            w.min(),            # Statistical: min
            np.polyfit(range(len(w)), w, 1)[0],  # Trend: slope
            np.diff(w).mean(),  # Change: diff_mean
            np.diff(w).std()    # Change: diff_std
        ])
    return np.array(features)  # Shape: (N, 7)${''}`}</CodeBlock>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded border">
              <h4 className="font-semibold text-slate-800 mb-2">Data Transformation Flow</h4>
              <div className="text-sm text-slate-600 space-y-2 font-mono">
                <div className="flex justify-between">
                  <span>Raw Data:</span>
                  <span>(timestamps, 3 channels)</span>
                </div>
                <div className="text-center">↓ Feature Extraction</div>
                <div className="flex justify-between">
                  <span>Features:</span>
                  <span>(N_samples, 7)</span>
                </div>
                <div className="text-center">↓ Sequence Creation</div>
                <div className="flex justify-between">
                  <span>LSTM Input:</span>
                  <span>(N_seq, 60, 7)</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded border">
              <h4 className="font-semibold text-slate-800 mb-2">Feature Categories</h4>
              <div className="text-sm text-slate-600 space-y-1">
                <div>
                  <strong>Statistical (4D):</strong> mean, std, max, min
                </div>
                <div>
                  <strong>Trend (1D):</strong> linear slope
                </div>
                <div>
                  <strong>Change (2D):</strong> diff_mean, diff_std
                </div>
                <div>
                  <strong>Channels:</strong> Total, 110V, 220V power
                </div>
                <div>
                  <strong>Window Size:</strong> 60 minutes
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-3">LSTM Sequence Processing</h4>
            <CodeBlock lang="python">{`def create_sequences(features, sequence_length=60):
    """Convert feature matrix to LSTM sequences"""
    sequences = []
    for i in range(len(features) - sequence_length + 1):
        sequences.append(features[i:i + sequence_length])
    return np.array(sequences)  # Shape: (N_seq, 60, 7)

# Data standardization
from sklearn.preprocessing import StandardScaler
scaler = StandardScaler()
features_scaled = scaler.fit_transform(features)

# Save scaler for inference
pickle.dump(scaler, open(f"{model_path}/scaler.pkl", "wb"))${''}`}</CodeBlock>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-purple-800 mb-3">Database Schema (Core Tables)</h4>
            <CodeBlock lang="sql">{`CREATE TABLE experiment_run (
    id TEXT PRIMARY KEY,
    description TEXT,
    filter_config TEXT,  -- JSON FilterParams
    created_at TEXT,
    completed_at TEXT
);

CREATE TABLE anomaly_event (
    id TEXT PRIMARY KEY,
    experiment_run_id TEXT,
    start_time TEXT,
    end_time TEXT,
    status TEXT,  -- UNREVIEWED/CONFIRMED_POSITIVE/REJECTED_NORMAL
    FOREIGN KEY (experiment_run_id) REFERENCES experiment_run (id)
);

CREATE TABLE trained_models (
    id TEXT PRIMARY KEY,
    model_name TEXT,
    config TEXT,     -- JSON TrainingConfig
    model_path TEXT, -- File system path to artifacts
    created_at TEXT
);${''}`}</CodeBlock>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
              <h5 className="font-semibold text-yellow-800 text-sm mb-1">Input Data</h5>
              <p className="text-xs text-slate-600">
                IoT sensor streams: wattageTotal, wattage110v, wattage220v
              </p>
            </div>
            <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
              <h5 className="font-semibold text-yellow-800 text-sm mb-1">Processing</h5>
              <p className="text-xs text-slate-600">
                Sliding window feature extraction with normalization
              </p>
            </div>
            <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
              <h5 className="font-semibold text-yellow-800 text-sm mb-1">Output</h5>
              <p className="text-xs text-slate-600">
                Sequential features ready for LSTM model training
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
