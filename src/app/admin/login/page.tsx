'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const year = useMemo(() => new Date().getFullYear(), [])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const fd = new FormData(e.currentTarget)
    const payload = Object.fromEntries(fd.entries())

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || 'Login failed')
      router.push('/admin/audits')
    } catch (e: any) {
      setError(e?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background-light text-slate-900">
      {/* Top Navigation Bar */}
      <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-xl">shield_person</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight uppercase font-display">
              Ozzilab<span className="text-primary">.</span>cloud
            </h2>
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            <Link className="text-sm font-medium hover:text-primary transition-colors" href="/">
              Platform
            </Link>
            <Link className="text-sm font-medium hover:text-primary transition-colors" href="/privacy">
              Security
            </Link>
            <Link className="text-sm font-medium hover:text-primary transition-colors" href="/terms">
              Documentation
            </Link>
            <Link
              className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-primary/20"
              href="/audit"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background Decorative Element */}
        <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]"></div>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, #e2e8f0 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        {/* Login Card */}
        <div className="w-full max-w-[480px] bg-white rounded-2xl shadow-2xl border border-slate-100 p-10 md:p-14 z-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/5 mb-6">
              <span className="material-symbols-outlined text-primary text-3xl">lock_open</span>
            </div>
            <h1 className="font-serif text-4xl font-bold text-slate-900 mb-2">Admin Access</h1>
            <p className="text-slate-500 font-display text-sm uppercase tracking-widest font-medium">Secure Environment</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider px-1" htmlFor="email">
                Corporate Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                  <span className="material-symbols-outlined text-xl">alternate_email</span>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="name@ozzilab.cloud"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400 font-display"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider" htmlFor="password">
                  Security Key
                </label>
                <span className="text-xs font-semibold text-slate-400">Forgot password?</span>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                  <span className="material-symbols-outlined text-xl">key</span>
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400 font-display"
                />
                <button
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <span className="material-symbols-outlined text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center px-1">
              <label className="relative flex items-center cursor-pointer">
                <input className="sr-only peer" type="checkbox" name="remember" value="true" />
                <div className="w-5 h-5 border-2 border-slate-200 rounded peer-checked:bg-primary peer-checked:border-primary transition-all"></div>
                <span className="ml-3 text-sm text-slate-600 font-medium">Keep me logged in for 24 hours</span>
                <span className="material-symbols-outlined absolute text-white text-base opacity-0 peer-checked:opacity-100 left-[2px]">
                  check
                </span>
              </label>
            </div>

            {error ? <p className="text-sm text-red-600 px-1">{error}</p> : null}

            {/* Sign In Button */}
            <button
              className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-2 group disabled:opacity-60"
              type="submit"
              disabled={loading}
            >
              <span>{loading ? 'Signing in…' : 'Secure Sign In'}</span>
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </form>

          {/* Footer within card */}
          <div className="mt-12 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">Authorized Personnel Only</p>
          </div>
        </div>
      </main>

      {/* Page Footer */}
      <footer className="w-full py-8 px-6 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-slate-500 text-xs font-display">© {year} Ozzilab.cloud Business Automation. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <Link className="text-xs text-slate-500 hover:text-primary transition-colors" href="/privacy">
              Privacy Protocol
            </Link>
            <Link className="text-xs text-slate-500 hover:text-primary transition-colors" href="/terms">
              Terms of Access
            </Link>
            <Link className="text-xs text-slate-500 hover:text-primary transition-colors" href="/audit">
              Security Audit
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
