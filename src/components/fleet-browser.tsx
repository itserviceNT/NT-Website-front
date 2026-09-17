'use client'

import { useSearchParams } from 'next/navigation'
import { useMemo, useState } from 'react'

import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionary'
import { format } from '@/i18n/format'
import { specNumber, type Vessel } from '@/lib/fleet'
import { VesselCard } from '@/components/vessel-card'

type SortKey = 'name' | 'bollardPull' | 'bhp' | 'deckArea'

export function FleetBrowser({
  vessels,
  categories,
  regions,
  locale,
  t,
}: {
  vessels: Vessel[]
  categories: { category: string; slug: string; count: number }[]
  regions: string[]
  locale: Locale
  t: Dictionary
}) {
  // Read from the URL so footer links like /fleet?category=ahts-vessels land
  // pre-filtered, while the page itself stays static.
  const initialCategory = useSearchParams().get('category') ?? 'all'
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState(initialCategory)
  const [region, setRegion] = useState('all')
  const [sort, setSort] = useState<SortKey>('name')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = vessels.filter((v) => {
      if (category !== 'all' && v.categorySlug !== category) return false
      if (region !== 'all' && v.charter?.region !== region) return false
      if (!q) return true
      return (
        v.name.toLowerCase().includes(q) ||
        v.type.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q)
      )
    })

    if (sort === 'name') return filtered.sort((a, b) => a.name.localeCompare(b.name))
    // Vessels missing the sorted figure sink to the bottom rather than the top.
    return filtered.sort((a, b) => {
      const av = specNumber(a, sort)
      const bv = specNumber(b, sort)
      if (av === undefined && bv === undefined) return a.name.localeCompare(b.name)
      if (av === undefined) return 1
      if (bv === undefined) return -1
      return bv - av
    })
  }, [vessels, query, category, region, sort])

  const hasFilters = query !== '' || category !== 'all' || region !== 'all'

  const selectClass =
    'rounded-sm border border-haze-200 bg-white px-3 py-2.5 text-sm text-ink-800 transition-colors focus:border-steel-400 focus:outline-none'

  return (
    <div>
      <div className="rounded-xl border border-haze-200 bg-haze-50 p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <label htmlFor="fleet-search" className="sr-only">
              {t.fleet.searchLabel}
            </label>
            <input
              id="fleet-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.fleet.searchPlaceholder}
              className={`w-full ${selectClass}`}
            />
          </div>

          <div>
            <label htmlFor="fleet-category" className="sr-only">
              {t.fleet.filterCategory}
            </label>
            <select
              id="fleet-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`w-full ${selectClass}`}
            >
              <option value="all">
                {t.fleet.filterCategory}: {t.fleet.filterAll}
              </option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {titleCase(c.category)} ({c.count})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="fleet-region" className="sr-only">
              {t.fleet.filterRegion}
            </label>
            <select
              id="fleet-region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className={`w-full ${selectClass}`}
            >
              <option value="all">
                {t.fleet.filterRegion}: {t.fleet.filterAll}
              </option>
              {regions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-haze-200 pt-3">
          <p className="data text-sm text-steel-500">
            {format(t.fleet.resultCount, {
              count: results.length,
              total: vessels.length,
            })}
          </p>
          <div className="ml-auto flex items-center gap-2">
            <label htmlFor="fleet-sort" className="text-sm text-steel-500">
              {t.fleet.sortBy}
            </label>
            <select
              id="fleet-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className={selectClass}
            >
              <option value="name">{t.fleet.sortName}</option>
              <option value="bollardPull">{t.fleet.sortBollardPull}</option>
              <option value="bhp">{t.fleet.sortBhp}</option>
              <option value="deckArea">{t.fleet.sortDeckArea}</option>
            </select>
          </div>
        </div>
      </div>

      {results.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-haze-200 p-12 text-center">
          <p className="text-steel-500">{t.fleet.noResults}</p>
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setCategory('all')
              setRegion('all')
            }}
            className="mt-4 rounded-md bg-ink-900 px-4 py-2 text-sm font-medium text-white hover:bg-ink-800"
          >
            {t.fleet.clearFilters}
          </button>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {results.map((v) => (
            <VesselCard key={v.slug} vessel={v} locale={locale} t={t} />
          ))}
        </div>
      )}

      {hasFilters && results.length > 0 ? (
        <button
          type="button"
          onClick={() => {
            setQuery('')
            setCategory('all')
            setRegion('all')
          }}
          className="mt-6 text-sm text-steel-500 underline underline-offset-4 hover:text-ink-700"
        >
          {t.fleet.clearFilters}
        </button>
      ) : null}
    </div>
  )
}

function titleCase(value: string) {
  return value
    .toLowerCase()
    .replace(/\b\w/g, (m) => m.toUpperCase())
    .replace(/\bAhts\b/g, 'AHTS')
    .replace(/\bAht\b/g, 'AHT')
    .replace(/\bDsv\b/g, 'DSV')
    .replace(/\bDp2\b/g, 'DP2')
    .replace(/\bRov\b/g, 'ROV')
    .replace(/\bErr\b/g, 'ERR')
}
