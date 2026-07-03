import Link from 'next/link'

export function BrandLogo({ framed = false }: { framed?: boolean }) {
  return (
    <Link href="/" className={framed ? 'brand-logo brand-logo-framed' : 'brand-logo'} aria-label="OZZILAB by Vitotek Systems home">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/ozzi-vitotek-logo-light.svg" alt="OZZILAB by Vitotek Systems" className="brand-logo-img brand-logo-light" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/ozzi-vitotek-logo-dark.svg" alt="" aria-hidden="true" className="brand-logo-img brand-logo-dark" />
    </Link>
  )
}
