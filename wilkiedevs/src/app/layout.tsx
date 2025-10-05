import './globals.css'
import { Roboto } from 'next/font/google'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
})

export const metadata = {
  title: 'WilkieDevs - Automatización Web y Desarrollo de Apps',
  description: 'Empresa especializada en automatización web, desarrollo de aplicaciones y servicios de IA',
  keywords: 'automatización web, desarrollo apps, servicios IA, desarrollo web, wilkiedevs',
  authors: [{ name: 'WilkieDevs' }],
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://wilkiedevs.com',
    siteName: 'WilkieDevs',
    title: 'WilkieDevs - Automatización Web y Desarrollo de Apps',
    description: 'Empresa especializada en automatización web, desarrollo de aplicaciones y servicios de IA',
    images: [
      {
        url: 'https://wilkiedevs.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'WilkieDevs',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WilkieDevs - Automatización Web y Desarrollo de Apps',
    description: 'Empresa especializada en automatización web, desarrollo de aplicaciones y servicios de IA',
    images: ['https://wilkiedevs.com/og-image.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${roboto.variable}`} suppressHydrationWarning>
      <body className="font-roboto bg-white dark:bg-gray-900 text-secondary dark:text-text-light min-h-screen flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          <main className="flex-grow pt-16">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
