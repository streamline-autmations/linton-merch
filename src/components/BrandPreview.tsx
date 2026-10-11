import { useEffect, useId, useRef, useState } from 'react'
import { Check, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useBasket } from '@/context/BasketContext'
import { productById } from '@/data/products'
import { cn } from '@/lib/utils'

// "Put your name on it": the visitor types their company name and sees it applied to real
// product photos with the usual branding method. Positions are in a 1000×1000 viewBox that
// matches the square supplier photos. It is a sketch, not a proof, and says so.
type Method = 'embroidery' | 'engraving' | 'print'
interface Canvas {
  id: string
  label: string
  method: Method
  methodLabel: string
  productId: string
  image: string
  x: number
  y: number
  maxWidth: number
  baseSize: number
  rotate?: number
}

const canvases: Canvas[] = [
  {
    id: 'shirt',
    label: 'Golf shirt',
    method: 'embroidery',
    methodLabel: 'Embroidered, left chest',
    productId: 'LM-014',
    image: '/products/alt-bbm-n.webp',
    x: 665,
    y: 335,
    maxWidth: 150,
    baseSize: 26,
  },
  {
    id: 'cap',
    label: 'Cap',
    method: 'embroidery',
    methodLabel: 'Embroidered, front panel',
    productId: 'LM-019',
    image: '/products/cap-1008-n.webp',
    x: 440,
    y: 360,
    maxWidth: 190,
    baseSize: 40,
    rotate: -4,
  },
  {
    id: 'bottle',
    label: 'Bottle',
    method: 'engraving',
    methodLabel: 'Laser engraved',
    productId: 'LM-016',
    image: '/products/gp-al-68-b-bl-no-logo.webp',
    x: 490,
    y: 590,
    maxWidth: 440,
    baseSize: 46,
    rotate: -90,
  },
  {
    id: 'tote',
    label: 'Tote',
    method: 'print',
    methodLabel: 'Screen printed, one colour',
    productId: 'LM-024',
    image: '/products/idea-1142-bl-no-logo.webp',
    x: 470,
    y: 680,
    maxWidth: 330,
    baseSize: 64,
  },
]

const threads = [
  { name: 'White thread', value: '#f4f4f0' },
  { name: 'Teal thread', value: '#2ec4b6' },
  { name: 'Gold thread', value: '#d8b25a' },
]

function fitSize(text: string, canvas: Canvas) {
  // Rough average glyph width for the uppercase display face at 0.04em tracking.
  const estimate = text.length * 0.7
  return Math.min(canvas.baseSize, canvas.maxWidth / Math.max(estimate, 1))
}

