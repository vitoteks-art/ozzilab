import Link from 'next/link'
import { BrandLogo } from '@/components/BrandLogo'

const solutionLinks = [
  ['Services', '/services'],
  ['Pricing', '/pricing'],
  ['Industries', '/industries'],
  ['Projects', '/projects'],
  ['Growth System', '/services/website-lead-appointment-growth'],
]

const companyLinks = [
  ['About', '/about'],
  ['Resources', '/library'],
  ['Projects', '/projects'],
  ['Contact', '/contact'],
  ['Book Strategy Call', '/book'],
]

export function PublicFooter() {
  return (
    <footer className="relative overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.24),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(148,163,184,0.16),transparent_28%)]" />
      <div className="relative mx-auto max-w-[1480px] px-5 py-16 md:px-10 xl:px-16">
        <div className="grid gap-10 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.28)] backdrop-blur md:grid-cols-[1.25fr_0.75fr] md:p-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-300">Free audit</p>
            <h2 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight tracking-[-0.03em] md:text-5xl">Find the leaks between enquiries and booked appointments.</h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">We review your website, lead capture, response speed, follow-up, booking flow, reminders, and show-up process — then recommend the right growth system.</p>
          </div>
          <div className="flex flex-col justify-center gap-3 md:items-end">
            <Link href="/audit" className="inline-flex w-full items-center justify-center rounded-full bg-blue-600 px-6 py-4 text-sm font-bold text-white shadow-[0_16px_40px_rgba(37,99,235,0.30)] transition-all hover:-translate-y-0.5 hover:bg-blue-700 md:w-auto">
              Request Free Audit
              <span className="material-symbols-outlined ml-2 text-lg">arrow_forward</span>
            </Link>
            <Link href="/book" className="inline-flex w-full items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-4 text-sm font-bold text-white transition-all hover:bg-white/10 md:w-auto">Book Strategy Call</Link>
          </div>
        </div>

        <div className="grid gap-10 border-b border-white/10 py-14 md:grid-cols-[1.4fr_0.8fr_0.8fr_1fr]">
          <div>
            <BrandLogo framed />
            <p className="mt-6 max-w-md text-sm leading-7 text-slate-400">Premium website, lead generation, CRM, follow-up automation, appointment booking, and monthly optimization systems for appointment-driven businesses.</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {['Canada', 'United Kingdom', 'Australia', 'Remote delivery'].map((item) => <span key={item} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-slate-300">{item}</span>)}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Solutions</h3>
            <ul className="mt-5 space-y-3">
              {solutionLinks.map(([label, href]) => <li key={href}><Link className="text-sm font-semibold text-slate-300 transition-colors hover:text-white" href={href}>{label}</Link></li>)}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Company</h3>
            <ul className="mt-5 space-y-3">
              {companyLinks.map(([label, href]) => <li key={href}><Link className="text-sm font-semibold text-slate-300 transition-colors hover:text-white" href={href}>{label}</Link></li>)}
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <h3 className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Contact</h3>
            <a href="mailto:hello@ozzilab.cloud" className="mt-5 block text-sm font-bold text-white">hello@ozzilab.cloud</a>
            <p className="mt-3 text-sm leading-7 text-slate-400">For audit requests, package questions, or international service enquiries.</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-7 text-xs font-semibold text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} OZZILAB by Vitotek Systems. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-slate-300">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-300">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
