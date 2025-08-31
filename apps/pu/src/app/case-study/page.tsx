'use client'

import { Suspense } from 'react'
import CaseStudyPageContent from './components/CaseStudyPageContent'

export default function CaseStudyPage() {
  return (
    <Suspense fallback={<CaseStudyPageSkeleton />}>
      <CaseStudyPageContent />
    </Suspense>
  )
}

function CaseStudyPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <div className="h-12 bg-slate-200 rounded animate-pulse mb-2" />
          <div className="h-6 bg-slate-200 rounded animate-pulse" />
        </div>
        <div className="space-y-8">
          <div className="h-96 bg-slate-200 rounded animate-pulse" />
          <div className="h-64 bg-slate-200 rounded animate-pulse" />
          <div className="h-48 bg-slate-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  )
}
