import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full bg-slate-100 text-slate-600">{children}</span>
}

export default async function CRMLeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const lead = await prisma.lead.findUnique({ where: { id } })
  if (!lead) return notFound()

  const touchpoints = await prisma.touchpoint.findMany({
    where: { leadId: lead.id },
    orderBy: { createdAt: 'desc' },
    take: 200,
  })

  const notes = await prisma.leadNote.findMany({
    where: { leadId: lead.id },
    orderBy: { createdAt: 'desc' },
    take: 200,
  })

  return (
    <section className="p-6 lg:p-10">
      <div className="flex items-start justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">{lead.name || lead.email}</h1>
            <Badge>{lead.stage}</Badge>
          </div>
          <div className="text-sm text-slate-500 mt-1">{lead.company || '-'} {lead.role ? `· ${lead.role}` : ''}</div>
          <div className="text-xs text-slate-500 mt-2">Lead ID: {lead.id}</div>
        </div>
        <Link href="/admin/crm/leads" className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-sm font-semibold">
          Back
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Contact</p>
            <div className="mt-3 text-sm text-slate-800 space-y-1">
              <div><span className="text-slate-500">Email:</span> {lead.email}</div>
              <div><span className="text-slate-500">WhatsApp:</span> {lead.whatsapp || '-'}</div>
            </div>

            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mt-6">Profiles</p>
            <div className="mt-3 text-sm space-y-1">
              {lead.websiteUrl ? (
                <a className="text-primary block" href={lead.websiteUrl} target="_blank" rel="noreferrer">Website</a>
              ) : null}
              {lead.instagramUrl ? (
                <a className="text-primary block" href={lead.instagramUrl} target="_blank" rel="noreferrer">Instagram</a>
              ) : null}
              {lead.linkedinUrl ? (
                <a className="text-primary block" href={lead.linkedinUrl} target="_blank" rel="noreferrer">LinkedIn</a>
              ) : null}
              {!lead.websiteUrl && !lead.instagramUrl && !lead.linkedinUrl ? <span className="text-slate-500">-</span> : null}
            </div>

            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mt-6">Follow-up</p>
            <div className="mt-3 text-sm text-slate-800 space-y-1">
              <div><span className="text-slate-500">Next:</span> {lead.nextFollowUpAt ? new Date(lead.nextFollowUpAt).toLocaleString() : '-'}</div>
              <div><span className="text-slate-500">Last contacted:</span> {lead.lastContactedAt ? new Date(lead.lastContactedAt).toLocaleString() : '-'}</div>
            </div>

            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mt-6">Tags</p>
            <div className="mt-3 text-sm text-slate-800">{lead.tags || '-'}</div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="text-sm font-semibold">Touchpoints</div>
              <Badge>{touchpoints.length}</Badge>
            </div>
            <div className="divide-y divide-slate-100">
              {touchpoints.map((t) => (
                <div key={t.id} className="p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-sm font-semibold text-slate-900">{t.channel} · {t.type}</div>
                    <div className="text-xs text-slate-500">{new Date(t.createdAt).toLocaleString()}</div>
                  </div>
                  {t.subject ? <div className="text-sm text-slate-700 mt-2 font-medium">{t.subject}</div> : null}
                  <div className="text-sm text-slate-700 mt-2 whitespace-pre-wrap">{t.body}</div>
                  {t.outcome ? <div className="text-xs text-slate-500 mt-2">Outcome: {t.outcome}</div> : null}
                </div>
              ))}
              {touchpoints.length === 0 ? (
                <div className="p-8 text-sm text-slate-500">No touchpoints yet.</div>
              ) : null}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="text-sm font-semibold">Notes</div>
              <Badge>{notes.length}</Badge>
            </div>
            <div className="divide-y divide-slate-100">
              {notes.map((n) => (
                <div key={n.id} className="p-5">
                  <div className="text-xs text-slate-500">{new Date(n.createdAt).toLocaleString()}</div>
                  <div className="text-sm text-slate-700 mt-2 whitespace-pre-wrap">{n.body}</div>
                </div>
              ))}
              {notes.length === 0 ? (
                <div className="p-8 text-sm text-slate-500">No notes yet.</div>
              ) : null}
            </div>
          </div>

          <div className="text-xs text-slate-500">
            Note: Gap Builder writes tech-gap summaries as a NOTE touchpoint (channel=EMAIL, type=NOTE).
          </div>
        </div>
      </div>
    </section>
  )
}
