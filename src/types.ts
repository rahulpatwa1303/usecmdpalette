import type { HTMLAttributes, InputHTMLAttributes, RefCallback } from 'react'

export interface CommandItem {
  id: string
  label: string
  keywords?: string[]
  group?: string
  disabled?: boolean
  children?: CommandItem[]
  [key: string]: unknown
}

export interface GroupedItems {
  group: string | undefined
  items: CommandItem[]
}

export interface UseCommandPaletteOptions {
  items: CommandItem[]
  onSelect: (item: CommandItem) => void
  filterFn?: (items: CommandItem[], query: string) => CommandItem[] | Promise<CommandItem[]>
  defaultOpen?: boolean
  /** Pass a value to enable controlled mode; omit for uncontrolled */
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  hotkey?: string | string[]
  closeOnSelect?: boolean
  animationDuration?: number
  recent?: {
    enabled: boolean
    max?: number
    storageKey?: string
  }
}

export interface ContainerProps {
  role: 'dialog'
  'aria-modal': true
  'aria-label': string
}

export interface ListProps {
  role: 'listbox'
  id: string
}

export interface ItemProps {
  role: 'option'
  'aria-selected': boolean
  'aria-disabled': boolean
  onClick: () => void
  onMouseEnter: () => void
  id: string
}

export type InputPropsOverrides = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange' | 'onKeyDown' | 'role' | 'autoComplete' | 'aria-expanded' | 'aria-controls' | 'aria-activedescendant'
>

export interface InputProps extends InputPropsOverrides {
  ref: RefCallback<HTMLInputElement>
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  role: 'combobox'
  'aria-expanded': boolean
  'aria-controls': string
  'aria-activedescendant': string | undefined
  autoComplete: 'off'
}

export type AnimationState = 'entering' | 'entered' | 'exiting' | 'exited'

export interface AnnouncerProps {
  'aria-live': 'polite'
  'aria-atomic': true
  style: React.CSSProperties
}

export interface UseCommandPaletteReturn {
  // State
  isOpen: boolean
  query: string
  highlightedIndex: number
  filteredItems: CommandItem[]
  groupedItems: GroupedItems[]
  isLoading: boolean

  // Animation
  isMounted: boolean
  animationState: AnimationState

  // Recent
  recentItems: CommandItem[]

  // Pages
  currentPage: CommandItem | null
  breadcrumb: CommandItem[]
  canGoBack: boolean

  // Aria announcements
  announcement: string

  // Actions
  open: () => void
  close: () => void
  toggle: () => void
  setQuery: (query: string) => void
  selectItem: (item: CommandItem) => void
  highlightIndex: (index: number) => void
  goToPage: (item: CommandItem) => void
  goBack: () => void

  // Prop getters
  getContainerProps: () => ContainerProps
  getListProps: () => ListProps
  getItemProps: (args: { index: number; item: CommandItem }) => ItemProps
  getInputProps: (overrides?: InputPropsOverrides) => InputProps
  getAnnouncerProps: () => AnnouncerProps
}
