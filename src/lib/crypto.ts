import crypto from 'crypto'

export function sha256(input: string) {
  return crypto.createHash('sha256').update(input).digest('hex')
}

export function hmacSha256(input: string, secret: string) {
  return crypto.createHmac('sha256', secret).update(input).digest('hex')
}

export function randomToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString('hex')
}

export function safeEqual(a: string, b: string) {
  const aa = Buffer.from(a)
  const bb = Buffer.from(b)
  if (aa.length !== bb.length) return false
  return crypto.timingSafeEqual(aa, bb)
}
