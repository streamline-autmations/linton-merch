import { chromium, webkit, devices } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { mkdir, writeFile } from 'node:fs/promises'

const baseURL = process.env.POLISH_BASE_URL ?? 'http://127.0.0.1:5173'
const engine = process.argv.includes('--webkit') ? 'webkit' : 'chromium'
const output = `docs/preview/polish/${engine}`
await mkdir(output, { recursive: true })
const browser = await { chromium, webkit }[engine].launch()
const findings = []
const failures = []
const errors = []
const viewports =
  engine === 'webkit'
    ? [
        [390, 844],
        [320, 640],
        [844, 390],
        [768, 1024],
      ]
    : [
        [1440, 1000],
        [1024, 900],
        [768, 1024],
        [390, 844],
        [360, 740],
        [320, 640],
        [844, 390],
      ]
try {
  for (const [width, height] of viewports) {
    const context = await browser.newContext({
      ...(width < 500 || height < 500 ? { ...devices['iPhone 13'] } : {}),
      viewport: { width, height },
      deviceScaleFactor: 1,
      reducedMotion: 'no-preference',
    })
    const page = await context.newPage()
    page.on('pageerror', (error) => errors.push(`${width}: ${error.message}`))
    await context.addInitScript(() =>
      localStorage.setItem(
        'linton-demo-basket-v1',
        JSON.stringify([
          { productId: 'LM-001', quantity: 25, specification: '' },
          { productId: 'LM-016', quantity: 25, specification: '' },
        ]),
      ),
    )
    for (const [name, route] of [
      ['home', '/'],
      ['catalogue', '/catalogue'],
      ['about', '/about'],
      ['quote', '/quote'],
      ['product', '/product/corporate-shirt'],
    ]) {
      await page.goto(baseURL + route)
      await page.locator('h1').waitFor()
      await page.evaluate(() => document.fonts.ready)
      await page.waitForTimeout(1000)
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
      // Scroll actual content into view so lazy images and scroll reveals are represented.
      if (width === 1440 || width === 390) {
        for (
          let y = 0, end = await page.evaluate(() => document.body.scrollHeight);
          y < end;
          y += height * 0.85
        ) {
          await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), y)
          await page.waitForTimeout(70)
        }
        await page.waitForTimeout(800)
        await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
      }
      await page.waitForTimeout(650)
      const result = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth,
        brokenImages: [...document.images]
          .filter((i) => i.loading !== 'lazy' && i.complete && !i.naturalWidth)
          .map((i) => i.getAttribute('src')),
        missingAlt: [...document.images]
          .filter((i) => !i.hasAttribute('alt'))
          .map((i) => i.getAttribute('src')),
        atTop: scrollY,
      }))
      findings.push({ width, height, route, ...result })
      if (result.overflow || result.brokenImages.length || result.missingAlt.length)
        failures.push({ width, route, ...result })
      await page.screenshot({ path: `${output}/${name}-${width}x${height}.png` })
      if (
        (width === 1440 || width === 390) &&
        (name === 'home' || name === 'about' || name === 'quote')
      )
        await page.screenshot({ path: `${output}/${name}-${width}-full.png`, fullPage: true })
      if ((width === 390 || width === 1440) && engine === 'chromium') {
        const scan = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
          .analyze()
        const violations = scan.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })),
        }))
        findings.push({ width, route, violations })
        if (violations.length) failures.push({ width, route, violations })
      }
      if (name === 'product') {
        const photo = page.getByRole('button', { name: /Enlarge photo 1/ })
        await photo.click()
        await page.getByRole('dialog').waitFor()
        await page.waitForTimeout(400)
        const dialogBounds = await page.getByRole('dialog').evaluate((el) => {
          const r = el.getBoundingClientRect()
          return {x:r.x, y:r.y, width:r.width, height:r.height, inside:r.x>=-1 && r.y>=-1 && r.right<=innerWidth+1 && r.bottom<=innerHeight+1}
        })
        findings.push({width,route:'dialog-bounds',...dialogBounds})
        if (!dialogBounds.inside) failures.push({width,route:'dialog-bounds',...dialogBounds})
        await page.screenshot({ path: `${output}/dialog-${width}x${height}.png` })
        if (width === 390 && engine === 'chromium') {
          const scan = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
            .analyze()
          const violations = scan.violations.map((v) => ({
            id: v.id,
            nodes: v.nodes.map((n) => n.target),
          }))
          findings.push({ width, route: 'dialog', violations })
          if (violations.length) failures.push({ width, route: 'dialog', violations })
        }
        await page.getByRole('button', { name: 'Close', exact: true }).click()
        await page.waitForTimeout(250)
        if (!(await photo.evaluate((el) => el === document.activeElement)))
          failures.push({ width, route: 'dialog', focusReturn: false })
      }
    }
    await page.getByRole('button', { name: 'Open quote basket, 2 products' }).click()
    await page.getByRole('dialog').waitFor()
    await page.waitForTimeout(500)
    await page.screenshot({ path: `${output}/basket-${width}x${height}.png` })
    await page.getByRole('button', { name: 'Close', exact: true }).click()
    await context.close()
    console.log(`${engine} ${width}×${height}: captured and checked`)
  }
} finally {
  await browser.close()
}
await writeFile(
  `${output}/results.json`,
  JSON.stringify({ findings, failures, errors }, null, 2) + '\n',
)
console.log(JSON.stringify({ engine, checks: findings.length, failures, errors }, null, 2))
if (failures.length || errors.length) process.exitCode = 1
