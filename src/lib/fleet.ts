import fleetData from '@/data/fleet.json'

export type KeySpecs = Record<string, string | number | undefined>

export type Charter = {
  type: string | null
  status: string | null
  region: string | null
  location: string | null
  bhp: number | null
  bollardPull: string | number | null
  dp: string | null
  deckArea: number | null
  cranes: string | null
  equipment: string | null
}

export type Vessel = {
  slug: string
  name: string
  type: string
  category: string
  categorySlug: string
  specSheetUrl: string | null
  specSheetMissing: boolean
  keySpecs: KeySpecs
  specSections: Record<string, Record<string, string>>
  charter?: Charter
}

export const fleet = fleetData as Vessel[]

/** Order categories the way a charterer scans them: workhorses first. */
const CATEGORY_ORDER = [
  'AHTS VESSELS',
  'DSV-DP2 VESSELS',
  'AHT & TUG VESSELS',
  'CREW BOATS',
  'LIFTBOATS & JACKUP BARGES',
  'CRANE VESSELS',
  'ERR VESSELS',
  'BARGES',
  'ROV FLEET',
]

export const categories = CATEGORY_ORDER.filter((c) =>
  fleet.some((v) => v.category === c),
).map((category) => ({
  category,
  slug: fleet.find((v) => v.category === category)!.categorySlug,
  count: fleet.filter((v) => v.category === category).length,
}))

export const regions = Array.from(
  new Set(fleet.map((v) => v.charter?.region).filter((r): r is string => Boolean(r))),
).sort()

export function sortedFleet(): Vessel[] {
  return [...fleet].sort((a, b) => {
    const order =
      CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category)
    return order !== 0 ? order : a.name.localeCompare(b.name)
  })
}

export function getVessel(slug: string): Vessel | undefined {
  return fleet.find((v) => v.slug === slug)
}

export function relatedVessels(vessel: Vessel, limit = 3): Vessel[] {
  return fleet
    .filter((v) => v.slug !== vessel.slug && v.category === vessel.category)
    .slice(0, limit)
}

/** Spec sections for display, minus the sheet's cover block.
 *
 * Each PDF opens with the vessel name over its type ('SELBI' / 'Anchor
 * Handling Tug Supply'), which the extractor reads as a section of its own.
 */
export function displaySections(vessel: Vessel) {
  const name = vessel.name.toUpperCase()
  return Object.entries(vessel.specSections).filter(
    ([section, fields]) =>
      section.toUpperCase().replace(/:$/, '') !== name &&
      Object.keys(fields).length > 0,
  )
}

export function specNumber(vessel: Vessel, key: string): number | undefined {
  const value = vessel.keySpecs[`${key}Value`]
  return typeof value === 'number' ? value : undefined
}

export function specText(vessel: Vessel, key: string): string | undefined {
  const value = vessel.keySpecs[key]
  return typeof value === 'string' ? value : undefined
}

/** Specs shown on cards and at the top of a vessel page, in reading order. */
export const HEADLINE_SPECS = [
  'built',
  'lengthOverall',
  'beam',
  'draft',
  'bhp',
  'bollardPull',
  'deckArea',
  'deckCargo',
  'dwt',
  'dynamicPositioning',
  'berths',
] as const

/** Availability wording from the charter sheet, bucketed for display. */
export function availabilityTone(status?: string | null) {
  if (!status) return 'unknown' as const
  const s = status.toLowerCase()
  // Checked before 'available' so "On charter - Available soon" reads as taken.
  if (s.includes('on charter')) return 'chartered' as const
  if (s.includes('prompt') || s.includes('spot')) return 'available' as const
  if (s.includes('avail')) return 'soon' as const
  return 'unknown' as const
}
