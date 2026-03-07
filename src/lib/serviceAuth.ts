import { prisma } from '@/lib/db'
import { sha256 } from '@/lib/crypto'

export async function requireServiceToken(req: Request, scope?: string) {
  const auth = req.headers.get('authorization') || ''
  const m = auth.match(/^Bearer\s+(.+)$/i)
  if (!m) throw new Error('UNAUTHORIZED')

  const raw = m[1].trim()
  if (!raw) throw new Error('UNAUTHORIZED')

  const tokenHash = sha256(raw)
  const tok = await prisma.serviceToken.findUnique({ where: { tokenHash } })
  if (!tok || !tok.isActive) throw new Error('UNAUTHORIZED')

  if (scope) {
    const scopes = (tok.scopes || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    if (!scopes.includes(scope) && !scopes.includes('*')) throw new Error('FORBIDDEN')
  }

  await prisma.serviceToken.update({ where: { id: tok.id }, data: { lastUsedAt: new Date() } })
  return tok
}
