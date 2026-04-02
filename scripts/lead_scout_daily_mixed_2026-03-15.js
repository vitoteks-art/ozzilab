/* Lead Scout (Daily) — Tavily-first fallback (Mixed Regions)
   Date: 2026-03-15

   Intended method (per runbook): Apify Google Places + Firecrawl scrape.
   This fallback script is used when:
   - APIFY_TOKEN missing, and/or
   - Firecrawl credits are insufficient.

   Inserts leads into Mission Control (Postgres via Prisma):
   - source=OUTREACH, stage=NEW, nextFollowUpAt=today

   Dedupe keys: email OR whatsapp OR instagramUrl OR linkedinUrl OR websiteUrl
*/

const { PrismaClient } = require('@prisma/client')
const { URL } = require('url')

const prisma = new PrismaClient()

function norm(v) {
  if (!v) return null
  const s = String(v).trim()
  return s.length ? s : null
}

function normUrl(v) {
  const s = norm(v)
  if (!s) return null
  return s.replace(/\/$/, '')
}

function baseOrigin(u) {
  try {
    const url = new URL(u)
    return `${url.protocol}//${url.host}`
  } catch {
    return null
  }
}

function regionFromCountry(cc) {
  const c = (cc || '').toUpperCase()
  if (['NG', 'GH', 'KE', 'ZA'].includes(c)) return 'AF'
  if (['GB', 'IE'].includes(c)) return 'UK'
  if (['DE', 'NL', 'FR', 'ES', 'IT', 'PT', 'BE', 'SE', 'NO', 'DK', 'FI', 'PL'].includes(c)) return 'EU'
  if (c === 'US') return 'US'
  if (c === 'CA') return 'CA'
  if (c === 'AU') return 'AU'
  return c || 'unknown'
}

async function findDedupe(lead) {
  const ors = []
  if (lead.email) ors.push({ email: lead.email.toLowerCase() })
  if (lead.whatsapp) ors.push({ whatsapp: lead.whatsapp })
  if (lead.instagramUrl) ors.push({ instagramUrl: lead.instagramUrl })
  if (lead.linkedinUrl) ors.push({ linkedinUrl: lead.linkedinUrl })
  if (lead.websiteUrl) ors.push({ websiteUrl: lead.websiteUrl })
  if (!ors.length) return null
  return prisma.lead.findFirst({ where: { OR: ors } })
}

async function tavilySearch({ query, country, max_results = 10 }) {
  const apiKey = process.env.TAVILY_API_KEY
  if (!apiKey) throw new Error('Missing TAVILY_API_KEY')

  // Tavily country param is not guaranteed; keep in query for steering.
  const q = country ? `${query} (${country})` : query

  const res = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      api_key: apiKey,
      query: q,
      max_results,
      include_answer: false,
      include_raw_content: false,
      include_images: false,
      search_depth: 'basic',
    }),
  })

  const text = await res.text()
  let body
  try {
    body = JSON.parse(text)
  } catch {
    body = { raw: text }
  }
  if (!res.ok) throw new Error(`Tavily search failed: ${res.status} ${res.statusText} :: ${text.slice(0, 200)}`)
  return body
}

async function fetchHtml(url, timeoutMs = 12000) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: ctrl.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; OzziLeadScout/1.0; +https://ozzi.ai)',
        Accept: 'text/html,application/xhtml+xml',
      },
    })
    if (!res.ok) return null
    const ct = (res.headers.get('content-type') || '').toLowerCase()
    if (!ct.includes('text/html')) return null
    const html = await res.text()
    return html
  } catch {
    return null
  } finally {
    clearTimeout(t)
  }
}

function extractSocialsFromHtml(html) {
  const out = { instagramUrl: null, linkedinUrl: null }
  if (!html) return out

  const hrefs = []
  const re = /href\s*=\s*['\"]([^'\"]+)['\"]/gi
  let m
  while ((m = re.exec(html))) {
    const u = String(m[1] || '').split('?')[0].replace(/\/$/, '')
    if (!u) continue
    hrefs.push(u)
  }

  for (const u of hrefs) {
    const lu = u.toLowerCase()
    if (!out.instagramUrl && lu.includes('instagram.com/')) out.instagramUrl = u
    if (!out.linkedinUrl && lu.includes('linkedin.com/')) out.linkedinUrl = u
    if (out.instagramUrl && out.linkedinUrl) break
  }

  return out
}

function extractEmailFromHtml(html) {
  if (!html) return null
  const m = html.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi)
  if (!m || !m.length) return null
  // Prefer non-generic if possible.
  const lowered = m.map((x) => x.toLowerCase())
  const nonGeneric = lowered.find((e) => !['info@', 'hello@', 'support@', 'contact@'].some((p) => e.startsWith(p)))
  return (nonGeneric || lowered[0] || null)
}

