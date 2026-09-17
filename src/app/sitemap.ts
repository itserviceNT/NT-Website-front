import type { MetadataRoute } from 'next'

import { locales } from '@/i18n/config'
import { fleet } from '@/lib/fleet'
import { siteUrl } from '@/lib/site'

const STATIC_PATHS = ['', '/fleet', '/services', '/about', '/contact']

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [...STATIC_PATHS, ...fleet.map((v) => `/fleet/${v.slug}`)]

  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: `${siteUrl}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: path.startsWith('/fleet') ? ('weekly' as const) : ('monthly' as const),
      priority: path === '' ? 1 : path === '/fleet' ? 0.9 : 0.7,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${siteUrl}/${l}${path}`]),
        ),
      },
    })),
  )
}
