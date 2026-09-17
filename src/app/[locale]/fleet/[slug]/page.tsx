import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { AvailabilityBadge, VesselCard } from '@/components/vessel-card'
import { isLocale, locales } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionary'
import {
  HEADLINE_SPECS,
  displaySections,
  fleet,
  getVessel,
  relatedVessels,
  specText,
} from '@/lib/fleet'
import { contact, siteUrl } from '@/lib/site'

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    fleet.map((vessel) => ({ locale, slug: vessel.slug })),
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const vessel = getVessel(slug)
  if (!isLocale(locale) || !vessel) return {}

  const facts = [
    vessel.type,
    specText(vessel, 'bhp'),
    specText(vessel, 'bollardPull') && `${specText(vessel, 'bollardPull')} bollard pull`,
    specText(vessel, 'deckArea') && `${specText(vessel, 'deckArea')} deck`,
    vessel.charter?.region,
  ]
    .filter(Boolean)
    .join(' · ')

  return {
    title: `${vessel.name} — ${vessel.type}`,
    description: `${vessel.name}: ${facts}. Full specification and charter availability from Nurly Tolkun.`,
    alternates: {
      canonical: `/${locale}/fleet/${slug}`,
      languages: {
        en: `/en/fleet/${slug}`,
        ru: `/ru/fleet/${slug}`,
        'x-default': `/en/fleet/${slug}`,
      },
    },
    openGraph: {
      type: 'website',
      title: `${vessel.name} — ${vessel.type}`,
      description: facts,
      url: `/${locale}/fleet/${slug}`,
    },
  }
}

export default async function VesselPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()
  const vessel = getVessel(slug)
  if (!vessel) notFound()

  const t = getDictionary(locale)
  const specLabels = t.specs as Record<string, string>

  const headline = HEADLINE_SPECS.flatMap((key) => {
    const value = specText(vessel, key)
    return value ? [{ key, label: specLabels[key] ?? key, value }] : []
  })

  const sections = displaySections(vessel)
  const related = relatedVessels(vessel)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: vessel.name,
    category: vessel.type,
    url: `${siteUrl}/${locale}/fleet/${vessel.slug}`,
    brand: { '@type': 'Organization', name: 'Nurly Tolkun' },
    additionalProperty: headline.map((s) => ({
      '@type': 'PropertyValue',
      name: s.label,
      value: s.value,
    })),
  }

  return (
    <article className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link
        href={`/${locale}/fleet`}
        className="inline-flex items-center gap-1.5 text-sm text-hull-500 hover:text-hull-700"
      >
        <span aria-hidden="true">←</span> {t.vessel.backToFleet}
      </Link>

      <header className="mt-5 flex flex-wrap items-start justify-between gap-4 border-b border-hull-100 pb-8">
        <div className="min-w-0">
          <p className="text-sm font-medium uppercase tracking-wide text-signal-600">
            {vessel.type}
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-hull-950 sm:text-4xl">
            {vessel.name}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <AvailabilityBadge status={vessel.charter?.status} />
            {vessel.charter?.region ? (
              <span className="text-sm text-hull-500">{vessel.charter.region}</span>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <a
            href={`mailto:${contact.email}?subject=${encodeURIComponent(
              `Charter enquiry: ${vessel.name}`,
            )}`}
            className="rounded-md bg-signal-500 px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-signal-600"
          >
            {t.vessel.enquire}
          </a>
          {vessel.specSheetUrl ? (
            <a
              href={vessel.specSheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-hull-300 px-4 py-2.5 text-center text-sm font-medium text-hull-700 transition-colors hover:bg-hull-50"
            >
              {t.vessel.downloadSpec}
            </a>
          ) : (
            <span className="rounded-md border border-dashed border-hull-200 px-4 py-2.5 text-center text-sm text-hull-400">
              {t.vessel.specUnavailable}
            </span>
          )}
        </div>
      </header>

      {headline.length > 0 ? (
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-hull-900">{t.vessel.keySpecs}</h2>
          <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 lg:grid-cols-4">
            {headline.map((s) => (
              <div key={s.key} className="border-t border-hull-100 pt-3">
                <dt className="text-xs uppercase tracking-wide text-hull-400">
                  {s.label}
                </dt>
                <dd className="tabular mt-1 text-sm font-medium text-hull-900">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      {sections.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-lg font-semibold text-hull-900">
            {t.vessel.specifications}
          </h2>
          <div className="mt-4 grid gap-6 lg:grid-cols-2">
            {sections.map(([section, fields]) => (
              <div
                key={section}
                className="overflow-hidden rounded-xl border border-hull-100"
              >
                <h3 className="border-b border-hull-100 bg-hull-50/60 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-hull-600">
                  {section.replace(/:$/, '')}
                </h3>
                <dl className="divide-y divide-hull-50">
                  {Object.entries(fields).map(([label, value]) => (
                    <div
                      key={label}
                      className="grid grid-cols-5 gap-3 px-4 py-2.5 text-sm"
                    >
                      <dt className="col-span-2 text-hull-500">{label}</dt>
                      <dd className="tabular col-span-3 text-hull-900">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <p className="mt-10 rounded-xl border border-dashed border-hull-200 p-8 text-center text-hull-500">
          {t.vessel.specUnavailable}
        </p>
      )}

      {related.length > 0 ? (
        <section className="mt-16 border-t border-hull-100 pt-10">
          <h2 className="text-lg font-semibold text-hull-900">
            {t.vessel.relatedHeading}
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((v) => (
              <VesselCard key={v.slug} vessel={v} locale={locale} t={t} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  )
}
