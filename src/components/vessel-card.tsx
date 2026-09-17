import Link from 'next/link'

import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionary'
import { availabilityTone, specText, type Vessel } from '@/lib/fleet'

const TONE_CLASS: Record<string, string> = {
  available: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  soon: 'bg-amber-50 text-amber-700 ring-amber-200',
  chartered: 'bg-hull-50 text-hull-600 ring-hull-200',
  unknown: 'bg-slate-50 text-slate-500 ring-slate-200',
}

export function AvailabilityBadge({ status }: { status?: string | null }) {
  if (!status) return null
  const tone = availabilityTone(status)
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${TONE_CLASS[tone]}`}
    >
      {status}
    </span>
  )
}

export function VesselCard({
  vessel,
  locale,
  t,
}: {
  vessel: Vessel
  locale: Locale
  t: Dictionary
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
      className="group flex flex-col rounded-xl border border-hull-100 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-hull-300 hover:shadow-lg hover:shadow-hull-900/5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-hull-900 group-hover:text-hull-700">
            {vessel.name}
          </h3>
          <p className="mt-0.5 truncate text-sm text-hull-500">{vessel.type}</p>
        </div>
        {vessel.charter?.dp ? (
          <span className="shrink-0 rounded bg-hull-700 px-2 py-1 text-[11px] font-semibold text-white">
            {vessel.charter.dp}
          </span>
        ) : null}
      </div>

      {stats.length > 0 ? (
        <dl className="mt-4 grid grid-cols-3 gap-3 border-t border-hull-50 pt-4">
          {stats.map((s) => (
            <div key={s.label} className="min-w-0">
              <dt className="text-[10px] leading-tight uppercase tracking-wide text-hull-400">
                {s.label}
              </dt>
              <dd className="tabular mt-1 line-clamp-2 text-sm font-medium leading-snug text-hull-800">
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}

      <div className="mt-4 flex items-center justify-between gap-2 pt-1">
        <AvailabilityBadge status={vessel.charter?.status} />
        {vessel.charter?.region ? (
          <span className="shrink-0 text-xs text-hull-400">{vessel.charter.region}</span>
        ) : null}
      </div>
    </Link>
  )
}
