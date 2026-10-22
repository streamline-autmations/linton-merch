import { useEffect, useState } from 'react'

export interface VisibleArea {
  /** The visible height in CSS pixels: shrinks when the on-screen keyboard opens. */
  height: number
  /** How far the browser has panned the page to keep a focused field in view. */
  top: number
  /** The on-screen keyboard is (very probably) up. */
  keyboard: boolean
}

function read(): VisibleArea | null {
  const vv = typeof window === 'undefined' ? null : window.visualViewport
  if (!vv) return null
  // Pinch-zooming the page also shrinks the visual viewport; only a short, unzoomed one is a keyboard.
  const keyboard = vv.scale < 1.05 && window.innerHeight - vv.height > 120
  return { height: Math.round(vv.height), top: Math.round(vv.offsetTop), keyboard }
}

/**
 * The part of the screen the visitor can actually see. Phones open the keyboard over the page and
 * pan it, which pushes fixed panels (the builder sheet) partly off the top; this lets them follow.
 */
export function useVisibleArea(enabled = true): VisibleArea | null {
  const [area, setArea] = useState<VisibleArea | null>(() => (enabled ? read() : null))
  useEffect(() => {
    const vv = window.visualViewport
    if (!enabled || !vv) {
      setArea(null)
      return
    }
    const update = () =>
      setArea((prev) => {
        const next = read()
        return prev &&
          next &&
          prev.height === next.height &&
          prev.top === next.top &&
          prev.keyboard === next.keyboard
          ? prev
          : next
      })
    update()
    vv.addEventListener('resize', update)
    vv.addEventListener('scroll', update)
    return () => {
      vv.removeEventListener('resize', update)
      vv.removeEventListener('scroll', update)
    }
  }, [enabled])
  return area
}
