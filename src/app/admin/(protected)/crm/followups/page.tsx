import Link from 'next/link'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full bg-slate-100 text-slate-600">{children}</span>
}

export default async function CRMFollowupsPage() {
  const now = new Date()

  const due = await prisma.lead.findMany({
    where: {
      nextFollowUpAt: { lte: now },
      stage: { notIn: ['WON', 'LOST'] },
    },
    orderBy: [{ nextFollowUpAt: 'asc' }],
    take: 200,
  })

  return (
    <section className="p-6 lg:p-10">
      <div className="flex items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">CRM — Follow-ups</h1>
          <p className="text-slate-500 text-sm mt-1">Today/overdue follow-ups. This is the daily execution queue.</p>
        </div>
        <Link href="/admin/crm/leads" className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-sm font-semibold">
          Back to Leads
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
          <div className="text-sm font-semibold">{due.length} due</div>
          <Badge>queue</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="text-left font-bold uppercase tracking-wider text-[11px] px-4 py-3">Lead</th>
                <th className="text-left font-bold uppercase tracking-wider text-[11px] px-4 py-3">Stage</th>
                <th className="text-left font-bold uppercase tracking-wider text-[11px] px-4 py-3">Due</th>
                <th className="text-left font-bold uppercase tracking-wider text-[11px] px-4 py-3">Primary</th>
              </tr>
            </thead>
            <tbody>
              {due.map((l) => (
                <tr key={l.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900">{l.name || l.email}</div>
                    <div className="text-xs text-slate-500">{l.company || '-'} · {l.email}</div>
                  </td>
                  <td className="px-4 py-3"><Badge>{l.stage}</Badge></td>
                  <td className="px-4 py-3 text-slate-700">{l.nextFollowUpAt ? new Date(l.nextFollowUpAt).toLocaleString() : '-'}</td>
                  <td className="px-4 py-3 text-slate-500">{l.whatsapp ? 'WhatsApp' : l.instagramUrl ? 'Instagram' : l.linkedinUrl ? 'LinkedIn' : 'Email'}</td>
                </tr>
              ))}
              {due.length === 0 ? (
                <tr>
                  <td className="px-4 py-10 text-slate-500" colSpan={4}>
                    No follow-ups due.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 text-xs text-slate-500">
        Next: add one-click actions (log touchpoint, schedule next follow-up, change stage).
      </div>
    </section>
  )
}
