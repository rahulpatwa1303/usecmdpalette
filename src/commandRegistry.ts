import type { CommandItem } from './types'

type Listener = () => void

class CommandRegistry {
  private store = new Map<string, CommandItem[]>()
  private listeners = new Set<Listener>()

  register(key: string, commands: CommandItem[]): void {
    this.store.set(key, commands)
    this.notify()
  }

  unregister(key: string): void {
    if (this.store.has(key)) {
      this.store.delete(key)
      this.notify()
    }
  }

  getAll(): CommandItem[] {
    const result: CommandItem[] = []
    for (const commands of this.store.values()) {
      result.push(...commands)
    }
    return result
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener()
    }
  }
}

export const registry = new CommandRegistry()
