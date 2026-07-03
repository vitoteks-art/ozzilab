# UI SPEC — Ozzi International Appointment Growth Platform

## Project

- **Project ID:** `OZZI-BOOKING-20260703`
- **Gate:** UI
- **Approved Plan:** `APPROVE PLAN OZZI-BOOKING-20260703`
- **Visual source of truth:** `/root/.openclaw/workspace-ozzi/ozzi-site/ui-ux/stitch_international_appointment_growth_platform/stitch_international_appointment_growth_platform`
- **Booking mechanics reference:** `/root/.openclaw/workspace/dr-challah-site/_work/badru-site/destiny-health-spirit`

## UI Direction

Use the Stitch international appointment-growth UI as the standard. The finished site should feel like a premium international B2B/SaaS growth platform: clean, calm, conversion-focused, and credible for Canada, UK, Australia, and other appointment-driven markets.

### Design Tokens

- **Background:** `#F7F9FB`, `#F8FAFC`
- **Surface:** `#FFFFFF`
- **Text:** deep navy / near-black `#0F172A`, `#191C1E`
- **Muted text:** slate `#475569`, `#45464D`
- **Primary action blue:** `#2563EB` / `#0051D5`
- **Dark CTA:** `#0D1C2E`, `#131B2E`
- **Border:** slate/outline at 10–20% opacity
- **Typography:** Geist-style sans-serif, no serif-heavy homepage treatment
- **Radius:** 8px default; 16–24px for large marketing cards where Stitch does it
- **Elevation:** subtle borders + soft low-opacity shadows only

## Global Layout

### Public navigation

Source: Stitch homepage/services/pricing nav.

Desktop nav:
- Brand: `Ozzilab | Vitotek`
- Links:
  - Services → `/services`
  - Industries → `/industries`
  - Pricing → `/pricing`
  - Resources → `/library`
  - About → `/about`
- Primary CTA: `Request Audit` → `/audit`
- Secondary action where useful: `Book Strategy Call` → `/book`

Mobile nav:
- Hamburger drawer
- Same links stacked
- CTA buttons full-width or clearly separated

### Footer

Use Stitch footer style:
- Brand + concise positioning
- Explore links
- Company/contact links
- Privacy / Terms
- Remove placeholder social links unless real URLs are available
- Contact email should be real project email if available; otherwise keep `hello@ozzilab.com`/configured project email consistently

## Pages

## 1. Homepage `/`

Visual source: `ozzilab_vitotek_homepage`.

### Sections

1. **Hero**
   - Headline: “Generate More Qualified Leads and Turn Them Into Booked Appointments”
   - Subcopy: websites, landing pages, lead capture systems, CRM workflows, follow-up automation for Canada/UK/Australia appointment-driven businesses
   - CTAs:
     - Primary: `Request Free Lead Audit` → `/audit`
     - Secondary: `View Service Packages` → `/pricing`
   - Right visual: workflow/system/dashboard-style panel, not generic abstract graphic

2. **Trust microcopy row**
   - Remote delivery for Canada, UK, Australia
   - Built for clinics, consultants, agencies, real estate teams, and service businesses
   - No spam systems / no generic websites

3. **Problem / lead leak section**
   - Show leakage points: website visitors, slow response, missed WhatsApp, no CRM, weak follow-up, no reminders, old leads not reactivated

4. **System flow section**
   - Traffic → Landing Page → Lead Capture → Instant Response → Qualification → Booking → Reminder → Follow-Up → Reporting

5. **Core capabilities cards**
   - Website & Landing Pages
   - Lead Generation Setup
   - CRM & Pipeline Setup
   - WhatsApp/Email/SMS Follow-Up Automation
   - Appointment Booking Systems
   - Monthly Optimization

6. **Package preview**
   - Audit & Quick Fix Plan
   - Website Refresh + Lead Capture
   - Growth System (Recommended)
   - Premium Growth Engine
   - Monthly Management as ongoing add-on

7. **Industries preview**
   - Cards for priority niches
   - Each card states the niche-specific appointment leak

