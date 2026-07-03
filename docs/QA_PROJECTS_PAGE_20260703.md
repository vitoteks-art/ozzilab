# QA Notes — Projects Page — 2026-07-03

## Source

Project content and selected assets were pulled from:

`/root/.openclaw/workspace/projects/vitotek-animated-website`

Primary source files inspected:

- `app/projects/page.tsx`
- `lib/merged-content.ts`
- `public/assets/old-site/*project-shot.jpg`

## Implemented

- Centralized portfolio data: `src/lib/projects.ts`
- New projects page: `src/app/projects/page.tsx`
- Homepage selected projects preview: `src/app/page.tsx`
- Public nav link: `src/components/PublicNav.tsx`
- Footer links: `src/components/PublicFooter.tsx`
- Copied selected project images into `public/assets/old-site/`

## Project Entries Added

- OstrichAI Studio
- AI Business Webinar Campaign
- Referral Growth System
- Business Automation Websites
- ClayHall Properties
- Zoe Aflame Church
- Deeper Life Campus Fellowship South West
- Kosmos Energy Ghana Visitor Management System
- Dr Adewale Badru

## Commands Run

```bash
npm run lint
npm run build
```

## Route Checks

All returned HTTP 200 locally:

- `/`
- `/projects`
- `/services`
- `/industries`

## Result

- ESLint passed.
- Next.js production build passed.
- `/projects` is generated as a static page.
