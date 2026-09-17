import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Reveal } from '@/components/reveal'
import { isLocale, locales } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionary'
import { categories, charterRegions, fleet } from '@/lib/fleet'
import { caption, galleryImages } from '@/lib/gallery'
import { classSocieties, standards } from '@/lib/services-detail'
import { offices, ogImage, services, siteUrl } from '@/lib/site'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

const BODY = {
  en: [
    'Nurly Tolkun provides marine support for offshore construction and oil & gas operations, from vessel chartering and marine agency through to subsea work, safety equipment servicing and lifting gear certification.',
    'The company operates a fleet of anchor handling tug supply vessels, diving support and platform supply vessels, fast crew boats, liftboats, barges, crane vessels and remotely operated vehicles, working primarily in the Caspian Sea alongside operations in the Middle East and Europe.',
    'Operations are certified to ISO 9001, ISO 14001 and ISO 45001, with vessels classed by Bureau Veritas and registered under the flag of Turkmenistan.',
  ],
  ru: [
    '«Нурлы Толкун» обеспечивает морскую поддержку офшорного строительства и нефтегазовых операций — от фрахта судов и морского агентирования до подводно-технических работ, обслуживания спасательного оборудования и сертификации грузоподъёмных устройств.',
    'Компания эксплуатирует флот судов снабжения и буксиров-завозчиков якорей, водолазных судов и судов снабжения платформ, быстроходных крюинг-ботов, самоподъёмных платформ, барж, крановых судов и телеуправляемых подводных аппаратов, работая преимущественно в Каспийском море, а также на Ближнем Востоке и в Европе.',
    'Деятельность сертифицирована по стандартам ISO 9001, ISO 14001 и ISO 45001; суда классифицированы Bureau Veritas и зарегистрированы под флагом Туркменистана.',
  ],
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
    title: t.nav.about,
    description: BODY[locale][0],
    alternates: {
      canonical: `/${locale}/about`,
      languages: { en: '/en/about', ru: '/ru/about', 'x-default': '/en/about' },
    },
    openGraph: {
      type: 'website',
      title: t.nav.about,
      description: BODY[locale][0],
      url: `/${locale}/about`,
      images: ogImage,
    },
  }
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale)

  const hero = galleryImages.find((g) => g.slug === 'ahts-platforms')
  const strip = ['crew-muster', 'diver-jacket-leg', 'lsa-workshop-liferaft', 'jackup-platform']
    .map((slug) => galleryImages.find((g) => g.slug === slug))
    .filter((g): g is NonNullable<typeof g> => Boolean(g))

  return (
    <div>
      <div className="shell py-14 sm:py-20 xl:py-24">
        <header className="max-w-3xl">
          <p className="label flex items-center gap-3 text-signal-600">
            <span className="h-px w-8 bg-signal-500" />
            {t.company.name}
          </p>
          <h1 className="mt-4 font-display text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-[1.02] tracking-tight text-ink-950">
            {t.nav.about}
          </h1>
          <div className="mt-6 space-y-5 text-base leading-relaxed text-steel-500">
            {BODY[locale].map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>
        </header>

        {hero ? (
          <Reveal className="mt-12">
            <div className="relative aspect-[21/9] overflow-hidden rounded-sm bg-ink-800">
              <Image
                src={hero.src}
                alt={caption(hero.slug, locale)}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        ) : null}

        <dl className="mt-12 grid grid-cols-2 gap-8 border-t border-haze-200 pt-10 sm:grid-cols-4">
          {[
            { value: String(fleet.length), label: t.home.statVessels },
            { value: String(categories.length), label: t.home.statTypes },
            { value: String(charterRegions.length), label: t.about.regions },
            { value: String(offices.length), label: t.contact.offices },
          ].map((stat) => (
            <Reveal key={stat.label}>
              <dt className="label text-steel-500">{stat.label}</dt>
              <dd className="data mt-2 text-[clamp(1.8rem,4vw,2.75rem)] font-medium text-ink-950">
                {stat.value}
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>

      <section className="border-y border-haze-200 bg-haze-50">
        <div className="shell py-16 xl:py-20">
          <Reveal className="max-w-2xl">
            <h2 className="font-display text-[clamp(1.6rem,3.5vw,2.5rem)] font-semibold leading-tight tracking-tight text-ink-950">
              {t.about.capabilitiesTitle}
            </h2>
          </Reveal>
          <ul className="mt-8 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <Reveal as="li" key={s.slug}>
                <Link
                  href={`/${locale}/services#${s.slug}`}
                  className="group flex gap-2.5 text-sm leading-relaxed text-ink-800 transition-colors hover:text-signal-600"
                >
                  <span
                    aria-hidden="true"
                    className="mt-2 size-1 shrink-0 rounded-full bg-signal-500"
                  />
                  {s.title[locale]}
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="shell py-16 xl:py-20">
        <Reveal className="max-w-2xl">
          <h2 className="font-display text-[clamp(1.6rem,3.5vw,2.5rem)] font-semibold leading-tight tracking-tight text-ink-950">
            {t.about.standardsTitle}
          </h2>
        </Reveal>

        <div className="mt-8 grid gap-10 lg:grid-cols-2">
          <Reveal>
            <p className="label text-steel-500">{t.services.approvalsEyebrow}</p>
            <ul className="mt-4 divide-y divide-haze-200 border-y border-haze-200">
              {classSocieties.map((society) => (
                <li
                  key={society.abbr}
                  className="flex items-baseline gap-4 py-3 text-sm"
                >
                  <span className="data w-14 shrink-0 font-medium text-signal-600">
                    {society.abbr}
                  </span>
                  <span className="text-ink-800">{society.name}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal>
            <p className="label text-steel-500">{t.services.standards}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {standards.map((standard) => (
                <li
                  key={standard}
                  className="label rounded-sm border border-haze-200 bg-white px-3 py-2 text-steel-500"
                >
                  {standard}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-steel-500">
              {t.about.flagNote}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="shell pb-20 xl:pb-28">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {strip.map((image) => (
            <Reveal key={image.slug}>
              <Link
                href={`/${locale}/gallery`}
                className="group relative block aspect-[4/5] overflow-hidden rounded-sm bg-ink-800"
              >
                <Image
                  src={image.src}
                  alt={caption(image.slug, locale)}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/10 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 p-4 text-sm leading-snug text-white">
                  {caption(image.slug, locale)}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            url: `${siteUrl}/${locale}/about`,
            mainEntity: {
              '@type': 'Organization',
              name: 'Nurly Tolkun',
              description: BODY[locale][0],
              hasCredential: standards,
            },
          }),
        }}
      />
    </div>
  )
}
