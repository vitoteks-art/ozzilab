import { AuditRequest } from '@prisma/client'

function scoreAudit(a: AuditRequest) {
  let score = 0

  // decision maker (strong signal)
  if (a.decisionMakerStatus === 'YES') score += 3
  else if (a.decisionMakerStatus === 'SHARED') score += 2
  else score += 0

  // channel availability
  const channels = {
    whatsapp: Boolean(a.whatsapp?.trim() || a.decisionMakerWhatsApp?.trim()),
    email: Boolean(a.email?.trim() || a.decisionMakerEmail?.trim()),
    instagram: Boolean(a.instagramUrl?.trim()),
    linkedin: Boolean(a.linkedinUrl?.trim()),
    website: Boolean(a.websiteUrl?.trim()),
  }
  const channelCount = Object.values(channels).filter(Boolean).length
  score += Math.min(3, channelCount) // cap

  // offer/goal clarity
  if ((a.offerSummary || '').trim().length > 8) score += 2
  if ((a.primaryGoal || '').trim().length > 2) score += 1

  // automation need hints
  if ((a.biggestConstraint || '').trim().length > 10) score += 1

  // scale proxy
  if ((a.pricePointRange || '').includes('$10,000') || (a.pricePointRange || '').includes('$25,000')) score += 1

  const band = score >= 8 ? 'A' : score >= 5 ? 'B' : 'PARK'

  return { score, band, channels }
}

function Chip({ children, ok }: { children: React.ReactNode; ok: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-[11px] font-bold uppercase tracking-widest border ${
        ok ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'
      }`}
    >
      {children}
    </span>
  )
}

export function QualificationSummary({ audit }: { audit: AuditRequest }) {
  const q = scoreAudit(audit)

  return (
    <div className="bg-white border border-border-subtle rounded-2xl p-8">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Qualification Summary</p>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Fit Score: {q.score}/10 · Priority {q.band}</h2>
          <p className="text-sm text-slate-600 mt-1">Decision maker + channel availability + clarity signals.</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Decision maker</p>
          <p className="text-lg font-semibold text-slate-900">{audit.decisionMakerStatus}</p>
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-slate-50 border border-border-subtle">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Channel availability</p>
          <div className="flex flex-wrap gap-2">
            <Chip ok={q.channels.whatsapp}>WhatsApp</Chip>
            <Chip ok={q.channels.email}>Email</Chip>
            <Chip ok={q.channels.instagram}>Instagram</Chip>
            <Chip ok={q.channels.linkedin}>LinkedIn</Chip>
            <Chip ok={q.channels.website}>Website</Chip>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-border-subtle">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Suggested next action</p>
          <p className="text-sm text-slate-800">
            {q.band === 'A'
              ? 'Approve quickly. Issue intake link and schedule follow-up today.'
              : q.band === 'B'
                ? 'Review. Issue intake link if constraints match automation scope.'
                : 'Park or request more details. Avoid deep work until decision maker + context is clear.'}
          </p>
          <p className="text-xs text-slate-500 mt-2">
            Note: scoring is heuristic. Override is expected.
          </p>
        </div>
      </div>
    </div>
  )
}
