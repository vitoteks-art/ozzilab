import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/adminAuth'
import { sendWhatsAppText } from '@/lib/whatsapp'
import { sendEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'

const schema = z.object({
  channel: z.enum(['WHATSAPP', 'EMAIL']),
  subject: z.string().optional().or(z.literal('')),
  body: z.string().min(1),
  // optional override (rare)
  to: z.string().optional().or(z.literal('')),
  // follow-up scheduling
  nextFollowUpInDays: z.number().int().min(0).max(60).optional(),
})

export async function POST(req: Request, ctx: { params: Promise<{ leadId: string }> }) {
  try {
    await requireAdmin()
    const { leadId } = await ctx.params
    const input = schema.parse(await req.json())

    const lead = await prisma.lead.findUnique({ where: { id: leadId } })
    if (!lead) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 })

    const now = new Date()

    let outcome: 'SENT' | 'FAILED' = 'SENT'

    if (input.channel === 'WHATSAPP') {
      const to = (input.to || lead.whatsapp || '').trim()
      if (!to) return NextResponse.json({ ok: false, error: 'Lead has no WhatsApp number' }, { status: 400 })
      try {
        await sendWhatsAppText({ to, text: input.body })
      } catch (e) {
        console.error(e)
        outcome = 'FAILED'
      }
    }

    if (input.channel === 'EMAIL') {
      const to = (input.to || lead.email || '').trim()
      if (!to) return NextResponse.json({ ok: false, error: 'Lead has no email' }, { status: 400 })
      const subject = (input.subject || 'Ozzilab — Quick question').trim() || 'Ozzilab — Quick question'
      try {
        await sendEmail({
          to,
          subject,
          html: `<pre style="font-family:ui-sans-serif,system-ui;white-space:pre-wrap">${escapeHtml(input.body)}</pre>`,
        })
      } catch (e) {
        console.error(e)
        outcome = 'FAILED'
      }
    }

    const nextFollowUpAt = new Date(
      now.getTime() + 1000 * 60 * 60 * 24 * (typeof input.nextFollowUpInDays === 'number' ? input.nextFollowUpInDays : 2)
    )

    const tp = await prisma.touchpoint.create({
      data: {
        leadId: lead.id,
        channel: input.channel,
        type: 'FOLLOW_UP',
        subject: input.subject || null,
        body: input.body,
        outcome,
        sentAt: now,
      },
    })

    await prisma.lead.update({
      where: { id: lead.id },
      data: {
        lastContactedAt: now,
        nextFollowUpAt,
      },
    })

    await prisma.activityEvent.create({
      data: {
        type: 'touchpoint_sent',
        actorType: 'ADMIN',
        entityType: 'LEAD',
        entityId: lead.id,
        payload: {
          channel: input.channel,
          outcome,
          touchpointId: tp.id,
        },
      },
    })

    return NextResponse.json({ ok: true, outcome, touchpoint: tp, nextFollowUpAt: nextFollowUpAt.toISOString() })
  } catch (e: any) {
    console.error(e)
    if (e?.message === 'UNAUTHORIZED') return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    if (e?.name === 'ZodError') return NextResponse.json({ ok: false, error: 'Invalid input', issues: e.issues }, { status: 400 })
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}

function escapeHtml(s: string) {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}
