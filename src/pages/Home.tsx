import { ResponsiveImage } from '@/components/ResponsiveImage'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductRail } from '@/components/ProductRail'
import { BrandWall } from '@/components/BrandWall'
import { BrandingMethods } from '@/components/BrandingMethods'
import { TrustBand } from '@/components/TrustBand'
import { ContactButton } from '@/components/ContactButton'
import { BrandTeaser } from '@/components/BrandTeaser'
import { occasions, products } from '@/data/products'
import { business } from '@/data/business'
import { gsap, MOTION_OK, useGSAP } from '@/lib/motion'

const steps = [
  { n: '01', title: 'Choose', text: 'Add products to your quote.' },
  { n: '02', title: 'Describe', text: 'Quantities, sizes, branding.' },
  { n: '03', title: 'Review', text: 'One clear request. Done.' },
]

const heroPhoto = {
  src: '/hero/team-golf-shirts.webp',
  alt: 'Two people in matching charcoal golf shirts with cyan shoulder panels',
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
  const hero = useHeroMotion()
  return (
    <>
      {/* Hero: what we do, how we help, one action. The promises sit on a woven label sewn
          onto the photo's edge. */}
      <section ref={hero} className="on-ink overflow-hidden bg-ink text-white">
        <div className="container-wide grid items-center gap-x-16 gap-y-8 pb-12 pt-7 sm:pt-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:pb-20 lg:pt-12">
          <div>
            <p className="hero-fade mb-5 flex items-center gap-3 text-sm text-white/70">
              <span className="stitch w-8 text-brand-teal" />
              {business.town}, since {business.founded}
            </p>
            <h1 className="hero-title">
              <span className="hero-line block overflow-hidden pb-[0.06em]">
                <span className="block">Corporate</span>
              </span>
              <span className="hero-line block overflow-hidden pb-[0.06em]">
                <span className="block">clothing, gifts</span>
              </span>
              <span className="hero-line block overflow-hidden pb-[0.06em]">
                <span className="block">&amp; uniforms.</span>
              </span>
            </h1>
            <p className="hero-fade mt-5 max-w-md text-balance text-base leading-7 text-white/80 sm:text-lg sm:leading-8 lg:mt-7">
              Tell us what your team needs. We source it, brand it and deliver it.
            </p>
            <div className="hero-fade mt-7 flex flex-wrap items-center gap-x-7 gap-y-2 lg:mt-9">
              <Button asChild size="lg" className="h-12 bg-white px-6 text-ink hover:bg-cloud">
                <Link to="/quote">Request a quote</Link>
              </Button>
              <Link
                to="/catalogue"
                className="inline-flex min-h-11 items-center text-sm font-medium text-white underline decoration-white/40 underline-offset-[6px] transition-colors hover:decoration-white"
              >
                Browse the catalogue
              </Link>
            </div>
          </div>
          <figure className="relative mb-6 lg:mb-0">
            <div className="hero-frame aspect-[5/4] overflow-hidden rounded-md bg-white/10 sm:aspect-[16/9] lg:aspect-[1/1.08]">
              <ResponsiveImage
                src={heroPhoto.src}
                sizes="(min-width: 1376px) 540px, (min-width: 1024px) 40vw, calc(100vw - 40px)"
                alt={heroPhoto.alt}
                loading="eager"
                fetchPriority="high"
                className="h-full w-full object-cover object-[50%_18%]"
              />
            </div>
            <div className="hero-label-wrap hero-fade">
              <ul className="hero-label" aria-label="What Linton promises">
                {business.promises.map((promise) => (
                  <li key={promise}>{promise}</li>
                ))}
              </ul>
            </div>
          </figure>
        </div>
      </section>

      <section className="container-wide py-14 lg:py-24">
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

      <BrandTeaser />

      {/* Shop by occasion: one real photo per occasion, the label on a dark fade for contrast. */}
      <section className="container-wide py-14 lg:py-24" aria-labelledby="occasions-title">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-3 lg:mb-10">
          <div>
            <span className="stitch mb-5 w-16 text-foreground/35" />
            <p className="eyebrow mb-3 text-muted-foreground">Shop by occasion</p>
            <h2 id="occasions-title" className="section-title max-w-xl">
              What is the order for?
            </h2>
          </div>
        </div>
        <ul className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4 lg:gap-4">
          {occasions.map((occasion) => {
            const count = products.filter((p) => p.occasions.includes(occasion.id)).length
            return (
              <li key={occasion.id}>
                <Link
                  to={`/catalogue?occasion=${occasion.id}`}
                  className="occasion-tile group relative block aspect-square overflow-hidden rounded-md bg-ink text-white sm:aspect-[4/3] lg:aspect-[5/4]"
                >
                  <ResponsiveImage
                    src={occasion.image}
                    sizes="(min-width: 1376px) 308px, (min-width: 1024px) 23vw, 46vw"
                    alt=""
                    loading="lazy"
                    style={{ objectPosition: occasion.focus }}
                    className="occasion-photo absolute inset-0 h-full w-full object-cover"
                  />
                  <span className="occasion-fade absolute inset-0" aria-hidden="true" />
                  <span className="absolute inset-x-3 bottom-3 sm:inset-x-4 sm:bottom-4 lg:inset-x-5 lg:bottom-5">
                    <span className="flex items-end justify-between gap-2">
                      <span className="text-[1.0625rem] font-bold leading-tight tracking-tight [font-family:var(--font-display)] sm:text-xl lg:text-2xl">
                        {occasion.label}
                      </span>
                      <ArrowUpRight
                        size={18}
                        aria-hidden="true"
                        className="mb-0.5 shrink-0 text-white transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </span>
                    <span className="mt-1 block text-xs text-white/85">{count} items</span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      {/* Gift sets on ink: the boxed sets read as premium, cards stay white. */}
      <section className="on-ink bg-ink py-14 text-white lg:py-24">
        <ProductRail
          label="Gift sets"
          tone="dark"
          items={giftSets.slice(0, 12)}
          heading={
            <>
              <span className="stitch mb-6 w-16 text-brand-teal" />
              <h2 className="section-title">Gift sets, boxed and branded.</h2>
            </>
          }
          action={
            <Link
              to="/catalogue?category=Gift+sets"
              className="inline-flex min-h-11 items-center text-sm font-medium underline decoration-white/40 underline-offset-4 hover:decoration-white"
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

      <BrandingMethods />

      <TrustBand />

      {/* Closing band: how a request works, or talk to a person. */}
      <section className="on-ink bg-ink text-white" aria-labelledby="request-title">
        <div className="container-wide grid gap-12 py-14 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-20 lg:py-24">
          <div>
            <span className="stitch mb-6 w-16 text-brand-teal" />
            <h2 id="request-title" className="section-title mb-8 max-w-md lg:mb-12">
              One request. Everything in it.
            </h2>
            <ol className="grid sm:grid-cols-3 sm:gap-8">
              {steps.map((step) => (
                <li
                  key={step.n}
                  className="request-step grid grid-cols-[3.25rem_1fr] items-baseline border-t py-4 sm:block sm:pt-5"
                >
                  <span className="text-2xl font-bold tracking-tight text-white/60 [font-family:var(--font-display)] sm:text-4xl">
                    {step.n}
                  </span>
                  <span>
                    <h3 className="text-lg font-bold sm:mb-1 sm:mt-5">{step.title}</h3>
                    <p className="text-sm leading-6 text-white/75">{step.text}</p>
                  </span>
                </li>
              ))}
            </ol>
            <Button
              asChild
              size="lg"
              className="mt-8 h-12 bg-white px-6 text-ink hover:bg-cloud lg:mt-10"
            >
              <Link to="/catalogue">Start your selection</Link>
            </Button>
          </div>
          <div className="request-talk border-t pt-10 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
            <h3 className="text-2xl font-bold tracking-tight [font-family:var(--font-display)] lg:text-3xl">
              Prefer to talk it through?
            </h3>
            <dl className="mt-6 grid gap-5 text-sm leading-6 text-white/85 sm:grid-cols-2 lg:grid-cols-1">
              <div>
                <dt className="mb-1 text-white/60">Call or email</dt>
                <dd>
                  <a
                    href={business.phoneHref}
                    className="inline-flex min-h-11 items-center hover:text-white sm:min-h-0"
                  >
                    {business.phoneDisplay}
                  </a>
                  <br />
                  <a
                    href={`mailto:${business.email}`}
                    className="inline-flex min-h-11 items-center hover:text-white sm:min-h-0"
                  >
                    {business.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="mb-1 text-white/60">Hours</dt>
                {business.hours.map((h) => (
                  <dd key={h.days}>
                    {h.days}: {h.time}
                  </dd>
                ))}
              </div>
            </dl>
            <ContactButton
              variant="outline"
              className="mt-7 h-12 border-white/30 bg-transparent px-6 text-white hover:bg-white/10 hover:text-white"
            />
          </div>
        </div>
      </section>
    </>
  )
}
