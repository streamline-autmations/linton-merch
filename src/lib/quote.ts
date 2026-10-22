import { productById } from '@/data/products'

export const basketKey = 'linton-demo-basket-v1'
export interface QuoteItem {
  productId: string
  quantity: number
  specification: string
}
export interface Brief {
  name: string
  company: string
  email: string
  phone: string
  location: string
  deadline: string
  branding: string
  notes: string
  artworkName: string
  /** What they need in their own words. Asked for only when no products were chosen. */
  request: string
}
export const emptyBrief: Brief = {
  name: '',
  company: '',
  email: '',
  phone: '',
  location: '',
  deadline: '',
  branding: 'Please advise',
  notes: '',
  artworkName: '',
  request: '',
}
// The "Put your name on it" preview hands the visitor's company name to the quote brief.
const companyKey = 'linton-demo-company'
export function rememberCompany(name: string) {
  try {
    if (name.trim()) sessionStorage.setItem(companyKey, name.trim())
    else sessionStorage.removeItem(companyKey)
  } catch {
    /* storage blocked: the quote form simply starts empty */
  }
}
export function recalledCompany() {
  try {
    return sessionStorage.getItem(companyKey) ?? ''
  } catch {
    return ''
  }
}
export const clampQuantity = (value: number) =>
  Math.min(10000, Math.max(1, Math.round(Number.isFinite(value) ? value : 1)))

export function sanitiseBasket(value: unknown): QuoteItem[] {
  if (!Array.isArray(value)) return []
  const unique = new Map<string, QuoteItem>()
  for (const item of value) {
    if (
      !item ||
      typeof item !== 'object' ||
      typeof item.productId !== 'string' ||
      !productById.has(item.productId) ||
      typeof item.quantity !== 'number' ||
      !Number.isFinite(item.quantity)
    )
      continue
    if (unique.has(item.productId)) continue
    unique.set(item.productId, {
      productId: item.productId,
      quantity: clampQuantity(item.quantity),
      specification: typeof item.specification === 'string' ? item.specification.slice(0, 300) : '',
    })
  }
  return [...unique.values()]
}

/** A short, readable reference for a request, e.g. LM-261022-7K4P. Made in the browser. */
export function quoteReference(date = new Date()): string {
  const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789' // no 0/O or 1/I/L to misread
  const bytes = new Uint8Array(4)
  crypto.getRandomValues(bytes)
  const code = [...bytes].map((b) => alphabet[b % alphabet.length]).join('')
  const ymd = [date.getFullYear() % 100, date.getMonth() + 1, date.getDate()]
    .map((n) => String(n).padStart(2, '0'))
    .join('')
  return `LM-${ymd}-${code}`
}

/** "22 October 2026". Accepts a Date or a YYYY-MM-DD string from a date input (read as local). */
export function formatDate(value: Date | string): string {
  const date =
    typeof value === 'string'
      ? (() => {
          const [y, m, d] = value.split('-').map(Number)
          return new Date(y, (m ?? 1) - 1, d ?? 1)
        })()
      : value
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })
}

export interface QuoteMeta {
  reference: string
  /** When the request was confirmed. */
  date: Date
}

export const totalUnits = (items: QuoteItem[]) =>
  items.reduce((sum, item) => sum + item.quantity, 0)

/** The request as plain text: what goes into WhatsApp, email and the clipboard. */
export function quoteSummary(items: QuoteItem[], brief: Brief, meta: QuoteMeta): string {
  const lines = [
    `QUOTE REQUEST ${meta.reference}`,
    formatDate(meta.date),
    '',
    'Hello Linton Merch, please could you quote on the following.',
    '',
  ]
  if (items.length) {
    lines.push('PRODUCTS')
    items.forEach((item, index) => {
      const name = productById.get(item.productId)?.name ?? item.productId
      lines.push(`${index + 1}. ${name} (${item.productId}) — ${item.quantity} units`)
      if (item.specification.trim()) lines.push(`   Preferences: ${item.specification.trim()}`)
    })
    lines.push(`Total: ${totalUnits(items)} units`, '')
  }
  if (brief.request.trim()) lines.push('WHAT WE NEED', brief.request.trim(), '')
  lines.push(
    'DETAILS',
    `Branding: ${brief.branding}`,
    `Deliver to: ${brief.location.trim() || 'Not given'}`,
    `Needed by: ${brief.deadline ? formatDate(brief.deadline) : 'Flexible'}`,
    `Artwork: ${brief.artworkName ? `${brief.artworkName} (I'll send the file separately)` : 'To follow'}`,
  )
  if (brief.notes.trim()) lines.push(`Notes: ${brief.notes.trim()}`)
  lines.push(
    '',
    'CONTACT',
    `${brief.name.trim()} · ${brief.company.trim()}`,
    brief.email.trim(),
    ...(brief.phone.trim() ? [brief.phone.trim()] : []),
  )
  return lines.join('\n')
}

/** A mailto link to Linton with the request filled in. The visitor still presses Send. */
export function emailLink(to: string, subject: string, body: string): string {
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export function whatsappLink(number: string | undefined, message: string): string | null {
  const clean = (number ?? '').replace(/[\s+()-]/g, '')
  // South African mobile numbers in international format. No placeholder destination.
  if (!/^27[6-8]\d{8}$/.test(clean)) return null
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`
}
