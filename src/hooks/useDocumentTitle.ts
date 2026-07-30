import { useEffect } from 'react'

const DEFAULT_TITLE = 'Shunn Labs — Sense, decide, act: autonomous physical AI'

/**
 * Set the document title for the lifetime of a page.
 *
 * Every route needs this: React Router does not reset the title on
 * navigation, so a page that omits it silently inherits whatever the
 * previously-visited page set.
 */
export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ?? DEFAULT_TITLE
  }, [title])
}
