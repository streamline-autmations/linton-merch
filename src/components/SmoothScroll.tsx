import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { gsap, ScrollTrigger, MOTION_OK, setLenis, useGSAP } from '@/lib/motion'

const NAV_KEYS = new Set(['PageUp', 'PageDown', 'Home', 'End', ' ', 'ArrowUp', 'ArrowDown'])

function useMotionAllowed() {
  const query = () => window.matchMedia(MOTION_OK)
  const [allowed, setAllowed] = useState(() => query().matches)
  useEffect(() => {
    const mq = query()
    const onChange = () => setAllowed(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return allowed
}

// Owns smooth scrolling (Lenis, driven by GSAP's ticker so ScrollTrigger stays in sync), the
// stitched scroll-progress thread, and the "stitch in" of `.stitch` rules as they enter view.
export function SmoothScroll() {
  const threadRef = useRef<HTMLDivElement>(null)
  const motionAllowed = useMotionAllowed()

  useEffect(() => {
    if (!motionAllowed) return
    const instance = new Lenis({
      lerp: 0.11,
      anchors: true,
      // Dialogs, sheets and horizontal rails scroll natively.
      prevent: (node) => Boolean(node.closest('[role="dialog"], .rail')),
    })
    setLenis(instance)
    instance.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => instance.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    // Radix locks scroll by marking <body>; pause Lenis while a dialog or drawer is open.
    const observer = new MutationObserver(() => {
      if (document.body.hasAttribute('data-scroll-locked')) instance.stop()
      else instance.start()
    })
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-scroll-locked'] })
    // Keyboard and focus scrolling are native: drop any wheel inertia so it cannot fight them.
    const cancelInertia = () => {
      if (!instance.isScrolling || instance.isStopped) return
      instance.stop()
      instance.start()
    }
    const onKey = (event: KeyboardEvent) => {
      if (NAV_KEYS.has(event.key)) cancelInertia()
    }
    window.addEventListener('keydown', onKey, true)
    window.addEventListener('focusin', cancelInertia, true)
    return () => {
      window.removeEventListener('keydown', onKey, true)
      window.removeEventListener('focusin', cancelInertia, true)
      observer.disconnect()
      gsap.ticker.remove(tick)
      instance.destroy()
      setLenis(null)
    }
  }, [motionAllowed])

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
      if (!threadRef.current) return
      gsap.fromTo(
        threadRef.current,
        { scaleX: 0 },
        { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } },
      )
    })
  })

  // Lazy images and route changes alter the page height; keep trigger positions current.
  useEffect(() => {
    let timer = 0
    const ro = new ResizeObserver(() => {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 200)
    })
    ro.observe(document.body)
    return () => {
      window.clearTimeout(timer)
      ro.disconnect()
    }
  }, [])

  // Stitched rules sew themselves in once, when a quarter of the way into the viewport.
  useEffect(() => {
    const watched = new Set<Element>()
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.setAttribute('data-stitched', '')
          io.unobserve(entry.target)
          watched.delete(entry.target)
        }),
      { rootMargin: '0px 0px -20% 0px' },
    )
    const sync = () => {
      // Forget rules removed by navigation, then pick up newly rendered ones.
      watched.forEach((el) => {
        if (el.isConnected) return
        io.unobserve(el)
        watched.delete(el)
      })
      document.querySelectorAll('.stitch:not([data-stitched])').forEach((el) => {
        if (watched.has(el)) return
        watched.add(el)
        io.observe(el)
      })
    }
    sync()
    const mo = new MutationObserver(sync)
    mo.observe(document.getElementById('main-content') ?? document.body, {
      childList: true,
      subtree: true,
    })
    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [])

  return <div ref={threadRef} className="scroll-thread" aria-hidden="true" />
}
