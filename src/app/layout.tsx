import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { LayoutChrome } from '@/components/LayoutChrome'

const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'OZZILAB by Vitotek Systems — Appointment Growth Systems',
  description:
    'Premium websites, lead capture, CRM workflows, follow-up automation, and appointment booking systems for appointment-driven businesses.',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/apple-icon.svg',
  },
  manifest: '/manifest.webmanifest',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className="light" lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('ozzilab-theme')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.classList.toggle('dark',t==='dark');document.documentElement.classList.toggle('light',t!=='dark');document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t;}catch(e){}`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${geist.variable} antialiased bg-background-light text-slate-900 selection:bg-primary/10`} suppressHydrationWarning>
        <LayoutChrome>{children}</LayoutChrome>
      </body>
    </html>
  )
}
