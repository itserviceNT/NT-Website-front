import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { LegalPage } from '@/components/legal-page'
import { isLocale, locales } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionary'
import { privacy } from '@/lib/legal'
import { ogImage } from '@/lib/site'

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
  const doc = privacy[locale]
  return {
    title: doc.title,
    description: doc.intro,
    alternates: {
      canonical: `/${locale}/privacy`,
      languages: {
        en: '/en/privacy',
        ru: '/ru/privacy',
        'x-default': '/en/privacy',
      },
    },
    openGraph: {
      type: 'website',
      title: doc.title,
      description: doc.intro,
      url: `/${locale}/privacy`,
      images: ogImage,
    },
  }
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  return (
    <LegalPage doc={privacy[locale]} locale={locale} t={getDictionary(locale)} />
  )
}
