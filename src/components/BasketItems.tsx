import { useEffect, useState } from 'react'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useBasket } from '@/context/BasketContext'
import { ProductArtwork } from '@/components/ProductArtwork'
import { productById } from '@/data/products'
import { clampQuantity } from '@/lib/quote'

export function Quantity({
  value,
  name,
  onChange,
}: {
  value: number
  name: string
  onChange: (value: number) => void
}) {
  const [draft, setDraft] = useState(String(value))
  useEffect(() => setDraft(String(value)), [value])
  function commit() {
    const next = clampQuantity(Number(draft))
    setDraft(String(next))
    onChange(next)
  }
  return (
    <div className="flex h-12 items-center rounded-md border bg-white">
      <button
        type="button"
        aria-label={`Decrease ${name} quantity`}
        disabled={value <= 1}
        className="flex h-full w-11 items-center justify-center disabled:opacity-30"
        onClick={() => onChange(value - 1)}
      >
        <Minus size={14} />
      </button>
      <input
        type="number"
        min={1}
        max={10000}
        step={1}
        inputMode="numeric"
        aria-label={`${name} quantity`}
        className="h-full w-12 bg-transparent text-center text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
      />
      <button
        type="button"
        aria-label={`Increase ${name} quantity`}
        disabled={value >= 10000}
        className="flex h-full w-11 items-center justify-center disabled:opacity-30"
        onClick={() => onChange(value + 1)}
      >
        <Plus size={14} />
      </button>
    </div>
  )
}

export function BasketItems({ preferences = false }: { preferences?: boolean }) {
  const { items, update, remove } = useBasket()
  return (
    <div className="divide-y">
      {items.map((item) => {
        const product = productById.get(item.productId)!
        return (
          <article key={item.productId} className="py-5">
            <div className="flex gap-3">
              <div className="h-[64px] w-[64px] shrink-0 overflow-hidden rounded-md bg-white">
                <ProductArtwork product={product} sizes="64px" />
              </div>
              <div className="min-w-0 flex-1 break-words">
                <h3 className="text-sm font-medium">{product.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {product.id} · {product.category}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-11 w-11 shrink-0"
                aria-label={`Remove ${product.name}`}
                onClick={() => remove(item.productId)}
              >
                <Trash2 size={16} />
              </Button>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-muted-foreground">Quantity</span>
              <Quantity
                value={item.quantity}
                name={product.name}
                onChange={(quantity) => update(item.productId, { quantity })}
              />
            </div>
            {preferences && (
              <div className="mt-3">
                <label htmlFor={`spec-${item.productId}`} className="field-label">
                  Colour, sizes & preferences{' '}
                  <span className="font-normal text-muted-foreground">(optional)</span>
                </label>
                <Input
                  id={`spec-${item.productId}`}
                  maxLength={300}
                  placeholder="e.g. navy, 10 medium + 15 large, chest logo"
                  value={item.specification}
                  onChange={(e) => update(item.productId, { specification: e.target.value })}
                />
              </div>
            )}
          </article>
        )
      })}
    </div>
  )
}
