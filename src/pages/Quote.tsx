import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Check, CheckCircle2, ChevronDown, Copy, Download, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { BasketItems } from '@/components/BasketItems'
import { ContactButton } from '@/components/ContactButton'
import { useBasket } from '@/context/BasketContext'
import { downloadSummary, emptyBrief, quoteSummary, recalledCompany, type Brief } from '@/lib/quote'

const stepNames = ['Details', 'Review']
function localToday() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

/** Optional extras, folded away. Opens by itself when it already holds something. */
function Extras({ open, children }: { open: boolean; children: React.ReactNode }) {
  const [initiallyOpen] = useState(open)
  return (
    <details className="group rounded-md border bg-white" open={initiallyOpen || undefined}>
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 text-sm font-medium [&::-webkit-details-marker]:hidden">
        Add a date, notes or artwork
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

export function Quote() {
  const { items } = useBasket()
  const [step, setStep] = useState(0)
  const [brief, setBrief] = useState<Brief>(() => ({ ...emptyBrief, company: recalledCompany() }))
  const [completedSummary, setCompletedSummary] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [copyFailed, setCopyFailed] = useState(false)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const firstStep = useRef(true)
  const units = items.reduce((sum, item) => sum + item.quantity, 0)
  function change(key: keyof Brief, value: string) {
    setBrief((current) => ({ ...current, [key]: value }))
  }
  useEffect(() => {
    if (!firstStep.current) headingRef.current?.focus()
    firstStep.current = false
  }, [step, completedSummary])
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!items.length) return
    if (step < 1) setStep(step + 1)
    else {
      setCompletedSummary(quoteSummary(items, brief))
      setCopied(false)
      setCopyFailed(false)
    }
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(completedSummary!)
      setCopied(true)
      setCopyFailed(false)
    } catch {
      setCopyFailed(true)
    }
  }
  if (completedSummary)
    return (
      <section className="container-wide max-w-4xl py-16 lg:py-22">
        <span className="mb-6 flex h-14 w-14 items-center justify-center rounded-sm bg-signal">
          <CheckCircle2 size={26} />
        </span>
        <p className="eyebrow mb-4 text-muted-foreground">Demo complete</p>
        <h1 ref={headingRef} tabIndex={-1} className="page-title">
          Your brief is ready.
        </h1>
        <p className="mb-8 mt-5 max-w-xl text-base leading-7">
          <strong className="font-medium">Nothing has been sent to Linton Merch.</strong>{' '}
          <span className="text-muted-foreground">
            This is a demo: copy, download or WhatsApp it.
          </span>
        </p>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => downloadSummary(completedSummary)}>
            <Download size={16} />
            Download summary
          </Button>
          <Button variant="outline" onClick={copy}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Summary copied' : 'Copy summary'}
          </Button>
          <ContactButton message={completedSummary} label="WhatsApp this brief" />
        </div>
        <p className="mt-4 text-sm text-muted-foreground" role="status">
          {copyFailed
            ? 'Copy is unavailable. You can select the text below or download the summary.'
            : 'Your contact details are not saved in this browser.'}
        </p>
        <label htmlFor="completed-summary" className="field-label mt-9">
          Request summary
        </label>
        <textarea
          id="completed-summary"
          readOnly
          value={completedSummary}
          className="field min-h-80 text-sm leading-6"
        />
        <div className="mt-6 flex flex-wrap gap-4">
          <Button
            variant="outline"
            onClick={() => {
              setCompletedSummary(null)
              setStep(0)
            }}
          >
            Edit this request
          </Button>
          <Button asChild variant="ghost">
            <Link to="/catalogue">Back to catalogue</Link>
          </Button>
        </div>
      </section>
    )

  if (!items.length)
    return (
      <section className="container-wide py-16 lg:py-22">
        <p className="eyebrow mb-4 text-muted-foreground">Request a quote</p>
        <h1 className="page-title">Your quote is empty.</h1>
        <p className="mt-4 text-base text-muted-foreground">
          Your selection is empty. Add products first.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild className="h-12 px-6">
            <Link to="/catalogue">Explore catalogue</Link>
          </Button>
          <ContactButton variant="outline" className="h-12 px-6" label="Or WhatsApp us" />
        </div>
      </section>
    )

  return (
    <div className="container-wide pb-20 pt-12 lg:pt-16">
      <p className="eyebrow mb-4 text-muted-foreground">Request a quote</p>
      <h1 className="page-title">Tell us what you need.</h1>
      <a
        href="#selection"
        className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm underline underline-offset-4 lg:hidden"
      >
        {items.length} {items.length === 1 ? 'product' : 'products'} · {units} units
      </a>
      <div className="mb-8 lg:mb-10" />
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_390px] lg:gap-14">
        <div>
          <ol aria-label="Quote steps" className="mb-8 flex gap-8 border-b pb-5">
            {stepNames.map((name, index) => (
              <li
                key={name}
                aria-current={index === step ? 'step' : undefined}
                className="flex items-center gap-3"
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs ${index <= step ? 'bg-primary text-white' : 'border text-muted-foreground'}`}
                >
                  {index < step ? <Check size={14} /> : `0${index + 1}`}
                </span>
                <span
                  className={`text-sm ${index === step ? 'font-medium' : 'text-muted-foreground'}`}
                >
                  {name}
                </span>
              </li>
            ))}
          </ol>
          <form onSubmit={submit}>
            <h2 ref={headingRef} tabIndex={-1} className="mb-7 text-2xl font-medium tracking-tight">
              {step === 0 ? 'Your details' : 'Check and create'}
            </h2>
            {step === 0 && (
              <div className="space-y-5">
                <p className="text-sm text-muted-foreground">
                  Demo: use made-up details. Nothing is sent.
                </p>
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
                      onChange={(e) => change('name', e.target.value)}
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
                      onChange={(e) => change('company', e.target.value)}
                    />
                  </div>
                </div>
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
                    placeholder="e.g. +27 …"
                    value={brief.phone}
                    onChange={(e) => change('phone', e.target.value)}
                  />
                </div>
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
                    onChange={(e) => change('location', e.target.value)}
                  />
                </div>
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
                    {[
                      'Please advise',
                      'Embroidery',
                      'Screen printing',
                      'Digital printing',
                      'Engraving',
                      'Debossing',
                      'Unbranded',
                      'A mix of methods',
                    ].map((method) => (
                      <option key={method}>{method}</option>
                    ))}
                  </select>
                </div>
                <Extras open={Boolean(brief.deadline || brief.notes || brief.artworkName)}>
                  <div>
                    <label className="field-label" htmlFor="deadline">
                      Target date
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
                  <div>
                    <label className="field-label" htmlFor="notes">
                      Notes
                    </label>
                    <Textarea
                      id="notes"
                      className="min-h-28 bg-white"
                      maxLength={2000}
                      placeholder="Event, logo placement, the look you’re after…"
                      value={brief.notes}
                      onChange={(e) => change('notes', e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="artwork" className="field-label flex items-center gap-2">
                      <FileText size={16} />
                      Logo or artwork
                    </label>
                    <Input
                      id="artwork"
                      type="file"
                      accept=".pdf,.svg,.png,.jpg,.jpeg"
                      className="h-auto min-h-11 py-3 text-sm"
                      onChange={(e) => change('artworkName', e.target.files?.[0]?.name ?? '')}
                    />
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                      Demo: only the filename is kept. Nothing is uploaded.
                    </p>
                    {brief.artworkName && (
                      <p className="mt-2 break-all text-xs">
                        Selected filename: {brief.artworkName}
                      </p>
                    )}
                  </div>
                </Extras>
              </div>
            )}
            {step === 1 && (
              <div className="space-y-6">
                <div className="rounded-md border bg-white p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <h3 className="font-medium">Project details</h3>
                    <button
                      type="button"
                      className="text-xs underline underline-offset-4"
                      onClick={() => setStep(0)}
                    >
                      Edit
                    </button>
                  </div>
                  <dl className="grid grid-cols-[100px_1fr] gap-x-5 gap-y-4 text-sm">
                    <dt className="text-muted-foreground">Branding</dt>
                    <dd>{brief.branding}</dd>
                    <dt className="text-muted-foreground">Target date</dt>
                    <dd>{brief.deadline || 'To be discussed'}</dd>
                    <dt className="text-muted-foreground">Artwork</dt>
                    <dd className="break-all">
                      {brief.artworkName || 'Not selected'}
                      <span className="block text-xs text-muted-foreground">
                        Filename only · not attached
                      </span>
                    </dd>
                    <dt className="text-muted-foreground">Notes</dt>
                    <dd className="whitespace-pre-wrap break-words">{brief.notes || 'None'}</dd>
                  </dl>
                </div>
                <div className="rounded-md border bg-white p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <h3 className="font-medium">Contact & delivery</h3>
                    <button
                      type="button"
                      className="text-xs underline underline-offset-4"
                      onClick={() => setStep(0)}
                    >
                      Edit
                    </button>
                  </div>
                  <p className="break-words text-sm leading-7">
                    {brief.name} · {brief.company}
                    <br />
                    {brief.email}
                    <br />
                    {brief.phone || 'Phone not provided'}
                    <br />
                    {brief.location}
                  </p>
                </div>
                <label className="flex items-start gap-3 text-sm leading-6">
                  <input
                    type="checkbox"
                    required
                    className="mt-1.5 h-4 w-4 shrink-0 accent-primary"
                  />
                  <span>I understand this is a demo and nothing is sent.</span>
                </label>
              </div>
            )}
            <div className="mt-9 flex items-center justify-between gap-4 border-t pt-6">
              {step > 0 ? (
                <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                  Back
                </Button>
              ) : (
                <Link
                  to="/catalogue"
                  className="inline-flex min-h-11 items-center text-sm text-muted-foreground underline underline-offset-4"
                >
                  Keep browsing
                </Link>
              )}
              <Button type="submit" className="h-12 px-6">
                {step === 1 ? 'Create demo request' : 'Continue'}
              </Button>
            </div>
          </form>
        </div>
        <aside
          id="selection"
          className="scroll-mt-24 rounded-lg border bg-white p-5 sm:p-6 lg:sticky lg:top-6"
          aria-label="Quote selection"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium tracking-tight">Your selection</h2>
            <span className="rounded-sm bg-secondary px-2 py-1 text-xs">
              {items.length} products
            </span>
          </div>
          <BasketItems preferences />
          <div className="border-t pt-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total units</span>
              <span>{units}</span>
            </div>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              Minimums and availability confirmed by Linton.
            </p>
            <Link
              to="/catalogue"
              className="mt-3 inline-flex min-h-11 items-center border-b text-sm"
            >
              Add more products
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}
