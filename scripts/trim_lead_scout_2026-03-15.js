/* Trim today tavily-scouted leads to enforce cap (100).
   Keeps newest 100 leads for 2026-03-15 where tags contain 'source=tavily_search'.
   Also removes older duplicate ActivityEvent records for the same entityId.
*/

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const day = '2026-03-15'
  const start = new Date(`${day}T00:00:00.000+01:00`) // Africa/Lagos
  const end = new Date(`${day}T23:59:59.999+01:00`)

  const leads = await prisma.lead.findMany({
    where: {
      createdAt: { gte: start, lte: end },
      tags: { contains: 'source=tavily_search' },
    },
    orderBy: { createdAt: 'desc' },
    select: { id: true, createdAt: true },
  })

  const keep = leads.slice(0, 100)
  const remove = leads.slice(100)

  // Delete in a transaction (lead has cascading relations for touchpoints/notes).
  await prisma.$transaction(async (tx) => {
    if (remove.length) {
      await tx.lead.deleteMany({ where: { id: { in: remove.map((x) => x.id) } } })
    }

    // Keep only latest activity event for this entityId today.
    const entityId = `daily_mixed_${day}`
    const events = await tx.activityEvent.findMany({
      where: { type: 'leads_scouted', entityType: 'LEAD', entityId },
      orderBy: { createdAt: 'desc' },
      select: { id: true },
    })
    const toDelete = events.slice(1)
    if (toDelete.length) {
      await tx.activityEvent.deleteMany({ where: { id: { in: toDelete.map((e) => e.id) } } })
    }
  })

  console.log(
    JSON.stringify(
      {
        ok: true,
        foundToday: leads.length,
        kept: keep.length,
        removed: remove.length,
        removedIds: remove.map((x) => x.id),
      },
      null,
      2
    )
  )
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
