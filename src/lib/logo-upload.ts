// Browser-only logo handling for the "Put your logo on it" preview. A logo never leaves the
// device: the file is drawn to a canvas, trimmed to its visible edges and, when it sits on a plain
// background (a JPG logo, say), offered a cut-out version with that background removed.

export interface LogoImage {
  url: string
  width: number
  height: number
}

export interface UploadedLogo {
  name: string
  original: LogoImage
  /** Same logo with its plain background removed; null when it already has transparency. */
  cutOut: LogoImage | null
  useCutOut: boolean
}

export const LOGO_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
export const LOGO_ACCEPT = '.png,.jpg,.jpeg,.webp,.svg'
export const LOGO_MAX_BYTES = 10 * 1024 * 1024
const MAX_SIDE = 1600

export class LogoError extends Error {}

export function logoImage(logo: UploadedLogo): LogoImage {
  return logo.useCutOut && logo.cutOut ? logo.cutOut : logo.original
}

export function releaseLogo(logo: UploadedLogo) {
  URL.revokeObjectURL(logo.original.url)
  if (logo.cutOut) URL.revokeObjectURL(logo.cutOut.url)
}

export async function readLogo(file: File): Promise<UploadedLogo> {
  const type = file.type || (file.name.toLowerCase().endsWith('.svg') ? 'image/svg+xml' : '')
  if (!LOGO_TYPES.includes(type)) throw new LogoError('Use a PNG, JPG, WebP or SVG file.')
  if (file.size > LOGO_MAX_BYTES) throw new LogoError('That file is over 10 MB. Try a smaller copy of your logo.')

  const img = await loadImage(type === 'image/svg+xml' ? await sizedSvg(file) : file)
  const scale = Math.min(1, MAX_SIDE / Math.max(img.naturalWidth, img.naturalHeight))
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(img.naturalWidth * scale))
  canvas.height = Math.max(1, Math.round(img.naturalHeight * scale))
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) throw new LogoError("This browser can't read images. Try another browser.")
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

  let pixels: ImageData
  try {
    pixels = ctx.getImageData(0, 0, canvas.width, canvas.height)
  } catch {
    throw new LogoError("That file couldn't be read. Try saving it as a PNG.")
  }

  const original = await toLogoImage(trim(pixels))
  if (!original) throw new LogoError('That file looks empty. Check it shows your logo.')
  const background = plainBackground(pixels)
  const cutOut = background ? await toLogoImage(trim(removeBackground(pixels, background))) : null

  return { name: file.name, original, cutOut, useCutOut: cutOut != null }
}

function loadImage(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      if (img.naturalWidth > 0 && img.naturalHeight > 0) resolve(img)
      else reject(new LogoError("That file couldn't be read. Try saving it as a PNG."))
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new LogoError("That file couldn't be read. Try saving it as a PNG."))
    }
    img.src = url
  })
}

/** SVGs without a width and height draw at 0×0 in some browsers: size them from the viewBox. */
async function sizedSvg(file: File): Promise<Blob> {
  const doc = new DOMParser().parseFromString(await file.text(), 'image/svg+xml')
  const svg = doc.documentElement
  if (svg.nodeName !== 'svg') throw new LogoError("That SVG couldn't be read. Try saving it as a PNG.")
  const box = (svg.getAttribute('viewBox') ?? '').split(/[\s,]+/).map(Number)
  const vw = box.length === 4 && box[2] > 0 ? box[2] : parseFloat(svg.getAttribute('width') ?? '') || 300
  const vh = box.length === 4 && box[3] > 0 ? box[3] : parseFloat(svg.getAttribute('height') ?? '') || 300
  const scale = MAX_SIDE / Math.max(vw, vh)
  svg.setAttribute('width', String(Math.round(vw * scale)))
  svg.setAttribute('height', String(Math.round(vh * scale)))
  if (!svg.getAttribute('viewBox')) svg.setAttribute('viewBox', `0 0 ${vw} ${vh}`)
  return new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml' })
}

type Rgb = [number, number, number]

/** The colour of a plain, opaque background, judged from the four corners; null if there isn't one. */
function plainBackground({ data, width, height }: ImageData): Rgb | null {
  const corners = [0, width - 1, (height - 1) * width, height * width - 1].map((i) => i * 4)
  if (corners.some((i) => data[i + 3] < 250)) return null
  const [r, g, b] = [0, 1, 2].map((c) => corners.reduce((sum, i) => sum + data[i + c], 0) / 4)
  const even = corners.every((i) => colourDistance(data, i, r, g, b) < 36)
  return even ? [r, g, b] : null
}

function colourDistance(data: Uint8ClampedArray, i: number, r: number, g: number, b: number) {
  return Math.abs(data[i] - r) + Math.abs(data[i + 1] - g) + Math.abs(data[i + 2] - b)
}

/**
 * Clears the background reachable from the edges (so white inside the logo stays), then softens
 * the pixels along the cut so the edge doesn't look jagged.
 */
