import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionary'
import { contact, offices } from '@/lib/site'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getDictionary(locale)
  return {
    title: t.contact.title,
    description: t.contact.subtitle,
    alternates: {
      canonical: `/${locale}/contact`,
      languages: {
        en: '/en/contact',
        ru: '/ru/contact',
        'x-default': '/en/contact',
      },
    },
  }
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale)

  return (
    <div className="shell max-w-5xl py-12 sm:py-16 xl:py-24">
      <header className="max-w-2xl">
        <h1 className="font-display text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-[1.02] tracking-tight text-ink-950">
          {t.contact.title}
        </h1>
        <p className="mt-3 text-base text-steel-500">{t.contact.subtitle}</p>
      </header>

      <div className="mt-8 flex flex-wrap gap-3">
        <a
          href={`tel:${contact.phoneHref}`}
          className="rounded-sm bg-signal-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-signal-600"
        >
          {contact.phone}
        </a>
        <a
          href={`mailto:${contact.email}`}
          className="rounded-sm border border-steel-300 px-5 py-3 text-sm font-medium text-ink-700 transition-colors hover:bg-haze-100"
        >
          {contact.email}
        </a>
      </div>

      <section className="mt-14">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-900">{t.contact.offices}</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {offices.map((office) => (
            <div
              key={office.city}
              className="rounded-sm border border-haze-200 bg-white p-5"
            >
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="font-semibold text-ink-900">{office.city}</h3>
                {office.head ? (
                  <span className="rounded bg-haze-100 px-2 py-0.5 text-[11px] font-medium text-steel-500">
                    {t.contact.headOffice}
                  </span>
                ) : null}
              </div>
              <p className="mt-0.5 text-xs uppercase tracking-wide text-steel-400">
                {office.country}
              </p>
              <address className="mt-3 space-y-1 text-sm not-italic leading-relaxed text-steel-500">
                {office.lines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </address>
              {office.phone ? (
                <p className="data mt-3 text-sm text-ink-700">{office.phone}</p>
              ) : null}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
