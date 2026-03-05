import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/adminAuth'

export const dynamic = 'force-dynamic'

const createSchema = z.object({
  email: z.string().email(),
  name: z.string().optional().or(z.literal('')),
  whatsapp: z.string().optional().or(z.literal('')),
  company: z.string().optional().or(z.literal('')),
  role: z.string().optional().or(z.literal('')),
  websiteUrl: z.string().url().optional().or(z.literal('')),
  instagramUrl: z.string().url().optional().or(z.literal('')),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  tags: z.string().optional().or(z.literal('')),
})

export async function GET() {
  try {
    await requireAdmin()
    const leads = await prisma.lead.findMany({
      orderBy: [{ nextFollowUpAt: 'asc' }, { createdAt: 'desc' }],
      take: 200,
    })
    return NextResponse.json({ ok: true, leads })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin()
    const data = createSchema.parse(await req.json())

    const created = await prisma.lead.create({
      data: {
        email: data.email,
        name: data.name || null,
        whatsapp: data.whatsapp || null,
        company: data.company || null,
        role: data.role || null,
        websiteUrl: data.websiteUrl || null,
        instagramUrl: data.instagramUrl || null,
        linkedinUrl: data.linkedinUrl || null,
        tags: data.tags || null,
        source: 'OUTREACH',
        stage: 'NEW',
        nextFollowUpAt: new Date(),
      },
    })

    return NextResponse.json({ ok: true, lead: created })
  } catch (e: any) {
    console.error(e)
    if (e?.name === 'ZodError') return NextResponse.json({ ok: false, error: 'Invalid input', issues: e.issues }, { status: 400 })
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}
