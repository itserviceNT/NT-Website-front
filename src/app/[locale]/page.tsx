import Link from 'next/link'
import { notFound } from 'next/navigation'

import { VesselCard } from '@/components/vessel-card'
import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionary'
import { availabilityTone, categories, sortedFleet } from '@/lib/fleet'
import { offices, services, siteUrl } from '@/lib/site'

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale)

  const fleet = sortedFleet()
  const available = fleet.filter(
    (v) => availabilityTone(v.charter?.status) !== 'chartered',
  )
  const featured = (available.length >= 6 ? available : fleet).slice(0, 6)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Nurly Tolkun',
    url: siteUrl,
    description: t.company.intro,
    telephone: '+993 12 46-90-06',
    email: 'info@nurlytolkun.tm',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '1972 (Ataturk) str.',
      addressLocality: 'Ashgabat',
      postalCode: '744028',
      addressCountry: 'TM',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="border-b border-hull-100 bg-gradient-to-b from-hull-950 to-hull-800">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-signal-400">
              {t.company.name}
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              {t.home.heroTitle}
            </h1>
            <p className="mt-5 text-lg text-hull-200">{t.home.heroSubtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/${locale}/fleet`}
                className="rounded-md bg-signal-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-signal-600"
              >
                {t.home.heroCtaFleet}
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="rounded-md border border-hull-400/40 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                {t.home.heroCtaContact}
              </Link>
            </div>
          </div>

          <dl className="mt-14 grid grid-cols-2 gap-6 border-t border-hull-700/50 pt-8 sm:grid-cols-4">
            {[
              { value: String(fleet.length), label: t.home.statVessels },
              { value: String(categories.length), label: t.home.statTypes },
              { value: String(services.length), label: t.footer.services },
              { value: String(offices.length), label: t.contact.offices },
            ].map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="tabular block text-3xl font-semibold text-white">
                    {stat.value}
                  </span>
                  <span className="mt-1 block text-sm text-hull-300">{stat.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight text-hull-950 sm:text-3xl">
              {t.home.fleetHeading}
            </h2>
            <p className="mt-2 text-hull-600">{t.home.fleetSubheading}</p>
          </div>
          <Link
            href={`/${locale}/fleet`}
            className="text-sm font-medium text-hull-700 underline underline-offset-4 hover:text-hull-900"
          >
            {t.home.viewAll} →
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((v) => (
            <VesselCard key={v.slug} vessel={v} locale={locale} t={t} />
          ))}
        </div>
      </section>

      <section className="border-t border-hull-100 bg-hull-50/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight text-hull-950 sm:text-3xl">
            {t.home.servicesHeading}
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <Link
                key={s.slug}
                href={`/${locale}/services#${s.slug}`}
                className="rounded-xl border border-hull-100 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-hull-300 hover:shadow-lg hover:shadow-hull-900/5"
              >
                <h3 className="font-semibold text-hull-900">{s.title[locale]}</h3>
                <p className="mt-2 text-sm leading-relaxed text-hull-600">
                  {s.summary[locale]}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
