import { redirect } from 'next/navigation'
import { getAdminFromRequest } from '@/lib/adminAuth'

export async function requireAdminOrRedirect() {
  const admin = await getAdminFromRequest()
  if (!admin) redirect('/admin/login')
  return admin
}
