'use client'

import { useQuery } from '@tanstack/react-query'
import { caseStudyV2API } from '../api/client'

export function useExperimentHistory(experimentRunId?: string) {
  return useQuery({
    queryKey: ['experiment-history', experimentRunId],
    queryFn: () =>
      experimentRunId
        ? caseStudyV2API.getExperimentHistory(experimentRunId)
        : Promise.resolve(null),
    enabled: !!experimentRunId,
    staleTime: 30000, // 30 seconds
  })
}
