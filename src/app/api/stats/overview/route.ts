import { NextResponse } from 'next/server'
import { getPublicOverviewStats } from '@/lib/stats'

export async function GET() {
  try {
    const stats = await getPublicOverviewStats()

    const res = NextResponse.json(stats)
    // VPS caching: keep it light and safe; data is aggregate-only.
    res.headers.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300')
    return res
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
