'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import type { Locale } from '@/i18n/config'
import { locales } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionary'
import { contact } from '@/lib/site'

export function SiteHeader({ locale, t }: { locale: Locale; t: Dictionary }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const nav = [
    { href: `/${locale}`, label: t.nav.home },
    { href: `/${locale}/fleet`, label: t.nav.fleet },
    { href: `/${locale}/charter`, label: t.nav.charter },
    { href: `/${locale}/services`, label: t.nav.services },
    { href: `/${locale}/gallery`, label: t.nav.gallery },
    { href: `/${locale}/about`, label: t.nav.about },
    { href: `/${locale}/contact`, label: t.nav.contact },
  ]

  const isActive = (href: string) =>
    href === `/${locale}` ? pathname === href : pathname.startsWith(href)

  // Swap only the leading locale segment so language switching keeps the page.
  const swapLocale = (next: string) =>
    `/${next}${pathname.replace(/^\/[^/]+/, '') || ''}`

  return (
    <header className="sticky top-0 z-50 border-b border-haze-200 bg-white/90 backdrop-blur">
      <div className="shell flex items-center gap-4 py-3">
        <Link
          href={`/${locale}`}
          className="flex shrink-0 flex-col leading-tight"
          onClick={() => setOpen(false)}
        >
          <span className="text-base font-semibold tracking-tight text-ink-800">
            {t.company.name}
          </span>
          <span className="hidden text-[11px] text-steel-400 sm:block">
            Offshore Marine Services
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-md px-3 py-2 text-sm transition-colors ${
                isActive(item.href)
                  ? 'bg-haze-100 font-medium text-ink-700'
                  : 'text-steel-500 hover:bg-haze-100 hover:text-ink-800'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          {/* overflow-hidden so the selected segment's fill is clipped to the
              group's corners instead of squaring them off. */}
          <div className="hidden items-center overflow-hidden rounded-sm border border-haze-200 text-xs sm:flex">
            {locales.map((code) => (
              <Link
                key={code}
                href={swapLocale(code)}
                className={`px-2 py-1.5 uppercase transition-colors ${
                  code === locale
                    ? 'bg-ink-900 font-semibold text-white'
                    : 'text-steel-500 hover:bg-haze-100'
                }`}
              >
                {code}
              </Link>
            ))}
          </div>

          <a
            href={`tel:${contact.phoneHref}`}
            className="hidden rounded-md bg-signal-500 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-signal-600 md:block"
          >
            {contact.phone}
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Menu"
            className="rounded-md border border-haze-200 p-2 text-ink-700 lg:hidden"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              <path
                d={open ? 'M4 4l10 10M14 4L4 14' : 'M2 5h14M2 9h14M2 13h14'}
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="border-t border-haze-200 lg:hidden" hidden={!open}>
        <nav className="shell flex flex-col py-2">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`rounded-md px-3 py-2.5 text-sm ${
                isActive(item.href)
                  ? 'bg-haze-100 font-medium text-ink-700'
                  : 'text-steel-500'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-2 flex gap-2 border-t border-haze-200 px-3 pt-3">
            {locales.map((code) => (
              <Link
                key={code}
                href={swapLocale(code)}
                onClick={() => setOpen(false)}
                className={`rounded-md border px-3 py-1.5 text-xs uppercase ${
                  code === locale
                    ? 'border-ink-800 bg-ink-900 font-semibold text-white'
                    : 'border-haze-200 text-steel-500'
                }`}
              >
                {code}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  )
}
