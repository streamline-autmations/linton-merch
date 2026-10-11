import { expect, test } from '@playwright/test'

test('catalogue, persistent multi-product basket and complete demo RFQ', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/catalogue')
  await expect(page.getByRole('status').filter({ hasText: '75 products' })).toBeVisible()
  await page.getByRole('button', { name: 'Marketing material & gifts', exact: true }).click()
  await expect(page.getByRole('status').filter({ hasText: '22 products' })).toBeVisible()
  await page.getByLabel('Search products').fill('no matching product')
  await expect(page.getByText('Nothing here just yet.')).toBeVisible()
  await page.getByRole('button', { name: 'Show all products' }).click()
  await page.getByRole('button', { name: 'View Corporate shirt details' }).click()
  await expect(page.getByRole('dialog')).toContainText('Linton confirms availability')
  await page.keyboard.press('Escape')
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
  await page.getByLabel('Preferred branding').selectOption('Embroidery')
  await page.getByLabel('Anything else we should know?').fill('Sample annual team event')
  await page.getByLabel('Logo or artwork').setInputFiles({
    name: 'sample-logo.svg',
    mimeType: 'image/svg+xml',
    buffer: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"/>'),
  })
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await expect(page.getByLabel('Your name')).toBeFocused()
  await page.getByLabel('Your name').fill('Demo Person')
  await page.getByLabel(/^Company/).fill('Example Company')
  await page.getByLabel('Email address').fill('demo@example.com')
  await page.getByLabel('Delivery city & province').fill('Johannesburg, Gauteng')
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
  const download = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Download summary' }).click()
  expect((await download).suggestedFilename()).toBe('linton-demo-quote.txt')
  const stored = await page.evaluate(() => localStorage.getItem('linton-demo-basket-v1'))
  expect(stored).not.toContain('demo@example.com')
  await page.getByRole('button', { name: 'WhatsApp this brief' }).click()
  // .env supplies the confirmed number, so the dialog previews the message and offers the link.
  await expect(page.getByRole('dialog')).toContainText('WhatsApp will open with this text ready')
  await expect(page.getByRole('link', { name: 'Continue to WhatsApp' })).toHaveAttribute(
    'href',
    /^https:\/\/wa\.me\/27825505251\?text=/,
  )
  expect(errors).toEqual([])
})

test('navigation, narrow layouts and an empty or corrupt basket recover', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('linton-demo-basket-v1', '{bad JSON'))
  await page.goto('/quote')
  await expect(page.getByText('Your selection is empty.')).toBeVisible()
  await page.getByRole('link', { name: 'Explore catalogue', exact: true }).click()
  await page.getByRole('button', { name: 'Add Corporate shirt to quote', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Remove Corporate shirt' })).toBeVisible()
  await page.getByRole('button', { name: 'Remove Corporate shirt' }).click()
  await expect(page.getByText('Nothing added yet.')).toBeVisible()
  await page.keyboard.press('Escape')
  for (const route of ['/', '/catalogue', '/quote', '/about']) {
    await page.goto(route)
    await expect(page.locator('h1')).toBeVisible()
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true)
  }
  await page.goto('/missing')
  await expect(page.getByText('That page doesn’t exist.')).toBeVisible()
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
  const details = page.getByRole('button', { name: 'View Corporate shirt details' })
  await details.focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(details).toBeFocused()
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
