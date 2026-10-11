import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/ProductCard'
import { ContactButton } from '@/components/ContactButton'
import { BrandPreview } from '@/components/BrandPreview'
import { occasions, products } from '@/data/products'
import { business } from '@/data/business'
import { ScrubWords } from '@/components/ScrubWords'
import { gsap, MOTION_OK, prefersReducedMotion, useGSAP } from '@/lib/motion'

const steps = [
  {
    n: '01',
    title: 'Choose',
    text: 'Browse the catalogue and add everything you are interested in, from ten golf shirts to five hundred gift sets.',
  },
  {
    n: '02',
    title: 'Describe',
    text: 'Set quantities, colours and sizes, and tell us how you would like it branded. Not sure? Ask us to advise.',
  },
  {
    n: '03',
    title: 'Review',
    text: 'Check one clear request before you send it. In this demo, nothing is sent.',
  },
]

// The methods Linton names on lintonent.co.za and its Facebook flyers. Branding is done in-house.
const methods = [
  {
    name: 'Embroidery',
    best: 'Golf shirts, corporate shirts, jackets, caps',
    note: 'Stitched straight into the fabric. Hard-wearing and the classic corporate finish.',
  },
  {
    name: 'Screen printing',
    best: 'T-shirts, workwear backs, bags, umbrellas',
    note: 'Bold, flat colour for larger areas and bigger runs.',
  },
  {
    name: 'Pad printing',
    best: 'Pens, mugs, flash drives, small gifts',
    note: 'Precise small logos on curved or uneven surfaces.',
  },
  {
    name: 'Engraving',
    best: 'Steel bottles, knives, card holders, bamboo',
    note: 'Cut into the surface itself, so it never peels or fades.',
  },
  {
    name: 'Embossing',
    best: 'Journals, folders, leather-look goods',
    note: 'Pressed into the material for a quiet, premium mark.',
  },
  {
    name: 'Sublimation & digital',
    best: 'Mugs, event tees, banners, full-colour art',
    note: 'Photographic, full-colour artwork with no colour limits.',
  },
]

const heroPhotos = {
  main: {
    src: '/products/alt-1101-r-lifestyle03.webp',
    alt: 'A worker in a red polycotton conti suit and gumboots leaning against a corrugated-iron wall',
    caption: 'Conti suits and workwear',
    to: '/catalogue?category=Uniforms+%26+workwear',
  },
  side: [
    {
      src: '/products/alt-bbm-dg1-mofr-027-no-logo.webp',
      alt: 'A man wearing a bottle-green pique golf shirt and chinos',
      caption: 'The golf shirt, since 1999',
      to: '/catalogue?occasion=golf-day',
    },
    {
      src: '/gifts/an-gft-001-01-hero.webp',
      alt: 'A black bottle, notebook and pen in front of a kraft gift box, each marked “Your brand”',
      caption: 'Year-end gift sets',
      to: '/catalogue?category=Gift+sets',
    },
  ],
}

function HeroPhoto({
  photo,
  className = '',
  eager = false,
}: {
  photo: { src: string; alt: string; caption: string; to: string }
  className?: string
  eager?: boolean
}) {
  return (
    <Link to={photo.to} className={`hero-photo group block ${className}`}>
      <span className="hero-frame block h-[calc(100%-2rem)] overflow-hidden rounded-md bg-ink-soft">
        <span className="hero-shift block h-full w-full">
          <img
            src={photo.src}
            alt={photo.alt}
            loading={eager ? 'eager' : 'lazy'}
            fetchPriority={eager ? 'high' : undefined}
            className="hero-img h-full w-full object-cover transition-[scale] duration-700 ease-out group-hover:scale-[1.03]"
          />
        </span>
      </span>
      <span className="hero-caption mt-2.5 flex items-center justify-between gap-2 text-xs text-white/65 group-hover:text-white">
        {photo.caption}
        <ArrowUpRight size={14} aria-hidden="true" />
      </span>
    </Link>
  )
}

