import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { FleetHero, type HeroVessel } from '@/components/fleet-hero'
import { Reveal } from '@/components/reveal'
import { VesselCard } from '@/components/vessel-card'
import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionary'
import { availabilityTone, categories, sortedFleet, specText } from '@/lib/fleet'
import { caption, galleryImages } from '@/lib/gallery'
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
  const withPhoto = fleet.filter((v) => v.photo)

  // The hero rolls through vessels that are free or coming free — the ones a
  // charterer can actually act on.
  const heroVessels: HeroVessel[] = withPhoto
    .filter((v) => availabilityTone(v.charter?.status) !== 'chartered')
    .concat(withPhoto)
    .slice(0, 6)
    .map((v) => ({
      slug: v.slug,
      name: v.name,
      type: v.type,
      photo: v.photo!,
      status: v.charter?.status,
      figures: (
        [
          ['bhp', t.specs.bhp],
          ['bollardPull', t.specs.bollardPull],
          ['deckArea', t.specs.deckArea],
        ] as const
      )
        .map(([key, label]) => ({ label, value: specText(v, key) ?? '' }))
        .filter((f) => f.value)
        .slice(0, 3),
    }))

  const featured = withPhoto
    .filter((v) => availabilityTone(v.charter?.status) !== 'chartered')
    .concat(withPhoto)
    .filter((v, i, arr) => arr.findIndex((x) => x.slug === v.slug) === i)
    .slice(0, 6)

  const glimpse = ['diver-jacket-leg', 'crane-lift-deck', 'platform-flare', 'crew-muster']
    .map((slug) => galleryImages.find((g) => g.slug === slug))
    .filter((g): g is NonNullable<typeof g> => Boolean(g))

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

      <FleetHero vessels={heroVessels} locale={locale} t={t} />

      <section className="border-b border-haze-200 bg-white">
        <div className="shell">
          <dl className="grid grid-cols-2 divide-haze-200 sm:grid-cols-4 sm:divide-x">
            {[
              { value: String(fleet.length), label: t.home.statVessels },
              { value: String(categories.length), label: t.home.statTypes },
              { value: String(services.length), label: t.footer.services },
              { value: String(offices.length), label: t.contact.offices },
            ].map((stat, i) => (
              <Reveal key={stat.label} delay={i * 70} className="py-8 sm:px-6 sm:first:pl-0">
                <dt className="label text-steel-500">{stat.label}</dt>
                <dd className="data mt-2 text-4xl font-medium text-ink-900">
                  {stat.value}
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      <section className="shell py-20 xl:py-28">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="label flex items-center gap-3 text-signal-600">
              <span className="h-px w-8 bg-signal-500" />
              {t.home.fleetHeading}
            </p>
            <h2 className="mt-4 font-display text-[clamp(1.8rem,4vw,2.75rem)] font-semibold leading-tight tracking-tight text-ink-950">
              {t.home.fleetSubheading}
            </h2>
          </div>
          <Link
            href={`/${locale}/fleet`}
            className="label border-b border-signal-500 pb-1 text-ink-800 transition-colors hover:text-signal-600"
          >
            {t.home.viewAll} →
          </Link>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {featured.map((v, i) => (
            <Reveal key={v.slug} delay={(i % 3) * 90}>
              <VesselCard vessel={v} locale={locale} t={t} priority={i < 3} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-ink-950">
        <div className="shell py-20 xl:py-28">
          <Reveal className="max-w-2xl">
            <p className="label flex items-center gap-3 text-signal-400">
              <span className="h-px w-8 bg-signal-500" />
              {t.home.servicesHeading}
            </p>
            <h2 className="mt-4 font-display text-[clamp(1.8rem,4vw,2.75rem)] font-semibold leading-tight tracking-tight text-white">
              {t.company.tagline}
            </h2>
          </Reveal>

          <ul className="mt-12 grid gap-px overflow-hidden rounded-sm bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s, i) => (
              <Reveal as="li" key={s.slug} delay={(i % 4) * 70} className="bg-ink-950">
                <Link
                  href={`/${locale}/services#${s.slug}`}
                  className="group flex h-full flex-col p-6 transition-colors hover:bg-ink-900"
                >
                  <h3 className="font-display text-lg font-medium leading-snug text-white group-hover:text-signal-400">
                    {s.title[locale]}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-steel-400">
                    {s.summary[locale]}
                  </p>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="shell py-20 xl:py-28">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-[clamp(1.8rem,4vw,2.75rem)] font-semibold leading-tight tracking-tight text-ink-950">
            {t.nav.gallery}
          </h2>
          <Link
            href={`/${locale}/gallery`}
            className="label border-b border-signal-500 pb-1 text-ink-800 transition-colors hover:text-signal-600"
          >
            {t.home.viewAll} →
          </Link>
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {glimpse.map((image, i) => (
            <Reveal key={image.slug} delay={i * 80}>
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
    </>
  )
}
