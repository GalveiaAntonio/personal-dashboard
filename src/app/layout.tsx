import type { Metadata } from 'next'
import { IBM_Plex_Sans } from 'next/font/google'
import './globals.css'

const fonte = IBM_Plex_Sans({ subsets: ['latin'], variable: '--font-body', weight: ['400', '500', '600', '700'] })

export const metadata: Metadata = { title: 'Painel', robots: { index: false, follow: false } }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt" className={fonte.variable}>
      <body>{children}</body>
    </html>
  )
}
