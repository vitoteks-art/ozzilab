/* Lead Scout — Wave 3 (AU)
   Inserts 6 outreach leads into Mission Control (Postgres via Prisma).
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
    {
      // e-commerce
      name: null,
      company: 'Koala',
      role: 'Customer Support',
      email: 'support@koala.com',
      whatsapp: null,
      websiteUrl: 'https://au.koala.com/',
      instagramUrl: 'https://www.instagram.com/koala/',
      linkedinUrl: 'https://au.linkedin.com/company/koala-aussie-furniture',
      tags: 'ecommerce,AU',
    },
    {
      // e-commerce
      name: null,
      company: 'frank body',
      role: 'Customer Support',
      email: 'getnaked@frankbody.com',
      whatsapp: null,
      websiteUrl: 'https://www.frankbody.com/au/',
      instagramUrl: 'https://www.instagram.com/frank_bod/',
      linkedinUrl: 'https://au.linkedin.com/company/frank-body',
      tags: 'ecommerce,AU',
    },
    {
      // e-commerce
      name: null,
      company: 'THE ICONIC',
      role: 'Brand Onboarding / Partnerships',
      email: 'info@theiconic.com.au',
      whatsapp: null,
      websiteUrl: 'https://www.theiconic.com.au/',
      instagramUrl: 'https://www.instagram.com/theiconicau/',
      linkedinUrl: 'https://au.linkedin.com/company/the-iconic',
      tags: 'ecommerce,AU',
    },
    {
      // professional services (automation-need)
      name: null,
      company: 'Inline Partners',
      role: 'Accounting / Bookkeeping',
      email: 'contact@inlinepartners.com.au',
      whatsapp: null,
      websiteUrl: 'https://inlinepartners.com.au/',
      instagramUrl: 'https://www.instagram.com/inlinepartners/',
      linkedinUrl: 'https://au.linkedin.com/company/inlinepartners',
      tags: 'automation_need,AU',
    },
    {
      // professional services (automation-need)
      name: 'Anatole Kabov',
      company: 'AGI Bookkeeping',
      role: 'Director',
      email: 'anatole@agibookkeeping.com.au',
      whatsapp: null,
      websiteUrl: 'https://www.agibookkeeping.com.au/',
      instagramUrl: null,
      linkedinUrl: 'https://au.linkedin.com/company/agi-bookkeeping',
      tags: 'automation_need,AU',
    },
    {
      // real estate
      name: 'Thomas McGlynn',
      company: 'BresicWhitney',
      role: 'Director | CEO',
      email: 'thomas@bresicwhitney.com.au',
      whatsapp: null,
      websiteUrl: 'https://bresicwhitney.com.au/',
      instagramUrl: 'https://www.instagram.com/thomasmcglynn/',
      linkedinUrl: 'https://www.linkedin.com/in/thomas-mcglynn-96604464/',
      tags: 'real_estate,AU',
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

  await prisma.activityEvent.create({
    data: {
      type: 'leads_scouted',
      actorType: 'OZZI',
      actorId: null,
      entityType: 'LEAD',
      entityId: `wave3_AU_${now.toISOString().slice(0, 10)}`,
      payload: {
        wave: 3,
        region: 'AU',
        count: created.length,
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
