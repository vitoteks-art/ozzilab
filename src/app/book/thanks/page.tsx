import Link from 'next/link'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function BookThanksPage({ searchParams }: { searchParams: Promise<{ bookingId?: string }> }) {
  const params = await searchParams
  const bookingId = params.bookingId
  const booking = bookingId ? await prisma.bookingRequest.findUnique({ where: { bookingId } }).catch(() => null) : null

  return (
    <main className="bg-[#f7f9fb] px-6 py-20 text-slate-950 lg:px-10 xl:px-16">
      <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-[0_10px_40px_rgba(15,23,42,0.06)] md:p-12">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <span className="material-symbols-outlined">check_circle</span>
        </div>
        <h1 className="mt-6 text-3xl font-semibold tracking-[-0.02em] md:text-4xl">Your strategy call request has been received</h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          We’ll review your website, lead capture, follow-up, and booking flow, then respond with confirmation or next steps within 24–48 hours.
        </p>
        {bookingId ? <p className="mt-6 rounded-lg bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">Booking reference: {bookingId}</p> : null}
        {booking?.googleMeetLink ? <a href={booking.googleMeetLink} target="_blank" rel="noreferrer" className="mt-4 inline-flex rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700">Join Google Meet</a> : null}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/pricing" className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50">View packages</Link>
          <Link href="/services" className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">Explore services</Link>
        </div>
      </div>
    </main>
  )
}
