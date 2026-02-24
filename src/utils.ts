import type { CommandItem, GroupedItems } from './types'

/**
 * Scores how well `query` matches `text` using fuzzy matching.
 *
 * Scoring tiers:
 *  - Exact substring at a word boundary  → highest  (150)
 *  - Exact substring elsewhere            → high     (100 - small position penalty)
 *  - Fuzzy (chars in order, not adjacent) → lower    (accumulates per-char points)
 *
 * Returns `null` when there is no match at all.
 */
export function fuzzyScore(text: string, query: string): number | null {
  if (!query) return 0
  const t = text.toLowerCase()
  const q = query.toLowerCase()

  // ── Fast path: exact substring ────────────────────────────────
  const subIdx = t.indexOf(q)
  if (subIdx !== -1) {
    const wordStart =
      subIdx === 0 || t[subIdx - 1] === ' ' || t[subIdx - 1] === '-' || t[subIdx - 1] === '_'
    return 100 + (wordStart ? 50 : 0) - subIdx * 0.5
  }

  // ── Fuzzy path: all query chars must appear in t in order ─────
  let score = 0
  let ti = 0
  let qi = 0
  let prevMatchTi = -2

  while (qi < q.length && ti < t.length) {
    if (t[ti] === q[qi]) {
      score += 10
      if (ti === prevMatchTi + 1) score += 15  // consecutive run bonus
      if (ti === 0 || t[ti - 1] === ' ' || t[ti - 1] === '-' || t[ti - 1] === '_') score += 10 // word-start bonus
      prevMatchTi = ti
      qi++
    }
    ti++
  }

  return qi === q.length ? score : null
}

export function defaultFilter(items: CommandItem[], query: string): CommandItem[] {
  if (!query) return items

  const scored: { item: CommandItem; score: number }[] = []

  for (const item of items) {
    const candidates: (number | null)[] = [fuzzyScore(item.label, query)]
    if (item.keywords) {
      for (const kw of item.keywords) candidates.push(fuzzyScore(kw, query))
    }

    const best = Math.max(...(candidates.filter((s) => s !== null) as number[]))
    if (isFinite(best)) scored.push({ item, score: best })
  }

  // Stable sort: equal scores preserve original list order
  return scored.sort((a, b) => b.score - a.score).map(({ item }) => item)
}

export function groupItems(items: CommandItem[]): GroupedItems[] {
  const order: (string | undefined)[] = []
  const map = new Map<string | undefined, CommandItem[]>()

  for (const item of items) {
    const g = item.group
    if (!map.has(g)) {
      map.set(g, [])
      order.push(g)
    }
    map.get(g)!.push(item)
  }

  return order.map((g) => ({ group: g, items: map.get(g)! }))
}

interface ParsedHotkey {
  key: string
  mod: boolean
  shift: boolean
  alt: boolean
}

export function parseHotkey(hotkey: string): ParsedHotkey {
  const parts = hotkey.toLowerCase().split('+')
  return {
    key: parts[parts.length - 1],
    mod: parts.includes('mod'),
    shift: parts.includes('shift'),
    alt: parts.includes('alt'),
  }
}

export function matchesHotkey(event: KeyboardEvent, hotkey: string): boolean {
  const { key, mod, shift, alt } = parseHotkey(hotkey)

  let modPressed: boolean
  if (mod) {
    const isMac =
      typeof navigator !== 'undefined' && navigator.platform
        ? /mac/i.test(navigator.platform)
        : false
    modPressed = isMac ? event.metaKey : event.ctrlKey
  } else {
    modPressed = true
  }

  return (
    event.key.toLowerCase() === key &&
    modPressed &&
    event.shiftKey === shift &&
    event.altKey === alt
  )
}
