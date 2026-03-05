import { NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { createAdminSession, ensureAdminSeeded } from '@/lib/adminAuth'

const schema = z.object({ email: z.string().email(), password: z.string().min(6) })

export async function POST(req: Request) {
  try {
    await ensureAdminSeeded()
    const { email, password } = schema.parse(await req.json())
    const user = await prisma.adminUser.findUnique({ where: { email } })
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    await createAdminSession(user.id)
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
