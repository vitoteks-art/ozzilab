import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/adminAuth'

const schema = z.object({ status: z.enum(['NEW', 'REVIEWING', 'APPROVED', 'REJECTED']), internalNotes: z.string().optional() })

export async function POST(req: Request, ctx: { params: Promise<{ auditId: string }> }) {
  try {
    await requireAdmin()
    const { auditId } = await ctx.params
    const ct = req.headers.get('content-type') || ''
    const raw = ct.includes('application/json') ? await req.json() : Object.fromEntries((await req.formData()).entries())
    const { status, internalNotes } = schema.parse(raw)

    const now = new Date()
    const patch: any = { status }
    if (typeof internalNotes === 'string') patch.internalNotes = internalNotes
    if (status === 'REVIEWING') patch.reviewedAt = now
    if (status === 'APPROVED') patch.approvedAt = now
    if (status === 'REJECTED') patch.rejectedAt = now

    const audit = await prisma.auditRequest.update({ where: { auditId }, data: patch })
    return NextResponse.json({ audit })
  } catch (e: any) {
    if (e?.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
