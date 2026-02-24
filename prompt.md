# Claude Code Build Prompt: `use-command-palette`

## What We Are Building

A **headless, zero-dependency React hook library** called `use-command-palette` that manages all the state and keyboard logic for a command palette (Cmd+K / Ctrl+K interface) — with absolutely no UI, no styles, and no DOM structure imposed on the consumer.

The consumer brings their own UI. The hook brings the brains.

---

## The Problem We're Solving

Every existing command palette library for React (`cmdk`, `kbar`, `react-cmdk`, `react-command-palette`) either:
- Ships pre-built UI components and styles you can't escape
- Requires wrapping your entire app in a Provider
- Is tied to a specific framework (Next.js) or design system (shadcn)
- Mixes UI concerns with logic concerns

None of them are **purely headless hooks** in the style of `react-hook-form` or `downshift`. A developer building a custom design system, or someone who just wants the keyboard/state logic without the DOM opinions, has no good option today.

**Our hook is that option.**

---

## Goals

1. **Zero dependencies** — only React as a peer dependency
2. **No Provider required** — just import and use the hook anywhere
3. **No UI shipped** — the hook returns state and handlers; the consumer renders whatever they want
4. **Framework agnostic** — works with any styling solution (Tailwind, CSS modules, styled-components, plain CSS)
5. **Full TypeScript** — strict types throughout, consumers get full IntelliSense
6. **Accessible by default** — returns the correct ARIA attributes as props so consumers can spread them onto their elements
7. **Consistent API pattern** — similar to how `usePasswordPolicy` works in the sibling library `use-password-policy` (hook-first, returns rich state object)

---

## API Design

### The main hook

```ts
const {
  // State
  isOpen,
  query,
  highlightedIndex,
  filteredItems,

  // Actions
  open,
  close,
  toggle,
  setQuery,
  selectItem,
  highlightIndex,

  // Prop getters (spread these onto your elements for a11y + handlers)
  getInputProps,       // for the search input
  getListProps,        // for the results <ul>
  getItemProps,        // for each result <li>, takes { index, item }
  getContainerProps,   // for the modal/dialog wrapper

} = useCommandPalette({
  items,              // Item[] — the full list of commands
  onSelect,           // (item: Item) => void — called when user picks an item
  filterFn,           // optional custom filter function
  defaultOpen,        // optional boolean, default false
  hotkey,             // optional string, default 'mod+k' (mod = Cmd on Mac, Ctrl on Win/Linux)
  closeOnSelect,      // optional boolean, default true
})
```

### Item type

```ts
interface CommandItem {
  id: string
  label: string
  keywords?: string[]        // extra search terms beyond label
  group?: string             // optional grouping label
  disabled?: boolean
  [key: string]: unknown     // consumers can attach any extra data
}
```

### Prop getters pattern (critical)

Prop getters are functions that return the props the consumer should spread onto their elements. This is the headless pattern — we give you the props, you put them where you want.

```tsx
// Consumer usage example:
<div {...getContainerProps()}>
  <input {...getInputProps({ placeholder: 'Search commands...' })} />
  <ul {...getListProps()}>
    {filteredItems.map((item, index) => (
      <li key={item.id} {...getItemProps({ index, item })}>
        {item.label}
      </li>
    ))}
  </ul>
</div>
```

`getInputProps()` returns: `{ value, onChange, onKeyDown, role: 'combobox', 'aria-expanded', 'aria-controls', 'aria-activedescendant', autoComplete: 'off' }`

`getListProps()` returns: `{ role: 'listbox', id }`

`getItemProps({ index, item })` returns: `{ role: 'option', 'aria-selected', 'aria-disabled', onClick, onMouseEnter, id }`

`getContainerProps()` returns: `{ role: 'dialog', 'aria-modal': true, 'aria-label': 'Command palette' }`

---

## Keyboard Behaviour (must implement all of these)

| Key | Behaviour |
|-----|-----------|
| `Mod+K` (Cmd+K / Ctrl+K) | Toggle open/close from anywhere on the page |
| `ArrowDown` | Move highlight to next item (wraps to first from last) |
| `ArrowUp` | Move highlight to previous item (wraps to last from first) |
| `Enter` | Select the currently highlighted item |
| `Escape` | Close the palette and clear query |
| `Tab` | Move highlight down (same as ArrowDown) |
| `Shift+Tab` | Move highlight up (same as ArrowUp) |

When the palette opens, focus should automatically go to the input. When it closes, focus should return to the element that was focused before it opened.

---

## Filtering

Default filter: case-insensitive substring match against `item.label` and `item.keywords`.

The consumer can override with their own `filterFn`:
```ts
filterFn?: (items: CommandItem[], query: string) => CommandItem[]
```

