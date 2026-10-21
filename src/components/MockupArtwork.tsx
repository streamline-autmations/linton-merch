import { artBox, type Method, type Placement, type Zone } from '@/lib/mockup'
import { TEXT_FAMILY, type TextLayout } from '@/lib/logo-upload'

// One position's artwork as it sits on the product. The on-screen preview and the PNG download
// both render this same layer, so what is downloaded is what was on screen.

export type ArtworkSource =
  | { kind: 'image'; href: string; aspect: number }
  | { kind: 'text'; layout: TextLayout; weight: number }

export function artAspect(art: ArtworkSource) {
  return art.kind === 'image' ? art.aspect : art.layout.aspect
}

/** Company names are set heavier for thread and ink, lighter for engraving. */
export const TEXT_WEIGHT: Record<Method, number> = { embroidery: 700, 'screen-printing': 700, engraving: 600 }

export function ArtworkLayer({
  zone,
  placement,
  art,
  ink,
  filterId,
  animate = false,
}: {
  zone: Zone
  placement: Placement
  art: ArtworkSource
  /** The colour to draw in; null keeps an image's own colours. */
  ink: string | null
  /** Unique per position, so each keeps its own method and colour. */
  filterId: string
  /** Play the stitch / burn / press-in when the artwork changes (screen only). */
  animate?: boolean
}) {
  const box = artBox(zone, placement, artAspect(art))
  const motion = animate ? (art.kind === 'image' ? 'brand-image' : `brand-${placement.method}`) : undefined
  return (
    <g transform={zone.rotate ? `rotate(${zone.rotate} ${zone.cx} ${zone.cy})` : undefined}>
      <MethodFilter id={filterId} method={placement.method} ink={ink} />
      <g filter={`url(#${filterId})`}>
        {art.kind === 'image' ? (
          <image
            className={motion}
            href={art.href}
            x={box.x}
            y={box.y}
            width={box.w}
            height={box.h}
            preserveAspectRatio="none"
          />
        ) : (
          <TextLines box={box} layout={art.layout} weight={art.weight} ink={ink ?? '#000'} className={motion} />
        )}
      </g>
    </g>
  )
}

/** The name's lines, centred, scaled so the block's ink fills the artwork box. */
function TextLines({
  box,
  layout,
  weight,
  ink,
  className,
}: {
  box: { x: number; y: number; w: number; h: number }
  layout: TextLayout
  weight: number
  ink: string
  className?: string
}) {
  const s = box.h / layout.height
  const x = box.x - layout.left * s
  const y = box.y - layout.top * s
  return (
    <text
      className={className}
      fontSize={100 * s}
      fontFamily={TEXT_FAMILY}
      fontWeight={weight}
      textAnchor="middle"
      fill={ink}
      stroke={ink}
      strokeWidth={0}
    >
      {layout.lines.map((line, i) => (
        <tspan key={i} x={x} y={y + i * layout.lineGap * s}>
          {line}
        </tspan>
      ))}
    </text>
  )
}

/**
 * How each method sits on the product: embroidery gets a thread texture and stands slightly
 * proud; screen print takes on a faint grain; engraving is a single recessed colour. With an
 * ink, the artwork is first recoloured to that one colour.
 */
function MethodFilter({ id, method, ink }: { id: string; method: Method; ink: string | null }) {
  return (
    <filter id={id} x="-10%" y="-10%" width="120%" height="130%" colorInterpolationFilters="sRGB">
      {ink ? (
        <>
          <feFlood floodColor={ink} result="ink" />
          <feComposite in="ink" in2="SourceAlpha" operator="in" result="art" />
        </>
      ) : (
        <feOffset in="SourceGraphic" result="art" />
      )}
      {method === 'embroidery' && (
        <>
          <feTurbulence type="fractalNoise" baseFrequency="0.06 0.75" numOctaves="2" seed="7" />
          <feColorMatrix type="saturate" values="0" result="grain" />
          <feBlend in="grain" in2="art" mode="soft-light" result="textured" />
          <feComposite in="textured" in2="art" operator="in" result="stitched" />
          <feDropShadow in="stitched" dx="0" dy="1.2" stdDeviation="0.8" floodOpacity="0.5" />
        </>
      )}
      {method === 'screen-printing' && (
        <>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="3" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0.2 0.2 0.2 0 -0.22" result="grain" />
          <feComposite in="art" in2="grain" operator="out" result="printed" />
          <feComponentTransfer in="printed">
            <feFuncA type="linear" slope="0.94" />
          </feComponentTransfer>
        </>
      )}
      {method === 'engraving' && (
        <>
          <feGaussianBlur in="art" stdDeviation="0.25" result="soft" />
          <feComponentTransfer in="soft" result="etched">
            <feFuncA type="linear" slope="0.9" />
          </feComponentTransfer>
          <feDropShadow in="etched" dx="0" dy="-0.6" stdDeviation="0.3" floodColor="#000" floodOpacity="0.85" />
        </>
      )}
    </filter>
  )
}
