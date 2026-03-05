# Release Notes — ozzi-site web

## Unreleased

### Fixed
- Admin login page: replaced raw `<a href>` internal navigation with `next/link` to satisfy Next.js lint rules.

### QA
- `npm run build` passes.
- `npm run lint` passes.

## 0.1.0
- Initial release (Next.js + Prisma/Postgres) with audit/intake/library/admin flows.
