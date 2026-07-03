export type Niche = {
  slug: string
  label: string
  eyebrow: string
  headline: string
  subheadline: string
  metaTitle: string
  metaDescription: string
  trust: string
  flow: string[]
  problems: string[]
  services: string[]
  recommendedPackage: string
  supportingPackages: string[]
  auditChecks: string[]
  proof: string[]
  faqs: { q: string; a: string }[]
}

const commonFaqs = [
  { q: 'Do you work with businesses outside Nigeria?', a: 'Yes. OZZILAB by Vitotek Systems is positioned for international appointment-driven businesses, especially Canada, the UK, Australia, and similar markets.' },
  { q: 'Can you work with our existing website?', a: 'Yes. The audit checks whether your current website can be improved or whether a focused redesign/landing page would produce a clearer path to enquiries and bookings.' },
  { q: 'Can you connect this to our CRM or follow-up tools?', a: 'Yes. The Growth System can connect lead capture, CRM/pipeline tracking, follow-up automation, booking calendars, reminders, and reporting where the tools support integration.' },
  { q: 'What happens after the audit?', a: 'You receive a practical view of the leakage points and the recommended package path. If there is a fit, the next step is a strategy call and implementation plan.' },
]

export const niches: Niche[] = [
  {
    slug: 'immigration-consultants',
    label: 'Immigration Consultants',
    eyebrow: 'For Immigration Consultants',
    headline: 'Turn Immigration Enquiries Into Qualified Consultation Bookings',
    subheadline: 'We build websites, lead capture, eligibility questions, CRM workflows, and follow-up automation for immigration firms that need faster qualification and more booked consultations.',
    metaTitle: 'Lead Generation & Consultation Booking for Immigration Consultants | OZZILAB',
    metaDescription: 'OZZILAB helps immigration consultants improve service pages, lead capture, eligibility intake, follow-up, and consultation booking. Request a free Lead & Appointment-Leak Audit.',
    trust: 'Remote delivery for immigration consultants in Canada, the UK, Australia, and similar markets.',
    flow: ['Google/Search/Social', 'Immigration Service Page', 'Enquiry Form/WhatsApp', 'Eligibility Questions', 'Consultation Booking', 'Reminder', 'Document/Next-Step Follow-Up', 'CRM Tracking'],
    problems: ['Prospects ask urgent questions but are not qualified properly', 'Leads arrive from website, Google, social, WhatsApp, referrals, and ads', 'Many prospects are not ready or eligible', 'Follow-up is manual and inconsistent', 'Consultation booking is not connected to intake questions', 'Old enquiries are not reactivated'],
    services: ['Visa/pathway service pages', 'Eligibility lead forms', 'WhatsApp response flow', 'Consultation booking', 'CRM status tracking', 'Follow-up automation', 'Reminder messages', 'Old enquiry reactivation'],
    recommendedPackage: 'Growth System',
    supportingPackages: ['Audit & Quick Fix Plan', 'Website Refresh + Lead Capture', 'Monthly Management / Retainer'],
    auditChecks: ['Service page clarity by visa/pathway', 'Lead form quality', 'WhatsApp response flow', 'Eligibility/intake questions', 'Consultation booking path', 'Follow-up sequence', 'Trust/review placement', 'CRM status tracking'],
    proof: ['Eligibility question map', 'Consultation pipeline example', 'Follow-up sequence outline', 'Old enquiry reactivation flow'],
    faqs: [
      { q: 'Can the system qualify immigration leads before a consultation?', a: 'Yes. The flow can include eligibility/intake questions so your team understands pathway, urgency, and fit before booking a consultation.' },
      { q: 'Can old immigration enquiries be reactivated?', a: 'Yes. We can create follow-up and reactivation sequences for old enquiries where the contact data and consent are appropriate.' },
      ...commonFaqs,
      { q: 'Can you build pages for specific visa pathways?', a: 'Yes. Service pages can be structured around specific pathways, eligibility points, trust signals, and consultation CTAs.' },
    ],
  },
  {
    slug: 'dental-clinics',
    label: 'Dental Clinics',
    eyebrow: 'For Dental Clinics',
    headline: 'Book More Dental Consultations From Website, Google, and Social Enquiries',
    subheadline: 'We help dental clinics improve treatment pages, enquiry capture, call/WhatsApp response, booking reminders, and no-show recovery so more patients become booked appointments.',
    metaTitle: 'Lead Generation & Appointment Booking System for Dental Clinics | OZZILAB',
    metaDescription: 'OZZILAB helps dental clinics improve websites, lead capture, follow-up, booking reminders, and patient enquiry conversion. Request a free Lead & Appointment-Leak Audit.',
    trust: 'Remote delivery for dental clinics in Canada, the UK, Australia, and similar appointment-driven markets.',
    flow: ['Google/Search/Ads', 'Treatment Landing Page', 'Enquiry/Call/WhatsApp', 'Treatment Interest Capture', 'Booking', 'Reminder', 'No-Show Recovery', 'Review/Recall Follow-Up'],
    problems: ['Patients browse treatment pages but do not book', 'Calls and forms are not tracked well', 'Cosmetic treatment enquiries need fast follow-up', 'Missed calls are not recovered', 'Appointment reminders are weak', 'Treatment-specific landing pages are missing'],
    services: ['Treatment landing pages', 'Patient enquiry forms', 'Call/WhatsApp CTA flow', 'Booking calendar', 'Appointment reminders', 'No-show recovery', 'Review placement', 'Reporting dashboard'],
    recommendedPackage: 'Growth System or Premium Growth Engine',
    supportingPackages: ['Audit & Quick Fix Plan', 'Website Refresh + Lead Capture', 'Monthly Management / Retainer'],
    auditChecks: ['Treatment-page CTAs', 'Mobile booking flow', 'Phone/call tracking', 'Patient enquiry form', 'Appointment reminders', 'No-show follow-up', 'Review placement', 'Tracking/reporting'],
    proof: ['Treatment enquiry pipeline', 'Missed-call recovery workflow', 'Appointment reminder sequence', 'Weekly patient enquiry report'],
    faqs: [
      { q: 'Can you create landing pages for specific dental treatments?', a: 'Yes. Treatment-specific pages can be created for high-value services with clear CTAs, trust sections, and booking paths.' },
      { q: 'Can you help reduce missed opportunities from calls?', a: 'Yes. The system can map call/WhatsApp response paths and missed-call recovery so enquiries are not lost silently.' },
      ...commonFaqs,
      { q: 'Can reminders help reduce no-shows?', a: 'Yes. Reminder flows can support confirmations, appointment reminders, and follow-up after missed appointments.' },
    ],
  },
  {
    slug: 'med-spas',
    label: 'Med Spas / Beauty Clinics',
    eyebrow: 'For Med Spas & Beauty Clinics',
    headline: 'Turn Beauty and Treatment Enquiries Into Booked Consultations',
    subheadline: 'We connect Instagram, ads, treatment pages, lead capture, booking, reminders, and reactivation so treatment enquiries do not disappear after asking for price.',
    metaTitle: 'Lead Capture & Booking Systems for Med Spas and Beauty Clinics | OZZILAB',
    metaDescription: 'OZZILAB helps med spas and beauty clinics improve treatment pages, DM capture, follow-up, booking reminders, and reactivation. Request a free audit.',
    trust: 'Remote delivery for beauty and treatment businesses in Canada, the UK, Australia, and similar markets.',
    flow: ['Instagram/Ads/Google', 'Treatment Offer Page', 'DM/Form/WhatsApp Capture', 'Qualification', 'Consultation Booking', 'Reminder', 'Treatment Follow-Up', 'Rebooking/Reactivation'],
    problems: ['Instagram/DM leads are not captured properly', 'Offer campaigns do not connect to booking', 'Treatment pages lack clear conversion flow', 'Leads ask price questions and disappear', 'Follow-up depends on staff memory', 'Rebooking/reactivation is inconsistent'],
    services: ['Treatment offer pages', 'DM/WhatsApp capture', 'Price objection follow-up', 'Consultation booking', 'Reminder flows', 'Rebooking campaigns', 'CRM pipeline', 'Campaign reporting'],
    recommendedPackage: 'Growth System',
    supportingPackages: ['Audit & Quick Fix Plan', 'Website Refresh + Lead Capture', 'Premium Growth Engine'],
    auditChecks: ['Treatment offer clarity', 'Instagram/DM capture path', 'Booking CTA visibility', 'Price objection follow-up', 'Consultation reminders', 'Rebooking flow', 'CRM/pipeline setup', 'Campaign reporting'],
    proof: ['Offer-to-booking workflow', 'Price objection follow-up example', 'Rebooking pipeline', 'Campaign reporting layout'],
    faqs: [
      { q: 'Can this connect Instagram or DM enquiries to booking?', a: 'Yes. We can map the capture path and create a structured flow from DM/WhatsApp enquiry to consultation booking.' },
      { q: 'Can you help with price shoppers?', a: 'Yes. Follow-up sequences can educate, qualify, and guide prospects to a consultation instead of losing them after a price question.' },
      ...commonFaqs,
      { q: 'Can we reactivate previous treatment leads?', a: 'Yes. Reactivation is a strong fit when old contacts and consent are available.' },
    ],
  },
  {
    slug: 'real-estate-agencies',
    label: 'Real Estate Agencies',
    eyebrow: 'For Real Estate Teams',
    headline: 'Convert Real Estate Leads Into Viewings, Valuations, and Appointments',
    subheadline: 'We help real estate agencies capture buyer, seller, renter, and investor leads, segment them quickly, and move them into viewings, valuations, and follow-up pipelines.',
    metaTitle: 'Real Estate Lead Capture & Appointment Booking System | OZZILAB',
    metaDescription: 'OZZILAB helps real estate agencies improve buyer/seller lead capture, viewing requests, valuation requests, follow-up, and pipeline tracking. Request a free audit.',
    trust: 'Remote delivery for real estate teams in Canada, the UK, Australia, and similar property markets.',
    flow: ['Property Portal/Social/Website', 'Buyer/Seller Lead Capture', 'Qualification', 'Viewing/Valuation Booking', 'Reminder', 'Follow-Up', 'Pipeline/Nurture'],
    problems: ['Buyer/seller leads are not responded to quickly enough', 'Viewing requests are not tracked cleanly', 'Property enquiries come from multiple channels', 'Leads are not segmented by buyer/seller/renter/investor', 'Follow-up is inconsistent after first contact', 'Old leads are not nurtured'],
    services: ['Buyer/seller landing pages', 'Viewing request flow', 'Valuation request flow', 'Lead segmentation', 'WhatsApp/call response', 'CRM pipeline', 'Nurture follow-up', 'Source tracking'],
    recommendedPackage: 'Growth System',
    supportingPackages: ['Audit & Quick Fix Plan', 'Website Refresh + Lead Capture', 'Monthly Management / Retainer'],
    auditChecks: ['Buyer/seller CTA clarity', 'Viewing request flow', 'Valuation request flow', 'WhatsApp/call response', 'Lead segmentation', 'CRM pipeline', 'Follow-up cadence', 'Source tracking'],
    proof: ['Buyer/seller segmentation map', 'Viewing request pipeline', 'Valuation follow-up flow', 'Lead source report'],
    faqs: [
      { q: 'Can leads be segmented by buyer, seller, renter, or investor?', a: 'Yes. The enquiry flow can capture lead type and route each prospect into the right pipeline or follow-up sequence.' },
      { q: 'Can this support viewing and valuation requests?', a: 'Yes. Separate CTAs and workflows can be created for viewing bookings and valuation enquiries.' },
      ...commonFaqs,
      { q: 'Can old real estate leads be nurtured?', a: 'Yes. Old leads can be organized into nurture sequences where appropriate.' },
    ],
  },
  {
    slug: 'home-services',
    label: 'Home Services',
    eyebrow: 'For Home Service Businesses',
    headline: 'Turn Local Service Enquiries Into Booked Quotes and Jobs',
    subheadline: 'We help roofing, HVAC, plumbing, cleaning, renovation, pest control, and similar businesses respond faster, recover missed calls, track quote requests, and follow up until jobs are booked.',
    metaTitle: 'Lead Capture & Quote Booking System for Home Services | OZZILAB',
    metaDescription: 'OZZILAB helps home service businesses improve local service pages, quote requests, missed-call recovery, follow-up, and booking flows. Request a free audit.',
    trust: 'Remote delivery for home service businesses in Canada, the UK, Australia, and similar local markets.',
    flow: ['Google/Local Ads/Website', 'Service Page', 'Quote Request/Call', 'Instant Response', 'Job Qualification', 'Booking/Visit', 'Reminder', 'Quote Follow-Up', 'Review/Reactivation'],
    problems: ['Leads often choose whoever responds first', 'Missed calls are not recovered', 'Quote requests are not tracked properly', 'Service pages are weak or generic', 'Follow-up after quote is inconsistent', 'Customer reactivation is often ignored'],
    services: ['Local service pages', 'Quote request forms', 'Missed-call recovery', 'Phone/WhatsApp CTA', 'Job qualification questions', 'Booking reminders', 'Quote follow-up', 'Review request flow'],
    recommendedPackage: 'Website Refresh + Lead Capture or Growth System',
    supportingPackages: ['Audit & Quick Fix Plan', 'Monthly Management / Retainer', 'Premium Growth Engine'],
    auditChecks: ['Local service page clarity', 'Quote request flow', 'Missed-call recovery', 'Phone/WhatsApp CTA', 'Job qualification questions', 'Appointment reminders', 'Quote follow-up', 'Review request flow'],
    proof: ['Quote request tracker', 'Missed-call recovery sequence', 'Job booking pipeline', 'Review request workflow'],
    faqs: [
      { q: 'Can this help if most leads call instead of filling forms?', a: 'Yes. The audit checks phone/call flow and missed-call recovery so call-based enquiries are not ignored.' },
      { q: 'Can quote follow-up be automated?', a: 'Yes. Follow-up can remind prospects, answer objections, and prompt them to book or approve the next step.' },
      ...commonFaqs,
      { q: 'Can this support multiple service areas?', a: 'Yes. Service and location pages can be planned where they make sense for your market.' },
    ],
  },
  {
    slug: 'law-firms',
    label: 'Law Firms',
    eyebrow: 'For Law Firms',
    headline: 'Turn Legal Enquiries Into Qualified Consultation Requests',
    subheadline: 'We help legal practices improve practice area pages, confidential intake, trust signals, consultation booking, and lead source tracking without relying on inflated promises or aggressive guarantees.',
    metaTitle: 'Legal Consultation Intake & Booking System for Law Firms | OZZILAB',
    metaDescription: 'OZZILAB helps law firms improve practice area pages, confidential enquiries, consultation booking, follow-up, and source tracking. Request a free audit.',
    trust: 'Remote delivery for legal practices in Canada, the UK, Australia, and similar markets.',
    flow: ['Google/Search/Referral', 'Practice Area Page', 'Confidential Enquiry', 'Case-Type Qualification', 'Consultation Booking', 'Reminder', 'Follow-Up', 'Internal Review'],
    problems: ['Potential clients need trust and clarity before contacting', 'Intake forms may not qualify properly', 'Practice area pages may not convert', 'Confidential enquiries need careful handling', 'Follow-up and consultation booking may be manual', 'Lead source tracking is often weak'],
    services: ['Practice area pages', 'Confidential enquiry flow', 'Consultation CTAs', 'Intake qualification', 'Follow-up sequence', 'Admin notifications', 'Source tracking', 'Trust sections'],
    recommendedPackage: 'Growth System or Premium Growth Engine',
    supportingPackages: ['Audit & Quick Fix Plan', 'Website Refresh + Lead Capture', 'Monthly Management / Retainer'],
    auditChecks: ['Practice area page clarity', 'Trust and credibility sections', 'Confidential enquiry flow', 'Consultation CTA', 'Intake/qualification questions', 'Follow-up sequence', 'Source tracking', 'Admin notification process'],
    proof: ['Practice-area conversion map', 'Confidential intake flow', 'Consultation pipeline', 'Source tracking report'],
    faqs: [
      { q: 'Can legal enquiries be handled confidentially?', a: 'Yes. The flow can be designed with careful intake, appropriate notifications, and clear internal review steps.' },
      { q: 'Can this support different practice areas?', a: 'Yes. Practice area pages can each have tailored CTAs, qualification questions, and consultation paths.' },
      ...commonFaqs,
      { q: 'Do you make legal guarantees?', a: 'No. The system improves clarity, response, tracking, and booking flow; it does not promise case outcomes.' },
    ],
  },
  {
    slug: 'private-tutors-training-centres',
    label: 'Private Tutors / Training Centres',
    eyebrow: 'For Tutors & Training Centres',
    headline: 'Convert Course and Tutoring Enquiries Into Calls, Applications, and Enrolments',
    subheadline: 'We help tutors and training centres capture parent/student interest, segment programmes, book assessments or calls, send reminders, and follow up toward enrolment.',
    metaTitle: 'Course Enquiry & Enrolment Follow-Up System | OZZILAB',
    metaDescription: 'OZZILAB helps tutors and training centres improve course pages, enquiry capture, assessment booking, reminders, and enrolment follow-up. Request a free audit.',
    trust: 'Remote delivery for training businesses in Canada, the UK, Australia, and similar education markets.',
    flow: ['Social/Google/Referral', 'Course Page', 'Enquiry Form/WhatsApp', 'Programme Interest Capture', 'Assessment/Call Booking', 'Reminder', 'Enrolment Follow-Up', 'Student Pipeline'],
    problems: ['Parents/students enquire but are not followed up consistently', 'Course pages do not explain outcomes clearly', 'Enquiries are not segmented by course/programme', 'Trial class or assessment booking is not automated', 'Reminders and enrolment follow-up are weak'],
    services: ['Course/programme pages', 'Enquiry forms', 'WhatsApp response', 'Assessment booking', 'Parent/student segmentation', 'Follow-up messages', 'Reminder system', 'Enrolment tracking'],
    recommendedPackage: 'Website Refresh + Lead Capture or Growth System',
    supportingPackages: ['Audit & Quick Fix Plan', 'Monthly Management / Retainer', 'Premium Growth Engine'],
    auditChecks: ['Course/programme page clarity', 'Enquiry form quality', 'WhatsApp response', 'Assessment/trial booking', 'Parent/student segmentation', 'Follow-up messages', 'Reminder system', 'Enrolment tracking'],
    proof: ['Programme interest map', 'Assessment booking flow', 'Enrolment follow-up sequence', 'Student pipeline example'],
    faqs: [
      { q: 'Can enquiries be separated by course or programme?', a: 'Yes. Forms and CRM fields can segment enquiries by course, learner type, urgency, and next step.' },
      { q: 'Can assessment or trial class bookings be automated?', a: 'Yes. The system can guide prospects from enquiry to assessment/trial booking with reminders.' },
      ...commonFaqs,
      { q: 'Can parents and students receive different follow-up?', a: 'Yes. Messaging can be structured based on the audience and programme type.' },
    ],
  },
  {
    slug: 'auto-repair-car-dealerships',
    label: 'Auto Repair / Car Dealerships',
    eyebrow: 'For Auto Repair & Dealerships',
    headline: 'Turn Vehicle and Service Enquiries Into Booked Appointments and Sales Conversations',
    subheadline: 'We help auto businesses capture service requests, vehicle enquiries, quote questions, test-drive interest, reminders, and old customer reactivation in one clearer flow.',
    metaTitle: 'Auto Service Booking & Vehicle Enquiry Follow-Up System | OZZILAB',
    metaDescription: 'OZZILAB helps auto repair shops and dealerships improve service booking, quote follow-up, vehicle enquiries, reminders, and customer reactivation. Request a free audit.',
    trust: 'Remote delivery for auto businesses in Canada, the UK, Australia, and similar markets.',
    flow: ['Google/Social/Marketplace/Website', 'Service or Vehicle Enquiry', 'Quote/Availability Response', 'Booking/Test Drive/Inspection', 'Reminder', 'Follow-Up', 'Reactivation'],
    problems: ['Service requests need fast response', 'Vehicle enquiries go cold quickly', 'Quote requests are not followed up well', 'Appointment reminders are inconsistent', 'Past customers are not reactivated', 'Leads from marketplaces/social are not tracked centrally'],
    services: ['Service/vehicle pages', 'Quote request flow', 'Marketplace/social capture', 'Appointment booking', 'Test-drive booking', 'Reminder process', 'Old customer reactivation', 'Source tracking'],
    recommendedPackage: 'Website Refresh + Lead Capture or Growth System',
    supportingPackages: ['Audit & Quick Fix Plan', 'Monthly Management / Retainer', 'Premium Growth Engine'],
    auditChecks: ['Service/vehicle page CTA', 'Quote request flow', 'Marketplace/social lead capture', 'Appointment/test-drive booking', 'Reminder process', 'Follow-up cadence', 'Old customer reactivation', 'Source tracking'],
    proof: ['Service booking pipeline', 'Vehicle enquiry tracker', 'Quote follow-up sequence', 'Customer reactivation workflow'],
    faqs: [
      { q: 'Can this support both service bookings and vehicle enquiries?', a: 'Yes. The system can separate service requests, quote requests, vehicle enquiries, and test-drive/inspection booking paths.' },
      { q: 'Can old customers be reactivated?', a: 'Yes. Past customers can be organized into reactivation campaigns where contact data and consent are appropriate.' },
      ...commonFaqs,
      { q: 'Can marketplace leads be tracked?', a: 'Yes. The audit can map how marketplace/social enquiries enter your follow-up and booking process.' },
    ],
  },
]

export const nicheMap = new Map(niches.map((niche) => [niche.slug, niche]))

export function getNiche(slug: string) {
  return nicheMap.get(slug)
}

export function getNicheLabel(slug?: string | null) {
  if (!slug) return ''
  return nicheMap.get(slug)?.label || ''
}
