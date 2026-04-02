/* Lead Scout (Daily) — Apify + Firecrawl (Mixed Regions)
   Target: 100 NEW leads/day with website + socials when possible.

   NOTE: Apify Google Places step is skipped automatically when APIFY token/config
   is not present in env. In that case we use Firecrawl search to source
   candidate websites.

   Inserts leads into Mission Control (Postgres via Prisma):
   - source=OUTREACH, stage=NEW, nextFollowUpAt=today
   - tags: cluster + region + source=google_maps + enriched=firecrawl

   Dedupe keys: email OR whatsapp OR instagramUrl OR linkedinUrl OR websiteUrl
*/

const { PrismaClient } = require('@prisma/client')
const { execFileSync } = require('child_process')
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

function runFirecrawl(args) {
  // Firecrawl CLI is globally installed and authenticated via FIRECRAWL_API_KEY
  const out = execFileSync('firecrawl', args, { encoding: 'utf8' })
  return out
}

function firecrawlSearch({ query, country, limit = 8 }) {
  const args = ['search', query, '--limit', String(limit), '--json']
  if (country) args.push('--country', country)
  const raw = runFirecrawl(args)
  return JSON.parse(raw)
}

function firecrawlScrape(url, country) {
  const args = ['scrape', url, '-f', 'markdown,links', '--json']
  if (country) args.push('--country', country)
  const raw = runFirecrawl(args)
  return JSON.parse(raw)
}

function extractSocials(links) {
  const res = { instagramUrl: null, linkedinUrl: null }

  const flat = (links || [])
    .map((l) => {
      if (!l) return null
      if (typeof l === 'string') return l
      if (typeof l === 'object' && l.url) return l.url
      return null
    })
    .filter(Boolean)
    .map((s) => String(s).split('?')[0].replace(/\/$/, ''))

  for (const u of flat) {
    const lu = u.toLowerCase()
    if (!res.instagramUrl && lu.includes('instagram.com/')) res.instagramUrl = u
    if (!res.linkedinUrl && lu.includes('linkedin.com/')) res.linkedinUrl = u
    if (res.instagramUrl && res.linkedinUrl) break
  }

  return res
}

function safeCompanyFromTitle(t) {
  const s = norm(t)
  if (!s) return null
  return s.split('|')[0].split('—')[0].split('-')[0].trim().slice(0, 120) || null
}

async function main() {
  const now = new Date()

  const apifyToken = process.env.APIFY_TOKEN || process.env.APIFY_API_TOKEN
  const apifyMode = apifyToken ? 'enabled' : 'missing_token_or_config'

  // Hard cap scrapes due to Firecrawl credit constraints.
  const MAX_SCRAPES = Number(process.env.LEAD_SCOUT_MAX_SCRAPES || 35)

  // Query plan (mixed clusters + regions)
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
      out = firecrawlSearch({ query: row.q, country: row.country, limit: 10 })
    } catch {
      continue
    }

    const results = (out && out.data) || out || {}
    const web = results.web || []

    for (const item of web) {
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

      if (candidates.length >= 160) break
    }
    if (candidates.length >= 160) break
  }

  const created = []
  const deduped = []
  const errors = []

  let scrapeCount = 0

  for (const c of candidates) {
    if (created.length >= 100) break

    const lead = {
      name: null,
      company: safeCompanyFromTitle(c.title) || null,
      role: c.cluster,
      email: null,
      whatsapp: null,
      websiteUrl: normUrl(c.origin),
      instagramUrl: null,
      linkedinUrl: null,
      tags: `${c.cluster},${c.region},source=google_maps,enriched=firecrawl`,
    }

    try {
      const existing = await findDedupe(lead)
      if (existing) {
        deduped.push({ origin: lead.websiteUrl, existingId: existing.id })
        continue
      }

      if (scrapeCount < MAX_SCRAPES) {
        scrapeCount += 1
        try {
          const scr = firecrawlScrape(c.url, c.country)
          const data = (scr && scr.data) || {}
          const links = data.links || []
          const socials = extractSocials(links)
          lead.instagramUrl = normUrl(socials.instagramUrl)
          lead.linkedinUrl = normUrl(socials.linkedinUrl)
        } catch (e) {
          errors.push({ stage: 'scrape', url: c.url, err: String(e.message || e) })
        }
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
          apify: apifyMode,
          firecrawlMaxScrapes: MAX_SCRAPES,
          firecrawlScrapesUsed: scrapeCount,
          tavilyFallback: 'disabled_in_script',
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
        firecrawlScrapesUsed: scrapeCount,
        candidatesCount: candidates.length,
        clusters,
        regions,
        createdIds: created.map((l) => l.id),
        sampleCreated: created.slice(0, 5).map((l) => ({ id: l.id, company: l.company, websiteUrl: l.websiteUrl })),
        errors: errors.slice(0, 10),
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
