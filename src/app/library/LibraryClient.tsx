'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'

type Item = {
  id: string
  slug: string
  title: string
  summary: string | null
  tier: 'FREE' | 'PREMIUM'
  category?: 'OPERATIONS' | 'MARKETING' | 'AUTOMATION' | 'OTHER' | null
  priceUSD: number | null
  createdAt?: string
}

type TierTab = 'FREE' | 'PREMIUM'

type CategoryTab = 'ALL' | 'OPERATIONS' | 'MARKETING' | 'AUTOMATION'

function moneyUSD(cents: number | null) {
  if (!cents) return null
  return `$${(cents / 100).toFixed(2)}`
}

function normalize(s: string) {
  return s.toLowerCase().trim()
}

function inferCategory(it: Item): CategoryTab {
  // Prefer explicit DB category if present.
  if (it.category && it.category !== 'OTHER') return it.category

  // Fallback: infer a best-effort category from title/summary keywords.
  const blob = normalize(`${it.title} ${it.summary || ''}`)
  if (/whatsapp|crm|pipeline|intake|ops|operations|fulfil|delivery|support/.test(blob)) return 'OPERATIONS'
  if (/ads|marketing|lead|seo|content|copy|funnel/.test(blob)) return 'MARKETING'
  if (/automation|zapier|make\.com|n8n|integration|webhook/.test(blob)) return 'AUTOMATION'
  return 'ALL'
}

