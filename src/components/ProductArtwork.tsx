import { ResponsiveImage } from '@/components/ResponsiveImage'
import type { Product } from '@/data/products'
import { cn } from '@/lib/utils'

// Product photo on a white plate. When the product has a second (model / lifestyle / open-box)
// photo and `swap` is set, it crossfades in on hover of the nearest `.group` ancestor.
export function ProductArtwork({
  product,
  swap = false,
  sizes = '(min-width: 1376px) 300px, (min-width: 1024px) 23vw, (min-width: 640px) 30vw, (max-width: 359px) 88vw, 44vw',
  eager = false,
}: {
  product: Product
  swap?: boolean
  sizes?: string
  eager?: boolean
}) {
  const cover = product.image.startsWith('/gifts/')
  return (
    <span className="product-artwork relative block h-full w-full">
      <ResponsiveImage
        src={product.image}
        alt=""
        sizes={sizes}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className={cn(
          'h-full w-full',
          cover ? 'object-contain' : 'object-contain p-[9%] mix-blend-multiply',
        )}
      />
      {swap && product.alt && (
        <ResponsiveImage
          src={product.alt}
          alt=""
          loading="lazy"
          decoding="async"
          sizes={sizes}
          className="product-alternate absolute inset-0 h-full w-full object-contain bg-white opacity-0"
        />
      )}
    </span>
  )
}
