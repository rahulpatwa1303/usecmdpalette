# use-command-palette

[![npm version](https://img.shields.io/npm/v/use-command-palette)](https://www.npmjs.com/package/use-command-palette)
[![npm downloads](https://img.shields.io/npm/dm/use-command-palette)](https://www.npmjs.com/package/use-command-palette)
[![license](https://img.shields.io/npm/l/use-command-palette)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)](https://www.typescriptlang.org/)

**Headless React hook for command palettes. You bring the UI, we bring the logic.**

No component library. No Provider. No opinions about your CSS. Just a hook that returns state, actions, and ARIA-ready prop getters — and gets out of your way.

---

## Why use-command-palette?

| | cmdk | kbar | **use-command-palette** |
|---|---|---|---|
| Zero dependencies | ✗ | ✗ | **✓** |
| No Provider required | ✗ | ✗ | **✓** |
| No UI shipped | ✗ | ✗ | **✓** |
| Async filter support | ✗ | ✗ | **✓** |
| Nested commands (pages) | ✗ | ✗ | **✓** |
| Recent items built-in | ✗ | ✗ | **✓** |
| Animation state machine | ✗ | ✗ | **✓** |
| Testing utilities | ✗ | ✗ | **✓** |
| TypeScript strict | ✓ | partial | **✓** |
| SSR safe | partial | partial | **✓** |

---

## Live Demos

| Style | Description |
|-------|-------------|
| [Plain CSS demo](#) | CSS custom properties, dark mode, animations |
| [Tailwind demo](#) | Utility-first, dark/light, nested pages |
| [MUI demo](#) | Material-UI primitives, no custom CSS |
| [Minimal demo](#) | Inline styles only — shows the raw API |

---

## Installation

```bash
npm install use-command-palette
```

React 16.8+ is the only peer dependency.

---

## Quick Start

```tsx
import { useCommandPalette } from 'use-command-palette'

const commands = [
  { id: 'open',  label: 'Open File',   keywords: ['open'] },
  { id: 'save',  label: 'Save File',   keywords: ['save'] },
  { id: 'theme', label: 'Change Theme' },
]

export default function App() {
  const {
    isOpen, isMounted, open, close, announcement,
    filteredItems, highlightedIndex,
    getContainerProps, getInputProps, getListProps, getItemProps, getAnnouncerProps,
  } = useCommandPalette({
    items: commands,
    onSelect: (item) => console.log('selected:', item.label),
  })

  return (
    <>
      {/* Aria live announcer — visually hidden, required for screen readers */}
      <div {...getAnnouncerProps()}>{announcement}</div>

      <button onClick={open}>Open palette (Ctrl+K)</button>

      {isMounted && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)' }} onClick={close}>
          <div {...getContainerProps()} onClick={(e) => e.stopPropagation()}>
            <input {...getInputProps({ placeholder: 'Search commands…' })} />
            <ul {...getListProps()}>
              {filteredItems.map((item, index) => (
                <li
                  key={item.id}
                  {...getItemProps({ index, item })}
                  style={{ background: index === highlightedIndex ? '#e0e7ff' : 'transparent' }}
                >
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  )
}
```

---

## Full API Reference

### `useCommandPalette(options)`

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `items` | `CommandItem[]` | **required** | The full list of commands |
| `onSelect` | `(item: CommandItem) => void` | **required** | Called when the user picks an item |
| `filterFn` | `(items, query) => CommandItem[] \| Promise<CommandItem[]>` | built-in fuzzy | Override the default filter; sync or async |
| `defaultOpen` | `boolean` | `false` | Uncontrolled initial open state |
| `isOpen` | `boolean` | — | Controlled open state (omit for uncontrolled) |
| `onOpenChange` | `(open: boolean) => void` | — | Called in controlled mode when open state should change |
| `hotkey` | `string \| string[]` | `'mod+k'` | Global keyboard shortcut(s). `mod` = Cmd on Mac, Ctrl elsewhere |
| `closeOnSelect` | `boolean` | `true` | Whether selecting an item closes the palette |
| `animationDuration` | `number` | `0` | Duration in ms for enter/exit animation; 0 = instant |
| `recent` | `{ enabled: boolean; max?: number; storageKey?: string }` | — | Persist recently used items to localStorage |

#### Return value — State

| Property | Type | Description |
|----------|------|-------------|
| `isOpen` | `boolean` | Whether the palette is open |
| `query` | `string` | Current search query |
| `highlightedIndex` | `number` | Index of the highlighted item |
| `filteredItems` | `CommandItem[]` | Items matching the current query |
| `groupedItems` | `GroupedItems[]` | `filteredItems` grouped by their `group` field |
| `isLoading` | `boolean` | `true` while an async `filterFn` is in-flight |
| `isMounted` | `boolean` | `true` while the palette should be in the DOM (use instead of `isOpen` when `animationDuration > 0`) |
| `animationState` | `'entering' \| 'entered' \| 'exiting' \| 'exited'` | Current animation phase |
| `recentItems` | `CommandItem[]` | Recently selected items (requires `recent.enabled`) |
| `currentPage` | `CommandItem \| null` | Active nested page; null at root |
| `breadcrumb` | `CommandItem[]` | Ancestors of the current page |
| `canGoBack` | `boolean` | Whether the user can navigate back |
| `announcement` | `string` | Current screen-reader announcement text |

#### Return value — Actions

| Property | Type | Description |
|----------|------|-------------|
| `open` | `() => void` | Open the palette (saves focus) |
| `close` | `() => void` | Close the palette (restores focus, clears query) |
| `toggle` | `() => void` | Toggle open/closed |
| `setQuery` | `(q: string) => void` | Update the search query |
| `selectItem` | `(item: CommandItem) => void` | Programmatically select an item |
| `highlightIndex` | `(i: number) => void` | Move highlight to a specific index |
| `goToPage` | `(item: CommandItem) => void` | Navigate into an item's children |
| `goBack` | `() => void` | Navigate back to the parent page |

#### Return value — Prop getters

| Property | Description |
|----------|-------------|
| `getContainerProps()` | Spread onto your modal/dialog wrapper |
| `getInputProps(overrides?)` | Spread onto the search `<input>` |
| `getListProps()` | Spread onto the results `<ul>` |
| `getItemProps({ index, item })` | Spread onto each result `<li>` |
| `getAnnouncerProps()` | Spread onto a visually-hidden `<div>` for `aria-live` announcements |

---

## Features in depth

### Async filtering

`filterFn` can return a `Promise`. The hook sets `isLoading: true` while the promise is in-flight, cancels stale results when a new query arrives, and resolves to `isLoading: false` when done. Sync functions work exactly as before — no loading flash.

```tsx
useCommandPalette({
  items,
  onSelect,
  filterFn: async (items, query) => {
    const results = await searchAPI(query)
    return results
  },
})
```

---

### Animation state

Set `animationDuration` (in ms) to get a four-state machine: `entering → entered → exiting → exited`. Use `isMounted` to decide when to add the element to the DOM; use `animationState` to drive your CSS class names or inline styles.

```tsx
const { isMounted, animationState } = useCommandPalette({
  items, onSelect,
  animationDuration: 200,
})

// Render while mounted (includes exit phase)
{isMounted && (
  <div className={`palette ${animationState}`}>
    {/* CSS: .palette.entering { opacity: 0 }  .palette.entered { opacity: 1 } */}
  </div>
)}
```

When `animationDuration` is 0 (the default), `isMounted === isOpen` and `animationState` is always `'entered'` or `'exited'` — identical to the old behaviour.

---

### Recent items

Pass `recent: { enabled: true }` to persist recently selected items to `localStorage`. They are surfaced in `recentItems` and updated automatically on each selection.

```tsx
const { recentItems } = useCommandPalette({
  items, onSelect,
  recent: { enabled: true, max: 5, storageKey: 'my-app-recent' },
})

// Show recentItems at the top of an empty palette, or merge them into items
```

---

### Controlled isOpen

Pass `isOpen` and `onOpenChange` to take control of the open state — useful for URL-driven palettes or when the open state lives in a state management store.

```tsx
const [open, setOpen] = useState(false)

useCommandPalette({
  items, onSelect,
  isOpen: open,
  onOpenChange: setOpen,
})
```

Omit both props for the existing uncontrolled behaviour.

---

### Nested commands (pages)

Add a `children` array to any `CommandItem`. When a user selects a parent item the hook navigates into the children instead of calling `onSelect`. Use `currentPage`, `breadcrumb`, `canGoBack`, and `goBack` to render navigation chrome.

```tsx
const commands = [
  {
    id: 'theme',
    label: 'Change Theme',
    children: [
      { id: 'theme-dark',  label: 'Dark' },
      { id: 'theme-light', label: 'Light' },
    ],
  },
]

const { currentPage, breadcrumb, canGoBack, goBack } = useCommandPalette({ items: commands, onSelect })

// Render a breadcrumb:
{canGoBack && (
  <div>
    <button onClick={goBack}>← back</button>
    {breadcrumb.map((crumb) => <span key={crumb.id}> / {crumb.label}</span>)}
  </div>
)}
```

---

### Multiple hotkeys

`hotkey` accepts a string or array of strings. Any match opens/closes the palette.

```tsx
useCommandPalette({ items, onSelect, hotkey: ['mod+k', 'mod+p'] })
```

---

### useRegisterCommands (no Provider)

Register commands from anywhere in your component tree without a Provider. The module-level registry re-renders all subscribers when commands change.

```tsx
// In a deep component:
import { useRegisterCommands } from 'use-command-palette'

function SettingsPanel() {
  useRegisterCommands([
    { id: 'reset', label: 'Reset Settings' },
  ], []) // deps array, like useEffect
}

// In the palette component:
import { useRegisteredCommands } from 'use-command-palette'

function CommandPalette() {
  const { commands: registeredCommands } = useRegisteredCommands()

  const { filteredItems } = useCommandPalette({
    items: [...myStaticCommands, ...registeredCommands],
    onSelect,
  })
}
```

---

### Aria-live announcements

`getAnnouncerProps()` returns props for a visually-hidden `div` with `aria-live="polite"`. The `announcement` string updates automatically:

- Palette opens → `"Command palette open"`
- Results change → `"N results"`
- Item selected → `"[label] selected"`

```tsx
<div {...getAnnouncerProps()}>{announcement}</div>
```

---

### Testing utilities

```bash
import {
  openPaletteWithHotkey,
  typeInPalette,
  pressArrowDown,
  pressEnter,
  pressEscape,
  getAllPaletteItems,
  getHighlightedItem,
  getPaletteInput,
  waitForPaletteResults,
} from 'use-command-palette/testing'
```

```tsx
it('filters and selects', async () => {
  render(<MyApp />)
  openPaletteWithHotkey()
  typeInPalette('save')
  await waitForPaletteResults()
  expect(getAllPaletteItems()).toHaveLength(1)
  pressEnter()
  expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ label: 'Save File' }))
})
```

---

## Prop Getters

Prop getters are the headless pattern: we return the attributes, you decide where they go.

### `getContainerProps()`

```tsx
<div {...getContainerProps()}>
  {/* role="dialog" aria-modal={true} aria-label="Command palette" */}
</div>
```

### `getInputProps(overrides?)`

```tsx
<input {...getInputProps({ placeholder: 'Search…', className: 'my-input' })} />
// value, onChange, onKeyDown, role="combobox", aria-expanded,
// aria-controls, aria-activedescendant, autoComplete="off", ref
// Your onChange/onKeyDown are merged, not replaced.
```

### `getListProps()`

```tsx
<ul {...getListProps()}>
  {/* role="listbox" id="cmd-palette-list" */}
</ul>
```

### `getItemProps({ index, item })`

```tsx
{filteredItems.map((item, index) => (
  <li key={item.id} {...getItemProps({ index, item })}>
    {/* role="option" aria-selected aria-disabled onClick onMouseEnter id */}
    {item.label}
  </li>
))}
```

### `getAnnouncerProps()`

```tsx
<div {...getAnnouncerProps()}>{announcement}</div>
{/* aria-live="polite" aria-atomic={true} + visually-hidden style */}
```

---

## Keyboard Shortcuts

| Key | Behaviour |
|-----|-----------|
| `Mod+K` | Toggle the palette open/closed from anywhere |
| `ArrowDown` / `Tab` | Move highlight down; wraps |
| `ArrowUp` / `Shift+Tab` | Move highlight up; wraps |
| `Enter` | Select the highlighted item |
| `Escape` | Close palette (or go back one page if nested) |

Focus moves to the input on open; restores to the previously focused element on close.

---

## Filtering

The built-in filter uses fuzzy scoring with three tiers:

1. **Exact substring at word boundary** — highest score
2. **Exact substring elsewhere** — high score, slight position penalty
3. **Fuzzy match** (characters in order, not adjacent) — lower score, bonuses for consecutive runs and word-start positions

Override with your own `filterFn` for server search, `match-sorter`, etc.:

```tsx
import { matchSorter } from 'match-sorter'

useCommandPalette({
  items, onSelect,
  filterFn: (items, query) =>
    query ? matchSorter(items, query, { keys: ['label', 'keywords'] }) : items,
})
```

Or go async for remote search:

```tsx
filterFn: async (items, query) => {
  if (!query) return items
  const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
  return res.json()
}
```

---

## Grouping

```tsx
const { groupedItems, filteredItems, highlightedIndex, getItemProps } = useCommandPalette({ items, onSelect })

<ul {...getListProps()}>
  {groupedItems.map(({ group, items }) => (
    <li key={group ?? '__ungrouped__'}>
      {group && <div className="group-label">{group}</div>}
      <ul>
        {items.map((item) => {
          const index = filteredItems.indexOf(item)
          return (
            <li key={item.id} {...getItemProps({ index, item })}>
              {item.label}
            </li>
          )
        })}
      </ul>
    </li>
  ))}
</ul>
```

---

## TypeScript

### `CommandItem`

```ts
interface CommandItem {
  id: string
  label: string
  keywords?: string[]
  group?: string
  disabled?: boolean
  children?: CommandItem[]  // nested pages
  [key: string]: unknown    // attach any extra data
}
```

### Extending `CommandItem`

```ts
type AppCommand = CommandItem & {
  icon: React.ReactNode
  shortcut?: string
}

const commands: AppCommand[] = [
  { id: 'save', label: 'Save', icon: <SaveIcon />, shortcut: 'Ctrl+S' },
]
```

---

## Contributing

1. Fork and create a branch
2. `npm install`
3. `npm test` — run the test suite (114 tests)
4. `npm run lint` — TypeScript strict check
5. Submit a PR with a clear description

---

## License

MIT © use-command-palette contributors
