import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { GalleryGrid } from '@/components/gallery-grid'
import { isLocale, locales } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionary'
import { caption, galleryCategories, galleryImages } from '@/lib/gallery'

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
    title: t.nav.gallery,
    description: t.gallery.subtitle,
    alternates: {
      canonical: `/${locale}/gallery`,
      languages: {
        en: '/en/gallery',
        ru: '/ru/gallery',
        'x-default': '/en/gallery',
      },
    },
  }
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale)

  const images = galleryImages.map((image) => ({
    ...image,
    caption: caption(image.slug, locale),
  }))

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <header className="max-w-2xl">
        <p className="label flex items-center gap-3 text-signal-500">
          <span className="h-px w-8 bg-signal-500" />
          {t.company.name}
        </p>
        <h1 className="mt-4 font-display text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-[1.02] tracking-tight text-ink-950">
          {t.nav.gallery}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-steel-500">
          {t.gallery.subtitle}
        </p>
      </header>

      <div className="mt-10">
        <GalleryGrid
          images={images}
          categories={galleryCategories}
          labels={t.gallery.categories as unknown as Record<string, string>}
          allLabel={t.fleet.filterAll}
          closeLabel={t.gallery.close}
        />
      </div>
    </div>
  )
}
