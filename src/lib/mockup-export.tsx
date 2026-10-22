import { ArtworkLayer, type ArtworkSource } from '@/components/MockupArtwork'
import type { Placed } from '@/components/MockupStage'
import { rasteriseText } from '@/lib/logo-upload'
import { downloadName, type GarmentColour, type MockupProduct } from '@/lib/mockup'

// Builds the downloadable PNG: every view that carries branding, side by side, with the artwork
// exactly as the screen shows it, and a caption strip so the picture is never mistaken for an
// artwork proof when it is shared on.

const PANEL = 1400
const GAP = 24
const STRIP = 170
const PAPER = '#f3f5f8' // cloud
const INK = '#0b2a5b' // navy

export interface ExportInput {
  product: MockupProduct
  colour: GarmentColour
  placed: Placed[]
  /** Shown when nothing is placed yet. */
  view: string
}

export async function downloadMockupPng({ product, colour, placed, view }: ExportInput) {
  await Promise.all([
    document.fonts.load('700 40px "Host Grotesk Variable"'),
    document.fonts.load('500 30px Satoshi'),
  ])

  // An SVG drawn into an image can't reach blob: URLs, so artwork is embedded as data URIs. Text
  // becomes a tight PNG first, so the SVG needs no web font.
  const ready = await Promise.all(placed.map(async (item) => ({ ...item, art: await embeddable(item.art) })))
  const views = product.views.filter((v) => ready.some((p) => p.zone.view === v.id))
  const panels = views.length ? views : product.views.filter((v) => v.id === view)

  const panelWidth = Math.round((product.width / product.height) * PANEL)
  const width = panels.length * panelWidth + (panels.length - 1) * GAP
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = PANEL + STRIP
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('This browser cannot draw the picture.')
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, width, PANEL)

  const { renderToStaticMarkup } = await import('react-dom/server')
  for (const [i, v] of panels.entries()) {
    const x = i * (panelWidth + GAP)
    const markup = renderToStaticMarkup(
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${product.width} ${product.height}`}
        width={panelWidth}
        height={PANEL}
      >
        {ready
          .filter((p) => p.zone.view === v.id)
          .map((p) => (
            <ArtworkLayer key={p.zone.id} zone={p.zone} placement={p.placement} art={p.art} ink={p.ink} filterId={`mk-${p.zone.id}`} />
          ))}
      </svg>,
    )
    const [photo, layer] = await Promise.all([
      loadImage(product.photo(colour.id, v.id)),
      loadImage(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`),
    ])
    ctx.fillStyle = PAPER
    ctx.fillRect(x, 0, panelWidth, PANEL)
    // The photos sit on white: multiply lets the paper tone show through, as on the page.
    ctx.globalCompositeOperation = 'multiply'
    ctx.drawImage(photo, x, 0, panelWidth, PANEL)
    ctx.globalCompositeOperation = 'source-over'
    ctx.drawImage(layer, x, 0, panelWidth, PANEL)
    if (panels.length > 1) {
      ctx.fillStyle = INK
      ctx.font = '500 30px Satoshi, Arial, sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText(v.label, x + 36, 60)
    }
  }

  const colourName = product.colours.length > 1 ? `, ${colour.name.toLowerCase()}` : ''
  drawCaption(ctx, width, `${product.label}${colourName}`)

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'))
  if (!blob) throw new Error('The picture could not be saved.')
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = downloadName(product)
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 10_000)
}

async function embeddable(art: ArtworkSource): Promise<ArtworkSource> {
  if (art.kind === 'image') return { ...art, href: await toDataUrl(art.href) }
  return { kind: 'image', href: rasteriseText(art.layout, art.weight), aspect: art.layout.aspect }
}

function drawCaption(ctx: CanvasRenderingContext2D, width: number, detail: string) {
  const top = PANEL
  ctx.fillStyle = INK
  ctx.fillRect(0, top, width, STRIP)
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = '#ffffff'
  ctx.font = '700 46px "Host Grotesk Variable", Arial, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('Linton Merch', 64, top + 78)
  ctx.font = '500 32px Satoshi, Arial, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText(detail, width - 64, top + 76)
  ctx.fillStyle = 'rgba(255,255,255,0.62)'
  ctx.font = '500 26px Satoshi, Arial, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('A sketch, not an artwork proof. Placement, size and colours are confirmed first.', 64, top + 134)
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('An image could not be loaded.'))
    img.src = src
  })
}

async function toDataUrl(url: string): Promise<string> {
  if (url.startsWith('data:')) return url
  const blob = await (await fetch(url)).blob()
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('The logo could not be read.'))
    reader.readAsDataURL(blob)
  })
}
