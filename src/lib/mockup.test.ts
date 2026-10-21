import { describe, expect, it } from 'vitest'
import { textLines } from './logo-upload'
import {
  ENGRAVED,
  INKS,
  artBox,
  bestZone,
  clampPlacement,
  defaultPlacement,
  effectiveInk,
  maxWidthFor,
  mockupProducts,
  sizeMm,
  summaryNote,
  toZoneFrame,
} from './mockup'

const byLabel = (label: string) => mockupProducts.find((p) => p.label === label)!
const shirt = byLabel('Golf shirt')
const bottle = byLabel('Bottle')
const chest = shirt.zones[0] // left chest, 160 × 115 mm
const bottleSide = bottle.zones[0] // along the bottle, rotated -90°

describe('mock-up placement', () => {
  it('fits the artwork to whichever side of the area runs out first', () => {
    expect(maxWidthFor(chest, 100)).toBe(chest.w) // wide artwork: limited by width
    expect(maxWidthFor(chest, 0.5)).toBe(chest.h * 0.5) // tall artwork: limited by height
  })

  it('never lets the artwork leave its area', () => {
    const p = clampPlacement({ ...defaultPlacement(chest), scale: 5, dx: 999, dy: -999 }, chest, 2)
    const box = artBox(chest, p, 2)
    expect(p.scale).toBe(1)
    expect(box.x + box.w).toBeLessThanOrEqual(chest.cx + chest.w / 2 + 1e-9)
    expect(box.y).toBeGreaterThanOrEqual(chest.cy - chest.h / 2 - 1e-9)
  })

  it('keeps a minimum size', () => {
    expect(clampPlacement({ ...defaultPlacement(chest), scale: 0 }, chest, 2).scale).toBeGreaterThan(0)
  })

  it('maps a drag on the photo into a rotated area', () => {
    // The bottle's lengthwise area is turned -90°: dragging up the photo moves along the artwork.
    const moved = toZoneFrame(bottleSide, 0, -10)
    expect(moved.x).toBeCloseTo(10)
    expect(moved.y).toBeCloseTo(0)
    expect(toZoneFrame(chest, 3, 4)).toEqual({ x: 3, y: 4 })
  })

  it('reports shirt sizes in millimetres, matching the zone limits', () => {
    expect(sizeMm(shirt, chest, { ...defaultPlacement(chest), scale: 1 }, 4)).toEqual({ w: 160, h: 40 })
    expect(sizeMm(bottle, bottleSide, defaultPlacement(bottleSide), 4)).toBeNull()
  })

  it('engraves in one colour, keeps logo colours by default and keeps text readable', () => {
    expect(effectiveInk(defaultPlacement(bottleSide), 'logo', true)).toBe(ENGRAVED)
    expect(effectiveInk(defaultPlacement(chest), 'logo', false)).toBeNull()
    expect(effectiveInk(defaultPlacement(chest), 'text', false)).toBe(INKS[1].value) // black on white
    expect(effectiveInk(defaultPlacement(chest), 'text', true)).toBe(INKS[0].value) // white on black
    expect(effectiveInk({ ...defaultPlacement(chest), ink: '#c22a2a' }, 'text', true)).toBe('#c22a2a')
  })

  it('starts a long name along the bottle and a square logo on its front', () => {
    expect(bestZone(bottle, 6).id).toBe('lengthwise')
    expect(bestZone(bottle, 1).id).toBe('front')
    expect(bestZone(shirt, 6).id).toBe('left-chest')
  })

  it('writes a quote note that fits the basket', () => {
    const note = summaryNote(shirt, 'White', [
      { zone: 'Left chest', method: 'embroidery', artwork: 'logo', ink: null, size: { w: 90, h: 40 } },
      { zone: 'Full back', method: 'screen-printing', artwork: '“Acme”', ink: '#ffffff', size: { w: 300, h: 80 } },
    ])
    expect(note).toBe(
      'Mock-up: White. Left chest: logo, embroidery, about 90 × 40 mm; Full back: “Acme”, screen printing, white, about 300 × 80 mm.',
    )
    const long = Array.from({ length: 12 }, () => ({ zone: 'Left chest', method: 'embroidery' as const, artwork: 'logo', ink: null, size: null }))
    expect(summaryNote(shirt, 'White', long).length).toBeLessThanOrEqual(300)
  })

  it('keeps the visitor’s line breaks, without blank lines, up to three', () => {
    expect(textLines('Vaal\nEngineering')).toEqual(['Vaal', 'Engineering'])
    expect(textLines('  A \n\n B ')).toEqual(['A', 'B'])
    expect(textLines('1\n2\n3\n4')).toEqual(['1', '2', '3'])
    expect(textLines('')).toEqual([''])
  })
})
