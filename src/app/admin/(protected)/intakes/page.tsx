import Link from 'next/link'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { bg: string; dot: string; text: string }> = {
    NEW: { bg: 'bg-primary/10 text-primary', dot: 'bg-primary', text: 'NEW' },
    REVIEWING: { bg: 'bg-amber-500/10 text-amber-600', dot: 'bg-amber-500', text: 'REVIEWING' },
    ACCEPTED: { bg: 'bg-emerald-500/10 text-emerald-600', dot: 'bg-emerald-500', text: 'ACCEPTED' },
    IN_PROGRESS: { bg: 'bg-purple-500/10 text-purple-600', dot: 'bg-purple-500', text: 'IN_PROGRESS' },
    DELIVERED: { bg: 'bg-emerald-500/10 text-emerald-600', dot: 'bg-emerald-500', text: 'DELIVERED' },
    REJECTED: { bg: 'bg-rose-500/10 text-rose-600', dot: 'bg-rose-500', text: 'REJECTED' },
  }

  const v = map[status] || { bg: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400', text: status }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${v.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${v.dot}`} />
      {v.text}
    </span>
  )
}

export default async function AdminIntakesPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams

  const intakes = await prisma.intakeSubmission.findMany({
    where: status ? { status: status as any } : undefined,
    include: { auditRequest: true },
    orderBy: { createdAt: 'desc' },
    take: 200,
  })

  const now = new Date()
  const startOfDay = new Date(now)
  startOfDay.setHours(0, 0, 0, 0)

  const [newToday, pendingReviews, acceptedWeek, total] = await Promise.all([
    prisma.intakeSubmission.count({ where: { createdAt: { gte: startOfDay } } }),
    prisma.intakeSubmission.count({ where: { status: { in: ['NEW', 'REVIEWING'] as any } } }),
    prisma.intakeSubmission.count({ where: { status: { in: ['ACCEPTED', 'IN_PROGRESS', 'DELIVERED'] as any } } }),
    prisma.intakeSubmission.count(),
  ])

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Dashboard</h1>
            <p className="text-slate-500 mt-1">Review and manage inbound work submissions across all channels.</p>
          </div>
          <div className="flex gap-3">
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 text-sm font-semibold hover:bg-slate-50 transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-lg">download</span>
              Export
            </button>
            <Link
              href="/admin/library/new"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              Create Entry
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-500 text-sm font-medium">New Submissions Today</p>
              <div className="p-2 bg-primary/10 text-primary rounded-lg">
                <span className="material-symbols-outlined text-lg">send</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-slate-900">{newToday}</p>
              <p className="text-slate-400 text-xs font-medium">Today</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-500 text-sm font-medium">Pending Reviews</p>
              <div className="p-2 bg-amber-500/10 text-amber-600 rounded-lg">
                <span className="material-symbols-outlined text-lg">pending_actions</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-slate-900">{pendingReviews}</p>
              <p className="text-slate-400 text-xs font-medium">Open</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-500 text-sm font-medium">Accepted / In progress</p>
              <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-lg">
                <span className="material-symbols-outlined text-lg">check_circle</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-slate-900">{acceptedWeek}</p>
              <p className="text-slate-400 text-xs font-medium">Active</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-500 text-sm font-medium">Total Submissions</p>
              <div className="p-2 bg-purple-500/10 text-purple-600 rounded-lg">
                <span className="material-symbols-outlined text-lg">trending_up</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-slate-900">{total}</p>
              <p className="text-slate-400 text-xs font-medium">All-time</p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Submission ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Business Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {intakes.map((s) => (
                  <tr key={s.submissionId} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-primary font-bold">{s.submissionId}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xs">
                          {(s.businessName || '—').slice(0, 1).toUpperCase()}
                        </div>
                        <span className="text-sm font-semibold text-slate-900">{s.businessName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{s.createdAt.toISOString().slice(0, 10)}</td>
                    <td className="px-6 py-4">
                      <StatusPill status={s.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/intakes/${s.submissionId}`}
                        className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
                      >
                        View
                        <span className="material-symbols-outlined text-base">chevron_right</span>
                      </Link>
                    </td>
                  </tr>
                ))}
                {intakes.length === 0 ? (
                  <tr>
                    <td className="px-6 py-10 text-slate-500" colSpan={5}>
                      No submissions yet.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
