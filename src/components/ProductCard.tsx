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

export function ProductCard({ product }: { product: Product }) {
  const { items, add } = useBasket()
  const [open, setOpen] = useState(false)
  const selected = items.some((item) => item.productId === product.id)
  return (
    <article className="product-card min-w-0">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            className="relative mb-4 block aspect-[1.06] w-full overflow-hidden rounded-md bg-[#c3cdcc]"
            aria-label={`View ${product.name} details`}
          >
            <span className="absolute left-3 top-3 z-10 rounded-sm bg-ink px-2 py-1 text-[11px] font-medium tracking-wider text-white">
              SAMPLE
            </span>
            <ProductArtwork product={product} />
          </button>
        </DialogTrigger>
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{product.name}</DialogTitle>
            <DialogDescription>
              Sample product · {product.id} · {product.category}
            </DialogDescription>
          </DialogHeader>
          <div className="mx-auto h-52 w-full rounded-md bg-[#c3cdcc]">
            <ProductArtwork product={product} />
          </div>
          <p className="text-sm leading-relaxed">{product.description}</p>
          <dl className="grid grid-cols-[100px_1fr] gap-x-3 gap-y-3 text-sm">
            <dt className="text-muted-foreground">Colour</dt>
            <dd>{product.colourName} (illustrative)</dd>
            <dt className="text-muted-foreground">Sizes</dt>
            <dd>{product.sizes}</dd>
            <dt className="text-muted-foreground">Branding</dt>
            <dd>{product.branding}</dd>
          </dl>
          <p className="rounded-md bg-secondary p-3 text-sm text-muted-foreground">
            This is an invented catalogue example. Availability, specifications, minimum quantities,
            pricing and branding suitability need supplier confirmation.
          </p>
          <Button
            disabled={selected}
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
      <h3 className="text-lg font-bold tracking-tight">{product.name}</h3>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <span className="flex items-center gap-2 text-xs text-muted-foreground">
          <span
            className="h-3 w-3 rounded-sm border border-black/10"
            style={{ background: product.colour }}
          />
          {product.colourName}
        </span>
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
