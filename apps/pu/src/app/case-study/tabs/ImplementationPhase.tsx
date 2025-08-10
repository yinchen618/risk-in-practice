"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Activity,
	AlertTriangle,
	Brain,
	Clock,
	Database,
	FlaskConical,
} from "lucide-react";

export function ImplementationPhase() {
	return (
		<div className="space-y-8">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center">
						<FlaskConical className="h-5 w-5 mr-2 text-orange-600" />
						Implementation Details
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
						<div className="space-y-6">
							<div className="bg-orange-50 p-6 rounded-lg">
								<h4 className="font-semibold text-orange-800 mb-4">
									Technical Stack
								</h4>
								<div className="space-y-3">
									<div className="flex items-center justify-between">
										<span className="text-sm text-orange-700">
											Machine Learning
										</span>
										<Badge className="bg-orange-100 text-orange-800">
											PyTorch (nnPU/uPU training &
											inference)
										</Badge>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-sm text-orange-700">
											Data Processing
										</span>
										<Badge className="bg-orange-100 text-orange-800">
											Pandas, NumPy (feature engineering &
											analysis)
										</Badge>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-sm text-orange-700">
											Serving & Scheduling
										</span>
										<Badge className="bg-orange-100 text-orange-800">
											FastAPI + Uvicorn (REST, background
											tasks)
										</Badge>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-sm text-orange-700">
											Model Evaluation
										</span>
										<Badge className="bg-orange-100 text-orange-800">
											scikit-learn (metrics & calibration)
										</Badge>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-sm text-orange-700">
											Data Store
										</span>
										<Badge className="bg-orange-100 text-orange-800">
											PostgreSQL + SQLAlchemy + Alembic
										</Badge>
									</div>
								</div>
							</div>

							<div className="bg-indigo-50 p-6 rounded-lg">
								<h4 className="font-semibold text-indigo-800 mb-4">
									Model Architecture
								</h4>
								<div className="space-y-3 text-sm text-indigo-700">
									<p>
										<strong>Base Model:</strong> Deep Neural
										Network (3 hidden layers)
									</p>
									<p>
										<strong>Input Features:</strong>{" "}
										Temporal + statistical (normalized)
									</p>
									<p>
										<strong>Hidden Layers:</strong> [128,
										64, 32] with ReLU activation
									</p>
									<p>
										<strong>Output:</strong> Binary
										classification (anomaly probability)
									</p>
									<p>
										<strong>Loss Function:</strong> nnPU
										loss with sigmoid activation
									</p>
								</div>
							</div>
						</div>

						<div className="space-y-6">
							<div className="bg-green-50 p-6 rounded-lg">
								<h4 className="font-semibold text-green-800 mb-4">
									Training Process
								</h4>
								<div className="space-y-4">
									<div className="border-l-4 border-green-500 pl-4">
										<h5 className="font-medium text-green-700">
											Phase 1: Data Preparation
										</h5>
										<p className="text-sm text-green-600">
											Feature extraction, normalization,
											train/val split
										</p>
									</div>
									<div className="border-l-4 border-blue-500 pl-4">
										<h5 className="font-medium text-blue-700">
											Phase 2: Prior Estimation
										</h5>
										<p className="text-sm text-blue-600">
											AlphaMax algorithm to estimate class
											prior π⁺
										</p>
									</div>
									<div className="border-l-4 border-purple-500 pl-4">
										<h5 className="font-medium text-purple-700">
											Phase 3: Model Training
										</h5>
										<p className="text-sm text-purple-600">
											nnPU training with early stopping
										</p>
									</div>
									<div className="border-l-4 border-orange-500 pl-4">
										<h5 className="font-medium text-orange-700">
											Phase 4: Validation
										</h5>
										<p className="text-sm text-orange-600">
											Performance evaluation on a held-out
											set of known positive anomalies and
											a random sample of unlabeled data
										</p>
									</div>
								</div>
							</div>

							<div className="bg-yellow-50 p-6 rounded-lg">
								<h4 className="font-semibold text-yellow-800 mb-4">
									Deployment Pipeline
								</h4>
								<div className="space-y-2 text-sm text-yellow-700">
									<div className="flex items-center space-x-2">
										<Clock className="h-4 w-4" />
										<span>
											Data ingestion scheduled every
											minute via cron; supports manual
											fetch and a 60s loop
										</span>
									</div>
									<div className="flex items-center space-x-2">
										<Database className="h-4 w-4" />
										<span>
											PostgreSQL-backed time-series &
											anomaly tables with optimized
											indexes
										</span>
									</div>
									<div className="flex items-center space-x-2">
										<Activity className="h-4 w-4" />
										<span>
											Features computed via background
											tasks in 5-minute rolling windows
										</span>
									</div>
									<div className="flex items-center space-x-2">
										<Brain className="h-4 w-4" />
										<span>
											Real-time inference via FastAPI
											endpoints; tunable confidence
											threshold
										</span>
									</div>
									<div className="flex items-center space-x-2">
										<AlertTriangle className="h-4 w-4" />
										<span>
											Automated alerting for timely
											facility management response
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
