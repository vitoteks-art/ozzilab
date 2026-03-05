import { NextResponse } from 'next/server'
import { createReadStream } from 'fs'
import { stat } from 'fs/promises'
import path from 'path'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/adminAuth'

export const runtime = 'nodejs'

export async function GET(_: Request, ctx: { params: Promise<{ fileId: string }> }) {
  try {
    await requireAdmin()
    const { fileId } = await ctx.params

    const file = await prisma.submissionFile.findUnique({ where: { id: fileId } })
    if (!file) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    // basic hardening: ensure storedPath is absolute and points within UPLOAD_ROOT
    const root = process.env.UPLOAD_ROOT || '/var/lib/ozzilab/uploads'
    const resolved = path.resolve(file.storedPath)
    const resolvedRoot = path.resolve(root)
    if (!resolved.startsWith(resolvedRoot)) return NextResponse.json({ error: 'Invalid path' }, { status: 400 })

    await stat(resolved)

    const stream = createReadStream(resolved)
    return new NextResponse(stream as any, {
      headers: {
        'content-type': file.mimeType || 'application/octet-stream',
        'content-disposition': `attachment; filename="${encodeURIComponent(path.basename(file.originalName))}"`,
      },
    })
  } catch (e: any) {
    if (e?.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
