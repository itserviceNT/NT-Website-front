'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

import type { Locale } from '@/i18n/config'
import { locales } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionary'
import { contact } from '@/lib/site'

export type NavItem = { href: string; label: string }

export function MobileDrawer({
  open,
  onClose,
  nav,
  isActive,
  swapLocale,
  locale,
  t,
}: {
  open: boolean
  onClose: () => void
  nav: NavItem[]
  isActive: (href: string) => boolean
  swapLocale: (next: string) => string
  locale: Locale
  t: Dictionary
}) {
  const panel = useRef<HTMLDivElement>(null)
  const restoreFocus = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return
    restoreFocus.current = document.activeElement as HTMLElement | null
    panel.current?.querySelector<HTMLElement>('a, button')?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return onClose()
      if (e.key !== 'Tab' || !panel.current) return
      // Keep tabbing inside the drawer while it covers the page.
      const focusable = panel.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      )
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
      restoreFocus.current?.focus()
    }
  }, [open, onClose])

  return (
    // Stays mounted so it can transition; `inert` keeps it out of the tab
    // order and off the accessibility tree while closed.
    <div
      // overflow-hidden clips the closed panel; without it the off-screen
      // drawer widens the document and the page scrolls sideways.
      className="fixed inset-0 z-[60] overflow-hidden lg:hidden"
      inert={!open}
      aria-hidden={!open}
      style={{ pointerEvents: open ? 'auto' : 'none' }}
    >
      <button
        type="button"
        tabIndex={-1}
        aria-label={t.nav.close}
        onClick={onClose}
        className={`absolute inset-0 h-full w-full cursor-default bg-ink-950/60 backdrop-blur-[2px] transition-opacity duration-[450ms] ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={t.nav.menu}
        data-open={open}
        className="drawer-panel absolute inset-y-0 right-0 flex w-[min(21rem,86vw)] flex-col bg-paper shadow-2xl"
      >
        <div className="flex items-center justify-between gap-3 border-b border-haze-200 px-5 py-4">
          <Link
            href={`/${locale}`}
            onClick={onClose}
            className="flex items-center gap-2.5"
          >
            <Image
              src="/images/logo.png"
              alt=""
              width={202}
              height={203}
              className="h-8 w-auto"
            />
            <span className="font-display text-base font-semibold text-ink-900">
              {t.company.name}
            </span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.nav.close}
            className="rounded-sm border border-haze-200 p-2.5 text-ink-700 transition-colors hover:bg-haze-100 hover:text-ink-900 active:bg-haze-200"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <path
                d="M3 3l10 10M13 3L3 13"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-3">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={`flex items-center justify-between rounded-sm px-3 py-3.5 text-[0.95rem] transition-colors active:bg-haze-200 ${
                isActive(item.href)
                  ? 'bg-haze-100 font-medium text-ink-900'
                  : 'text-steel-500 hover:bg-haze-100 hover:text-ink-900'
              }`}
            >
              {item.label}
              {isActive(item.href) ? (
                <span aria-hidden="true" className="h-4 w-0.5 bg-signal-500" />
              ) : null}
            </Link>
          ))}
        </nav>

        <div className="border-t border-haze-200 px-5 py-4">
          <div className="flex gap-2">
            {locales.map((code) => (
              <Link
                key={code}
                href={swapLocale(code)}
                onClick={onClose}
                className={`rounded-sm border px-3 py-2 text-xs uppercase transition-colors active:bg-haze-200 ${
                  code === locale
                    ? 'border-ink-800 bg-ink-900 font-semibold text-white'
                    : 'border-haze-200 text-steel-500 hover:border-steel-300 hover:bg-haze-100 hover:text-ink-900'
                }`}
              >
                {code}
              </Link>
            ))}
          </div>
          <a
            href={`tel:${contact.phoneHref}`}
            className="mt-3 block rounded-sm bg-signal-500 px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-signal-600"
          >
            {contact.phone}
          </a>
        </div>
      </div>
    </div>
  )
}
