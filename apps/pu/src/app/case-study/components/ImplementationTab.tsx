"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Brain,
	CheckCircle2,
	Code,
	Database,
	GitBranch,
	Layers,
	Monitor,
	Server,
	Settings,
} from "lucide-react";

export default function ImplementationTab() {
	return (
		<div className="space-y-8">
			{/* Tab-specific heading */}
			<div className="text-center mb-8">
				<h2 className="text-3xl font-semibold text-slate-800 mb-4">
					System Implementation & Architecture
				</h2>
				<p className="text-lg text-slate-600 max-w-3xl mx-auto">
					Full-stack implementation of the PU Learning pipeline with
					modern web technologies
				</p>
			</div>

			{/* Architecture Overview */}
			<Card className="border-l-4 border-l-blue-500">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Layers className="h-5 w-5 text-blue-500" />
						System Architecture
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid md:grid-cols-3 gap-6">
						<div className="text-center">
							<div className="p-4 bg-blue-50 rounded-lg mb-3">
								<Monitor className="h-8 w-8 text-blue-600 mx-auto mb-2" />
								<h4 className="font-semibold text-blue-700">
									Frontend
								</h4>
							</div>
							<ul className="text-sm space-y-1">
								<li>• Next.js 14 (App Router)</li>
								<li>• TypeScript</li>
								<li>• Tailwind CSS</li>
								<li>• shadcn/ui components</li>
								<li>• Real-time WebSocket updates</li>
							</ul>
						</div>
						<div className="text-center">
							<div className="p-4 bg-green-50 rounded-lg mb-3">
								<Server className="h-8 w-8 text-green-600 mx-auto mb-2" />
								<h4 className="font-semibold text-green-700">
									Backend API
								</h4>
							</div>
							<ul className="text-sm space-y-1">
								<li>• FastAPI (Python)</li>
								<li>• Async/await architecture</li>
								<li>• RESTful API design</li>
								<li>• WebSocket support</li>
								<li>• Background job processing</li>
							</ul>
						</div>
						<div className="text-center">
							<div className="p-4 bg-purple-50 rounded-lg mb-3">
								<Database className="h-8 w-8 text-purple-600 mx-auto mb-2" />
								<h4 className="font-semibold text-purple-700">
									Data Layer
								</h4>
							</div>
							<ul className="text-sm space-y-1">
								<li>• SQLite for development</li>
								<li>• Prisma ORM</li>
								<li>• PostgreSQL for production</li>
								<li>• Versioned datasets</li>
								<li>• Model artifact storage</li>
							</ul>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* ML Pipeline Implementation */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Brain className="h-5 w-5 text-purple-500" />
						ML Pipeline Implementation
					</CardTitle>
					<CardDescription>
						End-to-end machine learning pipeline with PU learning
						algorithms
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="grid md:grid-cols-2 gap-6">
						<div>
							<h4 className="font-semibold mb-3 flex items-center gap-2">
								<Code className="h-4 w-4" />
								Core ML Components
							</h4>
							<div className="space-y-3">
								<div className="p-3 bg-slate-50 rounded">
									<Badge variant="secondary" className="mb-1">
										Data Preprocessing
									</Badge>
									<p className="text-xs text-slate-600">
										Multi-scale ETL with temporal feature
										extraction
									</p>
								</div>
								<div className="p-3 bg-blue-50 rounded">
									<Badge className="mb-1">
										LSTM Architecture
									</Badge>
									<p className="text-xs text-blue-700">
										Configurable layers, dropout, attention
										mechanisms
									</p>
								</div>
								<div className="p-3 bg-green-50 rounded">
									<Badge className="mb-1">
										PU Loss Functions
									</Badge>
									<p className="text-xs text-green-700">
										uPU and nnPU implementations with
										auto-prior estimation
									</p>
								</div>
								<div className="p-3 bg-purple-50 rounded">
									<Badge className="mb-1">
										Hyperparameter Optimization
									</Badge>
									<p className="text-xs text-purple-700">
										Grid search with cross-validation
									</p>
								</div>
							</div>
						</div>
						<div>
							<h4 className="font-semibold mb-3 flex items-center gap-2">
								<Settings className="h-4 w-4" />
								Technical Features
							</h4>
							<div className="space-y-2">
								<div className="flex items-center gap-2">
									<CheckCircle2 className="h-4 w-4 text-green-500" />
									<span className="text-sm">
										Async training with WebSocket progress
									</span>
								</div>
								<div className="flex items-center gap-2">
									<CheckCircle2 className="h-4 w-4 text-green-500" />
									<span className="text-sm">
										Model versioning and artifact management
									</span>
								</div>
								<div className="flex items-center gap-2">
									<CheckCircle2 className="h-4 w-4 text-green-500" />
									<span className="text-sm">
										Cross-domain evaluation framework
									</span>
								</div>
								<div className="flex items-center gap-2">
									<CheckCircle2 className="h-4 w-4 text-green-500" />
									<span className="text-sm">
										Comprehensive metric tracking
									</span>
								</div>
								<div className="flex items-center gap-2">
									<CheckCircle2 className="h-4 w-4 text-green-500" />
									<span className="text-sm">
										Experiment reproducibility
									</span>
								</div>
								<div className="flex items-center gap-2">
									<CheckCircle2 className="h-4 w-4 text-green-500" />
									<span className="text-sm">
										Real-time performance monitoring
									</span>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Key Implementation Details */}
			<div className="grid md:grid-cols-2 gap-6">
				<Card>
					<CardHeader>
						<CardTitle className="text-lg">
							Data Processing Pipeline
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-3">
							<div className="border-l-4 border-blue-400 pl-3">
								<h5 className="font-semibold text-sm">
									Multi-scale Feature Extraction
								</h5>
								<p className="text-xs text-slate-600">
									15-minute and 60-minute sliding windows for
									temporal patterns
								</p>
							</div>
							<div className="border-l-4 border-green-400 pl-3">
								<h5 className="font-semibold text-sm">
									Time-based Data Splitting
								</h5>
								<p className="text-xs text-slate-600">
									Chronological splits to prevent data leakage
								</p>
							</div>
							<div className="border-l-4 border-purple-400 pl-3">
								<h5 className="font-semibold text-sm">
									Anomaly Event Association
								</h5>
								<p className="text-xs text-slate-600">
									Automatic labeling based on temporal
									proximity
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="text-lg">
							Model Architecture
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-3">
							<div className="border-l-4 border-red-400 pl-3">
								<h5 className="font-semibold text-sm">
									LSTM Feature Encoder
								</h5>
								<p className="text-xs text-slate-600">
									Bidirectional LSTM with configurable layers
									and dropout
								</p>
							</div>
							<div className="border-l-4 border-orange-400 pl-3">
								<h5 className="font-semibold text-sm">
									PU Learning Loss
								</h5>
								<p className="text-xs text-slate-600">
									Risk correction with automatic prior
									estimation
								</p>
							</div>
							<div className="border-l-4 border-teal-400 pl-3">
								<h5 className="font-semibold text-sm">
									Early Stopping
								</h5>
								<p className="text-xs text-slate-600">
									F1-score based stopping with model
									checkpointing
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* API Endpoints */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<GitBranch className="h-5 w-5 text-green-500" />
						API Implementation
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid md:grid-cols-2 gap-6">
						<div>
							<h4 className="font-semibold mb-3">
								Experiment Management
							</h4>
							<div className="space-y-2 font-mono text-xs">
								<div className="p-2 bg-slate-100 rounded">
									<span className="text-green-600">POST</span>{" "}
									/api/v2/experiment-runs
								</div>
								<div className="p-2 bg-slate-100 rounded">
									<span className="text-blue-600">GET</span>{" "}
									/api/v2/experiment-runs
								</div>
								<div className="p-2 bg-slate-100 rounded">
									<span className="text-blue-600">GET</span>{" "}
									/api/v2/experiment-runs/:id/history
								</div>
								<div className="p-2 bg-slate-100 rounded">
									<span className="text-orange-600">
										DELETE
									</span>{" "}
									/api/v2/experiment-runs/:id
								</div>
							</div>
						</div>
						<div>
							<h4 className="font-semibold mb-3">
								Training & Evaluation
							</h4>
							<div className="space-y-2 font-mono text-xs">
								<div className="p-2 bg-slate-100 rounded">
									<span className="text-green-600">POST</span>{" "}
									/api/v2/start-training-job
								</div>
								<div className="p-2 bg-slate-100 rounded">
									<span className="text-green-600">POST</span>{" "}
									/api/v2/start-evaluation-job
								</div>
								<div className="p-2 bg-slate-100 rounded">
									<span className="text-blue-600">GET</span>{" "}
									/api/v2/trained-models
								</div>
								<div className="p-2 bg-slate-100 rounded">
									<span className="text-blue-600">GET</span>{" "}
									/api/v2/evaluation-runs
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Technology Stack Summary */}
			<Alert>
				<Code className="h-4 w-4" />
				<AlertDescription>
					<strong>Technology Stack Summary:</strong> Modern full-stack
					implementation with Next.js frontend, FastAPI backend, and
					comprehensive ML pipeline. The system supports real-time
					training monitoring, experiment management, and cross-domain
					evaluation with full reproducibility.
				</AlertDescription>
			</Alert>
		</div>
	);
}
