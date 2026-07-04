'use client'

import Link from 'next/link'
import { useState } from 'react'
import { PremiumPageHero } from '@/components/PremiumPageHero'

type Currency = 'CAD' | 'GBP' | 'AUD'

const currencies: { key: Currency; label: string }[] = [
  { key: 'CAD', label: 'CAD ($)' },
  { key: 'GBP', label: 'UK (£)' },
  { key: 'AUD', label: 'AUD ($)' },
]

const packages = [
  {
    name: 'Audit & Quick Fix',
    bestFor: 'Best for diagnosing leaks before committing to a build.',
    prices: { CAD: 'From CAD $300', GBP: 'From £250', AUD: 'From AUD $400' },
    desc: 'Diagnostic review and practical conversion-leak action plan. Final scope depends on the depth of review, channels, and systems involved.',
    features: ['Website/landing page review', 'Lead capture review', 'Booking/follow-up review', 'Competitor snapshot', 'Recommended fix plan'],
  },
  {
    name: 'Website Refresh',
    bestFor: 'Best for outdated websites with weak enquiry flow.',
    prices: { CAD: 'From CAD $1,500', GBP: 'From £1,200', AUD: 'From AUD $1,800' },
    desc: 'A premium business website refresh built around clear CTAs and lead capture. Final scope depends on page count, content, and integrations.',
    features: ['3–5 page business website', 'Mobile-friendly design', 'CTA/contact forms', 'Basic SEO/tracking', 'Lead capture connection'],
  },
  {
    name: 'Growth System',
    bestFor: 'Best for serious appointment-driven growth.',
    prices: { CAD: 'From CAD $3,500', GBP: 'From £2,800', AUD: 'From AUD $4,000' },
    desc: 'Recommended core system for turning qualified enquiries into booked appointments. Final scope depends on automation, CRM, booking, and reporting needs.',
    recommended: true,
    features: ['Website refresh inclusions', 'Landing page', 'CRM/pipeline setup', 'Follow-up automation', 'Booking + reminders', 'Reporting dashboard'],
  },
  {
    name: 'Premium Engine',
    bestFor: 'Best for multi-offer, multi-location, or advanced service businesses.',
    prices: { CAD: 'From CAD $8,000', GBP: 'From £6,500', AUD: 'From AUD $9,000' },
    desc: 'Advanced growth infrastructure for larger campaigns, teams, and service flows. Final scope depends on locations, offers, campaign volume, and custom workflows.',
    features: ['Full website', 'Multiple landing pages', 'Multi-channel capture', 'Ad funnel setup', 'Old lead reactivation', '30 days optimization'],
  },
  {
    name: 'AI Chat & Voice Agent Setup',
    bestFor: 'Best for businesses that want AI to answer enquiries, qualify leads, and reduce missed conversations.',
    prices: { CAD: 'From CAD $1,500', GBP: 'From £1,200', AUD: 'From AUD $1,800' },
    desc: 'A custom AI assistant for your website that can chat with visitors, answer common questions, collect lead details, and optionally support voice conversations. Final scope depends on chat-only vs voice, knowledge depth, and integrations.',
    features: ['Website AI chat widget', 'AI voice assistant option', 'Business FAQ and service knowledge setup', 'Lead qualification questions', 'Booking or enquiry handoff', 'CRM/email notification integration'],
  },
]

const monthlyPlans = [
  {
    name: 'Website Care',
    prices: { CAD: 'From CAD $500/month', GBP: 'From £400/month', AUD: 'From AUD $700/month' },
    desc: 'For keeping the website healthy, updated, and conversion-ready after launch. Final scope depends on update frequency and support needs.',
    features: ['Website updates', 'Basic uptime checks', 'Minor page/content edits', 'Monthly performance review'],
  },
  {
    name: 'Growth Management',
    prices: { CAD: 'From CAD $1,000/month', GBP: 'From £800/month', AUD: 'From AUD $1,300/month' },
    desc: 'For businesses actively improving lead capture, booking, follow-up, and reporting. Final scope depends on campaign activity and automation complexity.',
    popular: true,
    features: ['Website + landing page edits', 'Automation monitoring', 'CRM/pipeline cleanup', 'Monthly growth report', 'Offer/page improvements'],
  },
  {
    name: 'Premium Growth Partner',
    prices: { CAD: 'From CAD $2,000/month', GBP: 'From £1,600/month', AUD: 'From AUD $2,600/month' },
    desc: 'For teams that want ongoing strategy, funnel improvements, automation, and priority support. Final scope depends on team needs, reporting depth, and campaign volume.',
    features: ['Priority implementation', 'Advanced reporting', 'New campaign/offer pages', 'Lead reactivation support', 'Strategy calls'],
  },
  {
    name: 'AI Agent Management',
    prices: { CAD: 'From CAD $500/month', GBP: 'From £400/month', AUD: 'From AUD $700/month' },
    desc: 'For businesses that want their AI assistant monitored, improved, and kept accurate after launch. Final scope depends on conversation volume, knowledge updates, and reporting needs.',
    features: ['AI response tuning', 'FAQ and knowledge updates', 'Conversation review', 'Lead-flow improvements', 'Monthly performance summary', 'Support for changing offers/services'],
  },
]

