import Link from 'next/link'
import { prisma } from '@/lib/db'
import { requireAdminOrRedirect } from '@/lib/requireAdminOrRedirect'

export const dynamic = 'force-dynamic'

export default async function AdminAuditsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  await requireAdminOrRedirect()
  const { status } = await searchParams

  const audits = await prisma.auditRequest.findMany({
    where: status ? { status: status as any } : undefined,
    orderBy: { createdAt: 'desc' },
    take: 200,
  })

  const statuses = ['NEW', 'REVIEWING', 'APPROVED', 'REJECTED']

  return (
    <main className="bg-background-surface">
      <section className="max-w-6xl mx-auto px-6 lg:px-12 py-12">
        <div className="flex items-start justify-between gap-6 mb-8">
          <div>
            <h1 className="font-serif text-4xl text-slate-900">Audits</h1>
            <p className="text-slate-600">Review and approve to send intake invites.</p>
          </div>
          <form action="/api/admin/logout" method="post">
            <button className="px-4 py-2 rounded-lg border border-border-subtle text-sm font-semibold">Logout</button>
          </form>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          <Link
            href="/admin/audits"
            className={`px-3 py-1.5 rounded-full border text-sm ${!status ? 'bg-primary text-white border-primary' : 'border-border-subtle bg-white'}`}
          >
            All
          </Link>
          {statuses.map((s) => (
            <Link
              key={s}
              href={`/admin/audits?status=${s}`}
              className={`px-3 py-1.5 rounded-full border text-sm ${status === s ? 'bg-primary text-white border-primary' : 'border-border-subtle bg-white'}`}
            >
              {s}
            </Link>
          ))}
        </div>

        <div className="bg-white border border-border-subtle rounded-2xl overflow-hidden">
          <div className="grid grid-cols-12 gap-2 px-6 py-3 border-b border-border-subtle text-xs font-bold uppercase tracking-widest text-slate-500">
            <div className="col-span-3">Audit ID</div>
            <div className="col-span-3">Business</div>
            <div className="col-span-3">Email</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-2">Created</div>
          </div>
          {audits.map((a) => (
            <Link
              key={a.auditId}
              href={`/admin/audits/${a.auditId}`}
              className="grid grid-cols-12 gap-2 px-6 py-4 border-b border-border-subtle hover:bg-background-surface"
            >
              <div className="col-span-3 font-semibold text-slate-900">{a.auditId}</div>
              <div className="col-span-3 text-slate-700">{a.businessName}</div>
              <div className="col-span-3 text-slate-600">{a.email}</div>
              <div className="col-span-1 text-slate-600">{a.status}</div>
              <div className="col-span-2 text-slate-500 text-sm">{a.createdAt.toISOString().slice(0, 10)}</div>
            </Link>
          ))}
          {audits.length === 0 ? <p className="p-6 text-slate-600">No audits yet.</p> : null}
        </div>

        <div className="mt-8">
          <Link href="/admin/intakes" className="text-sm font-semibold text-primary">
            View intakes →
          </Link>
        </div>
      </section>
    </main>
  )
}
