'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AdminLibraryNewPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const fd = new FormData(e.currentTarget)

    const res = await fetch('/api/admin/library', { method: 'POST', body: fd })
    const json = await res.json()
    if (!res.ok) {
      setError(json?.error || 'Failed')
      return
    }
    router.push(`/admin/library/${json.item.id}`)
  }

  async function uploadFile(file: File) {
    setError(null)
    const fd = new FormData()
    fd.set('file', file)
    const res = await fetch('/api/admin/library/upload', { method: 'POST', body: fd })
    const json = await res.json()
    if (!res.ok) throw new Error(json?.error || 'Upload failed')
    return json.storedPath as string
  }

  return (
    <main className="bg-background-surface">
      <section className="max-w-3xl mx-auto px-6 lg:px-12 py-12">
        <h1 className="font-serif text-4xl text-slate-900 mb-8">New Library Item</h1>
        <form onSubmit={onSubmit} className="bg-white border border-border-subtle rounded-2xl p-8 space-y-4">
          <label className="block space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Slug</span>
            <input name="slug" required className="w-full rounded-lg border-border-subtle" />
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Title</span>
            <input name="title" required className="w-full rounded-lg border-border-subtle" />
          </label>
          <div className="grid md:grid-cols-2 gap-4">
            <label className="block space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Tier</span>
              <select name="tier" className="w-full rounded-lg border-border-subtle">
                <option value="FREE">FREE</option>
                <option value="PREMIUM">PREMIUM</option>
              </select>
            </label>

            <label className="block space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Category</span>
              <select name="category" className="w-full rounded-lg border-border-subtle" defaultValue="OTHER">
                <option value="OPERATIONS">OPERATIONS</option>
                <option value="MARKETING">MARKETING</option>
                <option value="AUTOMATION">AUTOMATION</option>
                <option value="OTHER">OTHER</option>
              </select>
            </label>
          </div>
          <label className="block space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Summary</span>
            <textarea name="summary" rows={3} className="w-full rounded-lg border-border-subtle" />
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Content (markdown/plain)</span>
            <textarea name="contentMarkdown" rows={6} className="w-full rounded-lg border-border-subtle" />
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Upload library file</span>
            <input
              type="file"
              name="downloadFile"
              className="w-full rounded-lg border-border-subtle"
              onChange={async (e) => {
                const f = e.target.files?.[0]
                if (!f) return
                try {
                  const storedPath = await uploadFile(f)
                  const form = e.currentTarget.form
                  const input = form?.querySelector('input[name="downloadFilePath"]') as HTMLInputElement | null
                  if (input) input.value = storedPath
                } catch (err: any) {
                  setError(err?.message || 'Upload failed')
                }
              }}
            />
            <p className="text-xs text-slate-500">After upload, the saved path will be filled automatically.</p>
          </label>

          <label className="block space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Download file path</span>
            <input name="downloadFilePath" placeholder="(auto-filled after upload)" className="w-full rounded-lg border-border-subtle" />
          </label>

          <div className="grid md:grid-cols-2 gap-4">
            <label className="block space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">priceNGN (kobo)</span>
              <input name="priceNGN" type="number" className="w-full rounded-lg border-border-subtle" />
            </label>
            <label className="block space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">priceUSD (cents)</span>
              <input name="priceUSD" type="number" className="w-full rounded-lg border-border-subtle" />
            </label>
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" name="isPublished" value="true" />
            Publish immediately
          </label>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button className="w-full px-6 py-3 rounded-lg bg-primary text-white font-bold">Create</button>
        </form>
      </section>
    </main>
  )
}
