import { useState, useEffect, useRef } from 'react'

export type AnimationState = 'entering' | 'entered' | 'exiting' | 'exited'

export function useAnimation(
  isOpen: boolean,
  duration: number,
): { isMounted: boolean; animationState: AnimationState } {
  const [isMounted, setIsMounted] = useState(isOpen)
  const [animationState, setAnimationState] = useState<AnimationState>(isOpen ? 'entered' : 'exited')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    if (isOpen) {
      setIsMounted(true)
      if (duration === 0) {
        setAnimationState('entered')
      } else {
        setAnimationState('entering')
        timerRef.current = setTimeout(() => {
          setAnimationState('entered')
          timerRef.current = null
        }, duration)
      }
    } else {
      if (duration === 0) {
        setAnimationState('exited')
        setIsMounted(false)
      } else {
        setAnimationState('exiting')
        timerRef.current = setTimeout(() => {
          setAnimationState('exited')
          setIsMounted(false)
          timerRef.current = null
        }, duration)
      }
    }

    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [isOpen, duration])

  return { isMounted, animationState }
}
