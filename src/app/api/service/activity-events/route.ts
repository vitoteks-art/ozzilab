import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { requireServiceToken } from '@/lib/serviceAuth'

export const dynamic = 'force-dynamic'

const schema = z.object({
  leadId: z.string().optional(),
  leadEmail: z.string().email().optional(),
  type: z.string().min(1),
  payload: z.any().optional(),
  occurredAt: z.string().datetime().optional(),
})

export async function POST(req: Request) {
  try {
    await requireServiceToken(req, 'crm:write')
    const input = schema.parse(await req.json())

    let lead = null as null | { id: string }

    if (input.leadId) {
      lead = await prisma.lead.findUnique({ where: { id: input.leadId }, select: { id: true } })
    } else if (input.leadEmail) {
      lead = await prisma.lead.findFirst({ where: { email: input.leadEmail }, select: { id: true } })
    }

    if (!lead) return NextResponse.json({ ok: false, error: 'Lead not found' }, { status: 404 })

    const ev = await prisma.activityEvent.create({
      data: {
        type: input.type,
        actorType: 'OZZI',
        entityType: 'LEAD',
        entityId: lead.id,
        payload: input.payload ?? null,
        createdAt: input.occurredAt ? new Date(input.occurredAt) : undefined,
      },
    })

    return NextResponse.json({ ok: true, event: ev })
  } catch (e: any) {
    console.error(e)
    if (e?.message === 'UNAUTHORIZED') return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    if (e?.message === 'FORBIDDEN') return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 })
    if (e?.name === 'ZodError') return NextResponse.json({ ok: false, error: 'Invalid input', issues: e.issues }, { status: 400 })
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}
