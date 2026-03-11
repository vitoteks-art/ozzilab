import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { requireServiceToken } from '@/lib/serviceAuth'

export const dynamic = 'force-dynamic'

const querySchema = z.object({
  stage: z.enum(['NEW', 'CONTACTED', 'REPLIED', 'QUALIFIED', 'BOOKED', 'WON', 'LOST']).optional(),
  source: z.enum(['AUDIT', 'INTAKE', 'LIBRARY_FREE_DOWNLOAD', 'OUTREACH']).optional(),
  dueBefore: z.string().datetime().optional(),
  limit: z.coerce.number().int().min(1).max(500).default(50),
})

export async function GET(req: Request) {
  try {
    await requireServiceToken(req, 'crm:write')

    const url = new URL(req.url)
    const q = querySchema.parse({
      stage: url.searchParams.get('stage') || undefined,
      source: url.searchParams.get('source') || undefined,
      dueBefore: url.searchParams.get('dueBefore') || undefined,
      limit: url.searchParams.get('limit') || undefined,
    })

    const where: any = {}
    if (q.stage) where.stage = q.stage
    if (q.source) where.source = q.source
    if (q.dueBefore) where.nextFollowUpAt = { lte: new Date(q.dueBefore) }

    const leads = await prisma.lead.findMany({
      where,
      orderBy: [{ nextFollowUpAt: 'asc' }, { createdAt: 'desc' }],
      take: q.limit,
    })

    return NextResponse.json({ ok: true, leads })
  } catch (e: any) {
    console.error(e)
    if (e?.message === 'UNAUTHORIZED') return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    if (e?.message === 'FORBIDDEN') return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 })
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}
