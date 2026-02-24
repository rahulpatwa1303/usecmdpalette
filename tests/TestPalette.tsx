import React from 'react'
import { vi } from 'vitest'
import { useCommandPalette } from '../src'
import type { CommandItem } from '../src'

export const defaultItems: CommandItem[] = [
  { id: '1', label: 'Alpha' },
  { id: '2', label: 'Beta' },
  { id: '3', label: 'Gamma' },
]

export function TestPalette({
  onSelect = vi.fn(),
  testItems = defaultItems,
}: {
  onSelect?: (item: CommandItem) => void
  testItems?: CommandItem[]
}) {
  const {
    isOpen,
    open,
    filteredItems,
    highlightedIndex,
    getInputProps,
    getListProps,
    getItemProps,
  } = useCommandPalette({ items: testItems, onSelect })

  return (
    <div>
      <button data-testid="open-btn" onClick={open}>
        Open
      </button>
      {isOpen && (
        <div>
          <input data-testid="input" {...getInputProps()} />
          <ul {...getListProps()}>
            {filteredItems.map((item, index) => (
              <li
                key={item.id}
                data-testid={`item-${index}`}
                data-highlighted={index === highlightedIndex ? 'true' : 'false'}
                {...getItemProps({ index, item })}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
