import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type DragEvent,
  type KeyboardEvent,
  type PointerEvent,
} from 'react'
import { Minus, Plus } from 'lucide-react'
import { gsap, MOTION_OK, useGSAP } from '@/lib/motion'
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

/** How far in the photo is zoomed: scale, and the stage's offset as a share of the frame. */
type Camera = { s: number; x: number; y: number }
const FIT: Camera = { s: 1, x: 0, y: 0 }
const MAX_ZOOM = 4
const STEP = 1.6

/** Keeps the photo covering the frame: never smaller than fit, never panned past an edge. */
function clampCamera(c: Camera): Camera {
  const s = Math.max(1, Math.min(MAX_ZOOM, c.s))
  return { s, x: Math.max(1 - s, Math.min(0, c.x)), y: Math.max(1 - s, Math.min(0, c.y)) }
}

/** Zooms to scale `s`, keeping the point at (fx, fy) of the frame under the same spot. */
function zoomAt(c: Camera, scale: number, fx: number, fy: number): Camera {
  // Clamp first: past the limit nothing moves, rather than the photo sliding sideways.
  const s = Math.max(1, Math.min(MAX_ZOOM, scale))
  const k = s / c.s
  return clampCamera({ s, x: fx - (fx - c.x) * k, y: fy - (fy - c.y) * k })
}

type Pinch = { dist: number; px: number; py: number; s: number }

/** A pan carried on by the finger left down after a pinch: followed with touch events. */
const AFTER_PINCH = -1

type Drag = {
  kind: 'move' | 'resize'
  zone: Zone
  x: number
  y: number
  start: Placement
  aspect: number
}

