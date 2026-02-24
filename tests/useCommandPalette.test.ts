import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCommandPalette } from '../src'
import type { CommandItem } from '../src'

const items: CommandItem[] = [
  { id: '1', label: 'Alpha', group: 'A' },
  { id: '2', label: 'Beta', group: 'A' },
  { id: '3', label: 'Gamma', group: 'B' },
  { id: '4', label: 'Delta', disabled: true },
]

function makeHook(overrides: Partial<Parameters<typeof useCommandPalette>[0]> = {}) {
  const onSelect = vi.fn()
  return renderHook(() =>
    useCommandPalette({ items, onSelect, ...overrides }),
  )
}

describe('useCommandPalette — open/close/toggle', () => {
  it('starts closed by default', () => {
    const { result } = makeHook()
    expect(result.current.isOpen).toBe(false)
  })

  it('defaultOpen: true starts open', () => {
    const { result } = makeHook({ defaultOpen: true })
    expect(result.current.isOpen).toBe(true)
  })

  it('open() sets isOpen to true', () => {
    const { result } = makeHook()
    act(() => result.current.open())
    expect(result.current.isOpen).toBe(true)
  })

  it('close() sets isOpen to false', () => {
    const { result } = makeHook()
    act(() => result.current.open())
    act(() => result.current.close())
    expect(result.current.isOpen).toBe(false)
  })

  it('toggle() flips isOpen from false to true', () => {
    const { result } = makeHook()
    act(() => result.current.toggle())
    expect(result.current.isOpen).toBe(true)
  })

  it('toggle() flips isOpen from true to false', () => {
    const { result } = makeHook()
    act(() => result.current.toggle())
    act(() => result.current.toggle())
    expect(result.current.isOpen).toBe(false)
  })
})

describe('useCommandPalette — query and filtering', () => {
  it('starts with empty query', () => {
    const { result } = makeHook()
    expect(result.current.query).toBe('')
  })

  it('setQuery() updates query', () => {
    const { result } = makeHook()
    act(() => result.current.setQuery('alpha'))
    expect(result.current.query).toBe('alpha')
  })

  it('setQuery() re-filters filteredItems', () => {
    const { result } = makeHook()
    act(() => result.current.setQuery('alpha'))
    expect(result.current.filteredItems).toHaveLength(1)
    expect(result.current.filteredItems[0].id).toBe('1')
  })

  it('empty query returns all items', () => {
    const { result } = makeHook()
    act(() => result.current.setQuery('alpha'))
    act(() => result.current.setQuery(''))
    expect(result.current.filteredItems).toHaveLength(items.length)
  })

  it('setQuery() resets highlightedIndex to 0', () => {
    const { result } = makeHook()
    act(() => result.current.highlightIndex(2))
    act(() => result.current.setQuery('beta'))
    expect(result.current.highlightedIndex).toBe(0)
  })

  it('close() clears the query', () => {
    const { result } = makeHook()
    act(() => result.current.setQuery('alpha'))
    act(() => result.current.close())
    expect(result.current.query).toBe('')
  })
})

describe('useCommandPalette — highlightedIndex', () => {
  it('starts at 0', () => {
    const { result } = makeHook()
    expect(result.current.highlightedIndex).toBe(0)
  })

  it('highlightIndex() updates highlightedIndex', () => {
    const { result } = makeHook()
    act(() => result.current.highlightIndex(2))
    expect(result.current.highlightedIndex).toBe(2)
  })

  it('close() resets highlightedIndex to 0', () => {
    const { result } = makeHook()
    act(() => result.current.highlightIndex(2))
    act(() => result.current.close())
    expect(result.current.highlightedIndex).toBe(0)
  })
})

describe('useCommandPalette — selectItem', () => {
  beforeEach(() => vi.clearAllMocks())

  it('selectItem() calls onSelect with the item', () => {
    const onSelect = vi.fn()
    const { result } = renderHook(() => useCommandPalette({ items, onSelect }))
    act(() => result.current.open())
    act(() => result.current.selectItem(items[0]))
    expect(onSelect).toHaveBeenCalledWith(items[0])
  })

  it('selectItem() closes the palette when closeOnSelect is true (default)', () => {
    const { result } = makeHook()
    act(() => result.current.open())
    act(() => result.current.selectItem(items[0]))
    expect(result.current.isOpen).toBe(false)
  })

  it('selectItem() does NOT close when closeOnSelect is false', () => {
    const { result } = makeHook({ closeOnSelect: false })
    act(() => result.current.open())
    act(() => result.current.selectItem(items[0]))
    expect(result.current.isOpen).toBe(true)
  })

  it('disabled items cannot be selected', () => {
    const onSelect = vi.fn()
    const { result } = renderHook(() => useCommandPalette({ items, onSelect }))
    const disabled = items.find((i) => i.disabled)!
    act(() => result.current.selectItem(disabled))
    expect(onSelect).not.toHaveBeenCalled()
  })
})

describe('useCommandPalette — groupedItems', () => {
  it('exposes groupedItems derived from filteredItems', () => {
    const { result } = makeHook()
    const groups = result.current.groupedItems
    const groupA = groups.find((g) => g.group === 'A')
    const groupB = groups.find((g) => g.group === 'B')
    expect(groupA?.items).toHaveLength(2)
    expect(groupB?.items).toHaveLength(1)
  })

  it('groupedItems updates when filteredItems changes', () => {
    const { result } = makeHook()
    act(() => result.current.setQuery('alpha'))
    const groups = result.current.groupedItems
    expect(groups).toHaveLength(1)
    expect(groups[0].group).toBe('A')
    expect(groups[0].items).toHaveLength(1)
  })
})

describe('useCommandPalette — prop getters', () => {
  it('getContainerProps returns correct role and aria attributes', () => {
    const { result } = makeHook()
    const props = result.current.getContainerProps()
    expect(props.role).toBe('dialog')
    expect(props['aria-modal']).toBe(true)
    expect(props['aria-label']).toBe('Command palette')
  })

  it('getListProps returns correct role and id', () => {
    const { result } = makeHook()
    const props = result.current.getListProps()
    expect(props.role).toBe('listbox')
    expect(props.id).toBeTruthy()
  })

  it('getItemProps returns correct role and aria attributes', () => {
    const { result } = makeHook()
    const item = items[0]
    const props = result.current.getItemProps({ index: 0, item })
    expect(props.role).toBe('option')
    expect(props['aria-selected']).toBe(true) // index 0 === highlightedIndex 0
    expect(props['aria-disabled']).toBe(false)
    expect(props.id).toBeTruthy()
  })

  it('getItemProps marks disabled item with aria-disabled', () => {
    const { result } = makeHook()
    const disabled = items[3] // Delta, disabled: true
    const props = result.current.getItemProps({ index: 3, item: disabled })
    expect(props['aria-disabled']).toBe(true)
  })

  it('getInputProps returns correct role and aria attributes', () => {
    const { result } = makeHook()
    const props = result.current.getInputProps()
    expect(props.role).toBe('combobox')
    expect(props.autoComplete).toBe('off')
    expect(props['aria-expanded']).toBe(false)
    expect(props['aria-controls']).toBeTruthy()
  })

  it('getInputProps merges consumer overrides', () => {
    const { result } = makeHook()
    const props = result.current.getInputProps({ placeholder: 'Search...' })
    expect(props.placeholder).toBe('Search...')
    // Our core props still present
    expect(props.role).toBe('combobox')
  })
})
