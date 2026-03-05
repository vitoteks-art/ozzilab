'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

type AdminState = { loggedIn: boolean; email?: string }

export function PublicNav() {
  const pathname = usePathname()
  const onLibrary = pathname === '/library' || pathname.startsWith('/library/')

  const [admin, setAdmin] = useState<AdminState>({ loggedIn: false })
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/admin/me', { cache: 'no-store' })
        const json = await res.json()
        if (cancelled) return
        if (json?.loggedIn) setAdmin({ loggedIn: true, email: json?.admin?.email })
        else setAdmin({ loggedIn: false })
      } catch {
        if (!cancelled) setAdmin({ loggedIn: false })
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  async function logout() {
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
    } finally {
      // ensure UI updates
      window.location.href = '/'
    }
  }

  function closeMobile() {
    setMobileOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-3 flex items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 text-primary">
            <div className="size-8 flex items-center justify-center bg-primary rounded-lg text-white">
              <span className="material-symbols-outlined">rocket_launch</span>
            </div>
            <span className="text-slate-900 text-lg font-bold leading-tight tracking-tight">Ozzilab.cloud</span>
          </Link>

          {onLibrary ? (
            <label className="hidden md:flex flex-col min-w-40 h-10 max-w-72">
              <div className="flex w-full flex-1 items-stretch rounded-lg h-full bg-slate-100 border border-slate-200">
                <div className="text-slate-500 flex items-center justify-center pl-4">
                  <span className="material-symbols-outlined text-[20px]">search</span>
                </div>
                <input
                  className="form-input flex w-full min-w-0 flex-1 border-none bg-transparent focus:ring-0 h-full placeholder:text-slate-500 px-4 pl-2 text-sm font-normal"
                  placeholder="Search systems..."
                />
              </div>
            </label>
          ) : null}
        </div>

        <div className="flex flex-1 justify-end gap-4 items-center">
          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden inline-flex size-10 items-center justify-center rounded-lg border border-border-subtle bg-white"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span className="material-symbols-outlined">{mobileOpen ? 'close' : 'menu'}</span>
          </button>

          {mobileOpen ? (
            <div className="lg:hidden absolute left-0 right-0 top-full border-b border-border-subtle bg-white">
              <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex flex-col gap-2">
                <Link onClick={closeMobile} className="py-2 text-slate-900 font-semibold" href="/#services">
                  Services
                </Link>
                <Link onClick={closeMobile} className="py-2 text-slate-900 font-semibold" href="/#process">
                  How it works
                </Link>
                <Link onClick={closeMobile} className="py-2 text-slate-900 font-semibold" href="/products">
                  Products
                </Link>
                <Link onClick={closeMobile} className="py-2 text-slate-900 font-semibold" href="/library">
                  Library
                </Link>
                <div className="h-px bg-border-subtle my-2" />
                {admin.loggedIn ? (
                  <>
                    <Link onClick={closeMobile} className="py-2 text-slate-900 font-semibold" href="/admin">
                      Admin
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        closeMobile()
                        void logout()
                      }}
                      className="text-left py-2 text-slate-900 font-semibold"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link onClick={closeMobile} className="py-2 text-slate-900 font-semibold" href="/admin/login">
                    Login
                  </Link>
                )}
              </div>
            </div>
          ) : null}

          <nav className="hidden lg:flex items-center gap-8">
            <Link className="text-slate-600 hover:text-primary text-sm font-medium transition-colors" href="/#services">
              Services
            </Link>
            <Link className="text-slate-600 hover:text-primary text-sm font-medium transition-colors" href="/#process">
              How it works
            </Link>
            <Link className="text-slate-600 hover:text-primary text-sm font-medium transition-colors" href="/products">
              Products
            </Link>
            <Link
              className={`${onLibrary ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'text-slate-600 hover:text-primary font-medium'} text-sm transition-colors`}
              href="/library"
            >
              Library
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/audit"
              className="flex h-10 items-center justify-center rounded-lg px-4 bg-primary text-white text-sm font-bold hover:opacity-90 transition-opacity"
            >
              Request Audit
            </Link>
            {onLibrary ? (
              <Link
                href="/library/downloads"
                className="hidden sm:flex h-10 items-center justify-center rounded-lg px-4 bg-slate-100 text-slate-900 text-sm font-bold hover:bg-slate-200 transition-colors"
              >
                My Downloads
              </Link>
            ) : null}
            {admin.loggedIn ? (
              <>
                <Link
                  href="/admin"
                  className="flex h-10 items-center justify-center rounded-lg px-4 bg-slate-100 text-slate-900 text-sm font-bold hover:bg-slate-200 transition-colors"
                  title={admin.email || 'Admin'}
                >
                  Admin
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="hidden sm:flex h-10 items-center justify-center rounded-lg px-4 bg-slate-100 text-slate-900 text-sm font-bold hover:bg-slate-200 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/admin/login"
                className="flex h-10 items-center justify-center rounded-lg px-4 bg-slate-100 text-slate-900 text-sm font-bold hover:bg-slate-200 transition-colors"
                title="Admin login"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
