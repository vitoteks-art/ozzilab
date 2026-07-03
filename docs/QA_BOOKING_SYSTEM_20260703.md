# QA Notes — Ozzi Booking System — 2026-07-03

## Scope Verified

- Public booking routes: `/book`, `/book/thanks`
- Public booking APIs: `/api/bookings/available-slots`, `/api/bookings`
- Admin booking routes: `/admin/bookings`, `/admin/bookings/[bookingId]`
- Admin booking APIs: `/api/admin/bookings`, `/api/admin/bookings/[bookingId]`
- Prisma booking models/enums and migration SQL
- Audit frontend/backend field alignment for LinkedIn, scheduler, Google Business, appointment method, average client value, urgency, and package interest
- Public marketing pages aligned to the approved Stitch direction: homepage, services, pricing, industries, about, contact
- Intake file upload flow adjusted so files can be selected before final intake submission

## Commands Run

```bash
npx prisma generate
npm run lint
npm run build
```

## Result

All commands passed.

- Prisma Client generated successfully.
- ESLint passed.
- Next.js production build passed.
- Build generated 40 static pages and dynamic admin/API routes.

## Notes

- Booking availability defaults to Monday–Friday, 09:00–17:00, 60-minute slots if no database availability rules exist.
- Slot collision protection excludes completed/cancelled bookings and blocks active statuses: `NEW`, `CONFIRMED`, `RESCHEDULE_REQUESTED`.
- Public booking submission requires at least one of website, Instagram, LinkedIn, YouTube, Google Business, or scheduler URL.
- Admin APIs use `requireAdmin()`.
- Migration SQL was inspected directly. It adds booking enums/models and expands `AuditRequest` qualification fields.

## Remaining Before Deploy

- Apply database migration to the target PostgreSQL environment.
- Configure/confirm Telegram notification environment variables if Telegram booking alerts are required in production.
- Run a live browser smoke test after the app is served on a reachable URL.
