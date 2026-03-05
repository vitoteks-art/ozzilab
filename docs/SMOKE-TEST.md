# Smoke Test — ozzi-site web

> Goal: verify every feature path works end-to-end against a real Postgres DB.

## Prereqs

1) Create `.env` from `.env.example`.
2) Ensure Postgres is reachable via `DATABASE_URL`.
3) Run migrations:

```bash
npx prisma migrate deploy
# (or in dev) npx prisma migrate dev
```

4) Start the app:

```bash
npm run dev
# open http://localhost:3000
```

## Build + lint

```bash
npm run lint
npm run build
```

## Public: Audit flow

1) Visit `/audit`.
2) Submit with:
   - Full name + email + business name
   - At least ONE link: website/instagram/youtube
3) Expect:
   - Redirect/confirmation page (`/audit/thanks`)
   - DB: new `AuditRequest` row with status `NEW`
   - Telegram notification (only if `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` are set)

Edge checks:
- Submit without any link → should show API error (400).
- Rapid submit > rate limit → should return 429.

## Admin: Login + sessions

1) Set `ADMIN_EMAIL` + `ADMIN_PASSWORD` in `.env`.
2) Start app once and hit `/admin/login`.
3) Login using those creds.
4) Expect:
   - Admin cookie set: `ozzi_admin`
   - Redirect to `/admin/audits`

## Admin: Audits

1) Go to `/admin/audits`.
2) Confirm audit created above is visible.
3) Open audit detail page `/admin/audits/<auditId>`.
4) Change status (NEW → REVIEWING → APPROVED/REJECTED).
5) Confirm status updates persist (refresh page).

## Admin: Intake invite + intake submission

1) From an approved audit, create/generate an invite token (UI action).
2) Validate token works by visiting intake flow with token.
3) Submit intake form.
4) Expect:
   - DB: `IntakeSubmission` created linked to the `AuditRequest`

## Uploads (token-gated)

1) With a valid invite token, upload a file in the intake flow.
2) Expect:
   - API `POST /api/uploads?t=...` returns `{ ok: true }`
   - DB: `SubmissionFile` row created
   - File stored under `UPLOAD_ROOT`

Edge checks:
- Expired token → 401
- Oversized file (> `MAX_UPLOAD_BYTES`, default 50MB) → 413

## Library: Browse + free download

1) As admin, create a FREE `LibraryItem` with:
   - slug
   - title
   - tier=FREE
   - isPublished=true
2) Visit `/library` and open `/library/<slug>`.
3) Trigger free download.
4) Expect:
   - DB: `Lead` created/updated
   - DB: `LibraryFreeDownload` row created

## Library: Premium purchase

1) As admin, create PREMIUM `LibraryItem` with prices.
2) Initiate payment from UI.
3) Verify init endpoints respond:
   - `POST /api/payments/paystack/init`
   - `POST /api/payments/flutterwave/init`
4) Simulate webhook (from provider dashboard or curl) to:
   - `/api/webhooks/paystack`
   - `/api/webhooks/flutterwave`
5) Expect:
   - `Purchase` row created/updated
   - `Entitlement` created
   - Premium download works for entitled email

## Regression checklist

- No console errors on main pages.
- Empty states render cleanly (no crashes) when DB tables are empty.
- Admin routes are protected (logged out users can’t access).
