import { ResponsiveImage } from '@/components/ResponsiveImage'
import { business } from '@/data/business'

// Real brand marks for the ranges Linton lists on lintonent.co.za. Sources are recorded in
// docs/IMAGE_PROVENANCE.md. A brand without a sourced file renders as a plain wordmark: never a
// drawn or imitated logo. `ratio` is width / height of the trimmed file.
const logos: Record<string, { src: string; ratio: number; scale?: number }> = {
  Altitude: { src: '/brands/altitude.png', ratio: 87 / 19 },
  Slazenger: { src: '/brands/slazenger.svg', ratio: 1000 / 206 },
  'Cutter & Buck': { src: '/brands/cutter-buck.png', ratio: 563 / 160 },
  Elevate: { src: '/brands/elevate.png', ratio: 209 / 59 },
  Ogio: { src: '/brands/ogio.png', ratio: 245 / 60 },
  Polo: { src: '/brands/polo.png', ratio: 177 / 240, scale: 0.95 },
  // Optical corrections: Billboard's heavy letterforms read larger, Polo's fine crest smaller.
  Billboard: { src: '/brands/billboard.svg', ratio: 327 / 69, scale: 0.82 },
}

// Equal visual area rather than equal height, so a tall crest and a long wordmark weigh the same.
const AREA = 26 * 26 * 4.4
const heightFor = (ratio: number) => Math.round(Math.min(56, Math.max(18, Math.sqrt(AREA / ratio))))

function Mark({ brand }: { brand: string }) {
  const logo = logos[brand]
  if (!logo)
    return (
      <span className="brand-wordmark whitespace-nowrap text-xl font-bold uppercase tracking-[-0.02em] [font-family:var(--font-display)]">
        {brand}
      </span>
    )
  const height = Math.round(heightFor(logo.ratio) * (logo.scale ?? 1))
  return (
    <ResponsiveImage
      src={logo.src}
      sizes={`${Math.round(height * logo.ratio)}px`}
      alt={brand}
      loading="lazy"
      decoding="async"
      width={Math.round(height * logo.ratio)}
      height={height}
      style={{ height }}
      className="brand-logo w-auto max-w-none"
    />
  )
}

function Row({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul className="brand-row" aria-hidden={hidden || undefined}>
      {business.brands.map((brand) => (
        <li key={brand} className="brand-cell">
          <Mark brand={brand} />
        </li>
      ))}
    </ul>
  )
}

/** "Brands we supply": a slow marquee on wide screens, a swipe row on phones, still when reduced. */
export function BrandWall() {
  return (
    <section className="border-y bg-white py-10 lg:py-14" aria-labelledby="brands-title">
      <p id="brands-title" className="eyebrow container-wide mb-6 text-muted-foreground lg:mb-8">
        Brands we supply
      </p>
      <div className="brand-marquee" role="region" tabIndex={0} aria-labelledby="brands-title">
        <div className="brand-track">
          <Row />
          <Row hidden />
        </div>
      </div>
    </section>
  )
}
