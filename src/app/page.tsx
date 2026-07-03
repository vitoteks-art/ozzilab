import Link from 'next/link'
import { featuredPortfolioProjects } from '@/lib/projects'

const headshots = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuATpFRWCIU3TruZTfnOt_JMfu5E4DhlRVHMCWw0BKTrvt9K30IhzRibJXtwTni96ksHI8Hf6f_joMPpDf5VOhQCwfciSw0i7GTdiOk6rUqbHdvcsWLdOHBdiyRZ--F7U-QkBlaWRnyPZyA0Lq2rAzDbIrbDLcC5ERiH_Qwsc3kTVXgVloWOzW0qWgv4nJWnnAzaCi8BnUwIviV10lilo08b3v8u0ALvtOSTO9trrqB54vNgpHvDoh3F',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAkf-B5nHDm2hF44T3IFz96KYs3ybB-cv53brLOjvbHRFwcbYZ3egrvlyw6txh_focys5G4rB8bhb1H2bek85FHsXv4mVmWGyL62zTy2djYsfA6zDXUAPafkOPz0Fic1wieoDAvcblxcNVcK7xlABjbBqjS-avqsbngN4zz6hC4wDFnrkaicbK34nDkl0U4Z7DYbQU3on7SY1GBMBEfSSpcaLsvdBgw3oLpu4Yb82_iXcDdk0gIjiYB',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC_ffAieXN-q2LiTBlo6_NjKNsHbrfJlp_fFP8Yp9Y_xDaTQlcBCGXnrnybidIb6K15CRlO0-UQSU0w_HkSl1GhaS23GRIk9wxoDlqZo_WuAz_h2l8VJYDVKHPYJFrZDkLZvW2jU8QZGfmwDKMiSdfBPRm4JRrk02wI7kz1TjfcNNqUtYnZy-Ih3BAl2N0g-7TTCp7Wn3mzFYu1KQ3lWFlfQ-kZRkmcHkIB1171duDhi94-dYYnuAD_',
]

const services = [
  ['web', 'Website Development / Redesign', 'Premium business websites, redesigns, landing pages, clear CTAs, contact forms, and mobile-friendly enquiry flow.'],
  ['filter_alt', 'Lead Generation Setup', 'Lead capture, campaign setup, tracking, hot lead notifications, and conversion-leak visibility.'],
  ['automation', 'CRM, Follow-Up & Booking', 'CRM pipelines, instant response, WhatsApp/email/SMS follow-up, booking calendars, reminders, and no-show recovery.'],
  ['trending_up', 'Monthly Growth Management', 'Ongoing website updates, landing page edits, automation monitoring, reporting, follow-up improvements, and optimization.'],
]

