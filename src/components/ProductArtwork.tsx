import type { Product } from '@/data/products'
import { cn } from '@/lib/utils'

// Product photo on a white plate. When the product has a second (model / lifestyle / open-box)
// photo and `swap` is set, it crossfades in on hover of the nearest `.group` ancestor.
export function ProductArtwork({
  product,
  swap = false,
  sizes = '(min-width: 1024px) 25vw, 50vw',
  eager = false,
}: {
  product: Product
  swap?: boolean
  sizes?: string
  eager?: boolean
}) {
  const cover = product.image.startsWith('/gifts/')
  return (
    <span className="relative block h-full w-full">
      <img
        src={product.image}
        alt=""
        sizes={sizes}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className={cn(
          'h-full w-full',
          cover ? 'object-cover' : 'object-contain p-[9%] mix-blend-multiply',
        )}
      />
      {swap && product.alt && (
        <img
          src={product.alt}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
        />
      )}
    </span>
  )
}
