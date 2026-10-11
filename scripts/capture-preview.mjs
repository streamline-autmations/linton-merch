import { chromium } from '@playwright/test'
import { mkdir } from 'node:fs/promises'

const browser = await chromium.launch({ executablePath: process.env.E2E_BROWSER_PATH || undefined })
await mkdir('docs/preview', { recursive: true })
try {
  for (const [name, viewport] of [
    ['desktop', { width: 1440, height: 1000 }],
    ['mobile', { width: 390, height: 844 }],
  ]) {
    const page = await browser.newPage({ viewport })
    for (const route of ['home', 'catalogue', 'quote']) {
      await page.goto(`http://127.0.0.1:5173/${route === 'home' ? '' : route}`)
      if (route === 'quote') {
        await page.evaluate(() =>
          localStorage.setItem(
            'linton-demo-basket-v1',
            JSON.stringify([
              { productId: 'LM-001', quantity: 25, specification: '' },
              { productId: 'LM-013', quantity: 25, specification: '' },
            ]),
          ),
        )
        await page.reload()
      }
      await page.evaluate(() => document.fonts.ready)
      await page.locator('h1').waitFor()
      await page.screenshot({ path: `docs/preview/${route}-${name}.png`, fullPage: true })
      console.log(`${route}-${name}: captured`)
    }
    await page.close()
  }
} finally {
  await browser.close()
}
