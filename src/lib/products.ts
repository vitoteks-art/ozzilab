export type Product = {
  slug: string
  title: string
  subtitle?: string
  description: string
  heroBullets: string[]
  images: {
    hero: string
    og: string
    framework?: string
    comparison?: string
  }
  downloads: {
    litePath: string
    premiumPath: string
  }
  checkout: {
    flutterwaveLibraryItemId: string
    premiumLibrarySlug: string
    priceText: string
  }
}

export const PRODUCTS: Product[] = [
  {
    slug: 'ozzi-method-governance',
    title: 'The Ozzi Method: Daily Governance for AI-Assisted Business',
    subtitle: 'A Step-by-Step Operating System for Solo Founders and Sales Operators',
    description:
      'Install a governance-first operating system—daily notes, pipeline discipline, experiments, and publishing—so execution compounds without micromanagement.',
    heroBullets: [
      'A daily loop: Log → Check → Act (one block).',
      'A weekly review that produces decisions, not activity.',
      'A simple pipeline + follow-up system that prevents lead decay.',
    ],
    images: {
      hero: '/products/ozzi-method-governance/images/hero-abstract.png',
      og: '/products/ozzi-method-governance/images/og.png',
      framework: '/products/ozzi-method-governance/images/three-artifacts.png',
      comparison: '/products/ozzi-method-governance/images/lite-vs-premium.png',
    },
    downloads: {
      litePath: '/products/ozzi-method-governance/downloads/lite.pdf',
      premiumPath: '/products/ozzi-method-governance/downloads/premium.pdf',
    },
    checkout: {
      flutterwaveLibraryItemId: '0576f23a-b045-4346-b60f-dfb1d43e4b55',
      premiumLibrarySlug: 'ozzi-method-governance-premium',
      priceText: '$19',
    },
  },
  {
    slug: 'build-ozzi-agent',
    title: 'Build an Ozzi-Style Operator Agent (That Actually Works)',
    subtitle: 'A step-by-step implementation guide with governance, memory, workflows, and approvals — OpenClaw-first.',
    description:
      'Build an operator-grade AI agent that ships outcomes reliably: clear job, doctrine, approval gates, memory that doesn’t rot, and daily/weekly operating loops.',
    heroBullets: [
      'A governance-first blueprint: doctrine + hard rules + approval gates.',
      'A 3-layer memory system: session → daily log → long-term templates.',
      'Daily + weekly loops that produce execution, not chatter.',
    ],
    images: {
      hero: '/products/build-ozzi-agent/images/mockup-3d-hero.png',
      og: '/products/build-ozzi-agent/images/cover-flat.png',
      framework: '/products/build-ozzi-agent/images/diagram-architecture.png',
      comparison: '/products/build-ozzi-agent/images/lite-vs-premium.svg',
    },
    downloads: {
      litePath: '/products/build-ozzi-agent/downloads/lite.pdf',
      premiumPath: '/products/build-ozzi-agent/downloads/premium.pdf',
    },
    checkout: {
      flutterwaveLibraryItemId: '88e59182-7f82-48fe-8402-3b3ca0aadcd9',
      premiumLibrarySlug: 'build-ozzi-agent-premium',
      priceText: '$29',
    },
  },
]

export function listProducts() {
  return PRODUCTS
}

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug) || null
}
