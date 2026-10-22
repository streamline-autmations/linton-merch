import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type ChangeEvent,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { AlertCircle, Check, Download, Plus, Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MockupStage, type Placed } from '@/components/MockupStage'
import { TEXT_WEIGHT, artAspect, type ArtworkSource } from '@/components/MockupArtwork'
import { useBasket } from '@/context/BasketContext'
import {
  LOGO_ACCEPT,
  LogoError,
  MAX_LINES,
  layoutText,
  logoImage,
  readLogo,
  releaseLogo,
  textLines,
  type TextLayout,
  type UploadedLogo,
} from '@/lib/logo-upload'
import {
  INKS,
  METHOD_NAMES,
  MIN_SCALE,
  bestZone,
  clampPlacement,
  defaultPlacement,
  downloadName,
  effectiveInk,
  mockupProducts,
  sizeMm,
  summaryNote,
  type MockupProduct,
  type Placement,
  type PositionSummary,
} from '@/lib/mockup'
import { recalledCompany, rememberCompany } from '@/lib/quote'
import { cn } from '@/lib/utils'

// "Put your logo on it": the visitor uploads a logo (or types their company name), picks where it
// goes, and sees it on the product. One artwork is used on every position; each position only has
// a colour and a size. The logo is read in the browser and never uploaded or stored. It is a
// sketch, not a proof, and says so.

const PLACEHOLDER = 'Your company'
const NARROW = '(max-width: 63.99rem)'

interface ProductState {
  colour: string
  view: string
  placements: Record<string, Placement>
  selected: string | null
  /** The visitor has changed something here, so a new logo keeps their positions. */
  touched: boolean
}

function initialState(product: MockupProduct): ProductState {
  const zone = product.zones[0]
  return {
    colour: product.colours[0].id,
    view: zone.view,
    placements: { [zone.id]: defaultPlacement(zone) },
    selected: zone.id,
    touched: false,
  }
}

function useNarrow() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(NARROW)
      mq.addEventListener('change', onChange)
      return () => mq.removeEventListener('change', onChange)
    },
    () => window.matchMedia(NARROW).matches,
    () => false,
  )
}

/**
 * `embedded`: rendered inside the home page's "Put your logo on it" dialog, which supplies the
 * title and the page padding. The section layout is used when it stands on its own.
 */
