import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/ProductCard'
import { ContactButton } from '@/components/ContactButton'
import { products } from '@/data/products'
import { business } from '@/data/business'

const steps = [
  {
    n: '01',
    title: 'Choose',
    text: 'Browse the catalogue and add everything you are interested in.',
  },
  {
    n: '02',
    title: 'Describe',
    text: 'Set quantities, colours and sizes, and tell us how you would like it branded.',
  },
  {
    n: '03',
    title: 'Review',
    text: 'Check one clear request before you send it. In this demo, nothing is sent.',
  },
]

export function Home() {
  return (
    <>
      <section className="on-ink overflow-hidden bg-ink text-white">
        <div className="container-wide pb-14 pt-10 lg:pb-20 lg:pt-16">
          <p className="eyebrow mb-6 flex items-center gap-3 text-white/60">
            <span className="h-px w-8 bg-signal" />
            {business.town}, South Africa
          </p>
          <h1 className="display">
            Corporate clothing,
            <br />
            gifts &amp; uniforms.
          </h1>
          <div className="mt-10 grid items-end gap-10 lg:mt-10 lg:grid-cols-[1fr_minmax(0,460px)_1fr] lg:gap-12">
            <div className="order-2 lg:order-1">
              <p className="max-w-80 text-base leading-7 text-white/75">
                Choose the products you need, add your details and send one clear request for a
                quote.
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
            <figure className="order-1 mx-auto w-full max-w-[460px] lg:order-2">
              <div className="relative overflow-hidden rounded-md">
                <img
                  src="/merch-concept.png"
                  alt="Concept studio arrangement of an unbranded polo shirt, bottle, cap, notebook and pouch"
                  width={1536}
                  height={1024}
                  fetchPriority="high"
                  className="duotone aspect-[4/5] w-full object-cover object-[56%_center]"
                />
                <span className="absolute bottom-3 left-3 rounded-sm bg-ink/80 px-2 py-1 text-[11px] font-medium tracking-wider text-white">
                  CONCEPT IMAGE
                </span>
              </div>
            </figure>
            <ol className="order-3 hidden gap-0 lg:grid" aria-label="What we supply">
              {business.groups.map((group, i) => (
                <li key={group.title} className="border-t border-white/20 py-3 text-sm">
                  <Link
                    to={`/catalogue?category=${encodeURIComponent(group.category)}`}
                    className="flex items-baseline gap-4 text-white/85 hover:text-white"
                  >
                    <span className="text-xs text-white/50">0{i + 1}</span>
                    {group.title}
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="container-wide py-20 text-center lg:py-28">
        <p className="eyebrow mb-6 text-muted-foreground">How we work</p>
        <h2 className="mx-auto max-w-4xl text-[clamp(2.4rem,6vw,5.2rem)] font-bold uppercase leading-[0.98] tracking-[-0.045em]">
          Service is our actual business.
        </h2>
        <p className="mx-auto mt-8 max-w-xl text-base leading-7 text-muted-foreground">
          {business.manifesto}
        </p>
        <Link
          to="/about"
          className="mt-8 inline-flex items-center gap-2 border-b border-foreground pb-1 text-sm font-medium"
        >
          Our story <ArrowRight size={15} />
        </Link>
      </section>

      <section className="container-wide pb-20 lg:pb-28">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <h2 className="section-title">What we supply</h2>
          <Link to="/catalogue" className="border-b border-foreground pb-1 text-sm font-medium">
            View the full catalogue
          </Link>
        </div>
        <div className="border-b">
          {business.groups.map((group, i) => (
            <Link
              key={group.title}
              to={`/catalogue?category=${encodeURIComponent(group.category)}`}
              className="group grid items-center gap-x-8 gap-y-2 border-t px-1 py-6 transition-colors hover:bg-secondary sm:grid-cols-[3rem_1fr_1fr_2rem] sm:py-7"
            >
              <span className="eyebrow text-muted-foreground">0{i + 1}</span>
              <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">{group.title}</h3>
              <p className="text-sm leading-6 text-muted-foreground">{group.items}</p>
              <ArrowRight
                size={20}
                className="hidden justify-self-end sm:block"
                aria-hidden="true"
              />
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-secondary">
        <div className="container-wide py-16 lg:py-24">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="eyebrow mb-4 text-muted-foreground">Sample selection</p>
              <h2 className="section-title">A place to start.</h2>
            </div>
            <p className="max-w-72 text-sm leading-6 text-muted-foreground">
              Sample products to try the quote builder. Names, artwork and details are illustrative.
            </p>
          </div>
          <div className="product-grid gap-x-5 gap-y-10 lg:gap-7">
            {products
              .filter((product) => product.featured)
              .map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>
        </div>
      </section>

      <section className="container-wide py-20 lg:py-28">
        <h2 className="section-title mb-12 max-w-md">One request. Everything in it.</h2>
        <div className="grid gap-10 sm:grid-cols-3">
          {steps.map((step) => (
            <div key={step.n} className="border-t border-foreground pt-5">
              <span className="font-bold tracking-tight [font-family:var(--font-display)] text-5xl">
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
