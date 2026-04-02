/* Lead Scout — Wave 1 (AF/UK/EU) — 2026-03-08
   Inserts 7 NEW outreach leads into Mission Control (Postgres via Prisma).

   Regions: English-speaking Africa + UK/EU (English-first)
   Clusters: automation_need businesses, high-ticket coaches, e-commerce, real estate
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
    // UK — automation_need (digital marketing agency)
    {
      name: null,
      company: 'Propellernet',
      role: 'Digital Marketing Agency (SEO, Paid, Digital PR)',
      email: 'hello@propellernet.co.uk',
      whatsapp: null,
      websiteUrl: 'https://www.propellernet.co.uk/',
      instagramUrl: 'https://www.instagram.com/propellernet/',
      linkedinUrl: 'https://uk.linkedin.com/company/propellernet',
      tags: 'automation_need,UK',
    },

    // UK — high-ticket coaching
    {
      name: null,
      company: 'Enigma (Enigma CCS)',
      role: 'Business Coaching / Consultancy',
      email: 'info@enigmaccs.co.uk',
      whatsapp: null,
      websiteUrl: 'https://enigmaccs.co.uk/',
      instagramUrl: 'https://www.instagram.com/enigma_ltd/',
      linkedinUrl: 'https://uk.linkedin.com/company/enigmacoachingltd',
      tags: 'high_ticket_coach,UK',
    },

    // UK — e-commerce
    {
      name: null,
      company: 'Gymshark',
      role: 'E-commerce (Fitness Apparel)',
      email: 'support@gymshark.com',
      whatsapp: null,
      websiteUrl: 'https://www.gymshark.com/',
      instagramUrl: 'https://www.instagram.com/gymshark/',
      linkedinUrl: 'https://uk.linkedin.com/company/gymshark',
      tags: 'ecommerce,UK',
    },

    // UK — e-commerce
    {
      name: null,
      company: 'Cult Beauty',
      role: 'E-commerce (Beauty Retail)',
      email: 'customerservice@cultbeauty.co.uk',
      whatsapp: null,
      websiteUrl: 'https://www.cultbeauty.co.uk/',
      instagramUrl: 'https://www.instagram.com/cultbeauty/',
      linkedinUrl: 'https://www.linkedin.com/company/cult-beauty',
      tags: 'ecommerce,UK',
    },

    // South Africa — real estate
    {
      name: null,
      company: 'Pam Golding Properties',
      role: 'Real Estate (Sales & Rentals)',
      email: 'info@pamgolding.co.za',
      whatsapp: null,
      websiteUrl: 'https://www.pamgolding.co.za/',
      instagramUrl: 'https://www.instagram.com/pamgoldinggroup/',
      linkedinUrl: 'https://za.linkedin.com/company/pam-golding-properties',
      tags: 'real_estate,AF',
    },

    // Nigeria — automation_need (influencer marketing platform/agency)
    {
      name: null,
      company: 'Diglancers',
      role: 'Influencer Marketing Agency & UGC Creator Platform',
      email: 'contact@diglancers.com',
      whatsapp: '+2348163986687',
      websiteUrl: 'https://diglancers.com/',
      instagramUrl: 'https://www.instagram.com/diglancers/',
      linkedinUrl: null,
      tags: 'automation_need,AF',
    },

    // UK — automation_need (performance marketing)
    {
      name: null,
      company: 'Impression',
      role: 'Digital Performance Marketing Agency (SEO, PPC, Digital PR)',
      email: 'hello@impression.co.uk',
      whatsapp: null,
      websiteUrl: 'https://www.impressiondigital.com/',
      instagramUrl: 'https://www.instagram.com/impressiontalk/',
      linkedinUrl: 'https://uk.linkedin.com/company/impression-digital-limited',
      tags: 'automation_need,UK',
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
