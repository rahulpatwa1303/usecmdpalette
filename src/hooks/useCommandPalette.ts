import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import type { UseCommandPaletteOptions, UseCommandPaletteReturn, CommandItem, InputPropsOverrides, AnnouncerProps } from '../types'
import { useFilter } from './useFilter'
import { useKeyboard } from './useKeyboard'
import { useFocusTrap } from './useFocusTrap'
import { useAnimation } from './useAnimation'
import { useRecent } from './useRecent'
import { usePages } from './usePages'
import { groupItems } from '../utils'

const LIST_ID = 'cmd-palette-list'
const ITEM_ID_PREFIX = 'cmd-palette-item'

const ANNOUNCER_STYLE: React.CSSProperties = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0,0,0,0)',
  whiteSpace: 'nowrap',
  border: 0,
}

export function useCommandPalette({
  items,
  onSelect,
  filterFn,
  defaultOpen = false,
  isOpen: controlledIsOpen,
  onOpenChange,
  hotkey = 'mod+k',
  closeOnSelect = true,
  animationDuration = 0,
  recent,
}: UseCommandPaletteOptions): UseCommandPaletteReturn {
  const isControlled = controlledIsOpen !== undefined

  const [internalIsOpen, setInternalIsOpen] = useState(defaultOpen)
  const isOpen = isControlled ? controlledIsOpen! : internalIsOpen

  const [query, setQueryState] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const [announcement, setAnnouncement] = useState('')

  const inputRef = useRef<HTMLInputElement | null>(null)
  const prevIsOpenRef = useRef(isOpen)
  const { saveFocus, restoreFocus } = useFocusTrap()

  const { isMounted, animationState } = useAnimation(isOpen, animationDuration)
  const { recentItems, addRecent } = useRecent(recent)
  const pages = usePages(items)

  const { filteredItems, isLoading } = useFilter(pages.currentItems, query, filterFn)
  const groupedItems = useMemo(() => groupItems(filteredItems), [filteredItems])

  // Single point of truth for opening/closing (respects controlled mode)
  const setOpen = useCallback(
    (next: boolean) => {
      if (isControlled) {
        onOpenChange?.(next)
      } else {
        setInternalIsOpen(next)
      }
    },
    [isControlled, onOpenChange],
  )

  const close = useCallback(() => {
    setQueryState('')
    setHighlightedIndex(0)
    pages.resetPages()
    restoreFocus()
    setOpen(false)
  }, [restoreFocus, setOpen, pages])

  const open = useCallback(() => {
    saveFocus()
    setOpen(true)
  }, [saveFocus, setOpen])

  const toggle = useCallback(() => {
    if (isOpen) {
      close()
    } else {
      open()
    }
  }, [isOpen, open, close])

  const setQuery = useCallback((q: string) => {
    setQueryState(q)
    setHighlightedIndex(0)
  }, [])

  const { goToPage, goBack } = pages

  const selectItem = useCallback(
    (item: CommandItem) => {
      if (item.disabled) return

      // If item has children, navigate into the page instead of selecting
      if ((item.children as CommandItem[] | undefined)?.length) {
        goToPage(item)
        setQueryState('')
        setHighlightedIndex(0)
        return
      }

      addRecent(item)
      onSelect(item)
      if (closeOnSelect) {
        close()
      }
    },
    [onSelect, closeOnSelect, close, goToPage, addRecent],
  )

  const highlightIndex = useCallback((index: number) => {
    setHighlightedIndex(index)
  }, [])

  // Stable ref callback — attaches inputRef without causing re-renders
  const setInputRef = useCallback((node: HTMLInputElement | null) => {
    inputRef.current = node
  }, [])

  // Auto-focus the input when the palette opens
  useEffect(() => {
    const wasOpen = prevIsOpenRef.current
    prevIsOpenRef.current = isOpen
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
    if (!wasOpen && isOpen) {
      setAnnouncement('Command palette open')
    }
  }, [isOpen])

  // Announce filtered results count when filteredItems changes (only while already open)
  const prevFilteredRef = useRef(filteredItems)
  useEffect(() => {
    const changed = prevFilteredRef.current !== filteredItems
    prevFilteredRef.current = filteredItems
    if (!isOpen || !changed) return
    setAnnouncement(`${filteredItems.length} result${filteredItems.length === 1 ? '' : 's'}`)
  }, [filteredItems, isOpen])

  // Scroll the highlighted item into view when navigating with keyboard
  useEffect(() => {
    if (!isOpen || typeof document === 'undefined') return
    const item = filteredItems[highlightedIndex]
    if (!item) return
    const el = document.getElementById(`${ITEM_ID_PREFIX}-${item.id}`)
    el?.scrollIntoView?.({ block: 'nearest' })
  }, [highlightedIndex, filteredItems, isOpen])

  const { handleInputKeyDown } = useKeyboard({
    isOpen,
    filteredItems,
    highlightedIndex,
    hotkey,
    onOpen: open,
    onClose: close,
    onHighlight: highlightIndex,
    onSelect: selectItem,
  })

  const getContainerProps = useCallback(
    () => ({
      role: 'dialog' as const,
      'aria-modal': true as const,
      'aria-label': 'Command palette',
    }),
    [],
  )

  const getListProps = useCallback(
    () => ({
      role: 'listbox' as const,
      id: LIST_ID,
    }),
    [],
  )

  const getItemProps = useCallback(
    ({ index, item }: { index: number; item: CommandItem }) => ({
      role: 'option' as const,
      'aria-selected': index === highlightedIndex,
      'aria-disabled': item.disabled ?? false,
      id: `${ITEM_ID_PREFIX}-${item.id}`,
      onClick: () => {
        if (!item.disabled) selectItem(item)
      },
      onMouseEnter: () => {
        setHighlightedIndex(index)
      },
    }),
    [highlightedIndex, selectItem],
  )

  const getInputProps = useCallback(
    (overrides: InputPropsOverrides = {}) => {
      const { onChange: externalOnChange, onKeyDown: externalOnKeyDown, ...rest } = overrides as {
        onChange?: React.ChangeEventHandler<HTMLInputElement>
        onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>
        [key: string]: unknown
      }

      const activedescendant = filteredItems[highlightedIndex]
        ? `${ITEM_ID_PREFIX}-${filteredItems[highlightedIndex].id}`
        : undefined

      return {
        ...rest,
        ref: setInputRef,
        value: query,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          setQuery(e.target.value)
          externalOnChange?.(e)
        },
        onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
          handleInputKeyDown(e)
          externalOnKeyDown?.(e)
        },
        role: 'combobox' as const,
        'aria-expanded': isOpen,
        'aria-controls': LIST_ID,
        'aria-activedescendant': activedescendant,
        autoComplete: 'off' as const,
      }
    },
    [query, setQuery, handleInputKeyDown, isOpen, filteredItems, highlightedIndex, setInputRef],
  )

  const getAnnouncerProps = useCallback(
    (): AnnouncerProps => ({
      'aria-live': 'polite',
      'aria-atomic': true,
      style: ANNOUNCER_STYLE,
    }),
    [],
  )

  // Wrap selectItem to announce selection
  const selectItemWithAnnouncement = useCallback(
    (item: CommandItem) => {
      if (!item.disabled) {
        setAnnouncement(`${item.label} selected`)
      }
      selectItem(item)
    },
    [selectItem],
  )

  return {
    isOpen,
    query,
    highlightedIndex,
    filteredItems,
    groupedItems,
    isLoading,
    isMounted,
    animationState,
    recentItems,
    currentPage: pages.currentPage,
    breadcrumb: pages.breadcrumb,
    canGoBack: pages.canGoBack,
    announcement,
    open,
    close,
    toggle,
    setQuery,
    selectItem: selectItemWithAnnouncement,
    highlightIndex,
    goToPage,
    goBack,
    getContainerProps,
    getListProps,
    getItemProps,
    getInputProps,
    getAnnouncerProps,
  }
}
