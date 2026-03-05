import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { LibraryItemClient } from './ui'

export const dynamic = 'force-dynamic'

export default async function LibraryItemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const item = await prisma.libraryItem.findUnique({ where: { slug } })
  if (!item || !item.isPublished) return notFound()

  return (
    <main className="flex-1 flex justify-center py-10 px-4">
      <div className="max-w-[1200px] w-full flex flex-col gap-8">
        <nav className="flex items-center gap-2 text-sm text-slate-500">
          <Link className="hover:text-primary transition-colors" href="/library">
            Systems Library
          </Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-slate-900 font-semibold">{item.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-8">
            <div className="relative group overflow-hidden rounded-xl bg-slate-900 aspect-video shadow-2xl">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-80" style={{
                backgroundImage:
                  'linear-gradient(180deg, rgba(16, 22, 34, 0) 0%, rgba(16, 22, 34, 0.8) 100%), linear-gradient(135deg, rgba(19,91,236,0.25), rgba(16,22,34,0.9))',
              }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="size-16 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-lg backdrop-blur-sm">
                  <span className="material-symbols-outlined text-4xl">play_arrow</span>
                </div>
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                <span className={`px-3 py-1 text-white text-xs font-bold rounded-full uppercase tracking-wider mb-2 inline-block ${item.tier === 'PREMIUM' ? 'bg-primary' : 'bg-emerald-500'}`}>
                  {item.tier === 'PREMIUM' ? 'Premium Tier' : 'Free Tier'}
                </span>
                <h1 className="text-white text-4xl font-black leading-tight tracking-tight">{item.title}</h1>
              </div>
            </div>

            <section className="flex flex-col gap-4">
              <h3 className="text-2xl font-bold text-slate-900">Detailed Description</h3>
              <div className="max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
                {item.summary || item.contentMarkdown || ''}
              </div>
            </section>

            {item.tier === 'PREMIUM' ? (
              <section className="flex flex-col gap-6 relative">
                <h3 className="text-2xl font-bold text-slate-900">System Preview</h3>
                <div className="rounded-xl border border-slate-200 bg-white overflow-hidden relative min-h-[360px]">
                  <div className="p-6 opacity-40 grayscale blur-sm select-none">
                    <div className="h-8 bg-slate-200 w-1/3 rounded mb-6" />
                    <div className="grid grid-cols-4 gap-4 mb-8">
                      <div className="h-24 bg-slate-100 rounded" />
                      <div className="h-24 bg-slate-100 rounded" />
                      <div className="h-24 bg-slate-100 rounded" />
                      <div className="h-24 bg-slate-100 rounded" />
                    </div>
                    <div className="space-y-4">
                      <div className="h-4 bg-slate-100 rounded w-full" />
                      <div className="h-4 bg-slate-100 rounded w-5/6" />
                      <div className="h-4 bg-slate-100 rounded w-4/6" />
                    </div>
                  </div>
                  <div className="absolute inset-0 backdrop-blur-md bg-[rgba(16,22,34,0.40)] flex flex-col items-center justify-center text-center p-8">
                    <div className="size-16 bg-primary rounded-full flex items-center justify-center mb-6 text-white shadow-xl">
                      <span className="material-symbols-outlined text-4xl">lock</span>
                    </div>
                    <h4 className="text-white text-2xl font-bold mb-3">Unlock Premium Content</h4>
                    <p className="text-slate-200 max-w-md mb-8 leading-relaxed">
                      Purchase the system to get full access to all templates, documents, and downloadable assets.
                    </p>
                    <a className="bg-white text-slate-900 px-8 py-3 rounded-lg font-bold hover:bg-slate-100 transition-colors shadow-lg" href="#buy">
                      Buy Now to Unlock
                    </a>
                  </div>
                </div>
              </section>
            ) : null}

            {item.tier === 'FREE' && item.contentMarkdown ? (
              <section className="bg-white border border-slate-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-3">Content</h3>
                <p className="text-slate-700 whitespace-pre-wrap">{item.contentMarkdown}</p>
              </section>
            ) : null}
          </div>

          <div className="flex flex-col gap-6">
            <div className="sticky top-24" id="buy">
              <div className="p-8 rounded-2xl bg-white border-2 border-primary/20 shadow-xl flex flex-col gap-6">
                <LibraryItemClient item={item as any} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
