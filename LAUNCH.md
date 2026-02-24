# Launch copy — use-command-palette

---

## Product Hunt

### Tagline
> Headless React hook for command palettes — zero deps, no Provider, no UI

### Description

**use-command-palette** is a headless React hook that gives you everything you need to build a ⌘K command palette — state, keyboard navigation, fuzzy search, ARIA attributes, focus management — without shipping a single pixel of UI or requiring a Provider around your app.

You bring the HTML and CSS. The hook handles the hard parts.

**What makes it different from cmdk or kbar?**

Every existing library either ships a styled component you have to override, requires a context Provider at the app root, or both. use-command-palette does neither. It's a single `useCommandPalette()` call that returns prop getters you spread onto your own elements.

**What's included:**

- **Fuzzy search** built in — word-boundary boosts, consecutive-run bonuses, exact-substring fast path
- **Async filterFn** — return a Promise from your filter; the hook handles loading state and cancels stale results
- **Nested commands** — give any item a `children` array; the hook manages the page stack, breadcrumb, and back navigation
- **Recent items** — `localStorage`-backed list of recently selected commands, surfaced in `recentItems`
- **Animation state machine** — `entering / entered / exiting / exited` lets you add CSS transitions without managing timers yourself
- **Controlled + uncontrolled** — pass `isOpen`/`onOpenChange` for URL-driven palettes, or omit for the default
- **Multiple hotkeys** — `hotkey: ['mod+k', 'mod+p']`
- **useRegisterCommands** — register commands from any component, no Provider needed; a module-level registry re-renders all subscribers
- **Aria-live announcements** — `getAnnouncerProps()` + `announcement` string for screen readers
- **Testing utilities** — `use-command-palette/testing` exports helpers like `openPaletteWithHotkey()`, `typeInPalette()`, `waitForPaletteResults()` for RTL-based tests

Zero dependencies. SSR safe. Full TypeScript strict mode. 114 tests.

Four styled demos included: plain CSS, Tailwind, MUI, and minimal inline styles — so you can see exactly how to wire it up with your stack.

### First comment (maker post)

Hey PH 👋

I built this because I wanted to add a command palette to a side project and found myself choosing between cmdk (forces its own styled components on you) and kbar (needs a Provider wrapping your whole app, has its own store).

I wanted a library that behaves like `react-dropzone` or `downshift` — just give me the state and props, I'll do the rendering. So I built one.

The hook returns everything you need to build a fully accessible, keyboard-navigable, fuzzy-searchable command palette:

```tsx
const {
  isOpen, isMounted, animationState,
  filteredItems, isLoading, recentItems,
  currentPage, breadcrumb, canGoBack,
  announcement,
  getContainerProps, getInputProps,
  getListProps, getItemProps, getAnnouncerProps,
} = useCommandPalette({ items, onSelect })
```

No component to override. No Provider to add. No CSS to fight.

Would love feedback — especially on the API surface. What would you need from a headless command palette library that isn't here yet?

---

## Reddit — r/reactjs

### Title
**I built a headless ⌘K command palette hook — no deps, no Provider, no UI (open source)**

### Body

I got tired of every command palette library either shipping styled components I had to fight against or requiring a `<Provider>` wrapped around my whole app just to get keyboard navigation working.

So I built `use-command-palette` — a single React hook that handles all the logic and returns prop getters you spread onto your own markup. Think `react-dropzone` or `downshift` but for command palettes.

**What it does:**

```tsx
const {
  isOpen, filteredItems, highlightedIndex,
  getContainerProps, getInputProps, getListProps, getItemProps,
} = useCommandPalette({ items, onSelect })

// Spread the prop getters onto your own elements — no imposed HTML structure
<input {...getInputProps({ placeholder: 'Search…' })} />
<ul {...getListProps()}>
  {filteredItems.map((item, index) => (
    <li key={item.id} {...getItemProps({ index, item })}>{item.label}</li>
  ))}
</ul>
```

**Features that go beyond cmdk/kbar:**

- **Async `filterFn`** — return a Promise; loading state and stale-result cancellation handled for you
- **Nested commands** — `children` array on any item; the hook manages the page stack, breadcrumb trail, and back navigation
- **Recent items** — `localStorage`-backed, surfaced in `recentItems`
- **Animation state machine** — `entering / entered / exiting / exited` states let you do CSS transitions without setTimeout juggling
- **`useRegisterCommands`** — register commands from any component without a Provider; module-level singleton registry
- **Controlled mode** — pass `isOpen`/`onOpenChange` if you want URL-driven or store-driven open state
- **Multiple hotkeys** — `hotkey: ['mod+k', 'mod+p']`
- **aria-live announcements** — `getAnnouncerProps()` + `announcement` string for screen readers
- **Testing helpers** — `use-command-palette/testing` subpath with `openPaletteWithHotkey()`, `typeInPalette()`, `waitForPaletteResults()`, etc.

Zero runtime dependencies (React is a peer dep). SSR safe. TypeScript strict. 114 tests.

Four demos: plain CSS, Tailwind, MUI, and a minimal inline-styles version.

**GitHub:** [link]
**npm:** `npm install use-command-palette`

Happy to answer questions. Would especially like to know if there's a use case I'm missing — the API is still evolving.

---

## Reddit — r/javascript

### Title
**use-command-palette — headless React hook for ⌘K palettes. Zero deps, no Provider needed.**

### Body

Quick post about something I shipped this week.

`use-command-palette` is a headless React hook for building command palettes (⌘K / Ctrl+K). It's zero dependencies, requires no Provider, ships no UI, and is fully SSR-safe.

