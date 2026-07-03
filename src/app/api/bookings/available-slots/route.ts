import { NextResponse } from 'next/server'
import { generateBookingSlots } from '@/lib/bookings'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const start = searchParams.get('start') || undefined
    const daysParam = searchParams.get('days')
    const days = daysParam ? Number(daysParam) : undefined
    const data = await generateBookingSlots(start, Number.isFinite(days) ? days : undefined)
    return NextResponse.json(data)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
