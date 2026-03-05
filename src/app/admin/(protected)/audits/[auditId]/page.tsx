import { prisma } from '@/lib/db'
import { requireAdminOrRedirect } from '@/lib/requireAdminOrRedirect'
import Link from 'next/link'
import { AuditActions as Actions } from './Actions'

export const dynamic = 'force-dynamic'

export default async function AdminAuditDetailPage({ params }: { params: Promise<{ auditId: string }> }) {
  await requireAdminOrRedirect()
  const { auditId } = await params

  const audit = await prisma.auditRequest.findUnique({ where: { auditId } })
  if (!audit) {
    return (
      <main className="bg-background-surface">
        <section className="max-w-4xl mx-auto px-6 lg:px-12 py-16">Not found.</section>
      </main>
    )
  }

  return (
    <main className="bg-background-surface">
      <section className="max-w-4xl mx-auto px-6 lg:px-12 py-12">
        <div className="flex items-start justify-between gap-6 mb-8">
          <div>
            <Link href="/admin/audits" className="text-sm font-semibold text-primary">
              ← Back
            </Link>
            <h1 className="font-serif text-4xl text-slate-900 mt-2">{audit.auditId}</h1>
            <p className="text-slate-600">{audit.businessName}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Status</p>
            <p className="text-lg font-semibold">{audit.status}</p>
          </div>
        </div>

        <div className="bg-white border border-border-subtle rounded-2xl p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Contact</p>
              <p className="text-slate-900 font-semibold">{audit.fullName}</p>
              <p className="text-slate-600">{audit.email}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Links</p>
              <div className="text-sm text-slate-700 space-y-1">
                {audit.websiteUrl ? <a className="text-primary" href={audit.websiteUrl} target="_blank">Website</a> : null}
                {audit.instagramUrl ? <a className="text-primary block" href={audit.instagramUrl} target="_blank">Instagram</a> : null}
                {audit.youtubeUrl ? <a className="text-primary block" href={audit.youtubeUrl} target="_blank">YouTube</a> : null}
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Goal</p>
            <p className="text-slate-800">{audit.primaryGoal || '-'}</p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Constraint</p>
            <p className="text-slate-800 whitespace-pre-wrap">{audit.biggestConstraint || '-'}</p>
          </div>

          {/* actions */}
          {/* Client-side to avoid landing on JSON responses */}
          {/**/}
          <Actions auditId={audit.auditId} defaultEmail={audit.email} />
        </div>
      </section>
    </main>
  )
}
