'use client'

import { usePathname } from 'next/navigation'
import { PublicFooter } from '@/components/PublicFooter'
import { PublicNav } from '@/components/PublicNav'

export function LayoutChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  return (
    <>
      {!isAdmin ? <PublicNav /> : null}
      {children}
      {!isAdmin ? <PublicFooter /> : null}
    </>
  )
}
