import { google } from 'googleapis'
import type { BookingRequest } from '@prisma/client'

export type GoogleMeetResult = { eventId: string; meetLink: string | null; htmlLink: string | null }

function hasGoogleCalendarConfig() {
  return Boolean(
    process.env.GOOGLE_CALENDAR_CLIENT_ID &&
    process.env.GOOGLE_CALENDAR_CLIENT_SECRET &&
    process.env.GOOGLE_CALENDAR_REFRESH_TOKEN &&
    process.env.GOOGLE_CALENDAR_ID
  )
}

export function isGoogleCalendarEnabled() {
  return hasGoogleCalendarConfig()
}

function getCalendarClient() {
  if (!hasGoogleCalendarConfig()) return null

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CALENDAR_CLIENT_ID,
    process.env.GOOGLE_CALENDAR_CLIENT_SECRET
  )

  oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_CALENDAR_REFRESH_TOKEN })
  return google.calendar({ version: 'v3', auth: oauth2Client })
}

function buildDescription(booking: BookingRequest) {
  return [
    `Booking ID: ${booking.bookingId}`,
    `Business: ${booking.businessName}`,
    `Name: ${booking.fullName}`,
    `Email: ${booking.email}`,
    booking.whatsapp ? `WhatsApp: ${booking.whatsapp}` : null,
    booking.country ? `Country: ${booking.country}` : null,
    booking.industry ? `Industry: ${booking.industry}` : null,
    booking.websiteUrl ? `Website: ${booking.websiteUrl}` : null,
    booking.instagramUrl ? `Instagram: ${booking.instagramUrl}` : null,
    booking.linkedinUrl ? `LinkedIn: ${booking.linkedinUrl}` : null,
    booking.googleBusinessUrl ? `Google Business: ${booking.googleBusinessUrl}` : null,
    booking.schedulerUrl ? `Existing scheduler: ${booking.schedulerUrl}` : null,
    booking.currentLeadSources ? `Current lead sources: ${booking.currentLeadSources}` : null,
    booking.mainProblem ? `Main problem: ${booking.mainProblem}` : null,
    booking.monthlyLeadVolumeRange ? `Monthly leads: ${booking.monthlyLeadVolumeRange}` : null,
    booking.preferredPackageInterest ? `Package interest: ${booking.preferredPackageInterest}` : null,
  ].filter(Boolean).join('\n')
}

export async function createGoogleMeetForBooking(booking: BookingRequest): Promise<GoogleMeetResult | null> {
  const calendar = getCalendarClient()
  if (!calendar) return null

  const calendarId = process.env.GOOGLE_CALENDAR_ID!
  const timezone = booking.timezone || process.env.GOOGLE_CALENDAR_TIMEZONE || 'Africa/Lagos'
  const requestId = `ozzi-${booking.bookingId}`.toLowerCase().replace(/[^a-z0-9-]/g, '-')

  const event = await calendar.events.insert({
    calendarId,
    conferenceDataVersion: 1,
    sendUpdates: process.env.GOOGLE_CALENDAR_SEND_UPDATES || 'all',
    requestBody: {
      summary: `Strategy Call — ${booking.businessName}`,
      description: buildDescription(booking),
      start: { dateTime: booking.scheduledStart.toISOString(), timeZone: timezone },
      end: { dateTime: booking.scheduledEnd.toISOString(), timeZone: timezone },
      attendees: [
        { email: booking.email, displayName: booking.fullName },
        ...(process.env.GOOGLE_CALENDAR_HOST_EMAIL ? [{ email: process.env.GOOGLE_CALENDAR_HOST_EMAIL }] : []),
      ],
      reminders: { useDefault: true },
      conferenceData: {
        createRequest: {
          requestId,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
    },
  })

  const data = event.data
  return {
    eventId: data.id || '',
    meetLink: data.hangoutLink || data.conferenceData?.entryPoints?.find((entry) => entry.entryPointType === 'video')?.uri || null,
    htmlLink: data.htmlLink || null,
  }
}
