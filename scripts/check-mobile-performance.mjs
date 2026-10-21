import { chromium, devices } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'

const baseURL = process.env.POLISH_BASE_URL ?? 'http://127.0.0.1:4174'
const output = 'docs/preview/polish/performance'
await mkdir(output, { recursive: true })
const browser = await chromium.launch()
const results = []
try {
  for (const route of ['/', '/catalogue']) {
    const context = await browser.newContext({
      ...devices['iPhone 13'],
      viewport: { width: 390, height: 844 },
    })
    const page = await context.newPage()
    const cdp = await context.newCDPSession(page)
    await cdp.send('Network.enable')
    await cdp.send('Network.emulateNetworkConditions', {
      offline: false,
      latency: 150,
      downloadThroughput: 200000,
      uploadThroughput: 93750,
    })
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
    await page.addInitScript(() => {
      window.__polish = { lcp: 0, cls: 0, longTasks: [] }
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) window.__polish.lcp = e.startTime
      }).observe({ type: 'largest-contentful-paint', buffered: true })
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) if (!e.hadRecentInput) window.__polish.cls += e.value
      }).observe({ type: 'layout-shift', buffered: true })
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) window.__polish.longTasks.push(Math.round(e.duration))
      }).observe({ type: 'longtask', buffered: true })
    })
    const errors = []
    page.on('pageerror', (e) => errors.push(e.message))
    await page.goto(baseURL + route, { waitUntil: 'networkidle', timeout: 90000 })
    await page.waitForTimeout(1500)
    const result = await page.evaluate(() => ({
      ...window.__polish,
      transferKB: Math.round(
        performance.getEntriesByType('resource').reduce((n, e) => n + e.transferSize, 0) / 1024,
      ),
      overflow: document.documentElement.scrollWidth > innerWidth,
      brokenVisible: [...document.images]
        .filter((i) => {
          const r = i.getBoundingClientRect()
          return r.top < innerHeight && r.bottom > 0 && (!i.complete || !i.naturalWidth)
        })
        .map((i) => i.src),
      images: [...document.images]
        .filter((i) => {
          const r = i.getBoundingClientRect()
          return r.top < innerHeight && r.bottom > 0
        })
        .map((i) => ({
          url: i.currentSrc.split('/').at(-1),
          width: i.getBoundingClientRect().width,
          source: i.naturalWidth,
        })),
    }))
    await page.screenshot({
      path: `${output}/${route === '/' ? 'home' : 'catalogue'}-390-throttled.png`,
    })
    results.push({
      route,
      network: '1.6 Mbps down, 750 Kbps up, 150ms latency',
      cpu: '4× slowdown',
      ...result,
      errors,
    })
    await context.close()
  }
} finally {
  await browser.close()
}
await writeFile(`${output}/results.json`, JSON.stringify(results, null, 2) + '\n')
console.log(JSON.stringify(results, null, 2))
if (results.some((r) => r.overflow || r.brokenVisible.length || r.errors.length))
  process.exitCode = 1