export function BrandPreview({ embedded = false }: { embedded?: boolean } = {}) {
  const [wording, setWording] = useState(recalledCompany)
  const [logo, setLogo] = useState<UploadedLogo | null>(null)
  const [states, setStates] = useState<Record<string, ProductState>>(() =>
    Object.fromEntries(mockupProducts.map((p) => [p.id, initialState(p)])),
  )
  const [productId, setProductId] = useState(mockupProducts[0].id)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [fontsReady, setFontsReady] = useState(false)
  // On phones the pinned picture shrinks and zooms while the keyboard is up.
  const [typing, setTyping] = useState(false)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState('')
  const narrow = useNarrow()
  const { items, add, update: updateItem } = useBasket()
  const ids = useId()
  const fileRef = useRef<HTMLInputElement>(null)
  const logoRef = useRef(logo)
  const layoutCache = useRef(new Map<string, TextLayout>())

  const product = mockupProducts.find((p) => p.id === productId) ?? mockupProducts[0]
  const state = states[product.id]
  const colour = product.colours.find((c) => c.id === state.colour) ?? product.colours[0]
  const inQuote = items.some((item) => item.productId === product.id)
  const kind = logo ? 'logo' : 'text'

  // The first stitch happens when the preview scrolls into view, not on page load off-screen.
  const figureRef = useRef<HTMLElement>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = figureRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -30% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // The name is measured in the real typeface, so wait for it before trusting sizes.
  useEffect(() => {
    let live = true
    document.fonts.load('700 100px "Host Grotesk Variable"').finally(() => {
      if (!live) return
      layoutCache.current.clear()
      setFontsReady(true)
    })
    return () => {
      live = false
    }
  }, [])

  // Uploaded logos are object URLs: let go of them when the section goes away.
  useEffect(() => {
    logoRef.current = logo
  }, [logo])
  // `alive` lets a logo that finishes reading after the dialog closed release itself too.
  const alive = useRef(true)
  useEffect(() => {
    alive.current = true
    return () => {
      alive.current = false
      if (logoRef.current) releaseLogo(logoRef.current)
    }
  }, [])

  const text = textLines(wording).join('\n') || PLACEHOLDER

  function artFor(p: Placement): ArtworkSource {
    if (logo) {
      const img = logoImage(logo)
      return { kind: 'image', href: img.url, aspect: img.width / img.height }
    }
    const weight = TEXT_WEIGHT[p.method]
    const key = `${fontsReady}|${weight}|${text}`
    let layout = layoutCache.current.get(key)
    if (!layout) {
      layout = layoutText(text, weight)
      layoutCache.current.set(key, layout)
    }
    return { kind: 'text', layout, weight }
  }

  // Every position in use on this product, kept inside its area for the current artwork.
  const placed: Placed[] = product.zones.flatMap((zone) => {
    const stored = state.placements[zone.id]
    if (!stored) return []
    const art = artFor(stored)
    const placement = clampPlacement(stored, zone, artAspect(art))
    const look = art.kind === 'image' ? art.href : text
    return [
      {
        zone,
        placement,
        art,
        ink: effectiveInk(placement, kind, colour.dark),
        key: `${zone.id}-${look}`,
      },
    ]
  })
  const current = placed.find((p) => p.zone.id === state.selected)

  /** Changes this product's state; any change means the visitor has made it theirs. */
  function edit(change: (s: ProductState) => Partial<ProductState>) {
    setStates((prev) => ({
      ...prev,
      [product.id]: { ...prev[product.id], ...change(prev[product.id]), touched: true },
    }))
    setStatus('')
  }

  function setPlacement(next: Placement) {
    edit((s) => ({ placements: { ...s.placements, [next.zoneId]: next } }))
  }

  // Not clamped here: the render keeps it inside the area, so a passing limit is never saved.
  function patch(zoneId: string, change: Partial<Placement>) {
    setPlacement({ ...state.placements[zoneId], ...change })
  }

  function select(zoneId: string) {
    const zone = product.zones.find((z) => z.id === zoneId)!
    edit(() => ({ selected: zoneId, view: zone.view }))
  }

  function addZone(zoneId: string) {
    const zone = product.zones.find((z) => z.id === zoneId)!
    edit((s) => ({
      placements: { ...s.placements, [zoneId]: defaultPlacement(zone) },
      selected: zoneId,
      view: zone.view,
    }))
  }

  function removeZone(zoneId: string) {
    edit((s) => {
      const placements = { ...s.placements }
      delete placements[zoneId]
      const rest = product.zones.filter((z) => placements[z.id])
      if (s.selected !== zoneId) return { placements }
      const next = rest.at(-1)
      return { placements, selected: next?.id ?? null, view: next?.view ?? s.view }
    })
  }

  function stepView(step: 1 | -1) {
    const i = product.views.findIndex((v) => v.id === state.view)
    edit(() => ({
      view: product.views[(i + step + product.views.length) % product.views.length].id,
    }))
  }

  async function upload(file: File | undefined) {
    if (!file) return
    setUploadError(null)
    setUploading(true)
    try {
      const next = await readLogo(file)
      if (!alive.current) {
        releaseLogo(next)
        return
      }
      const old = logoRef.current
      setLogo(next)
      if (old) releaseLogo(old)
      const img = logoImage(next)
      const aspect = img.width / img.height
      // The logo shows its own colours everywhere. Products the visitor hasn't touched start it in
      // the area that suits its shape.
      setStates((prev) =>
        Object.fromEntries(
          mockupProducts.map((p) => {
            const s = prev[p.id]
            if (!s.touched && p.zones.some((z) => z.auto)) {
              const zone = bestZone(p, aspect)
              return [
                p.id,
                {
                  ...s,
                  placements: { [zone.id]: defaultPlacement(zone) },
                  selected: zone.id,
                  view: zone.view,
                },
              ]
            }
            const placements = Object.fromEntries(
              Object.entries(s.placements).map(([k, pl]) => [k, { ...pl, ink: null }]),
            )
            return [p.id, { ...s, placements }]
          }),
        ),
      )
      setStatus('')
    } catch (err) {
      setUploadError(
        err instanceof LogoError
          ? err.message
          : "That file couldn't be read. Try saving it as a PNG.",
      )
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  function removeLogo() {
    const old = logo
    setLogo(null)
    setUploadError(null)
    if (old) releaseLogo(old)
  }

  function changeWording(value: string) {
    const limited = value.split('\n').slice(0, MAX_LINES).join('\n')
    setWording(limited)
    rememberCompany(textLines(limited)[0])
    setStatus('')
  }

  function positions(): PositionSummary[] {
    return placed.map(({ zone, placement, ink }) => ({
      zone: zone.label,
      method: placement.method,
      artwork: logo ? 'logo' : `“${textLines(text).join(' / ')}”`,
      ink: placement.method === 'engraving' ? null : ink,
      size: sizeMm(product, zone, placement, artAspect(artFor(placement))),
    }))
  }

  function addToQuote() {
    const note = placed.length ? summaryNote(product, colour.name, positions()) : ''
    const wasIn = inQuote
    add(product.id)
    if (note) updateItem(product.id, { specification: note })
    const count = placed.length === 1 ? '1 position' : `${placed.length} positions`
    setStatus(
      wasIn
        ? `Quote updated with ${count}.`
        : `Added to your quote${placed.length ? ` with ${count}` : ''}.`,
    )
  }

  async function download() {
    setSaving(true)
    setStatus('')
    try {
      const { downloadMockupPng } = await import('@/lib/mockup-export')
      await downloadMockupPng({ product, colour, placed, view: state.view })
      setStatus(`Saved ${downloadName(product)}`)
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "The picture couldn't be saved. Try again.")
    } finally {
      setSaving(false)
    }
  }

  const ratio = product.width / product.height
  const pinWidth = `min(100%, calc(${typing ? 24 : 40}svh * ${ratio.toFixed(3)}))`

  const Wrapper = embedded ? 'div' : 'section'
  return (
    <Wrapper
      className={embedded ? undefined : 'border-y bg-white'}
      aria-labelledby={embedded ? undefined : 'brand-preview-title'}
    >
      <div
        className={cn(
          'grid grid-cols-[minmax(0,1fr)] gap-x-16 gap-y-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)]',
          embedded
            ? 'gap-y-6 lg:gap-x-12'
            : 'container-wide py-16 lg:grid-rows-[auto_1fr] lg:py-24',
        )}
      >
        {!embedded && (
          <div className="lg:self-end">
            <p className="eyebrow mb-5 flex items-center gap-3 text-muted-foreground">
              <span className="stitch w-8 text-brand-teal" /> Try it
            </p>
            <h2 id="brand-preview-title" className="section-title max-w-md">
              Put your logo on it.
            </h2>
            <p className="mt-4 max-w-md text-base leading-7 text-muted-foreground">
              See it stitched, engraved or printed, then download the picture.
            </p>
          </div>
        )}

        {/* On phones the picture stays pinned while the controls scroll underneath it. */}
        <figure
          ref={figureRef}
          className="preview-pin relative lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start"
        >
          {product.views.length > 1 && (
            <div className="mockup-views" role="group" aria-label="View">
              {product.views.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  className="mockup-view"
                  aria-pressed={state.view === v.id}
                  onClick={() => edit(() => ({ view: v.id }))}
                >
                  {v.label}
                  {placed.some((p) => p.zone.view === v.id) && (
                    <span className="mockup-view-dot" aria-label=", has branding" />
                  )}
                </button>
              ))}
            </div>
          )}
          <div
            className="mockup-pin-size mx-auto transition-[width]"
            style={{ width: pinWidth, '--ratio': ratio } as CSSProperties}
          >
            <MockupStage
              product={product}
              colour={colour}
              view={state.view}
              placed={placed}
              selected={state.selected}
              seen={seen}
              autoZoom={narrow && typing}
              onSelect={select}
              onAdd={addZone}
              onChange={setPlacement}
              onView={stepView}
              onFile={(file) => upload(file)}
            />
          </div>
          <figcaption className="mt-3 hidden text-xs leading-5 text-muted-foreground lg:block">
            A quick sketch, not an artwork proof.
          </figcaption>
        </figure>

        <div className={cn('lg:col-start-1', embedded ? 'lg:row-start-1' : 'lg:row-start-2')}>
          <Group label="Product">
            <div className="flex flex-wrap gap-2">
              {mockupProducts.map((option) => (
                <Choice
                  key={option.id}
                  active={option.id === product.id}
                  onClick={() => setProductId(option.id)}
                >
                  {option.label}
                </Choice>
              ))}
            </div>
          </Group>

          <Group label="Your logo" labelId={`${ids}-logo`}>
            <input
              ref={fileRef}
              type="file"
              accept={LOGO_ACCEPT}
              className="sr-only"
              tabIndex={-1}
              aria-labelledby={`${ids}-logo`}
              onChange={(e: ChangeEvent<HTMLInputElement>) => upload(e.target.files?.[0])}
            />
            {logo ? (
              <>
                <div className="flex items-center gap-2 rounded-md border bg-background p-2 pr-1">
                  <span className="logo-thumb h-11 w-11 shrink-0 rounded-sm">
                    <img
                      src={logoImage(logo).url}
                      alt=""
                      className="h-full w-full object-contain p-1"
                    />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm">{logo.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-11"
                    onClick={() => fileRef.current?.click()}
                  >
                    Replace
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-11"
                    onClick={removeLogo}
                  >
                    <X aria-hidden="true" /> Remove
                  </Button>
                </div>
                {logo.cutOut && (
                  <label className="mt-2 flex min-h-11 items-center gap-3 text-sm">
                    <input
                      type="checkbox"
                      className="size-5 accent-ink"
                      checked={logo.useCutOut}
                      onChange={(e) => setLogo({ ...logo, useCutOut: e.target.checked })}
                    />
                    Remove the logo&rsquo;s background
                  </label>
                )}
              </>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 w-full justify-start px-4 sm:w-auto"
                  disabled={uploading}
                  onClick={() => fileRef.current?.click()}
                >
                  <Upload aria-hidden="true" />{' '}
                  {uploading ? 'Reading your logo…' : 'Upload your logo'}
                </Button>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  PNG, JPG, WebP or SVG, up to 10 MB. Never uploaded.
                </p>
                <label htmlFor={`${ids}-text`} className="mt-5 mb-2 block text-sm font-medium">
                  Or type your company name
                </label>
                <textarea
                  id={`${ids}-text`}
                  className="field resize-none text-base leading-6"
                  rows={Math.min(MAX_LINES, Math.max(2, wording.split('\n').length))}
                  maxLength={90}
                  placeholder={PLACEHOLDER}
                  autoComplete="organization"
                  aria-describedby={`${ids}-text-hint`}
                  value={wording}
                  onFocus={() => setTyping(true)}
                  onBlur={() => setTyping(false)}
                  onChange={(e) => changeWording(e.target.value)}
                />
                <p id={`${ids}-text-hint`} className="mt-1 text-xs text-muted-foreground">
                  Press Enter for a new line, up to {MAX_LINES} lines.
                </p>
              </>
            )}
            {uploadError && (
              <p className="mt-2 flex items-start gap-2 text-sm text-destructive" role="alert">
                <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> {uploadError}
              </p>
            )}
          </Group>

          {product.colours.length > 1 && (
            <Group label={`${product.label} colour`}>
              <div
                className="flex flex-wrap gap-2"
                role="group"
                aria-label={`${product.label} colour`}
              >
                {product.colours.map((c) => (
                  <Choice
                    key={c.id}
                    active={c.id === colour.id}
                    onClick={() => edit(() => ({ colour: c.id }))}
                  >
                    <span
                      className="size-4 rounded-full border border-black/15"
                      style={{ background: c.swatch }}
                      aria-hidden="true"
                    />
                    {c.name}
                  </Choice>
                ))}
              </div>
            </Group>
          )}

          {product.zones.length > 1 && (
            <Group
              label="Where it goes"
              aside={placed.length ? `${placed.length} chosen` : 'Pick at least one'}
            >
              <div className="flex flex-wrap gap-2">
                {product.zones.map((zone) => {
                  const on = !!state.placements[zone.id]
                  if (!on) {
                    return (
                      <button
                        key={zone.id}
                        type="button"
                        className="inline-flex min-h-11 items-center gap-1.5 rounded-sm border border-dashed border-ink/35 px-3 text-sm text-muted-foreground transition-colors hover:border-ink hover:text-ink"
                        onClick={() => addZone(zone.id)}
                      >
                        <Plus className="size-4" aria-hidden="true" />
                        {zone.label}
                      </button>
                    )
                  }
                  const active = state.selected === zone.id
                  return (
                    <span key={zone.id} className="inline-flex">
                      <button
                        type="button"
                        aria-pressed={active}
                        className={cn(
                          'inline-flex min-h-11 items-center gap-1.5 rounded-l-sm border px-3 text-sm transition-colors',
                          active
                            ? 'border-ink bg-ink text-white'
                            : 'border-ink/40 bg-secondary text-ink hover:border-ink',
                        )}
                        onClick={() => select(zone.id)}
                      >
                        <Check className="size-4" aria-hidden="true" />
                        {zone.label}
                      </button>
                      <button
                        type="button"
                        aria-label={`Remove the ${zone.label.toLowerCase()}`}
                        className={cn(
                          'inline-flex min-h-11 w-11 items-center justify-center rounded-r-sm border border-l-0 transition-colors',
                          active
                            ? 'border-ink bg-ink text-white/80 hover:text-white'
                            : 'border-ink/40 bg-secondary text-ink/70 hover:text-ink',
                        )}
                        onClick={() => removeZone(zone.id)}
                      >
                        <X className="size-4" aria-hidden="true" />
                      </button>
                    </span>
                  )
                })}
              </div>
            </Group>
          )}

          {current && (
            <Group label={current.zone.label} aside={METHOD_NAMES[current.placement.method]}>
              {current.placement.method === 'engraving' ? (
                <p className="text-sm leading-6 text-muted-foreground">
                  One colour: the metal itself.
                </p>
              ) : (
                <div
                  className="flex flex-wrap items-center gap-2"
                  role="group"
                  aria-label={
                    current.placement.method === 'embroidery' ? 'Thread colour' : 'Ink colour'
                  }
                >
                  {logo && (
                    <Choice
                      active={current.placement.ink === null}
                      onClick={() => patch(current.zone.id, { ink: null })}
                    >
                      Logo colours
                    </Choice>
                  )}
                  {INKS.map((ink) => {
                    const on = current.ink === ink.value
                    return (
                      <button
                        key={ink.value}
                        type="button"
                        aria-label={ink.name}
                        aria-pressed={on}
                        title={ink.name}
                        onClick={() => patch(current.zone.id, { ink: ink.value })}
                        className={cn(
                          'h-11 w-11 rounded-full border border-black/15 transition-shadow',
                          on
                            ? 'ring-2 ring-ink ring-offset-2'
                            : 'hover:ring-1 hover:ring-ink/40 hover:ring-offset-2',
                        )}
                        style={{ background: ink.value }}
                      />
                    )
                  })}
                </div>
              )}
              <SizeField
                id={`${ids}-size`}
                product={product}
                item={current}
                onScale={(scale) => patch(current.zone.id, { scale })}
              />
            </Group>
          )}

          <div className="flex flex-wrap items-center gap-3 border-t pt-6">
            <Button
              variant="outline"
              className="h-auto min-h-12 px-5 py-3"
              disabled={saving || placed.length === 0}
              onClick={download}
            >
              <Download aria-hidden="true" /> {saving ? 'Preparing…' : 'Download PNG'}
            </Button>
            <Button
              className="h-auto min-h-12 max-w-full whitespace-normal px-5 py-3 text-left"
              onClick={addToQuote}
            >
              {inQuote ? <Check aria-hidden="true" /> : <Plus aria-hidden="true" />}
              {inQuote ? 'Update my quote' : 'Add to my quote'}
            </Button>
          </div>
          <p
            className="mt-3 min-h-5 text-xs text-muted-foreground"
            role="status"
            aria-live="polite"
          >
            {status}
          </p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground lg:hidden">
            A quick sketch, not an artwork proof.
          </p>
        </div>
      </div>
    </Wrapper>
  )
}

