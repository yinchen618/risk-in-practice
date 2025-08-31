'use client'

import {
  Beaker,
  BookOpen,
  Calendar,
  FileText,
  GitBranch,
  Lightbulb,
  Quote,
  Users,
} from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ResearchNotesTab() {
  return (
    <div className="space-y-8">
      {/* Tab-specific heading */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-semibold text-slate-800 mb-4">
          Research Notes & Future Directions
        </h2>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
          Theoretical insights, experimental observations, and future research opportunities
        </p>
      </div>

      {/* Theoretical Contributions */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-500" />
            Theoretical Contributions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Novel Insights
              </h4>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h5 className="font-semibold text-sm text-blue-800">Temporal PU Learning</h5>
                  <p className="text-xs text-blue-700 mt-1">
                    Extension of PU learning to time-series data with LSTM architectures for
                    capturing temporal dependencies in anomaly patterns.
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <h5 className="font-semibold text-sm text-green-800">
                    Multi-scale Feature Integration
                  </h5>
                  <p className="text-xs text-green-700 mt-1">
                    Novel approach combining 15-minute and 60-minute temporal windows for capturing
                    both short-term and long-term behavioral patterns.
                  </p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <h5 className="font-semibold text-sm text-purple-800">Cross-Domain Transfer</h5>
                  <p className="text-xs text-purple-700 mt-1">
                    Investigation of PU learning model transferability across different building
                    types and usage patterns.
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Beaker className="h-4 w-4" />
                Experimental Findings
              </h4>
              <div className="space-y-3">
                <div className="border-l-4 border-orange-400 pl-3">
                  <h5 className="font-semibold text-sm">nnPU vs uPU</h5>
                  <p className="text-xs text-slate-600">
                    nnPU consistently outperforms uPU in our domain, likely due to better handling
                    of noisy positive labels.
                  </p>
                </div>
                <div className="border-l-4 border-red-400 pl-3">
                  <h5 className="font-semibold text-sm">Window Size Impact</h5>
                  <p className="text-xs text-slate-600">
                    10-15 minute windows optimal for LSTM input. Longer windows lead to overfitting,
                    shorter ones miss patterns.
                  </p>
                </div>
                <div className="border-l-4 border-teal-400 pl-3">
                  <h5 className="font-semibold text-sm">Prior Estimation</h5>
                  <p className="text-xs text-slate-600">
                    Automatic prior estimation crucial for real-world deployment where true anomaly
                    rates are unknown.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Observations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Key Research Observations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400">
              <h4 className="font-semibold text-yellow-800 mb-2">
                Observation 1: Label Quality vs. Quantity
              </h4>
              <p className="text-sm text-yellow-700">
                High-quality expert labels (696 samples) outperform larger sets of noisy labels.
                Quality matters more than quantity in PU learning scenarios.
              </p>
            </div>
            <div className="p-4 bg-green-50 border-l-4 border-green-400">
              <h4 className="font-semibold text-green-800 mb-2">
                Observation 2: Temporal Consistency
              </h4>
              <p className="text-sm text-green-700">
                Time-based data splitting is crucial. Random splits lead to data leakage and
                overoptimistic results due to temporal autocorrelation.
              </p>
            </div>
            <div className="p-4 bg-blue-50 border-l-4 border-blue-400">
              <h4 className="font-semibold text-blue-800 mb-2">
                Observation 3: Feature Engineering Impact
              </h4>
              <p className="text-sm text-blue-700">
                Raw power values insufficient. Multi-scale statistical features (mean, std,
                percentiles) across different time windows significantly improve performance.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Literature Context */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Quote className="h-5 w-5 text-purple-500" />
            Literature Context & Related Work
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">PU Learning Foundations</h4>
              <div className="space-y-2 text-sm">
                <div className="p-2 bg-slate-50 rounded">
                  <span className="font-medium">Elkan & Noto (2008)</span>
                  <p className="text-xs text-slate-600">Original PU learning formulation</p>
                </div>
                <div className="p-2 bg-slate-50 rounded">
                  <span className="font-medium">du Plessis et al. (2014)</span>
                  <p className="text-xs text-slate-600">Risk estimation approach (uPU)</p>
                </div>
                <div className="p-2 bg-slate-50 rounded">
                  <span className="font-medium">Kiryo et al. (2017)</span>
                  <p className="text-xs text-slate-600">Non-negative PU learning (nnPU)</p>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Time Series Anomaly Detection</h4>
              <div className="space-y-2 text-sm">
                <div className="p-2 bg-slate-50 rounded">
                  <span className="font-medium">Malhotra et al. (2015)</span>
                  <p className="text-xs text-slate-600">LSTM for time series anomaly detection</p>
                </div>
                <div className="p-2 bg-slate-50 rounded">
                  <span className="font-medium">Su et al. (2019)</span>
                  <p className="text-xs text-slate-600">Robust anomaly detection in time series</p>
                </div>
                <div className="p-2 bg-slate-50 rounded">
                  <span className="font-medium">Audibert et al. (2020)</span>
                  <p className="text-xs text-slate-600">USAD for multivariate time series</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Future Research Directions */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-green-500" />
            Future Research Directions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Methodological Extensions</h4>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded">
                  <h5 className="font-semibold text-sm mb-1">Self-Supervised PU Learning</h5>
                  <p className="text-xs text-slate-600">
                    Combine contrastive learning with PU learning for better representation learning
                    from unlabeled data.
                  </p>
                  <Badge variant="outline" className="mt-1 text-xs">
                    High Priority
                  </Badge>
                </div>
                <div className="p-3 bg-purple-50 rounded">
                  <h5 className="font-semibold text-sm mb-1">Meta-Learning for PU</h5>
                  <p className="text-xs text-slate-600">
                    Few-shot learning approaches for rapid adaptation to new domains with minimal
                    labeled data.
                  </p>
                  <Badge variant="outline" className="mt-1 text-xs">
                    Research
                  </Badge>
                </div>
                <div className="p-3 bg-green-50 rounded">
                  <h5 className="font-semibold text-sm mb-1">Continual PU Learning</h5>
                  <p className="text-xs text-slate-600">
                    Online learning approaches for evolving anomaly patterns without catastrophic
                    forgetting.
                  </p>
                  <Badge variant="outline" className="mt-1 text-xs">
                    Long-term
                  </Badge>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Application Domains</h4>
              <div className="space-y-3">
                <div className="p-3 bg-orange-50 rounded">
                  <h5 className="font-semibold text-sm mb-1">Healthcare IoT</h5>
                  <p className="text-xs text-slate-600">
                    Apply PU learning to medical device anomaly detection where false positives have
                    high costs.
                  </p>
                  <Badge variant="outline" className="mt-1 text-xs">
                    Promising
                  </Badge>
                </div>
                <div className="p-3 bg-yellow-50 rounded">
                  <h5 className="font-semibold text-sm mb-1">Industrial IoT</h5>
                  <p className="text-xs text-slate-600">
                    Equipment failure prediction in manufacturing where normal operations dominate
                    the data.
                  </p>
                  <Badge variant="outline" className="mt-1 text-xs">
                    Commercial
                  </Badge>
                </div>
                <div className="p-3 bg-red-50 rounded">
                  <h5 className="font-semibold text-sm mb-1">Cybersecurity</h5>
                  <p className="text-xs text-slate-600">
                    Network intrusion detection where attack patterns are rare and evolving.
                  </p>
                  <Badge variant="outline" className="mt-1 text-xs">
                    Active
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Open Research Questions */}
      <Card>
        <CardHeader>
          <CardTitle>Open Research Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-lg">
              <h5 className="font-semibold text-sm mb-2">Theoretical</h5>
              <ul className="text-xs space-y-1 text-slate-600">
                <li>• Optimal prior estimation for temporal data</li>
                <li>• Generalization bounds for time-series PU learning</li>
                <li>• Sample complexity analysis</li>
              </ul>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <h5 className="font-semibold text-sm mb-2">Practical</h5>
              <ul className="text-xs space-y-1 text-slate-600">
                <li>• Automated hyperparameter selection</li>
                <li>• Real-time anomaly detection systems</li>
                <li>• Handling concept drift</li>
              </ul>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <h5 className="font-semibold text-sm mb-2">Evaluation</h5>
              <ul className="text-xs space-y-1 text-slate-600">
                <li>• Standardized PU learning benchmarks</li>
                <li>• Cross-domain evaluation protocols</li>
                <li>• Interpretability metrics</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Research Timeline */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-indigo-600" />
            Research Timeline & Milestones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 text-sm font-medium text-slate-600">Q1 2024</div>
              <div className="flex-1 p-3 bg-white rounded shadow-sm">
                <h5 className="font-semibold text-sm">Problem Formulation</h5>
                <p className="text-xs text-slate-600">
                  Initial problem analysis and PU learning approach design
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 text-sm font-medium text-slate-600">Q2 2024</div>
              <div className="flex-1 p-3 bg-white rounded shadow-sm">
                <h5 className="font-semibold text-sm">Data Pipeline & Infrastructure</h5>
                <p className="text-xs text-slate-600">
                  ETL system, feature engineering, and experimental framework
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 text-sm font-medium text-slate-600">Q3 2024</div>
              <div className="flex-1 p-3 bg-white rounded shadow-sm">
                <h5 className="font-semibold text-sm">Model Development & Training</h5>
                <p className="text-xs text-slate-600">
                  LSTM architecture design, PU learning implementation, hyperparameter optimization
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 text-sm font-medium text-slate-600">Q4 2024</div>
              <div className="flex-1 p-3 bg-green-100 rounded shadow-sm border-l-4 border-green-500">
                <h5 className="font-semibold text-sm">Evaluation & Analysis</h5>
                <p className="text-xs text-slate-600">
                  Comprehensive evaluation, cross-domain testing, results analysis
                </p>
                <Badge className="mt-1">Current</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resources & References */}
      <Alert>
        <Users className="h-4 w-4" />
        <AlertDescription>
          <strong>Research Collaboration:</strong> This work builds on theoretical foundations from
          the PU learning community and practical insights from IoT anomaly detection research. The
          implementation serves as both a case study and a reference implementation for temporal PU
          learning applications.
        </AlertDescription>
      </Alert>
    </div>
  )
}
