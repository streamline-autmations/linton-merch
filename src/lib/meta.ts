// Per-page <head> basics for a client-rendered demo. The site stays noindex (index.html and the
// host headers); these only make shared links and browser history read well.
function tag(selector: string, create: () => HTMLElement) {
  let el = document.head.querySelector<HTMLElement>(selector)
  if (!el) {
    el = create()
    document.head.appendChild(el)
  }
  return el
}
function meta(attr: 'name' | 'property', key: string, content: string) {
  tag(`meta[${attr}="${key}"]`, () => {
    const m = document.createElement('meta')
    m.setAttribute(attr, key)
    return m
  }).setAttribute('content', content)
}

export const SITE_NAME = 'Linton Merch demo'
const defaultDescription =
  typeof document !== 'undefined'
    ? (document.head.querySelector('meta[name="description"]')?.getAttribute('content') ?? '')
    : ''

export function setPageMeta({
  title,
  description = defaultDescription,
  image = '/og-linton-logo.jpg',
}: {
  title: string
  description?: string
  image?: string
}) {
  const fullTitle = `${title} — ${SITE_NAME}`
  const url = window.location.origin + window.location.pathname
  document.title = fullTitle
  meta('name', 'description', description)
  meta('property', 'og:type', 'website')
  meta('property', 'og:site_name', 'Linton Merch')
  meta('name', 'twitter:card', 'summary_large_image')
  meta('name', 'twitter:title', fullTitle)
  meta('name', 'twitter:description', description)
  meta('name', 'twitter:image', new URL(image, window.location.origin).href)
  meta('property', 'og:title', fullTitle)
  meta('property', 'og:description', description)
  meta('property', 'og:image', new URL(image, window.location.origin).href)
  meta('property', 'og:url', url)
  meta('property', 'og:image:alt', 'Linton Enterprises logo')
  tag('link[rel="canonical"]', () => {
    const l = document.createElement('link')
    l.setAttribute('rel', 'canonical')
    return l
  }).setAttribute('href', url)
}
