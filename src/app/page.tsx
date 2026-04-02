import Image from 'next/image'
import Link from 'next/link'

const systemPillars = [
  {
    title: 'Content Production Systems',
    desc: 'Repeatable workflows for generating content assets, campaign angles, and publishing-ready material faster.',
  },
  {
    title: 'Social Media Execution',
    desc: 'Structured systems for planning, producing, and distributing posts across the channels that matter.',
  },
  {
    title: 'Qualification and Follow-Up',
    desc: 'Automated routing, messaging, reminders, and sales touchpoints that reduce lead leakage.',
  },
  {
    title: 'Operational Infrastructure',
    desc: 'Internal workflows, notifications, approvals, and delivery logic connected into one operating layer.',
  },
]

const frictionPoints = [
  'Leads arrive, but response time is inconsistent.',
  'Sales conversations start without qualification context.',
  'Follow-up depends on manual reminders and ad hoc effort.',
  'Appointment flow breaks between form, CRM, and messaging.',
  'The business grows, but operations stay fragile.',
]

const outcomes = [
  { label: 'Content production', manual: 'Ad hoc', system: 'Repeatable workflow' },
  { label: 'Social execution', manual: 'Inconsistent', system: 'Planned and structured' },
  { label: 'Follow-up', manual: 'Reactive', system: 'Sequenced automatically' },
  { label: 'Operations visibility', manual: 'Scattered', system: 'Centralized view' },
]

const buildSequence = [
  {
    step: '01',
    title: 'Diagnose the operating bottleneck',
    desc: 'We audit your content, distribution, conversion, and operations flow to identify where execution is breaking.',
  },
  {
    step: '02',
    title: 'Design the operating system',
    desc: 'We define the content workflow, channel execution model, automation logic, and implementation blueprint.',
  },
  {
    step: '03',
    title: 'Build the system stack',
    desc: 'We connect your content workflows, social execution, CRM, messaging, and internal operations into one delivery system.',
  },
  {
    step: '04',
    title: 'Stabilize and refine',
    desc: 'We test, optimize, and tighten the workflow so it performs under real operating conditions.',
  },
]

