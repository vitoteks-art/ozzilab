/* CRM Gap Builder (Autonomous)
   - Select up to 20 leads in Mission Control where stage=NEW and no recent tech-gap NOTE.
   - Fetch website + key funnel page.
   - Detect 1 primary bottleneck + 2 supporting gaps.
   - Write NOTE touchpoint + ActivityEvent type='gap_detected' + append tag gap=<shortcode>.

   Required env:
   - DATABASE_URL (for read selection via Prisma)
   - MISSION_CONTROL_BASE_URL
   - MISSION_CONTROL_SERVICE_TOKEN (scope: crm:write)

   Fallback rule:
   - If token missing or API write fails, print results (caller may log into Daily Note).
*/

const { PrismaClient } = require('@prisma/client')
const { URL } = require('url')

const prisma = new PrismaClient()

const BASE = (process.env.MISSION_CONTROL_BASE_URL || '').replace(/\/$/, '')
const TOK = process.env.MISSION_CONTROL_SERVICE_TOKEN || ''

const UA = 'Mozilla/5.0 (compatible; OzziGapBuilder/1.1)'

const SCHEDULER_PATTERNS = [
  ['calendly', /calendly\.com/i],
  ['acuity', /acuityscheduling\.com/i],
  ['youcanbook', /youcanbook\.me/i],
  ['setmore', /setmore\./i],
  ['simplybook', /simplybook\./i],
  ['hubspot_meetings', /meetings\.hubspot\.com|hubspot\.com\/meetings/i],
  ['microsoft_bookings', /bookings\.microsoft\.com|microsoft\.com\/booking/i],
]

const TRACKING_SIGNALS = [
  ['ga/gtm', /gtag\(|googletagmanager\.com\/(gtm|gtag)/i],
  ['meta_pixel', /connect\.facebook\.net|fbq\(|meta pixel/i],
  ['hotjar', /hotjar/i],
  ['tiktok_pixel', /tiktok.*pixel/i],
]

async function fetchHtml(url, timeoutMs = 25000, maxBytes = 900_000) {
  if (!url) return null
  const controller = new AbortController()
  const t = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'user-agent': UA,
        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    })
    if (!res.ok) return null

    // best-effort size cap
    const reader = res.body?.getReader()
    if (!reader) return await res.text()

    const chunks = []
    let total = 0
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      if (value) {
        total += value.length
        if (total > maxBytes) break
        chunks.push(value)
      }
    }

    const buf = Buffer.concat(chunks)
    const ct = res.headers.get('content-type') || ''
    const m = /charset=([^;]+)/i.exec(ct)
    const charset = (m && m[1] ? m[1].trim().toLowerCase() : 'utf-8')

    // Node doesn't decode arbitrary charsets without iconv-lite; utf-8 only.
    if (charset !== 'utf-8' && charset !== 'utf8') {
      return buf.toString('utf8')
    }
    return buf.toString('utf8')
  } catch {
    return null
  } finally {
    clearTimeout(t)
  }
}

function extractAnchors(html) {
  if (!html) return []
  const out = []
  const re = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi
  let m
  while ((m = re.exec(html))) {
    const href = (m[1] || '').trim()
    const inner = (m[2] || '').replace(/<[^>]+>/g, ' ')
    const text = inner.replace(/\s+/g, ' ').trim().toLowerCase()
    if (!href) continue
    out.push({ href, text })
  }
  return out
}

function scoreKeyPage(absUrl, text) {
  let score = 0
  const u = absUrl.toLowerCase()
  const t = (text || '').toLowerCase()

  if (/(book|schedule|call|consult|appointment)/.test(t)) score += 4
  if (/(apply|application)/.test(t)) score += 4
  if (/(contact|reach)/.test(t)) score += 3

  if (/(\/book|\/schedule|\/call|\/consult|\/contact|\/apply)/.test(u)) score += 3
  if (/(calendly|acuity|youcanbook|setmore|simplybook|hubspot\.com\/meetings|meetings\.hubspot)/.test(u)) score += 5

  return score
}

function pickKeyPage(homeHtml, baseUrl) {
  if (!homeHtml || !baseUrl) return null
  const anchors = extractAnchors(homeHtml)
  const candidates = []
  for (const a of anchors) {
    const href = a.href
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) continue
    let abs
    try {
      abs = new URL(href, baseUrl).toString()
    } catch {
      continue
    }
    const s = scoreKeyPage(abs, a.text)
    if (s) candidates.push([s, abs])
  }
  if (!candidates.length) return null
  candidates.sort((x, y) => y[0] - x[0])
  return candidates[0][1]
}

function detectScheduler(corpus) {
  const h = (corpus || '').toString()
  for (const [code, re] of SCHEDULER_PATTERNS) {
    if (re.test(h)) return code
  }
  return null
}

function hasForm(corpus) {
  return /<form\b/i.test(corpus || '')
}

function detectTracking(corpus) {
  const signals = []
  for (const [code, re] of TRACKING_SIGNALS) {
    if (re.test(corpus || '')) signals.push(code)
  }
  return signals
}