/** A control group: hairline above, label, optional note on the right. */
function Group({
  label,
  labelId,
  aside,
  children,
}: {
  label: string
  labelId?: string
  aside?: string
  children: ReactNode
}) {
  return (
    <div className="border-t pt-5 pb-6 first:border-t-0 first:pt-0">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <p id={labelId} className="text-sm font-medium">
          {label}
        </p>
        {aside && <span className="text-xs text-muted-foreground">{aside}</span>}
      </div>
      {children}
    </div>
  )
}

function Choice({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'inline-flex min-h-11 items-center gap-2 rounded-sm border px-4 py-2 text-sm transition-colors',
        active
          ? 'border-ink bg-ink text-white'
          : 'bg-white text-muted-foreground hover:border-ink hover:text-ink',
      )}
    >
      {children}
    </button>
  )
}

function SizeField({
  id,
  product,
  item,
  onScale,
}: {
  id: string
  product: MockupProduct
  item: Placed
  onScale: (scale: number) => void
}) {
  const { zone, placement, art } = item
  const size = sizeMm(product, zone, placement, artAspect(art))
  const percent = Math.round(placement.scale * 100)
  return (
    <div className="mt-4">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm text-muted-foreground">
          Size
        </label>
        <output htmlFor={id} className="text-sm tabular-nums text-muted-foreground">
          {size ? `About ${size.w} × ${size.h} mm` : `${percent}%`}
        </output>
      </div>
      <input
        id={id}
        type="range"
        className="mockup-range"
        min={Math.round(MIN_SCALE * 100)}
        max={100}
        step={1}
        value={percent}
        aria-valuetext={
          size ? `${size.w} by ${size.h} millimetres` : `${percent} percent of the largest size`
        }
        onChange={(e) => onScale(Number(e.target.value) / 100)}
      />
      <p className="text-xs text-muted-foreground">Drag it on the picture to move it.</p>
    </div>
  )
}
