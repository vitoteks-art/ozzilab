import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { signDownloadToken } from '@/lib/downloadToken'
import { rateLimit } from '@/lib/rateLimit'
import { getClientIp } from '@/lib/ip'

const schema = z.object({
  email: z.string().email(),
  whatsapp: z.string().min(6).optional().or(z.literal('')),
  name: z.string().optional().or(z.literal('')),
  librarySlug: z.string().min(1),
})

export async function POST(req: Request) {
  try {
    const ip = await getClientIp()
    const rl = rateLimit({ key: `free:${ip}`, limit: 20, windowMs: 60_000 })
    if (!rl.ok) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

    const { email, whatsapp, name, librarySlug } = schema.parse(await req.json())

    const item = await prisma.libraryItem.findUnique({ where: { slug: librarySlug } })
    if (!item || !item.isPublished) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (item.tier !== 'FREE') return NextResponse.json({ error: 'Not a free item' }, { status: 400 })
    if (!item.downloadFilePath) return NextResponse.json({ error: 'No download configured' }, { status: 400 })

    const lead = await prisma.lead.create({
      data: { email, whatsapp: whatsapp || null, name: name || null, source: 'LIBRARY_FREE_DOWNLOAD' },
    }).catch(async () => {
      // if duplicate emails become a thing later, convert to upsert; for MVP just create new
      return prisma.lead.create({ data: { email, whatsapp: whatsapp || null, name: name || null, source: 'LIBRARY_FREE_DOWNLOAD' } })
    })

    await prisma.libraryFreeDownload.create({ data: { libraryItemId: item.id, leadId: lead.id } })

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