8. **Dark CTA band**
   - Headline: “Stop leaking revenue. Start booking appointments.”
   - CTA: `Request Free Lead & Appointment-Leak Audit`
   - Optional compact audit lead form if implementation time permits

### States

- Buttons hover: blue deepens subtly
- Mobile: hero stacks; CTA buttons full width; cards collapse to one column

## 2. Services `/services`

Visual source: `ozzilab_vitotek_services_overview`.

### Sections

1. Hero: appointment-growth systems overview
2. Core Systems Architecture grid
3. Service cards:
   - Website Development & Redesign
   - Landing Pages
   - Lead Generation Setup
   - CRM / Pipeline Setup
   - WhatsApp, Email & SMS Follow-Up Automation
   - Appointment Booking Systems
   - Monthly Optimization
4. System flow visualization
5. Global delivery / markets served
6. CTA to `/audit` and `/book`

## 3. Detailed Service Page `/services/website-lead-appointment-growth`

### Sections

1. Offer summary
2. Who it is for
3. Problems solved
4. System diagram
5. Package comparison summary
6. Detailed inclusions
7. Country pricing ranges
8. Monthly retainer section
9. FAQ
10. CTA to `/audit` and `/book`

## 4. Pricing `/pricing`

Visual source: `ozzilab_vitotek_pricing_packages`.

### Sections

1. Hero: “Flexible Packages for Appointment-Driven Growth”
2. Currency tabs:
   - CAD
   - GBP
   - AUD
3. Four package cards:
   - Audit & Quick Fix
   - Website Refresh
   - Growth System — highlighted as Recommended
   - Premium Growth Engine
4. Monthly Management & Optimization section
5. Pricing explanation: final quote depends on scope, integrations, automation complexity, pages, and campaign requirements
6. FAQ
7. CTA band

### Mobile

- Four cards collapse to one column
- Recommended badge remains visible at top of card
- Currency tabs remain horizontally scrollable or wrap cleanly

## 5. Industries `/industries`

### Sections

1. Hero: appointment-driven businesses served
2. Industry card grid:
   - Immigration consultants
   - Dental clinics
   - Med spas / beauty clinics
   - Real estate agencies
   - Home services
   - Law firms
   - Training centres
   - Auto repair / car dealerships
3. Niche-specific lead-flow examples
4. CTA to `/audit`

## 6. About `/about`

### Sections

1. Company credibility and remote delivery statement
2. Process transparency
3. Markets served
4. Data/privacy reassurance
5. CTA to `/audit` and `/book`

## 7. Audit `/audit`

Visual source: `free_lead_appointment_leak_audit`.

### Layout

Desktop:
- Left: multi-step form card
- Right: “What we check” sidebar

Mobile:
- Form first
- Sidebar below form

### Form steps

1. **Contact Details**
   - Full name
   - Email
   - WhatsApp/phone
   - Country

2. **Business Details**
   - Business name
   - Industry/niche
   - Decision maker status

3. **Current Links**
   - Website URL
   - Instagram URL
   - LinkedIn URL
   - YouTube URL
   - Google Business Profile URL
   - Scheduler/booking URL
   - Rule: at least one accepted link required

4. **Lead & Appointment Flow**
   - Current lead sources
   - Appointment booking method
   - Monthly lead volume
   - Average client value range
   - Biggest lead/appointment problem

5. **Readiness**
   - Main goal
   - Budget/readiness/urgency
   - Preferred package interest
   - Submit

### Sidebar checklist

- Website / landing page conversion
- Lead capture flow
- CRM/pipeline tracking
- Response speed
- Follow-up sequence
- Booking/reminder flow
- Reporting visibility

### Confirmation

After submission:
“Thanks — your Lead & Appointment-Leak Audit request has been received. We’ll review your website, lead capture, follow-up, and booking flow, then respond with next steps within 24–48 hours.”

## 8. Booking `/book`

Visual source: derived from Stitch audit form + Dr Challah booking mechanics.

### Page purpose

