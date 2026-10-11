import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Check, Copy, MapPin, Phone, Mail, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ContactButton } from '@/components/ContactButton'
import { business } from '@/data/business'

function MessageForm() {
  const [draft, setDraft] = useState({ name: '', email: '', message: '' })
  const [summary, setSummary] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [copyFailed, setCopyFailed] = useState(false)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const mounted = useRef(false)
  useEffect(() => {
    if (mounted.current) (summary ? headingRef.current : nameRef.current)?.focus()
    mounted.current = true
  }, [summary])
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSummary(
      [
        'LINTON MERCH — DEMO MESSAGE (not sent)',
        `Name: ${draft.name}`,
        `Email: ${draft.email}`,
        '',
        draft.message,
      ].join('\n'),
    )
    setCopied(false)
    setCopyFailed(false)
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(summary!)
      setCopied(true)
      setCopyFailed(false)
    } catch {
      setCopyFailed(true)
    }
  }
  if (summary)
    return (
      <div className="rounded-md border bg-white p-6">
        <h3 ref={headingRef} tabIndex={-1} className="text-xl font-bold outline-none">
          Demo message ready.
        </h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          <strong className="font-medium text-foreground">Nothing has been sent.</strong> In a live
          version this would reach the Linton Merch team. For now you can copy it or use the contact
          details beside this form.
        </p>
        <label htmlFor="message-summary" className="field-label mt-5">
          Message text
        </label>
        <textarea
          id="message-summary"
          readOnly
          value={summary}
          className="field min-h-36 text-sm leading-6"
        />
        <div className="mt-4 flex flex-wrap gap-3">
          <Button variant="outline" onClick={copy}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied' : 'Copy message'}
          </Button>
          <Button variant="ghost" onClick={() => setSummary(null)}>
            Edit message
          </Button>
        </div>
        {copyFailed && (
          <p role="status" className="mt-3 text-sm text-muted-foreground">
            Copy is unavailable here. Select the text above and copy it manually.
          </p>
        )}
      </div>
    )
  return (
    <form onSubmit={submit} className="space-y-5 rounded-md border bg-white p-6">
      <div>
        <label htmlFor="msg-name" className="field-label">
          Your name
        </label>
        <Input
          ref={nameRef}
          id="msg-name"
          required
          autoComplete="name"
          value={draft.name}
          onChange={(e) => setDraft({ ...draft, name: e.target.value })}
        />
      </div>
      <div>
        <label htmlFor="msg-email" className="field-label">
          Email address
        </label>
        <Input
          id="msg-email"
          type="email"
          required
          autoComplete="email"
          value={draft.email}
          onChange={(e) => setDraft({ ...draft, email: e.target.value })}
        />
      </div>
      <div>
        <label htmlFor="msg-text" className="field-label">
          Message
        </label>
        <Textarea
          id="msg-text"
          required
          maxLength={1500}
          className="min-h-32"
          value={draft.message}
          onChange={(e) => setDraft({ ...draft, message: e.target.value })}
        />
      </div>
      <Button type="submit" className="h-11 px-6">
        Create demo message
      </Button>
      <p className="text-xs leading-5 text-muted-foreground">
        Demo only: this creates text you can copy. Nothing is sent or stored. Please use invented
        details.
      </p>
    </form>
  )
}

