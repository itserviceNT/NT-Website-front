import type { Metadata } from 'next'
import Image from 'next/image'
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
    <article className="shell py-10 sm:py-14 xl:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link
        href={`/${locale}/fleet`}
        className="label inline-flex items-center gap-2 text-steel-500 transition-colors hover:text-signal-600"
      >
        <span aria-hidden="true">←</span> {t.vessel.backToFleet}
      </Link>

      {vessel.photo ? (
        <div className="relative mt-5 aspect-[16/9] overflow-hidden rounded-sm bg-ink-900 sm:aspect-[21/9]">
          <Image
            src={vessel.photo}
            alt={`${vessel.name} — ${vessel.type}`}
            fill
            priority
            sizes="(max-width: 1152px) 100vw, 1152px"
            className="object-cover"
          />
          {/* Several vessels are shot against pale sky and water, so the
              plate needs a firm base to stay legible. */}
          <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-ink-950 via-ink-950/60 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
            <p className="label text-signal-400">{vessel.type}</p>
            <h1 className="mt-1.5 font-display text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-none tracking-tight text-white">
              {vessel.name}
            </h1>
          </div>
        </div>
      ) : null}

      <header className="mt-6 flex flex-wrap items-start justify-between gap-4 border-b border-haze-200 pb-8">
        <div className="min-w-0">
          {vessel.photo ? null : (
            <>
              <p className="label text-signal-600">{vessel.type}</p>
              <h1 className="mt-1.5 font-display text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-none tracking-tight text-ink-950">
                {vessel.name}
              </h1>
            </>
          )}
          <div className={`flex flex-wrap items-center gap-3 ${vessel.photo ? '' : 'mt-3'}`}>
            <AvailabilityBadge status={vessel.charter?.status} />
            {vessel.charter?.region ? (
              <span className="label text-steel-500">{vessel.charter.region}</span>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <a
            href={`mailto:${contact.email}?subject=${encodeURIComponent(
              `Charter enquiry: ${vessel.name}`,
            )}`}
            className="rounded-sm bg-signal-500 px-5 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-signal-600"
          >
            {t.vessel.enquire}
          </a>
          {vessel.specSheetUrl ? (
            <a
              href={vessel.specSheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-sm border border-steel-300 px-5 py-3 text-center text-sm font-medium text-ink-700 transition-colors hover:bg-haze-100"
            >
              {t.vessel.downloadSpec}
            </a>
          ) : (
            <span className="rounded-sm border border-dashed border-haze-200 px-5 py-3 text-center text-sm text-steel-400">
              {t.vessel.specUnavailable}
            </span>
          )}
        </div>
      </header>

      {headline.length > 0 ? (
        <section className="mt-8">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-950">{t.vessel.keySpecs}</h2>
          <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 lg:grid-cols-4">
            {headline.map((s) => (
              <div key={s.key} className="border-t border-haze-200 pt-3">
                <dt className="label text-steel-400">
                  {s.label}
                </dt>
                <dd className="data mt-1 text-sm font-medium text-ink-900">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      {sections.length > 0 ? (
        <section className="mt-12">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-950">
            {t.vessel.specifications}
          </h2>
          <div className="mt-4 grid gap-6 lg:grid-cols-2">
            {sections.map(([section, fields]) => (
              <div
                key={section}
                className="overflow-hidden rounded-sm border border-haze-200"
              >
                <h3 className="label border-b border-haze-200 bg-haze-50 px-4 py-3 font-semibold text-ink-700">
                  {section.replace(/:$/, '')}
                </h3>
                <dl className="divide-y divide-haze-100">
                  {Object.entries(fields).map(([label, value]) => (
                    <div
                      key={label}
                      className="grid grid-cols-5 gap-3 px-4 py-2.5 text-sm"
                    >
                      <dt className="col-span-2 text-steel-500">{label}</dt>
                      <dd className="data col-span-3 text-ink-900">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <p className="mt-10 rounded-xl border border-dashed border-haze-200 p-8 text-center text-steel-500">
          {t.vessel.specUnavailable}
        </p>
      )}

      {related.length > 0 ? (
        <section className="mt-16 border-t border-haze-200 pt-10">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-950">
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
