import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { fireEvent } from '@testing-library/react'
import { useCommandPalette } from '../src'
import type { CommandItem } from '../src'

const items: CommandItem[] = [
  { id: '1', label: 'Alpha' },
  { id: '2', label: 'Beta' },
]

function makeHook(overrides: Partial<Parameters<typeof useCommandPalette>[0]> = {}) {
  const onSelect = vi.fn()
  return renderHook(() => useCommandPalette({ items, onSelect, ...overrides }))
}

// ── Controlled isOpen ─────────────────────────────────────────────────────────

describe('useCommandPalette — controlled isOpen', () => {
  it('uses controlled value when isOpen is provided', () => {
    const { result } = makeHook({ isOpen: true })
    expect(result.current.isOpen).toBe(true)
  })

  it('calls onOpenChange(false) when close() is called in controlled mode', () => {
    const onOpenChange = vi.fn()
    const { result } = makeHook({ isOpen: true, onOpenChange })
    act(() => result.current.close())
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('calls onOpenChange(true) when open() is called in controlled mode', () => {
    const onOpenChange = vi.fn()
    const { result } = makeHook({ isOpen: false, onOpenChange })
    act(() => result.current.open())
    expect(onOpenChange).toHaveBeenCalledWith(true)
  })

  it('internal state does not change in controlled mode', () => {
    const onOpenChange = vi.fn()
    const { result } = makeHook({ isOpen: false, onOpenChange })
    act(() => result.current.open())
    // isOpen stays false because the consumer didn't update the prop
    expect(result.current.isOpen).toBe(false)
  })
})

// ── isLoading ─────────────────────────────────────────────────────────────────

describe('useCommandPalette — isLoading', () => {
  it('isLoading is false by default (sync filterFn)', () => {
    const { result } = makeHook()
    expect(result.current.isLoading).toBe(false)
  })

  it('isLoading is false with async filterFn that resolves immediately', async () => {
    const asyncFilter = vi.fn(async (_items: CommandItem[], _q: string) => _items)
    const { result } = makeHook({ filterFn: asyncFilter })
    // After promise microtask queue flush, isLoading should settle to false
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0))
    })
    expect(result.current.isLoading).toBe(false)
  })
})

// ── Multiple hotkeys ──────────────────────────────────────────────────────────

describe('useCommandPalette — multiple hotkeys', () => {
  beforeEach(() => vi.clearAllMocks())

  it('accepts an array of hotkeys and opens on first match', () => {
    const { result } = makeHook({ hotkey: ['mod+k', 'mod+p'] })
    act(() => {
      fireEvent.keyDown(document, { key: 'p', ctrlKey: true })
    })
    expect(result.current.isOpen).toBe(true)
  })

  it('accepts a single string hotkey (backward compat)', () => {
    const { result } = makeHook({ hotkey: 'mod+k' })
    act(() => {
      fireEvent.keyDown(document, { key: 'k', ctrlKey: true })
    })
    expect(result.current.isOpen).toBe(true)
  })
})

// ── Aria announcements ────────────────────────────────────────────────────────

describe('useCommandPalette — announcements', () => {
  it('getAnnouncerProps returns aria-live=polite and aria-atomic=true', () => {
    const { result } = makeHook()
    const props = result.current.getAnnouncerProps()
    expect(props['aria-live']).toBe('polite')
    expect(props['aria-atomic']).toBe(true)
  })

  it('getAnnouncerProps returns a visually-hidden style', () => {
    const { result } = makeHook()
    const { style } = result.current.getAnnouncerProps()
    expect(style.position).toBe('absolute')
    expect(style.width).toBe('1px')
  })

  it('announcement is set when palette opens', () => {
    const { result } = makeHook()
    act(() => result.current.open())
    expect(result.current.announcement).toBe('Command palette open')
  })
})

// ── Animation state ───────────────────────────────────────────────────────────

describe('useCommandPalette — animation state (zero duration)', () => {
  it('isMounted equals isOpen when animationDuration=0', () => {
    const { result } = makeHook({ animationDuration: 0 })
    expect(result.current.isMounted).toBe(false)
    act(() => result.current.open())
    expect(result.current.isMounted).toBe(true)
    act(() => result.current.close())
    expect(result.current.isMounted).toBe(false)
  })

  it('animationState is entered/exited with zero duration', () => {
    const { result } = makeHook({ animationDuration: 0 })
    expect(result.current.animationState).toBe('exited')
    act(() => result.current.open())
    expect(result.current.animationState).toBe('entered')
  })
})

// ── Recent items ──────────────────────────────────────────────────────────────

describe('useCommandPalette — recent items', () => {
  beforeEach(() => localStorage.clear())

  it('recentItems is empty by default', () => {
    const { result } = makeHook()
    expect(result.current.recentItems).toHaveLength(0)
  })

  it('recentItems populated after selectItem when recent.enabled=true', () => {
    const { result } = makeHook({ recent: { enabled: true } })
    act(() => result.current.open())
    act(() => result.current.selectItem(items[0]))
    expect(result.current.recentItems[0].id).toBe('1')
  })
})
