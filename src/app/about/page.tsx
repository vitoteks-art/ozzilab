import Link from 'next/link'
import { PremiumPageHero } from '@/components/PremiumPageHero'

export default function AboutPage() {
  return (
    <main className="bg-[#f7f9fb] text-slate-950">
      <PremiumPageHero
        eyebrow="About"
        title="Remote delivery for international appointment-growth systems."
        description="OZZILAB by Vitotek Systems helps appointment-driven businesses improve the journey from traffic and enquiry to booked appointments using conversion-focused websites, CRM workflows, automation, and practical reporting."
        primaryHref="/audit"
        primaryLabel="Start With Audit"
        secondaryHref="/services"
        secondaryLabel="Explore Services"
        points={['Audit', 'Strategy', 'Build', 'Automate', 'Optimize', 'Report']}
      />
      <section className="px-6 py-24 lg:px-10 xl:px-16"><div className="mx-auto grid max-w-[1480px] gap-6 md:grid-cols-3"><div className="rounded-[1.5rem] border border-slate-200 bg-white p-7 shadow-[0_16px_50px_rgba(15,23,42,0.04)]"><h2 className="text-xl font-semibold">Process transparency</h2><p className="mt-3 leading-7 text-slate-600">We begin with an audit, identify leakage points, then recommend the right website, CRM, booking, and follow-up improvements.</p></div><div className="rounded-[1.5rem] border border-slate-200 bg-white p-7 shadow-[0_16px_50px_rgba(15,23,42,0.04)]"><h2 className="text-xl font-semibold">International markets</h2><p className="mt-3 leading-7 text-slate-600">The offer is positioned for Canada, UK, Australia, and similar appointment-driven markets.</p></div><div className="rounded-[1.5rem] border border-slate-200 bg-white p-7 shadow-[0_16px_50px_rgba(15,23,42,0.04)]"><h2 className="text-xl font-semibold">Data reassurance</h2><p className="mt-3 leading-7 text-slate-600">Audit details are used to assess fit and recommend next steps. No inflated guarantees and no spam systems.</p></div></div></section>
      <section className="bg-slate-950 px-6 py-20 text-white lg:px-10 xl:px-16"><div className="mx-auto max-w-4xl text-center"><h2 className="text-4xl font-semibold tracking-[-0.03em]">Start with the audit.</h2><p className="mt-5 text-slate-300">We’ll review your lead and appointment flow and respond within 24–48 hours.</p><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/audit" className="rounded-full bg-blue-600 px-6 py-4 font-semibold text-white">Request Audit</Link><Link href="/book" className="rounded-full border border-white/15 px-6 py-4 font-semibold text-white">Book Call</Link></div></div></section>
    </main>
  )
}
