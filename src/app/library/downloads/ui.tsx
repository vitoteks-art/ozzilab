'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'

type Row = {
  source: 'ENTITLEMENT' | 'FREE_DOWNLOAD'
  createdAt: string
  item: {
    id: string
    slug: string
    title: string
    summary: string | null
    tier: 'FREE' | 'PREMIUM'
    category: string
  }
}

export function DownloadsClient() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rows, setRows] = useState<Row[] | null>(null)

  const count = useMemo(() => rows?.length || 0, [rows])

  async function load() {
    setLoading(true)
    setError(null)
    setRows(null)
    try {
      const res = await fetch(`/api/library/my-downloads?email=${encodeURIComponent(email)}`)
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || 'Failed')
      setRows(json.items || [])
    } catch (e: any) {
      setError(e?.message || 'Failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="max-w-4xl mx-auto w-full px-6 lg:px-12 py-12">
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link className="hover:text-primary transition-colors" href="/library">
          Systems Library
        </Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="text-slate-900 font-semibold">My Downloads</span>
      </nav>

      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <h1 className="text-2xl font-black text-slate-900 mb-2">My Downloads</h1>
        <p className="text-slate-500 mb-6">Enter the email you used to download or purchase a system.</p>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none"
          />
          <button
            type="button"
            onClick={load}
            disabled={loading || !email}
            className="rounded-xl bg-primary text-white px-6 py-3 font-bold disabled:opacity-60"
          >
            {loading ? 'Loading…' : 'View downloads'}
          </button>
        </div>

        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

        {rows ? (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-slate-500">Found {count} item(s)</p>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
              {rows.map((r) => (
                <div key={r.item.id} className="p-5 flex items-start justify-between gap-6 bg-white">
                  <div>
                    <p className="text-slate-900 font-bold">{r.item.title}</p>
                    <p className="text-slate-500 text-sm">{r.item.summary || ''}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                        {r.item.tier}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                        {r.item.category}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full bg-primary/10 text-primary">
                        {r.source === 'ENTITLEMENT' ? 'Purchased' : 'Free download'}
                      </span>
                    </div>
                  </div>
                  <Link href={`/library/${r.item.slug}`} className="text-primary font-bold text-sm whitespace-nowrap">
                    Open →
                  </Link>
                </div>
              ))}

              {rows.length === 0 ? <div className="p-6 text-slate-500">No downloads found for this email.</div> : null}
            </div>
          </div>
        ) : null}
      </div>
    </main>
  )
}
