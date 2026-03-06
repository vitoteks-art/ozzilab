'use client'

import { useState } from 'react'

type Status = 'YES' | 'NO' | 'SHARED'

export function DecisionMakerFields() {
  const [status, setStatus] = useState<Status>('YES')

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
        <span className="material-symbols-outlined text-primary">verified_user</span>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Decision Maker</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-700 ml-1 flex justify-between" htmlFor="decisionMakerStatus">
            Are you the decision maker?
            <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase">Required</span>
          </label>
          <select
            id="decisionMakerStatus"
            name="decisionMakerStatus"
            required
            className="form-select-custom w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
            defaultValue="YES"
            onChange={(e) => setStatus(e.target.value as Status)}
          >
            <option value="YES">Yes</option>
            <option value="NO">No</option>
            <option value="SHARED">Shared decision</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-700 ml-1" htmlFor="industry">
            Industry / Niche
          </label>
          <input
            id="industry"
            name="industry"
            type="text"
            placeholder="e.g. Real estate, e-commerce, coaching"
            className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      {status !== 'YES' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700 ml-1" htmlFor="decisionMakerName">
              Decision maker name
            </label>
            <input
              id="decisionMakerName"
              name="decisionMakerName"
              type="text"
              placeholder="Full name"
              className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700 ml-1" htmlFor="decisionMakerRole">
              Decision maker role/title
            </label>
            <input
              id="decisionMakerRole"
              name="decisionMakerRole"
              type="text"
              required
              placeholder="e.g. Founder, CEO"
              className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700 ml-1" htmlFor="decisionMakerEmail">
              Decision maker email
            </label>
            <input
              id="decisionMakerEmail"
              name="decisionMakerEmail"
              type="email"
              placeholder="name@company.com"
              className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700 ml-1" htmlFor="decisionMakerWhatsApp">
              Decision maker WhatsApp
            </label>
            <input
              id="decisionMakerWhatsApp"
              name="decisionMakerWhatsApp"
              type="text"
              placeholder="+1… / +234…"
              className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-slate-400"
            />
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-700 ml-1" htmlFor="offerSummary">
            Offer summary (one line)
          </label>
          <input
            id="offerSummary"
            name="offerSummary"
            type="text"
            placeholder="What do you sell and to who?"
            className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-700 ml-1" htmlFor="primaryAcquisitionChannel">
            Primary acquisition channel
          </label>
          <input
            id="primaryAcquisitionChannel"
            name="primaryAcquisitionChannel"
            type="text"
            placeholder="e.g. Meta ads, Instagram organic"
            className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-slate-700 ml-1" htmlFor="toolsStack">
          Current tools / stack
        </label>
        <textarea
          id="toolsStack"
          name="toolsStack"
          rows={3}
          placeholder="e.g. WhatsApp Business, Google Sheets, Calendly, HubSpot"
          className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all resize-none min-h-[120px] placeholder:text-slate-400"
        />
      </div>
    </section>
  )
}
