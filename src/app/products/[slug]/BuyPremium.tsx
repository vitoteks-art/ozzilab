'use client'

import { useState } from 'react'

export function BuyPremium({ libraryItemId, librarySlug, priceText }: { libraryItemId: string; librarySlug: string; priceText: string }) {
  const [email, setEmail] = useState('')
  const [loadingPay, setLoadingPay] = useState(false)
  const [payError, setPayError] = useState<string | null>(null)

  const [loadingLink, setLoadingLink] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [dlError, setDlError] = useState<string | null>(null)

  async function startPayment() {
    setPayError(null)
    setLoadingPay(true)
    try {
      const res = await fetch('/api/payments/flutterwave/init', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ libraryItemId, email }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || 'Payment init failed')
      window.location.href = json.link
    } catch (e: any) {
      setPayError(e?.message || 'Payment init failed')
    } finally {
      setLoadingPay(false)
    }
  }

  async function getPremiumDownload() {
    setDlError(null)
    setLoadingLink(true)
    try {
      const res = await fetch('/api/library/premium-token', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, librarySlug }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || 'Could not fetch download link')
      setDownloadUrl(json.downloadUrl)
    } catch (e: any) {
      setDlError(e?.message || 'Could not fetch download link')
    } finally {
      setLoadingLink(false)
    }
  }

  const canPay = Boolean(email)

  return (
    <div className="space-y-4">
      <label className="space-y-2 block">
        <span className="text-sm font-semibold text-slate-700">Email (used for receipt + access) *</span>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
          className="w-full rounded-lg border border-border-subtle px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </label>

      {payError ? <p className="text-sm text-red-600">{payError}</p> : null}

      <button
        disabled={!canPay || loadingPay}
        onClick={startPayment}
        className="w-full bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loadingPay ? 'Redirecting…' : `Pay with Flutterwave (${priceText})`}
      </button>

      <div className="pt-4 border-t border-border-subtle">
        <p className="text-sm font-semibold text-slate-800 mb-2">Already paid?</p>
        <p className="text-xs text-slate-500 mb-3">Enter the same email used during payment to get your download link.</p>

        {dlError ? <p className="text-sm text-red-600">{dlError}</p> : null}

        <button
          disabled={!canPay || loadingLink}
          onClick={getPremiumDownload}
          className="w-full bg-slate-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-slate-800 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loadingLink ? 'Checking…' : 'Get Premium Download Link'}
        </button>

        {downloadUrl ? (
          <div className="mt-4 bg-slate-50 border border-border-subtle rounded-xl p-4">
            <p className="text-sm text-slate-700 mb-2">Download ready:</p>
            <a className="text-primary font-bold underline" href={downloadUrl}>
              Download Premium PDF
            </a>
          </div>
        ) : null}
      </div>
    </div>
  )
}