export function About() {
  return (
    <>
      <section className="on-ink bg-ink text-white">
        <div className="container-wide py-16 lg:py-24">
          <p className="eyebrow mb-6 text-white/60">About &amp; contact</p>
          <h1 className="display max-w-5xl">
            A dream before
            <br />
            it was a business.
          </h1>
        </div>
      </section>

      <section className="container-wide grid gap-12 py-16 lg:grid-cols-[1fr_1.1fr] lg:gap-20 lg:py-24">
        <figure className="lg:sticky lg:top-8 lg:self-start">
          <div className="overflow-hidden rounded-md bg-secondary">
            <img
              src="/story/linda-and-tony.webp"
              alt="Linda and Tony, the founders of Linton Enterprises, smiling together"
              width={900}
              height={654}
              className="aspect-[4/3.4] w-full object-cover object-[40%_center]"
            />
          </div>
          <figcaption className="mt-3 flex items-baseline justify-between gap-4 text-sm">
            <span>
              <span className="font-medium">Linda &amp; Tony</span>
              <span className="text-muted-foreground"> · the LIN and TON in Linton</span>
            </span>
            <span className="text-xs text-muted-foreground">Founders</span>
          </figcaption>
        </figure>
        <div>
          <h2 className="section-title">Linton Enterprises</h2>
          <p className="mt-3 text-sm text-muted-foreground">Trading as Linton Merch</p>
          <div className="mt-10 space-y-6 text-base leading-7">
            {business.story.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <blockquote className="mt-12 border-l-4 border-signal pl-5">
            <p className="eyebrow mb-3 text-muted-foreground">Our mission</p>
            <p className="text-2xl font-bold leading-snug tracking-tight [font-family:var(--font-display)]">
              {business.mission}
            </p>
          </blockquote>
        </div>
      </section>

      <section className="bg-secondary">
        <div className="container-wide py-16 lg:py-24">
          <h2 className="section-title mb-12">How it began</h2>
          <ol className="grid gap-10 sm:grid-cols-3">
            {business.milestones.map((m) => (
              <li key={m.year} className="border-t border-foreground pt-5">
                <span className="text-5xl font-bold tracking-tight [font-family:var(--font-display)]">
                  {m.year}
                </span>
                <p className="mt-6 text-sm leading-6 text-muted-foreground">{m.text}</p>
              </li>
            ))}
          </ol>
          <p className="mt-10 text-xs text-muted-foreground">
            Story adapted from the current Linton Enterprises website. To be confirmed with the
            client.
          </p>
        </div>
      </section>

      <section className="container-wide grid gap-14 py-16 lg:grid-cols-[1fr_1.1fr] lg:gap-20 lg:py-24">
        <div>
          <h2 className="section-title mb-10">Get in touch</h2>
          <dl className="space-y-7 text-base">
            <div>
              <dt className="eyebrow mb-2 flex items-center gap-3 text-muted-foreground">
                <MapPin size={18} aria-hidden="true" />
                Address
              </dt>
              <dd className="pl-[30px] leading-7">
                {business.addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.addressLines.join(', '))}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-block text-sm underline underline-offset-4"
                >
                  Open in Google Maps
                </a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow mb-2 flex items-center gap-3 text-muted-foreground">
                <Phone size={18} aria-hidden="true" />
                Phone
              </dt>
              <dd className="pl-[30px]">
                <a href={business.phoneHref} className="underline underline-offset-4">
                  {business.phoneDisplay}
                </a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow mb-2 flex items-center gap-3 text-muted-foreground">
                <Mail size={18} aria-hidden="true" />
                Email
              </dt>
              <dd className="pl-[30px]">
                <a href={`mailto:${business.email}`} className="underline underline-offset-4">
                  {business.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow mb-2 flex items-center gap-3 text-muted-foreground">
                <Clock size={18} aria-hidden="true" />
                Hours
              </dt>
              <dd className="pl-[30px] leading-7">
                {business.hours.map((h) => (
                  <span key={h.days} className="block">
                    {h.days}: {h.time}
                  </span>
                ))}
              </dd>
            </div>
          </dl>
          <p className="mt-8 pl-[30px] text-sm text-muted-foreground">
            Follow along on{' '}
            <a
              href={business.social.facebook}
              target="_blank"
              rel="noreferrer"
              className="text-foreground underline underline-offset-4"
            >
              Facebook
            </a>{' '}
            and{' '}
            <a
              href={business.social.instagram}
              target="_blank"
              rel="noreferrer"
              className="text-foreground underline underline-offset-4"
            >
              Instagram
            </a>
            .
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <ContactButton variant="default" label={`WhatsApp ${business.whatsappDisplay}`} />
            <Button asChild variant="outline">
              <Link to="/quote">Request a quote</Link>
            </Button>
          </div>
        </div>
        <div>
          <h2 className="mb-5 text-2xl font-bold tracking-tight">Send a message</h2>
          <MessageForm />
        </div>
      </section>
    </>
  )
}
