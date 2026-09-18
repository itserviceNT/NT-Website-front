import Link from 'next/link'

import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionary'
import { legalUpdated, type LegalDoc } from '@/lib/legal'
import { contact } from '@/lib/site'

export function LegalPage({
  doc,
  locale,
  t,
}: {
  doc: LegalDoc
  locale: Locale
  t: Dictionary
}) {
  return (
    <div className="shell py-14 sm:py-20 xl:py-24">
      <header className="max-w-2xl">
        <p className="label flex items-center gap-3 text-signal-600">
          <span className="h-px w-8 bg-signal-500" />
          {t.company.name}
        </p>
        <h1 className="mt-4 font-display text-[clamp(2rem,5vw,3.9rem)] font-semibold leading-[1.02] tracking-tight text-ink-950">
          {doc.title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-steel-500">{doc.intro}</p>
        <p className="data mt-5 text-sm text-steel-500">
          {doc.updatedLabel}: {legalUpdated}
        </p>
      </header>

      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:gap-16">
        <nav aria-label={doc.title} className="lg:sticky lg:top-24 lg:self-start">
          <ol className="flex flex-wrap gap-x-4 gap-y-2 lg:flex-col lg:gap-2">
            {doc.sections.map((section, i) => (
              <li key={section.heading}>
                <a
                  href={`#s${i + 1}`}
                  className="label text-steel-500 transition-colors hover:text-signal-600"
                >
                  {section.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="max-w-2xl space-y-10">
          {doc.sections.map((section, i) => (
            <section key={section.heading} id={`s${i + 1}`} className="scroll-mt-24">
              <h2 className="font-display text-xl font-semibold tracking-tight text-ink-950 sm:text-2xl">
                {section.heading}
              </h2>
              <div className="mt-3 space-y-3 leading-relaxed text-steel-500">
                {section.body.map((paragraph) => (
                  <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}

          <div className="rounded-sm border border-haze-200 bg-haze-50 p-5">
            <p className="text-sm leading-relaxed text-steel-500">
              {t.legal.contactNote}
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <a
                href={`mailto:${contact.email}`}
                className="data text-sm text-ink-800 underline underline-offset-4 transition-colors hover:text-signal-600"
              >
                {contact.email}
              </a>
              <Link
                href={`/${locale}/contact`}
                className="data text-sm text-ink-800 underline underline-offset-4 transition-colors hover:text-signal-600"
              >
                {t.nav.contact}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
