'use client'

import { useState } from 'react'

export function DownloadLiteForm({ productSlug }: { productSlug: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const fd = new FormData(e.currentTarget)
    const payload = Object.fromEntries(fd.entries())

    try {
      const res = await fetch('/api/library/free-download', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          librarySlug: `${productSlug}-lite`,
          email: payload.email,
          whatsapp: payload.whatsapp,
          name: payload.name || '',
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || 'Failed')
      setDownloadUrl(json.downloadUrl)
    } catch (err: any) {
      setError(err?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Email *</span>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-lg border border-border-subtle px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">WhatsApp number *</span>
            <input
              name="whatsapp"
              required
              placeholder="+234…"
              className="w-full rounded-lg border border-border-subtle px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </label>
        </div>

        <label className="space-y-2 block">
          <span className="text-sm font-semibold text-slate-700">Name (optional)</span>
          <input
            name="name"
            className="w-full rounded-lg border border-border-subtle px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </label>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          disabled={loading}
          className="w-full bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-all disabled:opacity-60"
        >
          {loading ? 'Processing…' : 'Unlock the Lite PDF'}
        </button>

        {downloadUrl ? (
          <div className="mt-4 bg-slate-50 border border-border-subtle rounded-xl p-4">
            <p className="text-sm text-slate-700 mb-2">Download ready:</p>
            <a className="text-primary font-bold underline" href={downloadUrl}>
              Download Lite PDF
            </a>
          </div>
        ) : null}

        <p className="text-xs text-slate-500">By downloading, you agree to receive follow-ups about the Operator Agent system.</p>
      </form>
    </div>
  )
}
