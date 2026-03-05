import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sha256 } from '@/lib/crypto'
import { writeUploadedFile } from '@/lib/uploads'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const t = searchParams.get('t')
    if (!t) return NextResponse.json({ error: 'Missing token' }, { status: 400 })

    const tokenHash = sha256(t)
    const tok = await prisma.intakeInviteToken.findUnique({ where: { tokenHash } })
    if (!tok) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    if (tok.expiresAt.getTime() < Date.now()) return NextResponse.json({ error: 'Token expired' }, { status: 401 })

    const form = await req.formData()
    const submissionId = String(form.get('submissionId') || '')
    const file = form.get('file')

    if (!submissionId) return NextResponse.json({ error: 'Missing submissionId' }, { status: 400 })
    if (!(file instanceof File)) return NextResponse.json({ error: 'Missing file' }, { status: 400 })

    const submission = await prisma.intakeSubmission.findUnique({ where: { submissionId } })
    if (!submission) return NextResponse.json({ error: 'Unknown submission' }, { status: 404 })
    if (submission.auditRequestId !== tok.auditRequestId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const maxBytes = Number(process.env.MAX_UPLOAD_BYTES || 50 * 1024 * 1024)
    if (file.size > maxBytes) return NextResponse.json({ error: 'File too large' }, { status: 413 })

    const bytes = new Uint8Array(await file.arrayBuffer())
    const { storedPath, checksum } = await writeUploadedFile({ submissionId, originalName: file.name, bytes })

    const created = await prisma.submissionFile.create({
      data: {
        intakeSubmissionId: submission.id,
        originalName: file.name,
        storedPath,
        mimeType: file.type || 'application/octet-stream',
        sizeBytes: BigInt(file.size),
        checksum,
      },
    })

    return NextResponse.json({ ok: true, fileId: created.id })
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: e?.message || 'Upload failed' }, { status: 400 })
  }
}
