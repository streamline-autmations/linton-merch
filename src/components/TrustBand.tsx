import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { ResponsiveImage } from '@/components/ResponsiveImage'
import { RailProgress } from '@/components/ProductRail'
import { business, type Testimonial } from '@/data/business'

const milestoneLabels: Record<string, string> = {
  '1999': 'Started with golf shirts',
  '2001': 'Registered as a CC',
  '2018': 'Became a (Pty) Ltd',
}

/**
 * Trust: the client's own line, the one sourced rating (92% recommend on Facebook), the founders,
 * one short pull-quote, then the rest as compact cards. No per-review stars are shown: none are
 * sourced (see `Testimonial.stars`).
 */
export function TrustBand() {
  const [lead, ...quotes] = business.testimonials
  const rail = useRef<HTMLUListElement>(null)
  const rating = business.facebookRating.percent
  return (
    <section className="bg-white py-14 lg:py-24" aria-labelledby="trust-title">
      <div className="container-wide grid gap-x-16 gap-y-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="lg:col-start-1 lg:row-start-1">
          <span className="stitch mb-5 w-16 text-foreground/35" />
          <p className="eyebrow mb-3 text-muted-foreground">In their words</p>
          <h2 id="trust-title" className="section-title max-w-md">
            Service is our actual business.
          </h2>
        </div>

        {/* The sourced rating and the founders, side by side even on a phone. */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <a
            href={business.social.facebook}
            target="_blank"
            rel="noreferrer"
            className="on-ink group flex flex-col justify-between rounded-md bg-brand-blue p-4 text-white sm:p-6 lg:p-8"
          >
            <span>
              <span className="block text-[3.25rem] font-bold leading-none tracking-[-0.05em] [font-family:var(--font-display)] sm:text-7xl lg:text-8xl">
                {rating}%
              </span>
              <span className="mt-2 block text-sm leading-5 sm:text-base">
                recommend us on Facebook
              </span>
            </span>
            <span>
              <span
                className="trust-meter mt-4 block"
                style={{ '--meter': `${rating}%` } as CSSProperties}
                aria-hidden="true"
              />
              <span className="mt-3 flex items-center gap-1.5 text-xs text-white/85 group-hover:text-white sm:text-sm">
                Read the reviews <ArrowUpRight size={14} aria-hidden="true" />
                <span className="sr-only">(opens Facebook in a new tab)</span>
              </span>
            </span>
          </a>
          <figure className="relative overflow-hidden rounded-md bg-ink">
            <ResponsiveImage
              src="/story/linda-and-tony.webp"
              sizes="(min-width: 1376px) 340px, (min-width: 1024px) 26vw, 46vw"
              alt="Linda and Tony, the founders of Linton Enterprises"
              loading="lazy"
              className="aspect-[4/5] h-full w-full object-cover object-[35%_30%] sm:aspect-square"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent px-3 pb-3 pt-10 text-xs leading-5 text-white sm:px-5 sm:pb-4 sm:text-sm">
              Linda &amp; Tony, founders
            </figcaption>
          </figure>
          <dl className="col-span-2 mt-2 grid grid-cols-3 border-y text-left">
            {business.milestones.map((m) => (
              <div key={m.year} className="border-l px-3 py-3 first:border-l-0 first:pl-0 sm:px-5">
                <dt className="text-xl font-bold tracking-tight [font-family:var(--font-display)] sm:text-2xl">
                  {m.year}
                </dt>
                <dd className="mt-0.5 text-xs leading-4 text-muted-foreground">
                  {milestoneLabels[m.year] ?? m.text}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <figure className="lg:col-start-1 lg:row-start-2 lg:self-end">
          <blockquote className="max-w-xl text-[1.6rem] font-bold leading-[1.12] tracking-[-0.03em] [font-family:var(--font-display)] lg:text-[2.1rem]">
            “{lead.quote}”
          </blockquote>
          <figcaption className="mt-4 flex items-center gap-3 text-sm">
            <Initials name={lead.name} />
            <span>
              <span className="block font-medium">{lead.name}</span>
              <span className="block text-xs leading-5 text-muted-foreground">{lead.role}</span>
            </span>
          </figcaption>
          <Link
            to="/about"
            className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-medium underline underline-offset-4"
          >
            Meet Linda &amp; Tony <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </figure>
      </div>

      <ul
        ref={rail}
        className="rail rail-narrow rail-grid mt-10 lg:mt-14"
        tabIndex={0}
        aria-label="More client reviews"
      >
        {quotes.map((t) => (
          <QuoteCard key={t.name} testimonial={t} />
        ))}
      </ul>
      <div className="lg:hidden">
        <RailProgress rail={rail} dark={false} />
      </div>
    </section>
  )
}

function Initials({ name }: { name: string }) {
  const words = name.split(/\s+/).filter((w) => /^[A-Za-z]/.test(w))
  const letters = (words[0]?.[0] ?? '') + (words.length > 1 ? words.at(-1)![0] : '')
  return (
    <span
      className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-bold tracking-wide text-white"
      aria-hidden="true"
    >
      {letters.toUpperCase()}
    </span>
  )
}

/** A compact review: two lines, with "Read more" only when the quote is actually longer. */
function QuoteCard({ testimonial }: { testimonial: Testimonial }) {
  const id = useId()
  const text = useRef<HTMLQuoteElement>(null)
  const [open, setOpen] = useState(false)
  const [long, setLong] = useState(false)
  useEffect(() => {
    const el = text.current
    if (!el) return
    const check = () => {
      if (!open) setLong(el.scrollHeight > el.clientHeight + 1)
    }
    check()
    const ro = new ResizeObserver(check)
    ro.observe(el)
    return () => ro.disconnect()
  }, [open])
  return (
    <li className="relative flex flex-col rounded-md bg-cloud p-5">
      <blockquote
        id={id}
        ref={text}
        className={`text-base leading-7 ${open ? '' : 'line-clamp-2'}`}
      >
        “{testimonial.quote}”
      </blockquote>
      {(long || open) && (
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen(!open)}
          className="-ml-1 mt-1 inline-flex min-h-11 items-center self-start px-1 text-sm font-medium underline underline-offset-4"
        >
          {open ? 'Show less' : 'Read more'}
          <span className="sr-only"> from {testimonial.name}</span>
        </button>
      )}
      <div className="mt-auto flex items-center gap-3 pt-4 text-sm">
        <Initials name={testimonial.name} />
        <span className="min-w-0">
          <span className="block font-medium">{testimonial.name}</span>
          <span className="block text-xs leading-5 text-muted-foreground">{testimonial.role}</span>
        </span>
      </div>
    </li>
  )
}
