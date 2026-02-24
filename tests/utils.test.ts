import { describe, it, expect } from 'vitest'
import { defaultFilter, groupItems, fuzzyScore } from '../src/utils'
import type { CommandItem } from '../src/types'

const items: CommandItem[] = [
  { id: '1', label: 'Open File', group: 'File', keywords: ['open', 'file'] },
  { id: '2', label: 'Save File', group: 'File', keywords: ['save'] },
  { id: '3', label: 'New Window', group: 'Window' },
  { id: '4', label: 'Settings', keywords: ['preferences'] },
  { id: '5', label: 'Help' },
]

describe('defaultFilter', () => {
  it('returns all items when query is empty string', () => {
    expect(defaultFilter(items, '')).toEqual(items)
  })

  it('is case-insensitive on label', () => {
    const result = defaultFilter(items, 'OPEN')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('1')
  })

  it('matches partial label substring', () => {
    const result = defaultFilter(items, 'file')
    expect(result).toHaveLength(2)
    expect(result.map((i) => i.id)).toEqual(['1', '2'])
  })

  it('searches keywords (case-insensitive)', () => {
    const result = defaultFilter(items, 'PREFERENCES')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('4')
  })

  it('returns empty array when no match', () => {
    const result = defaultFilter(items, 'xyz-no-match')
    expect(result).toHaveLength(0)
  })

  it('matches on keywords in addition to label', () => {
    const result = defaultFilter(items, 'save')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('2')
  })
})

describe('groupItems', () => {
  it('groups items by group field', () => {
    const grouped = groupItems(items)
    const fileGroup = grouped.find((g) => g.group === 'File')
    const windowGroup = grouped.find((g) => g.group === 'Window')
    expect(fileGroup?.items).toHaveLength(2)
    expect(windowGroup?.items).toHaveLength(1)
  })

  it('handles items with no group (puts them in undefined group)', () => {
    const grouped = groupItems(items)
    const ungrouped = grouped.find((g) => g.group === undefined)
    expect(ungrouped?.items).toHaveLength(2)
    expect(ungrouped?.items.map((i) => i.id)).toEqual(['4', '5'])
  })

  it('preserves group order of first appearance', () => {
    const grouped = groupItems(items)
    const groupNames = grouped.map((g) => g.group)
    expect(groupNames).toEqual(['File', 'Window', undefined])
  })

  it('returns empty array for empty input', () => {
    expect(groupItems([])).toEqual([])
  })

  it('groups all ungrouped items together under undefined', () => {
    const ungroupedItems: CommandItem[] = [
      { id: 'a', label: 'Alpha' },
      { id: 'b', label: 'Beta' },
    ]
    const grouped = groupItems(ungroupedItems)
    expect(grouped).toHaveLength(1)
    expect(grouped[0].group).toBeUndefined()
    expect(grouped[0].items).toHaveLength(2)
  })
})

describe('fuzzyScore', () => {
  it('returns 0 for empty query', () => {
    expect(fuzzyScore('Anything', '')).toBe(0)
  })

  it('returns null when no match', () => {
    expect(fuzzyScore('Hello', 'xyz')).toBeNull()
  })

  it('exact substring scores higher than fuzzy match', () => {
    const substring = fuzzyScore('New Project', 'proj')!   // "proj" is a substring
    const fuzzy     = fuzzyScore('Projects Open', 'po')!   // p…o in order, not adjacent
    expect(substring).toBeGreaterThan(fuzzy)
  })

  it('word-boundary substring scores higher than mid-word substring', () => {
    const wordStart = fuzzyScore('Open File', 'file')!  // 'file' starts after a space
    const midWord   = fuzzyScore('Profiles', 'file')!   // 'file' is mid-word
    expect(wordStart).toBeGreaterThan(midWord)
  })

  it('fuzzy matches non-adjacent chars in order', () => {
    // 'prj' → P·r·o·j·ects  (p=0, r=1, j=3)
    expect(fuzzyScore('Projects', 'prj')).not.toBeNull()
  })

  it('returns null when chars are out of order', () => {
    // 'jp' cannot match 'Projects' because j comes after p
    expect(fuzzyScore('Projects', 'jp')).toBeNull()
  })

  it('is case-insensitive', () => {
    expect(fuzzyScore('OPEN FILE', 'open')).not.toBeNull()
    expect(fuzzyScore('open file', 'OPEN')).not.toBeNull()
  })

  it('consecutive run scores higher than spread-out match', () => {
    const consecutive = fuzzyScore('Settings', 'set')!  // s-e-t consecutive
    const spreadOut   = fuzzyScore('Select Text', 'st')! // s…t not adjacent
    expect(consecutive).toBeGreaterThan(spreadOut)
  })
})

describe('defaultFilter — fuzzy', () => {
  const cmds: CommandItem[] = [
    { id: 'proj',    label: 'Projects',         keywords: ['project'] },
    { id: 'profile', label: 'User Profile',     keywords: ['account'] },
    { id: 'prefs',   label: 'Preferences',      keywords: ['settings'] },
    { id: 'unrelated', label: 'Dashboard' },
  ]

  it('fuzzy-matches characters in order across word boundaries', () => {
    // 'prf' matches 'User Profile' (p in Profile) and 'Preferences' (p-r-f)
    const result = defaultFilter(cmds, 'prf')
    const ids = result.map((i) => i.id)
    expect(ids).toContain('prefs')   // Preferences: p-r-f consecutive
    expect(ids).not.toContain('unrelated')
  })

  it('ranks exact substring above fuzzy match', () => {
    // 'pro' is a substring of 'Projects' and a fuzzy match of 'User Profile'
    const result = defaultFilter(cmds, 'pro')
    expect(result[0].id).toBe('proj')  // 'Projects' has exact substring 'pro'
  })

  it('still returns empty array when nothing matches', () => {
    expect(defaultFilter(cmds, 'zzz')).toHaveLength(0)
  })

  it('returns all items on empty query', () => {
    expect(defaultFilter(cmds, '')).toHaveLength(cmds.length)
  })
})
