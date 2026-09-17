import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Reveal } from '@/components/reveal'
import { AvailabilityBadge } from '@/components/vessel-card'
import { isLocale, locales } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionary'
import {
  availabilityTone,
  fleetByRegion,
  specText,
  type Vessel,
} from '@/lib/fleet'
import { siteUrl } from '@/lib/site'

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
    title: t.charter.title,
    description: t.charter.subtitle,
    alternates: {
      canonical: `/${locale}/charter`,
      languages: {
        en: '/en/charter',
        ru: '/ru/charter',
        'x-default': '/en/charter',
      },
    },
    openGraph: {
      type: 'website',
      title: t.charter.title,
      description: t.charter.subtitle,
      url: `/${locale}/charter`,
    },
  }
}

function figures(vessel: Vessel, t: ReturnType<typeof getDictionary>) {
  return (
    [
      ['bhp', t.specs.bhp],
      ['bollardPull', t.specs.bollardPull],
      ['deckArea', t.specs.deckArea],
    ] as const
  )
    .map(([key, label]) => ({ label, value: specText(vessel, key) }))
    .filter((f): f is { label: string; value: string } => Boolean(f.value))
}

export default async function CharterPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale)
  const groups = fleetByRegion()

  const openCount = groups
    .flatMap((g) => g.vessels)
    .filter((v) => availabilityTone(v.charter?.status) !== 'chartered').length

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <header className="max-w-2xl">
        <p className="label flex items-center gap-3 text-signal-500">
          <span className="h-px w-8 bg-signal-500" />
          {t.company.name}
        </p>
        <h1 className="mt-4 font-display text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-[1.02] tracking-tight text-ink-950">
          {t.charter.title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-steel-500">
          {t.charter.subtitle}
        </p>
        <p className="data mt-5 inline-flex items-center gap-2 rounded-sm bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
          <span className="size-1.5 rounded-full bg-emerald-600" />
          {t.charter.openNow.replace('{count}', String(openCount))}
        </p>
      </header>

      <div className="mt-14 space-y-16">
        {groups.map((group) => (
          <section key={group.region.slug} id={group.region.slug} className="scroll-mt-24">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-haze-200 pb-4">
              <div>
                <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-950 sm:text-3xl">
                  {group.region.name}
                </h2>
                <p className="data mt-1 text-sm text-steel-400">
                  {group.vessels.length} {t.charter.vesselsWord}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <a
                  href={`https://wa.me/${group.region.contact.whatsappHref}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label rounded-sm border border-haze-200 px-3 py-2 text-steel-500 transition-colors hover:border-steel-300 hover:text-ink-800"
                >
                  WhatsApp {group.region.contact.whatsapp}
                </a>
                <a
                  href={`mailto:${group.region.contact.email}`}
                  className="label rounded-sm bg-ink-900 px-3 py-2 text-white transition-colors hover:bg-ink-800"
                >
                  {group.region.contact.email}
                </a>
              </div>
            </div>

            <ul className="mt-6 divide-y divide-haze-200 border-b border-haze-200">
              {group.vessels.map((vessel, i) => (
                <Reveal as="li" key={vessel.slug} delay={Math.min(i, 6) * 45}>
                  <Link
                    href={`/${locale}/fleet/${vessel.slug}`}
                    className="group grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3 py-4 sm:grid-cols-[88px_minmax(0,1.5fr)_minmax(0,2fr)_auto]"
                  >
                    <div className="relative size-14 shrink-0 overflow-hidden rounded-sm bg-ink-800 sm:size-[88px] sm:w-[88px]">
                      {vessel.photo ? (
                        <Image
                          src={vessel.photo}
                          alt=""
                          fill
                          sizes="88px"
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : null}
                    </div>

                    <div className="min-w-0">
                      <p className="label text-steel-400">{vessel.type}</p>
                      <p className="font-display text-lg font-medium text-ink-950 transition-colors group-hover:text-signal-600">
                        {vessel.name}
                      </p>
                      {vessel.charter?.location &&
                      vessel.charter.location !== group.region.name ? (
                        <p className="label mt-0.5 text-steel-400">
                          {vessel.charter.location}
                        </p>
                      ) : null}
                    </div>

                    <dl className="col-span-2 flex flex-wrap gap-x-6 gap-y-2 sm:col-span-1">
                      {figures(vessel, t).map((f) => (
                        <div key={f.label}>
                          <dt className="label text-steel-400">{f.label}</dt>
                          <dd className="data mt-0.5 text-sm text-ink-800">
                            {f.value}
                          </dd>
                        </div>
                      ))}
                      {vessel.charter?.cranes ? (
                        <div>
                          <dt className="label text-steel-400">
                            {t.charter.cranes}
                          </dt>
                          <dd className="data mt-0.5 text-sm text-ink-800">
                            {vessel.charter.cranes}
                          </dd>
                        </div>
                      ) : null}
                    </dl>

                    <div className="col-span-2 flex items-center gap-3 sm:col-span-1 sm:justify-end">
                      <AvailabilityBadge status={vessel.charter?.status} />
                      <span
                        aria-hidden="true"
                        className="hidden text-steel-300 transition-all group-hover:translate-x-0.5 group-hover:text-signal-500 sm:inline"
                      >
                        →
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: t.charter.title,
            url: `${siteUrl}/${locale}/charter`,
            numberOfItems: groups.reduce((n, g) => n + g.vessels.length, 0),
            itemListElement: groups
              .flatMap((g) => g.vessels)
              .map((v, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: v.name,
                url: `${siteUrl}/${locale}/fleet/${v.slug}`,
              })),
          }),
        }}
      />
    </div>
  )
}
