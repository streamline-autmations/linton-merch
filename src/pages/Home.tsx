import { ResponsiveImage } from '@/components/ResponsiveImage'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductRail } from '@/components/ProductRail'
import { BrandWall } from '@/components/BrandWall'
import { ContactButton } from '@/components/ContactButton'
import { BrandPreview } from '@/components/BrandPreview'
import { occasions, products } from '@/data/products'
import { business } from '@/data/business'
import { ScrubWords } from '@/components/ScrubWords'
import { gsap, MOTION_OK, useGSAP } from '@/lib/motion'

const steps = [
  { n: '01', title: 'Choose', text: 'Add products to your quote.' },
  { n: '02', title: 'Describe', text: 'Quantities, sizes, branding.' },
  { n: '03', title: 'Review', text: 'One clear request. Done.' },
]

// The methods Linton names on lintonent.co.za and its Facebook flyers. Branding is done in-house.
const methods = [
  {
    name: 'Embroidery',
    best: 'Golf shirts, corporate shirts, jackets, caps',
  },
  {
    name: 'Screen printing',
    best: 'T-shirts, workwear backs, bags, umbrellas',
  },
  {
    name: 'Pad printing',
    best: 'Pens, mugs, flash drives, small gifts',
  },
  {
    name: 'Engraving',
    best: 'Steel bottles, knives, card holders, bamboo',
  },
  {
    name: 'Embossing',
    best: 'Journals, folders, leather-look goods',
  },
  {
    name: 'Sublimation & digital',
    best: 'Mugs, event tees, banners, full-colour art',
  },
]

const heroPhotos = {
  main: {
    src: '/hero/team-golf-shirts.webp',
    alt: 'Two models wearing coordinated charcoal golf shirts with cyan shoulder details',
    caption: 'A coordinated look for your team',
    to: '/catalogue?category=Corporate+clothing',
  },
  side: [
    {
      src: '/hero/uniform-detail.webp',
      alt: 'Close-up of a navy corporate shirt showing the collar, buttons and stitched chest pocket',
      caption: 'Corporate shirts',
      to: '/catalogue?category=Corporate+clothing',
    },
    {
      src: '/hero/executive-gifting.webp',
      alt: 'A black notebook, bottle with a gold lid and matching pen against a geometric backdrop',
      caption: 'Executive gifting',
      to: '/catalogue?category=Gift+sets',
      contain: true,
    },
  ],
}

