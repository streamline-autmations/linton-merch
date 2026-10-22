import { expect, test } from '@playwright/test'

test('catalogue, persistent multi-product basket and complete demo RFQ', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/catalogue')
  await expect(page.getByRole('status').filter({ hasText: '75 products' })).toBeVisible()
  await page.getByRole('button', { name: 'Marketing material & gifts', exact: true }).click()
  await expect(page.getByRole('status').filter({ hasText: '22 products' })).toBeVisible()
  await page.getByLabel('Search products').fill('no matching product')
  await expect(page.getByText('Nothing matches “no matching product”.')).toBeVisible()
  await page.getByRole('button', { name: 'Show all products' }).click()
  // Cards open a dedicated product page; Back returns to the catalogue.
  await page.getByRole('link', { name: 'Corporate shirt', exact: true }).click()
  await expect(page).toHaveURL(/\/product\/corporate-shirt$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Corporate shirt')
  await expect(page.getByText('Linton confirms both on your quote.')).toBeVisible()
  await page.goBack()
  await expect(page).toHaveURL(/\/catalogue$/)
  await page.getByRole('button', { name: 'Add Corporate shirt to quote', exact: true }).click()
  // The first add opens the quote drawer once per visit (the signature drawer motion).
  await expect(page.getByRole('dialog')).toContainText('Your quote')
  await page.keyboard.press('Escape')
  await page.getByRole('button', { name: 'Add Insulated bottle to quote', exact: true }).click()
  await page.reload()
  await page.getByRole('button', { name: 'Open quote basket, 2 products' }).click()
  await page.getByLabel('Corporate shirt quantity', { exact: true }).fill('40')
  await page.getByRole('link', { name: 'Continue to your request' }).click()
  await expect(page).toHaveURL(/\/quote$/)
  await expect(
    page
      .getByRole('complementary', { name: 'Quote selection' })
      .getByLabel('Corporate shirt quantity', { exact: true }),
  ).toHaveValue('40')
  await page.getByLabel('Colour, sizes & preferences').first().fill('Navy, 20 M + 20 L')
  // Two steps: details, then review. Required fields block Continue until filled.
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Your details' })).toBeVisible()
  await page.getByLabel('Your name').fill('Demo Person')
  await page.getByLabel(/^Company/).fill('Example Company')
  await page.getByLabel('Email address').fill('demo@example.com')
  await page.getByLabel('Delivery city & province').fill('Johannesburg, Gauteng')
  await page.getByLabel('Preferred branding').selectOption('Embroidery')
  await page.getByText('Add a date, notes or artwork').click()
  await page.getByLabel('Notes').fill('Sample annual team event')
  await page.getByLabel('Logo or artwork').setInputFiles({
    name: 'sample-logo.svg',
    mimeType: 'image/svg+xml',
    buffer: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"/>'),
  })
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await expect(page.getByText('Contact & delivery', { exact: true })).toBeVisible()
  await page.getByRole('checkbox').check()
  await page.getByRole('button', { name: 'Create demo request' }).click()
  await expect(
    page.getByText('Nothing has been sent to Linton Merch.', { exact: true }),
  ).toBeVisible()
  const summary = page.getByLabel('Request summary')
  await expect(summary).toHaveValue(/Corporate shirt \(LM-001\) — 40 units/)
  await expect(summary).toHaveValue(/Insulated bottle \(LM-016\) — 25 units/)
  await expect(summary).toHaveValue(/Navy, 20 M \+ 20 L/)
  await expect(summary).toHaveValue(/sample-logo.svg \(not uploaded/)
  await expect(summary).toHaveValue(/Notes: Sample annual team event/)
  await expect(summary).toHaveValue(/Branding: Embroidery/)
  const download = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Download summary' }).click()
  expect((await download).suggestedFilename()).toBe('linton-demo-quote.txt')
  const stored = await page.evaluate(() => localStorage.getItem('linton-demo-basket-v1'))
  expect(stored).not.toContain('demo@example.com')
  await page.getByRole('button', { name: 'WhatsApp this brief' }).click()
  // business.ts holds the confirmed number, so the dialog previews the message and offers the link.
  await expect(page.getByRole('dialog')).toContainText('WhatsApp will open with this text ready')
  await expect(page.getByRole('link', { name: 'Continue to WhatsApp' })).toHaveAttribute(
    'href',
    /^https:\/\/wa\.me\/27832259886\?text=/,
  )
  expect(errors).toEqual([])
})

test('navigation, narrow layouts and an empty or corrupt basket recover', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('linton-demo-basket-v1', '{bad JSON'))
  await page.goto('/quote')
  // An empty quote still works: they can describe what they need without choosing products.
  await expect(page.getByLabel('What do you need?')).toBeVisible()
  await page.getByRole('link', { name: 'Browse the catalogue', exact: true }).click()
  await page.getByRole('button', { name: 'Add Corporate shirt to quote', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Remove Corporate shirt' })).toBeVisible()
  await page.getByRole('button', { name: 'Remove Corporate shirt' }).click()
  await expect(page.getByText('Nothing added yet.')).toBeVisible()
  await page.keyboard.press('Escape')
  for (const route of ['/', '/catalogue', '/quote', '/about', '/product/golf-umbrella']) {
    await page.goto(route)
    await expect(page.locator('h1')).toBeVisible()
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true)
  }
  await page.goto('/missing')
  await expect(page.getByText('That page doesn’t exist.')).toBeVisible()
  await page.goto('/product/not-a-real-product')
  await expect(page.getByRole('heading', { name: 'We can’t find that one.' })).toBeVisible()
  await page.getByRole('link', { name: 'Browse the catalogue' }).click()
  await expect(page).toHaveURL(/\/catalogue$/)
})

