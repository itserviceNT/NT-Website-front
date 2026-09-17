import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionary'
import { services } from '@/lib/site'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getDictionary(locale)
  return {
    title: t.nav.services,
    description: t.company.intro,
    alternates: {
      canonical: `/${locale}/services`,
      languages: {
        en: '/en/services',
        ru: '/ru/services',
        'x-default': '/en/services',
      },
    },
  }
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale)

  return (
    <div className="shell max-w-4xl py-12 sm:py-16 xl:py-24">
      <header className="max-w-2xl">
        <h1 className="font-display text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-[1.02] tracking-tight text-ink-950">
          {t.nav.services}
        </h1>
        <p className="mt-3 text-base text-steel-500">{t.company.intro}</p>
      </header>

      <div className="mt-10 space-y-8">
        {services.map((s) => (
          <section
            key={s.slug}
            id={s.slug}
            className="scroll-mt-24 border-t border-haze-200 pt-8"
          >
            <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-900">{s.title[locale]}</h2>
            <p className="mt-2 max-w-2xl leading-relaxed text-steel-500">
              {s.summary[locale]}
            </p>
          </section>
        ))}
      </div>
    </div>
  )
}
