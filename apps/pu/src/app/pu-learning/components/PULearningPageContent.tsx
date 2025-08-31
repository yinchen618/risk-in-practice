'use client'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import ApplicationsTab from './ApplicationsTab'
import DemoSection from './DemoSection'
import ReferencesTab from './ReferencesTab'
import type { TabKey } from './TabNavigation'
import TabNavigation from './TabNavigation'
import TheoryTab from './TheoryTab'

export default function PULearningPageContent() {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab') as TabKey
  // 分頁狀態
  const [activeTab, setActiveTab] = useState<TabKey>(tabParam || 'demo')

  // Sync activeTab with URL parameters
  useEffect(() => {
    const tab = searchParams.get('tab') as TabKey
    if (tab && ['demo', 'theory', 'applications', 'references'].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100" id="top">
      {/* C1: TabNavigation */}
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 主要內容區域 */}
      <div className="container mx-auto px-4 py-8">
        {/* Demo 分頁 */}
        {activeTab === 'demo' && <DemoSection />}

        {/* 理論背景分頁 */}
        {activeTab === 'theory' && <TheoryTab />}

        {/* 實務應用分頁 */}
        {activeTab === 'applications' && <ApplicationsTab />}

        {/* 參考文獻分頁 */}
        {activeTab === 'references' && <ReferencesTab />}
      </div>

      {/* C6: 頁尾 */}
      <footer className="bg-white border-t mt-16">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-sm text-slate-500">
            Interactive PU Learning Demonstrator •
            <a href="mailto:your.email@example.com" className="text-blue-600 hover:underline ml-1">
              Contact
            </a>{' '}
            •
            <a
              href="https://github.com/yourusername"
              className="text-blue-600 hover:underline ml-1"
            >
              GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