const monthlyWebsitePlans = [
  'Monthly website plan available for businesses that prefer a lower upfront cost.',
  'Includes website management, hosting/launch support options, updates, and conversion improvements.',
  'Best fit is confirmed after the audit because page count, tools, and automation scope vary.',
]

const included = [
  ['Mobile responsive design', 'Pages are designed to work clearly across phones, tablets, and desktop.'],
  ['Lead capture setup', 'Forms, CTAs, enquiry paths, and booking/contact actions are treated as core requirements.'],
  ['Basic SEO foundation', 'Page structure, titles, descriptions, and crawl-friendly basics are included.'],
  ['Tracking-ready structure', 'Analytics and conversion tracking can be connected so results are visible.'],
  ['Launch support', 'Final checks, handover guidance, and post-launch support are included based on package scope.'],
  ['Security-minded setup', 'SSL-ready deployment, safe form handling, and sensible production defaults.'],
]

const faqs = [
  ['Do I own the website?', 'Yes. Your business content, brand assets, and website files are yours. If we manage hosting or maintenance, that is a service layer — not a lock-in.'],
  ['Is hosting included?', 'Hosting can be included or managed separately depending on your preferred setup. We recommend the cleanest option during the audit or strategy call.'],
  ['Can I start monthly instead of paying everything upfront?', 'Yes. For suitable projects, we can structure a managed monthly website or growth plan. Larger custom systems may still require setup fees.'],
  ['How fast can we launch?', 'Simple website refreshes can move quickly once content and access are ready. Growth systems take longer because automation, booking, CRM, and reporting need proper setup.'],
  ['Can I request updates after launch?', 'Yes. Monthly plans cover agreed update support. One-time projects can also add a management plan after launch.'],
  ['Can I upgrade later?', 'Yes. You can start with a website refresh or audit, then upgrade into a growth system, premium engine, or monthly management as your business needs grow.'],
]

