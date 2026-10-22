import type { ReactNode } from 'react'
import { ProductArtwork } from '@/components/ProductArtwork'
import { ResponsiveImage } from '@/components/ResponsiveImage'
import { business } from '@/data/business'
import { productById } from '@/data/products'
import { formatDate, totalUnits, type Brief, type QuoteItem, type QuoteMeta } from '@/lib/quote'

function Heading({
  children,
  onEdit,
  editLabel,
}: {
  children: ReactNode
  onEdit?: () => void
  editLabel?: string
}) {
  return (
    <div className="mb-3 flex h-8 items-end justify-between gap-4 border-b pb-2">
      <h3 className="eyebrow text-muted-foreground">{children}</h3>
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          aria-label={editLabel}
          className="-my-3 inline-flex min-h-11 items-center text-xs font-medium text-primary underline underline-offset-4"
        >
          Edit
        </button>
      )}
    </div>
  )
}

/**
 * The request laid out as a document: the same content and order as the PDF. Shown on the
 * review step (as a draft, with Edit links) and on the confirmation screen (with its reference).
 */
export function QuoteSheet({
  items,
  brief,
  meta,
  onEdit,
}: {
  items: QuoteItem[]
  brief: Brief
  meta: QuoteMeta | null
  onEdit?: () => void
}) {
  const details: [string, string][] = [
    ['Branding', brief.branding],
    ['Needed by', brief.deadline ? formatDate(brief.deadline) : 'Flexible'],
    ['Deliver to', brief.location.trim()],
    ['Artwork', brief.artworkName ? `${brief.artworkName} (sent separately)` : 'To follow'],
  ]
  if (brief.notes.trim()) details.push(['Notes', brief.notes.trim()])
  return (
    <article
      aria-label={meta ? `Quote request ${meta.reference}` : 'Quote request draft'}
      className="quote-sheet overflow-hidden rounded-md border bg-white"
    >
      <header className="relative bg-ink px-5 pb-9 pt-6 text-white sm:px-8">
        <div className="flex items-start justify-between gap-4">
          <span className="block shrink-0">
            <ResponsiveImage
              src="/brand/linton-logo-white.png"
              sizes="(min-width: 640px) 147px, 120px"
              alt="Linton Merch"
              width={2000}
              height={600}
              className="h-9 w-[120px] shrink-0 object-contain object-left sm:h-11 sm:w-[147px]"
            />
          </span>
          <div className="text-right">
            <p className="eyebrow text-white/70">Quote request</p>
            <p className="mt-1 font-display text-lg font-bold tracking-tight sm:text-xl">
              {meta?.reference ?? 'Draft'}
            </p>
            <p className="text-xs text-white/75">{formatDate(meta?.date ?? new Date())}</p>
          </div>
        </div>
        <span
          aria-hidden="true"
          className="sheet-thread absolute inset-x-5 bottom-4 sm:inset-x-8"
        />
      </header>

      <div className="space-y-8 px-5 py-7 sm:px-8 sm:py-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <section>
            <Heading onEdit={onEdit} editLabel="Edit your contact details">
              From
            </Heading>
            <p className="break-words text-sm leading-6">
              <strong className="font-bold">{brief.company.trim()}</strong>
              <br />
              {brief.name.trim()}
              <br />
              {brief.email.trim()}
              {brief.phone.trim() && (
                <>
                  <br />
                  {brief.phone.trim()}
                </>
              )}
            </p>
          </section>
          <section>
            <Heading>To</Heading>
            <p className="text-sm leading-6">
              <strong className="font-bold">{business.tradingName}</strong>
              <br />
              {business.email}
              <br />
              {business.phoneDisplay}
              <br />
              <span className="text-muted-foreground">{business.addressLines.join(', ')}</span>
            </p>
          </section>
        </div>

        {items.length > 0 && (
          <section>
            <Heading onEdit={onEdit} editLabel="Edit products and quantities">
              Products
            </Heading>
            <ul className="divide-y">
              {items.map((item) => {
                const product = productById.get(item.productId)
                if (!product) return null
                return (
                  <li key={item.productId} className="flex gap-4 py-4 first:pt-1">
                    <span className="h-14 w-14 shrink-0 overflow-hidden rounded-sm border bg-white">
                      <ProductArtwork product={product} sizes="56px" />
                    </span>
                    <div className="min-w-0 flex-1 break-words">
                      <p className="text-sm font-bold">{product.name}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {product.id} · {product.category}
                      </p>
                      {item.specification.trim() && (
                        <p className="mt-2 text-sm leading-6">{item.specification.trim()}</p>
                      )}
                    </div>
                    <p className="shrink-0 text-right">
                      <span className="block font-display text-lg font-bold leading-none">
                        {item.quantity}
                      </span>
                      <span className="text-xs text-muted-foreground">units</span>
                    </p>
                  </li>
                )
              })}
            </ul>
            <div className="flex items-baseline justify-between border-t pt-3 text-sm">
              <span className="text-muted-foreground">Total</span>
              <span className="font-bold">{totalUnits(items)} units</span>
            </div>
          </section>
        )}

        {brief.request.trim() && (
          <section>
            <Heading onEdit={onEdit} editLabel="Edit what you need">
              What we need
            </Heading>
            <p className="whitespace-pre-wrap break-words text-sm leading-6">
              {brief.request.trim()}
            </p>
          </section>
        )}

        <section>
          <Heading onEdit={onEdit} editLabel="Edit the project details">
            Details
          </Heading>
          <dl className="divide-y text-sm">
            {details.map(([key, value]) => (
              <div key={key} className="grid grid-cols-[6.5rem_1fr] gap-4 py-2.5">
                <dt className="text-muted-foreground">{key}</dt>
                <dd className="whitespace-pre-wrap break-words">{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </article>
  )
}
