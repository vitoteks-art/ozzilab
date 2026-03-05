import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { sha256 } from '@/lib/crypto'
import { makeSubmissionId } from '@/lib/ids'
import { telegramNotify } from '@/lib/telegram'
import { ActorType, EntityType } from '@prisma/client'

const schema = z.object({
  businessName: z.string().min(2),
  websiteUrl: z.string().url().optional().or(z.literal('')),
  contactEmail: z.string().email(),
  industry: z.string().optional().or(z.literal('')),

  kpiTarget: z.string().optional().or(z.literal('')),
  successDefinition: z.string().optional().or(z.literal('')),

  funnelSummary: z.string().optional().or(z.literal('')),
  toolsStack: z.string().optional().or(z.literal('')),
  constraints: z.string().optional().or(z.literal('')),

  requestedBuild: z.string().optional().or(z.literal('')),
  mustHaveFeatures: z.string().optional().or(z.literal('')),
  nonGoals: z.string().optional().or(z.literal('')),

  timeline: z.string().optional().or(z.literal('')),
  budgetRange: z.string().optional().or(z.literal('')),

  supportingLinks: z.string().optional().or(z.literal('')),
})

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const t = searchParams.get('t')
    if (!t) return NextResponse.json({ error: 'Missing token' }, { status: 400 })

    const tokenHash = sha256(t)
    const tok = await prisma.intakeInviteToken.findUnique({
      where: { tokenHash },
      include: { auditRequest: true },
    })

    if (!tok) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    if (tok.expiresAt.getTime() < Date.now()) return NextResponse.json({ error: 'Token expired' }, { status: 401 })
    if (tok.usedAt) return NextResponse.json({ error: 'Token used' }, { status: 401 })

    const json = await req.json()
    const data = schema.parse(json)

    const submissionId = makeSubmissionId()

    const created = await prisma.intakeSubmission.create({
      data: {
        submissionId,
        auditRequestId: tok.auditRequestId,
        businessName: data.businessName,
        websiteUrl: data.websiteUrl || null,
        contactEmail: data.contactEmail,
        industry: data.industry || null,
        kpiTarget: data.kpiTarget || null,
        successDefinition: data.successDefinition || null,
        funnelSummary: data.funnelSummary || null,
        toolsStack: data.toolsStack || null,
        constraints: data.constraints || null,
        requestedBuild: data.requestedBuild || null,
        mustHaveFeatures: data.mustHaveFeatures || null,
        nonGoals: data.nonGoals || null,
        timeline: data.timeline || null,
        budgetRange: data.budgetRange || null,
        supportingLinks: data.supportingLinks || null,
      },
    })

    await prisma.intakeInviteToken.update({ where: { id: tok.id }, data: { usedAt: new Date() } })

    await prisma.activityEvent.create({
      data: {
        type: 'intake_submitted',
        actorType: ActorType.CLIENT,
        entityType: EntityType.INTAKE_SUBMISSION,
        entityId: created.id,
        payload: {
          submissionId: created.submissionId,
          businessName: created.businessName,
          auditRequestId: tok.auditRequest.auditId,
        },
      },
    })

    await telegramNotify(
      `📥 New Intake\n${created.submissionId} — ${created.businessName}\n${created.contactEmail}\nFrom: ${tok.auditRequest.auditId}\n/admin/intakes/${created.submissionId}`
    )

    return NextResponse.json({ submissionId })
  } catch (e: any) {
    console.error(e)
    if (e?.name === 'ZodError') return NextResponse.json({ error: 'Invalid input', issues: e.issues }, { status: 400 })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
