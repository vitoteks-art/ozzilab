import type { Metadata } from 'next'
import Link from 'next/link'
import { PremiumPageHero } from '@/components/PremiumPageHero'
import { portfolioProjects } from '@/lib/projects'

export const metadata: Metadata = {
  title: 'Projects & Work | OZZILAB by Vitotek Systems',
  description: 'Selected Vitotek/OZZILAB projects across AI platforms, websites, automation systems, real estate, healthcare, ministry, and enterprise operations.',
}

export default function ProjectsPage() {
  return (
    <main className="bg-[#f7f9fb] text-slate-950">
      <PremiumPageHero
        eyebrow="Projects"
        title="Proof of execution across websites, AI systems, and automation."
        description="A selected portfolio of Vitotek and OZZILAB work — from AI creative platforms and premium websites to appointment, visitor, and operational systems."
        primaryHref="/audit"
        primaryLabel="Request Free Audit"
        secondaryHref="/book"
        secondaryLabel="Book Strategy Call"
        points={['AI Platforms', 'Websites', 'Automation', 'Dashboards', 'Booking', 'Operations']}
      />

      <section className="px-6 py-24 lg:px-10 xl:px-16">
        <div className="mx-auto max-w-[1480px]">
          <div className="mb-12 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-600">Selected work</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">Built for clarity, conversion, and operational usefulness.</h2>
            </div>
            <p className="max-w-3xl text-lg leading-8 text-slate-600 lg:pt-10">These projects show the kind of execution behind OZZILAB: premium positioning, practical workflows, conversion-focused pages, admin visibility, and business systems that support real operations after launch.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {portfolioProjects.map((project) => (
              <article key={project.title} className="group flex h-full flex-col overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.05)] transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_28px_90px_rgba(37,99,235,0.10)]">
                <div className="relative aspect-[4/3] overflow-hidden border-b border-slate-200 bg-slate-950">
                  {project.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={project.image} alt={`${project.title} project preview`} className="h-full w-full object-contain p-2 transition duration-700 group-hover:scale-[1.02]" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.45),transparent_35%),linear-gradient(135deg,#0f172a,#1e293b)] p-8 text-center">
                      <div>
                        <span className="material-symbols-outlined text-5xl text-blue-200">auto_awesome</span>
                        <p className="mt-4 text-sm font-bold uppercase tracking-[0.22em] text-blue-200">OZZILAB project</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">{project.category}</p>
                  <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-slate-950">{project.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">{project.summary}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.tags.map((tag) => <span key={tag} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600">{tag}</span>)}
                  </div>
                  <div className="mt-6 rounded-2xl bg-blue-50 p-4 text-sm font-semibold leading-6 text-blue-950">
                    {project.outcome}
                  </div>
                  {project.websiteUrl ? (
                    <Link href={project.websiteUrl} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex w-fit items-center rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-bold text-blue-700 transition-all hover:border-blue-300 hover:bg-blue-50">
                      Visit website
                      <span className="material-symbols-outlined ml-2 text-base">open_in_new</span>
                    </Link>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-24 lg:px-10 xl:px-16">
        <div className="mx-auto grid max-w-[1480px] gap-8 rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-white shadow-[0_24px_80px_rgba(15,23,42,0.12)] md:p-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-300">Your project next</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] md:text-5xl">Want your lead flow reviewed before building?</h2>
            <p className="mt-5 max-w-3xl leading-8 text-slate-300">Start with a free lead and appointment-leak audit. We’ll identify the biggest gaps before recommending a website, landing page, automation, booking, or growth system.</p>
          </div>
          <div className="flex flex-col justify-center gap-3 lg:items-end">
            <Link href="/audit" className="inline-flex w-full justify-center rounded-full bg-blue-600 px-6 py-4 text-sm font-bold text-white hover:bg-blue-700 lg:w-auto">Request Free Audit</Link>
            <Link href="/book" className="inline-flex w-full justify-center rounded-full border border-white/15 px-6 py-4 text-sm font-bold text-white hover:bg-white/10 lg:w-auto">Book Strategy Call</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
