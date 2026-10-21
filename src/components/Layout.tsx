import { ResponsiveImage } from '@/components/ResponsiveImage'
import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigationType } from 'react-router-dom'
import { ShoppingBag, Menu, X, PackagePlus, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { BasketItems } from '@/components/BasketItems'
import { ContactButton } from '@/components/ContactButton'
import { useBasket } from '@/context/BasketContext'
import { business } from '@/data/business'
import { SmoothScroll } from '@/components/SmoothScroll'
import { scrollToTop, scrollToY } from '@/lib/motion'
import { setPageMeta } from '@/lib/meta'

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/catalogue', label: 'Catalogue' },
  { to: '/quote', label: 'Request a quote' },
  { to: '/about', label: 'About & contact' },
]

const pageTitles: Record<string, string> = {
  '/': 'Corporate clothing, gifts & uniforms',
  '/catalogue': 'Catalogue',
  '/quote': 'Request a quote',
  '/about': 'About & contact',
}

function useIsPhone() {
  const query = '(max-width: 639px)'
  const [phone, setPhone] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setPhone(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return phone
}

function Logo({ className = '' }: { className?: string }) {
  return (
    <ResponsiveImage
      src="/brand/linton-logo-white.png"
      sizes="(min-width: 640px) 187px, 147px"
      loading="eager"
      alt="Linton Merch — Corporate Clothing, Gifts & Uniforms"
      width={2000}
      height={600}
      className={className}
    />
  )
}

export function Layout() {
  const { items, clear, storageUnavailable, drawerOpen, setDrawerOpen } = useBasket()
  const [menuOpen, setMenuOpen] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const location = useLocation()
  const navigationType = useNavigationType()
  const isPhone = useIsPhone()
  // Scroll positions per history entry, captured before the next page renders, so Back lands
  // where the visitor left (catalogue filters already live in the URL).
  const positions = useRef(new Map<string, number>())
  const lastKey = useRef(location.key)
  if (lastKey.current !== location.key) {
    positions.current.set(lastKey.current, window.scrollY)
    lastKey.current = location.key
  }
  const mainRef = useRef<HTMLElement>(null)
  const initialRoute = useRef(true)
  // Set once the visitor has navigated away from the landing route (render-time, stable).
  const landingPath = useRef(location.pathname)
  const navigated = useRef(false)
  if (location.pathname !== landingPath.current) navigated.current = true
  const initialCount = useRef(true)
  const leavingDrawer = useRef(false)
  useEffect(() => {
    setMenuOpen(false)
    const saved = positions.current.get(location.key)
    if (navigationType === 'POP' && saved !== undefined) {
      // Wait a frame so the restored page has its full height before scrolling into it.
      requestAnimationFrame(() => scrollToY(saved))
    } else scrollToTop()
    // Product pages set their own title and description.
    if (!location.pathname.startsWith('/product/'))
      setPageMeta({ title: pageTitles[location.pathname] ?? 'Page not found' })
    if (!initialRoute.current) mainRef.current?.focus({ preventScroll: true })
    initialRoute.current = false
    // Only a new page (not a filter change on the same page) should move the scroll position.
  }, [location.pathname])
  useEffect(() => {
    if (initialCount.current) {
      initialCount.current = false
      return
    }
    setAnnouncement(`${items.length} ${items.length === 1 ? 'product' : 'products'} in your quote.`)
  }, [items.length])
  // The header tucks away while scrolling down and returns on any scroll up.
  const [headerHidden, setHeaderHidden] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      if (Math.abs(y - last) < 6) return
      setHeaderHidden(y > last && y > 240)
      last = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  const hideHeader = headerHidden && !menuOpen && !drawerOpen
  useEffect(() => {
    // Sticky elements below the header (catalogue filters) sit under it when it is showing.
    const height = headerRef.current?.offsetHeight ?? 0
    document.documentElement.style.setProperty(
      '--header-offset',
      hideHeader ? '0px' : `${height}px`,
    )
  }, [hideHeader, menuOpen])
  const onProduct = location.pathname.startsWith('/product/')
  // Phones get a basket bar at the bottom; product pages have their own add-to-quote bar there.
  const showBar = items.length > 0 && location.pathname !== '/quote' && !onProduct
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <div className="on-ink bg-ink-soft px-5 py-2 text-center text-xs tracking-wide text-white/75">
        Concept demo <span className="mx-1.5 opacity-50">/</span>
        <span className="hidden min-[360px]:inline">
          Range to be confirmed <span className="mx-1.5 opacity-50">/</span>
        </span>{' '}
        No enquiries sent
      </div>
      <SmoothScroll />
      <header
        ref={headerRef}
        data-hidden={hideHeader || undefined}
        className="site-header on-ink sticky top-0 z-40 bg-ink text-white"
      >
        <div className="container-wide flex min-h-20 flex-wrap items-center justify-between gap-3 py-4">
          <Link to="/" aria-label="Linton Merch home" className="block">
            <Logo className="h-9 w-auto min-[360px]:h-11 sm:h-12" />
          </Link>
          <nav aria-label="Main navigation" className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className="nav-link">
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="gap-2 border-white/30 bg-transparent px-3 text-white hover:bg-white/10 hover:text-white sm:px-4"
                  aria-label={`Open quote basket, ${items.length} products`}
                >
                  <ShoppingBag size={16} />
                  <span className="hidden sm:inline">Your quote</span>
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-sm bg-signal px-1 text-[11px] font-bold text-ink">
                    {items.length}
                  </span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side={isPhone ? 'bottom' : 'right'}
                className={
                  isPhone
                    ? 'flex max-h-[88dvh] flex-col rounded-t-lg pb-[calc(1.5rem+env(safe-area-inset-bottom))]'
                    : 'flex w-full flex-col sm:max-w-md'
                }
                onCloseAutoFocus={(event) => {
                  // After "Continue to your request" the new page owns focus, not the header.
                  if (leavingDrawer.current) {
                    event.preventDefault()
                    leavingDrawer.current = false
                  }
                }}
              >
                <SheetHeader>
                  <SheetTitle className="text-2xl font-bold tracking-tight">Your quote</SheetTitle>
                  <SheetDescription>
                    {items.length
                      ? `${items.length} product${items.length === 1 ? '' : 's'}`
                      : 'One request for everything you need.'}
                  </SheetDescription>
                </SheetHeader>
                {items.length ? (
                  <>
                    <div className="flex-1 overflow-y-auto">
                      <BasketItems />
                    </div>
                    <div className="border-t pt-4">
                      <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
                        25 is a starting point, not a minimum.
                      </p>
                      <Button
                        asChild
                        className="h-11 w-full"
                        onClick={() => {
                          leavingDrawer.current = true
                          setDrawerOpen(false)
                        }}
                      >
                        <Link to="/quote">Continue to your request</Link>
                      </Button>
                      <Button
                        variant="ghost"
                        className="mt-2 w-full text-muted-foreground"
                        onClick={clear}
                      >
                        Clear selection
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-1 flex-col items-center justify-center text-center">
                    <PackagePlus className="mb-5 text-muted-foreground" size={36} />
                    <h3 className="mb-2 text-xl font-bold">Nothing added yet.</h3>
                    <p className="mb-6 max-w-64 text-sm text-muted-foreground">
                      Add products from the catalogue.
                    </p>
                    <Button asChild onClick={() => setDrawerOpen(false)}>
                      <Link to="/catalogue">Browse the catalogue</Link>
                    </Button>
                  </div>
                )}
              </SheetContent>
            </Sheet>
            <Button
              className="text-white hover:bg-white/10 hover:text-white lg:hidden"
              variant="ghost"
              size="icon"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>
        {menuOpen && (
          <nav
            id="mobile-menu"
            aria-label="Mobile navigation"
            className="container-wide flex flex-col gap-1 border-t border-white/15 py-4 lg:hidden"
          >
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className="nav-link">
                {item.label}
              </NavLink>
            ))}
          </nav>
        )}
      </header>
      {storageUnavailable && (
        <p role="status" className="bg-secondary px-5 py-2 text-center text-sm">
          Your basket works for this visit, but this browser cannot save it after a refresh.
        </p>
      )}
      <main id="main-content" ref={mainRef} tabIndex={-1} className="outline-none">
        {/* Pages ease in on navigation; the first load belongs to the hero intro. */}
        <div key={location.pathname} className={navigated.current ? 'page-enter' : undefined}>
          <Outlet />
        </div>
      </main>
      <footer
        className={`on-ink bg-ink text-white ${showBar ? 'pb-16 lg:pb-0' : onProduct ? 'pb-20 lg:pb-0' : ''}`}
      >
        <div className="container-wide grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div>
            <Logo className="h-14 w-auto" />
            <p className="mt-5 max-w-64 text-sm leading-relaxed text-white/65">
              {business.tagline}. Based in {business.town}, South Africa.
            </p>
          </div>
          <div>
            <p className="eyebrow mb-4 text-white/50">Explore</p>
            <div className="flex flex-col items-start text-sm">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="inline-flex min-h-11 items-center text-white/85 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="eyebrow mb-4 text-white/50">Visit &amp; call</p>
            <address className="space-y-3 text-sm not-italic leading-6 text-white/85">
              <p>{business.addressLines.join(', ')}</p>
              <p>
                <a href={business.phoneHref} className="hover:text-white">
                  {business.phoneDisplay}
                </a>
                <br />
                <a href={`mailto:${business.email}`} className="hover:text-white">
                  {business.email}
                </a>
              </p>
            </address>
          </div>
          <div>
            <p className="eyebrow mb-4 text-white/50">Let’s talk</p>
            <ContactButton
              variant="outline"
              className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
            />
          </div>
        </div>
        <div className="container-wide flex flex-col justify-between gap-2 border-t border-white/15 py-6 text-xs text-white/50 sm:flex-row">
          <span>Linton Enterprises · Concept demo, not the live website</span>
          <span>No enquiries are sent.</span>
        </div>
      </footer>
      {showBar && (
        <div className="on-ink fixed inset-x-0 bottom-0 z-30 border-t border-white/15 bg-ink px-5 pb-[env(safe-area-inset-bottom)] text-white lg:hidden">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="flex min-h-14 w-full items-center justify-between text-sm font-medium"
          >
            <span>
              <span className="mr-2 inline-flex h-5 min-w-5 items-center justify-center rounded-sm bg-signal px-1 text-[11px] font-bold text-ink">
                {items.length}
              </span>
              {items.length === 1 ? 'product' : 'products'} in your quote
            </span>
            <span className="flex items-center gap-1">
              Review <ArrowUpRight size={16} />
            </span>
          </button>
        </div>
      )}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>
    </>
  )
}
