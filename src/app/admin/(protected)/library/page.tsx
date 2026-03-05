import Link from 'next/link'
import { prisma } from '@/lib/db'
import { requireAdminOrRedirect } from '@/lib/requireAdminOrRedirect'

export const dynamic = 'force-dynamic'

export default async function AdminLibraryPage() {
  await requireAdminOrRedirect()
  const items = await prisma.libraryItem.findMany({ orderBy: { createdAt: 'desc' }, take: 500 })

  return (
    <main className="bg-background-surface">
      <section className="max-w-6xl mx-auto px-6 lg:px-12 py-12">
        <div className="flex items-start justify-between gap-6 mb-8">
          <div>
            <h1 className="font-serif text-4xl text-slate-900">Library Items</h1>
            <p className="text-slate-600">Create and publish free/premium downloads.</p>
          </div>
          <Link href="/admin/library/new" className="px-4 py-2 rounded-lg bg-primary text-white font-semibold">
            New item
          </Link>
        </div>

        <div className="bg-white border border-border-subtle rounded-2xl overflow-hidden">
          <div className="grid grid-cols-12 gap-2 px-6 py-3 border-b border-border-subtle text-xs font-bold uppercase tracking-widest text-slate-500">
            <div className="col-span-3">Title</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-3">Slug</div>
            <div className="col-span-2">Tier</div>
            <div className="col-span-1">Pub</div>
            <div className="col-span-1">Edit</div>
          </div>
          {items.map((it) => (
            <div key={it.id} className="grid grid-cols-12 gap-2 px-6 py-4 border-b border-border-subtle">
              <div className="col-span-3 font-semibold text-slate-900">{it.title}</div>
              <div className="col-span-2 text-slate-600">{it.category}</div>
              <div className="col-span-3 text-slate-600">{it.slug}</div>
              <div className="col-span-2 text-slate-600">{it.tier}</div>
              <div className="col-span-1 text-slate-600">{it.isPublished ? 'Yes' : 'No'}</div>
              <div className="col-span-1">
                <Link className="text-primary font-semibold" href={`/admin/library/${it.id}`}>
                  Edit
                </Link>
              </div>
            </div>
          ))}
          {items.length === 0 ? <p className="p-6 text-slate-600">No items yet.</p> : null}
        </div>

        <div className="mt-8 flex gap-6">
          <Link href="/admin/audits" className="text-sm font-semibold text-primary">
            Audits →
          </Link>
          <Link href="/admin/intakes" className="text-sm font-semibold text-primary">
            Intakes →
          </Link>
        </div>
      </section>
    </main>
  )
}
