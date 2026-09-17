import Link from 'next/link'

import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionary'
import { categories } from '@/lib/fleet'
import { contact, offices, services } from '@/lib/site'

export function SiteFooter({ locale, t }: { locale: Locale; t: Dictionary }) {
  const head = offices.find((o) => o.head)!

  return (
    <footer className="mt-20 border-t border-haze-200 bg-ink-950 text-haze-200">
      <div className="shell grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-base font-semibold text-white">{t.company.name}</p>
          <address className="mt-3 space-y-1 text-sm not-italic text-steel-300">
            {head.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </address>
          <p className="mt-3 space-y-1 text-sm">
            <a href={`tel:${contact.phoneHref}`} className="block hover:text-white">
              {contact.phone}
            </a>
            <a href={`mailto:${contact.email}`} className="block hover:text-white">
              {contact.email}
            </a>
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">{t.footer.fleet}</p>
          <ul className="mt-3 space-y-2 text-sm">
            {categories.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/${locale}/fleet?category=${c.slug}`}
                  className="text-steel-300 hover:text-white"
                >
                  {c.category.toLowerCase().replace(/\b\w/g, (m) => m.toUpperCase())}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">{t.footer.services}</p>
          <ul className="mt-3 space-y-2 text-sm">
            {services.slice(0, 6).map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/${locale}/services#${s.slug}`}
                  className="text-steel-300 hover:text-white"
                >
                  {s.title[locale]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">{t.contact.offices}</p>
          <ul className="mt-3 space-y-2 text-sm text-steel-300">
            {offices.map((o) => (
              <li key={o.city}>
                {o.city}, {o.country}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-ink-800">
        <div className="shell flex flex-col gap-2 py-6 text-xs text-steel-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {t.company.name}. {t.footer.rights}
          </p>
          <p>{t.footer.certified}</p>
        </div>
      </div>
    </footer>
  )
}
