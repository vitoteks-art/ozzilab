import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { requireServiceToken } from '@/lib/serviceAuth'

export const dynamic = 'force-dynamic'

const schema = z.object({
  email: z.string().email().optional(),
  whatsapp: z.string().optional(),
  name: z.string().optional(),
  company: z.string().optional(),
  role: z.string().optional(),
  websiteUrl: z.string().url().optional(),
  instagramUrl: z.string().url().optional(),
  linkedinUrl: z.string().url().optional(),
  tags: z.string().optional(),
  stage: z.enum(['NEW', 'CONTACTED', 'REPLIED', 'QUALIFIED', 'BOOKED', 'WON', 'LOST']).optional(),
  nextFollowUpAt: z.string().datetime().optional(),
})

function norm(v?: string | null) {
  const s = (v || '').trim()
  return s.length ? s : null
}

export async function POST(req: Request) {
  try {
    await requireServiceToken(req, 'crm:write')
    const input = schema.parse(await req.json())

    const email = norm(input.email)
    if (!email) return NextResponse.json({ ok: false, error: 'email is required' }, { status: 400 })

    const existing = await prisma.lead.findFirst({
      where: {
        OR: [
          { email },
          input.whatsapp ? { whatsapp: norm(input.whatsapp) || undefined } : undefined,
          input.instagramUrl ? { instagramUrl: norm(input.instagramUrl) || undefined } : undefined,
          input.linkedinUrl ? { linkedinUrl: norm(input.linkedinUrl) || undefined } : undefined,
          input.websiteUrl ? { websiteUrl: norm(input.websiteUrl) || undefined } : undefined,
        ].filter(Boolean) as any,
      },
    })

    const lead = existing
      ? await prisma.lead.update({
          where: { id: existing.id },
          data: {
            email,
            whatsapp: norm(input.whatsapp) ?? existing.whatsapp,
            name: norm(input.name) ?? existing.name,
            company: norm(input.company) ?? existing.company,
            role: norm(input.role) ?? existing.role,
            websiteUrl: norm(input.websiteUrl) ?? existing.websiteUrl,
            instagramUrl: norm(input.instagramUrl) ?? existing.instagramUrl,
            linkedinUrl: norm(input.linkedinUrl) ?? existing.linkedinUrl,
            tags: norm(input.tags) ?? existing.tags,
            stage: (input.stage as any) ?? existing.stage,
            nextFollowUpAt: input.nextFollowUpAt ? new Date(input.nextFollowUpAt) : existing.nextFollowUpAt,
          },
        })
      : await prisma.lead.create({
          data: {
            email,
            whatsapp: norm(input.whatsapp),
            name: norm(input.name),
            company: norm(input.company),
            role: norm(input.role),
            websiteUrl: norm(input.websiteUrl),
            instagramUrl: norm(input.instagramUrl),
            linkedinUrl: norm(input.linkedinUrl),
            tags: norm(input.tags),
            source: 'OUTREACH',
            stage: (input.stage as any) || 'NEW',
            nextFollowUpAt: input.nextFollowUpAt ? new Date(input.nextFollowUpAt) : null,
          },
        })

    return NextResponse.json({ ok: true, lead })
  } catch (e: any) {
    console.error(e)
    if (e?.message === 'UNAUTHORIZED') return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    if (e?.message === 'FORBIDDEN') return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 })
    if (e?.name === 'ZodError') return NextResponse.json({ ok: false, error: 'Invalid input', issues: e.issues }, { status: 400 })
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}
