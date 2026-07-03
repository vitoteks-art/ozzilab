import Link from 'next/link'
import { PremiumPageHero } from '@/components/PremiumPageHero'
import { niches } from '@/lib/niches'

export default function IndustriesPage() {
  return (
    <main className="bg-[#f7f9fb] text-slate-950">
      <PremiumPageHero
        eyebrow="Industries"
        title="Built for appointment-driven businesses with valuable enquiries."
        description="OZZILAB by Vitotek Systems focuses on businesses where every qualified enquiry can become a booked appointment, consultation, viewing, quote, or sales conversation."
        primaryHref="/audit"
        primaryLabel="Request Audit"
        secondaryHref="/book"
        secondaryLabel="Book Strategy Call"
        points={['Clinic', 'Consultant', 'Agency', 'Law Firm', 'Home Service', 'Training Centre']}
      />
      <section className="px-6 py-24 lg:px-10 xl:px-16">
        <div className="mx-auto max-w-[1480px]">
          <div className="mb-10 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-600">Niche landing pages</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">Choose your industry.</h2>
            <p className="mt-4 leading-8 text-slate-600">Each page explains the specific lead leakage points, system flow, package fit, and audit checklist for that niche.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {niches.map((niche) => (
              <Link key={niche.slug} href={`/industries/${niche.slug}`} className="group rounded-[1.5rem] border border-slate-200 bg-white p-7 shadow-[0_16px_50px_rgba(15,23,42,0.04)] transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_24px_70px_rgba(37,99,235,0.10)]">
                <span className="material-symbols-outlined rounded-2xl bg-blue-50 p-3 text-blue-600">business_center</span>
                <h2 className="mt-5 text-xl font-semibold tracking-[-0.02em]">{niche.label}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{niche.problems[0]}</p>
                <span className="mt-5 inline-flex text-sm font-bold text-blue-600 group-hover:text-blue-700">View industry page →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-slate-950 px-6 py-20 text-white lg:px-10 xl:px-16"><div className="mx-auto max-w-4xl text-center"><h2 className="text-4xl font-semibold tracking-[-0.03em]">Want to see your appointment leaks?</h2><p className="mt-5 text-slate-300">Request the free audit and we’ll review your website, lead capture, response, follow-up, and booking flow.</p><Link href="/audit" className="mt-8 inline-flex rounded-full bg-blue-600 px-6 py-4 font-semibold text-white">Request Free Audit</Link></div></section>
    </main>
  )
}
