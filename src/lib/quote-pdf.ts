// The quote request as a branded A4 PDF, built in the browser. Loaded on demand (pdf-lib is
// large), so nothing here runs until someone asks for the PDF. Nothing is uploaded.
//
// Type: Host Grotesk (SIL OFL, files in public/pdf). Satoshi stays on screen only; its
// licence is unclear about fonts embedded in documents a site generates for visitors.
import {
  PDFDocument,
  rgb,
  setCharacterSpacing,
  type PDFFont,
  type PDFImage,
  type PDFPage,
} from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'
import { business } from '@/data/business'
import { productById } from '@/data/products'
import { formatDate, totalUnits, type Brief, type QuoteItem, type QuoteMeta } from '@/lib/quote'

const hex = (value: string) => {
  const n = parseInt(value.slice(1), 16)
  return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255)
}
// The brand palette (docs/BRAND_GUIDELINES.md). Teal is thread only.
const navy = hex('#0b2a5b')
const blue = hex('#004298')
const teal = hex('#029b97')
const cloud = hex('#f3f5f8')
const line = hex('#d3dae3')
const slate = hex('#4a5873')
const white = hex('#ffffff')

const W = 595.28
const H = 841.89
const M = 48 // side margin
const FOOTER = 56 // space kept clear at the bottom of every page

interface Fonts {
  regular: PDFFont
  medium: PDFFont
  bold: PDFFont
}

const asset = (path: string) => `${import.meta.env.BASE_URL.replace(/\/$/, '')}${path}`

async function bytes(path: string) {
  const response = await fetch(asset(path))
  if (!response.ok) throw new Error(`Could not load ${path}`)
  return response.arrayBuffer()
}

/** Product photo → small JPEG on white, for the table. Null if the image can't be read. */
async function thumbnail(src: string): Promise<ArrayBuffer | null> {
  try {
    const image = new Image()
    image.decoding = 'async'
    image.src = asset(src)
    await image.decode()
    const size = 240
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = size
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, size, size)
    const pad = src.startsWith('/gifts/') ? 0 : size * 0.08
    const box = size - pad * 2
    const scale = Math.min(box / image.naturalWidth, box / image.naturalHeight)
    const w = image.naturalWidth * scale
    const h = image.naturalHeight * scale
    ctx.drawImage(image, (size - w) / 2, (size - h) / 2, w, h)
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', 0.86),
    )
    return blob ? await blob.arrayBuffer() : null
  } catch {
    return null
  }
}

/** Word-wraps text (keeping its own line breaks) to a width. Over-long words are split. */
function wrap(text: string, font: PDFFont, size: number, width: number): string[] {
  const out: string[] = []
  for (const paragraph of text.replace(/\r/g, '').split('\n')) {
    let current = ''
    for (const word of paragraph.split(/\s+/).filter(Boolean)) {
      const attempt = current ? `${current} ${word}` : word
      if (font.widthOfTextAtSize(attempt, size) <= width) {
        current = attempt
        continue
      }
      if (current) out.push(current)
      current = ''
      let rest = word
      while (font.widthOfTextAtSize(rest, size) > width) {
        let cut = rest.length - 1
        while (cut > 1 && font.widthOfTextAtSize(rest.slice(0, cut), size) > width) cut--
        out.push(rest.slice(0, cut))
        rest = rest.slice(cut)
      }
      current = rest
    }
    out.push(current)
  }
  return out
}

class Writer {
  page!: PDFPage
  y = 0 // distance from the top of the page
  pages: PDFPage[] = []
  constructor(
    private doc: PDFDocument,
    private fonts: Fonts,
    private meta: QuoteMeta,
  ) {}

  addPage(first: boolean) {
    this.page = this.doc.addPage([W, H])
    this.pages.push(this.page)
    this.y = 0
    if (!first) this.continuationHeader()
  }

  /** Starts a new page when fewer than `space` points are left above the footer. */
  ensure(space: number) {
    if (this.y + space > H - FOOTER) this.addPage(false)
  }

  text(
    value: string,
    x: number,
    y: number,
    opts: {
      font?: PDFFont
      size?: number
      color?: ReturnType<typeof rgb>
      spacing?: number
      opacity?: number
    } = {},
  ) {
    const { font = this.fonts.regular, size = 10, color = navy, spacing = 0, opacity = 1 } = opts
    if (spacing) this.page.pushOperators(setCharacterSpacing(spacing))
    this.page.drawText(value, { x, y: H - y, font, size, color, opacity })
    if (spacing) this.page.pushOperators(setCharacterSpacing(0))
  }

