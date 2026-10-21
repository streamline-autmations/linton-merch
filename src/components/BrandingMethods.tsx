import type { ReactNode } from 'react'

// The methods Linton names on lintonent.co.za and its Facebook flyers. Branding is done in-house.
// Each has a drawn pictogram in the site's line-and-stitch language (dashes are thread).
const methods: { name: string; best: string; glyph: ReactNode }[] = [
  {
    name: 'Embroidery',
    best: 'Golf shirts, corporate shirts, jackets, caps',
    glyph: (
      <>
        <circle cx="30" cy="36" r="19" />
        <circle cx="30" cy="36" r="15" opacity="0.45" />
        <path d="M27 14v-5h6v5" />
        <path d="M19 40c4-8 8-8 11 0s7 8 11 0" strokeDasharray="3 2.6" />
        <path d="M44 22 58 8" />
        <path d="M56 6.5a2.2 2.2 0 0 1 3.5 3.5" />
      </>
    ),
  },
  {
    name: 'Screen printing',
    best: 'T-shirts, workwear backs, bags, umbrellas',
    glyph: (
      <>
        <rect x="7" y="26" width="50" height="30" rx="2" />
        <path d="M13 32h38v18H13z" opacity="0.45" strokeDasharray="2 2.5" />
        <path d="M20 41h24" strokeWidth="4" />
        <path d="M16 18h32l-3 6H19z" />
        <path d="M32 18V7" />
      </>
    ),
  },
  {
    name: 'Pad printing',
    best: 'Pens, mugs, flash drives, small gifts',
    glyph: (
      <>
        <path d="M32 5v11" />
        <path d="M18 31c0-9 6-15 14-15s14 6 14 15z" />
        <path d="M26 36v4M32 36v5M38 36v4" strokeDasharray="1.5 2" />
        <rect x="8" y="46" width="48" height="9" rx="4.5" />
        <path d="M50 46v9" />
      </>
    ),
  },
  {
    name: 'Engraving',
    best: 'Steel bottles, knives, card holders, bamboo',
    glyph: (
      <>
        <path d="M27 6h10v8l4 5v35a4 4 0 0 1-4 4H27a4 4 0 0 1-4-4V19l4-5z" />
        <path d="M58 6 36 36" strokeDasharray="3 2.5" />
        <path d="M27 36h9M27 42h12M27 48h7" />
        <path d="M40 32l3-2M40 37l4 1" />
      </>
    ),
  },
  {
    name: 'Embossing',
    best: 'Journals, folders, leather-look goods',
    glyph: (
      <>
        <rect x="12" y="6" width="40" height="52" rx="2" />
        <path d="M18 6v52" opacity="0.45" />
        <path d="M25 22h20v16H25z" />
        <path d="M28 25h20v16" opacity="0.45" />
        <path d="M25 47h20" strokeDasharray="3 2.5" />
      </>
    ),
  },
  {
    name: 'Sublimation & digital',
    best: 'Mugs, event tees, banners, full-colour art',
    glyph: (
      <>
        <circle cx="24" cy="25" r="13" />
        <circle cx="40" cy="25" r="13" />
        <circle cx="32" cy="39" r="13" />
        <path d="M10 58h44" strokeDasharray="3 2.5" />
      </>
    ),
  },
]

/** "Ways to brand": a teal band, one drawn mark per method with what it suits best. */
export function BrandingMethods() {
  return (
    <section className="bg-brand-teal text-ink" aria-labelledby="methods-title">
      <div className="container-wide grid gap-8 py-14 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20 lg:py-24">
        <div>
          <span className="stitch mb-6 w-16 text-ink" />
          <p className="eyebrow mb-4">Ways to brand</p>
          <h2 id="methods-title" className="section-title max-w-sm">
            The right mark for the material.
          </h2>
          <p className="mt-4 max-w-sm text-base leading-7">
            All done in-house. Not sure? We’ll advise.
          </p>
        </div>
        <ul className="methods-grid grid grid-cols-2 border-t sm:grid-cols-3">
          {methods.map((method) => (
            <li key={method.name} className="method-cell border-b py-5 pr-3 sm:py-7 sm:pr-6">
              <svg
                viewBox="0 0 64 64"
                className="mb-4 size-14 sm:size-16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {method.glyph}
              </svg>
              <h3 className="text-base font-bold leading-tight tracking-tight sm:text-xl">
                {method.name}
              </h3>
              <p className="mt-1.5 text-[0.8125rem] leading-5">{method.best}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