function removeBackground(source: ImageData, [r, g, b]: Rgb): ImageData {
  const { width, height } = source
  const data = new Uint8ClampedArray(source.data)
  const TOL = 48
  const cleared = new Uint8Array(width * height)
  const stack = new Int32Array(width * height)
  let top = 0
  const push = (p: number) => {
    if (!cleared[p] && colourDistance(data, p * 4, r, g, b) < TOL) {
      cleared[p] = 1
      stack[top++] = p
    }
  }
  for (let x = 0; x < width; x++) {
    push(x)
    push((height - 1) * width + x)
  }
  for (let y = 0; y < height; y++) {
    push(y * width)
    push(y * width + width - 1)
  }
  while (top > 0) {
    const p = stack[--top]
    const x = p % width
    if (x > 0) push(p - 1)
    if (x < width - 1) push(p + 1)
    if (p >= width) push(p - width)
    if (p < width * (height - 1)) push(p + width)
  }
  for (let p = 0; p < width * height; p++) {
    if (cleared[p]) {
      data[p * 4 + 3] = 0
      continue
    }
    const x = p % width
    const touches =
      (x > 0 && cleared[p - 1]) ||
      (x < width - 1 && cleared[p + 1]) ||
      (p >= width && cleared[p - width]) ||
      (p < width * (height - 1) && cleared[p + width])
    if (touches) {
      const d = colourDistance(data, p * 4, r, g, b)
      if (d < TOL * 2.5) data[p * 4 + 3] = Math.round((data[p * 4 + 3] * (d - TOL)) / (TOL * 1.5))
    }
  }
  return new ImageData(data, width, height)
}

/** Crops to the visible pixels so sizes refer to the logo, not its empty margin. */
function trim(image: ImageData): ImageData | null {
  const { data, width, height } = image
  let x0 = width
  let y0 = height
  let x1 = -1
  let y1 = -1
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] > 12) {
        if (x < x0) x0 = x
        if (x > x1) x1 = x
        if (y < y0) y0 = y
        if (y > y1) y1 = y
      }
    }
  }
  if (x1 < 0) return null
  const w = x1 - x0 + 1
  const h = y1 - y0 + 1
  if (w === width && h === height) return image
  const out = new ImageData(w, h)
  for (let y = 0; y < h; y++) {
    const from = ((y0 + y) * width + x0) * 4
    out.data.set(data.subarray(from, from + w * 4), y * w * 4)
  }
  return out
}

async function toLogoImage(image: ImageData | null): Promise<LogoImage | null> {
  if (!image) return null
  const canvas = document.createElement('canvas')
  canvas.width = image.width
  canvas.height = image.height
  canvas.getContext('2d')!.putImageData(image, 0, 0)
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'))
  if (!blob) throw new LogoError("That file couldn't be read. Try saving it as a PNG.")
  return { url: URL.createObjectURL(blob), width: image.width, height: image.height }
}

// ---- Company-name artwork ------------------------------------------------------------------

export const TEXT_FAMILY = "'Host Grotesk Variable', Arial, sans-serif"
export const MAX_LINES = 3
const SIZE = 100
const LINE_GAP = 1.18 * SIZE

/** How a (possibly multi-line) name sits in its ink box, measured at a 100px font size. */
export interface TextLayout {
  lines: string[]
  /** Width ÷ height of the drawn ink. */
  aspect: number
  /** The ink box relative to the first line's centre and baseline. */
  left: number
  top: number
  width: number
  height: number
  lineGap: number
}

/** The visitor's lines, without blank ones, at most MAX_LINES. */
export function textLines(text: string) {
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, MAX_LINES)
  return lines.length ? lines : ['']
}

/** Measures each line by its drawn ink, centred, so the whole block fits its area like a logo. */
export function layoutText(text: string, weight: number): TextLayout {
  const lines = textLines(text)
  const ctx = document.createElement('canvas').getContext('2d')
  let left = 0
  let right = 0
  let top = 0
  let bottom = 0
  if (ctx) {
    ctx.font = `${weight} ${SIZE}px ${TEXT_FAMILY}`
    ctx.textAlign = 'center'
    lines.forEach((line, i) => {
      const m = ctx.measureText(line)
      left = Math.min(left, -m.actualBoundingBoxLeft)
      right = Math.max(right, m.actualBoundingBoxRight)
      top = Math.min(top, i * LINE_GAP - m.actualBoundingBoxAscent)
      bottom = Math.max(bottom, i * LINE_GAP + m.actualBoundingBoxDescent)
    })
  }
  if (!(right - left > 0) || !(bottom - top > 0)) {
    // No canvas, or nothing drawn: a rough box so the layout still works.
    const longest = Math.max(1, ...lines.map((l) => l.length))
    left = -longest * 31
    right = longest * 31
    top = -72
    bottom = (lines.length - 1) * LINE_GAP + 4
  }
  const width = right - left
  const height = bottom - top
  return { lines, aspect: width / height, left, top, width, height, lineGap: LINE_GAP }
}

/** The text as a tight black PNG data URL, so the download can place it like any logo. */
export function rasteriseText(layout: TextLayout, weight: number): string {
  const k = 3.2
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.ceil(layout.width * k))
  canvas.height = Math.max(1, Math.ceil(layout.height * k))
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new LogoError("This browser can't draw images. Try another browser.")
  ctx.font = `${weight} ${SIZE * k}px ${TEXT_FAMILY}`
  ctx.textAlign = 'center'
  ctx.fillStyle = '#000'
  layout.lines.forEach((line, i) => ctx.fillText(line, -layout.left * k, (i * layout.lineGap - layout.top) * k))
  return canvas.toDataURL('image/png')
}