  width(value: string, font: PDFFont, size: number, spacing = 0) {
    return font.widthOfTextAtSize(value, size) + spacing * Math.max(0, value.length - 1)
  }

  label(value: string, x: number, y: number, color = slate) {
    this.text(value.toUpperCase(), x, y, { font: this.fonts.bold, size: 7, color, spacing: 1.1 })
  }

  stitch(x1: number, x2: number, y: number, color = teal) {
    this.page.drawLine({
      start: { x: x1, y: H - y },
      end: { x: x2, y: H - y },
      thickness: 0.9,
      color,
      dashArray: [5, 3.5],
    })
  }

  rule(x1: number, x2: number, y: number, color = line, thickness = 0.6) {
    this.page.drawLine({ start: { x: x1, y: H - y }, end: { x: x2, y: H - y }, thickness, color })
  }

  rect(x: number, y: number, w: number, h: number, color: ReturnType<typeof rgb>) {
    this.page.drawRectangle({ x, y: H - y - h, width: w, height: h, color })
  }

  /** Lines of wrapped text from the current y. Returns the height used. */
  paragraph(
    value: string,
    x: number,
    width: number,
    opts: { font?: PDFFont; size?: number; color?: ReturnType<typeof rgb>; leading?: number } = {},
  ) {
    const { font = this.fonts.regular, size = 10, color = navy, leading = size * 1.45 } = opts
    for (const row of wrap(value, font, size, width)) {
      this.ensure(leading)
      this.text(row, x, this.y + size, { font, size, color })
      this.y += leading
    }
  }

  continuationHeader() {
    this.text('Linton Merch', M, 40, { font: this.fonts.bold, size: 11 })
    const ref = `Quote request ${this.meta.reference}`
    this.text(ref, W - M - this.width(ref, this.fonts.medium, 9), 40, {
      font: this.fonts.medium,
      size: 9,
      color: slate,
    })
    this.stitch(M, W - M, 52)
    this.y = 76
  }

  footers() {
    const total = this.pages.length
    this.pages.forEach((page, index) => {
      this.page = page
      const y = H - 34
      this.rule(M, W - M, y - 12)
      this.text(`${business.tradingName} · ${business.legalName} · ${business.town}`, M, y, {
        size: 7.5,
        color: slate,
      })
      const right = `${this.meta.reference}  ·  Page ${index + 1} of ${total}`
      this.text(right, W - M - this.width(right, this.fonts.regular, 7.5), y, {
        size: 7.5,
        color: slate,
      })
    })
  }
}