export default function PricingPage() {
  const [currency, setCurrency] = useState<Currency>('CAD')

  return (
    <main className="bg-[#f7f9fb] text-slate-950">
      <PremiumPageHero
        eyebrow="Pricing"
        title="Flexible packages for appointment-driven growth."
        description="Choose a focused project build, a managed monthly plan, or a complete growth system. Final pricing depends on scope, page count, automation complexity, integrations, and campaign requirements."
        primaryHref="/audit"
        primaryLabel="Request Audit"
        secondaryHref="/book"
        secondaryLabel="Book Strategy Call"
        points={['Audit', 'Website Refresh', 'Growth System', 'Monthly Care', 'Optimization', 'Support']}
      />

      <section className="px-6 pt-12 lg:px-10 xl:px-16">
        <div className="mx-auto flex max-w-[1480px] justify-center">
          <div className="inline-flex rounded-full border border-slate-200 bg-white p-1 text-sm font-semibold shadow-sm" role="tablist" aria-label="Select currency">
            {currencies.map((item) => (
              <button key={item.key} type="button" role="tab" aria-selected={currency === item.key} onClick={() => setCurrency(item.key)} className={`rounded-full px-5 py-2 transition-all ${currency === item.key ? 'bg-slate-950 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 lg:px-10 xl:px-16">
        <div className="mx-auto mb-10 max-w-[1480px]">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-600">Project packages</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">Build once, then improve continuously.</h2>
        </div>
        <div className="mx-auto grid max-w-[1480px] gap-5 md:grid-cols-2 xl:grid-cols-5">
          {packages.map((pkg) => (
            <div key={pkg.name} className={`relative flex rounded-2xl border bg-white p-6 shadow-sm ${pkg.recommended ? 'border-blue-600 ring-4 ring-blue-600/10' : 'border-slate-200'}`}>
              {pkg.recommended ? <span className="absolute -top-3 left-6 rounded-full bg-blue-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">Recommended</span> : null}
              <div className="flex w-full flex-col">
                <h2 className="text-xl font-semibold">{pkg.name}</h2>
                <p className="mt-3 rounded-xl bg-slate-50 p-3 text-xs font-bold leading-5 text-slate-600">{pkg.bestFor}</p>
                <p className="mt-4 text-sm leading-6 text-slate-600">{pkg.desc}</p>
                <p className="mt-6 text-2xl font-semibold tracking-[-0.02em]">{pkg.prices[currency]}</p>
                <ul className="mt-6 space-y-3 text-sm text-slate-600">
                  {pkg.features.map((f) => <li key={f} className="flex gap-2"><span className="material-symbols-outlined text-base text-blue-600">check</span>{f}</li>)}
                </ul>
                <Link href={pkg.recommended ? '/book' : '/audit'} className={`mt-8 rounded-lg px-4 py-3 text-center text-sm font-semibold ${pkg.recommended ? 'bg-blue-600 text-white' : 'border border-slate-200 text-slate-900'}`}>{pkg.recommended ? 'Book Strategy Call' : 'Request Audit'}</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white px-6 py-20 lg:px-10 xl:px-16">
        <div className="mx-auto max-w-[1480px]">
          <div className="mb-10 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-600">Managed monthly options</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">For businesses that want ongoing website and growth support.</h2>
            <p className="mt-4 leading-8 text-slate-600">Use this after a build, or as a lower-upfront monthly website path when the scope is a good fit.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {monthlyPlans.map((plan) => (
              <div key={plan.name} className={`relative rounded-[1.5rem] border bg-slate-50 p-7 ${plan.popular ? 'border-blue-600 ring-4 ring-blue-600/10' : 'border-slate-200'}`}>
                {plan.popular ? <span className="absolute -top-3 left-7 rounded-full bg-blue-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">Popular</span> : null}
                <h3 className="text-2xl font-semibold tracking-[-0.03em]">{plan.name}</h3>
                <p className="mt-4 leading-7 text-slate-600">{plan.desc}</p>
                <p className="mt-6 text-xl font-semibold">{plan.prices[currency]}</p>
                <ul className="mt-6 space-y-3 text-sm text-slate-600">
                  {plan.features.map((f) => <li key={f} className="flex gap-2"><span className="material-symbols-outlined text-base text-blue-600">check</span>{f}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-[1.5rem] border border-blue-200 bg-blue-50 p-6">
            <h3 className="text-xl font-semibold text-blue-950">Prefer one simple monthly plan?</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {monthlyWebsitePlans.map((item) => <p key={item} className="rounded-2xl bg-white p-4 text-sm font-semibold leading-6 text-slate-700">{item}</p>)}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 lg:px-10 xl:px-16">
        <div className="mx-auto max-w-[1480px]">
          <div className="mb-10 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-600">Every package includes</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">The essentials are not treated as extras.</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {included.map(([title, desc]) => <div key={title} className="rounded-[1.4rem] border border-slate-200 bg-white p-6 shadow-sm"><span className="material-symbols-outlined rounded-2xl bg-blue-50 p-3 text-blue-600">verified</span><h3 className="mt-5 text-lg font-semibold">{title}</h3><p className="mt-3 text-sm leading-7 text-slate-600">{desc}</p></div>)}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-20 lg:px-10 xl:px-16">
        <div className="mx-auto max-w-[1100px]">
          <div className="mb-10 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-600">Pricing FAQ</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">Questions before you choose a package.</h2>
          </div>
          <div className="grid gap-4">
            {faqs.map(([q, a]) => <div key={q} className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-6"><h3 className="font-semibold text-slate-950">{q}</h3><p className="mt-3 leading-7 text-slate-600">{a}</p></div>)}
          </div>
        </div>
      </section>
    </main>
  )
}