export function LibraryClient({ items }: { items: Item[] }) {
  const [query, setQuery] = useState('')
  const [tierTab, setTierTab] = useState<TierTab>('FREE')
  const [category, setCategory] = useState<CategoryTab>('ALL')

  const filtered = useMemo(() => {
    const q = normalize(query)
    return items
      .filter((it) => (tierTab === 'FREE' ? it.tier === 'FREE' : it.tier === 'PREMIUM'))
      .filter((it) => {
        if (category === 'ALL') return true
        return inferCategory(it) === category
      })
      .filter((it) => {
        if (!q) return true
        return normalize(it.title).includes(q) || normalize(it.summary || '').includes(q)
      })
  }, [items, query, tierTab, category])

  const counts = useMemo(() => {
    const free = items.filter((x) => x.tier === 'FREE').length
    const premium = items.filter((x) => x.tier === 'PREMIUM').length
    return { free, premium }
  }, [items])

  return (
    <main className="flex-1 flex flex-col max-w-[1280px] mx-auto w-full px-6 lg:px-12 py-12">
      {/* Hero */}
      <div className="flex flex-wrap justify-between items-end gap-6 mb-10">
        <div className="flex flex-col gap-3">
          <h1 className="text-slate-900 text-4xl lg:text-5xl font-black leading-tight tracking-tight">Systems Library</h1>
          <p className="text-slate-500 text-lg max-w-2xl font-normal">
            Discover and deploy pre-built workflows designed for high-performance inbound operations and seamless client management.
          </p>
        </div>
        <Link
          href="/library/downloads"
          className="flex items-center gap-2 cursor-pointer rounded-lg h-11 px-6 bg-white text-slate-900 border border-slate-200 text-sm font-bold hover:bg-slate-50 transition-all shadow-sm"
        >
          <span className="material-symbols-outlined text-[20px]">download</span>
          <span>My Downloads</span>
        </Link>
      </div>

      {/* Search */}
      <div className="flex flex-col gap-6 mb-8">
        <label className="flex flex-col w-full">
          <div className="flex w-full items-stretch rounded-xl h-14 bg-white border border-slate-200 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
            <div className="text-slate-400 flex items-center justify-center pl-5">
              <span className="material-symbols-outlined text-[24px]">search</span>
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="form-input flex w-full min-w-0 flex-1 border-none bg-transparent focus:ring-0 h-full placeholder:text-slate-400 px-4 pl-3 text-base font-normal"
              placeholder="Search systems, templates, or automations..."
            />
            <div className="flex items-center pr-2">
              <button
                className="bg-primary text-white h-10 px-6 rounded-lg font-bold text-sm"
                type="button"
                onClick={() => {
                  const el = document.getElementById('systems-grid')
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
              >
                Search
              </button>
            </div>
          </div>
        </label>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2 p-1 bg-slate-200/50 rounded-xl">
            <button
              className={`px-5 py-2 rounded-lg text-sm transition-colors ${
                category === 'ALL' ? 'bg-white text-primary font-bold shadow-sm' : 'text-slate-600 hover:text-primary font-medium'
              }`}
              type="button"
              onClick={() => setCategory('ALL')}
            >
              All Systems
            </button>
            <button
              className={`px-5 py-2 rounded-lg text-sm transition-colors ${
                category === 'OPERATIONS' ? 'bg-white text-primary font-bold shadow-sm' : 'text-slate-600 hover:text-primary font-medium'
              }`}
              type="button"
              onClick={() => setCategory('OPERATIONS')}
            >
              Operations
            </button>
            <button
              className={`px-5 py-2 rounded-lg text-sm transition-colors ${
                category === 'MARKETING' ? 'bg-white text-primary font-bold shadow-sm' : 'text-slate-600 hover:text-primary font-medium'
              }`}
              type="button"
              onClick={() => setCategory('MARKETING')}
            >
              Marketing
            </button>
            <button
              className={`px-5 py-2 rounded-lg text-sm transition-colors ${
                category === 'AUTOMATION' ? 'bg-white text-primary font-bold shadow-sm' : 'text-slate-600 hover:text-primary font-medium'
              }`}
              type="button"
              onClick={() => setCategory('AUTOMATION')}
            >
              Automation
            </button>
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
            <span className="material-symbols-outlined text-[18px]">sort</span>
            <span>Sort by: Most Recent</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 mb-8">
        <div className="flex gap-10">
          <button
            type="button"
            onClick={() => setTierTab('FREE')}
            className={`pb-4 px-2 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
              tierTab === 'FREE' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Free Summaries
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${tierTab === 'FREE' ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500'}`}>
              {counts.free}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setTierTab('PREMIUM')}
            className={`pb-4 px-2 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
              tierTab === 'PREMIUM' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Premium Bundles
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full ${
                tierTab === 'PREMIUM' ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500'
              }`}
            >
              {counts.premium}
            </span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div id="systems-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((it) => (
          <Link
            key={it.slug}
            href={`/library/${it.slug}`}
            className="group flex flex-col bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
              {/* placeholder cover */}
              <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-4 left-4">
                <span
                  className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded shadow-sm ${
                    it.tier === 'PREMIUM' ? 'bg-primary text-white' : 'bg-emerald-500 text-white'
                  }`}
                >
                  {it.tier === 'PREMIUM' ? 'Premium' : 'Free'}
                </span>
              </div>
              {it.tier === 'PREMIUM' ? (
                <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg">
                  <span className="text-primary font-black text-lg">{moneyUSD(it.priceUSD) || '—'}</span>
                </div>
              ) : null}
            </div>

            <div className="p-6 flex flex-col grow">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-slate-900 font-bold text-lg leading-tight group-hover:text-primary transition-colors">{it.title}</h3>
                <span className="material-symbols-outlined text-slate-400 text-[20px]">bookmark</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed mb-6 grow">{it.summary || ''}</p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                  <span className="material-symbols-outlined text-[14px]">visibility</span>
                  <span>{it.tier === 'PREMIUM' ? 'Premium bundle' : 'Free summary'}</span>
                </div>
                <span className="text-primary font-bold text-sm flex items-center gap-1">
                  {it.tier === 'PREMIUM' ? 'Purchase' : 'View Details'}
                  <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                    {it.tier === 'PREMIUM' ? 'shopping_cart' : 'arrow_forward'}
                  </span>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-10 bg-white border border-slate-200 rounded-xl p-8 text-slate-600">
          No results for your current filters.
        </div>
      ) : null}

      <div className="mt-16 flex flex-col items-center gap-4">
        <button
          className="flex min-w-[200px] cursor-pointer items-center justify-center rounded-lg h-12 px-8 bg-slate-200 text-slate-900 text-sm font-bold transition-all hover:bg-slate-300"
          type="button"
          onClick={() => alert('Coming soon: pagination / load more.')}
        >
          Load More Systems
        </button>
        <p className="text-slate-400 text-xs">Showing {filtered.length} of {filtered.length} systems</p>
      </div>
    </main>
  )
}