The big idea: instead of giving you components to style, it gives you state + prop getters that you spread onto your own elements. Works with Tailwind, MUI, CSS Modules, vanilla CSS, anything.

Beyond the basics (fuzzy search, keyboard nav, grouping, ARIA), it has:
- Async `filterFn` with loading state + stale cancellation
- Nested commands with page stack + breadcrumb
- Recent items persisted to localStorage
- Animation state machine (`entering/entered/exiting/exited`)
- `useRegisterCommands` — add commands from anywhere without a Provider
- Testing helpers on a `use-command-palette/testing` subpath

**npm:** `npm install use-command-palette`
**GitHub:** [link]

---

## Twitter / X thread

**Tweet 1 (hook tweet):**
just shipped use-command-palette — a headless React hook for ⌘K command palettes

zero dependencies. no Provider. no UI.

you bring the HTML + CSS, it brings state, fuzzy search, keyboard nav, and ARIA

🧵

---

**Tweet 2:**
every other command palette lib either:

- ships styled components you have to fight (cmdk)
- requires a `<Provider>` at your app root (kbar)
- both

use-command-palette does neither. it's just a hook that returns prop getters

```tsx
const { filteredItems, getInputProps, getItemProps } = useCommandPalette({ items, onSelect })

<input {...getInputProps({ placeholder: 'Search…' })} />
{filteredItems.map((item, i) => (
  <li {...getItemProps({ index: i, item })}>{item.label}</li>
))}
```

---

**Tweet 3:**
it also goes further than any existing library

🔄 async filterFn — return a Promise, get isLoading + stale-result cancellation for free

📁 nested commands — give any item a children array, the hook manages the page stack, breadcrumb, and back navigation

---

**Tweet 4:**
⏱ recent items — localStorage-backed list of last-used commands, automatically updated on select

🎬 animation state machine — entering/entered/exiting/exited states so you can CSS-transition the palette in and out without managing timers

---

**Tweet 5:**
🎹 multiple hotkeys — hotkey: ['mod+k', 'mod+p']

🔌 useRegisterCommands — register commands from any component, no Provider. module-level registry re-renders all subscribers

♿️ aria-live announcements — getAnnouncerProps() + announcement string, fully wired

🧪 testing utilities — use-command-palette/testing subpath with openPaletteWithHotkey(), typeInPalette(), waitForPaletteResults(), etc

---

**Tweet 6:**
four demos included so you can see exactly how to wire it up:

- plain CSS (with dark mode via CSS custom properties)
- Tailwind
- MUI (no custom CSS at all)
- minimal inline styles

all demos show nested commands, recent items, and animations

---

**Tweet 7:**
zero runtime deps (React is a peer dep)
SSR safe (all window/document access guarded)
TypeScript strict throughout
114 tests

npm install use-command-palette

github: [link]
npm: [link]

if you build something with it, reply — i'd love to see it

---

## LinkedIn post

I shipped something this week I've been wanting to exist for a while.

**use-command-palette** — a headless React hook for command palettes (⌘K / Ctrl+K interfaces).

The itch I was scratching: every command palette library either ships styled components you have to override, or requires a context Provider around your entire app. I wanted a library that just hands you state and gets out of the way — like react-dropzone or downshift, but for command palettes.

So it returns prop getters you spread onto your own elements. Works with any CSS approach.

Beyond the basics (fuzzy search, keyboard navigation, grouping, ARIA attributes), it includes things I haven't seen elsewhere:

**Async filtering** — return a Promise from your filterFn; loading state and stale-result cancellation are handled automatically.

**Nested commands** — give any item a `children` array; the hook manages the entire page stack, breadcrumb trail, and back navigation.

**Recent items** — localStorage-backed list of recently selected commands.

**Animation state machine** — `entering → entered → exiting → exited` states let you add CSS transitions without managing setTimeout yourself.

**useRegisterCommands** — register commands from any component in your tree without a Provider. Module-level singleton registry with React subscriptions.

**Testing utilities** — a `use-command-palette/testing` subpath with helpers like `openPaletteWithHotkey()`, `typeInPalette()`, and `waitForPaletteResults()` for writing clean integration tests.

Zero runtime dependencies. SSR safe. TypeScript strict mode. 114 tests. Four styled demos.

**npm install use-command-palette**

[GitHub link] | [npm link]

---

## Hacker News — Show HN

**Title:** Show HN: use-command-palette – headless React hook for ⌘K palettes, zero deps

**Body:**

I built this because I wanted a command palette in a side project and couldn't find a library that just gave me state without also giving me HTML structure or requiring a Provider at my app root.

The hook returns prop getters — functions that return the ARIA attributes, event handlers, and IDs you need to spread onto your own elements. No imposed HTML. No CSS. Works with Tailwind, MUI, CSS Modules, vanilla, whatever.

Features beyond the basics:
- Async filterFn with loading state and stale-result cancellation
- Nested commands (children array on any item; hook manages page stack + breadcrumb)
- Recent items persisted to localStorage
- Animation state machine (entering/entered/exiting/exited)
- useRegisterCommands — add commands from any component without a Provider (module-level registry)
- Controlled isOpen/onOpenChange
- Multiple hotkeys
- aria-live announcements via getAnnouncerProps()
- Testing utilities on a /testing subpath

Zero runtime dependencies. SSR safe. TypeScript strict. 114 tests. Four demos (plain CSS, Tailwind, MUI, inline styles).

npm: `npm install use-command-palette`
GitHub: [link]

Happy to answer questions about the architecture or design decisions.
