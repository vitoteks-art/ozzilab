/* Fix-count: reduce created leads to exactly 20 for Burst 20 run.
   Deletes one extra lead created in top-up, then writes final ActivityEvent with count=20.
*/

const fs = require('fs')
const path = require('path')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const now = new Date()

  const prev1 = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '../../../out/lead_scout_burst_mixed_2026-03-09.json'), 'utf-8')
  )
  const prev2 = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '../../../out/lead_scout_burst_mixed_topup_2026-03-09.json'), 'utf-8')
  )

  const allIds = [...(prev1.created || []).map((l) => l.id), ...(prev2.created || []).map((l) => l.id)]

  // Delete the extra lead (Misura Berteit Accountants)
  const deleteId = 'e5e29f1e-760c-4ce2-af6a-34c76d93f55b'
  await prisma.lead.delete({ where: { id: deleteId } })

  const finalIds = allIds.filter((id) => id !== deleteId)

  const finalLeads = await prisma.lead.findMany({ where: { id: { in: finalIds } } })

  const clusters = finalLeads.reduce((acc, l) => {
    const tags = (l.tags || '').split(',').map((s) => s.trim()).filter(Boolean)
    const cluster = tags[0] || 'unknown'
    acc[cluster] = (acc[cluster] || 0) + 1
    return acc
  }, {})

  const regions = finalLeads.reduce((acc, l) => {
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
      entityId: `burst_mixed_count20_${now.toISOString().slice(0, 10)}`,
      payload: {
        wave: 'burst',
        count: finalIds.length,
        regions,
        clusters,
        leadIds: finalIds,
        note: 'Adjusted to exactly 20: removed one extra lead created during top-up.',
      },
    },
  })

  console.log(JSON.stringify({ ok: true, deletedId: deleteId, finalCount: finalIds.length, finalIds }, null, 2))
}

main()
  .catch((e) => {
    console.error(e)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
