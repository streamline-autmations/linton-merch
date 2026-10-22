// "Put your logo on it": the demo products, their photo views and colours, where branding can go,
// and the geometry that keeps artwork inside each area. Positions are in the photo's own units
// (its SVG viewBox). The golf shirt is calibrated to millimetres; the others show relative sizes.

export type Method = 'embroidery' | 'screen-printing' | 'engraving'

/** Only methods Linton lists on its own site (business.ts). */
export const METHOD_NAMES: Record<Method, string> = {
  embroidery: 'Embroidery',
  'screen-printing': 'Screen printing',
  engraving: 'Laser engraving',
}

export interface Swatch {
  name: string
  value: string
}

/** Thread and ink colours offered when the artwork is shown in one colour. */
export const INKS: Swatch[] = [
  { name: 'White', value: '#ffffff' },
  { name: 'Black', value: '#141414' },
  { name: 'Navy', value: '#1d2a4d' },
  { name: 'Royal blue', value: '#2456c4' },
  { name: 'Teal', value: '#029b97' },
  { name: 'Red', value: '#c22a2a' },
  { name: 'Gold', value: '#c9a24a' },
]

/** Engraving is one colour: the metal showing through the finish. */
export const ENGRAVED = '#cfd3d5'

export interface Zone {
  id: string
  label: string
  view: string
  /** Centre of the branding area, and the largest artwork it takes, in photo units. */
  cx: number
  cy: number
  w: number
  h: number
  /** Degrees, clockwise: follows the product's angle in the photo. */
  rotate: number
  methods: Method[]
  /** Offered as a starting place that suits the artwork's shape (see bestZone). */
  auto?: boolean
}

export interface GarmentColour {
  id: string
  name: string
  swatch: string
  dark: boolean
}

export interface MockupProduct {
  /** Catalogue id, so "Add to my quote" adds the right product. */
  id: string
  label: string
  /** The photo's coordinate space. */
  width: number
  height: number
  /** Millimetres per photo unit, or null where the photo isn't calibrated. */
  mmPerUnit: number | null
  sizeNote: string
  views: { id: string; label: string }[]
  colours: GarmentColour[]
  zones: Zone[]
  photo: (colour: string, view: string) => string
}

// Photos: the African Nomad shirt set ("Images 4 branding"), the same framing across colours, so one
// set of zones per view fits every colour. The body measures about 580 px across the chest; a size L
// golf shirt is about 56 cm across, so roughly 0.96 mm per pixel.
const SHIRT_MM = 0.96
const mm = (value: number) => value / SHIRT_MM
// Chest areas are the usual left-chest maximum, about 100 × 80 mm, so sizes read true to the trade.
const CHEST: Method[] = ['embroidery', 'screen-printing']

export const mockupProducts: MockupProduct[] = [
  {
    id: 'LM-014',
    label: 'Golf shirt',
    width: 1122,
    height: 1402,
    mmPerUnit: SHIRT_MM,
    sizeNote: 'on a size L shirt',
    views: [
      { id: 'front', label: 'Front' },
      { id: 'side', label: 'Left side' },
      { id: 'back', label: 'Back' },
    ],
    colours: [
      { id: 'white', name: 'White', swatch: '#eceef2', dark: false },
      { id: 'black', name: 'Black', swatch: '#1d1d1d', dark: true },
      { id: 'blue', name: 'Royal blue', swatch: '#104199', dark: true },
    ],
    zones: [
      // Left and right are the wearer's: the left chest is on the right of the front photo.
      { id: 'left-chest', label: 'Left chest', view: 'front', cx: 718, cy: 425, w: mm(100), h: mm(80), rotate: 0, methods: CHEST },
      { id: 'right-chest', label: 'Right chest', view: 'front', cx: 404, cy: 425, w: mm(100), h: mm(80), rotate: 0, methods: CHEST },
      { id: 'full-front', label: 'Full front', view: 'front', cx: 561, cy: 705, w: mm(280), h: mm(300), rotate: 0, methods: ['screen-printing'] },
      { id: 'left-sleeve', label: 'Left sleeve', view: 'side', cx: 652, cy: 455, w: mm(115), h: mm(150), rotate: 0, methods: CHEST },
      { id: 'back-yoke', label: 'Below the collar', view: 'back', cx: 561, cy: 258, w: mm(270), h: mm(80), rotate: 0, methods: CHEST },
      { id: 'full-back', label: 'Full back', view: 'back', cx: 561, cy: 625, w: mm(330), h: mm(390), rotate: 0, methods: ['screen-printing'] },
    ],
    photo: (colour, view) => `/mockups/golf-shirt/${colour}-${view}.webp`,
  },
  {
    id: 'LM-016',
    label: 'Bottle',
    width: 1000,
    height: 1000,
    mmPerUnit: null,
    sizeNote: '',
    views: [{ id: 'front', label: 'Front' }],
    colours: [{ id: 'black', name: 'Black', swatch: '#141414', dark: true }],
    zones: [
      { id: 'lengthwise', label: 'Along the bottle', view: 'front', cx: 500, cy: 610, w: 420, h: 130, rotate: -90, methods: ['engraving'], auto: true },
      { id: 'front', label: 'Front', view: 'front', cx: 500, cy: 640, w: 170, h: 220, rotate: 0, methods: ['engraving'], auto: true },
    ],
    photo: () => '/products/gp-al-68-b-bl-no-logo.webp',
  },
  {
    id: 'LM-024',
    label: 'Tote',
    width: 1000,
    height: 1000,
    mmPerUnit: null,
    sizeNote: '',
    views: [{ id: 'front', label: 'Front' }],
    colours: [{ id: 'natural', name: 'Natural', swatch: '#efe9da', dark: false }],
    zones: [{ id: 'front', label: 'Front', view: 'front', cx: 490, cy: 705, w: 330, h: 330, rotate: 0, methods: ['screen-printing'] }],
    photo: () => '/products/idea-1142-bl-no-logo.webp',
  },
]

