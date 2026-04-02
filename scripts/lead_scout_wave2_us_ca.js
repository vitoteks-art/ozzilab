/* Lead Scout — Wave 2 (US/CA)
   Inserts 7 outreach leads into Mission Control (Postgres via Prisma).

   Regions: US + Canada (English)
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
    // US — automation_need (marketing agency)
    {
      name: 'Sara Arjmand',
      company: 'Formula Marketing',
      role: 'Digital Marketing Agency (Hospitality/Restaurants)',
      email: 'hello@formulamarketingsd.com',
      whatsapp: null,
      websiteUrl: 'https://www.formulamarketingsd.com/',
      instagramUrl: 'https://www.instagram.com/formulamarketingsd/',
      linkedinUrl: 'https://www.linkedin.com/company/formula-marketing-san-diego',
      tags: 'automation_need,US',
    },

    // US — e-commerce
    {
      name: null,
      company: 'Beardbrand',
      role: 'E-commerce (Men\'s Grooming Products)',
      email: 'support@beardbrand.com',
      whatsapp: null,
      websiteUrl: 'https://www.beardbrand.com/',
      instagramUrl: 'https://www.instagram.com/beardbrand/',
      linkedinUrl: 'https://www.linkedin.com/company/beardbrand',
      tags: 'ecommerce,US',
    },

    // US — automation_need (agency)
    {
      name: null,
      company: 'Digital Marketing Agency LLC',
      role: 'Digital Marketing / Web & Software Development',
      email: 'sales@digitalmarketingagencyllc.com',
      whatsapp: null,
      websiteUrl: 'https://www.digitalmarketingagencyllc.com/',
      instagramUrl: null,
      linkedinUrl: 'https://www.linkedin.com/company/digital-marketing-agency-llc',
      tags: 'automation_need,US',
    },

    // CA — real estate / property management
    {
      name: null,
      company: 'Pacific Quorum Properties Inc.',
      role: 'Property Management (Strata, Rental & Commercial)',
      email: 'info@pacificquorum.com',
      whatsapp: null,
      websiteUrl: 'https://pacificquorum.com/',
      instagramUrl: 'https://www.instagram.com/pacificquorumproperties/',
      linkedinUrl: 'https://ca.linkedin.com/company/pacific-quorum-properties-inc-',
      tags: 'real_estate,CA',
    },

    // CA — real estate / property management
    {
      name: null,
      company: 'VADA Property Management',
      role: 'Property Management (Metro Vancouver)',
      email: 'info@vadapm.com',
      whatsapp: null,
      websiteUrl: 'https://vadapm.com/',
      instagramUrl: 'https://www.instagram.com/vadapmanagement/',
      linkedinUrl: 'https://ca.linkedin.com/company/vadapm',
      tags: 'real_estate,CA',
    },

    // CA — real estate / property management
    {
      name: null,
      company: 'Del Condominium Rentals',
      role: 'Condo Rental & Property Management',
      email: 'info@delrentals.com',
      whatsapp: null,
      websiteUrl: 'https://www.delrentals.com/',
      instagramUrl: 'https://www.instagram.com/delrentals/',
      linkedinUrl: 'https://ca.linkedin.com/company/delrentals',
      tags: 'real_estate,CA',
    },

    // CA — high-ticket coaching
    {
      name: 'Dan Sullivan',
      company: 'Strategic Coach',
      role: 'Business Coaching for Entrepreneurs',
      email: 'info@strategiccoach.com',
      whatsapp: null,
      websiteUrl: 'https://www.strategiccoach.com/',
      instagramUrl: 'https://www.instagram.com/strategic.coach/',
      linkedinUrl: 'https://www.linkedin.com/company/strategic-coach',
      tags: 'high_ticket_coach,CA',
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
      entityId: `wave2_US_CA_${now.toISOString().slice(0, 10)}`,
      payload: {
        wave: 2,
        region: 'US/CA',
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
