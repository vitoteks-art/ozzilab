import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/db'
import { telegramNotify } from '@/lib/telegram'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY
  if (!secret) return NextResponse.json({ error: 'Not configured' }, { status: 400 })

  const sig = req.headers.get('x-paystack-signature') || ''
  const bodyText = await req.text()

  const hash = crypto.createHmac('sha512', secret).update(bodyText).digest('hex')
  if (hash !== sig) return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })

  const event = JSON.parse(bodyText)

  try {
    if (event.event !== 'charge.success') return NextResponse.json({ ok: true })

    const data = event.data
    const reference = data?.reference
    const status = data?.status
    if (!reference || status !== 'success') return NextResponse.json({ ok: true })

    const purchase = await prisma.purchase.findUnique({ where: { providerReference: reference } })
    if (!purchase) return NextResponse.json({ ok: true })

    if (purchase.status !== 'SUCCESS') {
      const updated = await prisma.purchase.update({
        where: { id: purchase.id },
        data: {
          status: 'SUCCESS',
          providerTransactionId: String(data?.id ?? ''),
          rawWebhookEvent: event,
        },
      })

      await prisma.entitlement.create({
        data: {
          email: updated.email,
          type: 'LIBRARY_ITEM',
          libraryItemId: updated.libraryItemId,
          purchaseId: updated.id,
        },
      })

      const item = await prisma.libraryItem.findUnique({ where: { id: updated.libraryItemId } })
      await telegramNotify(`✅ Payment (Paystack)\n${item?.title || updated.libraryItemId}\n${updated.email}\nRef: ${updated.providerReference}`)
    }

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('Paystack webhook error', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
