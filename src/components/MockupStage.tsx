import { useRef, useState, type CSSProperties, type DragEvent, type KeyboardEvent, type PointerEvent } from 'react'
import { ZoomIn, ZoomOut } from 'lucide-react'
import { ResponsiveImage } from '@/components/ResponsiveImage'
import { ArtworkLayer, artAspect, type ArtworkSource } from '@/components/MockupArtwork'
import {
  artBox,
  clampPlacement,
  maxWidthFor,
  sizeMm,
  toZoneFrame,
  zoneBox,
  type GarmentColour,
  type MockupProduct,
  type Placement,
  type Zone,
} from '@/lib/mockup'

/** A position in use, ready to draw. */
export interface Placed {
  zone: Zone
  placement: Placement
  art: ArtworkSource
  ink: string | null
  /** Changes when the artwork does, so the stitch plays again. */
  key: string
}

type Drag = { kind: 'move' | 'resize'; zone: Zone; x: number; y: number; start: Placement; aspect: number }

/** The product photo for one colour and view, with the visitor's artwork on it. */
export function MockupStage({
  product,
  colour,
  view,
  placed,
  selected,
  seen,
  autoZoom = false,
  onSelect,
  onAdd,
  onChange,
  onView,
  onFile,
}: {
  product: MockupProduct
  colour: GarmentColour
  view: string
  placed: Placed[]
  selected: string | null
  /** Artwork waits until the preview scrolls into view, so the first stitch is seen. */
  seen: boolean
  /** Zoom in on the selected position regardless of the zoom button (phones, while typing). */
  autoZoom?: boolean
  onSelect: (zoneId: string) => void
  onAdd: (zoneId: string) => void
  onChange: (next: Placement) => void
  onView: (step: 1 | -1) => void
  onFile: (file: File) => void
}) {
  const stageRef = useRef<HTMLDivElement>(null)
  const drag = useRef<Drag | null>(null)
  const swipe = useRef<{ x: number; y: number } | null>(null)
  const [dragging, setDragging] = useState(false)
  const [zoomOn, setZoomOn] = useState(false)
  const [over, setOver] = useState(false)
  const W = product.width
  const H = product.height
  const viewLabel = product.views.find((v) => v.id === view)?.label ?? view
  const inView = placed.filter((p) => p.zone.view === view)
  const empty = product.zones.filter((z) => z.view === view && !placed.some((p) => p.zone.id === z.id))
  const focus = inView.find((p) => p.zone.id === selected)
  const zoom = (zoomOn || autoZoom) && focus ? zoomFor(product, focus.zone) : null

  const pct = (b: { x: number; y: number; w: number; h: number }): CSSProperties => ({
    left: `${(b.x / W) * 100}%`,
    top: `${(b.y / H) * 100}%`,
    width: `${(b.w / W) * 100}%`,
    height: `${(b.h / H) * 100}%`,
  })
  const zoneStyle = (zone: Zone): CSSProperties => ({
    ...pct(zoneBox(zone)),
    transform: zone.rotate ? `rotate(${zone.rotate}deg)` : undefined,
  })

  function toPhoto(e: { clientX: number; clientY: number }) {
    const r = stageRef.current!.getBoundingClientRect()
    return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H }
  }

  function start(e: PointerEvent<HTMLElement>, kind: Drag['kind'], item: Placed) {
    if (e.button !== 0) return
    e.stopPropagation()
    e.currentTarget.setPointerCapture(e.pointerId)
    const { x, y } = toPhoto(e)
    drag.current = { kind, zone: item.zone, x, y, start: item.placement, aspect: artAspect(item.art) }
    setDragging(true)
    onSelect(item.zone.id)
  }

  function move(e: PointerEvent<HTMLElement>) {
    const d = drag.current
    if (!d) return
    const pt = toPhoto(e)
    if (d.kind === 'move') {
      const delta = toZoneFrame(d.zone, pt.x - d.x, pt.y - d.y)
      onChange(clampPlacement({ ...d.start, dx: d.start.dx + delta.x, dy: d.start.dy + delta.y }, d.zone, d.aspect))
    } else {
      // The corner follows the pointer; the artwork grows or shrinks around its centre.
      const local = toZoneFrame(d.zone, pt.x - d.zone.cx, pt.y - d.zone.cy)
      const width = Math.max(2 * Math.abs(local.x - d.start.dx), 2 * Math.abs(local.y - d.start.dy) * d.aspect)
      onChange(clampPlacement({ ...d.start, scale: width / maxWidthFor(d.zone, d.aspect) }, d.zone, d.aspect))
    }
  }

  function end() {
    drag.current = null
    setDragging(false)
  }

  function onKey(e: KeyboardEvent<HTMLElement>, item: Placed) {
    const p = item.placement
    const step = e.shiftKey ? 16 : 4
    const patch: Partial<Placement> | undefined = {
      ArrowLeft: { dx: p.dx - step },
      ArrowRight: { dx: p.dx + step },
      ArrowUp: { dy: p.dy - step },
      ArrowDown: { dy: p.dy + step },
      '+': { scale: p.scale + 0.05 },
      '=': { scale: p.scale + 0.05 },
      '-': { scale: p.scale - 0.05 },
    }[e.key]
    if (!patch) return
    e.preventDefault()
    onChange(clampPlacement({ ...p, ...patch }, item.zone, artAspect(item.art)))
  }

  // Swiping across the photo (not on artwork) turns the product to the next view.
  function swipeStart(e: PointerEvent<HTMLDivElement>) {
    swipe.current = e.isPrimary && product.views.length > 1 ? { x: e.clientX, y: e.clientY } : null
  }

  function swipeEnd(e: PointerEvent<HTMLDivElement>) {
    const s = swipe.current
    swipe.current = null
    if (!s || zoom) return
    const dx = e.clientX - s.x
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(e.clientY - s.y) * 1.5) onView(dx < 0 ? 1 : -1)
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setOver(false)
    const file = e.dataTransfer.files[0]
    if (file) onFile(file)
  }

  return (
    <div
      className="mockup-viewport preview-canvas"
      data-dark={colour.dark || undefined}
      data-over={over || undefined}
      style={{ aspectRatio: `${W} / ${H}` }}
      onPointerDown={swipeStart}
      onPointerUp={swipeEnd}
      onPointerCancel={() => (swipe.current = null)}
      onDragOver={(e) => {
        e.preventDefault()
        setOver(true)
      }}
      onDragLeave={() => setOver(false)}
      onDrop={onDrop}
    >
      <div ref={stageRef} className="mockup-stage" style={zoom ?? undefined}>
        <ResponsiveImage
          key={product.photo(colour.id, view)}
          src={product.photo(colour.id, view)}
          sizes="(min-width: 1376px) 640px, (min-width: 1024px) 50vw, 100vw"
          alt={`${product.label}, ${colour.name.toLowerCase()}, ${viewLabel.toLowerCase()} view`}
          width={W}
          height={H}
          draggable={false}
          className="brand-fade pointer-events-none absolute inset-0 h-full w-full object-contain mix-blend-multiply"
        />
        <svg viewBox={`0 0 ${W} ${H}`} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
          {seen &&
            inView.map((item) => (
              <ArtworkLayer
                key={item.key}
                zone={item.zone}
                placement={item.placement}
                art={item.art}
                ink={item.ink}
                filterId={`mk-${item.zone.id}`}
                animate
              />
            ))}
        </svg>

        {empty.map((zone) => (
          <button
            key={zone.id}
            type="button"
            className="mockup-empty"
            style={zoneStyle(zone)}
            onClick={() => onAdd(zone.id)}
            onPointerDown={(e) => e.stopPropagation()}
            aria-label={`Add branding to the ${zone.label.toLowerCase()}`}
          >
            <span aria-hidden="true">+</span>
          </button>
        ))}

        {inView.map((item) => {
          const { zone, placement } = item
          const aspect = artAspect(item.art)
          const box = artBox(zone, placement, aspect)
          const isSelected = selected === zone.id
          const size = sizeMm(product, zone, placement, aspect)
          return (
            <div key={zone.id} className="pointer-events-none absolute" style={zoneStyle(zone)}>
              {isSelected && <div className="mockup-limit" aria-hidden="true" />}
              <button
                type="button"
                className="mockup-frame pointer-events-auto absolute touch-none"
                data-selected={isSelected || undefined}
                data-active={(isSelected && dragging) || undefined}
                style={{
                  left: `${((box.x - (zone.cx - zone.w / 2)) / zone.w) * 100}%`,
                  top: `${((box.y - (zone.cy - zone.h / 2)) / zone.h) * 100}%`,
                  width: `${(box.w / zone.w) * 100}%`,
                  height: `${(box.h / zone.h) * 100}%`,
                }}
                aria-label={`Branding on the ${zone.label.toLowerCase()}${size ? `, about ${size.w} by ${size.h} mm` : ''}. Arrow keys move it; plus and minus resize it.`}
                aria-pressed={isSelected}
                onFocus={() => onSelect(zone.id)}
                onKeyDown={(e) => onKey(e, item)}
                onPointerDown={(e) => start(e, 'move', item)}
                onPointerMove={move}
                onPointerUp={end}
                onPointerCancel={end}
              >
                {isSelected && (
                  <>
                    <span
                      className="mockup-handle"
                      aria-hidden="true"
                      onPointerDown={(e) => start(e, 'resize', item)}
                      onPointerMove={move}
                      onPointerUp={end}
                      onPointerCancel={end}
                    />
                    {size && (
                      <span className="mockup-size" aria-hidden="true">
                        {size.w} × {size.h} mm
                      </span>
                    )}
                  </>
                )}
              </button>
            </div>
          )
        })}
      </div>

      {focus && (
        <button
          type="button"
          className="mockup-zoom"
          aria-label={zoomOn ? 'Zoom out' : `Zoom in on the ${focus.zone.label.toLowerCase()}`}
          onClick={() => setZoomOn((z) => !z)}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {zoomOn ? <ZoomOut size={16} aria-hidden="true" /> : <ZoomIn size={16} aria-hidden="true" />}
          {zoomOn ? 'Zoom out' : 'Zoom in'}
        </button>
      )}
      {over && (
        <div className="absolute inset-0 z-10 grid place-items-center bg-ink/70 text-sm font-medium text-white">
          Drop your logo here
        </div>
      )}
    </div>
  )
}

/**
 * Zooms by enlarging the stage inside the clipped viewport (not a CSS scale), so outlines and the
 * size label stay crisp. The zone's centre stays put and the photo always covers the viewport.
 */
function zoomFor(product: MockupProduct, zone: Zone): CSSProperties {
  const span = Math.max(zone.w, zone.h)
  const scale = Math.max(1, Math.min(2.6, (0.5 * product.width) / span, (0.5 * product.height) / span))
  const ox = zone.cx / product.width
  const oy = zone.cy / product.height
  return {
    width: `${scale * 100}%`,
    height: `${scale * 100}%`,
    left: `${ox * (1 - scale) * 100}%`,
    top: `${oy * (1 - scale) * 100}%`,
  }
}