function HeroPhoto({
  photo,
  className = '',
  eager = false,
}: {
  photo: { src: string; alt: string; caption: string; to: string; contain?: boolean }
  className?: string
  eager?: boolean
}) {
  return (
    <Link to={photo.to} className={`hero-photo group block ${className}`}>
      <span className="hero-frame block h-[calc(100%_-_2rem)] overflow-hidden rounded-md bg-ink-soft">
        <span className="hero-shift block h-full w-full">
          <ResponsiveImage
            src={photo.src}
            sizes={
              eager
                ? '(min-width: 1376px) 520px, (min-width: 1024px) 42vw, calc(100vw - 40px)'
                : '(min-width: 1376px) 320px, (min-width: 1024px) 25vw, 44vw'
            }
            alt={photo.alt}
            loading={eager ? 'eager' : 'lazy'}
            fetchPriority={eager ? 'high' : undefined}
            className={`hero-img h-full w-full ${photo.contain ? 'bg-ink object-contain' : 'object-cover object-top'}`}
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
      // Let the frames settle without zooming or drifting into the team photograph's faces.
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({ defaults: { ease: 'expo.out' } })
          .from('.hero-line > span', { yPercent: 104, duration: 0.65, stagger: 0.08 })
          .from('.hero-frame', { y: 14, duration: 0.7, stagger: 0.08, ease: 'power3.out' }, 0.25)
          .from('.hero-fade', { opacity: 0, y: 8, duration: 0.5, stagger: 0.04 }, 0.2)
      })
      return () => mm.revert()
    },
    { scope: hero },
  )
  return hero
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
            <div className="hero-fade order-1 flex flex-col justify-between gap-8 lg:order-1 lg:pr-6">
              <div>
                <p className="max-w-80 text-base leading-7 text-white/75">
                  <span className="text-white">{business.slogan}</span> Golf shirts to gift boxes,
                  branded in-house.
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
                      <span className="text-xs text-white/60">0{i + 1}</span>
                      {group.title}
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
            <HeroPhoto
              photo={heroPhotos.main}
              eager
              className="order-2 aspect-[4/4.5] lg:order-2 lg:aspect-auto lg:h-[560px]"
            />
            <div className="hero-secondary order-3 grid grid-cols-2 gap-4 lg:h-[560px] lg:grid-cols-1 lg:grid-rows-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-6">
              {heroPhotos.side.map((photo) => (
                <HeroPhoto
                  key={photo.src}
                  photo={photo}
                  className="aspect-[1/1.2] min-h-0 lg:aspect-auto"
                />
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

      <section className="container-wide py-16 text-center lg:py-28">
        <p className="eyebrow mb-6 text-muted-foreground">How we work</p>
        <ScrubWords
          as="h2"
          className="mx-auto max-w-4xl text-[clamp(2.4rem,6vw,5.2rem)] font-bold uppercase leading-[0.98] tracking-[-0.045em]"
        >
          Service is our actual business.
        </ScrubWords>
        <dl className="mx-auto mt-10 grid max-w-3xl grid-cols-3 border-y text-left">
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
          className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-medium underline underline-offset-4"
        >
          Meet Linda &amp; Tony <ArrowRight size={15} />
        </Link>
      </section>

      <section className="container-wide pb-16 lg:pb-28">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-5 lg:mb-8">
          <h2 className="section-title">What we supply</h2>
          <Link
            to="/catalogue"
            className="inline-flex min-h-11 items-center text-sm font-medium underline underline-offset-4"
          >
            Full catalogue
          </Link>
        </div>
        <div className="supply-list border-b">
          {business.groups.map((group, i) => (
            <Link
              key={group.title}
              to={`/catalogue?category=${encodeURIComponent(group.category)}`}
              className="supply-row group relative grid grid-cols-[56px_1fr_20px] items-center gap-x-4 gap-y-1 border-t px-1 py-3 transition-colors hover:bg-secondary sm:grid-cols-[3rem_1fr_1fr_2rem] sm:gap-x-8 sm:py-7"
            >
              <span className="eyebrow hidden text-muted-foreground sm:block">0{i + 1}</span>
              <span className="h-14 w-14 overflow-hidden rounded-sm bg-white sm:hidden">
                <ResponsiveImage
                  src={group.image}
                  sizes="56px"
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </span>
              <span>
                <h3 className="text-xl font-bold tracking-tight sm:text-3xl">{group.title}</h3>
              </span>
              <p className="hidden text-sm leading-6 text-muted-foreground sm:block">
                {group.items}
              </p>
              <ArrowRight size={20} className="justify-self-end" aria-hidden="true" />
              <ResponsiveImage
                src={group.image}
                sizes="144px"
                alt=""
                loading="lazy"
                className="supply-peek pointer-events-none absolute right-24 top-1/2 z-10 hidden h-44 w-36 -translate-y-1/2 rotate-2 rounded-md object-cover shadow-xl lg:block"
              />
            </Link>
          ))}
        </div>
      </section>

      <BrandWall />

      <BrandPreview />

      <section className="container-wide py-16 lg:py-28">
        <div className="mb-6 lg:mb-10">
          <span className="stitch mb-6 w-16 text-foreground/35" />
          <p className="eyebrow mb-4 text-muted-foreground">Shop by occasion</p>
          <h2 className="section-title max-w-xl">What is the order for?</h2>
        </div>
        <div className="grid grid-cols-2 border-l border-t lg:grid-cols-4">
          {occasions.map((occasion) => {
            const count = products.filter((p) => p.occasions.includes(occasion.id)).length
            return (
              <Link
                key={occasion.id}
                to={`/catalogue?occasion=${occasion.id}`}
                className="group flex min-h-24 flex-col justify-between border-b border-r p-4 transition-colors hover:bg-ink hover:text-white sm:min-h-36 sm:p-6 lg:min-h-52 lg:p-8"
              >
                <span className="flex items-start justify-between gap-2 sm:gap-4">
                  <span className="text-lg font-bold leading-tight tracking-tight [font-family:var(--font-display)] sm:text-2xl lg:text-3xl">
                    {occasion.label}
                  </span>
                  <ArrowUpRight
                    size={20}
                    aria-hidden="true"
                    className="shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal"
                  />
                </span>
                <span className="mt-3 flex items-end justify-between gap-4 text-sm text-muted-foreground group-hover:text-white/70 sm:mt-6">
                  <span className="hidden sm:inline">{occasion.note}</span>
                  <span className="shrink-0 text-xs">{count} items</span>
                </span>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="bg-secondary py-14 lg:py-24">
        <ProductRail
          label="Gift sets"
          items={giftSets.slice(0, 12)}
          heading={
            <>
              <span className="stitch mb-6 w-16 text-foreground/35" />
              <h2 className="section-title">Gift sets, boxed and branded.</h2>
            </>
          }
          action={
            <Link
              to="/catalogue?category=Gift+sets"
              className="inline-flex min-h-11 items-center text-sm font-medium underline underline-offset-4"
            >
              All {giftSets.length} gift sets
            </Link>
          }
        />
      </section>

      <section className="py-14 lg:py-28">
        <ProductRail
          label="Popular picks"
          items={featured}
          grid
          heading={
            <>
              <span className="stitch mb-6 w-16 text-foreground/35" />
              <h2 className="section-title">Popular picks.</h2>
            </>
          }
          action={
            <Link
              to="/catalogue"
              className="inline-flex min-h-11 items-center text-sm font-medium underline underline-offset-4"
            >
              All {products.length} products
            </Link>
          }
        />
      </section>

      <section className="on-ink bg-ink text-white">
        <div className="container-wide py-16 lg:py-28">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <span className="stitch mb-6 w-16 text-signal" />
              <p className="eyebrow mb-4 text-white/50">Ways to brand</p>
              <h2 className="section-title max-w-sm">The right mark for the material.</h2>
              <p className="mt-4 max-w-sm text-sm leading-6 text-white/65">
                All done in-house. Not sure? We’ll advise.
              </p>
            </div>
            <dl className="grid grid-cols-2 border-t border-white/15">
              {methods.map((method, i) => (
                <div
                  key={method.name}
                  className={`border-b border-white/15 py-4 pr-3 sm:py-6 sm:pr-8 ${i % 2 ? 'border-l pl-4 sm:pl-8' : ''}`}
                >
                  <dt className="flex flex-col gap-1 text-base font-bold leading-tight tracking-tight [font-family:var(--font-display)] sm:flex-row sm:items-baseline sm:gap-3 sm:text-xl">
                    <span className="text-xs font-medium text-signal">0{i + 1}</span>
                    {method.name}
                  </dt>
                  <dd className="mt-2 text-xs leading-5 text-white/60">{method.best}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-28" aria-labelledby="clients-title">
        <div className="container-wide">
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
              Facebook
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
        </div>
        <div
          className="rail rail-narrow rail-grid mt-10 border-t pt-8 lg:mt-14 lg:pt-10"
          tabIndex={0}
          role="region"
          aria-label="More client reviews"
        >
          {quotes.map((t) => (
            <figure key={t.name} className="border-l pl-4 lg:border-l-0 lg:pl-0">
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
        <div className="container-wide py-16 lg:py-28">
          <h2 className="section-title mb-8 max-w-md lg:mb-12">One request. Everything in it.</h2>
          <ol className="grid sm:grid-cols-3 sm:gap-10">
            {steps.map((step) => (
              <li
                key={step.n}
                className="grid grid-cols-[3.5rem_1fr] items-baseline border-t border-foreground py-4 sm:block sm:pt-5"
              >
                <span className="text-3xl font-bold tracking-tight [font-family:var(--font-display)] sm:text-5xl">
                  {step.n}
                </span>
                <span>
                  <h3 className="text-lg font-bold sm:mb-2 sm:mt-6 sm:text-xl">{step.title}</h3>
                  <p className="text-sm leading-6 text-muted-foreground">{step.text}</p>
                </span>
              </li>
            ))}
          </ol>
          <Button asChild className="mt-8 h-12 px-6 lg:mt-12">
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
