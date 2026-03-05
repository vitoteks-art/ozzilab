import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminAuth'
import { writeLibraryFile } from '@/lib/uploads'

export const runtime = 'nodejs'

const MAX_BYTES = Number(process.env.MAX_LIBRARY_UPLOAD_BYTES || 150 * 1024 * 1024) // 150MB

export async function POST(req: Request) {
  try {
    await requireAdmin()

    const fd = await req.formData()
    const file = fd.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'Missing file' }, { status: 400 })

    const bytes = new Uint8Array(await file.arrayBuffer())
    if (bytes.byteLength > MAX_BYTES) {
      return NextResponse.json({ error: `File too large (max ${(MAX_BYTES / 1024 / 1024).toFixed(0)}MB)` }, { status: 413 })
    }

    const { storedPath, safeName, checksum } = await writeLibraryFile({ originalName: file.name, bytes })

    return NextResponse.json({ ok: true, storedPath, safeName, checksum, sizeBytes: bytes.byteLength })
  } catch (e: any) {
    if (e?.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    console.error(e)
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 })
  }
}