test('keyboard dialogs, navigation and session-only basket work when storage is blocked', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException('Storage disabled', 'SecurityError')
    }
  })
  await page.goto('/catalogue')
  await expect(
    page.getByText(
      'Your basket works for this visit, but this browser cannot save it after a refresh.',
    ),
  ).toBeVisible()
  // Keyboard: open a product, enlarge a photo, close it and get focus back.
  await page.getByRole('link', { name: 'Corporate shirt', exact: true }).focus()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/\/product\/corporate-shirt$/)
  const enlarge = page.getByRole('button', { name: /^Enlarge photo 1 of/ })
  await enlarge.focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(enlarge).toBeFocused()
  await page.goBack()
  await page.getByRole('button', { name: 'Add Corporate shirt to quote', exact: true }).click()
  await page.keyboard.press('Escape')
  const basket = page.getByRole('button', { name: 'Open quote basket, 1 products' })
  await basket.focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('dialog')).toContainText('Your quote')
  await page.keyboard.press('Escape')
  await expect(basket).toBeFocused()
  const menu = page.getByRole('button', { name: 'Open menu', exact: true })
  if (await menu.isVisible()) {
    await menu.click()
    await page
      .getByRole('navigation', { name: 'Mobile navigation' })
      .getByRole('link', { name: 'Home', exact: true })
      .click()
    await expect(page.getByRole('button', { name: 'Open menu', exact: true })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  } else {
    await page
      .getByRole('navigation', { name: 'Main navigation' })
      .getByRole('link', { name: 'Home', exact: true })
      .click()
  }
  await expect(page).toHaveURL('http://127.0.0.1:5173/')
  await expect(page.getByRole('button', { name: 'Open quote basket, 1 products' })).toBeVisible()
})

test('product page: direct load, meta, quantity, related products and back to the same catalogue view', async ({
  page,
}) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/product/insulated-bottle')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Insulated bottle')
  await expect(page).toHaveTitle('Insulated bottle — Linton Merch demo')
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'http://127.0.0.1:5173/product/insulated-bottle',
  )
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/)
  // One visible quantity + add control: inline on desktop, a sticky bar on phones.
  const quantity = page.getByRole('spinbutton', { name: 'Insulated bottle quantity' })
  await quantity.fill('40')
  await quantity.blur()
  await page.getByRole('button', { name: 'Add to quote', exact: true }).click()
  await expect(page.getByRole('dialog')).toContainText('Your quote')
  await page.keyboard.press('Escape')
  await expect(page.getByRole('button', { name: 'Open quote basket, 1 products' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'In your quote', exact: true })).toBeVisible()
  const stored = await page.evaluate(() => localStorage.getItem('linton-demo-basket-v1'))
  expect(stored).toContain('"quantity":40')

  // "More like this" opens another product page, which starts from its own defaults.
  const related = page.getByRole('list', { name: 'More like this' }).getByRole('link').first()
  const relatedName = (await related.textContent())!.trim()
  await related.click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(relatedName)
  await expect(page).toHaveURL(/\/product\/[a-z0-9-]+$/)

  // Back from a product restores the catalogue's filters and scroll position.
  await page.goto('/catalogue?category=Gift+sets')
  const card = page.getByRole('link', { name: 'Winter set with tumbler', exact: true })
  await card.scrollIntoViewIfNeeded()
  const before = await page.evaluate(() => window.scrollY)
  expect(before).toBeGreaterThan(300)
  await card.click()
  await expect(page).toHaveURL(/\/product\/winter-set-with-tumbler$/)
  await page.getByRole('button', { name: 'Back', exact: true }).click()
  await expect(page).toHaveURL(/\/catalogue\?category=Gift\+sets$/)
  await expect(page.getByRole('button', { name: 'Gift sets', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(before - 80)
  expect(errors).toEqual([])
})

test('home: the logo builder loads only when opened, and closes back to its trigger', async ({
  page,
}) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  const builderRequests: string[] = []
  page.on('request', (request) => {
    if (/MockupStage|BrandPreview|logo-upload/.test(request.url()))
      builderRequests.push(request.url())
  })
  await page.goto('/')
  await expect(page.locator('h1')).toBeVisible()
  // No top demo banner; the notice stays in the footer.
  await expect(page.getByText('Range to be confirmed')).toHaveCount(0)
  await expect(page.getByText('Concept demo, not the live website')).toBeVisible()
  const trigger = page.getByRole('button', { name: 'Try it with your logo' })
  await trigger.scrollIntoViewIfNeeded()
  expect(builderRequests).toEqual([])
  await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  await trigger.click()
  const dialog = page.getByRole('dialog', { name: 'Put your logo on it' })
  await expect(dialog.getByRole('button', { name: 'Golf shirt' })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(dialog).toHaveCount(0)
  await expect(trigger).toBeFocused()
  await expect(trigger).toHaveAttribute('aria-expanded', 'false')

  await trigger.click()
  await dialog.getByLabel('Or type your company name').fill('Acme Mining')
  await dialog.getByRole('button', { name: 'Add to my quote' }).click()
  const stored = await page.evaluate(() => localStorage.getItem('linton-demo-basket-v1'))
  expect(stored).toContain('Acme Mining')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  )
  expect(errors).toEqual([])
})