If query is empty, return all items (don't filter).

---

## Grouping Support

When items have a `group` field, `filteredItems` should preserve group ordering. Expose a helper:

```ts
const { groupedItems } = useCommandPalette({ ... })
// groupedItems: Array<{ group: string | undefined, items: CommandItem[] }>
```

This lets consumers render group headers without any logic on their side.

---

## Project Structure

```
use-command-palette/
├── src/
│   ├── hooks/
│   │   ├── useCommandPalette.ts      # main hook (re-exports everything)
│   │   ├── useFilter.ts              # filtering logic
│   │   ├── useKeyboard.ts            # keyboard event handling
│   │   └── useFocusTrap.ts           # focus management
│   ├── types.ts                      # all TypeScript interfaces
│   ├── utils.ts                      # pure helper functions
│   └── index.ts                      # barrel export
├── tests/
│   ├── useCommandPalette.test.ts
│   ├── useFilter.test.ts
│   ├── useKeyboard.test.ts
│   └── utils.test.ts
├── demo/                             # Vite + React demo app
│   ├── src/
│   │   ├── App.tsx                   # demo showing the hook in action
│   │   └── main.tsx
│   ├── index.html
│   └── package.json
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── README.md
```

---

## package.json Requirements

```json
{
  "name": "use-command-palette",
  "version": "0.1.0",
  "description": "Headless React hook for command palettes. Zero dependencies, no UI, no Provider required.",
  "main": "dist/index.js",
  "module": "dist/index.esm.js",
  "types": "dist/index.d.ts",
  "files": ["dist", "README.md"],
  "peerDependencies": { "react": ">=16.8.0" },
  "devDependencies": {
    "tsup": "latest",
    "typescript": "latest",
    "vitest": "latest",
    "@testing-library/react": "latest",
    "@testing-library/user-event": "latest",
    "jsdom": "latest",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "@types/react": "^18.0.0"
  },
  "scripts": {
    "build": "tsup src/index.ts --format cjs,esm --dts --clean",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "tsc --noEmit"
  }
}
```

---

## Tests to Write

Every test should use `@testing-library/react` and `@testing-library/user-event`. Cover:

**useCommandPalette.test.ts**
- Starts closed (`isOpen: false`)
- `open()` sets `isOpen: true`
- `close()` sets `isOpen: false`
- `toggle()` flips the state
- `setQuery()` updates `query` and re-filters `filteredItems`
- `selectItem(item)` calls `onSelect` with the item
- `selectItem` closes the palette when `closeOnSelect: true` (default)
- `selectItem` does NOT close when `closeOnSelect: false`
- `highlightIndex` updates `highlightedIndex`
- Disabled items cannot be selected
- Empty query returns all items

**useFilter.test.ts**
- Matches on `label` (case-insensitive)
- Matches on `keywords`
- Returns empty array when no match
- Returns all items when query is empty string
- Custom `filterFn` overrides default behaviour

**useKeyboard.test.ts**
- ArrowDown increments highlighted index
- ArrowDown wraps from last to first
- ArrowUp decrements highlighted index
- ArrowUp wraps from first to last
- Enter calls `onSelect` with highlighted item
- Escape closes the palette
- Mod+K opens the palette when closed
- Mod+K closes the palette when open

**utils.test.ts**
- `groupItems` correctly groups by `group` field
- `groupItems` handles items with no group (puts them in an undefined group)
- `defaultFilter` is case-insensitive
- `defaultFilter` searches keywords

---

## Demo App

The demo (`demo/`) should be a Vite + React app that shows the hook working with a minimal but real-looking command palette UI. It should demonstrate:

1. A button that says "Open Command Palette" + shows the keyboard shortcut
2. A modal overlay that appears when open
3. A search input at the top
4. Filtered results list below
5. Highlighted item shown with a background color
6. Groups rendered with a small group label above each section
7. Keyboard navigation working
8. Clicking outside the modal closes it

The demo should use only inline styles or a single CSS file — no external UI libraries. The point is to prove the hook works, not to make it look perfect.

---

## README Requirements

The README must include all of the following sections in this order:

1. **Badges** — npm version, downloads, license, TypeScript
2. **One-line pitch** — "Headless React hook for command palettes. You bring the UI, we bring the logic."
3. **Why use-command-palette?** — bullet list: zero deps, no Provider, no UI, full TypeScript, accessible prop getters
4. **Live Demo link** (placeholder for GitHub Pages URL)
5. **Installation** — `npm install use-command-palette`
6. **Quick Start** — minimal working example (~20 lines), shows hook + spreading prop getters
7. **Full API Reference** — every option, every return value, with types
8. **Prop Getters** — dedicated section explaining the pattern with examples for all 4 getters
9. **Keyboard Shortcuts** — table of all keyboard interactions
10. **Filtering** — how default filter works + custom filterFn example
11. **Grouping** — how to use `groupedItems` to render group headers
12. **TypeScript** — show the `CommandItem` type + how to extend it
13. **Contributing** — brief
14. **License** — MIT

---

## Definition of Done

The build is complete when:
- [ ] `npm run build` produces `dist/index.js`, `dist/index.esm.js`, `dist/index.d.ts` with no errors
- [ ] `npm test` passes all tests with no failures
- [ ] `npm run lint` passes with no TypeScript errors
- [ ] The demo app runs with `npm run dev` inside `demo/`
- [ ] All keyboard interactions work correctly in the demo
- [ ] The README is complete and accurate
- [ ] The package is ready to `npm publish`

---

## Important Constraints

- **No dependencies in the published package** — only React as a peer dep
- **No UI whatsoever** — do not ship any CSS, any component, any DOM structure
- **No Context/Provider** — the hook must work standalone with no app-level setup
- **Must work in SSR** — guard all `window`/`document` access so it doesn't crash in Next.js server components
- **Strict TypeScript** — `"strict": true` in tsconfig, no `any` unless absolutely unavoidable
- **All keyboard logic must be tested** — do not skip keyboard tests