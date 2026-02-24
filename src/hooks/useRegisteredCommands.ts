import { useState, useEffect } from 'react'
import type { CommandItem } from '../types'
import { registry } from '../commandRegistry'

export function useRegisteredCommands(): { commands: CommandItem[] } {
  const [commands, setCommands] = useState<CommandItem[]>(() => registry.getAll())

  useEffect(() => {
    // Sync immediately in case registry changed between render and effect
    setCommands(registry.getAll())
    const unsubscribe = registry.subscribe(() => {
      setCommands(registry.getAll())
    })
    return unsubscribe
  }, [])

  return { commands }
}
