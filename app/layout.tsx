import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
  display: 'swap',
})

// URLs base para SEO
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ideapunkt.de'
const siteName = 'Ideapunkt'
const siteDescription = 'Ideapunkt - Soluciones innovadoras en tecnología e inteligencia artificial. Conecta con nuestro asistente virtual inteligente para descubrir cómo podemos transformar tu negocio con IA.'
const siteKeywords = ['Ideapunkt', 'Inteligencia Artificial', 'IA', 'Tecnología', 'Innovación', 'Chatbot', 'Asistente Virtual', 'AI', 'Machine Learning', 'Alemania', 'Deutschland']

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Ideapunkt - Tecnología e Inteligencia Artificial',
    template: `%s | ${siteName}`
  },
  description: siteDescription,
  keywords: siteKeywords,
  authors: [{ name: 'Ideapunkt' }],
  creator: 'Ideapunkt',
  publisher: 'Ideapunkt',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: baseUrl,
    siteName: siteName,
    title: 'Ideapunkt - Tecnología e Inteligencia Artificial',
    description: siteDescription,
    images: [
      {
        url: `${baseUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Ideapunkt - Tecnología e Inteligencia Artificial',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ideapunkt - Tecnología e Inteligencia Artificial',
    description: siteDescription,
    images: [`${baseUrl}/og-image.jpg`],
    creator: '@ideapunkt',
    site: '@ideapunkt',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Agregar códigos de verificación cuando los tengas
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // yahoo: 'your-yahoo-verification-code',
  },
  other: {
    'ssl-verification': 'k8cLoWMqZQhbRXL_ZcaFBuv6O5FI89VXqboYqGTo4zs._cAaIZ25EFsTEuLSjFFP4_G5vPTDJGdhcruV7acMFVk',
  },
  alternates: {
    canonical: baseUrl,
    languages: {
      'es-ES': baseUrl,
      'de-DE': `${baseUrl}/de`,
      'en-US': `${baseUrl}/en`,
    },
  },
  category: 'Technology',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} font-inter antialiased`}>{children}</body>
    </html>
  )
}

