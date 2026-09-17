import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { EnquiryForm } from '@/components/enquiry-form'
import { Reveal } from '@/components/reveal'
import { isLocale, locales } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionary'
import { categories, charterRegions } from '@/lib/fleet'
import { contact, offices, siteUrl } from '@/lib/site'

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
    openGraph: {
      type: 'website',
      title: t.contact.title,
      description: t.contact.subtitle,
      url: `/${locale}/contact`,
    },
  }
}

function titleCase(value: string) {
  return value
    .toLowerCase()
    .replace(/\b\w/g, (m) => m.toUpperCase())
    .replace(/\bAhts\b/g, 'AHTS')
    .replace(/\bAht\b/g, 'AHT')
    .replace(/\bDsv\b/g, 'DSV')
    .replace(/\bDp2\b/g, 'DP2')
    .replace(/\bRov\b/g, 'ROV')
    .replace(/\bErr\b/g, 'ERR')
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Nurly Tolkun',
    url: `${siteUrl}/${locale}/contact`,
    email: contact.email,
    telephone: contact.phone,
    address: offices.map((o) => ({
      '@type': 'PostalAddress',
      addressLocality: o.city,
      addressCountry: o.country === 'UAE' ? 'AE' : 'TM',
      streetAddress: o.lines.join(', '),
    })),
  }

  return (
    <div className="shell py-14 sm:py-20 xl:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="max-w-2xl">
        <p className="label flex items-center gap-3 text-signal-500">
          <span className="h-px w-8 bg-signal-500" />
          {t.company.name}
        </p>
        <h1 className="mt-4 font-display text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-[1.02] tracking-tight text-ink-950">
          {t.contact.title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-steel-500">
          {t.contact.subtitle}
        </p>
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

      <section className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-14">
        <Reveal>
          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-950">
            {t.contact.enquiryHeading}
          </h2>
          <div className="mt-5">
            <EnquiryForm
              email={contact.email}
              labels={t.enquiry}
              vesselTypes={categories.map((c) => titleCase(c.category))}
              regions={charterRegions.map((r) => r.name)}
            />
          </div>
        </Reveal>

        <Reveal delay={90}>
          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-950">
            {t.contact.regionalDesks}
          </h2>
          <ul className="mt-5 space-y-3">
            {charterRegions.map((region) => (
              <li
                key={region.slug}
                className="rounded-sm border border-haze-200 bg-white p-4"
              >
                <p className="font-display text-lg font-medium text-ink-950">
                  {region.name}
                </p>
                <div className="mt-2 flex flex-col gap-1">
                  <a
                    href={`mailto:${region.contact.email}`}
                    className="data text-sm text-steel-500 transition-colors hover:text-signal-600"
                  >
                    {region.contact.email}
                  </a>
                  <a
                    href={`https://wa.me/${region.contact.whatsappHref}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="data text-sm text-steel-500 transition-colors hover:text-signal-600"
                  >
                    WhatsApp {region.contact.whatsapp}
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <section className="mt-16 border-t border-haze-200 pt-12">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-950">
          {t.contact.offices}
        </h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
          {offices.map((office, i) => (
            <Reveal
              key={office.city}
              delay={(i % 3) * 70}
              className="h-full rounded-sm border border-haze-200 bg-white p-5"
            >
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="font-display text-lg font-medium text-ink-950">
                  {office.city}
                </h3>
                {office.head ? (
                  <span className="label rounded-sm bg-haze-100 px-2 py-0.5 text-steel-500">
                    {t.contact.headOffice}
                  </span>
                ) : null}
              </div>
              <p className="label mt-1 text-steel-400">{office.country}</p>
              <address className="mt-3 space-y-1 text-sm not-italic leading-relaxed text-steel-500">
                {office.lines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </address>
              {office.phone ? (
                <p className="data mt-3 text-sm text-ink-700">{office.phone}</p>
              ) : null}
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  )
}
