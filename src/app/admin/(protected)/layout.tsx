import { requireAdminOrRedirect } from '@/lib/requireAdminOrRedirect'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

function NavItem({ href, icon, label, disabled }: { href: string; icon: string; label: string; disabled?: boolean }) {
  if (disabled) {
    return (
      <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 cursor-not-allowed">
        <span className="material-symbols-outlined">{icon}</span>
        <span className="text-sm font-medium">{label}</span>
      </div>
    )
  }

  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
    >
      <span className="material-symbols-outlined">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </Link>
  )
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdminOrRedirect()

  return (
    <div className="min-h-screen bg-[#f6f6f8] text-slate-900">
      {/* Top bar */}
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 lg:px-8 py-3 sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-primary text-white p-1.5 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">cloud_done</span>
            </div>
            <h2 className="text-slate-900 text-lg font-bold tracking-tight">Ozzilab.cloud</h2>
          </Link>

          <label className="hidden md:flex flex-col min-w-72 h-10">
            <div className="flex w-full flex-1 items-stretch rounded-lg h-full bg-slate-100 border border-slate-200">
              <div className="text-slate-500 flex items-center justify-center pl-4">
                <span className="material-symbols-outlined text-xl">search</span>
              </div>
              <input
                className="flex w-full min-w-0 flex-1 border-none bg-transparent focus:ring-0 h-full placeholder:text-slate-500 px-4 text-sm font-normal"
                placeholder="Search submissions..."
              />
            </div>
          </label>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors" type="button">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors" type="button">
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>

          <div className="h-8 w-[1px] bg-slate-200 mx-2 hidden sm:block" />

          <form action="/api/admin/logout" method="post">
            <button className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold hover:bg-slate-50" type="submit">
              Logout
            </button>
          </form>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-64 border-r border-slate-200 bg-white flex-col p-4 shrink-0 min-h-[calc(100vh-64px)]">
          <div className="flex flex-col gap-1 mb-8">
            <h1 className="text-slate-400 text-[10px] uppercase font-bold tracking-wider px-3 mb-2">Main Menu</h1>
            <NavItem href="/admin/intakes" icon="move_to_inbox" label="Submissions" />
            <NavItem href="/admin/library" icon="library_books" label="Library Management" />
            <NavItem href="/admin/purchases" icon="payments" label="Payments" />
            <NavItem href="/admin/audits" icon="group" label="Audits" />
          </div>

          <div className="flex flex-col gap-1">
            <h1 className="text-slate-400 text-[10px] uppercase font-bold tracking-wider px-3 mb-2">Systems</h1>
            <NavItem href="/admin/purchases" icon="analytics" label="Reporting" />
            <NavItem href="#" icon="shield" label="Access Control" disabled />
          </div>

          <div className="mt-auto p-3 bg-primary/5 rounded-xl border border-primary/10">
            <p className="text-xs font-bold text-primary mb-1">Admin Ops Console</p>
            <p className="text-[10px] text-slate-500">Version 1.0.4-stable</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] text-slate-500 font-medium">System Online</span>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-x-hidden">{children}</main>
      </div>
    </div>
  )
}
