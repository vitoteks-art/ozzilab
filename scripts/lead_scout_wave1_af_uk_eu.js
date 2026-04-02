/* Lead Scout — Wave 1 (AF/UK/EU)
   Inserts 7 outreach leads into Mission Control (Postgres via Prisma).

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
    // Ghana — automation-need (agency)
    {
      name: null,
      company: 'Focus Agency Ghana',
      role: 'Digital Marketing Agency',
      email: 'services@focusagencyghana.com',
      whatsapp: null,
      websiteUrl: 'https://focusagencyghana.com/',
      instagramUrl: null,
      linkedinUrl: 'https://gh.linkedin.com/company/focus-agency-ghana',
      tags: 'automation_need,AF',
    },

    // Nigeria — real estate / property investment
    {
      name: null,
      company: 'LandWey',
      role: 'Real Estate / Property Investment',
      email: 'info@landwey.ng',
      whatsapp: null,
      websiteUrl: 'https://landwey.ng/',
      instagramUrl: 'https://www.instagram.com/landwey/',
      linkedinUrl: 'https://ng.linkedin.com/company/landwey',
      tags: 'real_estate,AF',
    },

    // South Africa — e-commerce
    {
      name: null,
      company: 'Faithful to Nature',
      role: 'E-commerce (Health & Wellness)',
      email: 'support@faithful-to-nature.co.za',
      whatsapp: '+27648360749',
      websiteUrl: 'https://www.faithful-to-nature.co.za/',
      instagramUrl: 'https://www.instagram.com/faithfultonature/',
      linkedinUrl: 'https://za.linkedin.com/company/faithful-to-nature',
      tags: 'ecommerce,AF',
    },

    // UK — legal (automation-need)
    {
      name: 'Craig Gee',
      company: 'Craig Gee Solicitors',
      role: 'Solicitor / Law Firm',
      email: 'craig@craiggee.com',
      whatsapp: null,
      websiteUrl: 'https://craiggee.com/',
      instagramUrl: null,
      linkedinUrl: 'https://uk.linkedin.com/in/craig-gee-26786922',
      tags: 'automation_need,UK',
    },

    // UK — real estate
    {
      name: null,
      company: 'PG Estates',
      role: 'Estate & Letting Agents',
      email: 'islington@pgestates.com',
      whatsapp: null,
      websiteUrl: 'https://www.pgestates.com/',
      instagramUrl: 'https://www.instagram.com/islingtonagent/',
      linkedinUrl: 'https://uk.linkedin.com/company/pg-estates',
      tags: 'real_estate,UK',
    },

    // UK — real estate
    {
      name: null,
      company: 'Holmes Estate Agents',
      role: 'Estate & Letting Agents',
      email: 'info@holmesestates.com',
      whatsapp: null,
      websiteUrl: 'https://www.holmesestates.com/',
      instagramUrl: null,
      linkedinUrl: 'https://uk.linkedin.com/company/holmes-estate-agents-streatham',
      tags: 'real_estate,UK',
    },

    // UK — clinic (automation-need)
    {
      name: null,
      company: 'Private Medical Clinic',
      role: 'Private GP Clinics',
      email: 'hello@privatemedicalclinic.co.uk',
      whatsapp: null,
      websiteUrl: 'https://www.privatemedicalclinic.com/',
      instagramUrl: null,
      linkedinUrl: null,
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
    const tags = (l.tags || '').split(',').map((s) => s.trim()).filter(Boolean)
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
