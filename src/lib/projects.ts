export type PortfolioProject = {
  title: string
  category: string
  summary: string
  image?: string
  tags: string[]
  outcome: string
  websiteUrl?: string
}

export const portfolioProjects: PortfolioProject[] = [
  {
    title: 'Vitotek Systems Nigeria Limited',
    category: 'Automation & AI Company Website',
    summary: 'A bold company website for Vitotek Systems, positioning websites, web apps, WhatsApp automation, AI agents, lead systems, webinars, and custom business systems under one modern brand experience.',
    image: '/assets/projects/vitotek-systems-project-shot.png',
    tags: ['AI automation', 'Business systems', 'WhatsApp automation', 'Company website'],
    outcome: 'Built to present Vitotek’s core services clearly, drive consultation bookings, and showcase automation-led growth systems for business owners.',
    websiteUrl: 'https://vitotek.com.ng',
  },
  {
    title: 'Dr. Challah',
    category: 'Medical Practitioner Website',
    summary: 'A calm, professional healthcare website for Dr. Challah, presenting medical guidance, appointment booking, membership, AI consultation, events, blog content, and patient-facing service information.',
    image: '/assets/projects/dr-challah-project-shot.png',
    tags: ['Healthcare', 'Appointment booking', 'Membership', 'Patient education'],
    outcome: 'Built to position Dr. Challah as a trusted medical voice while giving patients clear paths to book appointments, explore services, and access health guidance online.',
    websiteUrl: 'https://drchallah.com',
  },
  {
    title: 'Guaranty Partners Trainings',
    category: 'Corporate Training Website',
    summary: 'A professional training platform for corporate learning, course discovery, training categories, calendar downloads, blog content, and in-house training enquiries.',
    image: '/assets/projects/guaranty-partners-trainings-project-shot.png',
    tags: ['Corporate training', 'Course catalogue', 'Lead generation', 'Learning platform'],
    outcome: 'Built to help organisations discover training programmes, request in-house training, and navigate learning opportunities through a clear, conversion-focused website.',
    websiteUrl: 'https://guarantypartnerstrainings.com/',
  },
  {
    title: 'AABR Journal',
    category: 'Academic Journal Website',
    summary: 'A journal website for Annals of Animal and Biological Research, supporting article discovery, volume navigation, editorial information, author guidelines, manuscript submission, search, registration, and login.',
    image: '/assets/projects/aabr-journal-project-shot.png',
    tags: ['Academic journal', 'Article publishing', 'Manuscript submission', 'Research portal'],
    outcome: 'Built to present journal information clearly while supporting researchers, authors, editors, and readers through a structured publishing website.',
    websiteUrl: 'https://aabrjournalaaua.org.ng',
  },
  {
    title: 'OstrichAI Studio',
    category: 'AI Creative Platform',
    summary: 'A premium AI-powered creative suite for video, social media assets, logos, flyers, and campaign content.',
    image: '/assets/projects/ostrichai-project-shot.png',
    tags: ['AI platform', 'Creative tools', 'Campaign workflow'],
    outcome: 'Built to help teams create and ship marketing assets faster with AI-assisted production.',
    websiteUrl: 'https://getostrichai.com',
  },
  {
    title: 'AI Business Webinar Campaign',
    category: 'Education Funnel',
    summary: 'A conversion-focused webinar landing experience designed to turn AI interest into registrations, guide downloads, and future service demand.',
    tags: ['Landing page', 'Registration funnel', 'Lead capture'],
    outcome: 'Structured to capture intent, educate prospects, and move attendees into follow-up journeys.',
  },
  {
    title: 'Referral Growth System',
    category: 'SaaS Monetization',
    summary: 'Structured referral rewards, wallet logic, KYC-aware withdrawals, and admin visibility for subscription growth.',
    tags: ['Referral engine', 'Wallet logic', 'Admin system'],
    outcome: 'Designed to support measurable growth loops with cleaner payout and tracking operations.',
  },
  {
    title: 'Business Automation Websites',
    category: 'Company Systems',
    summary: 'Conversion-led websites and connected backend workflows designed to attract leads and simplify operations.',
    tags: ['Websites', 'Automation', 'Operations'],
    outcome: 'Delivered as practical business systems, not just static brochure pages.',
  },
  {
    title: 'ClayHall Properties',
    category: 'Real Estate Project',
    summary: 'A premium real estate web experience designed to showcase luxury properties, brand credibility, and lead-generating property discovery journeys.',
    image: '/assets/projects/clayhall-properties-project-shot.jpg',
    tags: ['Real estate', 'Premium web', 'Lead generation'],
    outcome: 'Built around property presentation, trust, and enquiry conversion.',
  },
  {
    title: 'Zoe Aflame Church',
    category: 'Church Website Project',
    summary: 'A modern church website experience designed to communicate ministry vision, highlight programs and events, and support stronger community engagement online.',
    image: '/assets/projects/zoe-aflame-church-project-shot.jpg',
    tags: ['Church website', 'Community', 'Events'],
    outcome: 'Created to improve online presence, clarity, and engagement for ministry audiences.',
    websiteUrl: 'https://zoeaflame.org/',
  },
  {
    title: 'Deeper Life Campus Fellowship South West',
    category: 'Organization Website',
    summary: 'A ministry-focused web platform created to communicate programs, strengthen regional identity, highlight events, and support community connection.',
    image: '/assets/projects/dlcf-sw-project-shot.jpg',
    tags: ['Organization site', 'Events', 'Regional identity'],
    outcome: 'Built to make programs, updates, and identity easier to communicate across the region.',
  },
  {
    title: 'Kosmos Energy Ghana Visitor Management System',
    category: 'Enterprise Operations System',
    summary: 'A visitor management and kiosk-based check-in system built to streamline front-desk operations, improve visibility, and support secure visitor workflows.',
    image: '/assets/projects/kosmos-energy-vms-project-shot.jpg',
    tags: ['Visitor management', 'Kiosk workflow', 'Enterprise ops'],
    outcome: 'Focused on operational clarity, secure check-in, and better front-desk visibility.',
  },
  {
    title: 'Dr Adewale Badru',
    category: 'Medical Consultant Website',
    summary: 'A premium personal brand and medical consultant platform designed to present expertise, support consultation bookings, and communicate a distinct healthcare identity online.',
    image: '/assets/projects/dr-adewale-badru-project-shot.jpg',
    tags: ['Healthcare', 'Personal brand', 'Consultation flow'],
    outcome: 'Positioned expertise clearly while supporting appointment and consultation enquiries.',
    websiteUrl: 'https://drbadruglobalnetwork.com/',
  },
]

export const featuredPortfolioProjects = portfolioProjects.slice(0, 6)