function useHeroMotion() {
  const hero = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      // Parallax: photos sit at 1.2x inside their frames so a drift of up to 9% of their height
      // never exposes the frame behind them.
      mm.add(
        {
          desktop: `(min-width: 1024px) and ${MOTION_OK}`,
          mobile: `(max-width: 1023px) and ${MOTION_OK}`,
        },
        (ctx) => {
          const range = ctx.conditions?.desktop ? 9 : 5
          // Parallax lives on a wrapper, the intro zoom on the image, so each reverts cleanly.
          gsap.utils.toArray<HTMLElement>('.hero-shift').forEach((shift, i) => {
            const drift = range * (i === 0 ? 1 : 0.6)
            gsap.set(shift, { scale: 1.2 })
            gsap.fromTo(
              shift,
              { yPercent: -drift },
              {
                yPercent: drift,
                ease: 'none',
                scrollTrigger: {
                  trigger: shift.closest('.hero-photo'),
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: true,
                },
              },
            )
          })
        },
      )
      // Intro, once per load: the headline rises line by line, then the photos unroll like
      // cloth coming off a bolt, top to bottom.
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({ defaults: { ease: 'expo.out' } })
          .from('.hero-line > span', { yPercent: 110, duration: 1.1, stagger: 0.12 })
          .from(
            '.hero-frame',
            { clipPath: 'inset(0 0 100% 0)', duration: 1.3, stagger: 0.14, ease: 'power4.inOut' },
            0.25,
          )
          .from('.hero-img', { scale: 1.2, duration: 1.8, stagger: 0.14 }, 0.25)
          .from('.hero-fade', { opacity: 0, y: 14, duration: 0.9, stagger: 0.08 }, 0.6)
      })
    },
    { scope: hero },
  )
  return hero
}

