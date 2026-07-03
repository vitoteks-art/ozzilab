import { BookingStatus } from '@prisma/client'
import { prisma } from '@/lib/db'

export type PublicBookingSlot = { start: string; end: string; label: string }
export type PublicBookingDay = { date: string; dayLabel: string; slots: PublicBookingSlot[] }

const DEFAULT_RULES = [1, 2, 3, 4, 5].map((dayOfWeek) => ({
  dayOfWeek,
  startTime: '09:00',
  endTime: '17:00',
  slotMinutes: 60,
  isActive: true,
}))

function pad(n: number) {
  return String(n).padStart(2, '0')
}

export function dateKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

function atLocalTime(date: Date, hhmm: string) {
  const [h, m] = hhmm.split(':').map(Number)
  const d = new Date(date)
  d.setHours(h || 0, m || 0, 0, 0)
  return d
}

function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60_000)
}

function labelFor(start: Date, end: Date) {
  const fmt = new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' })
  return `${fmt.format(start)} – ${fmt.format(end)}`
}

export async function getBookingSettings() {
  const settings = await prisma.bookingSettings.findUnique({ where: { id: 1 } }).catch(() => null)
  return settings || { lookaheadDays: 14, minimumNoticeHours: 4, defaultTimezone: 'Africa/Lagos' }
}

export async function generateBookingSlots(startDate?: string, days?: number): Promise<{ settings: Awaited<ReturnType<typeof getBookingSettings>>; days: PublicBookingDay[] }> {
  const settings = await getBookingSettings()
  const lookaheadDays = Math.max(1, Math.min(31, days || settings.lookaheadDays || 14))
  const base = startDate ? new Date(`${startDate}T00:00:00`) : new Date()
  base.setHours(0, 0, 0, 0)

  const dbRules = await prisma.bookingAvailabilityRule.findMany({ where: { isActive: true }, orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }] }).catch(() => [])
  const rules = dbRules.length ? dbRules : DEFAULT_RULES

  const rangeStart = new Date(base)
  const rangeEnd = addMinutes(new Date(base), lookaheadDays * 24 * 60)
  const booked = await prisma.bookingRequest.findMany({
    where: {
      status: { in: [BookingStatus.NEW, BookingStatus.CONFIRMED, BookingStatus.RESCHEDULE_REQUESTED] },
      scheduledStart: { gte: rangeStart, lt: rangeEnd },
    },
    select: { scheduledStart: true },
  }).catch(() => [])
  const bookedKeys = new Set(booked.map((b) => b.scheduledStart.toISOString()))

  const now = new Date()
  const minStart = addMinutes(now, (settings.minimumNoticeHours || 4) * 60)
  const output: PublicBookingDay[] = []

  for (let i = 0; i < lookaheadDays; i++) {
    const date = new Date(base)
    date.setDate(base.getDate() + i)
    const dow = date.getDay()
    const dayRules = rules.filter((r) => r.dayOfWeek === dow)
    const slots: PublicBookingSlot[] = []

    for (const rule of dayRules) {
      let cursor = atLocalTime(date, rule.startTime)
      const endOfRule = atLocalTime(date, rule.endTime)
      const minutes = Math.max(15, rule.slotMinutes || 60)

      while (addMinutes(cursor, minutes) <= endOfRule) {
        const end = addMinutes(cursor, minutes)
        if (cursor >= minStart && !bookedKeys.has(cursor.toISOString())) {
          slots.push({ start: cursor.toISOString(), end: end.toISOString(), label: labelFor(cursor, end) })
        }
        cursor = end
      }
    }

    output.push({
      date: dateKey(date),
      dayLabel: new Intl.DateTimeFormat('en', { weekday: 'short', month: 'short', day: 'numeric' }).format(date),
      slots,
    })
  }

  return { settings, days: output }
}

export async function assertSlotAvailable(slotStartIso: string, slotEndIso?: string) {
  const slotStart = new Date(slotStartIso)
  if (Number.isNaN(slotStart.getTime())) throw new Error('Invalid slot')
  const slotEnd = slotEndIso ? new Date(slotEndIso) : addMinutes(slotStart, 60)
  if (Number.isNaN(slotEnd.getTime()) || slotEnd <= slotStart) throw new Error('Invalid slot')

  const settings = await getBookingSettings()
  if (slotStart < addMinutes(new Date(), (settings.minimumNoticeHours || 4) * 60)) throw new Error('Selected slot is too soon')

  const generated = await generateBookingSlots(dateKey(slotStart), 1)
  const valid = generated.days[0]?.slots.some((slot) => slot.start === slotStart.toISOString())
  if (!valid) throw new Error('Selected slot is no longer available')

  const existing = await prisma.bookingRequest.findFirst({
    where: {
      scheduledStart: slotStart,
      status: { in: [BookingStatus.NEW, BookingStatus.CONFIRMED, BookingStatus.RESCHEDULE_REQUESTED] },
    },
    select: { id: true },
  })
  if (existing) throw new Error('Selected slot is already booked')

  return { slotStart, slotEnd }
}
