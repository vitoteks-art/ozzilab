import Link from 'next/link'

export default async function AuditThanksPage({
  searchParams,
}: {
  searchParams: Promise<{ auditId?: string }>
}) {
  const { auditId } = await searchParams
  return (
    <main className="bg-background-surface">
      <section className="max-w-3xl mx-auto px-6 lg:px-12 py-20">
        <div className="bg-white border border-border-subtle rounded-2xl p-10">
          <h1 className="font-serif text-4xl text-slate-900 mb-4">Audit request received</h1>
          <p className="text-slate-600 text-lg mb-8">We’ll review and reply with next steps within 24–48 hours.</p>
          {auditId ? (
            <div className="p-4 rounded-xl bg-background-surface border border-border-subtle mb-8">
              <p className="text-sm text-slate-500">Your Audit ID</p>
              <p className="text-2xl font-bold tracking-tight text-slate-900">{auditId}</p>
            </div>
          ) : null}

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/" className="px-6 py-3 rounded-lg border border-border-subtle font-semibold text-slate-800">
              Back to homepage
            </Link>
            <Link href="/library" className="px-6 py-3 rounded-lg bg-primary text-white font-semibold">
              Explore Library
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
