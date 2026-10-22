import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Check,
  ChevronDown,
  Copy,
  Download,
  FileText,
  Loader2,
  Mail,
  MessageCircle,
  Share2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { BasketItems } from '@/components/BasketItems'
import { QuoteSheet } from '@/components/QuoteSheet'
import { useBasket } from '@/context/BasketContext'
import { business } from '@/data/business'
import {
  emailLink,
  emptyBrief,
  quoteReference,
  quoteSummary,
  recalledCompany,
  totalUnits,
  whatsappLink,
  type Brief,
  type QuoteItem,
  type QuoteMeta,
} from '@/lib/quote'
import { scrollToTop } from '@/lib/motion'
import { cn } from '@/lib/utils'

const stepNames = ['Your details', 'Review', 'Send']
const brandingMethods = [
  'Please advise',
  'Embroidery',
  'Screen printing',
  'Digital printing',
  'Engraving',
  'Debossing',
  'Unbranded',
  'A mix of methods',
]

/** Spaces alone don't count as an answer in a required field. */
function notBlank(event: { target: HTMLInputElement | HTMLTextAreaElement }) {
  const { value } = event.target
  event.target.setCustomValidity(value && !value.trim() ? 'Please fill in this field.' : '')
  return value
}

function localToday() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

function Steps({ current, dark = false }: { current: number; dark?: boolean }) {
  return (
    <ol aria-label="Quote steps" className="flex items-center gap-3 sm:gap-4">
      {stepNames.map((name, index) => (
        <li
          key={name}
          aria-current={index === current ? 'step' : undefined}
          className="flex items-center gap-3 sm:gap-4"
        >
          {index > 0 && (
            <span
              aria-hidden="true"
              className={cn(
                'step-thread w-6 sm:w-12',
                index <= current ? 'text-brand-teal' : dark ? 'text-white/30' : 'text-border',
              )}
            />
          )}
          <span className="flex items-center gap-2.5">
            <span
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium',
                index <= current
                  ? dark
                    ? 'bg-white text-ink'
                    : 'bg-ink text-white'
                  : 'border text-muted-foreground',
              )}
            >
              {index < current ? <Check size={14} aria-hidden="true" /> : `0${index + 1}`}
            </span>
            <span
              className={cn(
                'text-sm',
                index === current
                  ? 'font-medium'
                  : cn('hidden sm:inline', dark ? 'text-white/70' : 'text-muted-foreground'),
              )}
            >
              {name}
              {index < current && <span className="sr-only"> (done)</span>}
            </span>
          </span>
        </li>
      ))}
    </ol>
  )
}

function Group({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <fieldset className="border-t pt-6">
      <legend className="float-left mb-5 w-full">
        <span className="block text-lg font-bold tracking-tight">{title}</span>
        {hint && <span className="mt-1 block text-sm text-muted-foreground">{hint}</span>}
      </legend>
      <div className="clear-both space-y-5">{children}</div>
    </fieldset>
  )
}

/** Optional extras, folded away. Opens by itself when it already holds something. */
function Extras({ open, children }: { open: boolean; children: ReactNode }) {
  const [initiallyOpen] = useState(open)
  return (
    <details className="group rounded-md border bg-white" open={initiallyOpen || undefined}>
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 text-sm font-medium [&::-webkit-details-marker]:hidden">
        Add notes or artwork
        <span className="flex items-center gap-2 text-xs font-normal text-muted-foreground">
          Optional
          <ChevronDown
            size={16}
            className="transition-transform group-open:rotate-180"
            aria-hidden="true"
          />
        </span>
      </summary>
      <div className="space-y-5 border-t p-4">{children}</div>
    </details>
  )
}

