import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/adminAuth'

export async function GET(_: Request, ctx: { params: Promise<{ submissionId: string }> }) {
  try {
    await requireAdmin()
    const { submissionId } = await ctx.params

    const intake = await prisma.intakeSubmission.findUnique({
      where: { submissionId },
      include: { auditRequest: true, files: { orderBy: { createdAt: 'desc' } } },
    })

    if (!intake) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ intake })
  } catch (e: any) {
    if (e?.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
