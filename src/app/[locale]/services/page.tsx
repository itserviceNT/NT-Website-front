import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Reveal } from '@/components/reveal'
import { isLocale, locales } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionary'
import { classSocieties, serviceDetail, standards } from '@/lib/services-detail'
import { contact, ogImage, services, siteUrl } from '@/lib/site'

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
    openGraph: {
      type: 'website',
      title: t.nav.services,
      description: t.company.intro,
      url: `/${locale}/services`,
      images: ogImage,
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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: t.nav.services,
    url: `${siteUrl}/${locale}/services`,
    itemListElement: services.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Service',
        name: s.title[locale],
        description: s.summary[locale],
        provider: { '@type': 'Organization', name: 'Nurly Tolkun' },
        url: `${siteUrl}/${locale}/services#${s.slug}`,
      },
    })),
  }

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="shell py-14 sm:py-20 xl:py-24">
        <header className="max-w-2xl">
          <p className="label flex items-center gap-3 text-signal-600">
            <span className="h-px w-8 bg-signal-500" />
            {t.company.name}
          </p>
          <h1 className="mt-4 font-display text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-[1.02] tracking-tight text-ink-950">
            {t.nav.services}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-steel-500">
            {t.company.intro}
          </p>
        </header>

        <nav aria-label={t.nav.services} className="mt-10 flex flex-wrap gap-2">
          {services.map((s) => (
            <a
              key={s.slug}
              href={`#${s.slug}`}
              className="label rounded-sm bg-haze-100 px-3 py-2 text-steel-500 transition-colors hover:bg-haze-200 hover:text-ink-800"
            >
              {s.title[locale]}
            </a>
          ))}
        </nav>
      </div>

      <div className="border-t border-haze-200">
        {services.map((s, index) => {
          const detail = serviceDetail[s.slug]
          const flip = index % 2 === 1
          return (
            <section
              key={s.slug}
              id={s.slug}
              className={`scroll-mt-20 border-b border-haze-200 ${
                flip ? 'bg-haze-50' : 'bg-white'
              }`}
            >
              <div className="shell py-14 xl:py-20">
                <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
                  <Reveal className={flip ? 'lg:order-2' : ''}>
                    <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-ink-800">
                      <Image
                        src={detail.image}
                        alt={s.title[locale]}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                  </Reveal>

                  <Reveal className={flip ? 'lg:order-1' : ''}>
                    <h2 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] font-semibold leading-tight tracking-tight text-ink-950">
                      {s.title[locale]}
                    </h2>
                    <p className="mt-4 max-w-xl leading-relaxed text-steel-500">
                      {s.summary[locale]}
                    </p>

                    <ul className="mt-6 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
                      {detail.points[locale].map((point) => (
                        <li
                          key={point}
                          className="flex gap-2.5 text-sm leading-relaxed text-ink-800"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-2 size-1 shrink-0 rounded-full bg-signal-500"
                          />
                          {point}
                        </li>
                      ))}
                    </ul>

                    <a
                      href={`mailto:${contact.email}?subject=${encodeURIComponent(
                        s.title.en,
                      )}`}
                      className="label mt-7 inline-block border-b border-signal-500 pb-1 text-ink-800 transition-colors hover:text-signal-600"
                    >
                      {t.services.enquire} →
                    </a>
                  </Reveal>
                </div>
              </div>
            </section>
          )
        })}
      </div>

      <section className="bg-ink-950">
        <div className="shell py-16 xl:py-24">
          <Reveal className="max-w-2xl">
            <p className="label flex items-center gap-3 text-signal-400">
              <span className="h-px w-8 bg-signal-500" />
              {t.services.approvalsEyebrow}
            </p>
            <h2 className="mt-4 font-display text-[clamp(1.6rem,3.5vw,2.5rem)] font-semibold leading-tight tracking-tight text-white">
              {t.services.approvalsTitle}
            </h2>
          </Reveal>

          <ul className="mt-10 grid gap-px overflow-hidden rounded-sm bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {classSocieties.map((society) => (
              <Reveal as="li" key={society.abbr} className="bg-ink-950 p-6">
                <p className="data text-2xl font-medium text-signal-400">
                  {society.abbr}
                </p>
                <p className="mt-2 text-sm leading-snug text-steel-400">
                  {society.name}
                </p>
              </Reveal>
            ))}
          </ul>

          <Reveal className="mt-10 flex flex-wrap items-center gap-2">
            <span className="label text-steel-400">{t.services.standards}</span>
            {standards.map((standard) => (
              <span
                key={standard}
                className="label rounded-sm border border-white/15 px-3 py-1.5 text-haze-200"
              >
                {standard}
              </span>
            ))}
          </Reveal>

          <Reveal className="mt-12">
            <Link
              href={`/${locale}/contact`}
              className="inline-block rounded-sm bg-signal-500 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-signal-600"
            >
              {t.contact.enquiryHeading}
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