export default function HomePage() {
  return (
    <main className="overflow-x-hidden bg-[#f7f9fb] text-[#191c1e] selection:bg-[#dbe1ff] selection:text-[#00174b]">
      <section className="relative mx-auto max-w-[1480px] overflow-hidden px-5 pb-24 pt-24 md:px-10 xl:px-16">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_78%_18%,rgba(37,99,235,0.18),transparent_28%),radial-gradient(circle_at_20%_12%,rgba(219,225,255,0.65),transparent_28%),linear-gradient(180deg,#ffffff_0%,#f7f9fb_100%)]" />
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          <div className="z-10 flex flex-col gap-8 lg:col-span-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#0051d5]/20 bg-[#dbe1ff]/50 px-3 py-1">
              <span className="material-symbols-outlined text-[16px] text-[#0051d5]">verified</span>
              <span className="text-[12px] font-semibold uppercase leading-[1.4] tracking-wider text-[#003ea8]">Canada · UK · Australia</span>
            </div>
            <h1 className="max-w-4xl text-[42px] font-semibold leading-[1.05] tracking-[-0.045em] text-slate-950 md:text-[64px] md:leading-[0.98]">
              Website, Lead Generation & <span className="text-[#0051d5]">Appointment Growth System</span>
            </h1>
            <p className="max-w-2xl text-[18px] font-normal leading-[1.7] text-slate-600">
              We help appointment-driven businesses generate more qualified enquiries and turn them into booked appointments using modern websites, landing pages, lead capture systems, CRM tracking, follow-up automation, booking flows, reminders, and monthly optimization.
            </p>
            <div className="flex flex-col gap-4 pt-2 sm:flex-row">
              <Link className="group inline-flex items-center justify-center rounded bg-[#0051d5] px-8 py-4 text-center text-[14px] font-semibold leading-[1.5] tracking-[0.01em] text-white shadow-[0_4px_20px_rgba(37,99,235,0.2)] transition-all hover:bg-[#316bf3]" href="/audit">
                Request Free Lead Audit
                <span className="material-symbols-outlined ml-2 transition-transform group-hover:translate-x-1">arrow_forward</span>
              </Link>
              <Link className="inline-flex items-center justify-center rounded border border-[#c6c6cd] bg-transparent px-8 py-4 text-center text-[14px] font-semibold leading-[1.5] tracking-[0.01em] text-[#191c1e] transition-colors hover:bg-[#eceef0]" href="/pricing">
                View Service Packages
              </Link>
            </div>
            <div className="mt-4 flex items-center gap-4 border-t border-[#c6c6cd]/20 pt-4">
              <div className="flex -space-x-3">
                {headshots.map((src) => (
                  <div key={src} className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-[#f7f9fb] bg-[#eceef0]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="h-full w-full object-cover" src={src} alt="Professional business headshot" />
                  </div>
                ))}
              </div>
              <p className="text-[12px] font-semibold leading-[1.4] tracking-[0.05em] text-[#45464d]">Built for dental clinics, med spas, immigration consultants, real estate, home services, law firms, training centres, and auto businesses</p>
            </div>
          </div>

          <div className="relative mt-8 lg:col-span-6 lg:mt-0">
            <div className="relative rounded-[1.35rem] border border-[#c6c6cd]/50 bg-white p-2 shadow-[0_18px_60px_rgba(13,28,46,0.10)] ring-1 ring-white/80">
              <div className="overflow-hidden rounded-[1rem] border border-[#e0e3e5] bg-[#f7f9fb]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/ozzi-hero-split.png"
                  alt="OZZILAB by Vitotek Systems appointment growth hero visual"
                  className="aspect-[16/9] min-h-[340px] w-full object-cover object-center md:min-h-[430px] lg:min-h-[500px]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative border-y border-slate-200/70 bg-white px-5 py-24 md:px-10 xl:px-16" id="services">
        <div className="mx-auto max-w-[1480px]">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-blue-600">Premium growth infrastructure</p>
            <h2 className="mb-3 text-[28px] font-semibold leading-[1.15] tracking-[-0.03em] text-slate-950 md:text-[44px]">Core Capabilities</h2>
            <p className="text-[16px] font-normal leading-[1.6] text-[#45464d]">The core services prospects need to capture demand, reduce lead leakage, follow up faster, and convert enquiries into appointments.</p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {services.map(([icon, title, desc]) => (
              <div key={title} className="group flex min-h-[250px] flex-col gap-5 rounded-[1.5rem] border border-slate-200 bg-white p-7 shadow-[0_16px_50px_rgba(15,23,42,0.04)] transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_24px_70px_rgba(37,99,235,0.10)]">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 transition-colors group-hover:bg-blue-50">
                  <span className="material-symbols-outlined text-[24px] text-black group-hover:text-[#0051d5]">{icon}</span>
                </div>
                <div>
                  <h3 className="mb-3 text-xl font-semibold leading-[1.25] tracking-[-0.02em] text-slate-950">{title}</h3>
                  <p className="text-sm font-normal leading-[1.6] text-[#45464d]">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f9fb] px-5 py-24 md:px-10 xl:px-16">
        <div className="mx-auto max-w-[1480px]">
          <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-blue-600">Selected projects</p>
              <h2 className="text-[28px] font-semibold leading-[1.15] tracking-[-0.03em] text-slate-950 md:text-[44px]">Execution across AI, websites, and business systems.</h2>
              <p className="mt-4 text-[16px] leading-[1.7] text-[#45464d]">A quick look at Vitotek/OZZILAB work across platforms, websites, funnels, operations, healthcare, real estate, and organization systems.</p>
            </div>
            <Link href="/projects" className="inline-flex w-fit items-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-800 shadow-sm hover:border-blue-200 hover:text-blue-700">
              View all projects
              <span className="material-symbols-outlined ml-2 text-lg">arrow_forward</span>
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featuredPortfolioProjects.map((project) => (
              <Link key={project.title} href="/projects" className="group overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-[0_16px_50px_rgba(15,23,42,0.04)] transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_24px_70px_rgba(37,99,235,0.10)]">
                <div className="aspect-[16/10] overflow-hidden bg-slate-950">
                  {project.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={project.image} alt={`${project.title} preview`} className="h-full w-full object-contain p-2 transition duration-700 group-hover:scale-[1.02]" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.42),transparent_35%),linear-gradient(135deg,#0f172a,#1e293b)]"><span className="material-symbols-outlined text-5xl text-blue-200">auto_awesome</span></div>
                  )}
                </div>
                <div className="p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">{project.category}</p>
                  <h3 className="mt-3 text-xl font-semibold tracking-[-0.02em] text-slate-950">{project.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{project.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#0d1c2e] px-5 py-20 md:px-10 xl:px-16" id="audit">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#dbe1ff] via-transparent to-transparent opacity-10" />
        <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-4 text-center">
          <h2 className="mb-2 text-[36px] font-semibold leading-[1.2] tracking-[-0.02em] text-white md:text-[48px] md:leading-[1.1]">Request a Free Lead & Appointment-Leak Audit.</h2>
          <p className="mb-4 max-w-2xl text-[18px] font-normal leading-[1.6] text-[#b9c7df]">
            The audit checks where prospects are leaking between Traffic → Website/Landing Page → Enquiry → Response → Qualification → Follow-Up → Booking → Reminder → Show-Up → Close.
          </p>
          <Link href="/audit" className="inline-flex items-center justify-center rounded bg-[#0051d5] px-8 py-4 text-[14px] font-semibold leading-[1.5] tracking-[0.01em] text-white shadow-[0_4px_20px_rgba(37,99,235,0.2)] transition-colors hover:bg-[#316bf3]">
            Request Free Lead & Appointment-Leak Audit
            <span className="material-symbols-outlined ml-2">arrow_forward</span>
          </Link>
        </div>
      </section>
    </main>
  )
}
