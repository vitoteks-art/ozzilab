import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/adminAuth'

const createSchema = z.object({
  slug: z.string().min(2),
  title: z.string().min(2),
  tier: z.enum(['FREE', 'PREMIUM']),
  category: z.enum(['OPERATIONS', 'MARKETING', 'AUTOMATION', 'OTHER']).optional(),
  summary: z.string().optional().or(z.literal('')),
  contentMarkdown: z.string().optional().or(z.literal('')),
  priceNGN: z.coerce.number().int().optional(),
  priceUSD: z.coerce.number().int().optional(),
  downloadFilePath: z.string().optional().or(z.literal('')),
  isPublished: z.coerce.boolean().optional(),
})

export async function GET() {
  try {
    await requireAdmin()
    const items = await prisma.libraryItem.findMany({ orderBy: { createdAt: 'desc' }, take: 500 })
    return NextResponse.json({ items })
  } catch (e: any) {
    if (e?.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin()
    const ct = req.headers.get('content-type') || ''
    const raw = ct.includes('application/json') ? await req.json() : Object.fromEntries((await req.formData()).entries())
    const data = createSchema.parse(raw)

    if (data.tier === 'PREMIUM' && (!data.priceNGN || !data.priceUSD)) {
      return NextResponse.json({ error: 'Premium items require priceNGN and priceUSD (base units)' }, { status: 400 })
    }

    const item = await prisma.libraryItem.create({
      data: {
        slug: data.slug,
        title: data.title,
        tier: data.tier,
        category: (data.category as any) || 'OTHER',
        summary: data.summary || null,
        contentMarkdown: data.contentMarkdown || null,
        priceNGN: data.priceNGN ?? null,
        priceUSD: data.priceUSD ?? null,
        downloadFilePath: data.downloadFilePath || null,
        isPublished: Boolean(data.isPublished),
      },
    })

    return NextResponse.json({ item })
  } catch (e: any) {
    if (e?.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    console.error(e)
    if (e?.name === 'ZodError') return NextResponse.json({ error: 'Invalid input', issues: e.issues }, { status: 400 })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
