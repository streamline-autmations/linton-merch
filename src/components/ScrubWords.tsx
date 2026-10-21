import { useRef, type ElementType, type ReactNode } from 'react'
import { gsap, MOTION_OK, SplitText, useGSAP } from '@/lib/motion'

// Words brighten from faint to full ink as the reader scrolls through them. Text stays real,
// selectable and fully visible to screen readers and with reduced motion.
export function ScrubWords({
  as: Tag = 'p',
  className,
  children,
}: {
  as?: ElementType
  className?: string
  children: ReactNode
}) {
  const ref = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        if (!ref.current) return
        const split = SplitText.create(ref.current, { type: 'words', aria: 'auto' })
        gsap.fromTo(
          split.words,
          { opacity: 0.68 },
          {
            opacity: 1,
            ease: 'none',
            stagger: 0.1,
            scrollTrigger: {
              trigger: ref.current,
              start: 'top 82%',
              end: 'bottom 48%',
              scrub: 0.4,
            },
          },
        )
        return () => split.revert()
      })
      return () => mm.revert()
    },
    { scope: ref },
  )
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}
