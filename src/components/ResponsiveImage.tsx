import type { ImgHTMLAttributes } from 'react'
import manifest from '@/data/image-manifest.json'

type ImageAsset = { width: number; height: number; src: string; webp: string; avif: string }
const assets: Record<string, ImageAsset> = manifest

/** All candidates retain the source aspect ratio; layout is reserved before decoding. */
export function ResponsiveImage({
  src = '',
  alt,
  sizes = '100vw',
  loading = 'lazy',
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
  const asset = assets[src]
  return (
    <picture className="contents">
      {asset && <source type="image/avif" srcSet={asset.avif} sizes={sizes} />}
      <img
        decoding="async"
        {...props}
        src={asset?.src ?? src}
        srcSet={asset?.webp}
        sizes={sizes}
        width={asset?.width ?? props.width}
        height={asset?.height ?? props.height}
        loading={loading}
        alt={alt}
      />
    </picture>
  )
}
