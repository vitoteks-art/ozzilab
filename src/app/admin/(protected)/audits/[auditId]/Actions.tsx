'use client'

import { useState } from 'react'

export function AuditActions({ auditId, defaultEmail }: { auditId: string; defaultEmail: string }) {
  const [statusMsg, setStatusMsg] = useState<string | null>(null)
  const [inviteMsg, setInviteMsg] = useState<string | null>(null)

  async function setStatus(status: 'APPROVED' | 'REJECTED' | 'REVIEWING') {
    setStatusMsg(null)
    const res = await fetch(`/api/admin/audits/${encodeURIComponent(auditId)}/status`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    const json = await res.json()
    if (!res.ok) return setStatusMsg(json?.error || 'Failed')
    setStatusMsg(`Updated: ${json.audit.status}`)
  }

  async function sendInvite(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setInviteMsg(null)
    const fd = new FormData(e.currentTarget)
    const payload = Object.fromEntries(fd.entries())

    const res = await fetch(`/api/admin/audits/${encodeURIComponent(auditId)}/invite`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const json = await res.json()
    if (!res.ok) return setInviteMsg(json?.error || 'Failed')
    setInviteMsg(`Invite sent. Link: ${json.link}`)
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <button onClick={() => setStatus('APPROVED')} className="w-full px-4 py-3 rounded-lg bg-primary text-white font-bold">
          Approve
        </button>
        <button onClick={() => setStatus('REJECTED')} className="w-full px-4 py-3 rounded-lg border border-border-subtle font-bold">
          Reject
        </button>
      </div>
      {statusMsg ? <p className="text-sm text-slate-700">{statusMsg}</p> : null}

      <div className="pt-6 border-t border-border-subtle">
        <h3 className="font-semibold text-slate-900 mb-2">Send intake invite</h3>
        <p className="text-sm text-slate-600 mb-4">Sends via Mailtrap email + optional WhatsApp.</p>
        <form onSubmit={sendInvite} className="grid md:grid-cols-2 gap-4">
          <label className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Email</span>
            <input name="email" defaultValue={defaultEmail} className="w-full rounded-lg border-border-subtle" />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">WhatsApp (E.164)</span>
            <input name="whatsapp" placeholder="+234..." className="w-full rounded-lg border-border-subtle" />
          </label>
          <button className="md:col-span-2 px-4 py-3 rounded-lg bg-slate-900 text-white font-bold">Send invite</button>
        </form>
        {inviteMsg ? <p className="text-xs text-slate-600 mt-3 whitespace-pre-wrap">{inviteMsg}</p> : null}
      </div>
    </div>
  )
}
