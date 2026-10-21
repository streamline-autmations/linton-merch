import { chromium } from '@playwright/test'
import { readFile } from 'node:fs/promises'

// A share image composed from the existing brand, typefaces and real supplier photos.
const data = async (file, type) =>
  `data:${type};base64,${(await readFile(file)).toString('base64')}`
const [host, satoshi, logo, workwear, gift] = await Promise.all([
  data(
    'node_modules/@fontsource-variable/host-grotesk/files/host-grotesk-latin-wght-normal.woff2',
    'font/woff2',
  ),
  data('src/fonts/Satoshi-Medium.woff2', 'font/woff2'),
  data('public/media/brand-linton-logo-white-640.webp', 'image/webp'),
  data('public/products/alt-1101-r-lifestyle03.webp', 'image/webp'),
  data('public/gifts/an-gft-001-01-hero.webp', 'image/webp'),
])
const browser = await chromium.launch()
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  })
  await page.setContent(`<!doctype html><html lang="en-ZA"><style>
    @font-face{font-family:Host;src:url('${host}');font-weight:100 900}
    @font-face{font-family:Satoshi;src:url('${satoshi}');font-weight:500}
    *{box-sizing:border-box}body{margin:0;background:#0e161d;color:#f1f3f2;font-family:Satoshi;overflow:hidden}
    main{position:relative;width:1200px;height:630px;padding:58px 64px}
    .logo{width:250px;height:75px;object-fit:contain;object-position:left center}
    h1{position:relative;z-index:1;margin:46px 0 28px;max-width:760px;font:700 74px/.99 Host;letter-spacing:-3.3px;text-transform:uppercase}
    p{font-size:21px;color:#cbd3d4;margin:0}.stitch{position:absolute;bottom:50px;left:64px;width:620px;border-bottom:2px dashed #2ec4b6}
    .workwear{position:absolute;right:52px;top:48px;width:336px;height:534px;object-fit:cover;border-radius:4px}
    .gift{position:absolute;right:320px;bottom:50px;width:180px;height:195px;object-fit:contain;background:white;border:9px solid #0e161d;border-radius:4px}
    .notice{position:absolute;right:59px;bottom:23px;font-size:12px;color:#cbd3d4}
  </style><main><img class="workwear" src="${workwear}" alt=""><img class="logo" src="${logo}" alt="Linton Merch"><h1>Corporate<br>clothing,<br>gifts & uniforms.</h1><p>Branded in-house. Made for your team.</p><div class="stitch"></div><img class="gift" src="${gift}" alt=""><span class="notice">Concept demo · No enquiries are sent</span></main></html>`)
  await page.evaluate(async () => {
    await document.fonts.ready
    await Promise.all(Array.from(document.images, (img) => img.decode()))
  })
  await page.screenshot({ path: 'public/og-linton.jpg', type: 'jpeg', quality: 90 })
  console.log('Created public/og-linton.jpg (1200 × 630).')
} finally {
  await browser.close()
}
