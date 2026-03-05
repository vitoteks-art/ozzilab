import type { Metadata } from 'next'
import { Manrope, Playfair_Display } from 'next/font/google'
import './globals.css'
import { LayoutChrome } from '@/components/LayoutChrome'

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
})

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Ozzilab.cloud — Premium Business Automation',
  description: 'Business automation systems: WhatsApp, email, lead gen, and audit-led delivery.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className="light" lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${manrope.variable} ${playfair.variable} antialiased bg-background-light text-slate-900 selection:bg-primary/10`}>
        <LayoutChrome>{children}</LayoutChrome>
      </body>
    </html>
  )
}
