import type { ReactNode } from 'react'

/** Fades content up as it scrolls into view.
 *
 * Purely CSS — see the `.reveal` rule in globals.css. There is no client
 * component and no IntersectionObserver, so content cannot be left invisible
 * by a JS failure; browsers without scroll-driven animation simply show it.
 */
export function Reveal({
  children,
  className = '',
  as: Tag = 'div',
}: {
  children: ReactNode
  className?: string
  as?: 'div' | 'li' | 'section' | 'article'
}) {
  return <Tag className={`reveal ${className}`}>{children}</Tag>
}
