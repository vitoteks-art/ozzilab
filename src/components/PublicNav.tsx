'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { BrandLogo } from '@/components/BrandLogo'
import { ThemeToggle } from '@/components/ThemeToggle'

type AdminState = { loggedIn: boolean; email?: string }

const navItems = [
  { href: '/services', label: 'Services' },
  { href: '/industries', label: 'Industries' },
  { href: '/projects', label: 'Projects' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/library', label: 'Resources' },
  { href: '/about', label: 'About' },
]

export function PublicNav() {
  const [admin, setAdmin] = useState<AdminState>({ loggedIn: false })
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/admin/me', { cache: 'no-store' })
        const json = await res.json()
        if (!cancelled) setAdmin(json?.loggedIn ? { loggedIn: true, email: json?.admin?.email } : { loggedIn: false })
      } catch {
        if (!cancelled) setAdmin({ loggedIn: false })
      }
    })()
    return () => { cancelled = true }
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/70 bg-white/82 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-[1480px] items-center justify-between px-5 md:px-10 xl:px-16">
        <BrandLogo />

        <nav className="hidden items-center rounded-full border border-slate-200/80 bg-slate-50/70 px-2 py-2 shadow-sm md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-full px-5 py-2.5 text-[15px] font-semibold text-slate-600 transition-all hover:bg-white hover:text-blue-700 hover:shadow-sm">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle compact />
          <Link href="/book" className="rounded-full border border-slate-200 bg-white px-5 py-3 text-[14px] font-bold text-slate-800 shadow-sm transition-all hover:border-blue-200 hover:text-blue-700 hover:shadow-md">
            Book Call
          </Link>
          <Link href="/audit" className="rounded-full bg-blue-600 px-5 py-3 text-[14px] font-bold text-white shadow-[0_14px_30px_rgba(37,99,235,0.22)] transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-[0_18px_38px_rgba(37,99,235,0.28)]">
            Request Audit
          </Link>
          {admin.loggedIn ? <Link className="rounded-full bg-slate-950 px-4 py-3 text-[14px] font-bold text-white" href="/admin">Admin</Link> : null}
        </div>

        <button className="flex size-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm md:hidden" type="button" onClick={() => setMobileOpen((v) => !v)} aria-label="Toggle menu">
          <span className="material-symbols-outlined">{mobileOpen ? 'close' : 'menu'}</span>
        </button>
      </div>

      {mobileOpen ? (
        <div className="border-t border-slate-200 bg-white/95 px-5 py-5 shadow-2xl backdrop-blur-xl md:hidden">
          <div className="mx-auto grid max-w-[1480px] gap-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className="rounded-xl px-4 py-3 text-base font-bold text-slate-700 hover:bg-slate-50">
                {item.label}
              </Link>
            ))}
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Link href="/book" onClick={() => setMobileOpen(false)} className="rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-bold text-slate-800">Book Call</Link>
              <Link href="/audit" onClick={() => setMobileOpen(false)} className="rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-bold text-white">Request Audit</Link>
            </div>
            <div className="mt-3">
              <ThemeToggle />
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
