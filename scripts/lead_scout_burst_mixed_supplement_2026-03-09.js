/* Lead Scout — Burst 20 (Mixed Regions) — Supplement
   Goal: top-up to reach 20 NEW leads created (after initial run created < 20 due to dedupe).

   Also writes a final ActivityEvent summary with count=20 and leadIds.
*/

const fs = require('fs')
const path = require('path')
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

  const prevPath = path.resolve(__dirname, '../../../out/lead_scout_burst_mixed_2026-03-09.json')
  const prev = JSON.parse(fs.readFileSync(prevPath, 'utf-8'))
  const prevCreatedIds = (prev.created || []).map((l) => l.id)

  const leads = [
    // high_ticket_coach (UK)
    {
      name: null,
      company: 'Executive Coaching Associates',
      role: 'Executive Coaching (UK)',
      email: 'info@executivecoachingassociates.co.uk',
      whatsapp: null,
      websiteUrl: 'https://executivecoachingassociates.co.uk/',
      instagramUrl: null,
      linkedinUrl: null,
      tags: 'high_ticket_coach,UK',
    },

    // high_ticket_coach (UK)
    {
      name: null,
      company: 'Mosaic Executive Coaching',
      role: 'Executive Coaching (London, UK)',
      email: 'info@mosaic-exco.com',
      whatsapp: null,
      websiteUrl: 'https://www.mosaicexecutivecoaching.co.uk/',
      instagramUrl: null,
      linkedinUrl: null,
      tags: 'high_ticket_coach,UK',
    },

    // ecommerce (CA)
    {
      name: null,
      company: 'EH Canada (shopehcanada.ca)',
      role: 'E-commerce (Canadian Marketplace / Clothing)',
      email: 'support@shopehcanada.ca',
      whatsapp: null,
      websiteUrl: 'https://shopehcanada.ca/contact/',
      instagramUrl: null,
      linkedinUrl: null,
      tags: 'ecommerce,CA',
    },

    // ecommerce (AU)
    {
      name: null,
      company: 'Bunnings Warehouse',
      role: 'E-commerce (Home Improvement Retail)',
      email: 'customersupport@bunnings.com.au',
      whatsapp: null,
      websiteUrl: 'https://www.bunnings.com.au/help-centre/shop-online',
      instagramUrl: 'https://www.instagram.com/bunnings/',
      linkedinUrl: 'https://www.linkedin.com/company/bunnings/',
      tags: 'ecommerce,AU',
    },

    // automation_need_business (CA)
    {
      name: null,
      company: 'Misura Berteit Accountants',
      role: 'Accounting Firm (Calgary, Canada)',
      email: 'info@misura.ca',
      whatsapp: null,
      websiteUrl: 'https://misura.ca/',
      instagramUrl: null,
      linkedinUrl: null,
      tags: 'automation_need_business,CA',
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

  const allLeadIds = [...prevCreatedIds, ...created.map((l) => l.id)]

  const allLeads = await prisma.lead.findMany({ where: { id: { in: allLeadIds } } })
  const clusters = countByTag(allLeads, 0)
  const regions = countByTag(allLeads, 1)

  await prisma.activityEvent.create({
    data: {
      type: 'leads_scouted',
      actorType: 'SYSTEM',
      actorId: null,
      entityType: 'LEAD',
      entityId: `burst_mixed_final_${now.toISOString().slice(0, 10)}`,
      payload: {
        wave: 'burst',
        count: allLeads.length,
        regions,
        clusters,
        leadIds: allLeadIds,
        topUpCreatedCount: created.length,
        topUpDedupedCount: deduped.length,
      },
    },
  })

  console.log(JSON.stringify({ ok: true, topUpCreatedCount: created.length, created, deduped, totalCount: allLeads.length, leadIds: allLeadIds }, null, 2))
}

main()
  .catch((e) => {
    console.error(e)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
