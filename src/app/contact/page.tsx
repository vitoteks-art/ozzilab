import Link from 'next/link'
import { PremiumPageHero } from '@/components/PremiumPageHero'

export default function ContactPage() {
  return (
    <main className="bg-[#f7f9fb] text-slate-950">
      <PremiumPageHero
        eyebrow="Contact"
        title="Talk to OZZILAB by Vitotek Systems about your appointment-growth system."
        description="For the fastest response, request the free audit or book a strategy call. You can also email us directly for service, pricing, or project questions."
        primaryHref="/audit"
        primaryLabel="Request Audit"
        secondaryHref="/book"
        secondaryLabel="Book Strategy Call"
        points={['Audit Request', 'Service Question', 'Pricing', 'Booking', 'Proposal', 'Delivery']}
      />
      <section className="px-6 py-24 lg:px-10 xl:px-16">
        <div className="mx-auto grid max-w-[1480px] gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_20px_70px_rgba(15,23,42,0.06)] md:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-600">Email</p>
            <a href="mailto:hello@ozzilab.cloud" className="mt-4 block text-2xl font-semibold tracking-[-0.02em] text-slate-950">hello@ozzilab.cloud</a>
            <p className="mt-5 leading-8 text-slate-600">Use this for partnership, audit, pricing, or implementation enquiries.</p>
          </div>
          <div className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-[0_24px_80px_rgba(15,23,42,0.12)] md:p-10">
            <h2 className="text-3xl font-semibold tracking-[-0.03em]">Best next step</h2>
            <p className="mt-4 max-w-2xl leading-8 text-slate-300">If you want us to review your current flow, start with the Lead & Appointment-Leak Audit. If you already know you need implementation, book a strategy call.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link href="/audit" className="rounded-full bg-blue-600 px-6 py-4 text-center font-semibold text-white">Request Audit</Link><Link href="/book" className="rounded-full border border-white/15 px-6 py-4 text-center font-semibold text-white">Book Strategy Call</Link></div>
          </div>
        </div>
      </section>
    </main>
  )
}
