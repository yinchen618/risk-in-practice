import { redirect } from 'next/navigation'

export default function CaseStudyV2RedirectPage() {
  // Redirect to the default new experiment route
  redirect('/case-study-v2/new/stage-1')
}
