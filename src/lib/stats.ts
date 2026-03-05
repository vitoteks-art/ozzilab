import { prisma } from '@/lib/db'

function startOfDay(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

export async function getPublicOverviewStats(now = new Date()) {
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const todayStart = startOfDay(now)

  const [audits7d, intakes7d, activeProjects, shipped30d, eventsToday] = await Promise.all([
    prisma.auditRequest.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.intakeSubmission.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.project.count({ where: { status: 'ACTIVE' } }),
    prisma.activityEvent.count({ where: { type: 'deliverable_shipped', createdAt: { gte: thirtyDaysAgo } } }),
    prisma.activityEvent.count({ where: { createdAt: { gte: todayStart } } }),
  ])

  return {
    audits7d,
    intakes7d,
    activeProjects,
    shipped30d,
    eventsToday,
    updatedAt: now.toISOString(),
  }
}
