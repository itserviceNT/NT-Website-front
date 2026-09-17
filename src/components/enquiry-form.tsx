'use client'

import { useState } from 'react'

type Labels = {
  vesselType: string
  region: string
  dates: string
  scope: string
  company: string
  name: string
  send: string
  note: string
  any: string
}

/** Composes a structured charter enquiry and hands it to the visitor's mail
 *  client. No submission endpoint, so nothing can be silently dropped. */
export function EnquiryForm({
  email,
  labels,
  vesselTypes,
  regions,
}: {
  email: string
  labels: Labels
  vesselTypes: string[]
  regions: string[]
}) {
  const [vesselType, setVesselType] = useState('')
  const [region, setRegion] = useState('')
  const [dates, setDates] = useState('')
  const [scope, setScope] = useState('')
  const [company, setCompany] = useState('')
  const [name, setName] = useState('')

  const subject = `Charter enquiry${vesselType ? `: ${vesselType}` : ''}`
  const body = [
    `${labels.vesselType}: ${vesselType || '-'}`,
    `${labels.region}: ${region || '-'}`,
    `${labels.dates}: ${dates || '-'}`,
    '',
    `${labels.scope}:`,
    scope || '-',
    '',
    `${labels.company}: ${company || '-'}`,
    `${labels.name}: ${name || '-'}`,
  ].join('\n')

  const href = `mailto:${email}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`

  const field =
    'w-full rounded-sm border border-haze-200 bg-white px-3 py-2.5 text-sm text-ink-900 transition-colors focus:border-steel-400 focus:outline-none'

  return (
    <form
      className="rounded-sm border border-haze-200 bg-haze-50 p-5 sm:p-6"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="vessel-type" className="label block text-steel-500">
            {labels.vesselType}
          </label>
          <select
            id="vessel-type"
            value={vesselType}
            onChange={(e) => setVesselType(e.target.value)}
            className={`mt-2 ${field}`}
          >
            <option value="">{labels.any}</option>
            {vesselTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="enquiry-region" className="label block text-steel-500">
            {labels.region}
          </label>
          <select
            id="enquiry-region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className={`mt-2 ${field}`}
          >
            <option value="">{labels.any}</option>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="enquiry-dates" className="label block text-steel-500">
            {labels.dates}
          </label>
          <input
            id="enquiry-dates"
            value={dates}
            onChange={(e) => setDates(e.target.value)}
            className={`mt-2 ${field}`}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="enquiry-scope" className="label block text-steel-500">
            {labels.scope}
          </label>
          <textarea
            id="enquiry-scope"
            rows={4}
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            className={`mt-2 resize-y ${field}`}
          />
        </div>

        <div>
          <label htmlFor="enquiry-company" className="label block text-steel-500">
            {labels.company}
          </label>
          <input
            id="enquiry-company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className={`mt-2 ${field}`}
          />
        </div>

        <div>
          <label htmlFor="enquiry-name" className="label block text-steel-500">
            {labels.name}
          </label>
          <input
            id="enquiry-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`mt-2 ${field}`}
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <a
          href={href}
          className="rounded-sm bg-signal-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-signal-600"
        >
          {labels.send}
        </a>
        <p className="text-xs leading-relaxed text-steel-400">{labels.note}</p>
      </div>
    </form>
  )
}
