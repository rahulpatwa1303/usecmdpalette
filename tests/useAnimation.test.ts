import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAnimation } from '../src/hooks/useAnimation'

describe('useAnimation — zero duration (default)', () => {
  it('starts mounted + entered when isOpen=true', () => {
    const { result } = renderHook(() => useAnimation(true, 0))
    expect(result.current.isMounted).toBe(true)
    expect(result.current.animationState).toBe('entered')
  })

  it('starts unmounted + exited when isOpen=false', () => {
    const { result } = renderHook(() => useAnimation(false, 0))
    expect(result.current.isMounted).toBe(false)
    expect(result.current.animationState).toBe('exited')
  })

  it('transitions immediately on open', () => {
    let isOpen = false
    const { result, rerender } = renderHook(() => useAnimation(isOpen, 0))
    expect(result.current.isMounted).toBe(false)

    isOpen = true
    rerender()
    expect(result.current.isMounted).toBe(true)
    expect(result.current.animationState).toBe('entered')
  })

  it('transitions immediately on close', () => {
    let isOpen = true
    const { result, rerender } = renderHook(() => useAnimation(isOpen, 0))
    expect(result.current.isMounted).toBe(true)

    isOpen = false
    rerender()
    expect(result.current.isMounted).toBe(false)
    expect(result.current.animationState).toBe('exited')
  })
})

describe('useAnimation — non-zero duration', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('goes entering → entered after duration', () => {
    let isOpen = false
    const { result, rerender } = renderHook(() => useAnimation(isOpen, 200))

    isOpen = true
    rerender()
    expect(result.current.isMounted).toBe(true)
    expect(result.current.animationState).toBe('entering')

    act(() => { vi.advanceTimersByTime(200) })
    expect(result.current.animationState).toBe('entered')
  })

  it('goes exiting → exited → unmounted after duration', () => {
    let isOpen = true
    const { result, rerender } = renderHook(() => useAnimation(isOpen, 200))

    isOpen = false
    rerender()
    expect(result.current.isMounted).toBe(true)
    expect(result.current.animationState).toBe('exiting')

    act(() => { vi.advanceTimersByTime(200) })
    expect(result.current.animationState).toBe('exited')
    expect(result.current.isMounted).toBe(false)
  })

  it('cancels pending timer if isOpen flips back quickly', () => {
    let isOpen = false
    const { result, rerender } = renderHook(() => useAnimation(isOpen, 200))

    isOpen = true
    rerender()
    expect(result.current.animationState).toBe('entering')

    // Flip back before timer fires
    isOpen = false
    rerender()
    expect(result.current.animationState).toBe('exiting')

    act(() => { vi.advanceTimersByTime(200) })
    expect(result.current.animationState).toBe('exited')
    expect(result.current.isMounted).toBe(false)
  })
})
