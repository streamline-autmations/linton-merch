import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { ProductCard } from '@/components/ProductCard'
import type { Product } from '@/data/products'
import { prefersReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

/**
 * A swipeable row of product cards under a heading row (heading left; link right). Phones swipe,
 * with the next card peeking in and a stitched progress thread below; from 768px mouse users also
 * get arrows. With `grid`, it settles into a four-up grid on desktop and the arrows step aside.
 * `tone="dark"` sits the row on an ink band: cards become white panels.
 */
export function ProductRail({
  items,
  label,
  heading,
  action,
  grid = false,
  tone = 'light',
}: {
  items: Product[]
  label: string
  heading: ReactNode
  action?: ReactNode
  grid?: boolean
  tone?: 'light' | 'dark'
}) {
  const rail = useRef<HTMLDivElement>(null)
  const move = (dir: 1 | -1) => {
    const el = rail.current
    if (!el) return
    const card = el.querySelector<HTMLElement>('[role="listitem"]')
    el.scrollBy({
      left: dir * ((card?.offsetWidth ?? 300) + 20) * 2,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    })
  }
  const dark = tone === 'dark'
  return (
    <>
      <div className="container-wide mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-4 lg:mb-10">
        <div>{heading}</div>
        <div className="flex items-center gap-5">
          {action}
          {/* Arrows for mouse users on wider screens; phones swipe. */}
          <div className={cn('hidden gap-2 md:flex', grid && 'lg:hidden')}>
            {([-1, 1] as const).map((dir) => (
              <button
                key={dir}
                type="button"
                onClick={() => move(dir)}
                aria-label={`${dir === 1 ? 'Next' : 'Previous'}: ${label}`}
                className={cn(
                  'flex h-11 w-11 items-center justify-center rounded-sm border transition-colors',
                  dark
                    ? 'border-white/30 text-white hover:border-white hover:bg-white hover:text-ink'
                    : 'border-ink/20 bg-white hover:border-ink hover:bg-ink hover:text-white',
                )}
              >
                {dir === 1 ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div
        ref={rail}
        className={cn('rail rail-narrow', grid && 'rail-grid', dark && 'rail-on-dark')}
        tabIndex={0}
        role="list"
        aria-label={label}
      >
        {items.map((product) => (
          <div role="listitem" key={product.id}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
      <RailProgress rail={rail} dark={dark} />
    </>
  )
}

/** A dashed thread with a solid run showing how much of the row is in view and where. */
export function RailProgress({
  rail,
  dark,
}: {
  rail: RefObject<HTMLElement | null>
  dark: boolean
}) {
  const thumb = useRef<HTMLSpanElement>(null)
  const [scrollable, setScrollable] = useState(false)
  useEffect(() => {
    const el = rail.current
    if (!el) return
    let frame = 0
    const update = () => {
      frame = 0
      const max = el.scrollWidth - el.clientWidth
      setScrollable(max > 2)
      if (!thumb.current || max <= 2) return
      const size = el.clientWidth / el.scrollWidth
      const at = el.scrollLeft / max
      thumb.current.style.width = `${size * 100}%`
      thumb.current.style.transform = `translateX(${((at * (1 - size)) / size) * 100}%)`
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    el.addEventListener('scroll', schedule, { passive: true })
    const ro = new ResizeObserver(schedule)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', schedule)
      ro.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [rail])
  return (
    <div
      className={cn(
        'rail-progress container-wide',
        dark && 'rail-progress-dark',
        !scrollable && 'hidden',
      )}
      aria-hidden="true"
    >
      <span ref={thumb} className="rail-progress-thumb" />
    </div>
  )
}
