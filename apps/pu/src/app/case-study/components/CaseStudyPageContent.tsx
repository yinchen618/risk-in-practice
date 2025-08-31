'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CaseStudyV2Page as WorkbenchTab } from '../../case-study-v2/page.tsx'
import EvaluationTab from './EvaluationTab'
import ImplementationTab from './ImplementationTab'
import ProblemApproachTab from './ProblemApproachTab'
import ResearchNotesTab from './ResearchNotesTab'
import TabNavigation, { type TabKey } from './TabNavigation'

export default function CaseStudyPageContent() {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab') as TabKey
  const [activeTab, setActiveTab] = useState<TabKey>(tabParam || 'problem')

  // Sync activeTab with URL parameters
  useEffect(() => {
    const tab = searchParams.get('tab') as TabKey | null
    if (tab && ['problem', 'implementation', 'workbench', 'evaluation', 'notes'].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100" id="top">
      {/* TabNavigation */}
      <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Main Title */}
        {/* <div className="text-center mb-8">
					<h1 className="text-4xl font-bold text-slate-900 mb-2">
						PU Learning for Anomaly Detection in Smart Home IoT
					</h1>
					<p className="text-xl text-slate-600 max-w-4xl mx-auto">
						A comprehensive case study implementing
						Positive-Unlabeled Learning for real-world anomaly
						detection using residential electricity data
					</p>
				</div> */}

        {/* Tab Content */}
        {activeTab === 'problem' && <ProblemApproachTab />}
        {activeTab === 'implementation' && <ImplementationTab />}
        {/* {activeTab === "workbench" && <WorkbenchTab />} */}
        {activeTab === 'workbench' && <WorkbenchTab />}
        {activeTab === 'evaluation' && <EvaluationTab />}
        {activeTab === 'notes' && <ResearchNotesTab />}
      </div>
    </div>
  )
}
