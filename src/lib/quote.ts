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

export function quoteSummary(items: QuoteItem[], brief: Brief): string {
  return [
    'LINTON MERCH — DEMO REQUEST',
    'Concept only. No enquiry has been sent. Products, sizes, colours and branding are illustrative and subject to confirmation.',
    '',
    'PRODUCT SELECTION',
    ...items.map(
      (item) =>
        `${productById.get(item.productId)?.name ?? item.productId} (${item.productId}) — ${item.quantity} units${item.specification ? `\nPreferences: ${item.specification}` : ''}`,
    ),
    '',
    'PROJECT BRIEF',
    `Branding: ${brief.branding}`,
    `Delivery area: ${brief.location || 'Not provided'}`,
    `Target date: ${brief.deadline || 'To be discussed'}`,
    `Artwork filename: ${brief.artworkName || 'Not selected'} (not uploaded; file is not included in this summary)`,
    `Notes: ${brief.notes || 'None'}`,
    '',
    'CONTACT',
    `Name: ${brief.name}`,
    `Company: ${brief.company}`,
    `Email: ${brief.email}`,
    `Phone: ${brief.phone || 'Not provided'}`,
  ].join('\n')
}

export function whatsappLink(number: string | undefined, message: string): string | null {
  const clean = (number ?? '').replace(/[\s+()-]/g, '')
  // South African mobile numbers in international format. No placeholder destination.
  if (!/^27[6-8]\d{8}$/.test(clean)) return null
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`
}

export function downloadSummary(summary: string) {
  const url = URL.createObjectURL(new Blob([summary], { type: 'text/plain;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = 'linton-demo-quote.txt'
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
