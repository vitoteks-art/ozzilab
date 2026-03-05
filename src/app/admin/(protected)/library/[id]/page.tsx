'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function AdminLibraryEditPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const id = params.id

  const [item, setItem] = useState<any>(null)
  const [status, setStatus] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const res = await fetch('/api/admin/library')
      const json = await res.json()
      const found = json.items?.find((x: any) => x.id === id)
      if (!cancelled) setItem(found)
    })()
    return () => {
      cancelled = true
    }
  }, [id])

  async function uploadFile(file: File) {
    setStatus(null)
    const fd = new FormData()
    fd.set('file', file)
    const res = await fetch('/api/admin/library/upload', { method: 'POST', body: fd })
    const json = await res.json()
    if (!res.ok) throw new Error(json?.error || 'Upload failed')
    return json.storedPath as string
  }

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus(null)
    const fd = new FormData(e.currentTarget)
    const payload: any = {
      title: fd.get('title'),
      summary: fd.get('summary'),
      contentMarkdown: fd.get('contentMarkdown'),
      category: fd.get('category') || 'OTHER',
      downloadFilePath: fd.get('downloadFilePath'),
      priceNGN: fd.get('priceNGN') ? Number(fd.get('priceNGN')) : null,
      priceUSD: fd.get('priceUSD') ? Number(fd.get('priceUSD')) : null,
      isPublished: fd.get('isPublished') === 'on',
    }

    const res = await fetch(`/api/admin/library/${id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const json = await res.json()
    if (!res.ok) return setStatus(json?.error || 'Save failed')
    setStatus('Saved.')
    setItem(json.item)
  }

  if (!item) {
    return (
      <main className="bg-background-surface">
        <section className="max-w-3xl mx-auto px-6 lg:px-12 py-12">Loading…</section>
      </main>
    )
  }

  return (
    <main className="bg-background-surface">
      <section className="max-w-3xl mx-auto px-6 lg:px-12 py-12">
        <div className="flex items-start justify-between gap-6 mb-8">
          <div>
            <h1 className="font-serif text-4xl text-slate-900">Edit Item</h1>
            <p className="text-slate-600">{item.slug}</p>
          </div>
          <button onClick={() => router.push('/admin/library')} className="px-4 py-2 rounded-lg border border-border-subtle text-sm font-semibold">
            Back
          </button>
        </div>

        <form onSubmit={save} className="bg-white border border-border-subtle rounded-2xl p-8 space-y-4">
          <label className="block space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Title</span>
            <input name="title" defaultValue={item.title} className="w-full rounded-lg border-border-subtle" />
          </label>
          <div className="grid md:grid-cols-2 gap-4">
            <label className="block space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Category</span>
              <select name="category" defaultValue={item.category || 'OTHER'} className="w-full rounded-lg border-border-subtle">
                <option value="OPERATIONS">OPERATIONS</option>
                <option value="MARKETING">MARKETING</option>
                <option value="AUTOMATION">AUTOMATION</option>
                <option value="OTHER">OTHER</option>
              </select>
            </label>
            <label className="block space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Summary</span>
              <textarea name="summary" defaultValue={item.summary || ''} rows={3} className="w-full rounded-lg border-border-subtle" />
            </label>
          </div>
          <label className="block space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Content</span>
            <textarea name="contentMarkdown" defaultValue={item.contentMarkdown || ''} rows={8} className="w-full rounded-lg border-border-subtle" />
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Upload new library file</span>
            <input
              type="file"
              className="w-full rounded-lg border-border-subtle"
              onChange={async (e) => {
                const f = e.target.files?.[0]
                if (!f) return
                try {
                  const storedPath = await uploadFile(f)
                  const form = e.currentTarget.form
                  const input = form?.querySelector('input[name="downloadFilePath"]') as HTMLInputElement | null
                  if (input) input.value = storedPath
                  setStatus('Uploaded. Remember to click Save.')
                } catch (err: any) {
                  setStatus(err?.message || 'Upload failed')
                }
              }}
            />
          </label>

          <label className="block space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Download file path</span>
            <input name="downloadFilePath" defaultValue={item.downloadFilePath || ''} className="w-full rounded-lg border-border-subtle" />
          </label>
          <div className="grid md:grid-cols-2 gap-4">
            <label className="block space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">priceNGN (kobo)</span>
              <input name="priceNGN" type="number" defaultValue={item.priceNGN ?? ''} className="w-full rounded-lg border-border-subtle" />
            </label>
            <label className="block space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">priceUSD (cents)</span>
              <input name="priceUSD" type="number" defaultValue={item.priceUSD ?? ''} className="w-full rounded-lg border-border-subtle" />
            </label>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" name="isPublished" defaultChecked={Boolean(item.isPublished)} />
            Published
          </label>
          {status ? <p className="text-sm text-slate-700">{status}</p> : null}
          <button className="w-full px-6 py-3 rounded-lg bg-primary text-white font-bold">Save</button>
        </form>
      </section>
    </main>
  )
}
