import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/ProductCard'
import { categories, products } from '@/data/products'

export function Catalogue() {
  const [params, setParams] = useSearchParams()
  const category = categories.find((value) => value === params.get('category')) ?? 'All products'
  const query = params.get('q') ?? ''
  const [sort, setSort] = useState('curated')
  function filter(key: string, value: string) {
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
        words.every((word) =>
          `${product.name} ${product.category} ${product.description} ${product.id} ${product.colourName}`
            .toLowerCase()
            .includes(word),
        ),
    )
    return sort === 'az' ? [...found].sort((a, b) => a.name.localeCompare(b.name)) : found
  }, [category, query, sort])
  return (
    <div className="container-wide pb-20 pt-12 lg:pt-16">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="eyebrow mb-4 text-muted-foreground">The catalogue</p>
          <h1 className="page-title">
            Choose what
            <br />
            you need.
          </h1>
        </div>
        <p className="max-w-80 text-sm leading-6 text-muted-foreground">
          Corporate clothing, uniforms, promotional items and gifts. Add what you like to one quote.
        </p>
      </div>
      <div className="mb-8 border-l-4 border-signal bg-secondary px-4 py-3 text-xs leading-5 text-muted-foreground">
        <span className="font-semibold text-foreground">{products.length} sample products.</span>{' '}
        Names, artwork, colours, sizes and branding options are illustrative. Availability and
        pricing are not confirmed.
      </div>
      <div className="mb-7 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-3.5 text-muted-foreground" />
          <Input
            aria-label="Search products"
            placeholder="Search products, categories or colours…"
            className="h-12 bg-white pl-11"
            value={query}
            onChange={(e) => filter('q', e.target.value)}
          />
          {query && (
            <button
              aria-label="Clear search"
              onClick={() => filter('q', '')}
              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center bg-white"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <SlidersHorizontal size={17} className="text-muted-foreground" />
          <label htmlFor="sort" className="sr-only">
            Sort products
          </label>
          <select
            id="sort"
            className="field h-12 min-w-0 text-sm sm:min-w-44"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="curated">Curated order</option>
            <option value="az">Name: A–Z</option>
          </select>
        </div>
      </div>
      <div
        className="sticky top-0 z-10 -mx-[20px] mb-7 flex gap-2 overflow-x-auto bg-background px-[20px] py-3 sm:static sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:py-0"
        role="group"
        aria-label="Product categories"
      >
        {['All products', ...categories].map((value) => (
          <button
            key={value}
            className={`shrink-0 rounded-sm border px-4 py-2.5 text-sm transition-colors ${category === value ? 'border-ink bg-ink text-white' : 'bg-white text-muted-foreground hover:border-primary hover:text-primary'}`}
            aria-pressed={category === value}
            onClick={() => filter('category', value)}
          >
            {value}
          </button>
        ))}
      </div>
      <div className="mb-6 flex items-center justify-between border-t pt-5">
        <p className="text-xs text-muted-foreground" role="status">
          {results.length} {results.length === 1 ? 'product' : 'products'}
          {category !== 'All products' ? ` · ${category}` : ''}
        </p>
        {(query || category !== 'All products') && (
          <Button variant="ghost" className="h-7 text-xs" onClick={() => setParams({})}>
            Reset filters
          </Button>
        )}
      </div>
      {results.length ? (
        <div className="product-grid gap-x-5 gap-y-10 lg:gap-x-7">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-md border border-dashed py-20 text-center">
          <Search size={28} className="mx-auto mb-5 text-muted-foreground" />
          <h2 className="mb-2 text-xl font-medium">Nothing here just yet.</h2>
          <p className="mb-5 text-sm text-muted-foreground">
            Try a different term or explore another category.
          </p>
          <Button variant="outline" onClick={() => setParams({})}>
            Show all products
          </Button>
        </div>
      )}
    </div>
  )
}
