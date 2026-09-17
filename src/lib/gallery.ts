import galleryData from '@/data/gallery.json'

export type GalleryCategory =
  | 'fleet'
  | 'subsea'
  | 'operations'
  | 'inspection'
  | 'projects'

export type GalleryImage = {
  slug: string
  category: GalleryCategory
  src: string
  width: number
  height: number
}

export const galleryImages = galleryData as GalleryImage[]

export const galleryCategories: GalleryCategory[] = [
  'fleet',
  'subsea',
  'projects',
  'operations',
  'inspection',
]

/** Short caption per image, keyed by slug, in both locales. */
export const captions: Record<string, { en: string; ru: string }> = {
  'crew-radio-deck': {
    en: 'Deck officer on radio during cargo operations',
    ru: 'Палубный офицер на связи во время грузовых операций',
  },
  'crew-muster': {
    en: 'Crew muster on the aft deck',
    ru: 'Построение экипажа на кормовой палубе',
  },
  'bridge-watch': {
    en: 'Bridge watch under way',
    ru: 'Ходовая вахта на мостике',
  },
  'lsa-workshop-liferaft': {
    en: 'Liferaft servicing at the LSA workshop',
    ru: 'Обслуживание спасательного плота в мастерской ЛСА',
  },
  'lsa-workshop-servicing': {
    en: 'Life-saving appliance inspection',
    ru: 'Освидетельствование спасательных средств',
  },
  'lsa-inspection-harness': {
    en: 'Lifting gear and harness inspection',
    ru: 'Проверка грузоподъёмного оборудования и страховочных систем',
  },
  'ffe-testing': {
    en: 'Firefighting equipment testing',
    ru: 'Испытание противопожарного оборудования',
  },
  'diver-jacket-leg': {
    en: 'Diver on a jacket leg during underwater inspection',
    ru: 'Водолаз на опоре платформы при подводном обследовании',
  },
  'rov-deployment': {
    en: 'ROV deployment from deck',
    ru: 'Спуск телеуправляемого аппарата с палубы',
  },
  'platform-flare': {
    en: 'Offshore production platform, Caspian Sea',
    ru: 'Морская добывающая платформа, Каспийское море',
  },
  'jackup-platform': {
    en: 'Jack-up platform on location',
    ru: 'Самоподъёмная установка на точке',
  },
  'crane-lift-deck': {
    en: 'Crane lift onto the working deck',
    ru: 'Крановая операция на рабочей палубе',
  },
  'deck-equipment': {
    en: 'Deck equipment during mobilisation',
    ru: 'Палубное оборудование во время мобилизации',
  },
  'tug-barge-tow': {
    en: 'Tug and barge under tow',
    ru: 'Буксир с баржой на буксировке',
  },
  'tug-ntms-12': {
    en: 'Tugboat NTMS 12 alongside',
    ru: 'Буксир NTMS 12 у причала',
  },
  'barge-ntms-01': {
    en: '300ft flat top barge NTMS 01',
    ru: 'Палубная баржа NTMS 01, 300 футов',
  },
  'crew-boat-underway': {
    en: 'Fast crew boat under way',
    ru: 'Быстроходный крюинг-бот на ходу',
  },
  'psv-alongside': {
    en: 'Platform supply vessel alongside',
    ru: 'Судно снабжения платформ у борта',
  },
  'ahts-platforms': {
    en: 'AHTS working between platforms',
    ru: 'AHTS на работах между платформами',
  },
  'crane-barge': {
    en: 'Crane vessel on station',
    ru: 'Крановое судно на позиции',
  },
  'lifeboat-launch': {
    en: 'Lifeboat launch drill',
    ru: 'Учение по спуску спасательной шлюпки',
  },
  'crew-radio-rig': {
    en: 'Supervisor on radio at the rig',
    ru: 'Супервайзер на связи у буровой',
  },
  'engine-control-room': {
    en: 'Engine control room checks',
    ru: 'Проверки в центральном посту управления',
  },
  'office-reception': {
    en: 'Ashgabat office reception',
    ru: 'Ресепшн офиса в Ашхабаде',
  },
  'office-desk': {
    en: 'Operations desk',
    ru: 'Операционный отдел',
  },
}

export function caption(slug: string, locale: 'en' | 'ru') {
  return captions[slug]?.[locale] ?? ''
}
