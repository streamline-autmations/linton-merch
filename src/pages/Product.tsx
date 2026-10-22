import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Check, ChevronRight, Expand, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { ResponsiveImage } from '@/components/ResponsiveImage'
import { ProductRail } from '@/components/ProductRail'
import { Quantity } from '@/components/BasketItems'
import { useBasket } from '@/context/BasketContext'
import { productBySlug, relatedProducts, type Product } from '@/data/products'
import { setPageMeta } from '@/lib/meta'
import { prefersReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

function photosOf(product: Product) {
  return [product.image, product.alt, ...(product.gallery ?? [])].filter((photo): photo is string =>
    Boolean(photo),
  )
}

// The main supplier shot sits on white, so it gets breathing room; lifestyle and gift photos fill.
const isPlate = (product: Product, src: string) =>
  (src === product.image && !src.startsWith('/gifts/')) || /-gh(bk|si|fr)/.test(src)

/** Swipe on phones, thumbnails on wider screens, tap a photo to see it large. */
function Gallery({ product }: { product: Product }) {
  const photos = photosOf(product)
  const track = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [zoom, setZoom] = useState<number | null>(null)
  // The zoom dialog is opened from code, so focus goes back to the photo that opened it.
  const opener = useRef<HTMLButtonElement | null>(null)
  const go = (i: number) => {
    const el = track.current
    if (!el) return
    el.scrollTo({ left: i * el.clientWidth, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
    setActive(i)
  }
  return (
    <div className="min-w-0">
      <div
        ref={track}
        className="gallery-track flex aspect-square snap-x snap-mandatory overflow-x-auto rounded-md bg-white [scrollbar-width:none]"
        onScroll={(e) => {
          const el = e.currentTarget
          setActive(Math.round(el.scrollLeft / Math.max(el.clientWidth, 1)))
        }}
      >
        {photos.map((src, i) => (
          <button
            key={src}
            type="button"
            className="group relative h-full w-full shrink-0 snap-center"
            aria-label={`Enlarge photo ${i + 1} of ${photos.length}`}
            onClick={(event) => {
              opener.current = event.currentTarget
              setZoom(i)
            }}
          >
            <ResponsiveImage
              src={src}
              alt={`${product.name}, photo ${i + 1} of ${photos.length}`}
              loading={i === 0 ? 'eager' : 'lazy'}
              fetchPriority={i === 0 ? 'high' : undefined}
              sizes="(min-width: 1024px) 50vw, calc(100vw - 40px)"
              className={cn(
                'h-full w-full object-contain',
                isPlate(product, src) && 'p-[8%] mix-blend-multiply',
              )}
            />
            <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-sm bg-white/90 text-ink opacity-80 transition-opacity group-hover:opacity-100">
              <Expand size={16} aria-hidden="true" />
            </span>
          </button>
        ))}
      </div>
      {photos.length > 1 && (
        <>
          <div className="mt-3 flex justify-center gap-1.5 md:hidden" aria-hidden="true">
            {photos.map((src, i) => (
              <span
                key={src}
                className={cn(
                  'h-1.5 rounded-full transition-all',
                  i === active ? 'w-5 bg-ink' : 'w-1.5 bg-ink/25',
                )}
              />
            ))}
          </div>
          <div className="mt-3 hidden gap-2 md:flex" role="group" aria-label="Product photos">
            {photos.map((src, i) => (
              <button
                key={src}
                type="button"
                aria-label={`Show photo ${i + 1}`}
                aria-pressed={active === i}
                onClick={() => go(i)}
                className={cn(
                  'h-16 w-16 overflow-hidden rounded-sm border-2 bg-white transition-opacity',
                  active === i ? 'border-ink' : 'border-transparent opacity-70 hover:opacity-100',
                )}
              >
                <ResponsiveImage
                  src={src}
                  sizes="64px"
                  alt=""
                  className="h-full w-full object-contain"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </>
      )}
      <Dialog open={zoom !== null} onOpenChange={(open) => !open && setZoom(null)}>
        <DialogContent
          className="max-h-[92dvh] w-[calc(100vw-24px)] max-w-4xl p-3 sm:p-4"
          onCloseAutoFocus={(event) => {
            event.preventDefault()
            opener.current?.focus({ preventScroll: true })
          }}
        >
          <DialogTitle className="sr-only">{product.name}</DialogTitle>
          <DialogDescription className="sr-only">
            Photo {(zoom ?? 0) + 1} of {photos.length}
          </DialogDescription>
          {zoom !== null && (
            <ResponsiveImage
              src={photos[zoom]}
              alt={`${product.name}, photo ${zoom + 1} of ${photos.length}`}
              sizes="(min-width: 920px) 880px, 100vw"
              loading="eager"
              className="max-h-[84dvh] w-full rounded-sm bg-white object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function AddToQuote({ product, compact = false }: { product: Product; compact?: boolean }) {
  const { items, add, setDrawerOpen } = useBasket()
  const inQuote = items.find((item) => item.productId === product.id)
  const [quantity, setQuantity] = useState(inQuote?.quantity ?? 25)
  const savedQuantity = inQuote?.quantity
  useEffect(() => {
    if (savedQuantity !== undefined) setQuantity(savedQuantity)
  }, [savedQuantity])
  const changed = inQuote && inQuote.quantity !== quantity
  return (
    <div className={cn('flex items-center gap-3', compact && 'gap-2')}>
      <Quantity value={quantity} name={product.name} onChange={setQuantity} />
      {inQuote && !changed ? (
        <Button
          variant="outline"
          className={cn('h-12 flex-1 px-5', compact && 'h-11 px-3')}
          onClick={() => setDrawerOpen(true)}
        >
          <Check size={16} /> In your quote
        </Button>
      ) : (
        <Button
          className={cn('h-12 flex-1 px-5', compact && 'h-11 px-3')}
          onClick={() => add(product.id, quantity)}
        >
          <Plus size={16} /> {changed ? 'Update quantity' : 'Add to quote'}
        </Button>
      )}
    </div>
  )
}

function NotFound() {
  useEffect(() => setPageMeta({ title: 'Product not found' }), [])
  return (
    <section className="container-wide py-20">
      <p className="eyebrow mb-5 text-muted-foreground">Product not found</p>
      <h1 className="page-title mb-6">We can’t find that one.</h1>
      <Button asChild className="h-12 px-6">
        <Link to="/catalogue">Browse the catalogue</Link>
      </Button>
    </section>
  )
}

export function ProductPage() {
  const { slug = '' } = useParams()
  const product = productBySlug.get(slug)
  // Keyed so a "More like this" jump starts fresh: first photo, its own quantity.
  return product ? <ProductView key={product.id} product={product} /> : <NotFound />
}

function ProductView({ product }: { product: Product }) {
  const navigate = useNavigate()
  useEffect(() => {
    setPageMeta({ title: product.name, description: product.description, image: product.image })
  }, [product])

  const categoryHref = `/catalogue?category=${encodeURIComponent(product.category)}`
  // Back returns to the exact catalogue view (filters and scroll) when we came from inside the
  // site; a direct visit goes to the product's category instead.
  const cameFromSite = (window.history.state?.idx ?? 0) > 0
  const related = relatedProducts(product)
  const facts = [
    ['Shown in', product.colourName],
    ['Colours', product.colours],
    ['Sizes', product.sizes],
    ['Branding', product.branding],
  ].filter((row): row is [string, string] => Boolean(row[1]))

  return (
    <>
      <div className="container-wide pb-14 pt-5 lg:pb-24 lg:pt-8">
        <div className="mb-5 flex items-center justify-between gap-4 lg:mb-8">
          <nav aria-label="Breadcrumb" className="min-w-0 text-sm text-muted-foreground">
            <ol className="flex min-w-0 items-center gap-1.5">
              <li>
                <Link to="/catalogue" className="hover:text-ink">
                  Catalogue
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight size={14} />
              </li>
              <li className="min-w-0 truncate">
                <Link to={categoryHref} className="hover:text-ink">
                  {product.category}
                </Link>
              </li>
              <li aria-hidden="true" className="hidden md:block">
                <ChevronRight size={14} />
              </li>
              <li className="hidden truncate text-ink md:block" aria-current="page">
                {product.name}
              </li>
            </ol>
          </nav>
          <Button
            variant="ghost"
            className="-mr-3 h-11 shrink-0 px-3"
            onClick={() => (cameFromSite ? navigate(-1) : navigate(categoryHref))}
          >
            <ArrowLeft size={16} /> Back
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
          <Gallery product={product} />
          <div className="lg:sticky lg:top-[calc(var(--header-offset,0px)+2rem)] lg:self-start">
            <p className="eyebrow mb-3 text-muted-foreground">{product.category}</p>
            <h1 className="text-[clamp(2rem,4vw,3.4rem)] font-bold leading-[1.02] tracking-[-0.04em] [font-family:var(--font-display)]">
              {product.name}
            </h1>
            <p className="mt-4 max-w-md text-base leading-7 text-muted-foreground">
              {product.description}
            </p>
            <dl className="mt-7 border-t text-sm">
              {facts.map(([label, value]) => (
                <div key={label} className="grid grid-cols-[6.5rem_1fr] gap-3 border-b py-3">
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-7 hidden lg:block">
              <AddToQuote product={product} />
            </div>
            <p className="mt-5 border-l-4 border-brand-blue bg-secondary px-4 py-3 text-xs leading-5 text-muted-foreground">
              No prices or stock in this demo. Linton confirms both on your quote.
            </p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="border-t bg-secondary py-12 lg:py-20" aria-labelledby="related-title">
          <ProductRail
            label="More like this"
            items={related}
            heading={
              <h2 id="related-title" className="section-title">
                More like this
              </h2>
            }
          />
        </section>
      )}

      {/* Phones: quantity and add stay in reach at the bottom of the screen. */}
      <div className="sticky-add fixed inset-x-0 bottom-0 z-30 border-t bg-background px-5 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_24px_-12px_rgb(11_42_91/0.25)] lg:hidden">
        <AddToQuote product={product} compact />
      </div>
    </>
  )
}
