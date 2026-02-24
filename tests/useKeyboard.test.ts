import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { createElement } from 'react'
import { TestPalette, defaultItems } from './TestPalette'
import type { CommandItem } from '../src'

function openPalette() {
  fireEvent.click(screen.getByTestId('open-btn'))
}

function pressKey(key: string, opts: Record<string, unknown> = {}) {
  fireEvent.keyDown(screen.getByTestId('input'), { key, ...opts })
}

describe('useKeyboard — input navigation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('ArrowDown increments highlighted index', () => {
    render(createElement(TestPalette, {}))
    openPalette()
    expect(screen.getByTestId('item-0')).toHaveAttribute('data-highlighted', 'true')
    pressKey('ArrowDown')
    expect(screen.getByTestId('item-1')).toHaveAttribute('data-highlighted', 'true')
  })

  it('ArrowDown wraps from last to first', () => {
    render(createElement(TestPalette, {}))
    openPalette()
    pressKey('ArrowDown') // index 1
    pressKey('ArrowDown') // index 2
    pressKey('ArrowDown') // wraps to 0
    expect(screen.getByTestId('item-0')).toHaveAttribute('data-highlighted', 'true')
  })

  it('ArrowUp decrements highlighted index', () => {
    render(createElement(TestPalette, {}))
    openPalette()
    pressKey('ArrowDown') // go to 1
    pressKey('ArrowUp')   // back to 0
    expect(screen.getByTestId('item-0')).toHaveAttribute('data-highlighted', 'true')
  })

  it('ArrowUp wraps from first to last', () => {
    render(createElement(TestPalette, {}))
    openPalette()
    // highlightedIndex starts at 0
    pressKey('ArrowUp') // wraps to last (index 2)
    expect(screen.getByTestId('item-2')).toHaveAttribute('data-highlighted', 'true')
  })

  it('Tab moves highlight down (same as ArrowDown)', () => {
    render(createElement(TestPalette, {}))
    openPalette()
    pressKey('Tab')
    expect(screen.getByTestId('item-1')).toHaveAttribute('data-highlighted', 'true')
  })

  it('Shift+Tab moves highlight up (same as ArrowUp)', () => {
    render(createElement(TestPalette, {}))
    openPalette()
    pressKey('ArrowDown') // go to index 1
    pressKey('Tab', { shiftKey: true }) // back to 0
    expect(screen.getByTestId('item-0')).toHaveAttribute('data-highlighted', 'true')
  })

  it('Enter calls onSelect with highlighted item', () => {
    const onSelect = vi.fn()
    render(createElement(TestPalette, { onSelect }))
    openPalette()
    pressKey('ArrowDown') // highlight index 1 (Beta)
    pressKey('Enter')
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: '2', label: 'Beta' }),
    )
  })

  it('Escape closes the palette', () => {
    render(createElement(TestPalette, {}))
    openPalette()
    expect(screen.getByTestId('input')).toBeInTheDocument()
    pressKey('Escape')
    expect(screen.queryByTestId('input')).not.toBeInTheDocument()
  })
})

describe('useKeyboard — global hotkey (Mod+K)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('Mod+K opens the palette when closed', () => {
    render(createElement(TestPalette, {}))
    expect(screen.queryByTestId('input')).not.toBeInTheDocument()
    act(() => {
      fireEvent.keyDown(document, { key: 'k', ctrlKey: true })
    })
    expect(screen.getByTestId('input')).toBeInTheDocument()
  })

  it('Mod+K closes the palette when open', () => {
    render(createElement(TestPalette, {}))
    act(() => {
      fireEvent.keyDown(document, { key: 'k', ctrlKey: true })
    })
    expect(screen.getByTestId('input')).toBeInTheDocument()
    act(() => {
      fireEvent.keyDown(document, { key: 'k', ctrlKey: true })
    })
    expect(screen.queryByTestId('input')).not.toBeInTheDocument()
  })
})
