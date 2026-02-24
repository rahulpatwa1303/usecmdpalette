import { useState, useCallback } from 'react'
import type { CommandItem } from '../types'

interface PageEntry {
  item: CommandItem
  items: CommandItem[]
}

export function usePages(rootItems: CommandItem[]) {
  const [stack, setStack] = useState<PageEntry[]>([])

  const currentPage: CommandItem | null = stack.length > 0 ? stack[stack.length - 1].item : null
  const currentItems: CommandItem[] =
    stack.length > 0 ? stack[stack.length - 1].items : rootItems
  const breadcrumb: CommandItem[] = stack.map((e) => e.item)
  const canGoBack = stack.length > 0

  const goToPage = useCallback((item: CommandItem) => {
    const children = item.children as CommandItem[] | undefined
    if (!children?.length) return
    setStack((prev) => [...prev, { item, items: children }])
  }, [])

  const goBack = useCallback(() => {
    setStack((prev) => prev.slice(0, -1))
  }, [])

  const resetPages = useCallback(() => {
    setStack([])
  }, [])

  return {
    currentPage,
    currentItems,
    breadcrumb,
    canGoBack,
    goToPage,
    goBack,
    resetPages,
  }
}
