import { useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ContactButton } from '@/components/ContactButton'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/ProductCard'
import { categories, occasions, products } from '@/data/products'
import { gsap, MOTION_OK, prefersReducedMotion, useGSAP } from '@/lib/motion'
import { Flip } from 'gsap/Flip'

gsap.registerPlugin(Flip)

export function Catalogue() {
  const [params, setParams] = useSearchParams()
  const category = categories.find((value) => value === params.get('category')) ?? 'All products'
  const query = params.get('q') ?? ''
  const occasion = occasions.find((value) => value.id === params.get('occasion'))
  const [sort, setSort] = useState('curated')
  const grid = useRef<HTMLDivElement>(null)
  const previous = useRef<ReturnType<typeof Flip.getState> | null>(null)
  function captureGrid() {
    if (!grid.current || prefersReducedMotion() || window.innerWidth < 768) return
    const visible = Array.from(grid.current.querySelectorAll<HTMLElement>('[data-product-id]'))
      .filter((el) => {
        const box = el.getBoundingClientRect()
        return box.bottom > 0 && box.top < innerHeight
      })
      .slice(0, 16)
    previous.current = Flip.getState(visible, { simple: true })
  }
  function reset() {
    captureGrid()
    setParams({}, { replace: true })
  }
  function filter(key: string, value: string) {
    captureGrid()
    const next = new URLSearchParams(params)
    if (value && value !== 'All products') next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }
  const results = useMemo(() => {
    const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
    const found = products.filter(
      (product) =>
        (category === 'All products' || product.category === category) &&
        (!occasion || product.occasions.includes(occasion.id)) &&
        words.every((word) =>
          `${product.name} ${product.category} ${product.description} ${product.id} ${product.colourName} ${product.colours ?? ''} ${product.branding}`
            .toLowerCase()
            .includes(word),
        ),
    )
    return sort === 'az' ? [...found].sort((a, b) => a.name.localeCompare(b.name)) : found
  }, [category, occasion, query, sort])
  useGSAP(
    () => {
      const state = previous.current
      previous.current = null
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        if (!grid.current) return
        if (state && window.innerWidth >= 768) {
          const targets = Array.from(grid.current.children)
            .filter((el) => {
              const box = el.getBoundingClientRect()
              return box.bottom > 0 && box.top < innerHeight
            })
            .slice(0, 16)
          Flip.from(state, {
            targets,
            duration: 0.42,
            ease: 'power3.inOut',
            scale: true,
            prune: true,
            onEnter: (elements) =>
              gsap.fromTo(elements, { opacity: 0 }, { opacity: 1, duration: 0.24 }),
          })
        } else {
          const visible = Array.from(grid.current.children)
            .filter((el) => el.getBoundingClientRect().top < innerHeight)
            .slice(0, 12)
          gsap.fromTo(
            visible,
            { opacity: 0.5, y: 6 },
            { opacity: 1, y: 0, duration: 0.28, stagger: 0.025, ease: 'power2.out' },
          )
        }
      })
      return () => mm.revert()
    },
    { scope: grid, dependencies: [results], revertOnUpdate: true },
  )
  return (
    <div className="container-wide pb-20 pt-8 lg:pt-16">
      <div className="mb-6 lg:mb-10">
        <h1 className="page-title">Catalogue</h1>
        <p className="mt-3 border-l-4 border-signal pl-3 text-sm leading-6 text-muted-foreground">
          A starting selection. Ask for anything you don’t see.
        </p>
      </div>
      <div className="mb-4 flex flex-wrap gap-2 sm:mb-7 sm:gap-4">
        <div className="relative min-w-[min(100%,9rem)] flex-1">
          <Search size={18} className="absolute left-3.5 top-3.5 text-muted-foreground" />
          <Input
            type="search"
            enterKeyHint="search"
            aria-label="Search products"
            placeholder="Search golf shirts, navy…"
            className="h-12 min-w-0 bg-white pl-11 pr-12"
            value={query}
            onChange={(e) => filter('q', e.target.value)}
          />
          {query && (
            <button
              aria-label="Clear search"
              onClick={() => filter('q', '')}
              className="absolute right-0.5 top-0.5 flex h-11 w-11 items-center justify-center bg-white"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <SlidersHorizontal size={17} className="hidden text-muted-foreground sm:block" />
          <label htmlFor="sort" className="sr-only">
            Sort products
          </label>
          <select
            id="sort"
            className="field h-12 w-28 text-sm sm:w-auto sm:min-w-44"
            value={sort}
            onChange={(e) => {
              captureGrid()
              setSort(e.target.value)
            }}
          >
            <option value="curated">Curated</option>
            <option value="az">A–Z</option>
          </select>
        </div>
      </div>
      <div
        className="sticky top-[var(--header-offset,0px)] z-10 -mx-[20px] mb-5 flex gap-2 overflow-x-auto bg-background px-[20px] py-3 transition-[top] duration-300 [scrollbar-width:none] sm:mx-0 sm:mb-7 sm:flex-wrap sm:overflow-visible sm:px-0"
        role="group"
        aria-label="Product categories"
      >
        {['All products', ...categories].map((value) => (
          <button
            key={value}
            className={`min-h-11 shrink-0 rounded-sm border px-4 py-2.5 text-sm transition-colors ${category === value ? 'border-ink bg-ink text-white' : 'bg-white text-muted-foreground hover:border-primary hover:text-primary'}`}
            aria-pressed={category === value}
            onClick={() => filter('category', value)}
          >
            {value}
          </button>
        ))}
      </div>
      <div className="mb-6 flex min-h-11 flex-wrap items-center justify-between gap-2 border-t pt-4">
        <p className="text-xs text-muted-foreground" role="status">
          {results.length} {results.length === 1 ? 'product' : 'products'}
          {category !== 'All products' ? ` · ${category}` : ''}
        </p>
        {occasion && (
          <button
            type="button"
            onClick={() => filter('occasion', '')}
            className="ml-auto inline-flex min-h-11 items-center gap-1.5 rounded-sm border border-ink px-3 text-xs"
            aria-label={`Remove occasion filter: ${occasion.label}`}
          >
            {occasion.label} <X size={13} />
          </button>
        )}
        {(query || occasion || category !== 'All products') && (
          <Button
            variant="ghost"
            className="h-11 px-3 text-xs underline underline-offset-4"
            onClick={reset}
          >
            Reset
          </Button>
        )}
      </div>
      {results.length ? (
        <div ref={grid} className="catalogue-grid product-grid gap-x-5 gap-y-10 lg:gap-x-7">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="border-y py-14 text-center">
          <h2 className="mb-2 text-2xl font-bold tracking-tight">
            Nothing matches{query ? ` “${query}”` : ''}.
          </h2>
          <p className="mb-6 text-sm text-muted-foreground">Not listed? Ask us for it.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button className="h-11 px-5" onClick={reset}>
              Show all products
            </Button>
            <ContactButton variant="outline" className="h-11 px-5" label="Ask us" />
          </div>
        </div>
      )}
    </div>
  )
}
