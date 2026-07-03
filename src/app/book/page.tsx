import { BookingClient } from './BookingClient'

export const metadata = {
  title: 'Book a Strategy Call | OZZILAB by Vitotek Systems',
  description: 'Book a lead and appointment growth strategy call with OZZILAB by Vitotek Systems.',
}

export default function BookPage() {
  return (
    <main className="bg-[#f7f9fb] text-slate-950">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1480px] px-6 py-16 lg:px-10 xl:px-16 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-600">Strategy booking</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.03em] text-slate-950 md:text-5xl">
              Book a Lead & Appointment Growth Strategy Call
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Choose a time to discuss your website, lead capture, CRM, follow-up, and appointment booking flow. Built for appointment-driven businesses in Canada, the UK, Australia, and similar markets.
            </p>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-[1480px] px-6 py-12 lg:px-10 xl:px-16 lg:py-16">
        <BookingClient />
      </section>
    </main>
  )
}
