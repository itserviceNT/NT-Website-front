import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Page not found — Nurly Tolkun',
  description: 'The page you are looking for does not exist.',
  robots: { index: false, follow: true },
}

const COPY = [
  {
    locale: 'en',
    code: 'Not found',
    title: 'That page has been moved or retired',
    body: 'The fleet list, charter availability and services are all still here.',
    links: [
      { href: '/en/fleet', label: 'Browse the fleet', primary: true },
      { href: '/en/charter', label: 'Charter availability' },
      { href: '/en', label: 'Home' },
    ],
  },
  {
    locale: 'ru',
    code: 'Страница не найдена',
    title: 'Эта страница перемещена или удалена',
    body: 'Список флота, доступность судов и услуги по-прежнему доступны.',
    links: [
      { href: '/ru/fleet', label: 'Смотреть флот', primary: true },
      { href: '/ru/charter', label: 'Доступность судов' },
      { href: '/ru', label: 'Главная' },
    ],
  },
]

export default function GlobalNotFound() {
  return (
    // Deliberately no next/font here: this page bypasses the layout, and
    // loading webfonts for a 404 would add a build-time fetch for no gain.
    <html lang="en">
      <body className="bg-paper font-sans text-ink-900">
        <div className="shell flex min-h-screen flex-col justify-center py-20">
          {/* The URL carries no usable locale, so both are offered. */}
          {COPY.map((c, i) => (
            <section
              key={c.locale}
              lang={c.locale}
              className={i > 0 ? 'mt-14 border-t border-haze-200 pt-14' : ''}
            >
              <p className="label flex items-center gap-3 text-signal-500">
                <span className="h-px w-8 bg-signal-500" />
                404 — {c.code}
              </p>
              <h1 className="mt-5 max-w-2xl font-display text-[clamp(1.7rem,4.5vw,2.75rem)] font-semibold leading-[1.05] tracking-tight text-ink-950">
                {c.title}
              </h1>
              <p className="mt-4 max-w-xl leading-relaxed text-steel-500">{c.body}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                {c.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className={
                      link.primary
                        ? 'rounded-sm bg-signal-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-signal-600'
                        : 'rounded-sm border border-steel-300 px-5 py-3 text-sm font-medium text-ink-700 transition-colors hover:bg-haze-100'
                    }
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>
      </body>
    </html>
  )
}
