import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'
import type Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)

export { gsap, ScrollTrigger, SplitText, useGSAP }

// Media query under which decorative motion runs. Used with gsap.matchMedia() so animations
// revert automatically if the visitor turns on reduced motion while the page is open.
export const MOTION_OK = '(prefers-reduced-motion: no-preference)'

export function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

// The single Lenis instance, owned by <SmoothScroll />. Null when reduced motion is on.
let lenis: Lenis | null = null
export function setLenis(instance: Lenis | null) {
  lenis = instance
}
export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true })
  else window.scrollTo(0, 0)
}
export function scrollToY(y: number) {
  // Lenis caches the page height; a page that just got taller would otherwise clamp the jump.
  if (lenis) {
    lenis.resize()
    lenis.scrollTo(y, { immediate: true, force: true })
  }
  else window.scrollTo(0, y)
}
