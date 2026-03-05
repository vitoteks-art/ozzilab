import Link from 'next/link'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full bg-slate-100 text-slate-600">{children}</span>
}

export default async function CRMLeadsPage() {
  const leads = await prisma.lead.findMany({
    orderBy: [{ nextFollowUpAt: 'asc' }, { createdAt: 'desc' }],
    take: 300,
  })

  return (
    <section className="p-6 lg:p-10">
      <div className="flex items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">CRM — Leads</h1>
          <p className="text-slate-500 text-sm mt-1">Unified contacts for outreach + downloads + audits. Follow-up is the primary control loop.</p>
        </div>
        <Link href="/admin/crm/followups" className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold">
          Follow-ups Queue
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
          <div className="text-sm font-semibold">{leads.length} leads</div>
          <Badge>v1</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="text-left font-bold uppercase tracking-wider text-[11px] px-4 py-3">Name</th>
                <th className="text-left font-bold uppercase tracking-wider text-[11px] px-4 py-3">Company</th>
                <th className="text-left font-bold uppercase tracking-wider text-[11px] px-4 py-3">Stage</th>
                <th className="text-left font-bold uppercase tracking-wider text-[11px] px-4 py-3">Next Follow-up</th>
                <th className="text-left font-bold uppercase tracking-wider text-[11px] px-4 py-3">Channels</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900">{l.name || l.email}</div>
                    <div className="text-xs text-slate-500">{l.email}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{l.company || '-'}</td>
                  <td className="px-4 py-3"><Badge>{l.stage}</Badge></td>
                  <td className="px-4 py-3 text-slate-700">
                    {l.nextFollowUpAt ? new Date(l.nextFollowUpAt).toLocaleString() : '-'}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {[
                      l.whatsapp ? 'WhatsApp' : null,
                      l.instagramUrl ? 'Instagram' : null,
                      l.linkedinUrl ? 'LinkedIn' : null,
                      l.email ? 'Email' : null,
                    ]
                      .filter(Boolean)
                      .join(' · ') || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 text-xs text-slate-500">
        Next: lead detail pages + touchpoints + follow-up actions.
      </div>
    </section>
  )
}
