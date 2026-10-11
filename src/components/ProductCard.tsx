import { useState } from 'react'
import { Check, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ProductArtwork } from '@/components/ProductArtwork'
import { useBasket } from '@/context/BasketContext'
import type { Product } from '@/data/products'
import { cn } from '@/lib/utils'

function Gallery({ product }: { product: Product }) {
  const photos = [product.image, product.alt, ...(product.gallery ?? [])].filter(
    (photo): photo is string => Boolean(photo),
  )
  const [active, setActive] = useState(0)
  const cover = (src: string) => src.startsWith('/gifts/') || src !== product.image
  return (
    <div>
      <div className="aspect-[4/3] overflow-hidden rounded-md bg-white">
        <img
          src={photos[active]}
          alt={`${product.name}, photo ${active + 1} of ${photos.length}`}
          className={cn(
            'h-full w-full',
            cover(photos[active]) ? 'object-cover' : 'object-contain p-6 mix-blend-multiply',
          )}
        />
      </div>
      {photos.length > 1 && (
        <div className="mt-2 flex gap-2" role="group" aria-label="Product photos">
          {photos.map((src, i) => (
            <button
              key={src}
              type="button"
              aria-label={`Show photo ${i + 1}`}
              aria-pressed={active === i}
              onClick={() => setActive(i)}
              className={cn(
                'h-14 w-14 overflow-hidden rounded-sm border-2 bg-white',
                active === i ? 'border-ink' : 'border-transparent opacity-70 hover:opacity-100',
              )}
            >
              <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function ProductCard({ product }: { product: Product }) {
  const { items, add } = useBasket()
  const [open, setOpen] = useState(false)
  const selected = items.some((item) => item.productId === product.id)
  return (
    <article className="product-card min-w-0">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            className="group relative mb-4 block aspect-square w-full overflow-hidden rounded-md bg-white"
            aria-label={`View ${product.name} details`}
          >
            <ProductArtwork product={product} swap />
            {product.alt && (
              <span className="absolute bottom-2.5 right-2.5 rounded-sm bg-white/90 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground transition-opacity group-hover:opacity-0">
                {product.category === 'Gift sets'
                  ? 'Open'
                  : product.category === 'Marketing material & gifts'
                    ? 'In use'
                    : 'Worn'}
              </span>
            )}
          </button>
        </DialogTrigger>
        <DialogContent className="max-h-[92dvh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">{product.name}</DialogTitle>
            <DialogDescription>
              {product.id} · {product.category}
            </DialogDescription>
          </DialogHeader>
          <Gallery product={product} />
          <p className="text-sm leading-relaxed">{product.description}</p>
          <dl className="grid grid-cols-[110px_1fr] gap-x-3 gap-y-3 border-t pt-4 text-sm">
            <dt className="text-muted-foreground">Shown in</dt>
            <dd>{product.colourName}</dd>
            {product.colours && (
              <>
                <dt className="text-muted-foreground">Colour range</dt>
                <dd>{product.colours}</dd>
              </>
            )}
            <dt className="text-muted-foreground">Sizes</dt>
            <dd>{product.sizes}</dd>
            <dt className="text-muted-foreground">Usual branding</dt>
            <dd>{product.branding}</dd>
          </dl>
          <p className="rounded-md bg-secondary p-3 text-xs leading-5 text-muted-foreground">
            Colours, sizes and stock change with supplier ranges. Linton confirms availability,
            pricing and the best branding method on your quote.
          </p>
          <Button
            disabled={selected}
            className="sticky bottom-0 h-12 shadow-[0_-16px_16px_-4px_var(--background)] disabled:opacity-100"
            onClick={() => {
              add(product.id)
              setOpen(false)
            }}
          >
            {selected ? <Check size={16} /> : <Plus size={16} />}
            {selected ? 'In your quote' : 'Add to quote'}
          </Button>
        </DialogContent>
      </Dialog>
      <p className="mb-1 text-xs text-muted-foreground">{product.category}</p>
      <h3 className="text-lg font-bold leading-snug tracking-tight">{product.name}</h3>
      <p className="mt-1 text-xs text-muted-foreground">{product.branding}</p>
      <div className="mt-3">
        <Button
          className="h-9 px-3 text-xs"
          variant="outline"
          disabled={selected}
          aria-label={
            selected ? `${product.name} is in your quote` : `Add ${product.name} to quote`
          }
          onClick={() => add(product.id)}
        >
          {selected ? <Check size={14} /> : <Plus size={14} />}
          {selected ? 'In your quote' : 'Add to quote'}
        </Button>
      </div>
    </article>
  )
}
