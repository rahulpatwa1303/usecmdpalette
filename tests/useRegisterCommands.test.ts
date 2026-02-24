import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useRegisterCommands } from '../src/hooks/useRegisterCommands'
import { useRegisteredCommands } from '../src/hooks/useRegisteredCommands'
import { registry } from '../src/commandRegistry'
import type { CommandItem } from '../src'

const cmd1: CommandItem = { id: 'c1', label: 'Command 1' }
const cmd2: CommandItem = { id: 'c2', label: 'Command 2' }

beforeEach(() => {
  // Clear the singleton registry between tests
  ;(registry as unknown as { store: Map<string, CommandItem[]> }).store.clear()
  // Notify any lingering subscribers
  ;(registry as unknown as { notify: () => void }).notify()
})

describe('useRegisterCommands', () => {
  it('registers commands on mount', () => {
    renderHook(() => useRegisterCommands([cmd1], []))
    expect(registry.getAll()).toContainEqual(cmd1)
  })

  it('unregisters commands on unmount', () => {
    const { unmount } = renderHook(() => useRegisterCommands([cmd1], []))
    unmount()
    expect(registry.getAll()).toHaveLength(0)
  })

  it('re-registers when deps change', () => {
    let commands = [cmd1]
    const { rerender } = renderHook(() => useRegisterCommands(commands, [commands]))

    commands = [cmd2]
    rerender()
    expect(registry.getAll()).toContainEqual(cmd2)
    expect(registry.getAll()).not.toContainEqual(cmd1)
  })
})

describe('useRegisteredCommands', () => {
  it('returns empty array when nothing registered', () => {
    const { result } = renderHook(() => useRegisteredCommands())
    expect(result.current.commands).toHaveLength(0)
  })

  it('reflects commands registered by useRegisterCommands', () => {
    renderHook(() => useRegisterCommands([cmd1, cmd2], []))
    const { result } = renderHook(() => useRegisteredCommands())
    expect(result.current.commands).toHaveLength(2)
  })

  it('updates when registry changes', () => {
    const { result: regResult } = renderHook(() => useRegisteredCommands())
    expect(regResult.current.commands).toHaveLength(0)

    act(() => {
      registry.register('test-key', [cmd1])
    })
    expect(regResult.current.commands).toContainEqual(cmd1)

    act(() => {
      registry.unregister('test-key')
    })
    expect(regResult.current.commands).toHaveLength(0)
  })
})
