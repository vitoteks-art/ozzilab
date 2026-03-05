import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { makeAuditId } from '@/lib/ids'
import { telegramNotify } from '@/lib/telegram'
import { getClientIp } from '@/lib/ip'
import { rateLimit } from '@/lib/rateLimit'
import { ActorType, EntityType } from '@prisma/client'

const schema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  businessName: z.string().min(2),
  websiteUrl: z.string().url().optional().or(z.literal('')),
  instagramUrl: z.string().url().optional().or(z.literal('')),
  youtubeUrl: z.string().url().optional().or(z.literal('')),
  offerType: z.string().optional().or(z.literal('')),
  pricePointRange: z.string().optional().or(z.literal('')),
  monthlyLeadVolumeRange: z.string().optional().or(z.literal('')),
  primaryGoal: z.string().optional().or(z.literal('')),
  biggestConstraint: z.string().optional().or(z.literal('')),
  // honeypot
  company: z.string().optional().or(z.literal('')),
})

export async function POST(req: Request) {
  try {
    const ip = await getClientIp()
    const rl = rateLimit({ key: `audit:${ip}`, limit: 10, windowMs: 60_000 })
    if (!rl.ok) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

    const json = await req.json()
    const data = schema.parse(json)

    if (data.company) return NextResponse.json({ ok: true }) // bot

    const hasLink = Boolean((data.websiteUrl || '').trim() || (data.instagramUrl || '').trim() || (data.youtubeUrl || '').trim())
    if (!hasLink) return NextResponse.json({ error: 'At least one link is required' }, { status: 400 })

    const auditId = makeAuditId()

    const created = await prisma.auditRequest.create({
      data: {
        auditId,
        fullName: data.fullName,
        email: data.email,
        businessName: data.businessName,
        websiteUrl: data.websiteUrl || null,
        instagramUrl: data.instagramUrl || null,
        youtubeUrl: data.youtubeUrl || null,
        offerType: data.offerType || null,
        pricePointRange: data.pricePointRange || null,
        monthlyLeadVolumeRange: data.monthlyLeadVolumeRange || null,
        primaryGoal: data.primaryGoal || null,
        biggestConstraint: data.biggestConstraint || null,
      },
    })

    await prisma.activityEvent.create({
      data: {
        type: 'audit_requested',
        actorType: ActorType.CLIENT,
        entityType: EntityType.AUDIT_REQUEST,
        entityId: created.id,
        payload: {
          auditId: created.auditId,
          businessName: created.businessName,
        },
      },
    })

    await telegramNotify(
      `🆕 New Audit\n${created.auditId} — ${created.businessName}\n${created.email}\nGoal: ${created.primaryGoal || '-'}\n/admin/audits/${created.auditId}`
    )

    return NextResponse.json({ auditId })
  } catch (e: any) {
    console.error(e)
    if (e?.name === 'ZodError') return NextResponse.json({ error: 'Invalid input', issues: e.issues }, { status: 400 })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