function classifyGap(homeHtml, keyHtml, keyUrl) {
  const corpus = (homeHtml || '') + '\n' + (keyHtml || '')
  const scheduler = detectScheduler(corpus)
  const form = hasForm(homeHtml) || hasForm(keyHtml)

  let primary, supporting

  if (!keyUrl) {
    primary = ['slow_path', 'No clear contact/book/apply path from the site (users must hunt for next step).']
    supporting = [
      'Low conversion: no single CTA that captures intent.',
      'Hard to qualify/route inquiries (manual DMs/emails likely).',
    ]
  } else if (!scheduler) {
    primary = ['no_scheduler', 'No visible scheduling flow (no Calendly/Acuity/etc.) on the main CTA path.']
    supporting = [
      'Speed-to-contact risk: inbound leads wait for manual back-and-forth.',
      'No built-in qualification (no pre-call questions / routing).',
    ]
  } else if (!form) {
    primary = ['followup_missing', 'CTA relies on a scheduler only; no secondary capture (form/email) for leads who don’t book.']
    supporting = [
      'Lead leakage: visitors who hesitate have no fallback capture.',
      'Follow-up automation is unlikely without a capture + pipeline entry.',
    ]
  } else {
    primary = ['fragmented_stack', 'Multiple entry points (form + scheduler) but no evidence of a unified qualification + follow-up workflow.']
    supporting = [
      'Tracking/attribution likely incomplete (hard to tie source→appointment).',
      'Follow-up sequences and reminders may be inconsistent across channels.',
    ]
  }

  return { primary, supporting, scheduler, form }
}

function appendTag(existingTags, gapTag) {
  const parts = (existingTags || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    // drop old gap=... tags
    .filter((t) => !/^gap=/.test(t))

  parts.push(gapTag)
  // de-dupe
  return Array.from(new Set(parts)).join(',')
}

async function mcPost(path, payload) {
  const url = BASE + path
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${TOK}`,
    },
    body: JSON.stringify(payload),
  })
  const txt = await res.text()
  let json
  try {
    json = JSON.parse(txt)
  } catch {
    json = { ok: false, error: txt.slice(0, 300) }
  }
  if (!res.ok || !json.ok) {
    const err = json?.error || `HTTP_${res.status}`
    throw new Error(err)
  }
  return json
}

async function main() {
  const now = new Date()
  const cutoff = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)

  const eligible = await prisma.lead.findMany({
    where: {
      stage: 'NEW',
      // no recent NOTE touchpoint containing tech-gap marker
      touchpoints: {
        none: {
          type: 'NOTE',
          createdAt: { gte: cutoff },
          body: { contains: 'tech-gap', mode: 'insensitive' },
        },
      },
    },
    orderBy: { createdAt: 'asc' },
    take: 20,
    select: {
      id: true,
      email: true,
      company: true,
      name: true,
      websiteUrl: true,
      instagramUrl: true,
      linkedinUrl: true,
      tags: true,
      stage: true,
    },
  })

  const results = []

  const canWrite = Boolean(BASE && TOK)

  for (const lead of eligible) {
    const website = lead.websiteUrl
    const homeHtml = website ? await fetchHtml(website) : null
    const keyUrl = homeHtml && website ? pickKeyPage(homeHtml, website) : null
    const keyHtml = keyUrl ? await fetchHtml(keyUrl) : null

    const { primary, supporting, scheduler, form } = classifyGap(homeHtml, keyHtml, keyUrl)
    const tracking = detectTracking((homeHtml || '') + '\n' + (keyHtml || ''))

    const company = lead.company || lead.name || lead.email || lead.id

    const summary = [
      `TECH-GAP (auto) — ${company}`,
      `Primary bottleneck: ${primary[1]}`,
      `Supporting gaps: (1) ${supporting[0]} (2) ${supporting[1]}`,
      `Observed: key_page=${keyUrl || 'n/a'}; scheduler=${scheduler || 'none'}; form=${form ? 'yes' : 'no'}; tracking=${tracking.length ? tracking.join(',') : 'none'}`,
      `Tag: gap=${primary[0]}`,
    ].join('\n')

    const gapTag = `gap=${primary[0]}`
    const newTags = appendTag(lead.tags, gapTag)

    const row = {
      leadId: lead.id,
      leadEmail: lead.email,
      website,
      keyUrl,
      gap: primary[0],
      wrote: false,
      errors: [],
    }

    if (!canWrite) {
      row.errors.push('missing_service_token_or_base_url')
      results.push({ ...row, summary })
      continue
    }

    try {
      await mcPost('/api/service/touchpoints', {
        leadId: lead.id,
        channel: 'EMAIL',
        type: 'NOTE',
        subject: 'Tech-gap summary',
        body: summary,
        // do not change stage
      })

      await mcPost('/api/service/activity-events', {
        leadId: lead.id,
        type: 'gap_detected',
        payload: {
          gap: primary[0],
          websiteUrl: website || null,
          keyPage: keyUrl || null,
          scheduler: scheduler || null,
          hasForm: Boolean(form),
          tracking: tracking,
        },
      })

      await mcPost('/api/service/leads/upsert', {
        email: lead.email || undefined,
        stage: lead.stage,
        tags: newTags,
        websiteUrl: lead.websiteUrl || undefined,
        instagramUrl: lead.instagramUrl || undefined,
        linkedinUrl: lead.linkedinUrl || undefined,
        company: lead.company || undefined,
        name: lead.name || undefined,
      })

      row.wrote = true
      results.push(row)
    } catch (e) {
      row.errors.push(String(e.message || e))
      results.push({ ...row, summary })
    }

    await new Promise((r) => setTimeout(r, 450))
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        baseUrl: BASE || null,
        selected: eligible.length,
        wrote: results.filter((r) => r.wrote).length,
        failed: results.filter((r) => !r.wrote).length,
        results,
      },
      null,
      2
    )
  )
}

main()
  .catch((e) => {
    console.error(e)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