/** The product photo for one colour and view, with the visitor's artwork on it. */
export function MockupStage({
  product,
  colour,
  view,
  placed,
  selected,
  seen,
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
  onSelect: (zoneId: string) => void
  onAdd: (zoneId: string) => void
  onChange: (next: Placement) => void
  onView: (step: 1 | -1) => void
  onFile: (file: File) => void
}) {
  const stageRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      if (!seen) return
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap
          .timeline()
          .fromTo(
            '.preview-seam-x',
            { scaleX: 0 },
            { scaleX: 1, duration: 0.5, stagger: 0.12, ease: 'power2.inOut' },
          )
          .fromTo(
            '.preview-seam-y',
            { scaleY: 0 },
            { scaleY: 1, duration: 0.5, stagger: 0.12, ease: 'power2.inOut' },
            0.18,
          )
      })
      return () => mm.revert()
    },
    { scope: viewportRef, dependencies: [seen, product.id], revertOnUpdate: true },
  )
  const drag = useRef<Drag | null>(null)
  const swipe = useRef<{ x: number; y: number } | null>(null)
  const [dragging, setDragging] = useState(false)
  const [over, setOver] = useState(false)
  // Zoom belongs to one product view: turning the shirt or changing product starts from fit.
  const camKey = `${product.id}|${view}`
  const [camState, setCamState] = useState({ key: camKey, ...FIT })
  const cam: Camera = camState.key === camKey ? camState : FIT
  // Forget the old view's zoom outright, so coming back to it starts from fit too.
  if (camState.key !== camKey) setCamState({ key: camKey, ...FIT })
  const camRef = useRef(cam)
  camRef.current = cam
  const setCam = (next: Camera) => {
    // Close enough to fit snaps back, so a sloppy pinch out doesn't leave the photo nudged.
    const c = clampCamera(next)
    camRef.current = c.s < 1.04 ? FIT : c
    setCamState({ key: camKey, ...camRef.current })
  }
  const setCamRef = useRef(setCam)
  setCamRef.current = setCam
  // Two fingers on the photo, or one finger dragging it while zoomed in.
  const pinch = useRef<Pinch | null>(null)
  const pan = useRef<{ id: number; x: number; y: number; cam: Camera } | null>(null)
  const [gesture, setGesture] = useState(false)
  const zoomed = cam.s > 1
  useEffect(() => {
    pan.current = null
    pinch.current = null
    setGesture(false)
  }, [camKey])
  const W = product.width
  const H = product.height
  const viewLabel = product.views.find((v) => v.id === view)?.label ?? view
  const inView = placed.filter((p) => p.zone.view === view)
  const empty = product.zones.filter(
    (z) => z.view === view && !placed.some((p) => p.zone.id === z.id),
  )
  const focus = inView.find((p) => p.zone.id === selected)
  const stageStyle = zoomed
    ? ({
        '--mockup-zoom': cam.s,
        transform: `translate(${cam.x * 100}%, ${cam.y * 100}%) scale(${cam.s})`,
      } as CSSProperties)
    : undefined

  /** A point on the screen as a share of the frame. */
  function frameAt(clientX: number, clientY: number) {
    const r = viewportRef.current!.getBoundingClientRect()
    return { fx: (clientX - r.left) / r.width, fy: (clientY - r.top) / r.height }
  }
  const frameAtRef = useRef(frameAt)
  frameAtRef.current = frameAt

  // Pinch to zoom. Touch events (not pointer events) so the browser's own scroll can be stopped
  // the moment a second finger lands. Ctrl + wheel is a trackpad pinch on a laptop.
  useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    const spread = (t: TouchList) => {
      const a = t[0]
      const b = t[1]
      return {
        dist: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY),
        ...frameAtRef.current((a.clientX + b.clientX) / 2, (a.clientY + b.clientY) / 2),
      }
    }
    const onStart = (e: TouchEvent) => {
      if (e.touches.length !== 2) return
      e.preventDefault()
      // A second finger turns any drag of the artwork or the photo into a pinch.
      drag.current = null
      pan.current = null
      swipe.current = null
      setDragging(false)
      const { dist, fx, fy } = spread(e.touches)
      const c = camRef.current
      // Remember which point of the photo sits between the fingers.
      pinch.current = { dist, px: (fx - c.x) / c.s, py: (fy - c.y) / c.s, s: c.s }
      setGesture(true)
    }
    const onMove = (e: TouchEvent) => {
      const after = pan.current
      if (after?.id === AFTER_PINCH && e.touches.length === 1) {
        e.preventDefault()
        const r = el.getBoundingClientRect()
        const t = e.touches[0]
        setCamRef.current({
          ...after.cam,
          x: after.cam.x + (t.clientX - after.x) / r.width,
          y: after.cam.y + (t.clientY - after.y) / r.height,
        })
        return
      }
      const p = pinch.current
      if (!p || e.touches.length < 2) return
      e.preventDefault()
      const { dist, fx, fy } = spread(e.touches)
      const s = Math.max(1, Math.min(MAX_ZOOM, (p.s * dist) / Math.max(1, p.dist)))
      // The same photo point stays between the fingers, so two fingers also pan.
      setCamRef.current({ s, x: fx - p.px * s, y: fy - p.py * s })
    }
    const onEnd = (e: TouchEvent) => {
      if (pinch.current && e.touches.length < 2) {
        pinch.current = null
        // One finger still down on a zoomed photo carries on as a drag.
        const t = e.touches[0]
        if (t && camRef.current.s > 1) {
          pan.current = { id: AFTER_PINCH, x: t.clientX, y: t.clientY, cam: camRef.current }
          return
        }
        setGesture(false)
      } else if (pan.current?.id === AFTER_PINCH && e.touches.length === 0) {
        pan.current = null
        setGesture(false)
      }
    }
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return
      e.preventDefault()
      const { fx, fy } = frameAtRef.current(e.clientX, e.clientY)
      const c = camRef.current
      setCamRef.current(zoomAt(c, c.s * Math.exp(-e.deltaY * 0.01), fx, fy))
    }
    el.addEventListener('touchstart', onStart, { passive: false })
    el.addEventListener('touchmove', onMove, { passive: false })
    el.addEventListener('touchend', onEnd)
    el.addEventListener('touchcancel', onEnd)
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      el.removeEventListener('touchstart', onStart)
      el.removeEventListener('touchmove', onMove)
      el.removeEventListener('touchend', onEnd)
      el.removeEventListener('touchcancel', onEnd)
      el.removeEventListener('wheel', onWheel)
    }
  }, [])

  function zoomIn() {
    // From fit, the first step goes straight to the selected position.
    if (!zoomed && focus) return setCam(zoomFor(product, focus.zone))
    setCam(zoomAt(cam, cam.s * STEP, 0.5, 0.5))
  }

  function zoomOut() {
    setCam(zoomAt(cam, cam.s / STEP, 0.5, 0.5))
  }

  // Zoomed in, the picture itself takes focus: arrow keys look around, + and − zoom. Keys on the
  // artwork keep moving the artwork.
  function onViewportKey(e: KeyboardEvent<HTMLDivElement>) {
    if (e.target !== e.currentTarget || !zoomed) return
    const step = (e.shiftKey ? 0.3 : 0.1) * cam.s
    const next: Camera | undefined = {
      ArrowLeft: { ...cam, x: cam.x + step },
      ArrowRight: { ...cam, x: cam.x - step },
      ArrowUp: { ...cam, y: cam.y + step },
      ArrowDown: { ...cam, y: cam.y - step },
      '+': zoomAt(cam, cam.s * STEP, 0.5, 0.5),
      '=': zoomAt(cam, cam.s * STEP, 0.5, 0.5),
      '-': zoomAt(cam, cam.s / STEP, 0.5, 0.5),
    }[e.key]
    if (!next) return
    e.preventDefault()
    setCam(next)
  }

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
    drag.current = {
      kind,
      zone: item.zone,
      x,
      y,
      start: item.placement,
      aspect: artAspect(item.art),
    }
    setDragging(true)
    onSelect(item.zone.id)
  }

  function move(e: PointerEvent<HTMLElement>) {
    const d = drag.current
    if (!d || pinch.current) return
    const pt = toPhoto(e)
    if (d.kind === 'move') {
      const delta = toZoneFrame(d.zone, pt.x - d.x, pt.y - d.y)
      onChange(
        clampPlacement(
          { ...d.start, dx: d.start.dx + delta.x, dy: d.start.dy + delta.y },
          d.zone,
          d.aspect,
        ),
      )
    } else {
      // The corner follows the pointer; the artwork grows or shrinks around its centre.
      const local = toZoneFrame(d.zone, pt.x - d.zone.cx, pt.y - d.zone.cy)
      const width = Math.max(
        2 * Math.abs(local.x - d.start.dx),
        2 * Math.abs(local.y - d.start.dy) * d.aspect,
      )
      onChange(
        clampPlacement(
          { ...d.start, scale: width / maxWidthFor(d.zone, d.aspect) },
          d.zone,
          d.aspect,
        ),
      )
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

  // Swiping across the photo (not on artwork) turns the product to the next view. Zoomed in, the
  // same drag moves the photo around instead.
  function swipeStart(e: PointerEvent<HTMLDivElement>) {
    if (zoomed && e.isPrimary && e.button === 0) {
      e.currentTarget.setPointerCapture(e.pointerId)
      pan.current = { id: e.pointerId, x: e.clientX, y: e.clientY, cam }
      swipe.current = null
      setGesture(true)
      return
    }
    swipe.current = e.isPrimary && product.views.length > 1 ? { x: e.clientX, y: e.clientY } : null
  }

  function panMove(e: PointerEvent<HTMLDivElement>) {
    const p = pan.current
    if (!p || p.id === AFTER_PINCH || p.id !== e.pointerId || pinch.current) return
    const r = viewportRef.current!.getBoundingClientRect()
    setCam({
      ...p.cam,
      x: p.cam.x + (e.clientX - p.x) / r.width,
      y: p.cam.y + (e.clientY - p.y) / r.height,
    })
  }

  function panEnd() {
    if (!pan.current || pan.current.id === AFTER_PINCH) return
    pan.current = null
    setGesture(false)
  }

  function swipeEnd(e: PointerEvent<HTMLDivElement>) {
    panEnd()
    const s = swipe.current
    swipe.current = null
    if (!s || zoomed) return
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
      ref={viewportRef}
      className="mockup-viewport preview-canvas"
      data-dark={colour.dark || undefined}
      data-over={over || undefined}
      data-zoomed={zoomed || undefined}
      data-gesture={gesture || undefined}
      tabIndex={zoomed ? 0 : undefined}
      role={zoomed ? 'group' : undefined}
      aria-label={zoomed ? 'Zoomed picture. Arrow keys look around; minus zooms out.' : undefined}
      onKeyDown={onViewportKey}
      style={{ aspectRatio: `${W} / ${H}` }}
      onPointerDown={swipeStart}
      onPointerMove={panMove}
      onPointerUp={swipeEnd}
      onPointerCancel={() => {
        swipe.current = null
        panEnd()
      }}
      onDragOver={(e) => {
        e.preventDefault()
        setOver(true)
      }}
      onDragLeave={() => setOver(false)}
      onDrop={onDrop}
    >
      <div ref={stageRef} className="mockup-stage" style={stageStyle}>
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
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="pointer-events-none absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
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

      <span className="preview-seam preview-seam-x seam-top" aria-hidden="true" />
      <span className="preview-seam preview-seam-y seam-right" aria-hidden="true" />
      <span className="preview-seam preview-seam-x seam-bottom" aria-hidden="true" />
      <span className="preview-seam preview-seam-y seam-left" aria-hidden="true" />
      <div
        className="mockup-zoom"
        role="group"
        aria-label="Zoom"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <button type="button" aria-label="Zoom out" disabled={!zoomed} onClick={zoomOut}>
          <Minus size={18} aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label={
            !zoomed && focus ? `Zoom in on the ${focus.zone.label.toLowerCase()}` : 'Zoom in'
          }
          disabled={cam.s >= MAX_ZOOM}
          onClick={zoomIn}
        >
          <Plus size={18} aria-hidden="true" />
        </button>
      </div>
      {over && (
        <div className="absolute inset-0 z-10 grid place-items-center bg-ink/70 text-sm font-medium text-white">
          Drop your logo here
        </div>
      )}
    </div>
  )
}

/**
 * A close-up of one position: the zone fills about half the frame, its centre staying put.
 * Transform-only zoom keeps pointer coordinates in the same photo space without layout work.
 */
function zoomFor(product: MockupProduct, zone: Zone): Camera {
  const span = Math.max(zone.w, zone.h)
  const s = Math.max(
    1.6,
    Math.min(2.6, (0.5 * product.width) / span, (0.5 * product.height) / span),
  )
  const ox = zone.cx / product.width
  const oy = zone.cy / product.height
  return clampCamera({ s, x: ox * (1 - s), y: oy * (1 - s) })
}
