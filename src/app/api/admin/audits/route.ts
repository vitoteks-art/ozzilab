import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/adminAuth'

export async function GET(req: Request) {
  try {
    await requireAdmin()
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') || undefined

    const audits = await prisma.auditRequest.findMany({
      where: status ? { status: status as any } : undefined,
      orderBy: { createdAt: 'desc' },
      take: 200,
    })

    return NextResponse.json({ audits })
  } catch (e: any) {
    const msg = e?.message || ''
    if (msg === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
