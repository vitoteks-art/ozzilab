import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NicheLandingPage } from '@/components/NicheLandingPage'
import { getNiche, niches } from '@/lib/niches'

export function generateStaticParams() {
  return niches.map((niche) => ({ slug: niche.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const niche = getNiche(slug)
  if (!niche) return {}
  return {
    title: niche.metaTitle,
    description: niche.metaDescription,
  }
}

export default async function IndustryNichePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const niche = getNiche(slug)
  if (!niche) notFound()
  return <NicheLandingPage niche={niche} />
}
