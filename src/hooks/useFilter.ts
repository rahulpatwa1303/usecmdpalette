import { useMemo, useCallback } from 'react'
import type { CommandItem } from '../types'
import { defaultFilter } from '../utils'
import { useAsync } from './useAsync'

export function useFilter(
  items: CommandItem[],
  query: string,
  filterFn?: (items: CommandItem[], query: string) => CommandItem[] | Promise<CommandItem[]>,
): { filteredItems: CommandItem[]; isLoading: boolean } {
  const stableFn = useMemo(() => filterFn ?? defaultFilter, [filterFn])
  // Wrap in useCallback so useAsync's effect dep is stable when filterFn is undefined
  const fn = useCallback(
    (i: CommandItem[], q: string) => stableFn(i, q),
    [stableFn],
  )
  const { result, isLoading } = useAsync(items, query, fn)
  return { filteredItems: result, isLoading }
}