/**
 * One branding position in use. The artwork (the logo, or the company name) is the same on every
 * position. Offsets are in the zone's own (unrotated) frame, in photo units.
 */
export interface Placement {
  zoneId: string
  /** The zone's usual method: embroidery on the chest, screen print on big areas. */
  method: Method
  /** Null: a logo in its own colours, or text in whatever reads on the garment. */
  ink: string | null
  /** Share of the largest size that fits the zone. */
  scale: number
  dx: number
  dy: number
}

export const MIN_SCALE = 0.15
const START_SCALE = 0.8

export function defaultPlacement(zone: Zone): Placement {
  return { zoneId: zone.id, method: zone.methods[0], ink: null, scale: START_SCALE, dx: 0, dy: 0 }
}

/** Largest width the artwork can have in the zone, given its width ÷ height. */
export function maxWidthFor(zone: Zone, aspect: number) {
  return Math.min(zone.w, zone.h * aspect)
}

/** Keeps the artwork's size and position inside the zone. */
export function clampPlacement(p: Placement, zone: Zone, aspect: number): Placement {
  const scale = Math.max(MIN_SCALE, Math.min(1, p.scale))
  const width = maxWidthFor(zone, aspect) * scale
  const height = width / aspect
  const freeX = Math.max(0, (zone.w - width) / 2)
  const freeY = Math.max(0, (zone.h - height) / 2)
  return {
    ...p,
    scale,
    dx: Math.max(-freeX, Math.min(freeX, p.dx)),
    dy: Math.max(-freeY, Math.min(freeY, p.dy)),
  }
}

/** The artwork's box, in the zone's unrotated frame, in photo units. */
export function artBox(zone: Zone, p: Placement, aspect: number) {
  const w = maxWidthFor(zone, aspect) * p.scale
  const h = w / aspect
  return { x: zone.cx + p.dx - w / 2, y: zone.cy + p.dy - h / 2, w, h }
}

/** A zone's own box, unrotated, in photo units. */
export function zoneBox(zone: Zone) {
  return { x: zone.cx - zone.w / 2, y: zone.cy - zone.h / 2, w: zone.w, h: zone.h }
}

/** Turns a movement on the photo into the zone's own frame (undoing the zone's rotation). */
export function toZoneFrame(zone: Zone, x: number, y: number) {
  const a = (zone.rotate * Math.PI) / 180
  const cos = Math.cos(a)
  const sin = Math.sin(a)
  return { x: x * cos + y * sin, y: -x * sin + y * cos }
}

/** The colour the artwork is drawn in, or null to show a logo's own colours. */
export function effectiveInk(p: Placement, kind: 'logo' | 'text', darkGarment: boolean) {
  if (p.method === 'engraving') return ENGRAVED
  if (kind === 'text') return p.ink ?? contrastInk(darkGarment)
  return p.ink
}

/** Readable default ink for text on a light or dark garment. */
export function contrastInk(dark: boolean) {
  return dark ? INKS[0].value : INKS[1].value
}

/** The artwork's size in words: millimetres where the photo is calibrated, otherwise null. */
export function sizeMm(product: MockupProduct, zone: Zone, p: Placement, aspect: number) {
  if (!product.mmPerUnit) return null
  const w = maxWidthFor(zone, aspect) * p.scale * product.mmPerUnit
  return { w: Math.round(w), h: Math.round(w / aspect) }
}

/**
 * Where artwork starts on a product: among the areas marked `auto`, the one it fills most (a long
 * company name runs up the bottle; a squarer logo sits upright on the front). Otherwise the first.
 */
export function bestZone(product: MockupProduct, aspect: number): Zone {
  const fill = (z: Zone) => maxWidthFor(z, aspect) ** 2 / aspect
  const auto = product.zones.filter((z) => z.auto)
  return auto.length > 1 ? auto.reduce((a, b) => (fill(b) > fill(a) ? b : a)) : product.zones[0]
}

export function downloadName(product: MockupProduct) {
  return `linton-merch-${product.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-preview.png`
}

/** One position, in words a person can check: used for the quote note and the download caption. */
export interface PositionSummary {
  zone: string
  method: Method
  artwork: string
  ink: string | null
  size: { w: number; h: number } | null
}

/** The quote line's note (the basket keeps 300 characters). */
export function summaryNote(product: MockupProduct, colourName: string, positions: PositionSummary[]) {
  const lines = positions.map((p) => {
    const ink = p.ink ? `, ${INKS.find((i) => i.value === p.ink)?.name.toLowerCase() ?? 'one colour'}` : ''
    const size = p.size ? `, about ${p.size.w} × ${p.size.h} mm` : ''
    return `${p.zone}: ${p.artwork}, ${METHOD_NAMES[p.method].toLowerCase()}${ink}${size}`
  })
  const colour = product.colours.length > 1 ? `${colourName}. ` : ''
  return `Mock-up: ${colour}${lines.join('; ')}.`.slice(0, 300)
}
