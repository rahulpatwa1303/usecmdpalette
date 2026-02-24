import { useRef, useCallback } from 'react'

export function useFocusTrap() {
  const previousFocusRef = useRef<Element | null>(null)

  const saveFocus = useCallback(() => {
    if (typeof document !== 'undefined') {
      previousFocusRef.current = document.activeElement
    }
  }, [])

  const restoreFocus = useCallback(() => {
    const el = previousFocusRef.current
    if (el && typeof (el as HTMLElement).focus === 'function') {
      ;(el as HTMLElement).focus()
    }
    previousFocusRef.current = null
  }, [])

  return { saveFocus, restoreFocus }
}
