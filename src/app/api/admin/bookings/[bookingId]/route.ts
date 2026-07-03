import { NextResponse } from 'next/server'
import { z } from 'zod'
import { BookingStatus } from '@prisma/client'
import { requireAdmin } from '@/lib/adminAuth'
import { prisma } from '@/lib/db'

const schema = z.object({
  status: z.enum(['NEW', 'CONFIRMED', 'RESCHEDULE_REQUESTED', 'COMPLETED', 'CANCELLED']).optional(),
  internalNotes: z.string().optional().or(z.literal('')),
})

export async function GET(_: Request, { params }: { params: Promise<{ bookingId: string }> }) {
  try {
    await requireAdmin()
    const { bookingId } = await params
    const booking = await prisma.bookingRequest.findUnique({ where: { bookingId } })
    if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ booking })
  } catch (e: any) {
    if (e?.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ bookingId: string }> }) {
  try {
    await requireAdmin()
    const { bookingId } = await params
    const data = schema.parse(await req.json())
    const booking = await prisma.bookingRequest.update({
      where: { bookingId },
      data: {
        ...(data.status ? { status: data.status as BookingStatus } : {}),
        ...(data.internalNotes !== undefined ? { internalNotes: data.internalNotes || null } : {}),
      },
    })
    return NextResponse.json({ booking })
  } catch (e: any) {
    if (e?.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (e?.name === 'ZodError') return NextResponse.json({ error: 'Invalid input', issues: e.issues }, { status: 400 })
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