/** The confirmation mark: a teal ring sews itself in, then the tick. */
function SewnCheck() {
  const mask = useId()
  return (
    <svg viewBox="0 0 64 64" className="h-16 w-16" aria-hidden="true">
      <defs>
        <mask id={mask}>
          <circle
            className="sewn-ring"
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="#fff"
            strokeWidth="4"
          />
        </mask>
      </defs>
      <circle
        cx="32"
        cy="32"
        r="28"
        fill="none"
        stroke="var(--brand-teal)"
        strokeWidth="1.6"
        strokeDasharray="5 3.5"
        mask={`url(#${mask})`}
      />
      <path
        className="sewn-tick"
        d="M21 33l7.5 7.5L43.5 25"
        fill="none"
        stroke="#fff"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

type PdfState = { blob: Blob; key: string } | null

function SendAction({
  icon,
  title,
  text,
  primary = false,
  disabled = false,
  ...props
}: {
  icon: ReactNode
  title: string
  text: string
  primary?: boolean
  disabled?: boolean
} & ({ href: string; onClick?: never } | { href?: never; onClick: () => void })) {
  const className = cn(
    'group flex w-full items-center gap-4 rounded-md border p-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 sm:p-5',
    primary
      ? 'border-primary bg-primary text-white hover:bg-primary/90'
      : 'bg-white hover:border-ink hover:bg-secondary',
  )
  const body = (
    <>
      <span
        className={cn(
          'flex h-11 w-11 shrink-0 items-center justify-center rounded-sm',
          primary ? 'bg-white/12' : 'bg-secondary',
        )}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-bold">{title}</span>
        <span
          className={cn(
            'mt-0.5 block text-sm leading-5',
            primary ? 'text-white/85' : 'text-muted-foreground',
          )}
        >
          {text}
        </span>
      </span>
      <ArrowRight
        size={18}
        aria-hidden="true"
        className="shrink-0 transition-transform group-hover:translate-x-0.5"
      />
    </>
  )
  return props.href ? (
    <a href={props.href} target="_blank" rel="noopener noreferrer" className={className}>
      {body}
    </a>
  ) : (
    <button
      type="button"
      onClick={props.onClick}
      disabled={disabled}
      className={cn(className, 'disabled:cursor-wait disabled:opacity-60')}
    >
      {body}
    </button>
  )
}

function Confirmation({
  items,
  brief,
  meta,
  onEdit,
  onRestart,
}: {
  items: QuoteItem[]
  brief: Brief
  meta: QuoteMeta
  onEdit: () => void
  onRestart: () => void
}) {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const summary = quoteSummary(items, brief, meta)
  const [pdf, setPdf] = useState<PdfState>(null)
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState('')
  const pdfName = `Linton-Merch-quote-request-${meta.reference}.pdf`
  const [canShare] = useState(() => {
    try {
      const probe = new File([''], pdfName, { type: 'application/pdf' })
      return typeof navigator.canShare === 'function' && navigator.canShare({ files: [probe] })
    } catch {
      return false
    }
  })

  useEffect(() => {
    scrollToTop()
    headingRef.current?.focus({ preventScroll: true })
  }, [])

  // Build the PDF in the background so Download and Share respond at once (sharing a file
  // needs to start straight from the tap).
  async function makePdf(): Promise<Blob | null> {
    if (pdf?.key === summary) return pdf.blob
    try {
      const { buildQuotePdf } = await import('@/lib/quote-pdf')
      const blob = await buildQuotePdf(items, brief, meta)
      setPdf({ blob, key: summary })
      return blob
    } catch {
      setStatus(
        'The PDF could not be created in this browser. Copy the text instead, or send it on WhatsApp or by email.',
      )
      return null
    }
  }
  useEffect(() => {
    void makePdf()
  }, [summary])

  async function download() {
    setBusy(true)
    const blob = await makePdf()
    setBusy(false)
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = pdfName
    document.body.append(link)
    link.click()
    link.remove()
    setTimeout(() => URL.revokeObjectURL(url), 4000)
    setStatus(`Downloaded ${pdfName}.`)
  }
  // Called straight from the tap with the ready PDF: sharing a file needs that tap.
  const pdfReady = pdf?.key === summary
  async function share() {
    if (!pdf || !pdfReady) return
    const blob = pdf.blob
    try {
      await navigator.share({
        files: [new File([blob], pdfName, { type: 'application/pdf' })],
        title: `Quote request ${meta.reference}`,
        text: `Quote request ${meta.reference} for ${business.tradingName}`,
      })
    } catch (error) {
      if ((error as Error).name !== 'AbortError')
        setStatus('Sharing is unavailable here. Download the PDF instead.')
    }
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(summary)
      setStatus('Request copied. Paste it into a message or email to Linton Merch.')
    } catch {
      setStatus(
        'Copy is unavailable in this browser. Download the PDF or use WhatsApp or email instead.',
      )
    }
  }

  const whatsapp = whatsappLink(business.whatsappNumber, summary)
  const email = emailLink(
    business.email,
    `Quote request ${meta.reference} · ${brief.company.trim()}`,
    `${summary}\n\n(The PDF copy of this request is attached.)`,
  )

  return (
    <div className="page-enter">
      <section className="bg-ink text-white">
        <div className="container-wide py-12 lg:py-16">
          <div className="mb-8">
            <Steps current={2} dark />
          </div>
          <SewnCheck />
          <p className="eyebrow mt-7 text-white/70">
            Request <span className="tabular-nums">{meta.reference}</span>
          </p>
          <h1 ref={headingRef} tabIndex={-1} className="page-title mt-3 max-w-3xl outline-none">
            Your quote request is ready to send.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/80">
            Thanks, {brief.name.trim().split(/\s+/)[0]}. One last step: send it to{' '}
            {business.tradingName} on WhatsApp or by email. We’ll confirm pricing, minimums and the
            best branding method for {brief.company.trim()}.
          </p>
        </div>
      </section>

      <section className="container-wide grid items-start gap-12 py-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16 lg:py-16">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Send it to us</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Your request reaches us when you press send in WhatsApp or your email app.
          </p>
          <div className="mt-6 space-y-3">
            {whatsapp && (
              <SendAction
                primary
                href={whatsapp}
                icon={<MessageCircle size={20} aria-hidden="true" />}
                title="Send on WhatsApp"
                text={`Opens a chat with ${business.whatsappDisplay}, your request already typed out.`}
              />
            )}
            <SendAction
              href={email}
              icon={<Mail size={20} aria-hidden="true" />}
              title="Send by email"
              text={`To ${business.email}. Attach the PDF and your logo before you send.`}
            />
            {canShare && (
              <SendAction
                onClick={share}
                disabled={!pdfReady}
                icon={
                  pdfReady ? (
                    <Share2 size={20} aria-hidden="true" />
                  ) : (
                    <Loader2 size={20} className="animate-spin" aria-hidden="true" />
                  )
                }
                title="Share the PDF"
                text={
                  pdfReady
                    ? 'Send the PDF itself on WhatsApp, email or any app on this phone.'
                    : 'Preparing your PDF…'
                }
              />
            )}
            <SendAction
              onClick={download}
              icon={
                busy ? (
                  <Loader2 size={20} className="animate-spin" aria-hidden="true" />
                ) : (
                  <Download size={20} aria-hidden="true" />
                )
              }
              title="Download PDF"
              text="A branded copy for your records, or to forward to your finance team."
            />
          </div>
          <button
            type="button"
            onClick={copy}
            className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm underline underline-offset-4"
          >
            <Copy size={15} aria-hidden="true" />
            Copy the request as text
          </button>
          <p role="status" className="min-h-6 text-sm text-muted-foreground">
            {status}
          </p>

          <h2 className="mt-10 text-lg font-bold tracking-tight">What happens next</h2>
          <ol className="mt-4 space-y-4">
            {[
              [
                'Send your request',
                'Pick WhatsApp or email above, and attach your logo if you have it.',
              ],
              [
                'We check the details',
                'Pricing, minimum quantities, stock, colours and the best branding method for each item.',
              ],
              [
                'You approve your quote',
                'You get a formal quote. Nothing goes into production until you say yes.',
              ],
            ].map(([title, text], index) => (
              <li key={title} className="grid grid-cols-[2rem_1fr] gap-3">
                <span className="font-display text-sm font-bold tabular-nums text-muted-foreground">
                  0{index + 1}
                </span>
                <span>
                  <span className="block font-medium">{title}</span>
                  <span className="mt-0.5 block text-sm leading-6 text-muted-foreground">
                    {text}
                  </span>
                </span>
              </li>
            ))}
          </ol>

          <div className="mt-10 border-t pt-6 text-sm leading-6">
            <p className="font-medium">Rather talk it through?</p>
            <p className="text-muted-foreground">
              Call{' '}
              <a href={business.phoneHref} className="text-foreground underline underline-offset-4">
                {business.phoneDisplay}
              </a>{' '}
              ·{' '}
              {business.hours
                .map((h) => `${h.days.replace(' – ', '–')} ${h.time.replace(' – ', '–')}`)
                .join(' · ')}
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="outline" onClick={onEdit}>
              Edit this request
            </Button>
            <Button variant="ghost" onClick={onRestart}>
              Start a new request
            </Button>
          </div>
        </div>

        <div className="lg:sticky lg:top-24">
          <QuoteSheet items={items} brief={brief} meta={meta} />
        </div>
      </section>
    </div>
  )
}

export function Quote() {
  const { items, clear } = useBasket()
  const [step, setStep] = useState(0)
  const [brief, setBrief] = useState<Brief>(() => ({ ...emptyBrief, company: recalledCompany() }))
  const [meta, setMeta] = useState<QuoteMeta | null>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const firstStep = useRef(true)
  const units = totalUnits(items)
  const hasItems = items.length > 0
  function change(key: keyof Brief, value: string) {
    setBrief((current) => ({ ...current, [key]: value }))
  }
  useEffect(() => {
    if (step === 2) return
    if (!firstStep.current) {
      scrollToTop()
      headingRef.current?.focus({ preventScroll: true })
    }
    firstStep.current = false
  }, [step])
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // Products or a description, never neither (e.g. every product removed after the details step).
    if (!hasItems && !brief.request.trim()) {
      setStep(0)
      return
    }
    if (step === 0) setStep(1)
    else {
      // One reference per request; editing and confirming again keeps it.
      setMeta((current) => current ?? { reference: quoteReference(), date: new Date() })
      setStep(2)
    }
  }
  function restart() {
    clear()
    setBrief({ ...emptyBrief, company: '' })
    setMeta(null)
    firstStep.current = true
    setStep(0)
    scrollToTop()
  }

  if (step === 2 && meta)
    return (
      <Confirmation
        items={items}
        brief={brief}
        meta={meta}
        onEdit={() => setStep(0)}
        onRestart={restart}
      />
    )

  const reviewing = step === 1
  return (
    <div className="container-wide pb-20 pt-12 lg:pt-16">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="eyebrow mb-4 text-muted-foreground">Request a quote</p>
          <h1 className="page-title">
            {reviewing ? 'Check your request.' : 'Tell us what you need.'}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
            {reviewing
              ? 'This is how your request will look. Nothing is shared until you send it.'
              : hasItems
                ? 'A few details and we’ll price your selection, minimums and branding included.'
                : 'Describe it in your own words. No need to pick products first.'}
          </p>
        </div>
        <Steps current={step} />
      </div>
      {hasItems && !reviewing && (
        <a
          href="#selection"
          className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm underline underline-offset-4 lg:hidden"
        >
          {items.length} {items.length === 1 ? 'product' : 'products'} · {units} units
        </a>
      )}
      <div className="mb-8 lg:mb-12" />

      {reviewing ? (
        <form onSubmit={submit} className="mx-auto max-w-3xl">
          <h2 ref={headingRef} tabIndex={-1} className="sr-only">
            Review your request
          </h2>
          <QuoteSheet items={items} brief={brief} meta={null} onEdit={() => setStep(0)} />
          <div className="mt-8 flex flex-col-reverse gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
            <Button type="button" variant="outline" onClick={() => setStep(0)}>
              Back to details
            </Button>
            <Button type="submit" className="h-12 px-6">
              Confirm request
              <ArrowRight size={16} aria-hidden="true" />
            </Button>
          </div>
        </form>
      ) : (
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_390px] lg:gap-14">
          <form onSubmit={submit}>
            <h2 ref={headingRef} tabIndex={-1} className="sr-only">
              {hasItems ? 'Your details' : 'Your request'}
            </h2>
            <div className="space-y-9">
              {!hasItems && (
                <div>
                  <label className="field-label" htmlFor="request">
                    What do you need? <span aria-hidden="true">*</span>
                  </label>
                  <Textarea
                    id="request"
                    required
                    maxLength={2000}
                    className="min-h-32 bg-white"
                    placeholder="e.g. 40 navy golf shirts with our logo on the chest, for a golf day in March"
                    value={brief.request}
                    onChange={(e) => {
                      // Spaces alone don't count as a description.
                      e.target.setCustomValidity(
                        e.target.value && !e.target.value.trim() ? 'Tell us what you need.' : '',
                      )
                      change('request', e.target.value)
                    }}
                  />
                </div>
              )}
              <Group title="About you" hint="So we know who the quote is for.">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="field-label" htmlFor="name">
                      Your name <span aria-hidden="true">*</span>
                    </label>
                    <Input
                      id="name"
                      required
                      maxLength={100}
                      autoComplete="name"
                      className="bg-white"
                      value={brief.name}
                      onChange={(e) => change('name', notBlank(e))}
                    />
                  </div>
                  <div>
                    <label className="field-label" htmlFor="company">
                      Company <span aria-hidden="true">*</span>
                    </label>
                    <Input
                      id="company"
                      required
                      maxLength={150}
                      autoComplete="organization"
                      className="bg-white"
                      value={brief.company}
                      onChange={(e) => change('company', notBlank(e))}
                    />
                  </div>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="field-label" htmlFor="email">
                      Email address <span aria-hidden="true">*</span>
                    </label>
                    <Input
                      id="email"
                      type="email"
                      required
                      maxLength={254}
                      autoComplete="email"
                      className="bg-white"
                      value={brief.email}
                      onChange={(e) => change('email', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="field-label" htmlFor="phone">
                      Phone / WhatsApp{' '}
                      <span className="font-normal text-muted-foreground">(optional)</span>
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      maxLength={30}
                      autoComplete="tel"
                      className="bg-white"
                      placeholder="e.g. 082 123 4567"
                      value={brief.phone}
                      onChange={(e) => change('phone', e.target.value)}
                    />
                  </div>
                </div>
              </Group>

              <Group
                title="Delivery & branding"
                hint="Not sure? Leave branding on “Please advise”."
              >
                <div>
                  <label className="field-label" htmlFor="location">
                    Delivery city & province <span aria-hidden="true">*</span>
                  </label>
                  <Input
                    id="location"
                    required
                    maxLength={150}
                    autoComplete="address-level2"
                    className="bg-white"
                    placeholder="e.g. Johannesburg, Gauteng"
                    value={brief.location}
                    onChange={(e) => change('location', notBlank(e))}
                  />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="field-label" htmlFor="branding">
                      Preferred branding
                    </label>
                    <select
                      id="branding"
                      className="field"
                      value={brief.branding}
                      onChange={(e) => change('branding', e.target.value)}
                    >
                      {brandingMethods.map((method) => (
                        <option key={method}>{method}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="field-label" htmlFor="deadline">
                      Needed by{' '}
                      <span className="font-normal text-muted-foreground">(optional)</span>
                    </label>
                    <Input
                      id="deadline"
                      type="date"
                      min={localToday()}
                      value={brief.deadline}
                      onChange={(e) => change('deadline', e.target.value)}
                      className="bg-white"
                    />
                  </div>
                </div>
                <Extras open={Boolean(brief.notes || brief.artworkName)}>
                  <div>
                    <label className="field-label" htmlFor="notes">
                      Notes
                    </label>
                    <Textarea
                      id="notes"
                      className="min-h-28 bg-white"
                      maxLength={2000}
                      placeholder="The event, where the logo goes, the look you’re after…"
                      value={brief.notes}
                      onChange={(e) => change('notes', e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="artwork" className="field-label flex items-center gap-2">
                      <FileText size={16} aria-hidden="true" />
                      Logo or artwork
                    </label>
                    <Input
                      id="artwork"
                      type="file"
                      accept=".pdf,.svg,.ai,.eps,.png,.jpg,.jpeg"
                      aria-describedby="artwork-help"
                      className="h-auto min-h-11 py-3 text-sm"
                      onChange={(e) => change('artworkName', e.target.files?.[0]?.name ?? '')}
                    />
                    {brief.artworkName && (
                      <p className="mt-2 flex flex-wrap items-center gap-x-3 text-sm">
                        <span className="break-all">
                          On your request:{' '}
                          <strong className="font-medium">{brief.artworkName}</strong>
                        </span>
                        <button
                          type="button"
                          className="inline-flex min-h-11 items-center text-xs underline underline-offset-4"
                          onClick={() => {
                            change('artworkName', '')
                            const input = document.getElementById(
                              'artwork',
                            ) as HTMLInputElement | null
                            if (input) input.value = ''
                          }}
                        >
                          Remove
                        </button>
                      </p>
                    )}
                    <p id="artwork-help" className="mt-2 text-xs leading-5 text-muted-foreground">
                      We note the file name on your request. Attach the file itself when you send it
                      on WhatsApp or by email.
                    </p>
                  </div>
                </Extras>
              </Group>
            </div>
            <div className="mt-10 flex items-center justify-between gap-4 border-t pt-6">
              <Link
                to="/catalogue"
                className="inline-flex min-h-11 items-center text-sm text-muted-foreground underline underline-offset-4"
              >
                Keep browsing
              </Link>
              <Button type="submit" className="h-12 px-6">
                Review request
                <ArrowRight size={16} aria-hidden="true" />
              </Button>
            </div>
          </form>
          <aside
            id="selection"
            className="scroll-mt-24 rounded-lg border bg-white p-5 sm:p-6 lg:sticky lg:top-24"
            aria-label="Quote selection"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold tracking-tight">Your selection</h2>
              {hasItems && (
                <span className="rounded-sm bg-secondary px-2 py-1 text-xs">
                  {items.length} {items.length === 1 ? 'product' : 'products'}
                </span>
              )}
            </div>
            {hasItems ? (
              <BasketItems preferences />
            ) : (
              <div className="py-5">
                <p className="text-sm leading-6 text-muted-foreground">
                  No products chosen yet. That’s fine: we’ll suggest options.
                </p>
                <Link
                  to="/catalogue"
                  className="mt-3 inline-flex min-h-11 items-center border-b text-sm"
                >
                  Browse the catalogue
                </Link>
              </div>
            )}
            {hasItems && (
              <div className="border-t pt-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total units</span>
                  <span className="font-bold">{units}</span>
                </div>
                <p className="mt-3 text-xs leading-5 text-muted-foreground">
                  Minimums, stock and pricing are confirmed on your quote.
                </p>
                <Link
                  to="/catalogue"
                  className="mt-3 inline-flex min-h-11 items-center border-b text-sm"
                >
                  Add more products
                </Link>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  )
}
