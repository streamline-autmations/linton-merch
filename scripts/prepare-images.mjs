import sharp from 'sharp'
import { readdir, mkdir, writeFile, stat } from 'node:fs/promises'
import path from 'node:path'

// Run after changing source assets. Originals remain available for provenance and reprocessing.
// No upscaling: every responsive candidate is bounded by the source's real pixel dimensions.
await mkdir('public/media', { recursive: true })
const manifest = {}
let bytes = 0
for (const folder of ['products', 'gifts', 'story', 'brand']) {
  for (const file of (await readdir(`public/${folder}`)).sort()) {
    if (!/\.(webp|png|jpe?g)$/.test(file)) continue
    const src = `/${folder}/${file}`
    const metadata = await sharp(`public${src}`).metadata()
    const sourceTime = (await stat(`public${src}`)).mtimeMs
    const widths = [...new Set([160, 320, 640, 960, Math.min(metadata.width, 1280)].filter(w => w <= metadata.width))].sort((a,b) => a-b)
    const stem = `${folder}-${path.parse(file).name}`
    const candidates = { webp: [], avif: [] }
    for (const width of widths) {
      for (const format of ['webp', 'avif']) {
        const output = `/media/${stem}-${width}.${format}`
        const existing = await stat(`public${output}`).catch(() => null)
        const info = existing && existing.mtimeMs >= sourceTime ? existing : await sharp(`public${src}`).rotate().resize({width, withoutEnlargement:true})
          .toFormat(format, {quality:format === 'avif' ? 55 : 82, effort:4}).toFile(`public${output}`)
        candidates[format].push(`${output} ${width}w`)
        bytes += info.size
      }
    }
    manifest[src] = {width:metadata.width, height:metadata.height, src:`/media/${stem}-${widths.at(-1)}.webp`, webp:candidates.webp.join(', '), avif:candidates.avif.join(', ')}
  }
}
await writeFile('src/data/image-manifest.json', JSON.stringify(manifest, null, 2)+'\n')
console.log(`Prepared ${Object.keys(manifest).length} source images; ${(bytes/1e6).toFixed(2)} MB across all responsive variants.`)
