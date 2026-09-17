export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nurlytolkun.com'

export const contact = {
  phone: '+993 12 46-90-06',
  phoneHref: '+99312469006',
  fax: '+993 12 469007',
  email: 'info@nurlytolkun.tm',
}

export type Office = {
  city: string
  country: string
  lines: string[]
  phone?: string
  head?: boolean
}

/** Taken from the addresses printed on the vessel specification sheets. */
export const offices: Office[] = [
  {
    city: 'Ashgabat',
    country: 'Turkmenistan',
    head: true,
    lines: [
      'Business centre “Berkarar”, Office I-3, 9th floor',
      'No. 82, 1972 (Ataturk) street',
      'Ashgabat 744028',
    ],
    phone: '+993 12 46-90-06',
  },
  {
    city: 'Turkmenbashy',
    country: 'Turkmenistan',
    lines: ['Magtymguly street, building 69 «A»', '745000'],
    phone: '+993 243 72345',
  },
  {
    city: 'Hazar',
    country: 'Turkmenistan',
    lines: ['Balkanabat High Road, 9th km', 'Dragon Oil base'],
  },
  {
    city: 'Dubai',
    country: 'UAE',
    lines: [
      'Office 1604, The Dome Tower, Cluster N',
      'Jumeirah Lakes Towers (JLT)',
    ],
  },
  {
    city: 'Abu Dhabi',
    country: 'UAE',
    lines: ['Office 1114, Gate 1100', 'Corniche Building C17', 'P.O. Box 25203'],
  },
]

export type Service = {
  slug: string
  title: { en: string; ru: string }
  summary: { en: string; ru: string }
}

export const services: Service[] = [
  {
    slug: 'offshore-vessel-charter',
    title: {
      en: 'Offshore vessel charter',
      ru: 'Фрахт офшорных судов',
    },
    summary: {
      en: 'AHTS, DSV, PSV, crew boats, liftboats and barges on spot or term charter across the Caspian, Middle East and Europe.',
      ru: 'AHTS, водолазные суда, PSV, крюинг-боты, самоподъёмные платформы и баржи в спотовый или срочный фрахт на Каспии, Ближнем Востоке и в Европе.',
    },
  },
  {
    slug: 'marine-support',
    title: {
      en: 'Marine support for offshore construction',
      ru: 'Морская поддержка офшорного строительства',
    },
    summary: {
      en: 'One-stop marine support for construction projects onshore and offshore, from mobilisation through to demobilisation.',
      ru: 'Комплексная морская поддержка строительных проектов на суше и в море — от мобилизации до демобилизации.',
    },
  },
  {
    slug: 'marine-agency',
    title: { en: 'Marine agency & crew manning', ru: 'Морское агентирование и крюинг' },
    summary: {
      en: 'Crew manning agency selecting, recruiting and delivering seafarers to ship owners and ship managers.',
      ru: 'Крюинговое агентство: подбор, набор и направление моряков судовладельцам и управляющим компаниям.',
    },
  },
  {
    slug: 'technical-management',
    title: {
      en: 'Ship technical & operations management',
      ru: 'Техническое и операционное управление судами',
    },
    summary: {
      en: 'Vessel registration, operations, servicing, technical maintenance and crew management.',
      ru: 'Регистрация судов, эксплуатация, обслуживание, техническое содержание и управление экипажем.',
    },
  },
  {
    slug: 'subsea-diving',
    title: {
      en: 'Subsea services & diving',
      ru: 'Подводно-технические и водолазные работы',
    },
    summary: {
      en: 'Underwater repair and maintenance, wet welding and UWILD for drilling rigs and ship owners.',
      ru: 'Подводный ремонт и обслуживание, мокрая сварка и UWILD для буровых установок и судовладельцев.',
    },
  },
  {
    slug: 'lsa-ffe',
    title: {
      en: 'LSA & FFE service and inspection',
      ru: 'Обслуживание и освидетельствование ЛСА и противопожарного оборудования',
    },
    summary: {
      en: 'Servicing and inspection of IMO-mandated life-saving appliances and multi-brand firefighting systems to ISO standards.',
      ru: 'Обслуживание и освидетельствование спасательных средств по требованиям ИМО и противопожарных систем разных производителей по стандартам ISO.',
    },
  },
  {
    slug: 'lifting-equipment',
    title: {
      en: 'Lifting gear attestation & load testing',
      ru: 'Аттестация и испытание грузоподъёмного оборудования',
    },
    summary: {
      en: 'Certification of ships’ lifting appliances and load testing of cranes up to 1,000 tonnes.',
      ru: 'Сертификация судовых грузоподъёмных устройств и испытание кранов грузоподъёмностью до 1000 тонн.',
    },
  },
  {
    slug: 'navigation-gmdss',
    title: {
      en: 'Navigational & GMDSS services',
      ru: 'Навигационные услуги и ГМССБ',
    },
    summary: {
      en: 'Repair and servicing of marine radio and navigation equipment across all major manufacturers.',
      ru: 'Ремонт и обслуживание судового радио- и навигационного оборудования всех основных производителей.',
    },
  },
]
