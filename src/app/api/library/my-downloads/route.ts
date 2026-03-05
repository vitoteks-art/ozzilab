import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

const schema = z.object({
  email: z.string().email(),
})

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email') || ''
    const { email: parsedEmail } = schema.parse({ email })

    // Premium entitlements
    const entitlements = await prisma.entitlement.findMany({
      where: { email: parsedEmail, type: 'LIBRARY_ITEM' },
      include: { libraryItem: true },
      orderBy: { createdAt: 'desc' },
      take: 200,
    })

    // Free downloads
    const freeDownloads = await prisma.libraryFreeDownload.findMany({
      where: { lead: { email: parsedEmail } },
      include: { libraryItem: true },
      orderBy: { createdAt: 'desc' },
      take: 200,
    })

    const items = new Map<string, any>()

    for (const e of entitlements) {
      if (e.libraryItem?.isPublished) items.set(e.libraryItem.id, { source: 'ENTITLEMENT', item: e.libraryItem, createdAt: e.createdAt })
    }
    for (const d of freeDownloads) {
      if (d.libraryItem?.isPublished) items.set(d.libraryItem.id, { source: 'FREE_DOWNLOAD', item: d.libraryItem, createdAt: d.createdAt })
    }

    const list = Array.from(items.values()).sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))

    return NextResponse.json({ ok: true, email: parsedEmail, items: list })
  } catch (e: any) {
    if (e?.name === 'ZodError') return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
