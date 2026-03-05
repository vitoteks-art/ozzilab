import path from 'path'
import fs from 'fs/promises'
import crypto from 'crypto'

export const UPLOAD_ROOT = process.env.UPLOAD_ROOT || '/var/lib/ozzilab/uploads'
export const LIBRARY_DOWNLOAD_ROOT = process.env.LIBRARY_DOWNLOAD_ROOT || UPLOAD_ROOT

const ALLOWED_EXT = new Set(['.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg', '.webp', '.zip', '.txt', '.md'])

export function sanitizeFilename(name: string) {
  const base = path.basename(name)
  const clean = base.replace(/[^a-zA-Z0-9._-]+/g, '_')
  return clean.slice(0, 180)
}

export function assertAllowedFile(name: string) {
  const ext = path.extname(name).toLowerCase()
  if (!ALLOWED_EXT.has(ext)) throw new Error('File type not allowed')
}

export async function writeUploadedFile({
  submissionId,
  originalName,
  bytes,
}: {
  submissionId: string
  originalName: string
  bytes: Uint8Array
}) {
  assertAllowedFile(originalName)
  const safeName = sanitizeFilename(originalName)
  const dir = path.join(UPLOAD_ROOT, 'submissions', submissionId)
  await fs.mkdir(dir, { recursive: true })
  const storedPath = path.join(dir, safeName)
  await fs.writeFile(storedPath, bytes)
  const checksum = crypto.createHash('sha256').update(bytes).digest('hex')
  return { storedPath, safeName, checksum }
}

export async function writeLibraryFile({ originalName, bytes }: { originalName: string; bytes: Uint8Array }) {
  assertAllowedFile(originalName)
  const safeName = sanitizeFilename(originalName)
  const dir = path.join(LIBRARY_DOWNLOAD_ROOT, 'library')
  await fs.mkdir(dir, { recursive: true })

  // Avoid collisions by prefixing with random id.
  const prefix = crypto.randomBytes(8).toString('hex')
  const storedPath = path.join(dir, `${prefix}-${safeName}`)
  await fs.writeFile(storedPath, bytes)
  const checksum = crypto.createHash('sha256').update(bytes).digest('hex')
  return { storedPath, safeName, checksum }
}
