'use client'

import { useEffect, useState } from 'react'

type Stats = {
  audits7d: number
  intakes7d: number
  activeProjects: number
  shipped30d: number
  eventsToday: number
  updatedAt: string
}

export function PublicStats() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/stats/overview', { cache: 'no-store' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = (await res.json()) as Stats
        if (!cancelled) setStats(json)
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load')
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  const cards = stats
    ? [
        { label: 'Audits (7d)', value: stats.audits7d },
        { label: 'Intakes (7d)', value: stats.intakes7d },
        { label: 'Active Projects', value: stats.activeProjects },
        { label: 'Systems Shipped (30d)', value: stats.shipped30d },
      ]
    : [
        { label: 'Audits (7d)', value: '—' },
        { label: 'Intakes (7d)', value: '—' },
        { label: 'Active Projects', value: '—' },
        { label: 'Systems Shipped (30d)', value: '—' },
      ]

  return (
    <div className="mt-10 grid grid-cols-2 gap-4 max-w-xl">
      {cards.map((c) => (
        <div key={c.label} className="p-5 rounded-xl bg-white border border-border-subtle">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-400">{c.label}</div>
          <div className="mt-2 text-3xl font-bold text-slate-900">{c.value}</div>
        </div>
      ))}

      <div className="col-span-2 p-5 rounded-xl bg-slate-50 border border-border-subtle">
        <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Events Logged (Today)</div>
        <div className="mt-2 flex items-end justify-between gap-4">
          <div className="text-3xl font-bold text-slate-900">{stats ? stats.eventsToday : '—'}</div>
          <div className="text-xs text-slate-400">
            {error ? `Error: ${error}` : stats ? `Updated: ${new Date(stats.updatedAt).toLocaleString()}` : 'Loading...'}
          </div>
        </div>
      </div>
    </div>
  )
}
