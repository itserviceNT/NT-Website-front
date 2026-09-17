'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionary'

export type HeroVessel = {
  slug: string
  name: string
  type: string
  photo: string
  status?: string | null
  figures: { label: string; value: string }[]
}

const DWELL_MS = 6200

export function FleetHero({
  vessels,
  locale,
  t,
}: {
  vessels: HeroVessel[]
  locale: Locale
  t: Dictionary
}) {
  const [index, setIndex] = useState(0)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (vessels.length < 2) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    timer.current = setTimeout(
      () => setIndex((i) => (i + 1) % vessels.length),
      DWELL_MS,
    )
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [index, vessels.length])

  const current = vessels[index]

  return (
    <section className="relative isolate overflow-hidden bg-ink-950">
      <div className="absolute inset-0">
        {vessels.map((vessel, i) => (
          <div
            key={vessel.slug}
            aria-hidden={i !== index}
            className="absolute inset-0 transition-opacity duration-[1400ms] ease-out"
            style={{ opacity: i === index ? 1 : 0 }}
          >
            <div className={i === index ? 'drift h-full w-full' : 'h-full w-full'}>
              <Image
                src={vessel.photo}
                alt=""
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </div>
        ))}
        {/* Bottom-weighted so the type stays legible while the photograph
            still reads as the subject rather than a dark texture. */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/55 to-ink-950/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/70 via-ink-950/15 to-transparent" />
      </div>

      <div className="shell relative flex min-h-[min(88svh,780px)] flex-col justify-end pb-10 pt-28 sm:pb-14 xl:min-h-[min(90svh,1000px)]">
        <div className="max-w-3xl">
          <p className="label flex items-center gap-3 text-signal-400">
            <span className="h-px w-8 bg-signal-500" />
            {t.company.name}
          </p>
          <h1 className="mt-5 font-display text-[clamp(2.4rem,6.2vw,4.75rem)] font-semibold leading-[0.98] tracking-tight text-white">
            {t.home.heroTitle}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-haze-200 sm:text-lg">
            {t.home.heroSubtitle}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/${locale}/fleet`}
              className="rounded-sm bg-signal-500 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-signal-600"
            >
              {t.home.heroCtaFleet}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="rounded-sm border border-white/25 px-6 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/10"
            >
              {t.home.heroCtaContact}
            </Link>
          </div>
        </div>

        {/* Identity plate: which vessel you are looking at, and why it matters. */}
        <div className="mt-12 border-t border-white/15 pt-5 sm:mt-16">
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
            <Link
              href={`/${locale}/fleet/${current.slug}`}
              key={current.slug}
              className="group min-w-0"
              style={{ animation: 'fade 0.8s var(--ease-out-quint)' }}
            >
              <p className="label text-steel-400">{current.type}</p>
              <p className="mt-1 font-display text-2xl font-medium text-white group-hover:text-signal-400 sm:text-3xl">
                {current.name}
                <span className="ml-2 inline-block text-signal-500 opacity-0 transition-opacity group-hover:opacity-100">
                  →
                </span>
              </p>
            </Link>

            <dl
              key={`${current.slug}-figures`}
              className="flex flex-wrap gap-x-8 gap-y-3"
              style={{ animation: 'fade 0.9s var(--ease-out-quint)' }}
            >
              {current.figures.map((figure) => (
                <div key={figure.label}>
                  <dt className="label text-steel-400">{figure.label}</dt>
                  <dd className="data mt-1 text-sm text-white">{figure.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-6 flex gap-1.5" role="tablist" aria-label={t.nav.fleet}>
            {vessels.map((vessel, i) => (
              <button
                key={vessel.slug}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={vessel.name}
                onClick={() => setIndex(i)}
                className="group relative h-4 flex-1 max-w-14"
              >
                <span
                  className={`absolute inset-x-0 top-1.5 h-0.5 origin-left transition-colors ${
                    i === index ? 'bg-signal-500' : 'bg-white/25 group-hover:bg-white/50'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
