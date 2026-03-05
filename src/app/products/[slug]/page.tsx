import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getProduct } from '@/lib/products'
import { DownloadLiteForm } from './DownloadLiteForm'
import { BuyPremium } from './BuyPremium'

export const dynamic = 'force-dynamic'

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) return notFound()

  return (
    <main className="bg-background-surface">
      <section className="max-w-6xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <h1 className="font-serif text-4xl lg:text-5xl text-slate-900 mb-4">{product.title}</h1>
            {product.subtitle ? <p className="text-slate-600 text-lg mb-6">{product.subtitle}</p> : null}

            <ul className="space-y-3 mb-8">
              {product.heroBullets.map((b, i) => (
                <li key={i} className="text-slate-800 text-base">• {b}</li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="#download-lite"
                className="inline-flex justify-center bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-all"
              >
                Download Lite (Free)
              </a>
              <a
                href="#buy-premium"
                className="inline-flex justify-center bg-slate-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-slate-800 transition-all"
              >
                Buy Premium
              </a>
            </div>
          </div>

          <div className="bg-white border border-border-subtle rounded-2xl p-4">
            <div className="relative w-full aspect-[16/9] overflow-hidden rounded-xl">
              <Image src={product.images.hero} alt="" fill className="object-cover" priority />
            </div>
          </div>
        </div>

        <div className="mt-14 grid lg:grid-cols-2 gap-10">
          <section id="download-lite" className="bg-white border border-border-subtle rounded-2xl p-8">
            <h2 className="font-serif text-2xl text-slate-900 mb-2">Download Lite (Free)</h2>
            <p className="text-slate-600 mb-6">Enter your email + WhatsApp number to unlock the download.</p>

            <DownloadLiteForm productSlug={product.slug} />
          </section>

          <section id="buy-premium" className="bg-white border border-border-subtle rounded-2xl p-8">
            <h2 className="font-serif text-2xl text-slate-900 mb-2">Buy Premium</h2>
            <p className="text-slate-600 mb-6">Full operating system + templates. {product.checkout.priceText}</p>

            <BuyPremium
              libraryItemId={product.checkout.flutterwaveLibraryItemId}
              librarySlug={product.checkout.premiumLibrarySlug}
              priceText={product.checkout.priceText}
            />
          </section>
        </div>

        {product.images.framework ? (
          <section className="mt-14 bg-white border border-border-subtle rounded-2xl p-8">
            <h2 className="font-serif text-2xl text-slate-900 mb-6">What You Install</h2>
            <div className="relative w-full aspect-[16/9] overflow-hidden rounded-xl">
              <Image src={product.images.framework} alt="" fill className="object-contain" />
            </div>
          </section>
        ) : null}

        {product.images.comparison ? (
          <section className="mt-10 bg-white border border-border-subtle rounded-2xl p-8">
            <h2 className="font-serif text-2xl text-slate-900 mb-6">Lite vs Premium</h2>
            <div className="relative w-full aspect-[16/9] overflow-hidden rounded-xl">
              <Image src={product.images.comparison} alt="" fill className="object-contain" />
            </div>
          </section>
        ) : null}

        {/* Note: Ebook diagrams are embedded inside the PDFs; not displayed on the landing page. */}

        <section className="mt-10 bg-white border border-border-subtle rounded-2xl p-8">
          <h2 className="font-serif text-2xl text-slate-900 mb-2">FAQ</h2>
          <div className="space-y-4 text-slate-700">
            <div>
              <p className="font-semibold">Is this tool-agnostic?</p>
              <p>Principles are tool-agnostic. The implementation path is OpenClaw-first.</p>
            </div>
            <div>
              <p className="font-semibold">Who is this for?</p>
              <p>Solo founders and sales/operators who want consistent execution, not sporadic bursts.</p>
            </div>
            <div>
              <p className="font-semibold">Do I need to be technical?</p>
              <p>No. You need discipline around routines; the agent handles reminders, logging, and structure.</p>
            </div>
          </div>
        </section>
      </section>
    </main>
  )
}
