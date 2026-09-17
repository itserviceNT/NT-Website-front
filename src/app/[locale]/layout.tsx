import type { Metadata } from 'next'
import {
  IBM_Plex_Mono,
  IBM_Plex_Sans,
  IBM_Plex_Sans_Condensed,
} from 'next/font/google'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { isLocale, locales, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionary'
import { siteUrl } from '@/lib/site'
import '../globals.css'

// IBM Plex: drawn for technical and engineering contexts, and the one
// superfamily here with a condensed cut, a text cut and a mono cut that all
// carry Cyrillic for the Russian locale.
const plexSans = IBM_Plex_Sans({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600'],
  variable: '--font-plex-sans',
  display: 'swap',
})

// The condensed cut ships no basic Cyrillic, so the display stack falls back
// to Plex Sans for Russian text — same superfamily, so headings stay coherent.
const plexCondensed = IBM_Plex_Sans_Condensed({
  subsets: ['latin', 'latin-ext'],
  weight: ['500', '600'],
  variable: '--font-plex-condensed',
  display: 'swap',
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
  display: 'swap',
})

const fontVars = `${plexSans.variable} ${plexCondensed.variable} ${plexMono.variable}`

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
      images: [
        {
          url: '/images/og-default.jpg',
          width: 1200,
          height: 630,
          alt: `${t.company.name} — ${t.company.tagline}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      images: ['/images/og-default.jpg'],
    },
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
    <html lang={locale} className={fontVars}>
      <head>
        {/* Scroll reveals start transparent; without JS they must not stay that way. */}
        <noscript>
          <style>{`.reveal{opacity:1!important;animation:none!important}`}</style>
        </noscript>
      </head>
      <body className="flex min-h-screen flex-col bg-paper font-sans text-ink-900">
        <SiteHeader locale={locale} t={t} />
        <main className="flex-1">{children}</main>
        <SiteFooter locale={locale} t={t} />
      </body>
    </html>
  )
}
