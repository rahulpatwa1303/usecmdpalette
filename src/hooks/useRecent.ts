import { useState, useCallback } from 'react'
import type { CommandItem } from '../types'

interface RecentOptions {
  enabled: boolean
  max?: number
  storageKey?: string
}

function readFromStorage(storageKey: string): CommandItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(storageKey)
    return raw ? (JSON.parse(raw) as CommandItem[]) : []
  } catch {
    return []
  }
}

function writeToStorage(storageKey: string, items: CommandItem[]): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(items))
  } catch {
    // ignore write errors
  }
}

export function useRecent(options: RecentOptions | undefined): {
  recentItems: CommandItem[]
  addRecent: (item: CommandItem) => void
} {
  const enabled = options?.enabled ?? false
  const max = options?.max ?? 5
  const storageKey = options?.storageKey ?? 'use-cmd-palette-recent'

  const [recentItems, setRecentItems] = useState<CommandItem[]>(() =>
    enabled ? readFromStorage(storageKey) : [],
  )

  const addRecent = useCallback(
    (item: CommandItem) => {
      if (!enabled) return
      setRecentItems((prev) => {
        const deduped = [item, ...prev.filter((i) => i.id !== item.id)].slice(0, max)
        writeToStorage(storageKey, deduped)
        return deduped
      })
    },
    [enabled, max, storageKey],
  )

  return { recentItems, addRecent }
}
