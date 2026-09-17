import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionary'
import { categories, fleet } from '@/lib/fleet'
import { offices } from '@/lib/site'

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

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-hull-950 sm:text-4xl">
        {t.nav.about}
      </h1>

      <div className="mt-6 space-y-5 text-base leading-relaxed text-hull-600">
        {BODY[locale].map((paragraph) => (
          <p key={paragraph.slice(0, 40)}>{paragraph}</p>
        ))}
      </div>

      <dl className="mt-12 grid grid-cols-2 gap-6 border-t border-hull-100 pt-8 sm:grid-cols-3">
        {[
          { value: String(fleet.length), label: t.footer.fleet },
          { value: String(categories.length), label: t.fleet.filterCategory },
          { value: String(offices.length), label: t.contact.offices },
        ].map((stat) => (
          <div key={stat.label}>
            <dt className="sr-only">{stat.label}</dt>
            <dd>
              <span className="tabular block text-3xl font-semibold text-hull-900">
                {stat.value}
              </span>
              <span className="mt-1 block text-sm text-hull-500">{stat.label}</span>
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-10 rounded-xl border border-hull-100 bg-hull-50/50 px-5 py-4 text-sm text-hull-600">
        {t.footer.certified}
      </p>
    </div>
  )
}
