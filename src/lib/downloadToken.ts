import { hmacSha256, safeEqual } from '@/lib/crypto'

export type DownloadTokenPayload = {
  exp: number
  email: string
  libraryItemId: string
}

function b64url(input: string) {
  return Buffer.from(input).toString('base64url')
}

function unb64url(input: string) {
  return Buffer.from(input, 'base64url').toString('utf8')
}

export function signDownloadToken(payload: DownloadTokenPayload) {
  const secret = process.env.DOWNLOAD_TOKEN_SECRET
  if (!secret) throw new Error('DOWNLOAD_TOKEN_SECRET missing')
  const json = JSON.stringify(payload)
  const data = b64url(json)
  const sig = hmacSha256(data, secret)
  return `${data}.${sig}`
}

export function verifyDownloadToken(token: string): DownloadTokenPayload | null {
  const secret = process.env.DOWNLOAD_TOKEN_SECRET
  if (!secret) throw new Error('DOWNLOAD_TOKEN_SECRET missing')
  const [data, sig] = token.split('.')
  if (!data || !sig) return null
  const expected = hmacSha256(data, secret)
  if (!safeEqual(sig, expected)) return null
  const payload = JSON.parse(unb64url(data)) as DownloadTokenPayload
  if (!payload?.exp || payload.exp * 1000 < Date.now()) return null
  return payload
}
