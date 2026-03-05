import Link from 'next/link'
import { prisma } from '@/lib/db'
import { requireAdminOrRedirect } from '@/lib/requireAdminOrRedirect'

export const dynamic = 'force-dynamic'

export default async function AdminPurchasesPage() {
  await requireAdminOrRedirect()
  const purchases = await prisma.purchase.findMany({
    orderBy: { createdAt: 'desc' },
    take: 200,
    include: { libraryItem: true },
  })

  return (
    <main className="bg-background-surface">
      <section className="max-w-6xl mx-auto px-6 lg:px-12 py-12">
        <div className="flex items-start justify-between gap-6 mb-8">
          <div>
            <h1 className="font-serif text-4xl text-slate-900">Purchases</h1>
            <p className="text-slate-600">Webhook-verified payments + entitlements.</p>
          </div>
          <Link href="/admin/library" className="text-sm font-semibold text-primary">
            Library →
          </Link>
        </div>

        <div className="bg-white border border-border-subtle rounded-2xl overflow-hidden">
          <div className="grid grid-cols-12 gap-2 px-6 py-3 border-b border-border-subtle text-xs font-bold uppercase tracking-widest text-slate-500">
            <div className="col-span-3">When</div>
            <div className="col-span-3">Email</div>
            <div className="col-span-3">Item</div>
            <div className="col-span-1">Cur</div>
            <div className="col-span-2">Status</div>
          </div>
          {purchases.map((p) => (
            <div key={p.id} className="grid grid-cols-12 gap-2 px-6 py-4 border-b border-border-subtle">
              <div className="col-span-3 text-slate-600">{p.createdAt.toISOString().slice(0, 19).replace('T', ' ')}</div>
              <div className="col-span-3 text-slate-700">{p.email}</div>
              <div className="col-span-3 text-slate-700">{p.libraryItem.title}</div>
              <div className="col-span-1 text-slate-600">{p.currency}</div>
              <div className="col-span-2 font-semibold">{p.status}</div>
            </div>
          ))}
          {purchases.length === 0 ? <p className="p-6 text-slate-600">No purchases yet.</p> : null}
        </div>
      </section>
    </main>
  )
}
