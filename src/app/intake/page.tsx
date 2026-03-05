import { Suspense } from 'react'
import { IntakeClient } from './IntakeClient'

export const dynamic = 'force-dynamic'

export default function IntakePage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto px-6 lg:px-12 py-16">Loading…</div>}>
      <IntakeClient />
    </Suspense>
  )
}
