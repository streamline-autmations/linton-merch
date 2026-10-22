import { describe, expect, it } from 'vitest'
import { clampQuantity, emptyBrief, quoteSummary, sanitiseBasket, whatsappLink } from './quote'

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

describe('honest request handoff', () => {
  it('includes every product, preferences and contact without implying delivery', () => {
    const text = quoteSummary(
      [
        { productId: 'LM-001', quantity: 40, specification: 'Navy, 20 M + 20 L' },
        { productId: 'LM-016', quantity: 80, specification: '' },
      ],
      {
        ...emptyBrief,
        name: 'Demo Person',
        company: 'Example Co',
        email: 'demo@example.com',
        location: 'Cape Town',
        artworkName: 'sample.png',
      },
    )
    expect(text).toContain('Corporate shirt (LM-001) — 40 units')
    expect(text).toContain('Insulated bottle (LM-016) — 80 units')
    expect(text).toContain('Navy, 20 M + 20 L')
    expect(text).toContain('No enquiry has been sent')
    expect(text).toContain('not uploaded')
    expect(text).toContain('demo@example.com')
    expect(text).not.toContain('WHAT WE NEED')
  })
  it('works with no products when they describe what they need', () => {
    const text = quoteSummary([], {
      ...emptyBrief,
      name: 'Demo Person',
      request: '  40 navy golf shirts, logo on the chest  ',
    })
    expect(text).not.toContain('PRODUCT SELECTION')
    expect(text).toContain('WHAT WE NEED\n40 navy golf shirts, logo on the chest')
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
