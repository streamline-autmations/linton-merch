import { chromium } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const browser = await chromium.launch({ executablePath: process.env.E2E_BROWSER_PATH || undefined })
const checks = []
try {
  for (const width of [320, 390, 768, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 } })
    const page = await context.newPage()
    for (const route of ['/', '/catalogue', '/quote', '/about']) {
      await page.goto(`http://127.0.0.1:5173${route}`)
      if (route === '/quote') {
        await page.evaluate(() =>
          localStorage.setItem(
            'linton-demo-basket-v1',
            JSON.stringify([
              { productId: 'LM-001', quantity: 25, specification: '' },
              { productId: 'LM-016', quantity: 25, specification: '' },
            ]),
          ),
        )
        await page.reload()
      }
      await page.locator('h1').waitFor()
      await page.evaluate(() => document.fonts.ready)
      const dimensions = await page.evaluate(() => ({
        scroll: document.documentElement.scrollWidth,
        viewport: window.innerWidth,
      }))
      checks.push({
        width,
        route,
        noOverflow: dimensions.scroll <= dimensions.viewport,
        ...dimensions,
      })
      if (width === 390 || width === 1440) {
        const result = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
          .analyze()
        checks.push({
          width,
          route,
          accessibility: result.violations.map((v) => ({
            id: v.id,
            impact: v.impact,
            nodes: v.nodes.map((n) => n.target),
          })),
        })
      }
    }
    await context.close()
  }
  const page = await browser.newPage({ viewport: { width: 390, height: 1000 } })
  await page.goto('http://127.0.0.1:5173/catalogue')
  await page.locator('h1').waitFor()
  await page.evaluate(() => {
    document.documentElement.style.fontSize = '200%'
  })
  checks.push({
    enlargedText: true,
    width: 390,
    ...(await page.evaluate(() => ({
      noOverflow: document.documentElement.scrollWidth <= window.innerWidth,
      scroll: document.documentElement.scrollWidth,
    }))),
  })
  await page.screenshot({ path: 'docs/preview/catalogue-enlarged-mobile.png', fullPage: true })
  console.log(JSON.stringify(checks, null, 2))
  if (checks.some((check) => check.noOverflow === false || check.accessibility?.length))
    process.exitCode = 1
} finally {
  await browser.close()
}
