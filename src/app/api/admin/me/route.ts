import { NextResponse } from 'next/server'
import { getAdminFromRequest } from '@/lib/adminAuth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const admin = await getAdminFromRequest()
    if (!admin) return NextResponse.json({ ok: true, loggedIn: false })

    return NextResponse.json({ ok: true, loggedIn: true, admin: { id: admin.id, email: admin.email } })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}
