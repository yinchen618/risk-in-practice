'use client'

import { Brain } from 'lucide-react'
import { LaTeX } from '@/components/LaTeX'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SystemOverview() {
  return (
    <section id="system-overview" className="scroll-mt-6">
      <Card className="border-l-4 border-l-blue-400 bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold text-blue-800 flex items-center gap-3">
            <Brain className="h-8 w-8" />
            System Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg text-slate-700">
            An end-to-end PU Learning platform for time-series anomaly detection in smart energy
            monitoring: raw data ingestion → candidate generation → expert labeling → PU training →
            multi-scenario evaluation.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h4 className="font-semibold text-red-800 mb-3">Core Challenges</h4>
              <ul className="text-sm text-slate-600 space-y-2 list-disc list-inside">
                <li>Label scarcity & costly expert review</li>
                <li>High class imbalance (rare anomalies)</li>
                <li>Temporal drift & domain shifts</li>
                <li>Multi-building deployment complexity</li>
              </ul>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-3">Key Innovations</h4>
              <ul className="text-sm text-slate-600 space-y-2 list-disc list-inside">
                <li>LSTM + PU Learning integration</li>
                <li>Intelligent candidate generation</li>
                <li>Multi-scenario evaluation framework</li>
                <li>Expert-in-the-loop workflow</li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-3">PU Learning Risk Formula</h4>
            <div className="mb-2">
              <LaTeX>{`$$\\text{Risk}(f) = \\pi \\cdot R_P^+(f) + (1-\\pi) \\cdot R_N^-(f)$$${''}`}</LaTeX>
            </div>
            <p className="text-sm text-slate-600">
              Non-negative PU risk estimation where π is prior probability, R_P^+ is positive risk,
              and R_N^- is negative risk.
            </p>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h4 className="font-semibold text-yellow-800 mb-3">Four-Stage Workflow</h4>
            <div className="grid md:grid-cols-4 gap-3 text-center">
              <div className="bg-white p-3 rounded border">
                <div className="font-semibold text-blue-600 text-sm">Stage 1</div>
                <div className="text-xs text-slate-600">Candidate Generation</div>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="font-semibold text-green-600 text-sm">Stage 2</div>
                <div className="text-xs text-slate-600">Expert Labeling</div>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="font-semibold text-red-600 text-sm">Stage 3</div>
                <div className="text-xs text-slate-600">PU Training</div>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="font-semibold text-orange-600 text-sm">Stage 4</div>
                <div className="text-xs text-slate-600">Results Analysis</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
