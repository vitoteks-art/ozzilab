/* Lead Scout — Wave 1 (AF/UK/EU) — 2026-03-09
   Inserts 7 outreach leads into Mission Control (Postgres via Prisma).

   Regions: English-speaking Africa + UK/EU (English-first)
   Clusters: automation_need, high_ticket_coach, ecommerce, real_estate
*/

const { PrismaClient } = require('@prisma/client')

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

async function main() {
  const now = new Date()

  const leads = [
    // Ghana — industrial automation (automation-need)
    {
      name: null,
      company: 'The Automation Ghana Group',
      role: 'Industrial Automation / Electrical & Automation Services',
      email: 'enquiries@automationghana.com',
      whatsapp: null,
      websiteUrl: 'https://automationghana.com/contact-us/',
      instagramUrl: 'https://www.instagram.com/automationgh/',
      linkedinUrl: 'https://www.linkedin.com/company/the-automation-ghana-limited/',
      tags: 'automation_need,AF',
    },

    // South Africa — automation integration (automation-need)
    {
      name: null,
      company: 'S4 Integration',
      role: 'Industrial Automation Integrator',
      email: 'sales@s4.co.za',
      whatsapp: null,
      websiteUrl: 'https://www.s4.co.za/',
      instagramUrl: null,
      linkedinUrl: 'https://www.linkedin.com/company/s4-integration/',
      tags: 'automation_need,AF',
    },

    // UK — real estate (Nottinghamshire)
    {
      name: null,
      company: 'Watsons Estate Agents (Kimberley)',
      role: 'Estate Agency',
      email: 'mail@watsons-residential.co.uk',
      whatsapp: null,
      websiteUrl: 'https://www.watsons-residential.co.uk/contact-us/',
      instagramUrl: null,
      linkedinUrl: null,
      tags: 'real_estate,UK',
    },

    // UK — real estate (London)
    // Note: email is present in search snippet / site footer; contact page is a form.
    {
      name: null,
      company: 'Alliance London Estate Agents',
      role: 'Estate Agency',
      email: 'info@alliance-london.co.uk',
      whatsapp: null,
      websiteUrl: 'https://www.alliance-london.co.uk/',
      instagramUrl: 'https://www.instagram.com/alliance_london/',
      linkedinUrl: 'https://www.linkedin.com/company/alliance-london/',
      tags: 'real_estate,UK',
    },

    // Germany (Berlin) — real estate (EU)
    {
      name: null,
      company: 'First Citiz GmbH',
      role: 'Real Estate Agency (Berlin)',
      email: 'contact@firstcitiz.com',
      whatsapp: null,
      websiteUrl: 'https://www.firstcitiz.com/',
      instagramUrl: 'https://www.instagram.com/firstcitizberlin/',
      linkedinUrl: 'https://de.linkedin.com/company/firstcitiz',
      tags: 'real_estate,EU',
    },

    // UK — high-ticket coaching
    {
      name: 'Steve Chadwick',
      company: 'Steve Chadwick Coaching',
      role: 'Business Coach / Mindset Consultant',
      email: 'steve@stevechadwick.co.uk',
      whatsapp: null,
      websiteUrl: 'https://www.stevechadwick.co.uk/',
      instagramUrl: null,
      linkedinUrl: 'https://uk.linkedin.com/in/steve-chadwick-43478b13',
      tags: 'high_ticket_coach,UK',
    },

    // UK — e-commerce
    {
      name: null,
      company: 'Preppers Shop UK',
      role: 'E-commerce (Survival / Outdoor / Military Surplus)',
      email: 'hello@preppersshop.co.uk',
      whatsapp: null,
      websiteUrl: 'https://www.preppersshop.co.uk/',
      instagramUrl: 'https://www.instagram.com/preppersshopuk/',
      linkedinUrl: null,
      tags: 'ecommerce,UK',
    },
  ].map((l) => ({
    ...l,
    email: norm(l.email)?.toLowerCase(),
    whatsapp: norm(l.whatsapp),
    websiteUrl: normUrl(l.websiteUrl),
    instagramUrl: normUrl(l.instagramUrl),
    linkedinUrl: normUrl(l.linkedinUrl),
    name: norm(l.name),
    company: norm(l.company),
    role: norm(l.role),
    tags: norm(l.tags),
  }))

  const created = []
  const deduped = []

  for (const lead of leads) {
    const existing = await findDedupe(lead)
    if (existing) {
      deduped.push({ lead, existingId: existing.id })
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
  }

  const clusters = created.reduce((acc, l) => {
    const tags = (l.tags || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    const cluster = tags[0] || 'unknown'
    acc[cluster] = (acc[cluster] || 0) + 1
    return acc
  }, {})

  await prisma.activityEvent.create({
    data: {
      type: 'leads_scouted',
      actorType: 'SYSTEM',
      actorId: null,
      entityType: 'LEAD',
      entityId: `wave1_AF_UK_EU_${now.toISOString().slice(0, 10)}`,
      payload: {
        wave: 1,
        region: 'AF/UK/EU',
        count: created.length,
        clusters,
        leadIds: created.map((l) => l.id),
      },
    },
  })

  console.log(JSON.stringify({ ok: true, createdCount: created.length, created, deduped }, null, 2))
}

main()
  .catch((e) => {
    console.error(e)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
