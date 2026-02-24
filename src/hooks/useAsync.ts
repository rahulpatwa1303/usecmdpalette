import { useState, useEffect, useRef } from 'react'
import type { CommandItem } from '../types'

export function useAsync(
  items: CommandItem[],
  query: string,
  filterFn: (items: CommandItem[], query: string) => CommandItem[] | Promise<CommandItem[]>,
): { result: CommandItem[]; isLoading: boolean } {
  const [result, setResult] = useState<CommandItem[]>(() => {
    // Try to resolve synchronously on init
    const r = filterFn(items, query)
    return r instanceof Promise ? items : r
  })
  const [isLoading, setIsLoading] = useState(false)
  const cancelRef = useRef(false)

  useEffect(() => {
    cancelRef.current = false
    const r = filterFn(items, query)

    if (!(r instanceof Promise)) {
      // Sync result — apply immediately, no loading flash
      setResult(r)
      setIsLoading(false)
      return
    }

    // Async result
    setIsLoading(true)
    r.then((resolved) => {
      if (!cancelRef.current) {
        setResult(resolved)
        setIsLoading(false)
      }
    }).catch(() => {
      if (!cancelRef.current) {
        setIsLoading(false)
      }
    })

    return () => {
      cancelRef.current = true
    }
  }, [items, query, filterFn])

  return { result, isLoading }
}