export default function HomePage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(16,98,229,0.12),_transparent_32%),linear-gradient(180deg,#f8fafc_0%,#eef4ff_100%)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-24 pb-24 lg:pt-28 lg:pb-28">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <div className="inline-flex items-center gap-3 rounded-full border border-primary/15 bg-white/80 px-4 py-2 mb-8 shadow-sm">
                <span className="flex size-2 rounded-full bg-primary" />
                <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-600">
                  Revenue Systems Architecture
                </span>
              </div>

              <h1 className="font-serif text-5xl lg:text-6xl leading-[1.04] tracking-[-0.03em] text-slate-950 max-w-3xl mb-8">
                Systems for content, operations, and growth.
              </h1>

              <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mb-10">
                Ozzilab designs and deploys systems for content creation, social media execution, qualification, follow-up, and operations for businesses that want stronger execution without added operational drag.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link
                  href="/audit"
                  className="inline-flex items-center justify-center rounded-xl bg-primary px-8 py-4 text-base font-bold text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/25"
                >
                  Request a System Audit
                </Link>
                <Link
                  href="/library"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-8 py-4 text-base font-bold text-slate-900 transition-colors hover:bg-slate-50"
                >
                  Explore the Library
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-500">
                <span>Content systems</span>
                <span className="size-1 rounded-full bg-slate-300" />
                <span>Social media execution</span>
                <span className="size-1 rounded-full bg-slate-300" />
                <span>Operations and automation</span>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-[28px] border border-slate-200 bg-white p-5 lg:p-6 shadow-[0_30px_80px_rgba(15,23,42,0.10)]">
                <div className="rounded-[24px] bg-slate-950 p-7 lg:p-8 text-white">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400 mb-2">System view</p>
                      <h2 className="text-2xl font-semibold">Execution architecture.</h2>
                    </div>
                    <div className="size-11 rounded-2xl bg-white/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-white">deployed_code</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      ['Content engine', 'Ideas, drafts, campaign assets'],
                      ['Social distribution', 'Channel planning, post flow, publishing'],
                      ['Commercial workflow', 'Qualification, follow-up, routing'],
                      ['Operations layer', 'CRM, internal visibility, delivery logic'],
                    ].map(([title, desc]) => (
                      <div key={title} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-semibold text-white">{title}</h3>
                            <p className="text-sm text-slate-300 mt-1">{desc}</p>
                          </div>
                          <span className="material-symbols-outlined text-slate-400">east</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 rounded-2xl bg-primary px-5 py-4 text-white">
                    <p className="text-xs uppercase tracking-[0.24em] text-white/70 mb-2">Business objective</p>
                    <p className="text-base font-semibold leading-relaxed">
                      Create a business system that improves execution quality, operational consistency, and growth capacity.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 lg:px-12 py-24">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary mb-5">Business proposition</p>
            <h2 className="font-serif text-4xl lg:text-5xl leading-[1.08] tracking-[-0.03em] text-slate-950 mb-6 max-w-2xl">
              Most businesses do not have an effort problem. They have a systems problem.
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mb-8">
              More effort does not fix inconsistent content output, weak social execution, missed follow-up, disconnected tools, or fragile operations. We position Ozzilab as the systems partner that turns scattered activity into a reliable operating model.
            </p>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-slate-500 mb-4">Core promise</p>
              <p className="text-2xl font-serif leading-snug text-slate-900">
                We help businesses build a more disciplined operating system across content, social media, qualification, follow-up, and internal execution.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {frictionPoints.map((item, index) => (
              <div key={item} className="flex gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="font-serif text-2xl italic text-primary/70 min-w-10">{String(index + 1).padStart(2, '0')}</div>
                <p className="text-lg font-medium text-slate-800 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="px-6 lg:px-12 py-24 bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-14">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary mb-4">What we build</p>
            <h2 className="font-serif text-4xl lg:text-5xl leading-[1.08] tracking-[-0.03em] mb-5 max-w-2xl">
              Systems infrastructure designed around execution, not complexity.
            </h2>
            <p className="text-lg text-slate-300 leading-relaxed">
              The objective is not to add more tools. The objective is to engineer a cleaner business system that supports content production, distribution, conversion, and internal execution from one operating layer.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {systemPillars.map((pillar) => {
              const imageMap: Record<string, string> = {
                'Content Production Systems': '/homepage-images/pillar-content-systems-v2.png',
                'Social Media Execution': '/homepage-images/pillar-social-execution-v2.png',
                'Qualification and Follow-Up': '/homepage-images/pillar-qualification-followup-v2.png',
                'Operational Infrastructure': '/homepage-images/pillar-operations-infrastructure-v2.png',
              }

              return (
                <div key={pillar.title} className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
                  <div className="mb-6 overflow-hidden rounded-2xl border border-white/10 bg-white">
                    <Image
                      src={imageMap[pillar.title]}
                      alt={pillar.title}
                      width={800}
                      height={800}
                      className="w-full h-auto"
                    />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">{pillar.title}</h3>
                  <p className="text-slate-300 leading-relaxed">{pillar.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="px-6 lg:px-12 py-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary mb-4">Why this matters</p>
              <h2 className="font-serif text-4xl lg:text-5xl leading-[1.08] tracking-[-0.03em] text-slate-950 mb-4 max-w-2xl">
                Better systems create better execution.
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                The homepage should communicate operational maturity. Professionals should immediately see that the offer is structured, outcome-oriented, and built to improve how the business executes.
              </p>
            </div>
            <Link
              href="/audit"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-6 py-3 text-sm font-bold text-slate-900 hover:bg-slate-50"
            >
              Start with an audit
            </Link>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
            <Image
              src="/homepage-images/homepage-execution-comparison-v2.png"
              alt="Comparison graphic showing manual execution versus system-led execution"
              width={1600}
              height={900}
              className="w-full h-auto border-b border-slate-200"
            />
            <div className="grid grid-cols-3 border-b border-slate-200 bg-white px-6 py-5 text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
              <div>Execution layer</div>
              <div>Manual setup</div>
              <div>System-led setup</div>
            </div>
            {outcomes.map((row, index) => (
              <div
                key={row.label}
                className={`grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 px-6 py-6 ${index !== outcomes.length - 1 ? 'border-b border-slate-200' : ''}`}
              >
                <div className="font-semibold text-slate-900">{row.label}</div>
                <div className="text-slate-500">{row.manual}</div>
                <div className="text-slate-900 font-semibold">{row.system}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="process" className="px-6 lg:px-12 py-24 bg-[linear-gradient(180deg,#eef4ff_0%,#ffffff_100%)]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary mb-4">Process</p>
            <h2 className="font-serif text-4xl lg:text-5xl leading-[1.08] tracking-[-0.03em] text-slate-950 mb-6 max-w-md">
              A disciplined build sequence.
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed max-w-md">
              We do not position this as generic agency work. The process is diagnostic first, then architectural, then implementation-led.
            </p>
          </div>

          <div className="lg:col-span-8 space-y-5">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <Image
                src="/homepage-images/homepage-process-flow-v2.png"
                alt="Process flow showing audit, design, build, and refine"
                width={1600}
                height={900}
                className="w-full h-auto border-b border-slate-200"
              />
              <div className="p-7 space-y-5">
                {buildSequence.map((item) => (
                  <div key={item.step} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                    <div className="flex flex-col md:flex-row md:items-start gap-5 md:gap-8">
                      <div className="min-w-20 text-primary text-xs font-bold uppercase tracking-[0.24em] pt-1">Step {item.step}</div>
                      <div>
                        <h3 className="text-2xl font-semibold text-slate-950 mb-3">{item.title}</h3>
                        <p className="text-lg text-slate-600 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 lg:px-12 py-24 bg-slate-950 text-white border-t border-white/10">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary mb-5">Final call to action</p>
          <h2 className="font-serif text-5xl lg:text-6xl leading-[1.06] tracking-[-0.03em] mb-8 max-w-4xl mx-auto">
            Build the system before you add more effort.
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-slate-300 leading-relaxed mb-10">
            If your business depends too heavily on manual effort, we can diagnose the bottlenecks and define the system architecture required to improve execution across content, operations, and growth.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/audit"
              className="inline-flex items-center justify-center rounded-xl bg-primary px-8 py-4 text-base font-bold text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
            >
              Request a System Audit
            </Link>
            <Link
              href="/library"
              className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-8 py-4 text-base font-bold text-white hover:bg-white/10"
            >
              Review the Library
            </Link>
          </div>
          <p className="mt-8 text-sm text-slate-400">Positioning: premium, selective, and built for serious operators.</p>
        </div>
      </section>
    </main>
  )
}
