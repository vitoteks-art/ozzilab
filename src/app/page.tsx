import Link from 'next/link'
import { PublicStats } from '@/components/PublicStats'

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative pt-24 pb-32 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-3 px-3 py-1 bg-slate-100 rounded-full mb-8">
              <span className="flex size-2 rounded-full bg-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Business Systems Architecture</span>
            </div>
            <h1 className="font-serif text-5xl lg:text-7xl leading-[1.1] text-slate-900 mb-8">
              General Business Automation for <span className="italic text-primary">growth-focused</span> teams.
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed mb-10 max-w-2xl">
              We automate lead capture, qualification, follow-up, and internal workflows—so revenue doesn’t depend on manual effort.
            </p>
            <div className="flex flex-wrap gap-4 mb-12">
              <Link
                href="/audit"
                className="bg-primary text-white px-8 py-4 rounded-lg font-bold text-base hover:shadow-xl hover:shadow-primary/20 transition-all"
              >
                Request Audit
              </Link>
              <Link
                href="/library"
                className="bg-white border border-border-subtle text-slate-900 px-8 py-4 rounded-lg font-bold text-base hover:bg-slate-50 transition-all"
              >
                Explore Library
              </Link>
            </div>
            <div className="flex items-center gap-6 text-sm font-medium text-slate-400">
              <span>Qualification</span>
              <span className="size-1 bg-slate-300 rounded-full" />
              <span>Follow-up</span>
              <span className="size-1 bg-slate-300 rounded-full" />
              <span>Pipeline Management</span>
            </div>

            {/* Public stats */}
            <PublicStats />
          </div>

          <div className="lg:col-span-5 relative">
            <div className="aspect-[4/5] bg-background-surface rounded-2xl border border-border-subtle overflow-hidden shadow-2xl relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Modern minimal office"
                className="w-full h-full object-cover grayscale-[0.5] hover:grayscale-0 transition-all duration-700"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAuOD945FBQkNDRsm3N5UNyTpWsFGZd40XOuN-S53gYiti295CBkqSEyfl0aof8AsI5lFaQ5ZbMZOlyStGFDu1dUU2dZDDMQJCEh_rKMmLTjpRNiwD-81d28QXrZhU7zgKb9wzt9I5WV54PG72XNiS4DdjibX3igBOoa4Q_jB22v4ZkAfQ82dca_vgGyh4vXciANN1tKSoaC9nKBZNkhLMVHrHrVV6-LkKmZpekoalTcdgXocyKO-yi1drBR4CKLudmeWLSNxYBm0Ga"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-32 px-6 lg:px-12 bg-background-surface">
        <div className="max-w-7xl mx-auto">
          <div className="h-px bg-border-subtle w-full mb-12" />
          <div className="grid lg:grid-cols-2 gap-20">
            <div>
              <h2 className="font-serif text-4xl lg:text-5xl text-slate-900 mb-6">Where revenue leaks happen</h2>
              <p className="text-lg text-slate-500 max-w-md">
                Invisible friction points in your workflow are costing you qualified opportunities every day.
              </p>
            </div>
            <div className="space-y-4">
              {[
                'Slow response times that kill lead momentum',
                'Unqualified leads clogging your sales pipeline',
                'Manual data entry errors leading to lost info',
                'Inconsistent follow-up with potential buyers',
                'Fragmented and siloed internal workflows',
              ].map((t, i) => (
                <div
                  key={t}
                  className="flex items-center gap-6 p-6 bg-white border border-border-subtle rounded-xl hover:border-primary transition-colors"
                >
                  <span className="text-primary font-serif text-2xl italic opacity-50">{String(i + 1).padStart(2, '0')}</span>
                  <p className="text-lg font-medium text-slate-800">{t}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Service Pillars */}
      <section className="py-32 px-6 lg:px-12 max-w-7xl mx-auto" id="services">
        <div className="text-center mb-20">
          <h2 className="font-serif text-4xl lg:text-5xl text-slate-900 mb-4">Core Automation Pillars</h2>
          <div className="h-1 w-20 bg-primary mx-auto" />
        </div>
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
          {[
            { title: 'Business Automation', desc: 'Core operational workflows and integrations.' },
            { title: 'WhatsApp Automation', desc: 'Automated messaging and conversational flows.' },
            { title: 'Email Automation', desc: 'Nurture + transactional sequences that convert.' },
            { title: 'Lead Gen Automation', desc: 'Qualification loops and funnel optimization.' },
          ].map((p) => (
            <div key={p.title} className="p-8 bg-background-surface border border-border-subtle rounded-xl flex flex-col items-center text-center">
              <span className="material-symbols-outlined text-4xl text-slate-400 mb-6 font-light">hub</span>
              <h3 className="font-bold text-slate-900 mb-2">{p.title}</h3>
              <p className="text-sm text-slate-500">{p.desc}</p>
            </div>
          ))}
          <Link
            href="/audit"
            className="p-8 bg-primary border border-primary rounded-xl flex flex-col items-center text-center text-white shadow-xl shadow-primary/20"
          >
            <span className="material-symbols-outlined text-4xl text-white mb-6 font-light">troubleshoot</span>
            <h3 className="font-bold mb-2">Lead Audit</h3>
            <p className="text-sm text-white/80">Our signature diagnostic and planning service.</p>
          </Link>
        </div>
      </section>

      {/* Process */}
      <section className="py-32 px-6 lg:px-12 bg-slate-900 text-white overflow-hidden relative" id="process">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-20 items-start">
            <div className="lg:w-1/3 lg:sticky lg:top-32">
              <h2 className="font-serif text-4xl lg:text-5xl mb-8 leading-tight">Our architectural process.</h2>
              <p className="text-slate-400 text-lg">Audit → (Approved) Intake → Build/Improve.</p>
            </div>
            <div className="lg:w-2/3 space-y-16 relative">
              {[
                { step: '01', title: 'Request Audit', desc: 'We diagnose your bottlenecks and data silos.' },
                { step: '02', title: 'Review + Plan', desc: 'You get a custom automation blueprint tailored to your stack.' },
                { step: '03', title: 'Implementation Intake', desc: 'Invite-only intake to capture specs, assets, and requirements.' },
                { step: '04', title: 'Build + Optimize', desc: 'We ship the system and iterate until it’s airtight.' },
              ].map((s) => (
                <div key={s.step} className="relative">
                  <span className="text-primary font-bold tracking-widest text-xs uppercase mb-4 block">Step {s.step}</span>
                  <h4 className="text-2xl font-bold mb-4">{s.title}</h4>
                  <p className="text-slate-400 leading-relaxed text-lg">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 lg:px-12 border-t border-border-subtle bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-5xl lg:text-7xl text-slate-900 mb-12 leading-tight">
            Ready to reclaim your <span className="italic text-primary">revenue efficiency</span>?
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <Link
              href="/audit"
              className="bg-primary text-white px-10 py-5 rounded-lg font-bold text-lg hover:bg-blue-700 transition-all w-full md:w-auto"
            >
              Request Audit
            </Link>
            <Link
              href="/library"
              className="text-slate-600 font-bold border-b-2 border-slate-200 hover:border-primary transition-all pb-1"
            >
              Explore Library
            </Link>
          </div>
          <p className="mt-12 text-slate-400 text-sm">No spam. If you’re approved, you’ll receive an invite-only intake link.</p>
        </div>
      </section>
    </main>
  )
}
