import { useRef, type ReactNode } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { ProductCard } from '@/components/ProductCard'
import type { Product } from '@/data/products'
import { prefersReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

/**
 * A swipeable row of product cards under a heading row (heading left; link and arrows right).
 * With `grid`, it settles into a four-up grid on desktop and the arrows step aside.
 */
export function ProductRail({
  items,
  label,
  heading,
  action,
  grid = false,
}: {
  items: Product[]
  label: string
  heading: ReactNode
  action?: ReactNode
  grid?: boolean
}) {
  const rail = useRef<HTMLDivElement>(null)
  const move = (dir: 1 | -1) => {
    const el = rail.current
    if (!el) return
    const card = el.querySelector<HTMLElement>('[role="listitem"]')
    el.scrollBy({
      left: dir * ((card?.offsetWidth ?? 300) + 20) * (window.innerWidth < 768 ? 1 : 2),
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    })
  }
  return (
    <>
      <div className="container-wide mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-4 lg:mb-10">
        <div>{heading}</div>
        <div className="flex items-center gap-5">
          {action}
          {/* Arrows for mouse users on wider screens; touch swipes. */}
          <div className={cn('flex gap-2', grid && 'lg:hidden')}>
            {([-1, 1] as const).map((dir) => (
              <button
                key={dir}
                type="button"
                onClick={() => move(dir)}
                aria-label={`${dir === 1 ? 'Next' : 'Previous'}: ${label}`}
                className="flex h-11 w-11 items-center justify-center rounded-sm border border-ink/20 bg-white transition-colors hover:border-ink hover:bg-ink hover:text-white"
              >
                {dir === 1 ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div
        ref={rail}
        className={cn('rail rail-narrow', grid && 'rail-grid')}
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
    </>
  )
}
