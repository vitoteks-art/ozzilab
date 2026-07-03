import Link from 'next/link'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

const statusClass: Record<string, string> = {
  NEW: 'bg-blue-50 text-blue-700 border-blue-100',
  CONFIRMED: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  RESCHEDULE_REQUESTED: 'bg-amber-50 text-amber-700 border-amber-100',
  COMPLETED: 'bg-slate-100 text-slate-700 border-slate-200',
  CANCELLED: 'bg-red-50 text-red-700 border-red-100',
}

export default async function AdminBookingsPage() {
  const bookings = await prisma.bookingRequest.findMany({ orderBy: { createdAt: 'desc' }, take: 250 })

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Bookings</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Strategy call bookings</h1>
          <p className="mt-2 text-slate-500">Review, qualify, and update Ozzi booking requests.</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-4">Booking</th>
                <th className="px-5 py-4">Lead</th>
                <th className="px-5 py-4">Business</th>
                <th className="px-5 py-4">Meeting</th>
                <th className="px-5 py-4">Scheduled</th>
                <th className="px-5 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-4 font-semibold text-primary"><Link href={`/admin/bookings/${booking.bookingId}`}>{booking.bookingId}</Link></td>
                  <td className="px-5 py-4"><div className="font-semibold text-slate-900">{booking.fullName}</div><div className="text-slate-500">{booking.email}</div></td>
                  <td className="px-5 py-4"><div className="font-semibold text-slate-900">{booking.businessName}</div><div className="text-slate-500">{booking.country || booking.industry || '-'}</div></td>
                  <td className="px-5 py-4 text-slate-600">{booking.meetingType}</td>
                  <td className="px-5 py-4 text-slate-600">{booking.scheduledStart.toLocaleString()}</td>
                  <td className="px-5 py-4"><span className={`rounded-full border px-3 py-1 text-xs font-bold ${statusClass[booking.status] || statusClass.NEW}`}>{booking.status.replaceAll('_', ' ')}</span></td>
                </tr>
              ))}
              {!bookings.length ? <tr><td className="px-5 py-10 text-center text-slate-500" colSpan={6}>No bookings yet.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