Let qualified prospects book a lead/appointment-growth strategy call or package consultation.

### Layout

Desktop:
- Hero at top
- Two-column booking shell:
  - Left: step-by-step booking workflow
  - Right: sticky booking summary/value card

Mobile:
- Single-column flow
- Booking summary appears below selected slot or before review step

### Hero

- Headline: “Book a Lead & Appointment Growth Strategy Call”
- Subcopy: “Choose a time to discuss your website, lead capture, CRM, follow-up, and appointment booking flow.”
- Trust text: “Remote delivery for Canada, UK, Australia, and international appointment-driven businesses.”

### Steps

1. **Meeting Type**
   - Free Lead & Appointment-Leak Audit Call
   - Website Refresh + Lead Capture Consultation
   - Growth System Strategy Call
   - Premium Growth Engine Discovery Call
   - Monthly Management / Retainer Review

2. **Date & Time**
   - Load available slots from `GET /api/bookings/available-slots`
   - Date cards show day/date + available slot count
   - Time slot cards show start/end time
   - Selected slot uses blue border/fill treatment
   - Empty state: “No available slots for this date”
   - Loading state: skeleton slot cards

3. **Contact & Business Details**
   - Full name
   - Email
   - WhatsApp/phone
   - Country
   - Business name
   - Industry/niche

4. **Business Context**
   - Website/social/booking links
   - Current lead sources
   - Main lead/appointment problem
   - Monthly lead volume
   - Budget/readiness
   - Preferred package interest

5. **Review & Submit**
   - Show selected meeting type
   - Show selected date/time
   - Show contact/business summary
   - CTA: `Book Strategy Call`

### Sidebar

- Selected slot summary
- Selected package/meeting type
- “What happens next”:
  1. We review your details
  2. We confirm fit and scope
  3. We discuss your appointment-growth system
  4. You receive next-step recommendations
- Reassurance: response/confirmation within 24–48 hours

### Success `/book/thanks`

- Title: “Your strategy call request has been received”
- Show booking reference
- Show expected response time
- CTA: back to services/pricing

## 9. Admin Booking Management

### Route

- Add admin bookings section/page under admin console.

### UI

- Table/list of bookings
- Columns:
  - Booking ID
  - Name
  - Business
  - Country
  - Meeting type
  - Scheduled time
  - Status
  - Created date
- Filters:
  - Status
  - Meeting type
  - Date range
- Detail view/panel:
  - Contact details
  - Links
  - lead/appointment context
  - internal notes
  - status update

### Statuses

- NEW
- CONFIRMED
- RESCHEDULE_REQUESTED
- COMPLETED
- CANCELLED

## 10. Intake Flow Fix

Use Option A from PRD unless blocked:
- Intake form + uploads in one flow
- Submit once
- Thank-you page after everything is completed

UI pattern:
- Same Stitch form style
- File upload dropzone/card
- Clear selected-file list
- Upload/submit loading state

## Loading, Empty, Error, Success States

### Loading

- Skeleton cards for date/time slots
- Disabled CTA with “Submitting…”

### Empty

- Slots: “No available slots for this date. Try another day.”
- Admin bookings: “No bookings yet.”

### Error

- Inline field errors
- Top-level alert for submit/API failure
- Slot conflict: “That time was just taken. Please choose another slot.”

### Success

- Toast or confirmation panel
- Redirect to thank-you pages for audit and booking

## Accessibility

- All inputs must have labels
- Visible focus states using accent blue
- Buttons have descriptive text
- Color is not the only indicator for status
- Forms must be keyboard navigable

## Implementation Notes

- Existing Ozzi code uses a serif/Playfair-heavy homepage. Replace with the Stitch/Geist-style direction.
- Existing Products should be hidden or de-emphasized from main nav.
- Library remains as Resources.
- Keep admin/intake/library functionality working.
- Do not copy Dr Challah medical language.
- Dr Challah booking is only a logic/mechanics reference.

## UI Approval

Reply with:

`APPROVE UI OZZI-BOOKING-20260703`

Then implementation can begin.
