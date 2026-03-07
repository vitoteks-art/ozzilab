import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/adminAuth'
import { randomToken, sha256 } from '@/lib/crypto'

export const dynamic = 'force-dynamic'

const schema = z.object({
  name: z.string().min(2).max(64).default('ozzi-cron'),
  scopes: z.string().min(1).default('crm:write'),
})

export async function POST(req: Request) {
  try {
    await requireAdmin()
    const input = schema.parse(await req.json().catch(() => ({})))

    const raw = randomToken(40)
    const tokenHash = sha256(raw)

    await prisma.serviceToken.create({
      data: {
        name: input.name,
        tokenHash,
        scopes: input.scopes,
        isActive: true,
      },
    })

    // Return raw token once. Store it securely.
    return NextResponse.json({ ok: true, token: raw, name: input.name, scopes: input.scopes })
  } catch (e: any) {
    console.error(e)
    if (e?.message === 'UNAUTHORIZED') return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    if (e?.name === 'ZodError') return NextResponse.json({ ok: false, error: 'Invalid input', issues: e.issues }, { status: 400 })
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}
