'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DecisionMakerFields } from './DecisionMakerFields'

export default function AuditPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const fd = new FormData(e.currentTarget)
    const payload = Object.fromEntries(fd.entries())

    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || 'Submission failed')
      router.push(`/audit/thanks?auditId=${encodeURIComponent(json.auditId)}`)
    } catch (err: any) {
      setError(err?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="bg-background-light text-slate-900 py-12 lg:py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-4">Request Audit</h2>
          <p className="text-xl text-slate-500 max-w-xl mx-auto font-medium">Share a few details. We’ll review and respond with next steps.</p>
        </div>

        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
          <form onSubmit={onSubmit} className="p-8 lg:p-12 space-y-10">
              {/* Personal & Business Identity */}
              <section className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <span className="material-symbols-outlined text-primary">person</span>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Personal &amp; Business Identity</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-700 ml-1" htmlFor="fullName">
                      Full Name
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      required
                      type="text"
                      placeholder="e.g. Alexander Pierce"
                      className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-700 ml-1" htmlFor="email">
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      required
                      type="email"
                      placeholder="name@company.com"
                      className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-700 ml-1" htmlFor="whatsapp">
                      WhatsApp Number
                    </label>
                    <input
                      id="whatsapp"
                      name="whatsapp"
                      type="text"
                      placeholder="+234…"
                      className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-700 ml-1" htmlFor="country">
                      Country
                    </label>
                    <input
                      id="country"
                      name="country"
                      type="text"
                      placeholder="e.g. Nigeria, UK, US"
                      className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-700 ml-1" htmlFor="businessName">
                      Business Name
                    </label>
                    <input
                      id="businessName"
                      name="businessName"
                      required
                      type="text"
                      placeholder="Company Name"
                      className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-700 ml-1 flex justify-between" htmlFor="websiteUrl">
                      Website URL
                      <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase">One link required</span>
                    </label>
                    <input
                      id="websiteUrl"
                      name="websiteUrl"
                      type="url"
                      placeholder="https://…"
                      className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-700 ml-1" htmlFor="instagramUrl">
                      Instagram Profile URL
                    </label>
                    <input
                      id="instagramUrl"
                      name="instagramUrl"
                      type="url"
                      placeholder="https://instagram.com/..."
                      className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-700 ml-1" htmlFor="linkedinUrl">
                      LinkedIn Profile URL
                    </label>
                    <input
                      id="linkedinUrl"
                      name="linkedinUrl"
                      type="url"
                      placeholder="https://linkedin.com/in/..."
                      className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-700 ml-1" htmlFor="youtubeUrl">
                      YouTube Channel URL
                    </label>
                    <input
                      id="youtubeUrl"
                      name="youtubeUrl"
                      type="url"
                      placeholder="https://youtube.com/..."
                      className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-700 ml-1" htmlFor="schedulerUrl">
                      Booking / Scheduler URL
                    </label>
                    <input
                      id="schedulerUrl"
                      name="schedulerUrl"
                      type="url"
                      placeholder="https://calendly.com/..."
                      className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </section>

              <DecisionMakerFields />

              {/* Performance Metrics */}
              <section className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <span className="material-symbols-outlined text-primary">assessment</span>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Performance Metrics</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-700 ml-1" htmlFor="offerType">
                      Offer Type
                    </label>
                    <select
                      id="offerType"
                      name="offerType"
                      className="form-select-custom w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select offer type
                      </option>
                      <option>Professional Services</option>
                      <option>B2B SaaS</option>
                      <option>Mastermind / Coaching</option>
                      <option>Agency White Label</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-700 ml-1" htmlFor="pricePointRange">
                      Offer Price Point
                    </label>
                    <select
                      id="pricePointRange"
                      name="pricePointRange"
                      className="form-select-custom w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select price range
                      </option>
                      <option>$1,000 - $3,000</option>
                      <option>$3,000 - $10,000</option>
                      <option>$10,000 - $25,000</option>
                      <option>$25,000+</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-700 ml-1" htmlFor="monthlyLeadVolumeRange">
                      Monthly Lead Volume
                    </label>
                    <select
                      id="monthlyLeadVolumeRange"
                      name="monthlyLeadVolumeRange"
                      className="form-select-custom w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select volume range
                      </option>
                      <option>0 - 10 leads/mo</option>
                      <option>10 - 50 leads/mo</option>
                      <option>50 - 200 leads/mo</option>
                      <option>200+ leads/mo</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-700 ml-1" htmlFor="primaryGoal">
                      Primary Goal
                    </label>
                    <select
                      id="primaryGoal"
                      name="primaryGoal"
                      className="form-select-custom w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select objective
                      </option>
                      <option>Increase Lead Quality</option>
                      <option>Scale Lead Volume</option>
                      <option>Improve Conversion Rate</option>
                      <option>Systemize Fulfilment</option>
                      <option>Reduce Acquisition Cost</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Strategic Context */}
              <section className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <span className="material-symbols-outlined text-primary">psychology</span>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Strategic Context</h3>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700 ml-1" htmlFor="biggestConstraint">
                    Biggest Constraint
                  </label>
                  <textarea
                    id="biggestConstraint"
                    name="biggestConstraint"
                    rows={3}
                    placeholder="What is currently holding you back from reaching your next milestone?"
                    className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all resize-none min-h-[120px] placeholder:text-slate-400"
                  />
                </div>
              </section>

              {/* honeypot */}
              <input tabIndex={-1} autoComplete="off" name="company" className="hidden" />

              {error ? <p className="text-sm text-red-600 px-1">{error}</p> : null}

              <div className="pt-10 flex flex-col items-center gap-6">
                <button
                  disabled={loading}
                  className="w-full md:w-auto px-12 py-5 bg-primary hover:bg-blue-700 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-60"
                  type="submit"
                >
                  {loading ? 'Submitting…' : 'Submit Audit Request'}
                  <span className="material-symbols-outlined">send</span>
                </button>

                <p className="text-slate-400 text-xs flex items-center gap-2 font-medium">
                  <span className="material-symbols-outlined text-sm">lock</span>
                  Your data is strictly confidential and used only for audit purposes.
                </p>
              </div>
          </form>
        </div>

        <div className="mt-12 text-center">
          <p className="text-slate-500 text-sm font-medium">
            Questions? Reach out at{' '}
            <a className="text-primary hover:underline font-bold" href="mailto:ops@ozzilab.cloud">
              ops@ozzilab.cloud
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}
