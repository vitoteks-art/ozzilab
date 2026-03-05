'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

type ValidateResp = { ok: boolean; auditId?: string; businessName?: string; email?: string; used?: boolean }

export function IntakeClient() {
  const sp = useSearchParams()
  const router = useRouter()
  const t = sp.get('t') || ''

  const [validate, setValidate] = useState<ValidateResp | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [submissionId, setSubmissionId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadMsg, setUploadMsg] = useState<string | null>(null)

  const canAccess = useMemo(() => Boolean(validate?.ok), [validate])

  useEffect(() => {
    let cancelled = false
    async function run() {
      if (!t) {
        setLoading(false)
        setValidate({ ok: false })
        return
      }
      const res = await fetch(`/api/intake/validate?t=${encodeURIComponent(t)}`)
      const json = (await res.json()) as ValidateResp
      if (!cancelled) {
        setValidate(json)
        setLoading(false)
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [t])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const fd = new FormData(e.currentTarget)
    const payload = Object.fromEntries(fd.entries())

    try {
      const res = await fetch(`/api/intake/submit?t=${encodeURIComponent(t)}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || 'Failed')
      setSubmissionId(json.submissionId)
      router.push(`/intake/thanks?submissionId=${encodeURIComponent(json.submissionId)}`)
    } catch (err: any) {
      setError(err?.message || 'Something went wrong')
    }
  }

  async function uploadFiles(files: FileList | null) {
    if (!files || !files.length) return
    if (!submissionId) {
      setUploadMsg('Submit the form first to get a Submission ID, then upload files.')
      return
    }

    setUploading(true)
    setUploadMsg(null)
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData()
        fd.set('submissionId', submissionId)
        fd.set('file', file)
        const res = await fetch(`/api/uploads?t=${encodeURIComponent(t)}`, { method: 'POST', body: fd })
        const json = await res.json()
        if (!res.ok) throw new Error(json?.error || 'Upload failed')
      }
      setUploadMsg('Uploads complete.')
    } catch (e: any) {
      setUploadMsg(e?.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <main className="bg-background-surface">
      <section className="max-w-4xl mx-auto px-6 lg:px-12 py-16">
        <div className="mb-10">
          <h1 className="font-serif text-4xl lg:text-5xl text-slate-900 mb-4">Client Intake (Invite-only)</h1>
          <p className="text-slate-600 text-lg">Complete this only if you received an approved invite link.</p>
        </div>

        {loading ? (
          <p className="text-slate-600">Validating invite…</p>
        ) : !canAccess ? (
          <div className="bg-white border border-border-subtle rounded-2xl p-8">
            <p className="text-red-600 font-semibold">This intake link is invalid, expired, or already used.</p>
          </div>
        ) : (
          <>
            <div className="bg-white border border-border-subtle rounded-2xl p-6 mb-8">
              <p className="text-sm text-slate-500">Approved audit</p>
              <p className="text-lg font-semibold text-slate-900">{validate?.businessName}</p>
              <p className="text-sm text-slate-500">{validate?.auditId}</p>
            </div>

            <form onSubmit={onSubmit} className="bg-white border border-border-subtle rounded-2xl p-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-700">Business name *</span>
                  <input name="businessName" required defaultValue={validate?.businessName || ''} className="w-full rounded-lg border-border-subtle" />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-700">Contact email *</span>
                  <input name="contactEmail" type="email" required defaultValue={validate?.email || ''} className="w-full rounded-lg border-border-subtle" />
                </label>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-700">Website</span>
                  <input name="websiteUrl" placeholder="https://" className="w-full rounded-lg border-border-subtle" />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-700">Industry</span>
                  <input name="industry" className="w-full rounded-lg border-border-subtle" />
                </label>
              </div>

              <label className="space-y-2 block">
                <span className="text-sm font-semibold text-slate-700">KPI target</span>
                <input name="kpiTarget" className="w-full rounded-lg border-border-subtle" />
              </label>

              <label className="space-y-2 block">
                <span className="text-sm font-semibold text-slate-700">What does success look like?</span>
                <textarea name="successDefinition" rows={3} className="w-full rounded-lg border-border-subtle" />
              </label>

              <label className="space-y-2 block">
                <span className="text-sm font-semibold text-slate-700">Current funnel summary</span>
                <textarea name="funnelSummary" rows={3} className="w-full rounded-lg border-border-subtle" />
              </label>

              <label className="space-y-2 block">
                <span className="text-sm font-semibold text-slate-700">Tools / Stack</span>
                <textarea name="toolsStack" rows={3} className="w-full rounded-lg border-border-subtle" />
              </label>

              <label className="space-y-2 block">
                <span className="text-sm font-semibold text-slate-700">Deliverable request</span>
                <textarea name="requestedBuild" rows={4} className="w-full rounded-lg border-border-subtle" />
              </label>

              <div className="grid md:grid-cols-2 gap-6">
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-700">Timeline</span>
                  <input name="timeline" className="w-full rounded-lg border-border-subtle" />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-700">Budget range</span>
                  <input name="budgetRange" className="w-full rounded-lg border-border-subtle" />
                </label>
              </div>

              <label className="space-y-2 block">
                <span className="text-sm font-semibold text-slate-700">Supporting links (Loom, docs, assets URLs)</span>
                <textarea name="supportingLinks" rows={3} className="w-full rounded-lg border-border-subtle" />
              </label>

              {error ? <p className="text-sm text-red-600">{error}</p> : null}

              <button className="w-full bg-primary text-white px-8 py-4 rounded-lg font-bold text-base hover:bg-blue-700 transition-all">
                Submit Intake
              </button>

              <div className="pt-4 border-t border-border-subtle">
                <p className="text-sm font-semibold text-slate-800 mb-2">Uploads</p>
                <p className="text-xs text-slate-500 mb-4">After submission, upload supporting files (PDF, images, zip, docs).</p>
                <input type="file" multiple onChange={(e) => uploadFiles(e.target.files)} disabled={uploading} className="block w-full text-sm" />
                {uploadMsg ? <p className="text-xs text-slate-600 mt-3">{uploadMsg}</p> : null}
              </div>
            </form>
          </>
        )}
      </section>
    </main>
  )
}
