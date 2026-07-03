import Link from 'next/link'

type PremiumPageHeroProps = {
  eyebrow: string
  title: string
  description: string
  primaryHref?: string
  primaryLabel?: string
  secondaryHref?: string
  secondaryLabel?: string
  points?: string[]
}

export function PremiumPageHero({ eyebrow, title, description, primaryHref = '/audit', primaryLabel = 'Request Free Audit', secondaryHref, secondaryLabel, points = [] }: PremiumPageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-slate-200/70 bg-white px-6 py-20 lg:px-10 xl:px-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.12),transparent_34%),linear-gradient(180deg,#ffffff_0%,#f7f9fb_100%)]" />
      <div className="relative mx-auto grid max-w-[1480px] items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            {eyebrow}
          </div>
          <h1 className="mt-6 max-w-5xl text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-slate-950 md:text-6xl">{title}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">{description}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={primaryHref} className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-4 text-sm font-bold text-white shadow-[0_16px_40px_rgba(37,99,235,0.24)] transition-all hover:-translate-y-0.5 hover:bg-blue-700">
              {primaryLabel}
              <span className="material-symbols-outlined ml-2 text-lg">arrow_forward</span>
            </Link>
            {secondaryHref && secondaryLabel ? <Link href={secondaryHref} className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-4 text-sm font-bold text-slate-900 shadow-sm transition-all hover:border-blue-200 hover:text-blue-700 hover:shadow-md">{secondaryLabel}</Link> : null}
          </div>
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-3 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <div className="rounded-[1.4rem] bg-slate-950 p-6 text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-300">System map</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.02em]">Lead → Appointment Flow</h2>
              </div>
              <span className="material-symbols-outlined rounded-2xl bg-white/10 p-3 text-blue-200">conversion_path</span>
            </div>
            <div className="mt-6 grid gap-3">
              {(points.length ? points : ['Traffic', 'Enquiry', 'Response', 'Qualification', 'Follow-Up', 'Booking']).map((point, index) => (
                <div key={point} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3">
                  <span className="text-sm font-bold text-slate-100">{point}</span>
                  <span className="text-xs font-bold text-slate-500">{String(index + 1).padStart(2, '0')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
