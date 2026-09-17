'use client'

import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'

import type { GalleryCategory, GalleryImage } from '@/lib/gallery'

export function GalleryGrid({
  images,
  categories,
  labels,
  allLabel,
  closeLabel,
}: {
  images: (GalleryImage & { caption: string })[]
  categories: GalleryCategory[]
  labels: Record<string, string>
  allLabel: string
  closeLabel: string
}) {
  const [filter, setFilter] = useState<GalleryCategory | 'all'>('all')
  const [open, setOpen] = useState<number | null>(null)

  const shown = images.filter((i) => filter === 'all' || i.category === filter)

  const step = useCallback(
    (delta: number) => {
      setOpen((current) =>
        current === null
          ? null
          : (current + delta + shown.length) % shown.length,
      )
    },
    [shown.length],
  )

  useEffect(() => {
    if (open === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null)
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    document.addEventListener('keydown', onKey)
    // Stop the page scrolling behind the lightbox.
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [open, step])

  const active = open === null ? null : shown[open]

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {(['all', ...categories] as const).map((key) => {
          const selected = filter === key
          return (
            <button
              key={key}
              type="button"
              onClick={() => {
                setFilter(key as GalleryCategory | 'all')
                setOpen(null)
              }}
              className={`label rounded-sm px-3 py-2 transition-colors ${
                selected
                  ? 'bg-ink-900 text-white'
                  : 'bg-haze-100 text-steel-500 hover:bg-haze-200 hover:text-ink-800'
              }`}
            >
              {key === 'all' ? allLabel : labels[key]}
            </button>
          )
        })}
      </div>

      <div className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
        {shown.map((image, i) => (
          <button
            key={image.slug}
            type="button"
            onClick={() => setOpen(i)}
            style={{ animationDelay: `${Math.min(i, 9) * 55}ms` }}
            className="reveal group relative block w-full break-inside-avoid overflow-hidden rounded-sm bg-ink-800 text-left"
            data-shown="true"
          >
            <Image
              src={image.src}
              alt={image.caption}
              width={image.width}
              height={image.height}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="h-auto w-full transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <span className="absolute inset-x-0 bottom-0 translate-y-2 p-4 text-sm leading-snug text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              {image.caption}
            </span>
          </button>
        ))}
      </div>

      {active ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.caption}
          className="fixed inset-0 z-[100] flex flex-col bg-ink-950/95 backdrop-blur-sm"
          style={{ animation: 'fade 0.25s ease-out' }}
          onClick={() => setOpen(null)}
        >
          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
            <span className="label text-steel-400">
              {open! + 1} / {shown.length}
            </span>
            <button
              type="button"
              onClick={() => setOpen(null)}
              className="label rounded-sm border border-white/20 px-3 py-2 text-white transition-colors hover:bg-white/10"
            >
              {closeLabel}
            </button>
          </div>

          <div
            className="relative flex flex-1 items-center justify-center px-4 pb-4 sm:px-16"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Previous"
              onClick={() => step(-1)}
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-sm border border-white/20 px-3 py-4 text-white transition-colors hover:bg-white/10 sm:left-4"
            >
              ←
            </button>
            <Image
              key={active.slug}
              src={active.src}
              alt={active.caption}
              width={active.width}
              height={active.height}
              sizes="100vw"
              className="max-h-[78svh] w-auto rounded-sm object-contain"
              style={{ animation: 'fade 0.4s var(--ease-out-quint)' }}
            />
            <button
              type="button"
              aria-label="Next"
              onClick={() => step(1)}
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-sm border border-white/20 px-3 py-4 text-white transition-colors hover:bg-white/10 sm:right-4"
            >
              →
            </button>
          </div>

          <p className="px-4 pb-8 text-center text-sm text-haze-200 sm:px-6">
            {active.caption}
          </p>
        </div>
      ) : null}
    </div>
  )
}
