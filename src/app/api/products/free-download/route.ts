import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { rateLimit } from '@/lib/rateLimit'
import { getClientIp } from '@/lib/ip'
import { getProduct } from '@/lib/products'

const schema = z.object({
  email: z.string().email(),
  whatsapp: z.string().min(6),
  productSlug: z.string().min(1),
  name: z.string().optional().or(z.literal('')),
})

export async function POST(req: Request) {
  try {
    const ip = await getClientIp()
    const rl = rateLimit({ key: `pfree:${ip}`, limit: 20, windowMs: 60_000 })
    if (!rl.ok) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

    const { email, whatsapp, productSlug, name } = schema.parse(await req.json())

    const product = getProduct(productSlug)
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    await prisma.lead.create({
      data: {
        email,
        whatsapp,
        name: name || null,
        // Reuse existing enum for MVP
        source: 'LIBRARY_FREE_DOWNLOAD',
      },
    })

    return NextResponse.json({
      ok: true,
      downloadUrl: product.downloads.litePath,
    })
  } catch (e: any) {
    console.error(e)
    if (e?.name === 'ZodError') return NextResponse.json({ error: 'Invalid input', issues: e.issues }, { status: 400 })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
