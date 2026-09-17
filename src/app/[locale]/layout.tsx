import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { isLocale, locales, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionary'
import { siteUrl } from '@/lib/site'
import '../globals.css'

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
})

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getDictionary(locale)

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${t.company.name} — ${t.company.tagline}`,
      template: `%s — ${t.company.name}`,
    },
    description: t.company.intro,
    alternates: {
      canonical: `/${locale}`,
      languages: { en: '/en', ru: '/ru', 'x-default': '/en' },
    },
    openGraph: {
      type: 'website',
      siteName: t.company.name,
      locale: locale === 'ru' ? 'ru_RU' : 'en_US',
      title: `${t.company.name} — ${t.company.tagline}`,
      description: t.company.intro,
      url: `/${locale}`,
    },
    twitter: { card: 'summary_large_image' },
    robots: { index: true, follow: true },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale as Locale)

  return (
    <html lang={locale} className={inter.variable}>
      <body className="flex min-h-screen flex-col bg-white font-sans text-hull-950">
        <SiteHeader locale={locale} t={t} />
        <main className="flex-1">{children}</main>
        <SiteFooter locale={locale} t={t} />
      </body>
    </html>
  )
}
