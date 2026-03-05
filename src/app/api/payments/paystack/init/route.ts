import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { randomToken } from '@/lib/crypto'

const schema = z.object({ libraryItemId: z.string().min(1), email: z.string().email() })

export async function POST(req: Request) {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY
    if (!secret) return NextResponse.json({ error: 'Paystack not configured' }, { status: 400 })

    const { libraryItemId, email } = schema.parse(await req.json())
    const item = await prisma.libraryItem.findUnique({ where: { id: libraryItemId } })
    if (!item || !item.isPublished) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (item.tier !== 'PREMIUM') return NextResponse.json({ error: 'Not premium' }, { status: 400 })
    if (!item.priceNGN) return NextResponse.json({ error: 'Missing NGN price' }, { status: 400 })

    const reference = `ps_${randomToken(10)}`

    await prisma.purchase.create({
      data: {
        provider: 'PAYSTACK',
        providerReference: reference,
        email,
        libraryItemId: item.id,
        amount: item.priceNGN,
        currency: 'NGN',
        status: 'PENDING',
      },
    })

    const callback_url = process.env.PAYMENTS_CALLBACK_URL || process.env.PUBLIC_BASE_URL
    const res = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secret}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({ email, amount: item.priceNGN, reference, callback_url }),
    })

    const json = await res.json()
    if (!res.ok || !json.status) {
      console.error('Paystack init failed', json)
      return NextResponse.json({ error: 'Paystack init failed' }, { status: 400 })
    }

    return NextResponse.json({ ok: true, authorization_url: json.data.authorization_url, reference })
  } catch (e: any) {
    console.error(e)
    if (e?.name === 'ZodError') return NextResponse.json({ error: 'Invalid input', issues: e.issues }, { status: 400 })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
