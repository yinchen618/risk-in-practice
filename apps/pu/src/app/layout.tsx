import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import { Toaster } from '@/components/ui/sonner'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PU Learning in Practice',
  description: 'From Sugiyama Lab Theory to a Real-World Smart Residential Testbed',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Noto+Sans+TC:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.png" sizes="32x32" />
      </head>
      <body className={inter.className}>
        <Providers>
          <NuqsAdapter>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <Toaster />
          </NuqsAdapter>
        </Providers>
      </body>
    </html>
  )
}