function GiftRail({ items }: { items: typeof products }) {
  const rail = useRef<HTMLDivElement>(null)
  const move = (dir: 1 | -1) => {
    const el = rail.current
    if (!el) return
    const card = el.querySelector<HTMLElement>('[role="listitem"]')
    el.scrollBy({
      left: dir * ((card?.offsetWidth ?? 300) + 20) * 2,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    })
  }
  return (
    <>
      <div className="container-wide -mt-4 mb-6 hidden justify-end gap-2 sm:flex">
        {([-1, 1] as const).map((dir) => (
          <button
            key={dir}
            type="button"
            onClick={() => move(dir)}
            aria-label={dir === 1 ? 'Show more gift sets' : 'Show previous gift sets'}
            className="flex h-11 w-11 items-center justify-center rounded-sm border border-ink/20 bg-white transition-colors hover:border-ink hover:bg-ink hover:text-white"
          >
            {dir === 1 ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
          </button>
        ))}
      </div>
      <div ref={rail} className="rail" role="list" aria-label="Gift sets">
        {items.map((product) => (
          <div role="listitem" key={product.id}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </>
  )
}

export function Home() {
  const featured = products.filter((product) => product.featured)
  const giftSets = products.filter((product) => product.category === 'Gift sets')
  const [lead, ...quotes] = business.testimonials
  const hero = useHeroMotion()
  return (
    <>
      <section ref={hero} className="on-ink overflow-hidden bg-ink text-white">
        <div className="container-wide pb-12 pt-10 lg:pb-16 lg:pt-14">
          <p className="hero-fade eyebrow mb-6 flex items-center gap-3 text-white/60">
            <span className="stitch w-8 text-signal" />
            {business.town}, South Africa · Since {business.founded}
          </p>
          <h1 className="display max-w-5xl">
            <span className="hero-line block overflow-hidden pb-[0.06em]">
              <span className="block">Corporate clothing,</span>
            </span>
            <span className="hero-line block overflow-hidden pb-[0.06em]">
              <span className="block">gifts &amp; uniforms.</span>
            </span>
          </h1>
          <div className="mt-10 grid gap-8 lg:mt-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)_minmax(0,0.75fr)] lg:gap-6">
            <div className="hero-fade order-2 flex flex-col justify-between gap-10 lg:order-1 lg:pr-6">
              <div>
                <p className="max-w-80 text-base leading-7 text-white/75">
                  <span className="text-white">{business.slogan}</span> Golf shirts to gift boxes,
                  sourced from South African suppliers and branded in-house. Pick what you need and
                  send one clear request.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Button
                    asChild
                    size="lg"
                    className="h-12 bg-signal px-6 text-ink hover:bg-signal/90"
                  >
                    <Link to="/catalogue">Browse the catalogue</Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="h-12 border-white/30 bg-transparent px-6 text-white hover:bg-white/10 hover:text-white"
                  >
                    <Link to="/quote">Request a quote</Link>
                  </Button>
                </div>
              </div>
              <ol className="hidden lg:block" aria-label="What we supply">
                {business.groups.map((group, i) => (
                  <li key={group.title} className="border-t border-white/15 text-sm">
                    <Link
                      to={`/catalogue?category=${encodeURIComponent(group.category)}`}
                      className="flex items-baseline gap-4 py-2.5 text-white/80 hover:text-white"
                    >
                      <span className="text-xs text-white/40">0{i + 1}</span>
                      {group.title}
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
            <HeroPhoto
              photo={heroPhotos.main}
              eager
              className="order-1 aspect-[4/4.6] lg:order-2 lg:aspect-auto lg:h-[600px]"
            />
            <div className="order-3 grid grid-cols-2 gap-4 lg:grid-cols-1 lg:grid-rows-2 lg:gap-6">
              {heroPhotos.side.map((photo) => (
                <HeroPhoto key={photo.src} photo={photo} className="aspect-[4/5] lg:aspect-auto" />
              ))}
            </div>
          </div>
          <ul
            className="hero-fade mt-12 grid grid-cols-2 border-t border-white/15 pt-6 text-sm text-white/80 sm:flex sm:flex-wrap sm:justify-between sm:gap-6 lg:mt-14"
            aria-label="What Linton promises"
          >
            {business.promises.map((promise) => (
              <li key={promise} className="flex items-center gap-2.5 py-1.5">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-signal" aria-hidden="true" />
                {promise}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-wide py-20 text-center lg:py-28">
        <p className="eyebrow mb-6 text-muted-foreground">How we work</p>
        <ScrubWords
          as="h2"
          className="mx-auto max-w-4xl text-[clamp(2.4rem,6vw,5.2rem)] font-bold uppercase leading-[0.98] tracking-[-0.045em]"
        >
          Service is our actual business.
        </ScrubWords>
        <p className="mx-auto mt-8 max-w-xl text-base leading-7 text-muted-foreground">
          {business.manifesto}
        </p>
        <dl className="mx-auto mt-12 grid max-w-3xl grid-cols-3 border-y text-left">
          {business.milestones.map((m) => (
            <div key={m.year} className="border-l px-4 py-5 first:border-l-0 sm:px-6">
              <dt className="text-3xl font-bold tracking-tight [font-family:var(--font-display)] sm:text-4xl">
                {m.year}
              </dt>
              <dd className="mt-1 text-xs leading-5 text-muted-foreground">
                {m.year === '1999'
                  ? 'Started with golf shirts'
                  : m.year === '2001'
                    ? 'Registered as a CC'
                    : 'Became a (Pty) Ltd'}
              </dd>
            </div>
          ))}
        </dl>
        <Link
          to="/about"
          className="mt-10 inline-flex items-center gap-2 border-b border-foreground pb-1 text-sm font-medium"
        >
          Meet Linda &amp; Tony <ArrowRight size={15} />
        </Link>
      </section>

      <section className="container-wide pb-20 lg:pb-28">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <h2 className="section-title">What we supply</h2>
          <Link to="/catalogue" className="border-b border-foreground pb-1 text-sm font-medium">
            View the full catalogue
          </Link>
        </div>
        <div className="supply-list border-b">
          {business.groups.map((group, i) => (
            <Link
              key={group.title}
              to={`/catalogue?category=${encodeURIComponent(group.category)}`}
              className="supply-row group relative grid grid-cols-[56px_1fr_20px] items-center gap-x-4 gap-y-1 border-t px-1 py-5 transition-colors hover:bg-secondary sm:grid-cols-[3rem_1fr_1fr_2rem] sm:gap-x-8 sm:py-7"
            >
              <span className="eyebrow hidden text-muted-foreground sm:block">0{i + 1}</span>
              <span className="h-14 w-14 overflow-hidden rounded-sm bg-white sm:hidden">
                <img
                  src={group.image}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </span>
              <span>
                <h3 className="text-xl font-bold tracking-tight sm:text-3xl">{group.title}</h3>
                <span className="mt-1 block text-xs leading-5 text-muted-foreground sm:hidden">
                  {group.items}
                </span>
              </span>
              <p className="hidden text-sm leading-6 text-muted-foreground sm:block">
                {group.items}
              </p>
              <ArrowRight size={20} className="justify-self-end" aria-hidden="true" />
              <img
                src={group.image}
                alt=""
                loading="lazy"
                className="supply-peek pointer-events-none absolute right-24 top-1/2 z-10 hidden h-44 w-36 -translate-y-1/2 rotate-2 rounded-md object-cover shadow-xl lg:block"
              />
            </Link>
          ))}
        </div>
      </section>

      <section className="container-wide pb-20 lg:pb-28" aria-labelledby="brands-title">
        <p id="brands-title" className="eyebrow mb-6 text-muted-foreground">
          Ranges we supply
        </p>
        <p className="max-w-5xl text-[clamp(1.6rem,3.4vw,2.9rem)] font-bold leading-[1.15] tracking-[-0.03em] [font-family:var(--font-display)]">
          {business.brands.map((brand, i) => (
            <span key={brand}>
              {brand}
              <span className="text-muted-foreground/50">
                {i < business.brands.length - 1 ? ', ' : ''}
              </span>
            </span>
          ))}
          <span className="text-muted-foreground"> and more, from trusted local suppliers.</span>
        </p>
      </section>

      <BrandPreview />

      <section className="container-wide py-20 lg:py-28">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div>
            <span className="stitch mb-6 w-16 text-foreground/35" />
            <p className="eyebrow mb-4 text-muted-foreground">Shop by occasion</p>
            <h2 className="section-title max-w-xl">What is the order for?</h2>
          </div>
          <p className="max-w-72 text-sm leading-6 text-muted-foreground">
            Start from the moment, not the product list. Each opens a shortlist in the catalogue.
          </p>
        </div>
        <div className="grid border-l border-t sm:grid-cols-2 lg:grid-cols-4">
          {occasions.map((occasion) => {
            const count = products.filter((p) => p.occasions.includes(occasion.id)).length
            return (
              <Link
                key={occasion.id}
                to={`/catalogue?occasion=${occasion.id}`}
                className="group flex min-h-32 flex-col justify-between border-b border-r p-5 sm:min-h-40 sm:p-6 transition-colors hover:bg-ink hover:text-white lg:min-h-52 lg:p-8"
              >
                <span className="flex items-start justify-between gap-4">
                  <span className="text-2xl font-bold tracking-tight [font-family:var(--font-display)] lg:text-3xl">
                    {occasion.label}
                  </span>
                  <ArrowUpRight
                    size={22}
                    aria-hidden="true"
                    className="shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal"
                  />
                </span>
                <span className="mt-6 flex items-end justify-between gap-4 text-sm text-muted-foreground group-hover:text-white/70">
                  {occasion.note}
                  <span className="shrink-0 text-xs">{count} items</span>
                </span>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="bg-secondary py-16 lg:py-24">
        <div className="container-wide mb-10 flex flex-wrap items-end justify-between gap-5">
          <div>
            <span className="stitch mb-6 w-16 text-foreground/35" />
            <p className="eyebrow mb-4 text-muted-foreground">Ready-made</p>
            <h2 className="section-title">Gift sets, boxed and branded.</h2>
          </div>
          <Link
            to="/catalogue?category=Gift+sets"
            className="border-b border-foreground pb-1 text-sm font-medium"
          >
            All {giftSets.length} gift sets
          </Link>
        </div>
        <GiftRail items={giftSets.slice(0, 12)} />
      </section>

      <section className="container-wide py-20 lg:py-28">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div>
            <span className="stitch mb-6 w-16 text-foreground/35" />
            <p className="eyebrow mb-4 text-muted-foreground">Popular starting points</p>
            <h2 className="section-title">A place to start.</h2>
          </div>
          <Link to="/catalogue" className="border-b border-foreground pb-1 text-sm font-medium">
            Browse all {products.length} products
          </Link>
        </div>
        <div className="product-grid gap-x-5 gap-y-10 lg:gap-7">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="on-ink bg-ink text-white">
        <div className="container-wide py-20 lg:py-28">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <span className="stitch mb-6 w-16 text-signal" />
              <p className="eyebrow mb-4 text-white/50">Ways to brand</p>
              <h2 className="section-title max-w-sm">The right mark for the material.</h2>
              <p className="mt-5 max-w-sm text-sm leading-6 text-white/65">
                All branding is done in-house. Each product suits a different method: tell us what
                you are after, or choose “please advise” and Linton will recommend the best finish.
              </p>
            </div>
            <dl className="grid border-t border-white/15 sm:grid-cols-2">
              {methods.map((method, i) => (
                <div
                  key={method.name}
                  className={`border-b border-white/15 py-6 sm:pr-8 ${i % 2 ? 'sm:border-l sm:pl-8' : ''}`}
                >
                  <dt className="flex items-baseline gap-3 text-xl font-bold tracking-tight [font-family:var(--font-display)]">
                    <span className="text-xs font-medium text-signal">0{i + 1}</span>
                    {method.name}
                  </dt>
                  <dd className="mt-3 text-sm leading-6 text-white/70">{method.note}</dd>
                  <dd className="mt-2 text-xs leading-5 text-white/45">Best for: {method.best}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="container-wide py-20 lg:py-28" aria-labelledby="clients-title">
        <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4">
          <p id="clients-title" className="eyebrow text-muted-foreground">
            In their words
          </p>
          <a
            href={business.social.facebook}
            target="_blank"
            rel="noreferrer"
            className="text-sm underline-offset-4 hover:underline"
          >
            <span className="font-bold">{business.facebookRating.percent}%</span> recommend us on
            Facebook ({business.facebookRating.reviews} reviews)
          </a>
        </div>
        <figure className="max-w-5xl">
          <ScrubWords
            as="blockquote"
            className="text-[clamp(1.9rem,4.4vw,3.8rem)] font-bold leading-[1.05] tracking-[-0.035em] [font-family:var(--font-display)]"
          >
            “{lead.quote}”
          </ScrubWords>
          <figcaption className="mt-6 text-sm">
            <span className="font-medium">{lead.name}</span>
            <span className="text-muted-foreground"> · {lead.role}</span>
          </figcaption>
        </figure>
        <div className="mt-14 grid gap-x-8 gap-y-10 border-t pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {quotes.map((t) => (
            <figure key={t.name}>
              <blockquote className="text-base leading-7">“{t.quote}”</blockquote>
              <figcaption className="mt-4 text-xs leading-5">
                <span className="font-medium">{t.name}</span>
                <br />
                <span className="text-muted-foreground">{t.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="border-t bg-secondary">
        <div className="container-wide py-20 lg:py-28">
          <h2 className="section-title mb-12 max-w-md">One request. Everything in it.</h2>
          <div className="grid gap-10 sm:grid-cols-3">
            {steps.map((step) => (
              <div key={step.n} className="border-t border-foreground pt-5">
                <span className="text-5xl font-bold tracking-tight [font-family:var(--font-display)]">
                  {step.n}
                </span>
                <h3 className="mb-2 mt-6 text-xl font-bold">{step.title}</h3>
                <p className="text-sm leading-6 text-muted-foreground">{step.text}</p>
              </div>
            ))}
          </div>
          <Button asChild className="mt-12 h-12 px-6">
            <Link to="/catalogue">Start your selection</Link>
          </Button>
        </div>
      </section>

      <section className="on-ink bg-ink text-white">
        <div className="container-wide grid gap-10 py-14 lg:grid-cols-[1.2fr_1fr_1fr_auto] lg:items-center">
          <h2 className="section-title max-w-sm">Prefer to talk it through?</h2>
          <div className="text-sm leading-6 text-white/80">
            <p className="eyebrow mb-3 text-white/50">Call or email</p>
            <a href={business.phoneHref} className="hover:text-white">
              {business.phoneDisplay}
            </a>
            <br />
            <a href={`mailto:${business.email}`} className="hover:text-white">
              {business.email}
            </a>
          </div>
          <div className="text-sm leading-6 text-white/80">
            <p className="eyebrow mb-3 text-white/50">Hours</p>
            {business.hours.map((h) => (
              <p key={h.days}>
                {h.days}: {h.time}
              </p>
            ))}
          </div>
          <ContactButton
            variant="outline"
            className="h-12 border-white/30 bg-transparent px-6 text-white hover:bg-white/10 hover:text-white"
          />
        </div>
      </section>
    </>
  )
}
