/* Lead Scout — Wave 3 (AU) — 2026-03-08
   Inserts 6 NEW outreach leads into Mission Control (Postgres via Prisma).
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
  const now = new Date('2026-03-08T23:00:00+01:00') // Africa/Lagos reference time

  const leads = [
    {
      // automation-need (agency)
      name: null,
      company: 'Rapid Media',
      role: 'General Enquiries',
      email: 'careers@rapidmedia.com.au',
      whatsapp: null,
      websiteUrl: 'https://rapidmedia.com.au/',
      instagramUrl: 'https://www.instagram.com/rapidmediaau/',
      linkedinUrl: 'https://www.linkedin.com/company/rapid-media/',
      tags: 'automation_need,AU',
    },
    {
      // e-commerce
      name: null,
      company: 'Koala',
      role: 'Trade / Commercial Enquiries',
      email: 'commercial@koala.com',
      whatsapp: null,
      websiteUrl: 'https://au.koala.com/',
      instagramUrl: 'https://www.instagram.com/koala/',
      linkedinUrl: 'https://au.linkedin.com/company/koala-aussie-furniture',
      tags: 'ecommerce,AU',
    },
    {
      // e-commerce
      name: null,
      company: 'The Oodie',
      role: 'Customer Support',
      email: 'help@theoodie.com',
      whatsapp: null,
      websiteUrl: 'https://theoodie.com/',
      instagramUrl: 'https://www.instagram.com/the_oodie/',
      linkedinUrl: 'https://au.linkedin.com/company/the-oodie',
      tags: 'ecommerce,AU',
    },
    {
      // e-commerce
      name: null,
      company: 'Bellroy',
      role: 'Customer Support',
      email: 'support@bellroy.com',
      whatsapp: null,
      websiteUrl: 'https://bellroy.com/',
      instagramUrl: 'https://www.instagram.com/bellroy/',
      linkedinUrl: 'https://au.linkedin.com/company/bellroy',
      tags: 'ecommerce,AU',
    },
    {
      // real estate
      name: null,
      company: 'TEAM Estate Agents',
      role: 'General Enquiries',
      email: 'team@qteam.com.au',
      whatsapp: null,
      websiteUrl: 'https://teamestateagents.com.au/',
      instagramUrl: 'https://www.instagram.com/teamestate/',
      linkedinUrl: 'https://www.linkedin.com/company/teamestateagents',
      tags: 'real_estate,AU',
    },
    {
      // high-ticket coach / professional services
      name: null,
      company: 'Tenfold Business Coaching',
      role: 'Discovery / Growth Team',
      email: 'discovery@tenfoldcoaching.com.au',
      whatsapp: null,
      websiteUrl: 'https://tenfoldcoaching.com.au/',
      instagramUrl: 'https://www.instagram.com/tenfoldbusinesscoaching/',
      linkedinUrl: 'https://au.linkedin.com/company/tenfold-business-coaching',
      tags: 'high_ticket_coach,AU',
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
        dedupedCount: deduped.length,
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
