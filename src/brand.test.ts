import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

// Keeps the site on the palette in docs/BRAND_GUIDELINES.md. Update both together.
const palette = ['#0b2a5b', '#004298', '#029b97', '#ffffff', '#f3f5f8', '#d3dae3', '#4a5873']
const system = ['#fff', '#000', '#a32828'] // white/black shorthands for shadows and masks; error red
const allowedRgb = ['11 42 91', '0 0 0', '255 255 255'] // navy, black and white with alpha

// Product and thread colours customers pick in the logo builder are product data, not site colours.
const productColourFiles = ['lib/mockup.ts', 'lib/logo-upload.ts', 'components/MockupArtwork.tsx']

const root = join(process.cwd(), 'src')
function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    return statSync(path).isDirectory() ? files(path) : [path]
  })
}
const rel = (path: string) => path.slice(root.length + 1).replaceAll('\\', '/')
const source = files(root).filter(
  (f) => /\.(tsx?|css)$/.test(f) && !f.endsWith('.test.ts') && !productColourFiles.includes(rel(f)),
)
const hexes = (text: string) => (text.match(/#[0-9a-fA-F]{3,8}\b/g) ?? []).map((h) => h.toLowerCase())

describe('brand palette', () => {
  it('uses only the palette colours anywhere in the site code', () => {
    const allowed = new Set([...palette, ...system])
    const stray = source.flatMap((f) =>
      hexes(readFileSync(f, 'utf8'))
        .filter((h) => !allowed.has(h))
        .map((h) => `${rel(f)}: ${h}`),
    )
    expect(stray).toEqual([])
  })

  it('defines every palette colour in index.css', () => {
    const css = readFileSync(join(root, 'index.css'), 'utf8')
    for (const colour of palette) expect(hexes(css)).toContain(colour)
  })

  it('tints with navy, black or white only', () => {
    const stray = source.flatMap((f) =>
      [...readFileSync(f, 'utf8').matchAll(/rgba?\(\s*(\d+)[\s_,]+(\d+)[\s_,]+(\d+)/g)]
        .map((m) => `${m[1]} ${m[2]} ${m[3]}`)
        .filter((rgb) => !allowedRgb.includes(rgb))
        .map((rgb) => `${rel(f)}: rgb(${rgb})`),
    )
    expect(stray).toEqual([])
  })

  it('uses no retired colours or default Tailwind palettes', () => {
    const banned =
      /\b(?:bg|text|border|from|to|via|ring|fill|stroke|decoration|outline)-(?:signal|ink-soft|(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d)/g
    const stray = source.flatMap((f) =>
      (readFileSync(f, 'utf8').match(banned) ?? []).map((c) => `${rel(f)}: ${c}`),
    )
    expect(stray).toEqual([])
  })
})
