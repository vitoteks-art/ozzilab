'use client'

import { useMemo, useState } from 'react'

type Item = {
  id: string
  slug: string
  title: string
  tier: 'FREE' | 'PREMIUM'
  contentMarkdown: string | null
  priceNGN: number | null
  priceUSD: number | null
  downloadFilePath: string | null
}

function formatMoney(amountBase: number, currency: 'NGN' | 'USD') {
  if (currency === 'NGN') return `₦${(amountBase / 100).toLocaleString('en-NG')}`
  return `$${(amountBase / 100).toFixed(2)}`
}

export function LibraryItemClient({ item }: { item: Item }) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [currency, setCurrency] = useState<'NGN' | 'USD'>(() => {
    if (typeof window === 'undefined') return 'NGN'
    return (localStorage.getItem('ozzi_currency') as any) || 'NGN'
  })
  const [status, setStatus] = useState<string | null>(null)

  const price = useMemo(() => {
    if (item.tier !== 'PREMIUM') return null
    return currency === 'NGN' ? item.priceNGN : item.priceUSD
  }, [item, currency])

  function setCurrencyPersist(v: 'NGN' | 'USD') {
    setCurrency(v)
    localStorage.setItem('ozzi_currency', v)
  }

  async function freeDownload() {
    setStatus(null)
    const res = await fetch('/api/library/free-download', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, name, librarySlug: item.slug }),
    })
    const json = await res.json()
    if (!res.ok) {
      setStatus(json?.error || 'Failed')
      return
    }
    window.location.href = json.downloadUrl
  }

  async function premiumDownloadToken() {
    setStatus(null)
    const res = await fetch('/api/library/premium-token', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, librarySlug: item.slug }),
    })
    const json = await res.json()
    if (!res.ok) {
      setStatus(json?.error || 'Failed')
      return
    }
    window.location.href = json.downloadUrl
  }

  async function startPayment() {
    setStatus(null)
    if (!price) {
      setStatus('No price configured for this currency.')
      return
    }

    if (currency === 'NGN') {
      const res = await fetch('/api/payments/paystack/init', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ libraryItemId: item.id, email }),
      })
      const json = await res.json()
      if (!res.ok) return setStatus(json?.error || 'Payment init failed')
      window.location.href = json.authorization_url
      return
    }

    const res = await fetch('/api/payments/flutterwave/init', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ libraryItemId: item.id, email }),
    })
    const json = await res.json()
    if (!res.ok) return setStatus(json?.error || 'Payment init failed')
    window.location.href = json.link
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-slate-500 text-sm font-semibold uppercase tracking-widest mb-1">Access</p>
        <div className="flex items-center justify-between gap-4">
          <p className="text-slate-900 font-black text-xl">{item.tier === 'FREE' ? 'Free Download' : 'Premium Bundle'}</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrencyPersist('NGN')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border ${currency === 'NGN' ? 'bg-primary text-white border-primary' : 'bg-white border-slate-200 text-slate-600'}`}
            >
              NGN
            </button>
            <button
              type="button"
              onClick={() => setCurrencyPersist('USD')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border ${currency === 'USD' ? 'bg-primary text-white border-primary' : 'bg-white border-slate-200 text-slate-600'}`}
            >
              USD
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <label className="space-y-1 block">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Email</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border-slate-200 bg-slate-50 px-4 py-3 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none"
            placeholder="you@company.com"
          />
        </label>

        {item.tier === 'FREE' ? (
          <label className="space-y-1 block">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Name (optional)</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border-slate-200 bg-slate-50 px-4 py-3 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none"
              placeholder="Your name"
            />
          </label>
        ) : null}
      </div>

      {item.tier === 'FREE' ? (
        <button
          onClick={freeDownload}
          className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/30"
        >
          Download Free
        </button>
      ) : (
        <>
          <div>
            <p className="text-slate-500 text-sm font-semibold uppercase tracking-widest mb-1">Price</p>
            <p className="text-slate-900 font-black text-4xl">{price ? formatMoney(price, currency) : '—'}</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={startPayment}
              className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/30"
            >
              Buy Now
            </button>

            <button
              onClick={premiumDownloadToken}
              className="w-full bg-slate-100 text-slate-900 py-4 rounded-xl font-bold text-lg hover:bg-slate-200 transition-all"
            >
              I already paid — get download
            </button>

            <p className="text-xs text-center font-semibold text-slate-500 uppercase tracking-tighter pt-2">Secure Payment via</p>
            <div className="flex items-center justify-center gap-6 grayscale opacity-70 text-sm font-bold italic text-slate-700">
              <span>paystack</span>
              <span>flutterwave</span>
            </div>
          </div>
        </>
      )}

      {status ? <p className="text-sm text-slate-700">{status}</p> : null}
    </div>
  )
}
