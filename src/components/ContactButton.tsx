import { useState } from 'react'
import { MessageCircle, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { whatsappLink } from '@/lib/quote'

export function ContactButton({
  message = 'Hello Linton Merch, I would like to discuss corporate clothing or merchandise for my team.',
  className = '',
  label = 'WhatsApp us',
  variant = 'outline',
}: {
  message?: string
  className?: string
  label?: string
  variant?: 'outline' | 'default' | 'ghost'
}) {
  const [copied, setCopied] = useState(false)
  const [copyFailed, setCopyFailed] = useState(false)
  const link = whatsappLink(import.meta.env.VITE_WHATSAPP_NUMBER, message)
  async function copy() {
    try {
      await navigator.clipboard.writeText(message)
      setCopied(true)
      setCopyFailed(false)
    } catch {
      setCopyFailed(true)
    }
  }
  return (
    <Dialog
      onOpenChange={() => {
        setCopied(false)
        setCopyFailed(false)
      }}
    >
      <DialogTrigger asChild>
        <Button variant={variant} className={className}>
          <MessageCircle size={17} />
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {link ? 'Continue the conversation' : 'WhatsApp contact preview'}
          </DialogTitle>
          <DialogDescription>
            {link
              ? 'Check your message below. WhatsApp will open with this text ready for you to send.'
              : 'This demo is not connected to a WhatsApp number yet. Copy this message to try the contact flow. Nothing will be sent.'}
          </DialogDescription>
        </DialogHeader>
        <textarea
          className="field min-h-36 text-sm"
          aria-label="WhatsApp message preview"
          value={message}
          readOnly
        />
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={copy}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied' : 'Copy message'}
          </Button>
          {link && (
            <Button asChild>
              <a href={link} target="_blank" rel="noopener noreferrer">
                Continue to WhatsApp
              </a>
            </Button>
          )}
        </div>
        <p role="status" className="text-sm text-muted-foreground">
          {copyFailed
            ? 'Copy is unavailable in this browser. Select the message above and copy it manually.'
            : link
              ? 'Continuing opens WhatsApp with this full text in the link, including any contact details you entered. Nothing reaches Linton until you press Send in WhatsApp.'
              : 'Add a confirmed South African WhatsApp number to enable the real contact link.'}
        </p>
      </DialogContent>
    </Dialog>
  )
}