function extractPhoneFromHtml(html) {
  if (!html) return null
  // very light heuristic; keep digits + leading +
  const m = html.match(/(\+?\d[\d\s().-]{7,}\d)/)
  if (!m) return null
  const raw = m[1]
  const cleaned = raw.replace(/\s+/g, ' ').trim()
  return cleaned.length <= 30 ? cleaned : cleaned.slice(0, 30)
}

function safeCompanyFromTitle(t, origin) {
  const s = norm(t)
  if (s) {
    const cut = s.split('|')[0].split('—')[0].split('-')[0].trim()
    if (cut) return cut.slice(0, 120)
  }
  if (origin) {
    try {
      const u = new URL(origin)
      return u.hostname.replace(/^www\./, '').slice(0, 120)
    } catch {
      return null
    }
  }
  return null
}

function fallbackEmailFromOrigin(origin) {
  try {
    const u = new URL(origin)
    const host = u.hostname.replace(/^www\./, '')
    if (!host || !host.includes('.')) return null
    return `contact@${host}`.toLowerCase()
  } catch {
    return null
  }
}

async function main() {
  const now = new Date()
  const apifyToken = process.env.APIFY_TOKEN || process.env.APIFY_API_TOKEN
  const firecrawlKey = process.env.FIRECRAWL_API_KEY

  const constraints = {
    apify: apifyToken ? 'enabled' : 'missing_token_or_config',
    firecrawl: firecrawlKey ? 'configured_but_not_used' : 'missing_key',
    firecrawlReason: 'insufficient_credits_observed_in_prior_run',
    tavily: 'used_for_sourcing_and_enrichment',
  }

  const queryPlan = [
    // law firms
    { cluster: 'law_firm', country: 'GB', q: 'solicitors firm contact' },
    { cluster: 'law_firm', country: 'US', q: 'law firm contact' },
    { cluster: 'law_firm', country: 'AU', q: 'lawyers contact' },

    // dentists
    { cluster: 'dentist', country: 'CA', q: 'dentist clinic contact' },
    { cluster: 'dentist', country: 'US', q: 'dental practice contact' },
    { cluster: 'dentist', country: 'GB', q: 'dental practice contact' },

    // real estate
    { cluster: 'real_estate', country: 'GB', q: 'estate agents contact' },
    { cluster: 'real_estate', country: 'US', q: 'real estate agency contact' },
    { cluster: 'real_estate', country: 'AU', q: 'real estate agency contact' },
    { cluster: 'real_estate', country: 'NG', q: 'real estate company contact' },

    // coaches/consultants
    { cluster: 'coach_consultant', country: 'US', q: 'business coach contact' },
    { cluster: 'coach_consultant', country: 'GB', q: 'executive coach contact' },
    { cluster: 'coach_consultant', country: 'IE', q: 'leadership coach contact' },
    { cluster: 'coach_consultant', country: 'ZA', q: 'business coach contact' },

    // ecommerce
    { cluster: 'ecommerce', country: 'US', q: 'online store contact us' },
    { cluster: 'ecommerce', country: 'GB', q: 'online store contact us' },
    { cluster: 'ecommerce', country: 'CA', q: 'Canadian online store contact us' },
    { cluster: 'ecommerce', country: 'AU', q: 'Australian online store contact us' },

    // automation integrators
    { cluster: 'automation_integrator', country: 'US', q: 'Zapier automation agency contact' },
    { cluster: 'automation_integrator', country: 'GB', q: 'automation agency contact' },
    { cluster: 'automation_integrator', country: 'DE', q: 'automation agency contact' },
    { cluster: 'automation_integrator', country: 'NG', q: 'automation agency contact' },
  ]

  const candidates = []
  const seenOrigins = new Set()

  for (const row of queryPlan) {
    let out
    try {
      out = await tavilySearch({ query: row.q, country: row.country, max_results: 12 })
    } catch {
      continue
    }

    const results = out.results || []

    for (const item of results) {
      const url = norm(item.url)
      if (!url) continue
      const origin = baseOrigin(url)
      if (!origin) continue
      if (seenOrigins.has(origin)) continue
      seenOrigins.add(origin)

      candidates.push({
        cluster: row.cluster,
        country: row.country,
        region: regionFromCountry(row.country),
        url,
        origin,
        title: item.title || null,
      })

      if (candidates.length >= 260) break
    }
    if (candidates.length >= 260) break
  }

  const created = []
  const deduped = []
  const errors = []

  // Keep HTTP fetches bounded.
  const MAX_ENRICH_FETCHES = Number(process.env.LEAD_SCOUT_MAX_FETCHES || 120)
  let enrichFetches = 0

  for (const c of candidates) {
    if (created.length >= 100) break

    const websiteUrl = normUrl(c.origin)

    // light enrichment from homepage HTML
    let html = null
    if (enrichFetches < MAX_ENRICH_FETCHES) {
      html = await fetchHtml(websiteUrl)
      enrichFetches++
    }

    const socials = extractSocialsFromHtml(html)
    const email = extractEmailFromHtml(html) || fallbackEmailFromOrigin(websiteUrl)
    const phone = extractPhoneFromHtml(html)

    const lead = {
      email: email || null,
      whatsapp: phone || null,
      name: null,
      company: safeCompanyFromTitle(c.title, c.origin),
      role: null,
      websiteUrl,
      instagramUrl: normUrl(socials.instagramUrl),
      linkedinUrl: normUrl(socials.linkedinUrl),
      tags: [
        c.cluster,
        c.region,
        'source=tavily_search',
        html ? 'enriched=http_fetch' : 'enriched=none',
      ].join(','),
    }

    try {
      const existing = await findDedupe(lead)
      if (existing) {
        deduped.push({ id: existing.id, websiteUrl: existing.websiteUrl })
        continue
      }

      const row = await prisma.lead.create({
        data: {
          email: lead.email,
          whatsapp: lead.whatsapp,
          name: lead.name,
          company: lead.company,
          role: lead.role,
          websiteUrl: lead.websiteUrl,
          instagramUrl: lead.instagramUrl,
          linkedinUrl: lead.linkedinUrl,
          tags: lead.tags,
          source: 'OUTREACH',
          stage: 'NEW',
          nextFollowUpAt: now,
        },
      })

      created.push(row)
    } catch (e) {
      errors.push({ stage: 'insert', url: c.url, err: String(e.message || e) })
    }
  }

  const clusters = created.reduce((acc, l) => {
    const tags = (l.tags || '').split(',').map((s) => s.trim()).filter(Boolean)
    const cluster = tags[0] || 'unknown'
    acc[cluster] = (acc[cluster] || 0) + 1
    return acc
  }, {})

  const regions = created.reduce((acc, l) => {
    const tags = (l.tags || '').split(',').map((s) => s.trim()).filter(Boolean)
    const region = tags[1] || 'unknown'
    acc[region] = (acc[region] || 0) + 1
    return acc
  }, {})

  await prisma.activityEvent.create({
    data: {
      type: 'leads_scouted',
      actorType: 'SYSTEM',
      actorId: null,
      entityType: 'LEAD',
      entityId: `daily_mixed_${now.toISOString().slice(0, 10)}`,
      payload: {
        wave: 'apify_firecrawl',
        count: created.length,
        regions,
        clusters,
        leadIds: created.map((l) => l.id),
        constraints: {
          ...constraints,
          candidatesCount: candidates.length,
          maxEnrichFetches: MAX_ENRICH_FETCHES,
          enrichFetchesUsed: enrichFetches,
        },
      },
    },
  })

  console.log(
    JSON.stringify(
      {
        ok: true,
        createdCount: created.length,
        dedupedCount: deduped.length,
        candidatesCount: candidates.length,
        enrichFetchesUsed: enrichFetches,
        clusters,
        regions,
        createdIds: created.map((l) => l.id),
        sampleCreated: created.slice(0, 5).map((l) => ({ id: l.id, company: l.company, websiteUrl: l.websiteUrl })),
        errors: errors.slice(0, 10),
        constraints,
      },
      null,
      2
    )
  )
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
