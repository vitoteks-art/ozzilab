'use client'

import { useState } from 'react'

type Props = { bookingId: string; initialStatus: string; initialNotes?: string | null }

export function BookingActions({ bookingId, initialStatus, initialNotes }: Props) {
  const [status, setStatus] = useState(initialStatus)
  const [internalNotes, setInternalNotes] = useState(initialNotes || '')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function save() {
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ status, internalNotes }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || 'Update failed')
      setMessage('Saved')
    } catch (e: any) {
      setMessage(e?.message || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-950">Admin actions</h2>
      <div className="mt-5 grid gap-4">
        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          Status
          <select className="rounded-lg border border-slate-200 px-4 py-3" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="NEW">NEW</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="RESCHEDULE_REQUESTED">RESCHEDULE REQUESTED</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          Internal notes
          <textarea className="min-h-36 rounded-lg border border-slate-200 px-4 py-3" value={internalNotes} onChange={(e) => setInternalNotes(e.target.value)} />
        </label>
        <button type="button" disabled={saving} onClick={save} className="rounded-lg bg-primary px-5 py-3 text-sm font-bold text-white disabled:opacity-60">{saving ? 'Saving…' : 'Save updates'}</button>
        {message ? <p className="text-sm font-semibold text-slate-600">{message}</p> : null}
      </div>
    </div>
  )
}
