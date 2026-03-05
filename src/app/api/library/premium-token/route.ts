import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { signDownloadToken } from '@/lib/downloadToken'

const schema = z.object({ email: z.string().email(), librarySlug: z.string().min(1) })

export async function POST(req: Request) {
  try {
    const { email, librarySlug } = schema.parse(await req.json())

    const item = await prisma.libraryItem.findUnique({ where: { slug: librarySlug } })
    if (!item || !item.isPublished) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (item.tier !== 'PREMIUM') return NextResponse.json({ error: 'Not premium' }, { status: 400 })
    if (!item.downloadFilePath) return NextResponse.json({ error: 'No download configured' }, { status: 400 })

    const ent = await prisma.entitlement.findFirst({
      where: {
        email,
        libraryItemId: item.id,
        endsAt: null,
      },
    })
    if (!ent) return NextResponse.json({ error: 'No entitlement' }, { status: 403 })

    const token = signDownloadToken({ exp: Math.floor(Date.now() / 1000) + 60 * 15, email, libraryItemId: item.id })

    return NextResponse.json({
      ok: true,
      downloadUrl: `/api/library/download?slug=${encodeURIComponent(item.slug)}&token=${encodeURIComponent(token)}`,
    })
  } catch (e: any) {
    console.error(e)
    if (e?.name === 'ZodError') return NextResponse.json({ error: 'Invalid input', issues: e.issues }, { status: 400 })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
