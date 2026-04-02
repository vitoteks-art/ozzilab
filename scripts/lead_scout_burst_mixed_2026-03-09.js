/* Lead Scout — Burst 20 (Mixed Regions)
   Inserts 20 outreach leads into Mission Control (Postgres via Prisma).

   Regions: AF/UK/EU + US/CA + AU (English-first)
   Clusters: automation_need_business, high_ticket_coach, ecommerce, real_estate

   Rules:
   - Hard dedupe against CRM (email OR whatsapp OR instagramUrl OR linkedinUrl OR websiteUrl)
   - Insert: source=OUTREACH, stage=NEW, nextFollowUpAt=today, tags include cluster + region
   - No outreach sending
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

function countByTag(created, idx) {
  return created.reduce((acc, l) => {
    const tags = (l.tags || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    const key = tags[idx] || 'unknown'
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})
}

async function main() {
  const now = new Date()

  const leads = [
    // automation_need_business (5)
    {
      name: null,
      company: 'GWX Logistics (Greater Washington NG)',
      role: 'Logistics / Courier / Supply Chain (Lagos, Nigeria)',
      email: 'info@greaterwashingtonng.com',
      whatsapp: '+2347042929292',
      websiteUrl: 'https://www.greaterwashingtonng.com/',
      instagramUrl: null,
      linkedinUrl: null,
      tags: 'automation_need_business,AF',
    },
    {
      name: null,
      company: 'GM Professional Accountants',
      role: 'Accounting / Tax / Bookkeeping (London, UK)',
      email: 'info@gmprofessionalaccountants.co.uk',
      whatsapp: null,
      websiteUrl: 'https://gmprofessionalaccountants.co.uk/contact/',
      instagramUrl: null,
      linkedinUrl: null,
      tags: 'automation_need_business,UK',
    },
    {
      name: null,
      company: 'Space Rocket',
      role: 'Digital Marketing & Web Design Agency (Berlin, Germany)',
      email: 'info@space-rocket.de',
      whatsapp: null,
      websiteUrl: 'https://www.space-rocket.de/',
      instagramUrl: null,
      linkedinUrl: null,
      tags: 'automation_need_business,EU',
    },
    {
      name: null,
      company: 'Brafton',
      role: 'Content Marketing / SEO / Performance Marketing Agency (US)',
      email: 'info@brafton.com',
      whatsapp: null,
      websiteUrl: 'https://www.brafton.com/',
      instagramUrl: 'https://www.instagram.com/brafton/',
      linkedinUrl: 'https://www.linkedin.com/company/brafton/',
      tags: 'automation_need_business,US',
    },
    {
      name: null,
      company: 'DSIGNS',
      role: 'Web Design & Digital Marketing Agency (Sydney, AU)',
      email: 'hello@dsigns.com.au',
      whatsapp: null,
      websiteUrl: 'https://www.dsigns.com.au/',
      instagramUrl: null,
      linkedinUrl: null,
      tags: 'automation_need_business,AU',
    },

    // high_ticket_coach (5)
    {
      name: 'Kieran Perry',
      company: null,
      role: 'Business Coach (London, UK)',
      email: 'info@kieranperry.com',
      whatsapp: null,
      websiteUrl: 'https://www.kieranperry.com/business-coach/',
      instagramUrl: null,
      linkedinUrl: null,
      tags: 'high_ticket_coach,UK',
    },
    {
      name: null,
      company: 'i-coach',
      role: 'Executive / Leadership Coaching (UK)',
      email: 'info@i-coach.co.uk',
      whatsapp: null,
      websiteUrl: 'https://www.i-coach.co.uk/',
      instagramUrl: null,
      linkedinUrl: null,
      tags: 'high_ticket_coach,UK',
    },
    {
      name: 'Fiona Carmody',
      company: 'Business in Mind',
      role: 'Business & Executive Coaching (Dublin, Ireland)',
      email: 'info@businessinmind.ie',
      whatsapp: null,
      websiteUrl: 'https://www.businessinmind.ie/services/business-and-executive-coaching-dublin-ireland-fiona-carmody-business-consultant-coach/',
      instagramUrl: null,
      linkedinUrl: null,
      tags: 'high_ticket_coach,EU',
    },
    {
      name: null,
      company: 'The Leadership Group Limited',
      role: 'Executive Coaching & Mentorship (Nairobi, Kenya)',
      email: 'info@leadershipgroup.co.ke',
      whatsapp: '+254715313244',
      websiteUrl: 'https://www.leadershipgroup.co.ke/solution/14/Executive-Coaching-&-Mentorship',
      instagramUrl: null,
      linkedinUrl: null,
      tags: 'high_ticket_coach,AF',
    },
    {
      name: null,
      company: 'ActionCOACH',
      role: 'Business Coaching (Global / US)',
      email: 'info@actioncoach.com',
      whatsapp: null,
      websiteUrl: 'https://www.actioncoach.com/',
      instagramUrl: 'https://www.instagram.com/actioncoach/',
      linkedinUrl: 'https://www.linkedin.com/company/actioncoach/',
      tags: 'high_ticket_coach,US',
    },

    // ecommerce (5)
    {
      name: null,
      company: 'Gymshark',
      role: 'E-commerce (Fitness Apparel)',
      email: 'support@gymshark.com',
      whatsapp: null,
      websiteUrl: 'https://www.gymshark.com/',
      instagramUrl: 'https://www.instagram.com/gymshark/',
      linkedinUrl: 'https://www.linkedin.com/company/gymshark/',
      tags: 'ecommerce,UK',
    },
    {
      name: null,
      company: 'MVMT',
      role: 'E-commerce (Watches / Accessories)',
      email: 'support@mvmt.com',
      whatsapp: null,
      websiteUrl: 'https://www.mvmt.com/',
      instagramUrl: 'https://www.instagram.com/mvmt/',
      linkedinUrl: 'https://www.linkedin.com/company/mvmt/',
      tags: 'ecommerce,US',
    },
    {
      name: null,
      company: 'tentree',
      role: 'E-commerce (Sustainable Apparel)',
      email: 'support@tentree.com',
      whatsapp: null,
      websiteUrl: 'https://www.tentree.ca/',
      instagramUrl: 'https://www.instagram.com/tentree/',
      linkedinUrl: 'https://www.linkedin.com/company/tentree/',
      tags: 'ecommerce,CA',
    },
    {
      name: null,
      company: 'Koala',
      role: 'E-commerce (Furniture / Mattress)',
      email: 'support@koala.com',
      whatsapp: null,
      websiteUrl: 'https://koala.com/en-au/',
      instagramUrl: 'https://www.instagram.com/koala/',
      linkedinUrl: 'https://www.linkedin.com/company/koala-sleep/',
      tags: 'ecommerce,AU',
    },
    {
      name: null,
      company: 'Jumia Nigeria',
      role: 'E-commerce Marketplace (Nigeria)',
      email: 'seller.support@jumia.com.ng',
      whatsapp: null,
      websiteUrl: 'https://www.jumia.com.ng/',
      instagramUrl: 'https://www.instagram.com/jumia_nigeria/',
      linkedinUrl: 'https://www.linkedin.com/company/jumia/',
      tags: 'ecommerce,AF',
    },

    // real_estate (5)
    {
      name: null,
      company: 'Whitefield Estate Agents',
      role: 'Estate & Lettings Agents (UK)',
      email: 'info@whitefieldestateagents.co.uk',
      whatsapp: null,
      websiteUrl: 'https://www.whitefieldestateagents.co.uk/contact-us/',
      instagramUrl: null,
      linkedinUrl: null,
      tags: 'real_estate,UK',
    },
    {
      name: null,
      company: 'Goldview Property Management Ltd.',
      role: 'Property Management (Toronto, Canada)',
      email: 'info@goldview.ca',
      whatsapp: null,
      websiteUrl: 'https://goldview.ca/',
      instagramUrl: null,
      linkedinUrl: null,
      tags: 'real_estate,CA',
    },
    {
      name: null,
      company: 'aussieproperty.com',
      role: 'Real Estate Agency (Australia)',
      email: 'info@aussieproperty.com',
      whatsapp: null,
      websiteUrl: 'https://www.aussieproperty.com/contact-us/',
      instagramUrl: null,
      linkedinUrl: null,
      tags: 'real_estate,AU',
    },
    {
      name: null,
      company: 'Akka Kappa Ghana',
      role: 'Real Estate Agency (Accra, Ghana)',
      email: 'info@akkakappaghana.com',
      whatsapp: '+233540122800',
      websiteUrl: 'https://www.akkakappaghana.com/',
      instagramUrl: null,
      linkedinUrl: null,
      tags: 'real_estate,AF',
    },
    {
      name: null,
      company: 'Phoenix Realty & Property Management',
      role: 'Property Management (US)',
      email: 'info@phoenixrealtyinc.com',
      whatsapp: null,
      websiteUrl: 'https://www.phoenixrealtyinc.com/contact',
      instagramUrl: null,
      linkedinUrl: null,
      tags: 'real_estate,US',
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

  const clusters = countByTag(created, 0)
  const regions = countByTag(created, 1)

  await prisma.activityEvent.create({
    data: {
      type: 'leads_scouted',
      actorType: 'SYSTEM',
      actorId: null,
      entityType: 'LEAD',
      entityId: `burst_mixed_${now.toISOString().slice(0, 10)}`,
      payload: {
        wave: 'burst',
        count: created.length,
        regions,
        clusters,
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
