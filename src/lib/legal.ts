/** Privacy and terms content.
 *
 * Written from what this site actually does, verified against the source:
 * no analytics or tracking scripts, no cookies or browser storage, fonts and
 * images served from this domain, and an enquiry form that composes a mailto
 * rather than posting anywhere. Anything that depends on the company's legal
 * entity or hosting arrangements is marked for review rather than invented.
 */
export const legalUpdated = '2026-09-18'

export type LegalSection = { heading: string; body: string[] }
export type LegalDoc = {
  title: string
  intro: string
  updatedLabel: string
  sections: LegalSection[]
}

export const privacy: Record<'en' | 'ru', LegalDoc> = {
  en: {
    title: 'Privacy',
    updatedLabel: 'Last updated',
    intro:
      'This page explains what happens to information when you use this website. In short: the site itself collects nothing about you, sets no cookies, and runs no analytics or tracking.',
    sections: [
      {
        heading: 'What this website collects',
        body: [
          'Nothing. Browsing this site does not create an account, a profile or a record tied to you. There is no analytics, no advertising or tracking pixel, and no third-party script that observes your visit.',
          'The pages are served as static files. Everything you see — text, photographs, vessel specification sheets, typefaces — is delivered from this domain.',
        ],
      },
      {
        heading: 'Cookies and browser storage',
        body: [
          'This site sets no cookies and writes nothing to local or session storage. There is no consent banner because there is nothing to consent to.',
          'Your language is chosen from the address you visit (/en or /ru) and from the language preference your browser sends with the request. That preference is not stored or recorded.',
        ],
      },
      {
        heading: 'The charter enquiry form',
        body: [
          'The enquiry form on the contact page does not submit anything to us over the web. It assembles what you have typed into a message and hands it to your own email programme, where you can read, change or discard it before sending.',
          'Nothing you type reaches us unless you choose to send that email. Because your mail programme sends it, a copy stays in your sent items.',
        ],
      },
      {
        heading: 'When you contact us',
        body: [
          'If you email us, message us on WhatsApp or call, we receive what you send: your name and contact details, and whatever you tell us about the vessel, dates and scope of work you need.',
          'We use that information to answer your enquiry and to arrange the work you ask for. We do not sell it, and we do not use it to market to you unless you ask us to.',
        ],
      },
      {
        heading: 'Hosting and server records',
        body: [
          'Like any website, this one is served by a hosting provider whose servers keep short-term technical records of requests — typically an IP address, the page requested and a timestamp. These are used to operate and secure the service, not to identify visitors.',
        ],
      },
      {
        heading: 'Links to other services',
        body: [
          'The WhatsApp links on this site open a conversation on WhatsApp, which is operated by a separate company under its own privacy terms. Opening one is a decision you make; this site does not pass any information about you when you do.',
        ],
      },
      {
        heading: 'Keeping and removing information',
        body: [
          'Correspondence about an enquiry or a charter is kept while it is commercially or legally needed, and removed when it is not.',
          'If you want to know what correspondence we hold about you, or want it removed, write to us and we will deal with it.',
        ],
      },
      {
        heading: 'Changes to this page',
        body: [
          'If what the site does changes — if analytics or a submitted form is ever added, for example — this page will be updated to say so, and the date above will change with it.',
        ],
      },
    ],
  },
  ru: {
    title: 'Конфиденциальность',
    updatedLabel: 'Последнее обновление',
    intro:
      'Эта страница объясняет, что происходит с информацией при использовании сайта. Коротко: сам сайт ничего о вас не собирает, не использует файлы cookie, аналитику или системы отслеживания.',
    sections: [
      {
        heading: 'Что собирает этот сайт',
        body: [
          'Ничего. Просмотр сайта не создаёт учётной записи, профиля или записи, связанной с вами. Здесь нет аналитики, рекламных или отслеживающих пикселей и сторонних скриптов, наблюдающих за вашим визитом.',
          'Страницы отдаются как статические файлы. Всё, что вы видите — тексты, фотографии, спецификации судов, шрифты — загружается с этого домена.',
        ],
      },
      {
        heading: 'Файлы cookie и хранилище браузера',
        body: [
          'Сайт не устанавливает файлы cookie и ничего не записывает в локальное или сессионное хранилище. Баннера согласия нет, потому что соглашаться не с чем.',
          'Язык определяется по адресу страницы (/en или /ru) и по языковым настройкам, которые передаёт ваш браузер. Эти настройки не сохраняются и не записываются.',
        ],
      },
      {
        heading: 'Форма запроса на фрахт',
        body: [
          'Форма на странице контактов ничего не отправляет нам через интернет. Она собирает введённое вами в письмо и передаёт его вашей почтовой программе, где вы можете прочитать, изменить или удалить его до отправки.',
          'Ничто из введённого не попадает к нам, пока вы сами не отправите письмо. Поскольку отправляет его ваша почтовая программа, копия остаётся в ваших отправленных.',
        ],
      },
      {
        heading: 'Когда вы связываетесь с нами',
        body: [
          'Если вы пишете нам на почту, в WhatsApp или звоните, мы получаем то, что вы отправляете: ваше имя и контактные данные, а также сведения о судне, сроках и объёме работ.',
          'Мы используем эти данные, чтобы ответить на запрос и организовать работы. Мы не продаём их и не используем для рассылок, если вы сами об этом не попросите.',
        ],
      },
      {
        heading: 'Хостинг и серверные записи',
        body: [
          'Как и любой сайт, этот размещён у хостинг-провайдера, серверы которого ведут кратковременные технические записи о запросах — обычно IP-адрес, запрошенную страницу и время. Они нужны для работы и защиты сервиса, а не для идентификации посетителей.',
        ],
      },
      {
        heading: 'Ссылки на другие сервисы',
        body: [
          'Ссылки WhatsApp открывают переписку в WhatsApp — сервисе отдельной компании с собственными условиями конфиденциальности. Переход по ссылке — ваше решение; сайт не передаёт при этом никаких сведений о вас.',
        ],
      },
      {
        heading: 'Хранение и удаление информации',
        body: [
          'Переписка по запросу или фрахту хранится, пока это коммерчески или юридически необходимо, и удаляется, когда необходимость отпадает.',
          'Если вы хотите узнать, какая переписка о вас у нас хранится, или попросить её удалить — напишите нам, и мы этим займёмся.',
        ],
      },
      {
        heading: 'Изменения этой страницы',
        body: [
          'Если работа сайта изменится — например, появится аналитика или форма с отправкой на сервер — эта страница будет обновлена, а дата выше изменится вместе с ней.',
        ],
      },
    ],
  },
}

