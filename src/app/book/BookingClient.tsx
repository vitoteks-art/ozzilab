'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

type Slot = { start: string; end: string; label: string }
type Day = { date: string; dayLabel: string; slots: Slot[] }

const meetingTypes = [
  'Free Lead & Appointment-Leak Audit Call',
  'Website Refresh + Lead Capture Consultation',
  'Growth System Strategy Call',
  'Premium Growth Engine Discovery Call',
  'Monthly Management / Retainer Review',
]

const initialForm = {
  fullName: '',
  email: '',
  whatsapp: '',
  country: '',
  businessName: '',
  industry: '',
  websiteUrl: '',
  instagramUrl: '',
  linkedinUrl: '',
  youtubeUrl: '',
  googleBusinessUrl: '',
  schedulerUrl: '',
  currentLeadSources: '',
  mainProblem: '',
  monthlyLeadVolumeRange: '',
  budgetReadiness: '',
  preferredPackageInterest: '',
}

export function BookingClient() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [meetingType, setMeetingType] = useState(meetingTypes[0])
  const [days, setDays] = useState<Day[]>([])
  const [slotsLoading, setSlotsLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/bookings/available-slots', { cache: 'no-store' })
        const json = await res.json()
        if (!res.ok) throw new Error(json?.error || 'Failed to load slots')
        if (cancelled) return
        setDays(json.days || [])
        const first = (json.days || []).find((d: Day) => d.slots.length)
        if (first) setSelectedDate(first.date)
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load slots')
      } finally {
        if (!cancelled) setSlotsLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const activeDay = useMemo(() => days.find((d) => d.date === selectedDate), [days, selectedDate])
  const hasLink = Boolean([
    form.websiteUrl,
    form.instagramUrl,
    form.linkedinUrl,
    form.youtubeUrl,
    form.googleBusinessUrl,
    form.schedulerUrl,
  ].some((v) => v.trim()))

  function update(key: keyof typeof initialForm, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function next() {
    setError(null)
    if (step === 1 && !meetingType) return setError('Choose a meeting type.')
    if (step === 2 && !selectedSlot) return setError('Choose an available date and time.')
    if (step === 3 && (!form.fullName || !form.email || !form.whatsapp || !form.businessName)) return setError('Add your name, email, WhatsApp, and business name.')
    if (step === 4 && !hasLink) return setError('Add at least one website, social, Google Business, or booking link.')
    setStep((s) => Math.min(5, s + 1))
  }

  async function submit() {
    if (!selectedSlot) return setError('Choose an available date and time.')
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...form, meetingType, slotStart: selectedSlot.start, slotEnd: selectedSlot.end, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Africa/Lagos' }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || 'Booking failed')
      router.push(`/book/thanks?bookingId=${encodeURIComponent(json.bookingId)}`)
    } catch (e: any) {
      setError(e?.message || 'Booking failed')
    } finally {
      setSubmitting(false)
    }
  }

  const input = 'w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10'

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_40px_rgba(15,23,42,0.05)] md:p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
            <span>Step {step} of 5</span>
            <span>{Math.round((step / 5) * 100)}%</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${(step / 5) * 100}%` }} />
          </div>
        </div>

        {error ? <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div> : null}

        {step === 1 ? (
          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">What would you like to discuss?</h2>
            <p className="mt-2 text-slate-600">Choose the consultation type that best matches your current goal.</p>
            <div className="mt-6 grid gap-3">
              {meetingTypes.map((type) => (
                <button key={type} type="button" onClick={() => setMeetingType(type)} className={`rounded-xl border p-4 text-left transition ${meetingType === type ? 'border-blue-600 bg-blue-50 text-slate-950' : 'border-slate-200 hover:border-blue-300'}`}>
                  <span className="font-semibold">{type}</span>
                </button>
              ))}
            </div>
          </section>
        ) : null}

        {step === 2 ? (
          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Choose a date and time</h2>
            <p className="mt-2 text-slate-600">Available slots are generated from the booking calendar and blocked once requested.</p>
            {slotsLoading ? <div className="mt-6 grid gap-3 md:grid-cols-3">{[1,2,3,4,5,6].map((i)=><div key={i} className="h-24 animate-pulse rounded-xl bg-slate-100" />)}</div> : (
              <>
                <div className="mt-6 grid gap-3 md:grid-cols-3">
                  {days.map((day) => <button key={day.date} type="button" onClick={() => { setSelectedDate(day.date); setSelectedSlot(null) }} className={`rounded-xl border p-4 text-left transition ${selectedDate === day.date ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-blue-300'} ${!day.slots.length ? 'opacity-50' : ''}`}><span className="block font-semibold text-slate-950">{day.dayLabel}</span><span className="mt-1 block text-xs text-slate-500">{day.slots.length ? `${day.slots.length} slots` : 'Unavailable'}</span></button>)}
                </div>
                <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="font-semibold text-slate-950">{activeDay?.dayLabel || 'Select a date'}</h3>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {activeDay?.slots.map((slot) => <button key={slot.start} type="button" onClick={() => setSelectedSlot(slot)} className={`rounded-lg border px-4 py-3 text-left text-sm font-semibold transition ${selectedSlot?.start === slot.start ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 bg-white text-slate-900 hover:border-blue-300'}`}>{slot.label}</button>)}
                    {activeDay && activeDay.slots.length === 0 ? <p className="text-sm text-slate-500">No available slots for this date. Try another day.</p> : null}
                  </div>
                </div>
              </>
            )}
          </section>
        ) : null}

        {step === 3 ? (
          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Contact and business details</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <Field label="Full name *"><input className={input} value={form.fullName} onChange={(e) => update('fullName', e.target.value)} /></Field>
              <Field label="Email *"><input className={input} type="email" value={form.email} onChange={(e) => update('email', e.target.value)} /></Field>
              <Field label="WhatsApp / phone *"><input className={input} value={form.whatsapp} onChange={(e) => update('whatsapp', e.target.value)} /></Field>
              <Field label="Country"><input className={input} value={form.country} onChange={(e) => update('country', e.target.value)} /></Field>
              <Field label="Business name *"><input className={input} value={form.businessName} onChange={(e) => update('businessName', e.target.value)} /></Field>
              <Field label="Industry / niche"><input className={input} value={form.industry} onChange={(e) => update('industry', e.target.value)} /></Field>
            </div>
          </section>
        ) : null}

        {step === 4 ? (
          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Lead and appointment context</h2>
            <p className="mt-2 text-slate-600">At least one business, social, Google Business, or booking link is required.</p>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <Field label="Website URL"><input className={input} type="url" value={form.websiteUrl} onChange={(e) => update('websiteUrl', e.target.value)} /></Field>
              <Field label="Instagram URL"><input className={input} type="url" value={form.instagramUrl} onChange={(e) => update('instagramUrl', e.target.value)} /></Field>
              <Field label="LinkedIn URL"><input className={input} type="url" value={form.linkedinUrl} onChange={(e) => update('linkedinUrl', e.target.value)} /></Field>
              <Field label="Google Business URL"><input className={input} type="url" value={form.googleBusinessUrl} onChange={(e) => update('googleBusinessUrl', e.target.value)} /></Field>
              <Field label="Booking / scheduler URL"><input className={input} type="url" value={form.schedulerUrl} onChange={(e) => update('schedulerUrl', e.target.value)} /></Field>
              <Field label="YouTube URL"><input className={input} type="url" value={form.youtubeUrl} onChange={(e) => update('youtubeUrl', e.target.value)} /></Field>
              <Field label="Current lead sources"><input className={input} value={form.currentLeadSources} onChange={(e) => update('currentLeadSources', e.target.value)} /></Field>
              <Field label="Monthly lead volume"><select className={input} value={form.monthlyLeadVolumeRange} onChange={(e) => update('monthlyLeadVolumeRange', e.target.value)}><option value="">Select range</option><option>0–10</option><option>11–50</option><option>51–150</option><option>150+</option></select></Field>
              <Field label="Budget / readiness"><select className={input} value={form.budgetReadiness} onChange={(e) => update('budgetReadiness', e.target.value)}><option value="">Select readiness</option><option>Ready now</option><option>Within 30 days</option><option>Researching options</option><option>Need audit first</option></select></Field>
              <Field label="Preferred package"><select className={input} value={form.preferredPackageInterest} onChange={(e) => update('preferredPackageInterest', e.target.value)}><option value="">Select package</option><option>Audit & Quick Fix</option><option>Website Refresh + Lead Capture</option><option>Growth System</option><option>Premium Growth Engine</option><option>Monthly Management</option></select></Field>
              <div className="md:col-span-2"><Field label="Biggest lead / appointment problem"><textarea className={`${input} min-h-28`} value={form.mainProblem} onChange={(e) => update('mainProblem', e.target.value)} /></Field></div>
            </div>
          </section>
        ) : null}

        {step === 5 ? (
          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Review and submit</h2>
            <div className="mt-6 grid gap-3 text-sm text-slate-700">
              <Review label="Meeting" value={meetingType} />
              <Review label="Time" value={selectedSlot ? new Date(selectedSlot.start).toLocaleString() : '-'} />
              <Review label="Name" value={form.fullName} />
              <Review label="Business" value={form.businessName} />
              <Review label="Email" value={form.email} />
            </div>
          </section>
        ) : null}

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <button type="button" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1 || submitting} className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 disabled:opacity-40">Back</button>
          {step < 5 ? <button type="button" onClick={next} className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700">Continue</button> : <button type="button" onClick={submit} disabled={submitting} className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">{submitting ? 'Submitting…' : 'Book Strategy Call'}</button>}
        </div>
      </div>

      <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_40px_rgba(15,23,42,0.05)] lg:sticky lg:top-24">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">Booking summary</p>
        <h3 className="mt-3 text-xl font-semibold text-slate-950">What happens next</h3>
        <div className="mt-5 space-y-4 text-sm text-slate-600">
          <p><strong className="text-slate-950">Meeting:</strong> {meetingType}</p>
          <p><strong className="text-slate-950">Selected time:</strong> {selectedSlot ? new Date(selectedSlot.start).toLocaleString() : 'Not selected yet'}</p>
          <ol className="list-decimal space-y-2 pl-5 leading-6">
            <li>We review your website, lead capture, and booking flow.</li>
            <li>We confirm the call details and fit.</li>
            <li>You get practical next-step recommendations.</li>
          </ol>
          <div className="rounded-xl bg-slate-50 p-4 text-slate-700">Confirmation/response is normally within 24–48 hours.</div>
        </div>
      </aside>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="grid gap-2"><span className="text-sm font-semibold text-slate-800">{label}</span>{children}</label>
}

function Review({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between gap-6 rounded-lg bg-slate-50 px-4 py-3"><span className="font-semibold text-slate-500">{label}</span><span className="text-right font-semibold text-slate-950">{value || '-'}</span></div>
}