export async function buildQuotePdf(
  items: QuoteItem[],
  brief: Brief,
  meta: QuoteMeta,
): Promise<Blob> {
  const doc = await PDFDocument.create()
  doc.registerFontkit(fontkit)
  const [regularBytes, mediumBytes, boldBytes, logoBytes] = await Promise.all([
    bytes('/pdf/host-grotesk-400.ttf'),
    bytes('/pdf/host-grotesk-500.ttf'),
    bytes('/pdf/host-grotesk-bold.ttf'),
    bytes('/pdf/linton-logo-white.png'), // 800px copy; the master file is 4.8 MB,
  ])
  const fonts: Fonts = {
    regular: await doc.embedFont(regularBytes, { subset: true }),
    medium: await doc.embedFont(mediumBytes, { subset: true }),
    bold: await doc.embedFont(boldBytes, { subset: true }),
  }
  const logo = await doc.embedPng(logoBytes)
  const thumbs = new Map<string, PDFImage>()
  await Promise.all(
    items.map(async (item) => {
      const product = productById.get(item.productId)
      const jpg = product && (await thumbnail(product.image))
      if (jpg) thumbs.set(item.productId, await doc.embedJpg(jpg))
    }),
  )

  doc.setTitle(`Quote request ${meta.reference}`)
  doc.setSubject(`Quote request for ${brief.company.trim()}`)
  doc.setAuthor(brief.name.trim())
  doc.setCreator(business.tradingName)
  doc.setProducer(business.tradingName)
  doc.setCreationDate(meta.date)

  const w = new Writer(doc, fonts, meta)
  w.addPage(true)
  const right = W - M
  const content = W - M * 2

  // Navy masthead: white logo, reference and date, a teal stitch sewn along its lower edge.
  const band = 100
  w.rect(0, 0, W, band, navy)
  const logoH = 36
  w.page.drawImage(logo, {
    x: M,
    y: H - 28 - logoH,
    width: (logo.width / logo.height) * logoH,
    height: logoH,
  })
  const kind = 'QUOTE REQUEST'
  w.text(kind, right - w.width(kind, fonts.bold, 7.5, 1.4), 34, {
    font: fonts.bold,
    size: 7.5,
    color: white,
    spacing: 1.4,
    opacity: 0.7,
  })
  w.text(meta.reference, right - w.width(meta.reference, fonts.bold, 17), 55, {
    font: fonts.bold,
    size: 17,
    color: white,
  })
  const dated = formatDate(meta.date)
  w.text(dated, right - w.width(dated, fonts.regular, 9), 70, {
    size: 9,
    color: white,
    opacity: 0.75,
  })
  w.stitch(M, right, band - 14)

  // Title
  w.y = band + 38
  w.text('Quote request', M, w.y, { font: fonts.bold, size: 26 })
  w.y += 17
  w.y -= 10
  w.paragraph(`Prepared by ${brief.name.trim()} for ${brief.company.trim()}`, M, content, {
    size: 10,
    color: slate,
    leading: 14,
  })
  w.y += 22

  // From / To
  const col = (content - 24) / 2
  const from = [
    brief.company.trim(),
    brief.name.trim(),
    brief.email.trim(),
    brief.phone.trim(),
  ].filter(Boolean)
  const to = [
    business.tradingName,
    business.email,
    `${business.phoneDisplay} (phone & WhatsApp)`,
    business.addressLines.slice(0, -1).join(', '),
    business.addressLines.at(-1) ?? '',
  ]
  w.label('From', M, w.y)
  w.label('To', M + col + 24, w.y)
  w.y += 8
  w.rule(M, M + col, w.y)
  w.rule(M + col + 24, right, w.y)
  const blockTop = w.y + 15
  const block = (rows: string[], x: number) => {
    let y = blockTop
    rows.forEach((row, index) => {
      for (const part of wrap(row, index === 0 ? fonts.bold : fonts.regular, 9.5, col)) {
        w.text(part, x, y, { font: index === 0 ? fonts.bold : fonts.regular, size: 9.5 })
        y += 13.5
      }
    })
    return y
  }
  w.y = Math.max(block(from, M), block(to, M + col + 24)) + 12

  // Products
  if (items.length) {
    const cols = { thumb: M, name: M + 52, prefs: M + 248, qty: right }
    const header = () => {
      w.rect(M, w.y, content, 22, cloud)
      w.label('Product', cols.name, w.y + 14)
      w.label('Colours, sizes & preferences', cols.prefs, w.y + 14)
      const q = 'QTY'
      w.label(q, cols.qty - 8 - w.width(q, fonts.bold, 7, 1.1), w.y + 14)
      w.y += 22
    }
    w.ensure(22 + 64)
    header()
    items.forEach((item) => {
      const product = productById.get(item.productId)
      const nameLines = wrap(
        product?.name ?? item.productId,
        fonts.bold,
        10,
        cols.prefs - cols.name - 16,
      )
      const prefLines = item.specification.trim()
        ? wrap(item.specification.trim(), fonts.regular, 9, cols.qty - 60 - cols.prefs)
        : ['—']
      const textHeight = Math.max(nameLines.length * 13 + 14, prefLines.length * 13)
      const rowH = Math.max(50, textHeight + 18)
      if (w.y + rowH > H - FOOTER) {
        w.addPage(false)
        header()
      }
      const top = w.y + 6
      const image = thumbs.get(item.productId)
      w.page.drawRectangle({
        x: cols.thumb,
        y: H - top - 40,
        width: 40,
        height: 40,
        color: white,
        borderColor: line,
        borderWidth: 0.6,
      })
      if (image)
        w.page.drawImage(image, { x: cols.thumb + 1, y: H - top - 39, width: 38, height: 38 })
      let y = top + 10
      for (const part of nameLines) {
        w.text(part, cols.name, y, { font: fonts.bold, size: 10 })
        y += 13
      }
      w.text(`${item.productId}${product ? ` · ${product.category}` : ''}`, cols.name, y, {
        size: 8,
        color: slate,
      })
      y = top + 10
      for (const part of prefLines) {
        w.text(part, cols.prefs, y, { size: 9, color: item.specification.trim() ? navy : slate })
        y += 13
      }
      const qty = String(item.quantity)
      w.text(qty, cols.qty - 8 - w.width(qty, fonts.bold, 11), top + 11, {
        font: fonts.bold,
        size: 11,
      })
      w.y += rowH
      w.rule(M, right, w.y)
    })
    w.ensure(30)
    const total = `${totalUnits(items)} units`
    w.y += 19
    w.text('Total', cols.prefs, w.y, { font: fonts.medium, size: 10, color: slate })
    w.text(total, cols.qty - 8 - w.width(total, fonts.bold, 11), w.y, {
      font: fonts.bold,
      size: 11,
    })
    w.y += 28
  }

  // In their own words
  if (brief.request.trim()) {
    w.ensure(60)
    w.label('What we need', M, w.y)
    w.y += 8
    w.rule(M, right, w.y)
    w.y += 10
    w.paragraph(brief.request.trim(), M, content, { size: 10.5 })
    w.y += 16
  }

  // Details
  w.ensure(110)
  w.label('Details', M, w.y)
  w.y += 8
  w.rule(M, right, w.y)
  w.y += 8
  const details: [string, string][] = [
    ['Branding', brief.branding],
    ['Needed by', brief.deadline ? formatDate(brief.deadline) : 'Flexible'],
    ['Deliver to', brief.location.trim()],
    ['Artwork', brief.artworkName ? `${brief.artworkName} (sent separately)` : 'To follow'],
  ]
  if (brief.notes.trim()) details.push(['Notes', brief.notes.trim()])
  for (const [key, value] of details) {
    // Line by line, so a long note carries on over the page (label repeated there).
    const rows = wrap(value, fonts.regular, 10, content - 110)
    w.ensure(Math.min(rows.length, 3) * 13.5 + 10)
    w.y += 2
    w.text(key, M, w.y + 10, { size: 9.5, color: slate })
    for (const row of rows) {
      if (w.y + 13.5 > H - FOOTER) {
        w.addPage(false)
        w.text(`${key} (continued)`, M, w.y + 10, { size: 9.5, color: slate })
      }
      w.text(row, M + 110, w.y + 10, { size: 10 })
      w.y += 13.5
    }
    w.y += 4
    w.rule(M, right, w.y, line, 0.4)
  }
  w.y += 18

  // How to send it, and what happens next
  const steps = [
    `Send this request to ${business.tradingName} on WhatsApp (${business.whatsappDisplay}) or by email (${business.email}).`,
    'Attach your logo or artwork: a vector file (PDF, SVG or AI) works best, or a high-resolution PNG.',
    'Linton confirms pricing, minimum quantities, stock and the best branding method, then sends you a formal quote to approve.',
  ]
  // Three columns side by side, so a typical request stays on one page.
  const gap = 18
  const colW = (content - 40 - gap * 2) / 3
  const stepRows = steps.map((step) => wrap(step, fonts.regular, 8.5, colW))
  const tallest = Math.max(...stepRows.map((rows) => rows.length))
  const boxH = 52 + (tallest - 1) * 12 + 36
  w.ensure(boxH)
  const boxTop = w.y
  w.rect(M, boxTop, content, boxH, cloud)
  w.page.drawRectangle({ x: M, y: H - boxTop - boxH, width: 3, height: boxH, color: blue })
  w.label('Next steps', M + 20, boxTop + 20, navy)
  stepRows.forEach((rows, index) => {
    const x = M + 20 + index * (colW + gap)
    w.text(String(index + 1).padStart(2, '0'), x, boxTop + 37, { font: fonts.bold, size: 10 })
    rows.forEach((row, r) => w.text(row, x, boxTop + 52 + r * 12, { size: 8.5 }))
  })
  w.text(
    'This is a request for quotation, not a quote or an invoice. Prices and availability are confirmed by Linton Merch.',
    M + 20,
    boxTop + boxH - 13,
    { size: 7.5, color: slate },
  )

  w.footers()
  const pdf = await doc.save()
  return new Blob([pdf as BlobPart], { type: 'application/pdf' })
}

export function quotePdfFilename(meta: QuoteMeta) {
  return `Linton-Merch-quote-request-${meta.reference}.pdf`
}
