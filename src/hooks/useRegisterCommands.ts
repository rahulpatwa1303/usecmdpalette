import { useEffect, useRef } from 'react'
import type { CommandItem } from '../types'
import { registry } from '../commandRegistry'

let keyCounter = 0

export function useRegisterCommands(commands: CommandItem[], deps: unknown[]): void {
  const keyRef = useRef<string | null>(null)

  // Assign a stable key once on mount
  if (keyRef.current === null) {
    keyRef.current = `__useRegisterCommands_${++keyCounter}`
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (typeof window === 'undefined') return
    const key = keyRef.current!
    registry.register(key, commands)
    return () => {
      registry.unregister(key)
    }
    // deps spread intentionally — caller controls when to re-register
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
