import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductArtwork } from '@/components/ProductArtwork'
import { useBasket } from '@/context/BasketContext'
import { productPath, type Product } from '@/data/products'
import { prefersReducedMotion } from '@/lib/motion'

const SHOW_AFTER = 1500 // ms in view before the second photo shows
const SHOW_FOR = 3000 // ms it stays before the main photo returns

/**
 * Touch screens have no hover, so a card with a second photo shows it on its own: once the card
 * has sat in view for a moment, the photo swaps, then swaps back. Once per visit to the screen
 * (scroll or swipe it back in to see it again), so nothing loops. Off for reduced motion.
 */
function useTouchPreview(enabled: boolean) {
  const ref = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)
  const [showing, setShowing] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || !enabled || !window.matchMedia('(hover: none)').matches || prefersReducedMotion())
      return
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.7,
    })
    io.observe(el)
    return () => io.disconnect()
  }, [enabled])
  useEffect(() => {
    if (!inView) return setShowing(false)
    const show = window.setTimeout(() => setShowing(true), SHOW_AFTER)
    const hide = window.setTimeout(() => setShowing(false), SHOW_AFTER + SHOW_FOR)
    return () => {
      window.clearTimeout(show)
      window.clearTimeout(hide)
    }
  }, [inView])
  return { ref, inView, showing }
}

export function ProductCard({ product }: { product: Product }) {
  const { items, add } = useBasket()
  // The second photo loads only once a mouse or keyboard shows interest in the card.
  const [previewReady, setPreviewReady] = useState(false)
  const selected = items.some((item) => item.productId === product.id)
  const href = productPath(product)
  const touch = useTouchPreview(Boolean(product.alt))
  return (
    <article
      ref={touch.ref}
      className="product-card min-w-0"
      data-product-id={product.id}
      data-flip-id={product.id}
      data-selected={selected || undefined}
      data-show-alt={touch.showing || undefined}
    >
      <Link
        to={href}
        className="product-photo group relative mb-3 block aspect-square w-full overflow-hidden rounded-md bg-white"
        onPointerEnter={(event) => {
          if (event.pointerType === 'mouse') setPreviewReady(true)
        }}
        tabIndex={-1}
        aria-hidden="true"
      >
        <ProductArtwork product={product} swap={previewReady || touch.inView} />
      </Link>
      <h3 className="product-name text-base font-bold leading-snug tracking-tight sm:text-lg">
        <Link
          to={href}
          className="relative hover:underline hover:underline-offset-4 after:absolute after:-inset-y-3 after:inset-x-0"
          onFocus={() => setPreviewReady(true)}
        >
          {product.name}
        </Link>
      </h3>
      <p className="mt-1 text-xs text-muted-foreground">{product.branding}</p>
      <Button
        className="quick-add mt-3 h-11 w-full px-3 text-xs sm:w-auto"
        variant="outline"
        disabled={selected}
        aria-label={selected ? `${product.name} is in your quote` : `Add ${product.name} to quote`}
        onClick={() => add(product.id)}
      >
        {selected ? <Check size={14} /> : <Plus size={14} />}
        {selected ? 'In your quote' : 'Add to quote'}
      </Button>
    </article>
  )
}
