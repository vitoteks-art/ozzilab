import { NextResponse } from 'next/server'
import { BookingStatus } from '@prisma/client'
import { requireAdmin } from '@/lib/adminAuth'
import { prisma } from '@/lib/db'

export async function GET(req: Request) {
  try {
    await requireAdmin()
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') || undefined
    const where = status && status in BookingStatus ? { status: status as BookingStatus } : undefined
    const bookings = await prisma.bookingRequest.findMany({ where, orderBy: { createdAt: 'desc' }, take: 250 })
    return NextResponse.json({ bookings })
  } catch (e: any) {
    if (e?.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
