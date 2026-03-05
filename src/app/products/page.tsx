import Link from 'next/link'
import Image from 'next/image'
import { listProducts } from '@/lib/products'

export const dynamic = 'force-dynamic'

export default function ProductsIndexPage() {
  const products = listProducts()

  return (
    <main className="bg-background-surface">
      <section className="max-w-6xl mx-auto px-6 lg:px-12 py-16">
        <div className="flex items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="font-serif text-4xl lg:text-5xl text-slate-900">Digital Products</h1>
            <p className="text-slate-600 mt-3 max-w-2xl">
              Operating systems, templates, and implementation guides. Each product has a dedicated page under{' '}
              <span className="font-semibold">/products</span>.
            </p>
          </div>
          <Link
            href="/library"
            className="hidden sm:inline-flex h-10 items-center justify-center rounded-lg px-4 bg-white border border-border-subtle text-slate-900 text-sm font-bold hover:bg-slate-50 transition-colors"
          >
            Explore Library
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="p-10 bg-white border border-border-subtle rounded-2xl text-slate-600">
            No products published yet.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {products.map((p) => (
              <Link
                key={p.slug}
                href={`/products/${p.slug}`}
                className="group bg-white border border-border-subtle rounded-2xl overflow-hidden hover:border-primary transition-colors"
              >
                <div className="relative w-full aspect-[16/9] bg-slate-50">
                  <Image src={p.images.hero} alt="" fill className="object-cover" />
                </div>
                <div className="p-7">
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Product</div>
                  <h2 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">
                    {p.title}
                  </h2>
                  {p.subtitle ? <p className="text-slate-600 mt-2">{p.subtitle}</p> : null}
                  <p className="text-slate-500 mt-4">{p.description}</p>

                  <div className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-slate-900">
                    View product
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
