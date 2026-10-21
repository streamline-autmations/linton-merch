import { describe, expect, it } from 'vitest'
import { productBySlug, productPath, products, relatedProducts, slugify } from './products'

describe('product slugs', () => {
  it('are readable, URL-safe and unique for every product', () => {
    expect(slugify('Bottle, notebook & pen gift box')).toBe('bottle-notebook-and-pen-gift-box')
    expect(slugify('Chef’s jacket')).toBe('chefs-jacket')
    const paths = products.map(productPath)
    expect(new Set(paths).size).toBe(products.length)
    for (const path of paths) expect(path).toMatch(/^\/product\/[a-z0-9]+(-[a-z0-9]+)*$/)
  })
  it('round-trip from slug back to the same product', () => {
    for (const product of products) {
      expect(productBySlug.get(productPath(product).slice('/product/'.length))).toBe(product)
    }
  })
  it('suggest related products without repeating the product itself', () => {
    const shirt = products.find((p) => p.id === 'LM-001')!
    const related = relatedProducts(shirt)
    expect(related.length).toBeGreaterThan(0)
    expect(related).not.toContain(shirt)
    expect(related[0].category).toBe(shirt.category)
  })
})
