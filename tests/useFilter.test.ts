import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useFilter } from '../src/hooks/useFilter'
import type { CommandItem } from '../src/types'

const items: CommandItem[] = [
  { id: '1', label: 'Open File', keywords: ['open', 'file'] },
  { id: '2', label: 'Save Document', keywords: ['save', 'doc'] },
  { id: '3', label: 'New Window' },
]

describe('useFilter', () => {
  it('returns all items when query is empty string', () => {
    const { result } = renderHook(() => useFilter(items, ''))
    expect(result.current.filteredItems).toEqual(items)
  })

  it('matches on label (case-insensitive)', () => {
    const { result } = renderHook(() => useFilter(items, 'OPEN'))
    expect(result.current.filteredItems).toHaveLength(1)
    expect(result.current.filteredItems[0].id).toBe('1')
  })

  it('matches on keywords', () => {
    const { result } = renderHook(() => useFilter(items, 'doc'))
    expect(result.current.filteredItems).toHaveLength(1)
    expect(result.current.filteredItems[0].id).toBe('2')
  })

  it('returns empty array when no match', () => {
    const { result } = renderHook(() => useFilter(items, 'xyz-no-match'))
    expect(result.current.filteredItems).toHaveLength(0)
  })

  it('custom filterFn overrides default behaviour', () => {
    const customFilter = vi.fn((_items: CommandItem[], _query: string) => [items[2]])
    const { result } = renderHook(() => useFilter(items, 'anything', customFilter))
    expect(customFilter).toHaveBeenCalledWith(items, 'anything')
    expect(result.current.filteredItems).toEqual([items[2]])
  })

  it('updates when query changes', () => {
    let query = 'open'
    const { result, rerender } = renderHook(() => useFilter(items, query))
    expect(result.current.filteredItems).toHaveLength(1)

    query = 'save'
    rerender()
    expect(result.current.filteredItems).toHaveLength(1)
    expect(result.current.filteredItems[0].id).toBe('2')
  })

  it('updates when items change', () => {
    let currentItems = items
    const { result, rerender } = renderHook(() => useFilter(currentItems, 'window'))
    expect(result.current.filteredItems).toHaveLength(1)

    currentItems = [...items, { id: '4', label: 'Second Window' }]
    rerender()
    expect(result.current.filteredItems).toHaveLength(2)
  })
})
