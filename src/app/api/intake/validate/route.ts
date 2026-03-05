import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sha256 } from '@/lib/crypto'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const t = searchParams.get('t')
  if (!t) return NextResponse.json({ ok: false }, { status: 400 })

  const tokenHash = sha256(t)
  const tok = await prisma.intakeInviteToken.findUnique({
    where: { tokenHash },
    include: { auditRequest: true },
  })

  if (!tok) return NextResponse.json({ ok: false }, { status: 401 })
  if (tok.expiresAt.getTime() < Date.now()) return NextResponse.json({ ok: false }, { status: 401 })
  if (tok.usedAt) return NextResponse.json({ ok: false, used: true }, { status: 401 })

  return NextResponse.json({
    ok: true,
    auditId: tok.auditRequest.auditId,
    businessName: tok.auditRequest.businessName,
    email: tok.auditRequest.email,
  })
}
