import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { telegramNotify } from '@/lib/telegram'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const hash = process.env.FLUTTERWAVE_WEBHOOK_HASH
  const secret = process.env.FLUTTERWAVE_SECRET_KEY
  if (!hash || !secret) return NextResponse.json({ error: 'Not configured' }, { status: 400 })

  const header = req.headers.get('verif-hash')
  if (!header || header !== hash) return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })

  const body = await req.json()

  try {
    // Expecting event like { event: 'charge.completed', data: { tx_ref, id, status, ... } }
    const data = body?.data
    const tx_ref = data?.tx_ref
    const tx_id = data?.id
    if (!tx_ref) return NextResponse.json({ ok: true })

    // Verify with Flutterwave API for safety
    if (tx_id) {
      const verifyRes = await fetch(`https://api.flutterwave.com/v3/transactions/${tx_id}/verify`, {
        headers: { Authorization: `Bearer ${secret}` },
      })
      const verifyJson = await verifyRes.json()
      if (!verifyRes.ok || verifyJson.status !== 'success') {
        console.error('Flutterwave verify failed', verifyJson)
        return NextResponse.json({ ok: true })
      }
      const verified = verifyJson.data
      if (verified.tx_ref !== tx_ref || verified.status !== 'successful') return NextResponse.json({ ok: true })
    } else {
      if (data?.status !== 'successful') return NextResponse.json({ ok: true })
    }

    const purchase = await prisma.purchase.findUnique({ where: { providerReference: tx_ref } })
    if (!purchase) return NextResponse.json({ ok: true })

    if (purchase.status !== 'SUCCESS') {
      const updated = await prisma.purchase.update({
        where: { id: purchase.id },
        data: {
          status: 'SUCCESS',
          providerTransactionId: tx_id ? String(tx_id) : null,
          rawWebhookEvent: body,
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
      await telegramNotify(`✅ Payment (Flutterwave)\n${item?.title || updated.libraryItemId}\n${updated.email}\nRef: ${updated.providerReference}`)
    }

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('Flutterwave webhook error', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
