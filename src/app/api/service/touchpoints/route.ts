import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { requireServiceToken } from '@/lib/serviceAuth'

export const dynamic = 'force-dynamic'

const schema = z.object({
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
