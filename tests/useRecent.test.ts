import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useRecent } from '../src/hooks/useRecent'
import type { CommandItem } from '../src/types'

const item1: CommandItem = { id: '1', label: 'Alpha' }
const item2: CommandItem = { id: '2', label: 'Beta' }
const item3: CommandItem = { id: '3', label: 'Gamma' }

beforeEach(() => {
  localStorage.clear()
})

describe('useRecent — disabled', () => {
  it('returns empty recentItems when disabled', () => {
    const { result } = renderHook(() => useRecent({ enabled: false }))
    expect(result.current.recentItems).toHaveLength(0)
  })

  it('addRecent does nothing when disabled', () => {
    const { result } = renderHook(() => useRecent({ enabled: false }))
    act(() => result.current.addRecent(item1))
    expect(result.current.recentItems).toHaveLength(0)
  })
})

describe('useRecent — enabled', () => {
  it('starts with empty list', () => {
    const { result } = renderHook(() => useRecent({ enabled: true }))
    expect(result.current.recentItems).toHaveLength(0)
  })

  it('addRecent prepends items', () => {
    const { result } = renderHook(() => useRecent({ enabled: true }))
    act(() => result.current.addRecent(item1))
    act(() => result.current.addRecent(item2))
    expect(result.current.recentItems[0].id).toBe('2')
    expect(result.current.recentItems[1].id).toBe('1')
  })

  it('deduplicates by id (moves to front)', () => {
    const { result } = renderHook(() => useRecent({ enabled: true }))
    act(() => result.current.addRecent(item1))
    act(() => result.current.addRecent(item2))
    act(() => result.current.addRecent(item1)) // duplicate
    expect(result.current.recentItems).toHaveLength(2)
    expect(result.current.recentItems[0].id).toBe('1')
  })

  it('trims to max (default 5)', () => {
    const { result } = renderHook(() => useRecent({ enabled: true }))
    const manyItems = Array.from({ length: 7 }, (_, i) => ({
      id: String(i),
      label: `Item ${i}`,
    }))
    act(() => {
      for (const item of manyItems) result.current.addRecent(item)
    })
    expect(result.current.recentItems).toHaveLength(5)
  })

  it('respects custom max', () => {
    const { result } = renderHook(() => useRecent({ enabled: true, max: 2 }))
    act(() => result.current.addRecent(item1))
    act(() => result.current.addRecent(item2))
    act(() => result.current.addRecent(item3))
    expect(result.current.recentItems).toHaveLength(2)
  })

  it('persists to localStorage', () => {
    const key = 'test-recent-persist'
    const { result } = renderHook(() => useRecent({ enabled: true, storageKey: key }))
    act(() => result.current.addRecent(item1))

    const stored = JSON.parse(localStorage.getItem(key) ?? '[]') as CommandItem[]
    expect(stored[0].id).toBe('1')
  })

  it('reads initial state from localStorage', () => {
    const key = 'test-recent-init'
    localStorage.setItem(key, JSON.stringify([item2]))
    const { result } = renderHook(() => useRecent({ enabled: true, storageKey: key }))
    expect(result.current.recentItems[0].id).toBe('2')
  })
})