export function BrandPreview() {
  const [name, setName] = useState('')
  const [active, setActive] = useState(canvases[0])
  const [thread, setThread] = useState(threads[0])
  const { items, add } = useBasket()
  const inputId = useId()
  // The first stitch happens when the preview scrolls into view, not on page load off-screen.
  const figureRef = useRef<HTMLElement>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = figureRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -30% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  const text = (name.trim() || 'Your brand').toUpperCase().slice(0, 28)
  const size = fitSize(text, active)
  const product = productById.get(active.productId)!
  const inQuote = items.some((item) => item.productId === active.productId)
  const fill =
    active.method === 'embroidery'
      ? thread.value
      : active.method === 'engraving'
        ? '#c9ccce'
        : '#0e161d'

  return (
    <section className="border-y bg-white" aria-labelledby="brand-preview-title">
      <div className="container-wide grid gap-8 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:grid-rows-[auto_1fr] lg:gap-x-16 lg:gap-y-0 lg:py-24">
        <div className="lg:self-end">
          <p className="eyebrow mb-5 flex items-center gap-3 text-muted-foreground">
            <span className="stitch w-8 text-signal" /> Try it
          </p>
          <h2 id="brand-preview-title" className="section-title max-w-md">
            Put your name on it.
          </h2>
          <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">
            Type your company name and see how it could look stitched, engraved or printed. When you
            are ready, Linton works from your real logo files.
          </p>
        </div>
        <div className="order-3 lg:order-none lg:col-start-1 lg:row-start-2">
          <label htmlFor={inputId} className="field-label lg:mt-8">
            Company name
          </label>
          <input
            id={inputId}
            className="field h-14 text-lg font-medium"
            placeholder="e.g. Vaal Engineering"
            maxLength={28}
            autoComplete="organization"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="mt-6" role="group" aria-label="Product to preview">
            <div className="flex flex-wrap gap-2">
              {canvases.map((canvas) => (
                <button
                  key={canvas.id}
                  type="button"
                  aria-pressed={active.id === canvas.id}
                  onClick={() => setActive(canvas)}
                  className={cn(
                    'rounded-sm border px-4 py-2.5 text-sm transition-colors',
                    active.id === canvas.id
                      ? 'border-ink bg-ink text-white'
                      : 'bg-white text-muted-foreground hover:border-ink hover:text-ink',
                  )}
                >
                  {canvas.label}
                </button>
              ))}
            </div>
          </div>
          {active.method === 'embroidery' && (
            <div className="mt-5 flex items-center gap-3" role="group" aria-label="Thread colour">
              <span className="text-xs text-muted-foreground">Thread</span>
              {threads.map((option) => (
                <button
                  key={option.name}
                  type="button"
                  aria-label={option.name}
                  aria-pressed={thread.name === option.name}
                  onClick={() => setThread(option)}
                  className={cn(
                    'h-7 w-7 rounded-full border-2 transition-transform',
                    thread.name === option.name
                      ? 'scale-110 border-ink'
                      : 'border-black/10 hover:scale-105',
                  )}
                  style={{ background: option.value }}
                />
              ))}
            </div>
          )}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              className="h-auto min-h-12 max-w-full whitespace-normal px-5 py-3 text-left"
              disabled={inQuote}
              onClick={() => add(active.productId)}
            >
              {inQuote ? <Check size={16} /> : <Plus size={16} />}
              {inQuote ? 'In your quote' : `Add this ${active.label.toLowerCase()} to my quote`}
            </Button>
          </div>
        </div>

        <figure
          ref={figureRef}
          className="relative order-2 lg:order-none lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center"
        >
          <div className="relative aspect-square overflow-hidden rounded-md bg-[#f6f7f6]">
            <img
              key={active.image}
              src={active.image}
              alt={`${product.name} preview`}
              className="brand-fade absolute inset-0 h-full w-full object-contain mix-blend-multiply"
            />
            <svg
              viewBox="0 0 1000 1000"
              className="absolute inset-0 h-full w-full"
              aria-hidden="true"
            >
              <defs>
                <filter id="thread-shadow" x="-10%" y="-30%" width="120%" height="160%">
                  <feDropShadow dx="0" dy="1.2" stdDeviation="0.8" floodOpacity="0.55" />
                </filter>
                <filter id="engrave" x="-10%" y="-30%" width="120%" height="160%">
                  <feDropShadow
                    dx="0"
                    dy="-0.8"
                    stdDeviation="0.3"
                    floodColor="#000"
                    floodOpacity="0.9"
                  />
                </filter>
              </defs>
              {seen && (
                <text
                  key={`${active.id}-${text}-${thread.value}`}
                  x={active.x}
                  y={active.y}
                  transform={
                    active.rotate ? `rotate(${active.rotate} ${active.x} ${active.y})` : undefined
                  }
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={size}
                  // Hard cap: never let a long name run past the branding area.
                  textLength={
                    text.length * size * 0.7 > active.maxWidth ? active.maxWidth : undefined
                  }
                  lengthAdjust="spacingAndGlyphs"
                  className={cn('brand-mark', `brand-${active.method}`)}
                  fill={fill}
                  stroke={active.method === 'embroidery' ? fill : 'none'}
                  filter={
                    active.method === 'embroidery'
                      ? 'url(#thread-shadow)'
                      : active.method === 'engraving'
                        ? 'url(#engrave)'
                        : undefined
                  }
                >
                  {text}
                </text>
              )}
            </svg>
            <span className="absolute left-3 top-3 rounded-sm bg-ink px-2 py-1 text-[11px] font-medium tracking-wider text-white">
              {active.methodLabel.toUpperCase()}
            </span>
          </div>
          <figcaption className="mt-3 text-xs leading-5 text-muted-foreground">
            A quick sketch to help you picture it, not an artwork proof. Logo placement, size and
            thread or ink colours are confirmed with you before production.
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
