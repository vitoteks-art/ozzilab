import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/adminAuth'

const patchSchema = z.object({
  title: z.string().min(2).optional(),
  summary: z.string().optional().or(z.literal('')),
  contentMarkdown: z.string().optional().or(z.literal('')),
  category: z.enum(['OPERATIONS', 'MARKETING', 'AUTOMATION', 'OTHER']).optional(),
  priceNGN: z.coerce.number().int().optional().nullable(),
  priceUSD: z.coerce.number().int().optional().nullable(),
  downloadFilePath: z.string().optional().or(z.literal('')),
  isPublished: z.coerce.boolean().optional(),
})

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await ctx.params
    const raw = await req.json()
    const data = patchSchema.parse(raw)

    const item = await prisma.libraryItem.update({
      where: { id },
      data: {
        title: data.title,
        summary: data.summary === undefined ? undefined : data.summary || null,
        contentMarkdown: data.contentMarkdown === undefined ? undefined : data.contentMarkdown || null,
        category: data.category,
        priceNGN: data.priceNGN === undefined ? undefined : data.priceNGN,
        priceUSD: data.priceUSD === undefined ? undefined : data.priceUSD,
        downloadFilePath: data.downloadFilePath === undefined ? undefined : data.downloadFilePath || null,
        isPublished: data.isPublished,
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
