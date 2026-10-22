import { describe, expect, it } from 'vitest'
import {
  clampQuantity,
  emailLink,
  emptyBrief,
  quoteReference,
  quoteSummary,
  sanitiseBasket,
  whatsappLink,
} from './quote'

describe('stored basket boundary', () => {
  it('rejects unknown products, malformed values and duplicates', () => {
    expect(
      sanitiseBasket([
        { productId: 'unknown', quantity: 10 },
        null,
        { productId: 'LM-001', quantity: '25' },
        { productId: 'LM-001', quantity: 0, specification: 'Navy' },
        { productId: 'LM-001', quantity: 25 },
        { productId: 'LM-002', quantity: Infinity },
        { productId: 'LM-003', quantity: 10001, specification: 'a'.repeat(400) },
      ]),
    ).toEqual([
      { productId: 'LM-001', quantity: 1, specification: 'Navy' },
      { productId: 'LM-003', quantity: 10000, specification: 'a'.repeat(300) },
    ])
    expect(sanitiseBasket({ items: [] })).toEqual([])
  })
  it('keeps quantities finite and within bounds', () => {
    expect([NaN, -4, 2.6, 10001].map(clampQuantity)).toEqual([1, 1, 3, 10000])
  })
})

describe('request handoff', () => {
  const meta = { reference: 'LM-261022-ABCD', date: new Date(2026, 9, 22) }
  it('includes the reference, every product, preferences and contact', () => {
    const text = quoteSummary(
      [
        { productId: 'LM-001', quantity: 40, specification: 'Navy, 20 M + 20 L' },
        { productId: 'LM-016', quantity: 80, specification: '' },
      ],
      {
        ...emptyBrief,
        name: 'Thandi Mokoena',
        company: 'Example Co',
        email: 'thandi@example.com',
        location: 'Cape Town',
        deadline: '2026-11-14',
        artworkName: 'logo.svg',
      },
      meta,
    )
    expect(text).toContain('QUOTE REQUEST LM-261022-ABCD')
    expect(text).toContain('22 October 2026')
    expect(text).toContain('1. Corporate shirt (LM-001) — 40 units')
    expect(text).toContain('2. Insulated bottle (LM-016) — 80 units')
    expect(text).toContain('Preferences: Navy, 20 M + 20 L')
    expect(text).toContain('Total: 120 units')
    expect(text).toContain('Needed by: 14 November 2026')
    expect(text).toContain("logo.svg (I'll send the file separately)")
    expect(text).toContain('thandi@example.com')
    expect(text).not.toContain('WHAT WE NEED')
    expect(text.toLowerCase()).not.toContain('demo')
  })
  it('works with no products when they describe what they need', () => {
    const text = quoteSummary(
      [],
      { ...emptyBrief, name: 'Thandi', request: '  40 navy golf shirts, logo on the chest  ' },
      meta,
    )
    expect(text).not.toContain('PRODUCTS')
    expect(text).toContain('WHAT WE NEED\n40 navy golf shirts, logo on the chest')
    expect(text).toContain('Needed by: Flexible')
  })
  it('makes short, unambiguous references', () => {
    const ref = quoteReference(new Date(2026, 9, 2))
    expect(ref).toMatch(/^LM-261002-[A-HJKMNP-Z2-9]{4}$/)
  })
  it('builds a filled-in email link', () => {
    expect(emailLink('a@b.co', 'Quote request X', 'A & B\nhi')).toBe(
      'mailto:a@b.co?subject=Quote%20request%20X&body=A%20%26%20B%0Ahi',
    )
  })
  it('never builds a link to an empty or invalid WhatsApp recipient', () => {
    expect(whatsappLink(undefined, 'hello')).toBeNull()
    expect(whatsappLink('0000000000', 'hello')).toBeNull()
    expect(whatsappLink('27825505251', 'hi')).toBe('https://wa.me/27825505251?text=hi')
    expect(whatsappLink('+27 82 123 4567', 'A & B\nhello')).toBe(
      'https://wa.me/27821234567?text=A%20%26%20B%0Ahello',
    )
  })
})
