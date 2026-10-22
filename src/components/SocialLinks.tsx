import { business } from '@/data/business'
import { cn } from '@/lib/utils'

// Line marks in the lucide style (lucide no longer ships brand icons). Only accounts Linton has.
const accounts = [
  {
    name: 'Facebook',
    href: business.social.facebook,
    icon: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  },
  {
    name: 'Instagram',
    href: business.social.instagram,
    icon: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <path d="M17.5 6.5h.01" />
      </>
    ),
  },
  {
    name: 'LinkedIn',
    href: business.social.linkedin,
    icon: (
      <>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </>
    ),
  },
]

/** Icon links to Linton's social accounts. Each opens in a new tab and says so. */
export function SocialLinks({ className }: { className?: string }) {
  return (
    <ul className={cn('flex gap-2', className)} aria-label="Linton on social media">
      {accounts.map((account) => (
        <li key={account.name}>
          <a
            href={account.href}
            target="_blank"
            rel="noreferrer"
            className="social-link flex size-11 items-center justify-center rounded-md"
          >
            <svg
              viewBox="0 0 24 24"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {account.icon}
            </svg>
            <span className="sr-only">{account.name} (opens in a new tab)</span>
          </a>
        </li>
      ))}
    </ul>
  )
}
