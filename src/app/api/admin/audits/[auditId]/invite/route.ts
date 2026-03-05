import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/adminAuth'
import { randomToken, sha256 } from '@/lib/crypto'
import { absoluteUrl } from '@/lib/url'
import { sendEmail } from '@/lib/email'
import { sendWhatsAppText } from '@/lib/whatsapp'
import { telegramNotify } from '@/lib/telegram'

const schema = z.object({
  email: z.string().email().optional(),
  whatsapp: z.string().optional().or(z.literal('')),
})

export async function POST(req: Request, ctx: { params: Promise<{ auditId: string }> }) {
  try {
    await requireAdmin()
    const { auditId } = await ctx.params
    const ct = req.headers.get('content-type') || ''
    const raw = ct.includes('application/json') ? await req.json().catch(() => ({})) : Object.fromEntries((await req.formData()).entries())
    const body = schema.parse(raw)

    const audit = await prisma.auditRequest.findUnique({ where: { auditId } })
    if (!audit) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const rawToken = randomToken(32)
    const tokenHash = sha256(rawToken)
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)

    await prisma.intakeInviteToken.create({
      data: {
        auditRequestId: audit.id,
        tokenHash,
        expiresAt,
        deliveryEmail: body.email || audit.email,
        deliveryWhatsApp: body.whatsapp || null,
      },
    })

    const link = absoluteUrl(`/intake?t=${rawToken}`)

    const to = body.email || audit.email
    await sendEmail({
      to,
      subject: `Ozzilab Intake Portal — ${audit.businessName}`,
      html: `
        <div style="font-family: Inter, Arial, sans-serif; line-height:1.6;">
          <h2>You're approved for the next step</h2>
          <p>Use the link below to complete your implementation intake (expires in 7 days):</p>
          <p><a href="${link}">${link}</a></p>
          <p><strong>Audit ID:</strong> ${audit.auditId}</p>
        </div>
      `.trim(),
    })

    if (body.whatsapp && body.whatsapp.trim()) {
      await sendWhatsAppText({
        to: body.whatsapp.trim(),
        text: `Ozzilab Intake Link (expires in 7 days): ${link}`,
      })
    }

    await telegramNotify(`✉️ Intake invite sent\n${audit.auditId} — ${audit.businessName}\nEmail: ${to}${body.whatsapp ? `\nWA: ${body.whatsapp}` : ''}`)

    return NextResponse.json({ ok: true, link })
  } catch (e: any) {
    if (e?.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
