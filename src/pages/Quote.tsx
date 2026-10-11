import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Check, CheckCircle2, Copy, Download, FileText, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { BasketItems } from '@/components/BasketItems'
import { ContactButton } from '@/components/ContactButton'
import { useBasket } from '@/context/BasketContext'
import { downloadSummary, emptyBrief, quoteSummary, type Brief } from '@/lib/quote'

const stepNames = ['Your brief', 'Contact details', 'Review request']
function localToday() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

export function Quote() {
  const { items } = useBasket()
  const [step, setStep] = useState(0)
  const [brief, setBrief] = useState<Brief>({ ...emptyBrief })
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
    if (step < 2) setStep(step + 1)
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
        <h1 ref={headingRef} tabIndex={-1} className="page-title outline-none">
          Your brief.
          <br />
          All together.
        </h1>
        <p className="mb-8 mt-6 max-w-xl text-base leading-7 text-muted-foreground">
          Your demo request is ready to copy or download.{' '}
          <strong className="font-medium text-foreground">
            Nothing has been sent to Linton Merch.
          </strong>{' '}
          In a live version, this is where the team would receive your enquiry.
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
            : 'Contact details are not saved in browser storage. The download, copy and WhatsApp options include the details you entered.'}
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
        <h1 className="page-title">
          Start with
          <br />a few good ideas.
        </h1>
        <div className="my-10 max-w-2xl rounded-lg border bg-white p-8 sm:p-12">
          <ShoppingBag size={30} className="mb-6 text-muted-foreground" />
          <h2 className="text-2xl font-medium tracking-tight">Your selection is empty.</h2>
          <p className="mb-7 mt-3 max-w-md text-sm leading-6 text-muted-foreground">
            Browse the catalogue and add the products you have in mind. You can set
            quantities, branding and delivery details here.
          </p>
          <Button asChild>
            <Link to="/catalogue">Explore catalogue</Link>
          </Button>
        </div>
        <ContactButton label="Prefer a conversation?" />
      </section>
    )

  return (
    <div className="container-wide pb-20 pt-12 lg:pt-16">
      <p className="eyebrow mb-4 text-muted-foreground">Request a quote</p>
      <h1 className="page-title">Tell us what you need.</h1>
      <p className="mb-10 mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
        A few details, one clear brief. This demo creates a local summary; no enquiry is sent.
      </p>
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_390px] lg:gap-14">
        <div>
          <ol aria-label="Quote steps" className="mb-9 grid grid-cols-3 border-b pb-6">
            {stepNames.map((name, index) => (
              <li
                key={name}
                aria-current={index === step ? 'step' : undefined}
                className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3"
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs ${index <= step ? 'bg-primary text-white' : 'border text-muted-foreground'}`}
                >
                  {index < step ? <Check size={14} /> : `0${index + 1}`}
                </span>
                <span
                  className={`text-xs sm:text-sm ${index === step ? 'font-medium' : 'text-muted-foreground'}`}
                >
                  {name}
                </span>
              </li>
            ))}
          </ol>
          <form onSubmit={submit}>
            <h2
              ref={headingRef}
              tabIndex={-1}
              className="mb-7 text-2xl font-medium tracking-tight outline-none"
            >
              {step === 0
                ? 'Tell us about your project.'
                : step === 1
                  ? 'Who is this for?'
                  : 'A final look at the details.'}
            </h2>
            {step === 0 && (
              <div className="space-y-6">
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
                  <p className="mt-2 text-xs text-muted-foreground">
                    Methods are examples. Suitability will need confirmation for each product.
                  </p>
                </div>
                <div>
                  <label className="field-label" htmlFor="deadline">
                    Target delivery date{' '}
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
                  <p className="mt-2 text-xs text-muted-foreground">
                    A target date, not a delivery promise.
                  </p>
                </div>
                <div>
                  <label className="field-label" htmlFor="notes">
                    Anything else we should know?{' '}
                    <span className="font-normal text-muted-foreground">(optional)</span>
                  </label>
                  <Textarea
                    id="notes"
                    className="min-h-32 bg-white"
                    maxLength={2000}
                    placeholder="Tell us about your event, budget range, logo placement or the look you’re after."
                    value={brief.notes}
                    onChange={(e) => change('notes', e.target.value)}
                  />
                </div>
                <div className="rounded-md border border-dashed bg-white p-5">
                  <label htmlFor="artwork" className="field-label flex items-center gap-2">
                    <FileText size={16} />
                    Logo or artwork{' '}
                    <span className="font-normal text-muted-foreground">(optional)</span>
                  </label>
                  <Input
                    id="artwork"
                    type="file"
                    accept=".pdf,.svg,.png,.jpg,.jpeg"
                    className="h-auto min-h-11 py-3 text-sm"
                    onChange={(e) => change('artworkName', e.target.files?.[0]?.name ?? '')}
                  />
                  <p className="mt-3 text-xs leading-5 text-muted-foreground">
                    Filename preview only. The file is not read, stored, uploaded or attached to the
                    request. Please use sample artwork for this demo.
                  </p>
                  {brief.artworkName && (
                    <p className="mt-2 break-all text-xs">Selected filename: {brief.artworkName}</p>
                  )}
                </div>
              </div>
            )}
            {step === 1 && (
              <div className="space-y-6">
                <div className="rounded-md bg-secondary p-4 text-sm leading-6">
                  Use invented details to test the demo. These fields stay in memory while you
                  complete this page and are only included in a summary you choose to copy or
                  download.
                </div>
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
                    className="bg-white"
                    placeholder="e.g. Johannesburg, Gauteng"
                    value={brief.location}
                    onChange={(e) => change('location', e.target.value)}
                  />
                </div>
                <p className="text-xs text-muted-foreground">* Required to build the demo brief.</p>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-6">
                <div className="rounded-md border bg-white p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <h3 className="font-medium">Project details</h3>
                    <button
                      type="button"
                      className="text-xs underline underline-offset-4"
                      onClick={() => setStep(0)}
                    >
                      Edit brief
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
                      onClick={() => setStep(1)}
                    >
                      Edit contact
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
                  <span>
                    I understand this is a demo. No enquiry will be sent, and these products are
                    not confirmed stock.
                  </span>
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
                  className="text-sm text-muted-foreground underline underline-offset-4"
                >
                  Keep browsing
                </Link>
              )}
              <Button type="submit" className="h-11">
                {step === 2 ? 'Create demo request' : 'Continue'}
              </Button>
            </div>
          </form>
        </div>
        <aside
          className="rounded-lg border bg-white p-5 sm:p-6 lg:sticky lg:top-6"
          aria-label="Quote selection"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium tracking-tight">Your selection</h2>
            <span className="rounded-full bg-secondary px-2 py-1 text-xs">
              {items.length} products
            </span>
          </div>
          <BasketItems preferences />
          <div className="border-t pt-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total units</span>
              <span>{units}</span>
            </div>
            <p className="mt-4 text-xs leading-5 text-muted-foreground">
              Quantities can be 1–10,000 in this demo. Minimum orders, prices and availability need
              confirmation.
            </p>
            <Link to="/catalogue" className="mt-4 inline-block border-b text-sm">
              Add more products
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}
