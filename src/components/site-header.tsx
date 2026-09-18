'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useState } from 'react'

import type { Locale } from '@/i18n/config'
import { locales } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionary'
import { MobileDrawer } from '@/components/mobile-drawer'
import { contact } from '@/lib/site'

export function SiteHeader({ locale, t }: { locale: Locale; t: Dictionary }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const close = useCallback(() => setOpen(false), [])

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
    <>
    <header className="sticky top-0 z-50 border-b border-haze-200 bg-white/90 backdrop-blur">
      <div className="shell flex items-center gap-4 py-3">
        <Link
          href={`/${locale}`}
          className="flex shrink-0 items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/images/logo.png"
            alt=""
            width={202}
            height={203}
            priority
            className="h-9 w-auto"
          />
          <span className="flex flex-col leading-tight">
            <span className="font-display text-base font-semibold tracking-tight text-ink-900">
              {t.company.name}
            </span>
            <span className="label hidden text-steel-500 sm:block">
              {t.company.descriptor}
            </span>
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
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="mobile-drawer"
            aria-label={t.nav.menu}
            className="rounded-sm border border-haze-200 p-2.5 text-ink-700 transition-colors hover:bg-haze-100 hover:text-ink-900 active:bg-haze-200 lg:hidden"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              <path
                d="M2 5h14M2 9h14M2 13h14"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </button>
        </div>
      </div>

    </header>
      <MobileDrawer
        open={open}
        onClose={close}
        nav={nav}
        isActive={isActive}
        swapLocale={swapLocale}
        locale={locale}
        t={t}
      />
    </>
  )
}
