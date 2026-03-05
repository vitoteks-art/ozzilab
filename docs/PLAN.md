# Mission Control Sync Plan (ozzilab.cloud)

## Scope / Non-goals

### In-scope
- Single source of truth: PostgreSQL on VPS.
- Admin “Mission Control” inside the Next.js app:
  - Activity feed (append-only event log)
  - Projects (lightweight delivery tracking)
  - Leads / Audits / Intakes (already modeled)
  - Basic stats cards on homepage (pulled from DB)
- Ozzi (OpenClaw agent) can:
  - Create activity events (“log work”)
  - Generate intake links (tokenized)
  - Read key records for context (projects/leads/audits/intakes)

### Non-goals (for MVP)
- Multi-tenant accounts.
- Complex analytics/BI.
- Full CRM replacement.
- Public real-time dashboards.

## Users & Roles

- **Admin**: Victor (and future admins) using session auth.
- **Service Actor (Ozzi)**: server-to-server token with scoped permissions.
- **Client**: anonymous/token-auth flows for intake submission.

## Data Model

> Existing models: `AdminUser`, `AdminSession`, `AuditRequest`, `IntakeInviteToken`, `IntakeSubmission`, `SubmissionFile`, `Lead`, `LibraryItem`, `Purchase`, `Entitlement`.

### Add: Project
A lightweight entity to anchor delivery + timelines.

```prisma
enum ProjectStatus {
  NEW
  ACTIVE
  BLOCKED
  COMPLETED
  ARCHIVED
}

model Project {
  id            String        @id @default(uuid())
  code          String        @unique // human-friendly ID e.g. PRJ_2026_0001
  name          String
  description   String?
  status        ProjectStatus @default(NEW)

  // optional links to existing funnel
  auditRequestId String?
  intakeSubmissionId String?

  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  auditRequest     AuditRequest?     @relation(fields: [auditRequestId], references: [id], onDelete: SetNull)
  intakeSubmission IntakeSubmission? @relation(fields: [intakeSubmissionId], references: [id], onDelete: SetNull)

  events        ActivityEvent[]

  @@index([status, createdAt])
}
```

### Add: ActivityEvent (append-only)
This is the synchronization backbone. Everything important becomes an event.

```prisma
enum ActorType {
  ADMIN
  OZZI
  CLIENT
  SYSTEM
}

enum EntityType {
  PROJECT
  AUDIT_REQUEST
  INTAKE_SUBMISSION
  LEAD
  LIBRARY_ITEM
  PURCHASE
}

model ActivityEvent {
  id          String     @id @default(uuid())
  type        String     // e.g. "intake_link_created", "intake_submitted", "project_created", "deliverable_shipped"
  actorType   ActorType
  actorId     String?    // AdminUser.id when ADMIN; null ok for SYSTEM/CLIENT

  entityType  EntityType
  entityId    String
  projectId   String?

  payload     Json?
  createdAt   DateTime   @default(now())

  project     Project?   @relation(fields: [projectId], references: [id], onDelete: SetNull)

  @@index([createdAt])
  @@index([type, createdAt])
  @@index([entityType, entityId])
  @@index([projectId, createdAt])
}
```

### Add: ServiceToken (Ozzi auth)
```prisma
model ServiceToken {
  id           String   @id @default(uuid())
  name         String   @unique // "ozzi"
  tokenHash    String   @unique
  scopes       String   // comma-separated or JSON string (MVP)
  isActive     Boolean  @default(true)
  lastUsedAt   DateTime?
  createdAt    DateTime @default(now())
}
```

### Notes on IDs
- Keep current `auditId`/`submissionId` patterns; introduce `Project.code` for human-facing references.
- Intake tokens should remain **hashed at rest** (you already store `tokenHash`).

## API Endpoints

### Auth
- Admin: existing session cookies.
- Service (Ozzi): `Authorization: Bearer <SERVICE_TOKEN>`.

### Events (core sync)
- `POST /api/events`
  - Creates an `ActivityEvent`.
  - Service-scoped and admin-scoped.
- `GET /api/events?projectId=&entityType=&entityId=&type=&from=&to=&limit=`
  - Admin-only.

### Stats (homepage)
- `GET /api/stats/overview`
  - Returns cards:
    - audits_new_7d
    - intakes_new_7d
    - projects_active
    - events_today
    - revenue_30d (from `Purchase` SUCCESS)

### Intake link generation + submission
- `POST /api/intake-links`
  - Input: `{ auditRequestId, expiresInHours, deliveryEmail?, deliveryWhatsApp? }`
  - Output: `{ url: "https://ozzilab.cloud/intake/<token>", expiresAt }`
  - Also logs `ActivityEvent(type="intake_link_created", entityType=AUDIT_REQUEST, entityId=auditRequestId)`
- `POST /api/intake/<token>/submit`
  - Validates token by hash + expiry + unused.
  - Creates `IntakeSubmission`.
  - Marks token `usedAt=now()`.
  - Logs `ActivityEvent(type="intake_submitted", entityType=INTAKE_SUBMISSION, entityId=intakeSubmissionId)`.

### Projects
- `POST /api/projects` (admin)
- `GET /api/projects` (admin)
- `GET /api/projects/:id` (admin/service read)
- `PATCH /api/projects/:id` (admin)
  - Each change should also create an `ActivityEvent` (“project_updated”).

## Pages

Public
- `/` homepage with stats (optional: hide stats unless admin; MVP can show public marketing only and render stats in admin)
- `/audit` (existing)
- `/intake/[token]` (client intake)
- `/library` (existing)

Admin
- `/admin/login`
- `/admin` (dashboard overview)
- `/admin/events` (activity feed)
- `/admin/projects`
- `/admin/audits`
- `/admin/intakes`
- `/admin/library`
- `/admin/purchases`

## Jobs / Cron

MVP (simple)
- Nightly DB backup (pg_dump) to `/var/backups/ozzi/` + retention 7–14 days.
- Optional: daily metric rollup into `DailyMetrics` (Phase 2).

## Security

- Postgres:
  - **No public port exposure** in production (remove `ports:`; use internal Docker network).
  - Strong password, stored in VPS env/secrets.
- Service token:
  - Store only `tokenHash` (bcrypt/sha256+salt).
  - Scopes: `events:write`, `intake_links:write`, `records:read`.
- Rate limit public intake endpoints.
- Validate and sanitize all URLs/strings; use Zod at API boundaries.
- Audit trail: rely on `ActivityEvent` append-only discipline.

## Observability

- Log API requests (minimal PII), include requestId.
- Track:
  - count of events/day
  - failed intake submissions
  - token validation failures (possible abuse)

## Milestones

1) **DB + Prisma**
- Add `Project`, `ActivityEvent`, `ServiceToken` models.
- Migration.

2) **API routes**
- `/api/events`, `/api/stats/overview`, `/api/intake-links`, `/api/intake/[token]/submit`, `/api/projects`.

3) **Admin UI**
- Events feed + Projects list.

4) **Ozzi integration**
- Service token provision.
- Document 3 calls Ozzi will use:
  - create event
  - create intake link
  - fetch project/audit context

5) **Ops hardening**
- Remove DB public port in production.
- Backups + retention.
