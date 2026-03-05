'use client'

import { useMemo, useState } from 'react'

type FileRow = {
  id: string
  originalName: string
  sizeBytes: bigint
}

type Intake = {
  submissionId: string
  businessName: string
  contactEmail: string
  createdAt: string
  status: string
  industry: string | null
  requestedBuild: string | null
  kpiTarget: string | null
  successDefinition: string | null
  budgetRange: string | null
  toolsStack: string | null
  supportingLinks: string | null
  auditId: string
  files: FileRow[]
}

function fmtBytes(sizeBytes: bigint) {
  const n = Number(sizeBytes)
  const mb = n / 1024 / 1024
  if (mb < 1) return `${Math.round(n / 1024)} KB`
  return `${mb.toFixed(1)} MB`
}

type Tab = 'answers' | 'activity' | 'comms'

function TabButton({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      className={`pb-4 border-b-2 font-bold text-sm transition-colors ${
        active ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-900'
      }`}
      type="button"
      onClick={onClick}
    >
      {label}
    </button>
  )
}

export function IntakeDetailClient({ intake }: { intake: Intake }) {
  const [tab, setTab] = useState<Tab>('answers')

  const createdDate = useMemo(() => intake.createdAt.slice(0, 10), [intake.createdAt])

  return (
    <div className="grid grid-cols-12 gap-8">
      {/* Left */}
      <div className="col-span-12 lg:col-span-8 space-y-6">
        <div className="border-b border-slate-200 flex gap-8">
          <TabButton active={tab === 'answers'} label="Form Answers" onClick={() => setTab('answers')} />
          <TabButton active={tab === 'activity'} label="Activity Log" onClick={() => setTab('activity')} />
          <TabButton active={tab === 'comms'} label="Communication" onClick={() => setTab('comms')} />
        </div>

        {tab === 'answers' ? (
          <>
            <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">business_center</span>
                  Business Details
                </h3>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Company Name</h4>
                  <p className="text-slate-900 font-medium">{intake.businessName}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Industry</h4>
                  <p className="text-slate-900 font-medium">{intake.industry || '-'}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Primary Contact</h4>
                  <p className="text-slate-900 font-medium">{intake.contactEmail}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Source Audit</h4>
                  <p className="text-slate-900 font-medium">{intake.auditId}</p>
                </div>
                <div className="col-span-full">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Project Brief</h4>
                  <p className="text-slate-900 leading-relaxed whitespace-pre-wrap">{intake.requestedBuild || '-'}</p>
                </div>
                <div className="col-span-full">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Supporting Links</h4>
                  <p className="text-slate-700 whitespace-pre-wrap">{intake.supportingLinks || '-'}</p>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">analytics</span>
                  Key Performance Indicators
                </h3>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="size-8 rounded bg-primary/5 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary text-lg">trending_up</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">KPI Target</h4>
                    <p className="text-slate-500 text-sm whitespace-pre-wrap">{intake.kpiTarget || '-'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="size-8 rounded bg-primary/5 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary text-lg">workspace_premium</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Success Definition</h4>
                    <p className="text-slate-500 text-sm whitespace-pre-wrap">{intake.successDefinition || '-'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="size-8 rounded bg-primary/5 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary text-lg">payments</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Budget Range</h4>
                    <p className="text-slate-500 text-sm whitespace-pre-wrap">{intake.budgetRange || '-'}</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">data_object</span>
                  Current Tech Stack
                </h3>
              </div>
              <div className="p-6">
                <p className="text-slate-700 whitespace-pre-wrap">{intake.toolsStack || '-'}</p>
              </div>
            </section>
          </>
        ) : null}

        {tab === 'activity' ? (
          <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">history</span>
                Activity Log
              </h3>
            </div>
            <div className="p-6">
              <div className="relative space-y-6 before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-200">
                <div className="relative flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-5 w-5 rounded-full border-4 border-white bg-primary z-10" />
                    <div>
                      <p className="text-sm text-slate-900">
                        <span className="font-bold">Form submitted</span> by {intake.contactEmail}
                      </p>
                      <p className="text-[10px] text-slate-500 uppercase font-bold">{createdDate}</p>
                    </div>
                  </div>
                </div>
              </div>
              <p className="mt-6 text-sm text-slate-500">More events will appear here as status updates and notes are enabled.</p>
            </div>
          </section>
        ) : null}

        {tab === 'comms' ? (
          <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">forum</span>
                Communication
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-500">
                This will show email/WhatsApp/Telegram messages for this submission once message logging is enabled.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors"
                  type="button"
                  onClick={() => alert('Coming soon: Send email from dashboard')}
                >
                  Send Email
                </button>
                <button
                  className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors"
                  type="button"
                  onClick={() => alert('Coming soon: Send WhatsApp from dashboard')}
                >
                  Send WhatsApp
                </button>
              </div>
            </div>
          </section>
        ) : null}
      </div>

      {/* Right */}
      <div className="col-span-12 lg:col-span-4 space-y-6">
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">attach_file</span>
              Files &amp; Assets
            </h3>
            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{intake.files.length}</span>
          </div>
          <div className="p-4 space-y-3">
            {intake.files.map((f) => (
              <a
                key={f.id}
                href={`/api/admin/files/${f.id}/download`}
                className="group flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-primary/30 hover:bg-slate-50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded bg-slate-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-slate-600 text-xl">description</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 truncate w-44">{f.originalName}</p>
                    <p className="text-xs text-slate-500">{fmtBytes(f.sizeBytes)}</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">download</span>
              </a>
            ))}
            {intake.files.length === 0 ? <p className="text-sm text-slate-500 p-2">No files uploaded yet.</p> : null}
          </div>
        </section>

        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">sticky_note_2</span>
              Internal Notes
            </h3>
          </div>
          <div className="p-4">
            <p className="text-sm text-slate-500">Notes UI is ready. Hooking up persistence is next.</p>
            <div className="mt-3 relative">
              <textarea
                className="w-full rounded-lg border-slate-200 bg-white focus:ring-primary focus:border-primary text-sm min-h-[100px] p-3 placeholder:text-slate-400"
                placeholder="Type a note for the team..."
                disabled
              />
              <button className="absolute bottom-3 right-3 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-60" disabled>
                Add Note
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
