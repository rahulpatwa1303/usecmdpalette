import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCommandPalette } from '../src'
import type { CommandItem } from '../src'

const childA1: CommandItem = { id: 'a1', label: 'Sub A1' }
const childA2: CommandItem = { id: 'a2', label: 'Sub A2' }
const parentA: CommandItem = { id: 'a', label: 'Parent A', children: [childA1, childA2] }
const itemB: CommandItem = { id: 'b', label: 'Item B' }

const items: CommandItem[] = [parentA, itemB]

function makeHook(overrides: Partial<Parameters<typeof useCommandPalette>[0]> = {}) {
  const onSelect = vi.fn()
  return renderHook(() => useCommandPalette({ items, onSelect, ...overrides }))
}

describe('usePages — initial state', () => {
  it('currentPage is null at root', () => {
    const { result } = makeHook()
    expect(result.current.currentPage).toBeNull()
  })

  it('canGoBack is false at root', () => {
    const { result } = makeHook()
    expect(result.current.canGoBack).toBe(false)
  })

  it('breadcrumb is empty at root', () => {
    const { result } = makeHook()
    expect(result.current.breadcrumb).toHaveLength(0)
  })

  it('filteredItems shows root items at start', () => {
    const { result } = makeHook()
    expect(result.current.filteredItems).toHaveLength(items.length)
  })
})

describe('usePages — navigation', () => {
  it('goToPage pushes into children', () => {
    const { result } = makeHook()
    act(() => result.current.goToPage(parentA))
    expect(result.current.currentPage?.id).toBe('a')
    expect(result.current.canGoBack).toBe(true)
    expect(result.current.filteredItems.map((i) => i.id)).toEqual(['a1', 'a2'])
  })

  it('breadcrumb lists parent item', () => {
    const { result } = makeHook()
    act(() => result.current.goToPage(parentA))
    expect(result.current.breadcrumb).toHaveLength(1)
    expect(result.current.breadcrumb[0].id).toBe('a')
  })

  it('goBack returns to root', () => {
    const { result } = makeHook()
    act(() => result.current.goToPage(parentA))
    act(() => result.current.goBack())
    expect(result.current.currentPage).toBeNull()
    expect(result.current.canGoBack).toBe(false)
    expect(result.current.filteredItems).toHaveLength(items.length)
  })

  it('selectItem on item with children navigates instead of calling onSelect', () => {
    const onSelect = vi.fn()
    const { result } = renderHook(() => useCommandPalette({ items, onSelect }))
    act(() => result.current.selectItem(parentA))
    expect(onSelect).not.toHaveBeenCalled()
    expect(result.current.currentPage?.id).toBe('a')
  })

  it('selectItem on leaf item calls onSelect', () => {
    const onSelect = vi.fn()
    const { result } = renderHook(() => useCommandPalette({ items, onSelect }))
    act(() => result.current.selectItem(itemB))
    expect(onSelect).toHaveBeenCalledWith(itemB)
  })

  it('close() resets pages to root', () => {
    const { result } = makeHook()
    act(() => result.current.goToPage(parentA))
    expect(result.current.currentPage?.id).toBe('a')
    act(() => result.current.close())
    expect(result.current.currentPage).toBeNull()
  })
})
