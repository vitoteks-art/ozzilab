import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/adminAuth'

export async function GET(_: Request, ctx: { params: Promise<{ auditId: string }> }) {
  try {
    await requireAdmin()
    const { auditId } = await ctx.params
    const audit = await prisma.auditRequest.findUnique({
      where: { auditId },
      include: { inviteTokens: { orderBy: { createdAt: 'desc' }, take: 5 } },
    })
    if (!audit) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ audit })
  } catch (e: any) {
    if (e?.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
