import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { randomToken, sha256 } from '@/lib/crypto'

const COOKIE_NAME = 'ozzi_admin'

export async function ensureAdminSeeded() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD
  const forceReset = process.env.ADMIN_FORCE_RESET === 'true'
  if (!email || !password) return

  const passwordHash = await bcrypt.hash(password, 12)

  if (forceReset) {
    await prisma.adminUser.upsert({
      where: { email },
      create: { email, passwordHash },
      update: { passwordHash },
    })
    console.log('AdminUser password reset applied for:', email)
    return
  }

  const existing = await prisma.adminUser.findUnique({ where: { email } })
  if (existing) return

  await prisma.adminUser.create({ data: { email, passwordHash } })
  console.log('Seeded AdminUser:', email)
}

export async function createAdminSession(adminUserId: string) {
  const raw = randomToken(32)
  const sessionTokenHash = sha256(raw)
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) // 7 days

  await prisma.adminSession.create({
    data: { adminUserId, sessionTokenHash, expiresAt },
  })

  const jar = await cookies()
  jar.set(COOKIE_NAME, raw, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: expiresAt,
  })
}

export async function destroyAdminSession() {
  const jar = await cookies()
  const raw = jar.get(COOKIE_NAME)?.value
  if (raw) {
    await prisma.adminSession.deleteMany({ where: { sessionTokenHash: sha256(raw) } })
  }
  jar.set(COOKIE_NAME, '', { httpOnly: true, path: '/', expires: new Date(0) })
}

export async function getAdminFromRequest() {
  const jar = await cookies()
  const raw = jar.get(COOKIE_NAME)?.value
  if (!raw) return null

  const session = await prisma.adminSession.findUnique({
    where: { sessionTokenHash: sha256(raw) },
    include: { adminUser: true },
  })
  if (!session) return null
  if (session.expiresAt.getTime() < Date.now()) return null

  return session.adminUser
}

export async function requireAdmin() {
  const admin = await getAdminFromRequest()
  if (!admin) throw new Error('UNAUTHORIZED')
  return admin
}
