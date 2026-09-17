import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Suspense } from 'react'

import { FleetBrowser } from '@/components/fleet-browser'
import { isLocale, locales } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionary'
import { categories, regions, sortedFleet } from '@/lib/fleet'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getDictionary(locale)
  return {
    title: t.fleet.title,
    description: t.fleet.subtitle,
    alternates: {
      canonical: `/${locale}/fleet`,
      languages: { en: '/en/fleet', ru: '/ru/fleet', 'x-default': '/en/fleet' },
    },
  }
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function FleetPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale)
  const vessels = sortedFleet()

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-hull-950 sm:text-4xl">
          {t.fleet.title}
        </h1>
        <p className="mt-3 text-base text-hull-600">{t.fleet.subtitle}</p>
      </header>

      <div className="mt-8">
        <Suspense fallback={null}>
          <FleetBrowser
            vessels={vessels}
            categories={categories}
            regions={regions}
            locale={locale}
            t={t}
          />
        </Suspense>
      </div>
    </div>
  )
}
