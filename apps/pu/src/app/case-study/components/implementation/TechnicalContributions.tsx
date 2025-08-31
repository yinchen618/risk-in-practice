'use client'

import { Target } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TechnicalContributions() {
  return (
    <section id="technical-contributions" className="scroll-mt-6">
      <Card className="border-l-4 border-l-teal-400 bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold text-teal-800 flex items-center gap-3">
            <Target className="h-8 w-8" />
            Technical Contributions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
              <h4 className="font-semibold text-teal-800 mb-3">Academic Innovations</h4>
              <ul className="text-sm text-slate-700 list-disc list-inside space-y-2">
                <li>Integration of LSTM temporal modeling with non-negative PU risk estimation</li>
                <li>
                  Systematic multi-scenario evaluation framework (ERM / Generalization / Adaptation)
                </li>
                <li>Adaptive multi-rule anomaly candidate generation pipeline</li>
                <li>End-to-end reproducible PU learning experiment platform</li>
                <li>Expert-in-the-loop workflow for IoT anomaly detection</li>
              </ul>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h4 className="font-semibold text-slate-800 mb-3">Engineering Accomplishments</h4>
              <ul className="text-sm text-slate-700 list-disc list-inside space-y-2">
                <li>Reactive data layer with cached queries & real-time streaming updates</li>
                <li>Atomic transactional labeling ensuring statistical coherence</li>
                <li>Comprehensive artifact versioning (model + scaler + metadata)</li>
                <li>Pluggable scenario runner for rapid comparative studies</li>
                <li>WebSocket-based training progress monitoring</li>
              </ul>
            </div>
          </div>

          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
            <h4 className="font-semibold text-indigo-800 mb-3">System Performance & Scale</h4>
            <div className="grid md:grid-cols-4 gap-4 text-center">
              <div className="bg-white p-3 rounded border">
                <div className="font-bold text-blue-600 text-lg">1500+</div>
                <div className="text-xs text-slate-600">Frontend LOC</div>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="font-bold text-green-600 text-lg">3947</div>
                <div className="text-xs text-slate-600">Backend LOC</div>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="font-bold text-red-600 text-lg">50+</div>
                <div className="text-xs text-slate-600">API Endpoints</div>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="font-bold text-orange-600 text-lg">0.85+</div>
                <div className="text-xs text-slate-600">F1 Score</div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-3">Research Impact</h4>
              <ul className="text-sm text-slate-700 space-y-1">
                <li>• First LSTM + PU Learning integration for IoT anomaly detection</li>
                <li>• Standardized evaluation framework for PU Learning research</li>
                <li>• Open-source platform for reproducible experiments</li>
                <li>• Multi-domain applicability (energy, healthcare, manufacturing)</li>
              </ul>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-3">Industrial Applications</h4>
              <ul className="text-sm text-slate-700 space-y-1">
                <li>• Smart building energy management systems</li>
                <li>• Multi-tenant IoT deployment scenarios</li>
                <li>• Real-time anomaly monitoring dashboards</li>
                <li>• Expert knowledge integration workflows</li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h4 className="font-semibold text-yellow-800 mb-3">Technical Innovation Summary</h4>
            <p className="text-sm text-slate-700 leading-relaxed">
              This system establishes a new standard for PU Learning applications in IoT
              environments, particularly addressing the challenges of temporal dependencies, expert
              knowledge integration, and cross-domain generalization. The comprehensive evaluation
              framework and production-ready implementation bridge the gap between academic research
              and real-world deployment, providing both theoretical contributions and practical
              solutions for anomaly detection in smart infrastructure.
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
