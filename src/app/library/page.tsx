import { prisma } from '@/lib/db'
import { LibraryClient } from './LibraryClient'

export const dynamic = 'force-dynamic'

export default async function LibraryPage() {
  const items = await prisma.libraryItem.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: 'desc' },
    take: 200,
  })

  return (
    <LibraryClient
      items={items.map((it) => ({
        id: it.id,
        slug: it.slug,
        title: it.title,
        summary: it.summary,
        tier: it.tier as any,
        priceUSD: it.priceUSD,
        category: (it.category as any) || 'OTHER',
        createdAt: it.createdAt.toISOString(),
      }))}
    />
  )
}
