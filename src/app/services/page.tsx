import Link from 'next/link'
import { PremiumPageHero } from '@/components/PremiumPageHero'
import { niches } from '@/lib/niches'

const services = [
  ['Website Development & Redesign', 'Premium 3–5 page business websites and redesigns built around clear CTAs, mobile speed, and lead capture.'],
  ['Landing Pages', 'Focused pages for specific offers, niches, or campaigns with conversion tracking and enquiry flow.'],
  ['Lead Generation Setup', 'Lead capture forms, tracking, notifications, and simple reporting to reduce missed opportunities.'],
  ['CRM / Pipeline Setup', 'A clean pipeline for enquiries, qualification, follow-up, appointments, and outcomes.'],
  ['WhatsApp, Email & SMS Follow-Up', 'Instant response and multi-day sequences for new leads, old leads, reminders, and reactivation.'],
  ['Appointment Booking Systems', 'Booking pages, confirmations, reminders, internal alerts, and no-show reduction flows.'],
  ['Monthly Optimization', 'Website edits, automation monitoring, reporting, offer updates, and conversion improvements after launch.'],
]

export default function ServicesPage() {
  return (
    <main className="bg-[#f7f9fb] text-slate-950">
      <PremiumPageHero
        eyebrow="Services"
        title="Everything needed to turn enquiries into booked appointments."
        description="We connect the full growth flow: website, landing pages, lead capture, CRM, follow-up automation, appointment booking, reminders, and reporting."
        primaryHref="/audit"
        primaryLabel="Request Free Audit"
        secondaryHref="/pricing"
        secondaryLabel="View Packages"
        points={['Website', 'Lead Capture', 'CRM', 'Follow-Up', 'Booking', 'Reporting']}
      />

      <section className="px-6 py-24 lg:px-10 xl:px-16">
        <div className="mx-auto max-w-[1480px]">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {services.map(([title, desc]) => <div key={title} className="group rounded-[1.5rem] border border-slate-200 bg-white p-7 shadow-[0_16px_50px_rgba(15,23,42,0.04)] transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_24px_70px_rgba(37,99,235,0.10)]"><span className="material-symbols-outlined rounded-2xl bg-blue-50 p-3 text-blue-600">deployed_code</span><h2 className="mt-5 text-xl font-semibold tracking-[-0.02em]">{title}</h2><p className="mt-3 leading-7 text-slate-600">{desc}</p></div>)}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-24 lg:px-10 xl:px-16">
        <div className="mx-auto mb-12 max-w-[1480px]">
          <div className="mb-8 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-600">Industries we support</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">See how the system applies to your niche.</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {niches.map((niche) => <Link key={niche.slug} href={`/industries/${niche.slug}`} className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-bold text-slate-800 transition-all hover:border-blue-200 hover:bg-white hover:text-blue-700">{niche.label}</Link>)}
          </div>
        </div>
        <div className="mx-auto max-w-[1480px] rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-white shadow-[0_24px_80px_rgba(15,23,42,0.12)] md:p-12">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-300">Leak-proof flow</p>
          <h2 className="mt-4 max-w-5xl text-3xl font-semibold tracking-[-0.03em] md:text-5xl">Traffic → Landing Page → Lead Capture → Instant Response → Qualification → Booking → Reminder → Follow-Up → Reporting</h2>
          <p className="mt-6 max-w-3xl leading-8 text-slate-300">This is the operating system we build around your offer so leads do not depend on luck, memory, or scattered tools.</p>
          <Link href="/audit" className="mt-8 inline-flex rounded-full bg-blue-600 px-6 py-4 text-sm font-bold text-white hover:bg-blue-700">Request Audit</Link>
        </div>
      </section>
    </main>
  )
}
