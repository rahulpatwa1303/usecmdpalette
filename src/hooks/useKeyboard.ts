import { useEffect, useCallback, useRef } from 'react'
import type React from 'react'
import type { CommandItem } from '../types'
import { matchesHotkey } from '../utils'

interface UseKeyboardOptions {
  isOpen: boolean
  filteredItems: CommandItem[]
  highlightedIndex: number
  hotkey: string | string[]
  onOpen: () => void
  onClose: () => void
  onHighlight: (index: number) => void
  onSelect: (item: CommandItem) => void
}

export function useKeyboard({
  isOpen,
  filteredItems,
  highlightedIndex,
  hotkey,
  onOpen,
  onClose,
  onHighlight,
  onSelect,
}: UseKeyboardOptions) {
  // Use refs to avoid stale closures in the global listener
  const isOpenRef = useRef(isOpen)
  isOpenRef.current = isOpen

  const onOpenRef = useRef(onOpen)
  onOpenRef.current = onOpen

  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  // Normalise hotkey to array once
  const hotkeys = Array.isArray(hotkey) ? hotkey : [hotkey]

  // Global hotkey listener — registered once, reads via refs
  useEffect(() => {
    if (typeof document === 'undefined') return

    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      const matched = hotkeys.some((hk) => matchesHotkey(event, hk))
      if (matched) {
        event.preventDefault()
        if (isOpenRef.current) {
          onCloseRef.current()
        } else {
          onOpenRef.current()
        }
      }
    }

    document.addEventListener('keydown', handleGlobalKeyDown)
    return () => document.removeEventListener('keydown', handleGlobalKeyDown)
    // Re-register only when the hotkey configuration changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(hotkeys)])

  // Input keydown handler — recreated when nav state changes
  const handleInputKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      const count = filteredItems.length

      switch (event.key) {
        case 'ArrowDown': {
          event.preventDefault()
          if (count === 0) break
          const next = highlightedIndex < count - 1 ? highlightedIndex + 1 : 0
          onHighlight(next)
          break
        }

        case 'ArrowUp': {
          event.preventDefault()
          if (count === 0) break
          const prev = highlightedIndex > 0 ? highlightedIndex - 1 : count - 1
          onHighlight(prev)
          break
        }

        case 'Tab': {
          event.preventDefault()
          if (count === 0) break
          if (event.shiftKey) {
            const prev = highlightedIndex > 0 ? highlightedIndex - 1 : count - 1
            onHighlight(prev)
          } else {
            const next = highlightedIndex < count - 1 ? highlightedIndex + 1 : 0
            onHighlight(next)
          }
          break
        }

        case 'Enter': {
          event.preventDefault()
          const item = filteredItems[highlightedIndex]
          if (item && !item.disabled) {
            onSelect(item)
          }
          break
        }

        case 'Escape': {
          event.preventDefault()
          onClose()
          break
        }
      }
    },
    [filteredItems, highlightedIndex, onHighlight, onSelect, onClose],
  )

  return { handleInputKeyDown }
}
