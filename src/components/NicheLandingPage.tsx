import Link from 'next/link'
import type { Niche } from '@/lib/niches'

function AuditLink({ niche, children, className }: { niche: Niche; children: React.ReactNode; className: string }) {
  return <Link href={`/audit?industry=${niche.slug}`} data-niche={niche.slug} data-cta="audit" className={className}>{children}</Link>
}

function BookLink({ niche, children, className }: { niche: Niche; children: React.ReactNode; className: string }) {
  return <Link href={`/book?industry=${niche.slug}`} data-niche={niche.slug} data-cta="book-call" className={className}>{children}</Link>
}

export function NicheLandingPage({ niche }: { niche: Niche }) {
  return (
    <main className="bg-[#f7f9fb] text-slate-950" data-niche={niche.slug}>
      <section className="relative overflow-hidden border-b border-slate-200/70 bg-white px-6 py-20 lg:px-10 xl:px-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.14),transparent_34%),linear-gradient(180deg,#ffffff_0%,#f7f9fb_100%)]" />
        <div className="relative mx-auto grid max-w-[1480px] items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
              <span className="material-symbols-outlined text-[16px]">verified</span>{niche.eyebrow}
            </div>
            <h1 className="mt-6 max-w-5xl text-4xl font-semibold leading-[1.03] tracking-[-0.045em] text-slate-950 md:text-6xl">{niche.headline}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">{niche.subheadline}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <AuditLink niche={niche} className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-4 text-sm font-bold text-white shadow-[0_16px_40px_rgba(37,99,235,0.24)] transition-all hover:-translate-y-0.5 hover:bg-blue-700">Request Free Lead Audit<span className="material-symbols-outlined ml-2 text-lg">arrow_forward</span></AuditLink>
              <BookLink niche={niche} className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-4 text-sm font-bold text-slate-900 shadow-sm transition-all hover:border-blue-200 hover:text-blue-700 hover:shadow-md">Book Strategy Call</BookLink>
            </div>
            <p className="mt-6 text-sm font-semibold text-slate-500">{niche.trust}</p>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-3 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
            <div className="rounded-[1.4rem] bg-slate-950 p-6 text-white">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-300">Niche flow</p><h2 className="mt-2 text-2xl font-semibold tracking-[-0.02em]">Lead-to-appointment system</h2></div>
                <span className="material-symbols-outlined rounded-2xl bg-white/10 p-3 text-blue-200">conversion_path</span>
              </div>
              <div className="mt-6 grid gap-3">
                {niche.flow.slice(0, 7).map((step, i) => <div key={step} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3"><span className="text-sm font-bold text-slate-100">{step}</span><span className="text-xs font-bold text-slate-500">{String(i + 1).padStart(2, '0')}</span></div>)}
              </div>
              <p className="mt-5 rounded-2xl bg-blue-600/15 px-4 py-3 text-sm font-semibold text-blue-100">Leak points identified before setup.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-24 lg:px-10 xl:px-16">
        <div className="mx-auto grid max-w-[1480px] gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div><p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-600">Lead leakage</p><h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-slate-950">Where {niche.label.toLowerCase()} lose enquiries.</h2><p className="mt-5 leading-8 text-slate-600">Most businesses do not lose prospects because nobody is interested. They lose them when response, qualification, booking, reminders, and follow-up are not connected.</p></div>
          <div className="grid gap-4 md:grid-cols-2">{niche.problems.map((problem, i) => <div key={problem} className="rounded-[1.3rem] border border-slate-200 bg-slate-50 p-5"><span className="text-xs font-bold text-blue-600">{String(i + 1).padStart(2, '0')}</span><p className="mt-3 font-semibold leading-7 text-slate-900">{problem}</p></div>)}</div>
        </div>
      </section>

      <section className="px-6 py-24 lg:px-10 xl:px-16">
        <div className="mx-auto max-w-[1480px]"><div className="mb-10 max-w-3xl"><p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-600">System flow</p><h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">A practical flow built for this niche.</h2></div><div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">{niche.flow.map((step, i) => <div key={step} className="rounded-[1.2rem] border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.04)]"><span className="text-xs font-bold text-blue-600">Step {i + 1}</span><p className="mt-3 font-semibold text-slate-950">{step}</p></div>)}</div></div>
      </section>

      <section className="bg-white px-6 py-24 lg:px-10 xl:px-16">
        <div className="mx-auto max-w-[1480px]"><div className="mb-10 max-w-3xl"><p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-600">Services</p><h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">Services that matter most for {niche.label.toLowerCase()}.</h2></div><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">{niche.services.map((service) => <div key={service} className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.04)]"><span className="material-symbols-outlined rounded-2xl bg-blue-50 p-3 text-blue-600">check_circle</span><h3 className="mt-5 text-lg font-semibold tracking-[-0.02em]">{service}</h3></div>)}</div></div>
      </section>

      <section className="px-6 py-24 lg:px-10 xl:px-16">
        <div className="mx-auto grid max-w-[1480px] gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-[2rem] bg-slate-950 p-8 text-white md:p-10"><p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-300">Recommended package</p><h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">{niche.recommendedPackage}</h2><p className="mt-5 leading-8 text-slate-300">The audit confirms the right path, but this is the most likely package fit based on the niche’s lead and appointment flow.</p><AuditLink niche={niche} className="mt-8 inline-flex rounded-full bg-blue-600 px-6 py-4 text-sm font-bold text-white hover:bg-blue-700">Request Audit to Confirm Best Package</AuditLink></div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 md:p-10"><h3 className="text-2xl font-semibold tracking-[-0.03em]">Other possible fits</h3><div className="mt-6 grid gap-3">{niche.supportingPackages.map((pkg) => <div key={pkg} className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 font-semibold text-slate-800">{pkg}</div>)}</div></div>
        </div>
      </section>

      <section className="bg-white px-6 py-24 lg:px-10 xl:px-16">
        <div className="mx-auto grid max-w-[1480px] gap-10 lg:grid-cols-[0.9fr_1.1fr]"><div><p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-600">Audit checklist</p><h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">What the free audit checks.</h2><p className="mt-5 leading-8 text-slate-600">We look for practical conversion leaks, not vanity design comments.</p></div><div className="grid gap-3 md:grid-cols-2">{niche.auditChecks.map((item) => <div key={item} className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"><span className="material-symbols-outlined text-blue-600">done</span><span className="font-semibold text-slate-800">{item}</span></div>)}</div></div>
      </section>

      <section className="px-6 py-24 lg:px-10 xl:px-16"><div className="mx-auto grid max-w-[1480px] gap-8 lg:grid-cols-2"><div className="rounded-[2rem] border border-slate-200 bg-white p-8 md:p-10"><p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-600">Workflow clarity</p><h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em]">Practical assets for a clearer lead-to-appointment system.</h2><p className="mt-5 leading-8 text-slate-600">We focus on the operating pieces that help enquiries move from first contact to qualified booking with less leakage.</p></div><div className="grid gap-3">{niche.proof.map((item) => <div key={item} className="rounded-2xl border border-slate-200 bg-white px-5 py-4 font-semibold text-slate-800 shadow-sm">{item}</div>)}</div></div></section>

      <section className="bg-white px-6 py-24 lg:px-10 xl:px-16"><div className="mx-auto grid max-w-[1480px] gap-6 lg:grid-cols-2"><div className="rounded-[2rem] border border-emerald-200 bg-emerald-50 p-8"><h2 className="text-2xl font-semibold text-emerald-950">Good fit</h2><ul className="mt-5 space-y-3 text-emerald-900"><li>Appointment-driven business</li><li>Clear service offer</li><li>Leads already exist or lead generation is planned</li><li>Willing to improve follow-up and booking</li><li>Enough client value to justify a proper system</li></ul></div><div className="rounded-[2rem] border border-amber-200 bg-amber-50 p-8"><h2 className="text-2xl font-semibold text-amber-950">Not fit</h2><ul className="mt-5 space-y-3 text-amber-900"><li>Looking for guaranteed instant sales</li><li>No clear offer</li><li>Not willing to respond to leads</li><li>Wants only the cheapest website</li><li>Not ready to provide basic business information</li></ul></div></div></section>

      <section className="px-6 py-24 lg:px-10 xl:px-16"><div className="mx-auto max-w-[1100px]"><div className="mb-10 text-center"><p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-600">FAQ</p><h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">Common questions from {niche.label.toLowerCase()}.</h2></div><div className="grid gap-4">{niche.faqs.map((faq) => <div key={faq.q} className="rounded-[1.4rem] border border-slate-200 bg-white p-6 shadow-sm"><h3 className="font-semibold text-slate-950">{faq.q}</h3><p className="mt-3 leading-7 text-slate-600">{faq.a}</p></div>)}</div></div></section>

      <section className="bg-slate-950 px-6 py-24 text-white lg:px-10 xl:px-16"><div className="mx-auto max-w-4xl text-center"><h2 className="text-4xl font-semibold tracking-[-0.04em] md:text-5xl">Request a Free Lead & Appointment-Leak Audit.</h2><p className="mt-5 text-lg leading-8 text-slate-300">We’ll review the {niche.label.toLowerCase()} lead flow and identify where enquiries are leaking before they become appointments.</p><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><AuditLink niche={niche} className="rounded-full bg-blue-600 px-6 py-4 font-bold text-white hover:bg-blue-700">Request Free Lead Audit</AuditLink><BookLink niche={niche} className="rounded-full border border-white/15 px-6 py-4 font-bold text-white hover:bg-white/10">Book Strategy Call</BookLink></div></div></section>
    </main>
  )
}
