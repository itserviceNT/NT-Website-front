import Image from 'next/image'
import Link from 'next/link'

import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionary'
import { availabilityTone, specText, type Vessel } from '@/lib/fleet'

const TONE_CLASS: Record<string, string> = {
  available: 'bg-emerald-500/15 text-emerald-700 ring-emerald-600/25',
  soon: 'bg-signal-500/12 text-signal-600 ring-signal-500/25',
  chartered: 'bg-steel-500/12 text-steel-500 ring-steel-400/30',
  unknown: 'bg-haze-100 text-steel-500 ring-haze-200',
}

const TONE_ON_DARK: Record<string, string> = {
  available: 'bg-emerald-400/20 text-emerald-200 ring-emerald-300/30',
  soon: 'bg-signal-500/25 text-signal-400 ring-signal-400/40',
  chartered: 'bg-white/10 text-haze-200 ring-white/20',
  unknown: 'bg-white/10 text-haze-200 ring-white/20',
}

export function AvailabilityBadge({
  status,
  onDark = false,
}: {
  status?: string | null
  onDark?: boolean
}) {
  if (!status) return null
  const tone = availabilityTone(status)
  const palette = onDark ? TONE_ON_DARK : TONE_CLASS
  return (
    <span
      className={`label inline-flex items-center rounded-sm px-2 py-1 ring-1 ring-inset ${palette[tone]}`}
    >
      {status}
    </span>
  )
}

export function VesselCard({
  vessel,
  locale,
  t,
  priority = false,
}: {
  vessel: Vessel
  locale: Locale
  t: Dictionary
  priority?: boolean
}) {
  const stats = (
    [
      ['bhp', t.specs.bhp],
      ['bollardPull', t.specs.bollardPull],
      ['deckArea', t.specs.deckArea],
      ['lengthOverall', t.specs.lengthOverall],
    ] as const
  )
    .map(([key, label]) => ({ label, value: specText(vessel, key) }))
    .filter((s): s is { label: string; value: string } => Boolean(s.value))
    .slice(0, 3)

  return (
    <Link
      href={`/${locale}/fleet/${vessel.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-sm border border-haze-200 bg-white transition-all duration-500 hover:-translate-y-1 hover:border-steel-300 hover:shadow-[0_18px_40px_-20px_rgba(6,17,26,0.45)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-ink-800">
        {vessel.photo ? (
          <Image
            src={vessel.photo}
            alt={`${vessel.name} — ${vessel.type}`}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-ink-800 to-ink-600">
            <span className="label text-steel-400">{vessel.type}</span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink-950/85 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
          <div className="min-w-0">
            <p className="label text-steel-300">{vessel.type}</p>
            <h3 className="truncate font-display text-xl font-medium text-white">
              {vessel.name}
            </h3>
          </div>
          {vessel.charter?.dp ? (
            <span className="data shrink-0 rounded-sm bg-white/15 px-2 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
              {vessel.charter.dp}
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        {stats.length > 0 ? (
          <dl className="grid grid-cols-3 gap-3">
            {stats.map((s) => (
              <div key={s.label} className="min-w-0">
                <dt className="label text-steel-400">{s.label}</dt>
                <dd className="data mt-1 line-clamp-2 text-sm leading-snug text-ink-800">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}

        <div className="mt-auto flex items-center justify-between gap-2 pt-4">
          <AvailabilityBadge status={vessel.charter?.status} />
          {vessel.charter?.region ? (
            <span className="label shrink-0 text-steel-400">
              {vessel.charter.region}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  )
}
