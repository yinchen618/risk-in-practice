"use client";

import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Blocks, Bot, Database, HardDrive, Server } from "lucide-react";

// Helper component for syntax highlighting
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

export default function SystemArchitecture() {
	return (
		<section id="system-architecture" className="scroll-mt-6">
			<Card className="bg-white shadow-lg">
				<CardHeader>
					<h2 className="text-base font-semibold uppercase text-blue-600 tracking-wider">
						Final Part: System Architecture & Environment
					</h2>
					<CardTitle className="text-3xl font-bold text-gray-800 pt-1 flex items-center gap-3">
						<Blocks className="h-8 w-8 text-gray-500" />
						System Architecture & Experimental Setup
					</CardTitle>
					<p className="text-lg text-gray-500 pt-2">
						A comprehensive overview of the full-stack application,
						data flow, and the specific environment used for model
						training and evaluation.
					</p>
				</CardHeader>

				<CardContent className="space-y-8">
					{/* Part 1: Full-Stack Application Architecture */}
					<div>
						<h3 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">
							Full-Stack Application Architecture
						</h3>
						<div className="grid md:grid-cols-2 gap-6">
							<div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
								<h4 className="font-semibold text-indigo-800 mb-3 flex items-center gap-2">
									<Server className="h-5 w-5" />
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
										<strong>Charts:</strong> Chart.js for
										visualization
									</li>
									<li>
										<strong>Real-time:</strong> WebSocket
										for training updates
									</li>
								</ul>
							</div>

							<div className="bg-green-50 p-4 rounded-lg border border-green-200">
								<h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
									<Database className="h-5 w-5" />
									Backend Stack
								</h4>
								<ul className="text-sm text-slate-700 space-y-2 list-disc list-inside">
									<li>
										<strong>API Framework:</strong> FastAPI
										+ Python 3.10
									</li>
									<li>
										<strong>Database:</strong> SQLite with
										SQLAlchemy ORM
									</li>
									<li>
										<strong>ML Frameworks:</strong> PyTorch
										+ scikit-learn
									</li>
									<li>
										<strong>Data Processing:</strong> NumPy
										+ Pandas
									</li>
									<li>
										<strong>Async:</strong> WebSocket for
										real-time updates
									</li>
								</ul>
							</div>
						</div>
					</div>

					{/* Part 2: Data Flow & Service Design */}
					<div>
						<h3 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">
							Data Flow & Service Design
						</h3>
						<div className="bg-orange-50 p-4 rounded-lg border border-orange-200 mb-6">
							<h4 className="font-semibold text-orange-800 mb-3">
								High-Level Data Pipeline
							</h4>
							<div className="grid md:grid-cols-3 gap-4 text-sm">
								<div className="bg-white p-3 rounded border text-center">
									<div className="font-semibold text-blue-600 mb-1">
										Input Layer
									</div>
									<div className="text-xs text-slate-600">
										Raw IoT Sensor Data
									</div>
								</div>
								<div className="bg-white p-3 rounded border text-center">
									<div className="font-semibold text-green-600 mb-1">
										Processing Layer
									</div>
									<div className="text-xs text-slate-600">
										Feature Extraction & Sequencing
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
						<div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
							<h4 className="font-semibold text-indigo-800 mb-3">
								Core Backend Service Classes
							</h4>
							<CodeBlock lang="python">{`class CandidateGenerator:
    """Multi-rule anomaly candidate generation"""
    async def generate_candidates(self, params: FilterParams) -> List[AnomalyEvent]

class ModelTrainer:
    """LSTM+PU model training with WebSocket progress updates"""
    async def train_model(self, config: TrainingConfig) -> TrainedModel

class ModelEvaluator:
    """Multi-scenario evaluation (ERM/Generalization/Adaptation)"""
    async def evaluate_model(self, model_id: str, scenario: EvaluationScenario)`}</CodeBlock>
						</div>
					</div>

					{/* Part 3: ML Experimental Setup */}
					<div>
						<h3 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">
							ML Experimental Setup
						</h3>
						<div className="grid md:grid-cols-2 gap-8">
							<div>
								<h4 className="text-xl font-semibold text-gray-700 mb-3 flex items-center gap-2">
									<HardDrive className="h-6 w-6" />
									Hardware Specifications
								</h4>
								<ul className="space-y-2 text-gray-600 list-disc list-inside">
									<li>
										<strong>CPU:</strong> Intel Core
										i9-13900K
									</li>
									<li>
										<strong>GPU:</strong> NVIDIA GeForce RTX
										4090 (24GB VRAM)
									</li>
									<li>
										<strong>Memory (RAM):</strong> 64 GB
										DDR5
									</li>
									<li>
										<strong>Storage:</strong> 2TB NVMe SSD
									</li>
								</ul>
							</div>
							<div>
								<h4 className="text-xl font-semibold text-gray-700 mb-3 flex items-center gap-2">
									<Bot className="h-6 w-6" />
									Software Environment
								</h4>
								<ul className="space-y-2 text-gray-600 list-disc list-inside">
									<li>
										<strong>OS:</strong> Ubuntu 22.04 LTS
									</li>
									<li>
										<strong>Language:</strong> Python 3.10
									</li>
									<li className="font-semibold text-gray-700 pt-2">
										Key Libraries:
									</li>
									<ul className="pl-5 space-y-1 list-[square] list-inside">
										<li>PyTorch: 2.1.0 (CUDA 12.1)</li>
										<li>Scikit-learn: 1.3.2</li>
										<li>Pandas: 2.1.1</li>
										<li>NumPy: 1.26.0</li>
									</ul>
								</ul>
							</div>
						</div>
					</div>
				</CardContent>

				<CardFooter className="mt-4">
					<div className="w-full text-center text-sm text-gray-500 p-3 bg-slate-50 rounded-lg border">
						<strong>Performance Benchmark:</strong> On this
						configuration, a full model training cycle (from data
						ingestion to final model artifact) took approximately{" "}
						<strong>45 minutes</strong> to complete.
					</div>
				</CardFooter>
			</Card>
		</section>
	);
}
