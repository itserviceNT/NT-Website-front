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
    <div className="shell py-12 sm:py-16 xl:py-24">
      <header className="max-w-2xl">
        <p className="label flex items-center gap-3 text-signal-600">
          <span className="h-px w-8 bg-signal-500" />
          {t.company.name}
        </p>
        <h1 className="mt-4 font-display text-[clamp(2rem,5vw,3.9rem)] font-semibold leading-[1.02] tracking-tight text-ink-950">
          {t.fleet.title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-steel-500">
          {t.fleet.subtitle}
        </p>
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
