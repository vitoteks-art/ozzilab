import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { BookingActions } from './BookingActions'

export const dynamic = 'force-dynamic'

function Row({ label, value }: { label: string; value?: string | null }) {
  return <div className="rounded-lg bg-slate-50 px-4 py-3"><div className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</div><div className="mt-1 break-words text-sm font-semibold text-slate-800">{value || '-'}</div></div>
}

export default async function BookingDetailPage({ params }: { params: Promise<{ bookingId: string }> }) {
  const { bookingId } = await params
  const booking = await prisma.bookingRequest.findUnique({ where: { bookingId } })
  if (!booking) notFound()

  return (
    <div className="p-6 lg:p-8">
      <Link href="/admin/bookings" className="text-sm font-semibold text-primary">← Back to bookings</Link>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{booking.bookingId}</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">{booking.businessName}</h1>
            <p className="mt-2 text-slate-500">{booking.meetingType} · {booking.scheduledStart.toLocaleString()}</p>
            {booking.googleMeetLink ? <a href={booking.googleMeetLink} target="_blank" rel="noreferrer" className="mt-5 inline-flex rounded-lg bg-emerald-600 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-700">Open Google Meet</a> : <p className="mt-5 rounded-lg bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">Google Meet link not created yet. Configure Google Calendar env vars to auto-generate meeting links.</p>}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-950">Lead details</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <Row label="Name" value={booking.fullName} />
              <Row label="Email" value={booking.email} />
              <Row label="WhatsApp" value={booking.whatsapp} />
              <Row label="Country" value={booking.country} />
              <Row label="Industry" value={booking.industry} />
              <Row label="Monthly leads" value={booking.monthlyLeadVolumeRange} />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-950">Links & context</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <Row label="Website" value={booking.websiteUrl} />
              <Row label="Instagram" value={booking.instagramUrl} />
              <Row label="LinkedIn" value={booking.linkedinUrl} />
              <Row label="YouTube" value={booking.youtubeUrl} />
              <Row label="Google Business" value={booking.googleBusinessUrl} />
              <Row label="Scheduler" value={booking.schedulerUrl} />
              <div className="md:col-span-2"><Row label="Current lead sources" value={booking.currentLeadSources} /></div>
              <div className="md:col-span-2"><Row label="Main problem" value={booking.mainProblem} /></div>
              <Row label="Readiness" value={booking.budgetReadiness} />
              <Row label="Package interest" value={booking.preferredPackageInterest} />
              <Row label="Google Calendar Event" value={booking.googleCalendarEventId} />
              <Row label="Google Meet" value={booking.googleMeetLink} />
            </div>
          </div>
        </div>
        <BookingActions bookingId={booking.bookingId} initialStatus={booking.status} initialNotes={booking.internalNotes} />
      </div>
    </div>
  )
}