export const terms: Record<'en' | 'ru', LegalDoc> = {
  en: {
    title: 'Terms of use',
    updatedLabel: 'Last updated',
    intro:
      'These terms cover the use of this website and the information published on it. They do not govern a charter or any service we perform for you — those are set out in a separate written agreement.',
    sections: [
      {
        heading: 'What this website is',
        body: [
          'This site describes our fleet and services so that you can assess whether they suit your operation and get in touch. It is published for information.',
          'Nothing here is an offer, a quotation or a commitment to make a vessel available. A charter exists only once it is agreed in writing between us.',
        ],
      },
      {
        heading: 'Vessel specifications',
        body: [
          'Specifications are taken from our own vessel specification sheets. As those sheets state, the information is for guidance only and may be subject to change.',
          'Vessels are modified, re-certified and re-equipped over their lives, and figures here may lag the vessel as it stands today. Where a detail matters to your operation, confirm it with us in writing before you rely on it.',
          'A small number of specification sheets are not currently published. Where a vessel shows no sheet, ask us and we will send the current one.',
        ],
      },
      {
        heading: 'Availability',
        body: [
          'Charter availability shown on this site is indicative and changes as vessels are fixed, extended or released. Dates are our current expectation, not a reservation.',
          'Availability for a specific window is confirmed by the regional desk for the region concerned.',
        ],
      },
      {
        heading: 'Ownership of content',
        body: [
          'The text, photographs, vessel specification sheets and design of this site belong to us or are used with permission, and are protected by copyright.',
          'You may read, print and share pages for your own assessment of our services. Republishing the content, or using our photographs or specification sheets commercially, needs our written permission.',
          'Specification sheets may contain material belonging to shipyards and classification societies. That material stays theirs, and their own restrictions apply to it.',
        ],
      },
      {
        heading: 'Links to other services',
        body: [
          'This site links to WhatsApp for enquiries. Those services are run by other companies under their own terms, and we are not responsible for how they operate.',
        ],
      },
      {
        heading: 'Accuracy and liability',
        body: [
          'We take care to keep this site accurate and current, but we do not warrant that every figure is complete or free of error, or that the site is always available.',
          'Commercial and operational decisions should rest on written confirmation from us, not on these pages. To the extent the law allows, we are not liable for loss arising from reliance on the website alone.',
        ],
      },
      {
        heading: 'Contacting us',
        body: [
          'Questions about these terms, or about anything published here, can go to our head office in Ashgabat or to the regional desk for your region. Contact details are on the contact page.',
        ],
      },
    ],
  },
  ru: {
    title: 'Условия использования',
    updatedLabel: 'Последнее обновление',
    intro:
      'Эти условия касаются использования сайта и опубликованной на нём информации. Они не регулируют фрахт или оказываемые нами услуги — они определяются отдельным письменным договором.',
    sections: [
      {
        heading: 'Назначение сайта',
        body: [
          'Сайт описывает наш флот и услуги, чтобы вы могли оценить их пригодность для ваших операций и связаться с нами. Он носит информационный характер.',
          'Ничто на сайте не является офертой, коммерческим предложением или обязательством предоставить судно. Фрахт возникает только после письменного согласования между сторонами.',
        ],
      },
      {
        heading: 'Спецификации судов',
        body: [
          'Характеристики взяты из наших спецификаций судов. Как указано в самих спецификациях, информация носит справочный характер и может изменяться.',
          'Суда модернизируются, переосвидетельствуются и переоснащаются, поэтому приведённые данные могут отставать от текущего состояния судна. Если параметр важен для ваших операций, подтвердите его у нас письменно.',
          'Часть спецификаций сейчас не опубликована. Если у судна нет спецификации, запросите её — мы направим актуальную версию.',
        ],
      },
      {
        heading: 'Доступность судов',
        body: [
          'Указанная на сайте доступность носит ориентировочный характер и меняется по мере фрахтования, продления или высвобождения судов. Даты отражают наши текущие ожидания и не являются бронированием.',
          'Доступность на конкретный период подтверждает региональный отдел соответствующего региона.',
        ],
      },
      {
        heading: 'Права на содержание',
        body: [
          'Тексты, фотографии, спецификации судов и дизайн сайта принадлежат нам или используются с разрешения и защищены авторским правом.',
          'Вы можете читать, печатать и пересылать страницы для оценки наших услуг. Републикация содержания, а также коммерческое использование наших фотографий или спецификаций требуют нашего письменного разрешения.',
          'Спецификации могут содержать материалы верфей и классификационных обществ. Эти материалы остаются их собственностью, и на них распространяются их собственные ограничения.',
        ],
      },
      {
        heading: 'Ссылки на другие сервисы',
        body: [
          'Сайт содержит ссылки на WhatsApp для обращений. Эти сервисы принадлежат другим компаниям и работают на своих условиях; мы не отвечаем за их работу.',
        ],
      },
      {
        heading: 'Точность и ответственность',
        body: [
          'Мы стремимся поддерживать сайт точным и актуальным, но не гарантируем полноту или безошибочность каждого показателя, а также постоянную доступность сайта.',
          'Коммерческие и операционные решения следует принимать на основании нашего письменного подтверждения, а не этих страниц. В пределах, допускаемых законом, мы не несём ответственности за убытки, возникшие из-за опоры только на сайт.',
        ],
      },
      {
        heading: 'Связь с нами',
        body: [
          'Вопросы по этим условиям или по опубликованным материалам направляйте в головной офис в Ашхабаде или в региональный отдел вашего региона. Контакты указаны на странице контактов.',
        ],
      },
    ],
  },
}
