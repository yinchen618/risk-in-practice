"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Layers, Server } from "lucide-react";
import SystemArchitectureFlow from "../diagrams/SystemArchitectureFlow";

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

export default function TechnicalArchitecture() {
	return (
		<section id="technical-architecture" className="scroll-mt-6">
			<Card className="border-l-4 border-l-purple-400 bg-white shadow-lg">
				<CardHeader>
					<CardTitle className="text-3xl font-semibold text-purple-800 flex items-center gap-3">
						<Layers className="h-8 w-8" />
						Technical Architecture
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="grid md:grid-cols-2 gap-6">
						<div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
							<h4 className="font-semibold text-indigo-800 mb-3 flex items-center gap-2">
								<Server className="h-4 w-4" />
								Frontend Stack
							</h4>
							<ul className="text-sm text-slate-700 space-y-2 list-disc list-inside">
								<li>
									<strong>Framework:</strong> Next.js 14 +
									TypeScript
								</li>
								<li>
									<strong>UI Library:</strong> Shadcn/UI +
									Tailwind CSS
								</li>
								<li>
									<strong>State Management:</strong> React
									Query (TanStack)
								</li>
								<li>
									<strong>Math Rendering:</strong> KaTeX for
									LaTeX formulas
								</li>
								<li>
									<strong>Charts:</strong> Chart.js for
									visualization
								</li>
								<li>
									<strong>Real-time:</strong> WebSocket for
									training updates
								</li>
							</ul>
						</div>

						<div className="bg-green-50 p-4 rounded-lg border border-green-200">
							<h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
								<Database className="h-4 w-4" />
								Backend Stack
							</h4>
							<ul className="text-sm text-slate-700 space-y-2 list-disc list-inside">
								<li>
									<strong>API:</strong> FastAPI + Python 3.10
								</li>
								<li>
									<strong>Database:</strong> SQLite with
									SQLAlchemy ORM
								</li>
								<li>
									<strong>ML Framework:</strong> PyTorch +
									scikit-learn
								</li>
								<li>
									<strong>Data Processing:</strong> NumPy +
									Pandas
								</li>
								<li>
									<strong>Async:</strong> WebSocket for
									real-time updates
								</li>
							</ul>
						</div>
					</div>

					<div className="bg-slate-50 p-4 rounded-lg border">
						<h4 className="font-semibold text-slate-800 mb-3">
							System Architecture Flow
						</h4>
						<SystemArchitectureFlow />
					</div>

					<div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
						<h4 className="font-semibold text-orange-800 mb-3">
							Data Flow Architecture
						</h4>
						<div className="grid md:grid-cols-3 gap-4 text-sm">
							<div className="bg-white p-3 rounded border text-center">
								<div className="font-semibold text-blue-600 mb-1">
									Input Layer
								</div>
								<div className="text-xs text-slate-600">
									Raw IoT sensor data (3 channels)
								</div>
							</div>
							<div className="bg-white p-3 rounded border text-center">
								<div className="font-semibold text-green-600 mb-1">
									Processing Layer
								</div>
								<div className="text-xs text-slate-600">
									Feature extraction & sequencing
								</div>
							</div>
							<div className="bg-white p-3 rounded border text-center">
								<div className="font-semibold text-red-600 mb-1">
									Model Layer
								</div>
								<div className="text-xs text-slate-600">
									LSTM + PU Learning
								</div>
							</div>
						</div>
					</div>

					<div className="grid md:grid-cols-3 gap-4">
						<div className="bg-yellow-50 p-3 rounded border border-yellow-200">
							<h5 className="font-semibold text-yellow-800 text-sm mb-1">
								Data Layer
							</h5>
							<p className="text-xs text-slate-600">
								Reactive queries with caching, real-time
								synchronization
							</p>
						</div>
						<div className="bg-yellow-50 p-3 rounded border border-yellow-200">
							<h5 className="font-semibold text-yellow-800 text-sm mb-1">
								ML Pipeline
							</h5>
							<p className="text-xs text-slate-600">
								Automated feature extraction, model training,
								evaluation
							</p>
						</div>
						<div className="bg-yellow-50 p-3 rounded border border-yellow-200">
							<h5 className="font-semibold text-yellow-800 text-sm mb-1">
								Deployment
							</h5>
							<p className="text-xs text-slate-600">
								Model versioning, artifact management,
								monitoring
							</p>
						</div>
					</div>

					<div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
						<h4 className="font-semibold text-indigo-800 mb-3">
							Core Service Classes
						</h4>
						<CodeBlock lang="python">{`class CandidateGenerator:
    """Multi-rule anomaly candidate generation"""
    async def generate_candidates(self, params: FilterParams) -> List[AnomalyEvent]

class ModelTrainer:
    """LSTM+PU model training with WebSocket progress updates"""
    async def train_model(self, config: TrainingConfig) -> TrainedModel

class ModelEvaluator:
    """Multi-scenario evaluation (ERM/Generalization/Adaptation)"""
    async def evaluate_model(self, model_id: str, scenario: EvaluationScenario)${""}`}</CodeBlock>
					</div>
				</CardContent>
			</Card>
		</section>
	);
}
