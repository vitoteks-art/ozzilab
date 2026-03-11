import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { requireServiceToken } from '@/lib/serviceAuth'

export const dynamic = 'force-dynamic'

const postSchema = z.object({
  leadId: z.string().optional(),
  leadEmail: z.string().email().optional(),
  channel: z.enum(['WHATSAPP', 'EMAIL', 'INSTAGRAM', 'LINKEDIN']),
  type: z.enum(['INITIAL', 'FOLLOW_UP', 'REPLY', 'NOTE']).default('FOLLOW_UP'),
  subject: z.string().optional(),
  body: z.string().min(1),
  outcome: z.enum(['SENT', 'FAILED', 'DELIVERED', 'OPENED', 'CLICKED', 'REPLIED', 'BOUNCED', 'NO_RESPONSE']).optional(),
  sentAt: z.string().datetime().optional(),
  nextFollowUpAt: z.string().datetime().optional(),
  stage: z.enum(['NEW', 'CONTACTED', 'REPLIED', 'QUALIFIED', 'BOOKED', 'WON', 'LOST']).optional(),
})

const getSchema = z.object({
  leadId: z.string().optional(),
  type: z.enum(['INITIAL', 'FOLLOW_UP', 'REPLY', 'NOTE']).optional(),
  limit: z.coerce.number().int().min(1).max(500).default(50),
})

export async function GET(req: Request) {
  try {
    await requireServiceToken(req, 'crm:write')
    const url = new URL(req.url)
    const q = getSchema.parse({
      leadId: url.searchParams.get('leadId') || undefined,
      type: url.searchParams.get('type') || undefined,
      limit: url.searchParams.get('limit') || undefined,
    })

    if (!q.leadId) return NextResponse.json({ ok: false, error: 'leadId required' }, { status: 400 })

    const where: any = { leadId: q.leadId }
    if (q.type) where.type = q.type

    const touchpoints = await prisma.touchpoint.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: q.limit,
    })

    return NextResponse.json({ ok: true, touchpoints })
  } catch (e: any) {
    console.error(e)
    if (e?.message === 'UNAUTHORIZED') return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    if (e?.message === 'FORBIDDEN') return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 })
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await requireServiceToken(req, 'crm:write')
    const input = postSchema.parse(await req.json())

    let lead = null as null | { id: string }

    if (input.leadId) {
      lead = await prisma.lead.findUnique({ where: { id: input.leadId }, select: { id: true } })
    } else if (input.leadEmail) {
      lead = await prisma.lead.findFirst({ where: { email: input.leadEmail }, select: { id: true } })
    }

    if (!lead) return NextResponse.json({ ok: false, error: 'Lead not found' }, { status: 404 })

    const tp = await prisma.touchpoint.create({
      data: {
        leadId: lead.id,
        channel: input.channel,
        type: input.type,
        subject: input.subject || null,
        body: input.body,
        outcome: (input.outcome as any) || null,
        sentAt: input.sentAt ? new Date(input.sentAt) : null,
      },
    })

    await prisma.lead.update({
      where: { id: lead.id },
      data: {
        lastContactedAt: input.sentAt ? new Date(input.sentAt) : new Date(),
        nextFollowUpAt: input.nextFollowUpAt ? new Date(input.nextFollowUpAt) : undefined,
        stage: (input.stage as any) || undefined,
      },
    })

    await prisma.activityEvent.create({
      data: {
        type: 'touchpoint_sent',
        actorType: 'OZZI',
        entityType: 'LEAD',
        entityId: lead.id,
        payload: {
          channel: input.channel,
          outcome: input.outcome || null,
          touchpointId: tp.id,
        },
      },
    })

    return NextResponse.json({ ok: true, touchpoint: tp })
  } catch (e: any) {
    console.error(e)
    if (e?.message === 'UNAUTHORIZED') return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    if (e?.message === 'FORBIDDEN') return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 })
    if (e?.name === 'ZodError') return NextResponse.json({ ok: false, error: 'Invalid input', issues: e.issues }, { status: 400 })
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}
