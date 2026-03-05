import { NextResponse } from 'next/server'
import { createReadStream } from 'fs'
import { stat } from 'fs/promises'
import path from 'path'
import { prisma } from '@/lib/db'
import { verifyDownloadToken } from '@/lib/downloadToken'

export const runtime = 'nodejs'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const slug = searchParams.get('slug')
    const token = searchParams.get('token')
    if (!slug || !token) return NextResponse.json({ error: 'Missing params' }, { status: 400 })

    const item = await prisma.libraryItem.findUnique({ where: { slug } })
    if (!item || !item.isPublished) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (!item.downloadFilePath) return NextResponse.json({ error: 'No download configured' }, { status: 400 })

    const payload = verifyDownloadToken(token)
    if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    if (payload.libraryItemId !== item.id) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    // If premium, ensure entitlement exists (token alone is not enough)
    if (item.tier === 'PREMIUM') {
      const ent = await prisma.entitlement.findFirst({ where: { email: payload.email, libraryItemId: item.id, endsAt: null } })
      if (!ent) return NextResponse.json({ error: 'No entitlement' }, { status: 403 })
    }

    const root = process.env.LIBRARY_DOWNLOAD_ROOT || process.env.UPLOAD_ROOT || '/var/lib/ozzilab/uploads'
    const resolved = path.resolve(item.downloadFilePath)
    const resolvedRoot = path.resolve(root)
    if (!resolved.startsWith(resolvedRoot)) return NextResponse.json({ error: 'Invalid path' }, { status: 400 })

    await stat(resolved)
    const stream = createReadStream(resolved)

    return new NextResponse(stream as any, {
      headers: {
        'content-type': 'application/octet-stream',
        'content-disposition': `attachment; filename="${encodeURIComponent(path.basename(resolved))}"`,
      },
    })
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
