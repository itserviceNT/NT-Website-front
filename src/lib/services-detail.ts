/** Per-service capability lists and imagery.
 *
 * The GMDSS and navigation entries come from the company's own /nav/ page.
 * Only the concrete service and approval lists were carried over; that page's
 * headline statistics are template placeholders and are deliberately omitted.
 */
export type ServiceDetail = {
  image: string
  points: { en: string[]; ru: string[] }
}

export const serviceDetail: Record<string, ServiceDetail> = {
  'offshore-vessel-charter': {
    image: '/images/gallery/ahts-platforms.jpg',
    points: {
      en: [
        'Spot, term and project charter',
        'AHTS, AHT and tug support',
        'DP1 and DP2 diving and platform supply vessels',
        'Fast crew boats and personnel transfer',
        'Liftboats, jack-up and flat top barges',
        'Crane vessels and emergency response vessels',
      ],
      ru: [
        'Спотовый, срочный и проектный фрахт',
        'Суда AHTS, AHT и буксирная поддержка',
        'Водолазные суда и суда снабжения с DP1 и DP2',
        'Быстроходные крюинг-боты и перевозка персонала',
        'Самоподъёмные платформы, СПБУ и палубные баржи',
        'Крановые суда и суда аварийного реагирования',
      ],
    },
  },
  'marine-support': {
    image: '/images/gallery/crane-lift-deck.jpg',
    points: {
      en: [
        'Project mobilisation and demobilisation',
        'Offshore lifting and deck cargo operations',
        'Towage, anchor handling and positioning',
        'Marine spread management',
      ],
      ru: [
        'Мобилизация и демобилизация проектов',
        'Морские грузоподъёмные и палубные операции',
        'Буксировка, завозка якорей и позиционирование',
        'Управление морским парком техники',
      ],
    },
  },
  'marine-agency': {
    image: '/images/gallery/crew-muster.jpg',
    points: {
      en: [
        'Seafarer selection and recruitment',
        'Crew supply to owners and managers',
        'Documentation and certification handling',
        'Crew rotation and travel logistics',
      ],
      ru: [
        'Подбор и наём моряков',
        'Направление экипажей судовладельцам и управляющим компаниям',
        'Оформление документов и сертификатов',
        'Ротация экипажей и организация поездок',
      ],
    },
  },
  'technical-management': {
    image: '/images/gallery/engine-control-room.jpg',
    points: {
      en: [
        'Vessel registration and flag administration',
        'Planned maintenance and dry-docking',
        'Operations and voyage support',
        'Crew management and payroll',
      ],
      ru: [
        'Регистрация судов и работа с флагом',
        'Плановое техобслуживание и доковый ремонт',
        'Операционная и рейсовая поддержка',
        'Управление экипажем и расчёт заработной платы',
      ],
    },
  },
  'subsea-diving': {
    image: '/images/gallery/diver-jacket-leg.jpg',
    points: {
      en: [
        'Underwater inspection in lieu of drydocking (UWILD)',
        'Wet welding and underwater repair',
        'Structural and jacket-leg inspection',
        'ROV survey and intervention',
        'Subsea maintenance for rigs and vessels',
      ],
      ru: [
        'Подводное освидетельствование вместо докования (UWILD)',
        'Мокрая сварка и подводный ремонт',
        'Обследование конструкций и опор платформ',
        'Обследование и работы с применением ТНПА',
        'Подводное обслуживание буровых установок и судов',
      ],
    },
  },
  'lsa-ffe': {
    image: '/images/gallery/lsa-workshop-liferaft.jpg',
    points: {
      en: [
        'Liferaft and lifeboat servicing',
        'Davit and launching appliance inspection',
        'Fixed firefighting system maintenance',
        'Portable extinguisher and breathing apparatus testing',
        'Multi-brand equipment servicing to ISO standards',
      ],
      ru: [
        'Обслуживание спасательных плотов и шлюпок',
        'Освидетельствование шлюпбалок и спусковых устройств',
        'Обслуживание стационарных систем пожаротушения',
        'Проверка переносных огнетушителей и дыхательных аппаратов',
        'Обслуживание оборудования разных марок по стандартам ISO',
      ],
    },
  },
  'lifting-equipment': {
    image: '/images/gallery/lsa-inspection-harness.jpg',
    points: {
      en: [
        'Load testing of cranes up to 1,000 tonnes',
        'Certification of shipboard lifting appliances',
        'Wire rope, sling and shackle inspection',
        'Attestation of towing and lifting gear',
      ],
      ru: [
        'Испытание кранов грузоподъёмностью до 1000 тонн',
        'Сертификация судовых грузоподъёмных устройств',
        'Проверка тросов, строп и скоб',
        'Аттестация буксирного и грузоподъёмного оборудования',
      ],
    },
  },
  'navigation-gmdss': {
    image: '/images/gallery/bridge-watch.jpg',
    points: {
      en: [
        'VHF, MF and HF radio installation and certification',
        'INMARSAT terminal setup and support',
        'EPIRB, SART and VDR testing',
        'Radar and ARPA installation and calibration',
        'ECDIS installation, updates and chart management',
        'GPS/DGPS and AIS system certification',
        'Radio survey inspections and annual reports',
        'Shore-based maintenance certificates',
      ],
      ru: [
        'Монтаж и сертификация радиостанций ОВЧ, ПВ и КВ',
        'Установка и поддержка терминалов ИНМАРСАТ',
        'Проверка АРБ, РЛО и регистраторов данных рейса',
        'Монтаж и калибровка РЛС и САРП',
        'Установка и обновление ЭКНИС, ведение карт',
        'Сертификация систем GPS/DGPS и АИС',
        'Радиоосвидетельствования и ежегодные отчёты',
        'Сертификаты берегового технического обслуживания',
      ],
    },
  },
}

/** Societies whose approvals cover the services above. Bureau Veritas also
 *  appears as the class society on the fleet's own specification sheets. */
export const classSocieties = [
  { abbr: 'BV', name: 'Bureau Veritas' },
  { abbr: 'ABS', name: 'American Bureau of Shipping' },
  { abbr: 'RINA', name: 'RINA' },
  { abbr: 'RMRS', name: 'Russian Maritime Register of Shipping' },
]

export const standards = [
  'IMO SOLAS',
  'ITU Radio Regulations',
  'ISO 9001:2015',
  'ISO 14001:2015',
  'ISO 45001:2018',
]
