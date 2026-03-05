import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { randomToken } from '@/lib/crypto'

const schema = z.object({ libraryItemId: z.string().min(1), email: z.string().email() })

export async function POST(req: Request) {
  try {
    const secret = process.env.FLUTTERWAVE_SECRET_KEY
    if (!secret) return NextResponse.json({ error: 'Flutterwave not configured' }, { status: 400 })

    const { libraryItemId, email } = schema.parse(await req.json())
    const item = await prisma.libraryItem.findUnique({ where: { id: libraryItemId } })
    if (!item || !item.isPublished) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (item.tier !== 'PREMIUM') return NextResponse.json({ error: 'Not premium' }, { status: 400 })
    if (!item.priceUSD) return NextResponse.json({ error: 'Missing USD price' }, { status: 400 })

    const tx_ref = `fw_${randomToken(10)}`

    await prisma.purchase.create({
      data: {
        provider: 'FLUTTERWAVE',
        providerReference: tx_ref,
        email,
        libraryItemId: item.id,
        amount: item.priceUSD,
        currency: 'USD',
        status: 'PENDING',
      },
    })

    const redirect_url = process.env.PAYMENTS_CALLBACK_URL || process.env.PUBLIC_BASE_URL

    const res = await fetch('https://api.flutterwave.com/v3/payments', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secret}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        tx_ref,
        amount: (item.priceUSD / 100).toFixed(2),
        currency: 'USD',
        redirect_url,
        customer: { email },
        customizations: { title: item.title, description: 'Ozzilab Premium Library Item' },
      }),
    })

    const json = await res.json()
    if (!res.ok || json.status !== 'success') {
      console.error('Flutterwave init failed', json)
      return NextResponse.json({ error: 'Flutterwave init failed' }, { status: 400 })
    }

    return NextResponse.json({ ok: true, link: json.data.link, tx_ref })
  } catch (e: any) {
    console.error(e)
    if (e?.name === 'ZodError') return NextResponse.json({ error: 'Invalid input', issues: e.issues }, { status: 400 })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
