import { NextResponse } from 'next/server'
import { z } from 'zod'
import { ActorType, EntityType } from '@prisma/client'
import { prisma } from '@/lib/db'
import { makeBookingId } from '@/lib/ids'
import { telegramNotify } from '@/lib/telegram'
import { getClientIp } from '@/lib/ip'
import { rateLimit } from '@/lib/rateLimit'
import { assertSlotAvailable } from '@/lib/bookings'
import { createGoogleMeetForBooking, isGoogleCalendarEnabled } from '@/lib/googleCalendar'

const optionalUrl = z.string().url().optional().or(z.literal(''))
const schema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  whatsapp: z.string().optional().or(z.literal('')),
  country: z.string().optional().or(z.literal('')),
  businessName: z.string().min(2),
  industry: z.string().optional().or(z.literal('')),
  websiteUrl: optionalUrl,
  instagramUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  youtubeUrl: optionalUrl,
  googleBusinessUrl: optionalUrl,
  schedulerUrl: optionalUrl,
  meetingType: z.string().min(2),
  slotStart: z.string().min(8),
  slotEnd: z.string().optional().or(z.literal('')),
  timezone: z.string().optional().or(z.literal('')),
  alternativeDate: z.string().optional().or(z.literal('')),
  alternativeTime: z.string().optional().or(z.literal('')),
  currentLeadSources: z.string().optional().or(z.literal('')),
  mainProblem: z.string().optional().or(z.literal('')),
  monthlyLeadVolumeRange: z.string().optional().or(z.literal('')),
  budgetReadiness: z.string().optional().or(z.literal('')),
  preferredPackageInterest: z.string().optional().or(z.literal('')),
  source: z.enum(['BOOKING_PAGE', 'AUDIT_THANK_YOU', 'ADMIN']).optional(),
  company: z.string().optional().or(z.literal('')),
})

export async function POST(req: Request) {
  try {
    const ip = await getClientIp()
    const rl = rateLimit({ key: `booking:${ip}`, limit: 8, windowMs: 60_000 })
    if (!rl.ok) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

    const data = schema.parse(await req.json())
    if (data.company) return NextResponse.json({ ok: true })

    const hasLink = Boolean([
      data.websiteUrl,
      data.instagramUrl,
      data.linkedinUrl,
      data.youtubeUrl,
      data.googleBusinessUrl,
      data.schedulerUrl,
    ].some((v) => (v || '').trim()))
    if (!hasLink) return NextResponse.json({ error: 'At least one business, social, Google Business, or booking link is required' }, { status: 400 })

    const { slotStart, slotEnd } = await assertSlotAvailable(data.slotStart, data.slotEnd || undefined)
    const bookingId = makeBookingId()

    const created = await prisma.bookingRequest.create({
      data: {
        bookingId,
        fullName: data.fullName,
        email: data.email,
        whatsapp: data.whatsapp || null,
        country: data.country || null,
        businessName: data.businessName,
        industry: data.industry || null,
        websiteUrl: data.websiteUrl || null,
        instagramUrl: data.instagramUrl || null,
        linkedinUrl: data.linkedinUrl || null,
        youtubeUrl: data.youtubeUrl || null,
        googleBusinessUrl: data.googleBusinessUrl || null,
        schedulerUrl: data.schedulerUrl || null,
        meetingType: data.meetingType,
        timezone: data.timezone || null,
        scheduledStart: slotStart,
        scheduledEnd: slotEnd,
        alternativeDate: data.alternativeDate || null,
        alternativeTime: data.alternativeTime || null,
        currentLeadSources: data.currentLeadSources || null,
        mainProblem: data.mainProblem || null,
        monthlyLeadVolumeRange: data.monthlyLeadVolumeRange || null,
        budgetReadiness: data.budgetReadiness || null,
        preferredPackageInterest: data.preferredPackageInterest || null,
        source: data.source || 'BOOKING_PAGE',
      },
    })

    let googleMeetLink: string | null = null
    if (isGoogleCalendarEnabled()) {
      try {
        const meet = await createGoogleMeetForBooking(created)
        if (meet?.eventId || meet?.meetLink) {
          const updated = await prisma.bookingRequest.update({
            where: { id: created.id },
            data: {
              googleCalendarEventId: meet.eventId || null,
              googleMeetLink: meet.meetLink || null,
            },
          })
          googleMeetLink = updated.googleMeetLink
        }
      } catch (calendarError) {
        console.error('Google Calendar event creation failed', calendarError)
      }
    }

    await prisma.activityEvent.create({
      data: {
        type: 'booking_requested',
        actorType: ActorType.CLIENT,
        entityType: EntityType.BOOKING_REQUEST,
        entityId: created.id,
        payload: {
          bookingId: created.bookingId,
          businessName: created.businessName,
          meetingType: created.meetingType,
          scheduledStart: created.scheduledStart.toISOString(),
          googleMeetLink,
        },
      },
    }).catch((e) => console.warn('Activity event skipped', e))

    await telegramNotify(
      `📅 New Strategy Call Booking\n${created.bookingId} — ${created.businessName}\n${created.fullName} <${created.email}>\nType: ${created.meetingType}\nTime: ${created.scheduledStart.toISOString()}${googleMeetLink ? `\nGoogle Meet: ${googleMeetLink}` : ''}\n/admin/bookings/${created.bookingId}`
    )

    return NextResponse.json({ bookingId: created.bookingId, googleMeetLink })
  } catch (e: any) {
    console.error(e)
    if (e?.name === 'ZodError') return NextResponse.json({ error: 'Invalid input', issues: e.issues }, { status: 400 })
    if (e?.message?.includes('Selected slot')) return NextResponse.json({ error: e.message }, { status: 409 })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
